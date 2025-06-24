<template>
  <container-item-wrapper :widget="widget">
    <vxe-modal
      ref="fieldEditor"
      show-footer
      :padding="20"
      height="70%"
      :fullscreen="widget.options.fullScreen"
      :width="widget.options.dialogWidth"
      :show-close="widget.options.showClose"
      :modal="widget.options.showModal"
      :close-on-click-modal="widget.options.closeOnClickModal"
      :close-on-press-escape="widget.options.closeOnPressEscape"
      :center="widget.options.center"
      :title="widget.options.label || ''"
      v-model="dialogVisible"
      @opened="handleOpen"
      @close="handleClose"
    >
      <div
        :key="widget.id"
        class="tab-container"
        v-show="!widget.options.hidden"
      >
        <template v-for="(subWidget, swIdx) in widget.widgetList">
          <!-- 🔥 新增：优先检查是否是需要自定义渲染的容器组件 -->
          <template v-if="isCustomContainer(subWidget)">
            <slot name="container-render" :widget="subWidget"></slot>
          </template>
          <template v-else-if="'container' === subWidget.category">
            <component
              :is="getComponentByContainer(subWidget)"
              :widget="subWidget"
              :key="swIdx"
              :parent-list="widget.widgetList"
              :index-of-parent-list="swIdx"
              :parent-widget="widget"
            >
              <!-- 递归传递插槽！！！ -->
              <template
                v-for="slot in Object.keys($slots)"
                v-slot:[slot]="scope"
              >
                <slot :name="slot" v-bind="scope" />
              </template>
            </component>
          </template>
          <template v-else>
            <component
              :is="
                (getFormType == 'print' ? 'print' : subWidget.type) + '-widget'
              "
              :field="subWidget"
              :key="swIdx"
              :parent-list="widget.widgetList"
              :index-of-parent-list="swIdx"
              :parent-widget="widget"
            >
              <!-- 递归传递插槽！！！ -->
              <template
                v-for="slot in Object.keys($slots)"
                v-slot:[slot]="scope"
              >
                <slot :name="slot" v-bind="scope" />
              </template>
            </component>
          </template>
        </template>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <vxe-button @click="handleCancelButton">{{
            widget.options.cancelButtonText || i18nt("designer.hint.cancel")
          }}</vxe-button>
          <vxe-button status="primary" @click="handleOkButton">
            {{
              widget.options.comfirmButtonText || i18nt("designer.hint.confirm")
            }}
          </vxe-button>
        </div>
      </template>
    </vxe-modal>
  </container-item-wrapper>
</template>

<script>
import emitter from "@/core/components/VForm/lib/emitter";
import i18n from "@/core/i18nLang";
import refMixin from "../refMixin";
import ContainerItemWrapper from "@/core/components/VForm/form-render/container-item/container-item-wrapper.vue";
import containerItemMixin from "./containerItemMixin";
import FieldComponents from "@/core/components/VForm/form-designer/form-widget/field-widget/index";
import eventBus from "@/core/utils/event-bus";
export default {
  name: "dialog-item",
  componentName: "ContainerItem",
  mixins: [emitter, i18n, refMixin, containerItemMixin],
  components: {
    ContainerItemWrapper,
    ...FieldComponents,
  },
  props: {
    widget: Object,
    key: String,
  },
  inject: [
    "refList",
    "sfRefList",
    "globalModel",
    "getFormType",
    "getDataCenter",
  ],
  data() {
    return {
      activeTabName: "",
      dialogVisible: false,
      dataCenter: this.getDataCenter(),
      formConfig: {},
    };
  },
  computed: {},
  created() {
    this.initRefList();
  },
  mounted() {
    console.log(this.getGlobalDsv());
    let globalDsv = this.getGlobalDsv();
    this.formConfig = globalDsv?.param?.formJson?.formConfig;
    this.handleOnMounted();
  },
  beforeUnmount() {
    this.unregisterFromRefList();
  },
  methods: {
    isCustomContainer(widget) {
      // 定义需要通过 container-render 插槽处理的组件类型
      const customContainerTypes = ["subgrid", "universal"];
      return (
        widget.category === "container" &&
        customContainerTypes.includes(widget.type)
      );
    },
    handleShow() {
      this.dialogVisible = true;
    },
    handleHide() {
      this.dialogVisible = false;
    },
    handleOpen() {
      let obj = this.formConfig?.globalObject;
      if (obj && obj[`${this.$props?.widget?.id}.onDialogOpened`]) {
        try {
          let changeFn = obj[`${this.$props?.widget?.id}.onDialogOpened`];
          changeFn.call(this);
        } catch (e) {
          console.error("执行选择行自定义事件出错:", e);
        }
      }
    },
    handleClose() {
      let obj = this.formConfig?.globalObject;
      if (obj && obj[`${this.$props?.widget?.id}.onDialogBeforeClose`]) {
        try {
          let changeFn = obj[`${this.$props?.widget?.id}.onDialogBeforeClose`];
          changeFn.call(this);
        } catch (e) {
          console.error("执行选择行自定义事件出错:", e);
        }
      }
    },
    handleOkButton() {
      let obj = this.formConfig?.globalObject;
      if (obj && obj[`${this.$props?.widget?.id}.onOkButtonClick`]) {
        try {
          const functionString =
            obj[`${this.$props?.widget?.id}.onOkButtonClick`];
          const func = new Function("return " + functionString)();
          func(this);
        } catch (e) {
          console.error("执行选择行自定义事件出错:", e);
        }
      }
    },
    handleCancelButton() {
      let obj = this.formConfig?.globalObject;
      if (obj && obj[`${this.$props?.widget?.id}.onCancelButtonClick`]) {
        try {
          let changeFn = obj[`${this.$props?.widget?.id}.onCancelButtonClick`];
          changeFn.call(this);
        } catch (e) {
          console.error("执行选择行自定义事件出错:", e);
        }
      } else {
        this.dialogVisible = false;
      }
    },
    handleOnMounted() {
      if (this.designState) return;
      let event =
        (this.formConfig.eventMap &&
          this.formConfig.eventMap[`${this.$props?.widget?.id}.onMounted`]) ||
        "";
      let obj = this.formConfig?.globalObject;
      if (obj && event && obj[event]) {
        try {
          let changeFn = obj[event];
          if (typeof changeFn == "string") {
            const func = new Function("return " + changeFn)();
            func.call(this);
          } else {
            changeFn.call(this);
          }
        } catch (e) {
          console.error("执行选择行自定义事件出错:", e);
        }
      }
    },
    emitEvent(evtName, evtData) {
      //用于兄弟组件发射事件
      eventBus.$emit(evtName, evtData);
    },

    handleEvent(evtName, callback) {
      //用于兄弟组件接收事件
      eventBus.$on(evtName, (data) => callback(data));
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right !important;
}
:deep(.el-row.grid-container) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
