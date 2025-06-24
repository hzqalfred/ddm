import { defineStore } from "pinia";

export const useApp = defineStore("app", {
  state: () => ({
    buttonLoading: [],
    layout: "default",
    // 修复默认布局配置
    layoutConfig: {
      showBanner: true,
      showMenu: true, // 确保菜单默认显示
      layoutMode: "wins", // 与 layout 保持同步
      menuDrawerVisible: false, // 新增：控制窗口模式下的菜单抽屉状态
    },
  }),
  actions: {
    setButtonLoading(value) {
      if (this.buttonLoading.indexOf(value) == -1) {
        this.buttonLoading.push(value);
      }
    },
    removeButtonLoading(value) {
      const index = this.buttonLoading.indexOf(value);
      if (index > -1) {
        this.buttonLoading.splice(index, 1);
      }
    },
    setLayout(layout) {
      // 保存当前布局作为旧布局
      const oldLayout = this.layout;
      
      this.layout = layout;

      // 同步更新 layoutConfig
      this.layoutConfig.layoutMode = layout;

      // 根据布局模式自动调整菜单显示状态
      if (layout === "wins") {
        // Windows模式：隐藏左侧菜单，使用抽屉菜单
        this.layoutConfig.showMenu = false;
        this.layoutConfig.menuDrawerVisible = false;
      } else {
        // 默认模式：显示左侧菜单，隐藏抽屉菜单
        this.layoutConfig.showMenu = true;
        this.layoutConfig.menuDrawerVisible = false;
        
        // 从wins模式切换到默认模式
        if (oldLayout === "wins") {
          console.log("从Windows模式切换到默认模式，触发窗口处理");
          
          // 触发事件以通知其他组件
          window.dispatchEvent(new CustomEvent('layoutSwitchedToDefault', {
            detail: { previousLayout: oldLayout, newLayout: layout }
          }));
          
          // 直接处理窗口可见性
          this.handleWindowsVisibilityInDefaultMode();
        }
      }
    },
    
    // 处理默认模式下的窗口可见性
    handleWindowsVisibilityInDefaultMode() {
      console.log("从wins模式切换到默认模式，开始处理窗口可见性...");
      
      // 使用延时确保其他状态已更新
      setTimeout(() => {
        try {
          // 在Vue应用上下文中获取homePage引用
          const app = document.querySelector('#app')?.__vue__;
          if (!app || !app.$.ctx || !app.$.ctx.provides || !app.$.ctx.provides.homePage) {
            console.log("无法获取homePage引用");
            return;
          }
          
          const homePage = app.$.ctx.provides.homePage;
          
          // 获取任务栏数据
          const taskbar = homePage.findNodeByID("lheader_row_taskbar");
          if (!taskbar || !taskbar.data || taskbar.data.length === 0) {
            console.log("任务栏不存在或为空");
            return;
          }
          
          console.log("找到任务栏，按钮数量:", taskbar.data.length);
          
          // 查找当前激活的任务栏按钮
          let activeTask = taskbar.data.find(task => task.type === 'success');
          let activeWindowId = null;
          
          if (activeTask) {
            activeWindowId = activeTask.id.substring(5);
          } else if (taskbar.data.length > 0) {
            // 如果没有激活按钮，设置最后一个为激活
            activeTask = taskbar.data[taskbar.data.length - 1];
            activeTask.type = 'success';
            activeWindowId = activeTask.id.substring(5);
          }
          
          if (!activeWindowId) {
            console.log("无法确定当前活动窗口");
            return;
          }
          
          console.log("当前活动窗口ID:", activeWindowId);
          
          // 查找lmain容器
          const lmain = homePage.findNodeByID("lmain");
          if (!lmain || !lmain.data) {
            console.log("未找到lmain容器或其数据为空");
            return;
          }
          
          console.log("找到lmain容器，子元素数量:", lmain.data.length);
          
          // 处理lmain中的窗口
          let windowsCount = 0;
          lmain.data.forEach(item => {
            if (item.ele === 'window') {
              windowsCount++;
              
              // 设置窗口可见性 - 只有活动窗口可见
              const shouldBeVisible = item.id === activeWindowId;
              console.log(`窗口 ${item.id} 应为 ${shouldBeVisible ? '可见' : '隐藏'}`);
              
              // 明确设置窗口的visible属性
              item.visible = shouldBeVisible;
              
              // 如果有其他控制可见性的属性，也一并设置
              if (item.style) {
                item.style = item.style.replace(/display\s*:\s*[^;]+/g, '') + 
                             (shouldBeVisible ? '' : '; display: none');
              }
            }
          });
          
          console.log(`处理了 ${windowsCount} 个窗口`);
          
          // 再次检查来确认设置是否生效
          setTimeout(() => {
            const visibleWindows = lmain.data.filter(item => 
              item.ele === 'window' && item.visible === true
            );
            console.log(`确认:现在有 ${visibleWindows.length} 个可见窗口`);
            
            // 如果仍然有多个可见窗口，采用更直接的方法
            if (visibleWindows.length > 1) {
              console.log("仍有多个可见窗口，使用更直接的方法处理");
              this.forceSetWindowsVisibility(lmain.data, activeWindowId);
            }
          }, 100);
        } catch (error) {
          console.error("处理窗口可见性时出错:", error);
        }
      }, 200);
    },
    
    // 强制设置窗口可见性的备用方法
    forceSetWindowsVisibility(items, activeWindowId) {
      if (!items || !Array.isArray(items)) return;
      
      // 强制替换items数组中的窗口对象
      for (let i = 0; i < items.length; i++) {
        if (items[i].ele === 'window') {
          // 创建新对象，避免引用问题
          const newItem = { ...items[i] };
          newItem.visible = (newItem.id === activeWindowId);
          
          // 替换原对象
          items[i] = newItem;
          
          console.log(`强制设置窗口 ${newItem.id} 可见性为 ${newItem.visible}`);
          
          // 尝试直接操作DOM
          try {
            const windowEl = document.querySelector(`#${newItem.id}`);
            if (windowEl) {
              windowEl.style.display = newItem.visible ? '' : 'none';
              console.log(`直接设置DOM元素显示状态:`, windowEl.style.display);
            }
          } catch (e) {
            // 忽略DOM操作错误
          }
        }
      }
    },
    
    // 更新整个布局配置
    updateLayoutConfig(config) {
      // 先保存当前模式，用于检测模式变化
      const oldMode = this.layoutConfig.layoutMode;

      // 确保新配置包含必要的默认值
      this.layoutConfig = {
        showBanner: true,
        showMenu: true,
        layoutMode: "wins",
        menuDrawerVisible: false,
        ...config,
      };

      // 保持 layout 与 layoutMode 同步
      this.layout = this.layoutConfig.layoutMode;

      // 如果布局模式发生变化，自动调整菜单显示状态
      if (oldMode !== this.layoutConfig.layoutMode) {
        if (this.layoutConfig.layoutMode === "wins") {
          // Windows模式：隐藏左侧菜单
          this.layoutConfig.showMenu = false;
        } else {
          // 默认模式：显示左侧菜单，隐藏抽屉菜单
          this.layoutConfig.showMenu = true;
          this.layoutConfig.menuDrawerVisible = false;
          
          // 从wins模式切换到默认模式
          if (oldMode === "wins") {
            this.handleWindowsVisibilityInDefaultMode();
          }
        }
      }
    },
    
    // 更新单个布局配置项
    updateLayoutConfigItem(key, value) {
      if (key in this.layoutConfig) {
        // 保存更新前的layoutMode值
        const oldMode = this.layoutConfig.layoutMode;

        this.layoutConfig[key] = value;

        // 如果更新的是 layoutMode，同步更新 layout和菜单显示状态
        if (key === "layoutMode") {
          this.layout = value;

          // 根据新的布局模式调整菜单显示状态
          if (value === "wins" && oldMode !== "wins") {
            // Windows模式：隐藏左侧菜单
            this.layoutConfig.showMenu = false;
            this.layoutConfig.menuDrawerVisible = false;
          } else if (value !== "wins" && oldMode === "wins") {
            // 默认模式：显示左侧菜单，隐藏抽屉菜单
            this.layoutConfig.showMenu = true;
            this.layoutConfig.menuDrawerVisible = false;
            
            // 处理窗口可见性
            this.handleWindowsVisibilityInDefaultMode();
          }
        }
      }
    },
    
    // 智能切换菜单显示，根据当前布局模式决定切换哪种菜单
    toggleMenuDrawer() {
      if (this.layoutConfig.layoutMode === "wins") {
        // Windows模式下切换抽屉菜单
        this.layoutConfig.menuDrawerVisible = !this.layoutConfig
          .menuDrawerVisible;
      } else {
        // 默认模式下切换左侧菜单
        this.layoutConfig.showMenu = !this.layoutConfig.showMenu;
      }
    },
    
    // 设置菜单抽屉可见性
    setMenuDrawerVisible(visible) {
      this.layoutConfig.menuDrawerVisible = visible;
    },
  },
});