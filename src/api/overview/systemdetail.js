import request from '@/utils/request'

export function getSystemOverviewMain(params) {
  return request({
    url: 'api/overviewmain',
    method: 'get',
    params
  })
}

export function getSystemFunctions(params) {
  return request({
    url: 'api/overview/systemdetail/SystemFunctions',
    method: 'get',
    params
  })
}

export function getSystemBusinessscenarios(params) {
  return request({
    url: 'api/overview/systemdetail/SystemBusinessscenarios',
    method: 'get',
    params
  })
}

export function getSystemArchitectures(params) {
  return request({
    url: 'api/overview/systemdetail/SystemArchitectures',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/overview',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/overview',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/overview',
    method: 'put',
    data
  })
}

export default { add, edit, del, getSystemOverviewMain, getSystemFunctions, getSystemBusinessscenarios, getSystemArchitectures }
