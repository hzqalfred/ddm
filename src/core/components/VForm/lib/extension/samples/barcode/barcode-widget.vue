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
    <img id="barcode" />
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from '@/core/components/VForm/form-designer/form-widget/field-widget/form-item-wrapper.vue'
import emitter from '@/core/components/VForm/lib/emitter'
import i18n, { translate } from '@/core/i18nLang'
import fieldMixin from '@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin'
import JsBarcode from 'jsbarcode'

export default {
  name: 'barcode-widget',
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

  watch: {
    fieldModel(val) {
      // 必须是字符串类型
      JsBarcode('#barcode', val)
    }
  },

  beforeUnmount() {
    this.unregisterFromRefList()
  },

  methods: {
    creatBarcode() {
      JsBarcode('#barcode', this.designState ? '123456' : this.fieldModel ? this.fieldModel : '')
    }
  }
}
</script>

<style lang="scss" scoped>
.hide-spin-button {
  &:hover {
    .hover_close {
      display: block;
    }
  }
}

.hover_close {
  display: none;
  &:hover {
    color: red;
  }
}
</style>
