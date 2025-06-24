<template>
  <div style="padding:0 20px;">
    <!-- 功能基础信息区域 -->
    <vxe-tip status="primary">功能基础信息</vxe-tip>
    <vxe-button size="mini" status="success" v-debounce="saveInfo">
      保存
    </vxe-button>
    <div style="margin: 10px 0;">
      <vxe-form ref="formRef" :data="formData" :rules="formRules">
        <vxe-form-item title="功能名称" field="functionName" span="6">
          <el-input v-model="formData.functionName" />
        </vxe-form-item>
        <vxe-form-item title="功能编码" field="functionCode" span="6">
          <el-input v-model="formData.functionCode" />
        </vxe-form-item>
        <vxe-form-item title="选用模版" field="functionType" span="6">
          <el-select v-model="formData.functionType">
            <el-option label="表单" value="form" />
            <el-option label="表格" value="grid" />
            <el-option label="表格[含表单]" value="grid-form" />
            <el-option label="树表" value="tree-grid" />
            <el-option label="树表单" value="tree-grid-form" />
          </el-select>
        </vxe-form-item>
        <vxe-form-item title="是否菜单" field="menuFunction" span="6">
          <el-switch v-model="formData.menuFunction" />
        </vxe-form-item>
        <vxe-form-item title="是否树表" field="tree" span="6">
          <el-switch v-model="formData.tree" />
        </vxe-form-item>
        <vxe-form-item title="排序" field="orderIndex" span="6">
          <el-input v-model="formData.orderIndex" />
        </vxe-form-item>
        <vxe-form-item title="表单默认列数" field="formColumnNums" span="6">
          <el-input v-model="formData.formColumnNums" />
        </vxe-form-item>
        <vxe-form-item title="主表" field="tableName" span="6">
          <el-input v-model="formData.tableName" />
        </vxe-form-item>
        <vxe-form-item title="数据对象绑定" field="modelCode" span="16">
          <el-input v-model="formData.modelSql" />
        </vxe-form-item>
        <vxe-form-item span="2">
          <template #default>
            <vxe-button
              size="mini"
              status="primary"
              content="一键解析"
              @click="sqlAnalysis"
            />
          </template>
        </vxe-form-item>
      </vxe-form>
    </div>

    <!-- 功能配置 -->
    <div style="margin-top: 20px;">
      <vxe-tip status="primary">功能配置</vxe-tip>
      <div style="margin: 10px 0;">
        <vxe-button
          size="mini"
          status="primary"
          icon="vxe-icon-add"
          @click="addMethodRow"
        >
          新增
        </vxe-button>
      </div>
      <vxe-table
        stripe
        border
        :data="methodList"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        ref="tableRef"
      >
        <vxe-column
          field="orderIndex"
          title="序号"
          width="110"
          sortable
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.orderIndex" />
          </template>
        </vxe-column>
        <vxe-column field="methodName" title="功能" :edit-render="{}">
          <template #default="{ row }">
            <span>{{ row.methodName }}</span>
          </template>
          <template #edit="{ row }">
            <vxe-select
              v-model="row.methodName"
              size="small"
              clearable
              @change="(val) => attrSelect(row, val.value)"
            >
              <vxe-option label="查询" value="查询" />
              <vxe-option label="保存" value="保存" />
              <vxe-option label="删除" value="删除" />
              <vxe-option label="树形" value="树形" />
              <vxe-option label="附件" value="附件" />
              <vxe-option label="其他" value="其他" />
            </vxe-select>
          </template>
        </vxe-column>
        <vxe-column field="methodCode" title="配置项" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.methodCode" />
          </template>
        </vxe-column>
        <vxe-column field="methodAttribute" title="属性" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.methodAttribute" />
          </template>
        </vxe-column>
        <vxe-column field="methodDescription" title="说明" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.methodDescription" />
          </template>
        </vxe-column>
        <vxe-column fixed="right" align="center" width="200" title="操作">
          <template #default="{ $rowIndex }">
            <vxe-button
              mode="text"
              status="error"
              @click="deleteMethodRow($rowIndex)"
            >
              删除
            </vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <!-- 功能字段明细 -->
    <div style="margin: 20px 0;">
      <vxe-tip status="primary">功能字段明细</vxe-tip>
      <div style="margin: 10px 0;">
        <vxe-button
          size="mini"
          status="primary"
          icon="vxe-icon-add"
          @click="addColumnRow"
        >
          新增
        </vxe-button>
      </div>

      <vxe-table
        border
        stripe
        :data="computedColumnList"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        ref="columnTableRef"
      >
        <vxe-column
          field="orderIndex"
          title="排序"
          width="80"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.orderIndex" type="number" />
          </template>
        </vxe-column>
        <vxe-column
          field="columnCode"
          title="字段编码"
          width="120"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.columnCode" />
          </template>
        </vxe-column>
        <vxe-column
          field="columnName"
          title="字段名称"
          width="120"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.columnName" />
          </template>
        </vxe-column>
        <vxe-column
          field="columnWidth"
          title="列宽"
          width="100"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.columnWidth" />
          </template>
        </vxe-column>
        <vxe-column
          field="componentName"
          title="组件"
          width="200"
          :edit-render="{}"
        >
          <template #default="{ row }">
            <span>{{ row.componentName }}</span>
          </template>
          <template #edit="{ row }">
            <vxe-select
              clearable
              v-model="row.componentName"
              size="small"
              @clear="onComponentClear(row)"
            >
              <vxe-option label="VxeInput" value="VxeInput" />
              <vxe-option label="VxeSelect" value="VxeSelect" />
              <vxe-option label="VxeSwitch" value="VxeSwitch" />
              <vxe-option label="VxeDatePicker" value="VxeDatePicker" />
              <vxe-option label="VxeNumberInput" value="VxeNumberInput" />
            </vxe-select>
          </template>
        </vxe-column>
        <vxe-column
          field="defaultValue"
          title="默认值"
          width="100"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.defaultValue" />
          </template>
        </vxe-column>
        <vxe-column field="formatter" title="格式化" width="120">
          <template #default="{ row }">
            <vxe-select
              clearable
              allow-create
              v-model="row.formatter"
              size="small"
              :options="formatOptions"
            >
            </vxe-select>
          </template>
        </vxe-column>
        <vxe-column
          v-if="isQueryColumn"
          field="gridColumn"
          title="显示"
          width="100"
        >
          <template #default="{ row }">
            <vxe-switch size="mini" v-model="row.gridColumn" />
          </template>
        </vxe-column>
        <vxe-column
          v-if="isSaveColumn"
          field="modifyEdit"
          title="编辑"
          width="120"
        >
          <template #default="{ row }">
            <vxe-switch size="mini" v-model="row.modifyEdit" />
          </template>
        </vxe-column>
        <vxe-column field="privilegeColumn" title="权限字段" width="100">
          <template #default="{ row }">
            <vxe-switch size="mini" v-model="row.privilegeColumn" />
          </template>
        </vxe-column>
        <vxe-column
          v-if="isQueryColumn"
          field="queryColumn"
          title="查询字段"
          width="120"
        >
          <template #default="{ row }">
            <vxe-switch size="mini" v-model="row.queryColumn" />
          </template>
        </vxe-column>
        <vxe-column field="fixedColumn" title="固定列" width="120">
          <template #default="{ row }">
            <vxe-switch size="mini" v-model="row.fixedColumn" />
          </template>
        </vxe-column>
        <vxe-column
          field="formGroupName"
          title="分组"
          width="80"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.formGroupName" />
          </template>
        </vxe-column>
        <vxe-column
          field="align"
          title="对齐方式"
          width="180"
          :edit-render="{}"
        >
          <template #default="{ row }">
            <span>{{ row.align }}</span>
          </template>
          <template #edit="{ row }">
            <vxe-select v-model="row.align" size="small">
              <vxe-option label="左对齐" value="left" />
              <vxe-option label="居中" value="center" />
              <vxe-option label="右对齐" value="right" />
            </vxe-select>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="120" fixed="right">
          <template #default="{$rowIndex }">
            <vxe-button
              mode="text"
              status="error"
              @click="deleteColumnRow($rowIndex)"
            >
              删除
            </vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <!-- 完成按钮 -->
    <div style="text-align: center; margin: 20px;">
      <vxe-button
        type="submit"
        status="primary"
        content="功能生成"
        @click="generateComplete"
      />
    </div>
  </div>
</template>

<script>
import {
  parseModelSql,
  splitFunction,
  saveBaseInfo,
} from "@/api/functionGenerator";
import messageHandler from "@/core/Message";
import { VxeUI } from "vxe-pc-ui";
import generateJson from "@/config/designData.js";

const METHOD_NAME_MAP = {
  查询: "query",
  保存: "save",
  删除: "delete",
  树形: "tree",
  附件: "attachment",
  其他: "other",
};

const COMPONENT_TYPE_MAP = {
  text: "VxeInput",
  number: "VxeNumberInput",
  select: "VxeSelect",
  date: "VxeDatePicker",
  boolean: "VxeSwitch",
};

const FORMAT_OPTIONS = [
  { label: "日期-年月日", value: "dateFormatter" },
  { label: "日期-时分秒", value: "datetimeFormatter" },
  { label: "货币", value: "currencyFormatter" },
  { label: "百分比", value: "percentFormatter" },
  { label: "千分位", value: "thousandFormatter" },
  { label: "布尔值", value: "booleanFormatter" },
];

export default {
  name: "IntegratedFunctionGenerator",
  props: ["modData"],
  data() {
    return {
      formData: {
        moduleName: "",
        moduleCode: "",
        functionCode: "",
        modelCode: "",
        functionId: "",
      },
      formRules: {
        modelCode: [{ required: true, message: "必须填写SQL" }],
      },
      methodList: [],
      columnList: [],
      formatOptions: FORMAT_OPTIONS,
    };
  },
  computed: {
    computedColumnList() {
      return this.columnList.map((column) => {
        if (!column.componentName && !column._userCleared) {
          column.componentName =
            COMPONENT_TYPE_MAP[column.columnType] || "VxeInput";
        }
        return column;
      });
    },
    isSaveColumn() {
      return this.methodList.some((x) => x.methodName?.includes("保存"));
    },
    isQueryColumn() {
      return this.methodList.some((x) => x.methodName?.includes("查询"));
    },
    isGrid() {
      return this.formData?.functionType?.includes("grid");
    },
  },
  watch: {
    modData: {
      handler(newValue) {
        if (newValue) {
          Object.assign(this.formData, newValue);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    onComponentClear(row) {
      row._userCleared = true;
    },

    async saveInfo(showMessage = true) {
      try {
        const res = await saveBaseInfo(this.formData);
        this.formData.functionId = res.data;
        if (showMessage) messageHandler.notifyMsg(res.msg, res.success);
      } catch (error) {
        if (showMessage) this.showMessage("基础信息保存失败", "error");
        throw error;
      }
    },

    generateUniqueMethodCode(methodName, currentRow) {
      const englishName = METHOD_NAME_MAP[methodName];
      if (!englishName) return "";

      const existingCodes = this.methodList
        .filter((row) => row !== currentRow)
        .map((row) => row.methodCode)
        .filter((code) => code?.startsWith(englishName));

      if (!existingCodes.includes(englishName)) {
        return englishName;
      }

      let counter = 1;
      let newCode = `${englishName}${counter}`;
      while (existingCodes.includes(newCode)) {
        counter++;
        newCode = `${englishName}${counter}`;
      }
      return newCode;
    },

    generateDefaultOrderIndex(currentRow) {
      const existingOrders = this.methodList
        .filter((row) => row !== currentRow)
        .map((row) => parseInt(row.orderIndex) || 0)
        .filter((order) => !isNaN(order));

      return existingOrders.length === 0 ? 1 : Math.max(...existingOrders) + 1;
    },

    async attrSelect(row, methodName) {
      const uniqueMethodCode = this.generateUniqueMethodCode(methodName, row); //创建methodcode 如果同名后缀加1
      const defaultOrderIndex =
        row.orderIndex || this.generateDefaultOrderIndex(row); // 排序

      if (row.methodAttribute?.trim()) {
        try {
          const result = await VxeUI.modal.confirm({
            content: `切换为"${methodName}"将覆盖您的自定义配置，确定继续吗？`,
            confirmButtonText: "确定覆盖",
            cancelButtonText: "保留修改",
          });
          if (result !== "confirm") return;
        } catch {
          return;
        }
      }

      row.methodCode = uniqueMethodCode;
      if (!row.orderIndex) {
        row.orderIndex = defaultOrderIndex;
      }
      row.methodAttribute = "";
      this.showMessage(`功能"${methodName}"配置已更新`, "success");
    },

    addMethodRow() {
      this.methodList.push({
        methodName: "",
        methodCode: "",
        methodAttribute: "",
        methodDescription: "",
        orderIndex: "",
      });
    },

    addColumnRow() {
      this.columnList.push({
        columnCode: "",
        columnName: "",
        columnType: "text",
        componentName: "VxeInput",
        defaultValue: "",
        formatter: "",
        gridColumn: false,
        orderIndex: "",
        modifyEdit: false,
        privilegeColumn: false,
        queryColumn: false,
        fixedColumn: false,
        formGroupName: "",
        align: "",
      });
    },

    async deleteColumnRow(rowIndex) {
      try {
        await VxeUI.modal.confirm({ content: "确定要删除这一行吗？" });
        this.columnList.splice(rowIndex, 1);
        this.showMessage("删除成功", "success");
      } catch (error) {
        if (error !== "cancel") {
          this.showMessage("删除失败", "error");
        }
      }
    },

    async deleteMethodRow(rowIndex) {
      try {
        await VxeUI.modal.confirm({ content: "确定要删除这一行吗？" });
        this.methodList.splice(rowIndex, 1);
        this.showMessage("删除成功", "success");
      } catch (error) {
        if (error !== "cancel") {
          this.showMessage("删除失败", "error");
        }
      }
    },

    async sqlAnalysis() {
      if (!this.formData.modelSql?.trim()) {
        this.showMessage("请输入SQL", "warning");
        return;
      }

      const data = { ...this.formData };
      delete data.modelCode;

      try {
        const res = await parseModelSql(data);
        if (res.code === "200") {
          this.methodList = res.data.methodList || [];
          this.columnList = res.data.columnList || [];
          this.formData.modelCode = res.data.modelCode;
          this.formData.functionId = res.data.functionId;
          this.showMessage("解析成功", "success");
        } else {
          this.showMessage("SQL解析失败", "error");
        }
      } catch (error) {
        this.showMessage("SQL解析出错", "error");
      }
    },

    async generateComplete() {
      try {
        const confirm = await VxeUI.modal.confirm({
          content: "是否重新生成grid、form设计文件？",
        });

        if (confirm === "confirm") {
          await this.saveInfo(false);
          const formJson = {
            baseInfo: {
              formColumnNums: this.formData.formColumnNums || 2,
              moduleCode: this.formData.moduleCode || "",
              moduleName: this.formData.moduleName || "",
              functionCode: this.formData.functionCode || "",
              functionName: this.formData.functionName || "",
            },
            columnList: this.columnList || [],
            methodList: this.methodList || [],
            widgetList: [],
            formConfig: {
              moduleId: `${this.formData.moduleCode}_${this.formData.functionCode}`,
              modelCode: this.formData.modelCode,
              functionCode: this.formData.functionCode,
              functionName: this.formData.functionName,
              functionId: this.formData.functionId,
            },
            module: this.formData,
          };
          if (this.formData.functionType != "grid-form") {
            const { widgetList, formConfig } = generateJson(
              formJson,
              this.formData?.functionType
            );

            this.$emit("generateData", { widgetList, formConfig });

            const designJson = JSON.stringify(
              { widgetList, formConfig },
              null,
              "  "
            );
            const data = {
              ...this.getBaseParams(),
              splitFunctionList: [
                {
                  functionCode: this.formData.functionCode,
                  functionType: this.formData.functionType,
                  designJson: designJson,
                },
              ],
            };
            if (this.formData.functionId)
              data.functionId = this.formData.functionId;
            splitFunction(data).then(() => {
              messageHandler.notifySuccess("保存功能设计Json成功！");
            });
          }
        }
      } catch (error) {
        if (error !== "cancel") {
          this.showMessage("生成失败", "error");
        }
      }
    },

    getBaseParams() {
      return {
        moduleName: this.formData.moduleName,
        moduleCode: this.formData.moduleCode,
        functionCode: this.formData.functionCode,
      };
    },

    showMessage(message, type = "info") {
      const methods = {
        success: "notifySuccess",
        error: "notifyError",
        warning: "notifyWarning",
        info: "notifyInfo",
      };
      messageHandler[methods[type] || methods.info](message);
    },
  },
};
</script>

<style scoped>
.vxe-tip {
  margin: 20px 0 10px 0;
}

.vxe-button {
  margin-right: 8px;
}
</style>
