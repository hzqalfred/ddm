<template>
  <div class="box" :style="getStyle">
    开始
    <div v-if="isAddFn()" class="add_node" title="加签" event="add">
      +
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'

let getNode = inject('getNode')
let getGraph = inject('getGraph')
let graph = getGraph()
let nodeData = ref({})

let node = getNode()

nodeData.value = node.data

function isAddFn() {
  let nextNodes = graph.getNeighbors(node, {
    outgoing: true //只获取后面节点
  })

  let isReturn = 0

  let noAdd = 0
  nextNodes.forEach(item => {
    if (item.data.finish === '1' || item.data.finish == '99') {
      isReturn++
    }
    if (item.data.noAdd === '1') {
      noAdd++
    }
  })

  return nextNodes.length != isReturn && noAdd == 0
}
</script>

<style lang="scss" scoped>
.box {
  width: 60px;
  height: 60px;
  background: #fff;
  margin: 0 auto;
  font-size: 20px;
  font-weight: 300;
  text-align: center;
  border-radius: 30px;
  color: #fff;
  line-height: 60px;
  position: relative;
  color: #63a0e9;
  border: 1px solid #63a0e9;
  box-shadow: 0px 0px 2px #63a0e9;
  bottom: -20px;
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
  cursor: pointer;
  border: 1px solid #63a0e9;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 18px;
  text-align: center;
  font-weight: 600;
}

.add_condition {
  position: absolute;
  bottom: -60px;
  left: 50%;
  margin-left: -10px;
  background: #fc7719;
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
