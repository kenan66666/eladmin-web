import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: 'api/fema',
    method: 'get',
    params
  })
}

export function getDeptSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/fema/superior',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/fema',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/fema',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/fema',
    method: 'put',
    data
  })
}

export default { add, edit, del, getDepts, getDeptSuperior }
