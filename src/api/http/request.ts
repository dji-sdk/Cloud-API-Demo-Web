import axios from 'axios'
import { uuidv4 } from '/@/utils/uuid'
import { CURRENT_CONFIG } from './config'
export * from './type'
const REQUEST_ID = 'X-Request-Id'
function getAuthToken () {
  return localStorage.getItem('x-auth-token')
}

const instance = axios.create({
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 12000,
})

instance.interceptors.request.use(
  config => {
    config.headers['X-Auth-Token'] = getAuthToken()
    // config.headers[REQUEST_ID] = uuidv4()
    config.baseURL = CURRENT_CONFIG.baseURL
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  response => response,
  err => {
    const requestId = err?.config?.headers && err?.config?.headers[REQUEST_ID]
    console.info('')
    if (requestId) {
      console.info(REQUEST_ID, '：', requestId)
    }
    console.info('url: ', err?.config?.url, `【${err?.config?.method}】 \n>>>> err: `, err)

    let description = '-'
    if (err.response?.data && err.response.data.message) {
      description = err.response.data.message
    }
    if (err.response?.data && err.response.data.result) {
      description = err.response.data.result.message
    }
    // @See: https://github.com/axios/axios/issues/383
    if (!err.response || !err.response.status) {
      console.log('The network is abnormal, please check the network and try again')
    } else if (err.response?.status !== 200) {
      console.log(`ERROR_CODE: ${err.response?.status}`)
    }
    if (err.response?.status === 403) {
      // window.location.href = '/'
    }
    if (err.response?.status === 401) {
      console.log(err.response)
    }

    return Promise.reject(err)
  },
)

export default instance
