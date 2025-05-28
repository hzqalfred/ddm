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
    <div>
      <span v-if="type == 'input'">{{ showValue }}</span>

      <div v-else>
        <div v-for="(item, index) in showValue" :key="item + index">{{ index + 1 }}、{{ item }}</div>
      </div>
    </div>
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from '@/core/components/VForm/form-designer/form-widget/field-widget/form-item-wrapper.vue'
import emitter from '@/core/components/VForm/lib/emitter'
import i18n, { translate } from '@/core/i18nLang'
import fieldMixin from '@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin'
import SvgIcon from '@/core/components/SvgIcon/index.vue'

export default {
  name: 'print-widget',
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
    FormItemWrapper,
    SvgIcon
  },
  data() {
    return {
      oldFieldValue: null, //field组件change之前的值
      fieldModel: null, // 真实值
      showValue: null, // 显示值
      rules: [],
      type: 'input'
    }
  },
  computed: {
    inputType() {
      if (this.field.options.type === 'number') {
        return 'text' //当input的type设置为number时，如果输入非数字字符，则v-model拿到的值为空字符串，无法实现输入校验！故屏蔽之！！
      }

      return this.field.options.type
    }
  },
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
    this.showValue = this.fieldModel
    if (this.field.options.dictionary) {
      var optionDatas = this.getOptionData()
      var options = optionDatas[this.field.options.dictionary]

      if (options) {
        options.some(item => {
          if (item.value == this.fieldModel) {
            this.showValue = item.text
            return true
          }
        })
      }
    }
    if (['video', 'image', 'file', 'audio'].indexOf(this.field.options.type) > -1) {
      if (this.fieldModel.length === 0) {
        this.showValue = ''
      } else {
        this.type = 'file'
        this.showValue = []
        this.fieldModel.forEach(item => {
          this.showValue.push(item.name)
        })
      }
    }
  },

  beforeUnmount() {
    this.unregisterFromRefList()
  },

  methods: {}
}
</script>

<style lang="scss" scoped></style>
