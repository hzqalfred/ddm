<template>
  <el-form-item :label="i18nt('designer.setting.defaultValue')">
    <el-time-picker
      v-model="optionModel.defaultValue"
      @change="emitDefaultValueChange"
      :disabled="disabled"
      :format="optionModel.format"
      value-format="HH:mm:ss"
      style="width: 100%"
    ></el-time-picker>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'
import propertyMixin from '@/core/components/VForm/form-designer/setting-panel/property-editor/propertyMixin'

export default {
  name: 'time-defaultValue-editor',
  mixins: [i18n, propertyMixin],
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
