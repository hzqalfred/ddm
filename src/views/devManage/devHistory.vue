<!-- 套件管理 -->
<template>
  <div>
    <div>
      <vxe-table
        border
        show-overflow
        keep-source
        ref="moduleTableRef"
        empty-text="没有更多数据了！"
        :data="cpkHistoryData"
      >
        <vxe-column type="seq" width="55"></vxe-column>
        <vxe-column field="version" title="版本号"></vxe-column>
        <vxe-column field="installDate" title="安装日期"></vxe-column>
        <vxe-column title="操作" fixed="right" width="300">
          <template #default="{ row }">
            <vxe-button
              mode="text"
              status="error"
              @click="handleDeleteCpkHistory(row)"
              >删除</vxe-button
            >
            <vxe-button
              v-if="!row.active"
              mode="text"
              @click="handleRollbackCpkHistory(row)"
              >回滚</vxe-button
            >
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
import {
  cpkHistoryList,
  deleteCpkHistory,
  rollbackCpkHistory,
} from "@/api/devManage";
import messageHandler from "@/core/Message";
import { VxeUI } from "vxe-pc-ui";
// Props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const cpkHistoryData = ref([]);
const homePage = ref(null);

// 获取套件列表数据
const fetchData = () => {
  ;
  let data = props.data;
  let { param = {} } = data;
  cpkHistoryList({
    moduleName: param.moduleName,
    moduleCode: param.moduleCode,
  }).then((res) => {
    if (res.success) {
      cpkHistoryData.value = res.data;
    }
  });
};

onMounted(() => {
  homePage.value = inject("homePage");
  fetchData();
});

const handleDeleteCpkHistory = (row) => {
  VxeUI.modal.confirm({
    title: "删除版本",
    content: "是否删除版本：" + row.version,
    draggable: false,
    onConfirm: () => {
      let data = props.data;
      let { param = {} } = data;
      deleteCpkHistory({
        moduleName: param.moduleName,
        moduleCode: param.moduleCode,
        version:row.version
      }).then((res) => {
        if (res.data) {
          messageHandler.notifySuccess("删除成功");
        } else {
          messageHandler.notifyWarning("删除失败");
        }
        fetchData();
      });
    },
  });
};

const handleRollbackCpkHistory = (row) => {
  VxeUI.modal.confirm({
    title: "回滚版本",
    content: "是否回滚版本：" + row.version,
    draggable: false,
    onConfirm: () => {
      let data = props.data;
      let { param = {} } = data;
      let params= {
        moduleName: param.moduleName,
        moduleCode: param.moduleCode,
        version:row.version
      };
      rollbackCpkHistory(params)
        .then((res) => {
          messageHandler.notifyInfo(res?.msg);
        })
        .finally(() => {
          fetchData();
        });
    },
  });
};
</script>

<style lang="scss">
.vxe-input--suffix {
  height: var(--vxe-select-option-height-small) !important;
  margin-top: 1px;
}
</style>
