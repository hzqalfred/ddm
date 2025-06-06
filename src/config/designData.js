import { processObject } from "@/core/utils/tool";
import {
  basicFields,
  containers,
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
      this.comUtils.setFormData(row, this.refList, false)
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
  }));
  let queryMethod = methods.find(
    (method) =>
      method.methodCode.toLowerCase().includes("query") ||
      method.methodName === "查询"
  );

  let saveMethod = methods.find(
    (method) =>
      method.methodCode.toLowerCase().includes("save") ||
      method.methodName === "保存"
  );
  let deleteMethod = methods.find(
    (method) =>
      method.methodCode.toLowerCase().includes("delete") ||
      method.methodName === "删除"
  );
  let addMethod =
    type == "grid"
      ? {
          methodCode: "add",
          methodName: "新增",
        }
      : null;
  let drawerMethod = drawer
    ? {
        methodCode: "drawer",
        methodName: "表单",
      }
    : null;

  let combinedMethods = [
    queryMethod,
    saveMethod,
    deleteMethod,
    addMethod,
    drawerMethod,
  ].filter(Boolean);
  let buttons = combinedMethods.map((method) => {
    eventMap[`${method.methodCode}.onClick`] = `${method.methodCode}.onClick`;

    if (method?.methodName?.includes("表单")) {
      method.status = "success";
      Object.assign(
        globalObject,
        processObject({
          [`${method.methodCode}.onClick`]: `function() {
    const data = this.refList['${belongTo || ""}'].$refs['${belongTo ||
            ""}'].getCheckboxRecords()
    if(data.length!=1) return
    this.refList.${drawer}.selRow = data[0]
    this.refList.${drawer}.$refs.fieldEditor.open()
  }`,
        })
      );
    }

    if (type == "grid") {
      if (method?.methodName?.includes("查询")) {
        method.status = "info";
        eventMap[`${belongTo}.onMounted`] = `${method.methodCode}.onClick`;
        eventMap[`${belongTo}.onPageChange`] = `${method.methodCode}.onClick`;
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    this.comUtils.loadGridData("${belongTo}");
  }`,
          })
        );
      } else if (method?.methodName?.includes("保存")) {
        method.status = "warning";
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
     const tableList = this.refList["${belongTo}"];
    const { $refs } = tableList;
    const $table = $refs["${belongTo}"];
    const insertRecords = $table.getInsertRecords();
    if(insertRecords.length !== 0){
        var treeRef = this.refList.tree_ListDept.$refs.treeRef
        var dept_id = treeRef.getCurrentNode()?.dept_id
        if(!dept_id){
          dept_id = treeRef.data[0]?.dept_id;
        }
        
        for (var i = 0; i < insertRecords.length; i++) {
          insertRecords[i].dept_id = dept_id
        }
    }
    this.comUtils.saveGridData("${belongTo}");
  }`,
          })
        );
      } else if (method?.methodName?.includes("删除")) {
        method.status = "error";
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    this.comUtils.deleteGridData("${belongTo}");
  }`,
          })
        );
      } else if (method?.methodName?.includes("新增")) {
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    this.comUtils.addGridData("${belongTo}");
  }`,
          })
        );
      }
    } else if (type == "form") {
      if (method?.methodName?.includes("查询")) {
        method.status = "info";
        eventMap[`form.onLoad`] = `${method.methodCode}.onClick`;
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    this.comUtils.loadFormData('${belongTo}');
  }`,
          })
        );
      } else if (method?.methodName?.includes("保存")) {
        method.status = "warning";
        Object.assign(
          globalObject,
          processObject({
            [`${method.methodCode}.onClick`]: `function() {
    this.comUtils.saveFormData('${belongTo}');
  }`,
          })
        );
      }
    }
    return method;
  });

  const cols = buttons.map((method) => {
    return generateGridColumn(
      generateRandomId(),
      [
        generateButton({
          methodCode: method.methodCode,
          label: method.methodName,
          belongTo,
          status: method.status,
        }),
      ],
      method.methodName?.length * 0.6 || 2 * 0.6
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
        editRenderName:column.componentName || getEditRender(column), // 添加编辑渲染器
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

function generateTree(functionCode, belongTo = "defaultTable") {
  let id = generateRandomId();
  eventMap[`${"tree" + id}.onMounted`] = `${"tree" + id}.onMounted`;
  eventMap[`${"tree" + id}.onNodeClick`] = `${"tree" + id}.onNodeClick`;
  Object.assign(
    globalObject,
    processObject({
      [`${"tree" + id}.onMounted`]: `function() {
   this.comUtils.loadTreeData("${functionCode}","${"tree" + id}")
  }`,
      [`${"tree" + id}.onNodeClick`]: `function(node) {
   const treeNode = { id: node.dept_id, path: node.dept_path }
    this.comUtils.loadGridData("${belongTo}", {},treeNode);
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

export function generateGridData(inputData) {
  if (!inputData) {
    return {};
  }

  const { baseInfo, columnList, methodList, formConfig, queryList } = inputData;

  const belongTo = "defaultTable";

  const widgetList = [
    generateDivider({ id: generateRandomId(), title: baseInfo.functionName }),
    generateGridContainer(
      [
        generateGridColumn(
          generateRandomId(),
          [generateButtonContainer({ methodList, belongTo, type: "grid" })],
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

  const widgetList = [
    generateDivider({ id: generateRandomId(), title: baseInfo.functionName }),
    generateGridContainer(
      [
        generateGridColumn(
          generateRandomId(),
          [generateTree(tree?.methodCode?.replace(".tree", ""), belongTo)],
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
    widgetList: [generateGridContainer(arr)],
  });
  const widgetList = [
    generateDivider({ id: generateRandomId(), title: baseInfo.functionName }),
    generateGridContainer(
      [
        generateGridColumn(
          generateRandomId(),
          [generateTree(tree?.methodCode?.replace(".tree", ""), belongTo)],
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
