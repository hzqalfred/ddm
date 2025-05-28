<template>
    <div class="converge">
        <span event="add" title="向前添加节点" class="converge_node">+</span>
    </div>
</template>


<script setup>
    import { inject,ref } from "vue"

    let getNode = inject('getNode')
    let getGraph = inject('getGraph')
    let graph = getGraph()
    let nodeData = ref({})

    let node = getNode()
    let endIncoming = graph.getNeighbors(node, {
        incoming: true //只获取前面节点
        })

    nodeData.value = node.data

    console.log(node)
    let isAdd = ref(false)

    endIncoming.some(item=>{
        if(item.data && item.data.finish && item.data.finish !== '99' && item.data.finish !== '1'){
            isAdd.value = true
            return true
        }
    })
</script>
<style lang="scss" scoped>
    .converge{
        text-align: center;
        position: relative;
        bottom: -10px;
        .converge_node{
            position: absolute;
            left: 50%;
            width: 18px;
            height: 18px;
            background: #fff;
            box-shadow: 0px 0px 2px #63a0e9;
            border-radius: 20px;
            color: #63a0e9;
            border: 1px solid #63a0e9;
            text-align: center;
            line-height: 1;
            font-size: 18px;
            margin-left: -10px;
            font-weight: 600;
            cursor: pointer;
        }
    }
</style>