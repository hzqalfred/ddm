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
      <el-option v-for="(ft, ftIdx) in uploadPictureTypes" :key="ftIdx" :label="ft.label" :value="ft.value"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'
import SvgIcon from '@/core/components/SvgIcon/index.vue'

export default {
  name: 'picture-upload-fileTypes-editor',
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
      uploadPictureTypes: [
        { value: 'jpg', label: 'jpg' } /* label如用大写字母，选择两个文件类型就会导致设置面板快速抖动、闪烁，非常奇怪！！ */,
        { value: 'jpeg', label: 'jpeg' },
        { value: 'png', label: 'png' },
        { value: 'gif', label: 'gif' },
        { value: 'bmp', label: 'bmp' },
        { value: 'webp', label: 'webp' }
      ]
    }
  }
}
</script>

<style scoped></style>
