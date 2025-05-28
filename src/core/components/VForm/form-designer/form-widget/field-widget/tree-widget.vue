<template>
  <static-content-wrapper
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
      <vxe-input
        v-if="field.options.isFilter"
        v-model="filterText"
        :placeholder="field.options.filterTip"
        clearable
        :style="{
          width: field.options.filterWidth + 'px',
        }"
      />
      <vxe-tree
        ref="treeRef"
        :size="field.options.comsize"
        :data="treeData"
        :node-config="{
          isHover: field.options.nodeConfigIsHover,
          isCurrent: field.options.nodeConfigIsCurrent,
          trigger: field.options.nodeConfigTrigger,
        }"
        empty-text="暂无数据"
        :height="field.options.height"
        :trigger="field.options.trigger"
        :show-icon="field.options.showIcon"
        :icon-open="field.options.iconOpen"
        :icon-close="field.options.iconClose"
        :accordion="field.options.accordion"
        :title-field="field.options.titleField"
        :key-field="field.options.keyField"
        :children-field="field.options.childrenField"
        :show-line="field.options.showLine"
        :show-radio="field.options.showRadioCheckbox === 'radio'"
        :show-checkbox="field.options.showRadioCheckbox === 'checkbox'"
        :radio-config="
          field.options.showRadioCheckbox === 'radio'
            ? {
                highlight: field.options.highlight !== false,
                strict: field.options.strict !== false,
              }
            : undefined
        "
        :checkbox-config="
          field.options.showRadioCheckbox === 'checkbox'
            ? {
                highlight: field.options.highlight !== false,
                checkStrictly: field.options.strictly !== false,
                strict: field.options.strict !== false,
              }
            : undefined
        "
        :indent="field.options.indent"
        @node-click="handleNodeClick"
        @check-change="handleChangeEvent"
        @check="handleNodeCheck"
      >
        <!-- 自定义插槽配置 -->
        <template #title="{ node }">
          <!-- <span>{{ node.title }}</span> -->
          <span>{{ node[field?.options?.titleField || "title"] || "" }}</span>
          <!-- <vxe-icon status="error" name="warning-triangle"></vxe-icon> -->
        </template>
        <!-- <template #extra>
          <vxe-link href="https://vxeui.com/" status="primary">查看</vxe-link>
          <vxe-button mode="text" status="error" icon="vxe-icon-delete-fill">删除</vxe-button>
        </template> -->
      </vxe-tree>
    </div>
  </static-content-wrapper>
</template>

<script>
import StaticContentWrapper from "@/core/components/VForm/form-designer/form-widget/field-widget/static-content-wrapper.vue";
import emitter from "@/core/components/VForm/lib/emitter";
import i18n, { translate } from "@/core/i18nLang";
import { deepClone } from "@/core/utils/tool";
import fieldMixin from "@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin";

export default {
  name: "tree-widget",
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
      oldFieldValue: null, //field组件change之前的值
      fieldModel: null,
      filterText: "",
      rules: [],
      treeData: [],
      dataSource: [], // 数据源
      checkNodeDate: [], // 选中的节点数据
    };
  },
  computed: {},
  watch: {
    filterText(val) {
      this.treeData = JSON.parse(JSON.stringify(this.dataSource)); // 深拷贝数据
      const { titleField, keyField, childrenField } = this.field.options;
      const searchTree = (data, keyword) => {
        return data.filter((node) => {
          const title = node[titleField] || "";
          let match = title.includes(keyword);
          if (node[childrenField] && node[childrenField].length > 0) {
            const childrenMatches = searchTree(node[childrenField], keyword);
            node[childrenField] = childrenMatches;
            match = match || childrenMatches.length > 0;
          }
          return match;
        });
      };
      this.treeData = searchTree(this.treeData, val);
    },
  },
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    this.treeData = this.field.options.data;
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
    handleChangeEvent() {
      if (this.field && this.field.options.onCheckChange) {
        let changeFn = new Function(this.field.options.onCheckChange);
        changeFn.call(this);
      }
    },
    handleNodeClick({ node, $event }) {
      if (this.designState) return;
      try {
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onNodeClick`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let mountFunc = obj[event];
          mountFunc.call(this, node, $event);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
      }
    },
    handleNodeCheck() {
      if (this.field && this.field.options.onNodeCheck) {
        let changeFn = new Function(this.field.options.onNodeCheck);
        changeFn.call(this);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tree {
  width: 100%;
}
</style>
