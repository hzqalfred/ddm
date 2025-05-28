<script setup>
import {
  defineAsyncComponent,
  onBeforeMount,
  provide,
  reactive,
  computed,
  watch,
  onMounted,
  ref,
  nextTick,
  onUnmounted,
} from "vue";
import { useApp } from "@/core/pinia/modules/app";
import PageFactory from "@/core/PageFactory";
import MenuDrawer from "./controls/comm_drawer.vue";
import router from "@/core/components/WebHash/router";
import auth from '@/core/AuthManage'

// 创建响应式 PageFactory 实例

let homePage = reactive(new PageFactory());
// 使用ref来缓存页面数据，避免频繁查询
const pageDataRef = ref([]);
const homeRef = ref(null);

// 布局配置，使用 app store 中的配置
const appStore = useApp();
const layoutConfig = computed(() => appStore.layoutConfig);

let path = router.currentRoute.value.path;
if (path == "/setting") {
  await homePage.init({ _pageCode: "setting" });
} else {
  await homePage.init();
}
homePage.setElement(homeRef);
// 提供响应式数据给子组件
provide("homePage", homePage);
provide("layoutConfig", layoutConfig);

// 处理从wins模式切换到默认模式的函数
const handleLayoutSwitchToDefault = () => {
  // 等待 DOM 更新
  nextTick(() => {
    // 找到任务栏
    const taskbar = homePage.findNodeByID("lheader_row_taskbar");
    if (!taskbar || !taskbar.data || taskbar.data.length === 0) {
      return;
    }

    // 找到激活的窗口，如果没有则激活最后一个
    let activeWindowId = null;
    const activeTask = taskbar.data.find((task) => task.type === "success");

    if (activeTask) {
      activeWindowId = activeTask.id.substring(5);
    } else {
      const lastTask = taskbar.data[taskbar.data.length - 1];
      lastTask.type = "success";
      activeWindowId = lastTask.id.substring(5);
    }

    if (!activeWindowId) {
      return;
    }

    // 确保只有一个窗口可见 - 先找到lmain容器
    const lmain = homePage.findNodeByID("lmain");
    if (lmain && lmain.data) {
      // 遍历窗口并设置可见性

      let windowsCount = 0;
      lmain.data.forEach((item) => {
        if (item.ele === "window") {
          windowsCount++;
          // 仅当当前窗口ID与激活窗口ID匹配时设为可见
          item.visible = item.id === activeWindowId;
        }
      });
    } else {
    }

    // 备用：检查content-layout容器
    const contentLayout = homePage.findNodeByID("content-layout");
    if (contentLayout && contentLayout.data) {
      contentLayout.data.forEach((item) => {
        if (item.ele === "window") {
          item.visible = item.id === activeWindowId;
        }
      });
    }
  });
};

// 初始化页面工厂和布局
const initPage = async () => {
  // 设置页面上下文
  homePage.setHomeProvide(homePage);
  let logout = homePage.findNodeByID('btn_logout')
  if(logout){
    if(auth.getEnabled()){
      logout.style  = ''
    }else{
      logout.style  = 'display:none'
    }
  }
  

  // 应用初始布局配置
  if (appStore.layoutConfig) {
    homePage.setLayoutConfig(appStore.layoutConfig);
  }

  // 缓存页面数据
  pageDataRef.value = homePage.getPageData();
};

// 监视布局配置变化并应用
watch(
  layoutConfig,
  (newConfig, oldConfig) => {
    // 检查是否从wins切换到默认模式
    if (
      oldConfig &&
      oldConfig.layoutMode === "wins" &&
      newConfig.layoutMode !== "wins"
    ) {
      handleLayoutSwitchToDefault();
    }

    homePage.setLayoutConfig(newConfig);
    // 配置变化后更新缓存的页面数据
    nextTick(() => {
      pageDataRef.value = homePage.getPageData();
    });
  },
  { deep: true }
);

// 在组件挂载前初始化
onBeforeMount(async () => {
  await initPage();
});

onMounted(() => {
  // 初始化页面数据
  if (!("menuDrawerVisible" in appStore.layoutConfig)) {
    appStore.$patch({
      layoutConfig: {
        ...appStore.layoutConfig,
        menuDrawerVisible: false,
      },
    });
  }

  // 确保初始化时菜单状态与布局模式一致
  const currentMode = appStore.layoutConfig.layoutMode;
  if (currentMode === "wins") {
    // Windows模式：隐藏左侧菜单
    appStore.$patch({
      layoutConfig: {
        ...appStore.layoutConfig,
        showMenu: false,
      },
    });
  } else {
    // 默认模式：显示左侧菜单，隐藏抽屉菜单
    appStore.$patch({
      layoutConfig: {
        ...appStore.layoutConfig,
        showMenu: true,
        menuDrawerVisible: false,
      },
    });

    // 在初始化为默认模式时，确保只有一个窗口可见
    nextTick(() => {
      handleLayoutSwitchToDefault();
    });
  }

  // 添加全局事件监听
  window.addEventListener(
    "layoutSwitchedToDefault",
    handleLayoutSwitchToDefault
  );

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener(
      "layoutSwitchedToDefault",
      handleLayoutSwitchToDefault
    );
  });
});

// 获取组件
function getComponent(item) {
  switch (item.type) {
    case "frame":
      return defineAsyncComponent(() =>
        import("@/core/components/Layout/frame-tpl.vue")
      );
    case "layout":
      return defineAsyncComponent(() =>
        import("@/core/components/Layout/layout-tpl.vue")
      );
    case "control":
      return defineAsyncComponent(() =>
        import("@/core/components/Layout/control-tpl.vue")
      );
    default:
      return "div";
  }
}
</script>

<template>
  <div ref="homeRef">
    <template v-for="item in pageDataRef" :key="item.id">
      <component :is="getComponent(item)" :data="item" />
    </template>
    <menu-drawer :home-page="homePage" v-if="homePage" />
  </div>
</template>

<style>
/* 全局样式保留 */
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.fullscreen {
  --el-dialog-width: 100%;
  --el-dialog-margin-top: 30px !important;
  height: 100%;
  margin-bottom: 0;
  overflow: auto;
}

.dialog__headerbtn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: var(--el-message-close-size, 16px);
  height: 20px !important;
  outline: none;
  padding: 0px;
  right: 0;
  top: 0;
  width: 20px;
}

.dialog {
  --el-dialog-border-radius: none !important;
}

.common-layout {
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-divider--horizontal {
  margin: 8px 0 2px;
}

/* 添加菜单相关的全局样式 */
.menu-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #ecf5ff;
}

.menu-item.active {
  background-color: #e6f1fc;
  color: #409eff;
}

/* 菜单折叠状态样式 */
.menu-collapsed .menu-label {
  display: none;
}

.menu-collapsed .menu-item {
  justify-content: center;
  padding: 16px 0;
}

.menu-collapsed .el-aside {
  width: 64px !important;
}
</style>
