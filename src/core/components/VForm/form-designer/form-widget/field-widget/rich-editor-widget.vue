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
    <!--
    <vue-editor ref="fieldEditor" v-model="fieldModel" :editor-toolbar="customToolbar"
                :disabled="field.options.disabled" :placeholder="field.options.placeholder"
                @text-change="handleRichEditorChangeEvent"
                @focus="handleRichEditorFocusEvent" @blur="handleRichEditorBlurEvent">
    </vue-editor>
    -->

    <div v-maxWindow>
      <quill-editor
        v-model:value="fieldModel"
        :options="editorOption"
        :disabled="field.options.disabled"
        @blur="handleRichEditorBlurEvent"
        @focus="handleRichEditorFocusEvent"
        @change="handleRichEditorChangeEvent"
        :style="!!field.options.contentHeight ? `height: ${field.options.contentHeight};` : ''"
      ></quill-editor>
    </div>
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from '@/core/components/VForm/form-designer/form-widget/field-widget/form-item-wrapper.vue'
import emitter from '@/core/components/VForm/lib/emitter'
import i18n, { translate } from '@/core/i18nLang'
import { deepClone } from '@/core/utils/tool'
import fieldMixin from '@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin'

import { Quill, quillEditor } from 'vue3-quill'

export default {
  name: 'rich-editor-widget',
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

    // VueEditor: resolve => { //懒加载！！
    //   require(['vue2-editor'], ({VueEditor}) => resolve(VueEditor))
    // }
    quillEditor
  },
  data() {
    return {
      oldFieldValue: null, //field组件change之前的值
      fieldModel: null,
      rules: [],

      customToolbar: [], //富文本编辑器自定义工具栏
      valueChangedFlag: false //vue2-editor数据值是否改变标志
    }
  },
  computed: {
    editorOption() {
      return {
        placeholder: this.field.options.placeholder,
        modules: {
          //toolbar: this.customToolbar
        }
      }
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
  },

  beforeUnmount() {
    this.unregisterFromRefList()
  },

  methods: {
    handleRichEditorChangeEvent() {
      this.valueChangedFlag = true
      this.syncUpdateFormModel(this.fieldModel)
    },

    handleRichEditorFocusEvent() {
      this.oldFieldValue = deepClone(this.fieldModel)
    },

    handleRichEditorBlurEvent() {
      if (this.valueChangedFlag) {
        this.emitFieldDataChange(this.fieldModel, this.oldFieldValue)
        this.valueChangedFlag = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.full-width-input {
  width: 100% !important;
}
</style>
