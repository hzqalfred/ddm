<template>
  <div class="avatar-group">
    <vxe-menu
      ref="MenuRef"
      v-model="selectNav"
      :options="navList"
      @click="handleMenuClick"
    ></vxe-menu>
  </div>
</template>

<script setup>
import { onMounted, inject, reactive, ref, computed } from "vue";
import PageFactory from "@/core/PageFactory";
import { getMenu } from "@/api/init";

// 获取父页面数据
const MenuRef = ref(null);
const props = defineProps(["data"]);
const menuItems = ref([]);
const homePage = inject("homePage");
const selectNav = reactive("");

// 递归转换菜单数据结构
const transformMenuData = (menuData) => {
  return menuData.map((item) => {
    const menuItem = {
      title: item.menuName || item.functionName,
      name: item.menuId || item.functionId,
      item: item,
      children: [],
    };

    // 处理功能列表（二级菜单）
    if (item.functionList && item.functionList.length > 0) {
      menuItem.children = item.functionList.map((func) => ({
        title: func.functionName,
        name: func.functionId,
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

const navList = computed(() => {
  console.log(menuItems.value);
  return menuItems.value;
});

// 定义菜单对象
const _menuProvide = reactive(new PageFactory());

// 初始化菜单数据
onMounted(async () => {
  try {
    //菜单判断一下 当前是什么环境：main：运行环境，setting：开发环境
    //运行环境 菜单是请求接口，setting是json
    if (homePage._pageCode == "main") {
      let { data = [] } = await getMenu();
      menuItems.value = transformMenuData(data);
    } else {
      await _menuProvide.init({ _pageCode: "menu" });
      menuItems.value =
        _menuProvide.getPageData().map((x) => ({
          title: x.title,
          name: x.id,
          item: x,
        })) || [];
    }

    // 设置主框架
    if (homePage) {
      _menuProvide.setHomeProvide(homePage);
    }
    _menuProvide.setElement(MenuRef);
  } catch (error) {
    console.error("菜单初始化失败：", error);
  }
});

// 递归查找菜单项
const findMenuItem = (menuList, targetItem) => {
  for (const menu of menuList) {
    // 检查当前菜单项
    if (menu.item === targetItem) {
      return menu;
    }

    // 检查功能列表
    if (menu.item.functionList) {
      for (const func of menu.item.functionList) {
        if (func === targetItem) {
          return { item: func, parentMenu: menu.item };
        }
      }
    }

    // 递归检查子菜单
    if (menu.item.subMenuList) {
      const found = findMenuItem(
        menu.item.subMenuList.map((sub) => ({ item: sub })),
        targetItem
      );
      if (found) {
        return found;
      }
    }
  }
  return null;
};

// 处理菜单点击
function handleMenuClick({ menu }) {
  console.log("点击的菜单项：", menu);
  if (_menuProvide && menu && menu?.item?.click) {
    _menuProvide.fireEvent({ eventName: menu?.item?.click, args: menu?.item });
  }

  // 判断是否为功能项，只有功能项才创建窗口
  if (!menu.id && !menu?.item?.functionCode) return;
  if (menu.item) {
    homePage.create({
      data: {
        type: "window",
        ele: "window",
        code: "webrender",
        id:
          menu.id ||
          `${menu.item.moduleName}-${menu.item.moduleCode}-${menu.item.functionCode}`,
        title: menu.title || menu.item.functionName,
        width: "100%",
        height: "85%",
        mask: false,
        origin: true,
        visible: true,
        param: menu.item,
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.avatar-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 0;

  .avatar-fit {
    text-align: left;
    padding: 12px 16px;
    margin: 2px 8px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background-color: #ecf5ff;
      .title {
        color: #409eff;
      }
    }

    .avatar {
      margin-right: 12px;
      flex-shrink: 0;
    }

    .menu-icon-placeholder {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .title {
      font-size: 14px;
      color: #606266;
      transition: color 0.3s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

/* 确保与折叠状态兼容 */
:deep(.menu-collapsed) {
  .avatar-fit {
    justify-content: center;
    padding: 12px 4px;

    .avatar,
    .menu-icon-placeholder {
      margin-right: 0;
    }

    .title {
      display: none;
    }
  }
}

/* 多级菜单样式 */
:deep(.vxe-menu) {
  .vxe-menu-item {
    &.has-children {
      .vxe-menu-item-title::after {
        content: "▶";
        float: right;
        transition: transform 0.3s ease;
      }

      &.is-expanded .vxe-menu-item-title::after {
        transform: rotate(90deg);
      }
    }
  }

  .vxe-menu-submenu {
    padding-left: 20px;

    .vxe-menu-item {
      font-size: 13px;
      color: #909399;

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
