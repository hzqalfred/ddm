<template>
  <div class="column-items-editor">
    <el-button link type="primary" @click="showColumnEditor">
      编写校验规则
    </el-button>

    <!-- 表格列编辑器弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="校验规则配置编辑器"
      width="90%"
     
      :before-close="handleClose"
      append-to-body
      destroy-on-close
    >
      <div class="editor-container">
        <!-- 工具栏 -->
        <div class="toolbar">
          <el-button type="primary" @click="syncFromColumns"
            >从表格列同步</el-button
          >
          <el-button @click="clearRules">清空所有</el-button>
          <el-button @click="exportRules">导出配置</el-button>
        </div>

        <!-- 表格编辑器 -->
        <vxe-table
          ref="xTable"
          border
          resizable
          height="400px"
          show-overflow
          :data="columnData"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
          @cell-click="handleCellClick"
          :row-config="{ keyField: 'field' }"
        >
          <!-- 序号列 -->
          <vxe-column
            type="seq"
            width="60"
            title="序号"
            fixed="left"
          ></vxe-column>

          <!-- 字段名称 -->
          <vxe-column field="field" title="字段名称" width="140">
            <template #default="{ row }">
              <el-tooltip :content="row.title || row.field" placement="top">
                <span>{{ row.title || row.field }}</span>
              </el-tooltip>
            </template>
          </vxe-column>

          <!-- 是否校验-->
          <vxe-column field="isValidate" title="是否校验" width="100">
            <template #default="{ row }">
              <el-switch
                v-model="row.isValidate"
                @change="handleValidateChange(row)"
              />
            </template>
          </vxe-column>

          <!-- 是否必填-->
          <vxe-column field="required" title="是否必填" width="100">
            <template #default="{ row }">
              <el-switch v-model="row.required" :disabled="!row.isValidate" />
            </template>
          </vxe-column>

          <!-- 校验类型 -->
          <vxe-column field="validatorType" title="校验类型" width="150">
            <template #default="{ row }">
              <el-select
                v-model="row.validatorType"
                size="small"
                clearable
                :disabled="!row.isValidate"
                @change="handleValidatorTypeChange(row)"
              >
                <el-option label="无" value="" />
                <el-option label="数值校验" value="number" />
                <el-option label="字符串长度" value="length" />
                <el-option label="正则校验" value="pattern" />
                <!-- <el-option label="自定义校验" value="custom" /> -->
              </el-select>
            </template>
          </vxe-column>

          <!-- 校验参数 (根据校验类型动态显示不同的参数) -->
          <vxe-column field="validatorParams" title="校验参数" width="300">
            <template #default="{ row }">
              <!-- 数值校验参数 -->
              <template v-if="row.validatorType === 'number' && row.isValidate">
                <div class="validator-params">
                  <el-input-number
                    v-model="row.min"
                    placeholder="最小值"
                    size="small"
                    style="width: 130px;"
                  />
                  <span class="separator">至</span>
                  <el-input-number
                    v-model="row.max"
                    placeholder="最大值"
                    size="small"
                    style="width: 130px;"
                  />
                </div>
              </template>

              <!-- 字符串长度校验参数 -->
              <template
                v-else-if="row.validatorType === 'length' && row.isValidate"
              >
                <div class="validator-params">
                  <el-input-number
                    v-model="row.minLength"
                    placeholder="最小长度"
                    size="small"
                    style="width: 130px;"
                  />
                  <span class="separator">至</span>
                  <el-input-number
                    v-model="row.maxLength"
                    placeholder="最大长度"
                    size="small"
                    style="width: 130px;"
                  />
                </div>
              </template>

              <!-- 正则校验参数 -->
              <template
                v-else-if="row.validatorType === 'pattern' && row.isValidate"
              >
                <el-button type="text" @click="editPattern(row)">
                  {{ row.pattern ? "编辑正则" : "添加正则" }}
                </el-button>
              </template>

              <!-- 自定义校验 - 状态显示 -->
              <template
                v-else-if="row.validatorType === 'custom' && row.isValidate"
              >
                <span v-if="!row.validatorFn">未配置</span>
                <span v-else>已配置</span>
              </template>

              <template v-else>
                <span class="disabled-text">-</span>
              </template>
            </template>
          </vxe-column>

          <!-- 校验提示文字 -->
          <vxe-column
            field="message"
            title="校验提示文字"
            width="180"
            :edit-render="{}"
          >
            <template #edit="{ row }">
              <el-input
                v-model="row.message"
                :disabled="!row.isValidate || !row.validatorType"
              />
            </template>
            <template #default="{ row }">
              <span
                :class="{
                  'disabled-text': !row.isValidate || !row.validatorType,
                }"
              >
                {{ row.message || getDefaultMessage(row) }}
              </span>
            </template>
          </vxe-column>

          <!-- 自定义校验函数 -->
          <!-- <vxe-column field="validatorFn" title="自定义校验函数" width="150">
            <template #default="{ row }">
              <el-button
                type="text"
                @click="editValidatorFn(row)"
                :disabled="!row.isValidate || row.validatorType !== 'custom'"
              >
                {{ row.validatorFn ? "编辑" : "添加" }}
              </el-button>
            </template>
          </vxe-column> -->

          <!-- 操作列 -->
          <vxe-column title="操作" width="100" fixed="right">
            <template #default="{ row, $rowIndex }">
              <el-button link type="danger" @click="removeColumn($rowIndex)">
                删除
              </el-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRules">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 正则表达式编辑器 -->
    <el-dialog
      v-model="patternDialogVisible"
      title="编辑正则表达式"
      width="600px"
      append-to-body
    >
      <el-form label-width="100px">
        <el-form-item label="正则表达式">
          <el-input
            v-model="currentPattern"
            placeholder="请输入正则表达式，不需要包含//"
          />
        </el-form-item>
        <el-form-item label="常用正则">
          <el-select
            v-model="selectedPattern"
            placeholder="选择常用正则"
            @change="handlePatternSelect"
          >
            <el-option label="手机号码" value="^1[3-9]\d{9}$" />
            <el-option
              label="邮箱地址"
              value="^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$"
            />
            <el-option
              label="身份证号"
              value="^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$"
            />
            <el-option
              label="URL链接"
              value="^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$"
            />
            <el-option label="正整数" value="^[1-9]\d*$" />
            <el-option label="非负整数" value="^(0|[1-9]\d*)$" />
            <el-option label="小数" value="^-?\d+(\.\d+)?$" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="patternDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePattern">确定</el-button>
      </template>
    </el-dialog>

    <!-- 自定义校验函数编辑器 -->
    <el-dialog
      v-model="validatorFnDialogVisible"
      title="编辑自定义校验函数"
      width="700px"
      append-to-body
    >
      <div class="validator-fn-helper">
        <p>
          校验函数格式：({ cellValue, rule, rules, row, rowIndex, column,
          columnIndex }) => Error | Promise
        </p>
      </div>
      <code-editor
        v-model="currentValidatorFn"
        mode="javascript"
        :readonly="false"
        height="300px"
      />
      <template #footer>
        <el-button @click="validatorFnDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveValidatorFn">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import CodeEditor from "@/core/components/CodeEditor/index.vue";
import i18n from "@/core/i18nLang";

export default {
  name: "validRules-editor",
  mixins: [i18n],
  components: {
    CodeEditor,
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    name: String,
  },
  setup(props) {
    const dialogVisible = ref(false);
    const patternDialogVisible = ref(false);
    const validatorFnDialogVisible = ref(false);
    const columnData = ref([]);
    const hasUnsavedChanges = ref(false);
    const xTable = ref(null);

    // 正则表达式编辑相关
    const currentRow = ref(null);
    const currentPattern = ref("");
    const selectedPattern = ref("");

    // 自定义校验函数相关
    const currentValidatorFn = ref("");

    // 初始化列数据
    const initColumnData = () => {
      const columns = props.selectedWidget?.options?.columns || [];
      const validRules = props.selectedWidget?.options?.validRules || {};

      // 清空现有数据
      columnData.value = [];

      // 遍历columns，结合validRules生成校验规则数据
      columns.forEach((column) => {
        const [rule = {}] = validRules[column.field] || [];

        // 构建基础行数据
        const rowData = {
          field: column.field,
          title: column.title,
          isValidate:
            !!rule.required ||
            !!rule.validator ||
            !!rule.pattern ||
            !!rule.min ||
            !!rule.max ||
            !!rule.len,
          required: !!rule.required,
          message: rule.message || "",
          validatorType: getValidatorTypeFromRule(rule),
          validatorFn: rule.validator || "",
          pattern: rule.pattern || "",
          min: rule.min !== undefined ? rule.min : null,
          max: rule.max !== undefined ? rule.max : null,
          minLength:
            rule.min !== undefined && rule.type === "string" ? rule.min : null,
          maxLength:
            rule.max !== undefined && rule.type === "string" ? rule.max : null,
        };

        columnData.value.push(rowData);
      });

      hasUnsavedChanges.value = false;
    };

    // 从规则判断校验类型
    const getValidatorTypeFromRule = (rule) => {
      if (rule.validator) return "custom";
      if (rule.pattern) return "pattern";
      if (
        (rule.min !== undefined || rule.max !== undefined) &&
        rule.type === "number"
      )
        return "number";
      if (rule.type == "string") return "length";
      return "";
    };

    // 根据校验类型获取默认提示消息
    const getDefaultMessage = (row) => {
      if (!row.isValidate || !row.validatorType) return "-";

      const fieldName = row.title || row.field;

      switch (row.validatorType) {
        case "number":
          if (row.min !== null && row.max !== null) {
            return `${fieldName}必须在${row.min}至${row.max}之间`;
          } else if (row.min !== null) {
            return `${fieldName}不能小于${row.min}`;
          } else if (row.max !== null) {
            return `${fieldName}不能大于${row.max}`;
          }
          return `请输入有效的${fieldName}`;

        case "length":
          if (row.minLength !== null && row.maxLength !== null) {
            return `${fieldName}长度必须在${row.minLength}至${row.maxLength}个字符之间`;
          } else if (row.minLength !== null) {
            return `${fieldName}长度不能少于${row.minLength}个字符`;
          } else if (row.maxLength !== null) {
            return `${fieldName}长度不能超过${row.maxLength}个字符`;
          }
          return `请输入有效的${fieldName}`;

        case "pattern":
          return `请输入正确格式的${fieldName}`;

        case "custom":
          return `${fieldName}格式不正确`;

        default:
          return "-";
      }
    };

    // 显示列编辑器
    const showColumnEditor = () => {
      initColumnData();
      dialogVisible.value = true;
    };

    // 从表格列同步
    const syncFromColumns = () => {
      if (props.selectedWidget?.options?.columns) {
        // 获取当前已配置的规则
        const currentRules = {};
        columnData.value.forEach((row) => {
          if (row.isValidate) {
            currentRules[row.field] = row;
          }
        });

        // 清空现有数据
        columnData.value = [];

        // 从表格列重新生成
        props.selectedWidget.options.columns.forEach((column) => {
          const existingRule = currentRules[column.field];

          const rowData = {
            field: column.field,
            title: column.title,
            isValidate: existingRule ? existingRule.isValidate : false,
            required: existingRule ? existingRule.required : false,
            message: existingRule ? existingRule.message : "",
            validatorType: existingRule ? existingRule.validatorType : "",
            validatorFn: existingRule ? existingRule.validatorFn : "",
            pattern: existingRule ? existingRule.pattern : "",
            min: existingRule ? existingRule.min : null,
            max: existingRule ? existingRule.max : null,
            minLength: existingRule ? existingRule.minLength : null,
            maxLength: existingRule ? existingRule.maxLength : null,
          };

          columnData.value.push(rowData);
        });

        hasUnsavedChanges.value = true;
        ElMessage.success("已从表格列同步数据");
      } else {
        ElMessage.warning("表格列数据为空，无法同步");
      }
    };

    // 清空所有规则
    const clearRules = () => {
      ElMessageBox.confirm("确定要清空所有校验规则吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          columnData.value.forEach((row) => {
            row.isValidate = false;
            row.required = false;
            row.message = "";
            row.validatorType = "";
            row.validatorFn = "";
            row.pattern = "";
            row.min = null;
            row.max = null;
            row.minLength = null;
            row.maxLength = null;
          });

          hasUnsavedChanges.value = true;
          ElMessage.success("已清空所有校验规则");
        })
        .catch(() => {});
    };

    // 导出配置
    const exportRules = () => {
      // 构建校验规则对象
      const validRules = {};

      columnData.value.forEach((row) => {
        if (row.isValidate) {
          const rule = buildValidationRule(row);
          if (rule) {
            validRules[row.field] = [rule];
          }
        }
      });
      console.log(validRules);
    };

    // 构建校验规则对象
    const buildValidationRule = (row) => {
      if (!row.isValidate) return null;

      const rule = {};

      // 必填校验
      if (row.required) {
        rule.required = true;
      }

      // 根据校验类型设置不同规则
      switch (row.validatorType) {
        case "number":
          rule.type = "number";
          if (row.min !== null) rule.min = row.min;
          if (row.max !== null) rule.max = row.max;
          rule.message = row.message || getDefaultMessage(row);
          break;

        case "length":
          rule.type = "string";
          if (row.minLength !== null) rule.min = row.minLength;
          if (row.maxLength !== null) rule.max = row.maxLength;
          rule.message = row.message || getDefaultMessage(row);
          break;

        case "pattern":
          if (row.pattern) {
            rule.pattern = row.pattern;
            rule.message = row.message || getDefaultMessage(row);
          }
          break;

        case "custom":
          if (row.validatorFn) {
            try {
              rule.validator = row.validatorFn;
            } catch (e) {
              console.error("Invalid validator function:", e);
            }
          }
          break;
      }

      return rule;
    };

    // 删除列
    const removeColumn = (index) => {
      columnData.value.splice(index, 1);
      hasUnsavedChanges.value = true;
    };

    // 处理单元格点击事件
    const handleCellClick = ({ row, column }) => {
      hasUnsavedChanges.value = true;
    };

    // 处理是否校验变化
    const handleValidateChange = (row) => {
      if (!row.isValidate) {
        // 重置所有校验相关的字段
        row.required = false;
        row.validatorType = "";
        // 保留其他字段值，方便用户切换回来时恢复
      }
      hasUnsavedChanges.value = true;
    };

    // 处理校验类型变化
    const handleValidatorTypeChange = (row) => {
      // 根据校验类型重置相关字段
      switch (row.validatorType) {
        case "number":
          row.pattern = "";
          row.validatorFn = "";
          row.minLength = null;
          row.maxLength = null;
          break;

        case "length":
          row.pattern = "";
          row.validatorFn = "";
          row.min = null;
          row.max = null;
          break;

        case "pattern":
          row.validatorFn = "";
          row.min = null;
          row.max = null;
          row.minLength = null;
          row.maxLength = null;
          break;

        case "custom":
          row.pattern = "";
          row.min = null;
          row.max = null;
          row.minLength = null;
          row.maxLength = null;
          break;

        default:
          // 清空所有校验相关字段
          row.pattern = "";
          row.validatorFn = "";
          row.min = null;
          row.max = null;
          row.minLength = null;
          row.maxLength = null;
          break;
      }

      hasUnsavedChanges.value = true;
    };

    // 编辑正则表达式
    const editPattern = (row) => {
      currentRow.value = row;
      currentPattern.value = row.pattern || "";
      selectedPattern.value = "";
      patternDialogVisible.value = true;
    };

    // 处理正则表达式选择
    const handlePatternSelect = () => {
      if (selectedPattern.value) {
        currentPattern.value = selectedPattern.value;
      }
    };

    // 保存正则表达式
    const savePattern = () => {
      if (currentRow.value) {
        currentRow.value.pattern = currentPattern.value;
        hasUnsavedChanges.value = true;
      }
      patternDialogVisible.value = false;
    };

    // 编辑自定义校验函数
    const editValidatorFn = (row) => {
      currentRow.value = row;
      currentValidatorFn.value =
        row.validatorFn ||
        `function ({ cellValue, rule, rules, row, rowIndex, column, columnIndex }) {\n  // 编写校验逻辑\n  // 返回true表示校验通过，返回false或Error表示校验失败\n  return true;\n}`;
      validatorFnDialogVisible.value = true;
    };

    // 保存自定义校验函数
    const saveValidatorFn = () => {
      if (currentRow.value) {
        currentRow.value.validatorFn = new Function(
          `return (${currentValidatorFn.value})`
        )();
        hasUnsavedChanges.value = true;
      }
      validatorFnDialogVisible.value = false;
    };

    // 保存校验规则
    const saveRules = () => {
      // 构建校验规则对象
      const validRules = {};

      columnData.value.forEach((row) => {
        if (row.isValidate) {
          const rule = buildValidationRule(row);
          if (rule) {
            validRules[row.field] = [rule];
          }
        }
      });

      // 保存到 selectedWidget
      if (props.selectedWidget?.options) {
        props.selectedWidget.options.validRules = validRules;
        dialogVisible.value = false;
        hasUnsavedChanges.value = false;
        ElMessage.success("校验规则保存成功");
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

    return {
      dialogVisible,
      patternDialogVisible,
      validatorFnDialogVisible,
      columnData,
      currentRow,
      currentPattern,
      selectedPattern,
      currentValidatorFn,
      xTable,
      hasUnsavedChanges,

      showColumnEditor,
      syncFromColumns,
      clearRules,
      exportRules,
      removeColumn,
      handleCellClick,
      handleValidateChange,
      handleValidatorTypeChange,
      editPattern,
      handlePatternSelect,
      savePattern,
      editValidatorFn,
      saveValidatorFn,
      saveRules,
      handleClose,
      getDefaultMessage,
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
  margin-bottom: 10px;

  .el-button {
    margin-right: 10px;
  }
}

.dialog-footer {
  text-align: right;
}

.disabled-text {
  color: #c0c0c0;
}

.validator-params {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.separator {
  margin: 0 5px;
}

.validator-fn-helper {
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #606266;

  p {
    margin: 5px 0;
  }
}
</style>
