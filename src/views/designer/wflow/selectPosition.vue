<template>
  <el-dialog :append-to-body="true" v-model="dialogVisible" title="请选择审批岗位" width="800" :before-close="closePositionDialog">
    <el-card>
      <div style="display: flex">
        <el-input v-model="qkw" size="small" placeholder="请输入关键词" clearable @keydown.enter="loadData" style="margin-right: 10px;">
          <template #append><el-button :icon="Search" @click="loadData" /></template>
        </el-input>
        <el-button type="default" @click="closePositionDialog">取消</el-button>
        <el-button type="primary" @click="selectedItem">确认选择</el-button>
      </div>
      <div class="list-wrap">
        <el-tree
          ref="dataTreeRef"
          show-checkbox="false"
          check-strictly="true"
          check-on-click-node="true"
          default-expand-all="true"
          node-key="candidateCode"
          :data="treeData"
          :props="{
            label: 'candidateName'
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
import {queryCandidatePost} from '@/api/workflow'

let qkw = ref('')
let dataTreeRef = ref(null)
let treeData = ref([])
let selectVal = ref('')
let selectName = ref('')
let dialogVisible = ref(false)
const $emit = defineEmits(['selectPositionData'])

const selectedItem = () => {
  $emit('selectPositionData', 
    {
      name: selectName.value,
      code: selectVal.value
    }
  )
  closePositionDialog()
}

const loadData = () => {
  queryCandidatePost({candidateName: qkw.value}).then(res => {
    treeData.value = res
  })
}

const closePositionDialog = () => {
  dialogVisible.value = false
  selectName.value = ''
  selectVal.value = ''
  dataTreeRef.value.setCheckedKeys([])
}

const openPositionDialog = () => {
  qkw.value = ''
  treeData.value =[]
  selectName.value = ''
  selectVal.value = ''
  dialogVisible.value = true
}

const selectNodeItem = (data, checkObj) => {
  if (checkObj.checkedKeys.length > 0) {
    dataTreeRef.value.setCheckedKeys([data.candidateCode])
    selectName.value = data.candidateName
    selectVal.value = data.candidateCode
  } else {
    selectName.value = ''
    selectVal.value = ''
  }
}
defineExpose({ openPositionDialog })
</script>
