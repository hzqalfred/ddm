<template>
  <el-dialog :append-to-body="true" v-model="dialogVisible" title="请选择审批用户" width="800" :before-close="closeCandidateDialog">
    <el-card>
      <div style="display: flex">
        <el-input v-model="qkw" size="small" placeholder="请输入关键词" clearable @keydown.enter="loadData" style="margin-right: 10px;">
          <template #append><el-button :icon="Search" @click="loadData" /></template>
        </el-input>
        <el-button type="default" @click="closeCandidateDialog">取消</el-button>
        <el-button type="primary" @click="selectedItem">确认选择</el-button>
      </div>
      <div class="list-wrap">
        <el-tree
          ref="dataTreeRef"
          show-checkbox="false"
          check-strictly="true"
          check-on-click-node="true"
          default-expand-all="true"
          node-key="userCode"
          :data="treeData"
          :props="{
              label: data => {
                return (data.deptName||'') +'_' + (data.userName ||'')
              }
            }"
          @check="selectNodeItem"
        />
      </div>
    </el-card>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineExpose } from 'vue'
import { Search } from '@element-plus/icons-vue'
import {queryCandidates} from '@/api/workflow'

let qkw = ref('')
let dataTreeRef = ref(null)
let treeData = ref([])
let selectVal = ref('')
let selectName = ref('')
let dialogVisible = ref(false)
const $emit = defineEmits(['selectCandidateData'])

const selectedItem = () => {
  $emit('selectCandidateData', 
    {
      name: selectName.value,
      code: selectVal.value
    }
  )
  closeCandidateDialog()
}

const loadData = () => {
  queryCandidates({userName: qkw.value}).then(res => {
    treeData.value = res
  })
}

const closeCandidateDialog = () => {
  dialogVisible.value = false
  selectName.value = ''
  selectVal.value = ''
  dataTreeRef.value.setCheckedKeys([])
}

const openCandidateDialog = () => {
  qkw.value = ''
  treeData.value =[]
  selectName.value = ''
  selectVal.value = ''
  dialogVisible.value = true
}

const selectNodeItem = (data, checkObj) => {
  if (checkObj.checkedKeys.length > 0) {
    dataTreeRef.value.setCheckedKeys([data.userCode])
    selectName.value = data.userName
    selectVal.value = data.userCode
  } else {
    selectName.value = ''
    selectVal.value = ''
  }
}
defineExpose({ openCandidateDialog })
</script>
