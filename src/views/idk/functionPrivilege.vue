<!-- 套件管理 -->
<template>
  <div>
    <div>
      <vxe-tip status="primary">操作权限定义</vxe-tip>
      <div style="margin-bottom: 20px;">
        <vxe-button
            status="primary"
            content="新增"
            @click="handleOperationPrivilegeAdd()"
        ></vxe-button>
        <vxe-button
            status="error"
            content="删除"
            @click="handleOperationPrivilegeDel()"
        ></vxe-button>
        <vxe-button
            status="success"
            content="保存"
            @click="handleOperationPrivilegeValidateAndSave()"
        ></vxe-button>
      </div>
      <vxe-table
        border
        show-overflow
        keep-source
        ref="operationPrivilegeTableRef"
        empty-text="没有更多数据了！"
        :data="operationPrivilegeData"
        :edit-config="{
          trigger: 'click',
          mode: 'cell',
        }"
        :edit-rules="operationPrivilegeRules"
      >
        <vxe-column type="checkbox" width="42"></vxe-column>
        <vxe-column
            field="orderIndex"
            title="排序"
            :edit-render="{ name: 'VxeInput', props: { type: 'integer' } }"
            width="120"
        ></vxe-column>
        <vxe-column
            field="privilegeName"
            title="权限名称"
            width="120"
            :edit-render="{ name: 'input' }"
        ></vxe-column>
        <vxe-column
            field="privilegeCode"
            title="权限编码"
            width="120"
            :edit-render="{ name: 'input' }"
        ></vxe-column>
        <vxe-column
            field="pageElement"
            title="界面元素"
            :edit-render="{ name: 'input' }"
        ></vxe-column>
        <vxe-column
            field="dataService"
            title="数据服务"
            :edit-render="{ name: 'input' }"
        ></vxe-column>
      </vxe-table>
    </div>
    <div>
      <vxe-tip status="primary">数据权限定义</vxe-tip>
      <div style="margin-bottom: 20px;">
        <vxe-button
            status="primary"
            content="新增"
            @click="handleDataPrivilegeAdd()"
        ></vxe-button>
        <vxe-button
            status="error"
            content="删除"
            @click="handleDataPrivilegeDel()"
        ></vxe-button>
        <vxe-button
            status="success"
            content="保存"
            @click="handleDataPrivilegeValidateAndSave()"
        ></vxe-button>
      </div>
      <vxe-table
        border
        show-overflow
        keep-source
        ref="dataPrivilegeTableRef"
        empty-text="没有更多数据了！"
        :data="dataPrivilegeData"
        :edit-config="{
          trigger: 'click',
          mode: 'cell',
        }"
        :edit-rules="dataPrivilegeRules"
      >
        <vxe-column type="checkbox" width="42"></vxe-column>
        <vxe-column
            field="orderIndex"
            title="排序"
            :edit-render="{ name: 'VxeInput', props: { type: 'integer' } }"
            width="120"
        ></vxe-column>
        <vxe-column
            field="privilegeName"
            title="权限名称"
            :edit-render="{ name: 'input' }"
        ></vxe-column>
        <vxe-column
            field="privilegeCode"
            title="权限编码"
            :edit-render="{ name: 'input' }"
        ></vxe-column>
      </vxe-table>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
import messageHandler from "@/core/Message";
import {
  deleteOperationPrivilege,
  getFunctionDetail,
  saveOperationPrivilege,
  saveDataPrivilege,
  deleteDataPrivilege
} from "@/api/suiteManage";
import { VxeUI } from "vxe-pc-ui";
// Props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const homePage = ref(null);

const operationPrivilegeTableRef = ref(null);
const dataPrivilegeTableRef = ref(null);

const operationPrivilegeData = ref([]);
const dataPrivilegeData = ref([]);

const dataPrivilegeRules = {
  privilegeName: [{ required: true, message: "必须填写" }],
  privilegeCode: [{ required: true, message: "必须填写" }],
};

const operationPrivilegeRules = {
  privilegeName: [{ required: true, message: "必须填写" }],
  privilegeCode: [{ required: true, message: "必须填写" }],
};

// 获取套件列表数据
const fetchData = () => {
  let data = props.data;
  let { param = {} } = data;
  getFunctionDetail({
    moduleName: param.moduleName,
    moduleCode: param.moduleCode,
    functionCode: param.functionCode,
  }).then((res) => {
    if (res.success) {
      operationPrivilegeData.value = res.data.operationPrivilegeList;
      dataPrivilegeData.value = res.data.dataPrivilegeList;
    }
  });
};

const handleOperationPrivilegeAdd = async () => {
  const record = {};
  const { row: newRow } = await operationPrivilegeTableRef.value.insert(record);
  await operationPrivilegeTableRef.value.setEditCell(newRow);
};

const handleOperationPrivilegeDel = async () => {
  const removeRecords = operationPrivilegeTableRef.value.getCheckboxRecords();
  if (removeRecords.length === 0) return;

  VxeUI.modal.confirm({
    title: "删除操作权限定义",
    content: "是否删除操作权限定义",
    draggable: false,
    onConfirm: async () => {
      try {
        let {param = {}} = props.data;
        const params = {
          moduleName: param.moduleName,
          moduleCode: param.moduleCode,
          functionCode: param.functionCode,
          operationPrivilegeIds: removeRecords.map((record) => record.privilegeId),
        };
        await deleteOperationPrivilege(params).then((res) => {
          messageHandler.notifySuccess("删除成功");
        });
        fetchData();
      } catch (error) {
        messageHandler.notifyError("删除失败");
      }
    },
  });
};

const handleOperationPrivilegeValidateAndSave = async () => {
  const errMap = await operationPrivilegeTableRef.value.validate(true);
  if (errMap) {
    messageHandler.notifyWarning("请检查表单数据，填写完整后再提交");
    return;
  }
  // 获取要保存的数据
  const insertRecords = operationPrivilegeTableRef.value.getInsertRecords();
  const updateRecords = operationPrivilegeTableRef.value.getUpdateRecords();

  // 判断是否有要保存的数据
  if (insertRecords.length === 0 && updateRecords.length === 0) {
    messageHandler.notifyInfo("没有需要保存的数据");
    return;
  }
  let insertAndUpdateRecords = [...insertRecords, ...updateRecords];
  let { param = {} } = props.data;
  const params = {
    moduleName: param.moduleName,
    moduleCode: param.moduleCode,
    functionCode: param.functionCode,
    operationPrivilegeList: insertAndUpdateRecords,
  };
  const res = await saveOperationPrivilege(params);
  if (res.code === "200" || res.success) {
    messageHandler.notifySuccess("保存成功");
    fetchData();
  } else {
    messageHandler.notifyError("保存失败");
  }
};

const handleDataPrivilegeAdd = async () => {
  const record = {};
  const { row: newRow } = await dataPrivilegeTableRef.value.insert(record);
  await dataPrivilegeTableRef.value.setEditCell(newRow);
};

const handleDataPrivilegeDel = async () => {
  const removeRecords = dataPrivilegeTableRef.value.getCheckboxRecords();
  if (removeRecords.length === 0) return;

  VxeUI.modal.confirm({
    title: "删除数据权限定义",
    content: "是否删除数据权限定义",
    draggable: false,
    onConfirm: async () => {
      try {
        let {param = {}} = props.data;
        const params = {
          moduleName: param.moduleName,
          moduleCode: param.moduleCode,
          functionCode: param.functionCode,
          dataPrivilegeIds: removeRecords.map((record) => record.privilegeId),
        };
        await deleteDataPrivilege(params).then((res) => {
          messageHandler.notifySuccess("删除成功");
        });
        fetchData();
      } catch (error) {
        messageHandler.notifyError("删除失败");
      }
    },
  });
};

const handleDataPrivilegeValidateAndSave = async () => {
  const errMap = await dataPrivilegeTableRef.value.validate(true);
  if (errMap) {
    messageHandler.notifyWarning("请检查表单数据，填写完整后再提交");
    return;
  }
  // 获取要保存的数据
  const insertRecords = dataPrivilegeTableRef.value.getInsertRecords();
  const updateRecords = dataPrivilegeTableRef.value.getUpdateRecords();

  // 判断是否有要保存的数据
  if (insertRecords.length === 0 && updateRecords.length === 0) {
    messageHandler.notifyInfo("没有需要保存的数据");
    return;
  }
  let insertAndUpdateRecords = [...insertRecords, ...updateRecords];
  let { param = {} } = props.data;
  const params = {
    moduleName: param.moduleName,
    moduleCode: param.moduleCode,
    functionCode: param.functionCode,
    dataPrivilegeList: insertAndUpdateRecords,
  };
  const res = await saveDataPrivilege(params);
  if (res.code === "200" || res.success) {
    messageHandler.notifySuccess("保存成功");
    fetchData();
  } else {
    messageHandler.notifyError("保存失败");
  }
};

onMounted(() => {
  homePage.value = inject("homePage");
  fetchData();
});
</script>

<style lang="scss">
.vxe-input--suffix {
  height: var(--vxe-select-option-height-small) !important;
  margin-top: 1px;
}
</style>
