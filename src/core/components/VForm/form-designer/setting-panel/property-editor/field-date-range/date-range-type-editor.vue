<template>
  <el-form-item :label="i18nt('designer.setting.displayType')">
    <el-select v-model="optionModel.type" :disabled="disabled">
      <el-option label="daterange" value="daterange"></el-option>
      <el-option label="datetimerange" value="datetimerange"></el-option>
      <el-option label="monthrange" value="monthrange"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'

export default {
  name: 'date-range-type-editor',
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

<style lang="scss" scoped></style>
