const setting = [
  {
    type: "eltable",
    options: {
      paginate: true,
      virtual: false,
      selectabled: true,
      isSelectType: "radio", // radio\checkbox
      validRules: {},
      sortBy: [
        {
          sortColumn: "code", // 排序字段
          sortType: "asc", // 排序类型，asc升序、desc降序
          sortPriority: 1, // 排序优先级，数字越小越优先
        },
      ],
      onDBLClick: "",
      onCellClick: "",
      events: {},
    },
    attrs: [
      {
        name: "columns",
        title: "表头",
        type: "column-items-editor",
        remark: "表头",
        show: true,
      },
      {
        name: "isSelectType",
        title: "勾选框类型",
        type: "isSelectType-editor",
        remark: "勾选框类型",
        show: true,
      },
      {
        name: "validRules",
        title: "校验规则配置",
        type: "validRules-editor",
        remark: "校验规则配置",
        show: true,
      },
      {
        name: "sortBy",
        title: "排序",
        type: "sortBy-editor",
        remark: "排序",
        show: true,
      },
      {
        name: "operate",
        title: "操作列",
        type: "operate-editor",
        remark: "操作列",
        show: true,
      },
    ],
  },
  {
    type: "input",
    options: {
      dd: "",
    },
    attrs: [
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
    ],
  },
  {
    type: "select",
    options: {},
    attrs: [
      {
        name: "validation",
        title: "字段校验",
        type: "validation-editor",
        remark: "支持正则校验",
        show: true,
      },
      //   {
      //   name: "dictionary",
      //   title: "数据字典",
      //   type: "dictionary-editor",
      //   remark: "在模块设置-基础设置-上下文配置",
      //   show: true,
      // },
    ],
  },
];

export default setting;
