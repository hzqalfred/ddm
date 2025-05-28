<template>
  <div style="margin-top: 40px;padding: 0 40px;">
    <div>
      <vxe-button
        type="submit"
        status="primary"
        content="下一步"
        class="next-button"
        @click="submitEvent()"
      ></vxe-button>
    </div>
    <div v-if="['tree-grid', 'tree-grid-form'].includes(formData.functionType)">
      <vxe-tip status="primary">树配置</vxe-tip>
      <div style="margin-top: -10px;">
        <vxe-button
          style="margin: 10px 0;"
          status="primary"
          icon="vxe-icon-add"
          @click="addEvent('A')"
          >新增</vxe-button
        >
        <!-- <vxe-button
          status="error"
          icon="vxe-icon-delete"
          @click="deleteEvent('A')"
          >删除</vxe-button
        > -->
      </div>
      <vxe-table
        border
        show-overflow
        height="200"
        :data="tableDataA"
        ref="tableRefA"
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column
          field="treeId"
          title="树ID"
          :edit-render="{ name: 'input' }"
          :visible="false"
        ></vxe-column>
        <vxe-column field="orderIndex" title="排序"></vxe-column>
        <vxe-column field="treeName" title="树名称"></vxe-column>
        <vxe-column field="moduleName" title="套件名称"></vxe-column>
        <vxe-column field="moduleCode" title="套件编码"></vxe-column>
        <vxe-column field="objectName" title="数据对象名称"></vxe-column>
        <vxe-column field="objectCode" title="数据对象编码"></vxe-column>
        <vxe-column field="methodName" title="方法名称"></vxe-column>
        <vxe-column field="methodCode" title="方法编码"></vxe-column>
        <vxe-column title="操作" width="200">
          <template #default="{ row }">
            <vxe-button
              mode="text"
              status="primary"
              icon="vxe-icon-edit"
              @click="editRow('A', row)"
              >编辑
            </vxe-button>
            <vxe-button
              mode="text"
              status="error"
              icon="vxe-icon-delete"
              @click="removeRow('A', row)"
              >删除
            </vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <vxe-modal
      resize
      destroy-on-close
      show-footer
      v-model="showEditPopupA"
      :title="selectRow ? '编辑' : '新增'"
      width="60vw"
      height="60vh"
      :loading="loading"
      :confirm-closable="false"
    >
      <vxe-form
        ref="formRefA"
        v-bind="formOptionsA"
        @submit="confirmEventA"
        @reset="resetEvent"
      >
        <template #region="{ data }">
          <vxe-tree-select
            @change="handleMethodChange"
            v-model="data.methodName"
            :tree-config="{
              trigger: 'node',
              radioConfig: {
                checkMethod({ node }) {
                  return !node.children || !node.children.length;
                },
              },
            }"
            :options="methodTreeData"
          ></vxe-tree-select>
        </template>
      </vxe-form>
    </vxe-modal>

    <div style="margin-top: 10px; ">
      <vxe-tip status="primary">功能字段明细</vxe-tip>
      <div style="margin-top: -10px;">
        <vxe-button
          style="margin: 10px 0;"
          status="primary"
          icon="vxe-icon-add"
          @click="addEvent('B')"
          >新增</vxe-button
        >
        <!-- <vxe-button
          status="error"
          icon="vxe-icon-delete"
          @click="deleteEvent('B')"
          >删除</vxe-button
        > -->
      </div>
      <vxe-table
        border
        show-overflow
        height="300"
        :data="tableDataB"
        ref="tableRefB"
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column
          field="columnId"
          title="字段ID"
          :edit-render="{ name: 'input' }"
          :visible="false"
        ></vxe-column>
        <vxe-column field="columnName" title="字段名称"></vxe-column>
        <vxe-column field="columnCode" title="字段编号"></vxe-column>
        <vxe-column field="columnType" title="字段类型"></vxe-column>
        <vxe-column title="操作" width="200">
          <template #default="{ row }">
            <vxe-button
              mode="text"
              status="primary"
              icon="vxe-icon-edit"
              @click="editRow('B', row)"
              >编辑
            </vxe-button>
            <vxe-button
              mode="text"
              status="error"
              icon="vxe-icon-delete"
              @click="removeRow('B', row)"
              >删除
            </vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <vxe-modal
      resize
      destroy-on-close
      show-footer
      v-model="showEditPopupB"
      :title="selectRow ? '编辑' : '新增'"
      width="60vw"
      height="60vh"
      :loading="loading"
      :confirm-closable="false"
    >
      <vxe-form
        ref="formRefB"
        v-bind="formOptionsB"
        @submit="confirmEventB"
        @reset="resetEvent"
      ></vxe-form>
    </vxe-modal>
  </div>
</template>

<script>
import {
  getFunctionDetail,
  saveTree,
  deleteTree,
  saveColumn,
  deleteColumn,
  allDataService,
} from "@/api/functionGenerator";
import messageHandler from "@/core/Message";
import XEUtils from "xe-utils";
import { VxeUI } from "vxe-pc-ui";

const defaultDataA = {
  treeId: "",
  orderIndex: 1,
  treeName: "",

  moduleName: "",
  moduleCode: "",
  objectName: "",
  objectCode: "",
  methodName: "",
  methodCode: "",

  treeIdColumn: "",
  treeTextColumn: "",
};
const defaultDataB = {
  columnId: "",
  orderIndex: 1,
  columnCode: "",
  columnName: "",
  columnType: "",
  defaultValue: "",
  maxLength: 100,
  decimalLength: 0,
  required: null,
  unique: null,
  addEdit: null,
  modifyEdit: null,
  displayStyle: "",
  gridColumn: null,
  formGroupName: "",
};
export default {
  name: "interfaceSetting",
  props: ["funData"],
  data() {
    const trueFalseSel = {
      name: "VxeSelect",
      options: [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
    };
    const treeTypeSel = {
      name: "VxeSelect",
      options: [
        { label: "关联", value: "relevance" },
        { label: "搜索", value: "realtion" },
      ],
    };
    const treeMethodSel = {
      name: "VxeSelect",
      options: [
        { label: "默认获取", value: "usual" },
        { label: "按组织机构", value: "dept" },
      ],
    };
    const formOptionsA = {
      titleWidth: 130,
      titleAlign: "right",
      titleColon: true,
      data: XEUtils.clone(defaultDataA, true),
      rules: {
        treeName: [{ required: true, message: "请输入树名称" }],
        moduleName: [{ required: true, message: "请输入套件名称" }],
        moduleCode: [{ required: true, message: "请输入套件标识符" }],
        objectName: [{ required: true, message: "请输入数据对象名称" }],
        objectCode: [{ required: true, message: "请输入数据对象编码" }],
        methodName: [{ required: true, message: "请输入方法名称" }],
        methodCode: [{ required: true, message: "请输入方法编号" }],
      },
      items: [
        {
          field: "treeId",
          title: "树id",
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
          itemRender: {
            name: "VxeInput",
            props: {
              disabled: true,
            },
          },
        },
        {
          field: "objectCode",
          title: "数据对象编码",
          span: 6,
          itemRender: {
            name: "VxeInput",
            props: {
              disabled: true,
            },
          },
        },
        {
          field: "methodName",
          title: "方法名称",
          span: 6,
          slots: { default: "region" },
          itemRender: {},
        },
        {
          field: "methodCode",
          title: "方法编码",
          span: 6,
          itemRender: {
            name: "VxeInput",
            props: {
              disabled: true,
            },
          },
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
    };
    const formOptionsB = {
      titleWidth: 130,
      titleAlign: "right",
      titleColon: true,
      data: XEUtils.clone(defaultDataB, true),
      rules: {
        columnCode: [{ required: true, message: "请输入字段编码" }],
        columnName: [{ required: true, message: "请输入字段名称" }],
        columnType: [{ required: true, message: "请输入字段类型" }],
        maxLength: [{ required: true, message: "请输入最大长度" }],
        decimalLength: [{ required: true, message: "请输入小数位长度" }],
        required: [{ required: true, message: "请输入必填？" }],
        unique: [{ required: true, message: "请输入唯一？" }],
        gridColumn: [{ required: true, message: "请输入是否在表格中显示" }],
        addEdit: [{ required: true, message: "请输入新增可编辑？" }],
        modifyEdit: [{ required: true, message: "请输入修改可编辑？" }],
      },
      items: [
        {
          field: "columnId",
          title: "字段id",
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
        { field: "unique", title: "唯一？", span: 6, itemRender: trueFalseSel },
        {
          field: "required",
          title: "必填？",
          span: 6,
          itemRender: trueFalseSel,
        },
        {
          field: "addEdit",
          title: "新增可编辑？",
          span: 6,
          itemRender: trueFalseSel,
        },
        {
          field: "modifyEdit",
          title: "修改可编辑？",
          span: 6,
          itemRender: trueFalseSel,
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
          field: "displayStyle",
          title: "显示格式",
          span: 6,
          itemRender: { name: "VxeInput" },
        },
        {
          field: "gridColumn",
          title: "表格中显示?",
          span: 6,
          itemRender: trueFalseSel,
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
    };
    return {
      formData: {
        moduleName: "",
        moduleCode: "",
        functionCode: "",
      },
      tableDataA: [],
      tableDataB: [],

      methodTreeData: [], // 存储方法下拉树数据

      trueFalseSel,
      treeTypeSel,
      treeMethodSel,

      formOptionsA,
      formOptionsB,

      loading: false,
      selectRow: undefined,
      showEditPopupA: false,
      showEditPopupB: false,
    };
  },
  watch: {
    funData: {
      handler(newValue) {
        this.formData.moduleName = newValue.moduleName;
        this.formData.moduleCode = newValue.moduleCode;
        this.formData.functionCode = newValue.functionCode;
        this.formData.functionType = newValue.functionType;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getDetail();
  },
  destroyed() {
    this.methodTreeData = []
  },
  methods: {
    // 获取方法下拉树数据
    async fetchMethodTreeData() {
      // 假设这里是从你提供的JSON数据中转换
      ;
      const treeData = [];
      let data = await allDataService();
      let module = data.data.find((x) => {
        return (
          x.moduleCode == this.funData.moduleCode &&
          x.moduleName == this.funData.moduleName
        );
      });
      // 转换为树结构

      module.dataObjectList.forEach((obj) => {
        const objNode = {
          label: obj.objectName,
          value: obj.objectCode,
          objectCode: obj.objectCode,
          objectName: obj.objectName,
          moduleCode: module.moduleCode,
          moduleName: module.moduleName,
          children: [],
        };

        obj.methodList.forEach((method) => {
          objNode.children.push({
            label: method.methodName,
            value: `${module.moduleCode}-${obj.objectCode}-${method.methodCode}`,
            methodCode: method.methodCode,
            methodName: method.methodName,
            objectCode: obj.objectCode,
            objectName: obj.objectName,
            moduleCode: module.moduleCode,
            moduleName: module.moduleName,
          });
        });

        treeData.push(objNode);
      });

      this.methodTreeData = treeData;
    },

    // 下拉树选择改变事件
    handleMethodChange(params) {
      // 查找选中的方法数据
      let selectedMethod = null;

      // 遍历查找选中的节点
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
      ;

      if (selectedMethod) {
        // 更新表单数据
        this.formOptionsA.data = Object.assign({}, this.formOptionsA.data, {
          objectName: selectedMethod.objectName,
          objectCode: selectedMethod.objectCode,
          methodCode: selectedMethod.methodCode,
          methodName: selectedMethod.methodName,
          moduleName: selectedMethod.moduleName,
          moduleCode: selectedMethod.moduleCode,
        });
      }
    },

    // 下一步操作
    submitEvent() {
      // var ft = this.formData.functionType;
      // if (ft == "tree-grid" || ft == "tree-grid-form") {
      //   if (!this.tableDataA) {
      //     messageHandler.notifyWarning("您选择模板为树形，请进行树配置！");
      //     return;
      //   }
      // }
      this.$parent.next();
    },
    addEvent(type) {
      this.selectRow = undefined;
      if (type == "A") {
        if(!this.methodTreeData.length){
          this.fetchMethodTreeData();
        }
        this.formOptionsA.data = XEUtils.clone(defaultDataA, true);
        this.showEditPopupA = true;
      } else {
        this.formOptionsB.data = XEUtils.clone(defaultDataB, true);
        this.showEditPopupB = true;
      }
    },
    deleteEvent(type) {
      const $tableA = this.$refs.tableRefA;
      const $tableB = this.$refs.tableRefB;
      if (type == "A") {
        const data = $tableA.getCheckboxRecords();
        const d = [];
        if (data.length !== 0) {
          for (var i = 0; i < data.length; i++) {
            d.push(data[i].treeId);
          }
          const param = this.getModuleRelatedParams();
          param.treeIds = d;
          this.deleteList("A", param);
          $tableA.removeCheckboxRow();
        }
      } else {
        const data = $tableB.getCheckboxRecords();
        const d = [];
        if (data.length !== 0) {
          for (var i = 0; i < data.length; i++) {
            d.push(data[i].columnId);
          }
          const param = this.getModuleRelatedParams();
          param.columnIds = d;
          this.deleteList("B", param);
          $tableB.removeCheckboxRow();
        }
      }
    },
    editRow(type, row) {
      this.selectRow = row;
      if (type == "A") {
        this.formOptionsA.data = Object.assign(
          XEUtils.clone(defaultDataA, true),
          row
        );
        this.showEditPopupA = true;
      } else {
        this.formOptionsB.data = Object.assign(
          XEUtils.clone(defaultDataB, true),
          row
        );
        this.showEditPopupB = true;
      }
    },

    // 传递param
    getModuleRelatedParams() {
      return {
        moduleName: this.formData.moduleName,
        moduleCode: this.formData.moduleCode,
        functionCode: this.formData.functionCode,
      };
    },

    // 保存事件预处理
    saveRow(type, data) {
      if (data) {
        const param = this.getModuleRelatedParams();
        if (type == "A") {
          param.treeList = [
            {
              treeId: data.treeId,
              orderIndex: data.orderIndex,
              treeName: data.treeName,

              moduleName: data.moduleName,
              moduleCode: data.moduleCode,
              objectName: data.objectName,
              objectCode: data.objectCode,
              methodCode: data.methodCode,
              methodName: data.methodName,

              treeIdColumn: data.treeIdColumn,
              treeTextColumn: data.treeTextColumn,
            },
          ];
        } else {
          param.columnList = [
            {
              columnId: data.columnId,
              orderIndex: data.orderIndex,
              columnCode: data.columnCode,
              columnName: data.columnName,
              columnType: data.columnType,
              defaultValue: data.defaultValue,
              maxLength: data.maxLength,
              decimalLength: data.decimalLength,
              required: data.required,
              unique: data.unique,
              addEdit: data.addEdit,
              modifyEdit: data.modifyEdit,
              displayStyle: data.displayStyle,
              gridColumn: data.gridColumn,
              formGroupName: data.formGroupName,
            },
          ];
        }
        this.saveList(type, param);
      }
    },

    // 保存事件
    saveList(type, param) {
      if (type == "A") {
        return saveTree(param).then((res) => {
          if (res.code == "200") {
            messageHandler.notifySuccess("编辑成功！");
            this.getDetail();
          }
        });
      } else {
        return saveColumn(param).then((res) => {
          if (res.code == "200") {
            messageHandler.notifySuccess("编辑成功！");
            this.getDetail();
          }
        });
      }
    },

    // 删除事件预处理
    removeRow(type, row) {
      const $tableA = this.$refs.tableRefA;
      const $tableB = this.$refs.tableRefB;
      if (type == "A") {
        if (row.treeId) {
          const param = this.getModuleRelatedParams();
          param.treeIds = [row.treeId];
          this.deleteList("A", param);
          $tableA.remove(row);
        }
      } else {
        if (row.columnId) {
          const param = this.getModuleRelatedParams();
          param.columnIds = [row.columnId];
          this.deleteList("B", param);
          $tableB.remove(row);
        }
      }
    },

    deleteList(type, param) {
      VxeUI.modal.confirm({
        title: "删除确认",
        content: "确定要删除选中的数据吗？",
        mask: false,
        lockView: false,
        onConfirm: () => {
          if (type == "A") {
            return deleteTree(param).then((res) => {
              if (res.code == "200") {
                messageHandler.notifySuccess("删除成功！");
                this.getDetail();
              }
            });
          } else {
            return deleteColumn(param).then((res) => {
              if (res.code == "200") {
                messageHandler.notifySuccess("删除成功！");
                this.getDetail();
              }
            });
          }
        },
      });
    },
    // 获取所有事件信息
    getDetail() {
      const param = this.getModuleRelatedParams();
      return getFunctionDetail(param).then((res) => {
        if (res.code == "200") {
          this.tableDataA = res.data.treeList;
          this.tableDataB = res.data.columnList;
        }
      });
    },
    resetEvent() {
      this.showEditPopupA = false;
      this.showEditPopupB = false;
    },
    async confirmEventA() {
      const $formA = this.$refs.formRefA;
      if ($formA) {
        const errMap = await $formA.validate();
        if (!errMap) {
          this.showEditPopupA = false;
          this.saveRow("A", $formA.data);
        }
      }
    },
    async confirmEventB() {
      const $formB = this.$refs.formRefB;
      if ($formB) {
        const errMap = await $formB.validate();
        if (!errMap) {
          this.showEditPopupB = false;
          this.saveRow("B", $formB.data);
        }
      }
    },
  },
};
</script>

<style>
/* .next-button {
    position: fixed;
    right: 40px;
    bottom: 20px;
    float: none;
    z-index: 12;
} */
</style>
