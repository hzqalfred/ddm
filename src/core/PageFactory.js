import { reactive } from "vue";
import { createRequest } from "./Request";
import auth from './AuthManage'
import router from '@/core/components/WebHash/router'
// PageFactory 构造函数
function PageFactory() {
  // 页面数据、页面代码、事件、主框架提供者等属性
  this._ref = null;
  this._pageData = [];
  this._pageCode = null;
  this._events = {};
  this._homeProvide = {};
  this._pinaStores = {};
  this.auth = auth
  this.router = router

  this.nodeCache = new Map(); // 添加节点缓存
  this.axios = createRequest({ baseURL: "" });
  // 布局配置（03.04）
  this._layoutConfig = null;

  this._id = {}
  // 定义参数和生命周期钩子的内部存储
  this._cbFuncParam = {};
  this._lifeCircle = {};

  // HomePage存储 窗口
  this._windowsController = new Map();

  //只有顶层工厂拥有
  this.setPage = (id, pageFactory) => {
    if (this._pageCode === "main" || this._pageCode === "setting") {
      this._windowsController.set(id, pageFactory);
    } else {
      console.warn(
        `无法调用 setPage 方法，当前 _pageCode 为 ${this._pageCode}，只有 main 或 setting 环境可用`
      );
    }
  };

  this.getPage = (id) => {
    if (this._pageCode === "main" || this._pageCode === "setting") {
      return this._windowsController.get(id);
    } else {
      console.warn(
        `无法调用 getPage 方法，当前 _pageCode 为 ${this._pageCode}，只有 main 或 setting 环境可用`
      );
      return null;
    }
  };

  // 使用 getter 和 setter 实现直接赋值
  Object.defineProperties(this, {
    params: {
      get: function() {
        return this._cbFuncParam;
      },
      set: function(newParams) {
        if (typeof newParams === "object") {
          this._cbFuncParam = newParams;
        }
      },
      enumerable: true,
      configurable: true,
    },

    lifeCircle: {
      get: function() {
        return this._lifeCircle;
      },
      set: function(newLifeCircle) {
        console.log(newLifeCircle);
        if (typeof newLifeCircle === "object") {
          // 清除现有生命周期事件
          this._clearLifecycleEvents();

          // 设置新的生命周期对象
          this._lifeCircle = newLifeCircle;

          // 将生命周期钩子转换为事件
          this._applyLifecycleToEvents();
        }
      },
      enumerable: true,
    },
  });

  this._clearLifecycleEvents = function() {
    const lifecycleEvents = [
      "created",
      "open",
      "beforeInit",
      "inited",
      "activate",
      "beforeClose",
      "closed",
    ];

    lifecycleEvents.forEach((event) => {
      delete this._events[event];
    });
  };

  // 将生命周期钩子应用到事件系统
  this._applyLifecycleToEvents = function() {
    const mapping = {
      created: "created",
      open: "open",
      beforeInit: "beforeInit",
      inited: "inited",
      activate: "activate",
      beforeClose: "beforeClose",
      closed: "closed",
    };

    for (const [hookName, eventName] of Object.entries(mapping)) {
      if (
        this._lifeCircle[hookName] &&
        typeof this._lifeCircle[hookName] === "function"
      ) {
        this._events[eventName] = this._lifeCircle[hookName];
      }
    }
  };

  // 初始化页面服务
  this.init = async (initData = {}) => {
    let { _pageCode = "main", data,id='' } = initData;
    this._pageCode = _pageCode;
    this._id = id
    this._events = {}; // 清空事件
    if (data && data.origin) {
      // 主要处理窗口
      this._pageData = {
        data: [
          Object.assign({}, data, { ele: data.code }, { type: "control" }),
        ],
      };
      this._events = {};
    } else if (data instanceof Array) {
      let menu = {
        id: "menulist",
        type: "root",
        data,
      };
      this._pageData = menu;
    } else {
      this._pageData = await this.loadPageData();
      this._events = await this.loadPageEvent();
    }

    // 动态导入 pinia 目录下的所有模块
    const storeModules = import.meta.glob("@/core/pinia/modules/*.js");

    // 遍历所有模块并导入
    const storeNames = Object.keys(storeModules);
    for (let storeName of storeNames) {
      const storeModule = await storeModules[storeName]();
      const store = storeModule[Object.keys(storeModule)[0]]; // 获取模块中定义的 store
      // 将每个 store 实例挂载到 _pinaStores 对象中
      this._pinaStores[store.$id] = store();
    }
  };
  // 获取布局配置
  this.getLayoutConfig = () => this._layoutConfig;
  // 获取页面上下文
  this.getContext = () => this._context;
  // 获取主框架Provide
  this.getHomeProvide = () => this._homeProvide;
  // 获取页面实例
  this.getElement = () => this._ref;

  // 设置布局配置
  this.setLayoutConfig = (config) => {
    this._layoutConfig = config;
  };
  // 设置页面上下文
  this.setContext = (_context) => {
    this._context = Object.assign({}, this._context, _context);
  };
  // 设置主框架上下文
  this.setHomeProvide = (_provide) => {
    this._homeProvide = _provide;
  };
  // 设置页面实例
  this.setElement = (ref) => {
    this._ref = ref;
  };
  // 确保窗口在正确的区域添加，并处理可见性
  this.create = async ({ data }) => {
    if (this._pageCode !== "main" && this._pageCode !== "setting") {
      console.warn("需在homepage进行创建");
      return;
    }

    // 查找任务栏，如果找不到则尝试创建
    let taskbar = this.findNodeByID("lheader_row_taskbar");

    if (!taskbar) {
      console.warn("找不到任务栏，尝试创建");
      // 尝试找到内容区域
      const contentNode =
        this.findNodeByID("lcontent") || this.findNodeByID("content-layout");

      if (contentNode && contentNode.data && Array.isArray(contentNode.data)) {
        // 创建新的任务栏
        taskbar = {
          type: "control",
          ele: "taskbar",
          id: "lheader_row_taskbar",
          data: [],
        };

        // 添加到内容区域
        contentNode.data.unshift(taskbar);
        console.log("已创建任务栏");

        // 重新获取任务栏引用
        taskbar = this.findNodeByID("lheader_row_taskbar");
      }
    }

    // 检查任务栏是否有效
    if (!taskbar || !taskbar.data || !Array.isArray(taskbar.data)) {
      console.error("任务栏不可用，无法添加窗口");
      return;
    }

    // 检查窗口是否已存在于任务栏
    let existTaskBar = taskbar.data.find(
      (item) => "bar$_" + data.id === item.id
    );

    // 将所有任务栏项设为非活动状态
    taskbar.data.forEach((item) => {
      item.type = "primary";
    });

    // 获取lmain容器
    const lmainNode = this.findNodeByID("lmain");
    if (!lmainNode || !lmainNode.data || !Array.isArray(lmainNode.data)) {
      console.error("找不到lmain内容区域，无法添加窗口");
      return;
    }

    // 检查窗口是否已存在于lmain数据中
    const existingWindow = lmainNode.data.find(
      (item) => item.id === data.id && item.ele === "window"
    );

    if (existTaskBar && existingWindow) {
      // 窗口已存在，激活窗口
      existTaskBar.type = "success";

      // 在默认布局模式下，隐藏其他窗口，只显示当前窗口
      if (
        this.getLayoutConfig() &&
        this.getLayoutConfig().layoutMode !== "wins"
      ) {
        lmainNode.data.forEach((item) => {
          if (item.ele === "window") {
            item.visible = item.id === data.id;
          }
        });
      }

      // 确保当前窗口可见
      existingWindow.visible = true;
      return; // 已有窗口，不需要再添加
    }

    // 添加新的任务栏项
    taskbar.data.push({
      type: "success",
      id: "bar$_" + data.id,
      click: "btnTaskBar_Click",
      value: data.title,
    });

    // 在默认布局模式下，添加新窗口前隐藏其他窗口
    if (
      this.getLayoutConfig() &&
      this.getLayoutConfig().layoutMode !== "wins"
    ) {
      lmainNode.data.forEach((item) => {
        if (item.ele === "window") {
          item.visible = false;
        }
      });
    }

    // 设置新窗口可见
    data.visible = true;

    // 添加窗口到lmain区域
    lmainNode.data.push(data);

    // 备用：清理content-layout中可能存在的相同窗口
    const contentLayoutNode = this.findNodeByID("content-layout");
    if (
      contentLayoutNode &&
      contentLayoutNode.data &&
      Array.isArray(contentLayoutNode.data)
    ) {
      // 查找并移除content-layout中的相同ID窗口
      const windowIndex = contentLayoutNode.data.findIndex(
        (item) => item.id === data.id && item.ele === "window"
      );
      if (windowIndex !== -1) {
        console.log(`从content-layout中移除窗口 ${data.id}`);
        contentLayoutNode.data.splice(windowIndex, 1);
      }
    }
  };

  // 从服务中加载页面数据
  this.loadPageData = async () => {
    try {
      const response = await this.axios.fetchData(
        `pages/${this._pageCode}.json`
      );
      return response;
    } catch (error) {
      throw new Error("页面数据加载失败，请检查服务是否正常。");
    }
  };

  // 从服务中加载页面事件脚本
  this.loadPageEvent = async () => {
    try {
      const response = await this.axios.fetchData(`pages/${this._pageCode}.js`);
      const script = new Function(`return ${response}`).call(this) || {};
      const RemoteObject = this.WebEvent(script);
      return new RemoteObject();
    } catch (error) {
      throw new Error("页面事件加载失败，请检查服务是否正常。");
    }
  };

  // 动态加载方法所需的类复制入口
  this.WebEvent = (script) => this.extend(Object, script);

  // 获取页面数据
  this.getPageData = () => {
    if (!this._pageData.data) return [];
    return isProxy(this._pageData.data)
      ? this._pageData.data
      : reactive(this._pageData.data);
  };

  // 触发绑定事件
  this.fireEvent = ({ eventName, args, target }) => {
    if (!eventName) {
      console.warn("未绑定事件!");
      return;
    }

    if (target) {
      let targetPage = this._homeProvide.getPage(target);
      if (!targetPage) {
        console.warn("未找到对应目标页面");
        return;
      }
      targetPage.fireEvent({ eventName, args });
      return;
    }
    if (!this._events[eventName]) {
      console.warn("未找到事件![" + eventName + "]");
      return;
    }
    if (Array.isArray(this._events[eventName])) {
      this._events[eventName].map((fnc) => {
        fnc(args);
      });
    } else {
      this._events[eventName](args);
    }
  };

  // 添加事件监听
  this.addlistenerEvent = function(eventName, handler) {
    if (typeof handler !== "function") {
      console.warn("事件处理器必须是函数");
      return this;
    }

    if (!this._events[eventName]) {
      this._events[eventName] = handler;
    } else if (Array.isArray(this._events[eventName])) {
      this._events[eventName].push(handler);
    } else {
      this._events[eventName] = [this._events[eventName], handler];
    }
    return this;
  };

  // 覆盖事件监听
  this.overlistenerEvent = function(eventName, handler) {
    if (typeof handler !== "function") {
      console.warn("事件处理器必须是函数");
      return this;
    }
    this._events[eventName] = handler;
    return this;
  };

  // 合并事件监听
  this.mergeEvents = function(events) {
    this._events = Object.assign({}, this._events, events);
    return this._events;
  };

  // 动态调用模块的方法并支持回调
  this.callStoreMethod = (
    storeName,
    methodName,
    args = [],
    callback = null
  ) => {
    const store = this._pinaStores[storeName];
    if (store && typeof store[methodName] === "function") {
      store[methodName](...args); // 调用 store 中的方法

      // 如果提供了回调，执行回调
      if (callback && typeof callback === "function") {
        callback(store);
      }
    } else {
      console.warn(`Store 或方法不存在: ${storeName}.${methodName}`);
    }
  };

  this.getStoreState = (storeName) => {
    const store = this._pinaStores[storeName];
    if (store) {
      return store.$state; // 返回 store 的 state 对象
    } else {
      console.warn(`Store 不存在: ${storeName}`);
      return null;
    }
  };

  // 根据ID查找节点
  this.findNodeByID = (nodeID) => {
    // 检查缓存
    if (this.nodeCache.has(nodeID)) {
      return this.nodeCache.get(nodeID);
    }

    // 没有缓存则查找
    let node = this.findPathByLeafId(nodeID, this._pageData.data);

    // 缓存结果
    if (node) {
      this.nodeCache.set(nodeID, reactive(node));
      return this.nodeCache.get(nodeID);
    }

    return null;
  };

  // 根据叶子ID查找路径
  this.findPathByLeafId = (leafId, nodes) => {
    if (!nodes || !Array.isArray(nodes)) {
      return null;
    }

    // 使用迭代而非递归
    const stack = [...nodes];
    const visited = new Set(); // 防止循环引用导致无限循环

    while (stack.length > 0) {
      const node = stack.pop();

      // 跳过null或已访问节点
      if (!node || visited.has(node)) {
        continue;
      }

      visited.add(node);

      // 找到目标节点
      if (leafId === node.id) {
        return node;
      }

      // 如果节点有子节点，加入栈中
      if (node.data && Array.isArray(node.data)) {
        // 逆序加入栈中，保持遍历顺序
        for (let i = node.data.length - 1; i >= 0; i--) {
          stack.push(node.data[i]);
        }
      }
    }

    return null;
  };
  // 清除节点缓存
  this.clearNodeCache = () => {
    this.nodeCache.clear();
  };
  // 在状态可能变化的场景中调用此方法
  this.invalidateNodeCache = (nodeId = null) => {
    if (nodeId) {
      this.nodeCache.delete(nodeId);
    } else {
      this.nodeCache.clear();
    }
  };
  // extend方法用于继承
  this.extend = (function() {
    var io = function(o) {
      for (var m in o) {
        this[m] = o[m];
      }
    };

    var oc = Object.prototype.constructor;
    return function(sb, sp, overrides) {
      if (typeof sp === "object" && sp !== null) {
        overrides = sp;
        sp = sb;
        sb =
          overrides.constructor != oc
            ? overrides.constructor
            : function() {
                sp.apply(this, arguments);
              };
      }

      var F = function() {};
      var sbp,
        spp = sp.prototype;
      if (!spp) {
        throw new Error(
          "传入的 sp 参数没有 prototype 属性，请检查参数是否正确。"
        );
      }
      F.prototype = spp;
      sbp = sb.prototype = new F();
      sbp.constructor = sb;
      sb.superclass = spp;
      sbp.superclass = sbp.supr = function() {
        return spp;
      };
      sbp.override = io;
      this.override(sb, overrides);
      sb.extend = function(o) {
        this.extend(sb, o);
      };
      return sb;
    };
  })();

  // 覆盖方法
  this.override = function(origclass, overrides) {
    if (overrides) {
      var p = origclass.prototype;
      this.apply(p, overrides);
      if (overrides.toString != origclass.toString) {
        p.toString = overrides.toString;
      }
    }
  };

  // 应用方法
  this.apply = (target, source) => {
    if (target && source && typeof source === "object") {
      for (const key in source) {
        if (source[key] && typeof source[key] === "object") {
          target[key] = Array.isArray(source[key])
            ? [...source[key]]
            : { ...source[key] };
        } else {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
}
function isProxy(obj) {
  try {
    // Proxy 对象的原型是 Object.prototype，所以可以通过判断对象是否是 Proxy 特有的行为
    return (
      typeof obj === "object" &&
      obj !== null &&
      Object.getPrototypeOf(obj) === Proxy.prototype
    );
  } catch (e) {
    return false;
  }
}
// 返回构造函数
export default PageFactory;
