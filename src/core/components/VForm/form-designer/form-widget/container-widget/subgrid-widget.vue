<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
  >
    <div style="min-height:200px" @click.stop="selectWidget(widget)">
      <div v-if="designState">
        <div class="demo_title">
          {{ widget.options.label + "(" + widget.options.name + ")" }}
        </div>
        <table class="demo_table" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
            </tr>
            <tr>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
            </tr>
            <tr>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
            </tr>
          </tbody>
        </table>
      </div>
      <slot :name="widget.id"></slot>
    </div>
  </container-wrapper>
</template>

<script>
import i18n from "@/core/i18nLang";
import containerMixin from "@/core/components/VForm/form-designer/form-widget/container-widget/containerMixin";
import ContainerWrapper from "@/core/components/VForm/form-designer/form-widget/container-widget/container-wrapper.vue";
import FieldComponents from "@/core/components/VForm/form-designer/form-widget/field-widget/index";
import refMixinDesign from "@/core/components/VForm/form-designer/refMixinDesign";

export default {
  name: "subgrid-widget",
  componentName: "ContainerWidget",
  mixins: [i18n, containerMixin, refMixinDesign],
  inject: ["refList", "globalModel"],
  components: {
    ContainerWrapper,
    ...FieldComponents,
  },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
    designState: Boolean,
    sendChildrenParams: {
      type: Object,
      default: () => ({
        foreignKeyValue: "",
        foreignColumn: "",
      }),
    },
  },
  computed: {
    selected() {
      console.log(33)
      return this.widget.id === this.designer.selectedId;
    },

    customClass() {
      return this.widget.options.customClass || "";
    },
    row() {
      return this.globalModel.formModel;
    },
  },
  created() {
    this.initRefList();
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.card-container.selected {
  outline: 2px solid $mainColor !important;
}

.card-container {
  margin: 3px;

  .form-widget-list {
    min-height: 28px;
  }
}

:deep(.li-card__header) {
  padding: 10px 12px;
}

.folded :deep(.li-card__body) {
  display: none;
}

.clear-fix:before,
.clear-fix:after {
  display: table;
  content: "";
}

.clear-fix:after {
  clear: both;
}

.float-right {
  float: right;
}

.demo_title {
  color: #c0c0c0;
}

.demo_table {
  border-right: 1px solid #c0c0c0;
  border-bottom: 1px solid #c0c0c0;
  margin: 0 auto;
  width: 100%;
  text-align: center;
}

.demo_table td {
  border-left: 1px solid #c0c0c0;
  border-top: 1px solid #c0c0c0;
  height: 40px;
}
</style>
