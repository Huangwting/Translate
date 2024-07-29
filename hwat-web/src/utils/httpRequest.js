import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { Message } from 'element-ui'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['Authorization'] = Vue.cookie.get('Authorization') // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {

   // blob 格式处理
  if (response.request.responseType === 'blob') {
    return response
  }

  const res = response.data
  // 00000 请求成功
  if (res.code === '0000') {
    return response
  }

  // 9999 服务器异常
  if (res.code === '9999') {
    console.error('============== 请求异常 ==============')
    console.log('接口地址: ', response.config.url.replace(process.env.VUE_APP_BASE_API, ''))
    console.log('异常信息: ', res)
    console.error('============== 请求异常 end ==========')
    Message({
      message: '服务器出了点小差，请稍后再试',
      type: 'error',
      duration: 1.5 * 1000,
      customClass: 'element-error-message-zindex'
    })
    return Promise.reject(res)
  }
}, error => {
  console.info("error.response.status 666666")
  console.info(error.response.status)
  switch (error.response.status) {
    case 400:
      Message({
        message: error.response.data,
        type: 'error',
        duration: 1500,
        customClass: 'element-error-message-zindex'
      })
      break
    case 401:
      router.push({ name: 'home' })
      break
    case 405:
      Message({
        message: 'http请求方式有误',
        type: 'error',
        duration: 1500,
        customClass: 'element-error-message-zindex'
      })
      break
    case 500:
      Message({
        message: '服务器出了点小差，请稍后再试',
        type: 'error',
        duration: 1500,
        customClass: 'element-error-message-zindex'
      })
      break
    case 501:
      Message({
        message: '服务器不支持当前请求所需要的某个功能',
        type: 'error',
        duration: 1500,
        customClass: 'element-error-message-zindex'
      })
      break
  }
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  console.info("adornUrl:" + actionName)
  console.info("adornUrl:NODE_ENV " + process.env.NODE_ENV)
  console.info("adornUrl:OPEN_PROXY " + process.env.OPEN_PROXY)
  console.info("adornUrl:VUE_APP_BASE_API " + process.env.OPEN_PROXY)
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' ? '/api' : process.env.VUE_APP_BASE_API) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
