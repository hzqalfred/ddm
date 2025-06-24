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
    <div
      :class="{ clearfix: field.options.displayStyle == 'block' }"
      :style="{ display: field.options.displayStyle }"
    >
      <vxe-button-group
        ref="fieldEditor"
        :style="{ float: field.options.pageAlign == 'left' ? 'left' : 'right' }"
      >
        <vxe-button
          @click="(e) => handleClick(item, e)"
          v-for="(item, index) in buttonItems"
          :key="index"
          :type="field.options.type"
          :size="widgetSize"
          :plain="field.options.plain"
          :round="field.options.round"
          :circle="field.options.circle"
          :icon="field.options.icon"
        >
          {{ item.label }}
        </vxe-button>
      </vxe-button-group>
      <vxe-select
        v-model="fieldModel"
        v-if="selectOptions && selectOptions.length"
        :size="widgetSize"
        style="width: 120px;margin-left: 5px;"
        placeholder="更多操作"
        :style="{ float: field.options.pageAlign == 'left' ? 'left' : 'right' }"
      >
        <vxe-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </vxe-select>
    </div>
  </static-content-wrapper>
</template>

<script>
import StaticContentWrapper from "@/core/components/VForm/form-designer/form-widget/field-widget/static-content-wrapper.vue";
import emitter from "@/core/components/VForm/lib/emitter";
import i18n, { translate } from "@/core/i18nLang";
import fieldMixin from "@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin";

export default {
  name: "buttongroup-widget",
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
    StaticContentWrapper,
  },
  data() {
    return {
      fieldModel: null,
    };
  },
  computed: {
    buttonItems() {
      return this.field.options.items.slice(
        0,
        this.field.options.moreIndex || 5
      );
    },
    selectOptions() {
      return this.field.options.items.length >
        (this.field.options.moreIndex || 5)
        ? this.field.options.items.slice(this.field.options.moreIndex || 5)
        : [];
    },
  },
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
                                   需要在父组件created中初始化！！ */
    this.initOptionItems();
    this.registerToRefList();
    this.initEventHandler();

    this.handleOnCreated();
  },

  mounted() {
    this.handleOnMounted();
  },

  beforeUnmount() {
    this.unregisterFromRefList();
  },

  methods: {
    handleClick(items, e) {
      if (this.field.options.onButtonGroupClick) {
        let customFn = new Function(
          "ButtonConfig",
          this.field.options.onButtonGroupClick
        );
        customFn.call(this, Object.assign(items, { events: e }));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
</style>
