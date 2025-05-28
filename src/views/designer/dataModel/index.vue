<template>

  <div class="content-table-wrap mt-20">
    <div class="tree-list-wrap">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>数据模型</span>
            <span>
              <el-icon size="18" @click="handleRefresh" style="cursor: pointer">
                <Refresh />
              </el-icon>
            </span>
          </div>
        </template>
        <div style="display: flex">
          <el-input v-model="querytableName" size="small" placeholder="请输入" clearable @keydown.enter="handleRefresh" style="margin-right: 10px;"></el-input>
          <el-button type="primary" size="small" :icon="Plus" @click="handleAddModel" >新增</el-button>
          <el-button type="danger" size="small" :icon="Delete" :disabled="!selectTableName" @click="handleDeleteModel" >删除</el-button>
        </div>
        <div class="list-wrap">
          <el-tree
            ref="treeRef"
            node-key="tableName"
            show-checkbox="false"
            check-strictly="true"
            check-on-click-node="true"
            :data="modelList"
            :props="{
              label: data => {
                return (data.tableComment||'') +'(' +data.tableName + ')'
              }
            }"
            @check="clickNode"
          />
        </div>
      </el-card>
    </div>
    <div class="table-wrap">
     <div style="display:flex; margin-bottom: 3px; ">
        <div style="border: 1px solid #ebeef5;margin-right: 5px;" id="parseSql"><textarea ref="$textarea" ></textarea></div>
        <el-button type="primary" :icon="Search" @click="handleParserDataModel">一键解析</el-button>
      </div>
      <div style="margin-bottom: 10px;">
        <el-button type="default" :icon="Refresh" :disabled="selectTableName === ''" @click="updateModel">从数据库同步</el-button>
        <el-button type="primary" :icon="Plus"  :disabled="selectTableName === ''" @click="handleAddAttr">新增</el-button>
        <el-button type="danger" :icon="Delete" :disabled="selectTableName === '' && selectedRowIds === ''" @click="handleDelModelCol">
          删除
        </el-button>
      </div>
      <el-table :data="tableData" border height="calc(100vh - 220px)" @selection-change="handleSelectChangeData">
        <el-table-column align="center" type="selection" width="60" />
        <el-table-column sortable align="center" prop="orderIndex" width="80" label="排序" />
        <el-table-column sortable align="center" prop="columnName" label="字段名" />
        <el-table-column sortable align="center" prop="columnRemark" label="字段备注" />
        <el-table-column sortable align="center" prop="columnType" label="字段类型" />
        <el-table-column sortable align="center" prop="columnLength" label="字段长度" />
        <el-table-column sortable align="center" prop="defaultValue" label="默认值" />
        <el-table-column sortable align="center" prop="hasPk" label="是否主键">
          <template #default="scope">
            {{ scope.row.hasPk === '1' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="hasNull" label="是否非空">
          <template #default="scope">
            {{ scope.row.hasNull === '1' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="hasIndex" label="是否索引">
          <template #default="scope">
            {{ scope.row.hasIndex === '1' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="handleEditAttr(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <DataModelEdit ref="dataModelEditRef" @refreshModelList="refreshModelList" :moduleData="moduleData"></DataModelEdit>
  <DataModelColEdit ref="dataModelPropertyEditRef" @refreshModelColList="refreshModelColList" 
    :rowData="rowData" :tableName="selectTableName" :moduleData="moduleData"></DataModelColEdit>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { getModelList, deleteModel, getModelColList, deleteModelCol, tranlateStatement, updateDataModel } from '@/api/dataModels'

import DataModelEdit from '@/views/designer/dataModel/modelEdit.vue'
import DataModelColEdit from '@/views/designer/dataModel/ItemEdit.vue'
import { Delete, Plus, Search, Refresh } from '@element-plus/icons-vue'
import { createMessageHandler } from "@/core/Message";
const $message = createMessageHandler();

// 引入全局实例
import _CodeMirror from 'codemirror'
// 核心样式
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/sql-hint.js'
import 'codemirror/addon/display/placeholder.js'

// 尝试获取全局实例
const CodeMirror = window.CodeMirror || _CodeMirror
var editor = ''
const $textarea = ref(null)

const options = ref({
  // 缩进格式
  tabSize: 2,
  // 显示行号
  lineNumbers: false,
  lineWrapping: true,
  autofocus: true,
  line: true,
  hintOptions: {
    completeSingle: false
  },
  placeholder:"请输入create table... 或 alter table...[add|drop|rename|change]... DDL语句"
})

let ddlStatement = ref('')
let querytableName = ref('')
let treeRef = ref(null)
let dataModelEditRef = ref(null)
let dataModelPropertyEditRef = ref(null)
let selectedRowIds = ref('')
let modelList = ref([])
let rowData = ref({})
let selectTableName = ref('')
let tableData = ref([])
const moduleData = inject("moduleData");

onMounted(() => {
  getModelListFn()
  _initialize()
})

function _initialize() {
  // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
  editor = CodeMirror.fromTextArea($textarea.value, { ...options.value, mode: 'text/x-sql' })
  // 编辑器赋值
  editor.setValue(ddlStatement.value)
  // 支持双向绑定
  editor.on('change', editor => {
    ddlStatement.value = editor.getValue()
  })

  // 输入提示
  editor.on('inputRead', () => {
    editor.showHint()
  })
}

const handleParserDataModel = () => {
  tranlateStatementFn()
}

const tranlateStatementFn = async () => {
  try {
    if (!ddlStatement.value) {
      $message.notifyError('请输入alter/create table DDL语句')
      return
    }
    let params = {
      ddlStatement: ddlStatement.value,
      ...moduleData.value
    }
    const { code, msg } = await tranlateStatement(params)
    if (code === '200') {
      $message.notifySuccess(msg+'解析成功')
      selectTableName.value = msg
      getModelListFn()


    } else {
      $message.notifyError(msg)
    }
  } catch (e) {
    console.error(e.message)
  }
}

const handleRefresh = () => {
  getModelListFn()
}

const handleAddModel = () => {
  dataModelEditRef.value.handleOpenDialog()
}

const handleDeleteModel = () => {
  let idsArr = treeRef.value.getCheckedNodes().map(item => {
    return item.tableName
  })
  let ids = idsArr.join(';')
  if (ids) {
    $message.confirmAction('确定要删除该数据模型？', '提示', () =>{deleteModelFn(ids)})
  } else {
    $message.notifyError('请勾选需要删除的数据模型')
  }
}

const deleteModelFn = async ids => {
  try {
    let params = {
      ids: ids,
      ...moduleData.value
    }
    const { code, msg } = await deleteModel(params)
    if (code === '200') {
      $message.notifySuccess('删除成功')
      selectTableName.value = ''
      selectedRowIds.value = ''
      tableData.value = []
      refreshModelList()
    } else {
      $message.notifyError(msg)
    }
  } catch (e) {
    $message.notifyError(e.message)
  }
}

const refreshModelList = () => {
  getModelListFn()
}

const clickNode = (data, checkObj) => {
  if (checkObj.checkedKeys.length > 0) {
    treeRef.value.setCheckedKeys([data.tableName])
    selectTableName.value = data.tableName
  } else {
    selectTableName.value = ''
    selectedRowIds.value = ''
    tableData.value = []
    return
  }

  selectTableName.value = data.tableName
  getModelColListFn(data.tableName)
}

const handleAddAttr = () => {
  if (!selectTableName.value) {
    $message.notifyError('请选择数据模型')
    return
  }
  rowData.value = {
    title: '新增',
    type: 'add'
  }
  dataModelPropertyEditRef.value.handleOpenDialog()
}

const handleEditAttr = row => {
  rowData.value = {
    title: '编辑',
    type: 'edit',
    data: row
  }
  dataModelPropertyEditRef.value.handleOpenDialog()
}

const handleSelectChangeData = data => {
  let selectedRowIdsArr = data.map(item => {
    return item.columnName
  })
  selectedRowIds.value = selectedRowIdsArr.join(';')
}

const handleDelModelCol = async () => {
  $message.confirmAction('确定要删除选中的项目？', '提示', () =>{ deleteModelColFn()})
}

const deleteModelColFn = async () => {
  try {
    let params = {
      ids: selectedRowIds.value,
      tableName: selectTableName.value,
      ...moduleData.value
    }
    const { code, msg } = await deleteModelCol(params)
    if (code === '200') {
      $message.notifySuccess('删除成功')
      await getModelColListFn(selectTableName.value)
    } else {
      $message.notifyError(msg)
    }
  } catch (e) {
    $message.notifyError(e.message)
  }
}

const getModelListFn = async () => {
  try {
    let params = {
      q__table_name: querytableName.value,
      ...moduleData.value
    }
    const { data } = await getModelList(params)
    modelList.value = data
    if(selectTableName.value){
      getModelColListFn(selectTableName.value)
    }else if(data && data.length >0){
      treeRef.value.setCheckedKeys([data[0].tableName])
      selectTableName.value = data[0].tableName
      getModelColListFn(selectTableName.value)
    }
  } catch (e) {
    $message.notifyError(e.message)
  }
}

const getModelColListFn = async id => {
  try {
    let params = {
      tableName: id,
      q__colName:'',
      ...moduleData.value
    }
    const { data } = await getModelColList(params)
    tableData.value = data
  } catch (e) {
    $message.notifyError(e.message)
  }
}
const refreshModelColList = () => {
  getModelColListFn(selectTableName.value)
}

const updateModel = async () => {
  $message.confirmAction('确定要同步更新选中的数据模型？', '提示', () =>{  updateModelFn()})
}

const updateModelFn = async () => {
  try {
    let params = {
      objectNames: selectTableName.value,
      ...moduleData.value
    }
    const { code, msg } = await updateDataModel(params)
    if (code === '200') {
      $message.notifySuccess('同步成功')
      await getModelColListFn(selectTableName.value)
    } else {
      $message.notifyError(msg)
    }
  } catch (e) {
    $message.notifyError(e.message)
  }
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
<style>
#parseSql {
  .CodeMirror {
  line-height: 1em;
  font-family: monospace;
  margin-right: 1px;
  height: 80px;
  min-width: 800px;
  max-width: 1200px;
  font-size : 13px;
}
.CodeMirror-scroll {
  overflow: auto;
  padding-bottom: 0px;
  height: 80px;
  position: relative;
}
}

</style>
