import { deepClone } from "@/core/utils/tool";
import FormValidators from "@/core/utils/validators";
import request from "@/core/Request";
import Message from "../../../../../Message";
import eventBus from "@/core/utils/event-bus";
import cpkEvent from "../../../../../cpkEvent";
export default {
  inject: [
    "refList",
    "getFormConfig",
    "getGlobalDsv",
    "globalOptionData",
    "globalModel",
    "getOptionData",
    "getFunId",
    "getDataCenter",
    "getPageProvide",
  ],

  data() {
    return {
      showTip: false,
      request,
      Message,
      cpkEvent,
      isMouseInput: false,
    };
  },
  computed: {
    getShowTip() {
      let value = this.fieldModel;
      if (!value) return true;
      if (this.$refs.fieldEditor && this.$refs.fieldEditor.ref) {
        let input = this.$refs.fieldEditor.ref;

        if (input.offsetWidth + 10 < input.scrollWidth) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    formConfig() {
      return this.getFormConfig();
    },
    funId() {
      return this.getFunId();
    },
    dataCenter() {
      return this.getDataCenter();
    },
    pageProvide() {
      return this.getPageProvide();
    },
    widgetSize() {
      return this.field.options.size || "small";
    },
    subFormName() {
      return this.parentWidget ? this.parentWidget.options.name : "";
    },
    subFormItemFlag() {
      return this.parentWidget ? this.parentWidget.type === "sub-form" : false;
    },
    formModel: {
      cache: false,
      get() {
        return this.globalModel.formModel;
      },
    },
    fieldModel: {
      get() {
        if (!this.field) return {};
        // 处理可能的嵌套路径
        const fieldName = this.field.options.name;

        if (fieldName.includes(".")) {
          // 使用辅助方法处理嵌套属性访问
          return this.getValueByPath(this.formModel, fieldName);
        } else {
          return this.formModel[fieldName];
        }
      },
      set(val) {
        const fieldName = this.field.options.name;

        if (fieldName.includes(".")) {
          this.setValueByPath(this.formModel, fieldName, val);
        } else {
          this.formModel[fieldName] = val;
        }

        // 同步更新内部数据
        this.syncUpdateFormModel(val);
      },
    },
  },
  watch: {
    fieldModel() {
      if (this.isMouseInput) {
        this.isShowTip();
      }
    },
  },
  methods: {
    syncUpdateFormModel(value) {
      if (this.designState) return;

      const propName = this.field.options.name;

      if (this.subFormItemFlag) {
        // 处理子表单...
      } else {
        // 处理可能的嵌套路径
        if (propName.includes(".")) {
          this.setValueByPath(this.formModel, propName, value);
        } else {
          this.formModel[propName] = value;
        }
      }
    },
    emitEvent(evtName, evtData) {
      //用于兄弟组件发射事件
      eventBus.$emit(evtName, evtData);
    },

    handleEvent(evtName, callback) {
      //用于兄弟组件接收事件
      eventBus.$on(evtName, (data) => callback(data));
    },
    isShowTip() {
      this.isMouseInput = true;
      if (this.$refs.fieldEditor && this.$refs.fieldEditor.ref) {
        let input = this.$refs.fieldEditor.ref;

        if (input.offsetWidth + 5 < input.scrollWidth) {
          this.showTip = true;
        } else {
          this.showTip = false;
        }
      } else {
        this.showTip = false;
      }
    },
    hideTip() {
      this.isMouseInput = false;

      this.showTip = false;
    },
    //--------------------- 组件内部方法 begin ------------------//
    getPropName() {
      // 正确处理点表示法字段名
      const fieldName = this.field.options.name;

      if (this.subFormItemFlag && !this.designState) {
        return this.subFormName + "." + this.subFormRowIndex + "." + fieldName;
      } else {
        return fieldName;
      }
    },
    // 增加处理嵌套属性的方法
    getValueByPath(obj, path) {
      if (!path || !obj) return undefined;

      const keys = path.split(".");
      return keys.reduce(
        (o, key) => (o && o[key] !== undefined ? o[key] : undefined),
        obj
      );
    },
    setValueByPath(obj, path, value) {
      if (!path || !obj) return;

      const keys = path.split(".");
      const lastKey = keys.pop();
      const target = keys.reduce((o, key) => {
        if (o[key] === undefined) o[key] = {};
        return o[key];
      }, obj);

      target[lastKey] = value;
    },
    initFieldModel() {
      if (!this.field.formItemFlag) return;

      const propName = this.field.options.name;

      if (this.subFormItemFlag && !this.designState) {
        // 处理子表单...
      } else if (propName.includes(".")) {
        // 处理点表示法的嵌套属性
        const value = this.getValueByPath(this.formModel, propName);
        if (value !== undefined) {
          this.fieldModel = deepClone(value);
        } else if (this.field.options.defaultValue !== undefined) {
          this.fieldModel = this.field.options.defaultValue;
          this.setValueByPath(this.formModel, propName, this.fieldModel);
        } else {
          this.fieldModel = null;
          this.setValueByPath(this.formModel, propName, null);
        }
      } else {
        // 原有逻辑处理普通字段
        if (
          !this.formModel.hasOwnProperty(propName) &&
          this.field.options.defaultValue !== undefined
        ) {
          this.fieldModel = this.field.options.defaultValue;
          this.formModel[propName] = this.fieldModel;
        } else if (this.formModel[propName] === undefined) {
          this.formModel[propName] = null;
          this.fieldModel = null;
        } else {
          this.fieldModel = this.formModel[propName];
        }
      }

      this.oldFieldValue = deepClone(this.fieldModel);
    },

    initFileList() {
      //初始化上传组件的已上传文件列表
      if (
        (this.field.type !== "picture-upload" &&
          this.field.type !== "video-upload" &&
          this.field.type !== "audio-upload" &&
          this.field.type !== "file-upload") ||
        this.designState === true
      ) {
        return;
      }

      if (this.fieldModel) {
        if (Array.isArray(this.fieldModel)) {
          this.fileList = deepClone(this.fieldModel);
        } else {
          this.fileList.splice(0, 0, deepClone(this.fieldModel));
        }
      }
    },

    initEventHandler() {
      this.on$("setFormData", (newFormData) => {
        if (!this.subFormItemFlag) {
          this.setValue(newFormData[this.field.options.name]);
        }
      });

      this.on$("field-value-changed", (values) => {
        if (values && values[0] && values[0].value) values[0] = values[0].value;
        if (this.subFormItemFlag) {
          let subFormData = this.formModel[this.subFormName];
          this.handleOnChangeForSubForm(
            values[0],
            values[1],
            subFormData,
            this.subFormRowId
          );
        } else {
          this.handleOnChange(values[0], values[1]);
        }
      });

      this.on$("reloadOptionItems", (widgetNames) => {
        if (
          widgetNames.length === 0 ||
          widgetNames.indexOf(this.field.options.name) > -1
        ) {
          this.initOptionItems(true);
        }
      });
    },

    handleOnCreated() {
      if (this.designState) return;
      try {
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onCreated`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let customFunc = obj[event];
          customFunc.call(this);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    handleOnMounted() {
      if (this.designState) return;
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
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    registerToRefList(oldRefName) {
      if (this.refList !== null && !!this.field.options.name) {
        if (this.subFormItemFlag && !this.designState) {
          //处理子表单元素（且非设计状态）
          if (oldRefName) {
            delete this.refList[oldRefName + "@row" + this.subFormRowId];
          }
          this.refList[
            this.field.options.name + "@row" + this.subFormRowId
          ] = this;
        } else {
          if (oldRefName) {
            delete this.refList[oldRefName];
          }
          this.refList[this.field.options.name] = this;
        }
      }
    },

    unregisterFromRefList() {
      //销毁组件时注销组件ref
      if (this.refList !== null && !!this.field.options.name) {
        let oldRefName = this.field.options.name;
        if (this.subFormItemFlag && !this.designState) {
          //处理子表单元素（且非设计状态）
          delete this.refList[oldRefName + "@row" + this.subFormRowId];
        } else {
          delete this.refList[oldRefName];
        }
      }
    },

    initOptionItems(keepSelected) {
      if (this.designState) {
        return;
      }

      if (
        this.field.type === "radio" ||
        this.field.type === "checkbox" ||
        this.field.type === "select" ||
        this.field.type === "cascader"
      ) {
        /* 异步更新option-data之后globalOptionData不能获取到最新值，改用provide的getOptionData()方法 */
        const newOptionItems = this.getOptionData();
        if (
          !!newOptionItems &&
          newOptionItems.hasOwnProperty(this.field.options.name)
        ) {
          if (keepSelected) {
            this.reloadOptions(newOptionItems[this.field.options.name]);
          } else {
            this.loadOptions(newOptionItems[this.field.options.name]);
          }
        }
      }
    },

    refreshDefaultValue() {
      if (
        this.designState === true &&
        this.field.options.defaultValue !== undefined
      ) {
        this.fieldModel = this.field.options.defaultValue;
      }
    },

    clearFieldRules() {
      if (!this.field.formItemFlag) {
        return;
      }

      this.rules.splice(0, this.rules.length); //清空已有
    },

    buildFieldRules() {
      if (!this.field.formItemFlag && this.field.options.hidden) {
        return;
      }

      if (this.rules) {
        this.rules.splice(0, this.rules.length); //清空已有
      }

      if (this.field.options.required) {
        // this.rules.push({
        //   required: true,
        //   //trigger: ['blur', 'change'],
        //   trigger: ['blur'] /* 去掉change事件触发校验，change事件触发时formModel数据尚未更新，导致radio/checkbox必填校验出错！！ */,
        //   message: this.field.options.requiredHint || this.i18nt('render.hint.fieldRequired')
        // })
      }
      if (this.designState) return;

      if (this.field.options.validation) {
        let vldName = this.field.options.validation;
        if (FormValidators[vldName]) {
          this.rules.push({
            validator: FormValidators[vldName],
            trigger: ["blur", "change"],
            label: this.field.options.label,
            errorMsg: this.field.options.validationHint,
          });
        } else {
          this.rules.push({
            validator: FormValidators["regExp"],
            trigger: ["blur", "change"],
            regExp: vldName,
            label: this.field.options.label,
            errorMsg: this.field.options.validationHint,
          });
        }
      }
      try {
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onValidate`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let customFn = (rule, value, callback) => {
            let tmpFunc = obj[event];
            return tmpFunc.call(this, rule, value, callback);
          };
          this.rules.push({
            validator: customFn,
            trigger: ["blur", "change"],
            label: this.field.options.label,
          });
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    /**
     * 禁用字段值变动触发表单校验
     */
    disableChangeValidate() {
      if (!this.rules) {
        return;
      }

      this.rules.forEach((rule) => {
        if (rule.trigger) {
          rule.trigger.splice(0, rule.trigger.length);
        }
      });
    },

    /**
     * 启用字段值变动触发表单校验
     */
    enableChangeValidate() {
      if (!this.rules) {
        return;
      }

      this.rules.forEach((rule) => {
        if (rule.trigger) {
          rule.trigger.push("blur");
          rule.trigger.push("change");
        }
      });
    },

    disableOptionOfList(optionList, optionValue) {
      if (!!optionList && optionList.length > 0) {
        optionList.forEach((opt) => {
          if (opt.value === optionValue) {
            opt.disabled = true;
          }
        });
      }
    },

    enableOptionOfList(optionList, optionValue) {
      if (!!optionList && optionList.length > 0) {
        optionList.forEach((opt) => {
          if (opt.value === optionValue) {
            opt.disabled = false;
          }
        });
      }
    },

    //--------------------- 组件内部方法 end ------------------//

    //--------------------- 事件处理 begin ------------------//

    emitFieldDataChange(newValue, oldValue) {
      if (newValue && newValue.value) {
        newValue = newValue.value;
      }
      // 触发自定义事件
      this.emit$("field-value-changed", [newValue, oldValue]);

      /* 必须用dispatch向指定父组件派发消息！！ */
      this.dispatch("VFormRender", "fieldChange", [
        this.field.options.name,
        newValue,
        oldValue,
        this.subFormName,
        this.subFormRowIndex,
      ]);
    },

    emitDelFile(id) {
      this.dispatch("VFormRender", "delFile", [id]);
    },

    syncUpdateFormModel(value) {
      if (this.designState) {
        return;
      }

      if (this.subFormItemFlag) {
        let subFormData = this.formModel[this.subFormName] || [{}];
        let subFormDataRow = subFormData[this.subFormRowIndex];
        if (subFormDataRow) {
          // 重置表单后subFormDataRow为undefined，应跳过！！
          subFormDataRow[this.field.options.name] = value;
        }
      } else {
        this.formModel[this.field.options.name] = value;
      }
    },

    handleChangeEvent(value) {
      if (value === null) value = "";
      if (value.value) value = value.value;
      this.syncUpdateFormModel(value);
      this.emitFieldDataChange(value, this.oldFieldValue);

      //number组件一般不会触发focus事件，故此处需要手工赋值oldFieldValue！！
      this.oldFieldValue = deepClone(
        value
      ); /* oldFieldValue需要在initFieldModel()方法中赋初值!! */

      /* 主动触发表单的单个字段校验，用于清除字段可能存在的校验错误提示 */
      this.dispatch("VFormRender", "fieldValidation", [this.getPropName()]);
    },

    handleFocusCustomEvent(event) {
      this.oldFieldValue = deepClone(this.fieldModel); //保存修改change之前的值
      if (this.designState) return;
      try {
        let events =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onFocus`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && events && obj[events]) {
          let customFn = obj[events];
          customFn.call(this, event);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    handleBlurCustomEvent(event) {
      if (this.designState) return;
      try {
        let events =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onBlur`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && events && obj[events]) {
          let customFn = obj[events];
          customFn.call(this, event);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    handleInputCustomEvent(value) {
      this.syncUpdateFormModel(value);
      try {
        let events =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onInput`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        /* 主动触发表单的单个字段校验，用于清除字段可能存在的校验错误提示 */
        this.dispatch("VFormRender", "fieldValidation", [this.getPropName()]);

        if (obj && events && obj[events]) {
          let customFn = obj[events];
          customFn.call(this, value);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    emitAppendButtonClick() {
      if (this.designState) {
        //设计状态不触发点击事件
        return;
      }
      try {
        let events =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onAppendButtonClick`]) ||
          "";
        let obj = this.formConfig?.globalObject;

        if (obj && events && obj[events]) {
          let customFn = obj[events];
          customFn.call(this);
        } else {
          /* 必须调用mixins中的dispatch方法逐级向父组件发送消息！！ */
          this.dispatch("VFormRender", "appendButtonClick", [this]);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    selectWinClick() {
      if (this.field.options.readonly !== true) {
        // 可编辑选择窗口，点输入框不打开弹窗
        return;
      }
      this.formSelectWindow();
    },

    formSelectWindow() {
      if (this.designState) {
        //设计状态不触发点击事件
        return;
      }

      this.dispatch("VFormRender", "formSelectWindow", [this]);
    },

    clearSelect() {
      if (this.designState) {
        //设计状态不触发点击事件
        return;
      }

      this.dispatch("VFormRender", "clearSelect", [this]);
    },

    handleOnChange(val, oldVal) {
      //自定义onChange事件
      if (this.designState) return;
      try {
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onChange`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let changeFn = obj[event];
          changeFn.call(this, val, oldVal);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    handleOnChangeForSubForm(val, oldVal, subFormData, rowId) {
      //子表单自定义onChange事件
      if (this.designState) return;
      try {
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onChange`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let changeFn = obj[event];
          changeFn.call(this, val, oldVal, subFormData, rowId);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    handleButtonWidgetClick() {
      if (this.designState) {
        //设计状态不触发点击事件
        return;
      }

      try {
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onClick`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let changeFn = obj[event];
          changeFn.call(this);
        } else {
          this.dispatch("VFormRender", "buttonClick", [this]);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    remoteQuery(keyword) {
      if (this.designState) return;
      try {
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onRemoteQuery`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let remoteFn = obj[event];
          remoteFn.call(this, keyword);
        }
      } catch (error) {
        this.$message.error("请检查全局函数的调用");
        console.error("请检查全局函数的调用");
      }
    },

    //--------------------- 事件处理 end ------------------//

    //--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
    /* 提示：用户可自行扩充这些方法！！！ */

    getFormRef() {
      /* 获取VFrom引用，必须在VForm组件created之后方可调用 */
      return this.refList["v_form_ref"];
    },

    getWidgetRef(widgetName, showError) {
      let foundRef = this.refList[widgetName];
      if (!foundRef && !!showError) {
        this.$message.error(this.i18nt("render.hint.refNotFound") + widgetName);
      }
      return foundRef;
    },

    getFieldEditor() {
      //获取内置的el表单组件
      return this.$refs["fieldEditor"];
    },

    /*
      注意：VFormRender的setFormData方法不会触发子表单内field-widget的setValue方法，
      因为setFormData方法调用后，子表单内所有field-widget组件已被清空，接收不到setFormData事件！！
    * */
    setValue(newValue) {
      /* if ((this.field.type === 'picture-upload') || (this.field.type === 'file-upload')) {
        this.fileList = newValue
      } else */ if (
        this.field.formItemFlag
      ) {
        let oldValue = deepClone(this.fieldModel);
        this.fieldModel = newValue;

        // 时间范围、日期范围需要转化为数组
        if (
          this.field.type == "select" &&
          this.field.options.multiple &&
          typeof this.fieldModel == "string"
        ) {
          this.fieldModel = this.fieldModel ? this.fieldModel.split(";") : [];
        }

        // 多选下拉需要转化为数组
        if (
          (this.field.type == "time-range" ||
            this.field.type == "date-range") &&
          typeof this.fieldModel == "string" &&
          this.fieldModel.indexOf(";") > -1
        ) {
          this.fieldModel = this.fieldModel ? this.fieldModel.split(";") : [];
        }

        // switch需要转化为字符创
        if (this.field.type == "switch") {
          if (!this.fieldModel) {
            // 没有默认值则赋0
            this.fieldModel = "0";
          } else {
            this.fieldModel = this.fieldModel + "";
          }
        }
        this.initFileList();

        this.syncUpdateFormModel(newValue);
        this.emitFieldDataChange(newValue, oldValue);
      }
    },

    getValue() {
      /* if ((this.field.type === 'picture-upload') || (this.field.type === 'file-upload')) {
        return this.fileList
      } else */ {
        return this.fieldModel;
      }
    },

    resetField() {
      let defaultValue = this.field.options.defaultValue;
      this.setValue(defaultValue);
      this.$nextTick(() => {
        //
      });

      //清空上传组件文件列表
      if (
        this.field.type === "picture-upload" ||
        this.field.type === "video-upload" ||
        this.field.type === "audio-upload" ||
        this.field.type === "file-upload"
      ) {
        this.$refs["fieldEditor"].clearFiles();
        this.fileList.splice(0, this.fileList.length);
      }
    },

    setWidgetOption(optionName, optionValue) {
      //通用组件选项修改API
      if (this.field.options.hasOwnProperty(optionName)) {
        this.field.options[optionName] = optionValue;
        //TODO: 是否重新构建组件？？有些属性修改后必须重新构建组件才能生效，比如字段校验规则。
      }
    },

    setReadonly(flag) {
      this.field.options.readonly = flag;
    },

    setDisabled(flag) {
      this.field.options.disabled = flag;
    },

    setAppendButtonVisible(flag) {
      this.field.options.appendButton = flag;
    },

    setAppendButtonDisabled(flag) {
      this.field.options.appendButtonDisabled = flag;
    },

    setHidden(flag) {
      this.field.options.hidden = flag;

      if (flag) {
        //清除组件校验规则
        this.clearFieldRules();
      } else {
        //重建组件校验规则
        this.buildFieldRules();
      }
    },

    setRequired(flag) {
      this.field.options.required = flag;
      this.buildFieldRules();
    },

    setLabel(newLabel) {
      this.field.options.label = newLabel;
    },

    focus() {
      if (!!this.getFieldEditor() && !!this.getFieldEditor().focus) {
        this.getFieldEditor().focus();
      }
    },

    clearSelectedOptions() {
      //清空已选选项
      if (
        this.field.type !== "checkbox" &&
        this.field.type !== "radio" &&
        this.field.type !== "select"
      ) {
        return;
      }

      if (
        this.field.type === "checkbox" ||
        (this.field.type === "select" && this.field.options.multiple)
      ) {
        this.fieldModel = [];
      } else {
        this.fieldModel = "";
      }
    },

    /**
     * 加载选项，并清空字段值
     * @param options
     */
    loadOptions(options) {
      this.field.options.optionItems = deepClone(options);
      //this.clearSelectedOptions()  //清空已选选项
    },

    /**
     * 重新加载选项，不清空字段值
     * @param options
     */
    reloadOptions(options) {
      this.field.options.optionItems = deepClone(options);
    },

    disableOption(optionValue) {
      this.disableOptionOfList(this.field.options.optionItems, optionValue);
    },

    enableOption(optionValue) {
      this.enableOptionOfList(this.field.options.optionItems, optionValue);
    },

    /**
     * 返回选择项
     * @returns {*}
     */
    getOptionItems() {
      return this.field.options.optionItems;
    },

    setUploadHeader(name, value) {
      this.uploadHeaders[name] = value;
    },

    setUploadData(name, value) {
      this.uploadData[name] = value;
    },

    setToolbar(customToolbar) {
      this.customToolbar = customToolbar;
    },

    /**
     * 是否子表单内嵌的组件
     * @returns {boolean}
     */
    isSubFormItem() {
      return this.parentWidget ? this.parentWidget.type === "sub-form" : false;
    },

    /**
     * 动态增加自定义CSS类
     * @param className
     */
    addCssClass(className) {
      if (!this.field.options.customClass) {
        this.field.options.customClass = [className];
      } else {
        this.field.options.customClass.push(className);
      }
    },

    /**
     * 动态移除自定义CSS类
     * @param className
     */
    removeCssClass(className) {
      if (!this.field.options.customClass) {
        return;
      }

      let foundIdx = -1;
      this.field.options.customClass.map((cc, idx) => {
        if (cc === className) {
          foundIdx = idx;
        }
      });
      if (foundIdx > -1) {
        this.field.options.customClass.splice(foundIdx, 1);
      }
    },
    async execRequest(key, requestParam) {
      if (this.designer) return;
      let url =
        this.getGlobalDsv()?.param?.env == "preview"
          ? `/design/data/service/preview/${key}`
          : `/event/exec/${key}`;
      return await this.request.postData(url, requestParam);
    },
    //--------------------- 以上为组件支持外部调用的API方法 end ------------------//
  },
};
