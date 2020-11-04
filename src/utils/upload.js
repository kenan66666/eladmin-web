import axios from 'axios'
import { getToken } from '@/utils/auth'

export function upload(api, file) {
  var data = new FormData()
  data.append('file', file)
  const config = {
    headers: { 'Authorization': getToken() }
  }
  return axios.post(api, data, config)
}

export function upload2(api, data) {
  const config = {
    headers: { 'Authorization': getToken(), 'Content-Type': 'multipart/form-data' }
  }
  return axios.post(api, data, config)
}

export function upload3(api, data) {
  const config = {
    headers: { 'Authorization': getToken(), 'Content-Type': 'multipart/form-data' }
  }
  return axios.put(api, data, config)
}