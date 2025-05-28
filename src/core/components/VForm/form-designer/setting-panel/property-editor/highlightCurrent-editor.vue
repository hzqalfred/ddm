<template>
  <el-form-item :label="i18nt('designer.setting.highlightCurrent')">
    <el-switch v-model="optionModel.highlightCurrent"></el-switch>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'

export default {
  name: 'highlightCurrent-editor',
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
