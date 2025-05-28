<template>
  <div class="content-table-wrap">
    <div class="table-wrap">
      <div style="margin-bottom: 10px;">
        <el-button type="primary" @click="addDataRow">新增流程</el-button>
      </div>
      <el-table :data="tableData" border height="calc(100vh - 200px)">
        <el-table-column
          sortable
          align="center"
          prop="status"
          width="80"
          label="状态"
        >
          <template #default="scope">
            {{ translateDict(scope.row.status, workflow_statusData) }}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="proc_code"
          label="流程标识"
        />
        <el-table-column
          sortable
          align="center"
          prop="proc_name"
          label="流程名称"
        />
        <el-table-column
          sortable
          align="center"
          prop="module_name"
          label="模块名"
        />
        <el-table-column
          sortable
          align="center"
          prop="fun_name"
          label="功能名"
        />
        <el-table-column
          sortable
          align="center"
          prop="fw_type"
          label="流程类型"
        >
          <template #default="scope">
            {{ translateDict(scope.row.fw_type, wfActTypeData) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="250" align="left" label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="editDataRow(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" link @click="deleteDataRow(scope.row)"
              >删除</el-button
            >
            <el-button type="default" link @click="copyDataRow(scope.row)"
              >复制</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <vxe-pager
        :current-page="pages.currentPage"
        :page-size="pages.pageSize"
        :layouts="['Sizes', 'PrevPage', 'Number', 'NextPage', 'Total']"
        :page-sizes="[10, 20, 50, 100]"
        :total="pages.total"
        @page-change="loadTableData"
      />
    </div>
  </div>

  <el-dialog v-model="editFormVisible" title="流程配置" width="90%" top="5vh">
    <div style="display: flex; flex-direction: row;">
         <div style="width: 55%;">
        <el-tag style="margin-bottom: 10px;" effect="light" type="info"
          >设计流程</el-tag
        >
        <WflowGraph ref="$wfGraph" :chart="wfChart" v-if="editFormVisible" />
      </div>
      <div style="width: 45%;">
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editRules"
          label-width="140px"
          status-icon
        >
          <el-tag style="margin-bottom: 10px;"
            >启用状态
            <el-switch
              v-model="editForm.status"
              active-value="1"
              inactive-value="0"
          /></el-tag>
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="流程类型" name="first">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="流程类型" prop="fw_type">
                    <template #label>
                      流程类型
                      <el-tooltip
                        content="固定流程：可加减签；可变流程：不可加减签"
                        placement="top"
                      >
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-select v-model="editForm.fw_type" style="width: 100%">
                      <el-option
                        v-for="item in wfActTypeData"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="模块标识符" prop="module_code">
                    <el-input
                      v-model="editForm.module_code"
                      placeholder="模块标识符"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="审批表名" prop="table_name">
                    <el-input
                      v-model="editForm.table_name"
                      placeholder="表名"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="流程标识" prop="proc_code">
                    <el-input
                      v-model="editForm.proc_code"
                      placeholder="流程标识"
                    />
                    <template #label>
                      流程标识
                      <el-tooltip content="流程唯一标识" placement="top">
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="模块名称" prop="module_name">
                    <el-input
                      v-model="editForm.module_name"
                      placeholder="模块名称"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="表主键字段" prop="key_column">
                    <el-input
                      v-model="editForm.key_column"
                      placeholder="表主键字段"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="流程名称" prop="proc_name">
                    <el-input
                      v-model="editForm.proc_name"
                      placeholder="流程名称"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="功能标识符" prop="fun_code">
                    <el-input
                      v-model="editForm.fun_code"
                      placeholder="启用流程的功能标识符"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="表状态字段" prop="status_column">
                    <el-input
                      v-model="editForm.status_column"
                      placeholder="表状态字段"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="流程简介" prop="form_content">
                    <template #label>
                      流程简介
                      <el-tooltip
                        content="使用EL表达式动态定义简介，数据来源于主表,例如：我是[xxx属性]的流程"
                        placement="top"
                      >
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-input
                      v-model="editForm.form_content"
                      placeholder="使用EL表达式动态定义简介，数据来源于主表"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="功能名" prop="fun_name">
                    <el-input
                      v-model="editForm.fun_name"
                      placeholder="启用流程的功能名"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="定义事件" name="second">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="发起前事件" prop="pre_events">
                    <template #label>
                      发起前事件
                      <el-tooltip
                        content="流程发起前进行业务验证，失败时中止发起流程。Java代码实现接口IBpmInstanceListener或配置数据服务（模块编码.模块名称.对象编码.方法编码）"
                        placement="top"
                      >
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-input
                      v-model="editForm.pre_events"
                      placeholder="发起前事件，可进行业务验证"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="发起时事件" prop="start_events">
                    <template #label>
                      发起时事件
                      <el-tooltip
                        content="流程发起时处理业务，Java代码实现接口IBpmInstanceListener或配置数据服务（模块编码.模块名称.对象编码.方法编码）"
                        placement="top"
                      >
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-input
                      v-model="editForm.start_events"
                      placeholder="发起时事件"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="完成时事件" prop="end_events">
                    <template #label>
                      完成时事件
                      <el-tooltip
                        content="流程完成时处理业务，Java代码实现接口IBpmInstanceListener或配置数据服务（模块编码.模块名称.对象编码.方法编码）"
                        placement="top"
                      >
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-input
                      v-model="editForm.end_events"
                      placeholder="流程完成时处理业务"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="完成后事件" prop="post_events">
                    <template #label>
                      完成后事件
                      <el-tooltip
                        content="流程完成后处理业务，Java代码实现接口IBpmInstanceListener或配置数据服务（模块编码.模块名称.对象编码.方法编码）"
                        placement="top"
                      >
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-input
                      v-model="editForm.post_events"
                      placeholder="流程完成后处理业务"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="取消时事件" prop="cancel_events">
                    <template #label>
                      取消时事件
                      <el-tooltip
                        content="取消流程时处理业务，Java代码实现接口IBpmInstanceListener或配置数据服务（模块编码.模块名称.对象编码.方法编码）"
                        placement="top"
                      >
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-input
                      v-model="editForm.cancel_events"
                      placeholder="取消流程时处理业务"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="驳回时事件" prop="reject_events">
                    <template #label>
                      驳回时事件
                      <el-tooltip
                        content="流程驳回时处理业务，Java代码实现接口IBpmInstanceListener或配置数据服务（模块编码.模块名称.对象编码.方法编码）"
                        placement="top"
                      >
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-input
                      v-model="editForm.reject_events"
                      placeholder="流程驳回时处理业务"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="重审时事件" prop="redo_events">
                    <template #label>
                      重审时事件
                      <el-tooltip
                        content="流程已完成后重新发起审批时处理业务，Java代码实现接口IBpmInstanceListener或配置数据服务（模块编码.模块名称.对象编码.方法编码）"
                        placement="top"
                      >
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-input
                      v-model="editForm.redo_events"
                      placeholder="重新发起审批时处理业务"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="设置规则" name="third">
              <el-row>
                <!-- <el-col :span="12">
          <el-form-item label="匹配规则" prop="match_property">
            <template #label>
              匹配规则
              <el-tooltip content="功能配置多流程模板时，基于主表数据动态匹配模板，使用EL表达式" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
            <el-input v-model="editForm.match_property" placeholder="基于主表数据动态匹配模板，使用EL表达式"/>
          </el-form-item>
        </el-col> -->

                <el-col :span="12">
                  <el-form-item label="可编辑属性" prop="edit_property">
                    <template #label>
                      可编辑属性
                      <el-tooltip
                        content="定义表单全局可编辑属性,属性名是功能字段编号，多个字段用逗号分隔"
                        placement="top"
                      >
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-input
                      v-model="editForm.edit_property"
                      placeholder="定义表单全局可编辑属性"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="可用操作按钮" prop="button_property">
                    <template #label>
                      可用操作按钮
                      <el-tooltip
                        content="定义全局可用操作按钮,属性名是事件编码，多个按钮用逗号分隔"
                        placement="top"
                      >
                        <el-icon><question-filled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-input
                      v-model="editForm.button_property"
                      placeholder="定义全局可用操作按钮"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="相同审批人同意则自动通过"
                    label-width="250px"
                    prop="rule_same_agreen_assignee"
                  >
                    <el-switch
                      v-model="editForm.rule_same_agreen_assignee"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="相同审批人已同意则自动通过"
                    label-width="250px"
                    prop="rule_seq_same_assignee"
                  >
                    <el-switch
                      v-model="editForm.rule_seq_same_assignee"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="审批人与申请人相同则自动通过"
                    label-width="250px"
                    prop="rule_same_apply"
                  >
                    <el-switch
                      v-model="editForm.rule_same_apply"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="可撤回"
                    label-width="250px"
                    prop="has_cancel"
                  >
                    <el-switch
                      v-model="editForm.has_cancel"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="可回退"
                    label-width="250px"
                    prop="has_rollback"
                  >
                    <el-switch
                      v-model="editForm.has_rollback"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="可转办"
                    label-width="250px"
                    prop="has_transfer"
                  >
                    <el-switch
                      v-model="editForm.has_transfer"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="可减签"
                    label-width="250px"
                    prop="has_remove"
                  >
                    <el-switch
                      v-model="editForm.has_remove"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="可加签"
                    label-width="250px"
                    prop="has_add"
                  >
                    <el-switch
                      v-model="editForm.has_add"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="同步更新流程"
                    label-width="250px"
                    prop="has_sync"
                  >
                    <el-switch
                      v-model="editForm.has_sync"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="审批意见必填"
                    label-width="250px"
                    prop="has_comment"
                  >
                    <el-switch
                      v-model="editForm.has_comment"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeEditDialog">取消</el-button>
        <el-button type="primary" @click="saveFormData">保存</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- <JavaEditor ref="javaEditorRef" @selectJavaCode="selectJavaCode" /> -->
</template>

<script setup>
import { ref, reactive, defineExpose, inject, onMounted } from "vue";
import { listWflow, saveWflow, deleteWflow, copyWflow } from "@/api/workflow";

import { Search } from "@element-plus/icons-vue";
import WflowGraph from "@/core/components/Wflow/index.vue";
import { createMessageHandler } from "@/core/Message";

// import JavaEditor from '@/core/components/CodeEditor/javaEditor.vue'
const $message = createMessageHandler();
const moduleData = inject("moduleData");
const activeName = ref("first");

const wfActTypeData = reactive([
  { text: "固定流程", value: "2" },
  { text: "可变流程", value: "1" },
]);

const workflow_statusData = reactive([
  { text: "停用", value: "0", textColor: "red" },
  { text: "启用", value: "1", textColor: "green" },
]);

const translateDict = (value, dict) => {
  let result = "";
  dict.forEach((item) => {
    if (item.value === value) {
      result = item.text;
    }
  });
  return result;
};

// let javaEditorRef = ref()
// let editCol = ref('')
// let openJavaCode = (editName, code) => {
//   editCol.value = editName
//   javaEditorRef.value.openJavaEditor(code)
// }
// let selectJavaCode = (code) => {
//   editForm[editCol.value] = code
// }

const pages = reactive({ currentPage: 1, pageSize: 10, total: 0 });
let tableData = ref([]);

const loadTableData = (cur) => {
  listWflow({
    pageNumber: cur ? cur.currentPage : pages.currentPage,
    pageSize: cur ? cur.pageSize : pages.pageSize,
    ...moduleData.value,
  }).then((res) => {
    tableData.value = res.records;
    pages.currentPage = res.pageNumber;
    pages.pageSize = res.pageSize;
    pages.total = res.totalRow;
  });
};

onMounted(() => {
  loadTableData();
});

const $wfGraph = ref(null);
let wfChart = ref("");

let editFormVisible = ref(false);
let editFormRef = ref({});
let editForm = reactive({
  proc_id: "",
  proc_code: "",
  proc_name: "",
  module_code: "",
  module_name: "",
  fun_code: "",
  fun_name: "",
  table_name: "",
  key_column: "",
  status_column: "",
  fw_type: "1",
  form_content: "",
  chart: "",
  pre_events: "",
  start_events: "",
  end_events: "",
  post_events: "",
  reject_events: "",
  cancel_events: "",
  redo_events: "",
  hidden_property: "",
  edit_property: "",
  button_property: "",
  match_property: "",
  rule_same_agreen_assignee: "0",
  rule_seq_same_assignee: "0",
  rule_same_apply: "0",
  has_cancel: "1",
  has_rollback: "1",
  has_transfer: "1",
  has_remove: "0",
  has_add: "0",
  has_jump: "0",
  has_reject: "0",
  has_represent: "0",
  has_delegate: "0",
  has_suspend: "0",
  has_notice: "0",
  has_comment: "0",
  has_sync: "0",
  has_urging: "0",
  status: "1",
});

const defaultForm = {
  proc_id: "",
  proc_code: "",
  proc_name: "",
  module_code: "",
  module_name: "",
  fun_code: "",
  fun_name: "",
  table_name: "",
  key_column: "",
  status_column: "",
  fw_type: "1",
  form_content: "",
  chart: "",
  pre_events: "",
  start_events: "",
  end_events: "",
  post_events: "",
  reject_events: "",
  cancel_events: "",
  redo_events: "",
  hidden_property: "",
  edit_property: "",
  button_property: "",
  match_property: "",
  rule_same_agreen_assignee: "0",
  rule_seq_same_assignee: "0",
  rule_same_apply: "0",
  has_cancel: "1",
  has_rollback: "1",
  has_transfer: "1",
  has_remove: "0",
  has_add: "0",
  has_jump: "0",
  has_reject: "0",
  has_represent: "0",
  has_delegate: "0",
  has_suspend: "0",
  has_notice: "0",
  has_comment: "0",
  has_sync: "0",
  has_urging: "0",
  status: "1",
};

const editRules = reactive({
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  module_code: [
    { required: true, message: "请填写要审批模块标识符", trigger: "blur" },
  ],
  module_name: [
    { required: true, message: "请填写要审批模块名", trigger: "blur" },
  ],
  fun_code: [
    { required: true, message: "请填写要审批功能标识符", trigger: "blur" },
  ],
  fun_name: [
    { required: true, message: "请填写要审批功能名", trigger: "blur" },
  ],
  proc_name: [{ required: true, message: "请填写流程名", trigger: "blur" }],
  proc_code: [{ required: true, message: "请填写流程标识", trigger: "blur" }],
  fw_type: [{ required: true, message: "请选择流程类型", trigger: "blur" }],
  table_name: [{ required: true, message: "请填写表名", trigger: "blur" }],
  key_column: [
    { required: true, message: "请填写表主键字段", trigger: "blur" },
  ],
  status_column: [
    { required: true, message: "请填写表状态字段", trigger: "blur" },
  ],
});

const addDataRow = () => {
  Object.assign(editForm, defaultForm);
  editFormVisible.value = true;
};

const editDataRow = (row) => {
  Object.assign(editForm, row);
  wfChart.value = row.chart;
  editFormVisible.value = true;
};

const saveFormData = () => {
  editFormRef.value.validate((valid) => {
    if (valid) {
      let data = $wfGraph.value.getSaveGraphData();
      editForm.chart = JSON.stringify(data);
      let params = {
        ...editForm,
      };
      saveWflow(params).then((res) => {
        if (res.code === "200") {
          $message.notifySuccess("操作成功");
          editFormVisible.value = false;
          loadTableData();
        } else {
          $message.notifyError(res.msg);
        }
      });
    }
  });
};

const deleteDataRow = (row) => {
  $message.confirmAction("确定要删除该数据？", "提示", () => {
    let params = {
      ...row,
    };
    deleteWflow(params).then((res) => {
      $message.notifySuccess("删除成功");
      loadTableData();
    });
  });
};

const copyDataRow = (row) => {
  $message.confirmAction("确定要复制该数据？", "提示", () => {
    let params = {
      ...row,
    };
    copyWflow(params).then((res) => {
      $message.notifySuccess("操作成功");
      loadTableData();
    });
  });
};

const closeEditDialog = () => {
  editFormVisible.value = false;
  editFormRef.value.resetFields();
};

defineExpose({});
</script>

<style>
.custom-textarea {
  display: flex;
  align-items: flex-end;
}
.append-content {
  margin-left: 0px;
}
</style>
<style lang="scss" scoped>
.content-table-wrap {
  margin-left: 10px;
  margin-top: 20px;
  display: flex;
  .table-wrap {
    flex: 1;
  }
}
</style>
