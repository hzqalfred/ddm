<template>
  <el-form-item :label="i18nt('designer.setting.displayType')">
    <el-select v-model="optionModel.type" :disabled="disabled">
      <el-option label="datetime" value="datetime"></el-option>
      <el-option label="datetimes" value="datetimes"></el-option>
      <el-option label="date" value="date"></el-option>
      <el-option label="dates" value="dates"></el-option>
      <el-option label="year" value="year"></el-option>
      <el-option label="month" value="month"></el-option>
      <el-option label="week" value="week"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'

export default {
  name: 'date-type-editor',
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
