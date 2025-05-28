<template>
  <div class="content-table-wrap">
    <div class="table-wrap">
      <div style="margin-bottom: 10px;">
        <el-button type="primary" :icon="Plus" @click="addDataRow">新增</el-button>
        <el-button type="danger" :icon="Delete" :disabled="!selectRowIds" @click="deleteDataRow">
          删除
        </el-button>
      </div>
      <el-table :data="tableData" border height="calc(100vh - 180px)" @selection-change="selectChangeRow">
        <el-table-column align="center" type="selection" width="60" />
        <el-table-column type="index" width="60" label="序号" />
        <el-table-column sortable align="center" prop="ddlName" label="DDL名" />
        <el-table-column sortable align="center" prop="ddlType" label="DDL类型">
          <template #default="scope">
            {{ translateDict(scope.row.ddlType, bo_typeData) }}
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="ddlMemo" label="DDL备注" />
        <el-table-column fixed="right" width="250" align="left" label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="editDataRow(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="editFormVisible" title="编辑" width="70%" top="5vh">
    <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="140px" status-icon>
      <el-row>
        <el-col :span="12">
          <el-form-item label="DDL名" prop="ddlName">
            <el-input v-model="editForm.ddlName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="DDL类型" prop="ddlType">
            <el-select v-model="editForm.ddlType" style="width: 100%" >
              <el-option v-for="item in bo_typeData" :key="item.value" :label="item.text" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="DDL备注" prop="ddlMemo">
            <el-input v-model="editForm.ddlMemo" laceholder="请输入DDL功能说明"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="DDL语句" prop="ddl">
            <el-input type="textarea"   :rows="10" style="width: 100%"
             v-model="editForm.ddl"  placeholder="请输入DDL语句"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeEditDialog">取消</el-button>
        <el-button type="primary" @click="saveFormData(false)">保存</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script setup>
import { ref, reactive, onMounted, inject} from 'vue'
import { getDdlList, saveDdl, deleteDdl } from '@/api/ddlManage'
import { Delete, Plus } from '@element-plus/icons-vue'
import { createMessageHandler } from "@/core/Message";
const $message = createMessageHandler();

let tableData = ref([])
let selectRowIds = ref('')

const moduleData = inject("moduleData");


const bo_typeData = [
  {
    text: '函数',
    value: 'function'
  },
  {
    text: '存储过程',
    value: 'procedure'
  },
  // {
  //   text: '视图',
  //   value: 'view'
  // },  
  // {
  //   text: '索引',
  //   value: 'index'
  // },
  // {
  //   text: '序列',
  //   value: 'sequence'
  // },
  // {
  //   text: '数据表',
  //   value: 'table'
  // },
  // {
  //   text: '触发器',
  //   value: 'trigger'
  // },
  // {
  //   text: '约束',
  //   value: 'constraint'
  // }
]
let editFormVisible = ref(false)
let editFormRef = ref({})
let editForm = reactive({
  ddlName: '',
  ddlType: '',
  ddlMemo: '',
  ddl: ''
})

const defaultForm = {
  ddlName: '',
  ddlType: '',
  ddlMemo: '',
  ddl: ''
}

const editRules = reactive({
  ddlName: [
    {
      required: true,
      message: '请填写DDL名',
      trigger: 'blur'
    }
  ],
  ddlType: [
    {
      required: true,
      message: '请填写DDL类型',
      trigger: 'blur'
    }
  ],
  ddl: [
    {
      required: true,
      message: '请填写DDL语句',
      trigger: 'blur'
    }
  ]
})

onMounted(() => {
  loadTableData()

})

const loadTableData = () => {
  getDdlList(
    { q__1:1,
      ...moduleData.value
    }
).then(res => {
    tableData.value = res.data
  })
}

const translateDict = (value, dict) => {
  let result = ''
  dict.forEach(item => {
    if (item.value === value) {
      result = item.text
    }
  })
  return result
}

const selectChangeRow = rows => {
  let seletedIds = rows.map(item => {
    return item.ddlName
  })
  selectRowIds.value = seletedIds.join(';')
}

const addDataRow = () => {

  Object.assign(editForm, defaultForm)
  editFormVisible.value = true
}
const editDataRow = row => {
  Object.assign(editForm, row)
  editFormVisible.value = true
}

const saveFormData = silent => {
  editFormRef.value.validate(valid => {
    if (valid) {
      let params = {
        datas: JSON.stringify([editForm]),
        ...moduleData.value
      }
      saveDdl(params).then(res => {
        if (res.code === '200') {
          if (silent) {
            loadTableData()
          } else {
            $message.notifySuccess('操作成功')
            editFormVisible.value = false
            loadTableData()
          }
        } else {
          $message.notifyError(res.msg)
        }
      })
    }
  })
}

const deleteDataRow = () => {
  if (!selectRowIds.value) {
    $message.notifyError('请选择要删除的记录')
    return
  }
  $message.confirmAction('确定要删除选中的数据？', '提示', () =>{    
    let params = {
      ids: selectRowIds.value,
      ...moduleData.value
    }
    deleteDdl(params).then(res => {
      $message.notifySuccess('删除成功')
      loadTableData()
    })})
}

const closeEditDialog = () => {
  editFormVisible.value = false
  editFormRef.value.resetFields()
}


defineExpose({})
</script>

<style lang="scss" scoped>
.content-table-wrap {
  display: flex;
  .table-wrap {
    flex: 1;
  }
}
</style>
