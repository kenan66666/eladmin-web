import request from '@/utils/request'

export function getSystemOverviewMain(params) {
  return request({
    url: 'api/overviewmain',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/overviewmain',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/overviewmain',
    method: 'put',
    data
  })
}

export default { getSystemOverviewMain, add, edit }
