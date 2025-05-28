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
    <div
      ref="chartContainer"
      :style="{
        width: field.options.width || '100%',
        height: field.options.height || '300px',
        position: 'relative',
      }"
      class="echarts-container"
    >
      <div v-if="loading" class="chart-loading">
        <div class="loading-spinner"></div>
      </div>
      <div v-if="renderError" class="chart-error">
        <svg-icon icon-class="warning" class="error-icon" />
        <p>{{ renderError }}</p>
      </div>
    </div>
  </static-content-wrapper>
</template>

<script>
import StaticContentWrapper from "@/core/components/VForm/form-designer/form-widget/field-widget/static-content-wrapper.vue";
import emitter from "@/core/components/VForm/lib/emitter";
import i18n from "@/core/i18nLang";
import fieldMixin from "@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin";
import SvgIcon from "@/core/components/SvgIcon/index.vue";
import * as echarts from "echarts";

export default {
  name: "echarts-widget",
  componentName: "FieldWidget", // 必须固定为FieldWidget，用于接收父级组件的broadcast事件
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
    SvgIcon,
  },
  data() {
    return {
      chartInstance: null,
      loading: false,
      renderError: "",
      prevEvents: {},
    };
  },
  created() {
    this.registerToRefList();
    this.initEventHandler();
    this.handleOnCreated();
  },
  mounted() {
    this.initChart();
    this.handleOnMounted();
  },
  beforeUnmount() {
    this.unregisterFromRefList();
    window.removeEventListener("resize", this.resizeHandler);

    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  methods: {
    initChart() {
      if (!this.$refs.chartContainer) return;

      try {
        this.loading = true;
        this.renderError = "";

        // 初始化ECharts实例
        if (!this.chartInstance) {
          const theme = this.field.options.theme || "";
          this.chartInstance = echarts.init(this.$refs.chartContainer, theme);
        }

        // 应用图表配置
        this.applyChartOptions();

        this.loading = false;
      } catch (error) {
        console.error("图表初始化错误:", error);
        this.renderError = "图表初始化失败: " + error.message;
        this.loading = false;
      }
    },

    applyChartOptions(flag = true, events = {}) {
      try {
        if (!this.chartInstance) return;
        let chartOptions = {};

        // 从options.chartOptions获取配置
        if (this.field.options.chartOptions) {
          if (typeof this.field.options.chartOptions === "string") {
            // 尝试解析JSON字符串
            try {
              chartOptions = eval(`(${this.field.options.chartOptions})`);
            } catch (e) {
              // 尝试作为JavaScript表达式评估
              try {
                // 使用Function构造函数安全地评估表达式，返回配置对象
                const generateOptions = new Function(
                  "echarts",
                  "return " + this.field.options.chartOptions
                );
                chartOptions = generateOptions(echarts);
              } catch (evalError) {
                throw new Error("无法解析图表配置: " + evalError.message);
              }
            }
          } else if (typeof this.field.options.chartOptions === "object") {
            chartOptions = this.field.options.chartOptions;
          }
        }
        this.chartInstance.dispose();
        this.chartInstance = echarts.init(this.$refs.chartContainer);
        // 设置图表配置
        if (this.field.options.theme == "dark") {
          chartOptions = Object.assign({}, chartOptions, {
            backgroundColor: "#100C2A",
          });
        } else {
          chartOptions = Object.assign({}, chartOptions, {
            backgroundColor: "white",
          });
        }
        this.chartInstance.setOption(chartOptions);
        // 先清除旧事件（如果需要）
        if (this.prevEvents) {
          for (let key in this.prevEvents) {
            this.chartInstance.off(key);
          }
        }

        // 绑定新事件
        for (let key in events) {
          this.chartInstance.on(key, events[key]);
        }

        // 保存当前事件用于下次清除
        this.prevEvents = events;
        // 清除错误状态
        this.renderError = "";
      } catch (error) {
        console.error("应用图表配置错误:", error);
        this.renderError = "图表配置错误: " + error.message;
      }
    },

    debounce(fn, delay) {
      let timer = null;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
          fn.apply(context, args);
        }, delay);
      };
    },

    // 公开API: 刷新图表
    refreshChart() {
      this.initChart();
    },

    _on(eventName, cb) {
      this.chartInstance.on(eventName, cb);
    },

    // 公开API: 获取图表实例
    getChartInstance() {
      return this.chartInstance;
    },

    // 公开API: 更新图表配置
    updateChartConfig(config,event) {
      this.field.options.chartOptions = config;

      this.applyChartOptions(false,event);
    },
  },
  watch: {
    "field.options.chartOptions": {
      handler() {
        this.applyChartOptions(false,this.prevEvents);
      },
      deep: true,
    },
    "field.options.theme": {
      handler(newTheme) {
        // 主题改变时需要重新初始化图表
        if (this.chartInstance) {
          const option = this.chartInstance.getOption();
          delete option.backgroundColor;
          this.chartInstance.dispose();
          this.chartInstance = echarts.init(
            this.$refs.chartContainer,
            newTheme
          );
          this.chartInstance.setOption(option);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.echarts-container {
  width: 100%;
  min-height: 100px;
  position: relative;

  .chart-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  .chart-error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 240, 240, 0.9);
    color: #f56c6c;

    .error-icon {
      font-size: 42px;
      margin-bottom: 12px;
    }

    p {
      padding: 0 20px;
      text-align: center;
      font-size: 14px;
      margin: 0;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
