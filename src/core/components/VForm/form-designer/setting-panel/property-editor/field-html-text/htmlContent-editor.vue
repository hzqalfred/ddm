<template>
  <div>
    <vxe-form ref="htmlSettingFormRef" :data="optionModel" vertical>
      <vxe-form-item title="HTML代码：" span="24">
        <vxe-textarea v-model="optionModel.htmlContent" placeholder="HTML代码编辑" :autosize="{ minRows: 14, maxRows: 50 }"></vxe-textarea>      </vxe-form-item>
    </vxe-form>
  </div>
</template>

<script>
  import i18n from '@/core/i18nLang'

  export default {
    name: "htmlContent-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>