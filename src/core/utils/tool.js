/**
 * 递归查找JSON对象中指定属性为指定值的所有元素
 * @param {Object|Array} obj - 要搜索的对象或数组
 * @param {string} propName - 要搜索的属性名
 * @param {any} propValue - 要搜索的属性值
 * @return {Array} - 找到的所有匹配元素数组
 */
export function findElementsByProp(obj, propName, propValue) {
  // 结果数组
  const result = [];

  // 递归搜索函数
  function search(currentObj) {
    // 如果当前对象是null或undefined，直接返回
    if (currentObj === null || currentObj === undefined) {
      return;
    }

    // 如果是数组，递归搜索每个元素
    if (Array.isArray(currentObj)) {
      currentObj.forEach((item) => search(item));
      return;
    }

    // 如果是对象
    if (typeof currentObj === "object") {
      // 检查当前对象是否有指定属性且值匹配
      if (currentObj[propName] === propValue) {
        result.push(currentObj);
      }

      // 递归搜索对象的所有属性
      for (const key in currentObj) {
        if (currentObj.hasOwnProperty(key)) {
          search(currentObj[key]);
        }
      }
    }
  }

  // 开始搜索
  search(obj);

  return result;
}

/**
 * 将字符串转换为函数的工具函数
 * @param {string} funcStr - 要转换的函数字符串
 * @returns {Function|null} - 转换后的函数或null（如果转换失败）
 */
export function stringToFunction(funcStr) {
  // 安全性检查 - 验证输入是否为字符串
  if (typeof funcStr !== "string") {
    console.error("输入必须是字符串");
    return null;
  }

  // 验证格式是否符合预期的函数格式
  if (!funcStr.startsWith("function") && !funcStr.includes("=>")) {
    console.error("输入不是有效的函数定义字符串");
    return null;
  }

  try {
    // 使用 new Function 构造函数来创建一个新的函数
    // 注意：在生产环境中应谨慎使用这种方式，因为它存在安全风险
    return new Function("return " + funcStr)();
  } catch (error) {
    console.error("函数创建失败:", error.message);
    return null;
  }
}

// 将对象中的函数字符串转换为实际函数
export function processObject(obj) {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const result = {};

  // 遍历对象的所有属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // 判断值是否为函数字符串
      if (
        typeof value === "string" &&
        (value.startsWith("function") || value.includes("=>"))
      ) {
        // 转换为函数
        result[key] = stringToFunction(value);
      } else if (typeof value === "object" && value !== null) {
        // 递归处理嵌套对象
        result[key] = processObject(value);
      } else {
        // 保持原值不变
        result[key] = value;
      }
    }
  }

  return result;
}

export function deepMergeReactive(target, source) {
  // 对于每个源对象的属性
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      // 如果目标对象中不存在此键，则创建
      if (!(key in target)) {
        target[key] = source[key]; // 这会通过 Proxy 设置属性
      } else if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        typeof target[key] === "object" &&
        target[key] !== null
      ) {
        // 对于对象类型的值，递归合并
        deepMergeReactive(target[key], source[key]);
      } else {
        // 对于非对象类型，直接赋值
        target[key] = source[key];
      }
    }
  }
  return target;
}

// 深层代理函数
export const deepProxy = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj; // 如果是基本数据类型，直接返回
  }

  // 创建并返回代理对象
  return new Proxy(obj, {
    get(target, prop) {
      const value = target[prop];
      if (prop === "data" && Array.isArray(value)) {
        // 如果属性是 'data' 并且是数组，递归代理该数组
        return value.map((item) => deepProxy(item));
      }
      // 如果是对象，递归代理
      if (typeof value === "object" && value !== null) {
        return deepProxy(value);
      }
      return value; // 返回基本值
    },
    set(target, prop, value) {
      target[prop] = value;
      return true; // 设置属性成功
    },
  });
};

export function objectToString(obj) {
  // 如果是函数，则返回函数的字符串表示
  if (typeof obj === "function") {
    return obj.toString();
  }
  // 如果不是对象或为 null，直接使用 JSON.stringify
  if (typeof obj !== "object" || obj === null) {
    return JSON.stringify(obj);
  }
  // 如果是数组，逐个元素处理
  if (Array.isArray(obj)) {
    const arrayItems = obj.map((item) => objectToString(item));
    return "[" + arrayItems.join(",") + "]";
  }
  // 对象处理：遍历所有自有属性
  let props = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = objectToString(obj[key]);
      // 如果键名是合法的标识符可以不加引号，否则加上引号
      if (/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(key)) {
        props.push(key + ":" + value);
      } else {
        props.push(JSON.stringify(key) + ":" + value);
      }
    }
  }
  return `{
  ${props.join(`,
  `)}
}`;
}

export const addWindowResizeHandler = function(handler) {
  let oldHandler = window.onresize;
  if (typeof window.onresize != "function") {
    window.onresize = handler;
  } else {
    window.onresize = function() {
      oldHandler();
      handler();
    };
  }
};
function findCircular(obj, seen = new Set()) {
  if (typeof obj === "object" && obj !== null) {
    if (seen.has(obj)) {
      return true; // 发现循环引用
    }
    seen.add(obj);
    for (const key in obj) {
      if (findCircular(obj[key], seen)) {
        console.log("循环引用路径:", key);
        return key;
      }
    }
  }
  return false;
}

function sanitizedData(formData, flag) {
  return Object.keys(formData).reduce((acc, key) => {
    if (key !== flag) {
      acc[key] = formData[key];
    }
    return acc;
  }, {});
}

export const deepClone = function(origin) {
  let flag = findCircular(origin);
  if (typeof origin !== "object" || origin === null) {
    return origin; // 如果是基本数据类型，直接返回
  }
  if (origin instanceof Array) return [...origin];
  if (origin === undefined) {
    return undefined;
  }
  if (flag) {
    origin = sanitizedData(origin, flag);
  }
  return JSON.parse(
    JSON.stringify(origin, (key, value) => {
      if (typeof value === "function") {
        return value.toString(); // 将函数转为字符串
      }
      return value;
    })
  );
};

export const parseEnhance = function(origin) {
  return JSON.parse(origin, (key, value) => {
    if (typeof value === "string") {
      // 检查是否是箭头函数
      if (value.startsWith("() =>")) {
        return new Function("return " + value)(); // 使用 Function 构造器恢复箭头函数
      }
      // 检查是否是普通函数
      if (value.startsWith("function")) {
        return new Function("return " + value)(); // 使用 Function 构造器恢复普通函数
      }
    }
    return value;
  });
};

export function isNull(value) {
  return value === null || value === undefined;
}

export function isNotNull(value) {
  return value !== null && value !== undefined;
}

export function isEmptyStr(str) {
  //return (str === undefined) || (!str) || (!/[^\s]/.test(str));
  return (
    str === undefined ||
    (!str && str !== 0 && str !== "0") ||
    !/[^\s]/.test(str)
  );
}
export const overwriteObj = function(obj1, obj2) {
  /* 浅拷贝对象属性，obj2覆盖obj1 */
  // for (let prop in obj2) {
  //   if (obj2.hasOwnProperty(prop)) {
  //     obj1[prop] = obj2[prop]
  //   }
  // }

  Object.keys(obj2).forEach((prop) => {
    obj1[prop] = obj2[prop];
  });
};
export function getQueryParam(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }

  return undefined;
}

export function flattenArrayByKey(arr, key) {
  return arr.reduce((acc, item) => {
    // 将当前对象添加到结果数组中
    acc.push({ ...item });

    // 如果对象存在指定的子键，递归拍平并将结果合并到数组中
    if (item[key] && Array.isArray(item[key])) {
      acc = acc.concat(flattenArrayByKey(item[key], key));
    }

    // 移除当前对象中的子键，以保持拍平结果的结构
    delete acc[acc.length - 1][key];
    return acc;
  }, []);
}

export function modifyNestedObjectByKey(obj, key, value, newData) {
  // 如果对象的键值与目标匹配，则进行修改
  if (obj[key] === value) {
    Object.assign(obj, newData); // 使用 Object.assign 进行数据合并更新
    return true; // 找到并修改后，返回 true 表示成功
  }

  // 如果有子对象，递归调用该函数
  for (const prop in obj) {
    if (typeof obj[prop] === "object" && obj[prop] !== null) {
      const found = modifyNestedObjectByKey(obj[prop], key, value, newData);
      if (found) {
        return true; // 如果在子对象中找到并修改了，返回 true
      }
    }
  }

  return false; // 如果没有找到目标对象，返回 false
}

// 添加到 tool.js 中的防抖函数

/**
 * 创建一个防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间（毫秒）
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export const debounce = function(func, wait = 300, immediate = false) {
  let timeout;

  return function(...args) {
    const context = this;

    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

/**
 * 创建一个节流函数
 * @param {Function} func 要节流的函数
 * @param {number} limit 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
export const throttle = function(func, limit = 300) {
  let inThrottle;

  return function(...args) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 创建一个带有执行计数的函数
 * @param {Function} func 原始函数
 * @param {number} maxCalls 最大调用次数
 * @returns {Function} 包装后的函数
 */
export const limitCalls = function(func, maxCalls = 1) {
  let callCount = 0;

  return function(...args) {
    if (callCount < maxCalls) {
      callCount++;
      return func.apply(this, args);
    } else {
      console.warn(`Function call limit (${maxCalls}) reached`);
      return undefined;
    }
  };
};

import router from "@/core/components/WebHash/router";

export function getApiEndpoint(mainEndpoint, settingEndpoint) {
  const currentPath = router.currentRoute.value.path;

  if (currentPath.startsWith("/setting")) {
    return settingEndpoint;
  } else if (currentPath.startsWith("/main")) {
    return mainEndpoint;
  }

  // 默认返回main的端点
  return mainEndpoint;
}
