import { comUtils } from "@/core/comUtils";
import Message from "../../../../core/Message";

export default {
  data() {
    return {
      comUtils: comUtils(this),
      Message,
      vfEvents: {},
    };
  },

  methods: {
    emit$(eventName, data) {
      if (this.vfEvents[eventName]) {
        this.vfEvents[eventName].forEach((fn) => {
          fn(data);
        });
      }
    },

    on$(eventName, fn) {
      this.vfEvents[eventName] = this.vfEvents[eventName] || [];
      this.vfEvents[eventName].push(fn);
    },

    off$(eventName, fn) {
      if (this.vfEvents[eventName]) {
        if (fn === undefined || fn === null) {
          this.vfEvents[eventName].length = 0;
          return;
        }

        for (let i = 0; i < this.vfEvents[eventName].length; i++) {
          if (this.vfEvents[eventName][i] === fn) {
            this.vfEvents[eventName].splice(i, 1);
            break;
          }
        }
      }
    },

    dispatch: function dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        if (!!parent.emit$) {
          parent.emit$.call(parent, eventName, params);

          if (componentName === "VFormRender") {
            parent.$emit(eventName, ...params); //执行原生$emit，以便可以用@进行声明式事件处理！！
          }
        }
      }
    },

    broadcast: function broadcast(componentName, eventName, params) {
      /* Vue3移除了$children属性，_broadcast方法已不能使用！！ */
      //_broadcast.call(this, componentName, eventName, params);

      if (!!this.widgetRefList) {
        //FormRender只需遍历自身的widgetRefList属性
        Object.keys(this.widgetRefList).forEach((refName) => {
          let cmpName = this.widgetRefList[refName].$options.componentName;
          if (cmpName === componentName) {
            if (refName == "Eam_my_device") {
              console.log("Eam_my_device", refName);
            }
            let foundRef = this.widgetRefList[refName];
            foundRef.emit$.call(foundRef, eventName, params);
          }
        });
      }

      if (!!this.refList) {
        //其他组件遍历inject的refList属性
        Object.keys(this.refList).forEach((refName) => {
          let cmpName = this.refList[refName].$options.componentName;
          if (cmpName === componentName) {
            let foundRef = this.refList[refName];
            foundRef.emit$.call(foundRef, eventName, params);
          }
        });
      }
    },
  },
};
