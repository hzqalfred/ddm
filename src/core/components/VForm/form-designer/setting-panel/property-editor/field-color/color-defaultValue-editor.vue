<template>
  <el-form-item :label="i18nt('designer.setting.defaultValue')">
    <el-color-picker v-model="optionModel.defaultValue" :disabled="disabled" @change="emitDefaultValueChange"></el-color-picker>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'
import propertyMixin from '@/core/components/VForm/form-designer/setting-panel/property-editor/propertyMixin'

export default {
  name: 'color-defaultValue-editor',
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
