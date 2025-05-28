import request from "@/core/Request";
import { getApiEndpoint } from "@/core/utils/tool";

export let getModuleList = (data) => {
  return request.postData("/design/manage/module/page", data);
};
export let deleteModule = (data) => {
  return request.postData("/design/manage/module/delete", data);
};
export let saveModule = (data) => {
  return request.postData("/design/manage/module/save", data);
};
export let uploadIcon = (data) => {
  return request.postData("/design/manage/module/uploadIcon", data);
};
export let getIcon = (data) => {
  return request.fetchData("/design/manage/module/getIcon", data);
};
export let deleteIcon = (data) => {
  return request.postData("/design/manage/module/deleteIcon", data);
};
export let usualSettingOptions = (data) => {
  return request.postData("/design/manage/usualSettingOptions", data);
};

export let getModuleDetail = (data) => {
  return request.postData("/design/manage/module/detail", data);
};
export let saveSetting = (data) => {
  return request.postData("/design/manage/module/saveSetting", data);
};
export let deleteSetting = (data) => {
  return request.postData("/design/manage/module/deleteSetting", data);
};

export let savePrivilege = (data) => {
  return request.postData("/design/manage/module/savePrivilege", data);
}

export let deletePrivilege = (data) => {
  return request.postData("/design/manage/module/deletePrivilege", data);
}

export let saveFunction = (data) => {
  return request.postData("/design/manage/module/saveFunction", data);
};
export let deleteFunction = (data) => {
  return request.postData("/design/manage/module/deleteFunction", data);
};

export let packModule = (data, options) => {
  return request.postData("/design/manage/module/pack", data, options);
};
export let importModule = (data) => {
  return request.postData("/design/manage/module/import", data);
};
export let getFunctionDetail = (data) => {
  const apiEndpoint = getApiEndpoint(
    "/page/getFunctionDesign",
    "/design/manage/function/detail"
  );
  return request.postData(apiEndpoint, data);
};
export let referencePageOptions = (data) => {
  return request.postData("/design/manage/module/referencePageOptions", data);
};
export let getModuleDataService = (data) => {
  return request.postData("/design/manage/module/moduleDataService", data);
};
export let getCallbackInterfaceOptions = (data) => {
  return request.postData("/design/manage/module/callbackInterfaceOptions", data);
};
export let saveOperationPrivilege = (data) => {
  return request.postData("/design/manage/function/saveOperationPrivilege", data);
}
export let deleteOperationPrivilege = (data) => {
  return request.postData("/design/manage/function/deleteOperationPrivilege", data);
}
export let saveDataPrivilege = (data) => {
  return request.postData("/design/manage/function/saveDataPrivilege", data);
}
export let deleteDataPrivilege = (data) => {
  return request.postData("/design/manage/function/deleteDataPrivilege", data);
}