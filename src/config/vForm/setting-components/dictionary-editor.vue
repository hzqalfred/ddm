<template>
  <el-select v-model="optionModel.dictionary" filterable clearable allow-create>
      <el-option v-for="(fv, fvIdx) in dictionaryOptions" :key="fvIdx" :label="fv.label" :value="fv.value"></el-option>
    </el-select>
</template>

<script>
import { ref, onMounted, nextTick, inject } from "vue";
export default {
  name: "dictionary-editor",
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  setup(props) {
    const getGlobalDsv = inject("getGlobalDsv", () => props.globalDsv || {});
    setTimeout(() => {
        console.log(getGlobalDsv())
    }, 1000);
  }
};
</script>

<style lang="scss" scoped></style>
