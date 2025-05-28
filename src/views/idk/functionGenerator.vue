<template>
  <el-steps :active="active" align-center style="margin-bottom: 40px;">
    <el-step title="基础信息填写" @click="handleClickStepItem(0)" />
    <el-step title="数据服务设置" @click="handleClickStepItem(1)" />
    <el-step title="界面设置" @click="handleClickStepItem(2)" />
    <el-step title="其他设置" @click="handleClickStepItem(3)" />
  </el-steps>

  <writeBasic v-if="active == 0" :funData="funData" />
  <dataService v-if="active == 1" :funData="funData" />
  <interfaceSetting v-if="active == 2" :funData="funData" />
  <otherString v-if="active == 3" :funData="funData" />
</template>

<script>
import {
  saveBaseInfo,
  saveDesignJson,
  getFunctionDetail,
} from "@/api/functionGenerator";
import messageHandler from "@/core/Message";
import { VxeUI } from "vxe-pc-ui";

import writeBasic from "./funbase/writeBasic.vue";
import dataService from "./funbase/dataService.vue";
import interfaceSetting from "./funbase/interfaceSetting.vue";
import otherString from "./funbase/otherString.vue";
import generateJson from "@/config/designData.js";

export default {
  name: "functiongenerator",
  props: ["modData"],
  components: {
    writeBasic: writeBasic,
    dataService: dataService,
    interfaceSetting: interfaceSetting,
    otherString: otherString,
  },
  data() {
    return {
      funData: {}, // 当前功能信息
      active: 0, // 步骤
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
    async next(writeBasicData) {
      if ([1, 2].includes(this.active)) {
        this.toNext();
      } else if (this.active == 0) {
        this.funData = writeBasicData;
        const pam = this.funData;
        if (pam.subFunctionCodes && typeof pam.subFunctionCodes != "object") {
          pam.subFunctionCodes = pam.subFunctionCodes.split(";");
        } else {
          pam.subFunctionCodes = pam.subFunctionCodes;
        }
        saveBaseInfo(pam).then((res) => {
          if (res.code == "200") {
            messageHandler.notifySuccess("保存功能成功！");
          }
        });
        this.toNext();
      } else if (this.active == 3) {
        this.toNext();
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
                let designJson = JSON.stringify(
                  { widgetList, formConfig },
                  null,
                  "  "
                );
                let data = Object.assign({}, param, { designJson });
                saveDesignJson(data).then((res) => {
                  messageHandler.notifySuccess("保存功能设计Json成功！");
                });
                if (typeof this.$parent.beforeHideMethod === "function") {
                  this.$parent.beforeHideMethod();
                }
              }
            });
          },
          onCancel: () => {
            if (typeof this.$parent.beforeHideMethod === "function") {
              this.$parent.beforeHideMethod();
            }
          },
        });
      }
    },
    toNext() {
      if (this.active < 4) {
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
