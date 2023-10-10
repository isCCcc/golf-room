

import request from '@utils/https/index'


/**
 * @description: 获取微信手机号
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function getWxPhoneNumber(data) {
  return request({url: '/wxmp/user/getWxPhoneNumber', data});
}


/**
 * @description: 登录信息
 * @param {*} data
 * @type: 
 * @return {*}
 */
export function uploadAvatar(data) {
  return request({url: '/wxmp/user/uploadAvatar', data});
}


/**
 * @description: 用户信息
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function getUserInfo(data, gl) {
  return request({url: '/wxmp/user/info', data, method:'GET', gl: gl});
}

 /**
 * @description: 其它用户信息
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function getOtherUserInfo(data, gl) {
  return request({url: '/wxmp/user/get', data, method:'GET', gl: gl});
}

/**
 * @description: 更新用户信息
 * @param {*} data
 * @type: 
 * @return {*}
 */
 export function updateUserInfo(data, gl) {
  return request({url: '/wxmp/user/upd', data, gl});
}

/** 
 * 好友列表
 */
 export const getfriendList = (data) => {
  return request({
    url: '/wxmp/user/friendList',
    data: data,
    method: 'GET',
  })
}

/**
 * @description: 关注用户
 * @param {*} data { friend_uid }
 * @type: 
 * @return {*}
 */
export function followUser(data, gl) {
  return request({url: '/wxmp/user/addFriend', data, gl: gl});
}
/**
 * @description: 取消关注用户
 * @param {*} data { friend_uid }
 * @type: 
 * @return {*}
 */
export function unfollowUser(data, gl) {
  return request({url: '/wxmp/user/delFriend', data, gl: gl});
}
/**
 * @description: 关注列表 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/用户/关注列表
 * @param {*} data { start, count }
 * @type: 
 * @return {*} data.data.list
 */
export function getFollowingList(data, gl) {
  return request({url: '/wxmp/user/followList', method:'GET', data, gl: gl});
}
/**
 * @description: 粉丝列表 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/用户/粉丝列表
 * @param {*} data { start, count }
 * @type: 
 * @return {*} data.data.list
 */
export function getFansList(data, gl) {
  return request({url: '/wxmp/user/fansList', data, method:'GET', gl: gl});
}

/**
 * @description: 用户/搜索列表 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/用户/搜索列表
 * @param {*} data { start, count, keyword }
 * @type: 
 * @return {*} data.data.list
 */
export function searchUsers(data, gl) {
  return request({url: '/wxmp/user/searchList', data, method:'GET', gl: gl});
}


/**
 * @description: 通过 IM ID 获取我们的 UID http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/用户/imid获取uid
 * @param {*} data { im_id }
 * @type: 
 * @return {*} data.data.list
 */
export function getUserIdFromImId(data, gl) {
  return request({url: '/wxmp/user/getUidByImId', data, method:'GET', gl: gl});
}

/**
 * @description: 通过用户 UID， 获取用户 IM ID http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/用户/获取用户imid
 * @param {*} data { uid }
 * @type: 
 * @return {*} data.data.list
 */
export function getImIdFromUid(data, gl) {
  return request({url: '/wxmp/user/getImId', data, method:'GET', gl: gl});
}

/**
 * @description: 获取用户打过球场统计 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/用户/打过球场列表
 * @param {*}
 * @type: 
 * @return {*} data.data.list
 */
export function getPlayedCourseList(data) {
  return request({
    url: '/wxmp/user/playedCourseList',
    data,
    method:'GET',
    gl: true
  })
}

/**
 * @description: 获取用户比赛次数按时间统计 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/用户/比赛次数列表
 * @param {*}
 * @type: 
 * @return {*} data.data
 */
export function getPlayedTimesList(data) {
  return request({
    url: '/wxmp/user/playedTimesList',
    data,
    method:'GET',
    gl: true
  })
}
