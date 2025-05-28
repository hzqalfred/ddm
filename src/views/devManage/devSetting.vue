<!-- 套件管理 -->
<template>
  <div>
    <vxe-button style="margin:10px 0" status="primary" @click="saveSetting"
      >保存</vxe-button
    >
    <div>
      <vxe-tip status="primary">模块配置</vxe-tip>
      <vxe-table
        border
        show-overflow
        keep-source
        ref="moduleTableRef"
        empty-text="没有更多数据了！"
        :data="settingList"
        :edit-config="{
          trigger: 'click',
          mode: 'cell',
          beforeEditMethod: ({row,rowIndex,column,columnIndex}) => {
            if (column.field === '') {
              return true;
            }
            if (column.field ==='settingType') {
              return false;
            }
            return true;
          }
        }"
      >
        <vxe-column type="seq" width="55"></vxe-column>
        <vxe-column
          field="settingType"
          title="类型"
          :edit-render="settingTypeSelect"
        >
        </vxe-column>
        <vxe-column
          field="settingItem"
          title="配置项"
        ></vxe-column>
        <vxe-column field="settingValue" title="标识符" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input
                v-if="row.settingType == 'moduleAttribute'"
                v-model="row.settingValue"
            ></vxe-input>
            <vxe-select
                v-else
                transfer
                @click="getOptionsFunc(row.settingType)"
                v-model="row.settingValue"
                :options="settingValueOptions"
            ></vxe-select>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <div>
      <vxe-tip status="primary">功能清单</vxe-tip>
      <vxe-table
        border
        show-overflow
        keep-source
        ref="FunctionTableRef"
        empty-text="没有更多数据了！"
        :data="functionList"
        :edit-config="{
          trigger: 'click',
          mode: 'cell',
        }"
      >
        <vxe-column type="seq" width="55"></vxe-column>
        <vxe-column
          field="functionName"
          title="功能名称"
        ></vxe-column>
        <vxe-column
          field="functionCode"
          title="功能标识符"
        ></vxe-column>
        <vxe-column
          field="dataSource"
          title="数据源"
          :edit-render="{ name: 'input' }"
        >
        </vxe-column>
      </vxe-table>
    </div>
    <div>
      <vxe-tip status="primary">数据权限设置</vxe-tip>
      <vxe-table
          border
          show-overflow
          keep-source
          ref="dataPrivilegeTableRef"
          empty-text="没有更多数据了！"
          :data="dataPrivilegeList"
          :edit-config="{
          trigger: 'click',
          mode: 'cell',
        }"
      >
        <vxe-column type="seq" width="55"></vxe-column>
        <vxe-column
            field="functionCode"
            width="120"
            title="功能标识符"
        ></vxe-column>
        <vxe-column
            field="privilegeName"
            width="120"
            title="权限名称"
        ></vxe-column>
        <vxe-column
            field="privilegeCode"
            width="120"
            title="权限编码"
        ></vxe-column>
        <vxe-column
            field="dataSource"
            title="数据源"
            :edit-render="{ name: 'input' }"
        ></vxe-column>
        <vxe-column
            field="sourceColumn"
            width="120"
            title="来源字段"
            :edit-render="{ name: 'input' }"
        ></vxe-column>
        <vxe-column
            field="textColumn"
            width="120"
            title="显示字段"
            :edit-render="{ name: 'input' }"
        ></vxe-column>
      </vxe-table>
    </div>
    <div>
      <vxe-tip status="primary">功能参数设置</vxe-tip>
      <vxe-table
          border
          show-overflow
          keep-source
          ref="functionParamListTableRef"
          empty-text="没有更多数据了！"
          :data="functionParamList"
          :edit-config="{
          trigger: 'click',
          mode: 'cell',
        }"
      >
        <vxe-column type="seq" width="55"></vxe-column>
        <vxe-column
            field="functionCode"
            width="120"
            title="功能标识符"
        ></vxe-column>
        <vxe-column
            field="paramCode"
            width="120"
            title="参数编码"
        ></vxe-column>
        <vxe-column
            field="paramName"
            width="120"
            title="参数名称"
        ></vxe-column>
        <vxe-column
            field="paramValue"
            title="参数值"
            :edit-render="{ name: 'input' }"
        ></vxe-column>
      </vxe-table>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
import { getModuleSetting, saveModuleSetting } from "@/api/devManage";
import messageHandler from "@/core/Message";
import { VxeUI } from "vxe-pc-ui";
// Props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const settingTypeSelect = {
  name: "VxeSelect",
  options: [
    { label: "提供界面", value: "providePage" },
    { label: "引用界面", value: "referencePage" },
    { label: "回调接口", value: "callbackInterface" },
    { label: "数据接口", value: "dataInterface" },
    { label: "属性", value: "moduleAttribute" },
  ],
};

const homePage = ref(null);

const settingList = ref([]);
const functionList = ref([]);
const functionTableData = ref([]);
const dataPrivilegeList = ref([]);
const functionParamList = ref([]);

// 获取套件列表数据
const fetchData = () => {
  let data = props.data;
  let { param = {} } = data;
  getModuleSetting({
    moduleName: param.moduleName,
    moduleCode: param.moduleCode,
  }).then((res) => {
    if (res.success) {
      settingList.value = res.data?.settingList;
      functionList.value = res.data?.functionList;
      dataPrivilegeList.value = res.data?.dataPrivilegeList;
      functionParamList.value = res.data?.functionParamList;
    }
  });
};

const getOptionsFunc = (value) => {
  switch (value) {
    case "providePage":
      settingValueOptions.value = functionTableData.value.map((x) => ({
        value: x.functionName + " - " + x.functionCode,
        label: x.functionName + " - " + x.functionCode,
      }));
      break;
    case "referencePage":
      let referenceArr = [];
      referenceOptions.value.map((reference) => {
        reference.providePageList.map((x) => {
          referenceArr.push({
            value: `${reference.moduleName} - ${reference.moduleCode} - ${x.functionName} - ${x.functionCode}`,
            label: `${reference.moduleName} - ${reference.moduleCode} - ${x.functionName} - ${x.functionCode}`,
          });
        });
      });
      console.log(referenceOptions.value);
      settingValueOptions.value = referenceArr;
      break;
    case "dataInterface":
      let dataInterfaceArr = [];
      dataInterfaceOptions.value.map((dataObject) => {
        dataObject.methodList.map((method) => {
          dataInterfaceArr.push({
            value: `${dataObject.objectCode} - ${method.methodCode}`,
            label: `${dataObject.objectCode} - ${method.methodCode}`,
          });
        });
      });
      console.log(dataInterfaceOptions.value);
      settingValueOptions.value = dataInterfaceArr;
      break;
    case "callbackInterface":
      let callbackInterfaceArr = [];
      moduleSettingCallbackInterfaceOptions.value.map((callbackInterface) => {
        callbackInterface.dataObjectMethodList.map((dataObjectMethod) => {
          callbackInterfaceArr.push({
            value: `${callbackInterface.moduleName} - ${callbackInterface.moduleCode} - ${dataObjectMethod.objectCode} - ${dataObjectMethod.methodCode}`,
            label: `${callbackInterface.moduleName} - ${callbackInterface.moduleCode} - ${dataObjectMethod.objectCode} - ${dataObjectMethod.methodCode}`,
          });
        });
      });
      console.log(moduleSettingCallbackInterfaceOptions.value);
      settingValueOptions.value = callbackInterfaceArr;
      break;
    default:
      settingValueOptions.value = [];
  }
  return settingValueOptions;
};

const saveSetting = () => {
  let data = props.data;
  let { param = {} } = data;
  let params = {
    moduleName: param.moduleName,
    moduleCode: param.moduleCode,
    settingList: settingList.value,
    functionList: functionList.value,
    dataPrivilegeList: dataPrivilegeList.value,
    functionParamList: functionParamList.value,
  };
  saveModuleSetting(params)
    .then((res) => {
      messageHandler.notifyInfo(res.msg);
    })
    .finally(() => {
      fetchData();
    });
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
