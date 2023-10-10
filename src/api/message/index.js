
import request from '@utils/https/index'

/**
 * @description: 新信息标记, 是否有新消息。 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/信息/新信息标记
 * @param {*} gl
 * @type: 
 * @return {*}
 */
export function getHasNewMessage(gl, isResolve) {
  return request({url: '/wxmp/message/readTag', method: 'GET', gl, isResolve});
}

/**
 * @description: 阅读所有信息（标记所有信息已读） http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/信息/阅读所有信息
 * @param {*} gl
 * @type: 
 * @return {*}
 */
export function markMessageAllRead(gl) {
  return request({ url: '/wxmp/message/readAll', gl});
}

/**
 * @description: 信息列表 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/信息/%E4%BF%A1%E6%81%AF%E5%88%97%E8%A1%A8%E3%80%81%E6%A8%A1%E7%89%88
 * @param {*} gl
 * @type: 
 * @return {*}
 */
export function getMessageList(gl) {
  return request({url: '/wxmp/message/list', method: 'GET', gl});
}

/**
 * @description: 删除信息。 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/信息/删除信息
 * @param {*} data { message_id }
 * @type: 
 * @return {*}
 */
export function deleteMessage(data, gl) {
  return request({url: '/wxmp/message/del', data, gl});
}