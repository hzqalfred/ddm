<template>
  <static-content-wrapper :designer="designer" :field="field" :design-state="designState"
    :display-style="field.options.displayStyle" :parent-widget="parentWidget" :parent-list="parentList"
    :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">

    <div :style="{display: 'flex', justifyContent: field.options.float}">
        <vxe-button 
          ref="fieldEditor"
          :mode="field.options.mode" 
          :size="field.options.comsize"
          :content="field.options.content" 
          :status="['error', 'info'].includes(field.options.status) ? null : field.options.status" 
          :round="field.options.round"
          :circle="field.options.circle" 
          :icon="field.options.icon"
          :prefix-tooltip="field.options.prefixTooltip ? { content: field.options.prefixTooltip } : ''"
          :suffix-tooltip="field.options.suffixTooltip ? { content: field.options.suffixTooltip } : ''"
          :loading="field.options.loading" 
          :disabled="field.options.comdisabled" 
          :hidden="field.options.hidden"
          :style="buttonStyle(field.options.status)"
          v-debounce="handleButtonWidgetClick">
          {{ field.options.title ||  field.options.label}}      
        </vxe-button>
    </div>
    
  </static-content-wrapper>
</template>

<script>
import StaticContentWrapper from '@/core/components/VForm/form-designer/form-widget/field-widget/static-content-wrapper.vue'
import emitter from '@/core/components/VForm/lib/emitter'
import i18n, { translate } from '@/core/i18nLang'
import fieldMixin from '@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin'

export default {
  name: 'button-widget',
  componentName: 'FieldWidget', //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, i18n],
  props: {
    field: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

    designState: {
      type: Boolean,
      default: false
    },

    subFormRowIndex: {
      /* 子表单组件行索引，从0开始计数 */
      type: Number,
      default: -1
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */
      type: Number,
      default: -1
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */
      type: String,
      default: ''
    }
  },
  components: {
    StaticContentWrapper
  },
  computed: {
    buttonStyle() {
      return function (status) {
        let _style = 'min-width: 80px; height: 30px; font-weight: bold;'
        switch (status) {
          case 'error':
            _style += 'color: #F64C4C; border-color: #F64C4C;'
            break
          case 'info':
            _style += 'color: #267AFF; border-color: #267AFF;'
            break
        }
        return _style
      }
    }
  },
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
    this.registerToRefList()
    this.initEventHandler()

    this.handleOnCreated()
  },

  mounted() {
    this.handleOnMounted()
  },

  beforeUnmount() {
    this.unregisterFromRefList()
  },

  methods: {}
}
</script>

<style lang="scss" scoped></style>
