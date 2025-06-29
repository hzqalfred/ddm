<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <el-container class="main-container full-height">
    <el-container>
      <el-aside class="side-panel">
        <widget-panel
          :designer="designer"
          :fun-id="funId"
          :fields-list="designer.fieldsList"
          :subgrid-list="designer.subgridList"
          :expand-list="designer.expandList"
          :global-dsv="globalDsv"
        />
      </el-aside>

      <el-container class="center-layout-container">
        <el-header class="toolbar-header">
          <toolbar-panel
            :data-center="dataCenter"
            :designer="designer"
            :global-dsv="globalDsv"
            :fun-id="funId"
            ref="toolbarRef"
          >
            <template v-for="(idx, slotName) in $slots" #[slotName]>
              <slot :name="slotName"></slot>
            </template>
          </toolbar-panel>
        </el-header>
        <el-main class="form-widget-main">
          <el-scrollbar
            class="container-scroll-bar"
            :style="{ height: scrollerHeight }"
          >
            <v-form-widget
              :option-data="dictionaries"
              :designer="designer"
              :form-config="designer.formConfig"
              :global-dsv="globalDsv"
              :fun-id="funId"
              :layout-type="layoutType"
              ref="formRef"
            ></v-form-widget>
          </el-scrollbar>
        </el-main>
      </el-container>

      <el-aside>
        <setting-panel
          :designer="designer"
          :selected-widget="designer.selectedWidget"
          :form-config="designer.formConfig"
          :global-dsv="globalDsv"
          :data-service="dataService"
          @edit-event-handler="testEEH"
        />
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import WidgetPanel from "@/core/components/VForm/form-designer/widget-panel/index.vue";
import ToolbarPanel from "@/core/components/VForm/form-designer/toolbar-panel/index.vue";
import SettingPanel from "@/core/components/VForm/form-designer/setting-panel/index.vue";
import VFormWidget from "@/core/components/VForm/form-designer/form-widget/index.vue";
import { createDesigner } from "@/core/components/VForm/form-designer/designer";
import {
  addWindowResizeHandler,
  deepClone,
  getQueryParam,
} from "@/core/utils/tool";
import {
  getAllContainerWidgets,
  getAllFieldWidgets,
  traverseAllWidgets,
} from "@/core/components/VForm/lib/utils";
import i18n, { changeLocale } from "@/core/i18nLang";
import message from "@/core/Message";
import axios from "axios";
import SvgIcon from "@/core/components/SvgIcon/index.vue";

import fieldMixin from "@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin";
import dict from "@/config/dics";

export default {
  name: "VFormDesigner",
  componentName: "VFormDesigner",
  mixins: [i18n, fieldMixin],
  components: {
    SvgIcon,
    WidgetPanel,
    ToolbarPanel,
    SettingPanel,
    VFormWidget,
  },
  props: {
    /* 后端字段列表API */
    fieldListApi: {
      type: Object,
      default: null,
    },

    /* 禁止显示的组件名称数组 */
    bannedWidgets: {
      type: Array,
      default: () => [],
    },

    designerConfig: {
      type: Object,
      default: () => {
        return {
          languageMenu: true, //是否显示语言切换菜单
          externalLink: true, //是否显示GitHub、文档等外部链接
          formTemplates: true, //是否显示表单模板
          eventCollapse: true, //是否显示组件事件属性折叠面板
          widgetNameReadonly: false, //禁止修改组件名称

          clearDesignerButton: true, //是否显示清空设计器按钮
          previewFormButton: true, //是否显示预览表单按钮
          saveJsonButton: true, //是否显示保存JSON按钮
          importJsonButton: true, //是否显示导入JSON按钮
          exportJsonButton: true, //是否显示导出JSON器按钮
          exportCodeButton: false, //是否显示导出代码按钮
          generateSFCButton: true, //是否显示生成SFC按钮

          toolbarMaxWidth: 520, //设计器工具按钮栏最大宽度（单位像素）
          toolbarMinWidth: 300, //设计器工具按钮栏最小宽度（单位像素）

          presetCssCode: "", //设计器预设CSS样式代码

          resetFormJson: false, //是否在设计器初始化时将表单内容重置为空
        };
      },
    },

    /* 全局数据源变量 */
    globalDsv: {
      type: Object,
      default: () => ({}),
    },
    funId: {
      type: String,
      default: "",
    },
    layoutType: {
      type: String,
      default: "",
    },
    dataCenter: Object, // 接收传入的DataCenter实例
    dataService: Object,
  },
  data() {
    return {
      // dictionaries: getDictionariesList(),
      dictionaries: dict,
      vFormVersion: "3.0.10",
      curLangName: "",
      curLocale: "",

      vsCodeFlag: false,
      caseName: "",

      docUrl: "",
      gitUrl: "",
      chatUrl: "",
      subScribeUrl: "",

      scrollerHeight: 0,

      designer: createDesigner(this),

      fieldList: [],
    };
  },
  provide() {
    return {
      getFunId: () => this.funId,
      serverFieldList: this.fieldList,
      getDesignerConfig: () => this.designerConfig,
      getBannedWidgets: () => this.bannedWidgets,
      getDataCenter: () => this.dataCenter,
      getDictionary_dsv: () => ({}),
    };
  },
  computed: {
    selectedList() {
      return this.getFieldWidgets();
    },
  },
  watch: {
    selectedList(n) {
      this.designer.fieldsList.map((field) => {
        const isSelected = n.some((selected) => field.key === selected.name);
        field.selected = isSelected;
      });

      this.designer.subgridList.map((sub) => {
        const isSelected = n.some((selected) => sub.key === selected.name);
        sub.selected = isSelected;
      });
    },
    "designer.isLoading": {
      handler(n, o) {
        if (n == false && o === true) {
          this.$emit("hideFormLoading");
        }
      },
    },
  },
  created() {
    this.vsCodeFlag = getQueryParam("vscode") == 1;
    this.caseName = getQueryParam("case");
  },
  mounted() {
    this.initLocale();
    this.scrollerHeight = window.innerHeight - 56 - 36 + "px";
    addWindowResizeHandler(() => {
      this.$nextTick(() => {
        this.scrollerHeight = window.innerHeight - 56 - 36 + "px";
      });
    });

    this.loadCase();
    this.loadFieldListFromServer();
  },
  methods: {
    showLink(configName) {
      if (this.designerConfig[configName] === undefined) {
        return true;
      }

      return !!this.designerConfig[configName];
    },

    openHome() {
      if (this.vsCodeFlag) {
        const msgObj = {
          cmd: "openUrl",
          data: {
            url: "https://www.vform666.com/",
          },
        };
        window.parent.postMessage(msgObj, "*");
      }
    },

    openUrl(event, url) {
      if (this.vsCodeFlag) {
        const msgObj = {
          cmd: "openUrl",
          data: {
            url,
          },
        };
        window.parent.postMessage(msgObj, "*");
      } else {
        let aDom = event.currentTarget;
        aDom.href = url;
        //window.open(url, '_blank') //直接打开新窗口，会被浏览器拦截
      }
    },

    loadCase() {
      if (!this.caseName) {
        return;
      }

      axios
        .get(
          "https://ks3-cn-beijing.ksyuncs.com/vform-static/vcase/" +
            this.caseName +
            ".txt"
        )
        .then((res) => {
          if (res.data.code) {
            this.$message.error(this.i18nt("designer.hint.sampleLoadedFail"));
            return;
          }

          this.setFormJson(res.data);
          this.$message.notifySuccess(
            this.i18nt("designer.hint.sampleLoadedSuccess")
          );
        })
        .catch((error) => {
          this.$message.error(
            this.i18nt("designer.hint.sampleLoadedFail") + ":" + error
          );
        });
    },

    initLocale() {
      this.curLocale = localStorage.getItem("v_form_locale");
      if (this.vsCodeFlag) {
        this.curLocale = this.curLocale || "en-US";
      } else {
        this.curLocale = this.curLocale || "zh-CN";
      }
      this.curLangName = this.i18nt("application." + this.curLocale);
      this.changeLanguage(this.curLocale);
    },

    loadFieldListFromServer() {
      if (!this.fieldListApi) {
        return;
      }

      let headers = this.fieldListApi.headers || {};
      axios
        .get(this.fieldListApi.URL, { headers: headers })
        .then((res) => {
          let labelKey = this.fieldListApi.labelKey || "label";
          let nameKey = this.fieldListApi.nameKey || "name";

          this.fieldList.splice(0, this.fieldList.length); //清空已有
          res.data.forEach((fieldItem) => {
            this.fieldList.push({
              label: fieldItem[labelKey],
              name: fieldItem[nameKey],
            });
          });
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },

    handleLanguageChanged(command) {
      this.changeLanguage(command);
      this.curLangName = this.i18nt("application." + command);
    },

    changeLanguage(langName) {
      changeLocale(langName);
    },

    setFormJson(formJson) {
      let modifiedFlag = false;
      if (formJson) {
        if (typeof formJson === "string") {
          modifiedFlag = this.designer.loadFormJson(JSON.parse(formJson));
        } else if (formJson.constructor === Object) {
          modifiedFlag = this.designer.loadFormJson(formJson);
        }
        if (modifiedFlag) {
          this.designer.emitHistoryChange();
        }
      }
    },

    getFormJson() {
      return {
        widgetList: deepClone(this.designer.widgetList),
        formConfig: deepClone(this.designer.formConfig),
      };
    },

    clearDesigner() {
      this.$refs.toolbarRef.clearFormWidget();
    },

    /**
     * 刷新表单设计器
     */
    refreshDesigner() {
      //this.designer.loadFormJson( this.getFormJson() )  //只有第一次调用生效？？

      let fJson = this.getFormJson();
      this.designer.clearDesigner(true); //不触发历史记录变更
      this.designer.loadFormJson(fJson);
    },

    /**
     * 预览表单
     */
    previewForm() {
      this.$refs.toolbarRef.previewForm();
    },

    /**
     * 导入表单JSON
     */
    importJson() {
      this.$refs.toolbarRef.importJson();
    },

    /**
     * 导出表单JSON
     */
    exportJson() {
      this.$refs.toolbarRef.exportJson();
    },

    /**
     * 导出Vue/HTML代码
     */
    exportCode() {
      this.$refs.toolbarRef.exportCode();
    },

    /**
     * 生成SFC代码
     */
    generateSFC() {
      this.$refs.toolbarRef.generateSFC();
    },

    /**
     * 获取所有字段组件
     * @returns {*[]}
     */
    getFieldWidgets(widgetList = null) {
      return widgetList
        ? getAllFieldWidgets(widgetList)
        : getAllFieldWidgets(this.designer.widgetList);
    },

    /**
     * 获取所有容器组件
     * @returns {*[]}
     */
    getContainerWidgets(widgetList = null) {
      return widgetList
        ? getAllContainerWidgets(widgetList)
        : getAllContainerWidgets(this.designer.widgetList);
    },

    /**
     * 升级表单json，以补充最新的组件属性
     * @param formJson
     */
    upgradeFormJson(formJson) {
      if (!formJson.widgetList || !formJson.formConfig) {
        this.$message.error("Invalid form json!");
        return;
      }

      traverseAllWidgets(formJson.widgetList, (w) => {
        this.designer.upgradeWidgetConfig(w);
      });
      this.designer.upgradeFormConfig(formJson.formConfig);

      return formJson;
    },

    getWidgetRef(widgetName, showError = false) {
      return this.$refs["formRef"].getWidgetRef(widgetName, showError);
    },

    getSelectedWidgetRef() {
      return this.$refs["formRef"].getSelectedWidgetRef();
    },

    //TODO: 增加更多方法！！
  },
};
</script>

<style lang="scss" scoped>
.el-container.main-container {
  background: #fff;

  :deep(aside) {
    /* 防止aside样式被外部样式覆盖！！ */
    margin: 0;
    padding: 0;
    background: inherit;
  }
}

.el-container.full-height {
  height: 100%;
  overflow-y: hidden;
}

.el-container.center-layout-container {
  min-width: 680px;
  border-left: 2px dotted #ebeef5;
  border-right: 2px dotted #ebeef5;
}

.el-header.main-header {
  border-bottom: 2px dotted #ebeef5;
  height: 48px !important;
  line-height: 48px !important;
  min-width: 800px;
}

div.main-title {
  font-size: 18px;
  color: #242424;
  display: flex;
  align-items: center;
  justify-items: center;

  img {
    cursor: pointer;
    width: 36px;
    height: 36px;
  }

  span.bold {
    font-size: 20px;
    font-weight: bold;
    margin: 0 6px 0 6px;
  }

  span.version-span {
    font-size: 14px;
    color: #101f1c;
    margin-left: 6px;
  }
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}

.el-dropdown-link {
  margin-right: 12px;
  cursor: pointer;
}

div.external-link {
  display: flex;
  align-items: center;
  height: 100%;
  a {
    font-size: 13px;
    text-decoration: none;
    margin-right: 10px;
    color: #606266;
  }
}

.el-header.toolbar-header {
  font-size: 14px;
  border-bottom: 1px dotted #cccccc;
  height: 42px !important;
  //line-height: 42px !important;
}

.el-aside.side-panel {
  width: 260px !important;
  overflow-y: hidden;
}

.el-main.form-widget-main {
  padding: 0;

  position: relative;
  overflow-x: hidden;
}

.container-scroll-bar {
  :deep(.el-scrollbar__wrap),
  :deep(.el-scrollbar__view) {
    overflow-x: hidden;
  }
}
</style>
