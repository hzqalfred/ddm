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
    <div :key="widget.id" class="dialog-container" :class="{ selected: selected }" @click.stop="selectWidget(widget)">
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

  <vxe-drawer
      ref="fieldEditor"
      v-model="drawerVisible"
      @show="handleOnShow"

      :size="widget.options.comsize"
      :position="widget.options.position || 'right'"
      :width="['left', 'right'].includes(widget.options.position || 'right') ? (widget.options.width || '40%') : null"
      :height="['top', 'bottom'].includes(widget.options.position || 'right') ? (widget.options.height || '40%') : null"
      :padding="widget.options.padding"
      :mask-closable="widget.options.maskClosable"
      :title="widget.options.title"
      :resize="widget.options.resize"
      :esc-closable="widget.options.escClosable"
    >
    <div>侧滑抽屉测试！！！</div>
    <div>侧滑抽屉使用：this.refList.{{widget.id}}.$refs.fieldEditor.open();</div>
  </vxe-drawer>
  <div style="text-align: right;">
    <vxe-button content="侧滑抽屉测试" @click="drawerVisible = true"></vxe-button>
  </div>
</template>

<script>
import i18n from '@/core/i18nLang'
import containerMixin from '@/core/components/VForm/form-designer/form-widget/container-widget/containerMixin'
import ContainerWrapper from '@/core/components/VForm/form-designer/form-widget/container-widget/container-wrapper.vue'
import FieldComponents from '@/core/components/VForm/form-designer/form-widget/field-widget/index'
import refMixinDesign from '@/core/components/VForm/form-designer/refMixinDesign'

export default {
  name: 'drawer-widget',
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
      drawerVisible: false
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
      console.log(evt, subList)
      console.log(this.widget)
    },
    checkMove() {}
  }
}
</script>

<style lang="scss" scoped>
div.dialog-container {
  padding: 5px;
  border: 2px dashed #cccccc;
  box-sizing: border-box;
  width: 100%;
  min-height: 200px;
}

.dialog-container.selected {
  border: 2px dashed #cccccc;
}
</style>
