<template>
  <el-form-item :label="i18nt('designer.setting.format')">
    <el-select v-model="optionModel.format" filterable allow-create :disabled="disabled">
      <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
      <el-option label="YYYY/MM/DD" value="YYYY/MM/DD"></el-option>
      <el-option label="YYYY年MM月DD日" value="YYYY年MM月DD日"></el-option>
      <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss"></el-option>
      <el-option label="YYYY-MM-DD hh:mm:ss" value="YYYY-MM-DD hh:mm:ss"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'

export default {
  name: 'date-range-format-editor',
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
