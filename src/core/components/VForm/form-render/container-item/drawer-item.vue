<template>
  <container-item-wrapper :widget="widget">
    <vxe-drawer 
      ref="fieldEditor"
      v-model="drawerVisible"
    >
      <div
        :key="widget.id"
        class="tab-container"
        v-show="!widget.options.hidden"
      >
        <template v-for="(subWidget, swIdx) in widget.widgetList">
          <template v-if="'container' === subWidget.category">
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
        <div class="drawer-footer">
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
    </vxe-drawer>
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
  name: "drawer-item",
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
      drawerVisible: false,
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
    handleShow() {
      this.drawerVisible = true;
    },
    handleHide() {
      this.drawerVisible = false;
    },
    handleOpen() {
      let obj = this.formConfig?.globalObject;
      if (obj && obj[`${this.$props?.widget?.id}.onDrawerOpened`]) {
        try {
          let changeFn = obj[`${this.$props?.widget?.id}.onDrawerOpened`];
          changeFn.call(this);
        } catch (e) {
          console.error("执行选择行自定义事件出错:", e);
        }
      }
    },
    handleClose() {
      let obj = this.formConfig?.globalObject;
      if (obj && obj[`${this.$props?.widget?.id}.onDrawerBeforeClose`]) {
        try {
          let changeFn = obj[`${this.$props?.widget?.id}.onDrawerBeforeClose`];
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
        this.drawerVisible = false;
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
.drawer-footer {
  text-align: right !important;
}
:deep(.el-row.grid-container) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
