<template>
  <div class="operate-editor">
    <el-button link type="primary" @click="showOperateEditor">
      配置操作列
    </el-button>

    <!-- 操作列配置编辑器弹窗 -->
    <el-dialog
      v-model="state.dialogVisible"
      title="表格操作列配置"
      width="90%"
      :before-close="handleClose"
      destroy-on-close
    >
      <div class="editor-container">
        <!-- 操作按钮配置 -->
        <el-card
          shadow="never"
          class="operate-rules-card"
          v-if="state.globalConfig"
        >
          <template #header>
            <div class="card-header">
              <span>操作按钮配置</span>
              <div class="header-actions">
                <el-button
                  size="small"
                  type="primary"
                  @click="addOperateButton"
                >
                  添加按钮
                </el-button>
                <el-button size="small" @click="clearOperateButtons">
                  清空所有
                </el-button>
                <el-button size="small" @click="importTemplates">
                  模板导入
                </el-button>
              </div>
            </div>
          </template>

          <!-- 提示信息 -->
          <div class="tips" v-if="state.operateButtons.length === 0">
            <el-alert
              title="暂无操作按钮"
              description="添加操作按钮后，将在表格的操作列中显示这些按钮"
              type="info"
              :closable="false"
              show-icon
            />
          </div>

          <!-- 操作按钮表格 -->
          <vxe-table
            v-if="state.operateButtons.length > 0"
            ref="xTableRef"
            border
            height="200px"
            show-overflow
            :data="state.operateButtons"
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
                <span class="drag-handle" :data-index="$rowIndex">
                  <el-icon><Grid /></el-icon>
                </span>
              </template>
            </vxe-column>

            <!-- 按钮文本 -->
            <vxe-column
              field="label"
              title="按钮文本"
              width="120"
              :edit-render="{}"
            >
              <template #default="{ row }">
                <span :class="{ 'field-error': !row.label }">
                  {{ row.label || "" }}
                </span>
              </template>
              <template #edit="{ row }">
                <el-input
                  v-model="row.label"
                  placeholder="按钮文本"
                  @input="markAsChanged"
                  :class="{ 'field-error': !row.label }"
                />
              </template>
            </vxe-column>

            <!-- 按钮类型 -->
            <vxe-column
              field="type"
              title="按钮类型"
              width="120"
              :edit-render="{}"
            >
              <template #default="{ row }">
                <el-tag :type="getButtonTypeTag(row.type)">
                  {{ getButtonTypeLabel(row.type) }}
                </el-tag>
              </template>
              <template #edit="{ row }">
                <vxe-select
                  v-model="row.type"
                  @change="markAsChanged"
                  transfer
                  :popper-class="'operate-select-dropdown'"
                  style="width: 100%"
                >
                  <vxe-option label="默认" value="default" />
                  <vxe-option label="主要" value="primary" />
                  <vxe-option label="成功" value="success" />
                  <vxe-option label="警告" value="warning" />
                  <vxe-option label="危险" value="danger" />
                  <vxe-option label="信息" value="info" />
                </vxe-select>
              </template>
            </vxe-column>

            <!-- 按钮样式 -->
            <vxe-column
              field="mode"
              title="按钮样式"
              width="100"
              :edit-render="{}"
            >
              <template #default="{ row }">
                <el-tag
                  size="small"
                  :type="row.mode === 'text' ? 'info' : 'primary'"
                >
                  {{ row.mode === "text" ? "文本" : "按钮" }}
                </el-tag>
              </template>
              <template #edit="{ row }">
                <vxe-select
                  v-model="row.mode"
                  @change="markAsChanged"
                  transfer
                  :popper-class="'operate-select-dropdown'"
                  style="width: 100%"
                >
                  <vxe-option label="按钮" value="button" />
                  <vxe-option label="文本" value="text" />
                </vxe-select>
              </template>
            </vxe-column>

            <!-- 按钮尺寸 -->
            <vxe-column
              field="size"
              title="按钮尺寸"
              width="100"
              :edit-render="{}"
            >
              <template #default="{ row }">
                <el-tag size="small">
                  {{ getSizeLabel(row.size) }}
                </el-tag>
              </template>
              <template #edit="{ row }">
                <vxe-select
                  v-model="row.size"
                  @change="markAsChanged"
                  transfer
                  :popper-class="'operate-select-dropdown'"
                  style="width: 100%"
                >
                  <vxe-option label="大" value="large" />
                  <vxe-option label="默认" value="default" />
                  <vxe-option label="小" value="small" />
                </vxe-select>
              </template>
            </vxe-column>

            <!-- 图标 -->
            <vxe-column field="icon" title="图标" width="120" :edit-render="{}">
              <template #default="{ row }">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <el-icon
                    v-if="row.icon"
                    :class="row.icon"
                    style="font-size: 16px;"
                  />
                  <span>{{ row.icon || "无" }}</span>
                </div>
              </template>
              <template #edit="{ row }">
                <el-input
                  v-model="row.icon"
                  placeholder="图标类名"
                  @input="markAsChanged"
                />
              </template>
            </vxe-column>

            <!-- 点击事件 -->
            <vxe-column
              field="onClick"
              title="点击事件"
              width="150"
              :edit-render="{}"
            >
              <template #default="{ row }">
                <span style="color: #409eff; font-family: monospace;">
                  {{ row.onClick || "未设置" }}
                </span>
              </template>
              <template #edit="{ row }">
                <el-input
                  v-model="row.onClick"
                  placeholder="函数名或方法名"
                  @input="markAsChanged"
                />
              </template>
            </vxe-column>

            <!-- 自定义属性 -->
            <vxe-column title="自定义属性" width="120">
              <template #default="{ row }">
                <el-button
                  type="text"
                  @click="editCustomProps(row)"
                  size="small"
                >
                  {{
                    row.customProps && Object.keys(row.customProps).length > 0
                      ? "修改属性"
                      : "设置属性"
                  }}
                </el-button>
              </template>
            </vxe-column>

            <!-- 是否启用 -->
            <vxe-column field="enabled" title="是否启用" width="100">
              <template #default="{ row }">
                <vxe-switch v-model="row.enabled" @change="markAsChanged" />
              </template>
            </vxe-column>
            <!-- 显示条件 -->
            <vxe-column field="showCondition" title="显示条件" width="150">
              <template #default="{ row }">
                <span style="color: #409eff; font-family: monospace;">
                  <el-button type="text" @click="editShowCondition(row)">{{
                    row.showCondition || "总是显示"
                  }}</el-button>
                </span>
              </template>
            </vxe-column>
            <!-- 操作列 -->
            <vxe-column title="操作" width="180" fixed="right">
              <template #default="{ row, $rowIndex }">
                <div class="actions-container">
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
                    :disabled="$rowIndex === state.operateButtons.length - 1"
                  >
                    下移
                  </el-button>
                  <el-button
                    link
                    type="info"
                    size="small"
                    @click="copyButton(row)"
                  >
                    复制
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    size="small"
                    @click="removeButton(row)"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </vxe-column>
          </vxe-table>
        </el-card>

        <!-- 配置预览 -->
        <el-card shadow="never" class="preview-card">
          <template #header>
            <div class="card-header">
              <span>配置预览</span>
              <div class="header-actions">
                <el-button size="small" @click="previewTable">
                  预览效果
                </el-button>
                <el-button size="small" @click="exportConfig">
                  复制配置
                </el-button>
              </div>
            </div>
          </template>
          <div class="config-preview-container">
            <div class="config-section">
              <h4>operate 配置：</h4>
              <pre class="config-preview">{{ previewOperateConfig }}</pre>
            </div>
          </div>
        </el-card>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOperateConfig"
            >保存配置</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 自定义属性编辑对话框 -->
    <el-dialog
      v-model="state.customPropsVisible"
      title="自定义属性配置"
      width="600px"
      append-to-body
    >
      <div v-if="state.currentButton">
        <div class="editor-info">
          <p>
            编辑
            <strong>{{ state.currentButton.label }}</strong> 按钮的自定义属性
          </p>
        </div>
        <code-editor
          ref="customPropsEditorRef"
          v-model="state.currentCustomPropsJson"
          mode="json"
          :readonly="false"
          height="300px"
        />
        <div class="props-tips">
          <el-alert
            title="提示"
            description="可以设置按钮的其他属性，如 disabled、loading、round、circle 等"
            type="info"
            :closable="false"
            show-icon
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="state.customPropsVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCustomProps">确定</el-button>
      </template>
    </el-dialog>

    <!-- 模板导入对话框 -->
    <el-dialog
      v-model="state.templateDialogVisible"
      title="选择按钮模板"
      width="700px"
      append-to-body
    >
      <div class="template-container">
        <el-row :gutter="16">
          <el-col
            :span="8"
            v-for="template in buttonTemplates"
            :key="template.id"
          >
            <el-card
              shadow="hover"
              class="template-card"
              :class="{
                selected: state.selectedTemplates.includes(template.id),
              }"
              @click="toggleTemplate(template.id)"
            >
              <div class="template-header">
                <h4>{{ template.name }}</h4>
                <el-tag size="small">{{ template.category }}</el-tag>
              </div>
              <div class="template-preview">
                <el-button
                  v-for="btn in template.buttons"
                  :key="btn.label"
                  :type="btn.type"
                  :size="btn.size"
                  style="margin: 2px;"
                >
                  {{ btn.label }}
                </el-button>
              </div>
              <div class="template-description">
                {{ template.description }}
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button @click="state.templateDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmImportTemplates"
          :disabled="state.selectedTemplates.length === 0"
        >
          导入选中模板 ({{ state.selectedTemplates.length }})
        </el-button>
      </template>
    </el-dialog>

    <!-- 预览效果对话框 -->
    <el-dialog
      v-model="state.previewVisible"
      title="操作列预览效果"
      width="800px"
      append-to-body
    >
      <div class="preview-table-container">
        <vxe-table border :data="previewData" height="300">
          <vxe-column field="id" title="ID" width="80" />
          <vxe-column field="name" title="姓名" width="120" />
          <vxe-column field="status" title="状态" width="100" />

          <!-- 预览操作列 -->
          <vxe-column
            :title="state.globalConfig.title"
            :width="state.globalConfig.width"
            :fixed="state.globalConfig.fixed"
          >
            <template #default="{ row }">
              <vxe-button-group>
                <vxe-button
                  v-for="btn in enabledButtons"
                  :key="btn.id"
                  :mode="btn.mode"
                  :status="btn.type"
                  :size="btn.size"
                  style="margin-right: 4px;"
                >
                  {{ btn.label }}
                </vxe-button>
              </vxe-button-group>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </el-dialog>

    <el-dialog
      v-model="state.conditionVisible"
      title="按钮显示条件"
      width="600px"
      append-to-body
    >
      <div>
        <div class="editor-info">
          <el-alert
            title="条件表达式说明"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <div>
                <p>
                  • 使用 <code>row</code> 访问行数据，如：<code
                    >row.status === 1</code
                  >
                </p>
                <p>• 支持 JavaScript 表达式</p>
                <p>
                  • 返回 <code>true</code> 显示按钮，<code>false</code> 隐藏按钮
                </p>
                <p>• 留空则总是显示</p>
              </div>
            </template>
          </el-alert>
        </div>

        <div class="condition-editor">
          <el-input
            type="textarea"
            v-model="state.currentCondition"
            :rows="4"
            placeholder="请输入显示条件，如：row.status === 1"
          />
        </div>
      </div>

      <template #footer>
        <el-button @click="state.conditionVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCondition">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, nextTick, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Grid } from "@element-plus/icons-vue";
import Sortable from "sortablejs";
import CodeEditor from "@/core/components/CodeEditor/index.vue";
import i18n from "@/core/i18nLang";

export default {
  name: "operate-editor",
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
    // 统一状态管理
    const state = reactive({
      conditionVisible: false,
      currentCondition: "",
      dialogVisible: false,
      hasUnsavedChanges: false,

      // 全局配置
      globalConfig: {
        enabled: true,
        title: "操作",
        width: 200,
        fixed: "right",
      },

      // 操作按钮配置
      operateButtons: [],

      // 自定义属性编辑
      customPropsVisible: false,
      currentCustomPropsJson: "",
      currentButton: null,

      // 模板导入
      templateDialogVisible: false,
      selectedTemplates: [],

      // 预览
      previewVisible: false,

      // 验证状态
      fieldErrors: new Set(),
    });

    // 引用
    const xTableRef = ref(null);
    const customPropsEditorRef = ref(null);

    // ID生成器
    let idCounter = 1;
    const generateId = () => {
      const timestamp = Date.now();
      const random = Math.random()
        .toString(36)
        .substr(2, 9);
      return `btn_${timestamp}_${idCounter++}_${random}`;
    };

    // 创建操作按钮的工厂函数
    const createOperateButton = (config = {}) => {
      return {
        id: generateId(),
        label: "操作",
        type: "primary",
        mode: "text",
        size: "small",
        icon: "",
        onClick: "",
        showCondition: "",
        permission: "",
        customProps: {},
        enabled: true,
        ...config,
      };
    };

    // 按钮模板
    const buttonTemplates = [
      {
        id: "crud",
        name: "CRUD操作",
        category: "常用",
        description: "增删改查基础操作按钮",
        buttons: [
          {
            label: "查看",
            type: "info",
            size: "small",
            onClick: "handleView",
            showCondition: "",
          },
          {
            label: "编辑",
            type: "primary",
            size: "small",
            onClick: "handleEdit",
            showCondition: "",
          },
          {
            label: "删除",
            type: "danger",
            size: "small",
            onClick: "handleDelete",
            showCondition: "",
          },
        ],
      },
      {
        id: "approval",
        name: "审批操作",
        category: "审批",
        description: "审批流程相关操作按钮",
        buttons: [
          {
            label: "通过",
            type: "success",
            size: "small",
            onClick: "handleApprove",
            showCondition: "",
          },
          {
            label: "驳回",
            type: "warning",
            size: "small",
            onClick: "handleReject",
            showCondition: "",
          },
          {
            label: "转派",
            type: "info",
            size: "small",
            onClick: "handleTransfer",
            showCondition: "",
          },
        ],
      },
      {
        id: "status",
        name: "状态操作",
        category: "状态",
        description: "状态变更相关操作按钮",
        buttons: [
          {
            label: "启用",
            type: "success",
            size: "small",
            onClick: "handleEnable",
            showCondition: "",
          },
          {
            label: "禁用",
            type: "warning",
            size: "small",
            onClick: "handleDisable",
            showCondition: "",
          },
          {
            label: "重置",
            type: "info",
            size: "small",
            onClick: "handleReset",
            showCondition: "",
          },
        ],
      },
      {
        id: "file",
        name: "文件操作",
        category: "文件",
        description: "文件相关操作按钮",
        buttons: [
          {
            label: "下载",
            type: "primary",
            size: "small",
            onClick: "handleDownload",
            showCondition: "",
            icon: "Download",
          },
          {
            label: "预览",
            type: "info",
            size: "small",
            onClick: "handlePreview",
            showCondition: "",
            icon: "View",
          },
          {
            label: "分享",
            type: "success",
            size: "small",
            onClick: "handleShare",
            showCondition: "",
            icon: "Share",
          },
        ],
      },
    ];

    // 预览数据
    const previewData = [
      { id: 1, name: "张三", status: "正常" },
      { id: 2, name: "李四", status: "禁用" },
      { id: 3, name: "王五", status: "待审核" },
    ];

    // 启用的按钮
    const enabledButtons = computed(() => {
      return state.operateButtons.filter((btn) => btn.enabled);
    });

    // 配置预览

    // 获取按钮类型标签
    const getButtonTypeTag = (type) => {
      const typeMap = {
        default: "",
        primary: "primary",
        success: "success",
        warning: "warning",
        danger: "danger",
        info: "info",
      };
      return typeMap[type] || "";
    };

    // 获取按钮类型标签
    const getButtonTypeLabel = (type) => {
      const typeMap = {
        default: "默认",
        primary: "主要",
        success: "成功",
        warning: "警告",
        danger: "危险",
        info: "信息",
      };
      return typeMap[type] || "默认";
    };

    // 获取尺寸标签
    const getSizeLabel = (size) => {
      const sizeMap = {
        large: "大",
        default: "默认",
        small: "小",
      };
      return sizeMap[size] || "默认";
    };

    // 标记为已修改
    const markAsChanged = () => {
      state.hasUnsavedChanges = true;
    };

    // 处理选择器可见性变化
    const handleSelectVisibleChange = (visible) => {
      if (visible) {
        nextTick(() => {
          const dropdown = document.querySelector(".operate-select-dropdown");
          if (dropdown) {
            dropdown.style.zIndex = "9999";
          }
        });
      }
    };

    // 初始化操作数据
    const initOperateData = () => {
      try {
        // 清空现有数据和错误状态
        state.operateButtons.splice(0, state.operateButtons.length);
        state.fieldErrors.clear();

        const options = props.selectedWidget?.options || {};

        // 初始化全局配置
        state.globalConfig = {
          enabled: Array.isArray(options.operate) && options.operate.length > 0,
          title: "操作",
          width: 200,
          fixed: "right",
        };

        // 初始化操作按钮
        if (options.operate && Array.isArray(options.operate)) {
          options.operate.forEach((btn, index) => {
            const operateBtn = createOperateButton({
              label: btn.label || `按钮${index + 1}`,
              type: btn.type || "primary",
              mode: btn.mode || "text",
              size: btn.size || "small",
              icon: btn.icon || "",
              onClick: btn.onClick || "",
              customProps: btn.customProps || {},
              showCondition: btn.showCondition || "",
              enabled: true,
            });
            state.operateButtons.push(operateBtn);
          });
        }

        state.hasUnsavedChanges = false;
      } catch (error) {
        console.error("初始化操作数据时出错:", error);
        ElMessage.error("初始化失败，请检查数据格式");
      }
    };

    // 显示编辑器
    const showOperateEditor = async () => {
      initOperateData();
      state.dialogVisible = true;
      await nextTick();
      setTimeout(() => {
        initSortable();
      }, 300);
    };

    // 初始化拖拽排序
    const initSortable = () => {
      const xTableEl = xTableRef.value?.$el;
      const tableBody = xTableEl?.querySelector(".vxe-table--body tbody");

      if (tableBody) {
        new Sortable(tableBody, {
          handle: ".drag-handle",
          animation: 150,
          forceFallback: true,
          fallbackOnBody: true,
          onEnd: ({ oldIndex, newIndex }) => {
            // 修复拖拽逻辑
            if (oldIndex !== newIndex) {
              const movedItem = state.operateButtons.splice(oldIndex, 1)[0];
              state.operateButtons.splice(newIndex, 0, movedItem);
              markAsChanged();
            }
          },
        });
      }
    };

    // 添加操作按钮
    const addOperateButton = () => {
      const newButton = createOperateButton({
        label: `按钮${state.operateButtons.length + 1}`,
        type: "primary",
        mode: "text",
        size: "small",
        onClick: `handleButton${state.operateButtons.length + 1}`,
        showCondition: "",
      });

      state.operateButtons.push(newButton);
      markAsChanged();
    };

    // 移除操作按钮
    const removeButton = async (row) => {
      if (!row) return;

      try {
        await ElMessageBox.confirm(
          `确定要删除操作按钮 "${row.label}" 吗？`,
          "确认删除",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        const index = state.operateButtons.findIndex(
          (item) => item.id === row.id
        );
        if (index !== -1) {
          state.operateButtons.splice(index, 1);
          state.fieldErrors.delete(row.id);
          markAsChanged();
          ElMessage.success("删除成功");
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("删除操作按钮时出错:", error);
          ElMessage.error("删除失败，请重试");
        }
      }
    };

    // 复制按钮
    const copyButton = (row) => {
      if (!row) return;

      const newButton = createOperateButton({
        ...row,
        label: row.label + "_副本",
        onClick: row.onClick + "_copy",
      });

      // 在当前按钮后面插入
      const index = state.operateButtons.findIndex(
        (item) => item.id === row.id
      );
      state.operateButtons.splice(index + 1, 0, newButton);
      markAsChanged();
      ElMessage.success("复制成功");
    };

    // 上移下移操作
    const moveUp = (index) => {
      if (index <= 0) return;
      const temp = state.operateButtons[index];
      state.operateButtons[index] = state.operateButtons[index - 1];
      state.operateButtons[index - 1] = temp;
      markAsChanged();
    };

    const moveDown = (index) => {
      if (index >= state.operateButtons.length - 1) return;
      const temp = state.operateButtons[index];
      state.operateButtons[index] = state.operateButtons[index + 1];
      state.operateButtons[index + 1] = temp;
      markAsChanged();
    };

    // 清空所有按钮
    const clearOperateButtons = async () => {
      try {
        await ElMessageBox.confirm("确定要清空所有操作按钮吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        state.operateButtons.splice(0, state.operateButtons.length);
        state.fieldErrors.clear();
        markAsChanged();
        ElMessage.success("已清空所有操作按钮");
      } catch (error) {
        // 用户取消操作
      }
    };

    // 编辑自定义属性
    const editCustomProps = async (row) => {
      if (!row) return;

      state.currentButton = row;
      if (!row.customProps) {
        row.customProps = {};
      }

      state.currentCustomPropsJson = JSON.stringify(row.customProps, null, 2);
      state.customPropsVisible = true;

      await nextTick();
      if (customPropsEditorRef.value) {
        customPropsEditorRef.value.setValue(state.currentCustomPropsJson);
      }
    };

    // 保存自定义属性
    const saveCustomProps = () => {
      if (!state.currentButton) return;

      try {
        const parsedProps = JSON.parse(state.currentCustomPropsJson);
        state.currentButton.customProps = parsedProps;
        markAsChanged();
        state.customPropsVisible = false;
        ElMessage.success("自定义属性保存成功");
      } catch (error) {
        ElMessage.error("JSON格式错误: " + error.message);
      }
    };

    // 模板导入
    const importTemplates = () => {
      state.selectedTemplates = [];
      state.templateDialogVisible = true;
    };

    // 切换模板选择
    const toggleTemplate = (templateId) => {
      const index = state.selectedTemplates.indexOf(templateId);
      if (index > -1) {
        state.selectedTemplates.splice(index, 1);
      } else {
        state.selectedTemplates.push(templateId);
      }
    };

    // 确认导入模板
    const confirmImportTemplates = () => {
      if (state.selectedTemplates.length === 0) {
        ElMessage.warning("请选择要导入的模板");
        return;
      }

      let importCount = 0;

      state.selectedTemplates.forEach((templateId) => {
        const template = buttonTemplates.find((t) => t.id === templateId);
        if (template) {
          template.buttons.forEach((btnConfig) => {
            const newButton = createOperateButton({
              label: btnConfig.label,
              type: btnConfig.type,
              size: btnConfig.size,
              onClick: btnConfig.onClick,
              showCondition: btnConfig.showCondition || "",
              icon: btnConfig.icon || "",
              mode: "text",
            });
            state.operateButtons.push(newButton);
            importCount++;
          });
        }
      });

      if (importCount > 0) {
        markAsChanged();
        ElMessage.success(`成功导入 ${importCount} 个按钮`);
      }

      state.templateDialogVisible = false;
    };

    // 预览表格
    const previewTable = () => {
      if (enabledButtons.value.length === 0) {
        ElMessage.warning("请先配置操作按钮");
        return;
      }
      state.previewVisible = true;
    };

    // 导出配置
    const exportConfig = async () => {
      try {
        const config = {
          operate:
            enabledButtons.value.length > 0
              ? JSON.parse(previewOperateConfig.value)
              : [],
          operateColumn: {
            title: state.globalConfig.title,
            width: state.globalConfig.width,
            fixed: state.globalConfig.fixed,
          },
        };

        const configStr = JSON.stringify(config, null, 2);
        await navigator.clipboard.writeText(configStr);
        ElMessage.success("配置已复制到剪贴板");
      } catch (error) {
        console.error("导出配置时出错:", error);

        const config = {
          operate:
            enabledButtons.value.length > 0
              ? JSON.parse(previewOperateConfig.value)
              : [],
          operateColumn: {
            title: state.globalConfig.title,
            width: state.globalConfig.width,
            fixed: state.globalConfig.fixed,
          },
        };
        const configStr = JSON.stringify(config, null, 2);
        console.log("操作列配置:", configStr);
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

      // 验证按钮标签
      const emptyLabels = state.operateButtons.filter(
        (btn) => btn.enabled && !btn.label?.trim()
      );
      if (emptyLabels.length > 0) {
        errors.push("启用的按钮必须设置标签文本");
      }

      // 验证点击事件
      const emptyOnClick = state.operateButtons.filter(
        (btn) => btn.enabled && !btn.onClick?.trim()
      );
      if (emptyOnClick.length > 0) {
        errors.push("启用的按钮建议设置点击事件");
      }

      return errors;
    };

    // 保存配置
    const saveOperateConfig = async () => {
      try {
        // 验证数据
        const errors = validateAllData();
        if (errors.length > 0) {
          const result = await ElMessageBox.confirm(
            errors.join("\n") + "\n\n是否仍要保存？",
            "配置警告",
            {
              confirmButtonText: "仍要保存",
              cancelButtonText: "取消",
              type: "warning",
            }
          );
          if (!result) return;
        }

        if (!props.selectedWidget?.options) {
          ElMessage.error("无法保存：选中的组件无效");
          return;
        }

        const options = props.selectedWidget.options;

        // 保存操作列配置
        if (enabledButtons.value.length > 0) {
          const operate = enabledButtons.value.map((btn) => {
            const config = {
              label: btn.label,
              type: btn.type,
              mode: btn.mode,
              size: btn.size,
              onClick: btn.onClick,
              showCondition: btn.showCondition || "",
            };

            if (btn.icon) config.icon = btn.icon;
            if (btn.customProps && Object.keys(btn.customProps).length > 0) {
              Object.assign(config, btn.customProps);
            }

            return config;
          });

          options.operate = operate;
        } else {
          options.operate = [];
        }

        // 保存操作列的全局配置（可选，用于扩展）
        options.operateColumn = {
          title: state.globalConfig.title,
          width: state.globalConfig.width,
          fixed: state.globalConfig.fixed,
        };

        await nextTick();

        state.hasUnsavedChanges = false;
        state.dialogVisible = false;
        ElMessage.success("保存成功");
      } catch (error) {
        console.error("保存操作配置时出错:", error);
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

    // 编辑显示条件（可选，为了更好的用户体验）
    const editShowCondition = async (row) => {
      if (!row) return;

      state.currentButton = row;
      state.currentCondition = row.showCondition || "";
      state.conditionVisible = true;
    };

    // 保存显示条件
    const saveCondition = () => {
      if (!state.currentButton) return;

      // 简单的语法检查
      if (state.currentCondition) {
        try {
          // 创建一个测试函数来验证语法
          new Function("row", `return ${state.currentCondition}`);
        } catch (error) {
          ElMessage.error("条件表达式语法错误: " + error.message);
          return;
        }
      }

      state.currentButton.showCondition = state.currentCondition;
      markAsChanged();
      state.conditionVisible = false;
      ElMessage.success("显示条件保存成功");
    };

    // 在配置预览中包含显示条件
    const previewOperateConfig = computed(() => {
      if (enabledButtons.value.length === 0) {
        return "[]";
      }

      const buttons = enabledButtons.value.map((btn) => {
        const config = {
          label: btn.label,
          type: btn.type,
          mode: btn.mode,
          size: btn.size,
          onClick: btn.onClick,
          showCondition: btn.showCondition || "",
        };

        if (btn.icon) config.icon = btn.icon;
        if (btn.showCondition) config.showCondition = btn.showCondition;
        if (btn.customProps && Object.keys(btn.customProps).length > 0) {
          config.customProps = btn.customProps;
        }

        return config;
      });

      return JSON.stringify(buttons, null, 2);
    });

    // 组件卸载时清理
    onUnmounted(() => {
      // 清理工作
    });

    return {
      // 状态
      state,

      // 引用
      xTableRef,
      customPropsEditorRef,

      // 计算属性
      enabledButtons,
      previewOperateConfig,
      previewData,

      // 数据
      buttonTemplates,

      // 方法
      showOperateEditor,
      addOperateButton,
      removeButton,
      copyButton,
      moveUp,
      moveDown,
      clearOperateButtons,
      editCustomProps,
      saveCustomProps,
      importTemplates,
      toggleTemplate,
      confirmImportTemplates,
      previewTable,
      exportConfig,
      getButtonTypeTag,
      getButtonTypeLabel,
      getSizeLabel,
      markAsChanged,
      handleCellClick,
      handleSelectVisibleChange,
      saveOperateConfig,
      handleClose,

      editShowCondition,
      saveCondition,
    };
  },
};
</script>

<style lang="scss" scoped>
.operate-editor {
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
.operate-rules-card,
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
  height: 170px;
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 12px;
  margin: 0;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
  line-height: 1.4;
  color: #2c3e50;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
  border: 1px solid #e4e7ed;
}

.drag-handle {
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

.props-tips {
  margin-top: 16px;
}

.template-container {
  .template-card {
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 16px;

    &:hover {
      border-color: #409eff;
    }

    &.selected {
      border-color: #409eff;
      box-shadow: 0 0 8px rgba(64, 158, 255, 0.3);
    }

    .template-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      h4 {
        margin: 0;
        font-size: 14px;
        color: #303133;
      }
    }

    .template-preview {
      margin-bottom: 12px;
      padding: 8px;
      background-color: #fafbfc;
      border-radius: 4px;
      min-height: 40px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    .template-description {
      font-size: 12px;
      color: #909399;
      line-height: 1.4;
    }
  }
}

.preview-table-container {
  .vxe-button-group {
    .vxe-button {
      margin-right: 4px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
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
:global(.operate-select-dropdown) {
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

  .template-container {
    .el-col {
      margin-bottom: 16px;
    }
  }
}
</style>
