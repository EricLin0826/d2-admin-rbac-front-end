import { request } from '@/api/_service.js'

/**
 * 创建后台用户
 * @param data
 * @returns {*}
 * @constructor
 */
export function CREATE_ADMIN (data) {
  return request({
    url: '/admin',
    method: 'post',
    data
  })
}

/**
 * 查询后台用户（分页）
 * @param data
 * @returns {*}
 * @constructor
 */
export function LIST_ADMIN_PAGE (data) {
  return request({
    url: '/admins',
    method: 'post',
    data
  })
}

/**
 * 修改后台用户
 * @param id 后台用户标识
 * @param data 需要修改的数据
 * @returns {*}
 * @constructor
 */
export function MODIFY_ADMIN (id, data) {
  return request({
    url: `/admin/${id}`,
    method: 'put',
    data
  })
}

/**
 * 根据标识获取后台用户
 * @param id 后台用户标识
 * @returns {*}
 * @constructor
 */
export function GET_ADMIN (id) {
  return request({
    url: `/admin/${id}`,
    method: 'get'
  })
}

/**
 * 修改后台用户锁定状态
 * @param id 后台用户标识
 * @param targetLockedStatus 锁定状态（1锁定,0未锁定）
 * @returns {*}
 * @constructor
 */
export function MODIFY_ADMIN_LOCKED_STATUS (id, targetLockedStatus) {
  return request({
    url: `/admin/${id}/status/${targetLockedStatus}`,
    method: 'put'
  })
}

/**
 * 修改后台用户密码
 * @param id 标识
 * @param data 密码
 * @returns {*}
 * @constructor
 */
export function MODIFY_ADMIN_PASSWORD (id, data) {
  return request({
    url: `/admin/${id}/password`,
    method: 'put',
    data
  })
}
