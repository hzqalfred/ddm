<template>
  <el-form-item :label="i18nt('designer.setting.requiredHint')">
    <el-input type="text" v-model="optionModel.requiredHint"></el-input>
  </el-form-item>
</template>

<script>
  import i18n from '@/core/i18nLang'
  import propertyMixin from "@/core/components/VForm/form-designer/setting-panel/property-editor/propertyMixin"

  export default {
    name: "requiredHint-editor",
    mixins: [i18n, propertyMixin],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style scoped>

</style>
