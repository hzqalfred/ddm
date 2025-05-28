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
      effect="dark"
      :content="fieldModel"
      placement="top"
      trigger="click" 
      :visible="showTip"
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
        :min-length="field.options.minLength"
        :max-length="field.options.maxLength"
        :show-word-count="field.options.showWordLimit"
        :prefix-icon="field.options.prefixIcon"
        :suffix-icon="field.options.suffixIcon"
        @focus="handleFocusCustomEvent"
        @blur="handleBlurCustomEvent"
        @input="handleInputCustomEvent"
        @change="handleChangeEvent"
        @click="selectWinClick"
        @mouseenter="showTip"
        @mouseleave="hideTip"
        style="width: 100%;"
      >
        <template #append>
          <vxe-button
            size="small"
            :disabled="
              field.options.disabled || field.options.appendButtonDisabled
            "
            @click="formSelectWindow"
          >
            <svg-icon icon-class="custom-search" />
          </vxe-button>
        </template>

        <template
          #suffix
          v-if="
            fieldModel &&
              !field.options.disabled &&
              !field.options.appendButtonDisabled
          "
        >
          <vxe-icon
            @click="clearSelect"
            name="circle-close"
            class="hover_close"
          ></vxe-icon>
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
  name: "selectwin-widget",
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
    };
  },
  computed: {
    inputType() {
      if (this.field.options.type === "number") {
        return "text"; //当input的type设置为number时，如果输入非数字字符，则v-model拿到的值为空字符串，无法实现输入校验！故屏蔽之！！
      }

      return this.field.options.type;
    },
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

  methods: {
    showTip() {
      console.log(this.fieldModel)
      this.fieldModel.length && isShowTip();
    },
  },
};
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
