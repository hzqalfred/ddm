import request from '@/core/Request'

export let listWflow = data => {
    data.ISFORMDATA = '1'
  return request.postData('/bpm/proc/list',data)
}

export let saveWflow = data => {
    data.ISFORMDATA = '1'
  return request.postData('/bpm/proc/save',data)
}

export let deleteWflow = data => {
    data.ISFORMDATA = '1'
  return request.postData('/bpm/proc/delete',data)
}

export let copyWflow = data => {
  data.ISFORMDATA = '1'
return request.postData('/bpm/proc/copy',data)
}

 export let updateFlowNodeData = data =>{
    data.ISFORMDATA = '1'
    return request.postData('/bpm/inst/node/update',data)
  }

  export let addFlowNodeData = data => {
    data.ISFORMDATA = '1'
    return request.postData('/bpm/inst/node/add',data)
  }

  export let deleteFlowNodeData = data => {
    data.ISFORMDATA = '1'
    return request.postData('/bpm/inst/node/delete',data)
  }

  export let queryCandidates = data => {
    data.ISFORMDATA = '1'
    return request.postData('/bpm/candidate/queryCandidates',data)
  }

  export let queryCandidatePost = data => {
    data.ISFORMDATA = '1'
    return request.postData('/bpm/candidate/queryCandidatePost',data)
  }