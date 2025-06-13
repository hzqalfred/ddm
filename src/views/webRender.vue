<template>
  <div style="display: flex;">
    <vxe-tree
      ref="treeRef"
      v-if="!!treeList.length"
      transform
      v-model="treeValue"
      title-field="functionName"
      key-field="functionId"
      :node-config="nodeConfig"
      :data="treeList"
      show-line
      style="flex:1;padding:20px"
      @node-click="handleNodeClick"
    >
    </vxe-tree>
    <!-- 主表单区域 -->
    <div
      :style="{
        padding: loginFlag ? '0' : '20px',
        width: treeList.length
          ? '80%'
          : loginFlag
          ? '100%'
          : 'calc(100% - 40px)',
      }"
    >
      <!-- 主表单渲染 -->
      <v-form-render
        v-if="mainFormJson"
        :form-json="mainFormJson"
        :form-data="formData"
        :global-dsv="globalDsv"
        :data-center="dataCenter"
        :page-provide="pageProvide"
        ref="mainFormRef"
      >
        <!-- 自定义容器渲染插槽 -->
        <template #container-render="{ widget }">
          <sub-form-wrapper
            v-if="widget.type === 'subgrid'"
            :widget="widget"
            :parent-data="formData"
            :parent-param="parantParam"
            :data-center="dataCenter"
            :global-dsv="globalDsv"
            :page-provide="pageProvide"
          />
        </template>
      </v-form-render>
    </div>
  </div>
</template>
<script setup>
import { getModuleDetail } from "@/api/suiteManage";
import { getFunctionDetail } from "@/api/functionGenerator";
import { parseEnhance } from "@/core/utils/tool";
import { advancedFilterByHiddenElements } from "@/core/utils/auth";
import { ref, reactive, onMounted, inject, computed } from "vue";
import VFormRender from "@/core/components/VForm/form-render/form-render.vue";
import SubFormWrapper from "./SubFormWrapper.vue";
const homePage = inject("homePage");
const treeList = ref([]);
const treeValue = ref("");
const nodeConfig = reactive({
  isCurrent: true,
  trigger: "child",
  isHover: true,
});
const props = defineProps(["dataCenter", "data"]);
const dataCenter = props.dataCenter;
const originData = props.data;
const parantParam = originData?.param;
const pageProvide = homePage?.getPage(originData.id);
const mainFormJson = ref({});

const formData = reactive({});
const globalDsv = reactive({});
const mainFormRef = ref(null);

const module = ref({});

const loginFlag = computed(
  () => originData.id && originData.id == "login-form"
);

onMounted(async () => {
  

  // 目前唯运行端 originData.id是由moduleName-moduleCode-functionCode组成
  if (originData?.id && originData?.id?.split("-")?.length == 3) {
    let [moduleName, moduleCode, functionCode] = originData?.id?.split("-");
    module.value = { moduleName, moduleCode, functionCode };
  }
  module.value = Object.assign({}, module.value, parantParam);
  // 初始化数据
  if (module.value.formJson) {
    //web设计器 预览逻辑
    mainFormJson.value = parseEnhance(JSON.stringify(module.value.formJson));
  } else if (!module.value.functionCode) {
    //模块预览逻辑
    getList(module.value);
  } else {
    //功能预览逻辑  以及   运行端渲染逻辑
    await loadMainForm(module.value.functionCode);
  }
  globalDsv.param = Object.assign({}, globalDsv.param, module.value);

  setTimeout(() => {
    dataCenter.registerMainForm(mainFormRef.value);
    // 关键：同步表单字段到 DataCenter
    if (mainFormRef.value) {
      const formData = mainFormRef.value.getFormData(false);
      dataCenter.setData(formData);
    }
  }, 1);
});
const loadMainForm = async (functionCode) => {
  try {
    let param = {
      moduleName: module.value?.moduleName || "",
      moduleCode: module.value?.moduleCode || "",
      functionCode: functionCode,
    };
    // 1. 加载主表单
    const mainRes = await getFunctionDetail(param);

    let { allowPageElementList = [], definedElementList = [] } = mainRes.data;
    const allowSet = new Set(allowPageElementList);
    const differenceSet = definedElementList.filter(
      (item) => !allowSet.has(item)
    );
    console.log("结果:", differenceSet); // ["button49394"]

    mainFormJson.value = parseEnhance(
      mainRes?.data?.designJson || '{"widgetList": [],"formConfig": {}}'
    );
    if (differenceSet.length) {
      mainFormJson.value = advancedFilterByHiddenElements(
        mainFormJson.value,
        differenceSet,
        { affectParent: true }
      );
    }
    globalDsv.param = Object.assign({}, mainRes.data, globalDsv.param, {
      formJson: mainFormJson.value,
    });
    console.log(mainFormJson.value);
    let fcobj = mainFormJson.value.formConfig.globalObject;
    let eventMap = mainFormJson.value.formConfig.eventMap;
    let events = {};
    for (let key in eventMap) {
      events[key] = fcobj[eventMap[key]];
    }
    pageProvide.mergeEvents(events);
  } catch (e) {
    console.error("主表单加载失败:", e);
  }
};

const getList = (param) => {
  getModuleDetail(param).then((res) => {
    treeList.value = res.data.functionList;
  });
};
// 添加到 handleNodeClick 方法中
const handleNodeClick = async ({ node }) => {
  
  mainFormJson.value = "";
  await loadMainForm(node.functionCode);
  dataCenter.reinitialize();

  // 主表单加载后，注册并同步数据
  setTimeout(() => {
    dataCenter.registerMainForm(mainFormRef.value);

    // 关键：获取表单初始数据，同步到 DataCenter
    if (mainFormRef.value) {
      const initialData = mainFormRef.value.getFormData(false);
      dataCenter.setData(initialData);
    }
  }, 1);
};
</script>
