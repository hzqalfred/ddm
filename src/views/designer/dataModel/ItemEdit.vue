<template>
  <el-dialog
    v-model="dialogVisible"
    :title="rowData.title"
    width="800"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      status-icon
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="序号" prop="orderIndex">
            <el-input-number
              v-model="ruleForm.orderIndex"
              placeholder="序号"
              :precision="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段名" prop="columnName">
            <el-input
              v-model="ruleForm.columnName"
              placeholder="以字母或下划线开头、数字组成"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="字段描述" prop="columnRemark">
            <el-input
              v-model="ruleForm.columnRemark"
              placeholder="字段描述"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段类型" prop="columnType">
            <el-select v-model="ruleForm.columnType" style="width: 100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="字段长度" prop="columnLength">
            <el-input-number
              v-model="ruleForm.columnLength"
              placeholder="字段长度"
              :precision="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段精度" prop="columnDecimal">
            <el-input-number
              v-model="ruleForm.columnDecimal"
              placeholder="字段精度"
              :precision="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="默认值" prop="defaultValue">
            <el-input v-model="ruleForm.defaultValue" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否唯一" prop="hasUnique">
            <el-switch
              v-model="ruleForm.hasUnique"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否非空" prop="hasNull">
            <el-switch
              v-model="ruleForm.hasNull"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否主键" prop="hasPk">
            <el-switch
              v-model="ruleForm.hasPk"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否索引" prop="hasIndex">
            <el-switch
              v-model="ruleForm.hasIndex"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12"> </el-col>
      </el-row>
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
import { reactive, ref, watch } from "vue";
import { saveModelCol } from "@/api/dataModels";
import dicDatas from "@/config/dics";

import { createMessageHandler } from "@/core/Message";
const $message = createMessageHandler();

let dialogVisible = ref(false);
const ruleFormRef = ref(null);
let ruleForm = reactive({
  orderIndex: 10,
  columnLength: 255, 
  hasPk: "0",
  hasNull: "0",
  hasUnique: "0",
  hasIndex: "0",
  columnDecimal: 0,
  columnType: "varchar",
});

const options = ref(dicDatas.dicDatas["columntypeData"] || []);

const rules = reactive({
  orderIndex: [
    {required: true,message: "请输入序号",trigger: "blur",},
  ],
  columnName: [
    {required: true,message: "请输入字段名",trigger: "blur",},
    {pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '命名规则不符(以字母开头，由字母、下划线和数字组成)' }
  ],
  columnRemark: [
    {required: true,message: "请输入字段描述",trigger: "blur",},
  ],
  columnType: [
    {required: true,message: "请输入字段类型",trigger: "blur", },
  ],
  columnLength: [
    {required: true,message: "请输入字段长度",trigger: "blur",},
  ],
});

let emit = defineEmits(["refreshModelColList"]);
let props = defineProps({
  rowData: Object,
  tableName: String,
  moduleData: Object
});

watch(
  () => props.rowData,
  (newVal) => {
    if (dialogVisible.value && newVal.type === "edit") {
      Object.assign(ruleForm, newVal.data);
    }
  }
);

const handleClose = () => {
  dialogVisible.value = false;
  ruleFormRef.value.resetFields();
};

const handleOpenDialog = () => {
  dialogVisible.value = true;
};

const saveModelColEvent = async () => {
  try {
    let params = {
      datas: JSON.stringify([ruleForm]),
      tableName: props.tableName,
      ...props.moduleData
    };
    let { code, msg } = await saveModelCol(params);
    if (code === "200") {
      $message.notifySuccess("操作成功");
      handleClose();
      emit("refreshModelColList");
    } else {
      $message.notifyError(msg);
    }
  } catch (e) {
    $message.notifyError(e.message);
  }
};

const handleSubmit = () => {
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      saveModelColEvent();
    }
  });
};

defineExpose({
  handleOpenDialog,
});
</script>

<style scoped></style>
