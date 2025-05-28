import request from '@/core/Request'

export let getDdlList = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/ddl/list',data)
}

export let saveDdl = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/ddl/save',data)
}

export let deleteDdl = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/ddl/delete',data)
}
