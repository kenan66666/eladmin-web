import request from '@/utils/request'

export function getSystemNames() {
  return request({
    url: 'api/areasystem/systemall',
    method: 'get'
  })
}

export function getSystemNameArea(params) {
  return request({
    url: 'api/areasystem/findbysysid',
    method: 'get',
    params
  })
}

export default { getSystemNames,getSystemNameArea }
