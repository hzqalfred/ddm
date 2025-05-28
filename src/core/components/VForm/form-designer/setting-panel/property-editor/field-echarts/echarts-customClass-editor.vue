<template>
  <div>
    <vxe-form ref="optionsFormRef" :data="optionModel">
      <!-- 基础设置 -->
      <vxe-form-item title="图表宽度" span="24">
        <vxe-input v-model="optionModel.width" placeholder="100%"></vxe-input>
      </vxe-form-item>

      <vxe-form-item title="图表高度" span="24">
        <vxe-input v-model="optionModel.height" placeholder="300px"></vxe-input>
      </vxe-form-item>
      <!-- 示例按钮 -->
      <vxe-form-item title="示例模板" span="24">
        <vxe-select
          v-model="selectedTemplate"
          @change="applyTemplate"
          placeholder="选择示例模板"
        >
          <vxe-option value="" label="自定义"></vxe-option>
          <vxe-option value="bar" label="柱状图"></vxe-option>
          <vxe-option value="line" label="折线图"></vxe-option>
          <vxe-option value="pie" label="饼图"></vxe-option>
          <vxe-option value="scatter" label="散点图"></vxe-option>
          <vxe-option value="radar" label="雷达图"></vxe-option>
          <vxe-option value="funnel" label="漏斗图"></vxe-option>
          <vxe-option value="gauge" label="仪表盘"></vxe-option>
        </vxe-select>
      </vxe-form-item>
      <vxe-form-item title="主题" span="24">
        <vxe-select v-model="optionModel.theme">
          <vxe-option value="" label="默认"></vxe-option>
          <vxe-option value="dark" label="暗黑"></vxe-option>
          <vxe-option value="light" label="亮色"></vxe-option>
        </vxe-select>
      </vxe-form-item>

      <vxe-form-item title="自动刷新间隔(秒)" span="24">
        <vxe-input v-model="optionModel.refreshInterval"></vxe-input>
      </vxe-form-item>

      <!-- 编辑按钮 -->
      <vxe-form-item title="ECharts配置" span="24">
        <vxe-button status="primary" @click="openConfigEditor"
          >编辑配置</vxe-button
        >
      </vxe-form-item>
    </vxe-form>

    <!-- 配置编辑器对话框 -->
    <vxe-modal
      v-model="showConfigEditorFlag"
      title="ECharts配置编辑"
      width="90%"
      height="80%"
      resize
      transfer
      show-footer
      :mask-closable="false"
      :esc-closable="false"
      :destroy-on-close="false"
      class="config-editor-modal"
    >
      <div class="config-editor-container">
        <div class="editor-section">
          <code-editor
            :readonly="false"
            :user-worker="false"
            v-model="chartOptionsCode"
            class="code-editor"
            @change="debouncedUpdatePreview"
          ></code-editor>
        </div>
        <div class="preview-section">
          <div class="preview-header">
            <span>预览效果</span>
            <vxe-button size="mini" status="primary" @click="updatePreview"
              >刷新预览</vxe-button
            >
          </div>
          <div class="preview-error" v-if="previewError">
            <svg-icon icon-class="warning" class="error-icon"></svg-icon>
            <p>{{ previewError }}</p>
          </div>
          <div class="preview-container" ref="previewContainer"></div>
        </div>
      </div>
      <template #footer>
        <vxe-button status="primary" @click="saveChartOptions">确定</vxe-button>
        <vxe-button @click="cancelEdit">取消</vxe-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
import i18n from "@/core/i18nLang";
import CodeEditor from "@/core/components/CodeEditor/index.vue";
import SvgIcon from "@/core/components/SvgIcon/index.vue";
import message from "@/core/Message";
import * as echarts from "echarts";

export default {
  name: "echarts-customClass-editor",
  componentName: "PropertyEditor",
  mixins: [i18n],
  components: {
    CodeEditor,
    SvgIcon,
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  data() {
    return {
      showConfigEditorFlag: false,
      chartOptionsCode: "",
      previewChart: null,
      previewError: "",
      originalOptions: "",
      selectedTemplate: "",
      templates: {
        bar: `{
                title: {
                text: '柱状图示例'
                },
                tooltip: {},
                xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [
                {
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }
                ]
            }`,
        line: `{
                title: {
                text: '折线图示例'
                },
                tooltip: {
                trigger: 'axis'
                },
                xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                type: 'value'
                },
                series: [
                {
                    name: '销量',
                    type: 'line',
                    data: [150, 230, 224, 218, 135, 147, 260]
                }
                ]
            }`,
        pie: `{
                title: {
                text: '饼图示例',
                left: 'center'
                },
                tooltip: {
                trigger: 'item'
                },
                legend: {
                orient: 'vertical',
                left: 'left'
                },
                series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '50%',
                    data: [
                    { value: 1048, name: '搜索引擎' },
                    { value: 735, name: '直接访问' },
                    { value: 580, name: '邮件营销' },
                    { value: 484, name: '联盟广告' },
                    { value: 300, name: '视频广告' }
                    ],
                    emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                    }
                }
                ]
            }`,
        scatter: `{
                title: {
                text: '散点图示例'
                },
                xAxis: {},
                yAxis: {},
                series: [
                {
                    symbolSize: 20,
                    data: [
                    [10.0, 8.04],
                    [8.0, 6.95],
                    [13.0, 7.58],
                    [9.0, 8.81],
                    [11.0, 8.33],
                    [14.0, 9.96],
                    [6.0, 7.24],
                    [4.0, 4.26],
                    [12.0, 10.84],
                    [7.0, 4.82],
                    [5.0, 5.68]
                    ],
                    type: 'scatter'
                }
                ]
            }`,
        radar: `{
                    title: {
                    text: '雷达图示例'
                    },
                    radar: {
                    indicator: [
                        { name: '销售', max: 6500 },
                        { name: '管理', max: 16000 },
                        { name: '信息技术', max: 30000 },
                        { name: '客服', max: 38000 },
                        { name: '研发', max: 52000 },
                        { name: '市场', max: 25000 }
                    ]
                },
                series: [
                    {
                        name: '预算 vs 开销',
                        type: 'radar',
                        data: [
                        {
                            value: [4200, 3000, 20000, 35000, 50000, 18000],
                            name: '预算分配'
                        },
                        {
                            value: [5000, 14000, 28000, 26000, 42000, 21000],
                            name: '实际开销'
                        }
                        ]
                    }
                    ]
                }`,
        funnel: `{
                title: {
                text: '漏斗图示例'
                },
                tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}%'
                },
                series: [
                {
                    name: '转化率',
                    type: 'funnel',
                    left: '10%',
                    top: 60,
                    bottom: 60,
                    width: '80%',
                    min: 0,
                    max: 100,
                    minSize: '0%',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 2,
                    label: {
                    show: true,
                    position: 'inside'
                    },
                    emphasis: {
                    label: {
                        fontSize: 20
                    }
                    },
                    data: [
                    { value: 100, name: '访问' },
                    { value: 80, name: '咨询' },
                    { value: 60, name: '订单' },
                    { value: 40, name: '付款' },
                    { value: 20, name: '完成' }
                    ]
                }
                ]
            }`,
        gauge: `{
          title: {
            text: "仪表盘示例",
          },
          series: [
            {
              name: "业务指标",
              type: "gauge",
              progress: {
                show: true,
              },
              detail: {
                valueAnimation: true,
                formatter: "{value}%",
              },
              data: [
                {
                  value: 70,
                  name: "完成率",
                },
              ],
            },
          ],
        }`,
      },
    };
  },
  created() {
    this.initOptions();
    this.debouncedUpdatePreview = this.debounce(this.updatePreview, 500);
  },
  methods: {
    initOptions() {
      // 初始化默认配置
      if (!this.optionModel.width) this.optionModel.width = "100%";
      if (!this.optionModel.height) this.optionModel.height = "300px";
      if (this.optionModel.refreshInterval === undefined)
        this.optionModel.refreshInterval = 0;

      // 初始化图表配置
      if (!this.optionModel.chartOptions) {
        this.optionModel.chartOptions = this.templates.bar;
      }

      this.chartOptionsCode =
        typeof this.optionModel.chartOptions === "string"
          ? this.optionModel.chartOptions
          : JSON.stringify(this.optionModel.chartOptions, null, 2);

      // 根据当前配置选择模板
      this.detectTemplate();
    },

    detectTemplate() {
      // 尝试匹配当前配置与内置模板
      const currentOptions = this.chartOptionsCode.trim();
      for (const [key, template] of Object.entries(this.templates)) {
        if (currentOptions === template.trim()) {
          this.selectedTemplate = key;
          return;
        }
      }
      this.selectedTemplate = "";
    },

    applyTemplate({ value = "" }) {
      if (!value) return;
      if (this.templates[value]) {
        if (
          this.chartOptionsCode &&
          this.chartOptionsCode.trim() !== this.templates[value].trim()
        ) {
          // 提示用户确认是否覆盖现有配置
          message.showMessageBox(
            "info",
            "应用模板将覆盖当前配置，是否继续？",
            "提示",
            () => {
              this.optionModel.chartOptions = this.chartOptionsCode = this.templates[
                value
              ];
            },
            () => {
              this.selectedTemplate = "";
            }
          );
        } else {
          this.optionModel.chartOptions = this.chartOptionsCode = this.templates[
            value
          ];
        }
      }
    },

    openConfigEditor() {
      this.showConfigEditorFlag = true;
      this.chartOptionsCode =
        typeof this.optionModel.chartOptions === "string"
          ? this.optionModel.chartOptions
          : JSON.stringify(this.optionModel.chartOptions, null, 2);
      this.originalOptions = this.chartOptionsCode;

      // 延迟执行，确保DOM已更新
      this.$nextTick(() => {
        this.initPreviewChart();
        this.updatePreview();
      });
    },

    initPreviewChart() {
      // 确保先销毁旧实例
      if (this.previewChart) {
        this.previewChart.dispose();
        this.previewChart = null;
      }

      if (this.$refs.previewContainer) {
        // 创建新实例
        this.previewChart = echarts.init(
          this.$refs.previewContainer,
          this.optionModel.theme || ""
        );
      }
    },

    updatePreview() {
      if (!this.chartOptionsCode) return;

      try {
        this.previewError = "";

        // 尝试解析配置
        let chartOptions;
        try {
          // 尝试作为JavaScript表达式评估
          const generateOptions = new Function(
            "echarts",
            "return " + this.chartOptionsCode
          );
          chartOptions = generateOptions(echarts);
        } catch (evalError) {
          // 如果失败，尝试解析为JSON
          try {
            chartOptions = JSON.parse(this.chartOptionsCode);
          } catch (jsonError) {
            throw new Error("配置格式错误: " + evalError.message);
          }
        }

        // 应用配置到预览图表
        if (this.previewChart) this.previewChart.setOption(chartOptions, true);
      } catch (error) {
        console.error("预览更新错误:", error);
        this.previewError = "配置错误: " + error.message;
      }
    },

    saveChartOptions() {
      try {
        // 保存配置前先验证
        let chartOptions;
        try {
          const generateOptions = new Function(
            "echarts",
            "return " + this.chartOptionsCode
          );
          chartOptions = generateOptions(echarts);
        } catch (evalError) {
          try {
            chartOptions = JSON.parse(this.chartOptionsCode);
          } catch (jsonError) {
            throw new Error("配置格式错误: " + evalError.message);
          }
        }

        this.optionModel.chartOptions = this.chartOptionsCode;
        this.showConfigEditorFlag = false;

        // 通知组件更新
        this.$emit("change");
      } catch (error) {
        this.$XModal.alert("保存失败: " + error.message);
      }
    },

    cancelEdit() {
      // 确认是否放弃修改
      if (this.originalOptions !== this.chartOptionsCode) {
        this.$XModal
          .confirm("放弃当前修改？")
          .then((res) => {
            this.chartOptionsCode = this.originalOptions;
            this.showConfigEditorFlag = false;
          })
          .catch(() => {
            // 用户取消操作，保持对话框打开
          });
      } else {
        this.showConfigEditorFlag = false;
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
  },
  watch: {
    showConfigEditorFlag(val) {
      if (!val && this.previewChart) {
        // 关闭对话框时销毁预览图表
        this.previewChart.dispose();
        this.previewChart = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.config-editor-modal {
  :deep(.vxe-modal--body) {
    padding: 0;
  }
}

.config-editor-container {
  display: flex;
  height: 100%;
  border: 1px solid #ebeef5;

  .editor-section {
    flex: 1;
    height: 100%;
    border-right: 1px solid #ebeef5;

    .code-editor {
      height: 100%;
    }
  }

  .preview-section {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;

    .preview-header {
      padding: 8px 15px;
      background-color: #f5f7fa;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-weight: bold;
        font-size: 14px;
      }
    }

    .preview-container {
      flex: 1;
      width: 100%;
    }

    .preview-error {
      position: absolute;
      top: 40px;
      right: 0;
      bottom: 0;
      left: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 240, 240, 0.9);
      color: #f56c6c;
      z-index: 10;

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
}
</style>
