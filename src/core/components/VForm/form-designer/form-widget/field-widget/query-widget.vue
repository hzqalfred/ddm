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
    <div
      :class="{ clearfix: field.options.displayStyle == 'block' }"
      :style="{ display: field.options.displayStyle, minHeight: '44px' }"
    >
      <!-- 单一搜索模式 -->
      <div
        class="single-search-container"
        :style="{ float: field.options.pageAlign == 'left' ? 'left' : 'right' }"
        v-if="searchModal == 'single'"
        @keydown.enter="handleClick"
      >
        <vxe-select
          :size="widgetSize"
          v-model="singleSearchSelect"
          class="select-field"
        >
          <vxe-option
            v-for="item in searchItems"
            :key="item.searchColumn"
            :label="item.label"
            :value="item.searchColumn"
          />
        </vxe-select>
        <vxe-input
          :size="widgetSize"
          v-model="search"
          class="input-field"
          placeholder="请输入搜索关键词"
        ></vxe-input>
        <vxe-button
          :size="widgetSize"
          type="primary"
          class="search-button"
          @click="handleClick"
        >
          <vxe-icon name="search"></vxe-icon>
          <span class="button-text">查询</span>
        </vxe-button>
        <vxe-button
          :size="widgetSize"
          class="expand-button"
          @click="toggleMultipleMode"
        >
          <vxe-icon name="arrow-double-right"></vxe-icon>
        </vxe-button>
      </div>

      <!-- 多条件查询模式 -->
      <div v-if="searchModal == 'multiple'" class="query-multiple-container">
        <div class="form-wrapper" ref="formWrapper" :style="formWrapperStyle">
          <vxe-form
            :inline="true"
            :model="formInline"
            class="advanced-form"
            @keydown.enter="handleEnterInMultipleMode"
          >
            <!-- 先渲染所有动态表单项 -->
            <template v-for="item in searchItems" :key="item.searchColumn">
              <vxe-form-item :title="item.label" class="form-item">
                <!-- 表单控件 -->
                <template v-if="item.operator == 'in'">
                  <vxe-select
                    :size="widgetSize"
                    v-model="formInline[item.searchColumn]"
                    :placeholder="`请选择${item.label}`"
                    filterable
                    clearable
                    allow-create
                    multiple
                  >
                  </vxe-select>
                </template>
                <template v-else-if="item.operator == 'between'">
                  <div class="between-container">
                    <vxe-input
                      :size="widgetSize"
                      style="width:100px"
                      v-model="formInline[item.searchColumn][0]"
                      :placeholder="`起始值`"
                      clearable
                      class="between-input"
                    />
                    <span style="margin: 0 20px;">至</span>
                    <vxe-input
                      :size="widgetSize"
                      style="width:100px"
                      v-model="formInline[item.searchColumn][1]"
                      :placeholder="`结束值`"
                      clearable
                      class="between-input"
                    />
                  </div>
                </template>
                <template v-else>
                  <vxe-input
                    :size="widgetSize"
                    v-model="formInline[item.searchColumn]"
                    :placeholder="'请输入' + item.label"
                    clearable
                    class="form-input"
                  />
                </template>
              </vxe-form-item>
            </template>
            <vxe-form-item>
              <template #default>
                <vxe-button :size="widgetSize" @click="addCondition">
                  <vxe-icon name="add"></vxe-icon>
                </vxe-button>
              </template>
            </vxe-form-item>
          </vxe-form>

          <div class="action-buttons-bar">
            <div class="buttons-area">
              <vxe-button
                :size="widgetSize"
                type="primary"
                class="search-button"
                @click="handleClick"
              >
                <vxe-icon name="search"></vxe-icon>
                <span class="button-text">查询</span>
              </vxe-button>
              <vxe-button
                :size="widgetSize"
                type="danger"
                class="clear-button"
                @click="formInline = {}"
              >
                <vxe-icon name="delete"></vxe-icon>
                <span class="button-text">清空</span>
              </vxe-button>
              <vxe-select :size="widgetSize" v-model="selectProgram">
                <vxe-option
                  v-for="(item, index) in queryProgrammeList"
                  :key="item.programmeId"
                  :label="item.programmeName || '方案' + (index + 1)"
                  :value="item.programmeId"
                >
                  <template #default="{ option }">
                    <div
                      style="display: flex;justify-content: space-between;align-items: center;"
                    >
                      <span>{{ option.label }}</span>
                      <vxe-icon
                        name="delete"
                        @click.stop="
                          deleteProgramme(option.value, option.label)
                        "
                      ></vxe-icon>
                    </div>
                  </template>
                </vxe-option>
              </vxe-select>
              <vxe-button
                style="margin-left: 10px;"
                :size="widgetSize"
                @click="saveQuery"
              >
                保存查询方案
              </vxe-button>
              <vxe-button
                :size="widgetSize"
                class="collapse-button"
                @click="toggleSingleMode"
              >
                <vxe-icon name="arrow-up"></vxe-icon>
                <span class="button-text">收起</span>
              </vxe-button>
            </div>
          </div>
        </div>
      </div>

      <vxe-modal
        v-model="showPop"
        title="数据类型"
        width="800"
        position="center"
        resize
        show-footer
      >
        <div class="condition-modal-content">
          <div class="condition-action">
            <vxe-button
              :size="widgetSize"
              @click="addNewCondition"
              type="primary"
              >新增条件</vxe-button
            >
          </div>
          <vxe-table
            border
            max-height="300px"
            show-overflow
            keep-source
            ref="conditionTableRef"
            empty-text="没有更多数据了！"
            :edit-config="{
              trigger: 'click',
              mode: 'row',
            }"
            :data="conditionData"
            @edit-closed="handleEditClosed"
          >
            <vxe-column
              field="label"
              title="标签"
              width="200"
              :visible="false"
            ></vxe-column>
            <vxe-column
              field="searchColumn"
              title="字段"
              width="200"
              :edit-render="fieldEditRender"
            ></vxe-column>
            <vxe-column
              field="operator"
              title="运算符"
              width="180"
              :edit-render="operatorRender"
            ></vxe-column>
            <vxe-column
              field="defaultValue"
              title="默认值"
              min-width="200"
              :edit-render="{
                name: 'input',
                props: { placeholder: '请输入值' },
              }"
            ></vxe-column>
            <vxe-column title="操作" width="120" fixed="right">
              <template #default="{ row }">
                <vxe-button
                  status="danger"
                  @click="removeCondition(row)"
                  icon="vxe-icon-delete"
                  :size="widgetSize"
                  >删除条件</vxe-button
                >
              </template>
            </vxe-column>
          </vxe-table>
        </div>

        <template #footer>
          <div class="modal-footer">
            <vxe-button
              :size="widgetSize"
              type="primary"
              @click="saveConditions"
              >保存</vxe-button
            >
            <vxe-button :size="widgetSize" @click="closeModal">关闭</vxe-button>
          </div>
        </template>
      </vxe-modal>
    </div>
  </static-content-wrapper>
</template>

<script>
import { h } from "vue";
import StaticContentWrapper from "@/core/components/VForm/form-designer/form-widget/field-widget/static-content-wrapper.vue";
import emitter from "@/core/components/VForm/lib/emitter";
import i18n from "@/core/i18nLang";
import fieldMixin from "@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin";
import { queryColumnList } from "@/api/dataService";
import {
  saveQueryProgramme,
  deleteQueryProgramme,
} from "@/api/functionGenerator";
import { deepClone } from "@/core/utils/tool";
export default {
  name: "query-widget",
  componentName: "FieldWidget", //必须固定为FieldWidget，用于接收父级组件的broadcast事件
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
      /* 子表单组件行索引，从0开始计数 */
      type: Number,
      default: -1,
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */
      type: Number,
      default: -1,
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */
      type: String,
      default: "",
    },
  },
  components: {
    StaticContentWrapper,
  },
  watch: {
    "field.options.items"(val) {
      this.field.options.defaultValue = val[0]?.value || "";
      console.log(val);
      this.singleSearchSelect = "";
    },
    searchModal(newVal) {
      if (newVal === "multiple") {
        this.$nextTick(() => {
          this.calculateFormWidth();
        });
      }
    },
    selectProgram(newVal) {
      console.log(newVal);
      let { param: dsv } = this.getGlobalDsv();
      let item = dsv.queryProgrammeList.find((x) => x.programmeId == newVal);
      this.field.options.items = JSON.parse(item.searchItemListJson);
    },
  },
  data() {
    return {
      selectProgram: "",
      queryMethodInfo: "",
      showPop: false,
      searchModal: "single",
      singleSearchSelect: "",
      search: "",
      formInline: {},
      formWrapperStyle: {
        width: "100%",
        left: "0px",
      },
      resizeObserver: null,
      conditionData: [],

      fieldEditRender: {
        name: "VxeSelect",
        options: [], // 将在created中设置
        optionProps: {
          label: "columnName",
          value: "requestColumn",
        },
      },
      operatorRender: {
        name: "VxeSelect",
        options: [
          { label: "等于", value: "eq" },
          { label: "不等于", value: "ne" },
          { label: "大于", value: "gt" },
          { label: "大于等于", value: "ge" },
          { label: "小于", value: "lt" },
          { label: "小于等于", value: "le" },
          { label: "模糊查询", value: "like" },
          { label: "区间查询", value: "between" },
          { label: "集合查询", value: "in" },
        ],
        optionProps: {
          label: "label",
          value: "value",
        },
      },
      searchText: "",
      searchFields: {},
      targetTableId: "", // 目标表格ID，用于关联表格
      internalLoadingSearch: false,
    };
  },
  computed: {
    // 获取搜索项列表
    searchItems() {
      return this.field.options.items.filter((x) => x.query) || [];
    },
    queryProgrammeList() {
      console.log(this.getGlobalDsv());
      let { param: dsv } = this.getGlobalDsv();
      return dsv.queryProgrammeList || [];
    },

    // 获取当前选中的搜索项
    currentSearchItem() {
      const defaultValue = this.field.options.defaultValue;
      return (
        this.searchItems.find((item) => item.value === defaultValue) ||
        this.searchItems[0]
      );
    },
  },
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
                             需要在父组件created中初始化！！ */
    this.initOptionItems();
    this.registerToRefList();
    this.initEventHandler();

    this.handleOnCreated();
    // 从配置中获取目标表格ID
    this.targetTableId = this.field.options.targetTableId || "";
    // 初始化搜索字段
    this.initSearchFields();
  },

  mounted() {
    this.handleOnMounted();
    let items = this.field.options?.items.filter((x) => x.query);
    this.singleSearchSelect =
      (items && items[0] && items[0].searchColumn) || "";

    // 初始化ResizeObserver，监听元素大小变化
    this.initResizeObserver();

    // 添加窗口resize事件监听
    window.addEventListener("resize", this.calculateFormWidth);

    // 查询字段初始化
    this.initColumnList();
  },

  beforeUnmount() {
    this.unregisterFromRefList();

    // 清理ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // 移除窗口resize事件监听
    window.removeEventListener("resize", this.calculateFormWidth);
  },

  methods: {
    // 处理多条件查询模式下的回车事件
    handleEnterInMultipleMode(event) {
      // 阻止默认行为，避免表单提交
      event.preventDefault();
      this.handleClick();
    },
    initColumnList() {
      // 跳过设计状态
      if (this.designState) return;

      let { param: dsv } = this.getGlobalDsv();

      // 获取已配置的查询项
      const configuredItems = this.field.options.items || [];
      const configuredMap = {};

      // 构建配置项映射
      configuredItems.forEach((item) => {
        if (item.searchColumn) {
          configuredMap[item.searchColumn] = item;
        }
      });
      if (!dsv?.modelCode) return;

      // 查询字段列表
      queryColumnList({
        moduleName: dsv.moduleName,
        moduleCode: dsv.moduleCode,
        objectCode: dsv.modelCode || "",
        methodCode: "query",
      }).then((res) => {
        if (!res.data) return;

        // 过滤字段列表，排除不允许查询的字段
        this.fieldEditRender.options = res.data.filter((field) => {
          // 首先检查API返回的queryColumn标志
          const queryColumnAllowed =
            field.queryColumn === undefined || field.queryColumn === true;
          if (!queryColumnAllowed) return false;

          // 然后检查本地配置中的allowquery属性
          const configItem = configuredMap[field.requestColumn];

          // 关键判断：如果配置项明确设置了allowquery为false，则过滤掉
          return !configItem || configItem.allowquery !== false;
        });
      });
    },
    // 初始化搜索字段
    initSearchFields() {
      // 为每个搜索项创建对应的搜索值
      this.searchItems.forEach((item) => {
        this.searchFields[item.value] = "";
      });
    },

    handleEditClosed(params) {
      // 如果编辑的是searchColumn字段且值发生了变化
      if (params.column.property === "searchColumn") {
        // 找到对应的选项，获取其label
        const selectedOption = this.fieldEditRender.options.find(
          (option) => option.requestColumn === params.row.searchColumn
        );

        if (selectedOption) {
          // 更新行数据中的label字段
          params.row.label = selectedOption.columnName;
        }
      }
    },
    // 处理搜索按钮点击
    handleSearch() {
      if (this.internalLoadingSearch) return;
      if (this.designState) return;

      this.internalLoadingSearch = true;

      // 构建查询参数
      let queryParams = {};

      if (this.field.options.searchMode === "advanced") {
        // 高级搜索模式，使用所有填写的字段
        Object.keys(this.searchFields).forEach((key) => {
          if (this.searchFields[key]) {
            queryParams[key] = this.searchFields[key];
          }
        });
      } else {
        // 简单搜索模式，只使用当前选中的搜索项和搜索文本
        if (this.searchText && this.currentSearchItem) {
          queryParams[this.currentSearchItem.value] = this.searchText;
        }
      }

      console.log("搜索组件产生查询参数:", queryParams);

      // 通过DataCenter发布查询参数变更事件
      if (this.dataCenter) {
        this.dataCenter.postEvent("table-query-params", queryParams);
      }

      // 如果配置了目标表格组件ID，通过refList直接调用表格的loadTableData方法
      if (
        this.targetTableId &&
        this.refList &&
        this.refList[this.targetTableId]
      ) {
        const tableWidget = this.refList[this.targetTableId];
        if (tableWidget && typeof tableWidget.loadTableData === "function") {
          // 更新表格组件的查询参数
          tableWidget.queryParams = queryParams;
          tableWidget.currentPage = 1; // 重置到第一页
          tableWidget.loadTableData();
        }
      }

      // 执行自定义搜索事件处理
      try {
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onSearchClick`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let searchFn = obj[event];
          searchFn.call(this, queryParams);
        }
      } catch (error) {
        this.Message.notifyError("请检查全局函数的调用");
        console.error("请检查全局函数的调用:",error);
      } finally {
        this.internalLoadingSearch = false;
      }
    },

    // 处理搜索项变更
    handleSearchItemChange(value) {
      this.field.options.defaultValue = value;
    },

    // 重置搜索条件
    resetSearch() {
      this.searchText = "";
      Object.keys(this.searchFields).forEach((key) => {
        this.searchFields[key] = "";
      });

      // 清空DataCenter中的查询参数
      if (this.dataCenter) {
        this.dataCenter.postEvent("table-query-params", {});
      }

      // 重置并刷新表格
      if (
        this.targetTableId &&
        this.refList &&
        this.refList[this.targetTableId]
      ) {
        const tableWidget = this.refList[this.targetTableId];
        if (tableWidget && typeof tableWidget.resetAndRefresh === "function") {
          tableWidget.resetAndRefresh();
        }
      }
    },

    // 设置目标表格ID
    setTargetTableId(tableId) {
      this.targetTableId = tableId;
    },

    // 获取当前选中的搜索项
    currentSearchItem() {
      const defaultValue = this.field.options.defaultValue;
      return (
        this.searchItems.find((item) => item.value === defaultValue) ||
        this.searchItems[0]
      );
    },

    handleClick() {
      if (this.designState) return;
      let res = {};
      if (this.searchModal == "single") {
        res = [
          {
            searchColumn: this.singleSearchSelect,
            operator: this.field.options.items?.find(
              (item) => item.searchColumn === this.singleSearchSelect
            )?.operator,
            searchValue: this.search,
          },
        ];
      } else {
        res = this.field.options.items.map((x) => {
          return {
            operator: x.operator,
            searchColumn: x.searchColumn,
            searchValue: this.formInline[x.searchColumn],
          };
        });
      }
      try {
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onSearchClick`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let searchFn = obj[event];
          searchFn.call(this, res);
        }
      } catch (error) {
        this.Message.notifyError("请检查全局函数的调用");
        console.error("请检查全局函数的调用:",error);
      }
    },
    updateFieldOptions() {
      // 跳过设计状态
      if (this.designState) return;

      // 获取当前配置的查询项
      const configuredItems = this.field.options.items || [];
      const configuredMap = {};

      // 构建配置项映射
      configuredItems.forEach((item) => {
        if (item.searchColumn) {
          configuredMap[item.searchColumn] = item;
        }
      });

      // 刷新字段列表
      let { param: dsv } = this.getGlobalDsv();
      if (!dsv?.modelCode) return;
      queryColumnList({
        moduleName: dsv.moduleName,
        moduleCode: dsv.moduleCode,
        objectCode: dsv.modelCode || "",
        methodCode: "query",
      }).then((res) => {
        if (!res.data) return;

        // 过滤字段列表，排除不允许查询的字段
        this.fieldEditRender.options = res.data.filter((field) => {
          // 首先检查API返回的queryColumn标志
          const queryColumnAllowed =
            field.queryColumn === undefined || field.queryColumn === true;
          if (!queryColumnAllowed) return false;

          // 然后检查本地配置中的allowquery属性
          const configItem = configuredMap[field.requestColumn];
          return !configItem || configItem.allowquery !== false;
        });
      });
    },

    addCondition() {
      this.showPop = true;
      // 深拷贝现有查询项
      let items = deepClone(this.field.options.items || []);

      // 确保完整复制所有属性，特别是allowquery
      this.conditionData = items
        .filter((x) => x.query)
        .map((item) => ({
          ...item, // 先复制所有属性
          searchColumn: item.searchColumn,
          operator: item.operator || "eq",
          defaultValue: item.defaultValue || "",
          // 确保allowquery保持原值，不要覆盖或忽略
        }));

      // 确保下拉选项与当前配置一致
      this.updateFieldOptions();
    },

    // 关闭弹窗
    closeModal() {
      this.showPop = false;
    },

    // 添加新条件
    addNewCondition() {
      const newCondition = {
        searchColumn: "", // 对应字段下拉框的值
        operator: "", // 运算符
        defaultValue: "", // 默认值
        label: "", // 字段标签
        type: "input", // 默认类型
        value: "", // 自增ID
        allowquery: true,
        columnName: "",
        options: null,
        query: true,
        requestColumn: "", // 对应字段下拉框的值
      };
      this.conditionData.push(newCondition);
    },

    // 删除条件
    removeCondition(row) {
      const index = this.conditionData.indexOf(row);
      if (index > -1) {
        this.conditionData.splice(index, 1);
      }
    },

    saveConditions() {
      // 将表格中的数据处理并保存到 field.options.items
      const validItems = this.conditionData.filter((item) => item.searchColumn);

      // 为每条数据补充必要的字段，并保留所有已有属性
      const processedItems = validItems.map((item) => {
        // 查找字段标签
        const fieldLabel =
          item.label ||
          (() => {
            const foundOption = this.fieldEditRender.options.find(
              (option) => option.requestColumn === item.searchColumn
            );
            return foundOption ? foundOption.columnName : item.searchColumn;
          })();

        // 返回完整的项配置，确保保留allowquery
        return {
          ...item, // 先保留原有所有属性
          label: fieldLabel,
          searchColumn: item.searchColumn,
          defaultValue: item.defaultValue || "",
          type: item.type || "input",
          value: item.value || "",
          operator: item.operator || "eq",
          // 明确保存allowquery属性，确保与原值一致
          allowquery: item.allowquery === false ? false : true,
        };
      });

      // 重置并初始化 formInline 对象
      this.formInline = {};

      // 根据字段类型和操作符设置正确的初始值
      processedItems.forEach((item) => {
        if (item.operator === "in" || item.operator === "between") {
          this.formInline[item.searchColumn] = [];
        } else {
          // 使用 defaultValue 或 value，确保有一个初始值
          this.formInline[item.searchColumn] =
            item.defaultValue || item.value || "";
        }
      });

      // 更新 field.options.items，确保完整保存所有属性
      this.field.options.items = processedItems;

      // 关闭弹窗
      this.showPop = false;
    },

    toggleMultipleMode() {
      this.searchModal = "multiple";
    },

    toggleSingleMode() {
      this.searchModal = "single";
    },

    initResizeObserver() {
      // 如果浏览器支持ResizeObserver
      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(() => {
          if (this.searchModal === "multiple") {
            this.calculateFormWidth();
          }
        });

        // 找到父级grid-col元素进行观察
        const parentGridCol = this.findParentGridCol();
        if (parentGridCol) {
          this.resizeObserver.observe(parentGridCol);
        }

        // 同时也观察当前组件自身
        this.resizeObserver.observe(this.$el);
      }
    },

    // 查找父级grid-col元素
    findParentGridCol() {
      let element = this.$el;
      while (element && element.parentElement) {
        element = element.parentElement;
        if (
          element.classList.contains("grid-cell") ||
          element.classList.contains("el-col")
        ) {
          return element;
        }
      }
      return null;
    },

    // 查找最近的grid-container或row容器
    findGridContainer() {
      let element = this.$el;
      while (element && element.parentElement) {
        element = element.parentElement;
        if (
          element.classList.contains("grid-container") ||
          element.classList.contains("el-row")
        ) {
          return element;
        }
      }
      return null;
    },

    // 计算表单应该的宽度和左偏移量
    calculateFormWidth() {
      if (this.searchModal !== "multiple" || !this.$refs.formWrapper) {
        return;
      }

      const parentGridCol = this.findParentGridCol();
      const gridContainer = this.findGridContainer();

      if (!parentGridCol || !gridContainer) {
        return;
      }

      // 获取grid容器宽度
      const containerWidth = gridContainer.offsetWidth;

      // 获取当前表单元素相对于页面的位置
      const formRect = this.$el.getBoundingClientRect();

      // 获取grid容器相对于页面的位置
      const containerRect = gridContainer.getBoundingClientRect();

      // 计算左侧偏移量，使表单左对齐与grid容器
      const leftOffset = containerRect.left - formRect.left;

      // 设置表单样式
      this.formWrapperStyle = {
        width: `${containerWidth - 300}px`,
        left: `${leftOffset + 100}px`,
        top: '10px'
      };
    },

    deleteProgramme(id, value) {
      let { param: dsv } = this.getGlobalDsv();
      this.Message.confirmAction(`确认删除${value || "保存方案"}`, "", () => {
        deleteQueryProgramme({
          moduleName: dsv.moduleName,
          moduleCode: dsv.moduleCode,
          functionCode: dsv.functionCode,
          queryProgrammeIds: [id],
        }).then((res) => {
          if (res.success) {
            this.Message.notifySuccess(res.msg);
            dsv.queryProgrammeList = dsv.queryProgrammeList.filter(
              (x) => x.programmeId != id
            );
          } else {
            this.Message.notifyError(res.msg);
          }
        });
      });
    },

    saveQuery() {
      let { param: dsv } = this.getGlobalDsv();
      this.Message.confirmWithSlot("", "保存方案名称", (value) => {
        saveQueryProgramme({
          moduleName: dsv.moduleName,
          moduleCode: dsv.moduleCode,
          functionCode: dsv.functionCode,
          queryProgrammeList: [
            {
              programmeName: value,
              searchItemListJson: JSON.stringify(this.field.options.items),
            },
          ],
        }).then((res) => {
          console.log(res);
          if (res.success) this.Message.notifySuccess(res.msg);
          if (!dsv.queryProgrammeList?.length) dsv.queryProgrammeList = [];
          dsv.queryProgrammeList.push({
            programmeId: res.data[0],
            programmeName: value,
            searchItemListJson: JSON.stringify(this.field.options.items),
          });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.clearfix::after {
  content: "";
  display: table;
  clear: both;
  margin-bottom: 10px;
}

/* 单一搜索模式样式 */
.single-search-container {
  display: flex;
  align-items: center;

  .select-field {
    width: 100px;
    margin-right: 8px;

    :deep(.vxe-input) {
      border-radius: 4px;
    }
  }

  .input-field {
    width: 150px;
    margin-right: 8px;

    :deep(.vxe-input) {
      border-radius: 4px;
    }
  }

  .search-button {
    margin-right: 8px;
    background: #1890ff;
    border-color: #1890ff;
    color: white;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background: #40a9ff;
      border-color: #40a9ff;
    }
  }

  .expand-button {
    background: #f4f4f5;
    border-color: #dcdfe6;
    color: #606266;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }

  .button-text {
    margin-left: 4px;
  }
}

/* 多条件查询模式样式 */
.query-multiple-container {
  width: 100%;
  position: relative;
  top: 40px;
}

.action-buttons-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  width: 100%;
  flex-direction: row-reverse;

  .buttons-area {
    display: flex;
    align-items: center;

    .search-button {
      margin-right: 8px;
      background: #1890ff;
      border-color: #1890ff;
      color: white;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        background: #40a9ff;
        border-color: #40a9ff;
      }
    }

    .clear-button {
      margin-right: 8px;
      background: #f56c6c;
      border-color: #f56c6c;
      color: white;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        background: #f78989;
        border-color: #f78989;
      }
    }

    .collapse-button {
      background: #f4f4f5;
      border-color: #dcdfe6;
      color: #606266;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
    }

    .button-text {
      margin-left: 4px;
    }
  }
}

.form-wrapper {
  border: 1px solid #267AFF;
  border-radius: 4px;
  padding: 20px;
  background-color: #FAFCFF;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  position: absolute;
  z-index: 100;
  left: 0;

  .advanced-form {
    display: flex;
    flex-wrap: wrap;
    background-color: transparent;
    :deep(.form-item) {
      margin-right: 24px;
      margin-bottom: 16px;

      .vxe-form-item--title {
        font-weight: 500;
        color: #606266;
      }

      .form-input {
        width: 220px;

        .vxe-input {
          border-radius: 4px;

          &:focus {
            border-color: #409eff;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
          }
        }
      }
    }
  }
}
.condition-modal-content {
  padding: 20px;

  .condition-description {
    margin-bottom: 15px;
    color: #606266;
    font-size: 14px;
  }

  .condition-action {
    margin-bottom: 10px;
    text-align: left;
  }
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
