<template>
  <!---测试入口测试入口测试入口测试入口测试入口测试入口测试入口测试入口测试入口测试入口测试入口测试入口测试入口--->
  <div class="sdk-content-wrap">
    <div class="tab-pane-content">
      <el-tabs v-model="activeName">

        <el-tab-pane label="数据服务" name="dataService">
          <DataService></DataService>
        </el-tab-pane>

        <el-tab-pane label="数据模型" name="dataModel">
          <DataModel></DataModel>
        </el-tab-pane>

        <el-tab-pane label="DDL管理" name="ddlManage">
          <DdlManage></DdlManage>
        </el-tab-pane>     


      </el-tabs>
      <!-- <FormDesigner></FormDesigner> -->
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";

import { useWebDesigner } from "@/core/pinia/modules/designer";
const webDesignerStore = useWebDesigner();
import DataModel from "@/views/designer/dataModel/index.vue";
import DdlManage from '@/views/designer/ddlManage/index.vue'
import DataService from '@/views/designer/dataService/index.vue'


let activeName = ref("dataService");

webDesignerStore.$subscribe((mutate, state) => {
  if (mutate.events.key == "activeObject") {
    activeName.value = state.activeObject.activeName;
  }
});

const moduleData = inject("moduleData");

onMounted(() => {
  console.log("props", moduleData.value);
});
</script>

<style lang="scss" scoped>
.sdk-content-wrap {
  padding: 0px 10px;
  .tab-pane-content {
    position: relative;
    margin-top: 10px;
    .operator-wrap {
      height: 38px;
      line-height: 38px;
      z-index: 99;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
