<!-- 数据归档日志 -->
<template>
  <div>
    <div style="margin:10px">
      <vxe-button @click="getLogfile">系统日志</vxe-button>
      <vxe-button status="error" @click="getErrorfile">异常日志</vxe-button>
    </div>
  <div>
    <vxe-form
      ref="formRef"
      :data="formData"
      @submit="fetchData"
      @reset="resetEvent">
      <vxe-form-item title="操作" field="action" span="12" :item-render="{}">
        <template #default="params">
          <vxe-input v-model="formData.action" ></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="操作用户ID" field="userId" span="12" :item-render="{}">
        <template #default="params">
          <vxe-input v-model="formData.userId" ></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="数据表" field="tableName" span="12" :item-render="{}">
        <template #default="params">
          <vxe-input v-model="formData.tableName" ></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="数据ID" field="dataId" span="12" :item-render="{}">
        <template #default="params">
          <vxe-input v-model="formData.dataId" ></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item align="center" span="24" :item-render="{}">
        <template #default>
          <vxe-button type="submit" status="primary" content="查询"></vxe-button>
          <vxe-button type="reset" content="重置"></vxe-button>
        </template>
      </vxe-form-item>
    </vxe-form>
  </div>
    <div>
      <vxe-table
        border
        show-overflow
        keep-source
        empty-text="没有更多数据了！"
        :edit-config="{
          trigger: 'click',
          mode: 'row',
          beforeEditMethod: () => formStatus,
        }"
        :data="tableData"
      >
        <vxe-column field="action" width="100" title="操作"></vxe-column>
        <vxe-column field="tableName" width="200" title="数据表"></vxe-column>
        <vxe-column field="dataId" width="180" title="数据ID"></vxe-column>
        <vxe-column field="userId" width="180" title="操作用户ID"></vxe-column>
        <vxe-column field="tags" width="180" title="标签"></vxe-column>
        <vxe-column field="triggerDate" width="180" title="操作时间" >
          <template v-slot="{ row }">
            {{ formatDate(row.triggerDate) }}
          </template>
        </vxe-column>
        <vxe-column field="data" width="300" title="数据记录"></vxe-column>
      </vxe-table>
    </div>
    <div style="position: absolute; right: 40px; bottom: 20px;">
      <vxe-pager
        v-model:current-page="pages.currentPage"
        v-model:page-size="pages.pageSize"
        :total="pages.total"
        @page-change="fetchData"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive, inject } from "vue";
import {
  qDataLogging,
} from "@/api/devManage";
import messageHandler from "@/core/Message";
import { VxeUI } from "vxe-pc-ui";
import router from "@/core/components/WebHash/router";
import auth from "@/core/AuthManage";

const formStatus = ref(false);
const tableData = ref([]);
const pages = reactive({ currentPage: 1, pageSize: 10, total: 0 });
const homePage = ref(null);
const formData= reactive({action:'',tableName:'',dataId:'',userId:''})
const formRef = ref(null)

const resetEvent = (val) => {
  formData.action =''
  formData.dataId =''
  formData.tableName =''
  formData.userId =''
  fetchData();
};
// 获取套件列表数据
const fetchData = () => {
  const param = {
    pageNumber: pages.currentPage,
    pageSize: pages.pageSize,
    action: formData.action,
    dataId: formData.dataId,
    tableName: formData.tableName,
    userId: formData.userId,
  };
  qDataLogging(param).then((res) => {
    tableData.value = res.records;
    pages.total = res.totalRow;
    pages.currentPage = res.pageNumber;
    pages.pageSize = res.pageSize;
  });
};

const getLogfile = async () => {
   await homePage.value.create({
    data: {
      type: "window",
      ele: "window",
      code: "loggingInfo",
      id: "loggingInfo",
      title: "系统日志",
      width: "80%",
      height: "80%",
      mask: false,
      origin: true,
      visible: true,
    },
  });
};

const getErrorfile = async () => {
   await homePage.value.create({
    data: {
      type: "window",
      ele: "window",
      code: "loggingError",
      id: "loggingError",
      title: "异常日志",
      width: "80%",
      height: "80%",
      mask: false,
      origin: true,
      visible: true,
    },
  });
};

onMounted(() => {
  homePage.value = inject("homePage");
  fetchData();
});

const formatDate = (date) => {
  
  if (date) {
    return new Date(date).toLocaleString();
  } else {
    return "";
  }
};
</script>

<style lang="scss">
.vxe-input--suffix {
  height: var(--vxe-select-option-height-small) !important;
  margin-top: 1px;
}
</style>
