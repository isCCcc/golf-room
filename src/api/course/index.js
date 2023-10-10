import request from '@utils/https/index'

/** 球场列表 */
export const getCourseList = data => {
  return request({
    url: '/wxmp/course/list',
    method: 'GET',
    data,
  })
}

/** 球场详情 */
export const getCourseDetail = course_id => {
  return request({
    url: '/wxmp/course/detail',
    method: 'GET',
    data: { course_id },
  })
}

/** 热门城市 */
export const getHotCity = () => {
  return request({
    url: '/wxmp/course/hotCityList',
    method: 'GET',
  })
}

/** 省列表 */
export const getProvinces = () => {
  return request({
    url: '/wxmp/course/provinceList',
    method: 'GET',
  })
}
