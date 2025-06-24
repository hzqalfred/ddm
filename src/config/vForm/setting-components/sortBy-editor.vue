<template>
  <div class="sortby-editor">
    <el-button link type="primary" @click="showSortByEditor">
      配置排序
    </el-button>

    <!-- 排序配置编辑器弹窗 -->
    <el-dialog
      v-model="state.dialogVisible"
      title="表格排序配置"
     
      width="75%"
      :before-close="handleClose"
      destroy-on-close
    >
      <div class="editor-container">
        <!-- 全局排序设置 -->
        <el-card shadow="never" class="global-config-card">
          <template #header>
            <div class="card-header">
              <span>全局排序设置</span>
            </div>
          </template>

          <el-row :gutter="20">
            <el-col :span="6">
              <div class="config-item">
                <label>启用排序：</label>
                <el-switch
                  v-model="state.globalConfig.sortable"
                  @change="markAsChanged"
                />
              </div>
            </el-col>
            <el-col :span="6">
              <div class="config-item">
                <label>多列排序：</label>
                <el-switch
                  v-model="state.globalConfig.multiple"
                  @change="markAsChanged"
                  :disabled="!state.globalConfig.sortable"
                />
              </div>
            </el-col>
            <!-- <el-col :span="6">
              <div class="config-item">
                <label>服务端排序：</label>
                <el-switch 
                  v-model="state.globalConfig.remote" 
                  @change="markAsChanged"
                  :disabled="!state.globalConfig.sortable"
                />
              </div>
            </el-col>
            <el-col :span="6">
              <div class="config-item">
                <label>触发方式：</label>
                <el-select 
                  v-model="state.globalConfig.trigger" 
                  @change="markAsChanged"
                  :disabled="!state.globalConfig.sortable"
                  style="width: 100%"
                >
                  <el-option label="点击表头" value="default" />
                  <el-option label="点击单元格" value="cell" />
                </el-select>
              </div>
            </el-col> -->
          </el-row>
        </el-card>

        <!-- 默认排序规则 -->
        <el-card
          shadow="never"
          class="sort-rules-card"
          v-if="state.globalConfig.sortable"
        >
          <template #header>
            <div class="card-header">
              <span>默认排序规则</span>
              <div class="header-actions">
                <el-button size="small" type="primary" @click="addSortRule">
                  添加规则
                </el-button>
                <el-button size="small" @click="clearSortRules">
                  清空所有
                </el-button>
                <el-button size="small" @click="importFromColumns">
                  从列导入
                </el-button>
              </div>
            </div>
          </template>

          <!-- 提示信息 -->
          <div class="tips" v-if="state.defaultSort.length === 0">
            <el-alert
              title="暂无默认排序规则"
              description="添加默认排序规则后，表格加载时会按照这些规则进行排序"
              type="info"
              :closable="false"
              show-icon
            />
          </div>

          <!-- 排序规则表格 -->
          <vxe-table
            v-if="state.defaultSort.length > 0"
            ref="xTableRef"
            border
            show-overflow
            :data="state.defaultSort"
            :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
            @cell-click="handleCellClick"
            :row-config="{ isHover: true }"
            height="300"
          >
            <!-- 序号列 -->
            <vxe-column
              type="seq"
              width="60"
              title="优先级"
              fixed="left"
            ></vxe-column>

            <!-- 字段名称 -->
            <vxe-column
              field="field"
              title="字段名称"
              width="200"
              :edit-render="{}"
            >
              <template #default="{ row }">
                <span :class="{ 'field-error': hasFieldError(row) }">
                  {{ getFieldDisplay(row.field) }}
                </span>
              </template>
              <template #edit="{ row }">
                <vxe-select
                  v-model="row.field"
                  placeholder="选择字段"
                  filterable
                  teleported
                  transfer
                  :popper-class="'sortby-select-dropdown'"
                  :popper-options="{ strategy: 'fixed' }"
                  @change="validateField(row)"
                  @visible-change="handleSelectVisibleChange"
                  :class="{ 'field-error': hasFieldError(row) }"
                  style="width: 100%"
                >
                  <vxe-option
                    v-for="field in availableFields"
                    :key="field.value"
                    :label="field.label"
                    :value="field.value"
                  >
                    <div style="display: flex; justify-content: space-between;">
                      <span>{{ field.label }}</span>
                      <span style="color: #8492a6; font-size: 12px;">{{
                        field.value
                      }}</span>
                    </div>
                  </vxe-option>
                </vxe-select>
              </template>
            </vxe-column>

            <!-- 排序方向 -->
            <vxe-column
              field="order"
              title="排序方向"
              width="120"
              :edit-render="{}"
            >
              <template #default="{ row }">
                <el-tag :type="row.order === 'asc' ? 'success' : 'warning'">
                  {{ row.order === "asc" ? "升序" : "降序" }}
                </el-tag>
              </template>
              <template #edit="{ row }">
                <vxe-select
                  v-model="row.order"
                  @change="markAsChanged"
                  teleported
                  transfer
                  :popper-class="'sortby-select-dropdown'"
                  style="width: 100%"
                >
                  <vxe-option label="升序" value="asc">
                    <el-icon style="margin-right: 8px;"><Sort /></el-icon>
                    升序 (A → Z)
                  </vxe-option>
                  <vxe-option label="降序" value="desc">
                    <el-icon style="margin-right: 8px;"><SortDown /></el-icon>
                    降序 (Z → A)
                  </vxe-option>
                </vxe-select>
              </template>
            </vxe-column>

            <!-- 排序类型 -->
            <vxe-column
              field="sortType"
              title="排序类型"
              width="120"
              :edit-render="{}"
            >
              <template #default="{ row }">
                <el-tag type="info" size="small">
                  {{ getSortTypeLabel(row.sortType) }}
                </el-tag>
              </template>
              <template #edit="{ row }">
                <el-select
                  v-model="row.sortType"
                  @change="markAsChanged"
                  teleported
                  :popper-class="'sortby-select-dropdown'"
                  style="width: 100%"
                >
                  <el-option label="自动检测" value="auto" />
                  <el-option label="字符串" value="string" />
                  <el-option label="数字" value="number" />
                  <el-option label="日期" value="date" />
                </el-select>
              </template>
            </vxe-column>

            <!-- 是否启用 -->
            <vxe-column field="enabled" title="是否启用" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.enabled" @change="markAsChanged" />
              </template>
            </vxe-column>

            <!-- 备注 -->
            <vxe-column
              field="remark"
              title="备注"
              width="180"
              :edit-render="{}"
              show-overflow-tooltip
            >
              <template #edit="{ row }">
                <el-input
                  v-model="row.remark"
                  placeholder="备注信息"
                  @input="markAsChanged"
                />
              </template>
            </vxe-column>
          </vxe-table>
        </el-card>

        <!-- 配置预览 -->
        <el-card shadow="never" class="preview-card">
          <template #header>
            <div class="card-header">
              <span>配置预览</span>
              <el-button size="small" @click="exportConfig">
                复制配置
              </el-button>
            </div>
          </template>
          <div class="config-preview-container">
            <div class="config-section">
              <h4>sortConfig 配置：</h4>
              <pre class="config-preview">{{ previewSortConfig }}</pre>
            </div>
            <div
              class="config-section"
              v-if="state.defaultSort.some((s) => s.enabled)"
            >
              <h4>defaultSort 配置：</h4>
              <pre class="config-preview">{{ previewDefaultSort }}</pre>
            </div>
          </div>
        </el-card>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveSortConfig">保存配置</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 从列导入对话框 -->
    <el-dialog
      v-model="state.importDialogVisible"
      title="从表格列导入排序字段"
      width="600px"
      append-to-body
    >
      <div v-if="availableFields.length > 0">
        <div class="import-tips">
          <el-alert
            title="选择要设置默认排序的字段"
            description="导入后将自动添加为升序排列，您可以后续修改排序方向"
            type="info"
            :closable="false"
            show-icon
            style="margin-bottom: 16px;"
          />
        </div>

        <el-checkbox-group v-model="state.selectedFields" style="width: 100%;">
          <div style="max-height: 300px; overflow-y: auto;">
            <el-checkbox
              v-for="field in availableFields"
              :key="field.value"
              :value="field.value"
              style="display: block; margin: 8px 0; width: 100%;"
            >
              <div class="field-option">
                <div class="field-info">
                  <span class="field-title">{{ field.label }}</span>
                  <span class="field-name">{{ field.value }}</span>
                </div>
                <div class="field-type">
                  <el-tag size="small" type="info">{{
                    field.type || "auto"
                  }}</el-tag>
                </div>
              </div>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      <div v-else class="no-fields">
        <el-empty description="暂无可导入的字段，请先配置表格列" />
      </div>
      <template #footer>
        <el-button @click="state.importDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmImportFields"
          :disabled="state.selectedFields.length === 0"
        >
          导入选中字段 ({{ state.selectedFields.length }})
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, nextTick, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Sort, SortDown } from "@element-plus/icons-vue";
import i18n from "@/core/i18nLang";

export default {
  name: "sortBy-editor",
  mixins: [i18n],
  components: {
    Sort,
    SortDown,
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    name: String,
  },
  setup(props) {
    // 统一状态管理
    const state = reactive({
      dialogVisible: false,
      hasUnsavedChanges: false,

      // 全局排序配置
      globalConfig: {
        sortable: true,
        multiple: false,
        remote: false,
        trigger: "default",
      },

      // 默认排序规则
      defaultSort: [],

      // 导入字段相关
      importDialogVisible: false,
      selectedFields: [],

      // 验证状态
      fieldErrors: new Set(),

      // 防抖定时器
      validateTimer: null,
    });

    // 引用
    const xTableRef = ref(null);

    // ID生成器
    let idCounter = 1;
    const generateId = () => {
      const timestamp = Date.now();
      const random = Math.random()
        .toString(36)
        .substr(2, 9);
      return `sort_${timestamp}_${idCounter++}_${random}`;
    };

    // 创建排序规则的工厂函数
    const createSortRule = (config = {}) => {
      return {
        id: generateId(),
        field: "",
        order: "asc", // 'asc' | 'desc'
        sortType: "auto", // 'auto' | 'string' | 'number' | 'date'
        enabled: true,
        remark: "",
        ...config,
      };
    };

    // 获取可用字段列表 - 从表格列配置中提取
    const availableFields = computed(() => {
      if (!props.selectedWidget?.options?.columns) {
        return [];
      }

      const fields = [];

      const extractFields = (columns) => {
        columns.forEach((column) => {
          if (column.children && column.children.length > 0) {
            // 递归处理子列
            extractFields(column.children);
          } else if (column.field && !column.isGroup) {
            // 普通数据列
            fields.push({
              value: column.field,
              label: column.title || column.field,
              type: getSortTypeByField(column),
              sortable: column.sortable !== false, // 默认可排序
              width: column.width,
              align: column.align,
            });
          }
        });
      };

      extractFields(props.selectedWidget.options.columns);

      // 去重处理
      const uniqueFields = [];
      const fieldSet = new Set();

      fields.forEach((field) => {
        if (!fieldSet.has(field.value)) {
          fieldSet.add(field.value);
          uniqueFields.push(field);
        }
      });

      return uniqueFields.filter((field) => field.sortable);
    });

    // 根据字段推断排序类型
    const getSortTypeByField = (column) => {
      if (column.editRenderName) {
        switch (column.editRenderName) {
          case "VxeNumberInput":
            return "number";
          case "VxeDatePicker":
            return "date";
          case "VxeSwitch":
            return "string";
          default:
            return "auto";
        }
      }

      // 根据formatter推断
      if (column.formatter) {
        if (
          column.formatter.includes("date") ||
          column.formatter.includes("time")
        ) {
          return "date";
        }
        if (
          column.formatter.includes("currency") ||
          column.formatter.includes("number")
        ) {
          return "number";
        }
      }

      return "auto";
    };

    // 获取排序类型标签
    const getSortTypeLabel = (sortType) => {
      const labels = {
        auto: "自动",
        string: "字符串",
        number: "数字",
        date: "日期",
      };
      return labels[sortType] || "自动";
    };

    // 获取字段显示信息
    const getFieldDisplay = (fieldName) => {
      const field = availableFields.value.find((f) => f.value === fieldName);
      return field ? `${field.label} (${field.value})` : fieldName;
    };

    // 配置预览
    const previewSortConfig = computed(() => {
      const config = {
        ...state.globalConfig,
      };

      // 如果有默认排序且只有一个，不使用 multiple
      const enabledSorts = state.defaultSort.filter(
        (s) => s.enabled && s.field
      );
      if (enabledSorts.length <= 1) {
        config.multiple = false;
      }

      return JSON.stringify(config, null, 2);
    });

    const previewDefaultSort = computed(() => {
      const enabledRules = state.defaultSort.filter(
        (rule) => rule.enabled && rule.field
      );

      if (enabledRules.length === 0) return "[]";

      if (enabledRules.length === 1 && !state.globalConfig.multiple) {
        // 单个排序时返回对象格式
        const rule = enabledRules[0];
        return JSON.stringify(
          {
            field: rule.field,
            order: rule.order,
          },
          null,
          2
        );
      } else {
        // 多个排序时返回数组格式
        const sorts = enabledRules.map((rule) => ({
          field: rule.field,
          order: rule.order,
        }));
        return JSON.stringify(sorts, null, 2);
      }
    });

    // 字段验证
    const validateField = (row) => {
      const fieldName = row.field?.trim();
      let isValid = true;

      if (!fieldName) {
        state.fieldErrors.add(row.id);
        isValid = false;
      } else {
        // 检查字段名是否重复
        const isDuplicate = state.defaultSort.some(
          (item) =>
            item.field?.trim() === fieldName &&
            item.id !== row.id &&
            item.enabled
        );

        if (isDuplicate) {
          ElMessage.error("字段名不能重复");
          isValid = false;
        }

        if (isValid) {
          state.fieldErrors.delete(row.id);
        } else {
          state.fieldErrors.add(row.id);
        }
      }

      return isValid;
    };

    // 检查字段是否有错误
    const hasFieldError = (row) => {
      return state.fieldErrors.has(row.id);
    };

    // 标记为已修改
    const markAsChanged = () => {
      state.hasUnsavedChanges = true;
    };

    // 处理选择器可见性变化
    const handleSelectVisibleChange = (visible) => {
      if (visible) {
        nextTick(() => {
          const dropdown = document.querySelector(".sortby-select-dropdown");
          if (dropdown) {
            dropdown.style.zIndex = "9999";
          }
        });
      }
    };

    // 初始化排序数据
    const initSortData = () => {
      try {
        // 清空现有数据和错误状态
        state.defaultSort.splice(0, state.defaultSort.length);
        state.fieldErrors.clear();

        const options = props.selectedWidget?.options || {};

        // 初始化全局配置
        if (options.sortConfig) {
          Object.assign(state.globalConfig, options.sortConfig);
        } else {
          // 设置默认值
          state.globalConfig = {
            sortable: options.sortable !== false,
            multiple: options.multipleSort || false,
            remote: options.remoteSortable || false,
            trigger: options.sortTrigger || "default",
          };
        }

        // 初始化默认排序
        if (options.defaultSort) {
          let defaultSort = options.defaultSort;

          // 统一转换为数组格式
          if (!Array.isArray(defaultSort)) {
            defaultSort = [defaultSort];
          }

          defaultSort.forEach((rule, index) => {
            if (rule && rule.field) {
              const sortRule = createSortRule({
                field: rule.field,
                order: rule.order || "asc",
                sortType: rule.sortType || "auto",
                enabled: true,
                remark: rule.remark || `默认排序规则${index + 1}`,
              });
              state.defaultSort.push(sortRule);
            }
          });
        }

        state.hasUnsavedChanges = false;
      } catch (error) {
        console.error("初始化排序数据时出错:", error);
        ElMessage.error("初始化失败，请检查数据格式");
      }
    };

    // 显示编辑器
    const showSortByEditor = async () => {
      initSortData();
      state.dialogVisible = true;
    };

    // 添加排序规则
    const addSortRule = () => {
      const newRule = createSortRule({
        field: "",
        order: "asc",
        sortType: "auto",
        enabled: true,
        remark: `排序规则${state.defaultSort.length + 1}`,
      });

      state.defaultSort.push(newRule);
      markAsChanged();
    };

    // 清空所有规则
    const clearSortRules = async () => {
      try {
        await ElMessageBox.confirm("确定要清空所有排序规则吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        state.defaultSort.splice(0, state.defaultSort.length);
        state.fieldErrors.clear();
        markAsChanged();
        ElMessage.success("已清空所有排序规则");
      } catch (error) {
        // 用户取消操作
      }
    };

    // 从列导入
    const importFromColumns = () => {
      if (availableFields.value.length === 0) {
        ElMessage.warning("没有可导入的字段");
        return;
      }

      state.selectedFields = [];
      state.importDialogVisible = true;
    };

    // 确认导入字段
    const confirmImportFields = () => {
      if (state.selectedFields.length === 0) {
        ElMessage.warning("请选择要导入的字段");
        return;
      }

      let importCount = 0;

      state.selectedFields.forEach((fieldValue) => {
        // 检查是否已存在
        const exists = state.defaultSort.some(
          (rule) => rule.field === fieldValue
        );
        if (!exists) {
          const field = availableFields.value.find(
            (f) => f.value === fieldValue
          );
          const newRule = createSortRule({
            field: fieldValue,
            order: "asc",
            sortType: field?.type || "auto",
            enabled: true,
            remark: `从字段 ${field?.label || fieldValue} 导入`,
          });
          state.defaultSort.push(newRule);
          importCount++;
        }
      });

      if (importCount > 0) {
        markAsChanged();
        ElMessage.success(`成功导入 ${importCount} 个字段`);
      } else {
        ElMessage.warning("所选字段已存在");
      }

      state.importDialogVisible = false;
    };

    // 导出配置
    const exportConfig = async () => {
      try {
        const config = {
          sortConfig: JSON.parse(previewSortConfig.value),
          defaultSort:
            state.defaultSort.filter((s) => s.enabled && s.field).length > 0
              ? JSON.parse(previewDefaultSort.value)
              : null,
        };

        const configStr = JSON.stringify(config, null, 2);
        await navigator.clipboard.writeText(configStr);
        ElMessage.success("配置已复制到剪贴板");
      } catch (error) {
        console.error("导出配置时出错:", error);

        const config = {
          sortConfig: JSON.parse(previewSortConfig.value),
          defaultSort:
            state.defaultSort.filter((s) => s.enabled && s.field).length > 0
              ? JSON.parse(previewDefaultSort.value)
              : null,
        };
        const configStr = JSON.stringify(config, null, 2);
        console.log("排序配置:", configStr);
        ElMessage.warning("请从控制台复制配置内容");
      }
    };

    // 点击单元格
    const handleCellClick = () => {
      markAsChanged();
    };

    // 数据验证
    const validateAllData = () => {
      const errors = [];

      // 如果启用了排序，检查配置
      if (state.globalConfig.sortable) {
        const enabledRules = state.defaultSort.filter((rule) => rule.enabled);
        const emptyFields = enabledRules.filter((rule) => !rule.field?.trim());
        if (emptyFields.length > 0) {
          errors.push("启用的排序规则必须选择字段");
        }

        // 验证字段名重复
        const enabledFields = enabledRules
          .map((rule) => rule.field?.trim())
          .filter(Boolean);
        const duplicateFields = enabledFields.filter(
          (field, index) => enabledFields.indexOf(field) !== index
        );
        if (duplicateFields.length > 0) {
          errors.push(
            `字段名重复: ${[...new Set(duplicateFields)].join(", ")}`
          );
        }
      }

      return errors;
    };

    // 保存配置
    const saveSortConfig = async () => {
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

        const options = props.selectedWidget.options;

        // 保存全局配置
        options.sortConfig = JSON.parse(JSON.stringify(state.globalConfig));

        // 为了向后兼容，也保存到对应的单独属性
        options.sortable = state.globalConfig.sortable;
        options.multipleSort = state.globalConfig.multiple;
        options.remoteSortable = state.globalConfig.remote;
        options.sortTrigger = state.globalConfig.trigger;

        // 保存默认排序
        const enabledRules = state.defaultSort.filter(
          (rule) => rule.enabled && rule.field
        );
        if (enabledRules.length > 0) {
          const defaultSort = enabledRules.map((rule) => ({
            field: rule.field,
            order: rule.order,
            sortType: rule.sortType !== "auto" ? rule.sortType : undefined,
          }));

          // 如果只有一个且不是多列排序，保存为对象格式
          if (defaultSort.length === 1 && !state.globalConfig.multiple) {
            options.defaultSort = defaultSort[0];
          } else {
            options.defaultSort = defaultSort;
          }
        } else {
          options.defaultSort = null;
        }

        await nextTick();

        state.hasUnsavedChanges = false;
        state.dialogVisible = false;
        ElMessage.success("保存成功");
      } catch (error) {
        console.error("保存排序配置时出错:", error);
        ElMessage.error("保存失败，请重试");
      }
    };

    // 关闭对话框
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

    // 组件卸载时清理
    onUnmounted(() => {
      if (state.validateTimer) {
        clearTimeout(state.validateTimer);
      }
    });

    return {
      // 状态
      state,

      // 引用
      xTableRef,

      // 计算属性
      availableFields,
      previewSortConfig,
      previewDefaultSort,

      // 方法
      showSortByEditor,
      addSortRule,
      clearSortRules,
      importFromColumns,
      confirmImportFields,
      exportConfig,
      validateField,
      hasFieldError,
      getFieldDisplay,
      getSortTypeLabel,
      markAsChanged,
      handleCellClick,
      handleSelectVisibleChange,
      saveSortConfig,
      handleClose,
    };
  },
};
</script>

<style lang="scss" scoped>
.sortby-editor {
  width: 100%;
}

.editor-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.global-config-card,
.sort-rules-card,
.preview-card {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  label {
    font-weight: 500;
    color: #606266;
    margin-right: 8px;
    min-width: 80px;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.tips {
  margin-bottom: 16px;
}

.config-preview-container {
  .config-section {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #606266;
      font-weight: 500;
    }
  }
}

.config-preview {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 12px;
  margin: 0;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
  line-height: 1.4;
  color: #2c3e50;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  border: 1px solid #e4e7ed;
}

.dialog-footer {
  text-align: right;
}

.import-tips {
  margin-bottom: 16px;
}

.field-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .field-info {
    display: flex;
    flex-direction: column;

    .field-title {
      font-weight: 500;
      color: #303133;
    }

    .field-name {
      font-size: 12px;
      color: #909399;
      margin-top: 2px;
    }
  }

  .field-type {
    margin-left: 12px;
  }
}

.no-fields {
  text-align: center;
  padding: 40px 20px;
}

// 错误状态样式
.field-error {
  color: #f56c6c !important;
  border-color: #f56c6c !important;
}

:deep(.vxe-table) {
  .el-input.is-disabled,
  .el-select.is-disabled,
  .el-switch.is-disabled {
    opacity: 0.5;
  }

  .field-error {
    .el-input__wrapper,
    .el-select__wrapper {
      border-color: #f56c6c !important;
      box-shadow: 0 0 0 1px #f56c6c inset !important;
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
}

// 确保选择器下拉面板有足够高的层级
:global(.sortby-select-dropdown) {
  z-index: 9999 !important;
}

// 针对弹窗内的所有选择器
:deep(.el-dialog) {
  .el-select-dropdown {
    z-index: 9999 !important;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .config-item {
    flex-direction: column;
    align-items: flex-start;

    label {
      margin-bottom: 4px;
      min-width: auto;
    }
  }

  .field-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    .field-type {
      margin-left: 0;
    }
  }
}
</style>
