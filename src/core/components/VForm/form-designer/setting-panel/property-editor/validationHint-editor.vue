<template>
  <el-form-item :label="i18nt('designer.setting.validationHint')">
    <el-input type="text" v-model="optionModel.validationHint"></el-input>
  </el-form-item>
</template>

<script>
  import i18n from '@/core/i18nLang'

  export default {
    name: "validationHint-editor",
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
