<template>
  <form-item-wrapper
    :designer="designer"
    :field="field"
    :rules="rules"
    :design-state="designState"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <vxe-input
      style="width: 100%;"
      ref="fieldEditor"
      v-model="fieldModel"
      :disabled="field.options.disabled"
      :readonly="field.options.readonly"
      :size="widgetSize"
      class="hide-spin-button"
      type="float"
      :min="field.options.min"
      :max="field.options.max"
      :step="field.options.step"
      :digits="field.options.precision"
      :controls="field.options.controls"
      :placeholder="field.options.placeholder"
      :clearable="true"
      :show-word-count="field.options.showWordLimit"
      :prefix-icon="field.options.prefixIcon"
      :suffix-icon="field.options.suffixIcon"
      @focus="handleFocusCustomEvent"
      @blur="handleBlurCustomEvent"
      @input="handleInputCustomEvent"
      @change="handleChangeEvent"
    >
      <template #append v-if="field.options.appendButton">
        <el-button :disabled="field.options.disabled || field.options.appendButtonDisabled" @click="emitAppendButtonClick">
          <svg-icon :icon-class="field.options.buttonIcon" />
        </el-button>
      </template>
    </vxe-input>
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from '@/core/components/VForm/form-designer/form-widget/field-widget/form-item-wrapper.vue'
import emitter from '@/core/components/VForm/lib/emitter'
import i18n, { translate } from '@/core/i18nLang'
import fieldMixin from '@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin'

export default {
  name: 'number-widget',
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
    FormItemWrapper
  },
  data() {
    return {
      oldFieldValue: null, //field组件change之前的值
      fieldModel: null,
      rules: []
    }
  },
  computed: {},
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
    this.initFieldModel()
    this.registerToRefList()
    this.initEventHandler()
    this.buildFieldRules()

    this.handleOnCreated()
  },

  mounted() {
    this.handleOnMounted()
  },

  beforeUnmount() {
    this.unregisterFromRefList()
  },

  methods: {
    formatterInput(value) {
      const NumberArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      const ComputedArr = ['-']

      let newValue = ''
      let oneSuccess = false
      let decimals = false
      for (let index = 0; index <= value.length - 1; index++) {
        let key = value[index]
        if (index == 0 || !oneSuccess) {
          if (NumberArr.indexOf(key) > -1 || ComputedArr.indexOf(key) > -1) {
            newValue += key
            oneSuccess = true
          }
        } else if (key == '.' && !decimals) {
          newValue += key
          decimals = true
        } else {
          if (NumberArr.indexOf(key) > -1) {
            newValue += key
          }
        }
      }

      return newValue
    }
  }
}
</script>

<style lang="scss" scoped>
.full-width-input {
  width: 100% !important;
}

</style>
