<template>
  <el-dialog
    :append-to-body="true"
    v-model="nodeEditState"
    title="操作类型"
    width="85%"
  >
    <div>
      <el-form ref="$form" :rules="rules" :model="nodeData" label-width="140px">
        <el-row :gutter="24">
          <el-col :span="24" v-if="nodeDialogType === 'add'">
            <el-form-item prop="nodeType" label="操作类型">
              <el-radio-group v-model="nodeData.nodeType">
                <el-radio title="向前添加一个节点" value="0"
                  >新增普通节点</el-radio
                >
                <el-radio title="向前新增并行节点" value="1"
                  >新增并行节点</el-radio
                >
                <el-radio title="在当前并行节点中添加一个并行节点" value="2"
                  >添加并行节点</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8" v-if="nodeDialogType === 'add'">
            <el-form-item prop="oType" label="节点类型">
              <el-select style="width: 100%" v-model="nodeData.oType">
                <el-option label="SQL节点" value="0" />
                <el-option label="调用数据服务" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="code" label="节点编号">
              <el-input v-model="nodeData.code" placeholder="节点编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="nodeName" label="节点名">
              <el-input v-model="nodeData.nodeName" placeholder="节点名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="note" label="备注">
              <el-input v-model="nodeData.note" placeholder="备注" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item prop="conditions" label="节点执行条件">
              <el-input
                v-model="nodeData.conditions"
                placeholder="条件表达式不为空且计算结果为false时，不执行本节点业务"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="nodeData.oType === '0' || !nodeData.oType">
          <el-divider />
          <el-tag style="margin-bottom: 10px;" effect="light" type="info"
            >本节点数据服务</el-tag
          >
          <el-select v-model="insertText"  style="width: 240px;margin: 0 10px 10px;" size="small">
            <el-option
              v-for="(value, key) in insertObj"
              :key="key"
              :value="value"
              :label="key"
            ></el-option>
          </el-select>
          <el-button
            size="small"
            style="margin: 0 10px 10px;"
            type="primary"
            @click="insertSql"
            >插入</el-button
          >
          <!-- <el-row :gutter="24">
          <el-col :span="8">
              <el-form-item prop="conditions" label="节点执行条件">
                <el-input v-model="nodeData.conditions" placeholder="条件表达式不为空且计算结果为false时，不执行本节点业务" />
              </el-form-item>
            </el-col> 

            <el-col :span="8">
              <el-form-item prop="prejavas"  label="SQL参数预处理器">
                <template #label>
                  SQL参数预处理器
                <el-tooltip content="自定义Java类实现，类必须实现接口IJavaParamConvertor，不支持注解，且在run方法实现预处理业务，该方法返回ScriptResult类型值。" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
              </template>
                <div class="custom-textarea">
                  <el-input type="textarea" readonly="true" rows="1" cols="200" v-model="nodeData.prejavas" placeholder="编写SQL参数预处理器代码"/>
                  <div class="append-content"><el-button type="info" plain :icon="Search" @click="openJavaCode('prejavas',nodeData.prejavas)" /></div>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item prop="preName" label="预处理器返回值">
                  <template #label>
                    预处理器返回值
                <el-tooltip content="变量名，预处理器结果值作为参数加入后续节点业务处理，以此变量名作为KEY" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
              </template>
                  <el-input v-model="nodeData.preName" placeholder="变量名，预处理器结果值作为参数加入后续节点业务处理，以此变量名作为KEY" />
                </el-form-item>
            </el-col>
        </el-row> -->
          <el-row :gutter="24">
            <el-col :span="14">
              <el-form-item prop="sqls" label="SQL">
                <template #label>
                  SQL
                  <el-tooltip
                    content="编写Mybatis SQL，支持insert、update、delete和select语句，SQL语句中使用OGNL表达式绑定参数值，批处理SQL使用;标识结束。"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                </template>
                <div id="sqlCodex">
                  <Codemirror
                    ref="editorRef"
                    v-model:value="nodeData.sqls"
                    :options="{
                      mode: 'sql',
                      lineNumbers: false,
                      lineWrapping: true,
                      matchBrackets: true,
                      smartIndent: true,
                    }"
                    height="300"
                    border
                    placeholder="编写Mybatis SQL，支持insert、update、delete和select语句，SQL语句中使用OGNL表达式绑定参数值，批处理SQL使用;标识结束。"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <div class="result-setting">
                <div class="title-box">
                  <div class="title">结果集设置</div>
                </div>
                <div class="button-group">
                  <vxe-button
                      status="primary"
                      content="新增"
                      @click="handleResultAdd"
                  ></vxe-button>
                  <vxe-button
                      status="danger"
                      content="删除"
                      @click="handleResultDelete"
                  ></vxe-button>
                </div>
                <vxe-grid
                    border
                    ref="resultGridRef"
                    :max-height="340"
                    :edit-rules="{
                    resultKey: [{ required: true, message: '必须填写' }],
                    source: [{ required: true, message: '必须填写' }],
                  }"
                    :columns="resultColumns"
                    :data="resultTableData"
                    :edit-config="{ trigger: 'click', mode: 'cell' }"
                    :show-overflow="true"
                >
                </vxe-grid>
              </div>
              <div class="result-setting">
                <div class="title-box">
                  <div class="title">异常抛出设置</div>
                </div>
                <div class="button-group">
                  <vxe-button
                    status="primary"
                    content="新增"
                    @click="handleExceptionAdd"
                  ></vxe-button>
                  <vxe-button
                    status="danger"
                    content="删除"
                    @click="handleExceptionDelete"
                  ></vxe-button>
                </div>
                <vxe-grid
                  border
                  ref="exceptionGridRef"
                  :max-height="340"
                  :edit-rules="{
                    exceptionEl: [{ required: true, message: '必须填写' }],
                    exceptionMsg: [{ required: true, message: '必须填写' }],
                  }"
                  :columns="exceptionColumns"
                  :data="exceptionTableData"
                  :edit-config="{ trigger: 'click', mode: 'cell' }"
                  :show-overflow="true"
                >
                </vxe-grid>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="4">
              <el-form-item label="构造树型" prop="buildTree">
                <template #label>
                  构造树型
                  <el-tooltip
                    content="启用后，将对结果值构造树型返回"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                </template>
                <el-switch
                  v-model="nodeData.buildTree"
                  active-value="1"
                  inactive-value="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="treeColumn" label="树唯一字段">
                <template #label>
                  树唯一字段
                </template>
                <el-input v-model="nodeData.treeColumn" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="treeParentColumn" label="树父级字段">
                <template #label>
                  树父级字段
                </template>
                <el-input v-model="nodeData.treeParentColumn" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="nodeData.oType === '1'">
          <el-divider />
          <el-tag style="margin-bottom: 10px;" effect="light" type="info">
            本节点调用外部数据服务
          </el-tag>

          <el-row :gutter="24">
            <el-col :span="14">
              <el-form-item prop="outModuleName" label="调用模块名称">
                <template #label>
                  数据服务
                  <el-tooltip
                    content="数据来源于模块设置-基础设置的回调接口"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                </template>
                <!-- <el-input
                  v-model="nodeData.outSvrCode"
                  placeholder="数据来源于模块设置-基础设置的回调接口"
                /> -->
                <el-select v-model="nodeData.outSvrCode">
                  <el-option
                    v-for="(item, index) in outSvrCodeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <div class="result-setting">
                <div class="title-box">
                  <div class="title">结果集设置</div>
                </div>
                <div class="button-group">
                  <vxe-button
                      status="primary"
                      content="新增"
                      @click="handleResultAdd"
                  ></vxe-button>
                  <vxe-button
                      status="danger"
                      content="删除"
                      @click="handleResultDelete"
                  ></vxe-button>
                </div>
                <vxe-grid
                    border
                    ref="resultGridRef"
                    :max-height="340"
                    :edit-rules="{
                    resultKey: [{ required: true, message: '必须填写' }],
                    source: [{ required: true, message: '必须填写' }],
                  }"
                    :columns="resultColumns"
                    :data="resultTableData"
                    :edit-config="{ trigger: 'click', mode: 'cell' }"
                    :show-overflow="true"
                >
                </vxe-grid>
              </div>
              <div class="result-setting">
                <div class="title-box">
                  <div class="title">异常抛出设置</div>
                </div>
                <div class="button-group">
                  <vxe-button
                      status="primary"
                      content="新增"
                      @click="handleExceptionAdd"
                  ></vxe-button>
                  <vxe-button
                      status="danger"
                      content="删除"
                      @click="handleExceptionDelete"
                  ></vxe-button>
                </div>
                <vxe-grid
                    border
                    ref="exceptionGridRef"
                    :max-height="340"
                    :edit-rules="{
                    exceptionEl: [{ required: true, message: '必须填写' }],
                    exceptionMsg: [{ required: true, message: '必须填写' }],
                  }"
                    :columns="exceptionColumns"
                    :data="exceptionTableData"
                    :edit-config="{ trigger: 'click', mode: 'cell' }"
                    :show-overflow="true"
                >
                </vxe-grid>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="switchNodeEditState">取消</el-button>
        <el-button type="primary" @click="successNode">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <JavaEditor ref="javaEditorRef" @selectJavaCode="selectJavaCode" />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import JavaEditor from "@/core/components/CodeEditor/javaEditor.vue";
import { Search } from "@element-plus/icons-vue";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/lib/codemirror.css";

import Codemirror from "codemirror-editor-vue3";
import "codemirror/addon/display/placeholder.js";
import "codemirror/mode/sql/sql.js";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/sql-hint.js";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/foldgutter.css";
const props = defineProps({
  nodeRow: {
    type: Object,
    default: () => {
      return {};
    },
  },
  nodeDialogType: {
    type: String,
    default: "edit",
  },
  designNode: {
    type: Boolean,
    default: false,
  },
  moduleDetails: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
let $form = ref(null);
const editorRef = ref(null);
const insertText = ref('')
const insertObj = ref({
  "权限sql": "<if test=\"permission.xxxxx!=null\">\n" +
      "  <bind name=\"permissionValues\" value=\"@com.google.common.base.Joiner@on('|').join(permission.xxxxx)\"/>\n" +
      "  and xxxx_path regexp #{permissionValues}\n" +
      "</if>",
  "权限排除sql": "<if test=\"permission.xxxxx!=null\">\n" +
      "  <bind name=\"permissionValues\" value=\"@com.google.common.base.Joiner@on('|').join(permission.xxxxx)\"/>\n" +
      "  and xxxx_path not regexp #{permissionValues}\n" +
      "</if>",
  "树节点查询sql": "<if test=\"treeNode.path!=null\">\n" +
      "  xxxx_path like concat(#{treeNode.path},'%')\n" +
      "</if>",
});
const rules = ref({
  nodeName: [{ required: true, message: "请输入节点名", trigger: "blur" }],
  code: [
    {
      required: true,
      message: "请输入节点编号",
      trigger: "blur",
    },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: "命名规则不符(以字母开头，由字母、下划线和数字组成)",
    },
  ],
  nodeType: [
    { required: true, message: "请选择节点操作类型", trigger: "blur" },
  ],
  queryName: [
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: "命名规则不符(以字母开头，由字母、下划线和数字组成)",
    },
  ],
  returnName: [
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: "命名规则不符(以字母开头，由字母、下划线和数字组成)",
    },
  ],
  preName: [
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: "命名规则不符(以字母开头，由字母、下划线和数字组成)",
    },
  ],
});

const emit = defineEmits(["selectInterface", "selectFunction", "successNode"]);

let nodeEditState = ref(false);
let nodeData = ref({});
let resultGridRef = ref(null);
let resultTableData = ref([]);
let exceptionGridRef = ref(null);
let exceptionTableData = ref([]);
let outSvrCodeOptions = computed(()=>{
  return props.moduleDetails?.settingList?.filter(x=>x.settingType=="callbackInterface").map(x=>({
    label:x.settingItem,
    value:x.settingValue
  }))
})

let resultColumns = ref([
  { type: "checkbox", width: 44 },
  { type: "seq", width: 60 },
  {
    field: "resultKey",
    title: "字段",
    editRender: { name: "input" },
  },
  { field: "resultSource", title: "来源", editRender: { name: "input" } },
]);

let exceptionColumns = ref([
  { type: "checkbox", width: 44 },
  { type: "seq", width: 60 },
  {
    field: "exceptionEl",
    title: "异常表达式",
    editRender: { name: "input" },
  },
  {
    field: "exceptionMsg",
    title: "提示信息",
    editRender: { name: "input" } },
])

watch(
  () => props.nodeRow,
  (newRow) => {
    nodeData.value = JSON.parse(JSON.stringify(newRow));
    if (!nodeData.value.nodeName) {
      nodeData.value.nodeName = "节点名";
      nodeData.value.code = "code";
    }
    if (nodeData.value.resultParams) {
      resultTableData.value = nodeData.value.resultParams;
    } else {
      resultTableData.value = [];
    }
    if (nodeData.value.exceptionParams) {
      exceptionTableData.value = nodeData.value.exceptionParams;
    }
    console.log(props)
  },
  {
    deep: true,
  }
);

function switchNodeEditState() {
  nodeEditState.value = !nodeEditState.value;
}
function insertSql() {
  const cm = editorRef.value?.cminstance;
  if (!cm) return;
  // 获取当前光标位置
  const doc = cm.getDoc();
  const cursor = doc.getCursor();
  doc.replaceRange(insertText.value, cursor);
  cm.focus();
}
function openNodeEditDialog() {
  switchNodeEditState();
}

async function successNode() {
  let errMap = await resultGridRef.value.validate(true);
  if (errMap) return;

  let errMap2 = await exceptionGridRef.value.validate(true);
  if (errMap2) return;

  $form.value.validate().then((res) => {
    if (res) {
      nodeData.value.resultParams = resultTableData.value;
      nodeData.value.exceptionParams = exceptionTableData.value;
      emit("successNode", nodeData.value);
      switchNodeEditState();
    }
  });
}

let javaEditorRef = ref();
let editCol = ref("");
let openJavaCode = (editName, code) => {
  editCol.value = editName;
  javaEditorRef.value.openJavaEditor(code);
};
let selectJavaCode = (code) => {
  nodeData.value[editCol.value] = code;
};
let handleResultAdd = () => {
  resultTableData.value.unshift({
    resultKey: "",
    resultSource: "",
  });
};
let handleResultDelete = () => {
  resultGridRef.value.removeCheckboxRow();
  resultTableData.value = resultGridRef.value.getTableData().fullData;
};

let handleExceptionAdd = () => {
  exceptionTableData.value.unshift({
    exceptionEl: "",
    exceptionMsg: "",
  });
};
let handleExceptionDelete = () => {
  exceptionGridRef.value.removeCheckboxRow();
  exceptionTableData.value = exceptionGridRef.value.getTableData().fullData;
}

defineExpose({
  openNodeEditDialog,
  nodeData,
});
</script>
<style scoped>
.el-row p {
  font-weight: bold;
}
</style>
<style>
#sqlCodex {
  width: 750px;
  max-width: 750px;
  height: 100%;
  overflow: hidden;

  .CodeMirror {
    line-height: 1em;
    font-family: monospace;
    margin-right: 1px;
    width: 750px;
    max-width: 750px;
    height: 100%;
    font-size: 14px;
  }

  .CodeMirror-scroll {
    overflow: auto;
    padding-bottom: 0px;
    width: 750px;
    max-width: 750px;
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
.custom-textarea {
  display: flex;
  align-items: flex-end;
}
.append-content {
  margin-left: 0px;
}
.parameter-setting {
  width: 100%;
  border-radius: 2px;
  padding-bottom: 20px;
}

.title-box {
  border-bottom: 1px solid #d9d9d9;
  padding: 8px 10px;
  background-color: #f5f5f5;
}

.title {
  font-weight: bold;
}

.button-group {
  margin: 15px 0;
  display: flex;
  gap: 10px;
  padding: 0 10px;
}
</style>
