<template>
  <div :style="{ ...getNodeBorder() }" class="box">
    <div :style="{ ...getNodeHeader() }" class="header">
      <div class="title" :title="nodeData.nodeName + get_audit_type(nodeData.actType)">
        <span v-if="isNotice == '1'" title="知会节点" style="vertical-align: middle">
          <svg t="1742441291722" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2683" width="16" height="16"><path d="M888.376 217.096v209.152c-22.464 0.728-41.424-0.296-61.848 1.464 0-133.112-1.168 14.896-1.168-118.216V219.296c0-16.256 1.456-34.264-1.456-48.32-3.648-17.136-8.752-32.216-16.632-44.96-15.312-24.752-38.8-43.792-70.152-52.424-14.152-3.952-33.12-3.072-51.2-3.072H216.248c-16.336 0-35.152-1.624-49.296 1.464a123.28 123.28 0 0 0-51.2 24.152c-20.712 16.264-35.152 41.296-41.856 71.608-3.216 14.208-1.904 32.952-1.904 49.792v581.64c0 17.568-1.744 37.632 1.464 52.864 5.104 24.304 14.584 42.76 27.568 59.16 16.336 20.496 40.84 33.824 72.056 39.536 10.496 0.296 21.144 0.432 31.648 0.736h237.28c1.608 13.904 3.064 27.672 4.384 41.728 1.312 7.176 2.48 14.352 3.784 21.528H276.928c-41.864 0-94.952 4.248-129.672-4.544-39.672-10.096-72.928-30.896-94.952-58.864-18.376-23.28-32.232-49.496-39.96-83.76-4.232-19.472-3.36-43.64-3.36-67.216V701.208 313.456v-95.04c0-20.792-1.024-42.464 2.624-60.032C21.384 112.4 42.096 74.328 73.016 50.016c23.192-18.312 48.136-31.92 82.56-39.536 18.376-4.104 42.152-2.648 64.032-2.648H677.312c30.344 0 59.072-0.28 81.832 6.744 43.896 13.616 77.88 40.72 100.2 76.144 12.688 20.504 21.008 43.344 26.696 71.312 3.352 16.408 2.336 36.032 2.336 55.064zM292.68 702.824c-0.928 0-1.808-0.2-2.72-0.28-2.92-0.096-5.728-0.328-8.072-1.04-4.16-1.312-8.176-4.192-11.632-7.952-0.752-0.736-1.368-1.584-2.048-2.392-0.336-0.448-0.728-0.816-1.056-1.28a31.992 31.992 0 0 1-6.56-19.272c0-0.232 0.064-0.448 0.072-0.68 0-0.08 0.024-0.168 0.024-0.256a31.6 31.6 0 0 1 2.36-11.336l0.128-0.336c0.424-1.072 0.656-2.144 1.208-3.208 3.888-7.44 7.496-9.92 12.584-12.088a31.76 31.76 0 0 1 8.464-3.408c0.712-0.296 1.376-0.568 2.144-0.912l5.024 0.008 0.08-0.008h143.816c1 0 1.936 0.208 2.904 0.296h9.496c-2.264 0.104-4.36 0.216-6.336 0.328a32.28 32.28 0 0 1 26.032 31.592c0 17.728-14.448 32.224-32.096 32.224H292.68z m156.512-64c0.288 0 0.584-0.144 0.432 0h-0.432zM313.248 512.896c-11.376 0-24.944 1.168-33.112-2.2-5.568-2.248-10.688-6.944-14.272-12.84a30.584 30.584 0 0 1-5.272-17.176c0-16.984 13.856-30.752 30.632-30.752h258.904c16.336 0 29.8 13.08 30.504 29.448l0.088 0.904c0 0.136 0.04 0.264 0.04 0.4 0 0.24-0.064 0.464-0.072 0.704 0.008 0.888 0.064 1.768-0.072 2.664-0.08 0.496-0.24 0.856-0.336 1.336a29.504 29.504 0 0 1-1.192 4.84c-5.776 19.808-21.928 22.672-49.672 22.672H313.248z m263.384-190.224H291.224c-16.776 0-30.488-13.76-30.488-30.6 0-3.224 0.64-6.272 1.568-9.192l0.312-0.992a30.4 30.4 0 0 1 2.664-5.648c0.112-0.184 0.152-0.384 0.272-0.568 0.032-0.056 0.08-0.08 0.112-0.136a30.392 30.392 0 0 1 22.32-13.736l0.472-0.184h1.328c0.488-0.024 0.952-0.152 1.44-0.152h316.224a30.656 30.656 0 0 1 30.632 30.608c0 16.84-13.712 30.6-30.488 30.6h-15.568c-4.928 0.168-10.08 0.136-15.392 0z" fill="#ffffff" p-id="2684"></path><path d="M994.056 863.512c-8.336 16.936-16.92 28.784-23.152 35.424a19.952 19.952 0 0 1-28.088 0.944 19.648 19.648 0 0 1-0.952-27.912c3.696-3.952 10.008-12.672 16.528-25.864 11.12-22.464 17.832-48.912 17.832-79.08 0-30.16-6.712-56.576-17.832-79.08-6.52-13.184-12.832-21.912-16.528-25.856a19.68 19.68 0 0 1 0.952-27.912 19.888 19.888 0 0 1 28.048 0.944c6.232 6.592 14.816 18.48 23.192 35.336 13.712 27.72 21.888 60.008 21.888 96.528s-8.176 68.816-21.888 96.528z m-156.976 148.504l-158.776-115.464h-79.2c-44.456 0-65.504-35.296-65.504-78.88V716.384c0-43.864 21.488-78.888 65.504-78.888h79.2l158.776-115.544c22.008-9.432 39.84 0.632 39.84 22.624v444.824c0 21.944-17.4 32.296-39.84 22.616z" fill="#ffffff" p-id="2685"></path></svg>
        </span> 
        <span v-if="isNotice != '1'" title="任务节点" style="vertical-align: middle">
          <svg t="1742885427373" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4907" width="16" height="16"><path d="M327.9 453.1c21.7 9 46 14.4 71.3 14.4s49.6-5.4 71.3-14.4c64.5-28.4 109.2-92 109.2-166 0-99.7-80.8-180.4-180.5-180.4s-180.4 80.8-180.4 180.4c0 74 44.6 137.6 109.1 166z" fill="#ffffff" p-id="4908"></path><path d="M506.9 485.4c-0.5-0.2-1.2-0.1-1.7 0.1-5.7 3.2-11.3 6.5-17.4 9.2-28.1 11.7-58.8 17.9-88.6 17.9s-60.5-6.2-89.5-18.3c-5.8-2.6-11.1-5.8-16.6-8.8-0.5-0.3-1.1-0.3-1.7-0.1-121.2 44.1-208 160-208 296.5v90.2c0 24.9 20.2 45.1 45.1 45.1h541.3c24.9 0 45.1-20.2 45.1-45.1V782c0.1-136.5-86.7-252.5-208-296.6z" fill="#ffffff" p-id="4909"></path><path d="M624.8 287.1c0 62.6-26.5 120.9-70.8 163-1 1-0.7 2.7 0.6 3.3 8.8 3.6 37.1 14.1 70.2 14.1 25.3 0 49.6-5.4 71.3-14.4 64.5-28.4 109.2-92 109.2-166 0-99.7-80.8-180.4-180.5-180.4-24.9 0-48.4 5.2-70 14.3-1.3 0.6-1.6 2.3-0.6 3.3 43.2 41.1 70.6 98.6 70.6 162.8z" fill="#ffffff" p-id="4910"></path><path d="M731.6 485.1c-6 3.3-11.8 6.8-18.2 9.6-23.1 9.6-47.9 14.8-72.5 16.5-1.8 0.1-2.5 2.3-1.2 3.5C714.2 581.8 760.1 678 760.1 782v90.2c0 15.3-4.1 29.6-10.9 42.2-0.7 1.3 0.2 2.9 1.8 2.9h144.5c24.9 0 45.1-20.2 45.1-45.1V782c0-136.8-87.3-253-209-296.9z" fill="#ffffff" p-id="4911"></path></svg>
        </span>
        <span style="white-space: nowrap;text-overflow: ellipsis; overflow: hidden; width: 20px; font-size: 14px;">{{ nodeData.nodeName }}{{ get_audit_type(nodeData.actType) }}</span>
      </div>
      <div event="edit" v-if="getIsEdit() && isFinish !== '2' && isFinish !== '1' && isFinish !== '99'" title="改签" class="edit_node">
        <svg t="1742441168619" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1481"
         width="16" height="16"><path d="M79.169331 113.350554l121.006899 0 0 120.557773-121.006899 0 0-120.557773ZM324.965581 113.350554l647.967334 0 0 120.557773-647.967334 0 0-120.557773ZM79.169331 444.549837l121.006899 0 0 120.557773-121.006899 0 0-120.557773ZM324.965581 444.549837l647.967334 0 0 120.557773-647.967334 0 0-120.557773ZM79.169331 754.840781l121.006899 0 0 120.334643-121.006899 0 0-120.334643ZM324.965581 754.840781l647.967334 0 0 120.334643-647.967334 0 0-120.334643Z" fill="#ffffff" p-id="1482"></path></svg>
      </div>
    </div>

    <div class="content" :title="showDetail()">{{ nodeData.userName || nodeData.candidatePostName || '请配置审批人或岗位' }}</div>
    <div v-if="getIsAdd()" event="add" title="加签" class="add_node">+</div>
    <div v-if="getIsDelete()" event="delete" title="减签" class="delete_node">×</div>
  </div>
</template>

<script setup>
import { inject, ref} from 'vue'

let getNode = inject('getNode')
let getGraph = inject('getGraph')
let graph = getGraph()
let nodeData = ref({})
let node = getNode()
nodeData.value = node.data

let isFinish = nodeData.value.isFinish || '0'
let isNotice = nodeData.value.hasNotice || '0'
const audit_type = {
  0: '',
  1: '(并行会签)',
  2: '(或签)',
  3: '(比例会签)',
  4: '(顺序会签)'
}

function get_audit_type(value) {
  return audit_type[value] || ''
}
//节点样式
function isAddFn() {
  let nextNodes = graph.getNeighbors(node, {
    outgoing: true //只获取后面节点
  })

  let isReturn = 0

  nextNodes.forEach(item => {
    if (item.data.isFinish === '1') {
      isReturn++
    }
  })

  return nextNodes.length != isReturn
}
// 获取节点顶部样式
function getNodeHeader() {
  if (isFinish == '2') {
    //进行中
    return {
      backgroundColor: '#fc7719',
      border: '1px solid #fc7719'
    }
  } else if (isFinish == '1') {
    //已完成
      if(isNotice == '1'){
    return {
        backgroundColor: '#00665f'
      }
      }else {
        return {
      backgroundColor: '#67c23a'
      }
    }
  } else if (isFinish == '99') {
    //已结束
    return {
      backgroundColor: '#909399'
    }
  }
}

// 获取节点顶部样式
function getNodeBorder() {
  if (isFinish == '2') {
    //进行中
    return {
      border: '1px solid #fc7719'
    }
  } else if (isFinish == '1') {
    //已完成
    return {}
  } else if (isFinish == '99') {
    //已结束
    return {}
  }
}

node.on('change:data', res => {
  nodeData.value = res.current
})

function getIsAdd() {
  if (!('1' === nodeData.value.noAdd)) {
    return true
  } else {
    return false
  }
}

function getIsDelete() {
  if (!('1' === nodeData.value.noDel)) {
    return true
  } else {
    return false
  }
}

function getIsEdit() {
  if (!('1' === nodeData.value.noEdit)) {
    return true
  } else {
    return false
  }
}

function showDetail() {
  if ('2' != nodeData.value.isFinish) {
    return nodeData.value.userName
  } else {
    return '全部办理人：' + nodeData.value.userName + '\r\n已办理：' + nodeData.value.didUsers + '\r\n办理中：' + nodeData.value.todoUsers || ''
  }
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;

  position: relative;

  background: #fff;
  box-shadow: 0 0 5px #ccc;
  border-radius: 5px;
  &:hover {
    .delete_node {
      display: block;
    }
  }
  .header {
    height: 25px;
    background: #63a0e9;
    padding-right: 15px;
    position: relative;

    .title {
      color: #fff;
      line-height: 25px;
      font-weight: 500;
      overflow: hidden;
      margin-left: 2px;
      max-height: 25px;
    }
  }

  .content {
    padding: 3px;
    overflow: hidden;
    line-height: 15px;
    max-height: 45px;
    font-size: 13px;
  }
}

.edit_node {
  position: absolute;
  right: 0;
  top: 0;
  width: 20px;
  height: 25px;
  line-height: 25px;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  text-align: center;
}
.add_node {
  position: absolute;
  bottom: -30px;
  left: 50%;
  margin-left: -10px;
  height: 20px;
  width: 20px;
  background: #fff;
  box-shadow: 0px 0px 2px #63a0e9;
  border-radius: 20px;
  color: #63a0e9;
  line-height: 1;
  border: 1px solid #63a0e9;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 18px;
  text-align: center;
  font-weight: 700;
}

.delete_node {
  display: none;
  position: absolute;
  top: 35px;
  right: 8px;
  background: #ccc;
  width: 20px;
  height: 20px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  cursor: pointer;
  font-size: 18px;
  border-radius: 20px;
  &:hover {
    background: red;
  }
}
.add_condition {
  position: absolute;
  bottom: -60px;
  left: 50%;
  margin-left: -10px;
  background: #63a0e9;
  height: 20px;
  font-size: 20px;
  width: 20px;
  text-align: center;
  font-weight: 700;
  color: #fff;
  transform: rotate(45deg);
  line-height: 1;
  cursor: pointer;
}
</style>
