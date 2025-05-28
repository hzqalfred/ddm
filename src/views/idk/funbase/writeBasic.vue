<template>
  <div style="margin-top: 40px;padding: 0 40px;">
    <vxe-form
      ref="formRef"
      :data="formData"
      :rules="formRules"
      @submit="submitEvent"
      @reset="resetEvent"
      :title-width="120"
      style="margin-left: 30%;"
    >
      <!-- 新增的模板选择下拉框 -->
      <vxe-form-item
        title="功能模板"
        field="functionType"
        span="13"
        :item-render="{}"
      >
        <template #default="params">
          <vxe-select
            v-model="formData.functionType"
            @change="changeEvent(params)"
          >
            <vxe-option
              v-for="item in templateOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-form-item>

      <vxe-form-item
        title="功能名称"
        field="functionName"
        span="13"
        :item-render="{}"
      >
        <template #default="params">
          <vxe-input
            v-model="formData.functionName"
            @change="changeEvent(params)"
          ></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item
        title="功能标识"
        field="functionCode"
        span="13"
        :item-render="{}"
      >
        <template #default="params">
          <vxe-input
            v-model="formData.functionCode"
            @change="changeEvent(params)"
          ></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item
        title="归属模块"
        field="moduleName"
        span="13"
        :item-render="{}"
      >
        <template #default="params">
          <vxe-pulldown
            ref="pulldownRef"
            popup-class-name="dropdown-table"
            transfer
          >
            <template #default>
              <vxe-input
                v-model="formData.moduleName"
                disabled
                suffix-icon="vxe-icon-table"
                @keyup="keyupEvent"
                @focus="focusEvent"
              ></vxe-input>
            </template>
            <template #dropdown>
              <div class="dropdown-table-body">
                <vxe-grid
                  v-bind="gridOptions"
                  @cell-click="cellClickEvent"
                  @page-change="pageChangeEvent"
                >
                </vxe-grid>
              </div>
            </template>
          </vxe-pulldown>
        </template>
      </vxe-form-item>
      <vxe-form-item
        title="功能排序"
        field="orderIndex"
        span="13"
        :item-render="{}"
      >
        <template #default="params">
          <vxe-input
            v-model="formData.orderIndex"
            type="integer"
            step="10"
            min="10"
            max="1000"
            @change="changeEvent(params)"
          ></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item
        title="子功能"
        field="subFunctionCodes"
        span="13"
        :item-render="{}"
      >
        <template #default="params">
          <vxe-select
            v-model="formData.subFunctionCodes"
            @change="changeEvent(params)"
            clearable
            multiple
          >
            <vxe-option
              v-for="item in functionList"
              :label="item.functionName"
              :value="item.functionCode"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-form-item>
      <vxe-form-item align="center" span="24" :item-render="{}">
        <template #default>
          <vxe-button
            type="submit"
            status="primary"
            content="下一步"
            class="next-button"
          ></vxe-button>
        </template>
      </vxe-form-item>
    </vxe-form>
  </div>
</template>

<script>
import { getModuleList, getModuleDetail } from "@/api/suiteManage";
import { getFunctionDetail } from "@/api/functionGenerator";
import messageHandler from "@/core/Message";

export default {
  name: "writeBasic",
  props: ["funData"],
  data() {
    const mockList = [];
    const gridOptions = {
      border: true,
      autoResize: true,
      loading: false,
      height: "100%",
      rowConfig: {
        isHover: true,
      },
      pagerConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5, 10, 20],
      },
      columns: [
        { field: "moduleId", title: "模块ID", visible: false },
        { field: "moduleName", title: "模块名称", width: "150" },
        { field: "moduleCode", title: "标识符", width: "150" },
        { field: "moduleRemark", title: "模块描述" },
      ],
      data: [],
    };
    const formRules = {
      functionName: [{ required: true, message: "必须填写" }],
      functionCode: [{ required: true, message: "必须填写" }],
      moduleName: [{ required: true, message: "必须填写" }],
      functionType: [{  message: "必须选择" }],
    };
    return {
      formData: {
        moduleName: "",
        moduleCode: "",
        functionId: "",
        functionName: "",
        functionCode: "",
        functionType: "",
        orderIndex: 10,
        subFunctionCodes: "",
      },
      formRules,
      mockList,
      gridOptions,
      functionList: [],
      templateOptions: [
        { name: "列表", code: "grid" },
        { name: "树表", code: "tree-grid" },
        { name: "树表单", code: "tree-grid-form" },
        { name: "表单", code: "grid-form" },
        { name: "卡片", code: "card" },
        { name: "其他", code: "other" },
      ],
    };
  },
  watch: {
    funData: {
      handler(newValue) {
        this.formData.moduleName = newValue.moduleName;
        this.formData.moduleCode = newValue.moduleCode;
        this.formData.functionType = newValue.functionType;
        this.formData.functionCode = newValue.functionCode;
        this.formData.functionName = newValue.functionName;
        this.formData.functionId = newValue.functionId;
        this.formData.orderIndex = newValue.orderIndex;
        this.formData.subFunctionCodes = newValue.subFunctionCodes;
      },
      immediate: true, // 组件创建时立即执行
      deep: true, // 深度监听
    },
  },
  async mounted() {
    // this.loadList();
    const result = await this.getDetail();

    if (this.funData) {
      this.formData.moduleName = this.funData.moduleName;
      this.formData.moduleCode = this.funData.moduleCode;
      this.formData.functionType = this.funData.functionType;
      this.formData.functionCode = this.funData.functionCode;
      this.formData.functionName = this.funData.functionName;
      this.formData.functionId = this.funData.functionId;
      this.formData.orderIndex = this.funData.orderIndex;
      this.formData.subFunctionCodes = result.data.subFunctionCodes;
    } else {
      this.formData.moduleName = "";
      this.formData.moduleCode = "";
      this.formData.functionType = "";
    }
  },
  methods: {
    getDetail() {
      return getFunctionDetail({
        moduleName: this.formData.moduleName,
        moduleCode: this.formData.moduleCode,
        functionCode: this.formData.functionCode,
      });
    },
    async loadFunctionData() {
      try {
        const param = {
          moduleName: this.formData.moduleName,
          moduleCode: this.formData.moduleCode,
        };
        const res = await getModuleDetail(param);
        this.functionList = res.data.functionList.filter(
          (x) => x.functionId != this.formData.functionId
        );
      } catch (error) {
        messageHandler.notifyError("加载功能数据失败");
      }
    },
    changeEvent(params) {
      const $form = this.$refs.formRef;
      if ($form) {
        $form.updateStatus(params);
      }

      // 如果是模板类型改变，通知父组件
      if (params.field === "functionType") {
        this.$emit("changeTemplate", this.formData.functionType);
      }
    },
    submitEvent() {
      this.$parent.next(this.formData);
    },
    findList(currentPage = 1, pageSize = 5) {
      return new Promise((resolve, reject) => {
        getModuleList({
          pageNumber: currentPage,
          pageSize: pageSize,
          moduleName: this.formData.moduleName,
        })
          .then((res) => {
            this.mockList = res.data.records;
            const total = res.data.totalRow;
            resolve({
              list: this.mockList,
              total: total,
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    loadList() {
      this.gridOptions.loading = true;
      this.findList(
        this.gridOptions.pagerConfig?.currentPage,
        this.gridOptions.pagerConfig?.pageSize
      ).then(({ list, total }) => {
        this.gridOptions.data = list;
        this.gridOptions.loading = false;
        if (this.gridOptions.pagerConfig) {
          this.gridOptions.pagerConfig.total = total;
        }
      });
    },
    focusEvent() {
      const $pulldown = this.$refs.pulldownRef;
      if ($pulldown) {
        $pulldown.showPanel();
      }
    },
    keyupEvent() {
      this.loadList();
    },
    cellClickEvent({ row }) {
      const $pulldown = this.$refs.pulldownRef;
      if ($pulldown) {
        this.formData.moduleName = row.moduleName;
        this.formData.moduleCode = row.moduleCode;
        $pulldown.hidePanel();
      }
    },
    pageChangeEvent({ currentPage, pageSize }) {
      if (this.gridOptions.pagerConfig) {
        this.gridOptions.pagerConfig.currentPage = currentPage;
        this.gridOptions.pagerConfig.pageSize = pageSize;
      }
      this.loadList();
    },
  },
};
</script>

<style lang="scss">
.dropdown-table {
  background-color: #fff;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);

  .dropdown-table-body {
    width: 600px;
    height: 300px;
  }

  .dropdown-table-footer {
    border-top: 1px solid #e8eaec;
  }
}

.vxe-pulldown {
  width: 100%;
}
</style>
