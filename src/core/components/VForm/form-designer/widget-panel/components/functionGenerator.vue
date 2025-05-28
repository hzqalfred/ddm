<template>
  <el-steps :active="active" align-center style="margin-bottom: 40px;">
    <el-step title="数据服务设置" @click="handleClickStepItem(1)" />
    <el-step title="界面设置" @click="handleClickStepItem(2)" />
  </el-steps>

  <dataService v-if="active == 1" :funData="funData" />
  <interfaceSetting v-if="active == 2" :funData="funData" />
</template>

<script>
import { getFunctionDetail } from "@/api/functionGenerator";
import { VxeUI } from "vxe-pc-ui";

import dataService from "./funbase/dataService.vue";
import interfaceSetting from "./funbase/interfaceSetting.vue";
import generateJson from "@/config/designData.js";

export default {
  name: "functiongenerator",
  props: ["modData"],
  components: {
    dataService: dataService,
    interfaceSetting: interfaceSetting,
  },
  data() {
    return {
      funData: {}, // 当前功能信息
      active: 1, // 步骤
    };
  },
  watch: {
    modData: {
      handler(newValue) {
        this.funData.moduleName = newValue.moduleName;
        this.funData.moduleCode = newValue.moduleCode;
        this.funData.moduleId = newValue.moduleId;
        this.funData.functionType = newValue.functionType;
        this.funData.functionCode = newValue.functionCode;
        this.funData.functionName = newValue.functionName;
        this.funData.functionId = newValue.functionId;
        this.funData.orderIndex = newValue.orderIndex;
      },
      deep: true,
    },
  },
  created() {
    if (this.modData) {
      this.funData.moduleName = this.modData.moduleName;
      this.funData.moduleCode = this.modData.moduleCode;
      this.funData.moduleId = this.modData.moduleId;
      this.funData.functionType = this.modData.functionType;
      this.funData.functionCode = this.modData.functionCode;
      this.funData.functionName = this.modData.functionName;
      this.funData.functionId = this.modData.functionId;
      this.funData.orderIndex = this.modData.orderIndex;
    } else {
      this.funData = {};
    }
  },
  methods: {
    changeTemplate(val) {
      this.funData.functionType = val;
    },
    async next() {
      if (this.active == 1) {
        this.toNext();
      } else if (this.active == 2) {
        VxeUI.modal.confirm({
          title: "提示",
          content: "是否重新生成grid、form设计文件",
          draggable: false,
          onConfirm: () => {
            const param = {
              moduleName: this.funData.moduleName,
              moduleCode: this.funData.moduleCode,
              functionCode: this.funData.functionCode,
            };
            getFunctionDetail(param).then((res) => {
              console.log(res.data);
              console.log(JSON.stringify(res.data));
              if (res.code == "200") {
                let mainData = res.data;
                const columnList = mainData.columnList || [];
                const methodList = mainData.methodList || [];
                let formJson = Object.assign(
                  {},
                  {
                    columnList,
                    methodList,
                    widgetList: [],
                    formConfig: {
                      moduleId:
                        this.funData?.moduleCode +
                        "_" +
                        this.funData?.functionCode,
                    },
                    module: this.funData,
                  }
                );
                let { widgetList, formConfig } = generateJson(formJson);
                this.$emit("generateData", { widgetList, formConfig });
              }
            });
          },
          onCancel: () => {
            this.$emit("generateData");
          },
        });
      }
    },
    toNext() {
      if (this.active < 2) {
        this.active++;
      }
    },
    handleClickStepItem(val) {
      this.active = val;
    },
  },
};
</script>

<style>
.el-steps {
  background-color: #f0f0f0;
}

.el-step.is-center .el-step__head,
.el-step.is-center .el-step__main {
  text-align: center;
  margin-top: 14px;
}

.vxe-input--wrapper {
  height: var(--vxe-form-item-min-height-small) !important;
}

.next-button {
  position: fixed;
  right: 40px;
  bottom: 20px;
  float: none;
  z-index: 12;
}
</style>
