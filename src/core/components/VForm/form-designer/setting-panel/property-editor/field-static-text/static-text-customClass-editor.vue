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
    <vxe-form ref="staticTextSettingFormRef" :data="optionModel">
      <vxe-form-item title="标题" span="24">
        <vxe-textarea v-model="optionModel.title" placeholder="纯文字"
          :autosize="{ minRows: 2, maxRows: 4 }"></vxe-textarea>
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
      <vxe-form-item title="点击复制">
        <vxe-switch v-model="optionModel.clickToCopy" open-label="开" close-label="关"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item span="24">
        <Divider title="细处理" styleType="4" />
      </vxe-form-item>
      <vxe-form-item title="字体" span="12">
        <vxe-select v-model="optionModel.fontFamily">
          <vxe-option value="Arial, sans-serif" label="Arial无衬线字体"></vxe-option>
          <vxe-option value="Helvetica, sans-serif" label="Helvetica无衬线字体"></vxe-option>
          <vxe-option value="Verdana, sans-serif" label="Verdana无衬线字体"></vxe-option>
          <vxe-option value="'Times New Roman', serif" label="Times有衬线字体"></vxe-option>
          <vxe-option value="Georgia, serif" label="Georgia有衬线字体"></vxe-option>
          <vxe-option value="'Courier New', monospace" label="Courier等宽字体"></vxe-option>
          <vxe-option value="Consolas, monospace" label="Consolas等宽字体"></vxe-option>
        </vxe-select>
      </vxe-form-item>
      <vxe-form-item title="字号" span="12">
        <vxe-number-input v-model="optionModel.fontSize" min="6" max="72"></vxe-number-input>
      </vxe-form-item>
      <vxe-form-item title="粗细" span="12">
        <vxe-select v-model="optionModel.fontWeight">
          <vxe-option value="normal" label="正常"></vxe-option>
          <vxe-option value="bold" label="粗体"></vxe-option>
          <vxe-option value="bolder" label="更粗"></vxe-option>
          <vxe-option value="lighter" label="更细"></vxe-option>
        </vxe-select>
      </vxe-form-item>
      <vxe-form-item title="斜体" span="12">
        <vxe-select v-model="optionModel.fontStyle">
          <vxe-option value="normal" label="正常"></vxe-option>
          <vxe-option value="italic" label="斜体"></vxe-option>
          <vxe-option value="oblique" label="倾斜"></vxe-option>
        </vxe-select>
      </vxe-form-item>
      <vxe-form-item title="线条" span="12">
        <vxe-select v-model="optionModel.textDecoration">
          <vxe-option value="none" label="无装饰线"></vxe-option>
          <vxe-option value="underline" label="下划线"></vxe-option>
          <vxe-option value="overline" label="上划线"></vxe-option>
          <vxe-option value="line-through" label="删除线"></vxe-option>
        </vxe-select>
      </vxe-form-item>
      <vxe-form-item title="缩进" span="12">
        <vxe-number-input v-model="optionModel.textIndent"></vxe-number-input>
      </vxe-form-item>
      <vxe-form-item title="行高" span="12">
        <vxe-number-input v-model="optionModel.lineHeight"></vxe-number-input>
      </vxe-form-item>
      <vxe-form-item title="间距" span="12">
        <vxe-number-input v-model="optionModel.letterSpacing"></vxe-number-input>
      </vxe-form-item>
      <vxe-form-item title="对齐方式" span="24">
        <vxe-select v-model="optionModel.comtextAlign">
          <vxe-option value="left" label="左对齐"></vxe-option>
          <vxe-option value="right" label="右对齐"></vxe-option>
          <vxe-option value="center" label="居中对齐"></vxe-option>
          <vxe-option value="justify" label="两端对齐"></vxe-option>
        </vxe-select>
      </vxe-form-item>
      <vxe-form-item title="大小写转换" span="24">
        <vxe-select v-model="optionModel.textTransform">
          <vxe-option value="none" label="不转换"></vxe-option>
          <vxe-option value="uppercase" label="转大写"></vxe-option>
          <vxe-option value="lowercase" label="转小写"></vxe-option>
          <vxe-option value="capitalize" label="首字母转大写"></vxe-option>
        </vxe-select>
      </vxe-form-item>
    </vxe-form>
  </div>
</template>

<script>
import i18n from '@/core/i18nLang'
import { deepClone } from "@/core/utils/tool";
import Divider from '@/core/components/VForm/form-designer/rebuild-com/Divider.vue'

export default {
  name: "static-text-customClass-editor",
  componentName: 'PropertyEditor',
  mixins: [i18n],
  components: {
    Divider
  },

  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  data() {
    return {
      cssClassList: [],
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
