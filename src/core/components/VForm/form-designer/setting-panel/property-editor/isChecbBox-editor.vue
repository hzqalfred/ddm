<template>
  <el-form-item :label="i18nt('designer.setting.isCheckBox')">
    <el-switch v-model="optionModel.isCheckBox"></el-switch>
    <div>1</div>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'

export default {
  name: 'isCheckBox-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  computed: {}
}
</script>

<style scoped></style>
