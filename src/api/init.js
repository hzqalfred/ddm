import request from "@/core/Request";

export const getIntiInfo = () => {
  return request.postData("/page/getInitInfo");
};

export const getRuntimeSetting = () => {
  return request.postData("/runtimeManage/getRuntimeSetting");
};

export const saveRuntimeSetting = (data) => {
  return request.postData("/runtimeManage/saveRuntimeSetting", data);
};

export const reloadRuntimeSetting = (data) => {
  return request.postData("/runtimeManage/reloadRuntimeSetting", data);
};

export const checkRedisConnection = (data) => {
  return request.postData("/runtimeManage/checkRedisConnection", data);
};

export const checkDataSourceConnection = (data) => {
  return request.postData("/runtimeManage/checkDataSourceConnection", data);
};

export const checkFileUploadConnection = (data) => {
  return request.postData("/runtimeManage/checkFileUploadConnection", data);
};

export const getMenu = () => {
  return request.postData("/page/menu");
};

export const getInitInfo = () => {
  return request.postData("/page/getInitInfo");
};
export const ssoLogin = (token) => {
  return request.postData(`/permission/ssoLogin?access_token=${token}`);
};