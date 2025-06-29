<template>
  <div
    class="field-wrapper"
    :class="{ 'design-time-bottom-margin': !!this.designer }"
    :style="{ display: displayStyle }"
  >
    <div
      class="static-content-item"
      v-if="!field.options.hidden || designState === true"
      :style="{ display: displayStyle }"
      :class="[selected ? 'selected' : '', customClass]"
      @click.stop="selectField(field)"
    >
      <slot></slot>
    </div>

    <template v-if="!!this.designer">
      <div class="field-action" v-if="designer.selectedId === field.id">
        <i
          :title="i18nt('designer.hint.selectParentWidget')"
          @click.stop="selectParentWidget(field)"
        >
          <svg-icon icon-class="el-back" />
        </i>
        <i
          v-if="!!parentList && parentList.length > 1"
          :title="i18nt('designer.hint.moveUpWidget')"
          @click.stop="moveUpWidget(field)"
        >
          <svg-icon icon-class="el-move-up" />
        </i>
        <i
          v-if="!!parentList && parentList.length > 1"
          :title="i18nt('designer.hint.moveDownWidget')"
          @click.stop="moveDownWidget(field)"
        >
          <svg-icon icon-class="el-move-down" />
        </i>
        <i
          :title="i18nt('designer.hint.remove')"
          @click.stop="removeFieldWidget"
        >
          <svg-icon icon-class="el-delete" />
        </i>
        <!-- <i v-if="field.type == 'eltable'" title="设计表格" @click.stop="showDesignTable">
          <svg-icon icon-class="aim" />
        </i> -->
        <i
          v-if="field.type == 'buttongroup'"
          title="设计按钮组"
          @click.stop="showDesignButtonGroup"
        >
          <svg-icon icon-class="aim" />
        </i>
      </div>
      <div
        class="drag-handler background-opacity"
        v-if="designer.selectedId === field.id"
      >
        <i :title="i18nt('designer.hint.dragHandler')">
          <svg-icon icon-class="el-drag-move" />
        </i>
        <i>
          {{
            i18n2t(
              `designer.widgetLabel.${field.type}`,
              `extension.widgetLabel.${field.type}`
            )
          }}
        </i>
        <i v-if="field.options.hidden === true">
          <svg-icon icon-class="el-hide" />
        </i>
      </div>
    </template>
  </div>
</template>

<script>
import i18n from "@/core/i18nLang";
import SvgIcon from "@/core/components/SvgIcon/index.vue";

export default {
  name: "static-content-wrapper",
  mixins: [i18n],
  components: {
    SvgIcon,
  },
  props: {
    field: Object,
    designer: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,

    designState: {
      type: Boolean,
      default: false,
    },

    displayStyle: {
      type: String,
      default: "block",
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
  computed: {
    selected() {
      return !!this.designer && this.field.id === this.designer.selectedId;
    },

    customClass() {
      try {
        return this.field.options.customClass
          ? this.field.options.customClass.join(" ")
          : "";
      } catch (error) {
        console.log(this.field.options.customClass);
      }
    },
  },
  methods: {
    selectField(field) {
      if (this.designer) {
        this.designer.setSelected(field);
        this.designer.emitEvent("field-selected", this.parentWidget); //发送选中组件的父组件对象
      }
    },

    selectParentWidget() {
      if (this.parentWidget) {
        this.designer.setSelected(this.parentWidget);
      } else {
        this.designer.clearSelected();
      }
    },

    moveUpWidget() {
      this.designer.moveUpWidget(this.parentList, this.indexOfParentList);
      this.designer.emitHistoryChange();
    },

    moveDownWidget() {
      this.designer.moveDownWidget(this.parentList, this.indexOfParentList);
      this.designer.emitHistoryChange();
    },
    showDesignTable() {
      this.designer.emitEvent("show-design-table", [
        this.designer.formContent,
        this.field,
      ]);
    },
    showDesignButtonGroup() {
      console.log(this);
      this.designer.emitEvent("show-design-button", [
        this.designer.formContent,
        this.field,
      ]);
    },
    removeFieldWidget() {
      if (this.parentList) {
        const fieldRefName = this.designer.selectedWidgetName;
        let nextSelected = null;
        if (this.parentList.length === 1) {
          if (this.parentWidget) {
            nextSelected = this.parentWidget;
          }
        } else if (this.parentList.length === 1 + this.indexOfParentList) {
          nextSelected = this.parentList[this.indexOfParentList - 1];
        } else {
          nextSelected = this.parentList[this.indexOfParentList + 1];
        }

        this.$nextTick(() => {
          this.parentList.splice(this.indexOfParentList, 1);
          this.designer.setSelected(nextSelected);

          this.designer.formWidget.deleteWidgetRef(fieldRefName); //删除组件ref！！！
          this.designer.emitHistoryChange();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.design-time-bottom-margin {
  margin-bottom: 5px;
}

.field-wrapper {
  position: relative;
  .field-action {
    position: absolute;
    //bottom: -24px;
    bottom: 0;
    right: -2px;
    height: 22px;
    line-height: 22px;
    background: $mainColor;
    z-index: 9;
    display: flex;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }

  .drag-handler {
    position: absolute;
    top: 0;
    //bottom: -22px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
    left: -1px;
    height: 20px;
    line-height: 20px;
    //background: $mainColor;
    z-index: 9;

    i {
      font-size: 12px;
      font-style: normal;
      color: #fff;
      margin: 4px;
      cursor: move;
    }

    &:hover {
      //opacity: 1;
      background: $mainColor;
    }
  }
}

.field-action,
.drag-handler {
  :deep(.svg-icon) {
    margin-left: 0.1em;
    margin-right: 0.1em;
  }
}

.static-content-item {
  // min-height: 20px;
  display: flex; /* 垂直居中 */
  align-items: center; /* 垂直居中 */

  :deep(.el-divider--horizontal) {
    margin: 0;
  }
}

.el-form-item.selected,
.static-content-item.selected {
  outline: 2px solid $mainColor;
}
</style>
