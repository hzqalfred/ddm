<!-- 套件管理 -->
<template>
  <div>
    <div style="margin:10px">
      <vxe-button status="primary" @click="selectEvent">安装</vxe-button>
      <vxe-button @click="viewMenu">菜单</vxe-button>
      <vxe-upload
        style="display: none;"
        v-model="fileList"
        multiple
        show-progress
        ref="uploadRef"
        :showUploadButton="false"
        :limit-count="1"
        :upload-method="uploadMethod"
        readonly
      >
      </vxe-upload>
      <div style="float: right;">
        <!-- <vxe-input
          v-model="searchValue"
          placeholder="请输入套件名称"
        ></vxe-input>
        <vxe-button status="primary" @click="moduleSearch">查询</vxe-button> -->
      </div>
    </div>
    <div>
      <vxe-table
        border
        show-overflow
        keep-source
        ref="moduleTableRef"
        empty-text="没有更多数据了！"
        :edit-config="{
          trigger: 'click',
          mode: 'row',
          beforeEditMethod: () => formStatus,
        }"
        :data="cpkTableData"
      >
        <vxe-column type="seq" width="55"></vxe-column>
        <vxe-column field="moduleName" title="套件名称"></vxe-column>
        <vxe-column field="moduleCode" title="标识符"></vxe-column>
        <vxe-column field="version" title="版本号"></vxe-column>
        <vxe-column field="installTime" title="安装日期"></vxe-column>
        <vxe-column field="installStatus" title="安装状态">
          <template #default="{ row }">
            {{ row.installStatus == "enable" ? "启用" : (row.installStatus == "pending" ? "灰度": "停用") }}
          </template>
        </vxe-column>
        <vxe-column field="version" title="当前启用版本号"></vxe-column>
        <vxe-column field="moduleRemark" title="描述"></vxe-column>
        <vxe-column title="操作" fixed="right" width="300">
          <template #default="{ row }">
            <vxe-button
              mode="text"
              status="error"
              @click="handleUninstallCpk(row)"
              >卸载</vxe-button
            >
            <vxe-button
              v-if="row.installStatus == 'enable'"
              mode="text"
              status="primary"
              @click="handleDisableCpk(row)"
              >停用</vxe-button
            >
            <vxe-button
              v-if="
                row.installStatus == 'disable' || row.installStatus == 'pending'
              "
              mode="text"
              status="primary"
              @click="handleEnableCpk(row)"
              >启用</vxe-button
            >
            <vxe-button mode="text" @click="viewHistory(row)">历史</vxe-button>
            <vxe-button mode="text" @click="handleSetting(row)"
              >设置</vxe-button
            >
          </template>
        </vxe-column>
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
  installCpk,
  getCpkList,
  enableCpk,
  disableCpk,
  uninstallCpk,
} from "@/api/devManage";
import messageHandler from "@/core/Message";
import { VxeUI } from "vxe-pc-ui";
import router from "@/core/components/WebHash/router";
import auth from "@/core/AuthManage";
const fileList = ref([]);
const formStatus = ref(false);
const formData = ref({});
const cpkTableData = ref([]);
const searchValue = ref("");
const pages = reactive({ currentPage: 1, pageSize: 10, total: 0 });
const homePage = ref(null);
// 将一个对象转换为URL查询字符串的格式
function convertToQuery(obj) {
  const params = new URLSearchParams();
  for (const key in obj) {
    if (obj[key]) {
      params.append(key, obj[key]);
    }
  }
  return params.toString();
}

// 获取套件列表数据
const fetchData = () => {
  const param = convertToQuery({
    pageNumber: pages.currentPage,
    pageSize: pages.pageSize,
    moduleName: searchValue.value,
  });
  getCpkList(param).then((res) => {
    let { data = {} } = res;
    if (res.success) {
      cpkTableData.value = data.records;
      pages.total = data.totalRow;
      pages.currentPage = data.pageNumber;
      pages.pageSize = data.pageSize;
    }
  });
};

onMounted(() => {
  homePage.value = inject("homePage");
  fetchData();
});

// 创建编辑
const viewHistory = (row) => {
  const param = {
    moduleName: row.moduleName,
    moduleCode: row.moduleCode,
    row: row,
  };
  homePage.value.create({
    data: {
      type: "window",
      ele: "window",
      code: "devHistory",
      id: "devHistory" + formData.value.moduleId,
      title: "套件历史" + `-${row.moduleName}`,
      width: "50%",
      height: "50%",
      mask: false,
      origin: true,
      visible: true,
      param,
    },
  });
};
const viewMenu = async () => {
  let menuWins = await homePage.value.create({
    data: {
      type: "window",
      ele: "window",
      code: "devMenu",
      id: "devMenu",
      title: "套件菜单",
      width: "80%",
      height: "80%",
      mask: false,
      origin: true,
      visible: true,
    },
  });

  // menuWins.param = {
  //   user: { id: 123, name: "张三" },
  // };

  // menuWins.lifeCircle = {
  //   // 参数会自动传入回调函数
  //   activate: function(eventData) {
  //
  //   },
  // };
};
const handleSetting = (item) => {
  const param = {
    moduleName: item.moduleName,
    moduleCode: item.moduleCode,
    moduleId: item.moduleId,
  };

  homePage.value.create({
    data: {
      type: "window",
      ele: "window",
      code: "devSetting",
      id: "devSetting" + item.moduleId,
      title: "套件设置" + `-${item.moduleName}`,
      width: "100%",
      height: "85%",
      mask: false,
      origin: true,
      visible: true,
      param,
    },
  });
};
// 导入CPK
const uploadRef = ref();
const uploadMethod = ({ file }) => {
  const formData = new FormData();
  formData.append("files", file);
  installCpk(formData)
    .then((res) => {
      if (res.success) {
        messageHandler.notifySuccess("导入成功");
      } else {
        messageHandler.notifyWarning("导入失败");
      }
    })
    .finally((res) => {
      fetchData();
      fileList.value = [];
    });
};

const selectEvent = () => {
  const $upload = uploadRef.value;
  if ($upload) {
    $upload.choose();
  }
};

const handleUninstallCpk = (data) => {
  VxeUI.modal.confirm({
    title: "卸载套件",
    content: "是否卸载套件：" + data.moduleName + "-" + data.moduleCode,
    draggable: false,
    onConfirm: () => {
      uninstallCpk({
        moduleName: data.moduleName,
        moduleCode: data.moduleCode,
      }).then((res) => {
        if (res.data) {
          messageHandler.notifySuccess("卸载成功");
        } else {
          messageHandler.notifyWarning("卸载失败");
        }
        fetchData();
      });
    },
  });
};

// 处理搜索操作
const moduleSearch = () => {
  pages.currentPage = 1;
  fetchData();
};

const handleDisableCpk = (data) => {
  let param = {
    moduleName: data.moduleName,
    moduleCode: data.moduleCode,
  };
  disableCpk(param)
    .then((res) => {
      messageHandler.notifyInfo(res?.msg);
    })
    .finally(() => {
      fetchData();
    });
};

const handleEnableCpk = (data) => {
  let param = {
    moduleName: data.moduleName,
    moduleCode: data.moduleCode,
  };
  let isPermissionModule = false
  if (data.settingList && data.settingList.length > 0) {
    data.settingList.map((item) => {
      if (
        item.settingItem == "permission:isAuthenticationEnabled" &&
        (item.settingValue == "true" || item.settingValue == "1")
      ) {
        isPermissionModule = true;
      }
    });
  }
  if (isPermissionModule) {
    VxeUI.modal.confirm({
      title: "启用套件",
      content: "启用套件后，将自动跳转到登录页，是否继续？",
      draggable: false,
      onConfirm: () => {
        enableCpk(param).then((res) => {
          // todo 跳转登录页
          auth.logout()
          setTimeout(() => {
            router.push("/login");
            router.go(0);
          }, 100);
        });
      },
    });
  } else {
    enableCpk(param)
      .then((res) => {
        messageHandler.notifyInfo(res?.msg);
      })
      .finally(() => {
        fetchData();
      });
  }
};
</script>

<style lang="scss">
.vxe-input--suffix {
  height: var(--vxe-select-option-height-small) !important;
  margin-top: 1px;
}
</style>
