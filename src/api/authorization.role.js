import { request } from '@/api/_service.js'

/**
 * 创建角色
 * @param data
 * @returns {*}
 * @constructor
 */
export function CREATE_ROLE (data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

/**
 * 查询角色列表
 * @param data
 * @returns {*}
 * @constructor
 */
export function LIST_ROLE_PAGE (data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

/**
 * 修改当前角色状态
 * @param roleId 角色标识
 * @param status 状态
 * @returns {*}
 * @constructor
 */
export function MODIFY_ROLE_STATUS (roleId, status) {
  return request({
    url: `/role/${roleId}/status/${status}`,
    method: 'put'
  })
}

/**
 * 修改角色详情
 * @param roleId 角色标识
 * @param data 角色数据
 * @returns {*}
 * @constructor
 */
export function MODIFY_ROLE (roleId, data) {
  return request({
    url: `/role/${roleId}`,
    method: 'put',
    data
  })
}

/**
 * 获取角色信息
 * @param roleId
 * @returns {*}
 * @constructor
 */
export function GET_ROLE (roleId) {
  return request({
    url: `/role/${roleId}`,
    method: 'get'
  })
}

/**
 * 查询角色选择器数据
 * @returns {*}
 * @constructor
 */
export function LIST_ROLE_SELECTS () {
  return request({
    url: '/roles/select',
    method: 'get'
  })
}
