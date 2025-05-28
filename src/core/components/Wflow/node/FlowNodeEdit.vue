<template>
  <el-dialog :append-to-body="true" v-model="nodeEditState" title="节点信息" width="50%">
    <div>
      <el-form ref="$form" :rules="rules" :model="nodeData" label-width="150px">
        <el-tabs v-model="activeName" type="border-card">

          <el-tab-pane label="节点属性" name="first">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="节点标识">
                  <template #label>
                    节点标识
                    <el-tooltip content="节点唯一标识" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input disabled readonly placeholder="节点唯一标识，用于业务处理时标识当前节点" v-model="nodeData.nodeCode" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="nodeName" label="节点名称">
                  <el-input :disabled="designNode ? false : true" placeholder="节点名称" v-model="nodeData.nodeName" />
                </el-form-item>
              </el-col>
              <el-col v-if="nodeDialogType === 'add'" :span="24">
                <el-form-item prop="nodeType" label="节点类型">
                  <template #label>
                    节点类型
                    <el-tooltip content="新增串行节点：向前添加一个节点；新增并行节点：向前新增并行节点；添加并行节点：在当前并行节点中添加一个并行节点" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-select style="width: 100%" v-model="nodeData.nodeType">
                    <el-option label="新增串行节点" value="0" />
                    <el-option label="新增并行节点" value="1" />
                    <el-option label="添加并行节点" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="审批人">
                  <template #label>
                      审批人
                    <el-tooltip content="同时设置审批人和审批岗位时，优先应用审批岗位的参与人" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input readonly placeholder="同时设置审批人和审批岗位时，优先应用审批岗位的参与人" v-model="nodeData.userName">
                    <template #append>
                      <el-dropdown @click="selectCandidate" trigger="click" split-button type="primary">
                        <span>选择</span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item @click="clearData('0')">清除</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="审批岗位">
                  <template #label>
                      审批岗位
                    <el-tooltip content="同时设置审批人和审批岗位时，优先应用审批岗位的参与人" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input readonly placeholder="同时设置审批人和审批岗位时，优先应用审批岗位的参与人" v-model="nodeData.candidatePostName">
                    <template #append>
                      <el-dropdown @click="selectPosition" trigger="click" split-button type="primary">
                        <span>选择</span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item @click="clearData('1')">清除</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="actType" label="审批方式">
                  <template #label>
                    审批方式
                    <el-tooltip content="审批方式(默认/并行会签/或签/比例会签/顺序会签)" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-select @change="actTypeChange" style="width: 100%" :disabled="designNode ? false : true" v-model="nodeData.actType">
                    <el-option label="默认" value="0" />
                    <el-option label="并行会签" value="1" />
                    <el-option label="或签" value="2" />
                    <el-option label="比例会签" value="3" />
                    <el-option label="顺序会签" value="4" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="最多可参与人数" title="参与本节点审批人数上限">
                  <template #label>
                    最多可参与人数
                    <el-tooltip content="参与本节点审批人数上限" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input
                    type="number"
                    :disabled="designNode ? false : true"
                    onkeyup="value=value.replace(/[^\d]/g,'')"
                    placeholder="本节点参与审批的人员数上限"
                    v-model="nodeData.maxActNum"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="completeActRatio" label="比例签通过占比" title="比例签同意达到指定占比则允许通过">
                  <template #label>
                    比例签通过占比
                    <el-tooltip content="比例签同意达到指定占比则允许通过" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-select style="width: 100%" :disabled="designNode ? false : true" v-model="nodeData.completeActRatio">
                    <el-option label="10%人数同意" value="10" />
                    <el-option label="20%人数同意" value="20" />
                    <el-option label="30%人数同意" value="30" />
                    <el-option label="40%人数同意" value="40" />
                    <el-option label="50%人数同意" value="50" />
                    <el-option label="60%人数同意" value="60" />
                    <el-option label="65%人数同意" value="65" />
                    <el-option label="70%人数同意" value="70" />
                    <el-option label="75%人数同意" value="75" />
                    <el-option label="80%人数同意" value="80" />
                    <el-option label="85%人数同意" value="85" />
                    <el-option label="90%人数同意" value="90" />
                    <el-option label="95%人数同意" value="95" />
                    <el-option label="全部同意" value="100" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="是否可删除">
                  <template #label>
                    是否可删除
                    <el-tooltip content="本节点在审批中是否可减签" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-select :disabled="designNode ? false : true" style="width: 100%" v-model="nodeData.hasDelete">
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="是否知会">
                  <template #label>
                    是否知会
                    <el-tooltip content="本节点执行知会审批人，但不参与审批" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-select :disabled="designNode ? false : true" style="width: 100%" v-model="nodeData.hasNotice">
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="分支条件" name="second">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="分支执行条件">
                  <template #label>
                    分支执行条件
                    <el-tooltip content="满足条件则执行当前节点开始的分支,否则跳过,EL表达式" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input :readonly="designNode ? false : true" placeholder="满足条件则执行当前节点开始的分支,否则跳过,EL表达式" v-model="nodeData.branchValue" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="节点执行条件">
                  <template #label>
                    节点执行条件
                    <el-tooltip content="满足条件执行节点任务否则跳过,EL表达式" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input :readonly="designNode ? false : true" placeholder="满足条件执行节点任务否则跳过,EL表达式" v-model="nodeData.nodeValue" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="节点事件" name="third">
            <el-row :gutter="24"  >

              <el-col :span="24">
                <el-form-item label="任务生成时事件">
                  <template #label>
                    任务生成时事件
                    <el-tooltip content="任务生成时处理业务，Java代码实现IBpmTaskListener接口或配置数据服务（模块编码.模块名称.对象编码.方法编码）" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input  v-model="nodeData.createEvents" placeholder="任务生成时处理业务" />
                </el-form-item>
              </el-col>
              
              <el-col :span="24">
                <el-form-item label="任务完成前事件">
                  <template #label>
                    任务完成前事件
                    <el-tooltip content="任务完成前处理业务，Java代码实现IBpmTaskListener接口或配置数据服务（模块编码.模块名称.对象编码.方法编码）" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input v-model="nodeData.preEvents" placeholder="任务完成前处理业务"/>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="任务完成时事件">
                  <template #label>
                    任务完成时事件
                    <el-tooltip content="任务完成时处理业务，Java代码实现IBpmTaskListener接口或配置数据服务（模块编码.模块名称.对象编码.方法编码）" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input v-model="nodeData.endEvents" placeholder="任务完成时处理业务"/>
                </el-form-item>
              </el-col>
              
              <el-col :span="24">
                <el-form-item label="任务回退时事件">
                  <template #label>
                    任务回退时事件
                    <el-tooltip content="任务回退时处理业务，Java代码实现IBpmTaskListener接口或配置数据服务（模块编码.模块名称.对象编码.方法编码）" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                    <el-input v-model="nodeData.rollbackEvents" placeholder="任务回退时处理业务"/>
                </el-form-item>
              </el-col>
                              
              <el-col :span="24">
                <el-form-item label="任务驳回时事件">
                  <template #label>
                    任务驳回时事件
                    <el-tooltip content="任务驳回时处理业务，Java代码实现IBpmTaskListener接口或配置数据服务（模块编码.模块名称.对象编码.方法编码）" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input v-model="nodeData.rejectEvents" placeholder="任务驳回时处理业务"/>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="调用API事件">
                  <template #label>
                    调用API事件
                    <el-tooltip content="任务完成时调用外部API，Java代码实现IBpmTaskListener接口或配置数据服务（模块编码.模块名称.对象编码.方法编码）" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                    <el-input v-model="nodeData.callApiEvents" placeholder="任务完成时调用外部API"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="表单属性" name="fourth">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="可编辑属性">
                  <template #label>
                    可编辑属性
                    <el-tooltip content="定义表单全局可编辑属性，默认不可编辑，属性名是功能字段编号，多个字段用逗号分隔" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input :readonly="designNode ? false : true" placeholder="定义表单全局可编辑属性，默认不可编辑，属性名是功能字段编号，多个字段用逗号分隔" v-model="nodeData.editProperty" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="可用操作按钮">
                  <template #label>
                    可用操作按钮
                    <el-tooltip content="定义全局可用操作按钮，默认不可用，属性名是事件编码，多个按钮用逗号分隔" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input :readonly="designNode ? false : true" placeholder="定义全局可用操作按钮，默认不可用，属性名是事件编码，多个按钮用逗号分隔" v-model="nodeData.buttonProperty" />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="24">
                <el-form-item label="审批可见节点">
                  <template #label>
                    审批可见节点
                    <el-tooltip content="用于定义当前节点的审批结果在那些节点可见，默认都可见，多个节点用逗号分隔" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input :readonly="designNode ? false : true" placeholder="用于定义当前节点的审批结果在那些节点可见，默认都可见，多个节点用逗号分隔" v-model="nodeData.resultProperty" />
                </el-form-item>
              </el-col> -->

              <!-- <el-col :span="24">
                <el-form-item label="功能标识符" prop="funCode">
                  <template #label>
                    功能标识符
                    <el-tooltip content="本节点应用的表单功能标识符" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input :readonly="designNode ? false : true" v-model="nodeData.funCode" placeholder="本节点应用的表单功能标识符"/>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="审批表" prop="tableName">
                  <template #label>
                    审批表
                    <el-tooltip content="本节点应用的审批表" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input :readonly="designNode ? false : true" v-model="nodeData.tableName"  placeholder="本节点应用的审批表"/>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="审批表主键名" prop="keyColumn">

                  <template #label>
                    审批表的主键名
                    <el-tooltip content="本节点应用的审批表主键名" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input :readonly="designNode ? false : true" v-model="nodeData.keyColumn" placeholder="本节点应用的审批表主键名"/>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="审批表主键值" prop="keyColumnSql">
                  <template #label>
                    审批表的主键值
                    <el-tooltip content="本节点应用的审批表主键值" placement="top">
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input :readonly="designNode ? false : true" v-model="nodeData.keyColumnSql" placeholder="本节点应用的审批表主键值"/>
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="switchNodeEditState">取消</el-button>
        <el-button type="primary" @click="successNode">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- <JavaEditor ref="javaEditorRef" @selectJavaCode="selectJavaCode" /> -->

  <SelectCandidate @selectCandidateData="selectCandidateData" ref="selectCandidateRef"  />
  <SelectPosition @selectPositionData="selectPositionData" ref="selectPositionRef"  />
  
</template>

<script setup>
import { ref, defineExpose, defineProps, defineEmits, watch } from 'vue'
// import JavaEditor from '@/core/components/CodeEditor/javaEditor.vue'
import SelectCandidate from '@/views/designer/wflow/selectCandidate.vue'
import SelectPosition from '@/views/designer/wflow/selectPosition.vue'
import { Search } from '@element-plus/icons-vue'
const props = defineProps({
  nodeRow: {
    type: Object,
    default: () => {
      return {}
    }
  },
  nodeDialogType: {
    type: String,
    default: 'edit'
  },
  designNode: {
    type: Boolean,
    default: false
  }
})
let $form = ref(null)
const rules = ref({
  nodeName: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
  nodeType: [{ required: true, message: '请选择节点类型', trigger: 'blur' }]
})
const emit = defineEmits(['selectCandidate', 'selectPosition', 'clearData', 'successNode'])
const activeName = ref('first')
let nodeEditState = ref(false)
let nodeData = ref({})
function switchNodeEditState() {
  nodeEditState.value = !nodeEditState.value
}
watch(
  () => props.nodeRow,
  newRow => {
    nodeData.value.nodeType = '0'
    nodeData.value = JSON.parse(JSON.stringify(newRow))
    if (!nodeData.value.actType) {
      nodeData.value.actType = '0'
    }
  },
  {deep: true}
)

watch(
  () => nodeData.value.maxActNum,
  (newVal, oldVal) => {
    if (newVal <= 0) {
      nodeData.value.maxActNum = 1
    }
    if (newVal > 999) {
      nodeData.value.maxActNum = oldVal
    }
  }
)

watch(
  () => nodeData.value.actType,
  (newVal, oldVal) => {
    // 比例签
    if (newVal === '3' && !nodeData.value.completeActRatio) {
      nodeData.value.completeActRatio = 50
    } else if (newVal != '3') {
      nodeData.value.completeActRatio = ''
    }
    if (!nodeData.value.maxActNum) {
      if (newVal === '0') {
        nodeData.value.maxActNum = '1'
      } else {
        nodeData.value.maxActNum = '999'
      }
    }
  }
)

function openNodeEditDialog() {
  switchNodeEditState()
}

let selectCandidateRef = ref()
let selectPositionRef = ref()

function selectCandidate() {
  console.log('FlowNodeEdit selectCandidate...')
  //emit('selectCandidate')
  selectCandidateRef.value.openCandidateDialog()
}

let selectCandidateData = (data) => {
  console.log(data)
  nodeData.value.userName = data.name
  nodeData.value.userCode = data.code
}
function selectPosition() {
  console.log('FlowNodeEdit selectPosition...')
  selectPositionRef.value.openPositionDialog()
  
  //emit('selectPosition')
}
let selectPositionData = (data) => {
  console.log(data)
  nodeData.value.candidatePostName = data.name
  nodeData.value.candidatePost = data.code
}

function clearData(type) {
  console.log('FlowNodeEdit clearData...')
  // emit('clearData', type)
  if (type == '0') {
      nodeData.value.userName = ''
      nodeData.value.userCode = ''
    } else if (type == '1') {
      nodeData.value.candidatePostName = ''
      nodeData.value.candidatePost = ''
    }
}

function successNode() {
  $form.value.validate().then(res => {
    if (res) {
      emit('successNode', nodeData.value)
      switchNodeEditState()
    }
  })
}

function actTypeChange() {
  if (nodeData.value.actType !== '3') {
    nodeData.value.completeActRatio = ''
  }
}

// let javaEditorRef = ref()
// let editCol = ref('')
// let openJavaCode = (editName, code) => {
//   editCol.value = editName
//   javaEditorRef.value.openJavaEditor(code)
// }
// let selectJavaCode = (code) => {
//   nodeData.value[editCol.value] = code
// }


defineExpose({
  openNodeEditDialog,
  nodeData
})
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
