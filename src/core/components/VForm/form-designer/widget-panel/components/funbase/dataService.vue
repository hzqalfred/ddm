<template>
  <div style="margin-top: 40px;padding: 0 40px;">
    <div>
      <vxe-form
        ref="formRef"
        :data="formData"
        :rules="formRules"
        @submit="submitEvent"
      >
        <vxe-form-item title="SQL" field="modelSql" span="16" :item-render="{}">
          <template #default="params">
            <vxe-textarea
              v-model="formData.modelSql"
              :placeholder="sqlMemo"
              :autosize="sqlAut"
            ></vxe-textarea>
          </template>
        </vxe-form-item>
        <vxe-form-item span="2">
          <template #default="params">
            <vxe-button
              status="primary"
              content="解析"
              @click="sqlAnalysis"
            ></vxe-button>
          </template>
        </vxe-form-item>
        <vxe-form-item class-name="h10" align="center" span="24" :item-render="{}">
          <template #default>
            <vxe-button
              type="submit"
              status="primary"
              content="下一步"
              class="next-button"
            ></vxe-button>
          </template>
        </vxe-form-item>
      </vxe-form>
    </div>
    <div>
      <vxe-tip status="primary">事件明细</vxe-tip>
      <el-button
      style="margin-bottom: 10px;"
        type="primary"
        @click="importMethodList()"
        >导入</el-button
      >
      <vxe-table border height="300" :data="tableDataF" ref="tableRef">
        <vxe-column field="methodName" title="事件名称"></vxe-column>
        <vxe-column field="methodCode" title="事件编号"></vxe-column>
        <vxe-column
          field="orderIndex"
          align="center"
          title="排序"
          width="80"
          sort-by="orderIndex"
          sort-type="number"
          sortable
        ></vxe-column>
        <vxe-column fixed="right" align="center" width="200" label="操作">
          <template #default="{ row }">
            <vxe-button
              mode="text"
              status="primary"
              icon="vxe-icon-edit"
              @click="editRow(row)"
              >编辑</vxe-button
            >
            <vxe-button mode="text" status="error" @click="removeRow(row)"
              >删除</vxe-button
            >
          </template>
        </vxe-column>
      </vxe-table>

      <vxe-modal
        ref="editPopupModal"
        resize
        destroy-on-close
        show-footer
        show-confirm-button
        show-cancel-button
        v-model="showEditPopup"
        title="编辑"
        width="60vw"
        height="60vh"
        :loading="false"
        :confirm-closable="false"
        @confirm="confirmEvent"
      >
        <vxe-form
          style="margin-top: 10px;"
          ref="formRefEdit"
          v-bind="formOptions"
        ></vxe-form>
      </vxe-modal>

      <vxe-modal
        ref="popupModal"
        resize
        show-footer
        show-confirm-button
        show-cancel-button
        show-maximize
        v-model="showPopup"
        title="数据服务事件"
        height="400"
        width="800"
        @show="showSubEvent"
        @confirm="confirmSubEvent"
      >
        <vxe-table
          border
          ref="productTableRef"
          height="100%"
          :row-config="{ keyField: 'id' }"
          :data="productData"
        >
          <vxe-column type="checkbox" width="60"></vxe-column>
          <vxe-column field="methodName" title="事件名称"></vxe-column>
          <vxe-column field="methodCode" title="编辑编号"></vxe-column>
          <vxe-column field="note" title="说明"></vxe-column>
        </vxe-table>
      </vxe-modal>
    </div>
  </div>
</template>

<script>
import {
  getFunctionDetail,
  parseModelSql,
  saveMethod,
  deleteMethod,
  getImportMethodList,
} from "@/api/functionGenerator";
import { usualSettingOptions } from "@/api/suiteManage";
import messageHandler from "@/core/Message";
import XEUtils from "xe-utils";

// 定义默认的表单数据对象，方便复用
const defaultFormData = {
  methodName: "",
  methodCode: "",
  orderIndex: null,
};

export default {
  name: "dataService",
  props: ["funData"],
  data() {
    return {
      formData: {
        moduleName: "",
        moduleCode: "",
        functionCode: "",
        modelCode: "",
        modelSql: "select * from ",
      },
      formRules: {
        modelSql: [{ required: true, message: "必须填写" }],
      },
      // 更清晰的查询参数命名
      serviceQueryParams: {
        moduleName: this.funData.moduleName,
        moduleCode: this.funData.moduleCode,
        q__kwd: "",
      },
      sqlAut: { minRows: 2, maxRows: 10 },
      sqlMemo: "select * from device_card",
      sqlIs: false,
      sqlData: {},

      tableDataC: [],
      tableDataF: [],

      showEditPopup: false,
      formOptions: {
        titleWidth: 100,
        titleAlign: "right",
        titleColon: true,
        data: XEUtils.clone(defaultFormData, true),
        rules: {
          methodName: [{ required: true, message: "请输入事件名称" }],
          orderIndex: [{ required: true, message: "请输入排序" }],
        },
        items: [
          {
            field: "methodCode",
            title: "事件编号",
            itemRender: { name: "VxeInput", props: { disabled: true } },
            span: 24,
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
        ],
      },
      showPopup: false,
      productData: [],
      listService: [],
    };
  },
  watch: {
    funData: {
      handler(newValue) {
        this.formData.moduleName = newValue.moduleName;
        this.formData.moduleCode = newValue.moduleCode;
        this.formData.functionCode = newValue.functionCode;
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    // 传递param
    getModuleRelatedParams() {
      return {
        moduleName: this.formData.moduleName,
        moduleCode: this.formData.moduleCode,
        functionCode: this.formData.functionCode,
      };
    },

    // 警告提示
    showWarning(message) {
      messageHandler.notifyWarning(message);
    },

    // 成功提示
    showSuccess(message) {
      messageHandler.notifySuccess(message);
    },

    // 点击导入，事件明细窗口打开
    importMethodList(row) {
      this.showPopup = true;
    },

    // 获取可导入的数据服务事件
    showSubEvent() {
      const param = this.getModuleRelatedParams();
      getImportMethodList(param).then((res) => {
        if (res.code == "200") {
          this.productData = res.data;
        }
      });
    },

    // 选择数据服务事件后
    confirmSubEvent() {
      const $productTable = this.$refs.productTableRef;
      if ($productTable) {
        const data = $productTable.getCheckboxRecords();
        if (data.length !== 0) {
          data.forEach((item) => {
            item.orderIndex = 10;
          });
          const param = this.getModuleRelatedParams();
          param.methodList = data;
          this.saveList(param);
        }
      }
    },

    // 下一步操作
    submitEvent() {
      if (this.sqlIs) {
        this.$parent.next();
      } else {
        this.showWarning("未进行sql解析，无法进入下一步。");
      }
    },

    // 解析SQL
    sqlAnalysis() {
      // if (!this.formData.modelCode) {
      //   this.showWarning("请选择数据源。");
      //   return;
      // }
      if (!this.formData.modelSql) {
        this.showWarning("请输入sql。");
        return;
      }
      parseModelSql(this.formData).then((res) => {
        if (res.code !== "200") {
          this.showWarning("未能解析该sql。");
        } else {
          this.showSuccess("解析成功！");
          this.sqlData = res.data;
          this.tableDataC = res.data.dataObjectColumnList;
          this.tableDataF = res.data.methodList;
          this.sqlIs = true;
        }
      });
    },

    // 删除事件预处理
    removeRow(row) {
      const $table = this.$refs.tableRef;
      $table.remove(row);
      if (row.methodCode) {
        const param = this.getModuleRelatedParams();
        param.methodCodes = [row.methodCode];
        this.deleteList(param);
      }
    },

    // 保存事件预处理
    saveRow(data) {
      if (data) {
        const param = this.getModuleRelatedParams();
        param.methodList = [
          {
            orderIndex: data.orderIndex,
            methodCode: data.methodCode,
            methodName: data.methodName,
          },
        ];
        this.saveList(param);
      }
    },

    // 删除事件
    deleteList(param) {
      return deleteMethod(param).then((res) => {
        if (res.code == "200") {
          this.showSuccess("删除成功！");
        }
      });
    },

    // 保存事件
    saveList(param) {
      return saveMethod(param).then((res) => {
        if (res.code == "200") {
          this.showSuccess("编辑成功！");
          this.getDetail();
        }
      });
    },

    // 事件编辑按钮
    editRow(row) {
      this.formOptions.data = Object.assign(
        XEUtils.clone(defaultFormData, true),
        row
      );
      this.showEditPopup = true;
    },

    // 获取所有事件信息
    getDetail() {
      const param = this.getModuleRelatedParams();
      return getFunctionDetail(param).then((res) => {
        if (res.code == "200") {
          this.tableDataF = res.data.methodList;
          this.tableDataC = res.data.dataObjectColumnList;
          this.formData.modelSql = res.data.modelSql
          if(res.data.modelSql)   this.sqlIs = true;
        }
      });
    },

    // 编辑后确认事件
    async confirmEvent() {
      const $form = this.$refs.formRefEdit;
      if ($form) {
        const errMap = await $form.validate();
        if (!errMap) {
          this.showEditPopup = false;
          this.saveRow($form.data);
        }
      }
    },
  },
};
</script>
<style>
  .h10{
    height: 10px;
  }
</style>