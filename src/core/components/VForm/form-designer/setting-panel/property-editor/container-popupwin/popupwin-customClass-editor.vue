<template>
  <div>
    <vxe-form ref="tabSettingFormRef" :data="optionModel">

      <vxe-form-item title="类型" span="24">
        <vxe-radio-group v-model="optionModel.type" size="mini">
          <vxe-radio-button label="modal" content="中央窗口"></vxe-radio-button>
          <vxe-radio-button label="drawer" content="侧滑窗口"></vxe-radio-button>
          <vxe-radio-button label="funwin" content="功能窗口"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>

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


    </vxe-form>
  </div>
</template>

<script>
import i18n from '@/core/i18nLang'
import { deepClone } from "@/core/utils/tool";

export default {
  name: "popupwin-customClass-editor",
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
