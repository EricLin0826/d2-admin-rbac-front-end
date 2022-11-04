import { request } from '@/api/_service.js'

/**
 * 获取验证码
 * @returns {*} Promise验证码数据
 * @constructor
 */
export function GET_CAPTCHA () {
  return request({
    url: '/captcha',
    method: 'get'
  })
}

/**
 * 用户登录
 * @param data 登录信息(用户名、密码、验证码、验证码标识)
 * @returns {*}
 * @constructor
 */
export function LOGIN (data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

/**
 * 后台用户登出
 * @returns {*}
 * @constructor
 */
export function LOGOUT () {
  return request({
    url: 'logout',
    method: 'put'
  })
}

/**
 * 获取导航栏数据以及路由数据
 * @returns {*}
 * @constructor
 */
export function NAV () {
  return request({
    url: 'nav',
    method: 'get'
  })
}
