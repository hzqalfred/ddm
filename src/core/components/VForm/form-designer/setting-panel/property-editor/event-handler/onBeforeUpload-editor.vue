<template>
  <el-form-item label="onBeforeUpload" label-width="150px">
    <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onBeforeUpload', eventParams)">
      {{i18nt('designer.setting.addEventHandler')}}</el-button>
  </el-form-item>
</template>

<script>
  import i18n from '@/core/i18nLang'
  import eventMixin from "@/core/components/VForm/form-designer/setting-panel/property-editor/event-handler/eventMixin"

  export default {
    name: "onBeforeUpload-editor",
    mixins: [i18n, eventMixin],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
        eventParams: ['file'],
      }
    }
  }
</script>

<style scoped>

</style>
