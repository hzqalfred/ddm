/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
import { processObject, findElementsByProp } from "@/core/utils/tool";
import message from "@/core/Message";
import { deepClone, overwriteObj } from "@/core/utils/tool";
// import generateJson from "@/config/designData.js";
import {
  containers as CONS,
  basicFields as BFS,
  advancedFields as AFS,
  customFields as CFS,
} from "./widget-panel/widgetsConfig.js";
import eventBus from "@/core/utils/event-bus";
import { useFormCenterStore } from "@/core/pinia/modules/datacenter";
import {
  generateId,
  getDefaultFormConfig,
} from "@/core/components/VForm/lib/utils";
export function createDesigner(vueInstance) {
  let defaultFormConfig = deepClone(getDefaultFormConfig());
  const formCenterStore = useFormCenterStore();

  return {
    formCenterStore: formCenterStore, //获取全部表单数据   hzq
    dataCenter: null, //获取表单中心数据   hzq
    funId: "",
    formContent: {},
    widgetList: [],
    fieldsList: [],
    columnList: [], //hzq  用来保存gird布局下table组件的表头数据（JSON格式）
    pageType: "",
    subgridList: [],
    expandList: [
      {
        displayName: "多用途组件",
        type: "universal",
        category: "container",
        icon: "subgrid",
        formItemFlag: true,
        options: {
          isFunItem: false,
          name: "",
          label: "universal",
          hidden: false,
          universalWidth: "100%",
          customClass: "",
        },
      },
    ],
    formConfig: { cssCode: "" },
    selectedId: null,
    selectedWidget: null,
    selectedWidgetName: null, //选中组件名称（唯一）
    vueInstance: vueInstance,

    formWidget: null, //表单设计容器

    cssClassList: [], //自定义样式列表

    historyData: {
      index: -1, //index: 0,
      maxStep: 20,
      steps: [],
    },
    savedHistoryIndex: 0, // 保存到哪一步，用来判断所有操作是否 已保存
    isLoading: false,

    initDesigner(funId, layoutType, resetFormJson) {
      this.widgetList = [];
      this.columnList = []; //hzq
      this.formConfig = deepClone(defaultFormConfig);
      this.formConfig.layoutType = layoutType;
      this.formConfig.serviceMap = {};
      if (!resetFormJson) {
        this.initHistoryData(funId);
      }
    },

    clearDesigner(skipHistoryChange) {
      let emptyWidgetListFlag = this.widgetList.length === 0;
      this.widgetList = [];
      this.columnList = []; //hzq
      this.formConfig.eventMap = {};
      this.formConfig.serviceMap = {};
      this.selectedId = null;
      this.selectedWidgetName = null;
      this.selectedWidget = {}; //this.selectedWidget = null
      const layoutType = this.formConfig.layoutType;
      overwriteObj(this.formConfig, defaultFormConfig); //
      this.formConfig.layoutType = layoutType;

      if (skipHistoryChange) {
        //什么也不做！！
      } else if (!emptyWidgetListFlag) {
        this.emitHistoryChange();
      } else {
        this.saveCurrentHistoryStep();
      }
    },

    loadPresetCssCode(preCssCode) {
      if (this.formConfig.cssCode === "" && !!preCssCode) {
        this.formConfig.cssCode = preCssCode;
      }
    },

    getLayoutType() {
      return this.formConfig.layoutType || "PC";
    },

    changeLayoutType(newType) {
      this.formConfig.layoutType = newType;
    },

    getImportTemplate() {
      return {
        widgetList: [],
        // formConfig: deepClone(this.formConfig)
        formConfig: deepClone(defaultFormConfig),
      };
    },

    loadFormJson(formJson, parseSqlFlag) {
      let modifiedFlag = false;
      const baseMap = {
        text: "input",
        password: "input",
        combobox: "select",
        comboboxmult: "select",
        combofilterbox: "select",
        autocomplate: "autocomplete",
        inputfilterbox: "select",
        timerange: "time-range",
        year: "date",
        yearmonth: "date",
        week: "date",
        month: "date",
        date: "date",
        datetime: "date",
        datetimes: "date",
        daterange: "date-range",
        datetimerange: "date-range",
        textarea: "textarea",
        number: "number",
        radio: "radio",
        checkbox: "checkbox",
        time: "time",
        switch: "switch",
        rate: "rate",
        color: "color",
        slider: "slider",
        "static-text": "static-text",
        "html-text": "html-text",
        button: "button",
        divider: "divider",
        customDialog: "selectwin",
        qrcode: "qrcode",
        barcode: "barcode",
        selectAll: "selectAll",
      };
      const getColumnType = (column_type) => baseMap[column_type] || "input";
      const getFieldConfig = (type, BFS, AFS) => {
        return (
          BFS.find((bf) => bf.type === type) ||
          AFS.find((bf) => bf.type === type)
        );
      };
      if (!!formJson && !!formJson.widgetList) {
        this.formWidget.clearWidgetRefList();
        this.widgetList = formJson.widgetList;
        modifiedFlag = true;
      }
      if (!!formJson && !!formJson.formConfig) {
        //this.formConfig = importObj.formConfig
        overwriteObj(
          this.formConfig,
          formJson.formConfig
        ); /* 用=赋值，会导致inject依赖注入的formConfig属性变成非响应式 */
        modifiedFlag = true;
      }
      if (!!formJson && !!formJson.subData) {
        this.subgridList = formJson.subData.map((subgrid) => {
          let subgridtpl = {
            type: "subgrid",
            category: "container",
            icon: "subgrid",
            formItemFlag: true,
            options: {
              isFunItem: false,
              name: subgrid.functionName,
              funId: subgrid.functionId,
              functionCode: subgrid.functionCode,
              label: subgrid.functionName,
              hidden: false,
              customClass: "",
            },
          };
          return {
            key: subgrid.functionId,
            displayName: subgrid.functionName,
            selected: false,
            ...subgridtpl,
          };
        });
      }
      if (!!formJson && !!formJson.columnList) {
        this.fieldsList = formJson.columnList.map((field) => {
          let column_type = getColumnType(field.columnType);
          let cf = deepClone(getFieldConfig(column_type, BFS, AFS));
          Object.assign(cf.options, {
            label: field.columnName,
            name: field.columnCode,
            required: field.required,
            isFunItem: true,
            cpType: field.columnType,
            defaultValue: field.defaultValue || undefined,
          });

          return {
            key: field.columnCode,
            displayName: field.columnName,
            ...cf,
            selected: false,
          };
        });
        // 预生成 拖拽列表
        // let dragTable = deepClone(getFieldConfig("eltable", BFS, AFS));
        // Object.assign(dragTable.options, {
        //   label: "表格",
        //   name: "eltable",
        //   required: false,
        //   isFunItem: true,
        //   cpType: "eltable",
        //   columns: formJson.columnList.map((field) => ({
        //     field: field.columnCode,
        //     title: field.columnName,
        //   })),
        //   defaultValue: [],
        // });
        // this.fieldsList.push({
        //   key: "eltable",
        //   displayName: "表格",
        //   ...dragTable,
        //   selected: false,
        // });
      }

      if (parseSqlFlag) {
        let combineTable = this.widgetList.find((x) => x.serviceMapId);
        if (combineTable) {
          //新增 删除 保存 查询
          let buttonlist = formJson.methodList.map((method) => {
            let funButton = {
              key: method.methodCode,
              type: "button",
              icon: "button",
              category: "field",
              isnew: "9",
              id: method.methodCode,
              options: {
                name: method.methodCode,
                title: method.methodName, // 标题
                belongTo: "", // 按钮归属，绑定表格
                mode: "button", // 按钮模式（text,button）
                float: "flex-start", // 按钮位置（center,flex-start,flex-end）不使用浮动
                comsize: "", // 尺寸（空、medium、small、mini）
                status: "", // 按钮状态（空、primary、success、info、warning、error）
                round: false, // 是否圆角
                circle: false, // 是否圆形
                icon: "", // 图标
                prefixTooltip: "", // 前缀提示
                suffixTooltip: "", // 后缀提示
                loading: false, // 是否加载中
                comdisabled: false, // 是否禁用
                hidden: false,
                //-------------------
                customClass: "", //自定义css类名
                //-------------------
                onCreated: "",
                onMounted: "",
                onClick: "",
              },
            };
            if (method.methodCode.indexOf(".query") > -1) {
              this.formConfig.serviceMap[combineTable.serviceMapId] =
                method.methodCode;
            } else if (method.methodCode.indexOf(".delete") > -1) {
              let delFunc = processObject({
                [`${method.methodCode}.onClick`]: `function(){
                try {
      var $table = this.refList[ 'eltable-${combineTable.serviceMapId}'].$refs[ 'eltable-${combineTable.serviceMapId}']
      let service = this.formConfig.serviceMap && this.formConfig.serviceMap[${combineTable.serviceMapId}] || ''
      let dsv = this.getGlobalDsv()
      var selectData = $table.getRadioRecord()
      if(selectData){
        this.execRequest('${method.methodCode}',{
        moduleName:dsv?.param?.moduleName || '',
        moduleCode:dsv?.param?.moduleCode || '',
          data:[selectData]
        }).then(res=>{
          this.Message.notifyInfo(res.msg)
          this.execRequest(service,{
            moduleName:dsv?.param?.moduleName || '',
            moduleCode:dsv?.param?.moduleCode || '',
            pageSize:10,
            pageNum:1
          }).then(res=>{
            console.log(res)
            try {
             this.refList[ 'eltable-${combineTable.serviceMapId}'].setData(res.data.rows,res.data.total)
            } catch (e) {}
          })
        })
      }
    } catch (e) {}
                }`,
              });
              this.formConfig.globalObject = Object.assign(
                {},
                this.formConfig.globalObject,
                delFunc
              );
              this.formConfig.eventMap = Object.assign(
                this.formConfig.eventMap,
                {
                  [`${method.methodCode}.onClick`]: `${method.methodCode}.onClick`,
                }
              );
            } else if (method.methodCode.indexOf(".save") > -1) {
              let saveFunc = processObject({
                [`${method.methodCode}.onClick`]: `function(){
                try {
      var $table = this.refList[ 'eltable-${combineTable.serviceMapId}'].$refs[ 'eltable-${combineTable.serviceMapId}']
      let service = this.formConfig.serviceMap && this.formConfig.serviceMap[${combineTable.serviceMapId}] || ''
      let dsv = this.getGlobalDsv()
      console.log($table)
      if ($table) {
        let insertRecords = $table.getInsertRecords();
        let updateRecords = $table.getUpdateRecords();
        if (insertRecords.length === 0 && updateRecords.length === 0) {
          this.Message.notifyInfo("没有需要保存的数据");
          return;
        }
        if (insertRecords.length){
          this.execRequest('${method.methodCode}',{
            moduleName:dsv?.param?.moduleName || '',
            moduleCode:dsv?.param?.moduleCode || '',
            data:insertRecords
          }).then(res=>{
            this.Message.notifyInfo(res.msg)
            this.execRequest(service,{
              moduleName:dsv?.param?.moduleName || '',
              moduleCode:dsv?.param?.moduleCode || '',
              pageSize:10,
              pageNum:1
            }).then(res=>{
              console.log(res)
              try {
                this.refList[ 'eltable-${combineTable.serviceMapId}'].setData(res.data.rows,res.data.total)
              } catch (e) {}
            })
          })
        }
        if (updateRecords.length){
          this.execRequest('${method.methodCode}',{
            moduleName:dsv?.param?.moduleName || '',
            moduleCode:dsv?.param?.moduleCode || '',
            data:updateRecords
          }).then(res=>{
            this.Message.notifyInfo(res.msg)
            this.execRequest('system_user.query',{
              moduleName:dsv?.param?.moduleName || '',
              moduleCode:dsv?.param?.moduleCode || '',
              pageSize:10,
              pageNum:1
            }).then(res=>{
              console.log(res)
              try {
                this.refList[ 'eltable-${combineTable.serviceMapId}'].setData(res.data.rows,res.data.total)
              } catch (e) {}
            })
          })
        }
      }
    } catch (e) {}
     }`,
              });
              this.formConfig.globalObject = Object.assign(
                {},
                this.formConfig.globalObject,
                saveFunc
              );
              this.formConfig.eventMap = Object.assign(
                this.formConfig.eventMap,
                {
                  [`${method.methodCode}.onClick`]: `${method.methodCode}.onClick`,
                }
              );
            }
            return funButton;
          });
          // 新增按钮逻辑
          buttonlist.unshift({
            key: "eltable-add",
            type: "button",
            icon: "button",
            category: "field",
            isnew: "9",
            id: "eltable-add",
            options: {
              name: "eltable-add",
              title: "新增",
              belongTo: "",
              mode: "button",
              float: "flex-start",
              comsize: "",
              status: "",
              round: false,
              circle: false,
              icon: "",
              prefixTooltip: "",
              suffixTooltip: "",
              loading: false,
              comdisabled: false,
              hidden: false,
              //-------------------
              customClass: "",
              //-------------------
              onCreated: "",
              onMounted: "",
              onClick: "",
            },
          });
          let addFunc = processObject({
            "eltable-add.onClick": ` function() {
            try {
              const $table = this.refList[
                'eltable-${combineTable.serviceMapId}'
              ].$refs['eltable-${combineTable.serviceMapId}'];
              console.log($table);
              if ($table) {
                $table.insert({}).then((res) => {
                  $table.setEditRow(res.row);
                });
              }
            } catch (e) {}
          }`,
          });
          this.formConfig.globalObject = Object.assign(
            {},
            this.formConfig.globalObject,
            addFunc
          );
          this.formConfig.eventMap = Object.assign(this.formConfig.eventMap, {
            "eltable-add.onClick": "eltable-add.onClick",
          });
          //新增按钮逻辑END
          let gridContain = {
            key: "button-gird",
            type: "grid",
            category: "container",
            icon: "grid",
            cols: [
              ...buttonlist
                .filter((x) => x.key.indexOf("query") == -1)
                .map((x) => {
                  return {
                    type: "grid-col",
                    category: "container",
                    icon: "grid-col",
                    internal: true,
                    widgetList: [x],
                    options: {
                      name: `eltable-grid-col-${Math.floor(
                        Math.random() * 100000 + 1
                      )}`,
                      hidden: false,
                      span: 2,
                      offset: 0,
                      push: 0,
                      pull: 0,
                      responsive: false,
                      customClass: "",
                    },
                    id: `eltable-grid-col-${Math.floor(
                      Math.random() * 100000 + 1
                    )}`,
                  };
                }),
            ],
            options: {
              name: "button-gird",
              hidden: false,
              gutter: 12,
              colHeight: null,
              customClass: "",
            },
            id: "button-gird",
          };
          if (!combineTable.cols[0]?.widgetList.length) {
            combineTable.cols[0].widgetList.push(gridContain);
          } else {
            message.confirmAction("此操作将覆盖表格的全局函数", "", () => {
              combineTable.cols[0].widgetList = [gridContain];
            });
          }
          let el = findElementsByProp(combineTable, "type", "eltable");
          if (el.length) {
            message.confirmAction("是否将字段明细导入表头", "", () => {
              el.map((x) => {
                x.options.columns = this.fieldsList.map((field) => ({
                  field: field.options?.name || field.key,
                  title: field.options?.label || field.displayName,
                  width: 150,
                  visible: true,
                  sortable: false,
                  editable: false,
                  align: "left",
                  formatter: "",
                  renderFn: "",
                }));
              });
            });
          }
        }
      }
      if (modifiedFlag) {
        this.emitEvent("form-json-imported", []); // 通知其他组件
      }
      return modifiedFlag;
    },

    setSelected(selected) {
      if (!selected) {
        this.clearSelected();
        return;
      }

      this.selectedWidget = selected;
      if (selected.id) {
        this.selectedId = selected.id;
        this.selectedWidgetName = selected.options.name;
      }
    },

    updateSelectedWidgetNameAndLabel(selectedWidget, newName, newLabel) {
      this.selectedWidgetName = newName;
      if (
        !!newLabel &&
        Object.keys(selectedWidget.options).indexOf("label") > -1
      ) {
        selectedWidget.options.label = newLabel;
      }
    },

    clearSelected() {
      this.selectedId = null;
      this.selectedWidgetName = null;
      this.selectedWidget = {}; //this.selectedWidget = null
    },

    checkWidgetMove(evt) {
      /* Only field widget can be dragged into sub-form */
      if (!!evt.draggedContext && !!evt.draggedContext.element) {
        let wgCategory = evt.draggedContext.element.category;
        let wgType = evt.draggedContext.element.type + "";
        if (evt.to) {
          if (
            evt.to.className === "sub-form-table" &&
            wgCategory === "container"
          ) {
            return false;
          }
        }
      }

      return true;
    },

    checkFieldMove(evt) {
      if (!!evt.draggedContext && !!evt.draggedContext.element) {
        let wgCategory = evt.draggedContext.element.category;
        let wgType = evt.draggedContext.element.type + "";
        if (evt.to) {
          if (evt.to.className === "sub-form-table" && wgType === "slot") {
            return false;
          }
        }
      }

      return true;
    },

    /**
     * 追加表格新行
     * @param widget
     */
    appendTableRow(widget) {
      let rowIdx = widget.rows.length; //确定插入行位置
      let newRow = deepClone(widget.rows[widget.rows.length - 1]);
      newRow.id = "table-row-" + generateId();
      newRow.merged = false;
      newRow.cols.forEach((col) => {
        col.id = "table-cell-" + generateId();
        col.options.name = col.id;
        col.merged = false;
        col.options.colspan = 1;
        col.options.rowspan = 1;
        col.widgetList.length = 0;
      });
      widget.rows.splice(rowIdx, 0, newRow);

      this.emitHistoryChange();
    },

    /**
     * 追加表格新列
     * @param widget
     */
    appendTableCol(widget) {
      let colIdx = widget.rows[0].cols.length; //确定插入列位置
      widget.rows.forEach((row) => {
        let newCol = deepClone(this.getContainerByType("table-cell"));
        newCol.id = "table-cell-" + generateId();
        newCol.options.name = newCol.id;
        newCol.merged = false;
        newCol.options.colspan = 1;
        newCol.options.rowspan = 1;
        newCol.widgetList.length = 0;
        row.cols.splice(colIdx, 0, newCol);
      });

      this.emitHistoryChange();
    },

    insertTableRow(widget, insertPos, cloneRowIdx, curCol, aboveFlag) {
      let newRowIdx = aboveFlag ? insertPos : insertPos + 1; //初步确定插入行位置
      if (!aboveFlag) {
        //继续向下寻找同列第一个未被合并的单元格
        let tmpRowIdx = newRowIdx;
        let rowFoundFlag = false;
        while (tmpRowIdx < widget.rows.length) {
          if (!widget.rows[tmpRowIdx].cols[curCol].merged) {
            newRowIdx = tmpRowIdx;
            rowFoundFlag = true;
            break;
          } else {
            tmpRowIdx++;
          }
        }

        if (!rowFoundFlag) {
          newRowIdx = widget.rows.length;
        }
      }

      let newRow = deepClone(widget.rows[cloneRowIdx]);
      newRow.id = "table-row-" + generateId();
      newRow.merged = false;
      newRow.cols.forEach((col) => {
        col.id = "table-cell-" + generateId();
        col.options.name = col.id;
        col.merged = false;
        col.options.colspan = 1;
        col.options.rowspan = 1;
        col.widgetList.length = 0;
      });
      widget.rows.splice(newRowIdx, 0, newRow);

      let colNo = 0;
      while (
        newRowIdx < widget.rows.length - 1 &&
        colNo < widget.rows[0].cols.length
      ) {
        //越界判断
        const cellOfNextRow = widget.rows[newRowIdx + 1].cols[colNo];
        const rowMerged = cellOfNextRow.merged; //确定插入位置下一行的单元格是否为合并单元格
        if (rowMerged) {
          let rowArray = widget.rows;
          let unMergedCell = {};
          let startRowIndex = null;
          for (let i = newRowIdx; i >= 0; i--) {
            //查找该行已合并的主单元格
            if (
              !rowArray[i].cols[colNo].merged &&
              rowArray[i].cols[colNo].options.rowspan > 1
            ) {
              startRowIndex = i;
              unMergedCell = rowArray[i].cols[colNo];
              break;
            }
          }

          if (unMergedCell.options) {
            //如果有符合条件的unMergedCell
            let newRowspan = unMergedCell.options.rowspan + 1;
            this.setPropsOfMergedRows(
              widget.rows,
              startRowIndex,
              colNo,
              unMergedCell.options.colspan,
              newRowspan
            );
            colNo += unMergedCell.options.colspan;
          } else {
            colNo += 1;
          }
        } else {
          //colNo += 1
          colNo += cellOfNextRow.options.colspan || 1;
        }
      }

      this.emitHistoryChange();
    },

    insertTableCol(widget, insertPos, curRow, leftFlag) {
      let newColIdx = leftFlag ? insertPos : insertPos + 1; //初步确定插入列位置
      if (!leftFlag) {
        //继续向右寻找同行第一个未被合并的单元格
        let tmpColIdx = newColIdx;
        let colFoundFlag = false;
        while (tmpColIdx < widget.rows[curRow].cols.length) {
          if (!widget.rows[curRow].cols[tmpColIdx].merged) {
            newColIdx = tmpColIdx;
            colFoundFlag = true;
            break;
          } else {
            tmpColIdx++;
          }

          if (!colFoundFlag) {
            newColIdx = widget.rows[curRow].cols.length;
          }
        }
      }

      widget.rows.forEach((row) => {
        let newCol = deepClone(this.getContainerByType("table-cell"));
        newCol.id = "table-cell-" + generateId();
        newCol.options.name = newCol.id;
        newCol.merged = false;
        newCol.options.colspan = 1;
        newCol.options.rowspan = 1;
        newCol.widgetList.length = 0;
        row.cols.splice(newColIdx, 0, newCol);
      });

      let rowNo = 0;
      while (
        newColIdx < widget.rows[0].cols.length - 1 &&
        rowNo < widget.rows.length
      ) {
        //越界判断
        const cellOfNextCol = widget.rows[rowNo].cols[newColIdx + 1];
        const colMerged = cellOfNextCol.merged; //确定插入位置右侧列的单元格是否为合并单元格
        if (colMerged) {
          let colArray = widget.rows[rowNo].cols;
          let unMergedCell = {};
          let startColIndex = null;
          for (let i = newColIdx; i >= 0; i--) {
            //查找该行已合并的主单元格
            if (!colArray[i].merged && colArray[i].options.colspan > 1) {
              startColIndex = i;
              unMergedCell = colArray[i];
              break;
            }
          }

          if (unMergedCell.options) {
            //如果有符合条件的unMergedCell
            let newColspan = unMergedCell.options.colspan + 1;
            this.setPropsOfMergedCols(
              widget.rows,
              rowNo,
              startColIndex,
              newColspan,
              unMergedCell.options.rowspan
            );
            rowNo += unMergedCell.options.rowspan;
          } else {
            rowNo += 1;
          }
        } else {
          //rowNo += 1
          rowNo += cellOfNextCol.options.rowspan || 1;
        }
      }

      this.emitHistoryChange();
    },

    setPropsOfMergedCols(
      rowArray,
      startRowIndex,
      startColIndex,
      newColspan,
      rowspan
    ) {
      for (let i = startRowIndex; i < startRowIndex + rowspan; i++) {
        for (let j = startColIndex; j < startColIndex + newColspan; j++) {
          if (i === startRowIndex && j === startColIndex) {
            rowArray[i].cols[j].options.colspan = newColspan; //合并后的主单元格
            continue;
          }

          rowArray[i].cols[j].merged = true;
          rowArray[i].cols[j].options.colspan = newColspan;
          rowArray[i].cols[j].widgetList = [];
        }
      }
    },

    setPropsOfMergedRows(
      rowArray,
      startRowIndex,
      startColIndex,
      colspan,
      newRowspan
    ) {
      for (let i = startRowIndex; i < startRowIndex + newRowspan; i++) {
        for (let j = startColIndex; j < startColIndex + colspan; j++) {
          if (i === startRowIndex && j === startColIndex) {
            rowArray[i].cols[j].options.rowspan = newRowspan;
            continue;
          }

          rowArray[i].cols[j].merged = true;
          rowArray[i].cols[j].options.rowspan = newRowspan;
          rowArray[i].cols[j].widgetList = [];
        }
      }
    },

    setPropsOfSplitCol(
      rowArray,
      startRowIndex,
      startColIndex,
      colspan,
      rowspan
    ) {
      for (let i = startRowIndex; i < startRowIndex + rowspan; i++) {
        for (let j = startColIndex; j < startColIndex + colspan; j++) {
          rowArray[i].cols[j].merged = false;
          rowArray[i].cols[j].options.rowspan = 1;
          rowArray[i].cols[j].options.colspan = 1;
        }
      }
    },

    setPropsOfSplitRow(
      rowArray,
      startRowIndex,
      startColIndex,
      colspan,
      rowspan
    ) {
      for (let i = startRowIndex; i < startRowIndex + rowspan; i++) {
        for (let j = startColIndex; j < startColIndex + colspan; j++) {
          rowArray[i].cols[j].merged = false;
          rowArray[i].cols[j].options.rowspan = 1;
          rowArray[i].cols[j].options.colspan = 1;
        }
      }
    },

    mergeTableCol(rowArray, colArray, curRow, curCol, leftFlag, cellWidget) {
      let mergedColIdx = leftFlag
        ? curCol
        : curCol + colArray[curCol].options.colspan;

      // let remainedColIdx = !!leftFlag ? curCol - colArray[curCol - 1].options.colspan : curCol
      let remainedColIdx = leftFlag ? curCol - 1 : curCol;
      if (leftFlag) {
        //继续向左寻找同行未被合并的第一个单元格
        let tmpColIdx = remainedColIdx;
        while (tmpColIdx >= 0) {
          if (!rowArray[curRow].cols[tmpColIdx].merged) {
            remainedColIdx = tmpColIdx;
            break;
          } else {
            tmpColIdx--;
          }
        }
      }

      if (
        !!colArray[mergedColIdx].widgetList &&
        colArray[mergedColIdx].widgetList.length > 0
      ) {
        //保留widgetList
        if (
          !colArray[remainedColIdx].widgetList ||
          colArray[remainedColIdx].widgetList.length === 0
        ) {
          colArray[remainedColIdx].widgetList = deepClone(
            colArray[mergedColIdx].widgetList
          );
        }
      }

      let newColspan =
        colArray[mergedColIdx].options.colspan * 1 +
        colArray[remainedColIdx].options.colspan * 1;
      this.setPropsOfMergedCols(
        rowArray,
        curRow,
        remainedColIdx,
        newColspan,
        cellWidget.options.rowspan
      );

      this.emitHistoryChange();
    },

    mergeTableWholeRow(rowArray, colArray, rowIndex, colIndex) {
      //需要考虑操作的行存在已合并的单元格！！
      //整行所有单元格行高不一致不可合并！！
      let startRowspan = rowArray[rowIndex].cols[0].options.rowspan;
      let unmatchedFlag = false;
      for (let i = 1; i < rowArray[rowIndex].cols.length; i++) {
        if (rowArray[rowIndex].cols[i].options.rowspan !== startRowspan) {
          unmatchedFlag = true;
          break;
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message.notifyInfo(
          this.vueInstance.i18nt(
            "designer.hint.rowspanNotConsistentForMergeEntireRow"
          )
        );
        return;
      }

      let widgetListCols = colArray.filter((colItem) => {
        return (
          !colItem.merged &&
          !!colItem.widgetList &&
          colItem.widgetList.length > 0
        );
      });
      if (!!widgetListCols && widgetListCols.length > 0) {
        //保留widgetList
        if (
          widgetListCols[0].id !== colArray[0].id &&
          (!colArray[0].widgetList || colArray[0].widgetList.length <= 0)
        ) {
          colArray[0].widgetList = deepClone(widgetListCols[0].widgetList);
        }
      }

      this.setPropsOfMergedCols(
        rowArray,
        rowIndex,
        0,
        colArray.length,
        colArray[colIndex].options.rowspan
      );

      this.emitHistoryChange();
    },

    mergeTableRow(rowArray, curRow, curCol, aboveFlag, cellWidget) {
      let mergedRowIdx = aboveFlag
        ? curRow
        : curRow + cellWidget.options.rowspan;

      //let remainedRowIdx = !!aboveFlag ? curRow - cellWidget.options.rowspan : curRow
      let remainedRowIdx = aboveFlag ? curRow - 1 : curRow;
      if (aboveFlag) {
        //继续向上寻找同列未被合并的第一个单元格
        let tmpRowIdx = remainedRowIdx;
        while (tmpRowIdx >= 0) {
          if (!rowArray[tmpRowIdx].cols[curCol].merged) {
            remainedRowIdx = tmpRowIdx;
            break;
          } else {
            tmpRowIdx--;
          }
        }
      }

      if (
        !!rowArray[mergedRowIdx].cols[curCol].widgetList &&
        rowArray[mergedRowIdx].cols[curCol].widgetList.length > 0
      ) {
        //保留widgetList
        if (
          !rowArray[remainedRowIdx].cols[curCol].widgetList ||
          rowArray[remainedRowIdx].cols[curCol].widgetList.length === 0
        ) {
          rowArray[remainedRowIdx].cols[curCol].widgetList = deepClone(
            rowArray[mergedRowIdx].cols[curCol].widgetList
          );
        }
      }

      let newRowspan =
        rowArray[mergedRowIdx].cols[curCol].options.rowspan * 1 +
        rowArray[remainedRowIdx].cols[curCol].options.rowspan * 1;
      this.setPropsOfMergedRows(
        rowArray,
        remainedRowIdx,
        curCol,
        cellWidget.options.colspan,
        newRowspan
      );

      this.emitHistoryChange();
    },

    mergeTableWholeCol(rowArray, colArray, rowIndex, colIndex) {
      //需要考虑操作的列存在已合并的单元格！！
      //整列所有单元格列宽不一致不可合并！！
      let startColspan = rowArray[0].cols[colIndex].options.colspan;
      let unmatchedFlag = false;
      for (let i = 1; i < rowArray.length; i++) {
        if (rowArray[i].cols[colIndex].options.colspan !== startColspan) {
          unmatchedFlag = true;
          break;
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message.notifyInfo(
          this.vueInstance.i18nt(
            "designer.hint.colspanNotConsistentForMergeEntireColumn"
          )
        );
        return;
      }

      let widgetListCols = [];
      rowArray.forEach((rowItem) => {
        let tempCell = rowItem.cols[colIndex];
        if (
          !tempCell.merged &&
          !!tempCell.widgetList &&
          tempCell.widgetList.length > 0
        ) {
          widgetListCols.push(tempCell);
        }
      });

      let firstCellOfCol = rowArray[0].cols[colIndex];
      if (!!widgetListCols && widgetListCols.length > 0) {
        //保留widgetList
        if (
          widgetListCols[0].id !== firstCellOfCol.id &&
          (!firstCellOfCol.widgetList || firstCellOfCol.widgetList.length <= 0)
        ) {
          firstCellOfCol.widgetList = deepClone(widgetListCols[0].widgetList);
        }
      }

      this.setPropsOfMergedRows(
        rowArray,
        0,
        colIndex,
        firstCellOfCol.options.colspan,
        rowArray.length
      );

      this.emitHistoryChange();
    },

    undoMergeTableCol(rowArray, rowIndex, colIndex, colspan, rowspan) {
      this.setPropsOfSplitCol(rowArray, rowIndex, colIndex, colspan, rowspan);

      this.emitHistoryChange();
    },

    undoMergeTableRow(rowArray, rowIndex, colIndex, colspan, rowspan) {
      this.setPropsOfSplitRow(rowArray, rowIndex, colIndex, colspan, rowspan);

      this.emitHistoryChange();
    },

    deleteTableWholeCol(rowArray, colIndex) {
      //需考虑删除的是合并列！！
      let onlyOneColFlag = true;
      rowArray.forEach((ri) => {
        if (ri.cols[0].options.colspan !== rowArray[0].cols.length) {
          onlyOneColFlag = false;
        }
      });
      //仅剩一列则不可删除！！
      if (onlyOneColFlag) {
        this.vueInstance.$message.notifyInfo(
          this.vueInstance.i18nt("designer.hint.lastColCannotBeDeleted")
        );
        return;
      }

      //整列所有单元格列宽不一致不可删除！！
      let startColspan = rowArray[0].cols[colIndex].options.colspan;
      let unmatchedFlag = false;
      for (let i = 1; i < rowArray.length; i++) {
        if (rowArray[i].cols[colIndex].options.colspan !== startColspan) {
          unmatchedFlag = true;
          break;
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message.notifyInfo(
          this.vueInstance.i18nt(
            "designer.hint.colspanNotConsistentForDeleteEntireColumn"
          )
        );
        return;
      }

      rowArray.forEach((rItem) => {
        rItem.cols.splice(colIndex, startColspan);
      });

      this.emitHistoryChange();
    },

    deleteTableWholeRow(rowArray, rowIndex) {
      //需考虑删除的是合并行！！
      let onlyOneRowFlag = true;
      rowArray[0].cols.forEach((ci) => {
        if (ci.options.rowspan !== rowArray.length) {
          onlyOneRowFlag = false;
        }
      });
      //仅剩一行则不可删除！！
      if (onlyOneRowFlag) {
        this.vueInstance.$message.notifyInfo(
          this.vueInstance.i18nt("designer.hint.lastRowCannotBeDeleted")
        );
        return;
      }

      //整行所有单元格行高不一致不可删除！！
      let startRowspan = rowArray[rowIndex].cols[0].options.rowspan;
      let unmatchedFlag = false;
      for (let i = 1; i < rowArray[rowIndex].cols.length; i++) {
        if (rowArray[rowIndex].cols[i].options.rowspan !== startRowspan) {
          unmatchedFlag = true;
          break;
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message.notifyInfo(
          this.vueInstance.i18nt(
            "designer.hint.rowspanNotConsistentForDeleteEntireRow"
          )
        );
        return;
      }

      rowArray.splice(rowIndex, startRowspan);

      this.emitHistoryChange();
    },

    getContainerByType(typeName) {
      let allWidgets = [...BFS, ...AFS, ...CFS, ...CONS];
      let foundCon = null;
      allWidgets.forEach((con) => {
        if (!!con.category && !!con.type && con.type === typeName) {
          foundCon = con;
        }
      });

      return foundCon;
    },

    getFieldWidgetByType(typeName) {
      let allWidgets = [...CONS, ...BFS, ...AFS, ...CFS];
      let foundWidget = null;
      allWidgets.forEach((widget) => {
        if (!widget.category && !!widget.type && widget.type === typeName) {
          foundWidget = widget;
        }
      });

      return foundWidget;
    },

    hasConfig(widget, configName) {
      let originalWidget = null;
      if (widget.category) {
        originalWidget = this.getContainerByType(widget.type);
      } else {
        originalWidget = this.getFieldWidgetByType(widget.type);
      }

      if (!originalWidget || !originalWidget.options) {
        return false;
      }

      return Object.keys(originalWidget.options).indexOf(configName) > -1;
    },

    upgradeWidgetConfig(oldWidget) {
      let newWidget = null;
      if (oldWidget.category) {
        newWidget = this.getContainerByType(oldWidget.type);
      } else {
        newWidget = this.getFieldWidgetByType(oldWidget.type);
      }

      if (!newWidget || !newWidget.options) {
        return;
      }

      Object.keys(newWidget.options).forEach((ck) => {
        if (!oldWidget.hasOwnProperty(ck)) {
          oldWidget.options[ck] = deepClone(newWidget.options[ck]);
        }
      });
    },

    upgradeFormConfig(oldFormConfig) {
      Object.keys(this.formConfig).forEach((fc) => {
        if (!oldFormConfig.hasOwnProperty(fc)) {
          oldFormConfig[fc] = deepClone(this.formConfig[fc]);
        }
      });
    },

    cloneGridCol(widget, parentWidget) {
      let newGridCol = deepClone(this.getContainerByType("grid-col"));
      newGridCol.options.span = widget.options.span;
      let tmpId = generateId();
      newGridCol.id = "grid-col-" + tmpId;
      newGridCol.options.name = "gridCol" + tmpId;

      parentWidget.cols.push(newGridCol);
    },

    cloneContainer(containWidget) {
      if (containWidget.type === "grid") {
        let newGrid = deepClone(this.getContainerByType("grid"));
        newGrid.id = newGrid.type + generateId();
        newGrid.options.name = newGrid.id;
        containWidget.cols.forEach((gridCol) => {
          let newGridCol = deepClone(this.getContainerByType("grid-col"));
          let tmpId = generateId();
          newGridCol.id = "grid-col-" + tmpId;
          newGridCol.options.name = "gridCol" + tmpId;
          newGridCol.options.span = gridCol.options.span;
          newGrid.cols.push(newGridCol);
        });

        return newGrid;
      } else if (containWidget.type === "table") {
        let newTable = deepClone(this.getContainerByType("table"));
        newTable.id = newTable.type + generateId();
        newTable.options.name = newTable.id;
        containWidget.rows.forEach((tRow) => {
          let newRow = deepClone(tRow);
          newRow.id = "table-row-" + generateId();
          newRow.cols.forEach((col) => {
            col.id = "table-cell-" + generateId();
            col.options.name = col.id;
            col.widgetList = []; //清空组件列表
          });
          newTable.rows.push(newRow);
        });

        return newTable;
      } else {
        //其他容器组件不支持clone操作
        return null;
      }
    },

    moveUpWidget(parentList, indexOfParentList) {
      if (parentList) {
        if (indexOfParentList === 0) {
          this.vueInstance.$message(
            this.vueInstance.i18nt("designer.hint.moveUpFirstChildHint")
          );
          return;
        }

        let tempWidget = parentList[indexOfParentList];
        parentList.splice(indexOfParentList, 1);
        parentList.splice(indexOfParentList - 1, 0, tempWidget);
      }
    },

    moveDownWidget(parentList, indexOfParentList) {
      if (parentList) {
        if (indexOfParentList === parentList.length - 1) {
          this.vueInstance.$message(
            this.vueInstance.i18nt("designer.hint.moveDownLastChildHint")
          );
          return;
        }

        let tempWidget = parentList[indexOfParentList];
        parentList.splice(indexOfParentList, 1);
        parentList.splice(indexOfParentList + 1, 0, tempWidget);
      }
    },

    copyNewFieldWidget(origin) {
      let newWidget = deepClone(origin);
      let tempId = generateId();
      newWidget.id = newWidget.type.replace(/-/g, "") + tempId;
      //console.log('test id===', newWidget.id)
      newWidget.options.name = newWidget.id;
      newWidget.options.label =
        newWidget.options.label || newWidget.type.toLowerCase();

      delete newWidget.displayName;
      return newWidget;
    },

    copyNewContainerWidget(origin) {
      let newCon = deepClone(origin);
      newCon.id =
        newCon.options.name || newCon.type.replace(/-/g, "") + generateId();
      newCon.options.name = newCon.id;
      if (newCon.type === "grid") {
        let newCol = deepClone(this.getContainerByType("grid-col"));
        let tmpId = generateId();
        newCol.id = "grid-col-" + tmpId;
        newCol.options.name = "gridCol" + tmpId;
        newCon.cols.push(newCol);
        //
        newCol = deepClone(newCol);
        tmpId = generateId();
        newCol.id = "grid-col-" + tmpId;
        newCol.options.name = "gridCol" + tmpId;
        newCon.cols.push(newCol);
      } else if (newCon.type === "table") {
        let newRow = { cols: [] };
        newRow.id = "table-row-" + generateId();
        newRow.merged = false;
        let newCell = deepClone(this.getContainerByType("table-cell"));
        newCell.id = "table-cell-" + generateId();
        newCell.options.name = newCell.id;
        newCell.merged = false;
        newCell.options.colspan = 1;
        newCell.options.rowspan = 1;
        newRow.cols.push(newCell);
        newCon.rows.push(newRow);
      } else if (newCon.type === "tab") {
        let newTabPane = deepClone(this.getContainerByType("tab-pane"));
        newTabPane.id = "tab-pane-" + generateId();
        newTabPane.options.name = "tab1";
        newTabPane.options.title = "标签页1";
        newCon.tabs.push(newTabPane);
      } else if (newCon.type === "radio-group") {
        let newRadioPane = deepClone(this.getContainerByType("radio"));
        newRadioPane.id = "radio-" + generateId();
        newRadioPane.options.name = "radio1";
        newRadioPane.options.label = "1";
        newRadioPane.options.title = "单选1";
        newCon.radios.push(newRadioPane);
      }
      delete newCon.displayName;
      return newCon;
    },

    addContainerByDbClick(container) {
      let newCon = this.copyNewContainerWidget(container);
      this.widgetList.push(newCon);
      console.log("newCon===", newCon, this.widgetList);
      this.setSelected(newCon);
    },

    addFieldByDbClick(widget) {
      let newWidget = this.copyNewFieldWidget(widget);
      if (!!this.selectedWidget && this.selectedWidget.type === "tab") {
        //获取当前激活的tabPane
        let activeTab = this.selectedWidget.tabs[0];
        this.selectedWidget.tabs.forEach((tabPane) => {
          if (tabPane.options.active) {
            activeTab = tabPane;
          }
        });

        !!activeTab && activeTab.widgetList.push(newWidget);
      } else if (!!this.selectedWidget && !!this.selectedWidget.widgetList) {
        this.selectedWidget.widgetList.push(newWidget);
      } else {
        this.widgetList.push(newWidget);
      }

      this.setSelected(newWidget);
      this.emitHistoryChange();
    },

    deleteColOfGrid(gridWidget, colIdx) {
      if (!!gridWidget && !!gridWidget.cols) {
        gridWidget.cols.splice(colIdx, 1);
      }
    },

    addNewColOfGrid(gridWidget) {
      const cols = gridWidget.cols;
      let newGridCol = deepClone(this.getContainerByType("grid-col"));
      let tmpId = generateId();
      newGridCol.id = "grid-col-" + tmpId;
      newGridCol.options.name = "gridCol" + tmpId;
      if (!!cols && cols.length > 0) {
        let spanSum = 0;
        cols.forEach((col) => {
          spanSum += col.options.span;
        });

        if (spanSum >= 24) {
          console.log("列栅格之和超出24");
          gridWidget.cols.push(newGridCol);
        } else {
          newGridCol.options.span = 24 - spanSum > 12 ? 12 : 24 - spanSum;
          gridWidget.cols.push(newGridCol);
        }
      } else {
        gridWidget.cols = [newGridCol];
      }
    },

    // 注意：后期组件全部完成后，做统一事件处理！！！
    // 单选按钮组新增
    addRadiosPaneOfTabs(tabsWidget) {
      const tabPanes = tabsWidget.radios;
      let newTabPane = deepClone(this.getContainerByType("radio"));
      newTabPane.id = "radio-" + generateId();
      newTabPane.options.name = newTabPane.id;
      newTabPane.options.label = tabPanes.length + 1;
      newTabPane.options.title = "单选项" + (tabPanes.length + 1);
      tabPanes.push(newTabPane);
    },
    // 单选按钮组禁用事件处理
    disabledRadiosPaneOfTabs(tabsWidget, tpIdx, disabled) {
      tabsWidget.radios[tpIdx].options.disabled = disabled.value;
    },
    // 单选按钮组隐藏事件处理
    hiddenRadiosPaneOfTabs(tabsWidget, tpIdx, hidden) {
      tabsWidget.radios[tpIdx].options.hidden = hidden.value;
      if (hidden.value) {
        // 不可看也需要禁用
        tabsWidget.radios[tpIdx].options.disabled = true;
      }
    },
    // 单选按钮组删除事件处理
    deleteRadiosPaneOfTabs(tabsWidget, tpIdx) {
      tabsWidget.radios.splice(tpIdx, 1);
    },

    // 注意：后期组件全部完成后，做统一事件处理！！！
    // 复选按钮组新增
    addCheckboxsPaneOfTabs(tabsWidget) {
      const tabPanes = tabsWidget.checkboxs;
      let newTabPane = deepClone(this.getContainerByType("checkbox"));
      newTabPane.id = "checkbox-" + generateId();
      newTabPane.options.name = newTabPane.id;
      newTabPane.options.label = tabPanes.length + 1;
      newTabPane.options.title = "复选项" + (tabPanes.length + 1);
      tabPanes.push(newTabPane);
    },
    // 复选按钮组禁用事件处理
    disabledCheckboxsPaneOfTabs(tabsWidget, tpIdx, disabled) {
      tabsWidget.checkboxs[tpIdx].options.disabled = disabled.value;
    },
    // 复选按钮组隐藏事件处理
    hiddenCheckboxsPaneOfTabs(tabsWidget, tpIdx, hidden) {
      tabsWidget.checkboxs[tpIdx].options.hidden = hidden.value;
      if (hidden.value) {
        // 不可看也需要禁用
        tabsWidget.checkboxs[tpIdx].options.disabled = true;
      }
    },
    // 复选按钮组删除事件处理
    deleteCheckboxsPaneOfTabs(tabsWidget, tpIdx) {
      tabsWidget.checkboxs.splice(tpIdx, 1);
    },

    // 标签页新增事件处理
    addTabPaneOfTabs(tabsWidget) {
      const tabPanes = tabsWidget.tabs;
      let newTabPane = deepClone(this.getContainerByType("tab-pane"));
      newTabPane.id = "tab-pane-" + generateId();
      newTabPane.options.name = newTabPane.id;
      newTabPane.options.title = "标签页" + (tabPanes.length + 1);
      tabPanes.push(newTabPane);
    },
    // 标签页隐藏事件处理
    hiddenTabPaneOfTabs(tabsWidget, tpIdx, hidden) {
      tabsWidget.tabs[tpIdx].options.hidden = hidden.value;
    },
    // 标签页删除事件处理
    deleteTabPaneOfTabs(tabsWidget, tpIdx) {
      tabsWidget.tabs.splice(tpIdx, 1);
    },

    emitEvent(evtName, evtData) {
      //用于兄弟组件发射事件
      eventBus.$emit(evtName, evtData);
    },

    handleEvent(evtName, callback) {
      //用于兄弟组件接收事件
      eventBus.$on(evtName, (data) => callback(data));
    },

    setCssClassList(cssClassList) {
      this.cssClassList = cssClassList;
    },

    getCssClassList() {
      return this.cssClassList;
    },

    registerFormWidget(formWidget) {
      this.formWidget = formWidget;
    },

    initHistoryData(funId) {
      this.funId = funId;
      this.dataCenter = this.formCenterStore.getDataCenter(funId); //获取表单中心数据   hzq
      this.loadSubFormContent();
      this.historyData.index++;
      this.historyData.steps[this.historyData.index] = {
        widgetList: deepClone(this.widgetList),
        formConfig: deepClone(this.formConfig),
      };
    },

    emitHistoryChange() {
      if (this.historyData.index === this.historyData.maxStep - 1) {
        this.historyData.steps.shift();
      } else {
        this.historyData.index++;
      }

      this.historyData.steps[this.historyData.index] = {
        widgetList: deepClone(this.widgetList),
        formConfig: deepClone(this.formConfig),
      };

      if (this.historyData.index < this.historyData.steps.length - 1) {
        this.historyData.steps = this.historyData.steps.slice(
          0,
          this.historyData.index + 1
        );
      }
    },

    saveCurrentHistoryStep() {
      this.historyData.steps[this.historyData.index] = deepClone({
        widgetList: this.widgetList,
        formConfig: this.formConfig,
      });
    },

    undoHistoryStep() {
      if (this.historyData.index !== 0) {
        this.historyData.index--;
      }

      this.widgetList = deepClone(
        this.historyData.steps[this.historyData.index].widgetList
      );
      this.formConfig = deepClone(
        this.historyData.steps[this.historyData.index].formConfig
      );
    },

    redoHistoryStep() {
      if (this.historyData.index !== this.historyData.steps.length - 1) {
        this.historyData.index++;
      }

      this.widgetList = deepClone(
        this.historyData.steps[this.historyData.index].widgetList
      );
      this.formConfig = deepClone(
        this.historyData.steps[this.historyData.index].formConfig
      );
    },

    undoEnabled() {
      return this.historyData.index > 0 && this.historyData.steps.length > 0;
    },

    redoEnabled() {
      return this.historyData.index < this.historyData.steps.length - 1;
    },

    loadSubFormContent() {
      this.dataCenter.subscribe("subFormContent", (data) => {
        this.subgridList = data.map((subgrid) => {
          let subgridtpl = {
            type: "subgrid",
            category: "container",
            icon: "subgrid",
            formItemFlag: true,
            options: {
              isFunItem: false,
              name: subgrid.functionName,
              funId: subgrid.functionId,
              functionCode: subgrid.functionCode,
              label: subgrid.functionName,
              hidden: false,
              customClass: "",
            },
          };
          return {
            key: subgrid.functionId,
            displayName: subgrid.functionName,
            selected: false,
            ...subgridtpl,
          };
        });
      });
    },

    // 保存json
    saveFormContent(type, funId) {},

    //hzq  保存表头columnList
    setColumnList(list) {
      this.columnList = list;
    },
  };
}
