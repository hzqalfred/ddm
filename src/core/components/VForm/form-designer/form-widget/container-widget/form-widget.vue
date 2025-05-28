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
    <div :key="widget.id" class="form-container" :class="{ selected: selected }" @click.stop="selectWidget(widget)">
      <draggable
        :list="widget.widgetList"
        item-key="id"
        v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
        tag="transition-group"
        :component-data="{ name: 'fade' }"
        handle=".drag-handler"
        @end="onDragEnd"
        @add="evt => onContainerDragAdd(evt, widget.widgetList)"
        @update="onDragUpdate"
        :move="checkMove"
      >
        <template #item="{ element: subWidget, index: swIdx }">
          <div class="form-widget-list">
            <template v-if="'container' === subWidget.category">
              <component
                :is="subWidget.type + '-widget'"
                :widget="subWidget"
                :designer="designer"
                :key="subWidget.id"
                :parent-list="widget.widgetList"
                :index-of-parent-list="swIdx"
                :parent-widget="widget"
              ></component>
            </template>
            <template v-else>
              <component
                :is="subWidget.type + '-widget'"
                :field="subWidget"
                :designer="designer"
                :key="subWidget.id"
                :parent-list="widget.widgetList"
                :index-of-parent-list="swIdx"
                :parent-widget="widget"
                :design-state="true"
              ></component>
            </template>
          </div>
        </template>
      </draggable>
    </div>
  </container-wrapper>
</template>

<script>
import i18n from '@/core/i18nLang'
import containerMixin from '@/core/components/VForm/form-designer/form-widget/container-widget/containerMixin'
import ContainerWrapper from '@/core/components/VForm/form-designer/form-widget/container-widget/container-wrapper.vue'
import FieldComponents from '@/core/components/VForm/form-designer/form-widget/field-widget/index'
import refMixinDesign from '@/core/components/VForm/form-designer/refMixinDesign'

export default {
  name: 'form-widget',
  componentName: 'ContainerWidget',
  mixins: [i18n, containerMixin, refMixinDesign],
  inject: ['refList'],
  components: {
    ContainerWrapper,
    ...FieldComponents
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
  data() {
    return {
      dialogVisible: false
    }
  },
  watch: {
    //
  },
  created() {
    console.log(this.$refs)
    this.initRefList()
  },
  mounted() {
    //
  },
  methods: {
    onDragUpdate() {
      this.designer.emitHistoryChange()
    },
    onDragEnd(obj, subList) {
      console.log(this.widget)
      //
    },
    onDragAdd(evt, subList) {
      //   let newIndex = (evt && evt.index) || 0
      //   if (!!subList[newIndex]) {
      //     this.designer.setSelected(subList[newIndex])
      //   }
      //   this.designer.emitHistoryChange()
    },
    checkMove() {}
  }
}
</script>

<style lang="scss" scoped>
div.form-container {
  padding: 5px;
  border: 1px dashed #336699;
  box-sizing: border-box;
  width: 100%;
  min-height: 200px;

}

.dialog-container.selected {
  outline: 2px solid $mainColor !important;
}
</style>
