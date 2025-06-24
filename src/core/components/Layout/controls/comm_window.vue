<template>
  <!-- 窗口模式 - draggable 模式，用于 Windows 布局风格 -->
  <div v-if="isDraggable" @mousedown="_onModalActive">
    <vxe-modal
      ref="modalRef"
      key="dialog"
      type="modal"
      v-model="item.visible"
      v-bind="modalProps"
      v-on="modalEvents"
    >
      <!-- 在窗口模式下渲染内容 -->
      <div v-if="isPageLoaded">
        <template v-for="subitem in pageData" :key="subitem.id">
          <frame_tpl
            key="index_frame"
            v-if="subitem.type === 'frame'"
            :data="subitem"
          ></frame_tpl>
          <layout_tpl
            key="index_layout"
            v-else-if="subitem.type === 'layout'"
            :data="subitem"
          ></layout_tpl>
          <control_tpl
            key="index_control"
            v-else-if="subitem.type === 'control'"
            :data="subitem"
          ></control_tpl>
          <div key="index_other" v-else>
            <el-empty description="无效类型组件，请检查设置！[main]" />
          </div>
        </template>
      </div>
      <div v-else>
        <el-empty description="正在加载内容..." />
      </div>
    </vxe-modal>
  </div>

  <!-- 固定模式 - 作为内嵌面板，用于默认布局风格 -->
  <div
    v-else
    ref="fixedPanelRef"
    class="fixed-window-panel"
    v-show="item.visible === true"
  >
    <!-- <div class="fixed-window-header">
      <div class="fixed-window-title">{{ item.title }}</div>
      <el-button
        type="text"
        class="fixed-window-close"
        @click="
          _dialog_close({
            $modal: {
              close: () => {
                item.visible = false;
              },
            },
          })
        "
        icon="Close"
      />
    </div> -->
    <!-- 在固定模式下渲染内容 -->
    <div class="fixed-window-body">
      <div v-if="isPageLoaded">
        <template v-for="subitem in pageData" :key="subitem.id">
          <frame_tpl
            key="index_frame"
            v-if="subitem.type === 'frame'"
            :data="subitem"
          ></frame_tpl>
          <layout_tpl
            key="index_layout"
            v-else-if="subitem.type === 'layout'"
            :data="subitem"
          ></layout_tpl>
          <control_tpl
            key="index_control"
            v-else-if="subitem.type === 'control'"
            :data="subitem"
          ></control_tpl>
          <div key="index_other" v-else>
            <el-empty description="无效类型组件，请检查设置！[main]" />
          </div>
        </template>
      </div>
      <div v-else>
        <el-empty description="正在加载内容..." />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject,
  reactive,
  onBeforeMount,
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import frame_tpl from "../frame-tpl.vue";
import layout_tpl from "../layout-tpl.vue";
import control_tpl from "../control-tpl.vue";
import PageFactory from "@/core/PageFactory.js";
import { useFormCenterStore } from "@/core/pinia/modules/datacenter";
import { VxeModal, ModalController } from "vxe-pc-ui";
import { useApp } from "@/core/pinia/modules/app";
const formCenterStore = useFormCenterStore();

// 获取父页面数据
const props = defineProps(["data", "draggable"]);
const item = props.data;
const _homePageProvide = inject("homePage");

// 从 homePage 获取布局模式
const layoutConfig = inject("layoutConfig", { layoutMode: "default" });

const modalRef = ref(null);
const fixedPanelRef = ref(null);
const isPageLoaded = ref(false); // 页面数据加载状态标志
const pageData = ref([]); // 缓存页面数据

// 计算 vxe-modal 的所有属性
const modalProps = computed(() => {
  // 基本属性（固定的）
  const baseProps = {
    id: item.id,
    title: item.title,
    showMaximize: true,
    "destroy-on-close": false,
    position: item.position || "center",
    "lock-view": false,
    width: item.width,
    height: item.height,
    resize: isDraggable.value && item.resize,
    draggable: isDraggable.value && item.draggable,
  };

  // 从 item 中获取额外属性（排除已在基本属性中定义的）
  const excludeProps = ["visible", "code", "ele", "type", "events"]; // visible 使用 modelValue 代替
  const itemProps = {};

  // 遍历 item，添加所有不在排除列表中的属性
  for (const key in item) {
    if (!excludeProps.includes(key) && !baseProps.hasOwnProperty(key)) {
      itemProps[key] = item[key];
    }
  }
  return { ...baseProps, ...itemProps };
});

// 计算 vxe-modal 的所有事件
const modalEvents = computed(() => {
  // 基本事件（固定的）
  const baseEvents = {
    show: _taskbar_active,
    close: _dialog_close,
    updateZindex: _updateZindex,
  };

  // 从 item.events 中获取额外事件
  const itemEvents = {};

  // 方案：从 item.events 对象中获取事件
  if (item.events && typeof item.events === "object") {
    for (const eventName in item.events) {
      if (typeof item.events[eventName] === "function") {
        // 如果是基本事件，则包装原有处理函数
        if (baseEvents[eventName]) {
          itemEvents[eventName] = (...args) => {
            baseEvents[eventName](...args);
            item.events[eventName](...args);
          };
        } else {
          itemEvents[eventName] = item.events[eventName];
        }
      }
    }
  }

  // 合并基本事件和自定义事件
  return { ...baseEvents, ...itemEvents };
});

// 获取布局模式
const getLayoutMode = () => {
  // 从inject获取
  if (layoutConfig) {
    if (typeof layoutConfig === "object" && layoutConfig.value) {
      return layoutConfig.value.layoutMode || "default";
    }
    return layoutConfig.layoutMode || "default";
  }

  // 备用：从store获取
  try {
    const appStore = useApp();
    return appStore.layoutConfig?.layoutMode || appStore.layout || "default";
  } catch (e) {
    return "default";
  }
};

// 确定是否可拖拽 - 根据布局模式决定
const isDraggable = computed(() => {
  return getLayoutMode() === "wins";
});

// 创建页面实例
let _pageProvide = reactive(new PageFactory());
let _pagePath = "../pages/" + item.code;
console.log(1);
_pageProvide.setHomeProvide(_homePageProvide);
_pageProvide.setElement(modalRef);

_homePageProvide.setPage(item.id, _pageProvide);

// 初始化页面数据
const initPage = async () => {
  try {
    isPageLoaded.value = false; // 开始加载
    await _pageProvide.init({ _pageCode: _pagePath, data: item, id: item.id });
    // 获取并缓存页面数据
    const data = _pageProvide.getPageData();
    pageData.value = data;
    _pageProvide.overlistenerEvent("window.close", _dialog_close);
    isPageLoaded.value = true; // 加载完成
  } catch (error) {
    isPageLoaded.value = false;
  }
};

// 在组件挂载前初始化
onBeforeMount(async () => {
  await initPage();
});

// 窗口关闭处理
const closeWindow = () => {
  try {
    // 触发窗口关闭前事件
    _pageProvide.fireEvent({ eventName: "onBeforeClose", args: _pageProvide });

    if (item.beforeDestory) {
      (async () => {
        await item.beforeDestory();
      })();
    }

    // 处理模态窗口关闭
    if (modalRef.value) {
      modalRef.value.close();
    }

    // 获取窗口ID
    let btnID = item.id;

    // 从lmain中彻底移除窗口
    let main = _homePageProvide.findNodeByID("lmain");
    if (main && main.data) {
      for (let i = main.data.length - 1; i >= 0; i--) {
        if (main.data[i].id === btnID && main.data[i].ele === "window") {
          main.data.splice(i, 1);
        }
      }
    }

    // 从任务栏中移除按钮
    let taskbar = _homePageProvide.findNodeByID("lheader_row_taskbar");
    if (taskbar && taskbar.data) {
      const taskbarId = "bar$_" + btnID;
      let taskbarIndex = -1;

      for (let i = 0; i < taskbar.data.length; i++) {
        if (taskbarId === taskbar.data[i].id) {
          taskbarIndex = i;
          break;
        }
      }

      if (taskbarIndex !== -1) {
        // 移除任务栏按钮
        taskbar.data.splice(taskbarIndex, 1);

        // 如果还有其他任务栏按钮，激活最后一个
        if (taskbar.data.length > 0) {
          // 设置最后一个为活动状态
          taskbar.data[taskbar.data.length - 1].type = "success";

          // 默认模式下，激活最后一个窗口
          if (getLayoutMode() !== "wins") {
            const lastTaskbarId = taskbar.data[taskbar.data.length - 1].id;
            const lastWindowId = lastTaskbarId.substr(5, lastTaskbarId.length);

            // 设置相应窗口为可见
            if (main && main.data) {
              main.data.forEach((item) => {
                if (item.ele === "window") {
                  item.visible = item.id === lastWindowId;
                }
              });
            }
          }
        }
      }
    }

    // 触发窗口关闭后事件
    _pageProvide.fireEvent({ eventName: "closed", args: _pageProvide });

    return true;
  } catch (error) {
    return false;
  }
};

// 窗口关闭处理
const _dialog_close = (event) => {
  closeWindow();

  // 处理原生事件对象
  if (event && event.$modal && typeof event.$modal.close === "function") {
    event.$modal.close();
  }
};

// 任务栏激活状态设置
const _taskbar_active = () => {
  // 设置taskbar的激活状态
  let taskbar = _homePageProvide.findNodeByID("lheader_row_taskbar");
  if (!taskbar) {
    return;
  }

  let btnID = item.id;
  if (formCenterStore.setActiveForm) {
    formCenterStore.setActiveForm(btnID); // 设置当前激活表单
  }

  // 判断是否存在
  let taskbarId = "bar$_" + btnID;
  for (var i = 0; i < taskbar.data.length; i++) {
    // 调整样式
    taskbar.data[i].type = "primary";
    if (taskbarId == taskbar.data[i].id) {
      taskbar.data[i].type = "success";
    }
  }

  // 在默认模式下确保只有当前窗口可见
  if (getLayoutMode() !== "wins") {
    const main = _homePageProvide.findNodeByID("lmain");
    if (main && main.data) {
      let windowsCount = 0;

      main.data.forEach((windowItem) => {
        if (windowItem.ele === "window") {
          windowsCount++;
          const shouldBeVisible = windowItem.id === btnID;

          // 只修改可见性状态，不触发不必要的渲染
          if (windowItem.visible !== shouldBeVisible) {
            windowItem.visible = shouldBeVisible;
            // console.log(
            //   `设置窗口 ${windowItem.id} 可见性为 ${shouldBeVisible}`
            // );
          }
        }
      });
      //
    }

    // 备用：处理content-layout中的窗口
    const contentLayout = _homePageProvide.findNodeByID("content-layout");
    if (contentLayout && contentLayout.data) {
      contentLayout.data.forEach((windowItem) => {
        if (windowItem.ele === "window") {
          windowItem.visible = windowItem.id === btnID;
        }
      });
    }
  }
};

// 窗口激活处理
const _onModalActive = () => {
  _pageProvide.fireEvent({ eventName: "activate", args: _pageProvide });
  // 设置taskbar的激活状态
  _taskbar_active();
  _updateZindex();
};

// 更新窗口Z轴索引
const _updateZindex = (wind) => {
  if (!isDraggable.value) return; // 固定模式下不需要更新z-index

  let taskbar = _homePageProvide.findNodeByID("lheader_row_taskbar");
  if (!taskbar || !taskbar.data) {
    //
    return;
  }

  try {
    let modelArr = taskbar.data
      .filter((x) => x && x.id)
      .map((x) => {
        const windowId = x.id.replace("bar$_", "");
        return ModalController.get(windowId);
      })
      .filter((x) => x); // 过滤掉可能的null

    if (modelArr.length === 0) {
      //
      return;
    }

    let zIndices = modelArr.map((x) => x.reactData?.modalZindex || 0);
    let zIndex = Math.max.apply(null, zIndices);

    if (wind) {
      wind.reactData.modalZindex = zIndex + 1;
    }
  } catch (error) {}
};

// 监视窗口可见性变化
watch(
  () => item.visible,
  (newVisible, oldVisible) => {
    //

    if (newVisible === true) {
      // 窗口变为可见时设置为活动窗口
      nextTick(() => {
        _taskbar_active();

        // 确保数据已加载
        if (!isPageLoaded.value || pageData.value.length === 0) {
          //
          initPage();
        }
      });
    }
  },
  { immediate: true }
);

// 定期检查页面数据
const checkPageData = () => {
  // 获取并缓存页面数据
  const data = _pageProvide.getPageData();
  if (data && data.length > 0) {
    pageData.value = data;
    isPageLoaded.value = true;
    //
  }
};

// 在组件挂载后确保页面数据已加载
onMounted(() => {
  // 确保页面数据已加载
  if (!isPageLoaded.value || pageData.value.length === 0) {
    //

    // 尝试初始化
    initPage();

    // 如果仍未加载成功，延迟尝试
    setTimeout(() => {
      if (!isPageLoaded.value || pageData.value.length === 0) {
        checkPageData();
      }
    }, 500);
  }

  // 如果窗口可见，设置为活动窗口
  if (item.visible) {
    nextTick(() => {
      _taskbar_active();
    });
  }

  // 监听布局模式变化事件
  const handleLayoutChange = () => {
    if (item.visible && getLayoutMode() !== "wins") {
      // 在默认布局模式下，确保窗口状态与任务栏状态一致
      _taskbar_active();
    }
  };
  window.addEventListener("layoutSwitchedToDefault", handleLayoutChange);

  // 触发挂载事件
  _pageProvide.fireEvent({ eventName: "open", args: _pageProvide });
  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener("layoutSwitchedToDefault", handleLayoutChange);
    // 触发卸载事件
    _pageProvide.fireEvent({ eventName: "beforeClose", args: _pageProvide });
  });
});
</script>

<style scoped>
.fixed-window-panel {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: calc(100% - 50px);
  width: 100%;
  position: relative;
}

.fixed-window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
  padding: 10px 16px;
  border-bottom: 1px solid #e4e7ed;
}

.fixed-window-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.fixed-window-close {
  font-size: 16px;
}

.fixed-window-body {
  flex: 1;
  /* padding: 16px; */
  overflow: auto;
  height: calc(100% - 100px); /* 减去header的高度 */
  background-color: #f7f7f7;
}
</style>
