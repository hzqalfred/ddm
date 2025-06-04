<template>
  <div class="ace-container">
    <div class="ace-editor" ref="ace"></div>
  </div>
</template>

<script>
import ace from "ace-builds";
import "ace-builds/src-min-noconflict/theme-sqlserver"; // 新设主题
import "ace-builds/src-min-noconflict/mode-javascript"; // 默认设置的语言模式
import "ace-builds/src-min-noconflict/mode-json"; //
import "ace-builds/src-min-noconflict/mode-css"; //
import "ace-builds/src-min-noconflict/ext-language_tools";

export default {
  name: "CodeEditor",
  props: {
    modelValue: {
      type: String,
      //required: true
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "javascript",
    },
    userWorker: {
      //是否开启语法检查，默认开启
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue"],
  mounted() {
    ace.config.set(
      "basePath",
      "https://ks3-cn-beijing.ksyun.com/vform2021/ace-mini"
    );

    this.addAutoCompletion(ace); //添加自定义代码提示！！

    this.aceEditor = ace.edit(this.$refs.ace, {
      maxLines: 40, // 最大行数，超过会自动出现滚动条
      minLines: 20, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 12, // 编辑器内字体大小
      theme: this.themePath, // 默认设置的主题
      mode: this.modePath, // 默认设置的语言模式
      tabSize: 2, // 制表符设置为2个空格大小
      readOnly: this.readonly,
      highlightActiveLine: true,
      value: this.codeValue,
    });

    this.aceEditor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true, // 设置代码片段提示
      enableLiveAutocompletion: true, // 设置自动提示
    });

    if (this.mode === "json") {
      this.setJsonMode();
    } else if (this.mode === "css") {
      this.setCssMode();
    }

    if (!this.userWorker) {
      this.aceEditor.getSession().setUseWorker(false);
    }

    //编辑时同步数据
    this.aceEditor.getSession().on("change", (ev) => {
      this.$emit("update:modelValue", this.aceEditor.getValue());
    });
  },
  data() {
    return {
      aceEditor: null,
      themePath: "ace/theme/sqlserver", // 不导入 webpack-resolver，该模块路径会报错
      modePath: "ace/mode/javascript", // 同上
      codeValue: this.modelValue,
    };
  },
  watch: {
    //
  },
  methods: {
    addAutoCompletion(ace) {
      let acData = [
        {
          meta: "VForm API",
          caption: "getWidgetRef",
          value: "getWidgetRef()",
          score: 1,
        },
        {
          meta: "VForm API",
          caption: "getFormRef",
          value: "getFormRef()",
          score: 1,
        },
        //TODO: 待补充！！
        // comUtils 基础信息方法
        {
          meta: "comUtils",
          caption: "getBI",
          value: "getBI()",
          score: 10,
          docHTML: "获取基础信息方法<br/>返回: {FMC, FMN, FFC, CC, AC}",
        },
        {
          meta: "comUtils",
          caption: "getBIM",
          value: "getBIM()",
          score: 10,
          docHTML: "获取基础方法信息<br/>返回: {execRequest, Message}",
        },

        // comUtils 表单数据方法
        {
          meta: "comUtils",
          caption: "getFormData",
          value: "getFormData(selRow, refList)",
          score: 10,
          docHTML:
            "获取表单数据<br/>参数: selRow(选中行), refList(表单引用列表)",
        },
        {
          meta: "comUtils",
          caption: "setFormData",
          value: "setFormData(selRow, refList, isAdd, signName)",
          score: 10,
          docHTML:
            "设置表单数据<br/>参数: selRow(数据源), refList(表单引用), isAdd(是否新增), signName(控件名)",
        },

        // comUtils 表格数据方法
        {
          meta: "comUtils",
          caption: "loadGridData",
          value: "loadGridData(signName, queryScheme, treeNode)",
          score: 10,
          docHTML:
            "加载表格数据<br/>参数: signName(表格控件编号), queryScheme(查询条件), treeNode(树节点)",
        },
        {
          meta: "comUtils",
          caption: "deleteGridData",
          value: "deleteGridData(signName)",
          score: 10,
          docHTML: "删除表格数据<br/>参数: signName(表格控件编号)",
        },
        {
          meta: "comUtils",
          caption: "addGridData",
          value: "addGridData(signName)",
          score: 10,
          docHTML: "新增表格数据<br/>参数: signName(表格控件编号)",
        },
        {
          meta: "comUtils",
          caption: "saveGridData",
          value: "saveGridData(signName)",
          score: 10,
          docHTML: "保存表格数据<br/>参数: signName(表格控件编号)",
        },

        // comUtils 表单操作方法
        {
          meta: "comUtils",
          caption: "loadFormData",
          value: "loadFormData(signName, key)",
          score: 10,
          docHTML:
            "加载表单数据<br/>参数: signName(表单控件编号), key(主键字段)",
        },
        {
          meta: "comUtils",
          caption: "deleteFormData",
          value: "deleteFormData(signName, gridName)",
          score: 10,
          docHTML:
            "删除表单数据<br/>参数: signName(表单控件编号), gridName(表格控件编号)",
        },
        {
          meta: "comUtils",
          caption: "addFormData",
          value: "addFormData(signName)",
          score: 10,
          docHTML: "新增表单数据<br/>参数: signName(表单控件编号)",
        },
        {
          meta: "comUtils",
          caption: "saveFormData",
          value: "saveFormData(signName, isRC, gridName)",
          score: 10,
          docHTML:
            "保存表单数据<br/>参数: signName(表单控件编号), isRC(是否关闭), gridName(表格控件编号)",
        },

        // comUtils 树操作方法
        {
          meta: "comUtils",
          caption: "loadTreeData",
          value: "loadTreeData(functionCode, signName)",
          score: 10,
          docHTML:
            "加载树数据<br/>参数: functionCode(功能代码), signName(树控件编号)",
        },

        // 常用的 comUtils 调用方式
        {
          meta: "comUtils Usage",
          caption: "CT.comUtils.loadGridData",
          value: "CT.comUtils.loadGridData(signName, queryScheme, treeNode)",
          score: 9,
          docHTML: "通过 CT 调用加载表格数据",
        },
        {
          meta: "comUtils Usage",
          caption: "CT.comUtils.saveGridData",
          value: "CT.comUtils.saveGridData(signName)",
          score: 9,
          docHTML: "通过 CT 调用保存表格数据",
        },
        {
          meta: "comUtils Usage",
          caption: "CT.comUtils.deleteGridData",
          value: "CT.comUtils.deleteGridData(signName)",
          score: 9,
          docHTML: "通过 CT 调用删除表格数据",
        },
        {
          meta: "comUtils Usage",
          caption: "CT.comUtils.addGridData",
          value: "CT.comUtils.addGridData(signName)",
          score: 9,
          docHTML: "通过 CT 调用新增表格数据",
        },

        // 基础信息快捷调用
        {
          meta: "comUtils Quick",
          caption: "const BI = CT.comUtils.getBI()",
          value: "const BI = CT.comUtils.getBI()",
          score: 8,
          docHTML: "获取基础信息对象",
        },
        {
          meta: "comUtils Quick",
          caption: "const BIM = CT.comUtils.getBIM()",
          value: "const BIM = CT.comUtils.getBIM()",
          score: 8,
          docHTML: "获取基础方法信息对象",
        },
      ];
      let langTools = ace.require("ace/ext/language_tools");
      langTools.addCompleter({
        getCompletions: function(editor, session, pos, prefix, callback) {
          if (prefix.length === 0) {
            return callback(null, []);
          } else {
            return callback(null, acData);
          }
        },
      });
    },

    setJsonMode() {
      this.aceEditor.getSession().setMode("ace/mode/json");
    },

    setCssMode() {
      this.aceEditor.getSession().setMode("ace/mode/css");
    },

    getEditorAnnotations() {
      return this.aceEditor.getSession().getAnnotations();
    },

    setValue(newValue) {
      this.aceEditor.getSession().setValue(newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.ace-editor {
  min-height: 300px;
}
</style>
