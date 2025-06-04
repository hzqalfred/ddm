<template>
  <div class="direct-function-container">
    <webRender
      v-if="componentReady"
      :dataCenter="dataCenter"
      :data="functionData"
    />
    <div v-else class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>正在加载功能...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DataCenter } from "@/core/DataCenter";
import webRender from "@/views/webRender.vue";
import { Loading } from "@element-plus/icons-vue";
import auth from "@/core/AuthManage";
import { getIntiInfo, ssoLogin, getMenu } from "@/api/init";

const route = useRoute();
const router = useRouter();
const componentReady = ref(false);
const dataCenter = new DataCenter("direct-function-center");

// 获取路由参数

const functionCode = route.params.functionCode;
const moduleCode = route.params.moduleCode;
const token = route.query.token;

// 创建功能数据
const functionData = ref({});

// 初始化
onMounted(async () => {
  try {
    // 检查权限状态
    await ssoLogin(token);
    const { data: initData } = await getIntiInfo();
    let { data = [] } = await getMenu();
    let menu = [];
    data.map((x) => {
      if (x.functionList?.length) {
        menu = menu.concat(x.functionList);
      }
    });
    console.log(menu);
    let selected = menu.find(
      (x) => x.functionCode == functionCode && x.moduleCode == moduleCode
    );
    
    auth.setEnabled(initData.authenticationEnabled);

    // 如果需要权限但未登录，重定向到登录页
    if ((initData.authenticationEnabled && !initData.loggedIn) || !selected) {
      router.push({
        path: "/login",
        query: { redirect: route.fullPath },
      });
      return;
    }

    functionData.value = {
      type: "window",
      ele: "window",
      code: "webrender",
      id: `${selected.moduleName}-${selected.moduleCode}-${selected.functionCode}`,
      title: `${functionCode}`, // 会在加载后更新为实际标题
      width: "100%",
      height: "100%",
      origin: true,
      visible: true,
      param: selected,
    };

    // 权限检查通过，展示组件
    componentReady.value = true;
  } catch (error) {
    console.error("初始化功能时出错:", error);
    router.push("/main");
  }
});
</script>

<style scoped>
.direct-function-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
  color: #606266;
}

.loading-container .el-icon {
  font-size: 32px;
  margin-bottom: 16px;
}
</style>
