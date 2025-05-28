<template>
  <el-dialog
    v-model="methodEditVisible"
    :title="props.optType.title"
    width="95%"
    top="5vh"
  >
    <template #header>
      <div class="dialog-header">
        <el-button @click="closeEditDialog" :icon="Close">取消</el-button>
        <el-button type="primary" :icon="Select" @click="saveDataService"
          >保存</el-button
        >
      </div>
    </template>
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="editRules"
      label-width="125px"
      status-icon
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="排序号" prop="orderIndex">
            <el-input-number v-model="editForm.orderIndex" :precision="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="方法编号" prop="methodCode">
            <el-input
              v-model="editForm.methodCode"
              placeholder="相同服务中必须唯一"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="方法名称" prop="methodName">
            <el-input v-model="editForm.methodName" />
          </el-form-item>
        </el-col>

        <!-- <el-col :span="8">
          <el-form-item label="参数校验规则" prop="rules">
            <template #label>
              参数校验规则
              <el-tooltip content="使用JSON Schema规范校验参数" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
            
            <div class="custom-textarea">
                <el-input type="textarea" cols="40" rows="1"  readonly="true"  v-model="editForm.rules" placeholder="使用JSON Schema规范校验参数"/>
                <div class="append-content"><el-button type="info" plain :icon="Search" @click="openJsonCode('rules',editForm.rules)" /></div>
              </div>
          </el-form-item>
        </el-col>

        <el-col :span="8">
              <el-form-item prop="prejavas" label="参数预处理器">
                <template #label >
                  参数预处理器
                  <el-tooltip content="自定义Java类实现，类必须实现接口IJavaParamConvertor，不支持注解，且在run方法实现预处理业务，该方法返回ScriptResult类型值" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
              </template>

              <div class="custom-textarea">
                <el-input type="textarea" cols="40" rows="1"  readonly="true"  v-model="editForm.prejavas" placeholder="参数预处理器"/>
                <div class="append-content"><el-button type="info" plain :icon="Search" @click="openJavaCode('prejavas',editForm.prejavas)" /></div>
              </div>
              </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务后处理器" prop="javas">
            <template #label>
              业务后处理器
              <el-tooltip content="同时配置业务后处理器和业务编排，先执行业务编排；业务后处理器自定义Java类实现，类必须实现接口IJavaEventExecutor，不支持注解，且在run方法实现业务逻辑，该方法返回Map类型值。" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
            
            <div class="custom-textarea">
                <el-input type="textarea" cols="40" rows="1"  readonly="true"  v-model="editForm.javas" placeholder="业务后处理器"/>
                <div class="append-content"><el-button type="info" plain :icon="Search" @click="openJavaCode('javas',editForm.javas)" /></div>
              </div>
          </el-form-item>
        </el-col> -->

        <el-col :span="8">
          <el-form-item label="备注" prop="note">
            <el-input v-model="editForm.note" placeholder="该方法业务逻辑" />
          </el-form-item>
        </el-col>
        <!-- 
        <el-col :span="8">
              <el-form-item prop="preName" label="预处理器返回值">
                <template #label>
                  预处理器返回值
              <el-tooltip content="变量名，预处理器结果值作为参数加入后续节点业务处理，以此变量名作为KEY" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
                <el-input v-model="editForm.preName" placeholder="变量名，预处理器结果值作为参数加入后续节点业务处理" />
              </el-form-item>
        </el-col>
   
        <el-col :span="8">
              <el-form-item prop="postBean" label="bean后处理器">
                <template #label>
                  bean后处理器
              <el-tooltip content="配置bean名:方法名，参数为Map，返回值为Map" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
                <el-input v-model="editForm.postBean" placeholder="配置bean名:方法名，参数为Map，返回值为Map" />
              </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>
    <div class="chart_list">
      <span style="font-weight: 600;">业务编排</span>
      <VisualMethod
        ref="$Graph"
        @openSelectWindow="openSelectWindow"
        :chart="xChart"
        :requestParams="requestParams"
        :resultParams="resultParams"
        :moduleDetails="moduleDetails"
        v-if="methodEditVisible"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeEditDialog" :icon="Close">取消</el-button>
        <el-button type="primary" :icon="Select" @click="saveDataService"
          >保存</el-button
        >
      </div>
    </template>
  </el-dialog>
  <JavaEditor ref="javaEditorRef" @selectJavaCode="selectJavaCode" />
  <JsonEditor ref="jsonEditorRef" @selectJsonCode="selectJsonCode" />
</template>
<script setup>
import { reactive, ref, watch, defineProps } from "vue";
import { saveEvent } from "@/api/dataService";

import VisualMethod from "@/core/components/VisualMethod/index.vue";
import { Close, Select, Search } from "@element-plus/icons-vue";
import { createMessageHandler } from "@/core/Message";
import JavaEditor from "@/core/components/CodeEditor/javaEditor.vue";
import JsonEditor from "@/core/components/CodeEditor/jsonEditor.vue";

const $message = createMessageHandler();
const props = defineProps({
  optType: Object,
  moduleData: Object,
  moduleDetails: Object,
});

const emit = defineEmits(["refreshTableData"]);

const $Graph = ref(null);
const xChart = ref("");
const resultParams = ref([]);
const requestParams = ref([]);

let methodEditVisible = ref(false);
let editFormRef = ref({});
let editForm = reactive({
  orderIndex: "10",
  methodName: "",
  methodCode: "",
  rules: "",
  prejavas: "",
  preName: "",
  javas: "",
  note: "",
  exChart: "",
  postBean: "",
  requestParams:[],
  resultParams:[],
});

const resetEditForm = () => {
  editForm.orderIndex = "10";
  editForm.methodName = "";
  editForm.methodCode = "";
  editForm.rules = "";
  editForm.prejavas = "";
  editForm.preName = "";
  editForm.note = "";
  editForm.exChart = "";
  $Graph.value = null;
  xChart.value = "";
  requestParams.value = [];
  resultParams.value = [];
};
watch(
  () => props.optType,
  (newVal) => {
    if (methodEditVisible.value && newVal.type === "edit") {
      Object.assign(editForm, props.optType.data);
      xChart.value = props.optType.data.exChart;
    
      requestParams.value = props.optType.data.requestParams;
      resultParams.value = props.optType.data.resultParams;
    } else if (methodEditVisible.value && newVal.type === "add") {
      resetEditForm();
    }
  }
);

const editRules = reactive({
  orderIndex: [{ required: true, message: "请输入排序", trigger: "blur" }],
  methodCode: [
    { required: true, message: "请输入方法编号", trigger: "blur" },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: "命名规则不符(以字母开头，由字母、下划线和数字组成)",
    },
  ],
  methodName: [{ required: true, message: "请输入方法名称", trigger: "blur" }],
  preName: [
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: "命名规则不符(以字母开头，由字母、下划线和数字组成)",
    },
  ],
});

const closeEditDialog = () => {
  methodEditVisible.value = false;
  editFormRef.value.resetFields();
};

const openEditDialog = () => {
  methodEditVisible.value = true;
};

const saveDataService = async () => {
  let data = await $Graph.value.getSaveData();
  if (!data) return;
  editFormRef.value.validate((valid) => {
    if (valid) {
      editForm.exChart = JSON.stringify({cells:data.cells});
      editForm.requestParams = data.requestParams;
      editForm.resultParams = data.resultParams;
      let params = {
        datas: JSON.stringify([editForm]),
        objectCode: props.optType.objectCode,
        // requestParams:JSON.stringify(data.requestParams),
        // resultParams:JSON.stringify(data.resultParams),
        optType: props.optType.type,
        ...props.moduleData,
      };
      console.log(params)
    
      saveEvent(params).then((res) => {
        if (res.code === "200") {
          $message.notifySuccess("操作成功");
          closeEditDialog();
          emit("refreshTableData");
        } else {
          $message.notifyError(res.msg);
        }
      });
    }
  });
};

let editCol = ref("");
let javaEditorRef = ref();
let openJavaCode = (editName, code) => {
  editCol.value = editName;
  javaEditorRef.value.openJavaEditor(code);
};
let selectJavaCode = (code) => {
  editForm[editCol.value] = code;
};

let jsonEditorRef = ref();
let openJsonCode = (editName, code) => {
  editCol.value = editName;
  jsonEditorRef.value.openJsonEditor(code);
};
let selectJsonCode = (code) => {
  editForm[editCol.value] = code;
};

defineExpose({
  openEditDialog,
});
</script>
<style>
.custom-textarea {
  display: flex;
  align-items: flex-end;
}
.append-content {
  margin-left: 0px;
}

#editCode {
  .CodeMirror {
    line-height: 1em;
    font-family: monospace;
    margin-right: 1px;
    width: 500px;
    height: 100%;
    font-size: 14px;
  }

  .CodeMirror-scroll {
    overflow: auto;
    padding-bottom: 0px;
    width: 500px;
    height: 100%;
    position: relative;
  }
  .codemirror-container.bordered {
    border: 0px solid #aaaaaa;
  }
  .CodeMirror-foldgutter {
    width: 0;
  }
}
</style>
