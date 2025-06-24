<template>
  <container-item-wrapper :widget="widget">
    <vxe-card
      :key="widget.id"
      class="card-container"
      :class="[!!widget.options.folded ? 'folded' : '', customClass]"
      :shadow="widget.options.shadow"
      :style="getCardStyle(widget.options.cardWidth)"
      :ref="widget.id"
      v-show="!widget.options.hidden"
      :body-style="
        widget.widgetList[0] && widget.widgetList[0].type == 'subgrid'
          ? {
              'padding-top': 0,
            }
          : {}
      "
    >
      <template #header>
        <div class="clear-fix" @click="toggleCard">
          <span>{{ widget.options.label }}</span>

          <i
            v-if="widget.options.showFold && formType !== 'print'"
            class="float-right"
          >
            <template v-if="!widget.options.folded">
              <vxe-icon name="arrow-down"></vxe-icon>
            </template>
            <template v-else>
              <vxe-icon name="arrow-up"></vxe-icon>
            </template>
          </i>
        </div>
      </template>
      <template v-if="!!widget.widgetList && widget.widgetList.length > 0">
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

              <template #[subWidget.id]>
                <slot :name="subWidget.id"></slot>
              </template>
            </component>
          </template>

          <template v-else>
            <component
              :is="subWidget.type + '-widget'"
              :field="subWidget"
              :designer="null"
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
      </template>
    </vxe-card>
  </container-item-wrapper>
</template>

<script>
import emitter from "@/core/components/VForm/lib/emitter";
import i18n from "@/core/i18nLang";
import refMixin from "@/core/components/VForm/form-render/refMixin";
import ContainerItemWrapper from "@/core/components/VForm/form-render/container-item/container-item-wrapper.vue";
import containerItemMixin from "@/core/components/VForm/form-render/container-item/containerItemMixin";
import FieldComponents from "@/core/components/VForm/form-designer/form-widget/field-widget/index";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";

export default {
  name: "card-item",
  componentName: "ContainerItem",
  mixins: [emitter, i18n, refMixin, containerItemMixin],
  components: {
    ContainerItemWrapper,
    ...FieldComponents,
    ArrowDown,
    ArrowUp,
  },
  props: {
    widget: Object,
    formType: String,
  },
  inject: ["refList", "sfRefList", "globalModel"],
  computed: {
    customClass() {
      return this.widget.options.customClass || "";
    },
  },
  created() {
    this.initRefList();

    if (this.formType == "print") {
      this.widget.options.folded = false;
    }
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
    toggleCard() {
      if (this.formType == "print") {
        return; //打印模式不允许收缩
      }
      this.widget.options.folded = !this.widget.options.folded;
    },
    // 设置卡片整体样式
    getCardStyle(width) {
      let _style = ''
      if(width){
        _style += `width: calc(${width} - 20px); !important;`
      }
      _style += 'border-radius: 10px; overflow: auto; margin: 10px 10px 0px 10px; border: 1px solid #9bc1ff;'
      return _style
    }
  },
};
</script>

<style lang="scss" scoped>
.card-container {
  :deep(.vxe-card__header) {
    padding: 0;
    .clear-fix {
      padding: 10px 12px;
      cursor: pointer;
    }
  }
}

.folded :deep(.vxe-card--body) {
  display: none;
}

.clear-fix:before,
.clear-fix:after {
  display: table;
  content: "";
}

.clear-fix:after {
  clear: both;
}
.clear-fix {
  width: 100%;
}

.float-right {
  float: right;
}
// 卡片标题演示
:deep(.vxe-card--header) {
  background-color: #d3e4ff;
  color: #267AFF;
  font-size: 14px;
  font-weight: bold;
  padding: 10px;
  border-bottom: 1px solid #9bc1ff !important;
}
</style>
