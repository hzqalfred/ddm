<template>
  <el-col
    v-if="widget.type === 'grid-col'"
    class="grid-cell"
    v-bind="layoutProps"
    :class="[selected ? 'selected' : '', customClass]"
    :style="colHeightStyle"
    :key="widget.id"
    @click.stop="selectWidget(widget)"
  >
    <draggable
      :list="widget.widgetList"
      item-key="id"
      v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
      tag="transition-group"
      :component-data="{ name: 'fade' }"
      handle=".drag-handler"
      @end="evt => onGridDragEnd(evt, widget.widgetList)"
      @add="evt => onGridDragAdd(evt, widget.widgetList)"
      @update="onGridDragUpdate"
      :move="checkContainerMove"
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

    <div class="grid-col-action" v-if="designer.selectedId === widget.id && widget.type === 'grid-col'">
      <i :title="i18nt('designer.hint.selectParentWidget')" @click.stop="selectParentWidget(widget)"><svg-icon icon-class="el-back" /></i>
      <i v-if="!!parentList && parentList.length > 1" :title="i18nt('designer.hint.moveUpWidget')" @click.stop="moveUpWidget()"><svg-icon icon-class="el-move-up" /></i>
      <i v-if="!!parentList && parentList.length > 1" :title="i18nt('designer.hint.moveDownWidget')" @click.stop="moveDownWidget()"><svg-icon icon-class="el-move-down" /></i>
      <i :title="i18nt('designer.hint.cloneWidget')" @click.stop="cloneGridCol(widget)">
        <svg-icon icon-class="el-clone" />
      </i>
      <i :title="i18nt('designer.hint.remove')" @click.stop="removeWidget">
        <svg-icon icon-class="el-delete" />
      </i>
    </div>

    <div class="grid-col-handler" v-if="designer.selectedId === widget.id && widget.type === 'grid-col'">
      <i>{{ i18nt('designer.widgetLabel.' + widget.type) }}</i>
    </div>
  </el-col>
</template>

<script>
import i18n from '@/core/i18nLang'
import FieldComponents from '@/core/components/VForm/form-designer/form-widget/field-widget/index'
import refMixinDesign from '@/core/components/VForm/form-designer/refMixinDesign'
import SvgIcon from '@/core/components/SvgIcon/index.vue'

export default {
  name: 'GridColWidget',
  componentName: 'GridColWidget',
  mixins: [i18n, refMixinDesign],
  inject: ['refList'],
  components: {
    ...FieldComponents,
    SvgIcon
  },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

    colHeight: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      layoutProps: {
        span :Math.floor( this.widget.options.span) || 12,
        // md: this.widget.options.md || 12,
        // sm: this.widget.options.sm || 12,
        // xs: this.widget.options.xs || 12,
        offset: this.widget.options.offset || 0,
        push: this.widget.options.push || 0,
        pull: this.widget.options.pull || 0
      }
    }
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass || ''
    },

    colHeightStyle() {
      return !!this.colHeight ? { height: this.colHeight + 'px' } : {}
    }
  },
  watch: {
    'designer.formConfig.layoutType': {
      handler(val) {
        if (!!this.widget.options.responsive) {
          if (val === 'H5') {
            this.layoutProps.span = this.widget.options.xs || 12
          } else if (val === 'Pad') {
            this.layoutProps.span = this.widget.options.sm || 12
          } else {
            this.layoutProps.span = this.widget.options.md || 12
          }
        } else {
          this.layoutProps.span =Math.floor( this.widget.options.span) || 12
        }
      }
    },

    'widget.options.responsive': {
      handler(val) {
        let lyType = this.designer.formConfig.layoutType
        if (!!val) {
          if (lyType === 'H5') {
            this.layoutProps.span = this.widget.options.xs || 12
          } else if (lyType === 'Pad') {
            this.layoutProps.span = this.widget.options.sm || 12
          } else {
            this.layoutProps.span = this.widget.options.md || 12
          }
        } else {
          this.layoutProps.span =Math.floor( this.widget.options.span) || 12
        }
      }
    },

    'widget.options.span': {
      handler(val) {
        this.layoutProps.span = val
      }
    },

    'widget.options.md': {
      handler(val) {
        this.layoutProps.span = val
      }
    },

    'widget.options.sm': {
      handler(val) {
        this.layoutProps.span = val
      }
    },

    'widget.options.xs': {
      handler(val) {
        this.layoutProps.span = val
      }
    },

    'widget.options.offset': {
      handler(val) {
        this.layoutProps.offset = val
      }
    },

    'widget.options.push': {
      handler(val) {
        this.layoutProps.push = val
      }
    },

    'widget.options.pull': {
      handler(val) {
        this.layoutProps.pull = val
      }
    }
  },
  created() {
    this.initRefList()
    this.initLayoutProps()
  },
  methods: {
    initLayoutProps() {
      if (!!this.widget.options.responsive) {
        let lyType = this.designer.formConfig.layoutType
        if (lyType === 'H5') {
          this.layoutProps.span = this.widget.options.xs || 12
        } else if (lyType === 'Pad') {
          this.layoutProps.span = this.widget.options.sm || 12
        } else {
          this.layoutProps.span = this.widget.options.md || 12
        }
      } else {
        this.layoutProps.spn =Math.floor( this.widget.options.span)
      }
    },

    onGridDragEnd(evt, subList) {
      //
    },

    onGridDragAdd(evt, subList) {
      const newIndex = evt.newIndex
      if (!!subList[newIndex]) {
        this.designer.setSelected(subList[newIndex])
      }

      this.designer.emitHistoryChange()
    },

    onGridDragUpdate() {
      this.designer.emitHistoryChange()
    },

    selectWidget(widget) {
      console.log('id: ' + widget.id)
      this.designer.setSelected(widget)
    },

    checkContainerMove(evt) {
      return this.designer.checkWidgetMove(evt)
    },

    selectParentWidget() {
      if (this.parentWidget) {
        this.designer.setSelected(this.parentWidget)
      } else {
        this.designer.clearSelected()
      }
    },

    moveUpWidget() {
      this.designer.moveUpWidget(this.parentList, this.indexOfParentList)
    },

    moveDownWidget() {
      this.designer.moveDownWidget(this.parentList, this.indexOfParentList)
    },

    cloneGridCol(widget) {
      this.designer.cloneGridCol(widget, this.parentWidget)
    },

    removeWidget() {
      if (!!this.parentList) {
        let nextSelected = null
        if (this.parentList.length === 1) {
          if (!!this.parentWidget) {
            nextSelected = this.parentWidget
          }
        } else if (this.parentList.length === 1 + this.indexOfParentList) {
          nextSelected = this.parentList[this.indexOfParentList - 1]
        } else {
          nextSelected = this.parentList[this.indexOfParentList + 1]
        }

        this.$nextTick(() => {
          this.parentList.splice(this.indexOfParentList, 1)
          //if (!!nextSelected) {
          this.designer.setSelected(nextSelected)
          //}

          this.designer.emitHistoryChange()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-cell {
  min-height: 38px !important;
  //margin: 6px 0;  /* 设置了margin，栅格列的offset、push、pull会失效！！ */
  padding: 3px;
  outline: 1px dashed #336699 !important;
  position: relative;

  .form-widget-list {
    min-height: 28px;
  }

  .grid-col-action {
    position: absolute;
    bottom: 0;
    right: -2px;
    height: 28px;
    line-height: 28px;
    background: $mainColor;
    z-index: 999;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }

  .grid-col-handler {
    position: absolute;
    top: -2px;
    left: -2px;
    height: 22px;
    line-height: 22px;
    background: $mainColor;
    z-index: 9;

    i {
      font-size: 14px;
      font-style: normal;
      color: #fff;
      margin: 4px;
      cursor: default;
    }
  }
}

.grid-col-action,
.grid-col-handler {
  :deep(.svg-icon) {
    margin-left: 0.1em;
    margin-right: 0.1em;
  }
}
</style>
