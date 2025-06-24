<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增数据模型"
    width="500"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="数据源名" prop="tableDatasource">
        <el-input
          v-model="ruleForm.tableDatasource"
          placeholder="数据源名，名称以字母开头，由字母、下划线和数字组成"
        />
      </el-form-item>
      <el-form-item label="表名" prop="tableName">
        <el-input
          v-model="ruleForm.tableName"
          placeholder="表名，名称以字母开头，由字母、下划线和数字组成"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input v-model="ruleForm.tableComment" placeholder="表文字描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref,defineProps } from "vue";
import { saveModel } from "@/api/dataModels";
import { createMessageHandler } from "@/core/Message";
const $message = createMessageHandler();
let dialogVisible = ref(false);
const ruleFormRef = ref(null);
let ruleForm = reactive({
  tableDatasource: "default",
  tableName: "",
  tableComment: "",
});

const rules = reactive({
  tableDatasource: [
    {required: true,message: "请输入数据源名",trigger: "blur",},
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '命名规则不符(以字母开头，由字母、下划线和数字组成)' }
  ],
  tableName: [
    {required: true,message: "请输入表名",trigger: "blur",},
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '命名规则不符(以字母开头，由字母、下划线和数字组成)' }
  ],
  tableComment: [
    {required: true,message: "请输入表描述",trigger: "blur",},
  ],
});

let emit = defineEmits(["refreshModelList"]);
let props = defineProps({
  moduleData: Object
});
const handleClose = () => {
  dialogVisible.value = false;
  ruleFormRef.value.resetFields();
};

const handleOpenDialog = () => {
  dialogVisible.value = true;
};

const saveModelFn = async () => {
  let params = {
    datas: JSON.stringify([ruleForm]),
    ...props.moduleData
  };
  let {code, msg} = await saveModel(params);
  if (code === "200") {
    $message.notifySuccess("操作成功");
    handleClose();
    emit("refreshModelList");
  } else {
    $message.notifyError(msg);
  }
};

const handleSubmit = () => {
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      saveModelFn();
    }
  });
};

defineExpose({
  handleOpenDialog,
});
</script>

<style scoped></style>
