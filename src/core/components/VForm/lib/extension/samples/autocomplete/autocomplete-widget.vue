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
    <el-autocomplete
      ref="fieldEditor"
      v-model="fieldModel"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      :disabled="field.options.disabled"
      :size="widgetSize"
      style="width: 100%;"
      :placeholder="field.options.placeholder"
      :clearable="field.options.clearable"
      :minlength="field.options.minLength"
      :maxlength="field.options.maxLength"
      :prefix-icon="field.options.prefixIcon"
      :suffix-icon="field.options.suffixIcon"
      @focus="handleFocusCustomEvent"
      @blur="handleBlurCustomEvent"
      @input="handleInputCustomEvent"
      @change="handleChangeEvent"
    ></el-autocomplete>
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from "@/core/components/VForm/form-designer/form-widget/field-widget/form-item-wrapper.vue";
import emitter from "@/core/components/VForm/lib/emitter";
import i18n, { translate } from "@/core/i18nLang";
import fieldMixin from "@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin";
import SvgIcon from "@/core/components/SvgIcon/index.vue";
import request from "@/core/Request";
// import { useDictionaries } from "@/core/pinia/modules/dictionaries";

export default {
  name: "autocomplete-widget",
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
      // selectControl: useDictionaries().getGlobalSelectMap(),
    };
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
    querySearch(queryString, cb) {
      const selectSourceArr = this.field.options.selectSource.split(";");
      const selectTargetArr = this.field.options.selectTarget.split(";");
      const index = selectTargetArr.findIndex(
        (i) => i === this.field.options.name
      );
      const columnName = selectSourceArr[index];
      request
        .postData(
          "/common/completionList?funId=" +
            selectControl[this.field.options.controlName] +
            "&pageNum=1&pageSize=20&columnName=" +
            columnName +
            "&keyWords=" +
            queryString
        )
        .then((res) => {
          // 调用 callback 返回建议列表的数据
          res.rows.forEach(function(item) {
            item.label = item[columnName];
            item.value = item[columnName];
          });
          cb(res.rows);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
