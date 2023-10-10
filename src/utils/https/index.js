/*
 * @Author: max
 * @LastEditors: simon
 * @Description: request封装
 */
import store from "@store";
import { isEmptyObj } from "..";

function options({ data, method, timeout }) {
  return {
    method,
    data,
    timeout,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
    },
  };
}
let requestTime = 0; // 同时异步请求次数


function logout() {    
  getApp().$vm.$store
    .dispatch("user/CLEAR_LOGIN_INFO")
  
  // #ifdef MP-WEIXIN
  wx.reLaunch({
    url: '/pages/tabbar/home/index'
  })
  // #endif
}

/**
 * @description: 请求接口
 * @param {*} token: 默认true 是否要求携带token参数
 * @param {*} data: 提交参数 {}
 * @param {*} url: 地址
 * @param {*} lt: loading-title  loading 标题
 * @param {*} gl: gobal-loading 是否启用全局loading
 */
function Request({ url, token = true, data = {}, method = "POST", lt = "加载中", gl = true, timeout = 60000, isResolve = false }) {
  // 每调用一次，异步请求次数++
  if (gl) {
    requestTime++;
    // 添加loading事件
    uni.showLoading({
      title: `${lt}`,
      mask: true,
    });
  }
  // 接口依赖token
  if (token) data.token = store.state.user.token;

  // 请求后，需要 toast 的信息。
  var toastInfo = {};

  return new Promise((resolve, reject) => {
    uni.request({
      url: store.state.app.baseApi + url,
      ...options({ data, method, timeout }),
      success: (res) => {
        if (typeof res.data === 'string') return resolve(res)

        let { code, msg, data } = res.data;
        // 如果是业务错误/参数缺少   返回码也是0    data内容为false
        // if (!code && !data) return reject(res);
        // /* 20001 => '签名失败',50008 => '请先登录',50014 => '请重新登录', */
        // if ([20001, 50008, 50014].includes(code)) {
        //   return reject(res)
        // }

        // //todo 未登录的时候
        // if ([401].includes(code)) {
        //   uni.removeStorageSync('golf-token')
        //   return reject(res)
        // }

        // return resolve(res)
        if(isResolve) {
          return resolve(res)
        }

        // 成功处理
        if ((code === 0 && data) || (code && data)) {
          return resolve(res)
        }

        // 异常处理
        // /* 401 => 未登录的时候 20001 => '签名失败',50008 => '请先登录',50014 => '请重新登录', */
        if ([401, 50008, 50014].includes(code)) {
          logout()
        }

        // 50020 => 未获授权，相当于没有授权登录
        if ([50020].includes(code)) {
          this.grTryShowAuthorization();
        }

        toastInfo.icon = 'none';
        toastInfo.title = msg;
        toastInfo.duration = 2000;

        return reject(res)

      },
      fail: (err) => {
        toastInfo.icon = 'none';
        toastInfo.title = '网络开小差了，请稍后再试～';
        toastInfo.duration = 2000;
        
        reject(err)
      },
      complete() {
        // 请求完取消loading
        if (gl) {
          requestTime--;
          requestTime === 0 && uni.hideLoading();
        }

        if (isEmptyObj(toastInfo) == false) {
          uni.showToast(toastInfo);
        }
      },
    });
  });
}

export default function () {
  return Request(arguments[0]);
}
