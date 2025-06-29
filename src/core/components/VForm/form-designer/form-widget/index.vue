<template>
  <div class="form-widget-container">
    <el-form
      class="full-height-width widget-form"
      :label-position="labelPosition"
      :class="[customClass, layoutType + '-layout']"
      :size="size"
      :validate-on-rule-change="false"
    >
      <template v-if="designer.widgetList.length === 0">
        <div class="no-widget-hint">{{ i18nt("designer.noWidgetHint") }}</div>
      </template>

      <div class="form-widget-list">
        <draggable
          :list="designer.widgetList"
          item-key="id"
          v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 300 }"
          tag="transition-group"
          :component-data="{ name: 'fade' }"
          handle=".drag-handler"
          @end="onDragEnd"
          @add="onDragAdd"
          @update="onDragUpdate"
          :move="checkMove"
        >
          <template #item="{ element: widget, index }">
            <div class="transition-group-el">
              <template v-if="'container' === widget.category">
                <component
                  :is="getWidgetName(widget)"
                  :widget="widget"
                  :designer="designer"
                  :key="widget.id"
                  :parent-list="designer.widgetList"
                  :index-of-parent-list="index"
                  :parent-widget="null"
                  :design-state="true"
                ></component>
              </template>
              <template v-else>
                <component
                  :is="getWidgetName(widget)"
                  :field="widget"
                  :designer="designer"
                  :key="widget.id"
                  :parent-list="designer.widgetList"
                  :index-of-parent-list="index"
                  :parent-widget="null"
                  :design-state="true"
                ></component>
              </template>
            </div>
          </template>
        </draggable>
      </div>
    </el-form>
  </div>
</template>

<script>
import "./container-widget/index";
import FieldComponents from "./field-widget/index";
import i18n from "@/core/i18nLang";
import _ from "lodash";
import { processObject } from "@/core/utils/tool";

export default {
  name: "VFormWidget",
  componentName: "VFormWidget",
  mixins: [i18n],
  components: {
    ...FieldComponents,
  },
  props: {
    designer: Object,
    formConfig: Object,
    optionData: {
      //prop传入的选项数据
      type: Object,
      default: () => ({}),
    },
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
  },
  provide() {
    return {
      refList: this.widgetRefList,
      getFormConfig: () =>
        this.formConfig /* 解决provide传递formConfig属性的响应式更新问题！！ */,
      getGlobalDsv: () => this.globalDsv, // 全局数据源变量
      globalOptionData: this.optionData,
      getOptionData: () => this.optionData,
      globalModel: {
        formModel: this.formModel,
      },
      getFunId: () => this.funId,
    };
  },
  inject: ["getDesignerConfig"],
  data() {
    return {
      formModel: {},
      widgetRefList: {},
    };
  },
  computed: {
    labelPosition() {
      if (
        !!this.designer.formConfig &&
        !!this.designer.formConfig.labelPosition
      ) {
        return this.designer.formConfig.labelPosition;
      }

      return "left";
    },

    size() {
      if (!!this.designer.formConfig && !!this.designer.formConfig.size) {
        return this.designer.formConfig.size;
      }

      return "default";
    },

    customClass() {
      return this.designer.formConfig.customClass || "";
    },
  },
  watch: {
    "designer.widgetList": {
      deep: true,
      handler(val) {
        //
      },
    },

    "designer.formConfig": {
      deep: true,
      handler(val) {
        //
      },
    },
  },
  created() {
    this.designer.initDesigner(
      this.funId,
      this.layoutType,
      !!this.getDesignerConfig().resetFormJson
    );
    this.designer.loadPresetCssCode(this.getDesignerConfig().presetCssCode);
  },
  mounted() {
    this.disableFirefoxDefaultDrop(); /* 禁用Firefox默认拖拽搜索功能!! */
    this.designer.registerFormWidget(this);
  },
  methods: {
    getWidgetName(widget) {
      console.log(widget);
      return widget.type + "-widget";
    },

    disableFirefoxDefaultDrop() {
      let isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
      if (isFirefox) {
        document.body.ondrop = function(event) {
          event.stopPropagation();
          event.preventDefault();
        };
      }
    },

    onDragEnd(evt) {
      // console.log('drag end000', evt)
    },

    onDragAdd(evt) {
      const newIndex = evt.newIndex;
      if (this.designer.widgetList[newIndex]) {
        this.designer.setSelected(this.designer.widgetList[newIndex]);
        if (this.designer.widgetList[newIndex].formConfig) {
          let data = processObject(this.designer.widgetList[newIndex].formConfig)
          this.designer.formConfig = _.merge(
            {},
            this.designer.formConfig,
            data
          );
        }
      }
      this.designer.emitHistoryChange();
    },

    onDragUpdate() {
      /* 在VueDraggable内拖拽组件发生位置变化时会触发update，未发生组件位置变化不会触发！！ */
      this.designer.emitHistoryChange();
    },

    checkMove(evt) {
      return this.designer.checkWidgetMove(evt);
    },

    getFormData() {
      return this.formModel;
    },

    getWidgetRef(widgetName, showError = false) {
      let foundRef = this.widgetRefList[widgetName];
      if (!foundRef && !!showError) {
        this.$message.error(
          this.i18nt("designer.hint.refNotFound") + widgetName
        );
      }
      return foundRef;
    },

    getSelectedWidgetRef() {
      let wName = this.designer.selectedWidgetName;
      return this.getWidgetRef(wName);
    },

    clearWidgetRefList() {
      Object.keys(this.widgetRefList).forEach((key) => {
        delete this.widgetRefList[key];
      });
    },

    deleteWidgetRef(widgetRefName) {
      delete this.widgetRefList[widgetRefName];
    },
  },
};
</script>
<!-- 设计器选中后特显效果 -->
<style>
.field-wrapper .drag-handler {
  background: #63a0e9;
}
.transition-group-el .selected {
  outline: 2px solid #63a0e9 !important;
  padding: 30px;
}
/* .field-wrapper .field-action {
    bottom: -34px !important;
}
.field-wrapper .drag-handler {
    top: -26px !important;
} */
</style>
<style lang="scss" scoped>
.container-scroll-bar {
  :deep(.el-scrollbar__wrap),
  :deep(.el-scrollbar__view) {
    overflow-x: hidden;
  }
}

.form-widget-container {
  padding: 10px;
  background: #f1f2f3;

  overflow-x: hidden;
  overflow-y: auto;

  .el-form.full-height-width {
    height: 100%;
    padding: 3px;
    background: #ffffff;

    .no-widget-hint {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 18px;
      color: #999999;
    }

    .form-widget-list {
      min-height: calc(100vh - 56px - 68px);
      padding: 3px;
    }
  }

  .el-form.Pad-layout {
    margin: 0 auto;
    max-width: 960px;
    border-radius: 15px;
    box-shadow: 0 0 1px 10px #495060;
  }

  .el-form.H5-layout {
    margin: 0 auto;
    width: 420px;
    border-radius: 15px;
    //border-width: 10px;
    box-shadow: 0 0 1px 10px #495060;
  }

  .el-form.widget-form :deep(.el-row) {
    padding: 2px;
    border: 1px dashed rgba(170, 170, 170, 0.75);
  }
}

.grid-cell {
  min-height: 30px;
  border-right: 1px dotted #cccccc;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
