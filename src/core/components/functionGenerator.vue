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
          <!-- <el-select-v2
            v-model="formData.modelCode"
            class="sql"
            :options="sqlOptions"
          ></el-select-v2> -->
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
        <vxe-button size="mini" status="success" @click="saveAllMethod">
          保存
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
              <!-- <vxe-option label="查询:表单" value="查询:表单" /> -->
              <vxe-option label="查询" value="查询" />
              <vxe-option label="保存" value="保存" />
              <vxe-option label="删除" value="删除" />
              <vxe-option label="树形" value="树形" />
              <vxe-option label="导入" value="导入" />
              <vxe-option label="导出" value="导出" />
              <vxe-option label="打印" value="打印" />
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
            <vxe-input
              size="small"
              v-model="row.methodAttribute"
              @input="onMethodAttributeInput(row)"
            />
          </template>
        </vxe-column>
        <vxe-column field="methodDescription" title="说明" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.methodDescription" />
          </template>
        </vxe-column>
        <vxe-column fixed="right" align="center" width="200" title="操作">
          <template #default="{ row,$rowIndex }">
            <!-- <vxe-button
              mode="text"
              status="primary"
              @click="editItem('method', row)"
            >
              编辑
            </vxe-button> -->
            <vxe-button
              mode="text"
              status="error"
              @click="removeItem('method', row, $rowIndex)"
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
        <vxe-button size="mini" status="success" @click="saveAllColumns">
          保存
        </vxe-button>
      </div>

      <vxe-table
        border
        stripe
        :data="columnList"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        :checkbox-config="{ checkField: 'checked' }"
        ref="columnTableRef"
      >
        <!-- <vxe-column type="checkbox" width="60" /> -->
        <!-- <vxe-column type="seq" width="60" title="序号" /> -->
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
          title="字段名称"
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
          field="columnType"
          title="字段类型"
          width="100"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-select v-model="row.columnType" :options="columnTypeOptions" />
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
            <vxe-select v-model="row.componentName" size="small">
              <vxe-option label="VxeInput" value="VxeInput" />
              <vxe-option label="VxeSelect" value="VxeSelect" />
              <vxe-option label="VxeSwitch" value="VxeSwitch" />
              <vxe-option label="VxeDatePicker" value="VxeDatePicker" />
              <vxe-option label="VxeNumberInput" value="VxeNumberInput" />
              <!-- <el-option label="VxeTreeSelect" value="VxeTreeSelect" />
              <el-option label="VxeTableSelect" value="VxeTableSelect" />
              <el-option label="VxeIconPicker" value="VxeIconPicker" />
              <el-option label="VxeColorPicker" value="VxeColorPicker" /> -->
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
        <vxe-column
          :visible="isQueryColumn"
          field="gridColumn"
          title="显示"
          width="100"
        >
          <template #default="{ row }">
            <vxe-switch size="mini" v-model="row.gridColumn" />
          </template>
        </vxe-column>

        <vxe-column
          :visible="isSaveColumn"
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
          :visible="isQueryColumn"
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
        <!-- <vxe-column field="required" title="必填" width="80">
          <template #default="{ row }">
            <vxe-switch size="mini" v-model="row.required" />
          </template>
        </vxe-column>

        <vxe-column field="unique" title="唯一" width="80">
          <template #default="{ row }">
            <vxe-switch size="mini" v-model="row.unique" />
          </template>
        </vxe-column> -->

        <!-- <vxe-column field="addEdit" title="新增可编辑" width="120">
          <template #default="{ row }">
            <vxe-switch size="mini" v-model="row.addEdit" />
          </template>
        </vxe-column> -->

        <!-- <vxe-column
          field="displayStyle"
          title="显示格式"
          width="180"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.displayStyle" />
          </template>
        </vxe-column>

        <vxe-column
          field="formGroupName"
          title="表单分组"
          width="120"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input size="small" v-model="row.formGroupName" />
          </template>
        </vxe-column> -->

        <vxe-column title="操作" width="120" fixed="right">
          <template #default="{ row, $rowIndex }">
            <!-- <vxe-button
              mode="text"
              status="primary"
              @click="editColumnRow(row)"
            >
              编辑
            </vxe-button> -->
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
    <!-- 树配置 (仅在树型功能时显示) -->
    <div v-if="false" style="margin: 20px 0;">
      <!-- <div v-if="isTreeType" style="margin: 20px 0;"> -->
      <vxe-tip status="primary">树配置</vxe-tip>
      <vxe-button
        size="mini"
        style="margin: 10px 0;"
        status="success"
        icon="vxe-icon-add"
        @click="addItem('tree')"
      >
        新增
      </vxe-button>
      <vxe-table border :data="treeList" ref="treeTableRef">
        <vxe-column field="treeName" title="树名称" />
        <vxe-column field="moduleName" title="套件名称" />
        <vxe-column field="objectName" title="数据对象名称" />
        <vxe-column field="methodName" title="方法名称" />
        <vxe-column title="操作" width="200">
          <template #default="{ row }">
            <vxe-button
              mode="text"
              status="primary"
              @click="editItem('tree', row)"
            >
              编辑
            </vxe-button>
            <vxe-button
              mode="text"
              status="error"
              @click="removeItem('tree', row)"
            >
              删除
            </vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <!-- 事件明细 -->

    <!-- 查询设置 -->
    <div style="margin-top: 20px;" v-if="false">
      <vxe-tip status="primary">查询设置</vxe-tip>
      <vxe-table
        ref="xTable"
        border
        resizable
        show-overflow
        :data="queryItems"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
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
        <vxe-column field="searchColumn" title="字段名称" :edit-render="{}">
          <template #edit="{ row }">
            <el-input v-model="row.searchColumn" @blur="validateField(row)" />
          </template>
        </vxe-column>

        <!-- 显示名称 -->
        <vxe-column field="label" title="显示名称" :edit-render="{}">
          <template #edit="{ row }">
            <el-input v-model="row.label" />
          </template>
        </vxe-column>

        <!-- 是否默认查询 -->
        <vxe-column field="query" title="是否默认查询">
          <template #default="{ row }">
            <el-switch v-model="row.query" />
          </template>
        </vxe-column>

        <!-- 是否允许查询 -->
        <vxe-column field="allowquery" title="是否允许查询">
          <template #default="{ row }">
            <el-switch v-model="row.allowquery" />
          </template>
        </vxe-column>

        <!-- 运算符 -->
        <vxe-column field="operator" title="运算符">
          <template #default="{ row }">
            <el-select v-model="row.operator">
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
    <!-- 完成按钮 -->
    <div style="text-align: center; margin: 20px;">
      <vxe-button
        type="submit"
        status="primary"
        content="功能生成"
        @click="generateComplete"
      />
    </div>

    <!-- 事件编辑弹窗 -->
    <vxe-modal
      ref="editModal"
      v-model="showEditModal"
      :title="editTitle"
      width="60vw"
      height="60vh"
      show-footer
      show-confirm-button
      show-cancel-button
      @confirm="confirmEdit"
    >
      <vxe-form
        ref="editFormRef"
        :data="editFormData"
        :rules="editFormRules"
        :items="editFormItems"
      >
        <!-- 方法选择插槽 -->
        <template #methodSelect="{ data }">
          <vxe-tree-select
            v-model="data.methodName"
            :options="methodTreeData"
            :tree-config="{
              trigger: 'node',
              radioConfig: {
                checkMethod({ node }) {
                  return !node.children || !node.children.length;
                },
              },
            }"
            @change="handleMethodChange"
          />
        </template>
      </vxe-form>
    </vxe-modal>

    <!-- 数据服务事件选择弹窗 -->
    <vxe-modal
      v-model="showPopup"
      title="数据服务事件"
      height="400"
      width="800"
      show-footer
      show-confirm-button
      show-cancel-button
      @show="loadImportMethods"
      @confirm="confirmImport"
    >
      <vxe-table
        border
        ref="importTableRef"
        height="100%"
        :data="importMethodList"
      >
        <vxe-column type="checkbox" width="60" />
        <vxe-column field="methodName" title="事件名称" />
        <vxe-column field="methodCode" title="编辑编号" />
        <vxe-column field="note" title="说明" />
      </vxe-table>
    </vxe-modal>
  </div>
</template>

<script>
import {
  getFunctionDetail,
  parseModelSql,
  saveMethod,
  deleteMethod,
  getImportMethodList,
  saveTree,
  deleteTree,
  saveColumn,
  deleteColumn,
  allDataService,
  saveDesignJson,
  saveBaseInfo,
} from "@/api/functionGenerator";
import messageHandler from "@/core/Message";
import XEUtils from "xe-utils";
import { VxeUI } from "vxe-pc-ui";
import generateJson from "@/config/designData.js";
import { getModuleDataService } from "@/api/suiteManage";
import Sortable from "sortablejs";
import { queryColumnList } from "@/api/dataService";

// 表单配置常量
const FORM_CONFIGS = {
  method: {
    items: [
      {
        field: "methodCode",
        title: "事件编号",
        span: 24,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "orderIndex",
        title: "排序",
        span: 24,
        itemRender: { name: "VxeInput", props: { type: "integer" } },
      },
      {
        field: "methodName",
        title: "事件名称",
        span: 24,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "methodAttribute",
        title: "属性",
        span: 24,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "methodDescription",
        title: "说明",
        span: 24,
        itemRender: { name: "VxeInput" },
      },
    ],
    rules: {
      methodName: [{ required: true, message: "请输入事件名称" }],
      orderIndex: [{ required: true, message: "请输入排序" }],
    },
  },
  tree: {
    items: [
      {
        field: "treeId",
        title: "树ID",
        span: 6,
        visible: false,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "orderIndex",
        title: "排序",
        span: 6,
        itemRender: { name: "VxeInput", props: { type: "integer" } },
      },
      {
        field: "treeName",
        title: "树名称",
        span: 6,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "moduleName",
        title: "套件名称",
        span: 6,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "moduleCode",
        title: "套件标识符",
        span: 6,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "objectName",
        title: "数据对象名称",
        span: 6,
        itemRender: { name: "VxeInput", props: { disabled: true } },
      },
      {
        field: "objectCode",
        title: "数据对象编码",
        span: 6,
        itemRender: { name: "VxeInput", props: { disabled: true } },
      },
      {
        field: "methodName",
        title: "方法名称",
        span: 6,
        slots: { default: "methodSelect" },
      },
      {
        field: "methodCode",
        title: "方法编码",
        span: 6,
        itemRender: { name: "VxeInput", props: { disabled: true } },
      },
      {
        align: "center",
        span: 24,
        itemRender: {
          name: "VxeButtonGroup",
          options: [
            { type: "submit", content: "确定", status: "primary" },
            { type: "reset", content: "取消" },
          ],
        },
      },
    ],
    rules: {
      treeName: [{ required: true, message: "请输入树名称" }],
      moduleName: [{ required: true, message: "请输入套件名称" }],
      methodName: [{ required: true, message: "请输入方法名称" }],
    },
  },
  column: {
    items: [
      {
        field: "columnId",
        title: "字段ID",
        span: 6,
        visible: false,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "orderIndex",
        title: "排序",
        span: 6,
        itemRender: { name: "VxeInput", props: { type: "integer" } },
      },
      {
        field: "columnCode",
        title: "字段编码",
        span: 6,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "columnName",
        title: "字段名称",
        span: 6,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "columnType",
        title: "字段类型",
        span: 6,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "defaultValue",
        title: "默认值",
        span: 6,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "maxLength",
        title: "最大长度",
        span: 6,
        itemRender: { name: "VxeInput", props: { type: "integer" } },
      },
      {
        field: "decimalLength",
        title: "小数位长度",
        span: 6,
        itemRender: { name: "VxeInput", props: { type: "integer" } },
      },
      {
        field: "required",
        title: "必填？",
        span: 6,
        itemRender: {
          name: "VxeSelect",
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ],
        },
      },
      {
        field: "unique",
        title: "唯一？",
        span: 6,
        itemRender: {
          name: "VxeSelect",
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ],
        },
      },
      {
        field: "addEdit",
        title: "新增可编辑？",
        span: 6,
        itemRender: {
          name: "VxeSelect",
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ],
        },
      },
      {
        field: "modifyEdit",
        title: "修改可编辑？",
        span: 6,
        itemRender: {
          name: "VxeSelect",
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ],
        },
      },
      {
        field: "gridColumn",
        title: "表格中显示?",
        span: 6,
        itemRender: {
          name: "VxeSelect",
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ],
        },
      },
      {
        field: "displayStyle",
        title: "显示格式",
        span: 6,
        itemRender: { name: "VxeInput" },
      },
      {
        field: "formGroupName",
        title: "表单分组名称",
        span: 6,
        itemRender: { name: "VxeInput" },
      },
      {
        align: "center",
        span: 24,
        itemRender: {
          name: "VxeButtonGroup",
          options: [
            { type: "submit", content: "确定", status: "primary" },
            { type: "reset", content: "取消" },
          ],
        },
      },
    ],
    rules: {
      columnCode: [{ required: true, message: "请输入字段编码" }],
      columnName: [{ required: true, message: "请输入字段名称" }],
      columnType: [{ required: true, message: "请输入字段类型" }],
      required: [{ required: true, message: "请选择是否必填" }],
      unique: [{ required: true, message: "请选择是否唯一" }],
      gridColumn: [{ required: true, message: "请选择是否在表格中显示" }],
    },
  },
};

export default {
  name: "IntegratedFunctionGenerator",
  props: ["modData"],
  data() {
    return {
      // 基础数据
      formData: {
        moduleName: "",
        moduleCode: "",
        functionCode: "",
        modelCode: "",
      },
      formRules: {
        modelCode: [{ required: true, message: "必须填写SQL" }],
      },
      sqlConfig: { minRows: 2, maxRows: 10 },
      sqlParsed: false,

      // 统一的方法配置映射
      METHOD_CONFIGS: {
        // "查询:表格": {
        //   service: "",
        //   name: "",
        //   belongTo: "",
        //   queryScheme: {
        //     operator: "eq",
        //     searchColumn: "",
        //     searchValue: "",
        //   },
        // },
        查询: { name: "", service: "", key: "" },
        删除: { name: "", service: "" },
        树形: {
          service: "",
          name: "",
          queryScheme: {
            operator: "eq",
            searchColumn: "",
            searchValue: "",
          },
        },
        附件: { name: "", service: "/file/upload" },
        // "保存" 需要特殊处理，根据 isGrid 动态生成
      },

      // 列表数据
      methodList: [],
      treeList: [],
      columnList: [],
      importMethodList: [],
      methodTreeData: [],
      queryItems: [],

      // 弹窗状态
      showEditModal: false,
      showPopup: false,
      editType: "",
      editRow: null,
      editFormData: {},
      editFormRules: {},
      editFormItems: [],
      columnTypeOptions: [
        { label: "String", value: "String" },
        { label: "Integer", value: "Integer" },
        { label: "Long", value: "Long" },
        { label: "Double", value: "Double" },
        { label: "Boolean", value: "Boolean" },
        { label: "Date", value: "Date" },
        { label: "DateTime", value: "DateTime" },
        { label: "Text", value: "Text" },
        { label: "Decimal", value: "Decimal" },
      ],
      sqlOptions: [],
    };
  },
  computed: {
    queryList() {
      return this.queryItems.map((item) => {
        return {
          ...item, // 保留所有原始属性
          requestColumn: item.searchColumn, // 保持字段名一致性
          columnName: item.label, // 保持显示名一致性
          // 明确保存allowquery属性
          allowquery: item.allowquery !== undefined ? item.allowquery : false,
        };
      });
    },
    autoQueryList() {
      return this.columnList.map((column) => ({
        searchColumn: column.columnCode,
        requestColumn: column.columnCode,
        label: column.columnName,
        columnName: column.columnName,
        query: !!column.queryColumn, // 默认不启用查询
        allowquery: !!column.queryColumn, // 允许查询
        operator: "eq", // 默认等于操作符
        defaultValue: column.defaultValue || "",
        type: this.getInputTypeByColumnType(column.columnType), // 根据字段类型设置输入类型
        options: null,
      }));
    },
    isTreeType() {
      return ["tree-grid", "tree-grid-form"].includes(
        this.formData.functionType
      );
    },
    editTitle() {
      const titles = { method: "事件", tree: "树配置", column: "字段" };
      return `${this.editRow ? "编辑" : "新增"}${titles[this.editType] || ""}`;
    },
    isSaveColumn() {
      return !!this.methodList.find((x) => x.methodName?.indexOf("保存") > -1);
    },
    isQueryColumn() {
      return !!this.methodList.find((x) => x.methodName?.indexOf("查询") > -1);
    },
    isGrid() {
      return this.formData.functionType.indexOf("grid") > -1;
    },
    isForm() {
      return this.formData.functionType.indexOf("form") > -1;
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
  async mounted() {
    await this.loadData();
    this.getDataService();
    // await this.fetchQueryColumns();
    this.initSortable();
  },
  methods: {
    getInputTypeByColumnType(columnType) {
      const typeMap = {
        String: "input",
        Text: "textarea",
        Integer: "number",
        Long: "number",
        Double: "number",
        Decimal: "number",
        Boolean: "select",
        Date: "date",
        DateTime: "datetime",
      };
      return typeMap[columnType] || "input";
    },
    async saveInfo(showMessage = true) {
      const formFields = {
        functionId: this.formData.functionId,
        functionName: this.formData.functionName,
        functionCode: this.formData.functionCode,
        functionType: this.formData.functionType,
        menuFunction: this.formData.menuFunction,
        tree: this.formData.tree,
        orderIndex: this.formData.orderIndex,
        formColumnNums: this.formData.formColumnNums,
        modelSql: this.formData.modelSql, // 数据对象绑定字段
        // 保留必要的基础字段
        moduleName: this.formData.moduleName,
        moduleCode: this.formData.moduleCode,
        tableName: this.formData.tableName,
      };
      try {
        let res = await saveBaseInfo(formFields);
        this.formData.functionId = res.data;
        if (showMessage) messageHandler.notifyMsg(res.msg, res.success);
      } catch (error) {
        if (showMessage) this.showMessage("基础信息保存失败", "error");
        throw error;
      }
    },
    getDataService() {
      let data = Object.assign({}, this.formData);
      getModuleDataService(data).then((res) => {
        console.log(res);
        this.sqlOptions = res.data.map((x) => ({
          value: x.objectCode,
          label: `${x.objectCode}-${x.objectName}`,
        }));
      });
    },

    // 获取方法的默认配置
    getDefaultConfig(methodName) {
      if (methodName === "保存") {
        return this.isGrid
          ? { name: "", service: "" }
          : { name: "", service: "", isRC: true, gridName: "" };
      }
      return this.METHOD_CONFIGS[methodName] || null;
    },

    // 检查是否为系统默认配置
    isSystemGenerated(row) {
      return row._isSystemGenerated === true;
    },

    // 检查是否有用户修改
    hasUserModification(row) {
      // 没有配置内容
      if (!row.methodAttribute || !row.methodAttribute.trim()) {
        return false;
      }

      // 如果是系统生成的配置，说明用户没有修改
      if (this.isSystemGenerated(row)) {
        return false;
      }

      // 其他情况都视为用户修改
      return true;
    },

    // 监听用户输入（实时监听）
    onMethodAttributeInput(row) {
      // 用户开始输入时立即移除系统生成标记
      if (row._isSystemGenerated) {
        row._isSystemGenerated = false;
        console.log("用户正在修改配置，移除系统生成标记");
      }
    },

    async attrSelect(row, methodName) {
      const defaultConfig = this.getDefaultConfig(methodName);

      // if (!defaultConfig) {
      //   row._isSystemGenerated = false;
      //   return;
      // }

      if (!this.isSystemGenerated(row) && row.methodAttribute?.trim()) {
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

      row.methodAttribute = defaultConfig ? JSON.stringify(defaultConfig) : "";
      row._isSystemGenerated = true;

      this.showMessage(`功能"${methodName}"配置已更新`, "success");
    },

    initSortable() {
      const queryTable = this.$refs.xTable?.$el;
      if (!queryTable) return;
      const tableBody = queryTable.querySelector(".vxe-table--body tbody");
      if (tableBody) {
        new Sortable(tableBody, {
          handle: ".drag-handle",
          animation: 150,
          onEnd: ({ oldIndex, newIndex }) => {
            if (oldIndex !== newIndex) {
              const movedItem = this.queryItems.splice(oldIndex, 1)[0];
              this.queryItems.splice(newIndex, 0, movedItem);
            }
          },
        });
      }
    },
    initQueryItems() {
      let configuredItems = [];
      if (this.modData?.queryProgrammeList?.length) {
        configuredItems = JSON.parse(
          this.modData?.queryProgrammeList[0].searchItemListJson
        );
      }
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
    },
    // 获取查询字段
    async fetchQueryColumns() {
      try {
        // 获取已配置的查询项
        const configuredItems = this.initQueryItems();

        // 构建已配置项的映射，用于快速查找
        const configuredMap = {};
        configuredItems.forEach((item) => {
          // 使用 searchColumn/requestColumn 作为键
          const key = item.searchColumn || item.requestColumn;
          if (key) {
            configuredMap[key] = item;
          }
        });

        // 调用接口获取查询字段列表
        const response = await queryColumnList({
          moduleName: this.formData.moduleName,
          moduleCode: this.formData.moduleCode,
          objectCode: this.formData.modelCode || "",
          methodCode: "query",
        });

        if (!response.data || !Array.isArray(response.data)) {
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
        this.queryItems = newItems;
      } catch (error) {
        console.error("获取查询字段失败:", error);
        throw error;
      }
    },

    // 新增行
    addMethodRow() {
      const newRow = {
        methodName: "",
        methodCode: "",
        methodAttribute: "",
        methodDescription: "",
        orderIndex: "",
        methodIds: "",
        _isSystemGenerated: false, // 新行默认为非系统生成
      };
      this.methodList.push(newRow);
    },

    // 新增行
    addColumnRow() {
      const newRow = {
        columnCode: "",
        columnName: "",
        columnType: "text",
        componentName: "",
        defaultValue: "",
        gridColumn: false,
        formColumn: false,
        orderIndex: "",
        modifyEdit: false,
        privilegeColumn: false,
        queryColumn: false,
        fixedColumn: false,
        formGroupName: "",
        align: "",
      };
      this.columnList.push(newRow);
    },

    // 编辑行
    editColumnRow(row) {
      // 进入编辑模式
      this.$refs.columnTableRef.setActiveCell(row, "columnCode");
    },

    // 删除单行
    async deleteColumnRow(rowIndex) {
      try {
        await VxeUI.modal.confirm({ content: "确定要删除这一行吗？" });
        const row = this.columnList[rowIndex];

        // 如果有ID，需要调用删除API
        if (row.columnId) {
          await this.deleteItem("column", row);
        }

        this.columnList.splice(rowIndex, 1);
        this.showMessage("删除成功", "success");
      } catch (error) {
        if (error !== "cancel") {
          this.showMessage("删除失败", "error");
        }
      }
    },
    async saveAllMethod(showMessage = true) {
      // 验证必填字段
      const invalidRows = this.methodList.filter(
        (row) => !row.methodName || !row.methodCode
      );

      if (invalidRows.length > 0) {
        if (showMessage)
          this.showMessage("请填写完整的功能和配置项", "warning");
        throw new Error("验证失败");
      }

      try {
        const param = this.getBaseParams();
        param.methodList = this.methodList;
        await saveMethod(param);
        if (showMessage) this.showMessage("保存成功", "success");
        this.loadData(); // 重新加载数据
      } catch (error) {
        if (showMessage) this.showMessage("保存失败", "error");
        throw error;
      }
    },

    async saveAllColumns(showMessage = true) {
      // 验证必填字段
      const invalidRows = this.columnList.filter(
        (row) => !row.columnCode || !row.columnName || !row.columnType
      );

      if (invalidRows.length > 0) {
        if (showMessage)
          this.showMessage(
            "请填写完整的字段编码、字段名称和字段类型",
            "warning"
          );
        throw new Error("验证失败");
      }

      try {
        const param = this.getBaseParams();
        param.columnList = this.columnList.map((row) => ({
          ...row,
          checked: undefined, // 移除选中状态字段
        }));

        await saveColumn(param);
        if (showMessage) this.showMessage("保存成功", "success");
        this.loadData(); // 重新加载数据
      } catch (error) {
        if (showMessage) this.showMessage("保存失败", "error");
        throw error;
      }
    },

    // 数据加载
    async loadData() {
      if (!this.formData.functionCode) return;

      try {
        const res = await getFunctionDetail(this.getBaseParams());
        if (res.code === "200") {
          // 加载的数据默认视为系统生成（或根据实际情况调整）
          this.methodList = (res.data.methodList || []).map((item) => ({
            ...item,
            _isSystemGenerated: false, // 从数据库加载的数据，保守起见标记为非系统生成
          }));
          this.treeList = res.data.treeList || [];
          this.columnList = res.data.columnList || [];
          this.formData.modelCode =
            res.data.modelCode || this.formData.modelCode;
          this.formData.modelSql = res.data.modelSql;
          this.sqlParsed = !!res.data.modelSql;
          this.formData.tableName = res.data.tableName;
          this.formData.formColumnNums = res.data.formColumnNums;
        }
      } catch (error) {
        this.showMessage("数据加载失败", "error");
      }
    },

    // SQL解析
    async sqlAnalysis() {
      if (!this.formData.modelSql.trim()) {
        this.showMessage("请输入SQL", "warning");
        return;
      }
      let data = Object.assign({}, this.formData, {
        modelSql: this.formData.modelSql,
      });
      if (data.modelCode) delete data.modelCode;

      try {
        const res = await parseModelSql(data);
        if (res.code === "200") {
          this.showMessage("解析成功", "success");
          // SQL解析生成的数据标记为系统生成
          this.methodList = (res.data.methodList || []).map((item) => ({
            ...item,
            _isSystemGenerated: true, // SQL解析生成的配置标记为系统生成
          }));
          this.columnList = res.data.columnList || [];
          this.formData.modelCode = res.data.modelCode;
          this.formData.functionId = res.data.functionId
          this.sqlParsed = true;
        } else {
          this.showMessage("SQL解析失败", "error");
        }
      } catch (error) {
        this.showMessage("SQL解析出错", "error");
      }
    },

    // 通用新增编辑
    addItem(type) {
      this.editType = type;
      this.editRow = null;
      this.setupEditModal(type, {});
      this.showEditModal = true;
    },

    editItem(type, row) {
      this.editType = type;
      this.editRow = row;
      this.setupEditModal(type, row);
      this.showEditModal = true;
    },

    // 设置编辑弹窗
    setupEditModal(type, data) {
      const config = FORM_CONFIGS[type];
      this.editFormData = XEUtils.clone(data, true);
      this.editFormRules = config.rules;
      this.editFormItems = config.items;

      // 为树配置添加方法选择器模板
      if (type === "tree" && !this.methodTreeData.length) {
        this.loadMethodTreeData();
      }
    },

    // 方法选择改变事件
    handleMethodChange(params) {
      let selectedMethod = null;

      // 递归查找选中的方法
      const findSelectedMethod = (nodes) => {
        for (const node of nodes) {
          if (node.value === params.value) {
            return node;
          }
          if (node.children && node.children.length) {
            const found = findSelectedMethod(node.children);
            if (found) return found;
          }
        }
        return null;
      };

      selectedMethod = findSelectedMethod(this.methodTreeData);

      if (selectedMethod) {
        // 更新表单数据
        Object.assign(this.editFormData, {
          objectName: selectedMethod.objectName,
          objectCode: selectedMethod.objectCode,
          methodCode: selectedMethod.methodCode,
          methodName: selectedMethod.methodName,
          moduleName: selectedMethod.moduleName,
          moduleCode: selectedMethod.moduleCode,
        });
      }
    },

    // 确认编辑
    async confirmEdit() {
      const formRef = this.$refs.editFormRef;
      if (!formRef) return;

      const errMap = await formRef.validate();
      if (errMap) return;

      try {
        await this.saveItem(this.editType, this.editFormData);
        this.showEditModal = false;
        this.loadData();
        this.showMessage("保存成功", "success");
      } catch (error) {
        this.showMessage("保存失败", "error");
      }
    },

    // 通用删除
    async removeItem(type, row, rowIndex) {
      try {
        await VxeUI.modal.confirm({ content: "确定要删除选中的数据吗？" });
        if (row.methodId) {
          await this.deleteItem(type, row);
        }

        this.methodList.splice(rowIndex, 1);
        this.showMessage("删除成功", "success");
      } catch (error) {
        if (error !== "cancel") {
          this.showMessage("删除失败", "error");
        }
      }
    },

    // 保存项目
    async saveItem(type, data) {
      const param = this.getBaseParams();

      switch (type) {
        case "method":
          param.methodList = [data];
          return await saveMethod(param);
        case "tree":
          param.treeList = [data];
          return await saveTree(param);
        case "column":
          param.columnList = [data];
          return await saveColumn(param);
      }
    },

    // 删除项目
    async deleteItem(type, row) {
      const param = this.getBaseParams();

      switch (type) {
        case "method":
          if (row.methodCode) {
            param.methodIds = [row.methodId];
            return await deleteMethod(param);
          }
          break;
        case "tree":
          if (row.treeId) {
            param.treeIds = [row.treeId];
            return await deleteTree(param);
          }
          break;
        case "column":
          if (row.columnId) {
            param.columnIds = [row.columnId];
            return await deleteColumn(param);
          }
          break;
      }
    },

    // 导入方法相关
    async loadImportMethods() {
      try {
        const res = await getImportMethodList(this.getBaseParams());
        if (res.code === "200") {
          this.importMethodList = res.data;
        }
      } catch (error) {
        this.showMessage("加载导入数据失败", "error");
      }
    },

    async confirmImport() {
      const tableRef = this.$refs.importTableRef;
      if (!tableRef) return;

      const selected = tableRef.getCheckboxRecords();
      if (!selected.length) {
        this.showMessage("请选择要导入的事件", "warning");
        return;
      }

      try {
        const param = this.getBaseParams();
        param.methodList = selected.map((item) => ({
          ...item,
          orderIndex: 10,
          _isSystemGenerated: true, // 导入的数据标记为系统生成
        }));
        await saveMethod(param);
        this.showPopup = false;
        this.loadData();
        this.showMessage("导入成功", "success");
      } catch (error) {
        this.showMessage("导入失败", "error");
      }
    },

    // 加载方法树数据
    async loadMethodTreeData() {
      try {
        const res = await allDataService();
        const module = res.data.find(
          (x) =>
            x.moduleCode === this.formData.moduleCode &&
            x.moduleName === this.formData.moduleName
        );

        if (module?.dataObjectList) {
          this.methodTreeData = module.dataObjectList.map((obj) => ({
            label: obj.objectName,
            value: obj.objectCode,
            objectCode: obj.objectCode,
            objectName: obj.objectName,
            moduleCode: module.moduleCode,
            moduleName: module.moduleName,
            children:
              obj.methodList?.map((method) => ({
                label: method.methodName,
                value: `${module.moduleCode}-${obj.objectCode}-${method.methodCode}`,
                methodCode: method.methodCode,
                methodName: method.methodName,
                objectCode: obj.objectCode,
                objectName: obj.objectName,
                moduleCode: module.moduleCode,
                moduleName: module.moduleName,
              })) || [],
          }));
        }
      } catch (error) {
        this.showMessage("加载方法树数据失败", "error");
      }
    },

    // 功能生成
    async generateComplete() {
      if (!this.sqlParsed) {
        this.showMessage("请先解析SQL", "warning");
        return;
      }

      try {
        const confirm = await VxeUI.modal.confirm({
          content: "是否重新生成grid、form设计文件？",
        });
      

        if (confirm === "confirm") {
          await this.saveInfo(false),
            await Promise.all([
              this.saveAllMethod(false),
              this.saveAllColumns(false),
            ]);

          const res = await getFunctionDetail(this.getBaseParams());

          if (res.code === "200") {
            const formJson = {
              baseInfo: {
                formColumnNums: res.data.formColumnNums || 2,
                moduleCode: res.data.moduleCode || "",
                moduleName: res.data.moduleName || "",
                functionCode: res.data.functionCode || "",
                functionName: res.data.functionName || "",
              },
              columnList: res.data.columnList || [],
              methodList: res.data.methodList || [],
              queryList: this.queryList,
              // treeList: res.data.treeList || [],
              widgetList: [],
              formConfig: {
                moduleId: `${this.formData.moduleCode}_${this.formData.functionCode}`,
                modelCode: this.formData.modelCode,
                functionCode:this.formData.functionCode,
                functionName:this.formData.functionName,
              },
              module: this.formData,
            };
            const { widgetList, formConfig } = generateJson(
              formJson,
              this.formData?.functionType
            );
            this.$emit("generateData", { widgetList, formConfig });
            let designJson = JSON.stringify(
              { widgetList, formConfig },
              null,
              "  "
            );
            let data = Object.assign({}, this.getBaseParams(), { designJson });
            // saveDesignJson(data).then((res) => {
            //   messageHandler.notifySuccess("保存功能设计Json成功！");
            // });
          }
        }
      } catch (error) {
        console.log(error);
        if (error !== "cancel") {
          this.showMessage("生成失败", "error");
        }
      }
    },

    // 工具方法
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
