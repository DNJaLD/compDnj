import request from '@/utils/request'

// 查询kucun列表
export function listInventory(query) {
  return request({
    url: '/ruoyi-demo/inventory/list',
    method: 'get',
    params: query
  })
}

// 查询kucun详细
export function getInventory(id) {
  return request({
    url: '/ruoyi-demo/inventory/' + id,
    method: 'get'
  })
}

// 新增kucun
export function addInventory(data) {
  return request({
    url: '/ruoyi-demo/inventory',
    method: 'post',
    data: data
  })
}

// 修改kucun
export function updateInventory(data) {
  return request({
    url: '/ruoyi-demo/inventory',
    method: 'put',
    data: data
  })
}

// 删除kucun
export function delInventory(id) {
  return request({
    url: '/ruoyi-demo/inventory/' + id,
    method: 'delete'
  })
}
