import request from '@/utils/request'

// 查询ruku列表
export function listPutstorage(query) {
  return request({
    url: '/ruoyi-demo/putstorage/list',
    method: 'get',
    params: query
  })
}

// 查询ruku详细
export function getPutstorage(id) {
  return request({
    url: '/ruoyi-demo/putstorage/' + id,
    method: 'get'
  })
}

// 新增ruku
export function addPutstorage(data) {

  return request({
    url: '/ruoyi-demo/putstorage',
    method: 'post',
    data: data
  })
}

// 修改ruku
export function updatePutstorage(data) {
  return request({
    url: '/ruoyi-demo/putstorage',
    method: 'put',
    data: data
  })
}

// 删除ruku
export function delPutstorage(id) {
  return request({
    url: '/ruoyi-demo/putstorage/' + id,
    method: 'delete'
  })
}
