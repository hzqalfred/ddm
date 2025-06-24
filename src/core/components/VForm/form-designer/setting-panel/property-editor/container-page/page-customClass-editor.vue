<template>
  <div>
    <vxe-form ref="tabSettingFormRef" :data="optionModel">
      <vxe-form-item title="functionCode" span="24">
        <vxe-input v-model="optionModel.functionCode"></vxe-input>
      </vxe-form-item>

      <vxe-form-item title="moduleName" span="24">
        <vxe-input v-model="optionModel.moduleName"></vxe-input>
      </vxe-form-item>

      <vxe-form-item title="moduleCode" span="24">
        <vxe-input v-model="optionModel.moduleCode"></vxe-input>
      </vxe-form-item>
    </vxe-form>
  </div>
</template>

<script>
import i18n from "@/core/i18nLang";
import { deepClone } from "@/core/utils/tool";

export default {
  name: "page-customClass-editor",
  componentName: "PropertyEditor",
  mixins: [i18n],
  components: {},
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  data() {
    return {
      cssClassList: [],
    };
  },
  created() {
    this.cssClassList = deepClone(this.designer.getCssClassList());
    //监听表单css代码改动事件并重新加载！
    this.designer.handleEvent("form-css-updated", (cssClassList) => {
      this.cssClassList = cssClassList;
    });
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
