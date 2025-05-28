<template>
  <static-content-wrapper
    :designer="designer"
    :field="field"
    :design-state="designState"
    :display-style="field.options.displayStyle"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <vxe-table
      :ref="field.options.name"
      keep-source
      :row-config="{
        isHover: true,
        isCurrent: true,
        clickCurrentRow: true,
      }"
      :cell-config="{ height: 54 }"
      :virtual-x-config="{ enabled: field.options.virtual, gt: 0 }"
      :show-overflow="field.options.virtual"
      :show-header-overflow="field.options.virtual"
      :show-footer-overflow="field.options.virtual"
      :height="field.options.eltableHeight"
      :max-height="field.options.maxHeight"
      :stripe="field.options.stripe"
      :border="field.options.border"
      :edit-rules="field.options.validRules || {}"
      :edit-config="
        field.options.editConfig || {
          trigger: 'click',
          mode: 'cell',
          showStatus: true,
        }
      "
      :radio-config="
        field.options.isSelectType === 'radio' ? { highlight: true } : null
      "
      :checkbox-config="
        field.options.isSelectType === 'checkbox' ? { highlight: true } : null
      "
      @cell-click="handleClickCell"
      @cell-dblclick="cellDBLClickEvent"
      v-on="vxeEvents"
      :data="fieldModel"
      style="width: 100%"
      @current-change="
        (...args) => handleChangeEvent('current-change', ...args)
      "
      @radio-change="
        (...args) => handleSelectionChange('selection-change', ...args)
      "
      @checkbox-change="
        (...args) => handleSelectionChange('selection-change', ...args)
      "
    >
      <!-- 选择列 - 只创建一次 -->
      <vxe-column
        v-if="field.options.selectabled"
        :type="field.options.isSelectType || 'radio'"
        width="55"
      ></vxe-column>

      <!-- 序号列 -->
      <vxe-column
        v-if="field.options.showIndex"
        type="seq"
        width="50"
        row-resize
      />

      <!-- 调试信息 -->
      <!-- <div>列配置数量: {{ field.options.columns ? field.options.columns.length : 0 }}</div> -->

      <!-- 直接渲染列而不使用递归组件进行测试 -->
      <template v-for="item in field.options.columns" :key="item._X_ROW_KEY">
        <!-- 分组列 -->
        <vxe-colgroup
          v-if="item.children && item.children.length > 0"
          :title="item.title"
          :width="item.width"
          :align="item.align || 'center'"
          :header-align="item.align || 'center'"
          :visible="item.visible !== false"
        >
          <!-- 二级分组 -->
          <template v-for="child in item.children" :key="child._X_ROW_KEY">
            <vxe-colgroup
              v-if="child.children && child.children.length > 0"
              :title="child.title"
              :width="child.width"
              :align="child.align || 'center'"
              :header-align="child.align || 'center'"
              :visible="child.visible !== false"
            >
              <!-- 三级列 -->
              <vxe-column
                v-for="grandChild in child.children"
                :key="grandChild._X_ROW_KEY"
                :title="grandChild.title"
                :field="grandChild.field"
                :width="grandChild.width || 200"
                :align="grandChild.align || 'center'"
                :header-align="grandChild.align || 'center'"
                :sortable="grandChild.sortable !== false"
                :visible="grandChild.visible !== false"
                :formatter="grandChild.formatter ? getFormatter(grandChild.formatter) : null"
                :edit-render="grandChild.editable ? {
                  name: grandChild.editRenderName || 'VxeInput',
                  enabled: true,
                  selectTableRowSet: grandChild.selectTableRowSet,
                  ...grandChild.editRenderProps
                } : null"
              >
                <!-- 自定义渲染 -->
                <template v-if="grandChild.renderFn" #default="{ row }">
                  <div v-html="evaluateRenderFn(grandChild.renderFn, row)"></div>
                </template>
              </vxe-column>
            </vxe-colgroup>
            
            <!-- 二级普通列 -->
            <vxe-column
              v-else
              :title="child.title"
              :field="child.field"
              :width="child.width || 200"
              :align="child.align || 'center'"
              :header-align="child.align || 'center'"
              :sortable="child.sortable !== false"
              :visible="child.visible !== false"
              :formatter="child.formatter ? getFormatter(child.formatter) : null"
              :edit-render="child.editable ? {
                name: child.editRenderName || 'VxeInput',
                enabled: true,
                selectTableRowSet: child.selectTableRowSet,
                ...child.editRenderProps
              } : null"
            >
              <!-- 自定义渲染 -->
              <template v-if="child.renderFn" #default="{ row }">
                <div v-html="evaluateRenderFn(child.renderFn, row)"></div>
              </template>
            </vxe-column>
          </template>
        </vxe-colgroup>

        <!-- 普通列 -->
        <vxe-column
          v-else-if="!item.type || !['checkbox', 'radio', 'seq', 'expand'].includes(item.type)"
          :title="item.title"
          :field="item.field"
          :width="item.width || 200"
          :align="item.align || 'center'"
          :header-align="item.align || 'center'"
          :sortable="item.sortable !== false"
          :visible="item.visible !== false"
          :formatter="item.formatter ? getFormatter(item.formatter) : null"
          :edit-render="item.editable ? {
            name: item.editRenderName || 'VxeInput',
            enabled: true,
            selectTableRowSet: item.selectTableRowSet,
            ...item.editRenderProps
          } : null"
        >
          <!-- 模板渲染 -->
          <template v-if="item.renderByTemplate && item.editRenderName" #default="{ row }">
            <component
              :is="item.editRenderName"
              v-model="row[item.field]"
              v-bind="item.editRenderProps"
            />
          </template>
          
          <!-- 自定义渲染函数 -->
          <template v-else-if="item.renderFn" #default="{ row }">
            <div v-html="evaluateRenderFn(item.renderFn, row)"></div>
          </template>
        </vxe-column>
      </template>

      <!-- 操作列 -->
      <vxe-column
        title="操作"
        fixed="right"
        width="200"
        v-if="field.options.operate && field.options.operate.length > 0"
      >
        <template #default="{ row }">
          <vxe-button-group>
            <vxe-button
              mode="text"
              status="primary"
              v-for="(item, index) in field.options.operate"
              :key="index"
              @click="handleOperate(item, row)"
            >
              {{ item.label }}
            </vxe-button>
          </vxe-button-group>
        </template>
      </vxe-column>
    </vxe-table>
    
    <vxe-pager
      v-if="field.options.paginate !== false"
      v-model:currentPage="currentPage"
      :page-sizes="pageSizes || [10, 20, 30, 50, 100, 1000]"
      :page-size="pageSize"
      :total="total"
      :layouts="[
        'Home',
        'PrevJump',
        'PrevPage',
        'Number',
        'NextPage',
        'NextJump',
        'End',
        'Sizes',
        'FullJump',
        'Total',
      ]"
      @page-change="handlePageChange"
    ></vxe-pager>
  </static-content-wrapper>
</template>

<script>
import { h } from "vue";
import StaticContentWrapper from "./static-content-wrapper.vue";
import emitter from "@/core/components/VForm/lib/emitter";
import i18n from "@/core/i18nLang";
import fieldMixin from "@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin";
import {
  getDataPrivilegeTree,
  getDataPrivilege,
  saveDataPrivilege,
  getOperationPrivilegeTree,
  getOperationPrivilege,
  saveOperationPrivilege,
  getMenuPrivilegeTree,
  saveMenuPrivilegeTree,
} from "../../../../../../api/permissionSuite";

export default {
  name: "eltable-widget",
  componentName: "FieldWidget",
  mixins: [emitter, fieldMixin, i18n],
  props: {
    field: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
    designState: {
      type: Boolean,
      default: false,
    },
    subFormRowIndex: {
      type: Number,
      default: -1,
    },
    subFormColIndex: {
      type: Number,
      default: -1,
    },
    subFormRowId: {
      type: String,
      default: "",
    },
  },
  components: {
    StaticContentWrapper,
  },
  data() {
    return {
      oldFieldValue: null,
      fieldModel: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      queryParams: {},
      queryMethodInfo: "",
      dataServiceId: "",
    };
  },
  computed: {
    vxeEvents() {
      const events = {};
      if (this.field.options && this.field.options.events) {
        Object.keys(this.field.options.events).forEach((eventName) => {
          events[eventName] = (...args) => this.handleEvent(eventName, ...args);
        });
      }
      return events;
    },
    
    pageSizes() {
      return this.field.options.pageUnit
        ? this.field.options.pageUnit.split(",").map((x) => Number(x))
        : [10, 20, 30, 50, 100];
    },
  },
  
  created() {
    // 添加调试信息
    console.log("表格组件创建，列配置:", this.field.options.columns);
    
    // 将权限相关方法挂载到 this 上
    this.getDataPrivilegeTree = getDataPrivilegeTree;
    this.getDataPrivilege = getDataPrivilege;
    this.saveDataPrivilege = saveDataPrivilege;
    this.getOperationPrivilegeTree = getOperationPrivilegeTree;
    this.getOperationPrivilege = getOperationPrivilege;
    this.saveOperationPrivilege = saveOperationPrivilege;
    this.getMenuPrivilegeTree = getMenuPrivilegeTree;
    this.saveMenuPrivilegeTree = saveMenuPrivilegeTree;

    this.initFieldModel();
    this.registerToRefList();
    this.initEventHandler();

    this.pageSize = this.field.options.pageList || 10;
    this.dataServiceId = this.field.options.dataServiceId || "";
    this.initDataCenterSubscriptions();

    this.handleOnCreated();
  },

  mounted() {
    this.handleOnMounted();
    
    if (this.field.options.autoLoad !== false && this.dataServiceId) {
      this.loadTableData();
    }
  },

  beforeUnmount() {
    this.unregisterFromRefList();
    this.unsubscribeDataCenterEvents();
  },

  methods: {
    // 渲染自定义单元格内容
    evaluateRenderFn(renderFnStr, row) {
      try {
        const renderFn = new Function("return " + renderFnStr)();
        return renderFn(row);
      } catch (error) {
        console.error("渲染函数执行出错:", error);
        return "";
      }
    },

    // 格式化函数
    getFormatter(formatterName) {
      const formatters = {
        formatTrueFale: (value) => {
          if (value.cellValue == "0") return "否";
          else if (value.cellValue == "1") return "是";
          else return "";
        },
        dateFormatter: (value) => {
          if (!value) return "";
          const date = new Date(value);
          if (isNaN(date.getTime())) return value;
          return date.toISOString().split('T')[0];
        },
        datetimeFormatter: (value) => {
          if (!value) return "";
          const date = new Date(value);
          if (isNaN(date.getTime())) return value;
          return date.toLocaleString('zh-CN');
        },
        currencyFormatter: (value, currency = "¥") => {
          if (value === null || value === undefined || value === "") return "";
          if (isNaN(Number(value))) return value;
          return currency + Number(value).toLocaleString("zh-CN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        },
        percentFormatter: (value) => {
          if (value === null || value === undefined || value === "") return "";
          if (isNaN(Number(value))) return value;
          return (Number(value) * 100).toFixed(2) + "%";
        },
        booleanFormatter: (value) => {
          if (value === null || value === undefined || value === "") return "";
          return value ? "是" : "否";
        },
      };

      return formatters[formatterName] || null;
    },

    // 点击单元格事件
    handleClickCell({ $table }) {
      const currentRow = $table.getCurrentRecord();
      if (this.field.options.isSelectType == "radio") {
        $table.setRadioRow(currentRow);
      } else if (this.field.options.isSelectType == "checkbox") {
        $table.clearCheckboxRow();
        $table.setCheckboxRow(currentRow, true);
      }
    },

    // 操作按钮处理
    handleOperate(item, row) {
      var event = item.onClick;
      let obj = this.formConfig?.globalObject;
      if (obj && event && obj[event]) {
        let mountFunc = obj[event];
        mountFunc.call(this, row, item);
      }
    },

    // 双击单元格事件
    cellDBLClickEvent({ row, column }) {
      var strs = column.editRender?.selectTableRowSet;
      if (strs) {
        let homePage = this.pageProvide.getHomeProvide();
        const { moduleName, moduleCode, functionCode } = this.formConfig;
        homePage.create({
          data: {
            title: "选择数据",
            type: "window",
            ele: "window",
            code: "webrender",
            width: "55%",
            height: "60%",
            origin: true,
            draggable: false,
            escClosable: true,
            id: moduleName + "-" + moduleCode + "-" + strs,
            data: row,
            fatherFunctionCode: functionCode,
          },
        });
      }
    },

    // 选择行变化处理
    handleSelectionChange(event, selection) {
      console.log("选择行变化:", selection);
      this.dataCenter.postEvent("table-selection-change", selection);
      
      try {
        let events = this.formConfig.eventMap[`${this.field.id}.onSelectionChange`];
        let obj = this.formConfig?.globalObject;
        if (obj && obj[events]) {
          let selectionFn = obj[events];
          selectionFn.call(this, selection);
        }
      } catch (e) {
        console.error("执行选择行自定义事件出错:", e);
      }
    },

    // DataCenter订阅初始化
    initDataCenterSubscriptions() {
      if (!this.dataCenter) return;

      this.unsubscribeQueries = this.dataCenter.subscribe("table-query-params", (params) => {
        console.log("表格组件收到查询参数:", params);
        this.queryParams = params || {};
        this.currentPage = 1;
        this.loadTableData();
      });

      this.unsubscribePagination = this.dataCenter.subscribe("table-pagination-change", (pagination) => {
        if (pagination.currentPage) this.currentPage = pagination.currentPage;
        if (pagination.pageSize) this.pageSize = pagination.pageSize;
        this.loadTableData();
      });

      this.unsubscribeRefresh = this.dataCenter.subscribe("refresh-table", () => {
        this.loadTableData();
      });
    },

    // 取消DataCenter订阅
    unsubscribeDataCenterEvents() {
      if (this.unsubscribeQueries && typeof this.unsubscribeQueries === "function") {
        this.unsubscribeQueries();
      }
      if (this.unsubscribePagination && typeof this.unsubscribePagination === "function") {
        this.unsubscribePagination();
      }
      if (this.unsubscribeRefresh && typeof this.unsubscribeRefresh === "function") {
        this.unsubscribeRefresh();
      }
    },

    // 加载表格数据
    loadTableData() {
      let globalParams = {};
      try {
        const { param } = this.getGlobalDsv();
        globalParams = param || {};
      } catch (e) {
        console.error("获取全局参数失败:", e);
      }

      const requestParams = {
        moduleCode: globalParams.moduleCode,
        moduleName: globalParams.moduleName,
        functionCode: globalParams.functionCode,
        ...this.queryParams,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      };

      let url = this.formConfig.serviceMap[this.field.serviceMapId] || this.queryMethodInfo;
      if (!url) return;

      if (globalParams.env === "preview") {
        url = `/design/data/service/preview/${url}`;
      } else {
        url = `/event/exec/${url}`;
      }

      this.request.postData(url, requestParams)
        .then((res) => {
          console.log("表格数据查询结果:", res);
          
          if (res && (res.code === 0 || res.success)) {
            if (res.data) {
              if (res.data.rows && Array.isArray(res.data.rows)) {
                this.fieldModel = res.data.rows;
                this.total = res.data.total || res.data.rows.length;
              } else if (Array.isArray(res.data)) {
                this.fieldModel = res.data;
                this.total = res.total || res.data.length;
              } else if (res.data.records && Array.isArray(res.data.records)) {
                this.fieldModel = res.data.records;
                this.total = res.data.total || 0;
              } else {
                this.fieldModel = [];
                this.total = 0;
                console.warn("返回数据格式不符合预期:", res.data);
              }
            } else {
              this.fieldModel = [];
              this.total = 0;
            }

            if (this.dataCenter) {
              setTimeout(() => {
                this.dataCenter.postEvent("table-data-loaded", this.fieldModel);
              }, 10);
            }
          } else {
            console.error("查询失败:", res.message || "未知错误");
            this.$message && this.$message.error(res.message || "查询失败");
            this.fieldModel = [];
            this.total = 0;
            this.dataCenter.postEvent("table-error", res.message || "查询失败");
          }
        })
        .catch((err) => {
          console.error("查询出错:", err);
          this.$message && this.$message.error("查询请求失败");
          this.fieldModel = [];
          this.total = 0;
          this.dataCenter.postEvent("table-error", err);
        });
    },

    // 分页变化处理
    handlePageChange({ type, currentPage, pageSize }) {
      console.log("分页变化:", type, currentPage, pageSize);
      if (this.designState) return;
      
      this.currentPage = currentPage;
      this.pageSize = pageSize;

      this.dataCenter.postEvent("table-pagination-change", {
        currentPage,
        pageSize,
        type,
      });

      this.loadTableData();

      try {
        let event = (this.formConfig.eventMap && this.formConfig.eventMap[`${this.field.id}.onPageChange`]) || "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let changeFn = obj[event];
          changeFn.call(this, type, currentPage, pageSize);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    // 设置数据
    setData(data, total) {
      this.fieldModel = data || [];
      if (typeof total === "number") {
        this.total = total;
      } else if (Array.isArray(data)) {
        this.total = data.length;
      }
      this.dataCenter.postEvent("table-data-loaded", this.fieldModel);
    },

    // 刷新表格
    refreshTable() {
      this.loadTableData();
    },

    // 重置并刷新
    resetAndRefresh() {
      this.currentPage = 1;
      this.loadTableData();
    },

    // 统一事件处理器
    handleEvent(eventName, ...args) {
      if (this.field.options?.events && this.field.options?.events[eventName]) {
        try {
          if (typeof this.field.options.events[eventName] === "function") {
            return this.field.options.events[eventName].apply(this, args);
          } else if (typeof this.field.options.events[eventName] === "string") {
            const fn = new Function("return " + this.field.options.events[eventName])();
            return fn.apply(this, args);
          }
        } catch (error) {
          console.error(`执行事件处理函数 ${eventName} 失败:`, error);
        }
      }
      
      const defaultHandler = this[
        `default${eventName.charAt(0).toUpperCase() + eventName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}`
      ];
      if (typeof defaultHandler === "function") {
        return defaultHandler.apply(this, args);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vxe-pager {
  margin-top: 10px;
}

/* 多级表头样式优化 */
:deep(.vxe-table--render-wrapper .vxe-table--header-wrapper) {
  overflow-x: auto;
}

:deep(.vxe-header--column.col--group) {
  background-color: #f5f7fa;
}
</style>