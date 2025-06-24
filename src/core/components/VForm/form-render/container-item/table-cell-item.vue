<template>
  <td
    class="table-cell"
    :class="[customClass]"
    :colspan="widget.options.colspan || 1"
    :rowspan="widget.options.rowspan || 1"
    :style="{
      width: widget.options.cellWidth + ' !important' || '',
      height: widget.options.cellHeight + ' !important' || '',
      'word-break': !!widget.options.wordBreak ? 'break-all' : 'normal'
    }"
  >
    <template v-for="(subWidget, swIdx) in widget.widgetList">
      <!-- 🔥 新增：优先检查是否是需要自定义渲染的容器组件 -->
          <template v-if="isCustomContainer(subWidget)">
            <slot name="container-render" :widget="subWidget"></slot>
          </template>
      <template v-else-if="'container' === subWidget.category">
        <component :is="getComponentByContainer(subWidget)" :widget="subWidget" :key="swIdx" :parent-list="widget.widgetList" :index-of-parent-list="swIdx" :parent-widget="widget">
          <!-- 递归传递插槽！！！ -->
          <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </component>
      </template>
      <template v-else>
        <component
          :is="(getFormType == 'print' ? 'print' : subWidget.type) + '-widget'"
          :field="subWidget"
          :key="swIdx"
          :parent-list="widget.widgetList"
          :index-of-parent-list="swIdx"
          :parent-widget="widget"
        >
          <!-- 递归传递插槽！！！ -->
          <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </component>
      </template>
    </template>
  </td>
</template>

<script>
import emitter from '@/core/components/VForm/lib/emitter'
import i18n from '@/core/i18nLang'
import refMixin from '../refMixin'
import FieldComponents from '@/core/components/VForm/form-designer/form-widget/field-widget/index'

export default {
  name: 'TableCellItem',
  componentName: 'ContainerItem',
  mixins: [emitter, i18n, refMixin],
  components: {
    ...FieldComponents
  },
  props: {
    widget: Object,

    rowIndex: Number,
    colIndex: Number
  },
  inject: ['refList', 'globalModel', 'getFormType'],
  computed: {
    customClass() {
      return this.widget.options.customClass || ''
    }
  },
  created() {
    /* tableCell不生成组件引用，故无须调用initRefList！！ */
    //this.initRefList()
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
  }
}
</script>

<style lang="scss" scoped>
td.table-cell {
  display: table-cell;
  height: 36px;
  //border: 1px dashed #336699;
  border: 1px solid #e5e5e5;
}
</style>
