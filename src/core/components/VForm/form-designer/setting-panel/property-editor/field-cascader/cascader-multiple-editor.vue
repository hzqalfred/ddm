<template>
  <el-form-item :label="i18nt('designer.setting.multiple')">
    <el-switch v-model="optionModel.multiple"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from '@/core/i18nLang'
  import propertyMixin from "@/core/components/VForm/form-designer/setting-panel/property-editor/propertyMixin"

  export default {
    name: "cascader-multiple-editor",
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
