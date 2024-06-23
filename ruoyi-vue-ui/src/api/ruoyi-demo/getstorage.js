import request from '@/utils/request'

// 查询chuku列表
export function listGetstorage(query) {
  return request({
    url: '/ruoyi-demo/getstorage/list',
    method: 'get',
    params: query
  })
}

// 查询chuku详细
export function getGetstorage(id) {
  return request({
    url: '/ruoyi-demo/getstorage/' + id,
    method: 'get'
  })
}

// 新增chuku
export function addGetstorage(data) {
  return request({
    url: '/ruoyi-demo/getstorage',
    method: 'post',
    data: data
  })
}

// 修改chuku
export function updateGetstorage(data) {
  return request({
    url: '/ruoyi-demo/getstorage',
    method: 'put',
    data: data
  })
}

// 删除chuku
export function delGetstorage(id) {
  return request({
    url: '/ruoyi-demo/getstorage/' + id,
    method: 'delete'
  })
}
  //查詢出庫單信息
export function getGetstorageInfo(data) {
    return request({
      url: '/ruoyi-demo/getstorage/getEditInfo' ,
      method: 'post',
      data:data
    })
}
