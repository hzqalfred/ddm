import request from "@/core/Request";
import { getApiEndpoint } from "@/core/utils/tool";

export let getFunctionDetail = (data) => {
  const apiEndpoint = getApiEndpoint(
    "/page/getFunctionDesign",
    "/design/manage/function/detail"
  );
  return request.postData(apiEndpoint, data);
};
export let saveBaseInfo = (data) => {
  return request.postData("/design/manage/function/saveBaseInfo", data);
};
export let parseModelSql = (data) => {
  return request.postData("/design/manage/function/parseModelSql", data);
};


export let saveMethod = (data) => {
  return request.postData("/design/manage/function/saveMethod", data);
};
export let deleteMethod = (data) => {
  return request.postData("/design/manage/function/deleteMethod", data);
};
export let getImportMethodList = (data) => {
  return request.postData("/design/manage/function/getImportMethodList", data);
};

export let saveTree = (data) => {
  return request.postData("/design/manage/function/saveTree", data);
};
export let deleteTree = (data) => {
  return request.postData("/design/manage/function/deleteTree", data);
};

export let saveColumn = (data) => {
  return request.postData("/design/manage/function/saveColumn", data);
};
export let deleteColumn = (data) => {
  return request.postData("/design/manage/function/deleteColumn", data);
};

export let saveOtherSetting = (data) => {
  return request.postData("/design/manage/function/saveOtherSetting", data);
};

export let deleteOtherSetting = (data) => {
  return request.postData("/design/manage/function/deleteOtherSetting", data);
};

export let saveDesignJson = (data) => {
  return request.postData("/design/manage/function/saveDesignJson", data);
};

export let allDataService = () => {
  return request.postData("/design/manage/module/allDataService");
};

export let saveQueryProgramme = (data) => {
  const apiEndpoint = getApiEndpoint(
    "/page/saveQueryProgramme",
    "/design/manage/function/saveQueryProgramme"
  );
  return request.postData(apiEndpoint, data);
};

export let deleteQueryProgramme = (data) => {
  const apiEndpoint = getApiEndpoint(
    "/page/deleteQueryProgramme",
    "/design/manage/function/deleteQueryProgramme"
  );
  return request.postData(apiEndpoint, data);
};