<template>
  <el-form-item v-if="!hasConfig('optionItems')" :label="i18nt('designer.setting.defaultValue')">
    <el-input type="text" v-model="optionModel.defaultValue" :disabled="disabled" @change="emitDefaultValueChange"></el-input>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'
import propertyMixin from '@/core/components/VForm/form-designer/setting-panel/property-editor/propertyMixin'

export default {
  name: 'defaultValue-editor',
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
