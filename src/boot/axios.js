import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

const baseURL = () => {
  if (!process.env.DEV) return 'http://10.20.10.2:8000'
  return `${location.protocol}//${location.hostname}:8000`
}
const axiosInstance = axios.create({
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  },
  baseURL: baseURL()
})

axiosInstance.set = (method, url, data) => {
  if (method.toUpperCase() === 'POST') return axiosInstance.post(url, data)

  if (method.toUpperCase() === 'PUT') return axiosInstance({ method: method, url: url, data: data })

  if (method.toUpperCase() === 'PATCH') return axiosInstance({ method: method, url: url, data: data })
}

Vue.prototype.$axios = axiosInstance

// axiosInstance.get('/api/profile')

export { axiosInstance }
