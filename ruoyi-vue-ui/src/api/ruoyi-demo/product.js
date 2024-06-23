import request from '@/utils/request'

// 查询shangpin列表
export function listProduct(query) {
  return request({
    url: '/ruoyi-demo/product/list',
    method: 'get',
    params: query
  })
}

// 查询shangpin详细
export function getProduct(id) {
  return request({
    url: '/ruoyi-demo/product/' + id,
    method: 'get'
  })
}

// 新增shangpin
export function addProduct(data) {
  return request({
    url: '/ruoyi-demo/product',
    method: 'post',
    data: data
  })
}

// 修改shangpin
export function updateProduct(data) {
  return request({
    url: '/ruoyi-demo/product',
    method: 'put',
    data: data
  })
}

// 删除shangpin
export function delProduct(id) {
  return request({
    url: '/ruoyi-demo/product/' + id,
    method: 'delete'
  })
}
