<template>
  <el-form-item :label="i18nt('designer.setting.rows')">
    <el-input-number v-model="optionModel.rows" style="width: 100%"></el-input-number>
  </el-form-item>
</template>

<script>
  import i18n from '@/core/i18nLang'

  export default {
    name: "rows-editor",
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
