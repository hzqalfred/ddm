<template>
  <el-form-item :label="i18nt('designer.setting.valueFormat')">
    <el-select v-model="optionModel.valueFormat" filterable allow-create :disabled="disabled">
      <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
      <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'

export default {
  name: 'date-valueFormat-editor',
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
