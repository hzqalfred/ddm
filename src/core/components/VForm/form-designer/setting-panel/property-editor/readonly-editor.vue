<template>
  <el-form-item :label="i18nt('designer.setting.readonly')">
    <el-switch v-model="optionModel.readonly" :disabled="disabled"></el-switch>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'

export default {
  name: 'readonly-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  computed: {
    disabled() {
      return this.optionModel.isFunItem
    }
  }
}
</script>

<style scoped></style>
