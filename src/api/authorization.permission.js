import { request } from '@/api/_service.js'

/**
 * 查询树形数据
 * @param id 父节点标识
 * @returns {*} 树形权限
 * @constructor
 */
export function TREE_TABLE_PERMISSION (id = 0) {
  return request({
    url: '/permission/tree/table/' + id,
    method: 'get'
  })
}

/**
 * 加载Cascader
 * @param id 父节点
 * @returns {*}
 * @constructor
 */
export function CASCADER_LIST_PERMISSION (id = 0) {
  return request({
    url: '/permission/cascader/options/' + id,
    method: 'get'
  })
}

/**
 * 创建权限
 * @returns {*}
 * @constructor
 */
export function CREATE_PERMISSION (data) {
  return request({
    url: '/permission',
    method: 'post',
    data
  })
}

/**
 * 根据标识获取权限
 * @param id 标识
 * @returns {*}
 * @constructor
 */
export function GET_PERMISSION (id) {
  return request({
    url: '/permission/' + id,
    method: 'get'
  })
}

/**
 * 根据标识更新权限
 * @param id 标识
 * @param data 修改数据
 * @returns {*}
 * @constructor
 */
export function MODIFY_PERMISSION (id, data) {
  return request({
    url: '/permission/' + id,
    method: 'put',
    data
  })
}
