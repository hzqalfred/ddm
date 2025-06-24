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
          <div class="toolbar-left">
            <el-button type="primary" @click="addColumn" v-if="!state.jsonMode"
              >添加列</el-button
            >
            <el-button @click="clearColumns" v-if="!state.jsonMode"
              >清空所有</el-button
            >
            <el-button @click="importColumns">导入字段</el-button>
            <el-button @click="exportColumns">导出配置</el-button>
          </div>
          <div class="toolbar-right">
            <el-switch
              v-model="state.jsonMode"
              @change="toggleMode"
              active-text="JSON编辑"
              inactive-text="表格编辑"
              style="margin-right: 10px;"
            />
            <el-button
              v-if="state.jsonMode"
              type="success"
              @click="formatJson"
              size="small"
            >
              格式化
            </el-button>
            <el-button
              v-if="state.jsonMode"
              type="warning"
              @click="validateJson"
              size="small"
            >
              验证JSON
            </el-button>
          </div>
        </div>

        <!-- 表格编辑器 -->
        <div v-if="!state.jsonMode">
          <vxe-table
            ref="xTableRef"
            border
            show-overflow
            height="400px"
            :data="state.data"
            :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
            @cell-click="handleCellClick"
            :row-config="{ isHover: true }"
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
              <template #default="{ row, $rowIndex }">
                <span class="draghandle" :data-index="$rowIndex">
                  <el-icon><Grid /></el-icon>
                </span>
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
                <span :class="{ 'field-error': hasFieldError(row) }">{{
                  row.field || ""
                }}</span>
              </template>
              <template #edit="{ row }">
                <el-input
                  v-model="row.field"
                  @blur="validateField(row)"
                  @input="debounceValidateField(row)"
                  placeholder="输入字段名"
                  :class="{ 'field-error': hasFieldError(row) }"
                />
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
                  placeholder="输入列标题"
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
                <el-switch v-model="row.sortable" @change="markAsChanged" />
              </template>
            </vxe-column>

            <!-- 是否可编辑 -->
            <vxe-column field="editable" title="编辑" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.editable" @change="markAsChanged" />
              </template>
            </vxe-column>

            <!-- 单元格渲染 -->
            <vxe-column
              field="renderByTemplate"
              title="单元格-渲染"
              width="120"
            >
              <template #default="{ row }">
                <el-switch
                  :disabled="!row.editable"
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
                  :disabled="!row.editRenderName"
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

            <!-- 操作 -->
            <vxe-column title="操作" width="160" fixed="right">
              <template #default="{ row, $rowIndex }">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="moveUp($rowIndex)"
                  :disabled="$rowIndex === 0"
                >
                  上移
                </el-button>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="moveDown($rowIndex)"
                  :disabled="$rowIndex === state.data.length - 1"
                >
                  下移
                </el-button>
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="removeItem($rowIndex)"
                >
                  删除
                </el-button>
              </template>
            </vxe-column>
          </vxe-table>
        </div>

        <!-- JSON编辑器 -->
        <div v-if="state.jsonMode" class="json-editor-container">
          <div class="json-editor-header">
            <span class="editor-title">JSON配置编辑器</span>
            <div class="editor-actions">
              <el-button size="small" @click="loadSampleData"
                >加载示例</el-button
              >
              <el-button size="small" @click="syncFromTable"
                >从表格同步</el-button
              >
            </div>
          </div>
          <code-editor
            ref="jsonEditorRef"
            v-model="state.jsonConfigString"
            mode="json"
            :readonly="false"
            height="400px"
            @change="onJsonChange"
          />
          <div class="json-editor-footer">
            <span class="json-status" :class="{ error: state.jsonError }">
              {{ state.jsonError || "配置有效" }}
            </span>
          </div>
        </div>
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
  </div>
</template>

<script>
import { ref, reactive, nextTick, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Grid } from "@element-plus/icons-vue";
import Sortablejs from "sortablejs";
import CodeEditor from "@/core/components/CodeEditor/index.vue";
import i18n from "@/core/i18nLang";

export default {
  name: "column-items-editor",
  mixins: [i18n],
  components: {
    CodeEditor,
    Grid,
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    name: String,
  },
  setup(props) {
    // 常量
    const FIELD_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

    // 统一状态管理
    const state = reactive({
      dialogVisible: false,
      hasUnsavedChanges: false,
      data: [],

      // JSON编辑器相关
      jsonMode: false,
      jsonConfigString: "",
      jsonError: "",

      // 编辑器配置相关
      editRenderPropsVisible: false,
      currentEditRenderPropsJson: "",
      currentRow: null,

      // 验证状态
      fieldErrors: new Set(),

      // 防抖定时器
      validateTimer: null,
    });

    // 引用
    const xTableRef = ref(null);
    const renderPropsEditorRef = ref(null);
    const jsonEditorRef = ref(null);

    // 创建数据项的工厂函数
    const createDataItem = (config = {}) => {
      return {
        field: "",
        title: "",
        width: 150,
        visible: true,
        sortable: false,
        editable: false,
        formatter: "",
        renderByTemplate: false,
        defaultValue: "",
        editRenderName: "VxeInput",
        editRenderProps: {},
        align: "left",
        ...config,
      };
    };

    // 字段验证
    const validateField = (row) => {
      const fieldName = row.field?.trim();
      let isValid = true;

      // 检查字段名是否为空
      if (!fieldName) {
        state.fieldErrors.add(row);
        isValid = false;
      } else {
        // 检查字段名格式
        if (!FIELD_NAME_REGEX.test(fieldName)) {
          ElMessage.error("字段名只能包含字母、数字和下划线，且不能以数字开头");
          isValid = false;
        } else {
          // 检查字段名是否重复
          const isDuplicate = state.data.some(
            (item) => item.field?.trim() === fieldName && item !== row
          );

          if (isDuplicate) {
            ElMessage.error("字段名不能重复");
            isValid = false;
          }
        }

        if (isValid) {
          state.fieldErrors.delete(row);
        } else {
          state.fieldErrors.add(row);
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
      return state.fieldErrors.has(row);
    };

    // 标记为已修改
    const markAsChanged = () => {
      state.hasUnsavedChanges = true;
    };

    // 初始化列数据
    const initColumnData = () => {
      try {
        // 清空现有数据和错误状态
        state.data.splice(0, state.data.length);
        state.fieldErrors.clear();

        if (props.selectedWidget?.options?.columns) {
          const columns = JSON.parse(
            JSON.stringify(props.selectedWidget.options.columns)
          );

          // 扁平化处理，只保留第一层数据
          const flatColumns = [];

          const flattenColumn = (col) => {
            const newCol = createDataItem(col);
            // 删除children属性
            delete newCol.children;
            flatColumns.push(newCol);

            // 如果有子列，也添加到同一层
            if (col.children && col.children.length > 0) {
              col.children.forEach((child) => flattenColumn(child));
            }
          };

          columns.forEach((col) => flattenColumn(col));
          state.data.push(...flatColumns);
        }

        state.hasUnsavedChanges = false;
      } catch (error) {
        console.error("初始化列数据时出错:", error);
        ElMessage.error("初始化失败，请检查数据格式");
      }
    };

    // JSON编辑器相关方法
    const syncDataToJson = () => {
      try {
        state.jsonConfigString = JSON.stringify(state.data, null, 2);
        state.jsonError = "";
      } catch (error) {
        state.jsonError = "转换为JSON时出错: " + error.message;
      }
    };

    const syncJsonToData = () => {
      try {
        if (!state.jsonConfigString.trim()) {
          state.data.splice(0, state.data.length);
          state.jsonError = "";
          return true;
        }

        const parsedData = JSON.parse(state.jsonConfigString);

        // 验证数据格式
        if (!Array.isArray(parsedData)) {
          throw new Error("配置必须是数组格式");
        }

        // 验证每个项目的必需字段
        parsedData.forEach((item, index) => {
          if (typeof item !== "object" || item === null) {
            throw new Error(`第${index + 1}项必须是对象`);
          }
          if (!item.field || typeof item.field !== "string") {
            throw new Error(`第${index + 1}项缺少有效的field字段`);
          }
          if (!item.title || typeof item.title !== "string") {
            throw new Error(`第${index + 1}项缺少有效的title字段`);
          }
        });

        // 数据有效，更新state.data
        state.data.splice(0, state.data.length);
        parsedData.forEach((item) => {
          state.data.push(createDataItem(item));
        });

        state.jsonError = "";
        return true;
      } catch (error) {
        state.jsonError = "JSON解析错误: " + error.message;
        return false;
      }
    };

    const toggleMode = () => {
      if (state.jsonMode) {
        // 切换到JSON模式时，同步表格数据到JSON
        syncDataToJson();
      } else {
        // 切换到表格模式时，同步JSON到表格数据
        if (!syncJsonToData()) {
          // 如果JSON无效，阻止切换
          ElMessage.error("JSON格式无效，无法切换到表格模式");
          state.jsonMode = true;
          return;
        }
        // 切换到表格模式后，重新初始化拖拽
        nextTick(() => {
          setTimeout(() => {
            initSortable();
          }, 100);
        });
      }
    };

    const formatJson = () => {
      try {
        if (!state.jsonConfigString.trim()) {
          syncDataToJson();
          return;
        }
        const parsed = JSON.parse(state.jsonConfigString);
        state.jsonConfigString = JSON.stringify(parsed, null, 2);
        state.jsonError = "";
        ElMessage.success("JSON格式化成功");
      } catch (error) {
        ElMessage.error("JSON格式错误，无法格式化: " + error.message);
      }
    };

    const validateJson = () => {
      const isValid = syncJsonToData();
      if (isValid) {
        ElMessage.success("JSON配置有效");
      } else {
        ElMessage.error("JSON配置无效");
      }
    };

    const onJsonChange = () => {
      markAsChanged();
      // 实时验证JSON（防抖）
      if (state.validateTimer) {
        clearTimeout(state.validateTimer);
      }
      state.validateTimer = setTimeout(() => {
        syncJsonToData();
      }, 500);
    };

    const loadSampleData = () => {
      const sampleData = [
        {
          field: "id",
          title: "ID",
          width: 80,
          visible: true,
          sortable: true,
          editable: false,
          align: "center",
        },
        {
          field: "name",
          title: "姓名",
          width: 120,
          visible: true,
          sortable: true,
          editable: true,
          align: "left",
          editRenderName: "VxeInput",
        },
        {
          field: "age",
          title: "年龄",
          width: 80,
          visible: true,
          sortable: true,
          editable: true,
          align: "center",
          editRenderName: "VxeNumberInput",
        },
        {
          field: "status",
          title: "状态",
          width: 100,
          visible: true,
          sortable: false,
          editable: true,
          align: "center",
          editRenderName: "VxeSelect",
          editRenderProps: {
            options: [
              { label: "启用", value: 1 },
              { label: "禁用", value: 0 },
            ],
          },
        },
      ];

      state.jsonConfigString = JSON.stringify(sampleData, null, 2);
      state.jsonError = "";
      markAsChanged();
    };

    const syncFromTable = () => {
      syncDataToJson();
      ElMessage.success("已从表格同步数据");
    };

    const showColumnEditor = async () => {
      initColumnData();
      // 初始化JSON配置
      syncDataToJson();
      state.dialogVisible = true;
      await nextTick();
      setTimeout(() => {
        if (!state.jsonMode) {
          initSortable();
        }
      }, 300);
    };

    // 初始化拖拽排序
    const initSortable = () => {
      const xTableEl = xTableRef.value?.$el;
      const tableBody = xTableEl?.querySelector(".vxe-table--body tbody");

      if (tableBody) {
        
        new Sortablejs(tableBody, {
          handle: ".draghandle",
          animation: 150,
          onEnd: ({ oldIndex, newIndex }) => {
            // 修复拖拽逻辑
            if (oldIndex !== newIndex) {
              const movedItem = state.data.splice(oldIndex, 1)[0];
              state.data.splice(newIndex, 0, movedItem);
              markAsChanged();
            }
          },
        });
      }
    };

    const addColumn = () => {
      const newColumn = createDataItem({
        field: `field${Date.now()}`,
        title: `列${state.data.length + 1}`,
      });

      state.data.push(newColumn);
      markAsChanged();
    };

    const removeItem = async (index) => {
      try {
        const item = state.data[index];
        if (!item) return;

        await ElMessageBox.confirm(
          `确定要删除 "${item.title}" 吗？`,
          "确认删除",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        state.data.splice(index, 1);
        state.fieldErrors.delete(item);
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

        const fields = props.designer.fieldsList;

        fields.forEach((field, index) => {
          const newColumn = createDataItem({
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
        const exportData = state.data.map((item) => {
          const cleanItem = { ...item };
          return cleanItem;
        });
        const configStr = JSON.stringify(exportData, null, 2);
        await navigator.clipboard.writeText(configStr);
        ElMessage.success("配置已复制到剪贴板");
      } catch (error) {
        console.error("导出配置时出错:", error);
        console.log("表格配置:", state.data);
        ElMessage.warning("请从控制台复制配置内容");
      }
    };

    const handleCellClick = () => {
      markAsChanged();
    };

    const handleEditorChange = (row) => {
      row.editRenderProps = {};
      markAsChanged();
    };

    const editRenderPropsClick = async (row) => {
      if (!row) return;

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

    // 上移下移操作
    const moveUp = (index) => {
      if (index <= 0) return;
      const temp = state.data[index];
      state.data[index] = state.data[index - 1];
      state.data[index - 1] = temp;
      markAsChanged();
    };

    const moveDown = (index) => {
      if (index >= state.data.length - 1) return;
      const temp = state.data[index];
      state.data[index] = state.data[index + 1];
      state.data[index + 1] = temp;
      markAsChanged();
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
      const emptyFields = state.data.filter((item) => !item.field?.trim());
      if (emptyFields.length > 0) {
        errors.push("字段名不能为空");
      }

      // 验证字段名格式
      const invalidFields = state.data.filter(
        (item) =>
          item.field?.trim() && !FIELD_NAME_REGEX.test(item.field.trim())
      );
      if (invalidFields.length > 0) {
        errors.push(
          "字段名格式不正确（只能包含字母、数字和下划线，且不能以数字开头）"
        );
      }

      // 验证字段名重复
      const fieldNames = state.data
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

    // 修改保存方法，支持JSON模式
    const saveColumns = async () => {
      try {
        // 如果在JSON模式，先同步JSON到数据
        if (state.jsonMode) {
          if (!syncJsonToData()) {
            ElMessage.error("JSON格式无效，无法保存");
            return;
          }
        }

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

        // 清理数据，移除内部属性
        const finalColumns = state.data.map((item) => {
          const cleanItem = { ...item };
          return cleanItem;
        });

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
      renderPropsEditorRef,
      jsonEditorRef,

      // 方法
      showColumnEditor,
      addColumn,
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
      moveUp,
      moveDown,

      // JSON编辑器方法
      toggleMode,
      formatJson,
      validateJson,
      onJsonChange,
      loadSampleData,
      syncFromTable,
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
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .el-button {
    margin-right: 0;
  }
}

.draghandle {
  cursor: move;
  color: #409eff;

  &:hover {
    color: #66b1ff;
  }
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

// JSON编辑器样式
.json-editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;

  .json-editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #dcdfe6;

    .editor-title {
      font-weight: 500;
      color: #303133;
    }

    .editor-actions {
      display: flex;
      gap: 8px;
    }
  }

  .json-editor-footer {
    padding: 8px 15px;
    background-color: #f9f9f9;
    border-top: 1px solid #dcdfe6;
    font-size: 12px;

    .json-status {
      color: #67c23a;

      &.error {
        color: #f56c6c;
      }
    }
  }
}

:deep(.code-editor) {
  .cm-editor {
    border: none !important;
  }
}

:deep(.vxe-table) {
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

// 响应式设计
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;

    .el-button {
      margin: 5px 0;
    }
  }
}
</style>
