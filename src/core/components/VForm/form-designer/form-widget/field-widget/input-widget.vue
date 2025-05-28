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
    <vxe-tooltip
      class="box-item"
      theme="dark"
      :content="fieldModel"
      placement="top"
      trigger="click"
      v-model="showFlag"
    >
      <vxe-input
        ref="fieldEditor"
        v-model="fieldModel"
        :disabled="field.options.disabled"
        :readonly="field.options.readonly"
        :size="widgetSize"
        class="hide-spin-button"
        :type="inputType"
        :placeholder="field.options.placeholder"
        :clearable="field.options.clearable"
        :min-length="field.options.minLength"
        :max-length="field.options.maxLength"
        :show-word-count="field.options.showWordLimit"
        :prefix-icon="field.options.prefixIcon"
        :suffix-icon="field.options.suffixIcon"
        @focus="handleFocusCustomEvent"
        @blur="handleBlurCustomEvent"
        @input="handleInputCustomEvent"
        @change="handleChangeEvent"
        @mouseenter="isShowTip"
        @mouseleave="hideTip"
        style="width: 100%;"
      >
        <template #suffix>
          <vxe-button
            v-if="field.options.appendButton"
            :disabled="
              field.options.disabled || field.options.appendButtonDisabled
            "
            @click="emitAppendButtonClick"
          >
            <svg-icon :icon-class="field.options.buttonIcon" />
          </vxe-button>
        </template>
      </vxe-input>
    </vxe-tooltip>
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from "@/core/components/VForm/form-designer/form-widget/field-widget/form-item-wrapper.vue";
import emitter from "@/core/components/VForm/lib/emitter";
import i18n from "@/core/i18nLang";
import fieldMixin from "@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin";
import SvgIcon from "@/core/components/SvgIcon/index.vue";

export default {
  name: "input-widget",
  componentName: "FieldWidget", //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, i18n],
  props: {
    field: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

    designState: {
      type: Boolean,
      default: false,
    },

    subFormRowIndex: {
      /* 子表单组件行索引，从0开始计数 */
      type: Number,
      default: -1,
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */
      type: Number,
      default: -1,
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */
      type: String,
      default: "",
    },
  },

  components: {
    FormItemWrapper,
    SvgIcon,
  },
  data() {
    return {
      oldFieldValue: null, //field组件change之前的值
      fieldModel: null,
      rules: [],
      showFlag:false
    };
  },
  methods: {
    handleBlurCustomEvent(event) {
      if (this.field.options.onBlur) {
        let customFn = new Function("event", this.field.options.onBlur);
        customFn.call(this, event);
      }
    },
  },
  computed: {
    inputType() {
      if (this.field.options.type === "number") {
        return "text"; //当input的type设置为number时，如果输入非数字字符，则v-model拿到的值为空字符串，无法实现输入校验！故屏蔽之！！
      }
      console.log(this.field.options.type);

      return this.field.options.type;
    },
  },
  watch:{
    fieldModel(newVal){
      // this.showFlag= newVal?.length
    }
  },
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
    this.initFieldModel();
    this.registerToRefList();
    this.initEventHandler();
    this.buildFieldRules();

    this.handleOnCreated();
  },

  mounted() {
    this.handleOnMounted();
  },

  beforeUnmount() {
    this.unregisterFromRefList();
  },

  methods: {},
};
</script>

<style lang="scss">
.el-form-item__content {
  .vxe-input--prefix-icon,
  .vxe-input--suffix-icon {
    padding: 0 !important;
  }
}
</style>
