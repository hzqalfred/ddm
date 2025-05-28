<template>
  <el-form-item :label="i18nt('designer.setting.label')" v-if="!noLabelSetting">
    <el-input type="text" v-model="optionModel.label" :disabled="disabled"></el-input>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'

export default {
  name: 'label-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  computed: {
    disabled() {
      return this.optionModel.isFunItem
    },
    noLabelSetting() {
      return this.selectedWidget.type === 'static-text' || this.selectedWidget.type === 'html-text'
      //|| (this.selectedWidget.type === 'divider')
    }
  }
}
</script>

<style lang="scss" scoped></style>
