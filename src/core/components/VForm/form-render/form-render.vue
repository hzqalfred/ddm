<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <el-form
    :label-position="labelPosition"
    :size="size"
    :class="[customClass]"
    class="render-form"
    :label-width="labelWidth"
    :validate-on-rule-change="false"
    :model="formDataModel"
    ref="renderForm"
    @submit.prevent
    :rules="formRules"
  >
    <template v-for="(widget, index) in widgetList">
      <slot name="container-render" :widget="widget"></slot>
      <template v-if="'container' === widget.category">
        <component
          :formType="formType"
          :is="getContainerWidgetName(widget)"
          :widget="widget"
          :key="widget.id"
          :parent-list="widgetList"
          :index-of-parent-list="index"
          :parent-widget="null"
          :fun-id="funId"
          :data-id="widget.id"
        >
          <!-- 递归传递插槽！！！ -->
          <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </component>
      </template>
      <template v-else>
        <component
          :is="getWidgetName(widget)"
          :field="widget"
          :form-model="formDataModel"
          :designer="null"
          :key="widget.id"
          :parent-list="widgetList"
          :index-of-parent-list="index"
          :parent-widget="null"
          :fun-id="funId"
        >
          <!-- 递归传递插槽！！！ -->
          <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </component>
      </template>
    </template>
  </el-form>
</template>

<script>
//import ElForm from 'element-ui/packages/form/src/form.vue'  /* 用于源码调试Element UI */
import emitter from "@/core/components/VForm/lib/emitter";
import "./container-item/index";
import FieldComponents from "@/core/components/VForm/form-designer/form-widget/field-widget/index";
import { deepClone } from "@/core/utils/tool";
import {
  generateId,
  insertCustomCssToHead,
  insertGlobalFunctionsToHtml,
  getAllContainerWidgets,
  getAllFieldWidgets,
  traverseFieldWidgets,
  buildDefaultFormJson,
} from "@/core/components/VForm/lib/utils";
import auth from "@/core/AuthManage";
import router from "@/core/components/WebHash/router";

import i18n, { changeLocale } from "@/core/i18nLang";
import request from "@/core/Request";

export default {
  name: "VFormRender",
  componentName: "VFormRender",
  mixins: [emitter, i18n],
  components: {
    //ElForm,
    ...FieldComponents,
  },
  props: {
    formJson: {
      //prop传入的表单JSON配置
      type: Object,
      default: () => buildDefaultFormJson(),
    },
    formData: {
      //prop传入的表单数据
      type: Object,
      default: () => ({}),
    },
    optionData: {
      //prop传入的选项数据
      type: Object,
      default: () => ({}),
    },
    previewState: {
      //是否表单预览状态
      type: Boolean,
      default: false,
    },
    globalDsv: {
      // 全局数据源变量
      type: Object,
      default: () => ({}),
    },
    funId: {
      type: String,
      default: "",
    },
    keyIDColumn: {
      type: String,
      default: "",
    },
    childrenForm: {
      type: Array,
      default: () => [],
    },
    customTemplates: {
      type: Array,
      default: () => {
        return [];
      },
    },
    rulesMap: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    formType: String,
    layoutType: String,
    dataCenter: Object, // 接收传入的DataCenter实例
    pageProvide: Object, // 接收传入的DataCenter实例
  },
  inject: ["homePage"],
  provide() {
    return {
      getFormType: this.formType,
      refList: this.widgetRefList,
      sfRefList: this.subFormRefList, //收集SubForm引用
      getFormConfig: () =>
        this.formJsonObj
          .formConfig /* 解决provide传递formConfig属性的响应式更新问题！！ */,
      getGlobalDsv: () => this.globalDsv, // 全局数据源变量
      globalOptionData: this.optionData,
      getOptionData: () =>
        this
          .optionData /* 该方法用于在异步更新option-data之后重新获取到最新值 */,
      globalModel: {
        formModel: this.formDataModel,
      },
      previewState: this.previewState,
      getFunId: () => this.funId,
      formJsonObj: this.formJson,
      getKeyId: () => this.formDataModel[this.keyIDColumn],
      getDataCenter: () => this.dataCenter,
      getPageProvide: () => this.pageProvide,
      getFormRender: () => this,
      getDictionary_dsv: () => this.dictionary_dsv,
    };
  },
  data() {
    return {
      isBuildFormING: false,
      isFormData: false,
      formRules: this.getRules(),
      formJsonObj: this.formJson,
      formDataModel: {},
      oldFormData: {},
      widgetRefList: {},
      subFormRefList: {},
      formId: null, //表单唯一Id，用于区分页面上的多个v-form-render组件！！
      externalComponents: {}, //外部组件实例集合
      customRules: this.rules,
      // 映射表
      _widgetMaps: {
        idToWidget: new Map(), // id -> widget 对象
        idToComponent: new Map(), // id -> widget 组件实例
        idToVxeInstance: new Map(), // id -> VXE 组件实例
        nameToId: new Map(), // name -> id (支持反向查找)
      },
      dictionary_dsv: {},
    };
  },
  computed: {
    request() {
      return request;
    },
    formConfig() {
      return this.formJsonObj.formConfig;
    },

    widgetList() {
      return this.formJsonObj.widgetList;
    },

    labelPosition() {
      if (!!this.formConfig && !!this.formConfig.labelPosition) {
        return this.formConfig.labelPosition;
      }

      return "left";
    },

    labelWidth() {
      if (!!this.formConfig && !!this.formConfig.labelWidth) {
        return this.formConfig.labelWidth + "px";
      }

      return "80px";
    },

    size() {
      if (!!this.formConfig && !!this.formConfig.size) {
        return this.formConfig.size;
      }

      return "default";
    },

    customClass() {
      return !!this.formConfig && !!this.formConfig.customClass
        ? this.formConfig.customClass
        : "";
    },
  },
  watch: {
    formData: {
      handler(n) {
        this.setFormData(n);
      },
      deep: true, //开启深度监听
    },

    formDataModel: {
      handler(n, o) {
        //
        if (!this.isBuildFormING) {
          if (!this.isFormData) {
            this.$emit(
              "formDataWatch",
              deepClone(n),
              deepClone(this.oldFormData),
              "change"
            );
            this.oldFormData = deepClone(n);
          } else {
            this.$emit(
              "formDataWatch",
              deepClone(n),
              deepClone(this.oldFormData),
              "batch"
            );
            this.isFormData = false;
          }
        }
      },
      deep: true,
    },
    formJson: {
      handler(n) {
        this.setFormJson(n, true);
      },
      deep: true,
    },
  },
  created() {
    this.buildFormModel(!this.formJsonObj ? null : this.formJsonObj.widgetList);
    this.initFormObject();
  },
  mounted() {
    this.initLocale();
    this.handleOnMounted();
  },
  unmounted() {
    // 清理映射表 hzq(6.17)
    this.clearAllMaps();
  },
  methods: {
    bindGlobalFunctionsToVuePrototype() {
      if (!this.formConfig?.globalObject) return;

      const globalObj = deepClone(this.formConfig.globalObject);

      Object.keys(globalObj).forEach((key) => {
        let func = globalObj[key];
        if (typeof func === "string") {
          try {
            func = eval(`(${func})`);
          } catch (e) {
            console.error(`转换函数失败: ${key}`, e);
            return;
          }
        }

        if (typeof func === "function") {
          // let proto = Object.getPrototypeOf(this); //proto被锁死
          // 绑定到Vue实例原型，使所有组件都能访问
          this[key] = function(...args){
            return func.apply(this, args);
          }
        }
      });
    },
    getRules() {
      let newRules = {};
      for (let key in this.rules) {
        if (!key.includes("global_")) {
          if (this.rulesMap[key] && this.rulesMap[key].length != 0) {
            newRules[key] = [...this.rulesMap[key], ...this.rules[key]];
          } else {
            newRules[key] = this.rules[key];
          }
        }
      }
      return newRules;
    },
    initFormObject(insertHtmlCodeFlag = true) {
      this.formId = "vfRender" + generateId();
      if (insertHtmlCodeFlag) {
        this.insertCustomStyleAndScriptNode();
      }
      this.addFieldChangeEventHandler();
      this.addFieldValidateEventHandler();
      this.registerFormToRefList();
      this.handleOnCreated();
    },

    getContainerWidgetName(widget) {
      if (widget.type === "grid") {
        //grid-item跟VueGridLayout全局注册组件重名，故特殊处理！！
        return "vf-grid-item";
      }

      // 子表容器
      // if (widget.type == 'subgrid' || widget.type == 'universal') {
      //   return widget.type + '-widget'
      // }

      return widget.type + "-item";
    },

    getWidgetName(widget) {
      return widget.type + "-widget";
    },

    initLocale() {
      let curLocale = localStorage.getItem("v_form_locale") || "zh-CN";
      this.changeLanguage(curLocale);
    },

    insertCustomStyleAndScriptNode() {
      if (!!this.formConfig && !!this.formConfig.cssCode) {
        insertCustomCssToHead(
          this.formConfig.cssCode,
          this.previewState ? "" : this.formId
        );
      }
      if (!!this.formConfig && !!this.formConfig.functions) {
        insertGlobalFunctionsToHtml(this.formConfig.functions, "1");
      }
    },

    buildFormModel(widgetList) {
      this.isBuildFormING = true;
      if (!!widgetList && widgetList.length > 0) {
        widgetList.forEach((wItem) => {
          this.buildDataFromWidget(wItem);
        });
      }
      this.isBuildFormING = false;
    },

    buildDataFromWidget(wItem) {
      if (wItem.category === "container") {
        if (wItem.type === "grid") {
          if (!!wItem.cols && wItem.cols.length > 0) {
            wItem.cols.forEach((childItem) => {
              this.buildDataFromWidget(childItem);
            });
          }
        } else if (wItem.type === "table") {
          if (!!wItem.rows && wItem.rows.length > 0) {
            wItem.rows.forEach((rowItem) => {
              if (!!rowItem.cols && rowItem.cols.length > 0) {
                rowItem.cols.forEach((colItem) => {
                  this.buildDataFromWidget(colItem);
                });
              }
            });
          }
        } else if (wItem.type === "tab") {
          if (!!wItem.tabs && wItem.tabs.length > 0) {
            wItem.tabs.forEach((tabItem) => {
              if (!!tabItem.widgetList && tabItem.widgetList.length > 0) {
                tabItem.widgetList.forEach((childItem) => {
                  this.buildDataFromWidget(childItem);
                });
              }
            });
          }
        } else if (wItem.type === "sub-form") {
          let subFormName = wItem.options.name;
          if (!this.formData.hasOwnProperty(subFormName)) {
            let subFormDataRow = {};
            if (wItem.options.showBlankRow) {
              wItem.widgetList.forEach((subFormItem) => {
                if (subFormItem.formItemFlag) {
                  subFormDataRow[subFormItem.options.name] =
                    subFormItem.options.defaultValue;
                }
              });

              this.formDataModel[subFormName] = [subFormDataRow];
            } else {
              this.formDataModel[subFormName] = [];
            }
          } else {
            let initialValue = this.formData[subFormName];
            this.formDataModel[subFormName] = deepClone(initialValue);
          }
        } else if (wItem.type === "grid-col" || wItem.type === "table-cell") {
          if (!!wItem.widgetList && wItem.widgetList.length > 0) {
            wItem.widgetList.forEach((childItem) => {
              this.buildDataFromWidget(childItem);
            });
          }
        } else {
          //自定义容器组件
          if (!!wItem.widgetList && wItem.widgetList.length > 0) {
            wItem.widgetList.forEach((childItem) => {
              this.buildDataFromWidget(childItem);
            });
          }
        }
      } else if (wItem.formItemFlag) {
        if (!this.formData.hasOwnProperty(wItem.options.name)) {
          this.formDataModel[wItem.options.name] = wItem.options.defaultValue;
        } else {
          let initialValue = this.formData[wItem.options.name];
          this.formDataModel[wItem.options.name] = deepClone(initialValue);
        }
      }
    },

    addFieldChangeEventHandler() {
      this.off$("fieldChange"); //移除原有事件监听
      this.on$(
        "fieldChange",
        ([fieldName, newValue, oldValue, subFormName, subFormRowIndex]) => {
          this.handleFieldDataChange(
            fieldName,
            newValue,
            oldValue,
            subFormName,
            subFormRowIndex
          );
          this.$emit(
            "formChange",
            fieldName,
            newValue,
            oldValue,
            this.formDataModel,
            subFormName,
            subFormRowIndex
          );
          this.$emit("formDataChange", [fieldName, newValue]);
        }
      );
    },

    addFieldValidateEventHandler() {
      this.off$("fieldValidation"); //移除原有事件监听
      this.on$("fieldValidation", (fieldName) => {
        if (this.$refs.renderForm) {
          this.$refs.renderForm.validateField(fieldName);
        }
      });
    },

    registerFormToRefList() {
      this.widgetRefList["v_form_ref"] = this;
    },

    handleFieldDataChange(
      fieldName,
      newValue,
      oldValue,
      subFormName,
      subFormRowIndex
    ) {
      try {
        let obj = this.formConfig?.globalObject;
        let event =
          (this.formConfig?.eventMap &&
            this.formConfig?.eventMap["form.onChange"]) ||
          "";
        if (obj && event && obj[event]) {
          let customFunc = obj[event];
          customFunc.call(
            this,
            fieldName,
            newValue,
            oldValue,
            this.formDataModel,
            subFormName,
            subFormRowIndex
          );
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用:", error);
      }
    },

    handleOnCreated() {
      try {
        setTimeout(() => {
          let event =
            (this.formConfig?.eventMap &&
              this.formConfig?.eventMap["form.DOMContentLoaded"]) ||
            "";
          let obj = this.formConfig?.globalObject;
          if (obj && event && obj[event]) {
            let customFunc = obj[event];
            customFunc.call(this);
          }
        }, 100);
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用:", error);
      }
    },

    handleOnMounted() {
      try {
        this.bindGlobalFunctionsToVuePrototype()
        setTimeout(() => {
          let event =
            (this.formConfig?.eventMap &&
              this.formConfig?.eventMap["form.onLoad"]) ||
            "";
          let obj = this.formConfig?.globalObject;
          // this.formConfig.globalObj = obj
          if (obj && event && obj[event]) {
            let customFunc = obj[event];
            customFunc.call(this);
          }
          let { param = {} } = this.globalDsv;
          let dic = {};
          param?.moduleSettingList?.map((x) => {
            dic[x.settingItem] = JSON.parse(x.settingValue);
          });
          this.dictionary_dsv = Object.assign({}, dic);
          if (obj && obj["setGlobalDsv"]) {
            let customdsvFunc = obj["setGlobalDsv"];
            customdsvFunc.call(this, this.dictionary_dsv);
          }
        }, 100);
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用:", error);
      }
    },

    findWidgetAndSetDisabled(widgetName, disabledFlag) {
      let foundW = this.getWidgetRef(widgetName);
      if (foundW) {
        foundW.setDisabled(disabledFlag);
      } else {
        //没找到，可能是子表单中的组件
        this.findWidgetOfSubFormAndSetDisabled(widgetName, disabledFlag);
      }
    },

    findWidgetOfSubFormAndSetDisabled(widgetName, disabledFlag) {
      this.findWidgetNameInSubForm(widgetName).forEach((wn) => {
        let sw = this.getWidgetRef(wn);
        if (sw) {
          sw.setDisabled(disabledFlag);
        }
      });
    },

    findWidgetAndSetHidden(widgetName, hiddenFlag) {
      let foundW = this.getWidgetRef(widgetName);
      if (foundW) {
        foundW.setHidden(hiddenFlag);
      } else {
        //没找到，可能是子表单中的组件
        this.findWidgetOfSubFormAndSetHidden(widgetName, hiddenFlag);
      }
    },

    findWidgetOfSubFormAndSetHidden(widgetName, hiddenFlag) {
      this.findWidgetNameInSubForm(widgetName).forEach((wn) => {
        let sw = this.getWidgetRef(wn);
        if (sw) {
          sw.setHidden(hiddenFlag);
        }
      });
    },

    findWidgetNameInSubForm(widgetName) {
      let result = [];
      let subFormName = null;
      let handlerFn = (field, parent) => {
        if (!!field.options && field.options.name === widgetName) {
          subFormName = parent.options.name;
        }
      };
      traverseFieldWidgets(this.widgetList, handlerFn);

      if (subFormName) {
        let subFormRef = this.getWidgetRef(subFormName);
        if (subFormRef) {
          let rowIds = subFormRef.getRowIdData();
          if (!!rowIds && rowIds.length > 0) {
            rowIds.forEach((rid) => {
              result.push(widgetName + "@row" + rid);
            });
          }
        }
      }

      return result;
    },

    //--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
    /* 提示：用户可自行扩充这些方法！！！ */

    changeLanguage(langName) {
      changeLocale(langName);
    },

    getNativeForm() {
      //获取原生form引用
      return this.$refs["renderForm"];
    },

    getFormRef() {
      return this;
    },

    getWidgetRef(widgetName, showError = false) {
      let foundRef = this.widgetRefList[widgetName];
      if (!foundRef && !!showError) {
        this.$message.error(this.i18nt("render.hint.refNotFound") + widgetName);
      }
      return foundRef;
    },

    clearFormDataModel() {
      for (let pkey in this.formDataModel) {
        delete this.formDataModel[pkey];
      }
    },

    deleteFormKey(key) {
      delete this.formDataModel[key];
    },

    /**
     * 动态加载表单JSON
     * @param newFormJson
     */
    setFormJson(newFormJson, isRebuildFormModel) {
      if (newFormJson) {
        if (
          typeof newFormJson === "string" ||
          newFormJson.constructor === Object
        ) {
          let newFormJsonObj = null;
          if (typeof newFormJson === "string") {
            newFormJsonObj = JSON.parse(newFormJson);
          } else {
            newFormJsonObj = newFormJson;
          }

          if (!newFormJsonObj.formConfig || !newFormJsonObj.widgetList) {
            this.$message.error("Invalid format of form json.");
            return;
          }

          if (isRebuildFormModel) {
            /* formDataModel必须在widgetList赋值完成初始化，因为widgetList赋值意味着子组件开始创建！！！ */
            //this.formDataModel = {}  //清空表单数据对象（有bug，会导致表单校验失败！！）
            this.clearFormDataModel(); //上行代码有问题，会导致表单校验失败，故保留原对象引用只清空对象属性！！
            this.buildFormModel(newFormJsonObj.widgetList);
          }

          this.formJsonObj["formConfig"] = newFormJsonObj.formConfig;
          this.formJsonObj["widgetList"] = newFormJsonObj.widgetList;
          this.batchRegisterWidgets(this.formJsonObj.widgetList); //hzq(6.17)

          this.insertCustomStyleAndScriptNode(); /* 必须先插入表单全局函数，否则VForm内部引用全局函数会报错！！！ */
          this.$nextTick(() => {
            this.initFormObject(false);
            this.handleOnMounted();
          });
        } else {
          this.$message.error("Set form json failed.");
        }
      }
    },

    /**
     * 重新加载选项数据
     * @param widgetNames 指定重新加载的组件名称或组件名数组，不传则重新加载所有选项字段
     */
    reloadOptionData(widgetNames) {
      let eventParams = [];
      if (!!widgetNames && typeof widgetNames === "string") {
        eventParams = [widgetNames];
      } else if (!!widgetNames && Array.isArray(widgetNames)) {
        eventParams = [...widgetNames];
      }
      this.broadcast("FieldWidget", "reloadOptionItems", eventParams);
    },

    getFormData(needValidation = true) {
      if (!needValidation) {
        return this.formDataModel;
      }

      let callback = function nullFunc() {};
      let promise = new window.Promise(function(resolve, reject) {
        callback = function(formData, error) {
          !error ? resolve(formData) : reject(error);
        };
      });

      this.$refs["renderForm"].validate((valid, invalidFields) => {
        if (valid) {
          callback(this.formDataModel);
        } else {
          let fields = Object.keys(invalidFields);
          this.$refs.renderForm.scrollToField(fields[0]);
          this.$message.error(invalidFields[fields[0]][0].message);

          this.$nextTick(() => {
            var isError = document.getElementsByClassName("is-error");
            isError[0].querySelector("input")?.focus();
          });
          callback(
            this.formDataModel,
            this.i18nt("render.hint.validationFailed")
          );
        }
      });

      return promise;
    },

    setFormData(formData, key) {
      if (key) {
        // 单个字段更新
        if (key.includes(".")) {
          // 处理嵌套属性
          this.setValueByPath(this.formDataModel, key, formData);
        } else {
          this.formDataModel[key] = formData;
        }
        this.$emit("formDataChange", [key, formData]);
      } else {
        // 批量更新
        this.oldFormData = deepClone(this.formDataModel);
        this.isFormData = true;

        // 处理嵌套结构
        // this.updateFormDataDeep(formData, this.formDataModel);
        this.formDataModel = formData;

        // 通知子组件数据更新
        this.$nextTick(() => {
          this.broadcast("ContainerItem", "setFormData", this.formDataModel);
          this.broadcast("FieldWidget", "setFormData", this.formDataModel);
        });
      }
    },
    // 新增方法处理深层数据更新
    updateFormDataDeep(sourceData, targetData) {
      if (!sourceData || typeof sourceData !== "object") return;
      // 获取字段映射关系
      const fieldMap = this.getFieldPathMapping();
      if (!Object.keys(sourceData).length) {
        Object.keys(targetData).forEach((key) => {
          if (!(targetData[key] instanceof Array)) targetData[key] = "";
        });
      }

      // 遍历源数据
      Object.entries(sourceData).forEach(([key, value]) => {
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          // 处理嵌套对象
          if (!targetData[key]) targetData[key] = {};
          this.updateFormDataDeep(value, targetData[key]);

          // 处理可能的扁平字段，如API返回mainDataSource对象，但表单有mainDataSource.type字段
          Object.entries(value).forEach(([subKey, subValue]) => {
            const fullPath = `${key}.${subKey}`;
            if (fieldMap.has(fullPath)) {
              // 确保此嵌套值也被正确设置到扁平表单模型中
              targetData[fullPath] = subValue;
            }
          });
        } else {
          // 直接赋值普通属性
          targetData[key] = value;

          // 对于有子属性映射的对象，也尝试设置扁平字段
          if (fieldMap.has(key)) {
            targetData[key] = value;
          }
        }
      });
    },

    // 获取字段路径映射
    getFieldPathMapping() {
      const fieldMap = new Map();

      const processWidgetList = (widgets) => {
        if (!widgets) return;

        widgets.forEach((widget) => {
          if (widget.formItemFlag && widget.options && widget.options.name) {
            fieldMap.set(widget.options.name, true);
          }

          // 处理容器...递归
          if (widget.category === "container") {
            // 处理各种容器类型...
            if (widget.widgetList) processWidgetList(widget.widgetList);
            if (widget.cols)
              widget.cols.forEach((col) => {
                if (col.widgetList) processWidgetList(col.widgetList);
              });
            if (widget.tabs)
              widget.tabs.forEach((tab) => {
                if (tab.widgetList) processWidgetList(tab.widgetList);
              });
          }
        });
      };

      if (this.widgetList) {
        processWidgetList(this.widgetList);
      }

      return fieldMap;
    },
    getFieldValue(fieldName) {
      //单个字段获取值
      let fieldRef = this.getWidgetRef(fieldName);
      if (!!fieldRef && !!fieldRef.getValue) {
        return fieldRef.getValue();
      }

      if (!fieldRef) {
        //如果是子表单字段
        let result = [];
        this.findWidgetNameInSubForm(fieldName).forEach((wn) => {
          let sw = this.getWidgetRef(wn);
          if (!!sw && !!sw.getValue) {
            result.push(sw.getValue());
          }
        });

        return result;
      }
    },

    setFieldValue(fieldName, fieldValue) {
      //单个更新字段值
      let fieldRef = this.getWidgetRef(fieldName);
      if (!!fieldRef && !!fieldRef.setValue) {
        fieldRef.setValue(fieldValue);
      }

      if (!fieldRef) {
        //如果是子表单字段
        this.findWidgetNameInSubForm(fieldName).forEach((wn) => {
          let sw = this.getWidgetRef(wn);
          if (!!sw && !!sw.setValue) {
            sw.setValue(fieldValue);
          }
        });
      }
    },

    getSubFormValues(subFormName, needValidation = true) {
      let foundSFRef = this.subFormRefList[subFormName];
      // if (!foundSFRef) {
      //   return this.formDataModel[subFormName]
      // }
      return foundSFRef.getSubFormValues(needValidation);
    },

    disableForm() {
      let wNameList = Object.keys(this.widgetRefList);
      wNameList.forEach((wName) => {
        let foundW = this.getWidgetRef(wName);
        if (foundW) {
          if (!!foundW.widget && foundW.widget.type === "sub-form") {
            foundW.disableSubForm();
          } else {
            //!!foundW.setDisabled && foundW.setDisabled(true)
            if (foundW.setDisabled) {
              foundW.setDisabled(true);
            }
          }
        }
      });
    },

    enableForm() {
      let wNameList = Object.keys(this.widgetRefList);
      wNameList.forEach((wName) => {
        let foundW = this.getWidgetRef(wName);
        if (foundW) {
          if (!!foundW.widget && foundW.widget.type === "sub-form") {
            foundW.enableSubForm();
          } else {
            //!!foundW.setDisabled && foundW.setDisabled(false)
            if (foundW.setDisabled) {
              foundW.setDisabled(false);
            }
          }
        }
      });
    },

    resetForm() {
      //重置表单
      let subFormNames = Object.keys(this.subFormRefList);
      subFormNames.forEach((sfName) => {
        if (this.subFormRefList[sfName].resetSubForm) {
          this.subFormRefList[sfName].resetSubForm();
        }
      });

      let wNameList = Object.keys(this.widgetRefList);
      wNameList.forEach((wName) => {
        let foundW = this.getWidgetRef(wName);
        if (!!foundW && !foundW.subFormItemFlag && !!foundW.resetField) {
          // 跳过子表单字段！！
          foundW.resetField();
        }
      });

      this.$nextTick(() => {
        this.clearValidate(); /* 清除resetField方法触发的校验错误提示 */
      });
    },

    clearValidate(props) {
      this.$refs.renderForm.clearValidate(props);
    },

    /**
     * 校验表单
     * @param callback 回调函数
     */
    validateForm(callback) {
      this.$refs["renderForm"].validate((valid) => {
        callback(valid);
      });
    },

    async validateFields() {
      try {
        await this.$refs.renderForm.validate();
        return true; // 验证成功
      } catch (error) {
        return false; // 验证失败
      }
    },

    disableWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === "string") {
          this.findWidgetAndSetDisabled(widgetNames, true);
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach((wn) => {
            this.findWidgetAndSetDisabled(wn, true);
          });
        }
      }
    },

    enableWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === "string") {
          this.findWidgetAndSetDisabled(widgetNames, false);
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach((wn) => {
            this.findWidgetAndSetDisabled(wn, false);
          });
        }
      }
    },

    hideWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === "string") {
          this.findWidgetAndSetHidden(widgetNames, true);
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach((wn) => {
            this.findWidgetAndSetHidden(wn, true);
          });
        }
      }
    },

    showWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === "string") {
          this.findWidgetAndSetHidden(widgetNames, false);
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach((wn) => {
            this.findWidgetAndSetHidden(wn, false);
          });
        }
      }
    },

    /**
     * 获取所有字段组件
     * @returns {*[]}
     */
    getFieldWidgets() {
      return getAllFieldWidgets(this.formJsonObj.widgetList);
    },

    /**
     * 获取所有容器组件
     * @returns {*[]}
     */
    getContainerWidgets() {
      return getAllContainerWidgets(this.formJsonObj.widgetList);
    },

    /**
     * 增加外部组件引用，可通过getEC()方法获取外部组件，以便在VForm内部调用外部组件方法
     * @param componentName 外部组件名称
     * @param externalComponent 外部组件实例
     */
    addEC(componentName, externalComponent) {
      this.externalComponents[componentName] = externalComponent;
    },

    /**
     * 判断外部组件是否可获取
     * @param componentName 外部组件名称
     * @returns {boolean}
     */
    hasEC(componentName) {
      return this.externalComponents.hasOwnProperty(componentName);
    },

    /**
     * 获取外部组件实例
     * @param componentName
     * @returns {*}
     */
    getEC(componentName) {
      return this.externalComponents[componentName];
    },

    /**
     * 获取globalDsv对象
     * @returns {*}
     */
    getGlobalDsv() {
      return this.globalDsv;
    },
    async execRequest(key, requestParam) {
      if (this.designer) return;
      let path = router.currentRoute.value.path;
      console.log(path);
      let url =
        path == "/setting"
          ? `/design/data/service/preview/${key}`
          : `/event/exec/${key}`;
      return await this.request.postData(url, requestParam);
    },
    //--------------------- 以上为组件支持外部调用的API方法 end ------------------//
    // ==================== 智能映射管理(hzq) ====================

    // 注册组件到映射表
    registerWidgetToMaps(widget, componentInstance = null) {
      if (!widget || !widget.id) return;

      // 注册 widget
      this._widgetMaps.idToWidget.set(widget.id, widget);

      // 注册 name -> id 映射
      if (widget.options && widget.options.name) {
        this._widgetMaps.nameToId.set(widget.options.name, widget.id);
      }

      // 注册组件实例
      if (componentInstance) {
        this._widgetMaps.idToComponent.set(widget.id, componentInstance);

        // 如果有 VXE 实例，也注册
        this._tryRegisterVxeInstance(widget.id, componentInstance);
      }
    },
    // 尝试注册 VXE 实例（延迟注册机制）
    _tryRegisterVxeInstance(
      fieldId,
      componentInstance,
      refsName = "fieldEditor"
    ) {
      if (componentInstance?.$refs[refsName]) {
        this._widgetMaps.idToVxeInstance.set(
          fieldId,
          componentInstance.$refs[refsName]
        );
      } else {
        // 如果还没有，下次 tick 再试
        this.$nextTick(() => {
          if (componentInstance?.$refs[refsName]) {
            this._widgetMaps.idToVxeInstance.set(
              fieldId,
              componentInstance.$refs[refsName]
            );
          }
        });
      }
    },
    // 从映射表移除
    unregisterWidgetFromMaps(fieldId, widgetName = null) {
      this._widgetMaps.idToWidget.delete(fieldId);
      this._widgetMaps.idToComponent.delete(fieldId);
      this._widgetMaps.idToVxeInstance.delete(fieldId);

      if (widgetName) {
        this._widgetMaps.nameToId.delete(widgetName);
      }
    },
    // ==================== 公共查找接口 ====================
    getWidgetById(fieldId, useCache = true) {
      if (!fieldId) return null;

      // 优先从缓存获取
      if (useCache && this._widgetMaps.idToWidget.has(fieldId)) {
        return this._widgetMaps.idToWidget.get(fieldId);
      }

      // 遍历查找并更新缓存
      const widget = this._findWidgetInTree(this.widgetList, fieldId);
      if (widget) {
        this._widgetMaps.idToWidget.set(fieldId, widget);
      }

      return widget;
    },
    getComponentById(fieldId) {
      if (!fieldId) return null;

      // 优先从缓存获取
      if (this._widgetMaps.idToComponent.has(fieldId)) {
        return this._widgetMaps.idToComponent.get(fieldId);
      }

      // 通过 name 查找
      const widget = this.getWidgetById(fieldId);
      if (widget?.options?.name) {
        const component = this.formWidget?.getWidgetRef(widget.options.name);
        if (component) {
          this._widgetMaps.idToComponent.set(fieldId, component);
          // 同时尝试注册 VXE 实例
          this._tryRegisterVxeInstance(fieldId, component);
          return component;
        }
      }

      return null;
    },
    getVxeComponentById(fieldId, forceRefresh = false) {
      if (!fieldId) return null;

      // 如果不强制刷新且缓存中有，直接返回
      if (!forceRefresh && this._widgetMaps.idToVxeInstance.has(fieldId)) {
        return this._widgetMaps.idToVxeInstance.get(fieldId);
      }

      // 获取 Vue 组件实例
      const component = this.getComponentById(fieldId);
      if (component?.$refs?.fieldEditor) {
        const vxeInstance = component.$refs.fieldEditor;
        this._widgetMaps.idToVxeInstance.set(fieldId, vxeInstance);
        return vxeInstance;
      }

      return null;
    },
    // ==================== 辅助方法 ====================
    _findWidgetInTree(widgetList, targetId) {
      if (!widgetList) return null;

      for (let widget of widgetList) {
        if (widget.id === targetId) {
          return widget;
        }

        // 递归查找容器组件
        let found = null;
        if (widget.type === "grid" && widget.cols) {
          for (let col of widget.cols) {
            found = this._findWidgetInTree(col.widgetList, targetId);
            if (found) return found;
          }
        } else if (widget.type === "table" && widget.rows) {
          for (let row of widget.rows) {
            for (let cell of row.cols) {
              found = this._findWidgetInTree(cell.widgetList, targetId);
              if (found) return found;
            }
          }
        } else if (widget.type === "tab" && widget.tabs) {
          for (let tab of widget.tabs) {
            found = this._findWidgetInTree(tab.widgetList, targetId);
            if (found) return found;
          }
        } else if (widget.widgetList) {
          found = this._findWidgetInTree(widget.widgetList, targetId);
          if (found) return found;
        }
      }

      return null;
    },
    // 批量注册（用于初始化时）
    batchRegisterWidgets(widgetList) {
      const traverse = (widgets) => {
        if (!widgets) return;

        widgets.forEach((widget) => {
          if (widget.id) {
            this.registerWidgetToMaps(widget);
          }

          // 递归处理容器组件
          if (widget.type === "grid" && widget.cols) {
            widget.cols.forEach((col) => traverse(col.widgetList));
          } else if (widget.type === "table" && widget.rows) {
            widget.rows.forEach((row) =>
              row.cols.forEach((cell) => traverse(cell.widgetList))
            );
          } else if (widget.type === "tab" && widget.tabs) {
            widget.tabs.forEach((tab) => traverse(tab.widgetList));
          } else if (widget.widgetList) {
            traverse(widget.widgetList);
          }
        });
      };

      traverse(widgetList);
    },
    // 清理所有映射（重置表单时调用）
    clearAllMaps() {
      this._widgetMaps.idToWidget.clear();
      this._widgetMaps.idToComponent.clear();
      this._widgetMaps.idToVxeInstance.clear();
      this._widgetMaps.nameToId.clear();
    },

    // 调试方法 - 获取映射状态
    getMapsInfo() {
      return {
        widgetCount: this._widgetMaps.idToWidget,
        componentCount: this._widgetMaps.idToComponent,
        vxeInstanceCount: this._widgetMaps.idToVxeInstance,
        nameToIdCount: this._widgetMaps.nameToId,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form :deep(.el-row) {
  padding: 8px;
}
</style>
