<template>
  <div>
    <div ref="$FlowBox" style="height: 500px; width: 100%"></div>
    <FlowNodeEdit
      :nodeDialogType="nodeDialogType"
      @successNode="successNode"
      ref="$NodeEdit"
      :nodeRow="nodeRow"
      :designNode="graphType === 'edit'"
    ></FlowNodeEdit>
  </div>
</template>

<script setup>
  import { ref, defineProps, defineEmits, defineExpose, watch } from 'vue'
  import FlowNodeEdit from '@/core/components/Wflow/node/FlowNodeEdit.vue'
  import flowCore from '@/core/components/Wflow/lib/flowCore'
  const $NodeEdit = ref(null)
  const $FlowBox = ref(null)
  const props = defineProps({
    chart: {},
    graphType: {
      type: String,
      default: 'edit'
    }
  })

  // from \views\designer\wflow\index.vue
  const emit = defineEmits([ 'getLayoutData'])

  let {
    nodeRow,
    nodeDialogType,
    initFlow,
    successNode,
    getSaveGraphData
  } = flowCore(undefined, $NodeEdit, emit, props.chart, props, $FlowBox)

  watch(
    () => props.chart,
    () => {initFlow()}
  )

  defineExpose({
    $NodeEdit,
    getSaveGraphData
  })
</script>
