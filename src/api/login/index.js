/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */
import request from '@utils/https/index'
/**
 * @description: 登录信息
 * @param {*} data
 * @type: 
 * @return {*}
 */
export function userLogin(data) {
  return request({url: '/wxmp/user/login', data, token: false});
}