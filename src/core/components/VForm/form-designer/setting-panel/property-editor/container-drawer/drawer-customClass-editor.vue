<template>
  <div>
    <vxe-form ref="tabSettingFormRef" :data="optionModel">

      <vxe-form-item title="标题" span="24">
        <vxe-input v-model="optionModel.title" placeholder="系统提示"></vxe-input>
      </vxe-form-item>

      <vxe-form-item title="尺寸" span="24">
        <vxe-radio-group v-model="optionModel.comsize" size="mini">
          <vxe-radio-button label="" content="默认"></vxe-radio-button>
          <vxe-radio-button label="medium" content="中等"></vxe-radio-button>
          <vxe-radio-button label="small" content="小型"></vxe-radio-button>
          <vxe-radio-button label="mini" content="超小"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>

      <vxe-form-item title="方向" span="24">
        <vxe-radio-group v-model="optionModel.position" size="mini">
          <vxe-radio-button label="left" content="左侧"></vxe-radio-button>
          <vxe-radio-button label="right" content="右侧"></vxe-radio-button>
          <vxe-radio-button label="top" content="顶部"></vxe-radio-button>
          <vxe-radio-button label="bottom" content="底部"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      
      <vxe-form-item title="宽度" span="24" v-if="optionModel.position == 'left' || optionModel.position == 'right'">
        <vxe-input v-model="optionModel.width"></vxe-input>
      </vxe-form-item>

      <vxe-form-item title="高度" span="24" v-if="optionModel.position == 'top' || optionModel.position == 'bottom'">
        <vxe-input v-model="optionModel.height"></vxe-input>
      </vxe-form-item>

      <vxe-form-item title="设置内边距" span="24">
        <vxe-switch v-model="optionModel.padding"></vxe-switch>
      </vxe-form-item>

      <vxe-form-item title="是否可拉伸" span="24">
        <vxe-switch v-model="optionModel.resize"></vxe-switch>
      </vxe-form-item>

      <vxe-form-item title="点击遮罩关闭" span="24">
        <vxe-switch v-model="optionModel.maskClosable"></vxe-switch>
      </vxe-form-item>

      <vxe-form-item title="是否ESC关闭" span="24">
        <vxe-switch v-model="optionModel.escClosable"></vxe-switch>
      </vxe-form-item>

    </vxe-form>
  </div>
</template>

<script>
import i18n from '@/core/i18nLang'
import { deepClone } from "@/core/utils/tool";

export default {
  name: "drawer-customClass-editor",
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
</style>
