<!--
  因tabs属性并不包含于options属性之中，故只能跟其他options属性之内的属性值合并设置，此处选择与customClass合并！！
-->

<template>
  <div>
    <vxe-form ref="tabSettingFormRef" :data="optionModel">
      <vxe-form-item title="宽" span="24">
        <vxe-input v-model="optionModel.width"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="标题" span="24">
        <vxe-input v-model="optionModel.label"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="显示遮罩层" span="24">
        <vxe-switch v-model="optionModel.showModal"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="显示关闭按钮" span="24">
        <vxe-switch v-model="optionModel.showClose"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="点击遮罩层关闭" span="24">
        <vxe-switch v-model="optionModel.closeOnClickModal"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="按Esc键关闭" span="24">
        <vxe-switch v-model="optionModel.closeOnPressEscape"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="抽屉滑出方向" span="24">
        <vxe-radio-group v-model="optionModel.direction">
          <vxe-radio-button content="←" label="right"></vxe-radio-button>
          <vxe-radio-button content="→" label="left"></vxe-radio-button>
          <vxe-radio-button content="↑" label="down"></vxe-radio-button>
          <vxe-radio-button content="↓" label="up"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      <vxe-form-item title="弹窗表单只读" span="24">
        <vxe-switch v-model="optionModel.readonly"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="弹窗表单禁用" span="24">
        <vxe-switch v-model="optionModel.disabled"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="确认按钮文字" span="24">
        <vxe-input v-model="optionModel.comfirmButtonText"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="隐藏确认按钮" span="24">
        <vxe-switch v-model="optionModel.hideComfirm"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="取消按钮文字" span="24">
        <vxe-input v-model="optionModel.cancelButtonText"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="隐藏取消按钮" span="24">
        <vxe-switch v-model="optionModel.hideCancel"></vxe-switch>
      </vxe-form-item>
    </vxe-form>
  </div>
</template>

<script>
import i18n from "@/core/i18nLang";
//import Draggable from 'vuedraggable'

import { deepClone } from "@/core/utils/tool";
import Divider from "@/core/components/VForm/form-designer/rebuild-com/Divider.vue";

export default {
  name: "drawer-customClass-editor",
  componentName: "PropertyEditor",
  mixins: [i18n],
  components: {
    //Draggable,
    Divider,
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  data() {
    return {
      cssClassList: [],
    };
  },
  created() {
    this.cssClassList = deepClone(this.designer.getCssClassList());
    //监听表单css代码改动事件并重新加载！
    this.designer.handleEvent("form-css-updated", (cssClassList) => {
      this.cssClassList = cssClassList;
    });
  },
  methods: {
    addTabPane(curTabs) {
      this.designer.addTabPaneOfTabs(curTabs);
      this.designer.emitHistoryChange();
    },
    hiddenTabPane(curTabs, tpIdx, evt) {
      this.designer.hiddenTabPaneOfTabs(curTabs, tpIdx, evt);
      this.designer.emitHistoryChange();
    },

    deleteTabPane(curTabs, tpIdx) {
      if (curTabs.tabs.length === 1) {
        this.$message.info(this.i18nt("designer.hint.lastPaneCannotBeDeleted"));
        return;
      }

      this.designer.deleteTabPaneOfTabs(curTabs, tpIdx);
      this.designer.emitHistoryChange();
    },
  },
};
</script>

<style lang="scss" scoped>
li.col-item {
  list-style: none;

  span.col-span-title {
    display: inline-block;
    font-size: 13px;
    width: 120px;
  }

  .col-delete-button {
    margin-left: 6px;
  }
}

.panes-setting {
  ul {
    padding-inline-start: 0;
    padding-left: 0;
    /* 重置IE11默认样式 */
    margin: 0;
  }

  .drag-option {
    cursor: move;
  }

  li.ghost {
    background: #fff;
    border: 2px dotted $mainColor;
  }
}
</style>
