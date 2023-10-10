

import request from '@utils/https/index'


/**
 * @description: 获取小程序码 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/小程序/获取小程序码
 * @param {*} data `scene`: 小程序码scene参数
 * @type: 
 * @return {*}
 */
 export function getWxQRCode(data) {
     let gl = data.hasOwnProperty('gl') ? data.gl : true
  return request({url: '/wxmp/wx/getWxmpCode', method: 'GET', data, gl: gl});
 }


 /**
 * @description: 获取小程序scene参数 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/小程序/获取小程序scene参数
 * @param {*} data `scene`: 小程序码 scene 值，从小程序 QRCode 中解析出来（onShow 获取参数值）
 * @type: 
 * @return {*}
 */
 export function getWxQRCodeScene(data) {
  return request({url: '/wxmp/wx/getScene', method: 'GET', data});
}