<template>
  <container-item-wrapper :widget="widget">
    <div :key="widget.id" class="tab-container" v-show="!widget.options.hidden">
      <vxe-tabs
        v-model="activeTabName"
        :type="widget.options.tabType"
        ref="fieldEditor"
        :class="[customClass]"
        :padding="widget.options.tabPadding"
        :height="widget.options.tabHeight"
      >
        <vxe-tab-pane
          v-for="(tab, index) in visibleTabs"
          :key="index"
          :title="tab.options.title"
          :name="tab.options.name"
          :icon="tab.options.icon"
          :titleWidth="tab.options.titleWidth"
          :titleAlign="tab.options.titleAlign"
          :preload="tab.options.isPreload"
          :disabled="tab.options.disabled"
          @click.stop="selectWidget(widget)"
        >
          <template v-for="(subWidget, swIdx) in tab.widgetList">
            <!-- 🔥 新增：优先检查是否是需要自定义渲染的容器组件 -->
            <template v-if="isCustomContainer(subWidget)">
              <slot name="container-render" :widget="subWidget"></slot>
            </template>
            <template v-else-if="'container' === subWidget.category">
              <component
                :is="getComponentByContainer(subWidget)"
                :widget="subWidget"
                :key="swIdx"
                :parent-list="tab.widgetList"
                :index-of-parent-list="swIdx"
                :parent-widget="widget"
              >
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
                  (getFormType == 'print' ? 'print' : subWidget.type) +
                    '-widget'
                "
                :field="subWidget"
                :key="swIdx"
                :parent-list="tab.widgetList"
                :index-of-parent-list="swIdx"
                :parent-widget="widget"
              >
                <template
                  v-for="slot in Object.keys($slots)"
                  v-slot:[slot]="scope"
                >
                  <slot :name="slot" v-bind="scope" />
                </template>
              </component>
            </template>
          </template>
        </vxe-tab-pane>
      </vxe-tabs>
    </div>
  </container-item-wrapper>
</template>

<script>
import emitter from "@/core/components/VForm/lib/emitter";
import i18n from "@/core/i18nLang";
import refMixin from "../refMixin";
import ContainerItemWrapper from "@/core/components/VForm/form-render/container-item/container-item-wrapper.vue";
import containerItemMixin from "./containerItemMixin";
import FieldComponents from "@/core/components/VForm/form-designer/form-widget/field-widget/index";

export default {
  name: "tab-item",
  componentName: "ContainerItem",
  mixins: [emitter, i18n, refMixin, containerItemMixin],
  components: {
    ContainerItemWrapper,
    ...FieldComponents,
  },
  props: {
    widget: Object,
  },
  inject: ["refList", "sfRefList", "globalModel", "getFormType"],
  data() {
    return {
      activeTabName: "",
    };
  },
  computed: {
    visibleTabs() {
      return this.widget.tabs.filter((tp) => {
        return !tp.options.hidden;
      });
    },
  },
  created() {
    this.initRefList();
  },
  mounted() {
    this.initActiveTab();
  },
  beforeUnmount() {
    this.unregisterFromRefList();
  },
  methods: {
    isCustomContainer(widget) {
      // 定义需要通过 container-render 插槽处理的组件类型
      const customContainerTypes = ["subgrid", "universal","page"];
      return (
        widget.category === "container" &&
        customContainerTypes.includes(widget.type)
      );
    },
    initActiveTab() {
      if (this.widget.type === "tab" && this.widget.tabs.length > 0) {
        let activePanes = this.widget.tabs.filter((tp) => {
          return tp.options.active === true;
        });
        if (activePanes.length > 0) {
          this.activeTabName = activePanes[0].options.name;
        } else {
          this.activeTabName = this.widget.tabs[0].options.name;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
