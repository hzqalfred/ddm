<template>
  <el-form-item :label="i18nt('designer.setting.defaultValue')">
    <el-switch v-model="optionModel.defaultValue" @change="emitDefaultValueChange" :disabled="disabled" active-text="true" inactive-text="false"></el-switch>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'
import propertyMixin from '@/core/components/VForm/form-designer/setting-panel/property-editor/propertyMixin'

export default {
  name: 'switch-defaultValue-editor',
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
