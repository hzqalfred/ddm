const girdTableId = Math.floor(Math.random() * 100000 + 1);
export const containers = [
  {
    type: "grid",
    category: "container",
    icon: "grid",
    cols: [],
    options: {
      name: "",
      hidden: false,
      gutter: 12,
      colHeight: null, //栅格列统一高度属性，用于解决栅格列设置响应式布局浮动后被挂住的问题！！
      customClass: "", //自定义css类名
    },
  },
  {
    type: "table",
    category: "container",
    icon: "table",
    rows: [],
    options: {
      name: "",
      hidden: false,
      customClass: "", //自定义css类名
    },
  },

  {
    type: "page",
    category: "container",
    icon: "page",
    widgetList: [],
    options: {
      name: "",
      hidden: false,
      customClass: "", //自定义css类名
    },
  }, //hzq

  // {// tabs
  //   type: "form",
  //   category: "container",
  //   icon: "page",
  //   widgetList: [],
  //   options: {
  //     name: "",
  //     hidden: false,
  //     customClass: "", //自定义css类名
  //   },
  // }, //hzq

  {
    type: "tab",
    category: "container",
    icon: "tab",
    isnew: "9",
    tabs: [],
    options: {
      name: "",
      hidden: false,
      customClass: "",
      tabType: "", // 标签页风：格默认，卡片，边框背景卡片，圆角边框背景卡片
      tabPadding: "false", // 是否带间距
      tabHeight: 0, // 内容区域固定高度，0为自适应
    },
  },
  {
    type: "dialog",
    category: "container",
    icon: "dialog",
    isnew: "1",
    widgetList: [],
    options: {
      name: "",
      label: "",
      dialogWidth: "600px",
      sourceData: "", // 源数据
      targetData: "", // 目标数据
      fullScreen: false,
      showClose: true,
      showModal: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      center: false,
      comfirmButtonText: "",
      hideComfirm: false,
      cancelButtonText: "",
      hideCancel: false,
      hidden: false,
      customClass: "", //自定义css类名
      //-------------------
      onOkButtonClick: "",
      onCancelButtonClick: "",
      onDialogBeforeClose: "",
      onDialogOpened: "",
      onMounted: "",
    },
  }, //hzq
  // {
  //   type: "drawer",
  //   category: "container",
  //   icon: "drawer",
  //   widgetList: [],
  //   options: {
  //     name: "",
  //     label: "",
  //     width: "",
  //     showClose: true,
  //     showModal: true,
  //     closeOnClickModal: false,
  //     closeOnPressEscape: false,
  //     direction: "",
  //     readonly: false,
  //     disabled: false,
  //     comfirmButtonText: "",
  //     hideComfirm: false,
  //     cancelButtonText: "",
  //     hideCancel: false,
  //     hidden: false,
  //     customClass: "", //自定义css类名
  //     onMounted: "",
  //   },
  // }, //hzq

  // 子项
  {
    type: "tab-pane",
    category: "container",
    icon: "tab-pane",
    internal: true,
    widgetList: [],
    options: {
      name: "",
      title: "",
      icon: "", // 页签前缀图标
      titleWidth: "", // 标题宽度
      titleAlign: "", // 对齐方式
      isPreload: "true", // 预加载页签
      hidden: false, // 页签显隐状态
      active: false,
      disabled: false,
      // selectTab: "", // 选中页签
      customClass: "", //自定义css类名
    },
  },
  {
    type: "radio",
    category: "container",
    icon: "radio",
    internal: true,
    formItemFlag: false,
    widgetList: [],
    options: {
      name: "",
      label: "", // 值
      title: "", // 内容
      disabled: false, // 禁用
      hidden: false, // 显隐
      customClass: "", //自定义css类名
    },
  },
  {
    type: "checkbox",
    category: "container",
    icon: "checkbox",
    internal: true,
    formItemFlag: false,
    widgetList: [],
    options: {
      name: "",
      label: "", // 值
      title: "", // 内容
      disabled: false, // 禁用
      hidden: false, // 显隐
      // indeterminate: false, // 是否不确定状态
      // checkedValue: "", // 选中时的值
      // uncheckedValue: "", // 未选中的值
      customClass: "", //自定义css类名
    },
  },
  {
    type: "grid-col",
    category: "container",
    icon: "grid-col",
    internal: true,
    widgetList: [],
    options: {
      name: "",
      hidden: false,
      span: 12,
      offset: 0,
      push: 0,
      pull: 0,
      responsive: false, //是否开启响应式布局
      md: 12,
      sm: 12,
      xs: 12,
      customClass: "", //自定义css类名
    },
  },
  {
    type: "table-cell",
    category: "container",
    icon: "table-cell",
    internal: true,
    widgetList: [],
    merged: false,
    options: {
      name: "",
      cellWidth: "",
      cellHeight: "",
      colspan: 1,
      rowspan: 1,
      wordBreak: false, //是否自动换行
      customClass: "", //自定义css类名
    },
  },
];

export const basicFields = [
  {
    type: "input",
    icon: "text-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      type: "text",
      defaultValue: "",
      placeholder: "",
      columnWidth: "200px",
      size: "",
      labelWidth: null,
      labelHidden: false,
      readonly: false,
      disabled: false,
      hidden: false,
      clearable: true,
      showPassword: false,
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      requiredMessage: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      minLength: null,
      maxLength: null,
      showWordLimit: false,
      prefixIcon: "",
      suffixIcon: "",
      appendButton: false,
      appendButtonDisabled: false,
      buttonIcon: "custom-search",
      //-------------------
      onCreated: "",
      onMounted: "",
      onInput: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
      onAppendButtonClick: "",
    },
    attrs: [
      { name: "width", title: "长度", type: "number", remark: "长度2" },
      {
        name: "defaultValue",
        title: "默认值",
        type: "text",
        remark: "默认值",
      },
      {
        name: "required",
        title: "必填",
        type: "check",
        remark: "必填",
      },
      {
        name: "requiredMessage",
        title: "必填信息",
        type: "droplist",
        remark: "必填信息",
        options: [
          {
            value: "请输入1",
            label: "请输入2",
          },
        ],
      },
      {
        name: "placeholder",
        title: "输入框占位文本",
        type: "text",
        remark: "输入框占位文本",
      },
      {
        name: "clearable",
        title: "是否可清空",
        type: "check",
        remark: "是否可清空",
      },
      {
        name: "patternCheck",
        title: "正则校验",
        type: "check",
        remark: "正则校验",
      },
      {
        name: "pattern",
        title: "正则表达式",
        type: "text",
        remark: "正则表达式",
      },
      {
        name: "patternMessage",
        title: "正则提示",
        type: "text",
        remark: "正则提示",
      },
      {
        name: "prefix-icon",
        title: "头部图标",
        type: "text",
        remark: "输入框头部图标",
      },
      {
        name: "suffix-icon",
        title: "尾部图标",
        type: "text",
        remark: "尾部图标",
      },
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
    ],
    events: [
      {
        // name: "onChange",
        // title: "变化事件",
        // remark: "变化事件",
        // params: ["event"],
      },
    ],
  },
  {
    type: "textarea",
    icon: "textarea-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      rows: 3,
      defaultValue: "",
      placeholder: "",
      columnWidth: "200px",
      size: "",
      labelWidth: null,
      labelHidden: false,
      readonly: false,
      disabled: false,
      hidden: false,
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      maxLength: null,
      showWordLimit: false,
      //-------------------
      onCreated: "",
      onMounted: "",
      onInput: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
    },
  },

  {
    type: "number",
    icon: "number-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      defaultValue: 0,
      placeholder: "",
      columnWidth: "200px",
      size: "",
      labelWidth: null,
      labelHidden: false,
      disabled: false,
      hidden: false,
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      min: -100000000000,
      max: 100000000000,
      precision: 0,
      step: 1,
      // controlsPosition: 'right',
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
    },
  },
  {
    type: "password",
    icon: "text-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      defaultValue: "",
      placeholder: "",
      columnWidth: "200px",
      size: "",
      labelWidth: null,
      labelHidden: false,
      readonly: false,
      disabled: false,
      hidden: false,
      clearable: true,
      showPassword: false,
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      minLength: null,
      maxLength: null,
      showWordLimit: false,
      prefixIcon: "",
      suffixIcon: "",
      appendButton: false,
      appendButtonDisabled: false,
      buttonIcon: "custom-search",
      //-------------------
      onCreated: "",
      onMounted: "",
      onInput: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
      onAppendButtonClick: "",
    },
  },

  {
    type: "radio-group",
    icon: "radio-field",
    category: "field",
    isnew: "9",
    formItemFlag: true,
    radios: [
      {
        type: "radio",
        category: "container",
        icon: "radio",
        internal: true,
        formItemFlag: true,
        widgetList: [],
        options: {
          name: "radio1",
          label: 1,
          title: "单选1",
          disabled: false,
          hidden: false,
          customClass: "",
        },
        id: "radio1",
      },
    ],
    options: {
      name: "",
      label: "单选框组", // 标题，后续需全改为title！
      radioType: "radio", // 风格：radio、radio-button
      strict: false, // 严格模式，选中后不能取消
      direction: "row", // 水平row、垂直column
      comsize: "", // 尺寸（空、medium、small、mini）
      gap: "0", // 选项间距
      vmodel: "", // 默认选择
      hidden: false,
      //-------------------
      customClass: "",
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onValidate: "",
    },
  },

  {
    type: "checkbox-group",
    icon: "checkbox-field",
    category: "field",
    isnew: "9",
    formItemFlag: true,
    checkboxs: [
      {
        type: "checkbox",
        category: "container",
        icon: "checkbox",
        internal: true,
        formItemFlag: false,
        widgetList: [],
        options: {
          name: "checkbox1",
          label: 1,
          title: "复选项1",
          disabled: false,
          hidden: false,
          customClass: "",
        },
        id: "checkbox1",
      },
    ],
    options: {
      name: "",
      label: "复选框组", // 逐步取消
      title: "复选框组",
      checkboxType: "checkbox", // 风格：checkbox、checkbox-button
      commax: 0, // 最大选择数量
      direction: "row", // 水平row、垂直column
      comsize: "", // 尺寸（空、medium、small、mini）
      gap: "0", // 选项间距
      vmodel: [], // 默认选择
      hidden: false,
      // labelAlign: "",
      // defaultValue: [],
      // columnWidth: "200px",
      // size: "",
      // displayStyle: "inline",
      // labelWidth: null,
      // labelHidden: false,
      // disabled: false,
      // hidden: false,
      // sourceType: "dictionary",
      // dictionary: "",
      // optionItems: [
      //   // { label: 'check 1', value: 1 },
      //   // { label: 'check 2', value: 2 },
      //   // { label: 'check 3', value: 3 }
      // ],
      // required: false,
      // requiredHint: "",
      // validation: "",
      // validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      // labelIconClass: null,
      // labelIconPosition: "rear",
      // labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onValidate: "",
    },
  },

  {
    type: "select",
    icon: "select-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      defaultValue: "",
      placeholder: "",
      columnWidth: "200px",
      size: "",
      labelWidth: null,
      labelHidden: false,
      disabled: false,
      hidden: false,
      clearable: true,
      filterable: false,
      remote: false,
      multiple: false,
      multipleLimit: 0,
      sourceType: "dictionary",
      dictionary: "",
      optionItems: [
        // { label: 'select 1', value: 1 },
        // { label: 'select 2', value: 2 },
        // { label: 'select 3', value: 3 }
      ],
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onRemoteQuery: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
    },
  },

  {
    type: "time",
    icon: "time-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      defaultValue: null,
      placeholder: "",
      columnWidth: "200px",
      size: "",
      autoFullWidth: true,
      labelWidth: null,
      labelHidden: false,
      readonly: false,
      disabled: false,
      hidden: false,
      clearable: true,
      editable: false,
      // format: 'HH:mm:ss', //时间格式
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
    },
  },

  {
    type: "time-range",
    icon: "time-range-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      defaultValue: [],
      startPlaceholder: "",
      endPlaceholder: "",
      columnWidth: "200px",
      size: "",
      autoFullWidth: true,
      labelWidth: null,
      labelHidden: false,
      readonly: false,
      disabled: false,
      hidden: false,
      clearable: true,
      editable: false,
      format: "HH:mm:ss", //时间格式
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
    },
  },

  {
    type: "date",
    icon: "date-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      type: "date",
      defaultValue: null,
      placeholder: "",
      columnWidth: "200px",
      size: "",
      autoFullWidth: true,
      labelWidth: null,
      labelHidden: false,
      readonly: false,
      disabled: false,
      hidden: false,
      clearable: true,
      multiple: false,
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
    },
  },

  {
    type: "date-range",
    icon: "date-range-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      type: "daterange",
      defaultValue: null,
      startPlaceholder: "",
      endPlaceholder: "",
      columnWidth: "200px",
      size: "",
      autoFullWidth: true,
      labelWidth: null,
      labelHidden: false,
      readonly: false,
      disabled: false,
      hidden: false,
      clearable: true,
      editable: false,
      format: "YYYY-MM-DD", //日期显示格式
      valueFormat: "YYYY-MM-DD", //日期对象格式
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
    },
  },

  {
    type: "switch",
    icon: "switch-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      defaultValue: null,
      columnWidth: "200px",
      labelWidth: null,
      labelHidden: false,
      disabled: false,
      hidden: false,
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      size: "",
      activeText: "",
      inactiveText: "",
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onValidate: "",
    },
  },

  {
    type: "rate",
    icon: "rate-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      defaultValue: null,
      columnWidth: "200px",
      labelWidth: null,
      labelHidden: false,
      disabled: false,
      hidden: false,
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      size: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onValidate: "",
    },
  },

  {
    type: "color",
    icon: "color-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      defaultValue: null,
      columnWidth: "200px",
      size: "",
      labelWidth: null,
      labelHidden: false,
      disabled: false,
      hidden: false,
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onValidate: "",
    },
  },

  {
    type: "slider",
    icon: "slider-field",
    isnew: "1",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      columnWidth: "200px",
      // showStops: true,
      size: "",
      labelWidth: null,
      labelHidden: false,
      disabled: false,
      hidden: false,
      labelHidden: false,
      // 校验信息
      required: false,
      requiredHint: "",
      validation: "",
      validationHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      min: 0,
      max: 100,
      step: 10,
      range: false,
      //vertical: false,
      height: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onValidate: "",
    },
  },

  // Tree树
  {
    type: "tree",
    icon: "tree",
    formItemFlag: true,
    category: "field",
    isnew: "9",
    options: {
      name: "",
      label: "",
      belongTo: "", // 按钮归属，绑定表格
      isFilter: true, // 是否显示搜索框
      filterWidth: 165, // 搜索框宽度
      filterTip: "输入关键字进行过滤", // 搜索框提示
      comsize: "", // 尺寸（空、medium、small、mini）
      
      // transform: "level", // 数据结构，层级结构staircase、平级结构level
      data: [
        {
          dept_id: "1",
          title: "公司",
          children: [
            {
              id: "11",
              title: "研发公司",
              children: [
                {
                  id: "111",
                  title: "研发部",
                },
              ],
            },
            {
              id: "12",
              title: "分公司",
            },
          ],
        },
      ],
      nodeConfigIsHover: true, // 当鼠标移到节点时，是否要高亮当前节点
      nodeConfigIsCurrent: true, // 当鼠标点击节点时，是否要高亮当前节点
      nodeConfigTrigger: "default", // 触发方式，支持父节点（parent），子节点（child）
      indent: 20, // 树节点的缩进
      height: 0, // 树的高度
      expandtype: false, // 展开状态，默认false关闭，true展开
      titleField: "title",
      keyField: "id",
      childrenField: "children", // 层级使用
      // parentField: "parentId", // 平级使用
      trigger: "node", // 触发方式,(default、node)点击展开按钮、点击行
      showIcon: true, // 是否显示图标
      iconOpen: "", // 自定义展开后图标
      iconClose: "", // 自定义收起后图标
      accordion: false, // 是否手风琴，每次只能展开一个
      showLine: false, // 是否显示连接线
      showRadioCheckbox: "", // 选择模式，Radio、Checkbox、不显示
      highlight: true, // 是否高亮显示
      strictly: true, // 复选框节点不关联
      isCheckNodeKeys: false, // 是否使用checkNodeKeys
      checkNodeKeysSync: [], // 同步选中的节点
      strict: true, // 严选模式
      // labelAlign: "",
      // isCheckBox: false,
      // labelWidth: null,
      // labelHidden: false,
      hidden: false,
      // optionItems: [],
      //-------------------
      customClass: "", //自定义css类名
      //-------------------
      onCreated: "",
      onMounted: "",
      onNodeClick: "",
      onNodeCheck: "",
      onCheckChange: "",
    },
  },
  {
    type: "static-text",
    icon: "static-text",
    // formItemFlag: false,
    category: "field",
    isnew: "9",
    options: {
      name: "",
      title: "纯文字", // 标题
      comsize: "", //尺寸（默认、中等、小型、超小）
      status: "", // 状态（空、primary、success、info、warning、error）
      icon: "", // 图标
      clickToCopy: false, // 点击复制
      // columnWidth: "200px",
      hidden: false,

      // 细处理
      fontFamily: "Arial, sans-serif", // 字体
      fontSize: "14", // 字体大小
      fontWeight: "normal", // 粗细
      fontStyle: "normal", //样式 oblique与斜体类似，但有些字体可能会有不同表现
      lineHeight: "0", // 行高
      comtextAlign: "left", // 对齐方式
      textDecoration: "none", // 装饰线。 可组合？
      textTransform: "none", // 大小写转换
      letterSpacing: "0", // 间距
      textIndent: "0", // 段落首行的缩进量
      // preWrap: false, //是否自动换行。多余了，默认字段换行
      //-------------------
      customClass: "", //自定义css类名
      //-------------------
      // onCreated: "",
      // onMounted: "",
    },
  },

  {
    type: "html-text",
    icon: "html-text",
    // formItemFlag: false,
    category: "field",
    isnew: "9",
    options: {
      name: "",
      // columnWidth: "200px",
      hidden: false,
      htmlContent: "<h1>Hello, World!</h1>",
      //-------------------
      // customClass: "", //自定义css类名
      //-------------------
      onCreated: "",
      onMounted: "",
    },
  },

  {
    type: "button",
    icon: "button",
    // formItemFlag: false,
    category: "field",
    isnew: "9",
    options: {
      name: "",
      title: "按钮", // 标题
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
      // disabled: false, // 是否禁用。会优先渲染已写独立组件，去除
      comdisabled: false, // 是否禁用
      hidden: false,
      // label: "", // vxe无此，其用title，title也为后期渲染准备
      // columnWidth: "200px", // 不设置按钮大小，根据尺寸和文字数量
      // size: "", // 会优先渲染已写独立组件，去除
      // displayStyle: "block", // 行或块元素去除，其他容器可控
      // styleType: "1", // 主题后期写，类似divider的styleType
      //-------------------
      customClass: "", //自定义css类名
      //-------------------
      onCreated: "",
      onMounted: "",
      onClick: "",
    },
  },

  // {// 按钮组考虑，其中默认新增、删除、保存、查询按钮
  //   type: "button-group",
  //   icon: "buttongroup",
  //   // formItemFlag: false,
  //   category: "field",
  //   isnew:'1',
  //   options: {
  //     isFunItem: false,
  //     scanCode: false,
  //     scanCodeSkip: false,
  //     name: "",
  //     label: "",
  //     columnWidth: "200px",
  //     size: "",
  //     displayStyle: "block",
  //     disabled: false,
  //     hidden: false,
  //     pageAlign: "left",
  //     //   sourceType: 'custom',
  //     //   dictionary: '',
  //     items: [
  //       { label: "新增", value: 1 },
  //       { label: "删除", value: 2 },
  //       { label: "保存", value: 3 },
  //       { label: "查询", value: 4 },
  //     ],
  //     type: "",
  //     //   plain: false,
  //     round: false,
  //     //   circle: false,
  //     buttonType: "default",
  //     icon: null,
  //     //-------------------
  //     customClass: "", //自定义css类名
  //     //-------------------
  //     onCreated: "",
  //     onButtonGroupClick: "",
  //     onMounted: "",
  //     //   onClick: ''
  //   },
  // },

  {
    type: "divider",
    icon: "divider",
    //formItemFlag: true,
    category: "field",
    isnew: "9",
    options: {
      name: "",
      title: "主标题", // 主标题
      subtitle: "副标题", // 副标题
      width: "100%", // 未放编辑区
      // 分割不考虑垂直
      // direction: "horizontal", // 水平horizontal、垂直vertical
      align: "center", // 文字位置 center\left\right
      lineColor: "#2F7DEB", // 配色
      titleColor: "#000000", // 标题颜色
      lefticon: "", // 图标
      styleType: "3", // 主题
      hidden: false,
      //-------------------
      customClass: "", //自定义css类名
      //-------------------
      // onCreated: "",
      // onMounted: "",
    },
  },

  {
    type: "subgrid",
    category: "container",
    icon: "subgrid",
    formItemFlag: true,
    options: {
      name: "",
      funId: "",
      label: "subgrid",
      hidden: false,
      // subgridWidth: '100%',
      customClass: "",
    },
  },

  {
    type: "universal",
    category: "container",
    icon: "subgrid",
    formItemFlag: true,
    options: {
      name: "",
      label: "universal",
      hidden: false,
      universalWidth: "100%",
      customClass: "",
    },
  },



  {
    type: "eltable",
    icon: "eltable",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      hidden: false,
      sourceType: "custom",
      dictionary: "",
      type: "",
      stripe: false,
      border: false,
      eltableHeight: "500",
      virtual: false,
      paginate: true,
      pageList: 10,
      pageUnit: "10,20,30",
      maxHeight: "500",
      showIndex: false,
      selectabled: true,
      isSelectType: "radio", // radio\checkbox
      // data: [],
      columns: [{ field: "code", title: "编码", width: 150 }],
      operate: [
        {
          label: "按钮",
          funId: "button",
          onClick: "",
        }
      ],
      sortBy: [
        {
          sortColumn: "code", // 排序字段
          sortType: "asc", // 排序类型，asc升序、desc降序
          sortPriority: 1, // 排序优先级，数字越小越优先
        }
      ],

      defaultValue: "",
      //-------------------
      customClass: "", //自定义css类名
      //-------------------
      onCreated: "",
      onMounted: "",
      //   onClick: '',
      onChange: "",
      onPageChange: "",
      onSelectionChange: "",
    },
    attrs: [
      {
        name: "columns",
        title: "表头",
        type: "column-items-editor",
        remark: "表头",
        show: true,
      },
    ],
  },
  {
    type: "grid",
    alias: "组合表格",
    category: "container",
    service: "",
    icon: "eltable",
    cols: [
      {
        type: "grid-col",
        category: "container",
        icon: "grid-col",
        internal: true,
        widgetList: [],
        options: {
          name: `eltable-grid-col-${Math.floor(Math.random() * 100000 + 1)}`,
          hidden: false,
          span: 16,
          offset: 0,
          push: 0,
          pull: 0,
          responsive: false,
          md: 12,
          sm: 12,
          xs: 12,
          customClass: "",
        },
        id: `eltable-grid-col-${Math.floor(Math.random() * 100000 + 1)}`,
      },
      {
        type: "grid-col",
        category: "container",
        icon: "grid-col",
        internal: true,
        widgetList: [
          {
            type: "query",
            icon: "query",
            formItemFlag: false,
            service: "",
            serviceMapId: girdTableId,
            options: {
              name: `eltable-query-${girdTableId}`,
              label: "query",
              columnWidth: "200px",
              size: "",
              displayStyle: "block",
              disabled: false,
              hidden: false,
              pageAlign: "right",
              items: [],
              customClass: "",
              onCreated: "",
              onMounted: "",
              onSearchClick: "",
              defaultValue: 1,
            },
            id: `eltable-query-${girdTableId}`,
          },
        ],
        options: {
          name: `eltable-grid-col-${Math.floor(Math.random() * 100000 + 1)}`,
          hidden: false,
          span: 8,
          offset: 0,
          push: 0,
          pull: 0,
          responsive: false,
          md: 12,
          sm: 12,
          xs: 12,
          customClass: "",
        },
        id: `eltable-grid-col-${Math.floor(Math.random() * 100000 + 1)}`,
      },
      {
        type: "grid-col",
        category: "container",
        icon: "grid-col",
        internal: true,
        widgetList: [
          {
            type: "eltable",
            icon: "eltable",
            formItemFlag: true,
            service: "",
            serviceMapId: girdTableId,
            options: {
              name: `eltable-${girdTableId}`,
              label: "eltable",
              hidden: false,
              stripe: true,
              border: true,
              eltableHeight: "500",
              virtual: false,
              paginate: true,
              pageList: 10,
              pageUnit: "10,20,30",
              maxHeight: "500",
              showIndex: true,
              selectabled: true,
              isSelectType: "radio", // radio\checkbox
              columns: [],
              operate: [],
              defaultValue: "",
              customClass: "",
              onCreated: "",
              onMounted: "",
              onChange: "",
              onPageChange: "",
              onSelectionChange: "",
            },
            attrs: [
              {
                name: "columns",
                title: "表头",
                type: "column-items-editor",
                remark: "表头",
                show: true,
              },
            ],
            id: `eltable-${girdTableId}`,
          },
        ],
        options: {
          name: `eltable-grid-col-${Math.floor(Math.random() * 100000 + 1)}`,
          hidden: false,
          span: 24,
          offset: 0,
          push: 0,
          pull: 0,
          responsive: false,
          md: 12,
          sm: 12,
          xs: 12,
          customClass: "",
        },
        id: `eltable-grid-col-${Math.floor(Math.random() * 100000 + 1)}`,
      },
    ],
    options: {
      hidden: false,
      gutter: 12,
      colHeight: null, //栅格列统一高度属性，用于解决栅格列设置响应式布局浮动后被挂住的问题！！
      customClass: "", //自定义css类名
    },
    id: `grid-${girdTableId}`,
    serviceMapId: girdTableId,
    formConfig: {
      globalObject: {
        [`eltable-query-${girdTableId}.onSearchClick`]: `function(result) {
          console.log(result);
          console.log(this.getGlobalDsv())
          let dsv = this.getGlobalDsv()
          let service = this.formConfig.serviceMap && this.formConfig.serviceMap[this.field.serviceMapId] || ''
          this.execRequest(service, {
            moduleName: dsv?.param?.moduleName || '',
            moduleCode: dsv?.param?.moduleCode || '',
            functionCode: dsv?.param?.functionCode || '',
            searchItems: result,
            pageSize:10,
            pageNum:1
          }).then(res=>{
            console.log(res)
              try {
               this.refList['eltable-${girdTableId}'].setData(res.data.rows,res.data.total)
              } catch (e) {}
          })
        }`,
        [`eltable-${girdTableId}.onMounted`]: `function() {
          console.log(this);
          let dsv = this.getGlobalDsv()
          let service = this.formConfig.serviceMap && this.formConfig.serviceMap[this.field.serviceMapId] || ''
          this.execRequest(service, {
            moduleName: dsv?.param?.moduleName || '',
            moduleCode: dsv?.param?.moduleCode || '',
            functionCode: dsv?.param?.functionCode || '',
            pageSize:10,
            pageNum:1
          }).then(res=>{
            console.log(res)
              try {
               this.refList['eltable-${girdTableId}'].setData(res.data.rows,res.data.total)
              } catch (e) {}
          })
        }`,
      },
      eventMap: {
        [`eltable-query-${girdTableId}.onSearchClick`]: `eltable-query-${girdTableId}.onSearchClick`,
        [`eltable-${girdTableId}.onMounted`]: `eltable-${girdTableId}.onMounted`,
      },
    },
  },
  {
    type: "echarts",
    icon: "chart",
    category: "field",
    isnew: true,
    alias: "图表",
    options: {
      name: "",
      label: "ECharts图表",
      // 基础配置
      width: "100%",
      height: "300px",
      theme: "", // 主题: '', 'dark', 'light'
      refreshInterval: 0, // 自动刷新时间，单位秒

      // ECharts配置，默认为简单柱状图
      chartOptions: `{
  title: {
    text: '柱状图示例'
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
}`,

      hidden: false,
      customClass: "", // 自定义css类名

      // 事件
      onCreated: "",
      onMounted: "",
      onClick: "",
    },
  },
  // { // 不支持树形，改动较大，暂不考虑
  //   type: "transfer",
  //   icon: "transfer",
  //   category: "field",
  //   isnew: true,
  //   alias: "穿梭框",
  //   options: {
  //     name: "",
  //     label: "穿梭框",
  //     hidden: false,

  //     customClass: "", // 自定义css类名

  //     // 事件
  //     onCreated: "",
  //     onMounted: "",
  //     onClick: "",
  //   },
  // },
  //
];

export const advancedFields = [
  {
    type: "picture-upload",
    icon: "picture-upload-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      labelWidth: null,
      labelHidden: false,
      columnWidth: "200px",
      disabled: false,
      hidden: false,
      required: false,
      requiredHint: "",
      customRule: "",
      customRuleHint: "",
      //-------------------
      uploadURL: "/file/upload",
      uploadTip: "",
      withCredentials: false,
      multipleSelect: false,
      showFileList: true,
      limit: 3,
      fileMaxSize: 10, //MB
      fileTypes: ["jpg", "jpeg", "png"],
      //headers: [],
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onBeforeUpload: "",
      onUploadSuccess: "",
      onUploadError: "",
      onFileRemove: "",
      onValidate: "",
      //onFileChange: '',
    },
  },

  {
    type: "video-upload",
    icon: "picture-upload-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      labelWidth: null,
      labelHidden: false,
      columnWidth: "200px",
      disabled: false,
      hidden: false,
      required: false,
      requiredHint: "",
      customRule: "",
      customRuleHint: "",
      //-------------------
      uploadURL: "/file/upload",
      uploadTip: "",
      withCredentials: false,
      multipleSelect: false,
      showFileList: true,
      limit: 3,
      fileMaxSize: 30, //MB
      fileTypes: ["mp4", "webm", "ogg"],
      //headers: [],
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onBeforeUpload: "",
      onUploadSuccess: "",
      onUploadError: "",
      onFileRemove: "",
      onValidate: "",
      //onFileChange: '',
    },
  },

  {
    type: "audio-upload",
    icon: "file-upload-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      labelWidth: null,
      labelHidden: false,
      columnWidth: "200px",
      disabled: false,
      hidden: false,
      required: false,
      requiredHint: "",
      customRule: "",
      customRuleHint: "",
      //-------------------
      uploadURL: "/file/upload",
      uploadTip: "",
      withCredentials: false,
      multipleSelect: false,
      showFileList: true,
      limit: 3,
      fileMaxSize: 40, //MB
      fileTypes: ["ogg", "mp3", "wav"],
      //headers: [],
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onBeforeUpload: "",
      onUploadSuccess: "",
      onUploadError: "",
      onFileRemove: "",
      onValidate: "",
      //onFileChange: '',
    },
  },

  {
    type: "file-upload",
    icon: "file-upload-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      labelWidth: null,
      labelHidden: false,
      columnWidth: "200px",
      disabled: false,
      hidden: false,
      required: false,
      requiredHint: "",
      customRule: "",
      customRuleHint: "",
      //-------------------
      uploadURL: "/file/upload",
      uploadTip: "",
      withCredentials: false,
      multipleSelect: false,
      showFileList: true,
      limit: 3,
      fileMaxSize: 40, //MB
      fileTypes: ["doc", "docx", "xls", "xlsx", "cpk"],
      //headers: [],
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onBeforeUpload: "",
      onUploadSuccess: "",
      onUploadError: "",
      onFileRemove: "",
      onValidate: "",
      //onFileChange: '',
    },
  },
  {
    type: "rich-editor",
    icon: "rich-editor-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      placeholder: "",
      labelWidth: null,
      labelHidden: false,
      columnWidth: "200px",
      contentHeight: "200px",
      disabled: false,
      hidden: false,
      required: false,
      requiredHint: "",
      customRule: "",
      customRuleHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      minLength: null,
      maxLength: null,
      showWordLimit: false,
      //-------------------
      onCreated: "",
      onMounted: "",
      onValidate: "",
    },
  },

  {
    type: "cascader",
    icon: "cascader-field",
    formItemFlag: true,
    options: {
      name: "",
      label: "",
      labelAlign: "",
      defaultValue: "",
      placeholder: "",
      size: "",
      labelWidth: null,
      labelHidden: false,
      columnWidth: "200px",
      disabled: false,
      hidden: false,
      clearable: true,
      filterable: false,
      multiple: false,
      checkStrictly: false, //可选择任意一级选项，默认不开启
      showAllLevels: true, //显示完整路径
      optionItems: [
        {
          label: "select 1",
          value: 1,
          children: [{ label: "child 1", value: 11 }],
        },
        { label: "select 2", value: 2 },
        { label: "select 3", value: 3 },
      ],
      required: false,
      requiredHint: "",
      customRule: "",
      customRuleHint: "",
      //-------------------
      customClass: "", //自定义css类名
      labelIconClass: null,
      labelIconPosition: "rear",
      labelTooltip: null,
      //-------------------
      onCreated: "",
      onMounted: "",
      onChange: "",
      onFocus: "",
      onBlur: "",
      onValidate: "",
    },
  },
  // {
  //   type: 'pagination',
  //   icon: 'button',
  //   formItemFlag: false,
  //   options: {
  //     isFunItem: false,
  //     scanCode: false,
  //     scanCodeSkip: false,
  //     name: '',
  //     label: '',
  //     hidden: false,
  //     defaultValue: '',
  //     total: 0,
  //     pageList: 10,
  //     pageUnit: '10,20,30',
  //     pageAlign: 'left',
  //     //-------------------
  //     customClass: '', //自定义css类名
  //     //-------------------
  //     onCreated: '',
  //     onMounted: '',
  //     //   onClick: '',
  //     onPageChange: ''
  //   }
  // },
  {
    type: "query",
    icon: "query",
    formItemFlag: false,
    options: {
      name: "",
      label: "",
      belongTo: "", // 归属，绑定表格
      columnWidth: "200px",
      size: "",
      displayStyle: "block",
      disabled: false,
      hidden: false,
      pageAlign: "left",
      items: [],
      //-------------------
      customClass: "", //自定义css类名
      //-------------------
      onCreated: "",
      onMounted: "",
      //   onClick: ''
      onSearchClick: "",
      //   onChange: ''
    },
  },
];

export const dateTimeMap = {
  year: "YYYY",
  month: "YYYY-MM",
  week: "YYYY 第 WW 周",
  date: "YYYY-MM-DD",
  datetime: "YYYY-MM-DD HH:mm",
  datetimes: "YYYY-MM-DD HH:mm:ss",
  daterange: "YYYY-MM-DD",
  datetimerange: "YYYY-MM-DD HH:mm",
};

export const customFields = [];

export function addContainerWidgetSchema(containerSchema) {
  containers.push(containerSchema);
}

export function addBasicFieldSchema(fieldSchema) {
  basicFields.push(fieldSchema);
}

export function addAdvancedFieldSchema(fieldSchema) {
  advancedFields.push(fieldSchema);
}

export function addCustomWidgetSchema(widgetSchema) {
  basicFields.push(widgetSchema);
}
