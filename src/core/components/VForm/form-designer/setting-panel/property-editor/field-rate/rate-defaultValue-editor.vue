<template>
  <el-form-item :label="i18nt('designer.setting.defaultValue')">
    <el-input-number v-model="optionModel.defaultValue" :min="0" :max="optionModel.max" style="width: 100%" :disabled="disabled" @change="emitDefaultValueChange"></el-input-number>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'
import propertyMixin from '@/core/components/VForm/form-designer/setting-panel/property-editor/propertyMixin'

export default {
  name: 'rate-defaultValue-editor',
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
