import { processObject } from "@/core/utils/tool";

let module = "";

let globalObject = {};
let eventMap = {};

const generateRandomId = () => Math.floor(Math.random() * 100000 + 1);
const generateDivider = (id, title) => {
  return {
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
  };
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

function generateButton(methodCode, label, belongTo) {
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
      status: "primary",
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

function generateButtonContainer(methodList, belongTo) {
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
  let addMethod = {
    methodCode: "add",
    methodName: "新增",
  };
  let combinedMethods = [
    queryMethod,
    saveMethod,
    deleteMethod,
    addMethod,
  ].filter(Boolean);
  combinedMethods.map((method) => {
    eventMap[`${method.methodCode}.onClick`] = `${method.methodCode}.onClick`;
    if (method.methodCode.toLowerCase().includes("query")) {
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
    } else if (method.methodCode.toLowerCase().includes("save")) {
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
    } else if (method.methodCode.toLowerCase().includes("delete")) {
      Object.assign(
        globalObject,
        processObject({
          [`${method.methodCode}.onClick`]: `function() {
    this.comUtils.deleteGridData("${belongTo}");
  }`,
        })
      );
    } else if (method.methodCode.toLowerCase().includes("add")) {
      Object.assign(
        globalObject,
        processObject({
          [`${method.methodCode}.onClick`]: `function() {
    this.comUtils.addGridData("${belongTo}");
  }`,
        })
      );
    }
  });

  const cols = combinedMethods.map((method) => {
    return generateGridColumn(
      generateRandomId(),
      [generateButton(method.methodCode, method.methodName, belongTo)],
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
  return (
    columnList
      // .filter((x) => !!x.gridColumn)
      .map((column) => {
        // 基础列配置
        const columnConfig = {
          field: column.columnCode,
          title: column.columnName,
          width: column.width || 200, // 默认宽度为200px
          editable: !!column.modifyEdit,
          visible: !!column.gridColumn,
          editRenderName: getEditRender(column), // 添加编辑渲染器
        };

        return columnConfig;
      })
  );
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
    },
    id: `dataDialog`,
  };
}

function generateTree(treeList, belongTo = "userTable") {
  let id = generateRandomId();
  let data = treeList[0];
  eventMap[`${"tree" + id}.onMounted`] = `${"tree" + id}.onMounted`;
  Object.assign(
    globalObject,
    processObject({
      [`${"tree" + id}.onMounted`]: `function() {
   this.comUtils.loadTreeData("${data.objectCode}","${"tree" + id}")
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

  const { columnList, methodList, formConfig, queryList } = inputData;

  const belong = "defaultTable";

  const widgetList = [
    generateDivider(generateRandomId()),
    generateGridContainer(
      [
        generateGridColumn(
          generateRandomId(),
          [generateButtonContainer(methodList, belong)],
          16
        ),
        generateGridColumn(
          generateRandomId(),
          [generateQuery(generateRandomId(), belong, queryList)],
          8
        ),
        generateGridColumn(
          generateRandomId(),
          [generateTable(columnList, belong)],
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

export function generateFormData(inputData) {}

export function generateTreeGridData(inputData) {
  if (!inputData) {
    return {};
  }

  const { columnList, methodList, formConfig, queryList, treeList } = inputData;

  const belong = "defaultTable";

  const widgetList = [
    generateDivider(generateRandomId()),
    generateGridContainer(
      [
        generateGridColumn(generateRandomId(), [generateTree(treeList)], 3),
        generateGridColumn(
          generateRandomId(),
          [
            generateGridContainer([
              generateGridColumn(
                generateRandomId(),
                [generateButtonContainer(methodList, belong)],
                16
              ),
              generateGridColumn(
                generateRandomId(),
                [generateQuery(generateRandomId(), belong, queryList)],
                8
              ),
              generateGridColumn(
                generateRandomId(),
                [generateTable(columnList, belong)],
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
  console.log(columnList);
  return {
    widgetList: widgetList,
    formConfig: Object.assign({}, formConfig, {
      globalObject, // 添加全局函数到 formConfig
      eventMap,
    }),
  };
}

export function generateTreeGridFormData(inputData) {}

export default function main(inputData, type = "grid") {
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
