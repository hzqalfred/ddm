<template>
  <el-form-item :label="i18nt('designer.setting.format')">
    <el-select v-model="optionModel.format" filterable allow-create :disabled="disabled">
      <el-option label="HH:mm:ss" value="HH:mm:ss"></el-option>
      <el-option label="HH时mm分ss秒" value="HH时mm分ss秒"></el-option>
      <el-option label="hh:mm:ss" value="hh:mm:ss"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'

export default {
  name: 'time-range-format-editor',
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
