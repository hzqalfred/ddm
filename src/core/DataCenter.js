import { deepClone } from "@/core/utils/tool";

import { usePrivate } from "@/core/pinia/modules/private";
// import request from "./Request";

export class DataCenter {
  constructor(id, options = {}) {
    this.funId = id;
    this.mainForm = null;
    this.childForms = new Map(); // 子表单实例
    this.data = {}; // 主数据存储
    this.eventHandlers = {}; // 事件处理器
    this.options = {
      ...options,
    };
  }

  encode(val) {
    const { aesEncode } = usePrivate();
    return aesEncode(val);
  }

  getkey(cb){
    const { getKey } = usePrivate();
    getKey(cb)
  }

  registerMainForm(formRef) {
    this.mainForm = formRef; // 注册主表单
  }

  // 注册子表单
  linkChildForm({ code, formRef }) {
    this.childForms.set(code, formRef);
  }

  // 获取主表字段的兼容方法
  getMainFormFields() {
    if (!this.mainForm) return [];

    // 从 widgetList 获取所有字段，包括容器内的字段
    if (this.mainForm.formJsonObj && this.mainForm.formJsonObj.widgetList) {
      const allFields = [];
      const collectFields = (widgets) => {
        widgets.forEach((widget) => {
          // 普通字段
          if (widget.formItemFlag) {
            allFields.push(widget.options?.name);
          }

          // 容器字段
          if (widget.category === "container") {
            // 处理 grid
            if (widget.cols) {
              widget.cols.forEach((col) => {
                if (col.widgetList) collectFields(col.widgetList);
              });
            }

            // 处理 dialog
            if (widget.widgetList) {
              collectFields(widget.widgetList);
            }
          }
        });
      };

      collectFields(this.mainForm.formJsonObj.widgetList);
      return allFields.filter(Boolean);
    }

    // 原有逻辑保留作为备选
    if (Array.isArray(this.mainForm.widgetList)) {
      return this.mainForm.widgetList
        .filter((w) => w.type !== "subgrid")
        .map((w) => w.options?.name);
    }

    return [];
  }

  // 设置数据（支持部分更新）
  setData(data, options = {}) {
    // const { merge = false, strictMatch = false } = options;
    const { merge = false } = options;
    let mainData = data;

    // if (strictMatch) {
    //   mainData = this.strictMatchFields(data);
    // } else {
    //   // 处理嵌套结构，将其扁平化以匹配表单字段
    //   mainData = this.flattenNestedStructure(data);
    // }

    // 更新内部数据
    if (merge) {
      this.data = { ...this.data, ...mainData };
    } else {
      this.data = mainData;
    }

    for (const key of Object.keys(this.data)) {
      const [rootKey] = key.split(".");
      for (const child of this.childForms) {
        if (typeof child === "object" && child !== null) {
          const [mapKey, mapForm] = child;
          if (mapKey == key || mapKey == rootKey) {
            mapForm.setFormData(this.data[key]);
          }
        }
      }
    }

    if (this.mainForm && typeof this.mainForm.setFormData === "function") {
      try {
        // 确保传递的是已扁平化的数据结构
        this.mainForm.setFormData(this.data);
        return true;
      } catch (error) {
        this.error("设置表单数据失败:", error);
        return false;
      }
    }

    return false;
  }
  // 将嵌套结构扁平化以匹配点表示法字段
  flattenNestedStructure(data) {
    if (!data) return {};

    const result = { ...data }; // 保留原始顶级属性
    const fieldPaths = this.getMainFormFields();

    // 处理可能的嵌套路径
    fieldPaths.forEach((path) => {
      if (path.includes(".")) {
        const pathParts = path.split(".");
        const rootProp = pathParts[0];

        // 如果顶级对象存在且是对象
        if (data[rootProp] && typeof data[rootProp] === "object") {
          // 尝试从嵌套对象获取值并设置扁平字段
          const nestedValue = this.getValueByPath(data, path);
          if (nestedValue !== undefined) {
            result[path] = nestedValue;
          }
        }
      }
    });

    return result;
  }
  // 获取数据
  getData(path = "") {
    // 路径查询保持原有逻辑
    if (path) {
      return this.getValueByPath(this.data, path);
    }

    // 构建复合数据
    const result = deepClone(this.data);

    // 合并子表单数据
    let childForms = Array.from(this.childForms.entries());
    if (childForms.length) {
      for (const [code, form] of childForms) {
        let data = form.getFormData(false);
        result[code] = data;
      }
      return result;
    } else {
      let data = this.mainForm.getFormData(false);
      this.data = data;
    }

    return deepClone(this.data);
  }
  // 重新初始化数据中心
  reinitialize() {
    // 清空主数据
    this.data = {};

    // 清理子表单资源
    this.childForms.clear();

    // 重置事件系统
    this.eventHandlers = {};

    // 保留基础配置
    this.options = {
      ...deepClone(this.options), // 深拷贝原始配置
    };
  } // 重置表单数据
  resetData(options = { hardReset: false }) {
    if (options.hardReset) {
      // 硬重置：完全重新初始化
      this.reinitialize();
      return;
    }

    // 软重置：保留结构只清数据
    this.data = {};
    this.childForms.forEach((form) => form.resetForm());
  }
  // 辅助方法：根据路径获取值
  getValueByPath(obj, path) {
    if (!obj || !path) return undefined;

    const keys = path.split(".");
    return keys.reduce(
      (o, key) => (o && o[key] !== undefined ? o[key] : undefined),
      obj
    );
  }
  // 注册事件监听
  subscribe(eventName, handler) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    const handlerString = handler.toString();
    const existingHandler = this.eventHandlers[eventName].find(
      (h) => h.toString() === handlerString
    );
    if (existingHandler) {
      return () => this.unsubscribe(eventName, existingHandler);
    }
    this.eventHandlers[eventName].push(handler);

    // 返回取消订阅的函数
    return () => this.unsubscribe(eventName, handler);
  }

  // 取消事件监听
  unsubscribe(eventName, handler) {
    if (this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = this.eventHandlers[eventName].filter(
        (h) => h !== handler
      );
    }
  }

  // 触发事件
  postEvent(eventName, eventData) {
    if (this.eventHandlers[eventName]) {
      this.eventHandlers[eventName].forEach((handler) => {
        try {
          handler(eventData);
        } catch (error) {
          console.error(`Error in ${eventName} event handler:`, error);
        }
      });
    }
  }
}
