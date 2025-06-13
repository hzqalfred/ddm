/**
 * comUtils.js - 套件公共事件工具
 * grid加载、grid删除、grid新增、grid保存
 * form加载、form删除、form新增、form保存
 * tree加载
 */

export function comUtils(CT) {
  /**
   * 转换排序项为请求所需格式
   * @param {Array} sortItems - 排序项数组
   * @returns {Array} - 转换后的排序项数组
   */
  const transformSortItems = (sortItems = []) =>
    [...sortItems]
      .filter(({ isSort }) => isSort === true)
      .sort((a, b) => a.sortPriority - b.sortPriority)
      .map(({ sortColumn, sortType }) => ({
        sortColumn,
        asc: sortType === "asc",
      }));

  /**
   * 获取基础信息
   * @returns {object} - 基础信息对象
   */

  function getBI() {
    const FMC = CT.formConfig.moduleCode; // module code
    const FMN = CT.formConfig.moduleName; // module name
    const FFC = CT.formConfig.modelCode; // function code

    const CC = CT; // current component
    const AC = CT.refList; // all components

    return { FMC, FMN, FFC, CC, AC };
  }

  /**
   * 获取基础方法信息
   * @returns {object} - 基础方法信息对象
   */
  function getBIM() {
    const execRequest = CT.execRequest; // executive request
    const Message = CT.Message; // message prompt

    return { execRequest, Message };
  }

  /**
   * 获取表单数据
   * @param {object} selRow - 选中行数据
   * @param {object} refList - 表单引用列表
   * @returns {object} - 表单数据对象
   */
  function getFormData(selRow, refList, isAdd) {
    var row = selRow;
    var newRow = { ...row };
    var formdata =
      refList["v_form_ref"] && !isAdd
        ? refList["v_form_ref"].formDataModel
        : {};
    Object.keys(row).forEach((key) => {
      if (refList[key] && typeof refList[key].getValue === "function") {
        newRow[key] = refList[key].getValue();
      }
    });
    return Object.assign(formdata, newRow);
  }

  /**
   * 动态设置表单数据（支持新增和编辑模式）
   * @param {Object} selRow - 数据源对象
   * @param {Object} refList - 表单引用对象
   * @param {boolean} isAdd - 是否新增模式（true: 清空表单；false: 填充数据）
   * @param {string[]} ignoreKeys - 需要忽略的字段（如 _X_ROW_KEY）
   */
  function setFormData({ selRow, refList, isAdd, signName, ignoreKeys = [] }) {
    signName && !isAdd && refList && refList["v_form_ref"].setFormData(selRow);
    Object.keys(selRow).forEach((key) => {
      // 跳过忽略的字段或表单不存在的字段
      if (ignoreKeys.includes(key) || refList[key] === undefined) return;

      // 根据模式设置值：新增清空，编辑填充数据
      refList[key].setValue(isAdd ? "" : selRow[key]);
    });
    // 清空新增模式下的表单数据
    setTimeout(() => {
      if (isAdd) {
        for (var key in refList[signName].selRow) {
          if (key == "_X_ROW_KEY") continue;
          if (typeof refList[signName].selRow[key] === "number") {
            refList[signName].selRow[key] = 0;
          } else if (typeof refList[signName].selRow[key] === "string") {
            refList[signName].selRow[key] = "";
          } else {
            refList[signName].selRow[key] = null;
          }
        }
      }
    }, 1);
  }

  /**
   * 加载表格数据
   * @param {string} signName - 表格控件编号
   * @param {object} queryScheme - 查询条件对象
   * @param {object} treeNode - 树节点对象
   */
  function loadGridData({ service, signName, queryScheme, treeNode }) {
    const BI = getBI();
    const BIM = getBIM();
    const moduleName = BI.FMN;
    const moduleCode = BI.FMC;
    const functionCode = BI.FFC;
    const { pageSize, currentPage: pageNum = 1, field } = BI.AC[signName];
    const requestParams = {
      moduleName,
      moduleCode,
      pageSize,
      pageNum: BI.CC.field.type === "tree" ? 1 : pageNum,
      ...(BI.CC.field.type === "query" && { searchItems: queryScheme }),
      ...(BI.CC.field.type === "tree" && { treeNode: treeNode }),
      sortItems: transformSortItems(field.options?.sortBy),
    };
    BIM.execRequest(`${service || functionCode + ".query"}`, requestParams)
      .then(({ data: { rows = [], total = 0 } = {} }) => {
        BI.AC[signName].setData(rows, total);
        BIM.Message.notifySuccess("查询成功！");
      })
      .catch((error) => {
        BIM.Message.notifyError("查询失败！");
      });
  }

  /**
   * 删除表格数据
   * @param {string} signName - 表格控件编号
   */
  function deleteGridData({ service, signName }) {
    const BI = getBI();
    const BIM = getBIM();
    const moduleName = BI.FMN;
    const moduleCode = BI.FMC;
    const functionCode = BI.FFC;
    const {
      field,
      $refs: { [signName]: $table },
    } = BI.AC[signName];
    if ($table.getInsertRecords().length)
      return BIM.Message.notifyError("有未保存的新增数据！");
    if ($table.getUpdateRecords().length)
      return BIM.Message.notifyError("有未保存的修改数据！");
    const selType = field.options.isSelectType;
    const selectedData =
      selType === "checkbox"
        ? $table.getCheckboxRecords()
        : $table.getRadioRecord();
    if (
      !selectedData ||
      (Array.isArray(selectedData) && selectedData.length === 0)
    ) {
      return BIM.Message.notifyError("请选择要删除的数据！");
    }
    const performDelete = async (data) => {
      const dataArray = Array.isArray(data) ? data : [data];
      return await BIM.execRequest(`${service || functionCode + ".delete"}`, {
        moduleName,
        moduleCode,
        data: dataArray,
      });
    };
    const executeDeleteFlow = async () => {
      try {
        const delRes = await performDelete(selectedData);
        if (!delRes.success) {
          return BIM.Message.notifyError("删除失败，请稍后重试！");
        }
        BI.CC.comUtils.loadGridData({ signName });
        BIM.Message.notifySuccess("删除成功！");
      } catch (error) {
        BIM.Message.notifyError("删除失败，请稍后重试！");
      }
    };
    window.VxeUI.modal.confirm({
      title: "确认删除提示",
      content: "是否删除当前选择数据？",
      draggable: false,
      escClosable: true,
      confirmButtonText: "确认删除",
      onConfirm: executeDeleteFlow,
    });
  }

  /**
   * 新增表格数据
   * @param {string} signName - 表格控件编号
   */
  function addGridData({ signName }) {
    const BI = getBI();
    const BIM = getBIM();
    const tableList = BI.AC[signName];
    const $table = tableList?.$refs[signName];
    const record = tableList.field.options.columns.reduce((acc, column) => {
      if (column.defaultValue !== undefined) {
        acc[column.field] = column.defaultValue;
      }
      return acc;
    }, {});
    $table
      .insert(record)
      .then((res) => $table.setEditRow(res.row))
      .catch((error) => {
        BIM.Message.notifyError("新增记录失败！");
      });
  }

  /**
   * 保存表格数据
   * @param {string} signName - 表格控件编号
   */
  function saveGridData({ signName, service }) {
    const BI = getBI();
    const BIM = getBIM();
    const moduleName = BI.FMN;
    const moduleCode = BI.FMC;
    const functionCode = BI.FFC;
    const { $refs } = BI.AC[signName];
    const $table = $refs[signName];
    const [insertRecords, updateRecords] = [
      $table.getInsertRecords(),
      $table.getUpdateRecords(),
    ];
    if (!insertRecords.length && !updateRecords.length) {
      return BIM.Message.notifyInfo("没有需要保存的数据！");
    }
    const handleRequest = async (type, records) => {
      try {
        const errMap = await $table.validate();
        if (errMap) {
          return BIM.Message.notifyError(`校验不通过！`);
        }
        await BIM.execRequest(`${service || functionCode + ".save"}`, {
          moduleName,
          moduleCode,
          data: records,
        });
        BI.CC.comUtils.loadGridData({ signName });
        BIM.Message.notifySuccess(
          `${type === "insert" ? "新增" : "修改"}成功！`
        );
      } catch (error) {
        BIM.Message.notifyError(`${type === "insert" ? "新增" : "修改"}失败！`);
      }
    };
    if (insertRecords.length) handleRequest("insert", insertRecords);
    if (updateRecords.length) handleRequest("update", updateRecords);
  }

  /**
   * 加载表单数据
   * @param {string} signName - 表单控件编号
   * @param {string} key - 主键字段
   *
   * 注意：暂时针对侧滑抽屉，后续更改"searchValue": [BI.AC[signName].selRow[key]],参数调整
   */
  function loadFormData({ service, signName, key }) {
    const BI = getBI();
    const BIM = getBIM();
    const moduleName = BI.FMN;
    const moduleCode = BI.FMC;
    const functionCode = BI.FFC;

    const requestParams = key
      ? {
          moduleName,
          moduleCode,
          searchItems: [
            {
              searchColumn: key,
              searchValue: [BI.AC[signName].selRow[key]],
              operator: "in",
            },
          ],
        }
      : { moduleName, moduleCode };
    BIM.execRequest(`${service || functionCode + ".query"}`, requestParams)
      .then((res) => {
        var data = res.data.rows[0];
        if (BI.AC) {
          BI.CC.comUtils.setFormData({
            selRow: data,
            refList: BI.AC,
            isAdd: false,
            signName,
          });
        } else {
          BI.CC.setFormData({ selRow: data });
          BI.CC.setFormData({ data });
        }
        BIM.Message.notifySuccess("查询成功！");
      })
      .catch((error) => {
        BIM.Message.notifyError("查询失败！");
      });
  }

  /**
   * 删除表单数据
   * @param {string} signName - 表单控件编号
   * @param {string} gridName - 表格控件编号
   *
   * 注意：暂时针对侧滑抽屉，后续更改drawer.drawerVisible = false;关闭窗口调整
   */
  function deleteFormData({ service, signName, gridName }) {
    const BI = getBI();
    const BIM = getBIM();
    const moduleName = BI.FMN;
    const moduleCode = BI.FMC;
    const functionCode = BI.FFC;

    var drawer = BI.AC[signName];
    var row = drawer.selRow || drawer.formModel;
    var data = BI.CC.comUtils.getFormData(row, BI.AC);

    const performDelete = async (data) => {
      const dataArray = Array.isArray(data) ? data : [data];
      return await BIM.execRequest(`${service || functionCode + ".delete"}`, {
        moduleName,
        moduleCode,
        data: dataArray,
      });
    };
    const executeDeleteFlow = async () => {
      try {
        const delRes = await performDelete(data);
        if (!delRes.success) {
          return BIM.Message.notifyError("删除失败，请稍后重试！");
        }
        drawer.drawerVisible = false; // 关闭窗口
        gridName && BI.CC.comUtils.loadGridData({ signName: gridName }); // 刷新表格数据
        BIM.Message.notifySuccess("删除成功！");
      } catch (error) {
        BIM.Message.notifyError("删除失败，请稍后重试！");
      }
    };
    window.VxeUI.modal.confirm({
      title: "确认删除提示",
      content: "是否删除当前数据？",
      draggable: false,
      escClosable: true,
      confirmButtonText: "确认删除",
      onConfirm: executeDeleteFlow,
    });
  }

  /**
   * 新增表单数据
   * @param {string} signName - 表单控件编号
   */
  function addFormData({ signName }) {
    const BI = getBI();
    var row = BI.AC[signName].selRow;
    BI.CC.comUtils.setFormData({
      selRow: row,
      refList: BI.AC,
      isAdd: true,
      signName: signName,
    });
  }

  /**
   * 保存表单数据
   * @param {string} signName - 表单控件编号
   * @param {boolean} isRC - 保存后是否关闭表单
   * @param {string} gridName - 表格控件编号
   *
   * 注意：暂时针对侧滑抽屉，后续更改drawer.drawerVisible = false;关闭窗口调整
   */
  function saveFormData({ service, signName, isRC, gridName, isAdd }) {
    const BI = getBI();
    const BIM = getBIM();
    const moduleName = BI.FMN;
    const moduleCode = BI.FMC;
    const functionCode = BI.FFC;
    var drawer = BI.AC[signName];
    var row = drawer.selRow || drawer.formModel;
    var data = BI.CC.comUtils.getFormData(row, BI.AC, isAdd);

    BIM.execRequest(`${service || functionCode + ".save"}`, {
      moduleName,
      moduleCode,
      data: [data],
    })
      .then((res) => {
        if (gridName) {
          BI.CC.comUtils.loadGridData({ signName: gridName });
        }
        if (isRC) {
          drawer.drawerVisible = false;
        }
        BIM.Message.notifySuccess("保存成功！");
      })
      .catch((error) => {
        BIM.Message.notifyError("保存失败！");
      });
  }

  /**
   * 加载树数据
   * @param {string} functionCode - 功能代码
   * @param {string} signName - 树控件编号
   */
  function loadTreeData({ service, signName }) {
    const BI = getBI();
    const BIM = getBIM();
    const moduleName = BI.FMN;
    const moduleCode = BI.FMC;
    BIM.execRequest(`${service}`, { moduleName, moduleCode })
      .then(({ data }) => {
        const treeData = data?.rows || [];
        const treeComponent = BI.AC[signName];
        const treeRef = treeComponent.$refs.treeRef;
        if (treeRef?.getCurrentNodeId()) {
          treeRef.clearCurrentNode();
        }
        treeComponent.dataSource = treeData; // 原始数据
        treeComponent.treeData = treeData; // 变动数据
        BIM.Message.notifySuccess("树加载成功！");
        setTimeout(() => {
          const { expandtype } = treeComponent.field.options;
          treeRef.setAllExpandNode(!!expandtype);
        }, 1);
      })
      .catch((error) => {
        BIM.Message.notifyError("树加载失败，请重试！");
      });
  }

  return {
    getBI, // 获取基础信息方法 ✅
    getBIM, // 获取方法信息方法 ✅
    getFormData, // 获取表单数据方法 ✅
    setFormData, // 设置表单数据方法 ✅

    loadGridData, // 加载表格数据方法 ✅
    deleteGridData, // 删除表格数据方法 ✅
    addGridData, // 新增表格数据方法 ✅
    saveGridData, // 保存表格数据方法 ✅

    loadFormData, // 加载表单数据方法 ✅
    deleteFormData, // 删除表单数据方法 ✅
    addFormData, // 新增表单数据方法 ✅
    saveFormData, // 保存表单数据方法 ✅

    loadTreeData, // 加载树数据方法 ✅
  };
}

export default comUtils();
