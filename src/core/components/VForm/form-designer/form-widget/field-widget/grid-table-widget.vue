<template>
  <static-content-wrapper
    :designer="designer"
    :field="field"
    :design-state="designState"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <div class="grid-table-container" v-show="!field.options.hidden">
      <el-row :gutter="12">
        <!-- 搜索区域 -->
        <el-col :span="24">
          <query-widget
            ref="innerSearch"
            :field="searchConfig"
            :data-center="dataCenter"
          ></query-widget>
        </el-col>
      </el-row>

      <el-divider style="margin: 10px 0"></el-divider>

      <!-- 表格区域 -->
      <el-row :gutter="12">
        <el-col :span="24">
          <eltable-widget
            ref="innerTable"
            :field="tableConfig"
            :data-center="dataCenter"
          ></eltable-widget>
        </el-col>
      </el-row>
    </div>
  </static-content-wrapper>
</template>

<script>
import StaticContentWrapper from "./static-content-wrapper.vue";
import emitter from "@/core/components/VForm/lib/emitter";
import i18n from "@/core/i18nLang";
import fieldMixin from "@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin";
import { deepClone } from "@/core/utils/tool";
import QueryWidget from "@/core/components/VForm/form-designer/form-widget/field-widget/query-widget.vue";
import EltableWidget from "@/core/components/VForm/form-designer/form-widget/field-widget/eltable-widget.vue";
import { DataCenter } from "@/core/DataCenter";

export default {
  name: "grid-table-widget",
  componentName: "FieldWidget", // 必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, i18n],
  components: {
    StaticContentWrapper,
    QueryWidget,
    EltableWidget,
  },
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
  inject: ["refList", "getFormConfig", "getGlobalDsv", "getDataCenter"],

  data() {
    return {
      localDataCenter: null,
      tableData: [],
      searchParams: {},
      isLoading: false,
    };
  },

  computed: {
    dataServiceId() {
      return this.field.options.dataServiceId || "";
    },

    dataCenter() {
      return this.localDataCenter;
    },

    // 搜索组件配置
    searchConfig() {
      const baseSearchConfig = deepClone(this.field.options.searchConfig || {});

      // 扩展搜索配置
      return {
        type: "query",
        icon: "query",
        formItemFlag: false,
        options: {
          name: `${this.field.options.name}_search`,
          label: "查询",
          targetTableId: `${this.field.options.name}_table`,
          dataServiceId: this.dataServiceId,
          items: baseSearchConfig.items || [],
          defaultValue:
            baseSearchConfig.defaultValue ||
            (baseSearchConfig.items && baseSearchConfig.items.length > 0
              ? baseSearchConfig.items[0].value
              : ""),
          searchMode: baseSearchConfig.searchMode || "simple",
          ...baseSearchConfig,
        },
        id: `${this.field.options.name}_search`,
      };
    },

    // 表格组件配置
    tableConfig() {
      const baseTableConfig = deepClone(this.field.options.tableConfig || {});

      // 扩展表格配置
      return {
        type: "eltable",
        icon: "eltable",
        formItemFlag: true,
        options: {
          name: `${this.field.options.name}_table`,
          label: baseTableConfig.label || "表格",
          dataServiceId: this.dataServiceId,
          hidden: false,
          autoLoad: true,
          stripe:
            baseTableConfig.stripe !== undefined
              ? baseTableConfig.stripe
              : true,
          border:
            baseTableConfig.border !== undefined
              ? baseTableConfig.border
              : true,
          showIndex:
            baseTableConfig.showIndex !== undefined
              ? baseTableConfig.showIndex
              : true,
          selectabled:
            baseTableConfig.selectabled !== undefined
              ? baseTableConfig.selectabled
              : true,
          columns: baseTableConfig.columns || [],
          pageList: baseTableConfig.pageList || 10,
          pageUnit: baseTableConfig.pageUnit || "10,20,30",
          eltableHeight: baseTableConfig.eltableHeight || "450",
          maxHeight: baseTableConfig.maxHeight || "500",
          ...baseTableConfig,
        },
        id: `${this.field.options.name}_table`,
      };
    },
  },

  created() {
    this.initFieldModel();
    this.registerToRefList();
    this.initEventHandler();
    this.handleOnCreated();

    this.initRefList();

    // 创建本地DataCenter实例用于组件间通信
    this.initLocalDataCenter();
  },

  mounted() {
    this.handleOnMounted();

    // 初始化表格和搜索的关联
    this.$nextTick(() => {
      this.initComponentRelations();
    });
  },

  beforeUnmount() {
    this.unregisterFromRefList();
  },

  methods: {
    initRefList() {
      // 注册组件引用
      if (this.refList && this.field.options.name) {
        this.refList[this.field.options.name] = this;
      }
    },

    registerToRefList() {
      if (this.refList && this.field.options.name) {
        this.refList[this.field.options.name] = this;
      }
    },

    unregisterFromRefList() {
      if (this.refList && this.field.options.name) {
        delete this.refList[this.field.options.name];
      }
    },

    handleOnMounted() {
      try {
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onMounted`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let mountFunc = obj[event];
          mountFunc.call(this);
        }
      } catch (error) {
        console.error("执行onMounted事件失败:", error);
      }
    },

    initLocalDataCenter() {
      // 创建DataCenter实例
      const formDataCenter = this.getDataCenter ? this.getDataCenter() : null;

      // 如果有全局DataCenter，直接使用；否则创建本地实例
      if (formDataCenter) {
        this.localDataCenter = formDataCenter;
      } else {
        this.localDataCenter = new DataCenter(this.field.options.name, {
          autoSync: true,
        });
      }

      // 订阅表格数据加载事件
      this.localDataCenter.subscribe("table-data-loaded", (data) => {
        this.tableData = data;
      });

      // 订阅加载状态事件
      this.localDataCenter.subscribe("table-loading", (loading) => {
        this.isLoading = loading;
      });
    },

    initComponentRelations() {
      const searchComponent = this.$refs.innerSearch;
      const tableComponent = this.$refs.innerTable;

      if (searchComponent && tableComponent) {
        // 设置表格的数据服务ID
        if (this.dataServiceId && tableComponent.setDataServiceId) {
          tableComponent.setDataServiceId(this.dataServiceId);
        }

        // 设置搜索组件的目标表格ID
        if (searchComponent.setTargetTableId) {
          searchComponent.setTargetTableId(`${this.field.options.name}_table`);
        }
      }
    },

    // 外部API: 获取表格数据
    getTableData() {
      return this.tableData;
    },

    // 外部API: 刷新表格
    refreshTable() {
      const tableComponent = this.$refs.innerTable;
      if (tableComponent && tableComponent.refreshTable) {
        tableComponent.refreshTable();
      }
    },

    // 外部API: 重置搜索条件并刷新表格
    resetAndRefresh() {
      const searchComponent = this.$refs.innerSearch;
      if (searchComponent && searchComponent.resetSearch) {
        searchComponent.resetSearch();
      }
    },

    // 外部API: 设置数据服务ID
    setDataServiceId(serviceId) {
      // 更新组件配置
      this.field.options.dataServiceId = serviceId;

      // 更新表格组件的数据服务ID
      const tableComponent = this.$refs.innerTable;
      if (tableComponent && tableComponent.setDataServiceId) {
        tableComponent.setDataServiceId(serviceId);
      }

      // 刷新表格数据
      this.$nextTick(() => {
        this.refreshTable();
      });
    },

    // 外部API: 获取选中行
    getSelectedRows() {
      const tableComponent = this.$refs.innerTable;
      return tableComponent ? tableComponent.getSelectedRows() : [];
    },
  },
};
</script>

<style lang="scss" scoped>
.grid-table-container {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
