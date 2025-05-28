import axios from "axios";
import messageHandler from "./Message";
import router from "@/core/components/WebHash/router";
import { useApp } from "@/core/pinia/modules/app";
import auth from "@/core/AuthManage";

export function createRequest(customConfig = {}) {
  // 环境映射，基于主机名动态选择环境
  let environmentMap = {
    localhost: {
      baseURL: import.meta.env.VITE_NAME === "dev" ? "/api" : "/api",
      timeout: 1000 * 60,
    },
  };

  const currentHost = window.location.hostname;
  const selectedConfig =
    environmentMap[currentHost] || environmentMap["localhost"];

  // 默认配置，包含基础URL、超时时间和请求配置
  const config = {
    baseURL: selectedConfig.baseURL,
    timeout: selectedConfig.timeout,
    headers: {},
    ...customConfig, // 支持自定义配置
  };

  // 初始化请求和响应拦截器
  function _initializeInterceptors(service) {
    service.interceptors.request.use(_handleRequest, _handleRequestError);
    service.interceptors.response.use(_handleResponse, _handleResponseError);
  }

  // 请求拦截器
  function _handleRequest(requestConfig) {
    const { setButtonLoading } = useApp();

    if (requestConfig.params?.eventId) {
      setButtonLoading(requestConfig.params.eventId);
    }

    handleFormData(requestConfig);
    appendQrcodeParam(requestConfig);

    return requestConfig;
  }

  // 请求错误拦截器
  function _handleRequestError(error) {
    return Promise.reject(error);
  }

  // 响应拦截器
  function _handleResponse(response) {
    const { removeButtonLoading } = useApp();
    if (response.config?.params?.eventId) {
      removeButtonLoading(response.config.params.eventId);
    }

    if (response.config?.responseType === "blob") {
      return response;
    }

    return response.data;
  }

  // 响应错误拦截器
  async function _handleResponseError(error) {
    removeButtonLoadingIfPresent(error);
    handleSpecificErrors(error);

    if (
      error.response?.status == 401 ||
      error.response?.status == 302 ||
      error.response?.status == 400
    ) {
      handleUnauthorized(error);
    }

    if (error.response?.status == 404) {
      console.error("接口不存在!");
      return Promise.reject(error);
    }

    if (!error.response) {
      messageHandler.notifyError("请求超时!");
      return Promise.reject(error);
    }

    messageHandler.closeAllMessages();
    try {
      messageHandler.notifyError(error.response?.data?.msg || "请求错误!");
    } catch (err) {
      messageHandler.notifyError(error.message || "请求错误!");
    }

    return Promise.reject(error);
  }

  // 处理form-data类型的请求数据
  function handleFormData(requestConfig) {
    if (
      ["delete", "post"].includes(requestConfig.method) &&
      requestConfig.data?.ISFORMDATA == "1"
    ) {
      delete requestConfig.data.ISFORMDATA;
      requestConfig.headers["Content-Type"] = "multipart/form-data";
      requestConfig.data = getFormData(requestConfig.data);
    }
  }

  // 如果URL中包含"qrcode"，则添加qrcode=true参数
  function appendQrcodeParam(requestConfig) {
    if (location.href.includes("qrcode")) {
      requestConfig.url +=
        (requestConfig.url.includes("?") ? "&" : "?") + "qrcode=true";
    }
  }

  // 如果存在eventId，移除按钮loading状态
  function removeButtonLoadingIfPresent(error) {
    const { removeButtonLoading } = useApp();
    const eventId =
      error.response?.config?.params?.eventId || error.config?.params?.eventId;
    if (eventId) {
      removeButtonLoading(eventId);
    }
  }
  function handleUnauthorized(error) {
    if (error.response?.data?.code == "401") {
      // auth.logout();
      // router.push("/login");
    }
  }

  // 处理特定错误代码（例如UT01001、UT01002）
  function handleSpecificErrors(error) {
    if (error.response?.data?.msg) {
      if (error.response.data.msg.includes("UT01001")) {
        router.push({ path: "/UT01001" });
      } else if (error.response.data.msg.includes("UT01002")) {
        router.push({ path: "/UT01002" });
      }
    }
  }

  // 将对象转换为FormData格式
  function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      const value = object[key];
      formData.append(key, Array.isArray(value) ? value.join(";") : value);
    });
    return formData;
  }

  // 设置超时时间
  function setTimeout(timeout) {
    config.timeout = timeout;
  }

  // 设置基础URL
  function setBaseURL(baseURL) {
    config.baseURL = baseURL;
  }

  // 设置请求头
  function setHeaders(newHeaders) {
    config.headers = { ...config.headers, ...newHeaders };
  }

  // 设置环境映射
  function setEnvironmentMap(newEnvironmentMap) {
    environmentMap = { ...environmentMap, ...newEnvironmentMap };
    const currentHost = window.location.hostname;
    const selectedConfig =
      environmentMap[currentHost] || environmentMap["localhost"];
    setBaseURL(selectedConfig.baseURL);
    setTimeout(selectedConfig.timeout);
  }

  // 返回接口方法
  return {
    fetchData: (url, params = {}) => {
      const service = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout,
        headers: config.headers,
      });

      _initializeInterceptors(service);
      return service
        .get(url, { params })
        .then((response) => response)
        .catch(Promise.reject);
    },

    postData: (url, payload) => {
      const service = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout,
        headers: config.headers,
      });

      _initializeInterceptors(service);
      return service
        .post(url, payload)
        .then((response) => response)
        .catch(Promise.reject);
    },
    setBaseURL,
    setHeaders,
    setTimeout,
    setEnvironmentMap,
  };
}

export default createRequest();
