<template>
  <el-container class="panel-container">
    <!-- 标签页组件，控制不同设置选项卡的显示 -->
    <el-tabs
      v-model="activeTab"
      style="width:100%;height: 100%; overflow: hidden"
    >
      <!-- 小部件设置选项卡 -->
      <el-tab-pane :label="i18nt('designer.hint.widgetSetting')" name="1">
        <el-scrollbar
          class="setting-scrollbar"
          :style="{ height: scrollerHeight }"
        >
          <!-- 固有的field -->
          <template v-if="!!selectedWidget && !selectedWidget.category">
            <el-form
              :model="optionModel"
              size="small"
              label-position="left"
              label-width="120px"
              class="setting-form"
              @submit.prevent
            >
              <!-- 字段标识输入框 -->
              <el-form-item label="控件编号" v-if="selectedWidget.options">
                <el-input
                  size="mini"
                  v-model="selectedWidget.options.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="数据服务" v-if="'service' in selectedWidget">
                <el-select
                  size="mini"
                  filterable
                  allow-create
                  v-model="serviceInput"
                  @change="serviceChange"
                >
                  <el-option
                    v-for="item in designer.expandList"
                    :key="item.key"
                    :label="item.key"
                    :value="item.key"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 折叠面板，用于设置小部件的属性 -->
              <el-collapse
                v-model="widgetActiveCollapseNames"
                class="setting-collapse"
              >
                <!-- 基础属性 -->
                <el-collapse-item
                  name="1"
                  :title="i18nt('designer.setting.commonSetting')"
                >
                  <template
                    v-for="(value, key) in selectedWidgetOptions"
                    :key="key"
                  >
                    <!-- 优先使用 attrs 中定义的属性 -->
                    <template v-if="findByKey(key)">
                      <el-form-item
                        :label="getLabel(key)"
                        v-if="findByKey(key).show"
                      >
                        <template #label>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="getRemark(key)"
                            placement="left"
                          >
                            <span>{{ getLabel(key) }}</span>
                          </el-tooltip>
                        </template>

                        <!-- 根据 attr 的 type 渲染不同组件 -->
                        <component
                          :is="getComponentType(key)"
                          v-model="selectedWidget.options[key]"
                          v-bind="getComponentProps(key)"
                        ></component>
                      </el-form-item>
                    </template>

                    <!-- 如果在 attrs 中没有找到对应的属性 -->
                    <!-- 处理 options 中的其他属性 -->
                    <template v-else-if="shouldRenderOption(key)">
                      <el-form-item :label="key">
                        <template #label>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            v-if="
                              Boolean(
                                i18nt(`designer.hint.${key}`) ||
                                  i18nt(`designer.setting.${key}`)
                              )
                            "
                            :content="
                              i18nt(`designer.hint.${key}`) ||
                                i18nt(`designer.setting.${key}`)
                            "
                            placement="left"
                          >
                            <span>{{
                              i18nt(`designer.setting.${key}`) || key
                            }}</span>
                          </el-tooltip>
                        </template>
                        <!-- 根据 value 类型渲染组件 -->
                        <component
                          v-bind="editorProps"
                          :name="key"
                          :is="getGenericComponentType(value, key)"
                          v-model="selectedWidget.options[key]"
                        ></component>
                      </el-form-item>
                    </template>
                  </template>
                </el-collapse-item>
                <!-- 事件属性 -->
                <el-collapse-item
                  name="2"
                  :title="i18nt('designer.setting.eventSetting')"
                >
                  <template
                    v-for="(value, key) in selectedWidgetOptions"
                    :key="key"
                  >
                    <!-- 优先使用 events 中定义的属性 -->
                    <template v-if="findByKey(key, 'events')">
                      <el-form-item :label="getLabel(key, 'events')">
                        <template #label>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="value.remark"
                            placement="left"
                          >
                            <span>{{ getLabel(key, "events") }}</span>
                          </el-tooltip>
                        </template>
                        <el-select-v2
                          style="width: 100%;vertical-align: middle"
                          :options="globalFuncOpts"
                          v-model="eventFunc[key]"
                          @change="(val) => setEventFunc(key, val)"
                          @dblclick="showGlobalFunctionObject(key)"
                          allow-create
                          filterable
                          clearable
                        />
                      </el-form-item>
                    </template>
                    <template v-else>
                      <el-form-item :label="key" v-if="shouldEventsOption(key)">
                        <template #label>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            v-if="
                              i18nt(`designer.hint.${key}`) ||
                                i18nt(`designer.setting.${key}`)
                            "
                            :content="
                              i18nt(`designer.hint.${key}`) ||
                                i18nt(`designer.setting.${key}`)
                            "
                            placement="left"
                          >
                            <span>{{
                              i18nt(`designer.setting.${key}`) || key
                            }}</span>
                          </el-tooltip>
                        </template>
                        <el-select-v2
                          style="width: 100%;vertical-align: middle"
                          :options="globalFuncOpts"
                          v-model="eventFunc[key]"
                          @change="(val) => setEventFunc(key, val)"
                          @dblclick="showGlobalFunctionObject(key)"
                          allow-create
                          filterable
                          clearable
                        />
                      </el-form-item>
                    </template>
                  </template>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </template>
          <!-- 容器 和 重构field 【容器category为container，重构为field】-->
          <template v-if="!!selectedWidget && !!selectedWidget.category">
            <el-form
              :model="optionModel"
              size="small"
              label-position="left"
              label-width="120px"
              class="setting-form"
              @submit.prevent
            >
              <el-form-item label="数据服务" v-if="'service' in selectedWidget">
                <el-select
                  filterable
                  allow-create
                  size="mini"
                  v-model="serviceInput"
                  @change="serviceChange"
                >
                  <el-option
                    v-for="item in designer.expandList"
                    :key="item.key"
                    :label="item.key"
                    :value="item.key"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-collapse
                v-model="widgetActiveCollapseNames"
                class="setting-collapse"
              >
                <!-- 共性属性 -->
                <el-collapse-item
                  name="1"
                  v-if="showCollapse(commonProps)"
                  :title="i18nt('designer.setting.commonSetting')"
                >
                  <template v-for="(editorName, propName) in commonProps">
                    <component
                      v-if="hasPropEditor(propName, editorName)"
                      :is="getPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                      :form-config="formConfig"
                    ></component>
                  </template>
                </el-collapse-item>
                <!-- 字段属性 -->
                <el-collapse-item
                  name="2"
                  v-if="showCollapse(advProps)"
                  :title="i18nt('designer.setting.advancedSetting')"
                >
                  <template v-for="(editorName, propName) in advProps">
                    <component
                      v-if="hasPropEditor(propName, editorName)"
                      :is="getPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                      :form-config="formConfig"
                    ></component>
                  </template>
                </el-collapse-item>
                <!-- 事件属性 -->
                <el-collapse-item
                  name="3"
                  :title="i18nt('designer.setting.eventSetting')"
                >
                  <template
                    v-for="(value, key) in selectedWidgetOptions"
                    :key="key"
                  >
                    <el-form-item :label="key" v-if="shouldEventsOption(key)">
                      <template #label>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          v-if="
                            i18nt(`designer.hint.${key}`) ||
                              i18nt(`designer.setting.${key}`)
                          "
                          :content="
                            i18nt(`designer.hint.${key}`) ||
                              i18nt(`designer.setting.${key}`)
                          "
                          placement="left"
                        >
                          <span>{{
                            i18nt(`designer.setting.${key}`) || key
                          }}</span>
                        </el-tooltip>
                      </template>
                      <el-select-v2
                        style="width: 100%;vertical-align: middle"
                        :options="globalFuncOpts"
                        v-model="eventFunc[key]"
                        @change="(val) => setEventFunc(key, val)"
                        @dblclick="showGlobalFunctionObject(key)"
                        allow-create
                        filterable
                        clearable
                      />
                    </el-form-item>
                  </template>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </template>
        </el-scrollbar>
      </el-tab-pane>

      <!-- 表单设置选项卡 -->
      <el-tab-pane
        v-if="designer"
        :label="i18nt('designer.hint.formSetting')"
        name="2"
      >
        <el-scrollbar
          class="setting-scrollbar"
          :style="{ height: scrollerHeight }"
        >
          <form-setting
            ref="formSetting"
            :designer="designer"
            :form-config="formConfig"
          ></form-setting>
        </el-scrollbar>
      </el-tab-pane>

      <!-- 数据服务选项卡 -->
      <el-tab-pane v-if="designer" label="数据服务" name="3">
        <el-scrollbar
          class="setting-scrollbar"
          :style="{ height: scrollerHeight }"
        >
          <el-form
            size="small"
            label-position="left"
            label-width="50px"
            class="setting-form"
            @submit.prevent
          >
            <el-form-item label="SQL">
              <el-select-v2
                size="small"
                v-model="modelCode"
                class="sql"
                :options="sqlOptions"
              ></el-select-v2>
              <el-button size="small" type="primary" @click="parseSql"
                >解析</el-button
              >
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script>
import CodeEditor from "@/core/components/CodeEditor/index.vue";
import FormSetting from "./form-setting.vue";
import { addWindowResizeHandler } from "@/core/utils/tool";
import i18n from "@/core/i18nLang";
import emitter from "@/core/components/VForm/lib/emitter";
// 自定义setting组件
import customComponents from "@/config/vForm/setting-components";
import WidgetProperties, { propertyRegistered } from "./propertyRegister.js";
import PropertyEditors from "./property-editor/index.js";
import { parseModelSql } from "@/api/functionGenerator";
import { getModuleDataService } from "@/api/suiteManage";
import messageHandler from "@/core/Message";
import setting from "@/config/vForm/settingConfig.js";

const {
  COMMON_PROPERTIES,
  ADVANCED_PROPERTIES,
  EVENT_PROPERTIES,
} = WidgetProperties;
export default {
  name: "SettingPanel",
  componentName: "SettingPanel",
  mixins: [i18n, emitter],
  components: {
    CodeEditor,
    FormSetting,
    ...PropertyEditors,
    ...customComponents,
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    formConfig: Object,
    dataService: Object,
    globalDsv: {
      type: Object,
      default: () => ({}),
    },
  },
  inject: ["getDesignerConfig"],
  data() {
    return {
      designerConfig: this.getDesignerConfig(),
      scrollerHeight: 0,
      activeTab: "2",
      widgetActiveCollapseNames: ["1", "2", "3"],
      eventFunc: {},
      commonProps: COMMON_PROPERTIES,
      advProps: ADVANCED_PROPERTIES,
      eventProps: EVENT_PROPERTIES,
      eventsService: {},
      serviceInput: "",
      modelCode: "",
      sqlOptions: [],
    };
  },
  computed: {
    globalFuncOpts() {
      return (
        Object.keys(this.formConfig?.globalObject || []).map((x) => ({
          value: x,
          label: x,
        })) || []
      );
    },
    // 获取选中小部件的选项
    optionModel: {
      get() {
        return this.selectedWidget?.options;
      },
      set(newValue) {
        this.selectedWidget.options = newValue;
      },
    },
    editorProps() {
      return {
        designer: this.designer,
        selectedWidget: this.selectedWidget,
        optionModel: this.optionModel,
        formConfig: this.formConfig,
        globalDsv: this.globalDsv,
      };
    },
    serviceList() {
      console.log(
        this.$props.dataService.map((data) => {
          let children = data.methodDtos.map((x) => {
            return {
              label: x.methodName,
              value: `${x.methodCode}.${data.objectCode}`,
            };
          });
          return {
            label: data.objectName,
            value: data.objectCode,
            children,
          };
        })
      );
      return this.$props.dataService.map((data) => {
        let children = data.methodDtos.map((x) => {
          return {
            label: x.methodName,
            value: `${x.methodCode}.${data.objectCode}`,
          };
        });
        return {
          label: data.objectName,
          value: data.objectCode,
          children,
        };
      });
    },
    selectedWidgetOptions() {
      let selected = setting.find((x) => x.type == this.selectedWidget.type);
      let data = Object.assign(
        {},
        this.selectedWidget?.options,
        selected?.options
      );
      console.log(data);
      console.log(selected);
      if (selected?.options) {
        for (let key in selected.options) {
          if (this.selectedWidget?.options[key] == undefined) {
            this.selectedWidget.options[key] = data[key];
          }
        }
      }
      if (selected?.attrs) {
        this.selectedWidget.attrs = selected.attrs;
      }
      return data;
    },
  },
  watch: {
    "designer.selectedWidget"(val) {
      this.activeTab = val ? "1" : "2";
      if (
        val.serviceMapId &&
        this.$props.formConfig &&
        this.$props.formConfig.serviceMap
      )
        this.serviceInput =
          this.$props.formConfig.serviceMap[val.serviceMapId] || "";
    },
    "selectedWidget.options": {
      deep: true,
      handler: "saveDesignerStep",
      immediate: true,
    },
    formConfig: {
      deep: true,
      handler: "saveDesignerStep",
      immediate: true,
    },
    globalDsv: {
      deep: true,
      handler(val) {
        if (val?.param) {
          this.getDataService();
        }
      },
    },
  },
  created() {
    // 监听 form-css-updated 事件，更新 CSS 类
    this.designer.handleEvent("form-css-updated", (cssClassList) => {
      this.designer.setCssClassList(cssClassList);
    });
  },

  mounted() {
    // 初始化时设置选项卡
    this.activeTab = this.designer.selectedWidget ? "1" : "2";
    this.adjustScrollerHeight();
    // 监听窗口大小变化，调整滚动条高度
    setTimeout(async () => {
      if (this.globalDsv?.param?.modelCode)
        this.modelCode = this.globalDsv?.param?.modelCode;
    }, 1500);
    addWindowResizeHandler(() => {
      this.$nextTick(() => {
        this.adjustScrollerHeight();
      });
    });
  },
  methods: {
    getDataService() {
      let data = Object.assign({}, this.globalDsv.param);
      getModuleDataService(data).then((res) => {
        console.log(res);
        this.sqlOptions = res.data.map((x) => ({
          value: x.objectCode,
          label: `${x.objectCode}-${x.objectName}`,
        }));
      });
    },
    serviceChange(val) {
      console.log(val);
      console.log(this.selectedWidget);
      this.$props.formConfig.serviceMap = {
        [`${this.selectedWidget.serviceMapId}`]: val,
      };
    },
    showGlobalFunctionObject(key) {
      this.$refs.formSetting.editGlobalFunctionsObject(
        `${this.selectedWidget?.id}.${key}`
      );
    },
    setEventFunc(key, val) {
      this.$refs.formSetting.setEventMap(
        `${this.selectedWidget?.id}.${key}`,
        val
      );
    },
    // 检查是否应该渲染选项
    shouldRenderOption(key) {
      return !/^on[A-Z][a-zA-Z]+$/.test(key) && key !== "name";
    },
    shouldEventsOption(key) {
      if (!(this.selectedWidget?.events && this.selectedWidget?.events[key])) {
        if (/^on[A-Z][a-zA-Z]+$/.test(key)) {
          this.$data.eventFunc[key] =
            (this.$props.formConfig?.eventMap &&
              this.$props.formConfig?.eventMap[
                `${this.selectedWidget?.id}.${key}`
              ]) ||
            "";
          return true;
        }
      }
    },
    // 查找属性名称对应的配置
    findByKey(key, prop = "attrs") {
      return this.selectedWidget[prop]?.find((prop) => prop.name === key);
    },
    // 获取属性标签
    getLabel(key, prop = "attrs") {
      const attr = this.findByKey(key, prop);
      return attr ? attr.title : key;
    },
    // 获取属性备注
    getRemark(key, prop = "attrs") {
      const attr = this.findByKey(key, prop);
      return attr ? attr.remark : "";
    },
    // 获取属性类型
    getType(key, prop = "attrs") {
      const attr = this.findByKey(key, prop);
      return attr ? attr.type : null;
    },
    // 获取组件类型
    getComponentType(key) {
      const type = this.getType(key);
      const componentMap = {
        text: "el-input",
        check: "el-switch",
        number: "el-input-number",
        droplist: "vxe-select",
        object: "option-items-editor",
      };
      return componentMap[type] || customComponents[type] || "el-input";
    },
    // 获取组件的属性
    getComponentProps(key) {
      const type = this.getType(key);
      let data =
        type === "droplist"
          ? {
              placeholder: "请选择",
              options: this.findByKey(key)?.options || [],
            }
          : {};
      return Object.assign(
        {
          designer: this.designer,
          selectedWidget: this.selectedWidget,
          optionModel: this.optionModel,
          formConfig: this.formConfig,
        },
        data
      );
    },
    // 获取通用组件类型
    getGenericComponentType(value, key) {
      const type = typeof value;
      const componentMap = {
        string: "el-input",
        boolean: "el-switch",
        number: "el-input-number",
        object: "option-items-editor",
      };
      if (key == "items") return "query-items-editor";
      return customComponents[type] || componentMap[type] || "el-input";
    },
    // 保存当前历史步骤
    saveDesignerStep(val) {
      for (const key in val) {
        if (this.shouldEventsOption(key)) this.eventsService[key] = "";
      }

      this.designer.saveCurrentHistoryStep();
    },
    // 关闭事件处理对话框
    closeEventDialog() {
      this.showWidgetEventDialogFlag = false;
    },
    // 调整滚动条高度
    adjustScrollerHeight() {
      this.scrollerHeight = window.innerHeight - 56 - 48 + "px";
    },
    showEventCollapse() {
      if (this.designerConfig["eventCollapse"] === undefined) {
        return true;
      }

      return !!this.designerConfig["eventCollapse"];
    },

    hasPropEditor(propName, editorName) {
      if (!editorName) {
        return false;
      }

      /* alert组件注册了两个type属性编辑器，跳过第一个type属性编辑器，只显示第二个alert-type属性编辑器！！ */
      if (propName.indexOf("-") <= -1) {
        let uniquePropName = this.selectedWidget.type + "-" + propName;
        if (propertyRegistered(uniquePropName)) {
          return false;
        }
      }

      let originalPropName = propName.replace(
        this.selectedWidget.type + "-",
        ""
      ); //去掉组件名称前缀-，如果有的话！！
      return this.designer.hasConfig(this.selectedWidget, originalPropName);
    },

    getPropEditor(propName, editorName) {
      let originalPropName = propName.replace(
        this.selectedWidget.type + "-",
        ""
      ); //去掉组件名称前缀-，如果有的话！！
      let ownPropEditorName = `${this.selectedWidget.type}-${originalPropName}-editor`;
      //
      if (this.$options.components[ownPropEditorName]) {
        //局部注册的属性编辑器组件
        return ownPropEditorName;
      }
      //return !!this.$root.$options.components[ownPropEditorName] ? ownPropEditorName : editorName  //Vue2全局注册的属性编辑器组件
      return this.$root.$.appContext.components[ownPropEditorName]
        ? ownPropEditorName
        : editorName; //Vue3全局注册的属性编辑器组件
    },

    showCollapse(propsObj) {
      let result = false;

      for (let propName in propsObj) {
        if (!propsObj.hasOwnProperty(propName)) {
          continue;
        }

        if (this.hasPropEditor(propName, propsObj[propName])) {
          result = true;
          break;
        }
      }

      return result;
    },

    parseSql() {
      if (!this.modelCode) {
        messageHandler.notifyWarning("请输入sql");
        return;
      }
      let data = Object.assign({}, this.globalDsv.param, {
        modelSql: "select * from " + this.modelCode,
      });
      console.log(data);
      parseModelSql(data).then((res) => {
        if (res.code !== "200") {
          messageHandler.notifyWarning("未能解析该sql。");
        } else {
          messageHandler.notifySuccess("解析成功！");
          let formJson = Object.assign({}, this.globalDsv?.param?.formJson, {
            methodList: res.data.methodList,
            columnList: res.data.columnList,
            widgetList: this.designer.widgetList,
            formConfig: this.designer.formConfig,
          });

          let modifiedFlag = this.designer.loadFormJson(formJson, true);
          if (modifiedFlag) {
            this.designer.emitHistoryChange();
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-container {
  padding: 0 8px;
}

.setting-scrollbar {
  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }
}

.setting-collapse {
  :deep(.el-collapse-item__content) {
    padding-bottom: 6px;
  }

  :deep(.el-collapse-item__header) {
    font-style: italic;
    font-weight: bold;
  }
}

.setting-form {
  :deep(.el-form-item__label) {
    font-size: 13px;
    overflow: hidden;
    white-space: nowrap;
  }

  :deep(.el-form-item--small.el-form-item) {
    margin-bottom: 10px;
  }
}

:deep(.hide-spin-button) input::-webkit-outer-spin-button,
:deep(.hide-spin-button) input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

:deep(.hide-spin-button) input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

:deep(.custom-divider.el-divider--horizontal) {
  margin: 10px 0;
}

:deep(.custom-divider-margin-top.el-divider--horizontal) {
  margin: 20px 0;
}

.sql {
  width: calc(100% - 68px);
  display: inline-block;
  margin-right: 10px;
}

.small-padding-dialog {
  :deep(.el-dialog__body) {
    padding: 6px 15px 12px 15px;
  }
}
</style>
