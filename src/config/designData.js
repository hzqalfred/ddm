import { processObject } from "@/core/utils/tool";
import {
  basicFields,
  containers,
  advancedFields,
} from "@/core/components/VForm/form-designer/widget-panel/widgetsConfig";
import _ from "lodash";
let globalObject = {};
let eventMap = {};

const generateRandomId = () => Math.floor(Math.random() * 100000 + 1);
//分割线
const generateDivider = ({ id, title }) => {
  let divider = basicFields.find((x) => x.type == "divider");
  return _.merge({}, divider, {
    key: id,
    type: "divider",
    icon: "divider",
    category: "field",
    isnew: "9",
    options: {
      name: "divider" + id,
      title: title || "",
      subtitle: "",
      width: "100%",
      align: "center",
      lineColor: "#2F7DEB",
      titleColor: "#FFFFFF",
      lefticon: "",
      styleType: "5",
      hidden: false,
      customClass: "",
      label: "divider",
    },
    id: "divider" + id,
  });
};

const generateDrawer = ({ name, label = "drawer", widgetList = [] }) => {
  let id = generateRandomId();
  let drawer = containers.find((x) => x.type == "drawer");
  eventMap[`${"drawer" + id}.onShow`] = `${"drawer" + id}.onShow`;
  Object.assign(
    globalObject,
    processObject({
      [`${"drawer" + id}.onShow`]: `function() {
      var row = this.selRow;
      this.comUtils.setFormData({selRow:row,refList: this.refList, isAdd:false})
  }`,
    })
  );
  return _.merge({}, drawer, {
    key: name || "drawer" + id,
    widgetList,
    options: {
      name: name || "drawer" + id,
      title: label,
      position: "right",
      width: "80%",
      height: "40%",
    },
    id: name || "drawer" + id,
  });
};

const generateInput = ({ name, label }) => {
  let id = generateRandomId();
  let input = basicFields.find((x) => x.type == "input");

  return _.merge({}, input, {
    key: name || "input" + id,
    options: {
      name: name || "input" + id,
      label,
    },
    id: name || "input" + id,
  });
};

const generateQuery = (id, belongTo, items = []) => {
  eventMap[`${"query" + id}.onSearchClick`] = `${"query" + id}.onSearchClick`;
  Object.assign(
    globalObject,
    processObject({
      [`${"query" + id}.onSearchClick`]: `function(result) {
    this.comUtils.loadGridData({queryScheme:result,signName: '${belongTo}'})
 }`,
    })
  );
  return {
    key: id,
    type: "query",
    icon: "query",
    formItemFlag: false,
    options: {
      name: "query" + id,
      label: "query",
      belongTo: belongTo || "eltable",
      columnWidth: "200px",
      size: "",
      displayStyle: "block",
      disabled: false,
      hidden: false,
      pageAlign: "right",
      items: items,
      customClass: "",
      onCreated: "",
      onMounted: "",
      onSearchClick: "",
      defaultValue: "",
    },
    id: "query" + id,
  };
};

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

function generateUpload({ methodCode, label, methodAttribute }) {
  let upload = advancedFields.find((x) => x.type == "file-upload");
  let id = generateRandomId();
  let uploadURL = methodAttribute
    ? JSON.parse(methodAttribute)?.service || ""
    : "";
  return _.merge({}, upload, {
    key: methodCode || "upload" + id,
    options: {
      labelHidden: true,
      name: methodCode || "upload" + id,
      label,
      uploadURL,
    },
    id: methodCode || "upload" + id,
  });
}

function generateButton({ methodCode, label, belongTo, status = "primary" }) {
  return {
    key: methodCode,
    type: "button",
    icon: "button",
    category: "field",
    isnew: "9",
    options: {
      name: methodCode,
      title: label,
      belongTo: belongTo || "eltable",
      mode: "button",
      float: "flex-start",
      comsize: "",
      status,
      round: false,
      circle: false,
      icon: "",
      prefixTooltip: "",
      suffixTooltip: "",
      loading: false,
      comdisabled: false,
      hidden: false,
      customClass: "",
      onCreated: "",
      onMounted: "",
      onClick: "",
      label: "button",
    },
    id: methodCode,
  };
}

function generateGridContainer(cols, name = "grid") {
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

function generateButtonContainer({ methodList, belongTo, type, drawer }) {
  let methods = methodList.map((x) => ({
    methodCode: x.methodCode.replace(".", "_"),
    methodName: x.methodName,
    methodAttribute: x.methodAttribute,
  }));
  let queryMethods = methods.filter((method) =>
    method.methodName.includes("查询")
  );
  let saveMethod = methods.filter((method) => method.methodName === "保存");
  let deleteMethod = methods.filter((method) => method.methodName === "删除");
  let fileMethod = methods.filter((method) => method.methodName === "附件");
  let addMethod =
    type !== "form"
      ? [
          {
            methodCode: "add",
            methodName: "新增",
            methodAttribute: '{"belongTo":"grid"} ',
          },
        ]
      : [];
  let drawerMethod = drawer
    ? {
        methodCode: "drawer",
        methodName: "表单",
      }
    : null;

  if (drawerMethod) {
    eventMap[`${belongTo}.onDBLClick`] = `${belongTo}.onDBLClick`;
    Object.assign(
      globalObject,
      processObject({
        [`${belongTo}.onDBLClick`]: `function(row, column) {
    this.refList.${drawer}.selRow = row
    this.refList.${drawer}.$refs.fieldEditor.open()
  }`,
      })
    );
  }

  let combinedMethods = [
    ...queryMethods,
    ...saveMethod,
    ...deleteMethod,
    ...addMethod,
    // drawerMethod,
    ...fileMethod,
  ].filter(Boolean);
  let buttons = combinedMethods.map((method) => {
    // let belong = JSON.parse(method.methodAttribute)?.belongTo || "grid";
    if (type == "grid") {
      eventMap[`${method.methodCode}.onClick`] = `${method.methodCode}.onClick`;
      if (method?.methodName?.includes("查询")) {
        method.status = "info";
        eventMap[`${belongTo}.onMounted`] = `${method.methodCode}.onClick`;
        eventMap[`${belongTo}.onPageChange`] = `${method.methodCode}.onClick`;
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    ${method.methodAttribute ? "const attr = " + method.methodAttribute : ""}
    ${
      method.methodAttribute
        ? "let params = Object.assign({ signName:'" + belongTo + "' },attr)"
        : "let params = { signName: '" + belongTo + "' }"
    }
    this.comUtils.loadGridData(params);
  }`,
          })
        );
      } else if (method?.methodName?.includes("保存")) {
        method.status = "warning";
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    ${method.methodAttribute ? "const attr = " + method.methodAttribute : ""}
    ${
      method.methodAttribute
        ? "let params = Object.assign({ signName:'" + belongTo + "' },attr)"
        : "let params = { signName: '" + belongTo + "' }"
    }
    const tableList = this.refList["${belongTo}"];
    const { $refs } = tableList;
    const $table = $refs["${belongTo}"];
    const insertRecords = $table.getInsertRecords();
    this.comUtils.saveGridData(params);
  }`,
          })
        );
      } else if (method?.methodName?.includes("删除")) {
        method.status = "error";
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    ${method.methodAttribute ? "const attr = " + method.methodAttribute : ""}
    ${
      method.methodAttribute
        ? "let params = Object.assign({ signName:'" + belongTo + "' },attr)"
        : "let params = { signName: '" + belongTo + "' }"
    }
    this.comUtils.deleteGridData(params);
  }`,
          })
        );
      } else if (method?.methodName?.includes("新增")) {
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    this.comUtils.addGridData({signName:"${belongTo}"});
  }`,
          })
        );
      }
    } else if (type == "form") {
      eventMap[`${method.methodCode}.onClick`] = `${method.methodCode}.onClick`;
      if (method?.methodName?.includes("查询")) {
        method.status = "info";
        eventMap[`form.onLoad`] = `${method.methodCode}.onClick`;
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    ${method.methodAttribute ? "const attr = " + method.methodAttribute : ""}
    ${
      method.methodAttribute
        ? "let params = Object.assign({ signName:'" + belongTo + "' },attr)"
        : "let params = { signName: '" + belongTo + "' }"
    }
    this.comUtils.loadFormData(params);
  }`,
          })
        );
      } else if (method?.methodName?.includes("保存")) {
        method.status = "warning";
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    ${method.methodAttribute ? "const attr = " + method.methodAttribute : ""}
    ${
      method.methodAttribute
        ? "let params = Object.assign({ signName:'" + belongTo + "' },attr)"
        : "let params = { signName: '" + belongTo + "' }"
    }
    this.comUtils.saveFormData(params);
  }`,
          })
        );
      } else if (method?.methodName?.includes("删除")) {
        method.status = "error";
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    ${method.methodAttribute ? "const attr = " + method.methodAttribute : ""}
    ${
      method.methodAttribute
        ? "let params = Object.assign({ signName:'" + belongTo + "' },attr)"
        : "let params = { signName: '" + belongTo + "' }"
    }
    this.comUtils.deleteFormData(params);
  }`,
          })
        );
      }
    } else if (type == "drawer") {
      method.methodCode = `drawer_${method.methodCode}`;
      eventMap[`${method.methodCode}.onClick`] = `${method.methodCode}.onClick`;
      if (method?.methodName?.includes("新增")) {
        method.status = "primary";
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
         ${"let params = {isAdd:true, signName: '" + drawer + "' }"}
    this.comUtils.addFormData(params);
  }`,
          })
        );
      } else if (method?.methodName?.includes("保存")) {
        method.status = "warning";
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    ${method.methodAttribute ? "const attr = " + method.methodAttribute : ""}
    ${
      method.methodAttribute
        ? "let params = Object.assign({ signName:'" +
          drawer +
          "', gridName:'" +
          belongTo +
          "' },attr)"
        : "let params = { signName: '" + belongTo + "' }"
    }
    this.comUtils.saveFormData(params);
  }`,
          })
        );
      } else if (method?.methodName?.includes("删除")) {
        method.status = "error";
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    ${method.methodAttribute ? "const attr = " + method.methodAttribute : ""}
    ${
      method.methodAttribute
        ? "let params = Object.assign({ signName:'" +
          drawer +
          "', gridName:'" +
          belongTo +
          "' },attr)"
        : "let params = { signName: '" + belongTo + "' }"
    }
    this.comUtils.deleteFormData(params);
  }`,
          })
        );
      }
    }
    return method;
  });

  const cols = buttons.map((method) => {
    let attr = JSON.parse(method?.methodAttribute || "{}");
    let label = attr?.name || method.methodName.replace(/:([^,]*)/g, "");
    return generateGridColumn(
      generateRandomId(),
      method.methodName == "附件"
        ? [
            generateUpload({
              methodCode: method.methodCode,
              label: label,
              methodAttribute: method.methodAttribute,
            }),
          ]
        : [
            generateButton({
              methodCode: method.methodCode,
              label: label,
              belongTo,
              status: method.status,
            }),
          ],
      label?.length * 0.6 || 2 * 0.6
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

  return editConfig.name;
}

function generateTableColumns(columnList) {
  return columnList
    .filter((x) => !!x.gridColumn)
    .map((column) => {
      // 基础列配置
      const columnConfig = {
        fixed: column.fixedColumn,
        field: column.columnCode,
        title: column.columnName,
        width: column.width || 200, // 默认宽度为200px
        editable: !!column.modifyEdit,
        visible: !!column.gridColumn,
        align: column.align,
        editRenderName: column.componentName || getEditRender(column), // 添加编辑渲染器
      };

      return columnConfig;
    });
}

function generateTable(columnList, belongTo) {
  // 定义表格事件处理函数
  const tableEvents = {
    // 选择变化事件
    // 可以添加更多事件...
  };
  return {
    key: belongTo || "eltable",
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
      name: belongTo || "eltable",
      label: "表格",
      hidden: false,
      stripe: true,
      border: true,
      eltableHeight: "500",
      virtual: false,
      paginate: true,
      pageList: 10,
      pageUnit: "10,20,30,50",
      maxHeight: "500",
      showIndex: true,
      selectabled: true,
      columns: generateTableColumns(columnList),
      isSelectType: "checkbox",
      operate: [],
      sortBy: [],
      validRules: {},
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
      onMounted: "",
      required: false,
      cpType: "eltable",
      type: "eltable",
    },
    selected: false,
    id: belongTo || "eltable",
  };
}

function generateTree(service, belongTo = "defaultTable", tree) {
  let id = generateRandomId();
  eventMap[`${"tree" + id}.onMounted`] = `${"tree" + id}.onMounted`;
  eventMap[`${"tree" + id}.onNodeClick`] = `${"tree" + id}.onNodeClick`;
  Object.assign(
    globalObject,
    processObject({
      [`${"tree" + id}.onMounted`]: `function() {
   this.comUtils.loadTreeData({service:"${service}",signName:"${"tree" + id}"})
  }`,
      [`${"tree" + id}.onNodeClick`]: `function(node) {
   ${tree.methodAttribute ? "const attr = " + tree.methodAttribute : ""}
   ${
     tree.methodAttribute
       ? "let params = Object.assign({ signName:'" +
         belongTo +
         "',treeNode:{ id: node.dept_id, path: node.dept_path } },attr)"
       : "let params = { signName: '" +
         belongTo +
         "',treeNode:{ id: node.dept_id, path: node.dept_path }  }"
   }
   delete params.service
    this.comUtils.loadGridData(params);
  }`,
    })
  );
  return {
    key: "tree" + id,
    type: "tree",
    icon: "tree",
    formItemFlag: true,
    category: "field",
    isnew: "9",
    options: {
      name: "tree" + id,
      label: "tree",
      belongTo: belongTo,
      isFilter: true,
      filterWidth: 165,
      filterTip: "输入关键字进行过滤",
      comsize: "",
      data: [],
      nodeConfigIsHover: true,
      nodeConfigIsCurrent: true,
      nodeConfigTrigger: "default",
      indent: 20,
      height: 0,
      expandtype: true,
      titleField: "dept_name",
      keyField: "dept_id",
      childrenField: "children",
      trigger: "default",
      showIcon: true,
      iconOpen: "",
      iconClose: "",
      accordion: false,
      showLine: false,
      showRadioCheckbox: "",
      highlight: true,
      strictly: true,
      strict: true,
      hidden: false,
      customClass: "",
      onCreated: "",
      onMounted: "",
      onNodeClick: "",
      onNodeCheck: "",
      onCheckChange: "",
    },
    id: "tree" + id,
  };
}

export function generateGridData(inputData, flag) {
  if (!inputData) {
    return {};
  }

  const { baseInfo, columnList, methodList, formConfig, queryList } = inputData;

  const belongTo = "defaultTable";
  let arr = columnList
    .filter((x) => x.gridColumn)
    .map((x) => {
      return generateGridColumn(
        generateRandomId(),
        [generateInput({ label: x.columnName, name: x.columnCode })],
        24 / baseInfo.formColumnNums
      );
    });
  let drawer = flag
    ? generateDrawer({
        label: baseInfo.functionName || "",
        widgetList: [generateGridContainer(arr)],
      })
    : null;

  const widgetList = [
    generateDivider({ id: generateRandomId(), title: baseInfo.functionName }),
    generateGridContainer(
      [
        generateGridColumn(
          generateRandomId(),
          [
            generateButtonContainer({
              methodList,
              belongTo,
              type: "grid",
              drawer: drawer && drawer.id,
            }),
          ],
          16
        ),
        generateGridColumn(
          generateRandomId(),
          [generateQuery(generateRandomId(), belongTo, queryList)],
          8
        ),
        generateGridColumn(
          generateRandomId(),
          [generateTable(columnList, belongTo)],
          24
        ),
      ],
      "grid"
    ),
    drawer || {},
  ];
  console.log(columnList);
  return {
    widgetList: widgetList,
    formConfig: Object.assign({}, formConfig, {
      globalObject, // 添加全局函数到 formConfig
      eventMap,
    }),
  };
}

export function generateFormData(inputData) {
  if (!inputData) {
    return {};
  }
  const belongTo = "defaultForm";
  const { baseInfo, columnList, methodList, formConfig, queryList } = inputData;

  let arr = columnList
    .filter((x) => x.gridColumn)
    .map((x) => {
      return generateGridColumn(
        generateRandomId(),
        [generateInput({ label: x.columnName, name: x.columnCode })],
        24 / baseInfo.formColumnNums
      );
    });
  const widgetList = [
    generateDivider({ id: generateRandomId(), title: baseInfo.functionName }),
    generateButtonContainer({ methodList, belongTo, type: "form" }),
    generateGridContainer(arr, belongTo),
  ];
  return {
    widgetList: widgetList,
    formConfig: Object.assign({}, formConfig, {
      globalObject, // 添加全局函数到 formConfig
      eventMap,
    }),
  };
}

export function generateTreeGridData(inputData) {
  if (!inputData) {
    return {};
  }

  const { baseInfo, columnList, methodList, formConfig, queryList } = inputData;

  const belongTo = "defaultTable";
  let tree = methodList.find((x) => x.methodName == "树形");
  let url = tree ? JSON.parse(tree.methodAttribute)?.service || "" : "";

  const widgetList = [
    generateDivider({ id: generateRandomId(), title: baseInfo.functionName }),
    generateGridContainer(
      [
        generateGridColumn(
          generateRandomId(),
          tree ? [generateTree(url, belongTo, tree)] : [],
          3
        ),
        generateGridColumn(
          generateRandomId(),
          [
            generateGridContainer([
              generateGridColumn(
                generateRandomId(),
                [
                  generateButtonContainer({
                    methodList,
                    belongTo,
                    type: "grid",
                  }),
                ],
                16
              ),
              generateGridColumn(
                generateRandomId(),
                [generateQuery(generateRandomId(), belongTo, queryList)],
                8
              ),
              generateGridColumn(
                generateRandomId(),
                [generateTable(columnList, belongTo)],
                24
              ),
            ]),
          ],
          21
        ),
      ],
      "grid"
    ),
  ];
  return {
    widgetList: widgetList,
    formConfig: Object.assign({}, formConfig, {
      globalObject, // 添加全局函数到 formConfig
      eventMap,
    }),
  };
}

export function generateTreeGridFormData(inputData) {
  if (!inputData) {
    return {};
  }

  const { baseInfo, columnList, methodList, formConfig, queryList } = inputData;

  const belongTo = "defaultTable";
  let tree = methodList.find((x) => x.methodName == "树形");
  let url = tree ? JSON.parse(tree.methodAttribute)?.service || "" : "";
  let arr = columnList
    .filter((x) => x.gridColumn)
    .map((x) => {
      return generateGridColumn(
        generateRandomId(),
        [generateInput({ label: x.columnName, name: x.columnCode })],
        24 / baseInfo.formColumnNums
      );
    });
  let drawer = generateDrawer({
    label: baseInfo.functionName || "",
    widgetList: [generateGridContainer(arr)],
  });
  drawer.widgetList.unshift(
    generateButtonContainer({
      methodList,
      belongTo,
      type: "drawer",
      drawer: drawer.id,
    })
  );
  const widgetList = [
    generateDivider({ id: generateRandomId(), title: baseInfo.functionName }),
    generateGridContainer(
      [
        generateGridColumn(
          generateRandomId(),
          tree ? [generateTree(url, belongTo, tree)] : [],
          3
        ),
        generateGridColumn(
          generateRandomId(),
          [
            generateGridContainer([
              generateGridColumn(
                generateRandomId(),
                [
                  generateButtonContainer({
                    methodList,
                    belongTo,
                    type: "grid",
                    drawer: drawer.id,
                  }),
                ],
                16
              ),
              generateGridColumn(
                generateRandomId(),
                [generateQuery(generateRandomId(), belongTo, queryList)],
                8
              ),
              generateGridColumn(
                generateRandomId(),
                [generateTable(columnList, belongTo)],
                24
              ),
            ]),
          ],
          21
        ),
      ],
      "grid"
    ),
    drawer,
  ];

  return {
    widgetList: widgetList,
    formConfig: Object.assign({}, formConfig, {
      globalObject, // 添加全局函数到 formConfig
      eventMap,
    }),
  };
}

export default function main(inputData, type = "grid") {
  globalObject = {};
  eventMap = {};
  if (type === "form") return generateFormData(inputData);
  if (type === "grid") return generateGridData(inputData);
  if (type === "grid-form") return generateGridData(inputData, true);
  if (type === "tree-grid") return generateTreeGridData(inputData);
  if (type === "tree-grid-form") return generateTreeGridFormData(inputData);
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
