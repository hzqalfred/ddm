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

// 上一个/下一个标签
const switchTag = (direction) => {
  // 获取任务栏
  let taskbar = _homePageProvide.findNodeByID("lheader_row_taskbar");
  if (!taskbar || !taskbar.data) {
    return;
  }

  // 获取当前标签
  let currentTag = null;
  for (var i = 0; i < taskbar.data.length; i++) {
    if (taskbar.data[i].type == "success") {
      // 为上一个时，i-1，为下一个时，i+1
      currentTag = taskbar.data[i];
      if(direction == 'prev' && i > 0){
        currentTag = taskbar.data[i-1];
        break
      }
      if(direction == 'next' && i < taskbar.data.length-1){
        currentTag = taskbar.data[i+1];
        break
      }
      break
    }
  }
  // 切换标签
  const _tagId = currentTag.id
  const _winId = _tagId.substr(5, _tagId.length);
  switchTagByWinId(_winId)

}

// 关闭标签
const btnTaskBar_Close = (btnID) => {
  if (!btnID) return;
  const winId = btnID.substr(5, btnID.length);

  const main = _homePageProvide.findNodeByID("lmain");
  if(main && main.data) {
    main.data = main.data.filter(item => item.id != winId)
  }

  // 获取任务栏
  let taskbar = _homePageProvide.findNodeByID("lheader_row_taskbar");
  if (!taskbar || !taskbar.data) {
    return;
  }
  // 是否为当前标签
  let isCurrentWin = false
  taskbar.data = taskbar.data.filter(item => {
    const _winID = `bar$_${winId}`
    if (item.type == 'success' && _winID == item.id) {
      isCurrentWin = true
    }
    if(item.id != _winID){
      return item
    }
  })
  // 当前标签关闭时，默认跳转最后一个标签页面
  if(isCurrentWin && taskbar.data.length > 0){
    const newTagId = taskbar.data[taskbar.data.length - 1].id
    const newWinId = newTagId.substr(5, newTagId.length);
    switchTagByWinId(newWinId)
  }
}

const switchTagByWinId = (winId) => {
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
      switchTagByWinId(winId)
    }
  }
};

const setTagButtonStyle = (type) => {
  return type === "success" ? "background-color: #ECECEC" : "";
}
</script>

<template v-if="item.ele == 'taskbar'" :key="taskbar">
  <div class="taskbar-main">
    <div class="func-button" @click="switchTag('prev')">
      <el-icon :size="20" color="#606060"><DArrowLeft /></el-icon>
    </div>
    <div class="tag-box">
      <el-button-group>
        <el-tag v-for="(subitem, subIndex) in item.data" :key="subitem.id" closable type="info" class="tag-button" :style="setTagButtonStyle(subitem.type)" v-on:click="btnTaskBar_Click(subitem.id)" @close="btnTaskBar_Close(subitem.id, true, subIndex)">
          {{ subitem.value }}
        </el-tag>
      </el-button-group>
    </div>
    <div class="func-button" @click="switchTag('next')">
      <el-icon :size="20" color="#606060"><DArrowRight /></el-icon>
    </div>
    <div class="func-button">
      <el-icon :size="20" color="#606060"><Refresh /></el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .taskbar-main{
    width: 100%;
    height: 32px;
    box-shadow: 0px 2px 2px #888888;
    border-bottom: 1px solid #EAEAEA;
    // border-top: 0px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .func-button {
      width: 40px; 
      height: 30px; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      border: 1px solid #EAEAEA; 
      border-top: 0px; 
      border-bottom: 0px
    }

    .tag-box {
      width: calc(100% - 120px); 
      height: 30px; 
      display: flex; 
      justify-content: flex-start; 
      align-items: center;

      .tag-button {
        min-width: 80px; 
        height: 32px; 
        padding: 0px 0px 0px 10px; 
        background-color: #fff; 
        border: 0px; 
        font-weight: normal; 
        font-size: 14px; 
        color: #606060; 
        border-radius: 0px; 
        border-right: 1px solid #EAEAEA;
      }
    }
  }
</style>