<!--  编辑套件/新增套件 -->
<template>
  <div>
    <!-- Basic Settings Section -->
    <div
      style="padding: 0 20px 20px 20px; display: flex; flex-direction: column;"
    >
      <vxe-toolbar
        :buttons="toolbarButtons"
        @button-click="handleToolbarClick"
      ></vxe-toolbar>

      <div style="display: flex; align-items: start;">
        <!-- 表单区域 -->
        <vxe-form
          style="width: calc(100% - 220px);"
          ref="formRef"
          :data="formItemData"
          @submit="handleSubmit"
          @reset="handleReset"
        >
          <!-- 原有的模块名称、标识符和描述 -->
          <vxe-form-item title="模块名称" field="moduleName" span="9">
            <template #default="params">
              <vxe-input
                v-model="formItemData.moduleName"
                @change="handleFormChange(params)"
                :disabled="isDisabled"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="标识符" field="moduleCode" span="9">
            <template #default="params">
              <vxe-input
                v-model="formItemData.moduleCode"
                @change="handleFormChange(params)"
                :disabled="isDisabled"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <!-- 图标选择 -->
          <vxe-form-item title="模块图标" field="moduleIcon" span="6">
            <template #default="params">
              <select-icon v-model="formItemData.moduleIcon"></select-icon>
            </template>
          </vxe-form-item>
          <vxe-form-item title="模块描述" field="moduleRemark" span="24">
            <template #default="params">
              <vxe-textarea
                v-model="formItemData.moduleRemark"
                resize="none"
                @change="handleFormChange(params)"
                :autosize="{ minRows: 2, maxRows: 2 }"
              ></vxe-textarea>
            </template>
          </vxe-form-item>
        </vxe-form>
        <!-- 大图标区域 -->
        <div
          style="width: 150px; height:150px; margin-left: 20px; display: flex; justify-content: center; align-items: center; border: 2px dashed #ccc;"
        >
          <SvgIcon
            v-if="formItemData.moduleIcon"
            :size="'80%'"
            :iconClass="formItemData.moduleIcon"
          />
          <img
            v-else
            style="max-width: 100%; max-height: 100%; object-fit: contain;"
          />
        </div>
      </div>
    </div>

    <!-- Tab Section -->
    <vxe-tabs height="75%" :options="tabList" type="border-card">
      <!-- Module Settings Tab -->
      <template #default2>
        <div style="padding: 20px;">
          <vxe-tip status="primary">基础设置</vxe-tip>
          <div style="margin-bottom: 20px;">
            <vxe-button
              status="primary"
              content="新增"
              @click="handleModuleAction('add')"
              :disabled="!formStatus"
            ></vxe-button>
            <vxe-button
              status="error"
              content="删除"
              @click="handleModuleAction('del')"
              :disabled="!formStatus"
            ></vxe-button>
            <vxe-button
              status="success"
              content="保存"
              @click="handleModuleAction('save')"
              :disabled="!formStatus"
            ></vxe-button>
          </div>

          <vxe-table
            border
            show-overflow
            keep-source
            ref="moduleTableRef"
            empty-text="没有更多数据了！"
            :edit-config="{
              trigger: 'click',
              mode: 'row',
              beforeEditMethod: () => formStatus,
            }"
            :data="moduleTableData"
            :edit-rules="moduleValidRules"
          >
            <vxe-column type="checkbox" width="42"></vxe-column>
            <vxe-column type="seq" width="55"></vxe-column>
            <vxe-column
              field="settingId"
              title="ID"
              :edit-render="{ name: 'input' }"
              :visible="false"
            ></vxe-column>
            <vxe-column
              field="settingType"
              title="类型"
              :edit-render="settingTypeSelect"
            ></vxe-column>
            <vxe-column
              field="settingItem"
              title="配置项"
              :edit-render="{ name: 'input' }"
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
            <vxe-column
              field="settingRemark"
              title="说明"
              :edit-render="{ name: 'input' }"
            ></vxe-column>
            <vxe-column
              field="relatingModuleName"
              title="模块名称"
              :edit-render="{ name: 'input' }"
              :visible="false"
            ></vxe-column>
            <vxe-column
              field="relatingModuleCode"
              title="模块标识符"
              :edit-render="{ name: 'input' }"
              :visible="false"
            ></vxe-column>
            <vxe-column
              field="relatingFunctionName"
              title="功能名称"
              :edit-render="{ name: 'input' }"
              :visible="false"
            ></vxe-column>
            <vxe-column
              field="relatingFunctionCode"
              title="功能标识符"
              :edit-render="{ name: 'input' }"
              :visible="false"
            ></vxe-column>
          </vxe-table>
        </div>
        <div style="padding: 20px;">
          <vxe-tip status="primary">数据权限定义</vxe-tip>
          <div style="margin-bottom: 20px;">
            <vxe-button
              status="primary"
              content="新增"
              @click="handlePrivilegeAction('add')"
              :disabled="!formStatus"
            ></vxe-button>
            <vxe-button
              status="error"
              content="删除"
              @click="handlePrivilegeAction('del')"
              :disabled="!formStatus"
            ></vxe-button>
            <vxe-button
              status="success"
              content="保存"
              @click="handlePrivilegeAction('save')"
              :disabled="!formStatus"
            ></vxe-button>
          </div>

          <vxe-table
            border
            show-overflow
            keep-source
            ref="privilegeRef"
            empty-text="没有更多数据了！"
            :edit-config="{
              trigger: 'click',
              mode: 'row',
              beforeEditMethod: () => formStatus,
            }"
            :data="privilegeData"
            :edit-rules="privilegeRules"
          >
            <vxe-column type="checkbox" width="42"></vxe-column>
            <vxe-column
              field="privilegeId"
              title="ID"
              :edit-render="{ name: 'input' }"
              :visible="false"
            ></vxe-column>
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
      </template>

      <!-- Function Settings Tab -->
      <template #default1>
        <div style="padding: 20px;">
          <div style="margin-bottom: 20px;">
            <vxe-button
              status="primary"
              content="新增"
              @click="handleFunctionAction('add')"
              :disabled="!formStatus"
            ></vxe-button>
            <vxe-button
              status="success"
              content="保存"
              @click="handleFunctionAction('save')"
              :disabled="!formStatus"
            ></vxe-button>
            <vxe-button
              content="功能向导"
              @click="handleFunctionAction('guide')"
              :disabled="!formStatus"
            ></vxe-button>
          </div>

          <vxe-table
            border
            show-overflow
            keep-source
            ref="functionTableRef"
            empty-text="没有更多数据了！"
            :edit-config="{
              trigger: 'click',
              mode: 'row',
              showStatus: true,
              beforeEditMethod: () => formStatus,
            }"
            :data="functionTableData"
            :edit-rules="functionValidRules"
            :radio-config="{ labelField: 'seq', highlight: true }"
          >
            <vxe-column type="radio" width="55"></vxe-column>
            <vxe-column
              field="functionId"
              title="ID"
              :edit-render="{ name: 'input' }"
              :visible="false"
            ></vxe-column>
            <vxe-column
              field="functionName"
              title="功能名称"
              :edit-render="{ name: 'input' }"
            ></vxe-column>
            <vxe-column
              field="functionCode"
              title="功能标识符"
              :edit-render="{ name: 'input' }"
            ></vxe-column>
            <vxe-column
              field="menuFunction"
              title="是否菜单"
              :edit-render="{
                name: 'VxeSelect',
                options: [
                  { value: true, label: '是' },
                  { value: false, label: '否' },
                ],
              }"
            ></vxe-column>
            <vxe-column
              field="orderIndex"
              title="排序"
              :edit-render="{ name: 'VxeInput', props: { type: 'integer' } }"
            ></vxe-column>
            <vxe-column title="操作" fixed="right" width="300">
              <template #default="{ row }">
                <!-- <vxe-button mode="text" status="primary" @click="handleInterfaceDesign(row, 'guide')">功能设计</vxe-button> -->
                <vxe-button
                  mode="text"
                  status="primary"
                  @click="handleInterfaceDesign(row, 'design')"
                  >界面设计</vxe-button
                >
                <vxe-button
                  mode="text"
                  status="primary"
                  @click="handleFunctionPrivilege(row)"
                  >权限定义</vxe-button
                >
                <vxe-button
                  mode="text"
                  status="error"
                  @click="handleRemoveFunction(row)"
                  >删除</vxe-button
                >
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </template>

      <!-- Designer Tab -->
      <template #default3>
        <designer :formStatus="formStatus" :formData="formData" />
      </template>

      <!-- Designer Tab -->
      <template #default4>
        <wflow :formStatus="formStatus" :formData="formData" />
      </template>
    </vxe-tabs>

    <!-- Function Generator Modal -->
    <vxe-modal
      v-model="showGuidePopup"
      width="100%"
      height="100%"
      :before-hide-method="handleGuideClose"
    >
      <template #title>
        <div>功能设计</div>
      </template>
      <function-generator
        :key="guideKey"
        :modData="guideData"
        @generateData="reloadJson"
      ></function-generator>
    </vxe-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch, provide } from "vue";
import {
  getModuleList,
  getModuleDetail,
  saveModule,
  saveSetting,
  saveFunction,
  deleteSetting,
  deleteFunction,
  packModule,
  uploadIcon,
  getIcon,
  deleteIcon,
  getFunctionDetail,
  referencePageOptions,
  getModuleDataService,
  getCallbackInterfaceOptions,
  deletePrivilege,
  savePrivilege,
} from "@/api/suiteManage";
// import { saveBaseInfo } from "@/api/functionGenerator";
import SelectIcon from "@/core/components/SelectIcon/index.vue";
import SvgIcon from "@/core/components/SvgIcon/index.vue";
import messageHandler from "@/core/Message";
import designer from "@/views/designer/index.vue";
import functionGenerator from "@/core/components/functionGenerator.vue";
import wflow from "@/views/designer/wflow/index.vue";
import axios from "axios";
import { VxeUI } from "vxe-pc-ui";
// Props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// Inject
const homePage = inject("homePage");

// Refs
const formRef = ref(null);
const moduleTableRef = ref(null);
const privilegeRef = ref(null);
const functionTableRef = ref(null);

// State
const internalFormStatus = ref(props.data?.param?.formStatus || false);
const formStatus = computed(() => internalFormStatus.value);
// const formStatus = computed(() => props.data?.param?.formStatus);
const formData = computed(() => props.data?.param?.formData);
const formItemData = ref({});
const moduleData = ref({});
const isDisabled = ref(true);
const imgList = ref([]);
const moduleTableData = ref([]);
const privilegeData = ref([]);
const functionTableData = ref([]);
const showGuidePopup = ref(false);
const guideKey = ref("");
const guideData = ref({});
const settingValueOptions = ref([]);
const referenceOptions = ref([]);
const dataInterfaceOptions = ref([]);
const moduleSettingCallbackInterfaceOptions = ref([]);

watch(
  () => formItemData.value,
  (newValue) => {
    moduleData.value = {
      moduleName: newValue.moduleName,
      moduleCode: newValue.moduleCode,
    };
  },
  { deep: true }
);

// Constants
const tabList = [
  {
    name: "1",
    title: "功能清单",
    icon: "vxe-icon-rich-text",
    slots: { default: "default1" },
  },

  {
    name: "3",
    title: "数据中心",
    icon: "vxe-icon-setting",
    slots: { default: "default3" },
  },
  {
    name: "2",
    title: "模块设置",
    icon: "vxe-icon-custom-column",
    slots: { default: "default2" },
  },
  // ,
  // {
  //   name: "4",
  //   title: "流程中心",
  //   icon: "vxe-icon-copy",
  //   slots: { default: "default4" },
  // },
];

const toolbarButtons = [
  { name: "保存", code: "save", status: "success" },
  { name: "预览", code: "preview", status: "" },
  { name: "打包", code: "pack", status: "" },
];

const settingTypeSelect = {
  name: "VxeSelect",
  options: [
    { label: "提供界面", value: "providePage" },
    { label: "引用界面", value: "referencePage" },
    { label: "回调接口", value: "callbackInterface" },
    { label: "数据接口", value: "dataInterface" },
    { label: "属性", value: "moduleAttribute" },
  ],
  events: {
    change: (cellParams, targetParams) => {
      const { row, column } = cellParams;
      row.settingValue = "";
      getOptionsFunc(row.settingType);
    },
  },
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
// const functionTypeSelect = {
//   name: "VxeSelect",
//   options: [
//     { label: "列表", value: "grid" },
//     { label: "树表", value: "tree-grid" },
//     { label: "树表单", value: "tree-grid-form" },
//     { label: "表单", value: "grid-form" },
//     { label: "卡片", value: "card" },
//     { label: "其他", value: "other" },
//   ],
// };

const moduleValidRules = {
  settingType: [{ required: true, message: "必须填写" }],
  settingItem: [{ required: true, message: "必须填写" }],
};

const functionValidRules = {
  functionName: [{ required: true, message: "必须填写" }],
  functionCode: [{ required: true, message: "必须填写" }],
  functionType: [{ required: true, message: "必须填写" }],
  orderIndex: [{ required: true, message: "必须填写" }],
};

const privilegeRules = {
  privilegeName: [{ required: true, message: "必须填写" }],
  privilegeCode: [{ required: true, message: "必须填写" }],
};

// Methods
const handleFormChange = (params) => {
  formRef.value?.updateStatus(params);
};

const handleToolbarClick = ({ code }) => {
  switch (code) {
    case "save":
      handleSave();
      break;
    case "preview":
      handlePreview();
      break;
    case "pack":
      handlePack();
      break;
  }
};

const handleSave = async () => {
  // const url = `moduleName=${formItemData.value.moduleName}&moduleCode=${formItemData.value.moduleCode}`;
  // formItemData.value.moduleIcon = url;
  try {
    await saveModule(formItemData.value);
    const param = `pageNumber=1&pageSize=100&moduleName=${formItemData.value.moduleName}`;
    const res = await getModuleList(param);
    if (formItemData.value.moduleId) {
      formItemData.value = res.data.records.find(
        (x) => x.moduleId == formItemData.value.moduleId
      );
    } else {
      formItemData.value = res.data.records[res.data.records.length - 1];
    }
    messageHandler.notifySuccess("保存成功");
    internalFormStatus.value = true;
  } catch (error) {
    messageHandler.notifyError("保存失败");
  }
};

const handlePreview = () => {
  const param = {
    moduleName: formItemData.value.moduleName,
    moduleCode: formItemData.value.moduleCode,
    moduleId: formItemData.value.moduleId,
    env: "preview",
  };

  homePage.create({
    data: {
      type: "window",
      ele: "window",
      code: "webrender",
      id: "webrender" + formItemData.value.moduleId,
      title: "界面预览",
      width: "100%",
      height: "85%",
      mask: false,
      origin: true,
      visible: true,
      param,
    },
  });
};

const handlePack = async () => {
  try {
    const param = {
      moduleName: formItemData.value.moduleName,
      moduleCode: formItemData.value.moduleCode,
    };
    const res = await axios({
      method: "post",
      url: "/api/design/manage/module/pack", // 确保URL正确
      data: param,
      responseType: "blob", // 指定responseType为blob
      headers: {
        Accept: "application/octet-stream",
      },
    });

    const blob = res.data; // 这已经是一个Blob对象
    const fileName = `${formItemData.value.moduleName}-${formItemData.value.moduleCode}.cpk`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    messageHandler.notifyError("打包失败");
  }
};

// 删除图片
const removeMethod = async () => {
  const formData = new FormData();
  formData.append("moduleName", formItemData.value.moduleName);
  formData.append("moduleCode", formItemData.value.moduleCode);
  await deleteIcon(formData);
  messageHandler.notifySuccess("图标删除成功");
};

// 上传图片
const handleUpload = async ({ file }) => {
  if (!formItemData.value.moduleName) {
    messageHandler.notifyWarning("模块名称不能为空");
    setTimeout(() => {
      imgList.value = [];
    }, 500);
    return false;
  }
  if (!formItemData.value.moduleCode) {
    messageHandler.notifyWarning("标识符不能为空");
    setTimeout(() => {
      imgList.value = [];
    }, 500);
    return false;
  }

  try {
    const formData = new FormData();
    formData.append("moduleName", formItemData.value.moduleName);
    formData.append("moduleCode", formItemData.value.moduleCode);
    formData.append("file", file);

    await uploadIcon(formData);
    messageHandler.notifySuccess("图标上传成功");

    const url = `moduleName=${formItemData.value.moduleName}&moduleCode=${formItemData.value.moduleCode}`;

    formItemData.value.moduleIcon = url;
    var urls = "/api/design/manage/module/getIcon?" + url;
    imgList.value = [{ name: "icon.png", url: urls }];

    await saveModule(formItemData.value);

    // 再获取，只为ID，后需考虑ID问题
    const param = `pageNumber=1&pageSize=100&moduleName=${formItemData.value.moduleName}`;
    const res = await getModuleList(param);
    formItemData.value = res.data.records[0];
    messageHandler.notifySuccess("保存成功");

    internalFormStatus.value = true;
  } catch (error) {
    messageHandler.notifyError("上传失败");
  }
};

// Module Settings Methods
const handleModuleAction = async (action) => {
  switch (action) {
    case "add":
      await handleModuleAdd();
      break;
    case "del":
      await handleModuleDelete();
      break;
    case "save":
      await handleModuleValidateAndSave();
      break;
  }
};

const handleModuleAdd = async () => {
  const record = {};
  const { row: newRow } = await moduleTableRef.value.insert(record);
  await moduleTableRef.value.setEditCell(newRow, "settingType");
};

const handleModuleDelete = async () => {
  const removeRecords = moduleTableRef.value.getCheckboxRecords();
  if (removeRecords.length === 0) return;

  VxeUI.modal.confirm({
    title: "删除模块",
    content: "是否删除模块",
    draggable: false,
    onConfirm: async () => {
      try {
        const param = {
          moduleName: formItemData.value.moduleName,
          moduleCode: formItemData.value.moduleCode,
          moduleId: formItemData.value.moduleId,
          settingIds: removeRecords.map((record) => record.settingId),
        };
        await deleteSetting(param).then((res) => {
          messageHandler.notifySuccess("删除成功");
        });
        moduleTableRef.value.removeCheckboxRow();
        await loadModuleData();
      } catch (error) {
        messageHandler.notifyError("删除失败");
      }
    },
  });
};

const handleModuleValidateAndSave = async () => {
  const errMap = await moduleTableRef.value.validate(true);
  if (errMap) {
    messageHandler.notifyWarning("请检查表单数据，填写完整后再提交");
    return;
  }
  // 获取要保存的数据
  const insertRecords = moduleTableRef.value.getInsertRecords();
  const updateRecords = moduleTableRef.value.getUpdateRecords();

  // 判断是否有要保存的数据
  if (insertRecords.length === 0 && updateRecords.length === 0) {
    messageHandler.notifyInfo("没有需要保存的数据");
    return;
  }

  try {
    // 显示加载状态
    messageHandler.notifyInfo("正在保存数据，请稍候...");

    // 保存新增和修改的数据
    const savePromises = [];
    if (insertRecords.length > 0) {
      let settingList = insertRecords.map((x) => {
        if (x.settingType === "providePage") {
          let [
            relatingFunctionName = "",
            relatingFunctionCode = "",
          ] = x.settingValue.split(" - ");
          return Object.assign({}, x, {
            relatingFunctionName,
            relatingFunctionCode,
          });
        }
        if (x.settingType === "referencePage") {
          let [
            relatingModuleName = "",
            relatingModuleCode = "",
            relatingFunctionName = "",
            relatingFunctionCode = "",
          ] = x.settingValue.split(" - ");
          return Object.assign({}, x, {
            relatingModuleName,
            relatingModuleCode,
            relatingFunctionName,
            relatingFunctionCode,
          });
        }
        if (x.settingType === "dataInterface") {
          let [
            relatingObjectCode = "",
            relatingMethodCode = "",
          ] = x.settingValue.split(" - ");
          return Object.assign({}, x, {
            relatingObjectCode,
            relatingMethodCode,
          });
        }
        if (x.settingType === "callbackInterface") {
          let [
            relatingModuleName = "",
            relatingModuleCode = "",
            relatingObjectCode = "",
            relatingMethodCode = "",
          ] = x.settingValue.split(" - ");
          return Object.assign({}, x, {
            relatingModuleName,
            relatingModuleCode,
            relatingObjectCode,
            relatingMethodCode,
          });
        }
        return x;
      });
      console.log(settingList);
      const insertParam = {
        moduleName: formItemData.value.moduleName,
        moduleCode: formItemData.value.moduleCode,
        moduleId: formItemData.value.moduleId,
        settingList: settingList,
      };
      savePromises.push(handleModuleSaveRequest(insertParam, "新增"));
    }

    if (updateRecords.length > 0) {
      let settingList = updateRecords.map((x) => {
        if (x.settingType === "providePage") {
          let [
            relatingFunctionName = "",
            relatingFunctionCode = "",
          ] = x.settingValue.split(" - ");
          return Object.assign({}, x, {
            relatingFunctionName,
            relatingFunctionCode,
          });
        }
        if (x.settingType === "referencePage") {
          let [
            relatingModuleName = "",
            relatingModuleCode = "",
            relatingFunctionName = "",
            relatingFunctionCode = "",
          ] = x.settingValue.split(" - ");
          return Object.assign({}, x, {
            relatingModuleName,
            relatingModuleCode,
            relatingFunctionName,
            relatingFunctionCode,
          });
        }
        if (x.settingType === "dataInterface") {
          let [
            relatingObjectCode = "",
            relatingMethodCode = "",
          ] = x.settingValue.split(" - ");
          return Object.assign({}, x, {
            relatingObjectCode,
            relatingMethodCode,
          });
        }
        if (x.settingType === "callbackInterface") {
          let [
            relatingModuleName = "",
            relatingModuleCode = "",
            relatingObjectCode = "",
            relatingMethodCode = "",
          ] = x.settingValue.split(" - ");
          return Object.assign({}, x, {
            relatingModuleName,
            relatingModuleCode,
            relatingObjectCode,
            relatingMethodCode,
          });
        }
        return x;
      });
      console.log(settingList);
      const updateParam = {
        moduleName: formItemData.value.moduleName,
        moduleCode: formItemData.value.moduleCode,
        moduleId: formItemData.value.moduleId,
        settingList: settingList,
      };
      savePromises.push(handleModuleSaveRequest(updateParam, "更新"));
    }

    // 等待所有保存操作完成
    const results = await Promise.all(savePromises);

    // 统计保存结果
    const successCount = results.filter((result) => result.success).length;

    if (successCount === savePromises.length) {
      // 所有操作都成功
      let message = "";
      if (insertRecords.length > 0 && updateRecords.length > 0) {
        message = `成功新增 ${insertRecords.length} 条数据，更新 ${updateRecords.length} 条数据`;
      } else if (insertRecords.length > 0) {
        message = `成功新增 ${insertRecords.length} 条数据`;
      } else {
        message = `成功更新 ${updateRecords.length} 条数据`;
      }
      messageHandler.notifySuccess(message);

      // 刷新表格数据
      await loadModuleData();
    } else {
      // 部分操作失败
      messageHandler.notifyWarning("部分数据保存失败，请检查并重试");
    }
  } catch (error) {
    console.error("保存数据失败:", error);
    messageHandler.notifyError("保存失败：" + (error.message || "未知错误"));
  }
};

const handlePrivilegeAction = async (action) => {
  switch (action) {
    case "add":
      await handlePrivilegeAdd();
      break;
    case "del":
      await handlePrivilegeDelete();
      break;
    case "save":
      await handlePrivilegeValidateAndSave();
      break;
  }
};

const handlePrivilegeAdd = async () => {
  const record = {};
  const { row: newRow } = await privilegeRef.value.insert(record);
  await privilegeRef.value.setEditCell(newRow);
};

const handlePrivilegeDelete = async () => {
  const removeRecords = privilegeRef.value.getCheckboxRecords();
  if (removeRecords.length === 0) return;

  VxeUI.modal.confirm({
    title: "删除数据权限定义",
    content: "是否删除数据权限定义",
    draggable: false,
    onConfirm: async () => {
      try {
        const param = {
          moduleName: formItemData.value.moduleName,
          moduleCode: formItemData.value.moduleCode,
          moduleId: formItemData.value.moduleId,
          privilegeIds: removeRecords.map((record) => record.privilegeId),
        };
        await deletePrivilege(param).then((res) => {
          messageHandler.notifySuccess("删除成功");
        });
        privilegeRef.value.removeCheckboxRow();
        await loadModuleData();
      } catch (error) {
        messageHandler.notifyError("删除失败");
      }
    },
  });
};

const handlePrivilegeValidateAndSave = async () => {
  const errMap = await privilegeRef.value.validate(true);
  if (errMap) {
    messageHandler.notifyWarning("请检查表单数据，填写完整后再提交");
    return;
  }
  // 获取要保存的数据
  const insertRecords = privilegeRef.value.getInsertRecords();
  const updateRecords = privilegeRef.value.getUpdateRecords();

  // 判断是否有要保存的数据
  if (insertRecords.length === 0 && updateRecords.length === 0) {
    messageHandler.notifyInfo("没有需要保存的数据");
    return;
  }
  let insertAndUpdateRecords = [...insertRecords, ...updateRecords];
  const param = {
    moduleName: formItemData.value.moduleName,
    moduleCode: formItemData.value.moduleCode,
    moduleId: formItemData.value.moduleId,
    privilegeList: insertAndUpdateRecords,
  };
  const res = await savePrivilege(param);
  if (res.code === "200" || res.success) {
    messageHandler.notifySuccess("保存成功");
    await loadModuleData();
  } else {
    messageHandler.notifyError("保存失败");
  }
};

const handleModuleSaveRequest = async (param, operationType = "保存") => {
  try {
    const res = await saveSetting(param);
    if (res.code === "200" || res.success) {
      return { success: true, message: `${operationType}成功`, data: res.data };
    } else {
      console.error(`${operationType}失败:`, res);
      messageHandler.notifyError(
        `${operationType}失败: ${res.message || "未知错误"}`
      );
      return { success: false, message: `${operationType}失败`, error: res };
    }
  } catch (error) {
    console.error(`${operationType}失败:`, error);
    messageHandler.notifyError(
      `${operationType}失败: ${error.message || "未知错误"}`
    );
    return { success: false, message: `${operationType}失败`, error };
  }
};

// Function Settings Methods
const handleFunctionAction = async (action) => {
  switch (action) {
    case "add":
      await handleFunctionAdd();
      break;
    case "save":
      await handleFunctionValidateAndSave();
      break;
    case "guide":
      handleFunctionGuide();
      break;
  }
};

const handleFunctionAdd = async () => {
  const record = {};
  const { row: newRow } = await functionTableRef.value.insert(record);
  await functionTableRef.value.setEditCell(newRow, "functionName");
};

const handleFunctionValidateAndSave = async () => {
  const errMap = await functionTableRef.value.validate(true);
  if (errMap) return;

  await Promise.all([handleFunctionCreate(), handleFunctionSave()]);
};

const handleFunctionCreate = async () => {
  const insertRecords = functionTableRef.value.getInsertRecords();
  if (insertRecords.length === 0) return;

  const param = {
    moduleName: formItemData.value.moduleName,
    moduleCode: formItemData.value.moduleCode,
    moduleId: formItemData.value.moduleId,
    functionList: insertRecords,
  };
  await handleFunctionSaveRequest(param);
  messageHandler.notifySuccess("保存成功");
};

const handleFunctionSave = async () => {
  const updateRecords = functionTableRef.value.getUpdateRecords();

  if (updateRecords.length === 0) return;

  const param = {
    moduleName: formItemData.value.moduleName,
    moduleCode: formItemData.value.moduleCode,
    moduleId: formItemData.value.moduleId,
    functionList: updateRecords,
  };
  await handleFunctionSaveRequest(param);
  messageHandler.notifySuccess("保存成功");
};

const handleFunctionSaveRequest = async (param) => {
  try {
    let baseInfoparams = {
      moduleName: formItemData.value.moduleName,
      moduleCode: formItemData.value.moduleCode,
      functionId: param.functionList[0].functionId,
      functionType: param.functionList[0].functionType,
      functionCode: param.functionList[0].functionCode,
      functionName: param.functionList[0].functionName,
      orderIndex: param.functionList[0].orderIndex,
    };

    await saveFunction(param);
    await loadModuleData();
  } catch (error) {
    messageHandler.notifyError("保存失败");
  }
};

const handleFunctionGuide = (row = null) => {
  const selectedRow = row || functionTableRef.value.getRadioRecord();

  if (!selectedRow) {
    // return messageHandler.notifyWarning("请先选择数据");
  }
  guideData.value = { ...formItemData.value, ...selectedRow };
  guideKey.value = Date.now().toString();
  showGuidePopup.value = true;
};

const handleGuideClose = async () => {
  showGuidePopup.value = false;
  await loadModuleData();
  return true;
};

const handleRemoveFunction = async (row) => {
  VxeUI.modal.confirm({
    title: "删除功能",
    content: "是否删除功能",
    draggable: false,
    onConfirm: async () => {
      try {
        if (row.functionId) {
          const param = {
            moduleName: formItemData.value.moduleName,
            moduleCode: formItemData.value.moduleCode,
            moduleId: formItemData.value.moduleId,
            functionIds: [row.functionId],
          };
          await deleteFunction(param);
        }
        functionTableRef.value.remove(row);
        await loadModuleData();
      } catch (error) {
        messageHandler.notifyError("删除失败");
      }
    },
  });
};

const handleInterfaceDesign = async (row, type) => {
  if (!row.functionId) return;

  if (type === "guide") {
    handleFunctionGuide(row);
    return;
  }

  const params = {
    moduleName: formItemData.value.moduleName,
    moduleCode: formItemData.value.moduleCode,
    functionCode: row.functionCode,
  };
  const res = await getFunctionDetail(params);
  const modelCode = res.data.modelCode;
  const modelSql = res.data.modelSql;
  const queryProgrammeList = res.data.queryProgrammeList;
  const orderIndex = res.data.orderIndex;
  const functionName = res.data.functionName;
  const menuFunction = res.data.menuFunction;

  const param = {
    moduleName: formItemData.value.moduleName,
    moduleCode: formItemData.value.moduleCode,
    moduleId: formItemData.value.moduleId,
    modelCode,
    modelSql,
    queryProgrammeList,
    orderIndex,
    functionName,
    menuFunction,
    functionCode: row.functionCode,
    functionList: [row],
    functionType: res.data.functionType,
    tree: res.data.tree,
    formColumnNums: res.data.formColumnNums,
    tableName: res.data.tableName,
    functionId: row.functionId,
  };
  homePage.create({
    data: {
      type: "window",
      ele: "window",
      code: "webdesigner",
      id: "webdesigner" + row.functionId,
      title: "界面设计-web设计器",
      width: "100%",
      height: "85%",
      mask: false,
      origin: true,
      visible: true,
      param,
    },
  });
};

const handleFunctionPrivilege = async (row) => {
  if (!row.functionId) return;
  const param = {
    moduleName: formItemData.value.moduleName,
    moduleCode: formItemData.value.moduleCode,
    functionCode: row.functionCode,
  };
  homePage.create({
    data: {
      type: "window",
      ele: "window",
      code: "functionPrivilege",
      id: "functionPrivilege" + row.functionId,
      title: "权限定义",
      width: "85%",
      height: "85%",
      mask: false,
      origin: true,
      visible: true,
      param,
    },
  });
};

const getreferencePageOptions = async () => {
  const param = {
    moduleName: formItemData.value.moduleName,
    moduleCode: formItemData.value.moduleCode,
  };
  const res = await referencePageOptions(param);
  referenceOptions.value = res.data;
};

const getmoduleDataService = async () => {
  const param = {
    moduleName: formItemData.value.moduleName,
    moduleCode: formItemData.value.moduleCode,
  };
  const res = await getModuleDataService(param);
  dataInterfaceOptions.value = res.data;
};

const getcallbackInterfaceOptions = async () => {
  const param = {
    moduleName: formItemData.value.moduleName,
    moduleCode: formItemData.value.moduleCode,
  };
  const res = await getCallbackInterfaceOptions(param);
  moduleSettingCallbackInterfaceOptions.value = res.data;
};

const loadModuleData = async () => {
  try {
    const param = {
      moduleName: formItemData.value.moduleName,
      moduleCode: formItemData.value.moduleCode,
      moduleId: formItemData.value.moduleId,
    };
    const res = await getModuleDetail(param);

    moduleTableData.value = res.data.settingList;
    functionTableData.value = res.data.functionList;
    privilegeData.value = res.data.privilegeList;
  } catch (error) {
    messageHandler.notifyError("加载模块数据失败");
  }
};

// Watchers and Lifecycle Hooks
watch(
  () => formData.value,
  (newValue) => {
    formItemData.value = { ...newValue };
    if (formItemData.value.moduleId) {
      isDisabled.value = true;
      imgList.value = [
        {
          name: "icon.png",
          url: "/api/design/manage/module/getIcon?" + newValue.moduleIcon,
        },
      ];

      checkImageValidity();
    } else {
      isDisabled.value = false;
      imgList.value = [];
    }

    if (formStatus.value) {
      loadModuleData();
    } else {
      moduleTableData.value = [];
      functionTableData.value = [];
    }
  },
  { deep: true }
);

const checkImageValidity = () => {
  if (!imgList.value.length) return;

  const img = new Image();
  img.src = imgList.value[0].url;
  img.onerror = () => {
    imgList.value = [];
  };
};
const reloadJson = (json) => {
  if (json) {
    const param = Object.assign({}, guideData.value);
    param.designJson = json;
    param.functionCode = json?.formConfig?.functionCode || ''
    homePage.create({
      data: {
        type: "window",
        ele: "window",
        code: "webdesigner",
        id: "webdesigner" + guideData.value.functionId,
        title: "界面设计-web设计器",
        width: "100%",
        height: "85%",
        mask: false,
        origin: true,
        visible: true,
        param,
      },
    });
  }
  showGuidePopup.value = false;
};

onMounted(() => {
  formItemData.value = { ...formData.value };

  if (formItemData.value.moduleId) {
    isDisabled.value = true;
    imgList.value = [
      {
        name: "icon.png",
        url:
          "/api/design/manage/module/getIcon?" + formItemData.value.moduleIcon,
      },
    ];
    checkImageValidity();
    loadModuleData();
    getreferencePageOptions();
    getmoduleDataService();
    getcallbackInterfaceOptions();
  } else {
    isDisabled.value = false;
    imgList.value = [];
  }
  // if (import.meta && import.meta.glob) {
  //   const svgFiles = import.meta.glob('@/assets/svg/*.svg')
  //   Object.keys(svgFiles).map((path) => {
  //     return path
  //       .split("/")
  //       .pop()
  //       .replace(".svg", "");
  //   });
  // }
});

provide("moduleData", moduleData);
</script>
