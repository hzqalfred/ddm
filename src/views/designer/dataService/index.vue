<template>
  <div class="content-table-wrap">
    <div class="tree-list-wrap">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>数据对象</span>
            <span>
              <el-icon size="18" style="cursor: pointer" @click="refreshDataSrvTree"><Refresh /></el-icon>
            </span>
          </div>
        </template>
        <div style="display: flex">
          <el-input v-model="queryKeyWord" size="small" placeholder="请输入关键词" clearable @keydown.enter="refreshDataSrvTree" style="margin-right: 10px;"></el-input>
          <el-button type="primary" size="small" :icon="Plus" @click="addDataService(true)" >新增</el-button>
          <el-button type="danger" size="small" :icon="Delete" :disabled="!selectTreeId" @click="deleteDataService" >删除</el-button>
        </div>
        <div class="list-wrap">
          <el-tree
              ref="treeRef"
              show-checkbox="false"
              check-strictly="true"
              check-on-click-node="true"
              default-expand-all="true"
              node-key="objectCode"
              :data="dataTreeList"
              :props="{
              label: data => {
                return (data.objectName || '')+'('+data.objectCode+')'
              }
            }"
              @check="clickNode"
          />
        </div>
      </el-card>
    </div>

    <div class="table-wrap">
      <div style="margin:10px 0px;">
        <el-button type="primary" :icon="Select" @click="saveDataService">保存数据对象</el-button>
        <el-button type="primary" :icon="Plus" @click="translateDialogWin">一键生成数据服务</el-button>
      </div>
      <div style="border: 1px solid #ebeef5; padding: 10px 10px 0px 0px;">
        <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="130px" status-icon>
          <el-row>
            <el-col :span="8">
              <el-form-item label="排序号" prop="orderIndex">
                <el-input-number v-model="editForm.orderIndex" :precision="0" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据对象编码" prop="objectCode">
                <el-input v-model="editForm.objectCode" :disabled="!addObject" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据对象名称" prop="objectName">
                <el-input v-model="editForm.objectName" maxlength="50"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="数据源名称" prop="dbSource">
                <el-input v-model="editForm.dbSource" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="关联表" prop="tableNames">
                <el-input v-model="editForm.tableNames" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="note">
                <el-input v-model="editForm.note"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-divider />
      <div style="margin:10px 0px;">
        <el-button type="primary" :icon="Plus" @click="addServiceEventRow">新增方法</el-button>
        <el-button type="danger" :icon="Delete" :disabled="!selectedRowIds" @click="deleteServiceEventRow">删除方法</el-button>
      </div>
      <el-table :data="tableData" border height="calc(100vh - 310px)" @selection-change="selectRowChange">
        <el-table-column align="center" type="selection" width="60" />
        <el-table-column sortable align="center" prop="orderIndex" width="80" label="排序号" />
        <el-table-column sortable align="center" prop="methodCode" width="120" label="方法编号" />
        <el-table-column sortable align="center" prop="methodName" width="120" label="方法名称" />
        <el-table-column sortable align="center" prop="note" label="方法说明" />
        <el-table-column fixed="right" width="250" align="left" label="操作">
          <template #default="scope">
            <el-button type="primary" :icon="List" link @click="editServiceEventRow(scope.row)">设计业务</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog
      v-model="translateDialogVisible"
      title="解析select语句生成数据服务"
      width="800"
      :before-close="translateClose"
  >
    <el-form
        ref="translateFormRef"
        :model="translateForm"
        :rules="translateFormRules"
        label-width="120px"
        status-icon
    >

      <el-row>
        <el-col :span="24">
          <el-form-item label="数据对象编码" prop="dataSvCode">
            <el-input style="width: 100%;"
                      v-model="translateForm.dataSvCode" placeholder="请输入数据对象编码"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="select 语句" prop="statements">
            <el-input type="textarea" rows="5" style="width: 100%;"
                      v-model="translateForm.statements"
                      placeholder="select 语句"
            />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="translateClose">关闭</el-button>
        <el-button type="primary" @click="translateSubmit">生成数据服务</el-button>
      </div>
    </template>
  </el-dialog>

  <ServiceEventEdit ref="serviceEventEditRef" :optType="optType":moduleDetails="moduleDetails" :moduleData="moduleData" @refreshTableData="loadTableData"></ServiceEventEdit>
</template>

<script setup>
import { reactive, ref, watch, computed, onMounted, inject } from 'vue'
import ServiceEventEdit from '@/views/designer/dataService/edit.vue'
import { listService, deleteService, saveService, listEvent, tranlateStatement, deleteEvent } from '@/api/dataService'
import { getModuleDetail } from "@/api/suiteManage";

import { Delete, Plus, Search, Select, List} from '@element-plus/icons-vue'
import { createMessageHandler } from "@/core/Message";
const $message = createMessageHandler();
let queryKeyWord = ref('')
let treeRef = ref(null)
let dataTreeList = ref([])
let selectTreeId = ref('')
let addObject = ref(false)
let moduleDetails = ref(null)
let editFormRef = ref({})
let editForm = reactive({
  orderIndex: '10',
  objectCode: '',
  objectName: '数据对象',
  dbSource: 'default',
  tableNames: '',
  note: ''
})
const editRules = reactive({
  objectCode: [
    {required: true,message: '请填写数据对象编码',trigger: 'blur'}
  ],
  objectName: [
    {required: true,message: '请填写数据对象名称',trigger: 'blur'}
  ],
  dbSource: [
    {required: true,message: '请填写数据源名称',trigger: 'blur'}
  ]
})

const resetEditForm = () =>{

  editForm.orderIndex= '10'
  editForm.objectCode= ''
  editForm.objectName= ''
  editForm.dbSource= 'default'
  editForm.tableNames= ''
  editForm.note= ''
  editForm.methodDtos = []
}

let tableData = ref([])
let selectedRowIds = ref('')
let serviceEventEditRef = ref()
let optType = ref({})

const moduleData = inject("moduleData");

const refreshDataSrvTree = () => {
  listService({ q__kwd: queryKeyWord.value, ...moduleData.value }).then(res => {
    dataTreeList.value = res.data

    if(!selectTreeId.value && res.data && res.data.length > 0 ){
      treeRef.value.setCheckedKeys([res.data[0].objectCode])
      selectTreeId.value = res.data[0].objectCode
      Object.assign(editForm, res.data[0])
      loadTableData()
    }
  })
}

onMounted(() =>{
  refreshDataSrvTree()
  console.log(moduleData)
  getModuleDetail(moduleData.value).then(res=>{
    moduleDetails.value = res.data
  })
})
const clickNode = (data, checkObj) => {
  if (checkObj.checkedKeys.length > 0) {
    treeRef.value.setCheckedKeys([data.objectCode])
    selectTreeId.value = data.objectCode
    Object.assign(editForm, data)
    addObject.value =false
  } else {
    addDataService(true)
  }
  loadTableData()
}

const deleteDataService = () => {
  if (!selectTreeId.value) {
    $message.notifyError('请选择要删除的数据服务')
    return
  }
  $message.confirmAction('确定删除选中的数据服务？', '提示', () =>{
    let params = {
      objectCode: selectTreeId.value,
      ...moduleData.value
    }
    deleteService(params).then(res => {
      $message.notifySuccess('删除成功')
      addDataService(false)
      refreshDataSrvTree()
    })})
}

const addDataService = (hasAddObject) => {
  treeRef.value.setCheckedKeys([])
  addObject.value = hasAddObject
  resetEditForm()
  selectTreeId.value = ''
  selectedRowIds.value = ''
  tableData.value = []
}

const saveDataService = () => {
  editFormRef.value.validate(valid => {
    if (valid) {
      let params = {
        datas: JSON.stringify([editForm]),
        optType: addObject.value,
        ...moduleData.value
      }
      saveService(params).then(res => {
        if (res.code === '200') {
          $message.notifySuccess('操作成功')
          refreshDataSrvTree()
        } else {
          $message.notifyError(res.msg)
        }
      })
    }
  })
}

const loadTableData = () => {
  listEvent({
    objectCode: selectTreeId.value,
    ...moduleData.value
  }).then(res => {
    tableData.value = res.data
  })
}
const addServiceEventRow = () => {
  if (!selectTreeId.value) {
    $message.notifyError('请选择数据对象')
    return
  }
  optType.value = {
    title: '新增方法',
    type: 'add',
    data: {},
    objectCode: selectTreeId.value
  }

  serviceEventEditRef.value.openEditDialog()
}
const editServiceEventRow = row => {
  optType.value = {
    title: '编辑方法',
    type: 'edit',
    data: row,
    objectCode: selectTreeId.value
  }

  serviceEventEditRef.value.openEditDialog()
}

const deleteServiceEventRow = () => {
  if (!selectedRowIds.value) {
    $message.notifyInfo('请选择要删除的记录')
    return
  }
  $message.confirmAction('确定要删除选中的数据？', '提示', () =>{

    let params = {
      methodCode: selectedRowIds.value,
      objectCode: selectTreeId.value,
      ...moduleData.value
    }
    deleteEvent(params).then(res => {
      $message.notifySuccess('删除成功')
      loadTableData()
    })
  })
}
const selectRowChange = rows => {
  let methodCodes = rows.map(item => {
    return item.methodCode
  })
  selectedRowIds.value = methodCodes.join(';')
}

let translateDialogVisible = ref(false)
let translateFormRef = ref({})

let translateForm = reactive({
  statements: '',
  dataSvCode:''
})

const translateFormRules = reactive({
  statements: [
    {required: true, message: '请输入Select SQL',trigger: 'blur'}
  ],
  dataSvCode: [
    {required: true, message: '请输入数据对象编码',trigger: 'blur'},
    {pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '命名规则不符(以字母开头，由字母、下划线和数字组成)' }
  ]
})

let translateClose = ()=>{
  translateDialogVisible.value = false
}

let translateSubmit  = ()=>{
  translateFormRef.value.validate().then(resx => {
    if (resx) {
      if(!translateForm.statements){
        $message.notifyError('请输入select语句')
        return
      }
      let params = {
        statements: translateForm.statements,
        dataSvCode: translateForm.dataSvCode,
        ...moduleData.value
      }
      tranlateStatement(params).then(res => {
        if (res.code === '200') {
          $message.notifySuccess('操作成功')
          translateDialogVisible.value = false
          refreshDataSrvTree()
        } else {
          $message.notifyError(res.msg)
        }
      })
    }
  })
}

let translateDialogWin  = ()=>{
  translateForm.dataSvCode = ''
  translateForm.statements = 'select * from 表名'
  translateDialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.content-table-wrap {
  display: flex;
  .tree-list-wrap {
    width: 300px;
    margin-right: 20px;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .list-wrap {
      padding: 6px 0;
      height: calc(100vh - 230px);
      overflow-y: auto;
      .list-item {
        padding: 4px;
        cursor: pointer;
        &:hover {
          background-color: #f5f7fa;
        }
        &.active {
          background-color: #cde3f1;
        }
      }
    }
  }
  .table-wrap {
    flex: 1;
  }
  .el-card {
    --el-card-padding: 5px;
  }
}
</style>
