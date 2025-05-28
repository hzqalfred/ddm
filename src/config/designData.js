let module = "";

function generateGridColumn(id, widgetList = [], span = 1) {
  return {
    type: "grid-col",
    category: "container",
    icon: "grid-col",
    internal: true,
    widgetList: widgetList,
    options: {
      name: `gridCol${id}`,
      hidden: false,
      span: span,
      offset: 0,
      push: 0,
      pull: 0,
      responsive: false,
      md: 12,
      sm: 12,
      xs: 12,
      customClass: "",
    },
    id: `grid-col-${id}`,
  };
}

function generateButton(methodCode, label, saveMethod = "") {
  // 检查按钮类型
  const isQueryButton =
    methodCode.toLowerCase().includes("query") || label === "查询";
  const isSaveButton =
    methodCode.toLowerCase().includes("save") || label === "保存";
  const isDeleteButton =
    methodCode.toLowerCase().includes("delete") || label === "删除";
  const isUpdateButton =
    methodCode.toLowerCase().includes("update") || label === "更新";
  const isAddRowButton =
    methodCode.toLowerCase().includes("addrow") || label === "新增";

  // 定义查询按钮点击事件
  const queryOnClick = `
  let {param} = this.getGlobalDsv()
  
  let pageSize = 10
  let currentPage = 1
  if(this.refList?.eltable){
    pageSize = this.refList?.eltable?.pageSize
    currentPage = this.refList?.eltable?.currentPage
  }
  this.request.postData('event/preview/exec/'+this.field.service,{moduleCode:param.moduleCode,moduleName:param.moduleName,pageSize,currentPage}).then(res=>{
    this.dataCenter.setData({eltable:res.data.rows})
  })`;

  // 定义新增按钮点击事件
  const addRowOnClick = `// 获取表格引用
 
  let {param} = this.getGlobalDsv();
// 创建一个函数处理表单提交
  const handleFormSubmit = (formData) => {
    
    
    // 简单验证
    if (!formData) return;
    delete formData.eltable
    // 调用新增接口
    this.request.postData('event/preview/exec/'+this.field.service, {
      moduleCode: param.moduleCode,
      moduleName: param.moduleName,
      data: [formData]
    }).then(res => {
      
      if (res.code === 200 || res.success) {
        this.$message.success('新增成功');
        
        // 使用全局函数刷新表格数据
        globalFunctions_${module}.refreshTableData.call(this);
      } else {
        this.$message.error(res.message || '新增失败');
      }
    }).catch(err => {
      
      this.$message.error('新增请求失败');
    });
  };
  // 使用DataCenter的事件机制监听表单提交
  const unsubscribe = this.dataCenter.subscribe('dialog-form-save', handleFormSubmit);
  // 打开对话框，显示表单
  const dialog = this.refList.dataDialog.$refs.fieldEditor
  if (dialog) {
    dialog.open();
    
    this.$nextTick(() => {
        this.emitEvent('dialog-open', {})
    });
  } else {
    this.$message.error('系统错误：找不到表单对话框');
    unsubscribe(); // 清理订阅
  }
  `;

  // 定义新增/保存按钮点击事件 - 使用全局刷新函数
  const saveOnClick = `// 获取表格数据
  
  // 获取全局参数
  let {param} = this.getGlobalDsv();
  
  // 获取表格引用
  const tableRef = this.refList.eltable.$refs.eltable;
  if (!tableRef) {
    this.$message.error('找不到表格组件');
    return;
  }

  const selectedRows = tableRef.getCheckboxRecords()
  if (!selectedRows || selectedRows.length === 0) {
    this.$message.warning('请先选择要保存的数据');
    return;
  } 
  // 调用保存接口
  this.request.postData('event/preview/exec/'+this.field.service, {
    moduleCode: param.moduleCode,
    moduleName: param.moduleName,
    data: selectedRows
  }).then(res => {
    
    if (res.code === 200 || res.success) {
      this.$message.success('保存成功');
      
      // 使用全局函数刷新表格数据
      globalFunctions_${module}.refreshTableData.call(this);
    } else {
      this.$message.error(res.message || '保存失败');
    }
  }).catch(err => {
    
    this.$message.error('保存请求失败');
  });
 `;

  // 定义删除按钮点击事件 - 使用全局刷新函数
  const deleteOnClick = `// 获取选中的行数据
  
  const selectedRows = this.refList.eltable.$refs.eltable.getCheckboxRecords()
  if (!selectedRows || selectedRows.length === 0) {
    this.$message.warning('请先选择要删除的数据');
    return;
  }
  
  // 获取全局参数
  let {param} = this.getGlobalDsv();
  
  // 确认删除
  this.$confirm('确定要删除选中的数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 调用删除接口
    this.request.postData('event/preview/exec/'+this.field.service, {
      moduleCode: param.moduleCode,
      moduleName: param.moduleName,
      data: selectedRows
    }).then(res => {
      
      if (res.code === 200 || res.success) {
        this.$message.success('删除成功');
        
        // 使用全局函数刷新表格数据
        globalFunctions_${module}.refreshTableData.call(this);
      } else {
        this.$message.error(res.message || '删除失败');
      }
    }).catch(err => {
      
      this.$message.error('删除请求失败');
    });
  }).catch(() => {
    // 取消删除
    this.$message.info('已取消删除');
  });`;

  // 定义更新按钮点击事件 - 使用全局刷新函数
  const updateOnClick = `// 获取选中的行数据
  
  const selectedRows = this.refList.eltable.$refs.eltable.getCheckboxRecords()
  if (!selectedRows || selectedRows.length === 0) {
    this.$message.warning('请先选择要更新的数据');
    return;
  }
  
  if (selectedRows.length > 1) {
    this.$message.warning('一次只能更新一条数据');
    return;
  }
  
  // 获取全局参数
  let {param} = this.getGlobalDsv();
  const currentRow = selectedRows[0];
  
  // 创建一个函数处理表单提交
  const handleFormSubmit = (formData) => {
    
    const cleanObj = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== null && value !== undefined)
    );
    let data = Object.assign( {}, currentRow, cleanObj )
    
    // 简单验证
    if (!formData) return;
    delete formData.eltable
    // 调用更新接口
    this.request.postData('event/preview/exec/'+this.field.service, {
      moduleCode: param.moduleCode,
      moduleName: param.moduleName,
      data: [data]
    }).then(res => {
      
      if (res.code === 200 || res.success) {
        this.$message.success('更新成功');
        
        // 使用全局函数刷新表格数据
        globalFunctions_${module}.refreshTableData.call(this);
      } else {
        this.$message.error(res.message || '更新失败');
      }
    }).catch(err => {
      
      this.$message.error('更新请求失败');
    });
  };
  
  // 使用DataCenter的事件机制监听表单提交
  const unsubscribe = this.dataCenter.subscribe('dialog-form-update', handleFormSubmit);
  // 打开对话框，显示表单并填充当前数据
  const dialog = this.refList.dataDialog.$refs.fieldEditor
  if (dialog) {
    dialog.open();
    
    this.$nextTick(() => {
      delete currentRow.eltable
        this.emitEvent('dialog-open', currentRow)
    });
    
  } else {
    
    this.$message.error('系统错误：找不到表单对话框');
    unsubscribe(); // 清理订阅
  }`;

  // 根据按钮类型选择对应的点击事件代码
  let onClick = "";
  if (isQueryButton) {
    onClick = queryOnClick;
  } else if (isAddRowButton) {
    onClick = addRowOnClick;
  } else if (isSaveButton) {
    onClick = saveOnClick;
  } else if (isDeleteButton) {
    onClick = deleteOnClick;
  } else if (isUpdateButton) {
    onClick = updateOnClick;
  }

  return {
    key: methodCode,
    service: methodCode == "addRow" ? saveMethod : methodCode,
    type: "button",
    icon: "button",
    attrs: [
      {
        name: "cpType",
        show: false,
      },
      {
        name: "type",
        show: false,
      },
    ],
    formItemFlag: false,
    options: {
      name: methodCode,
      label: label,
      size: "",
      displayStyle: "block",
      disabled: false,
      hidden: false,
      type: "",
      plain: false,
      round: false,
      circle: false,
      icon: null,
      customClass: "",
      onCreated: "",
      onMounted: ``,
      onClick: onClick,
      cpType: "button",
      type: "button",
    },
    selected: false,
    id: methodCode,
  };
}

function generateGridContainer(cols, name) {
  return {
    key: Math.floor(Math.random() * 100000 + 1),
    type: "grid",
    category: "container",
    icon: "grid",
    cols: cols,
    options: {
      name: name,
      hidden: false,
      gutter: 12,
      colHeight: null,
      customClass: "",
    },
    id: `grid${Math.floor(Math.random() * 100000 + 1)}`,
  };
}

function generateButtonContainer(methodList) {
  // 添加一个新增按钮到方法列表
  let hasAddRowButton = methodList.some(
    (method) =>
      method.methodCode.toLowerCase().includes("addrow") ||
      method.methodName === "添加行" ||
      method.methodName === "新增"
  );

  if (!hasAddRowButton) {
    methodList.unshift({
      methodCode: "addRow",
      methodName: "新增",
    });
  }

  let saveButton = methodList.find(
    (x) =>
      x.methodCode.toLowerCase().includes("save") || x.methodName === "保存"
  );

  const cols = methodList.map((method) => {
    const randomId = Math.floor(Math.random() * 100000 + 1);
    return generateGridColumn(
      randomId,
      [
        generateButton(
          method.methodCode,
          method.methodName,
          saveButton?.methodCode
        ),
      ],
      method.methodName?.length * 0.6 || 2 * 0.6
      // (method.methodName?.length || 2) / 2
    );
  });
  return generateGridContainer(cols, "buttonTitle");
}

function getEditRender(column) {
  // 默认编辑配置
  const editConfig = {
    name: "VxeInput", // 默认为输入框
    props: {},
  };

  // 根据不同列类型设置不同的编辑控件
  switch (column.columnType) {
    case "number":
      editConfig.name = "VxeInputNumber";
      break;
    case "date":
      editConfig.name = "VxeDatePicker";
      break;
    case "datetime":
      editConfig.name = "VxeDatePicker";
      editConfig.props = { type: "datetime" };
      break;
    case "select":
      editConfig.name = "VxeSelect";
      editConfig.options = column.options || [];
      break;
    case "checkbox":
      editConfig.name = "VxeCheckbox";
      editConfig.options = column.options || [];
      break;
    case "switch":
      editConfig.name = "VxeSwitch";
      break;
    default:
      editConfig.name = "VxeInput";
      break;
  }

  return editConfig;
}

function generateTableColumns(columnList) {
  return (
    columnList
      // .filter((x) => !!x.gridColumn)
      .map((column) => {
        // 基础列配置
        const columnConfig = {
          field: column.columnCode,
          title: column.columnName,
          width: column.width || 200, // 默认宽度为200px
          editRender: getEditRender(column), // 添加编辑渲染器
        };

        return columnConfig;
      })
  );
}

function generateTable(columnList) {
  // 定义表格事件处理函数
  const tableEvents = {
    // 选择变化事件
    "selection-change": `function(selection) {
      
    }`,

    // 单元格点击事件
    "cell-click": `function(params) {
      
      const $table = this.$refs.eltable
      
      // 先触发行选中
      $table.setCheckboxRow(params.row, true)
    }`,

    // 可以添加更多事件...
  };
  return {
    key: "eltable",
    type: "eltable",
    icon: "eltable",
    formItemFlag: true,
    attrs: [
      {
        name: "data",
        show: false,
      },
      {
        name: "cpType",
        show: false,
      },
      {
        name: "type",
        show: false,
      },
    ],
    options: {
      name: "eltable",
      label: "表格",
      hidden: false,
      stripe: true,
      border: true,
      eltableHeight: "400",
      pageList: 10,
      pageUnit: "10,20,30,50",
      maxHeight: "400",
      showIndex: true,
      selectabled: true,
      data: [],
      columns: generateTableColumns(columnList),
      defaultValue: [],
      // 添加编辑配置
      editConfig: {
        trigger: "click", // 点击触发编辑
        mode: "row", // 行编辑模式
        showStatus: true, // 显示编辑状态
        autoClear: true, // 不自动清除编辑状态
        autoSave: true, // 自动保存编辑结果到数据
      },
      events: tableEvents,
      onCreated: "",
      onMounted:
        getGlobalFunctions() +
        `// 表格组件加载完成后初始化;
        setTimeout(() => {
          if(globalFunctions_${module}) globalFunctions_${module}.refreshTableData.call(this);
        },100);
       `,
      onChange: `// 表格数据变化时
        if (value && value.length) {
          
          // 确保表格选择状态正确
          if (this.dataCenter) {
            this.dataCenter.postEvent('eltable-data-changed', value);
          }
        }`,
      required: false,
      cpType: "eltable",
      type: "eltable",
    },
    selected: false,
    id: "eltable",
  };
}

function generateFieldAttributes() {
  return [
    {
      name: "disabled",
      title: "禁用",
      type: "check",
      remark: "禁用",
    },
    {
      name: "hidden",
      title: "隐藏",
      type: "check",
      remark: "隐藏",
    },
  ];
}

function generateFieldEvents() {
  return [
    {
      // name: "onChange",
      // title: "变化事件",
      // remark: "变化事件",
      // params: ["event"],
    },
  ];
}

function generateInputField(column) {
  // 特殊字段处理逻辑
  let fieldType = "text";
  let fieldOptions = {};

  // 根据字段名判断类型
  if (
    column.columnCode.includes("date") ||
    column.columnCode.includes("time")
  ) {
    fieldType = "datetime";
    fieldOptions = {
      format: "yyyy-MM-dd HH:mm:ss",
    };
  } else if (column.columnType === "number" || column.decimalLength > 0) {
    fieldType = "number";
  }

  return {
    key: column.columnCode,
    type: "input",
    icon: "text-field",
    formItemFlag: true,
    options: {
      name: column.columnCode,
      label: column.columnName,
      type: fieldType,
      placeholder: `请输入${column.columnName}`,
      size: "",
      labelWidth: null,
      labelHidden: false,
      readonly: false,
      disabled: false,
      hidden: false,
      clearable: true,
      showPassword: false,
      required: column.required || false,
      labelTooltip: null,
      minLength: null,
      maxLength: column.maxLength || null,
      showWordLimit: column.maxLength > 0,
      buttonIcon: "custom-search",
      onCreated: "",
      onMounted: "",
      onInput: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
      onAppendButtonClick: "",
      ...fieldOptions,
      cpType: fieldType,
    },
    attrs: [
      ...generateFieldAttributes(),
      {
        name: "cpType",
        show: false,
      },
    ],
    events: generateFieldEvents(),
    selected: false,
    id: column.columnCode,
  };
}

function generateDialog(columnList) {
  // 选择列定义中的所有列用于表单
  const dialogColumns = columnList;
  const cols = dialogColumns.map((column) => {
    const randomId = Math.floor(Math.random() * 100000 + 1);
    return generateGridColumn(randomId, [generateInputField(column)], 8);
  });
  return {
    key: Math.floor(Math.random() * 100000 + 1),
    type: "dialog",
    category: "container",
    icon: "dialog",
    widgetList: [generateGridContainer(cols, "dialogGrid")],
    options: {
      name: `dataDialog`, // 使用固定的名称，便于在按钮事件中引用
      label: "数据操作",
      dialogWidth: "80%",
      fullScreen: false,
      showClose: true,
      showModal: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      center: false,
      comfirmButtonText: "确定",
      hideComfirm: false,
      cancelButtonText: "取消",
      hideCancel: false,
      hidden: false,
      customClass: "",
      onMounted: `
      let flag = '' // 更新标识
      this.handleEvent('dialog-open', (data) => {
        
        flag = !!Object.keys(data).length
        if (data) {
          this.globalModel.formModel = data;
          
          // 同步 dialog 数据到 DataCenter
          this.dataCenter.setData(data);
        }
      });
      
      // 订阅 dialog 关闭事件，确保数据同步回主表单
      this.dataCenter.subscribe('dialog-confirm', (formData) => {
        // 更新全局表单数据
        Object.assign(this.globalModel.formModel, formData);
        
        // 触发提交事件
        if(flag){
          this.dataCenter.postEvent('dialog-form-update', formData);
        }else{
          this.dataCenter.postEvent('dialog-form-save', formData);
        }
      });
    `,
      onOkButtonClick: `// 获取表单数据
  const formData = this.formModel;
  
  
  // 触发确认事件，传递表单数据
  this.dataCenter.postEvent('dialog-confirm', formData);
  
  // 关闭对话框
  this.handleHide();`,
      onCancelButtonClick: `// 取消操作
  
  this.handleHide();`,
      onDialogBeforeClose: "",
      // 修改 vformJson 中的 dialog 配置
      onDialogOpened: `
    // 对话框打开初始化
    

    // 如果传入了数据，填充到表单中
    const initialData = this.getOpenParams();
    
    if (initialData && typeof initialData === 'object') {
      
      this.setFormData(initialData);
      
      // 确保 DataCenter 也有这些数据
      this.dataCenter.setData(initialData);
    } else {
      // 如果没有初始数据，也要确保所有字段至少被初始化为 null 或 undefined
      const emptyData = {};
      this.widgetList.forEach(widget => {
        if (widget.formItemFlag && widget.options?.name) {
          emptyData[widget.options.name] = undefined;
        }
      });
      this.setFormData(emptyData);
      this.dataCenter.setData(emptyData);
    }
    `,
    },
    id: `dataDialog`,
  };
}

function getGlobalObject() {
  return {
    "query_table.onClick": function(result, type) {
      const tableName = "userTable";
      const self = type === "qt" ? result : this;
      const { moduleName, moduleCode, functionCode } = self.formConfig ?? {};

      const tableConfig = self.refList?.[tableName] ?? {};
      const { pageSize, currentPage: pageNum = 1, field = {} } = tableConfig;

      // 转换排序项为请求所需格式
      const transformSortItems = (sortItems = []) =>
        [...sortItems]
          .sort((a, b) => a.sortPriority - b.sortPriority)
          .map(({ sortColumn, sortType }) => ({
            sortColumn,
            asc: sortType === "asc",
          }));

      const requestParams = {
        moduleName,
        moduleCode,
        pageSize,
        pageNum: self.field.type === "tree" ? 1 : pageNum,
        ...(self.field.type === "query" && { searchItems: result }),
        ...(self.field.type === "tree" &&
          result.dept_id &&
          result.dept_path && {
            treeNode: {
              id: result.dept_id,
              path: result.dept_path,
            },
          }),
        sortItems: transformSortItems(field.options?.sortBy),
      };

      self
        .execRequest(`${functionCode}.query`, requestParams)
        .then(({ data: { rows = [], total = 0 } = {} }) => {
          self.refList[tableName].setData(rows, total);
          self.Message.notifySuccess("查询成功！");
        })
        .catch((error) => {
          console.error("查询请求失败:", error);
          self.Message.notifyError("查询失败！");
        });
    },
    "delete_table.onClick": function() {
      const tableName = "userTable";
      const { moduleCode, moduleName, functionCode } = this.formConfig;
      const {
        currentPage: pageNum,
        pageSize,
        field,
        $refs: { [tableName]: $table },
      } = this.refList[tableName];

      if ($table.getInsertRecords().length)
        return this.Message.notifyError("有未保存的新增数据！");
      if ($table.getUpdateRecords().length)
        return this.Message.notifyError("有未保存的修改数据！");

      var getData = {};
      var selType = field.options.isSelectType;
      getData = $table.getRadioRecord();
      if (selType === "checkbox") {
        getData = $table.getCheckboxRecords();
      }

      if (!getData) return this.Message.notifyError("请选择要删除的数据！");

      const performDelete = async (data) => {
        if (data.length === undefined) {
          data = [data];
        }
        return await this.execRequest(`${functionCode}.delete`, {
          moduleName,
          moduleCode,
          data: data,
        });
      };

      const executeDeleteFlow = async () => {
        const delRes = await performDelete(getData);
        if (!delRes.success)
          return this.Message.notifyError("删除失败，请稍后重试！");

        this.formConfig.globalObject["query_table.onClick"].call(this, "qt");

        this.Message.notifySuccess("删除成功！");
      };

      window.VxeUI.modal.confirm({
        title: "确认删除提示",
        content: "是否删除当前选择数据？",
        draggable: false,
        escClosable: true,
        confirmButtonText: "确认删除",
        onConfirm: executeDeleteFlow,
      });
    },
    "add_table.onClick": function() {
      const tableName = "userTable";
      const tableList = this.refList[tableName];
      const $table = tableList?.$refs[tableName];

      if (!$table) return;

      // 生成带默认值的新记录
      const record = tableList.field.options.columns.reduce((acc, column) => {
        column.defaultValue && (acc[column.field] = column.defaultValue);
        return acc;
      }, {});

      // 插入并进入编辑模式
      $table
        .insert(record)
        .then((res) => $table.setEditRow(res.row))
        .catch((error) => console.error("插入记录失败:", error));
    },
    "save_table.onClick": function() {
      const { tableName = "userTable", formConfig, refList } = this;
      const { moduleCode, moduleName, functionCode } = formConfig;
      const tableList = refList[tableName];
      const { currentPage: pageNum, pageSize, $refs } = tableList;
      const $table = $refs[tableName];

      const [insertRecords, updateRecords] = [
        $table.getInsertRecords(),
        $table.getUpdateRecords(),
      ];

      const handleRequest = async (type, records, tableRef) => {
        if (type === "insert") {
          const isCode = "user_code",
            isCodeName = "登录账号";
          const codes = records.map((record) => record[isCode]);
          if (new Set(codes).size !== codes.length) {
            return this.Message.notifyError(
              "您新增中有重复" + isCodeName + "，请修改！"
            );
          }

          var treeRef = this.refList.deptTree.$refs.treeRef;
          var dept_id = treeRef.getCurrentNode()?.dept_id;
          if (!dept_id) {
            dept_id = treeRef.data[0]?.dept_id;
          }

          for (var i = 0; i < records.length; i++) {
            records[i].dept_id = dept_id;
          }
        }

        try {
          const errMap = await $table.validate();
          if (errMap) {
            return this.Message.notifyError(`校验不通过！`);
          }

          await this.execRequest(`${functionCode}.save`, {
            moduleName,
            moduleCode,
            data: records,
          });

          this.formConfig.globalObject["query_table.onClick"].call(this, "qt");
          this.Message.notifySuccess(
            `${type === "insert" ? "新增" : "修改"}成功！`
          );
        } catch (error) {
          this.Message.notifyError(
            `${type === "insert" ? "新增" : "修改"}失败！`
          );
        }
      };

      insertRecords.length && handleRequest("insert", insertRecords, $table);
      updateRecords.length && handleRequest("update", updateRecords, $table);
    },
  };
}

export function generateGridData(inputData) {
  if (!inputData) {
    return {};
  }

  const { columnList, methodList, formConfig } = inputData;

  const widgetList = [
    generateButtonContainer(methodList),
    generateTable(columnList),
  ];

  return {
    widgetList: widgetList,
    formConfig: Object.assign({}, formConfig, {
      globalObject: getGlobalObject(), // 添加全局函数到 formConfig
    }),
  };
}

export default function main(inputData, type = "grid") {
  // if (inputData?.module) {
  //   module = inputData.module.moduleCode + "_" + inputData.module.functionCode;
  // }
  if (type === "grid") {
    return generateGridData(inputData);
  }
  return {};
}

export function transformDataToVForm(dataContent) {
  try {
    const inputData = JSON.parse(dataContent);

    const formConfig = main(inputData, "grid");

    return JSON.stringify(formConfig, null, 2);
  } catch (error) {
    return JSON.stringify({ error: "Failed to transform data" });
  }
}
