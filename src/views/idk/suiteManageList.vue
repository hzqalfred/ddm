<!-- 套件管理 -->
<template>
  <div>
    <div style="margin:10px">
      <vxe-button
        status="primary"
        @click="
          createSuite(false, {
            moduleId: '',
            moduleName: '',
            moduleCode: '',
            moduleRemark: '',
            moduleIcon: '',
            settingList: [],
            functionList: [],
          })
        "
        >创建套件</vxe-button
      >
      <vxe-button status="primary" @click="selectEvent"
        >导入套件(CPK)</vxe-button
      >
      <vxe-upload
        style="display: none;"
        multiple
        show-progress
        ref="uploadRef"
        :showUploadButton="false"
        :limit-count="1"
        :upload-method="uploadMethod"
        readonly
      >
      </vxe-upload>
      <vxe-input
        v-model="searchValue"
        type="search"
        placeholder="请输入套件名称"
        @search-click="moduleSearch"
        style="float: right;"
      ></vxe-input>
    </div>
    <div>
      <vxe-card
        v-for="(item, index) in dataKTI.records"
        :key="index"
        :width="200"
        :height="220"
        style="margin:10px"
      >
        <template #title>
          <div>{{ item.moduleName }}</div>
        </template>
        <template #extra>
          <vxe-button
            mode="text"
            status="error"
            icon="vxe-icon-close"
            @click="removeModule(item)"
          ></vxe-button>
        </template>
        <template #default>
          <div
            style="display: grid;place-items: center;text-align: center;width: 100%; height: 100%;"
          >
            <!-- <el-image :src="'/api/design/manage/module/getIcon?' + item.moduleIcon" style="width: 100%; height: 100%;"
              :show-preview="false" @error="handleImageError"> -->
            <!-- <template #error> -->
            <svg-icon
              size="100%"
              :iconClass="item.moduleIcon || 'gear'"
              className="icon-large"
            ></svg-icon>
            <!-- <svg-icon
              v-else
              size = "100%"
              iconClass="gear"
              className="icon-large"
            /> -->
            <!-- </template> -->
            <!-- </el-image> -->
          </div>
        </template>
        <template #footer>
          <div>
            <vxe-button
              content="编辑"
              @click="createSuite(true, item)"
              style="width: 80px;"
            ></vxe-button>
            <vxe-button
              @click="handlePreview(item)"
              content="预览"
              style="width: 80px;"
            ></vxe-button>
          </div>
        </template>
      </vxe-card>
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
  getModuleList,
  deleteModule,
  getModuleDetail,
  importModule,
} from "@/api/suiteManage";
import messageHandler from "@/core/Message";
import SvgIcon from "@/core/components/SvgIcon/index.vue";
import { VxeUI } from "vxe-pc-ui";

const dataKTI = ref({
  records: [],
  pageNumber: 1,
  pageSize: 10,
  totalPage: 0,
  totalRow: 0,
});
const formStatus = ref(false);
const formData = ref({});
const searchValue = ref("");
const pages = reactive({ currentPage: 1, pageSize: 10, total: 0 });
const homePage = ref(null);
const handleImageError = (e) => {
  // 确保错误模板被触发
};
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

// 关闭前执行的方法，返回一个Promise，增加定时，返回后刷新
const beforeHideMethod = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetchData();
      resolve(null);
    }, 300);
  });
};
const handlePreview = (item) => {
  const param = {
    moduleName: item.moduleName,
    moduleCode: item.moduleCode,
    moduleId: item.moduleId,
    env: "preview",
  };

  homePage.value.create({
    data: {
      type: "window",
      ele: "window",
      code: "webrender",
      id: "webrender" + item.moduleId,
      title: "界面预览",
      width: "100%",
      height: "85%",
      mask: false,
      origin: true,
      visible: true,
      param,
    },
  });
};
// 获取套件列表数据
const fetchData = () => {
  const param = convertToQuery({
    pageNumber: pages.currentPage,
    pageSize: pages.pageSize,
    moduleName: searchValue.value,
  });
  getModuleList(param).then((res) => {
    dataKTI.value = res.data || dataKTI.value;
    pages.total = dataKTI.value.totalRow;
  });
};

onMounted(() => {
  homePage.value = inject("homePage");
  fetchData();
});

// 创建编辑
const createSuite = (status, data) => {
  formStatus.value = status;
  formData.value = data;
  const param = {
    formData: data,
    formStatus: status,
  };
  homePage.value.create({
    data: {
      type: "window",
      ele: "window",
      code: "suiteManage",
      id: "suiteManage" + formData.value.moduleId,
      title: status ? "编辑套件" : "创建套件",
      width: "100%",
      height: "85%",
      mask: false,
      origin: true,
      visible: true,
      beforeDestory: beforeHideMethod,
      param: param,
    },
  });
};

// 导入CPK
const uploadRef = ref();
const uploadMethod = ({ file }) => {
  const formData = new FormData();
  formData.append("files", file);
  importModule(formData).then((res) => {
    messageHandler.notifyInfo(res?.msg || "");
    beforeHideMethod();
  });
};

const selectEvent = () => {
  const $upload = uploadRef.value;
  if ($upload) {
    $upload.choose();
  }
};
// 删除指定的套件，弹出一个是否确认删除框，
// 检查套件内是否有功能（如果有则提示无法删除），
const removeModule = (data) => {
  VxeUI.modal.confirm({
    title: "删除套件",
    content: "是否删除套件：" + data.moduleName + "-" + data.moduleCode,
    draggable: false,
    onConfirm: () => {
      const param = {
        moduleName: data.moduleName,
        moduleCode: data.moduleCode,
        moduleId: data.moduleId,
      };
      getModuleDetail(param).then((res) => {
        var data = res.data;
        var functionListData = data.functionList;
        if (functionListData && functionListData.length != 0) {
          messageHandler.notifyWarning("套件内已有功能，无法删除");
          return;
        }
        deleteModule({
          moduleName: data.moduleName,
          moduleCode: data.moduleCode,
        }).then(() => {
          dataKTI.value.records = dataKTI.value.records.filter(
            (record) => record.moduleCode !== data.moduleCode
          );
          messageHandler.notifySuccess("删除成功");
          fetchData();
        });
      });
    },
  });
};

// 处理搜索操作
const moduleSearch = () => {
  pages.currentPage = 1;
  fetchData();
};
</script>

<style lang="scss">
.vxe-input--suffix {
  height: var(--vxe-select-option-height-small) !important;
  margin-top: 1px;
}
</style>
