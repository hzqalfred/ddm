<template>
  <div class="column-items-editor">
    <el-button link type="primary" @click="showColumnEditor">
      编写表头
    </el-button>

    <!-- 表格列编辑器弹窗 -->
    <el-dialog
      v-model="state.dialogVisible"
      title="表格列编辑器"
      width="95%"
      :before-close="handleClose"
      append-to-body
      destroy-on-close
    >
      <div class="editor-container">
        <!-- 工具栏 -->
        <div class="toolbar">
          <el-button type="primary" @click="addColumn">添加列</el-button>
          <el-button type="success" @click="addGroup">添加分组</el-button>
          <el-button @click="clearColumns">清空所有</el-button>
          <el-button @click="importColumns">导入字段</el-button>
          <el-button @click="exportColumns">导出配置</el-button>
        </div>

        <!-- 表格编辑器 -->
        <vxe-table
          ref="xTableRef"
          border
          show-overflow
          :data="displayData"
          :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
          @cell-click="handleCellClick"
          :row-config="{ isHover: true }"
          :row-class-name="getRowClassName"
        >
          <!-- 序号列 -->
          <vxe-column
            type="seq"
            width="60"
            title="序号"
            fixed="left"
          ></vxe-column>

          <!-- 层级显示列 -->
          <vxe-column width="150" title="层级结构" fixed="left">
            <template #default="{ row }">
              <div
                class="level-indicator"
                :style="{ paddingLeft: row.level * 20 + 'px' }"
              >
                <el-button
                  v-if="row.isGroup && hasChildren(row)"
                  link
                  @click="toggleExpand(row)"
                  size="small"
                  style="width: 20px; padding: 0;"
                >
                  <el-icon>
                    <CaretBottom v-if="row.expanded" />
                    <CaretRight v-else />
                  </el-icon>
                </el-button>
                <span v-else style="width: 20px; display: inline-block;"></span>

                <el-icon
                  v-if="row.isGroup"
                  style="color: #409eff; margin: 0 5px;"
                >
                  <Folder />
                </el-icon>
                <el-icon v-else style="color: #67c23a; margin: 0 5px;">
                  <Document />
                </el-icon>

                <span style="font-size: 12px; color: #909399;">
                  {{ row.isGroup ? "分组" : "列" }} (L{{ row.level }})
                </span>
              </div>
            </template>
          </vxe-column>

          <!-- 字段名称 -->
          <vxe-column
            field="field"
            title="字段名称"
            width="140"
            :edit-render="{}"
          >
            <template #default="{ row }">
              <span v-if="row.isGroup" style="color: #c0c4cc;"
                >-- 分组无字段 --</span
              >
              <span v-else :class="{ 'field-error': hasFieldError(row) }">{{
                row.field || ""
              }}</span>
            </template>
            <template #edit="{ row }">
              <el-input
                v-if="!row.isGroup"
                v-model="row.field"
                @blur="validateField(row)"
                @input="debounceValidateField(row)"
                placeholder="输入字段名"
                :class="{ 'field-error': hasFieldError(row) }"
              />
              <span v-else style="color: #c0c4cc;">分组无需字段名</span>
            </template>
          </vxe-column>

          <!-- 显示名称 -->
          <vxe-column
            field="title"
            title="显示名称"
            width="140"
            :edit-render="{}"
          >
            <template #default="{ row }">
              <span :class="{ 'title-error': !row.title }">{{
                row.title || ""
              }}</span>
            </template>
            <template #edit="{ row }">
              <el-input
                v-model="row.title"
                @input="markAsChanged"
                :placeholder="row.isGroup ? '输入分组名称' : '输入列标题'"
                :class="{ 'title-error': !row.title }"
              />
            </template>
          </vxe-column>

          <!-- 列宽 -->
          <vxe-column
            field="width"
            title="列宽(px)"
            width="100"
            :edit-render="{}"
          >
            <template #default="{ row }">
              {{ row.width || 150 }}
            </template>
            <template #edit="{ row }">
              <el-input-number
                v-model="row.width"
                :min="50"
                :max="1000"
                size="small"
                @change="markAsChanged"
              />
            </template>
          </vxe-column>

          <!-- 是否显示 -->
          <vxe-column field="visible" title="是否显示" width="100">
            <template #default="{ row }">
              <el-switch v-model="row.visible" @change="markAsChanged" />
            </template>
          </vxe-column>

          <!-- 是否排序 -->
          <vxe-column field="sortable" title="是否排序" width="100">
            <template #default="{ row }">
              <el-switch
                v-model="row.sortable"
                :disabled="row.isGroup"
                @change="markAsChanged"
              />
            </template>
          </vxe-column>

          <!-- 是否可编辑 -->
          <vxe-column field="editable" title="编辑" width="100">
            <template #default="{ row }">
              <el-switch
                v-model="row.editable"
                :disabled="row.isGroup"
                @change="markAsChanged"
              />
            </template>
          </vxe-column>

          <!-- 单元格渲染 -->
          <vxe-column field="renderByTemplate" title="单元格-渲染" width="120">
            <template #default="{ row }">
              <el-switch
                :disabled="!row.editable || row.isGroup"
                v-model="row.renderByTemplate"
                @change="markAsChanged"
              />
            </template>
          </vxe-column>

          <!-- 对齐方式 -->
          <vxe-column field="align" title="对齐方式" width="120">
            <template #default="{ row }">
              <el-select
                v-model="row.align"
                size="small"
                @change="markAsChanged"
              >
                <el-option label="左对齐" value="left" />
                <el-option label="居中" value="center" />
                <el-option label="右对齐" value="right" />
              </el-select>
            </template>
          </vxe-column>

          <!-- 编辑器 -->
          <vxe-column field="editRenderName" title="编辑器" width="120">
            <template #default="{ row }">
              <el-select
                v-model="row.editRenderName"
                size="small"
                @change="handleEditorChange(row)"
                :disabled="row.isGroup"
              >
                <el-option label="VxeInput" value="VxeInput" />
                <el-option label="VxeSelect" value="VxeSelect" />
                <el-option label="VxeSwitch" value="VxeSwitch" />
                <el-option label="VxeDatePicker" value="VxeDatePicker" />
                <el-option label="VxeNumberInput" value="VxeNumberInput" />
                <el-option label="VxeTreeSelect" value="VxeTreeSelect" />
                <el-option label="VxeTableSelect" value="VxeTableSelect" />
                <el-option label="VxeIconPicker" value="VxeIconPicker" />
                <el-option label="VxeColorPicker" value="VxeColorPicker" />
              </el-select>
            </template>
          </vxe-column>

          <!-- 编辑器配置 -->
          <vxe-column title="编辑器配置" width="120">
            <template #default="{ row }">
              <el-button
                type="text"
                @click="editRenderPropsClick(row)"
                :disabled="!row.editRenderName || row.isGroup"
                size="small"
              >
                {{
                  row.editRenderProps &&
                  Object.keys(row.editRenderProps).length > 0
                    ? "修改配置"
                    : "设置配置"
                }}
              </el-button>
            </template>
          </vxe-column>

          <!-- 选择表格 -->
          <vxe-column
            field="selectTableRowSet"
            title="选择表格"
            width="140"
            :edit-render="{}"
          >
            <template #edit="{ row }">
              <el-input
                v-model="row.selectTableRowSet"
                :disabled="row.isGroup"
                placeholder="表格选择配置"
                @input="markAsChanged"
              />
            </template>
          </vxe-column>

          <!-- 默认值 -->
          <vxe-column
            field="defaultValue"
            title="默认值"
            width="140"
            :edit-render="{}"
          >
            <template #edit="{ row }">
              <el-input
                v-model="row.defaultValue"
                :disabled="row.isGroup"
                placeholder="默认值"
                @input="markAsChanged"
              />
            </template>
          </vxe-column>

          <!-- 格式化 -->
          <vxe-column field="formatter" title="格式化" width="120">
            <template #default="{ row }">
              <el-select
                v-model="row.formatter"
                size="small"
                clearable
                filterable
                allow-create
                :disabled="row.isGroup"
                @change="markAsChanged"
              >
                <el-option label="无" value="" />
                <el-option label="日期-年月日" value="dateFormatter" />
                <el-option label="日期-时分秒" value="datetimeFormatter" />
                <el-option label="货币" value="currencyFormatter" />
                <el-option label="百分比" value="percentFormatter" />
                <el-option label="千分位" value="thousandFormatter" />
                <el-option label="布尔值" value="booleanFormatter" />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="260" fixed="right">
            <template #default="{ row, $rowIndex }">
              <div class="actions-container">
                <!-- 显示的按钮 -->
                <template
                  v-for="(action, index) in getVisibleActions(row)"
                  :key="action.key"
                >
                  <el-button
                    :link="action.link"
                    :type="action.type"
                    @click="action.handler"
                    :size="action.size"
                    :disabled="action.disabled"
                    :title="action.title"
                  >
                    {{ action.label }}
                  </el-button>
                </template>

                <!-- 下拉菜单 -->
                <el-dropdown
                  v-if="getDropdownActions(row).length > 0"
                  trigger="click"
                  @command="handleDropdownCommand"
                >
                  <el-button link type="info" size="small">
                    更多
                    <el-icon class="el-icon--right">
                      <ArrowDown />
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="action in getDropdownActions(row)"
                        :key="action.key"
                        :command="{ action: action.key, row: row }"
                        :disabled="action.disabled"
                      >
                        {{ action.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveColumns">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑器配置对话框 -->
    <el-dialog
      v-model="state.editRenderPropsVisible"
      title="编辑器配置"
      width="600px"
      append-to-body
    >
      <div v-if="state.currentRow">
        <div class="editor-info">
          <p>
            编辑 <strong>{{ state.currentRow.field }}</strong> 字段的
            <strong>{{ state.currentRow.editRenderName }}</strong> 编辑器配置
          </p>
        </div>
        <code-editor
          ref="renderPropsEditorRef"
          v-model="state.currentEditRenderPropsJson"
          mode="json"
          :readonly="false"
          height="300px"
        />
      </div>
      <template #footer>
        <el-button @click="state.editRenderPropsVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="saveEditRenderProps">确定</el-button>
      </template>
    </el-dialog>

    <!-- 移入分组对话框 -->
    <el-dialog
      v-model="state.moveToGroupDialogVisible"
      title="移入分组"
      width="400px"
      append-to-body
    >
      <div v-if="state.currentMoveRow">
        <p>
          将 <strong>{{ state.currentMoveRow.title }}</strong> 移入以下分组：
        </p>
        <el-radio-group v-model="state.selectedGroupId" style="width: 100%;">
          <div style="max-height: 200px; overflow-y: auto;">
            <el-radio
              v-for="group in state.availableGroups"
              :key="group.id"
              :value="group.id"
              style="display: block; margin: 8px 0;"
            >
              <span :style="{ paddingLeft: group.level * 20 + 'px' }">
                <el-icon style="margin-right: 5px;"><Folder /></el-icon>
                {{ group.title }} (L{{ group.level }})
              </span>
            </el-radio>
          </div>
        </el-radio-group>
        <div
          v-if="state.availableGroups.length === 0"
          style="color: #909399; text-align: center; padding: 20px;"
        >
          暂无可用的分组
        </div>
      </div>
      <template #footer>
        <el-button @click="state.moveToGroupDialogVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="confirmMoveToGroup"
          :disabled="!state.selectedGroupId"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, nextTick, watch, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Grid,
  Delete,
  Folder,
  Document,
  CaretBottom,
  CaretRight,
} from "@element-plus/icons-vue";
import CodeEditor from "@/core/components/CodeEditor/index.vue";
import i18n from "@/core/i18nLang";
import { debounce } from "lodash";
import { ArrowDown } from "@element-plus/icons-vue";
export default {
  name: "column-items-editor",
  mixins: [i18n],
  components: {
    CodeEditor,
    Grid,
    Delete,
    Folder,
    Document,
    CaretBottom,
    CaretRight,
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    name: String,
  },
  setup(props) {
    // 常量
    const MAX_LEVEL = 2;
    const FIELD_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

    // 统一状态管理
    const state = reactive({
      dialogVisible: false,
      hasUnsavedChanges: false,
      treeMode: true,
      data: [],

      // 编辑器配置相关
      editRenderPropsVisible: false,
      currentEditRenderPropsJson: "",
      currentRow: null,

      // 移入分组相关
      moveToGroupDialogVisible: false,
      currentMoveRow: null,
      availableGroups: [],
      selectedGroupId: "",

      // 验证状态
      fieldErrors: new Set(),

      // 防抖定时器
      validateTimer: null,
    });

    // 引用
    const xTableRef = ref(null);
    const renderPropsEditorRef = ref(null);

    // ID生成器 - 使用更可靠的方式
    let idCounter = 1;
    const generateId = () => {
      const timestamp = Date.now();
      const random = Math.random()
        .toString(36)
        .substr(2, 9);
      return `item_${timestamp}_${idCounter++}_${random}`;
    };

    // 创建数据项的工厂函数
    const createDataItem = (config = {}) => {
      const baseItem = {
        id: generateId(),
        parentId: null,
        level: 0,
        order: 0,
        isGroup: false,
        expanded: true,
        title: "",
        width: 150,
        visible: true,
        align: "left",
        ...config,
      };

      // 如果不是分组，添加数据列特有属性
      if (!baseItem.isGroup) {
        Object.assign(
          {
            field: "",
            sortable: false,
            editable: false,
            formatter: "",
            renderByTemplate: false,
            defaultValue: "",
            editRenderName: "VxeInput",
            editRenderProps: {},
            selectTableRowSet: "",
          },
          baseItem
        );
      }
      return baseItem;
    };

    // 计算显示数据
    const displayData = computed(() => {
      if (!state.treeMode) {
        return [...state.data]
          .filter((item) => item.level === 0)
          .sort((a, b) => a.order - b.order);
      }

      const result = [];
      const visited = new Set();

      const addItemsRecursively = (parentId = null) => {
        const items = state.data
          .filter((item) => item.parentId === parentId && !visited.has(item.id))
          .sort((a, b) => a.order - b.order);

        items.forEach((item) => {
          if (!visited.has(item.id)) {
            visited.add(item.id);
            result.push(item);

            if (item.isGroup && item.expanded) {
              addItemsRecursively(item.id);
            }
          }
        });
      };

      addItemsRecursively(null);
      return result;
    });

    // 监听树形模式变化
    watch(
      () => state.treeMode,
      (newValue) => {
        if (newValue) {
          // 切换到树形模式时，确保数据结构正确
          reorderItems();
        }
      }
    );

    // 重新排序所有项目
    const reorderItems = () => {
      const reorderLevel = (parentId = null) => {
        const items = state.data
          .filter((item) => item.parentId === parentId)
          .sort((a, b) => a.order - b.order);

        items.forEach((item, index) => {
          item.order = index;
          if (item.isGroup) {
            reorderLevel(item.id);
          }
        });
      };

      reorderLevel(null);
    };

    // 字段验证
    const validateField = (row) => {
      if (row.isGroup) return true;

      const fieldName = row.field?.trim();
      let isValid = true;

      // 检查字段名是否为空
      if (!fieldName) {
        state.fieldErrors.add(row.id);
        isValid = false;
      } else {
        // 检查字段名格式
        if (!FIELD_NAME_REGEX.test(fieldName)) {
          ElMessage.error("字段名只能包含字母、数字和下划线，且不能以数字开头");
          isValid = false;
        } else {
          // 检查字段名是否重复
          const isDuplicate = state.data.some(
            (item) =>
              !item.isGroup &&
              item.field?.trim() === fieldName &&
              item.id !== row.id
          );

          if (isDuplicate) {
            ElMessage.error("字段名不能重复");
            isValid = false;
          }
        }

        if (isValid) {
          state.fieldErrors.delete(row.id);
        } else {
          state.fieldErrors.add(row.id);
        }
      }

      return isValid;
    };

    // 防抖字段验证
    const debounceValidateField = (row) => {
      if (state.validateTimer) {
        clearTimeout(state.validateTimer);
      }

      state.validateTimer = setTimeout(() => {
        validateField(row);
      }, 300);
    };

    // 检查字段是否有错误
    const hasFieldError = (row) => {
      return state.fieldErrors.has(row.id);
    };

    // 标记为已修改
    const markAsChanged = () => {
      state.hasUnsavedChanges = true;
    };

    // 数据扁平化
    const flattenColumns = (columns, parentId = null, level = 0) => {
      const result = [];
      columns.forEach((col, index) => {
        const item = createDataItem({
          parentId: parentId,
          level: level,
          order: index,
          isGroup: !!(col.children && col.children.length > 0),
          ...col,
        });

        result.push(item);

        if (col.children && col.children.length > 0) {
          result.push(...flattenColumns(col.children, item.id, level + 1));
        }
      });
      return result;
    };

    // 构建嵌套结构
    const buildNestedColumns = () => {
      const buildChildren = (parentId = null) => {
        return state.data
          .filter((item) => item.parentId === parentId)
          .sort((a, b) => a.order - b.order)
          .map((item) => {
            const cleanItem = { ...item };

            // 删除内部管理属性
            delete cleanItem.id;
            delete cleanItem.parentId;
            delete cleanItem.level;
            delete cleanItem.order;
            delete cleanItem.isGroup;
            delete cleanItem.expanded;

            const children = buildChildren(item.id);
            if (children.length > 0) {
              cleanItem.children = children;
            }

            return cleanItem;
          });
      };

      return buildChildren();
    };

    // 移动操作的统一处理函数
    const moveItem = (item, direction) => {
      try {
        if (!item) return false;

        const siblings = state.data
          .filter((sibling) => sibling.parentId === item.parentId)
          .sort((a, b) => a.order - b.order);

        const currentIndex = siblings.findIndex(
          (sibling) => sibling.id === item.id
        );
        if (currentIndex === -1) return false;

        let targetIndex;
        if (direction === "up") {
          targetIndex = currentIndex - 1;
          if (targetIndex < 0) return false;
        } else {
          targetIndex = currentIndex + 1;
          if (targetIndex >= siblings.length) return false;
        }

        // 交换order值
        const temp = siblings[currentIndex].order;
        siblings[currentIndex].order = siblings[targetIndex].order;
        siblings[targetIndex].order = temp;

        markAsChanged();
        return true;
      } catch (error) {
        console.error("移动项目时出错:", error);
        ElMessage.error("移动失败，请重试");
        return false;
      }
    };

    // 检查是否可以移动
    const canMoveUp = (row) => {
      if (!row) return false;

      const siblings = state.data
        .filter((item) => item.parentId === row.parentId)
        .sort((a, b) => a.order - b.order);

      const currentIndex = siblings.findIndex((item) => item.id === row.id);
      return currentIndex > 0;
    };

    const canMoveDown = (row) => {
      if (!row) return false;

      const siblings = state.data
        .filter((item) => item.parentId === row.parentId)
        .sort((a, b) => a.order - b.order);

      const currentIndex = siblings.findIndex((item) => item.id === row.id);
      return currentIndex < siblings.length - 1;
    };

    // 上移下移操作
    const moveUp = (row) => moveItem(row, "up");
    const moveDown = (row) => moveItem(row, "down");

    // 业务功能函数
    const initColumnData = () => {
      try {
        // 清空现有数据和错误状态
        state.data.splice(0, state.data.length);
        state.fieldErrors.clear();

        if (props.selectedWidget?.options?.columns) {
          const columns = JSON.parse(
            JSON.stringify(props.selectedWidget.options.columns)
          );
          const hasNested = columns.some(
            (col) => col.children && col.children.length > 0
          );

          if (hasNested) {
            const flatData = flattenColumns(columns);
            state.data.push(...flatData);
          } else {
            columns.forEach((col, index) => {
              const item = createDataItem({
                order: index,
                ...col,
              });
              state.data.push(item);
            });
          }
        }

        state.hasUnsavedChanges = false;
      } catch (error) {
        console.error("初始化列数据时出错:", error);
        ElMessage.error("初始化失败，请检查数据格式");
      }
    };

    const showColumnEditor = async () => {
      initColumnData();
      state.dialogVisible = true;
    };

    const addColumn = () => {
      const topLevelCount = state.data.filter((item) => item.level === 0)
        .length;
      const newColumn = createDataItem({
        order: topLevelCount,
        field: `field${Date.now()}`,
        title: `列${state.data.filter((item) => !item.isGroup).length + 1}`,
      });

      state.data.push(newColumn);
      markAsChanged();
    };

    const addGroup = () => {
      const topLevelCount = state.data.filter((item) => item.level === 0)
        .length;
      const newGroup = createDataItem({
        order: topLevelCount,
        isGroup: true,
        title: `分组${state.data.filter((item) => item.isGroup).length + 1}`,
        width: 200,
        align: "center",
      });

      state.data.push(newGroup);
      markAsChanged();
    };

    const addChildToGroup = (parentRow) => {
      if (!parentRow || parentRow.level >= MAX_LEVEL) {
        ElMessage.warning(`不能超过${MAX_LEVEL + 1}级层次`);
        return;
      }

      const siblings = state.data.filter(
        (item) => item.parentId === parentRow.id
      );
      const newChild = createDataItem({
        parentId: parentRow.id,
        level: parentRow.level + 1,
        order: siblings.length,
        field: `field${Date.now()}`,
        title: `子列${siblings.length + 1}`,
      });

      state.data.push(newChild);
      parentRow.isGroup = true;
      markAsChanged();
    };

    const toggleExpand = (row) => {
      if (row) {
        row.expanded = !row.expanded;
      }
    };

    const hasChildren = (row) => {
      return row ? state.data.some((item) => item.parentId === row.id) : false;
    };

    const getRowClassName = ({ row }) => {
      return row?.isGroup ? "group-row" : "data-row";
    };

    const removeItem = async (row) => {
      if (!row) return;

      try {
        let confirmMessage = `确定要删除 "${row.title}" 吗？`;

        if (row.isGroup) {
          const children = state.data.filter(
            (item) => item.parentId === row.id
          );
          if (children.length > 0) {
            confirmMessage += `\n这将同时删除 ${children.length} 个子项目。`;
          }
        }

        await ElMessageBox.confirm(confirmMessage, "确认删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        // 删除项目及其所有子项
        const toDelete = new Set();
        const collectItems = (itemId) => {
          const item = state.data.find((i) => i.id === itemId);
          if (item) {
            toDelete.add(item);
            // 递归收集子项
            const children = state.data.filter((i) => i.parentId === itemId);
            children.forEach((child) => collectItems(child.id));
          }
        };

        collectItems(row.id);

        // 从数据中删除
        toDelete.forEach((item) => {
          const index = state.data.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            state.data.splice(index, 1);
          }
          // 清理验证错误状态
          state.fieldErrors.delete(item.id);
        });

        reorderItems();
        markAsChanged();
        ElMessage.success("删除成功");
      } catch (error) {
        if (error !== "cancel") {
          console.error("删除项目时出错:", error);
          ElMessage.error("删除失败，请重试");
        }
      }
    };

    const clearColumns = async () => {
      try {
        await ElMessageBox.confirm("确定要清空所有列吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        state.data.splice(0, state.data.length);
        state.fieldErrors.clear();
        markAsChanged();
        ElMessage.success("已清空所有列");
      } catch (error) {
        // 用户取消操作
      }
    };

    const importColumns = () => {
      try {
        if (!props.designer?.fieldsList?.length) {
          ElMessage.warning("没有可导入的字段");
          return;
        }
        debugger;
        const fields = props.designer.fieldsList;
        const currentTopLevelCount = state.data.filter(
          (item) => item.level === 0
        ).length;

        fields.forEach((field, index) => {
          const newColumn = createDataItem({
            order: currentTopLevelCount + index,
            field:
              field.options?.name || field.key || `field${Date.now()}_${index}`,
            title:
              field.options?.label || field.displayName || `字段${index + 1}`,
          });
          state.data.push(newColumn);
        });

        markAsChanged();
        ElMessage.success(`成功导入 ${fields.length} 个字段`);
      } catch (error) {
        console.error("导入字段时出错:", error);
        ElMessage.error("导入失败，请重试");
      }
    };

    const exportColumns = async () => {
      try {
        const exportData = buildNestedColumns();
        const configStr = JSON.stringify(exportData, null, 2);
        console.log(exportData);
        await navigator.clipboard.writeText(configStr);
        ElMessage.success("配置已复制到剪贴板");
      } catch (error) {
        console.error("导出配置时出错:", error);

        // 如果剪贴板API不可用，显示配置内容
        const exportData = buildNestedColumns();
        const configStr = JSON.stringify(exportData, null, 2);
        console.log("表格配置:", configStr);
        ElMessage.warning("请从控制台复制配置内容");
      }
    };

    const handleCellClick = () => {
      markAsChanged();
    };

    const handleEditorChange = (row) => {
      if (!row?.isGroup) {
        row.editRenderProps = {};
        markAsChanged();
      }
    };

    const editRenderPropsClick = async (row) => {
      if (!row || row.isGroup) return;

      state.currentRow = row;
      if (!row.editRenderProps) {
        row.editRenderProps = {};
      }

      state.currentEditRenderPropsJson = JSON.stringify(
        row.editRenderProps,
        null,
        2
      );
      state.editRenderPropsVisible = true;

      await nextTick();
      if (renderPropsEditorRef.value) {
        renderPropsEditorRef.value.setValue(state.currentEditRenderPropsJson);
      }
    };

    const saveEditRenderProps = () => {
      if (!state.currentRow) return;

      try {
        const parsedConfig = JSON.parse(state.currentEditRenderPropsJson);
        state.currentRow.editRenderProps = parsedConfig;
        markAsChanged();
        state.editRenderPropsVisible = false;
        ElMessage.success("配置保存成功");
      } catch (error) {
        ElMessage.error("JSON格式错误: " + error.message);
      }
    };

    // 层级管理功能
    const promoteLevel = (row) => {
      if (!row || row.level <= 0) return;

      const parent = state.data.find((item) => item.id === row.parentId);
      row.level -= 1;
      row.parentId = parent ? parent.parentId : null;

      // 重新计算order
      const siblings = state.data.filter(
        (item) => item.parentId === row.parentId
      );
      row.order = siblings.length;

      markAsChanged();
    };

    const canCreateGroup = (row) => {
      return row && row.level < MAX_LEVEL;
    };

    const createGroupForItem = (row) => {
      if (!row || row.level >= MAX_LEVEL) {
        ElMessage.warning(`不能超过${MAX_LEVEL + 1}级层次`);
        return;
      }

      const newGroup = createDataItem({
        parentId: row.parentId,
        level: row.level,
        order: row.order,
        isGroup: true,
        title: `${row.title}分组`,
        width: Math.max(row.width + 50, 200),
        align: "center",
      });

      // 更新原项目的层级关系
      row.parentId = newGroup.id;
      row.level = row.level + 1;
      row.order = 0;

      // 插入新分组
      const currentIndex = state.data.findIndex((item) => item.id === row.id);
      state.data.splice(currentIndex, 0, newGroup);

      markAsChanged();
      ElMessage.success("已创建新分组并移入");
    };

    // 分组移动功能
    const isCircularReference = (sourceRow, targetGroupRow) => {
      if (!sourceRow || !targetGroupRow) return false;

      let current = targetGroupRow;
      const visited = new Set();

      while (current && current.parentId && !visited.has(current.id)) {
        visited.add(current.id);
        if (current.parentId === sourceRow.id) {
          return true;
        }
        current = state.data.find((item) => item.id === current.parentId);
      }
      return false;
    };

    const getAvailableGroups = (currentRow) => {
      if (!currentRow) return [];

      return state.data.filter(
        (item) =>
          item.isGroup &&
          item.id !== currentRow.id &&
          item.level < MAX_LEVEL &&
          !isCircularReference(currentRow, item)
      );
    };

    const showMoveToGroupDialog = (row) => {
      if (!row) return;

      state.currentMoveRow = row;
      state.availableGroups = getAvailableGroups(row);
      state.selectedGroupId = "";
      state.moveToGroupDialogVisible = true;
    };

    const confirmMoveToGroup = () => {
      if (!state.selectedGroupId || !state.currentMoveRow) {
        ElMessage.error("请选择目标分组");
        return;
      }

      const targetGroup = state.data.find(
        (item) => item.id === state.selectedGroupId
      );
      if (!targetGroup) {
        ElMessage.error("目标分组不存在");
        return;
      }

      // 检查层级限制
      if (targetGroup.level >= MAX_LEVEL) {
        ElMessage.error(`目标分组层级过深，不能超过${MAX_LEVEL + 1}级`);
        return;
      }

      // 更新项目的层级关系
      state.currentMoveRow.parentId = targetGroup.id;
      state.currentMoveRow.level = targetGroup.level + 1;

      // 重新计算order
      const siblings = state.data.filter(
        (item) => item.parentId === targetGroup.id
      );
      state.currentMoveRow.order = siblings.length - 1;

      markAsChanged();
      state.moveToGroupDialogVisible = false;
      ElMessage.success("移动成功");
    };

    const moveOutOfGroup = (row) => {
      if (!row || row.level === 0) {
        ElMessage.error("该项目已在顶级");
        return;
      }

      row.parentId = null;
      row.level = 0;

      // 重新计算order
      const topLevelItems = state.data.filter((item) => item.level === 0);
      row.order = topLevelItems.length - 1;

      markAsChanged();
      ElMessage.success("已移出分组");
    };

    // 数据验证和保存
    const validateAllData = () => {
      const errors = [];

      // 验证标题
      const emptyTitles = state.data.filter((item) => !item.title?.trim());
      if (emptyTitles.length > 0) {
        errors.push("以下项目的标题不能为空");
      }

      // 验证字段名
      const dataColumns = state.data.filter((item) => !item.isGroup);
      const emptyFields = dataColumns.filter((item) => !item.field?.trim());
      if (emptyFields.length > 0) {
        errors.push("数据列的字段名不能为空");
      }

      // 验证字段名格式
      const invalidFields = dataColumns.filter(
        (item) =>
          item.field?.trim() && !FIELD_NAME_REGEX.test(item.field.trim())
      );
      if (invalidFields.length > 0) {
        errors.push(
          "字段名格式不正确（只能包含字母、数字和下划线，且不能以数字开头）"
        );
      }

      // 验证字段名重复
      const fieldNames = dataColumns
        .map((item) => item.field?.trim())
        .filter(Boolean);
      const duplicateFields = fieldNames.filter(
        (field, index) => fieldNames.indexOf(field) !== index
      );
      if (duplicateFields.length > 0) {
        errors.push(`字段名重复: ${[...new Set(duplicateFields)].join(", ")}`);
      }

      return errors;
    };

    const saveColumns = async () => {
      try {
        // 验证数据
        const errors = validateAllData();
        if (errors.length > 0) {
          ElMessage.error(errors.join("\n"));
          return;
        }

        if (!props.selectedWidget?.options) {
          ElMessage.error("无法保存：选中的组件无效");
          return;
        }

        const finalColumns = buildNestedColumns();

        // 清空原有配置
        props.selectedWidget.options.columns = [];

        // 使用 nextTick 确保响应性更新
        await nextTick();
        props.selectedWidget.options.columns = JSON.parse(
          JSON.stringify(finalColumns)
        );

        state.hasUnsavedChanges = false;
        state.dialogVisible = false;
        ElMessage.success("保存成功");
      } catch (error) {
        console.error("保存列配置时出错:", error);
        ElMessage.error("保存失败，请重试");
      }
    };

    const handleClose = async (done) => {
      if (state.hasUnsavedChanges) {
        try {
          await ElMessageBox.confirm(
            "当前有未保存的修改，确定要关闭吗？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          );
          done();
        } catch {
          // 用户取消关闭
        }
      } else {
        done();
      }
    };
    // 操作按钮配置
    const getActionButtons = (row) => {
      const actions = [];

      // 添加子项
      if (row.level < MAX_LEVEL && row.isGroup) {
        actions.push({
          key: "addChild",
          label: "添加子项",
          type: "primary",
          link: true,
          size: "small",
          disabled: false,
          handler: () => addChildToGroup(row),
          width: 80, // 预估宽度
        });
      }

      // 移入分组
      actions.push({
        key: "moveToGroup",
        label: "移入分组",
        type: "success",
        link: true,
        size: "small",
        disabled: getAvailableGroups(row).length === 0,
        handler: () => showMoveToGroupDialog(row),
        width: 80,
      });

      // 移出分组
      if (row.level > 0) {
        actions.push({
          key: "moveOut",
          label: "移出分组",
          type: "warning",
          link: true,
          size: "small",
          disabled: false,
          handler: () => moveOutOfGroup(row),
          width: 80,
        });
      }

      // 提升层级
      if (row.level > 0) {
        actions.push({
          key: "promote",
          label: "提升层级",
          type: "warning",
          link: true,
          size: "small",
          disabled: false,
          handler: () => promoteLevel(row),
          width: 80,
        });
      }

      // // 创建分组
      // if (canCreateGroup(row)) {
      //   actions.push({
      //     key: "createGroup",
      //     label: "创建分组",
      //     type: "info",
      //     link: true,
      //     size: "small",
      //     disabled: false,
      //     title: "创建新分组并将此项移入",
      //     handler: () => createGroupForItem(row),
      //     width: 80,
      //   });
      // }

      // 删除
      actions.push({
        key: "delete",
        label: "删除",
        type: "danger",
        link: true,
        size: "small",
        disabled: false,
        handler: () => removeItem(row),
        width: 50,
      });

      // 上移
      if (canMoveUp(row)) {
        actions.push({
          key: "moveUp",
          label: "上移",
          type: "primary",
          link: true,
          size: "small",
          disabled: false,
          handler: () => moveUp(row),
          width: 50,
        });
      }

      // 下移
      if (canMoveDown(row)) {
        actions.push({
          key: "moveDown",
          label: "下移",
          type: "primary",
          link: true,
          size: "small",
          disabled: false,
          handler: () => moveDown(row),
          width: 50,
        });
      }

      return actions;
    };

    // 计算可见的操作按钮
    const getVisibleActions = (row) => {
      const actions = getActionButtons(row);
      const maxWidth = 320; // 操作列可用宽度，预留80px给"更多"按钮
      const moreButtonWidth = 60; // "更多"按钮宽度

      let totalWidth = 0;
      const visibleActions = [];

      for (const action of actions) {
        const actionWidth = action.width; // 加上间距
        if (totalWidth + actionWidth + moreButtonWidth <= maxWidth) {
          visibleActions.push(action);
          totalWidth += actionWidth;
        } else {
          break;
        }
      }

      // 如果所有按钮都能显示，就显示所有按钮
      if (visibleActions.length === actions.length) {
        return actions;
      }

      return visibleActions;
    };

    // 计算下拉菜单中的操作按钮
    const getDropdownActions = (row) => {
      const allActions = getActionButtons(row);
      const visibleActions = getVisibleActions(row);

      // 如果可见按钮数量等于总按钮数量，则不需要下拉菜单
      if (visibleActions.length === allActions.length) {
        return [];
      }

      return allActions.slice(visibleActions.length);
    };

    // 处理下拉菜单命令
    const handleDropdownCommand = (command) => {
      const { action, row } = command;
      const actions = getActionButtons(row);
      const targetAction = actions.find((a) => a.key === action);

      if (targetAction && targetAction.handler) {
        targetAction.handler();
      }
    };
    // 组件卸载时清理
    onUnmounted(() => {
      if (state.validateTimer) {
        clearTimeout(state.validateTimer);
      }
    });

    return {
      // 常量
      MAX_LEVEL,

      // 状态
      state,

      // 引用
      xTableRef,
      renderPropsEditorRef,

      // 计算属性
      displayData,

      // 方法
      showColumnEditor,
      addColumn,
      addGroup,
      addChildToGroup,
      toggleExpand,
      hasChildren,
      getRowClassName,
      removeItem,
      clearColumns,
      importColumns,
      exportColumns,
      validateField,
      debounceValidateField,
      hasFieldError,
      markAsChanged,
      handleCellClick,
      handleEditorChange,
      editRenderPropsClick,
      saveEditRenderProps,
      saveColumns,
      handleClose,

      // 移动功能
      canMoveUp,
      canMoveDown,
      moveUp,
      moveDown,

      // 层级管理
      promoteLevel,
      canCreateGroup,
      createGroupForItem,

      // 分组功能
      getAvailableGroups,
      showMoveToGroupDialog,
      confirmMoveToGroup,
      moveOutOfGroup,

      getActionButtons,
      getVisibleActions,
      getDropdownActions,
      handleDropdownCommand,
      ArrowDown, // 记得导入图标
    };
  },
};
</script>

<style lang="scss" scoped>
.column-items-editor {
  width: 100%;
}

.editor-container {
  padding: 10px;
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;

  .el-button {
    margin-right: 0;
  }
}

.level-indicator {
  display: flex;
  align-items: center;
  min-height: 24px;
}

.dialog-footer {
  text-align: right;
}

.editor-info {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;

  p {
    margin: 0;
    color: #606266;
  }
}

// 错误状态样式
.field-error {
  color: #f56c6c !important;
  border-color: #f56c6c !important;
}

.title-error {
  color: #f56c6c !important;
}

:deep(.vxe-table) {
  .group-row {
    background-color: #f8f9fa;
    font-weight: 500;

    .vxe-cell {
      background-color: #f8f9fa;
    }
  }

  .data-row {
    &[data-level="1"] {
      .vxe-cell {
        background-color: #fafbfc;
      }
    }

    &[data-level="2"] {
      .vxe-cell {
        background-color: #f5f6f7;
      }
    }
  }

  .el-input.is-disabled,
  .el-select.is-disabled,
  .el-switch.is-disabled {
    opacity: 0.5;
  }

  // 错误状态的输入框
  .field-error {
    .el-input__wrapper {
      border-color: #f56c6c !important;
      box-shadow: 0 0 0 1px #f56c6c inset !important;
    }
  }

  .title-error {
    .el-input__wrapper {
      border-color: #f56c6c !important;
      box-shadow: 0 0 0 1px #f56c6c inset !important;
    }
  }
}

.level-indicator {
  .el-icon {
    font-size: 16px;
  }
}

.toolbar {
  .el-switch {
    margin-left: 10px;
    margin-right: 10px;
  }
}

.el-radio-group {
  .el-radio {
    width: 100%;
    margin-right: 0;

    .el-radio__label {
      width: 100%;
      display: flex;
      align-items: center;
    }
  }
}
.actions-container {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;

  .el-button {
    margin: 0;
    padding: 4px 8px;
    min-width: auto;

    &.el-button--small {
      font-size: 12px;
      height: 24px;
      line-height: 1;
    }
  }

  .el-dropdown {
    margin-left: 4px;

    .el-button {
      .el-icon--right {
        margin-left: 2px;
      }
    }
  }
}

// 下拉菜单样式
:deep(.el-dropdown-menu) {
  .el-dropdown-menu__item {
    font-size: 12px;
    padding: 6px 12px;

    &.is-disabled {
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
}
// 响应式设计
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;

    .el-button,
    .el-switch {
      margin: 5px 0;
    }
  }
}
</style>
