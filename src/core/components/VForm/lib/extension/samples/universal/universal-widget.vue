<template>
  <container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList">
    <div :style="{ width: widget.options.universalWidth + '!important' || '' }" @click.stop="selectWidget(widget)">
      <div v-if="designState" class="design_box">自定义组件（{{ widget.options.label }}）</div>

      <slot :name="widget.options.label"></slot>
    </div>
  </container-wrapper>
</template>

<script>
import i18n from '@/core/i18nLang'
import containerMixin from '@/core/components/VForm/form-designer/form-widget/container-widget/containerMixin'
import ContainerWrapper from '@/core/components/VForm/form-designer/form-widget/container-widget/container-wrapper.vue'
import FieldComponents from '@/core/components/VForm/form-designer/form-widget/field-widget/index'
import refMixinDesign from '@/core/components/VForm/form-designer/refMixinDesign'

export default {
  name: 'universal-widget',
  componentName: 'ContainerWidget',
  mixins: [i18n, containerMixin, refMixinDesign],
  inject: ['refList', 'globalModel'],
  components: {
    ContainerWrapper,
    ...FieldComponents
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
        foreignKeyValue: '',
        foreignColumn: ''
      })
    }
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass || ''
    },
    row() {
      return this.globalModel.formModel
    }
  },
  created() {
    this.initRefList()
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.design_box {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  color: #ccc;
}
.card-container.selected {
  outline: 2px solid $mainColor !important;
}

.card-container {
  margin: 3px;

  .form-widget-list {
    min-height: 28px;
  }
}

:deep(.el-card__header) {
  padding: 10px 12px;
}

.folded :deep(.el-card__body) {
  display: none;
}

.clear-fix:before,
.clear-fix:after {
  display: table;
  content: '';
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
