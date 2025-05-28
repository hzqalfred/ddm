<template>
  <el-form-item v-if="formConfig.layoutType === 'H5'" :label="i18nt('designer.setting.scanCode')">
    <el-switch v-model="optionModel.scanCode"></el-switch>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'

export default {
  name: 'scanCode-editor',
  mixins: [i18n],
  inject: ['getDesignerConfig'],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
    formConfig: Object
  },
  data() {
    return {
      designerConfig: this.getDesignerConfig()
    }
  }
}
</script>

<style scoped></style>
