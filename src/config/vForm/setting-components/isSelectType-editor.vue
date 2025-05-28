<template>
  <el-radio-group
    v-model="optionModel.isSelectType"
    size="small"
    :disabled="!optionModel.selectabled"
  >
    <el-radio-button label="单选" value="radio"></el-radio-button>
    <el-radio-button label="多选" value="checkbox"> </el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
  name: "isSelectType-editor",
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  computed: {},
};
</script>

<style lang="scss" scoped></style>
