<template>
  <div>
    <!-- 
      yao:
        1.统一 VXE UI 
        2.不过度接入外部纯写 
        3.国际化等所有组件完成处理
     -->
    <!-- <el-form-item :label="i18nt('designer.setting.customClass')">
      <el-select v-model="optionModel.customClass" multiple filterable allow-create default-first-option>
        <el-option v-for="(item, idx) in cssClassList" :key="idx" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item> -->
    <vxe-form ref="buttonSettingFormRef" :data="optionModel">
      <vxe-form-item title="标题" span="24">
        <vxe-input v-model="optionModel.title"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="归属" span="24">
        <vxe-input v-model="optionModel.belongTo" placeholder="绑定表格唯一属性"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="模式" span="24">
        <vxe-radio-group v-model="optionModel.mode" size="mini">
          <vxe-radio-button label="button" content="按钮（有边框）"></vxe-radio-button>
          <vxe-radio-button label="text" content="文字（无边框）"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      <vxe-form-item title="位置" span="24">
        <vxe-radio-group v-model="optionModel.float" size="mini">
          <vxe-radio-button label="center" content="居中"></vxe-radio-button>
          <vxe-radio-button label="flex-start" content="靠左"></vxe-radio-button>
          <vxe-radio-button label="flex-end" content="靠右"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      <vxe-form-item title="尺寸" span="24">
        <vxe-radio-group v-model="optionModel.comsize" size="mini">
          <vxe-radio-button label="" content="默认"></vxe-radio-button>
          <vxe-radio-button label="medium" content="中等"></vxe-radio-button>
          <vxe-radio-button label="small" content="小型"></vxe-radio-button>
          <vxe-radio-button label="mini" content="超小"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      <vxe-form-item title="状态" span="12">
        <vxe-select v-model="optionModel.status" placeholder="状态">
          <vxe-option value="" label="默认"></vxe-option>
          <vxe-option value="primary" label="主要"></vxe-option>
          <vxe-option value="success" label="成功"></vxe-option>
          <vxe-option value="info" label="信息"></vxe-option>
          <vxe-option value="warning" label="警告"></vxe-option>
          <vxe-option value="error" label="错误"></vxe-option>
        </vxe-select>
      </vxe-form-item>
      <vxe-form-item title="图标" span="12">
        <vxe-icon-picker v-model="optionModel.icon" clearable></vxe-icon-picker>
      </vxe-form-item>
      <vxe-form-item title="圆角？">
        <vxe-switch v-model="optionModel.round" open-label="开" close-label="关"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="圆形？">
        <vxe-switch v-model="optionModel.circle" open-label="开" close-label="关"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="加载？">
        <vxe-switch v-model="optionModel.loading" open-label="开" close-label="关"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="禁用？">
        <vxe-switch v-model="optionModel.comdisabled" open-label="开" close-label="关"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="前缀提示">
        <vxe-input v-model="optionModel.prefixTooltip"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="后缀提示">
        <vxe-input v-model="optionModel.suffixTooltip"></vxe-input>
      </vxe-form-item>
    </vxe-form>
  </div>
</template>

<script>
import i18n from '@/core/i18nLang'
//import Draggable from 'vuedraggable'
import { deepClone } from "@/core/utils/tool";

export default {
  name: "button-customClass-editor",
  componentName: 'PropertyEditor',
  mixins: [i18n],
  components: {
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  data() {
    return {
      cssClassList: [],
    }
  },
  created() {
    this.cssClassList = deepClone(this.designer.getCssClassList())
    //监听表单css代码改动事件并重新加载！
    this.designer.handleEvent('form-css-updated', (cssClassList) => {
      this.cssClassList = cssClassList
    })
  },
  methods: {

  }
}
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
