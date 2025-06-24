<template>
  <div class="split-menu-container">
    <!-- 左侧一级菜单 -->
    <div class="primary-menu">
      <div
        v-for="(item, index) in menuItems"
        :key="item.name"
        class="primary-menu-item"
        :class="{
          'is-active': activeMenuId === item.name || isParentActive(item),
          'is-above-active': isAboveActive(index),
          'is-below-active': isBelowActive(index),
        }"
        @click="handlePrimaryMenuClick(item)"
      >
        <div class="primary-menu-item-bg">
          <div v-if="item.icon" class="menu-icon">
            <svg-icon size="20px" :iconClass="item.icon || 'menu'" />
          </div>
          <div class="menu-title">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧子菜单 -->
    <div
      class="secondary-menu"
      v-if="activeMainMenu && hasChildren(activeMainMenu)"
    >
      <div class="secondary-menu-content">
        <template v-for="child in activeMainMenu.children" :key="child.name">
          <!-- 二级菜单项 -->
          <div
            class="secondary-menu-item"
            :class="{
              'is-active': activeMenuId === child.name,
              'has-children': hasChildren(child),
            }"
            @click="handleSecondaryMenuClick(child)"
          >
            <div style="display: flex;">
              <div class="menu-icon">
                <svg-icon size="20px" :iconClass="child.icon || 'menu'" />
              </div>
              <span class="secondary-title">{{ child.title }}</span>
            </div>

            <!-- 三级菜单 -->
            <div v-if="hasChildren(child)" class="tertiary-menu">
              <span
                v-for="grandChild in child.children"
                :key="grandChild.name"
                class="tertiary-menu-item"
                :class="{ 'is-active': activeMenuId === grandChild.name }"
                @click.stop="handleTertiaryMenuClick(grandChild)"
              >
                {{ grandChild.title }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, inject, ref, reactive, computed } from "vue";
import PageFactory from "@/core/PageFactory";
import { getMenu } from "@/api/init";
import SvgIcon from "@/core/components/SvgIcon/index.vue";

// 获取父页面数据
const props = defineProps(["data"]);
const menuItems = ref([]);
const homePage = inject("homePage");
const activeMenuId = ref("");
const activeMainMenu = ref(null);

// 判断是否有子菜单
const hasChildren = (item) => {
  return item.children && item.children.length > 0;
};

// 判断父菜单是否处于激活状态（现在改为判断是否应该展开显示子菜单）
const isParentActive = (item) => {
  if (!hasChildren(item)) return false;

  // 如果一级菜单本身被激活，或者其子菜单被激活，都应该展开
  if (activeMenuId.value === item.name) return true;

  // 检查直接子菜单
  const hasActiveChild = item.children.some(
    (child) => child.name === activeMenuId.value
  );
  if (hasActiveChild) return true;

  // 检查孙子菜单
  return item.children.some((child) => {
    if (hasChildren(child)) {
      return child.children.some(
        (grandChild) => grandChild.name === activeMenuId.value
      );
    }
    return false;
  });
};

// 新增：判断是否为激活菜单上方的菜单项
const isAboveActive = (currentIndex) => {
  // 找到当前激活菜单项的索引
  const activeIndex = menuItems.value.findIndex(
    (item) => activeMenuId.value === item.name || isParentActive(item)
  );

  if (activeIndex === -1) return false;

  // 判断是否为上一个菜单项
  return currentIndex === activeIndex - 1;
};

// 新增：判断是否为激活菜单下方的菜单项
const isBelowActive = (currentIndex) => {
  // 找到当前激活菜单项的索引
  const activeIndex = menuItems.value.findIndex(
    (item) => activeMenuId.value === item.name || isParentActive(item)
  );

  if (activeIndex === -1) return false;

  // 判断是否为下一个菜单项
  return currentIndex === activeIndex + 1;
};

// 递归转换菜单数据结构
const transformMenuData = (menuData) => {
  return menuData.map((item) => {
    const menuItem = {
      title: item.menuName || item.functionName,
      name: item.menuId || item.functionId,
      icon: item.icon,
      item: item,
      children: [],
    };

    // 处理功能列表（二级菜单）
    if (item.functionList && item.functionList.length > 0) {
      menuItem.children = item.functionList.map((func) => ({
        title: func.functionName,
        name: func.functionId,
        icon: func.icon,
        item: func,
        children: [],
      }));
    }

    // 处理子菜单列表（递归处理多级菜单）
    if (item.subMenuList && item.subMenuList.length > 0) {
      const subMenus = transformMenuData(item.subMenuList);
      menuItem.children = [...(menuItem.children || []), ...subMenus];
    }

    // 如果没有子项，则删除children属性
    if (menuItem.children.length === 0) {
      delete menuItem.children;
    }

    return menuItem;
  });
};

// 定义菜单对象
const _menuProvide = reactive(new PageFactory());

// 初始化菜单数据
onMounted(async () => {
  try {
    if (homePage._pageCode == "main") {
      let { data = [] } = await getMenu();
      menuItems.value = transformMenuData(data);
    } else {
      await _menuProvide.init({ _pageCode: "menu" });
      menuItems.value =
        _menuProvide.getPageData().map((x) => ({
          title: x.title,
          name: x.id,
          icon: x.icon,
          item: x,
        })) || [];
    }

    // 设置主框架
    if (homePage) {
      _menuProvide.setHomeProvide(homePage);
    }
  } catch (error) {
    console.error("菜单初始化失败：", error);
  }
});

// 处理一级菜单点击
const handlePrimaryMenuClick = (menuItem) => {
  console.log("点击一级菜单：", menuItem);

  // 总是激活当前点击的菜单
  activeMenuId.value = menuItem.name;

  // 如果有子菜单，显示右侧菜单
  if (hasChildren(menuItem)) {
    activeMainMenu.value = menuItem;
  } else {
    activeMainMenu.value = null;
  }

  // 总是尝试创建窗口（如果有对应的功能）
  createWindow(menuItem);
};

// 处理二级菜单点击
const handleSecondaryMenuClick = (menuItem) => {
  console.log("点击二级菜单：", menuItem);

  // 总是激活当前点击的菜单
  activeMenuId.value = menuItem.name;

  // 总是尝试创建窗口（如果有对应的功能）
  createWindow(menuItem);
};

// 处理三级菜单点击
const handleTertiaryMenuClick = (menuItem) => {
  console.log("点击三级菜单：", menuItem);

  // 总是激活当前点击的菜单
  activeMenuId.value = menuItem.name;

  // 总是尝试创建窗口（如果有对应的功能）
  createWindow(menuItem);
};

// 创建窗口的通用方法
const createWindow = (menuItem) => {
  // 触发自定义事件
  if (_menuProvide && menuItem && menuItem?.item?.click) {
    _menuProvide.fireEvent({
      eventName: menuItem?.item?.click,
      args: menuItem?.item,
    });
  }

  // 判断是否为功能项，只有功能项才创建窗口
  if (!menuItem.name && !menuItem?.item?.functionCode) {
    console.log("菜单项没有对应的功能代码，跳过窗口创建");
    return;
  }

  // 如果只是分类菜单（有子菜单但本身不是功能项），也可以跳过窗口创建
  if (hasChildren(menuItem) && !menuItem?.item?.functionCode) {
    console.log("这是分类菜单，跳过窗口创建");
    return;
  }

  if (menuItem.item) {
    homePage.create({
      data: {
        type: "window",
        ele: "window",
        code: "webrender",
        id:
          menuItem.name ||
          `${menuItem.item.moduleName}-${menuItem.item.moduleCode}-${menuItem.item.functionCode}`,
        title: menuItem.title || menuItem.item.functionName,
        width: "100%",
        height: "85%",
        mask: false,
        origin: true,
        visible: true,
        param: menuItem.item,
      },
    });
  }
};
</script>

<style lang="scss" scoped>
.split-menu-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 60px);
  background: #f2f2f2;
}

/* 左侧一级菜单 */
.primary-menu {
  width: 125px;
  background: #f2f2f2;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
  flex-shrink: 0;

  &::-webkit-scrollbar {
    width: 0px;
  }
}

.primary-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  justify-content: center;
  min-height: 80px;

  &:hover {
    background: #e9ecef;
  }

  &.is-active {
    background: white;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
    color: #007bff;

    .menu-icon {
      color: #007bff;
    }

    .menu-title {
      color: #007bff;
    }
  }

  /* 新增：上方菜单项的黄色样式 */
  &.is-above-active {
    border-bottom-right-radius: 20%;

    &:hover {
      background: #fff3cd;
    }
  }

  /* 新增：下方菜单项的红色样式 */
  &.is-below-active {
    border-top-right-radius: 20%;
    background: white;

    .primary-menu-item-bg {
      background-color: #f2f2f2;
    }
  }

  .primary-menu-item-bg {
    // background-color: white;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    min-height: 80px;
  }

  .menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-bottom: 6px;
    color: #6c757d;
    transition: color 0.2s ease;

    :deep(svg) {
      width: 20px;
      height: 20px;
    }
  }

  .menu-title {
    font-size: 16px;
    font-weight: 400;
    color: #495057;
    line-height: 1.3;
    word-break: break-all;
    transition: color 0.2s ease;
  }
}

/* 右侧二三级菜单 */
.secondary-menu {
  flex: 1;
  background: white;
  overflow-y: auto;
  min-width: 198px;
  padding: 60px 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;

    &:hover {
      background: #a8a8a8;
    }
  }
}

.secondary-menu-content {
  padding: 8px 0;
}

.secondary-menu-item {
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f2f2f2;
  }

  &.is-active {
    background: #e7f3ff;

    .secondary-title {
      color: #007bff;
      font-weight: 500;
    }
  }

  .secondary-title {
    display: block;
    font-size: 14px;
    font-weight: 400;
    color: #606060;
    line-height: 1.4;
    margin-bottom: 8px;
    transition: all 0.2s ease;
  }
}

.tertiary-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e9ecef;
}

.tertiary-menu-item {
  display: inline-block;
  padding: 4px 12px;
  background: #f2f2f2;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 12px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #e9ecef;
    border-color: #dee2e6;
    color: #495057;
    transform: translateY(-1px);
  }

  &.is-active {
    background: #007bff;
    border-color: #007bff;
    color: white;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .split-menu-container {
    height: calc(100vh - 60px);
    flex-direction: column;
  }

  .primary-menu {
    width: 100%;
    height: auto;
    display: flex;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }

  .primary-menu-item {
    min-width: 80px;
    padding: 12px 8px;

    .menu-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 4px;

      :deep(svg) {
        width: 16px;
        height: 16px;
      }
    }

    .menu-title {
      font-size: 12px;
    }
  }

  .secondary-menu {
    height: calc(100vh - 200px);
  }
}

/* 菜单收缩状态 */
.menu-collapsed {
  .primary-menu {
    width: 60px;

    .primary-menu-item {
      padding: 16px 8px;

      .menu-title {
        display: none;
      }
    }
  }
}

/* 空状态 */
.secondary-menu-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #adb5bd;
  font-size: 14px;
}
</style>
