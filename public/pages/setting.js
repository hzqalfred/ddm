({
  handleLogout: () => {
    VxeUI.modal.confirm({
      title: "登出确认",
      content: "确定要退出登录吗？",
      mask: false,
      lockView: false,
      onConfirm: () => {
        this.auth.logout();
        setTimeout(() => {
          this.router.push("/login");
          this.router.go(0);
        }, 100);
      },
    });
  },
  toggleMenuDrawer: () => {
    const appStore = this.getStoreState("app");

    // 根据当前布局模式智能切换菜单显示
    if (appStore.layoutConfig.layoutMode === "wins") {
      // Windows模式下切换抽屉菜单
      const newVisibility = !appStore.layoutConfig.menuDrawerVisible;
      this.callStoreMethod("app", "updateLayoutConfigItem", [
        "menuDrawerVisible",
        newVisibility,
      ]);
    } else {
      // 默认模式下切换左侧菜单
      const newVisibility = !appStore.layoutConfig.showMenu;
      this.callStoreMethod("app", "updateLayoutConfigItem", [
        "showMenu",
        newVisibility,
      ]);

      // 获取菜单元素并更新可见性
      const menu = this.findNodeByID("left_menu_container");
      if (menu) {
        menu.style = newVisibility
          ? "height: 100%; background-color: #f8f8f8; border-right: 1px solid #eaeaea; display: flex; flex-direction: column; width: 240px;"
          : "display: none; width: 0px;";
      }
    }
  },

  // 原有事件处理
  btnHome_click: (event) => {
    let drawer = this.findNodeByID("lheader_row_col1_drawer");
    drawer.isOpen = true;
  },

  // 打开布局设置面板
  toggleLayoutSettings: () => {
    const configPanel = this.findNodeByID("layout_config_panel");
    if (configPanel) {
      // 在打开前同步当前配置到面板
      const appStore = this.getStoreState("app");

      const isDefaultLayout = appStore.layoutConfig.layoutMode === "default";
      this.findNodeByID("btn_default_layout").type = isDefaultLayout
        ? "primary"
        : "default";
      this.findNodeByID("btn_wins_layout").type = isDefaultLayout
        ? "default"
        : "primary";

      configPanel.visible = true;
    }
  },

  // 切换布局模式为默认模式
  setLayoutModeDefault: () => {
    // 更新按钮状态
    this.findNodeByID("btn_default_layout").type = "primary";
    this.findNodeByID("btn_wins_layout").type = "default";

    // 即时更新临时预览（通过直接修改 store 状态）
    this.callStoreMethod("app", "setLayout", ["default"]);
  },

  // 切换布局模式为Windows模式
  setLayoutModeWins: () => {
    // 更新按钮状态
    this.findNodeByID("btn_default_layout").type = "default";
    this.findNodeByID("btn_wins_layout").type = "primary";

    // 即时更新临时预览（通过直接修改 store 状态）
    this.callStoreMethod("app", "setLayout", ["wins"]);
  },

  // 取消布局设置
  cancelLayoutSettings: () => {
    // 获取原始配置并恢复
    const appStore = this.getStoreState("app");
    const originalConfig = appStore.layoutConfig;

    // 恢复原始布局
    this.callStoreMethod("app", "updateLayoutConfig", [originalConfig]);

    // 关闭面板
    this.findNodeByID("layout_config_panel").visible = false;
  },

  // 应用布局设置
  applyLayoutSettings: () => {
    // 从面板获取配置值
    const isDefaultMode =
      this.findNodeByID("btn_default_layout").type === "primary";

    // 根据布局模式智能设置菜单状态
    const layoutMode = isDefaultMode ? "default" : "wins";
    const newConfig = {
      showBanner: true,
      showMenu: true, // 仅在默认模式下使用showMenu值
      layoutMode: layoutMode,
      menuDrawerVisible: false, // 默认不显示抽屉菜单
    };

    // 更新 store 中的配置
    this.callStoreMethod("app", "updateLayoutConfig", [newConfig]);

    // 关闭面板
    this.findNodeByID("layout_config_panel").visible = false;
  },

  // 处理菜单搜索
  handleMenuSearch: (value) => {},

  // 导航到首页
  navigateToHome: () => {},
});
