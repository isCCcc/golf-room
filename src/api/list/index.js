/*
 * @Author: wsw 944627549@qq.com
 * @Date: 2022-11-27 22:25:02
 * @LastEditors: wsw 944627549@qq.com
 * @LastEditTime: 2022-12-01 10:12:59
 * @FilePath: /wx-GolfRoom/src/api/list/index.js
 */
import request from '@utils/https/index'
/**
 * @description: 获取球局列表
 * @param {*} data
 * @type: 
 * @return {*}
 */
export function getCompetionList(data,gl = true) {
  return request({url: '/wxmp/competition/list', data, method:'GET',gl});
}

/**
 * @description: 获取球局列表
 * @param {*} data
 * @type: 
 * @return {*}
 */
export function getBannerList(data) {
  return request({url: '/wxmp/banner/list', data, method:'GET',gl:false});
}

export function getAllList(data,gl = true) {
  return request({url: '/wxmp/competition/allList', data, method:'GET',gl});
}

