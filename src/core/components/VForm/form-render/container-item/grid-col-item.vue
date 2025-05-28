<template>
  <el-col class="grid-cell" :class="!widget.options.hidden ? [customClass] : []" v-bind="layoutProps" :style="colHeightStyle" :key="widget.id" v-show="!widget.options.hidden">
    <template v-if="!!widget.widgetList && widget.widgetList.length > 0">
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
            <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
              <slot :name="slot" v-bind="scope" />
            </template>
          </component>
        </template>
        <template v-else>
          <!-- {{ subWidget.options.name }} -->
          <component
            :is="(getFormType == 'print' ? 'print' : subWidget.type) + '-widget'"
            :field="getSubWidget(subWidget)"
            :designer="null"
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
    </template>
    <template v-else>
      <el-col>
        <div class="blank-cell">
          <span class="invisible-content">{{ i18nt('render.hint.blankCellContent') }}</span>
        </div>
      </el-col>
    </template>
  </el-col>
</template>

<script>
import emitter from '@/core/components/VForm/lib/emitter'
import i18n from '@/core/i18nLang'
import refMixin from '../refMixin'
import FieldComponents from '@/core/components/VForm/form-designer/form-widget/field-widget/index'

export default {
  name: 'GridColItem',
  componentName: 'ContainerItem',
  mixins: [emitter, i18n, refMixin],
  components: {
    ...FieldComponents
  },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,

    colHeight: {
      type: String,
      default: null
    },
    formType: String
  },
  inject: ['refList', 'globalModel', 'getFormConfig', 'previewState', 'columnMap', 'isDisabledFormField', 'isRequiredFormField', 'mainVilide', 'auditEditFields', 'getFormType'],
  data() {
    return {
      layoutProps: {
        span: this.widget.options.span,
        md: this.widget.options.md || 12,
        sm: this.widget.options.sm || 12,
        xs: this.widget.options.xs || 12,
        offset: this.widget.options.offset || 0,
        push: this.widget.options.push || 0,
        pull: this.widget.options.pull || 0
      }
    }
  },
  computed: {
    formConfig() {
      return this.getFormConfig()
    },

    customClass() {
      return this.widget.options.customClass || ''
    },

    colHeightStyle() {
      return !!this.colHeight ? { height: this.colHeight + 'px' } : {}
    }
  },
  created() {
    this.initLayoutProps()
    this.initRefList()
  },
  methods: {
    getSubWidget(subWidget) {
      // 对一些默认值进行覆盖-避免需要重复生成form
      //接收columnMap --会导致页面很卡
      // let columnItem = this.columnMap[subWidget.id]

      // subWidget.options = {
      //   ...subWidget.options,
      //   ...columnItem
      // } //覆盖默认配置

      //复核验证
      if (this.mainVilide !== undefined) {
        if (this.mainVilide.value) {
          if (this.auditEditFields.value.indexOf(subWidget.id) > -1) {
            subWidget.options.disabled = false
          } else {
            subWidget.options.disabled = true
          }

          return subWidget
        }
      }

      if (this.isDisabledFormField) {
        // 覆盖禁用状态
        if (this.isDisabledFormField[subWidget.id] !== undefined) {
          subWidget.options.disabled = this.isDisabledFormField[subWidget.id]
        }
      }

      if (this.isRequiredFormField) {
        //覆盖必填校验
        if (this.isRequiredFormField[subWidget.id] !== undefined) {
          subWidget.options.required = this.isRequiredFormField[subWidget.id]
        }
      }

      return subWidget
    },
    initLayoutProps() {
      if (!!this.widget.options.responsive) {
        if (!!this.previewState) {
          this.layoutProps.md = undefined
          this.layoutProps.sm = undefined
          this.layoutProps.xs = undefined

          let lyType = this.formConfig.layoutType
          if (lyType === 'H5') {
            this.layoutProps.span = this.widget.options.xs || 12
          } else if (lyType === 'Pad') {
            this.layoutProps.span = this.widget.options.sm || 12
          } else {
            this.layoutProps.span = this.widget.options.md || 12
          }
        } else {
          this.layoutProps.span = undefined
        }
      } else {
        this.layoutProps.md = undefined
        this.layoutProps.sm = undefined
        this.layoutProps.xs = undefined
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.blank-cell {
  font-style: italic;
  color: #cccccc;

  span.invisible-content {
    opacity: 0;
  }
}
</style>
