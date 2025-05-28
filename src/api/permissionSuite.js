import request from "@/core/Request";

export let getDataPrivilegeTree = (data) => {
  return request.postData("/permission/getDataPrivilegeTree", data);
};
export let getDataPrivilege = (data) => {
  return request.postData("/permission/getDataPrivilege", data);
};
export let saveDataPrivilege = (data) => {
  return request.postData("/permission/saveDataPrivilege", data);
};

export let getOperationPrivilegeTree = (data) => {
  return request.postData("/permission/getOperationPrivilegeTree", data);
};
export let getOperationPrivilege = (data) => {
  return request.postData("/permission/getOperationPrivilege", data);
};
export let saveOperationPrivilege = (data) => {
  return request.postData("/permission/saveOperationPrivilege", data);
};

export let getMenuPrivilegeTree = (data) => {
  return request.postData("/permission/getMenuPrivilegeTree", data);
};
export let saveMenuPrivilegeTree = (data) => {
  return request.postData("/permission/saveMenuPrivilegeTree", data);
};
