<script setup>
import {
  h,
  inject,
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { storeToRefs } from "pinia";
import frame_tpl from "./frame-tpl.vue";
import layout_tpl from "./layout-tpl.vue";
import control_tpl from "./control-tpl.vue";
import comm_window from "./controls/comm_window.vue";
import { useApp } from "../../pinia/modules/app";

const props = defineProps(["data"]);
const item = props.data;
const appStore = useApp();
const { layout } = storeToRefs(appStore);

// 从inject获取布局配置
const homePage = inject("homePage", null);
const layoutConfig = inject("layoutConfig", { layoutMode: "default" });

// 提取公共的组件渲染逻辑
const componentMap = {
  frame: frame_tpl,
  layout: layout_tpl,
  control: control_tpl,
  window: comm_window,
};

// 判断当前组件类型，渲染对应的组件
const renderComponent = (subitem) => {
  const component = componentMap[subitem.type];
  return component ? h(component, { data: subitem }) : null;
};

// 获取布局模式的辅助函数
const getLayoutMode = () => {
  return (
    layoutConfig.layoutMode ||
    (layoutConfig.value && layoutConfig.value.layoutMode) ||
    "default"
  );
};

// 获取是否显示菜单的辅助函数
const getShowMenu = () => {
  const mode = getLayoutMode();
  if (mode === "wins") return false;

  return layoutConfig.showMenu !== undefined
    ? layoutConfig.showMenu
    : layoutConfig.value && layoutConfig.value.showMenu !== undefined
    ? layoutConfig.value.showMenu
    : true;
};

// 获取是否显示横幅的辅助函数
const getShowBanner = () => {
  return layoutConfig.showBanner !== undefined
    ? layoutConfig.showBanner
    : layoutConfig.value && layoutConfig.value.showBanner !== undefined
    ? layoutConfig.value.showBanner
    : true;
};

const contentLayoutWindowItems = computed(() => {
  if (item.id === "content-layout" && item.data) {
    return item.data.filter((subitem) => subitem.ele === "window");
  }
  return [];
});

// 计算菜单和横幅显示状态
const showMenu = computed(() => getShowMenu());
const showBanner = computed(() => getShowBanner());

// 计算布局相关的类
const containerClasses = computed(() => {
  return {
    "app-container": true,
    "with-banner": showBanner.value,
    "with-menu": showMenu.value,
    [`layout-${getLayoutMode()}`]: true,
  };
});

// 专门处理lmain中窗口的函数
const handleLmainWindows = () => {
  if (item.id !== "lmain") return;

  // 获取任务栏引用
  const taskbar = homePage?.findNodeByID("lheader_row_taskbar");
  if (!taskbar || !taskbar.data || taskbar.data.length === 0) {
    return;
  }

  // 查找当前激活的任务栏按钮
  let activeTask = taskbar.data.find((task) => task.type === "success");
  let activeWindowId = null;

  if (activeTask) {
    activeWindowId = activeTask.id.substring(5);
  } else if (taskbar.data.length > 0) {
    // 如果没有激活按钮，设置最后一个为激活
    activeTask = taskbar.data[taskbar.data.length - 1];
    activeTask.type = "success";
    activeWindowId = activeTask.id.substring(5);
  }

  if (!activeWindowId) {
    return;
  }

  // 处理lmain中的窗口
  if (item.data) {
    let windowsCount = 0;
    let visibleCount = 0;

    item.data.forEach((windowItem) => {
      if (windowItem.ele === "window") {
        windowsCount++;

        // 设置窗口可见性 - 只有活动窗口可见
        const shouldBeVisible = windowItem.id === activeWindowId;

        // 明确设置窗口的visible属性
        windowItem.visible = shouldBeVisible;

        if (shouldBeVisible) {
          visibleCount++;
        }
      }
    });
  }
};

// 监听布局模式变化
watch(
  () => getLayoutMode(),
  (newMode, oldMode) => {
    // 如果是lmain容器，且从wins模式切换到默认模式
    if (item.id === "lmain" && newMode !== "wins" && oldMode === "wins") {
      nextTick(() => {
        handleLmainWindows();
      });
    }

    // 根据布局模式调整菜单显示
    if (newMode === "wins" && oldMode !== "wins") {
      // 从默认模式切换到Windows模式
      const menu = homePage?.findNodeByID("left_menu_container");
      if (menu) {
        menu.style = "display: none; width: 0px;";
      }
    } else if (newMode !== "wins" && oldMode === "wins") {
      // 从Windows模式切换到默认模式
      const menu = homePage?.findNodeByID("left_menu_container");
      if (menu) {
        menu.style =
          "height: 100%; background-color: #f8f8f8; border-right: 1px solid #eaeaea; display: flex; flex-direction: column; width: 240px;";
      }
    }
  }
);

// 添加事件监听处理布局切换
onMounted(() => {
  // 添加布局切换事件监听
  const handleLayoutSwitch = () => {
    if (item.id === "lmain") {
      // 延迟执行处理lmain中窗口的逻辑
      setTimeout(() => {
        handleLmainWindows();
      }, 100);
    }
  };

  window.addEventListener("layoutSwitchedToDefault", handleLayoutSwitch);

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener("layoutSwitchedToDefault", handleLayoutSwitch);
  });

  // 初始检查当前环境，确保窗口可见性正确
  if (item.id === "lmain" && getLayoutMode() !== "wins") {
    nextTick(() => {
      handleLmainWindows();
    });
  }
});

// 监听横幅可见性变化
watch(
  () => getShowBanner(),
  (visible) => {
    // 获取横幅元素
    const banner = homePage?.findNodeByID("app_banner");
    if (banner) {
      banner.style = visible
        ? "display: flex; height: 60px; background-color: #336699; color: #ffffff;"
        : "display: none; height: 0px;";
    }
  }
);

// 监听菜单可见性变化
watch(
  () => getShowMenu(),
  (visible) => {
    // 获取菜单元素
    const menu = homePage?.findNodeByID("left_menu_container");
    if (menu) {
      menu.style = visible
        ? "height: 100%; background-color: #f8f8f8; border-right: 1px solid #eaeaea; display: flex; flex-direction: column; width: 240px;"
        : "display: none; width: 0px;";
    }
  }
);
</script>

<template>
  <!-- root container -->
  <template v-if="item.id === 'lcontainer'">
    <div :class="containerClasses">
      <!-- 循环渲染所有子节点 -->
      <template v-for="subitem in item.data" :key="subitem.id">
        <component
          :is="renderComponent(subitem)"
          v-if="
            (subitem.id !== 'app_banner' || showBanner) &&
              (subitem.id !== 'left_menu_container' || showMenu)
          "
        />
      </template>
    </div>
  </template>

  <!-- 通用容器 (container) -->
  <el-container
    v-else-if="item.ele === 'container'"
    :direction="item.attr.direction"
    :class="item.class"
  >
    <template v-for="subitem in item.data" :key="subitem.id">
      <component :is="renderComponent(subitem)" />
    </template>
  </el-container>

  <!-- header -->
  <el-header
    v-else-if="item.ele === 'header'"
    :class="item.class"
    :style="item.style || ''"
  >
    <template v-for="subitem in item.data" :key="subitem.id">
      <component :is="renderComponent(subitem)" />
    </template>
  </el-header>

  <!-- aside -->
  <el-aside
    v-else-if="item.ele === 'aside'"
    :class="[item.class]"
    :style="item.style || ''"
    :width="item.width"
  >
    <template v-for="subitem in item.data" :key="subitem.id">
      <component :is="renderComponent(subitem)" />
    </template>
  </el-aside>

  <!-- main -->
  <el-main
    :ref="item.id"
    :id="item.id"
    v-else-if="item.ele === 'main'"
    :class="[
      item.class,
      {
        'content-layout-default':
          item.id === 'content-layout' && getLayoutMode() === 'default',
      },
    ]"
    :style="item.style || ''"
  >
    <!-- 特殊处理lmain容器中的窗口渲染 -->
    <template v-if="item.id === 'lmain' && getLayoutMode() !== 'wins'">
      <!-- 非窗口组件正常渲染 -->
      <template v-for="subitem in item.data" :key="subitem.id">
        <component
          v-if="subitem.ele !== 'window'"
          :is="renderComponent(subitem)"
        />
      </template>

      <!-- 窗口组件只渲染visible为true的 -->
      <template v-for="subitem in item.data" :key="subitem.id">
        <component
          v-if="subitem.ele === 'window' && subitem.visible === true"
          :is="renderComponent(subitem)"
        />
      </template>
    </template>

    <!-- 主内容区域特殊处理 -->
    <template v-else-if="item.id === 'content-layout'">
      <!-- 任务栏总是显示 -->
      <template v-for="subitem in item.data" :key="subitem.id">
        <component
          v-if="subitem.ele === 'taskbar'"
          :is="renderComponent(subitem)"
        />
      </template>
    </template>

    <!-- 其他情况正常渲染所有子元素 -->
    <template v-else>
      <template v-for="subitem in item.data" :key="subitem.id">
        <component :is="renderComponent(subitem)" />
      </template>
    </template>
  </el-main>

  <!-- footer -->
  <el-footer
    v-else-if="item.ele === 'footer'"
    :class="item.class"
    :style="item.style || ''"
  >
    <template v-for="subitem in item.data" :key="subitem.id">
      <component :is="renderComponent(subitem)" />
    </template>
  </el-footer>

  <!-- drawer -->
  <el-aside
    v-else-if="item.ele === 'drawer' && layout == 'default'"
    :id="item.id"
    :width="item.size + 'px'"
    :style="item.style || ''"
  >
    <template v-for="subitem in item.data" :key="subitem.id">
      <component :is="renderComponent(subitem)" />
    </template>
  </el-aside>

  <!-- comm_window - 在wins模式下才作为独立窗口渲染，default模式下会在content-layout中统一渲染 -->
  <comm_window
    v-else-if="item.ele === 'window' && getLayoutMode() === 'wins'"
    :data="item"
    :id="item.id"
    :draggable="layout == 'wins'"
  />

  <!-- dialog -->
  <el-dialog
    v-else-if="item.ele === 'dialog'"
    :id="item.id"
    :class="['custom-dialog', item.class || '']"
    :title="item.title"
    :width="item.width || '80%'"
    :top="item.top || '30px'"
    v-model="item.visible"
    :append-to-body="true"
    :fullscreen="item.fullscreen || false"
    draggable
    :destroy-on-close="item.destroyOnClose || false"
  >
    <template v-for="subitem in item.data" :key="subitem.id">
      <component :is="renderComponent(subitem)" />
    </template>
  </el-dialog>

  <!-- 最后渲染具体类型组件 -->
  <component :is="renderComponent(item)" v-else />
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 默认布局模式下的内容区域样式 */
.content-layout-default {
  display: flex;
  flex-direction: column;
}

/* 默认布局模式下的窗口容器样式 */
.windows-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 移除position: relative，它可能导致全屏问题 */
}

/* 布局模式样式 */
.layout-wins .el-main {
  background-color: #f0f2f5;
}

/* 自定义对话框样式 */
.custom-dialog {
  border-radius: 4px;
  overflow: hidden;
}

.read-the-docs {
  color: #888;
}

/* 左侧菜单样式 */
#left_menu_container {
  border-right: 1px solid #e6e6e6;
  background-color: #f5f7fa;
}

/* 菜单容器通用样式 */
.menu-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  transition: width 0.3s ease;
  padding: 12px 0;
}

/* 菜单项通用样式 */
.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  margin: 4px 8px;
}

.menu-item:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

.menu-item.active {
  background-color: #409eff;
  color: #ffffff;
}

/* 菜单图标样式 */
.menu-item .el-icon,
.menu-item .avatar {
  margin-right: 10px;
  flex-shrink: 0;
}

/* 过渡动画 */
.el-aside {
  transition: width 0.3s ease, padding 0.3s ease;
}

/* 布局模式过渡 */
.app-container {
  transition: all 0.3s ease;
}

/* 添加这些样式到 <style> 块中 */
.embedded-window {
  width: 100%;
  height: 100%;
  position: relative;
  flex: 1;
}

.windows-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  height: calc(100% - 50px); /* 减去任务栏高度 */
  margin-top: 8px; /* 添加一点间距 */
  border-top: 1px solid #eaeaea; /* 添加一条分隔线 */
  padding-top: 8px;
}
</style>
