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
    <vxe-form ref="dividerSettingFormRef" :data="optionModel">
      <vxe-form-item title="主标题" span="24">
        <vxe-input v-model="optionModel.title" placeholder="主标题"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="副标题" span="24">
        <vxe-textarea v-model="optionModel.subtitle" placeholder="副标题"
          :autosize="{ minRows: 1, maxRows: 10 }"></vxe-textarea>
      </vxe-form-item>
      <vxe-form-item title="位置" span="24">
        <vxe-radio-group v-model="optionModel.align" size="mini" :strict="false">
          <vxe-radio-button label="center" content="居中"></vxe-radio-button>
          <vxe-radio-button label="left" content="靠左"></vxe-radio-button>
          <vxe-radio-button label="right" content="靠右"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      <vxe-form-item title="图标" span="24">
        <vxe-icon-picker v-model="optionModel.lefticon" clearable></vxe-icon-picker>
      </vxe-form-item>
      <vxe-form-item title="主题" span="24">
        <vxe-radio-group v-model="optionModel.styleType" size="mini" :strict="false">
          <vxe-radio-button label="1" content="无线"></vxe-radio-button>
          <vxe-radio-button label="2" content="虚线"></vxe-radio-button>
          <vxe-radio-button label="3" content="直线"></vxe-radio-button>
          <vxe-radio-button label="4" content="加粗直线"></vxe-radio-button>
          <vxe-radio-button label="5" content="波块直线"></vxe-radio-button>
          <vxe-radio-button label="6" content="重头细线"></vxe-radio-button>
          <vxe-radio-button label="7" content="重头粗线"></vxe-radio-button>
          <vxe-radio-button label="8" content="屋顶分割"></vxe-radio-button>
          <vxe-radio-button label="9" content="流式分割"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      <vxe-form-item title="标题颜色" span="12">
        <vxe-color-picker v-model="optionModel.titleColor" :colors="colorList" clearable></vxe-color-picker>
      </vxe-form-item>
      <vxe-form-item title="主题配色" span="12">
        <vxe-color-picker v-model="optionModel.lineColor" :colors="colorList" clearable></vxe-color-picker>
      </vxe-form-item>
    </vxe-form>
  </div>
</template>

<script>
import i18n from '@/core/i18nLang'
import { deepClone } from "@/core/utils/tool";
import Divider from '@/core/components/VForm/form-designer/rebuild-com/Divider.vue'

export default {
  name: "divider-customClass-editor",
  componentName: 'PropertyEditor',
  mixins: [i18n],
  components: {
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
      // 自定义可选颜色
      colorList: ['#1E90FF', '#00BFFF', '#008000', '#7CFC00', '#FF0000', '#FFA500', '#FFD700', '#000000', '#C0C0C0', '#FFFFFF']
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
