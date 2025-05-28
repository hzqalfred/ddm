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
    <vxe-checkbox-group ref="fieldEditor" v-model="fieldModel" :disabled="field.options.disabled" :size="widgetSize" @change="handleChangeEvent">
      <template>
        <vxe-checkbox v-for="(item, index) in optionItems" :key="index" :label="item.value" :disabled="item.disabled" :style="{ display: field.options.displayStyle }">
          {{ item.label }}
        </vxe-checkbox>
      </template>
    </vxe-checkbox-group>
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from '@/core/components/VForm/form-designer/form-widget/field-widget/form-item-wrapper.vue'
import emitter from '@/core/components/VForm/lib/emitter'
import i18n, { translate } from '@/core/i18nLang'
import fieldMixin from '@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin'

export default {
  name: 'checkbox-widget',
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
  computed: {
    optionItems() {
      if (this.field.options.sourceType === 'dictionary') {
        var optionDatas = this.getOptionData()
        var options = optionDatas[this.field.options.dictionary]
        var ops = []
        for (let key in options) {
          ops.push({
            label: options[key].text,
            value: options[key].value,
            disabled: false
          })
        }
        return ops
      } else {
        return this.field.options.optionItems
      }
    }
  },
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
    this.initOptionItems()
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

  methods: {}
}
</script>

<style lang="scss" scoped></style>
