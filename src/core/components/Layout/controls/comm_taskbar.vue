<script setup>
import { inject } from "vue";
import { ModalController } from "vxe-pc-ui";

//获取父页面数据
const props = defineProps(["data"]);
const item = props.data;
const _homePageProvide = inject("homePage");
const layoutConfig = inject("layoutConfig", { layoutMode: "default" });

// 获取布局模式的辅助函数
const getLayoutMode = () => {
  if (layoutConfig.value && layoutConfig.value.layoutMode) {
    return layoutConfig.value.layoutMode;
  }
  return layoutConfig.layoutMode || "default";
};

const btnTaskBar_Click = (btnID) => {
  if (!btnID) return;

  // 获取任务栏
  let taskbar = _homePageProvide.findNodeByID("lheader_row_taskbar");

  if (!taskbar || !taskbar.data) {
    return;
  }

  // 查找点击的任务栏项
  let existTaskBar = null;
  for (var i = 0; i < taskbar.data.length; i++) {
    if (btnID == taskbar.data[i].id) {
      existTaskBar = taskbar.data[i];
    }
    // 将所有任务栏项设为非活动状态
    taskbar.data[i].type = "primary";
  }

  if (existTaskBar) {
    // 设置点击的任务栏项为活动状态
    existTaskBar.type = "success";
    // 从任务栏项ID中提取窗口ID (格式为 bar$_窗口ID)
    let winId = btnID.substr(5, btnID.length);

    // 根据不同布局模式处理窗口激活
    if (getLayoutMode() === "wins") {
      // Windows模式 - 使用ModalController激活窗口
      let winModel = ModalController.get(winId);
      if (winModel) {
        winModel.dispatchEvent("updateZindex", winModel);
      } else {
      }
    } else {
      // 默认模式 - 只显示当前窗口，隐藏其他窗口
      // 首先在lmain中查找窗口
      const main = _homePageProvide.findNodeByID("lmain");
      if (main && main.data) {
        let windowsCount = 0;
        let foundMatch = false;

        // 遍历并设置窗口可见性
        main.data.forEach((item) => {
          if (item.ele === "window") {
            windowsCount++;
            const shouldBeVisible = item.id === winId;

            if (shouldBeVisible) {
              foundMatch = true;
            }

            // 设置可见性
            item.visible = shouldBeVisible;
          }
        });

        console.log(
          `在lmain中处理了 ${windowsCount} 个窗口，匹配窗口: ${foundMatch}`
        );

        if (foundMatch) {
          // 已在lmain中找到并处理了窗口，不需要继续查找
          return;
        }
      }

      // 如果在lmain中未找到窗口，尝试在content-layout中查找

      const contentLayout = _homePageProvide.findNodeByID("content-layout");
      if (contentLayout && contentLayout.data) {
        // 遍历所有窗口并设置可见性
        contentLayout.data.forEach((item) => {
          if (item.ele === "window") {
            item.visible = item.id === winId;
            console.log(
              `设置content-layout中窗口 ${item.id} 可见性为 ${item.visible}`
            );
          }
        });
      }
    }
  }
};
</script>

<template v-if="item.ele == 'taskbar'" :key="taskbar">
  <el-button-group>
    <el-button
      size="small"
      v-for="subitem in item.data"
      :key="subitem.id"
      :type="subitem.type"
      :id="subitem.id"
      v-on:click="btnTaskBar_Click(subitem.id)"
      :icon="subitem.icon"
      >{{ subitem.value }}</el-button
    >
  </el-button-group>
</template>
