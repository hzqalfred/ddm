import request from "@/core/Request";

export let installCpk = (data) => {
  return request.postData("/runtimeManage/installCpk", data);
};

export let uninstallCpk = (data) => {
  return request.postData("/runtimeManage/uninstallCpk", data);
};

export let getCpkList = () => {
  return request.postData("/runtimeManage/cpkPage");
};

export let enableCpk = (data) => {
  return request.postData("/runtimeManage/enableCpk", data);
};

export let disableCpk = (data) => {
  return request.postData("/runtimeManage/disableCpk", data);
};

export let cpkHistoryList = (data) => {
  return request.postData("/runtimeManage/cpkHistoryList", data);
};

export let deleteCpkHistory = (data) => {
  return request.postData("/runtimeManage/deleteCpkHistory", data);
};

export let rollbackCpkHistory = (data) => {
  return request.postData("/runtimeManage/rollbackCpkHistory", data);
};

export let getModuleSetting = (data) => {
  return request.postData("/runtimeManage/getModuleSetting", data);
};

export let saveModuleSetting = (data) => {
  return request.postData("/runtimeManage/saveModuleSetting", data);
};

export let getMenu = () => {
  return request.postData("/runtimeManage/menu");
};

export let allModuleMenuFunction = () => {
  return request.postData("/runtimeManage/allModuleMenuFunction");
};

export let saveMenuFunction = (data) => {
  return request.postData("/runtimeManage/saveMenuFunction", data);
};
export let saveMenu = (data) => {
  return request.postData("/runtimeManage/saveMenu", data);
};
export let deleteMenuFunction = (data) => {
  return request.postData("/runtimeManage/deleteMenuFunction", data);
};
export let deleteMenu = (data) => {
  return request.postData("/runtimeManage/deleteMenu", data);
};
