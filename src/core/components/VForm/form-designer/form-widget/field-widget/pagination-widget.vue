<template>
  <static-content-wrapper
    :designer="designer"
    :field="field"
    :design-state="designState"
    :display-style="field.options.displayStyle"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <el-pagination
      v-model:page-size="field.options.pageList"
      :style="{ float: field.options.pageAlign == 'left' ? 'left' : 'right' }"
      :page-sizes="(field.options.pageUnit && field.options.pageUnit.split(',')) || [10, 20, 30, 50, 100, 1000]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @change="handlePageChange"
    />
  </static-content-wrapper>
</template>

<script>
import StaticContentWrapper from '@/core/components/VForm/form-designer/form-widget/field-widget/static-content-wrapper.vue'
import emitter from "@/core/components/VForm/lib/emitter";
import i18n, { translate } from '@/core/i18nLang'
import fieldMixin from '@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin'

export default {
  name: 'pagination-widget',
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
  data() {
    return {}
  },
  computed: {
    total: function() {
      return this.field.options.total
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

  methods: {
    handlePageChange() {
      if (this.widget.options.onPageChange) {
        let changeFn = new Function(this.widget.options.onPageChange)
        changeFn.call(this)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
