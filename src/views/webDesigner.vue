<template>
  <div>
    <v-form-designer
      :data-service="dataService"
      :form-json="formJson"
      :form-data="formData"
      :global-dsv="globalDsv"
      :data-center="allProps?.dataCenter"
      :fun-id="allProps?.dataCenter?.funId"
      ref="vFormRef"
    >
    </v-form-designer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import VFormDesigner from "@/core/components/VForm/form-designer/form-designer.vue";
import { saveDesignJson, getFunctionDetail } from "@/api/webDesigner";
import { getModuleDetail } from "@/api/suiteManage";
import { listService } from "@/api/dataService";
import { parseEnhance } from "@/core/utils/tool";
import Message from "../core/Message";
const formJson = reactive({});
const props = defineProps(["dataCenter", "data"]);
const allProps = reactive({ ...props });
const ParentParam = allProps?.data?.param;
const formData = reactive({});
const globalDsv = reactive({});
const vFormRef = ref(null);
const dataService = ref(null);
onMounted(async () => {
  let services = await listService({
    moduleName: ParentParam?.moduleName || "",
    moduleCode: ParentParam?.moduleCode || "",
  });
  dataService.value = services.data;
  let functionParam = {
    moduleName: ParentParam?.moduleName || "",
    moduleCode: ParentParam?.moduleCode || "",
    functionCode: ParentParam?.functionCode || "",
  };
  allProps.dataCenter.subscribe("saveJson", (designJson) => {
    let data = Object.assign({}, functionParam, { designJson });
    saveDesignJson(data).then((res) => {
      Message.notifySuccess(res?.msg || "保存成功");
    });
  });
  let { data: mainData } = await getFunctionDetail(functionParam);
  const designJson = ParentParam?.designJson
    ? ParentParam.designJson
    : parseEnhance(
        mainData.designJson || '{"widgetList": [],"formConfig": {}}'
      );
  const columnList = mainData.columnList || [];
  const methodList = mainData.methodList || [];
  const widgetList = designJson?.widgetList;

  const formConfig = Object.assign(designJson?.formConfig, {
    moduleId: ParentParam?.moduleCode + "_" + ParentParam?.functionCode,
    moduleName: ParentParam?.moduleName,
    moduleCode: ParentParam?.moduleCode,
    functionCode: ParentParam?.functionCode,
  });
  // const subFunctionCodes = mainData.subFunctionCodes || [];
  let moduleParam = {
    moduleCode: functionParam.moduleCode,
    moduleName: functionParam.moduleName,
    moduleId: ParentParam?.moduleId || "",
  };
  let { data: moduleData } = await getModuleDetail(moduleParam);
  let subData = moduleData.functionList.filter((item) => {
    return item.functionCode != ParentParam?.functionCode;
  });
  let formJson = Object.assign({}, designJson, {
    columnList,
    methodList,
    widgetList,
    formConfig,
    module: ParentParam,
    subData,
  });

  vFormRef.value.setFormJson(formJson);
  globalDsv.param = Object.assign({}, globalDsv.param, ParentParam, {
    formJson,
  });
});
</script>
