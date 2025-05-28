<template>
  <el-drawer
    v-if="isWindowMode"
    v-model="menuDrawerVisible"
    title="菜单"
    direction="ltr"
    size="240px"
    :destroy-on-close="false"
    append-to-body
    :with-header="true"
  >
    <comm-menu home-page="homePage" />
  </el-drawer>
</template>

<script setup>
import { computed, watch, onMounted } from "vue";
import { useApp } from "@/core/pinia/modules/app";
import CommMenu from "./comm_menu.vue";

// 接收homePage实例作为props
const props = defineProps({
  homePage: {
    type: Object,
    required: true,
  },
});

// 获取应用状态
const appStore = useApp();

// 确保有相关方法
if (!appStore.toggleMenuDrawer) {
  appStore.toggleMenuDrawer = function() {
    if (!this.layoutConfig.menuDrawerVisible) {
      this.layoutConfig.menuDrawerVisible = true;
    } else {
      this.layoutConfig.menuDrawerVisible = false;
    }
  };
}

if (!appStore.setMenuDrawerVisible) {
  appStore.setMenuDrawerVisible = function(value) {
    this.layoutConfig.menuDrawerVisible = value;
  };
}

// 计算属性
const isWindowMode = computed(
  () => appStore.layoutConfig.layoutMode === "wins"
);

const menuDrawerVisible = computed({
  get: () => appStore.layoutConfig.menuDrawerVisible || false,
  set: (val) => appStore.setMenuDrawerVisible(val),
});

// 监听布局模式变化，确保在切换模式时正确处理抽屉可见性
watch(
  () => appStore.layoutConfig.layoutMode,
  (newMode, oldMode) => {
    if (newMode !== "wins" && oldMode === "wins") {
      // 从Windows模式切换到其他模式时，隐藏抽屉
      appStore.setMenuDrawerVisible(false);
    }
  }
);

// 组件挂载时，确保抽屉状态与布局模式一致
onMounted(() => {
  if (appStore.layoutConfig.layoutMode !== "wins") {
    appStore.setMenuDrawerVisible(false);
  }
});
</script>

<style scoped>
:deep(.el-drawer__body) {
  padding: 0;
  overflow: hidden;
  height: calc(100% - 50px);
}

:deep(.avatar-group) {
  height: 100%;
  overflow-y: auto;
}
</style>
