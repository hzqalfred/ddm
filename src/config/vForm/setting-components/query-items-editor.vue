<template>
  <div class="query-items-editor">
    <el-button link type="primary" @click="showQueryEditor">
      编写查询项
    </el-button>

    <!-- 查询条件编辑器弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="查询条件编辑器"
      width="90%"
      :before-close="handleClose"
      append-to-body
      destroy-on-close
    >
      <div class="editor-container">
        <!-- 工具栏 -->
        <div class="toolbar">
          <el-button @click="clearQueryItems">清空所有</el-button>
        </div>

        <!-- 表格编辑器 -->
        <vxe-table
          ref="xTable"
          border
          resizable
          show-overflow
          :data="queryItems"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
          @cell-click="handleCellClick"
        >
          <!-- 序号列 -->
          <vxe-column
            type="seq"
            width="60"
            title="序号"
            fixed="left"
          ></vxe-column>

          <!-- 拖拽列 -->
          <vxe-column width="60" title="拖拽" fixed="left">
            <template #default>
              <span class="drag-handle">
                <el-icon><Grid /></el-icon>
              </span>
            </template>
          </vxe-column>

          <!-- 字段名称 -->
          <vxe-column
            field="searchColumn"
            title="字段名称"
            width="140"
            :edit-render="{}"
          >
            <template #edit="{ row }">
              <el-input v-model="row.searchColumn" @blur="validateField(row)" />
            </template>
          </vxe-column>

          <!-- 显示名称 -->
          <vxe-column
            field="label"
            title="显示名称"
            width="140"
            :edit-render="{}"
          >
            <template #edit="{ row }">
              <el-input v-model="row.label" />
            </template>
          </vxe-column>

          <!-- 是否默认查询 -->
          <vxe-column field="query" title="是否默认查询" width="120">
            <template #default="{ row }">
              <el-switch v-model="row.query" />
            </template>
          </vxe-column>

          <!-- 是否允许查询 -->
          <vxe-column field="allowquery" title="是否允许查询" width="120">
            <template #default="{ row }">
              <el-switch v-model="row.allowquery" />
            </template>
          </vxe-column>

          <!-- 运算符 -->
          <vxe-column field="operator" title="运算符" width="140">
            <template #default="{ row }">
              <el-select v-model="row.operator" size="small">
                <el-option label="等于" value="eq" />
                <el-option label="不等于" value="ne" />
                <el-option label="大于" value="gt" />
                <el-option label="大于等于" value="ge" />
                <el-option label="小于" value="lt" />
                <el-option label="小于等于" value="le" />
                <el-option label="模糊查询" value="like" />
                <el-option label="区间查询" value="between" />
                <el-option label="集合查询" value="in" />
              </el-select>
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
              <el-input v-model="row.defaultValue" />
            </template>
          </vxe-column>

          <!-- 操作列 -->
          <vxe-column title="操作" width="150" fixed="right">
            <template #default="{ row, $rowIndex }">
              <el-button link type="danger" @click="removeQueryItem($rowIndex)">
                删除
              </el-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveQueryItems">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 选项编辑器弹窗 -->
    <el-dialog
      v-model="optionsDialogVisible"
      title="编辑选项"
      width="600px"
      append-to-body
    >
      <div class="options-editor">
        <div class="options-toolbar">
          <el-button type="primary" size="small" @click="addOption"
            >添加选项</el-button
          >
        </div>
        <vxe-table
          ref="optionsTable"
          border
          :data="currentOptions"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-column field="label" title="选项名称" :edit-render="{}">
            <template #edit="{ row }">
              <el-input v-model="row.label" />
            </template>
          </vxe-column>
          <vxe-column field="value" title="选项值" :edit-render="{}">
            <template #edit="{ row }">
              <el-input v-model="row.value" />
            </template>
          </vxe-column>
          <vxe-column title="操作" width="100">
            <template #default="{ $rowIndex }">
              <el-button type="danger" link @click="removeOption($rowIndex)">
                删除
              </el-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <template #footer>
        <el-button @click="optionsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveOptions">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, inject } from "vue";
import { Grid } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Sortable from "sortablejs";
import i18n from "@/core/i18nLang";
import { deepClone } from "@/core/utils/tool";
import { queryColumnList } from "@/api/dataService";

export default {
  name: "query-items-editor",
  mixins: [i18n],
  components: {
    Grid,
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    name: String,
    globalDsv: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const dialogVisible = ref(false);
    const optionsDialogVisible = ref(false);
    const queryItems = ref([]);
    const xTable = ref(null);
    const optionsTable = ref(null);
    const hasUnsavedChanges = ref(false);
    const currentOptions = ref([]);
    const currentEditRow = ref(null);
    const getGlobalDsv = inject("getGlobalDsv", () => props.globalDsv || {});

    // 初始化查询项数据
    const initQueryItems = () => {
      // 获取已配置的查询项
      let configuredItems = [];
      if (props.selectedWidget?.options?.[props.name]) {
        configuredItems = deepClone(props.selectedWidget.options[props.name]);
      }

      // 确保每个已配置查询项都有必要的属性
      configuredItems.forEach((item) => {
        if (!item.type) item.type = "input";
        if (!item.operator) item.operator = "eq";
        if (item.query === undefined) item.query = true;
        // 关键修改：保持allowquery的原始状态，不要设默认值
        // 如果之前已经明确设置为false，就保持false
        if (item.allowquery === undefined) item.allowquery = false;

        if (!item.options && item.type === "select") item.options = [];

        // 确保字段名称一致性
        if (item.requestColumn && !item.searchColumn) {
          item.searchColumn = item.requestColumn;
        }
        if (item.columnName && !item.label) {
          item.label = item.columnName;
        }
      });

      // 存储已配置项，用于后续字段对比
      return configuredItems;
    };

    // 显示查询项编辑器并加载数据
    const showQueryEditor = async () => {
      dialogVisible.value = true;

      // 先显示弹窗，然后加载数据
      try {
        await fetchQueryColumns();

        // 初始化拖拽排序
        nextTick(() => {
          initSortable();
        });
      } catch (error) {
        console.error("加载查询字段失败:", error);
        ElMessage.error("加载查询字段失败");
      }
    };

    // 获取查询字段
    const fetchQueryColumns = async () => {
      try {
        // 获取已配置的查询项
        const configuredItems = initQueryItems();

        // 构建已配置项的映射，用于快速查找
        const configuredMap = {};
        configuredItems.forEach((item) => {
          // 使用 searchColumn/requestColumn 作为键
          const key = item.searchColumn || item.requestColumn;
          if (key) {
            configuredMap[key] = item;
          }
        });

        // 获取全局数据源
        const globalDsv = getGlobalDsv();
        const { param: dsv } = globalDsv;

        if (!dsv || !dsv.moduleName || !dsv.moduleCode) {
          ElMessage.warning("缺少必要的模块信息，无法获取查询字段");
          return;
        }

        // 调用接口获取查询字段列表
        const response = await queryColumnList({
          moduleName: dsv.moduleName,
          moduleCode: dsv.moduleCode,
          objectCode: dsv.modelCode || "",
          methodCode: "query",
        });

        if (!response.data || !Array.isArray(response.data)) {
          ElMessage.warning("未获取到可用的查询字段");
          return;
        }

        // 获取字段列表
        const fields = response.data;

        // 处理字段数据 - 关键改动在这里
        const newItems = fields.map((field) => {
          // 查找是否已存在该字段配置
          const existingItem = configuredMap[field.requestColumn];

          // 如果已配置了此字段，保留所有现有配置
          return {
            searchColumn: field.requestColumn,
            requestColumn: field.requestColumn,
            label: field.columnName,
            columnName: field.columnName,
            // 如果字段已配置过，使用其现有配置，否则设置默认值
            query: existingItem ? existingItem.query : false,
            // 关键修改：明确保留allowquery值
            allowquery: existingItem ? existingItem.allowquery : false,
            // 其他属性也保留现有配置或使用默认值
            operator: existingItem ? existingItem.operator : "eq",
            defaultValue: existingItem ? existingItem.defaultValue : "",
            options: existingItem ? existingItem.options : null,
          };
        });

        // 更新查询项列表
        queryItems.value = newItems;
        hasUnsavedChanges.value = true;
      } catch (error) {
        console.error("获取查询字段失败:", error);
        ElMessage.error("获取查询字段失败: " + (error.message || "未知错误"));
        throw error;
      }
    };

    // 初始化拖拽排序
    const initSortable = () => {
      const xTableEl = xTable.value?.$el;
      if (!xTableEl) return;

      const tableBody = xTableEl.querySelector(".vxe-table--body tbody");

      if (tableBody) {
        new Sortable(tableBody, {
          handle: ".drag-handle",
          animation: 150,
          onEnd: ({ oldIndex, newIndex }) => {
            if (oldIndex !== newIndex) {
              const movedItem = queryItems.value.splice(oldIndex, 1)[0];
              queryItems.value.splice(newIndex, 0, movedItem);
              hasUnsavedChanges.value = true;
            }
          },
        });
      }
    };

    // 清空所有查询项
    const clearQueryItems = () => {
      ElMessageBox.confirm("确定要清空所有查询条件吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 将所有查询项的 query 设置为 false 而不是完全删除
          queryItems.value.forEach((item) => {
            item.query = false;
          });
          hasUnsavedChanges.value = true;
        })
        .catch(() => {});
    };

    // 删除查询项
    const removeQueryItem = (index) => {
      // 将查询项的 query 设置为 false 而不是删除
      queryItems.value[index].query = false;
      hasUnsavedChanges.value = true;
    };

    // 验证字段名
    const validateField = (row) => {
      const fieldName = row.searchColumn;
      const isDuplicate =
        queryItems.value.filter((item) => item.searchColumn === fieldName)
          .length > 1;

      if (isDuplicate) {
        ElMessage.error("字段名不能重复");
        row.searchColumn = `field${Date.now()}`;
      }

      if (!fieldName) {
        ElMessage.error("字段名不能为空");
        row.searchColumn = `field${Date.now()}`;
      }
    };

    // 编辑选项
    const editOptions = (row) => {
      currentEditRow.value = row;
      currentOptions.value = deepClone(row.options || []);
      optionsDialogVisible.value = true;
    };

    // 添加选项
    const addOption = () => {
      currentOptions.value.push({
        label: `选项${currentOptions.value.length + 1}`,
        value: `value${currentOptions.value.length + 1}`,
      });
    };

    // 删除选项
    const removeOption = (index) => {
      currentOptions.value.splice(index, 1);
    };

    // 保存选项
    const saveOptions = () => {
      if (currentEditRow.value) {
        currentEditRow.value.options = deepClone(currentOptions.value);
        console.log(currentEditRow);
        hasUnsavedChanges.value = true;
      }
      optionsDialogVisible.value = false;
    };

    // 保存查询条件
    const saveQueryItems = () => {
      // 验证必填项
      const itemsToSave = queryItems.value
      const invalid = itemsToSave.some(
        (item) => !item.searchColumn || !item.label
      );

      if (invalid) {
        ElMessage.error("字段名和显示名称不能为空");
        return;
      }

      // 处理查询条件，确保数据字段名称一致性和所有属性都被保存
      const processedItems = itemsToSave.map((item) => {
        // 为了保持与API返回数据结构的兼容性，添加标准字段
        return {
          ...item, // 保留所有原始属性
          requestColumn: item.searchColumn, // 保持字段名一致性
          columnName: item.label, // 保持显示名一致性
          // 明确保存allowquery属性
          allowquery: item.allowquery !== undefined ? item.allowquery : false,
        };
      });

      // 保存到 selectedWidget
      if (props.selectedWidget?.options) {
        props.selectedWidget.options[props.name] = [];
        setTimeout(() => {
          props.selectedWidget.options[props.name] = deepClone(processedItems);
          console.log(processedItems);
          hasUnsavedChanges.value = false;
          dialogVisible.value = false;
          ElMessage.success("保存成功");
        }, 100);
      }
    };

    // 关闭前确认
    const handleClose = (done) => {
      if (hasUnsavedChanges.value) {
        ElMessageBox.confirm("当前有未保存的修改，确定要关闭吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            done();
          })
          .catch(() => {});
      } else {
        done();
      }
    };

    // 单元格点击事件
    const handleCellClick = ({ row, column }) => {
      hasUnsavedChanges.value = true;
    };

    return {
      dialogVisible,
      optionsDialogVisible,
      queryItems,
      currentOptions,
      currentEditRow,
      xTable,
      optionsTable,
      showQueryEditor,
      clearQueryItems,
      fetchQueryColumns,
      removeQueryItem,
      validateField,
      editOptions,
      addOption,
      removeOption,
      saveOptions,
      saveQueryItems,
      handleClose,
      handleCellClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.query-items-editor {
  width: 100%;
}

.editor-container {
  padding: 10px;
}

.toolbar {
  margin-bottom: 10px;

  .el-button {
    margin-right: 10px;
  }
}

.drag-handle {
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;

  &:hover {
    color: #409eff;
  }
}

.dialog-footer {
  text-align: right;
}

.options-editor {
  padding: 15px;

  .options-toolbar {
    margin-bottom: 10px;
  }
}
</style>
