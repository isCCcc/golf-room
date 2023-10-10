/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */
import request from '@utils/https/index'
/**
 * @description: 获取球局列表
 * @param {*} data
 * @type: 
 * @return {*}
 */
export function getCompetitionDetail(data) {
  let gl = data.hasOwnProperty('gl') ? data.gl : true
  return request({ url: '/wxmp/competition/detail', data, method: 'GET', gl: gl });
}

/**
 * @description: 修改计分
 * @param {*} data
 * @type: 
 * @return {*}
 */
export function updateCompetitionScore(data) {
  return request({ url: '/wxmp/competition/updScore', data, method: 'POST', gl: false, timeout: 6000 });
}

/**
 * @description: Tee颜色列表
 * @param {*} data
 * @type: 
 * @return {*}
 */
export function teeColorList(data) {
  return request({ url: '/wxmp/competitor/teeColorList', data, method: 'GET', gl: false });
}

/**
 * @description: 修改tee
 * @param {*} data
 * @type: 
 * @return {*}
 */
export function updTee(data) {
  return request({ url: '/wxmp/competitor/updTee', data, method: 'POST', gl: false, timeout: 6000 });
}

/**
 * @description: 玩家总成绩
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function getAllScore(data) {
  return request({ url: '/wxmp/competition/getAllScore', data, method: 'GET',gl: false });
}

/**
 * @description: 踢出
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function delCompetitor(data) {
  return request({ url: '/wxmp/competitor/del', data, method: 'POST', timeout: 6000 });
}
/**
 * @description: 结束
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function finishCompetition(data) {
  return request({ url: '/wxmp/competition/finish', data, method: 'POST' });
}
/**
 * @description: 获取成员imid
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function getCompetitorImIdList(data) {
  return request({ url: '/wxmp/competitor/getCompetitorImIdList', data, method: 'GET' });
}
/**
 * @description: 比赛个人成绩
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function getCompetitorDetail(data) {
   let gl = data.hasOwnProperty('gl') ? data.gl : true
  return request({ url: '/wxmp/competitor/detail', data, method: 'GET', gl: gl });
}
/**
 * @description: 撤回结束
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function resetFinish(data) {
  return request({ url: '/wxmp/competition/resetFinish', data, method: 'POST' });
}

/**
 * @description: 围观列表
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function getWatchList(data) {
  return request({ url: '/wxmp/competition/watchList', data, method: 'GET',gl: false  });
}
