/**
 * 职责声明：
 * 1.提供一个 单一的 axios 实例（方面进行统一拦截）
 * 2.允许调用方定制自己的配置（例如拦截器等），而不影响其他实例
 *
 * 暴露 API：
 * 1.一个统一的 axios 实例: singleAxiosInstance（绑定了统一的拦截器）
 * 2.创建 axios 实例的方法 createAxiosInstance，并在参数中允许配置是否绑定统一拦截器
 * 3.对外暴露统一拦截器绑定方案，允许外界进行定制: bindCommonRequestInterceptors、bindCommonResponseInterceptors
 */

import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

// 统一的 request 拦截器
export function bindCommonRequestInterceptors (instance: AxiosInstance): void {
  instance.interceptors.request.use(config => {
    return config
  })
}

// Unified response interceptor
export function bindCommonResponseInterceptors (instance: AxiosInstance): void {
  instance.interceptors.response.use(config => {
    return config
  }, err => {
    return Promise.reject(err)
  })
}

export function createAxiosInstance (config?: AxiosRequestConfig, commonInterceptorConf: { request?: boolean, response?: boolean } = {}): AxiosInstance {
  const instance = Axios.create(config)

  // Binding a unified interceptor, binding by default
  commonInterceptorConf.request !== false && bindCommonRequestInterceptors(instance)
  commonInterceptorConf.response !== false && bindCommonResponseInterceptors(instance)

  return instance
}

const singleAxios = createAxiosInstance({}, { request: true, response: false })

export default singleAxios
