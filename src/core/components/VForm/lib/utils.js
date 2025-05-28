import { deepClone } from "@/core/utils/tool";
export function getAllContainerWidgets(widgetList) {
  if (!widgetList) {
    return [];
  }

  let result = [];
  let handlerFn = (w) => {
    result.push({
      type: w.type,
      name: w.options.name,
      container: w,
    });
  };
  traverseContainerWidgets(widgetList, handlerFn);

  return result;
}

export function traverseContainerWidgets(widgetList, handler) {
  if (!widgetList) {
    return;
  }

  widgetList.map((w) => {
    if (w.category === "container") {
      handler(w);
    }

    if (w.type === "grid") {
      w.cols.map((col) => {
        traverseContainerWidgets(col.widgetList, handler);
      });
    } else if (w.type === "table") {
      w.rows.map((row) => {
        row.cols.map((cell) => {
          traverseContainerWidgets(cell.widgetList, handler);
        });
      });
    } else if (w.type === "tab") {
      w.tabs.map((tab) => {
        traverseContainerWidgets(tab.widgetList, handler);
      });
    } else if (w.type === "sub-form") {
      traverseContainerWidgets(w.widgetList, handler);
    } else if (w.category === "container") {
      //自定义容器
      traverseContainerWidgets(w.widgetList, handler);
    }
  });
}

export function getAllFieldWidgets(widgetList) {
  if (!widgetList) {
    return [];
  }

  let result = [];
  let handlerFn = (w) => {
    result.push({
      type: w.type,
      name: w.options.name,
      field: w,
    });
  };
  traverseFieldWidgets(widgetList, handlerFn);

  return result;
}

export function traverseAllWidgets(widgetList, handler) {
  if (!widgetList) {
    return;
  }

  widgetList.map((w) => {
    handler(w);

    if (w.type === "grid") {
      w.cols.map((col) => {
        handler(col);
        traverseAllWidgets(col.widgetList, handler);
      });
    } else if (w.type === "table") {
      w.rows.map((row) => {
        row.cols.map((cell) => {
          handler(cell);
          traverseAllWidgets(cell.widgetList, handler);
        });
      });
    } else if (w.type === "tab") {
      w.tabs.map((tab) => {
        traverseAllWidgets(tab.widgetList, handler);
      });
    } else if (w.type === "sub-form") {
      traverseAllWidgets(w.widgetList, handler);
    } else if (w.category === "container") {
      //自定义容器
      traverseAllWidgets(w.widgetList, handler);
    }
  });
}

export const loadRemoteScript = function(srcPath, callback) {
  /*加载远程js，加载成功后执行回调函数*/
  let sid = encodeURIComponent(srcPath);
  let oldScriptEle = document.getElementById(sid);

  if (!oldScriptEle) {
    let s = document.createElement("script");
    s.src = srcPath;
    s.id = sid;
    document.body.appendChild(s);

    s.onload = s.onreadystatechange = function(_, isAbort) {
      /* 借鉴自ace.js */
      if (
        isAbort ||
        !s.readyState ||
        s.readyState === "loaded" ||
        s.readyState === "complete"
      ) {
        s = s.onload = s.onreadystatechange = null;
        if (!isAbort) {
          callback();
        }
      }
    };
  }
};

export const generateId = function() {
  return Math.floor(
    Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000
  );
};

export function traverseFieldWidgetsOfContainer(con, handler) {
  if (con.type === "grid") {
    con.cols.forEach((col) => {
      col.widgetList.forEach((cw) => {
        handleWidgetForTraverse(cw, handler);
      });
    });
  } else if (con.type === "table") {
    con.rows.forEach((row) => {
      row.cols.forEach((cell) => {
        cell.widgetList.forEach((cw) => {
          handleWidgetForTraverse(cw, handler);
        });
      });
    });
  } else if (con.type === "tab") {
    con.tabs.forEach((tab) => {
      tab.widgetList.forEach((cw) => {
        handleWidgetForTraverse(cw, handler);
      });
    });
  } else if (con.type === "sub-form") {
    con.widgetList.forEach((cw) => {
      handleWidgetForTraverse(cw, handler);
    });
  } else if (con.type === "subgrid" || con.type === "universal") {
    // con.widgetList.forEach(cw => {
    //   handleWidgetForTraverse(cw, handler)
    // })
  } else if (con.category === "container") {
    //自定义容器
    con.widgetList.forEach((cw) => {
      handleWidgetForTraverse(cw, handler);
    });
  }
}

export const insertCustomCssToHead = function(cssCode, formId = "") {
  let head = document.getElementsByTagName("head")[0];
  let oldStyle = document.getElementById("vform-custom-css");
  if (!!oldStyle) {
    head.removeChild(oldStyle); //先清除后插入！！
  }

  if (!!formId) {
    oldStyle = document.getElementById("vform-custom-css" + "-" + formId);
    !!oldStyle && head.removeChild(oldStyle); //先清除后插入！！
  }

  let newStyle = document.createElement("style");
  newStyle.type = "text/css";
  newStyle.rel = "stylesheet";
  newStyle.id = !!formId
    ? "vform-custom-css" + "-" + formId
    : "vform-custom-css";
  try {
    newStyle.appendChild(document.createTextNode(cssCode));
  } catch (ex) {
    newStyle.styleSheet.cssText = cssCode;
  }

  head.appendChild(newStyle);
};

export const insertGlobalFunctionsToHtml = function(
  functionsCode,
  formId = ""
) {
  let bodyEle = document.getElementsByTagName("html")[0];
  let oldScriptEle = document.getElementById("v_form_global_functions");

  !!oldScriptEle && bodyEle.removeChild(oldScriptEle); //先清除后插入！！
  if (!!formId) {
    oldScriptEle = document.getElementById(
      "v_form_global_functions" + "-" + formId
    );
    !!oldScriptEle && bodyEle.removeChild(oldScriptEle); //先清除后插入！！
  }

  let newScriptEle = document.createElement("script");
  newScriptEle.id = !!formId
    ? "v_form_global_functions" + "-" + formId
    : "v_form_global_functions";
  newScriptEle.type = "text/javascript";
  newScriptEle.innerHTML = functionsCode;
  bodyEle.appendChild(newScriptEle);
};

export function traverseFieldWidgets(widgetList, handler, parent = null) {
  if (!widgetList) {
    return;
  }

  widgetList.map((w) => {
    if (w.formItemFlag) {
      handler(w, parent);
    } else if (w.type === "grid") {
      w.cols.map((col) => {
        traverseFieldWidgets(col.widgetList, handler, w);
      });
    } else if (w.type === "table") {
      w.rows.map((row) => {
        row.cols.map((cell) => {
          traverseFieldWidgets(cell.widgetList, handler, w);
        });
      });
    } else if (w.type === "tab") {
      w.tabs.map((tab) => {
        traverseFieldWidgets(tab.widgetList, handler, w);
      });
    } else if (w.type === "sub-form") {
      traverseFieldWidgets(w.widgetList, handler, w);
    } else if (w.category === "container") {
      //自定义容器
      traverseFieldWidgets(w.widgetList, handler, w);
    }
  });
}

export function getDefaultFormConfig() {
  return {
    modelName: "formData",
    refName: "vForm",
    rulesName: "rules",
    labelWidth: 120,
    labelPosition: "right",
    size: "",
    labelAlign: "label-right-align",
    cssCode: "",
    customClass: [],
    functions: "", //全局函数
    layoutType: "PC",
    jsonVersion: 3,
    onFormCreated: "",
    onFormMounted: "",
    onFormDataChange: "",
  };
}

export function buildDefaultFormJson() {
  return {
    widgetList: [],
    formConfig: deepClone(getDefaultFormConfig()),
  };
}

export function copyToClipboard(
  content,
  clickEvent,
  $message,
  successMsg,
  errorMsg
) {
  const clipboard = new Clipboard(clickEvent.target, {
    text: () => content,
  });

  clipboard.on("success", () => {
    $message.success(successMsg);
    clipboard.destroy();
  });

  clipboard.on("error", () => {
    $message.error(errorMsg);
    clipboard.destroy();
  });

  clipboard.onClick(clickEvent);
}

export function fixFieldOption(widgetList, parent = null, fieldsList) {
  if (!widgetList) {
    return;
  }

  widgetList.map((w) => {
    // 回显数据时，以字段列表的最新配置为准
    if (w.formItemFlag) {
      var item = fieldsList.find((field) => field.key === w.id);
      if (item) {
        item.selected = true;

        // if (w.type !== item.type) {
        // 假如控件类型变化了则整个options重新替换，以前写的配置失效
        // w.options = deepClone(item.options)
        // } else {
        // 只更新一些必要的参数
        w.type = item.type;
        w.icon = item.icon;
        w.key = item.key;
        w.options.required = item.options.required;
        w.options.label = item.options.label;
        w.options.defaultValue = item.options.defaultValue;
        // if (w.options.type !== item.options.type) {
        w.options.type = item.options.type;
        if (w.options.type === "select") {
          w.options.multiple = item.options.multiple;
          w.options.filterable = item.options.filterable;
        } else if (w.options.type in dateTimeMap) {
          w.options.format = dateTimeMap[w.options.type];
          w.options.valueFormat = dateTimeMap[w.options.type];
        }
        // }
        if (item.options.dictionary) {
          w.options.dictionary = item.options.dictionary;
        }
        // }
      }
    } else if (w.type === "grid") {
      w.cols.map((col) => {
        fixFieldOption(col.widgetList, w, fieldsList);
      });
    } else if (w.type === "table") {
      w.rows.map((row) => {
        row.cols.map((cell) => {
          fixFieldOption(cell.widgetList, w, fieldsList);
        });
      });
    } else if (w.type === "tab") {
      w.tabs.map((tab) => {
        fixFieldOption(tab.widgetList, w, fieldsList);
      });
    } else if (w.type === "sub-form") {
      fixFieldOption(w.widgetList, w, fieldsList);
    } else if (w.category === "container") {
      //自定义容器
      fixFieldOption(w.widgetList, w, fieldsList);
    }
  });
}
