import axios from 'axios'

export const registerApi = axios.create({
  baseURL: process.env.REGISTER_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REGISTER_API_KEY
  }
})

registerApi.interceptors.response.use(
  response => response.data || {},
  error => throw new Error(error.response.data.message || null)
)

export const accountApi = axios.create({
  baseURL: process.env.ACCOUNT_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ACCOUNT_API_KEY
  }
})

accountApi.interceptors.response.use(response => response.data || {})

export default ({ Vue, store }) => {
  Vue.prototype.$registerApi = registerApi
  store['$registerApi'] = registerApi

  Vue.prototype.$accountApi = accountApi
  store['$accountApi'] = accountApi
}
