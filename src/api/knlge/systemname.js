import request from '@/utils/request'

export function getSystemNames() {
  return request({
    url: 'api/areasystem/systemall',
    method: 'get'
  })
}

export default { getSystemNames }
