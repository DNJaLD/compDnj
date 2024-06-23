import request from '@/utils/request'

// 查询cangku列表
export function listStorage(query) {
  return request({
    url: '/ruoyi-demo/storage/list',
    method: 'get',
    params: query
  })
}

// 查询cangku详细
export function getStorage(id) {
  return request({
    url: '/ruoyi-demo/storage/' + id,
    method: 'get'
  })
}

// 新增cangku
export function addStorage(data) {
  return request({
    url: '/ruoyi-demo/storage',
    method: 'post',
    data: data
  })
}

// 修改cangku
export function updateStorage(data) {
  return request({
    url: '/ruoyi-demo/storage',
    method: 'put',
    data: data
  })
}

// 删除cangku
export function delStorage(queryParam) {

  console.log(queryParam)
  return request({
    url: '/ruoyi-demo/storage/'+queryParam ,
    method: 'delete'
  })
}
