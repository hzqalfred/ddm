<template>
  <el-form-item>
    <template #label>
      <span>
        {{ i18nt('designer.setting.fileTypes') }}
        <el-tooltip effect="light" :content="i18nt('designer.setting.fileTypesHelp')">
          <svg-icon icon-class="el-info" />
        </el-tooltip>
      </span>
    </template>
    <el-select multiple allow-create filterable default-first-option v-model="optionModel.fileTypes" style="width: 100%">
      <el-option v-for="(ft, ftIdx) in uploadFileTypes" :key="ftIdx" :label="ft.label" :value="ft.value"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'
import SvgIcon from '@/core/components/SvgIcon/index.vue'

export default {
  name: 'file-upload-fileTypes-editor',
  mixins: [i18n],
  components: {
    SvgIcon
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  data() {
    return {
      uploadFileTypes: [
        { value: 'mp3', lable: 'mp3' },
        { value: 'xls', lable: 'xls' },
        { value: 'xlsx', lable: 'xlsx' },
        { value: 'doc', lable: 'doc' },
        { value: 'dot', lable: 'dot' },
        { value: 'docx', lable: 'docx' },
        { value: 'docm', lable: 'docm' },
        { value: 'dotx', lable: 'dotx' },
        { value: 'dotm', lable: 'dotm' },
        { value: 'pdf', lable: 'pdf' },
        { value: 'txt', lable: 'txt' },
        { value: 'wps', lable: 'wps' },
        { value: 'ppt', lable: 'ppt' },
        { value: 'pptx', lable: 'pptx' },
        { value: 'pptm', lable: 'pptm' },
        { value: 'potm', lable: 'potm' },
        { value: 'potx', lable: 'potx' },
        { value: 'ppam', lable: 'ppam' },
        { value: 'htm', lable: 'htm' },
        { value: 'mht', lable: 'mht' },
        { value: 'mhtml', lable: 'mhtml' },
        { value: 'html', lable: 'html' },
        { value: 'xml', lable: 'xml' },
        { value: 'rar', lable: 'rar' },
        { value: 'zip', lable: 'zip' },
        { value: 'iso', lable: 'iso' },
        { value: 'tar', lable: 'tar' },
        { value: 'gz', lable: 'gz' },
        { value: 'gif', lable: 'gif' },
        { value: 'jpg', lable: 'jpg' },
        { value: 'jpeg', lable: 'jpeg' },
        { value: 'bmp', lable: 'bmp' },
        { value: 'png', lable: 'png' },
        { value: 'webp', lable: 'webp' },
        { value: 'wgt', lable: 'wgt' }
      ]
    }
  }
}
</script>

<style scoped></style>
