<template>
  <el-form-item :label="i18nt('designer.setting.buttonStyle')">
    <el-switch v-model="optionModel.buttonStyle"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from '@/core/i18nLang'

  export default {
    name: "buttonStyle-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style scoped>

</style>
