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
  <container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList">
    <el-row :key="widget.id" :gutter="widget.options.gutter" class="grid-container" :class="[selected ? 'selected' : '', customClass]" @click.stop="selectWidget(widget)">
      <template v-for="(colWidget, colIdx) in widget.cols" :key="colWidget.id">
        <grid-col-widget
          :widget="colWidget"
          :designer="designer"
          :parent-list="widget.cols"
          :index-of-parent-list="colIdx"
          :parent-widget="widget"
          :col-height="widget.options.colHeight"
        ></grid-col-widget>
      </template>
    </el-row>
  </container-wrapper>
</template>

<script>
import i18n from '@/core/i18nLang'
import GridColWidget from '@/core/components/VForm/form-designer/form-widget/container-widget/grid-col-widget.vue'
import containerMixin from '@/core/components/VForm/form-designer/form-widget/container-widget/containerMixin'
import ContainerWrapper from '@/core/components/VForm/form-designer/form-widget/container-widget/container-wrapper.vue'
import refMixinDesign from '@/core/components/VForm/form-designer/refMixinDesign'

export default {
  name: 'grid-widget',
  componentName: 'ContainerWidget',
  mixins: [i18n, containerMixin, refMixinDesign],
  inject: ['refList'],
  components: {
    ContainerWrapper,
    GridColWidget
  },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass || ''
    }
  },
  watch: {
    //
  },
  created() {
    this.initRefList()
  },
  mounted() {
    //
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.el-row.grid-container {
  min-height: 50px;
  //line-height: 48px;
  //padding: 6px;
  outline: 1px dashed #336699;

  .form-widget-list {
    min-height: 28px;
  }
}

.grid-container.selected,
.grid-cell.selected {
  outline: 2px solid $mainColor !important;
}
</style>
