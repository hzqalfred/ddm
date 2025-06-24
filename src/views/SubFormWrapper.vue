<!-- SubFormWrapper.vue -->
<template>
  <div class="sub-form-container">
    <div v-if="loading" class="loading-tip">
      <el-icon class="is-loading"><Loading /></el-icon>
      子表单加载中...
    </div>
    <v-form-render
      v-else
      ref="subFormRef"
      :key="formKey"
      :form-json="subFormJson"
      :form-data="formData"
      :parent-data="parentData"
      :data-center="dataCenter"
      :global-dsv="globalDsv"
      :page-provide="pageProvide"
    />
  </div>
</template>

<script setup>
import { ref, watchEffect, computed } from "vue";
import { getFunctionDetail } from "@/api/webDesigner";
import VFormRender from "@/core/components/VForm/form-render/form-render.vue";
import { parseEnhance } from "@/core/utils/tool";

const props = defineProps({
  widget: Object,
  parentParam: Object,
  parentData: Object,
  dataCenter: Object,
  globalDsv: Object,
  pageProvide:Object
});

const loading = ref(true);
const subFormJson = ref(null);
const formData = ref({});
const formKey = ref(Date.now());
const subFormRef = ref(null);

// 获取functionCode
const functionCode = computed(() => props.widget?.options?.functionCode);
const moduleName = computed(
  () => props.widget?.options?.moduleName || props.parentParam?.moduleName
);
const moduleCode = computed(
  () => props.widget?.options?.moduleCode || props.parentParam?.moduleCode
);

// 监听functionCode变化
watchEffect(async () => {
  if (!functionCode.value) return;
  console.log(props.pageProvide.getElement())
  try {
    loading.value = true;
    const res = await getFunctionDetail({
      functionCode: functionCode.value,
      moduleName: moduleName.value,
      moduleCode: moduleCode.value,
    });
    subFormJson.value = parseEnhance(res.data?.designJson);

    let code = `${functionCode.value}`;
    setTimeout(() => {
      props.dataCenter?.linkChildForm({
        code: code,
        formRef: subFormRef.value,
      });
    }, 1);
  } catch (e) {
  } finally {
    loading.value = false;
    formKey.value = Date.now(); // 强制刷新
  }
});
</script>
