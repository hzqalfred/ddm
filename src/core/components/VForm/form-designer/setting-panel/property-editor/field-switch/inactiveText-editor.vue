<template>
  <el-form-item :label="i18nt('designer.setting.inactiveText')">
    <el-input v-model="optionModel.inactiveText"></el-input>
  </el-form-item>
</template>

<script>
  import i18n from '@/core/i18nLang'

  export default {
    name: "inactiveText-editor",
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
