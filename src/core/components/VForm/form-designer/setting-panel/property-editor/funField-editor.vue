<template>
  <el-form-item prop="isFunItem">
    <template #label>
      <span>
        {{ i18nt('designer.setting.isFunField') }}
        <el-tooltip effect="light" content="若为功能字段，则该字段所有基础属性都是在字段明细表中修改。">
          <svg-icon icon-class="el-info" />
        </el-tooltip>
      </span>
    </template>
    <el-switch v-model="optionModel.isFunItem" disabled></el-switch>
  </el-form-item>
</template>

<script>
import i18n from '@/core/i18nLang'
import SvgIcon from '@/core/components/SvgIcon/index.vue'

export default {
  name: 'isFunItem-editor',
  mixins: [i18n],
  components: {
    SvgIcon
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
