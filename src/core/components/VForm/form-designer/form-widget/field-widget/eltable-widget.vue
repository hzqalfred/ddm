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
    class="static-content-wrapper-class"
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
      :sort-config="sortConfig"
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
      <vxe-column
        v-if="field.options.showIndex"
        type="seq"
        fixed="left"
        align="center"
        width="50"
        row-resize
      >
        <template #header>
          <vxe-icon name="custom-column"></vxe-icon>
        </template>
      </vxe-column>
      <!-- 选择列 - 只创建一次 -->
      <vxe-column
        v-if="field.options.selectabled"
        :type="field.options.isSelectType || 'radio'"
        fixed="left"
        align="center"
        width="55"
      ></vxe-column>

      <!-- 序号列 -->
      <!-- <vxe-column
        v-if="field.options.showIndex"
        type="seq"
        width="50"
        fixed="left"
        row-resize
      /> -->

      <!-- 调试信息 -->
      <!-- <div>列配置数量: {{ field.options.columns ? field.options.columns.length : 0 }}</div> -->

      <!-- 直接渲染列而不使用递归组件进行测试 -->
      <template v-for="item in field.options.columns" :key="item._X_ROW_KEY">
        <!-- 分组列 -->
        <vxe-colgroup
          v-if="item.children && item.children.length > 0"
          :title="item.title"
          :width="item.width"
          :align="item.align"
          :header-align="item.align"
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
                :sortable="getSortableConfig(grandChild)"
                :sort-by="grandChild.sortBy"
                :sort-type="grandChild.sortType"
                :defaultValue="grandChild.defaultValue"
                :visible="grandChild.visible !== false"
                :formatter="
                  grandChild.formatter
                    ? getFormatter(grandChild.formatter)
                    : null
                "
                :edit-render="
                  grandChild.editable
                    ? {
                        name: grandChild.editRenderName || 'VxeInput',
                        enabled: true,
                        selectTableRowSet: grandChild.selectTableRowSet,
                        options:
                          grandChild.editRenderName == 'VxeSelect'
                            ? Object.entries(
                                this.dictionary_dsv[
                                  grandChild.formatter || ''
                                ] || {}
                              ).map((arr) => ({
                                value: arr[0],
                                label: arr[1],
                              }))
                            : [],
                        ...grandChild.editRenderProps,
                      }
                    : null
                "
              >
                <!-- 自定义渲染 -->
                <template v-if="grandChild.renderFn" #default="{ row }">
                  <div
                    v-html="evaluateRenderFn(grandChild.renderFn, row)"
                  ></div>
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
              :sortable="getSortableConfig(child)"
              :sort-by="child.sortBy"
              :defaultValue="child.defaultValue"
              :sort-type="child.sortType"
              :visible="child.visible !== false"
              :formatter="
                child.formatter ? getFormatter(child.formatter) : null
              "
              :edit-render="
                child.editable
                  ? {
                      name: child.editRenderName || 'VxeInput',
                      enabled: true,
                      selectTableRowSet: child.selectTableRowSet,
                      options:
                        child.editRenderName == 'VxeSelect'
                          ? Object.entries(
                              this.dictionary_dsv[child.formatter || ''] || {}
                            ).map((arr) => ({
                              value: arr[0],
                              label: arr[1],
                            }))
                          : [],
                      ...child.editRenderProps,
                    }
                  : null
              "
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
          v-else-if="
            !item.type ||
              !['checkbox', 'radio', 'seq', 'expand'].includes(item.type)
          "
          :title="item.title"
          :field="item.field"
          :fixed="item.fixed ? 'left' : ''"
          :width="item.width || 200"
          :defaultValue="item.defaultValue"
          :align="item.align"
          :header-align="item.align"
          :sortable="getSortableConfig(item)"
          :sort-by="item.sortBy"
          :sort-type="item.sortType"
          :visible="item.visible !== false"
          :formatter="item.formatter ? getFormatter(item.formatter) : null"
          :edit-render="
            item.editable
              ? {
                  name: item.editRenderName || 'VxeInput',
                  enabled: true,
                  selectTableRowSet: item.selectTableRowSet,
                  defaultValue: item.defaultValue,
                  options:
                    item.editRenderName == 'VxeSelect'
                      ? Object.entries(
                          this.dictionary_dsv[item.formatter || ''] || {}
                        ).map((arr) => ({
                          value: arr[0],
                          label: arr[1],
                        }))
                      : [],
                  ...item.editRenderProps,
                }
              : null
          "
        >
          <!-- 模板渲染 -->
          <template
            v-if="item.renderByTemplate && item.editRenderName"
            #default="{ row }"
          >
            <component
              :is="item.editRenderName"
              :disabled="!item.editable"
              v-model="row[item.field]"
              :options="
                item.editRenderName == 'VxeSelect'
                  ? Object.entries(
                      this.dictionary_dsv[item.formatter || ''] || {}
                    ).map((arr) => ({
                      value: arr[0],
                      label: arr[1],
                    }))
                  : []
              "
              v-bind="item.editRenderProps"
            />
          </template>

          <!-- 自定义渲染函数 -->
          <template v-else-if="item.renderFn" #default="{ row }">
            <div v-html="evaluateRenderFn(item.renderFn, row)"></div>
          </template>
          <template v-else #default="{ row }">
            <!-- <div>{{ this.dictionary_dsv }}</div>
            <div>{{ item.formatter  }}</div> -->
            <div v-html="evalDictionary(row, item, this.dictionary_dsv)"></div>
          </template>
        </vxe-column>
      </template>

      <!-- 操作列 -->
      <vxe-column
        width="auto"
        title="操作"
        fixed="right"
        v-if="field.options.operate && field.options.operate.length > 0"
      >
        <template #default="{ row }">
          <vxe-button-group>
            <template v-for="(item, index) in field.options.operate">
              <vxe-button
                :mode="item.mode"
                :status="item.type"
                :size="item.size"
                v-if="shouldShowButton(item, row)"
                :key="index"
                @click="handleOperate(item, row)"
              >
                {{ item.label }}
              </vxe-button>
            </template>
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
      currentSorts: [],
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
    // 排序配置
    sortConfig() {
      const defaultConfig = {
        trigger: "default",
        multiple: false,
        remote: false,
        chronological: true,
        defaultSort: null,
      };

      // 从 field.options.sortConfig 获取配置
      if (this.field.options.sortConfig) {
        Object.assign(defaultConfig, this.field.options.sortConfig);
      } else {
        // 向后兼容：从单独的属性获取配置
        defaultConfig.multiple = this.field.options.multipleSort || false;
        defaultConfig.remote = this.field.options.remoteSortable || false;
        defaultConfig.trigger = this.field.options.sortTrigger || "default";
      }

      // 设置默认排序
      if (this.field.options.defaultSort) {
        defaultConfig.defaultSort = this.field.options.defaultSort;
      }

      // 如果禁用排序，返回 null
      if (this.field.options.sortable === false) {
        return null;
      }

      return defaultConfig;
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
    if (!this.designState) {
      this.updateVxeInstanceMapping(this.field.options.name);
    }
  },

  beforeUnmount() {
    this.unregisterFromRefList();
    this.unsubscribeDataCenterEvents();
  },

  methods: {
    shouldShowButton(item, row) {
      // 如果没有显示条件，默认显示
      if (!item.showCondition) {
        return true;
      }

      try {
        // 执行显示条件判断
        const conditionFn = new Function("row", `return ${item.showCondition}`);
        return Boolean(conditionFn.call(this, row));
      } catch (error) {
        return true; // 出错时默认显示
      }
    },
    evalDictionary(row, item, dsv) {
      let formatFnc = this.getFormatter(item.formatter);
      let value = row[item.field] || "";
      if (formatFnc) {
        return formatFnc(value);
      } else {
        let data = dsv[item.formatter] || {};
        return data[value] || value;
      }
    },
    getDefaultValue() {
      let obj = {};
      this.field.options.columns.map((x) => {
        obj[x.field] = x.defaultValue || "";
      });
      return obj;
    },
    // 获取列的排序配置
    getSortableConfig(column) {
      // 如果全局禁用排序，返回 false
      if (this.field.options.sortable === false) {
        return false;
      }

      // 如果列明确指定了排序设置，使用列的设置
      if (column.sortable !== undefined) {
        return column.sortable;
      }

      // 默认允许排序（除非全局禁用）
      return true;
    },

    // 处理排序变化事件
    handleSortChange({ sortList, ...args }) {
      console.log("排序变化:", sortList, args);

      // 更新当前排序状态
      this.currentSorts = sortList || [];

      // 发送排序变化事件到 DataCenter
      if (this.dataCenter) {
        this.dataCenter.postEvent("table-sort-change", {
          sortList: this.currentSorts,
          ...args,
        });
      }

      // 如果是服务端排序，重新加载数据
      if (this.sortConfig?.remote) {
        this.currentPage = 1; // 重置到第一页
        this.loadTableData();
      }

      // 执行自定义排序事件
      try {
        let event = this.formConfig.eventMap?.[`${this.field.id}.onSortChange`];
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let sortFn = obj[event];
          sortFn.call(this, { sortList: this.currentSorts, ...args });
        }
      } catch (error) {
        console.error("执行排序自定义事件出错:", error);
      }
    },

    // 构建排序参数
    buildSortParams() {
      if (!this.sortConfig?.remote || !this.currentSorts.length) {
        return {};
      }

      // 构建后端排序参数
      const sortParams = {};

      if (this.currentSorts.length === 1) {
        // 单个排序
        const sort = this.currentSorts[0];
        sortParams.sortBy = sort.field;
        sortParams.sortOrder = sort.order;
      } else if (this.currentSorts.length > 1) {
        // 多个排序
        sortParams.sortFields = this.currentSorts.map((sort) => ({
          field: sort.field,
          order: sort.order,
        }));
      }

      return sortParams;
    },

    // 设置排序
    setSortBy(sortBy) {
      if (!this.sortConfig) return;

      const $table = this.$refs[this.field.options.name];
      if ($table) {
        if (Array.isArray(sortBy)) {
          // 多个排序
          $table.sort(sortBy);
        } else if (sortBy) {
          // 单个排序
          $table.sort(sortBy.field, sortBy.order);
        } else {
          // 清空排序
          $table.clearSort();
        }
      }
    },

    // 清空排序
    clearSort() {
      const $table = this.$refs[this.field.options.name];
      if ($table) {
        $table.clearSort();
      }
      this.currentSorts = [];
    },

    // 获取当前排序状态
    getCurrentSort() {
      return [...this.currentSorts];
    },
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
          return date.toISOString().split("T")[0];
        },
        datetimeFormatter: (value) => {
          if (!value) return "";
          const date = new Date(value);
          if (isNaN(date.getTime())) return value;
          return date.toLocaleString("zh-CN");
        },
        currencyFormatter: (value, currency = "¥") => {
          if (value === null || value === undefined || value === "") return "";
          if (isNaN(Number(value))) return value;
          return (
            currency +
            Number(value).toLocaleString("zh-CN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          );
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
    handleClickCell({ $table, row, column, ...rest }) {
      let events = this.formConfig.eventMap[`${this.field.id}.onCellClick`];
      let obj = this.formConfig?.globalObject;
      if (obj && obj[events]) {
        let celllFn = obj[events];
        celllFn.call(this, { row, column });
        return;
      }
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
    cellDBLClickEvent({ row, column, ...rest }) {
      let events = this.formConfig.eventMap[`${this.field.id}.onDBLClick`];
      let obj = this.formConfig?.globalObject;
      if (obj && obj[events]) {
        let dblFn = obj[events];
        dblFn.call(this, row, column);
        return;
      }

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
        let events = this.formConfig.eventMap[
          `${this.field.id}.onSelectionChange`
        ];
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

      this.unsubscribeQueries = this.dataCenter.subscribe(
        "table-query-params",
        (params) => {
          console.log("表格组件收到查询参数:", params);
          this.queryParams = params || {};
          this.currentPage = 1;
          this.loadTableData();
        }
      );
      this.unsubscribeSort = this.dataCenter.subscribe(
        "table-sort-params",
        (sortParams) => {
          console.log("表格组件收到排序参数:", sortParams);
          this.currentSorts = sortParams || [];
          this.currentPage = 1;
          this.loadTableData();
        }
      );
      this.unsubscribePagination = this.dataCenter.subscribe(
        "table-pagination-change",
        (pagination) => {
          if (pagination.currentPage) this.currentPage = pagination.currentPage;
          if (pagination.pageSize) this.pageSize = pagination.pageSize;
          this.loadTableData();
        }
      );

      this.unsubscribeRefresh = this.dataCenter.subscribe(
        "refresh-table",
        () => {
          this.loadTableData();
        }
      );
    },

    // 取消DataCenter订阅
    unsubscribeDataCenterEvents() {
      if (this.unsubscribeSort && typeof this.unsubscribeSort === "function") {
        this.unsubscribeSort();
      }
      if (
        this.unsubscribeQueries &&
        typeof this.unsubscribeQueries === "function"
      ) {
        this.unsubscribeQueries();
      }
      if (
        this.unsubscribePagination &&
        typeof this.unsubscribePagination === "function"
      ) {
        this.unsubscribePagination();
      }
      if (
        this.unsubscribeRefresh &&
        typeof this.unsubscribeRefresh === "function"
      ) {
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
        ...this.buildSortParams(),
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      };

      let url =
        this.formConfig.serviceMap[this.field.serviceMapId] ||
        this.queryMethodInfo;
      if (!url) return;

      if (globalParams.env === "preview") {
        url = `/design/data/service/preview/${url}`;
      } else {
        url = `/event/exec/${url}`;
      }

      this.request
        .postData(url, requestParams)
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
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onPageChange`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let changeFn = obj[event];
          changeFn.call(this, type, currentPage, pageSize);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用:", error);
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
            const fn = new Function(
              "return " + this.field.options.events[eventName]
            )();
            return fn.apply(this, args);
          }
        } catch (error) {
          console.error(`执行事件处理函数 ${eventName} 失败:`, error);
        }
      }

      const defaultHandler = this[
        `default${eventName.charAt(0).toUpperCase() +
          eventName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}`
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
/* 排序相关样式 */
:deep(.vxe-header--column) {
  .vxe-cell--sort {
    .vxe-sort--asc-btn,
    .vxe-sort--desc-btn {
      color: #909399;

      &.sort--active {
        color: #409eff;
      }
    }
  }
}

/* 排序指示器样式 */
:deep(.vxe-table--header-wrapper) {
  .vxe-header--column.col--sort {
    cursor: pointer;

    &:hover {
      background-color: #f5f7fa;
    }
  }
}

.static-content-wrapper-class {
  padding: 20px;
  background-color: #fff;
}

:deep(.vxe-header--row) {
  background-color: #fff !important;
  .vxe-cell {
    padding: 0 10px !important;
    min-height: 40px !important;
    font-weight: normal !important;
    border-color: #707070 !important;
    .vxe-cell--wrapper {
      height: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
  }
}
:deep(.vxe-body--row) {
  .vxe-cell {
    padding: 0 10px !important;
    height: 40px !important;
  }
}
</style>
