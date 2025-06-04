import request from '@/core/Request'
import { getApiEndpoint } from "@/core/utils/tool";

export let listService = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/service/list',data)
}

export let saveService= data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/service/save',data)
}

export let deleteService = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/service/delete',data)
}


export let listEvent = data => {
  data.ISFORMDATA = '1'
return request.postData('/design/data/service/event/list',data)
}

export let saveEvent= data => {
  data.ISFORMDATA = '1'
return request.postData('/design/data/service/event//save',data)
}

export let deleteEvent = data => {
  data.ISFORMDATA = '1'
return request.postData('/design/data/service/event//delete',data)
}

export let testEvent = data => {
    data.ISFORMDATA = '1'
    return request.postData('/design/data/service/event/test', data)
}

export let tranlateStatement = data => {
  data.ISFORMDATA = '1'
return request.postData('/design/data/service/translate',data)
}

export let parseRequestParam = data => {
  data.ISFORMDATA = '1'
return request.postData('/design/data/service/parseRequestParam',data)
}

export let queryColumnList = data => {
  data.ISFORMDATA = '1'
  const apiEndpoint = getApiEndpoint(
    "/page/queryColumnList",
    "/design/data/service/queryColumnList"
  );
  return request.postData(apiEndpoint, data);
}
