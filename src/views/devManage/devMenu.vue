<template>
  <div class="menu-manager">
    <div class="menu-section">
      <div class="menu-actions">
        <vxe-button style="margin-bottom: 10px;" @click="addMenu"
          >添加顶级菜单</vxe-button
        >
        <vxe-button
          style="margin-bottom: 10px; margin-left: 10px;"
          @click="addSubMenu"
          :disabled="!selectedMenuForAdd"
        >
          添加子菜单
        </vxe-button>
      </div>

      <vxe-table
        resizable
        :expand-config="{
          expandAll: true,
        }"
        ref="MenuTable"
        :tree-config="{ children: 'subMenuList', expandAll: true }"
        :data="menuData"
        @cell-click="handleMenuSelect"
        :row-class-name="getRowClassName"
      >
        <vxe-column field="menuName" title="菜单名称" tree-node>
          <template #default="{ row }">
            <vxe-input v-model="row.menuName"></vxe-input>
          </template>
        </vxe-column>
        <vxe-column field="orderIndex" title="排序" width="120">
          <template #default="{ row }">
            <vxe-input
              v-model="row.orderIndex"
              type="number"
              @change="handleOrderChange(row)"
            />
          </template>
        </vxe-column>
        <vxe-column field="show" title="状态" width="100">
          <template #default="{ row }">
            <vxe-switch
              v-model="row.show"
              open-label="显示"
              close-label="隐藏"
            />
          </template>
        </vxe-column>
        <vxe-column title="操作" width="150">
          <template #default="{ row }">
            <vxe-button
              type="text"
              size="mini"
              @click="openConfigDialog(row)"
              style="margin-right: 5px;"
            >
              配置
            </vxe-button>
            <vxe-button
              type="text"
              size="mini"
              @click="openMoveDialog(row)"
              style="margin-right: 5px;"
            >
              移动
            </vxe-button>
            <vxe-button
              type="text"
              icon="vxe-icon-delete"
              @click="removeMenu(row)"
            />
          </template>
        </vxe-column>
      </vxe-table>

      <!-- <div v-if="selectedMenuForAdd" class="selected-parent-info">
        <span>目标父菜单：{{ selectedMenuForAdd.menuName }}</span>
        <vxe-button type="text" @click="clearSelection">清除选择</vxe-button>
      </div> -->
    </div>

    <div class="function-section">
      <div v-if="selectedMenu" class="selected-menu-header">
        <h3>当前菜单：{{ selectedMenu.menuName }}</h3>
        <vxe-button @click="addFunc">添加功能</vxe-button>
      </div>

      <vxe-table :data="selectedFunctions" empty-text="请先选择菜单">
        <vxe-column field="functionName" title="功能名称" />
        <vxe-column
          field="functionCode"
          title="功能代码"
          :edit-render="{ autofocus: '.vxe-input--inner' }"
        >
          <template #edit="{ row }">
            <vxe-input v-model="row.functionCode" />
          </template>
        </vxe-column>
        <vxe-column title="操作" width="120">
          <template #default="{ row }">
            <vxe-button
              type="text"
              icon="vxe-icon-delete"
              @click="removeFunction(row)"
            />
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <!-- 移动菜单弹窗 -->
    <vxe-modal
      v-model="showMoveDialog"
      title="移动菜单"
      width="800"
      height="700"
      show-footer
      resize
    >
      <template #default>
        <div class="move-dialog">
          <div class="dialog-header">
            <span class="move-info">
              <i class="vxe-icon-arrow-right"></i>
              正在移动：<strong>{{ currentMoveMenu?.menuName }}</strong>
            </span>
            <span class="hint-text">请选择要移动到的目标菜单</span>
          </div>

          <div class="menu-tree-selector">
            <vxe-table
              ref="moveMenuTable"
              :data="moveMenuTreeData"
              :tree-config="{
                children: 'subMenuList',
                expandAll: true,
                line: true,
              }"
              @cell-click="handleMoveMenuSelect"
              highlight-current-row
              height="600"
              border
            >
              <vxe-column field="menuName" title="菜单结构" tree-node>
                <template #default="{ row }">
                  <div class="tree-node-content">
                    <i
                      class="vxe-icon-folder tree-icon"
                      v-if="row.subMenuList && row.subMenuList.length > 0"
                    ></i>
                    <i class="vxe-icon-file tree-icon" v-else></i>
                    <span class="node-name">{{ row.menuName }}</span>
                    <span
                      class="node-badge"
                      v-if="row.subMenuList && row.subMenuList.length > 0"
                    >
                      {{ row.subMenuList.length }}
                    </span>
                    <span class="root-badge" v-if="row.isRoot">
                      (可移动到此处成为顶级菜单)
                    </span>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </div>

          <div class="dialog-footer-info" v-if="selectedMoveTarget">
            <i class="vxe-icon-check-circle"></i>
            已选择目标：<strong>{{ selectedMoveTarget.menuName }}</strong>
          </div>
        </div>
      </template>
      <template #footer>
        <vxe-button @click="cancelMove">取消</vxe-button>
        <vxe-button
          status="primary"
          @click="confirmMove"
          :disabled="!selectedMoveTarget"
        >
          确认移动
        </vxe-button>
      </template>
    </vxe-modal>

    <vxe-modal v-model="showFunctionDialog" title="选择功能" width="800">
      <template #default>
        <div class="function-selector">
          <vxe-button status="primary" @click="confirmSelection"
            >确认添加</vxe-button
          >
          <vxe-table
            height="400"
            ref="currentFuncTable"
            :data="currentFunctions"
            :checkbox-config="{ checkField: 'checked' }"
          >
            <vxe-column type="checkbox" width="60" />
            <vxe-column field="functionName" title="功能名称" />
            <vxe-column field="functionCode" title="功能代码" />
            <vxe-column field="functionType" title="类型" />
          </vxe-table>
        </div>
      </template>
    </vxe-modal>
    <vxe-modal
      v-model="showConfigDialog"
      title="配置菜单功能"
      width="800"
      show-footer
    >
      <template #default>
        <div class="config-selector">
          <div class="config-header">
            <span
              >正在配置菜单：<strong>{{
                currentConfigMenu?.menuName
              }}</strong></span
            >
            <!-- 显示当前已配置的功能 -->
            <div
              v-if="currentConfigMenu?.functionCode"
              class="current-config-info"
            >
              <span class="current-label">当前配置：</span>
              <span class="current-function">
                {{
                  currentConfigMenu.functionName ||
                    currentConfigMenu.functionCode
                }}
              </span>
              <span class="current-code"
                >({{ currentConfigMenu.functionCode }})</span
              >
            </div>
            <p class="config-tip">请选择一个功能作为此菜单的主功能</p>
          </div>
          <vxe-table
            height="400"
            ref="configFuncTable"
            :data="currentFunctions"
            highlight-current-row
            @cell-click="handleConfigFunctionSelect"
          >
            <vxe-column field="functionName" title="功能名称" />
            <vxe-column field="functionCode" title="功能代码" />
            <vxe-column field="moduleName" title="模块" />
          </vxe-table>

          <div class="selected-config-info" v-if="selectedConfigFunction">
            <i class="vxe-icon-check-circle"></i>
            已选择：<strong>{{ selectedConfigFunction.functionName }}</strong>
            ({{ selectedConfigFunction.functionCode }})
          </div>
        </div>
      </template>
      <template #footer>
        <vxe-button @click="cancelConfig">取消</vxe-button>
        <vxe-button
          status="primary"
          @click="confirmConfig"
          :disabled="!selectedConfigFunction"
        >
          确认配置
        </vxe-button>
      </template>
    </vxe-modal>
    <div class="action-buttons">
      <vxe-button status="primary" @click="saveMenuData"
        >保存菜单结构</vxe-button
      >
      <vxe-button
        status="success"
        @click="saveFunctionData"
        :disabled="!selectedMenu"
      >
        保存功能配置
      </vxe-button>
    </div>
  </div>
</template>

<script>
import {
  getMenu,
  allModuleMenuFunction,
  saveMenuFunction,
  saveMenu,
  deleteMenuFunction,
  deleteMenu,
} from "@/api/devManage";
import messageHandler from "@/core/Message";

export default {
  data() {
    return {
      menuData: [], // 树形菜单数据
      suiteData: [], // 套件功能数据
      selectedMenu: null, // 当前选中菜单（用于配置功能）
      selectedMenuForAdd: null, // 当前选中菜单（用于添加子菜单）
      selectedMenuForMove: null, // 当前选中要移动的菜单
      showMoveDialog: false, // 移动菜单弹窗状态
      currentMoveMenu: null, // 当前要移动的菜单
      selectedMoveTarget: null, // 选中的移动目标
      moveMenuTreeData: [], // 移动弹窗中的菜单树数据
      selectedFunctions: [], // 当前菜单功能
      showFunctionDialog: false, // 功能弹窗状态
      functionModules: [], // 功能模块列表

      // 配置菜单功能相关数据
      showConfigDialog: false, // 配置菜单功能弹窗状态
      currentConfigMenu: null, // 当前要配置的菜单
      selectedConfigFunction: null, // 选中的配置功能
    };
  },
  computed: {
    currentFunctions() {
      let arr = [];
      this.functionModules.map((module) => {
        if (module.functionList?.length) {
          arr = [...arr, ...module.functionList];
        }
      });
      return arr;
    },
  },
  async mounted() {
    await this.getMenuList();
    let suiteData = await allModuleMenuFunction();
    console.log(JSON.stringify(suiteData.data));
    this.functionModules = suiteData.data;
  },
  methods: {
    // 将扁平数据转换为树形结构（兼容原有API数据结构）
    buildMenuTree(flatData) {
      if (!flatData || !Array.isArray(flatData)) {
        return [];
      }

      const menuMap = new Map();
      const rootMenus = [];

      // 首先创建所有菜单项的映射，保持原有数据结构
      flatData.forEach((menu) => {
        menuMap.set(menu.menuId, {
          ...menu,
          subMenuList: menu.subMenuList || [],
        });
      });

      // 构建树形结构
      flatData.forEach((menu) => {
        const menuItem = menuMap.get(menu.menuId);

        // 检查是否为顶级菜单（parentId为空、null、undefined或"0"）
        if (!menu.parentId || menu.parentId === "" || menu.parentId === "0") {
          rootMenus.push(menuItem);
        } else {
          // 子菜单
          const parentMenu = menuMap.get(menu.parentId);
          if (parentMenu) {
            if (!parentMenu.subMenuList) {
              parentMenu.subMenuList = [];
            }
            parentMenu.subMenuList.push(menuItem);
          } else {
            // 如果找不到父菜单，当作顶级菜单处理
            rootMenus.push(menuItem);
          }
        }
      });

      return rootMenus;
    },

    // 将树形结构转换为扁平数据（用于保存，兼容原有API结构）
    flattenMenuTree(treeData) {
      const result = [];

      const flatten = (menuList, parentId = "") => {
        menuList.forEach((menu) => {
          const { subMenuList, ...menuData } = menu;

          // 保持原有的数据结构，只添加parentId字段
          const flatMenu = {
            ...menuData,
            parentId: parentId || "", // 确保parentId字段存在
          };

          result.push(flatMenu);

          // 递归处理子菜单
          if (subMenuList && subMenuList.length > 0) {
            flatten(subMenuList, menu.menuId);
          }
        });
      };

      flatten(treeData);
      return result;
    },

    // 生成新菜单ID（临时ID，保存时后端会分配真实ID）
    generateTempId() {
      return (
        "temp_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9)
      );
    },

    // 菜单选择处理（用于功能配置）
    handleMenuSelect({ row }) {
      this.selectedMenu = row;
      this.selectForAdd(row);
      this.selectedFunctions = row.functionList?.map((f) => ({ ...f })) || [];
    },

    // 选择父菜单（用于添加子菜单）
    selectForAdd(row) {
      this.selectedMenuForAdd = row;
    },

    // 打开移动菜单弹窗
    openMoveDialog(menu) {
      this.currentMoveMenu = menu;
      this.selectedMoveTarget = null;

      // 构建移动目标菜单树（排除自己和自己的子菜单）
      this.moveMenuTreeData = this.buildMoveTargetTree(this.menuData, menu);

      this.showMoveDialog = true;
    },

    // 构建移动目标菜单树（排除不能移动到的菜单）
    buildMoveTargetTree(menuData, excludeMenu) {
      const result = [];

      // 添加根级选项
      result.push({
        menuId: "ROOT",
        menuName: "根级菜单",
        subMenuList: [],
        isRoot: true,
      });

      const buildTree = (menus) => {
        const validMenus = [];

        menus.forEach((menu) => {
          // 排除自己
          if (menu.menuId === excludeMenu.menuId) {
            return;
          }

          // 排除自己的后代菜单
          if (this.isDescendant(menu, excludeMenu)) {
            return;
          }

          const menuCopy = {
            menuId: menu.menuId,
            menuName: menu.menuName,
            orderIndex: menu.orderIndex,
            show: menu.show,
            parentId: menu.parentId,
            subMenuList: menu.subMenuList ? buildTree(menu.subMenuList) : [],
          };

          validMenus.push(menuCopy);
        });

        return validMenus;
      };

      result.push(...buildTree(menuData));

      console.log("构建的移动目标树:", result); // 调试用
      return result;
    },

    // 选择移动目标
    handleMoveMenuSelect({ row }) {
      this.selectedMoveTarget = row;
      console.log("选择移动目标:", row); // 调试用
    },

    // 确认移动
    confirmMove() {
      if (!this.selectedMoveTarget || !this.currentMoveMenu) {
        messageHandler.notifyWarning("请选择移动目标");
        return;
      }

      try {
        // 1. 从原位置移除菜单
        const removedMenu = this.removeAndGetMenu(
          this.menuData,
          this.currentMoveMenu
        );

        if (!removedMenu) {
          messageHandler.notifyError("未找到要移动的菜单");
          return;
        }

        // 2. 更新parentId
        if (this.selectedMoveTarget.isRoot) {
          // 移动到根级
          removedMenu.parentId = "";
          this.menuData.push(removedMenu);
        } else {
          // 移动到指定菜单下
          removedMenu.parentId = this.selectedMoveTarget.menuId;

          // 找到实际的目标菜单并添加
          const actualTarget = this.findMenuInTree(
            this.menuData,
            this.selectedMoveTarget.menuId
          );
          if (actualTarget) {
            if (!actualTarget.subMenuList) {
              actualTarget.subMenuList = [];
            }
            actualTarget.subMenuList.push(removedMenu);
          }
        }

        // 3. 刷新表格
        this.$refs.MenuTable.loadData(this.menuData);

        // 4. 关闭弹窗
        this.showMoveDialog = false;

        messageHandler.notifySuccess(
          `已将"${removedMenu.menuName}"移动到"${
            this.selectedMoveTarget.menuName
          }"${this.selectedMoveTarget.isRoot ? "" : "下"}`
        );
      } catch (error) {
        this.handleError("菜单移动失败", error);
      }
    },

    // 取消移动
    cancelMove() {
      this.showMoveDialog = false;
      this.currentMoveMenu = null;
      this.selectedMoveTarget = null;
    },

    // 在菜单树中查找指定菜单
    findMenuInTree(menuTree, menuId) {
      for (const menu of menuTree) {
        if (menu.menuId === menuId) {
          return menu;
        }

        if (menu.subMenuList && menu.subMenuList.length > 0) {
          const found = this.findMenuInTree(menu.subMenuList, menuId);
          if (found) {
            return found;
          }
        }
      }
      return null;
    },

    // 选择要移动的菜单
    selectForMove(row) {
      this.selectedMenuForMove = row;
    },

    // 清除父菜单选择
    clearSelection() {
      this.selectedMenuForAdd = null;
    },

    // 清除移动菜单选择
    clearMoveSelection() {
      this.selectedMenuForMove = null;
    },

    // 检查是否可以移动（避免循环引用）
    canMoveMenu(menuToMove, targetParent) {
      // 不能移动到自己
      if (menuToMove.menuId === targetParent.menuId) {
        return false;
      }

      // 不能移动到自己的后代菜单中
      return !this.isDescendant(targetParent, menuToMove);
    },

    // 检查是否为后代菜单
    isDescendant(potentialDescendant, ancestor) {
      if (!ancestor.subMenuList || ancestor.subMenuList.length === 0) {
        return false;
      }

      for (const child of ancestor.subMenuList) {
        if (child.menuId === potentialDescendant.menuId) {
          return true;
        }
        if (this.isDescendant(potentialDescendant, child)) {
          return true;
        }
      }

      return false;
    },

    // 移动菜单到选中的父菜单下（保留原方法作为备用）
    moveToSelected() {
      // 这个方法现在不再使用，被移动弹窗替代
    },

    // 从树结构中移除并返回菜单
    removeAndGetMenu(menuList, targetMenu) {
      for (let i = 0; i < menuList.length; i++) {
        if (menuList[i].menuId === targetMenu.menuId) {
          return menuList.splice(i, 1)[0];
        }

        if (menuList[i].subMenuList && menuList[i].subMenuList.length > 0) {
          const found = this.removeAndGetMenu(
            menuList[i].subMenuList,
            targetMenu
          );
          if (found) {
            return found;
          }
        }
      }
      return null;
    },

    // 添加顶级菜单
    addMenu() {
      const newMenu = {
        menuId: "", // 空字符串，保存时后端分配真实ID
        parentId: "", // 顶级菜单的parentId为空
        menuName: "新菜单",
        orderIndex: 1,
        show: true,
        subMenuList: [],
        functionList: [],
        // 保持与原有API结构一致的其他字段
        moduleCode: "",
        moduleName: "",
        functionCode: "",
        menuType: 0,
      };

      this.menuData.push(newMenu);
      this.$refs.MenuTable.loadData(this.menuData);
    },

    // 添加子菜单
    addSubMenu() {
      if (!this.selectedMenuForAdd) {
        messageHandler.notifyWarning("请先选择父菜单");
        return;
      }

      const newSubMenu = {
        menuId: "", // 空字符串，保存时后端分配真实ID
        parentId: this.selectedMenuForAdd.menuId, // 设置父菜单ID
        menuName: "新子菜单",
        orderIndex: 1,
        show: true,
        subMenuList: [],
        functionList: [],
        // 保持与原有API结构一致的其他字段
        moduleCode: "",
        moduleName: "",
        functionCode: "",
        menuType: 0,
      };

      // 直接添加到选中菜单的子菜单列表中
      if (!this.selectedMenuForAdd.subMenuList) {
        this.selectedMenuForAdd.subMenuList = [];
      }
      this.selectedMenuForAdd.subMenuList.push(newSubMenu);

      // 刷新表格数据
      this.$refs.MenuTable.loadData(this.menuData);
    },

    addFunc() {
      if (!this.selectedMenu.menuId) {
        return messageHandler.notifyInfo("请先保存菜单");
      }
      this.showFunctionDialog = true;
    },

    // 保存菜单结构（兼容原有API）
    async saveMenuData() {
      try {
        // 将树形数据转换为扁平数据，保持原有API结构
        const flatData = this.flattenMenuTree(this.menuData);

        console.log("保存的菜单数据:", flatData); // 调试用

        const response = await saveMenu(flatData);
        if (response.success) {
          messageHandler.notifySuccess(response.msg);
          await this.getMenuList();
          this.selectedMenuForAdd = null;
        }
      } catch (error) {
        this.handleError("菜单保存失败", error);
      }
    },

    // 获取菜单列表（兼容原有API）
    async getMenuList() {
      try {
        const response = await getMenu();
        if (response.success && response.data) {
          console.log("获取的菜单数据:", JSON.stringify(response.data)); // 调试用
          // 将扁平数据转换为树形结构
          this.menuData = this.buildMenuTree(response.data);
        }
      } catch (error) {
        this.handleError("获取菜单列表失败", error);
      }
    },

    // 保存功能配置
    async saveFunctionData() {
      try {
        const payload = [
          {
            menuId: this.selectedMenu.menuId,
            functionList: this.selectedFunctions,
          },
        ];

        const response = await saveMenuFunction(payload);
        if (response.success) {
          messageHandler.notifySuccess(response.msg);
        }
      } catch (error) {
        this.handleError("功能保存失败", error);
      }
    },

    // 功能选择处理
    confirmSelection() {
      const functions = this.$refs.currentFuncTable.getCheckboxRecords();
      this.selectedFunctions = [...this.selectedFunctions, ...functions];
      this.showFunctionDialog = false;
    },

    // 删除菜单
    async removeMenu(row) {
      try {
        if (!row.menuId) {
          // 删除未保存的菜单
          this.removeMenuFromTree(this.menuData, row);
          this.$refs.MenuTable.loadData(this.menuData);
        } else {
          // 删除已保存的菜单
          const response = await deleteMenu([row.menuId]);
          if (response.success) {
            messageHandler.notifySuccess(response.msg);
            this.removeMenuFromTree(this.menuData, row);
            this.$refs.MenuTable.loadData(this.menuData);
          }
        }
      } catch (error) {
        this.handleError("删除菜单失败", error);
      }
    },

    // 从树结构中递归删除菜单
    removeMenuFromTree(menuList, targetMenu) {
      for (let i = 0; i < menuList.length; i++) {
        if (
          menuList[i].menuId === targetMenu.menuId ||
          (menuList[i].menuName === targetMenu.menuName && !targetMenu.menuId)
        ) {
          menuList.splice(i, 1);
          return true;
        }

        if (menuList[i].subMenuList && menuList[i].subMenuList.length > 0) {
          if (this.removeMenuFromTree(menuList[i].subMenuList, targetMenu)) {
            return true;
          }
        }
      }
      return false;
    },

    // 删除功能
    async removeFunction(row) {
      try {
        if (!row.functionId) {
          this.selectedFunctions = this.selectedFunctions.filter(
            (x) => x.functionName !== row.functionName
          );
          return;
        }

        const payload = [
          {
            menuId: this.selectedMenu.menuId,
            needDeleteFunctionIds: [row.functionId],
          },
        ];

        const response = await deleteMenuFunction(payload);
        if (response.success) {
          messageHandler.notifySuccess(response.msg);
          this.selectedFunctions = this.selectedFunctions.filter(
            (x) => x.functionId !== row.functionId
          );
        }
      } catch (error) {
        this.handleError("删除功能失败", error);
      }
    },

    // 行样式处理
    getRowClassName({ row }) {
      if (
        this.selectedMenuForAdd &&
        this.selectedMenuForAdd.menuId === row.menuId
      ) {
        return "selected-parent-row";
      }
      return "";
    },

    // 排序变化处理
    handleOrderChange(row) {
      // 可以在这里添加排序逻辑
      console.log(
        "Order changed for:",
        row.menuName,
        "New order:",
        row.orderIndex
      );
    },

    // 错误处理
    handleError(message, error) {
      console.error(message, error);
      messageHandler.notifyError(message);
    },

    openConfigDialog(menu) {
      this.currentConfigMenu = menu;
      this.selectedConfigFunction = null;
      // 如果菜单已经有配置的功能，预选中对应的功能
      if (menu.functionCode) {
        debugger;
        const existingFunction = this.currentFunctions.find(
          (func) => func.functionCode === menu.functionCode
        );
        if (existingFunction) {
          this.selectedConfigFunction = existingFunction;
          // 延迟设置高亮，确保表格已渲染
          setTimeout(() => {
            this.$refs.configFuncTable?.setCurrentRow(existingFunction);
          }, 100);
        }
      }
      this.showConfigDialog = true;
    },

    // 新增：选择配置功能
    handleConfigFunctionSelect({ row }) {
      this.selectedConfigFunction = row;
    },

    // 新增：确认配置
    confirmConfig() {
      if (!this.selectedConfigFunction || !this.currentConfigMenu) {
        messageHandler.notifyWarning("请选择一个功能");
        return;
      }

      // 将选中的功能信息赋值给当前菜单
      this.currentConfigMenu.functionCode = this.selectedConfigFunction.functionCode;
      this.currentConfigMenu.functionName = this.selectedConfigFunction.functionName;

      // 刷新表格数据
      this.$refs.MenuTable.loadData(this.menuData);

      messageHandler.notifySuccess(
        `已为菜单"${this.currentConfigMenu.menuName}"配置功能"${this.selectedConfigFunction.functionName}"`
      );

      this.cancelConfig();
    },

    // 新增：取消配置
    cancelConfig() {
      this.showConfigDialog = false;
      this.currentConfigMenu = null;
      this.selectedConfigFunction = null;
    },
  },
};
</script>

<style scoped>
.menu-manager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.menu-actions {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.selected-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.selected-parent-info {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.move-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dialog-header {
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 16px;
}

.move-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #374151;
  margin-bottom: 8px;
}

.move-info i {
  color: #f59e0b;
}

.hint-text {
  color: #6b7280;
  font-size: 14px;
}

.menu-tree-selector {
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.tree-node-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.tree-icon {
  color: #6b7280;
  font-size: 14px;
}

.node-name {
  flex: 1;
  color: #374151;
  font-weight: 500;
}

.node-badge {
  background: #e5e7eb;
  color: #6b7280;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.dialog-footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background-color: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 6px;
  color: #0369a1;
}

.dialog-footer-info i {
  color: #059669;
}

.function-selector {
  padding: 15px;
}

.action-buttons {
  grid-column: 1 / -1;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 高亮选中的父菜单行 */
:deep(.selected-parent-row) {
  background-color: #f0f9ff !important;
}

:deep(.selected-parent-row td) {
  background-color: #f0f9ff !important;
}

/* 移动弹窗中的树形表格样式 */
:deep(.move-dialog .vxe-table .vxe-body--row:hover) {
  background-color: #f8fafc;
  cursor: pointer;
}

:deep(.move-dialog .vxe-table .vxe-body--row.row--current) {
  background-color: #dbeafe !important;
}

:deep(.move-dialog .vxe-table .vxe-body--row.row--current td) {
  background-color: #dbeafe !important;
}

/* 新增：配置弹窗样式 */
.config-selector {
  padding: 15px;
}

.config-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.config-header span {
  font-size: 16px;
  color: #374151;
}

.config-tip {
  color: #6b7280;
  font-size: 14px;
  margin-top: 8px;
  margin-bottom: 0;
}

.selected-config-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background-color: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 6px;
  color: #0369a1;
}

.selected-config-info i {
  color: #059669;
}

/* 配置弹窗中的表格样式 */
:deep(.config-selector .vxe-table .vxe-body--row:hover) {
  background-color: #f8fafc;
  cursor: pointer;
}

:deep(.config-selector .vxe-table .vxe-body--row.row--current) {
  background-color: #dbeafe !important;
}

:deep(.config-selector .vxe-table .vxe-body--row.row--current td) {
  background-color: #dbeafe !important;
}

/* 当前配置信息样式 */
.current-config-info {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 4px;
  font-size: 14px;
}

.current-label {
  color: #92400e;
  font-weight: 500;
}

.current-function {
  color: #92400e;
  font-weight: 600;
  margin-left: 4px;
}

.current-code {
  color: #78716c;
  font-size: 12px;
  margin-left: 4px;
}
</style>
