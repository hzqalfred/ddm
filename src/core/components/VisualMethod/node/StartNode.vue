<template>
  <div class="box" >
    开始
    <div class="add_node" title="向前添加节点" event="add">
      +
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'

let getNode = inject('getNode')
let nodeData = ref({})

let node = getNode()

nodeData.value = node.data

</script>

<style lang="scss" scoped>
.box {
  width: 50px;
  height: 50px;
  background: #fff;
  margin: 0 auto;
  font-size: 16px;
  font-weight: 200;
  text-align: center;
  border-radius: 25px;
  border: 1px solid #63a0e9;
  color: #63a0e9;
  line-height: 50px;
  position: relative;
  bottom: -30px;
  font-weight: 500;
}
.add_node {
  position: absolute;
  bottom: -28px;
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
  font-weight: 600;
}


</style>
