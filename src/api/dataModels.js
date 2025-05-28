import request from '@/core/Request'

export let getModelList = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/model/list',data)
}

export let saveModel = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/model/save',data)
}

export let deleteModel = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/model/delete',data)
}

export let getModelColList = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/model/col/list',data)
}

export let saveModelCol = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/model/col/save',data)
}

export let deleteModelCol = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/model/col/delete',data)
}

export let tranlateStatement = data => {
    data.ISFORMDATA = '1'
  return request.postData('/design/data/model/translate',data)
}


export let updateDataModel = data => {
  data.ISFORMDATA = '1'
return request.postData('/design/data/model/update',data)
}