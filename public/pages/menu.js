({
  // 在menu.js中的btnMenu_click函数
  btnMenu_click: (funItem) => {
    console.log("Menu item clicked:", funItem.id, funItem.title);

    // 获取app store中的布局模式
    const appStore = this.getStoreState("app");
    const isDefaultLayout = appStore.layoutConfig.layoutMode === "default";

    // 防止递归调用
    if (this._processingMenuClick) {
      console.warn("Preventing recursive menu click processing");
      return;
    }

    this._processingMenuClick = true;

    try {
      // 获取主容器
      let main = this.getHomeProvide().findNodeByID("lmain");
      if (!main || !main.data) {
        console.error("主内容区域未找到或数据无效");
        return;
      }

      // 获取任务栏
      let taskbar = this.getHomeProvide().findNodeByID("lheader_row_taskbar");
      if (!taskbar || !taskbar.data) {
        console.error("任务栏未找到或数据无效");
        return;
      }

      // 关键步骤：彻底清理同ID的旧窗口
      // 1. 从lmain中移除所有同ID的窗口
      for (let i = main.data.length - 1; i >= 0; i--) {
        if (main.data[i].id === funItem.id && main.data[i].ele === "window") {
          console.log(`清理现有窗口: ${funItem.id}`);
          main.data.splice(i, 1);
        }
      }

      // 2. 从任务栏中移除对应按钮
      const taskbarId = "bar$_" + funItem.id;
      for (let i = taskbar.data.length - 1; i >= 0; i--) {
        if (taskbar.data[i].id === taskbarId) {
          console.log(`清理任务栏按钮: ${taskbarId}`);
          taskbar.data.splice(i, 1);
        }
      }

      // 设置所有任务栏按钮为非活动状态
      taskbar.data.forEach((item) => {
        item.type = "primary";
      });

      // 添加新的任务栏按钮
      taskbar.data.push({
        type: "success",
        id: taskbarId,
        click: "btnTaskBar_Click",
        value: funItem.title,
      });

      // 创建新窗口对象
      const newWindow = {
        type: "window",
        ele: "window",
        code: funItem.code,
        id: funItem.id,
        visible: true,
        title: funItem.title,
        mask:false,
        width: isDefaultLayout ? "100%" : "90%",
        height: isDefaultLayout ? "100%" : "80%",
      };

      // 添加到主内容区域
      main.data.push(newWindow);
      console.log("新窗口已创建:", funItem.id);
    } finally {
      setTimeout(() => {
        this._processingMenuClick = false;
      }, 0);
    }
  },
});
