<template>
  <el-form-item label="onSearchClick" label-width="150px">
    <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onSearchClick', eventParams)">
      {{ i18nt('designer.setting.addEventHandler') }}
    </el-button>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'
import eventMixin from '@/core/components/VForm/form-designer/setting-panel/property-editor/event-handler/eventMixin'

export default {
  name: 'onSearchClick-editor',
  mixins: [i18n, eventMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  data() {
    return {
      eventParams: ['result']
    }
  }
}
</script>

<style scoped></style>
