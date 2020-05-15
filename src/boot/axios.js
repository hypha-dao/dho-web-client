import axios from 'axios'

export const accountApi = axios.create({
  baseURL: process.env.ACCOUNT_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ACCOUNT_API_KEY
  }
})

accountApi.interceptors.response.use(
  response => response.data || {},
  error => {
    return {
      status: error.response.status,
      error: error.response.data
    }
  }
)

export default ({ Vue, store }) => {
  Vue.prototype.$accountApi = accountApi
  store['$accountApi'] = accountApi
}
