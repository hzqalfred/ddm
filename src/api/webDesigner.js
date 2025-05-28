import request from "@/core/Request";
import { getApiEndpoint } from "@/core/utils/tool";

export let getUserInfo = () => {
  return request.postData("/sdk/user/info");
};

export let saveUserInfo = () => {
  return request.postData("/sdk/user/save");
};

export let saveModule = (data) => {
  return request.postData("/sdk/function/saveModule",data);
};

export let getFunctionModuleList = (params) => {
  return request.postData("/sdk/function/moduleList");
};

export let getFunctionFunctionList = (params) => {
  return request.postData("/sdk/function/functionList");
};

export let saveFunction = (data) => {
  return request.postData("/sdk/function/saveFunction",data);
};

export let parserDataModel = (params) => {
  return request.postData("/sdk/function/parserDataModel");
};

export let loadFunction = (params) => {
  return request.postData("/sdk/function/loadFunction");
};

export let saveFunctionDataModel = (data) => {
  return request.postData("/sdk/function/saveFunctionDataModel",data);
};

export let saveFunctionTree = (data) => {
  return request.postData("/sdk/function/saveFunctionTree",data);
};

export let saveFunctionComponent = (data) => {
  return request.postData("/sdk/function/saveFunctionComponent",data);
};

export let saveFunctionOther = (data) => {
  return request.postData("/sdk/function/saveFunctionOther",data);
};

export let previewFucntionDetail = (id) => {
  return request.postData(`/sdk/preview/details${id ? "?id=" + id : ""}`);
};

export let previewMenuTree = (id) => {
  return request.postData(
    `/sdk/preview/menuTree${id ? "?moduleId=" + id : ""}`
  );
};

export let previewGetTempFunId = (id) => {
  return request.postData(`/sdk/preview/getTempFunId${id ? "?id=" + id : ""}`);
};

export let saveDesignJson = (data) => {
  return request.postData("/design/manage/function/saveDesignJson",data);
}


export let getFunctionDetail = (data) => {
  const apiEndpoint = getApiEndpoint(
    "/page/getFunctionDesign",
    "/design/manage/function/detail"
  );
  return request.postData(apiEndpoint, data);
};