const setting = [
  {
    type: "eltable",
    options: {
      paginate: true,
      virtual: false,
      selectabled:true,
      isSelectType: "radio", // radio\checkbox
      validRules:{}
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
    ],
  },
];

export default setting;
