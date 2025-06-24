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
    <vxe-select
      ref="fieldEditor"
      v-model="fieldModel"
      class="full-width-input"
      :disabled="field.options.disabled"
      :size="widgetSize"
      :clearable="field.options.clearable"
      :filterable="field.options.filterable"
      :multiple="field.options.multiple"
      :max="field.options.multipleLimit"
      :placeholder="
        field.options.placeholder || i18nt('render.hint.selectPlaceholder')
      "
      :remote="field.options.remote"
      :remote-config="remoteConfig"
      @focus="handleFocusCustomEvent"
      @blur="handleBlurCustomEvent"
      @change="handleChangeEvent"
    >
      <vxe-option
        v-for="item in optionItems"
        :key="item.value"
        :label="item.label"
        :value="item.value + ''"
        :disabled="item.disabled"
      ></vxe-option>
    </vxe-select>
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from "@/core/components/VForm/form-designer/form-widget/field-widget/form-item-wrapper.vue";
import emitter from "@/core/components/VForm/lib/emitter";
import i18n, { translate } from "@/core/i18nLang";
import fieldMixin from "@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin";

export default {
  name: "select-widget",
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
  },
  data() {
    return {
      oldFieldValue: null, //field组件change之前的值
      fieldModel: null,
      rules: [],
      remoteConfig: {},
    };
  },
  computed: {
    remoteMethod() {
      if (!!this.field.options.remote) {
        return this.remoteQuery;
      } else {
        return undefined;
      }
    },
    optionItems() {
      if (this.field.options.dictionary && !this.designState) {
        var options =
          this.dictionary_dsv[this.field.options.dictionary || ""] || [];
        var ops = [];
        for (let key in options) {
          ops.push({
            label: options[key],
            value: key,
          });
        }
        return ops;
      } else {
        return this.field.options.optionItems;
      }
    },
  },
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
    this.initOptionItems();
    this.initFieldModel();
    this.registerToRefList();
    this.initEventHandler();
    this.buildFieldRules();

    this.handleOnCreated();
  },

  mounted() {
    
    this.handleOnMounted();
    this.remoteConfig = {
      queryMethod:this.remoteQuery
    }
  },

  beforeUnmount() {
    this.unregisterFromRefList();
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.full-width-input {
  width: 100% !important;
}
</style>
