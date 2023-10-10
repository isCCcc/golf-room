/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */
import request from '@utils/https/index'

/** 创建球场 */
export const createCompetition = data => {
  return request({
    url: '/wxmp/competition/add',
    method: 'POST',
    data,
  })
}

/** 批量添加玩家 */
export const batchAdd = data => {
  return request({
    url: '/wxmp/competitor/batchAdd',
    method: 'POST',
    data,
  })
}

/**
 * @description: 创建虚拟球员
 * @param {*} data { competition_id, group, username, gender }
 * @type: 
 * @return {*} data.data.list
 */
 export function createVirtualUser(data, gl) {
  return request({
    url: "/wxmp/competitor/addTemp",
    data,
    method: "POST",
    gl: gl,
  });
}

/**
 * @description: 修改球局信息

 * @param {*} data
 * @type: 
 * @return {*}
 */
export function updCompetition(data) {
  return request({ url: '/wxmp/competition/upd', data, method: 'POST',gl: false});
}

/** Deprecated 获取加入球局小程序码 */
export const getJoinWxmpCode = data => {
  return request({
    url: '/wxmp/competition/getJoinWxmpCode',
    method: 'GET',
    data,
  })
}

/** 删除 */
export function delCompetition(data) {
  return request({
    url: '/wxmp/competition/del',
    method: 'POST',
    data,
  })
}

/**
 * 退出围观
 */
export function exitWatching(data, gl = true) {
  return request({
    url: '/wxmp/competition/watchDel',
    method: 'POST',
    data,
    gl: gl,
  })
}

/** 
 * 公告,欢迎语 dat {competition_id, lat , lng}； http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/球局/公告,欢迎语
 */
export function getAnnouceAndWelcome(data) {
  return request({
    url: '/wxmp/competition/announcement',
    method: 'GET',
    data,
  })
}


/**
 * @description: 我的打球历史
 * @param {*} data
 * @type: 
 * @return {*}
 */
export function getCompetitionHistoryList(data) {
  return request({url: '/wxmp/competition/historyList', data, method:'GET'});
}

/**
 * @description: 看过的球局
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function getWatchedList(data,gl) {
  return request({url: '/wxmp/competition/watchedList', data, method:'GET',gl});
 }
 /**
 * @description: 首页正在围观列表
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function getWatchingList(data,gl) {
  return request({url: '/wxmp/competition/watchingList', data, method:'GET',gl});
 }


 /**
 * @description: 球局/搜索列表 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/球局/搜索列表
 * @param {*} data { start, count, keyword }
 * @type: 
 * @return {*} data.data.list
 */
export function searchCompetitions(data, gl) {
  return request({url: '/wxmp/competition/searchList', data, method:'GET', gl: gl});
}

/**
 * @description: 球局/球童列表 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/球局/球童列表
 * @param {*} data { competition_id, group }
 * @type: 
 * @return {*} data.data.list
 */
export function listCaddies(data, gl) {
  return request({
    url: "/wxmp/competition/caddieList",
    data,
    method: "GET",
    gl: gl,
  });
}

/**
 * @description: 球局/添加球童 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/球局/添加球童
 * @param {*} data { competition_id, caddie_uid, group }
 * @type: 
 * @return {*} data.data.list
 */
export function addCaddie(data, gl) {
  return request({
    url: "/wxmp/competition/caddieAdd",
    data,
    method: "POST",
    gl: gl,
  });
}

/**
 * @description: 球局/批量添加球童 
 * @param {*} data { competition_id, group, caddies }
 * @type: 
 * @return {*} data.data.list
 */
export function batchAddCaddies(data, gl) {
  return request({
    url: "/wxmp/competition/caddieBatchAdd",
    data,
    method: "POST",
    gl: gl,
  });
}

/**
 * @description: 球局/踢出球童 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/球局/踢出球童
 * @param {*} data { competition_id, group }
 * @type: 
 * @return {*} data.data.list
 */
export function deleteCaddie(data, gl) {
  return request({
    url: "/wxmp/competition/caddieDel",
    data,
    method: "POST",
    gl: gl,
  });
}

/**
 * @description: 球局/保存球童（操作者为球童） http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/球局/保存球童（操作者为球童）
 * @param {*} data { competition_id, group, action: 0 退出, 1 加入}
 * @type: 
 * @return {*} data.data.list
 */
export function caddieSave(data, gl) {
  return request({
    url: "/wxmp/competition/caddieSave",
    data,
    method: "POST",
    gl: gl,
  });
}
