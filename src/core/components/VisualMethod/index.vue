<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="14">
        <div ref="$MethodBox" style="height: 500px; width: 100%"></div>
      </el-col>
      <el-col :span="10">
        <div class="param-setting">
          <div class="title-box">
            <div class="title">入参设置</div>
          </div>
          <div class="button-group">
            <vxe-button
                content="解析"
                @click="parseRequestParams()"
            ></vxe-button>
            <vxe-button
              status="primary"
              content="新增"
              @click="handleAdd('request')"
            ></vxe-button>
            <vxe-button
              status="danger"
              content="删除"
              @click="handleDelete('request')"
            ></vxe-button>
          </div>
          <vxe-grid
            border
            ref="requestGridRef"
            :max-height="200"
            :edit-rules="{
              requestColumn: [{ required: true, message: '必须填写' }],
              queryColumn: [{ required: true, message: '必须' }],
            }"
            :columns="requestColumns"
            :data="requestTableData"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
            :show-overflow="true"
          >
          </vxe-grid>
        </div>
        <div class="result-setting">
          <div class="title-box">
            <div class="title">结果集设置</div>
          </div>
          <div class="button-group">
            <vxe-button
              status="primary"
              content="新增"
              @click="handleAdd('result')"
            ></vxe-button>
            <vxe-button
              status="danger"
              content="删除"
              @click="handleDelete('result')"
            ></vxe-button>
          </div>
          <vxe-grid
            border
            ref="resultGridRef"
            :max-height="200"
            :edit-rules="{
              resultKey: [{ required: true, message: '必须填写' }],
              resultSource: [{ required: true, message: '必须填写' }],
            }"
            :columns="resultColumns"
            :data="resultTableData"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
            :show-overflow="true"
          >
          </vxe-grid>
        </div>
      </el-col>
    </el-row>
    <MethodNodeEdit
      :nodeDialogType="nodeDialogType"
      @successNode="successNode"
      ref="$NodeEdit"
      :nodeRow="nodeRow"
      :designNode="graphType === 'edit'"
      :moduleDetails="moduleDetails"
    ></MethodNodeEdit>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import MethodNodeEdit from "@/core/components/VisualMethod/node/MethodNodeEdit.vue";
import useFlow from "@/core/components/VisualMethod/lib/objectMethodCore";

import {parseRequestParam} from '@/api/dataService'
import {createMessageHandler} from "@/core/Message";

const $message = createMessageHandler();
const $NodeEdit = ref(null);
const $MethodBox = ref(null);
const props = defineProps({
  chart: {},
  graphType: {
    type: String,
    default: "edit",
  },
  resultParams: [],
  requestParams: [],
  moduleDetails:{}
});

const emit = defineEmits(["openSelectWindow", "getLayoutData"]);

let requestGridRef = ref(null);
let requestTableData = ref([]);
let requestColumns = ref([
  { type: "checkbox", width: 44 },
  {
    field: "orderIndex",
    title: "排序",
    width: 80,
    editRender: { name: "VxeInput", props: { type: "integer" } },
  },
  {
    field: "requestColumn",
    title: "字段",
    width: 120,
    editRender: { name: "input" },
  },
  {
    field: "columnName",
    title: "字段名称",
    width: 120,
    editRender: { name: "input" },
  },
  { field: "jsonSchema", title: "校验表达式", editRender: { name: "input" } },
  {
    field: "queryColumn",
    title: "是否查询字段",
    width: 150,
    formatter: ({ cellValue }) => {
      return cellValue ? "是" : "否";
    },
    editRender: {
      name: "select",
      options: [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
    },
  },
]);
let resultGridRef = ref(null);
let resultTableData = ref([]);
let resultColumns = ref([
  { type: "checkbox", width: 44 },
  {
    field: "orderIndex",
    title: "排序",
    width: 80,
    editRender: { name: "VxeInput", props: { type: "integer" } },
  },
  {
    field: "resultKey",
    title: "字段",
    editRender: { name: "input" },
  },
  { field: "resultSource", title: "来源", editRender: { name: "input" } },
]);
let parseRequestParams = async () => {
  const data = await getSaveData();
  let params = {
    data: JSON.stringify({cells: data.cells}),
    requestParams: JSON.stringify(requestGridRef.value.getData()),
    moduleName: props.moduleDetails.moduleName,
    moduleCode: props.moduleDetails.moduleCode
  }
  parseRequestParam(params).then(res => {
    if (res.code === '200') {
      if (res.data && res.data.length > 0) {
        requestTableData.value = res.data;
      }
      $message.notifySuccess('解析入参成功')
    }
  })
};
let handleAdd = (key) => {
  if (key === "request") {
    requestTableData.value.unshift({
      requestColumn: "",
      columnName: "",
      jsonSchema: "",
      queryColumn: false,
    });
  } else {
    resultTableData.value.unshift({
      resultKey: "",
      resultSource: "",
    });
  }
};
let handleDelete = (key) => {
  if (key === "request") {
    requestGridRef.value.removeCheckboxRow();
    requestTableData.value = requestGridRef.value.getTableData().fullData;
  } else {
    resultGridRef.value.removeCheckboxRow();
    resultTableData.value = resultGridRef.value.getTableData().fullData;
  }
};

let getSaveData = async () => {
  let requestErrMap = await requestGridRef.value.validate(true);
  let resultErrMap = await resultGridRef.value.validate(true);
  if (resultErrMap || requestErrMap) return;
  console.log(getSaveGraphData());
  let data = Object.assign({}, getSaveGraphData(), {
    resultParams: resultGridRef.value.getData(),
    requestParams: requestGridRef.value.getData(),
  });
  return data;
};

let {
  nodeRow,
  nodeDialogType,
  selectType,
  initFlow,
  successNode,
  getSaveGraphData,
} = useFlow(undefined, $NodeEdit, emit, props.chart, props, $MethodBox);
watch(
  () => props.chart,
  () => {
    initFlow();
  }
);
onMounted(() => {
  console.log(props);
  resultTableData.value = props.resultParams || [];
  requestTableData.value = props.requestParams || [];
});
defineExpose({
  selectType,
  $NodeEdit,

  getSaveData,
});
</script>
