/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */
import { mutationsTypes, actionsTypes } from './types'

export const APP_ENV_TYPES = {
  DEV: 'dev',
  PRO: 'pro'
}


let BASE_API = "https://api.golfroom.cn"
let BASE_API_DEV = BASE_API
if (process.env.NODE_ENV !== "production") {
  BASE_API_DEV = 'https://testgolf.ipyimatong.com';
}
const cachedAppEnv = uni.getStorageSync("gr-app-env") || APP_ENV_TYPES.PRO;
const baseApiFor = function (env) {
  if (env === APP_ENV_TYPES.DEV) {
    return BASE_API_DEV
  }
  return BASE_API;
};
const initialBaseApi = baseApiFor(cachedAppEnv);

export default {
  state: {
    appEnvType: cachedAppEnv || APP_ENV_TYPES.DEV,
    baseApi: initialBaseApi,
    config: {}, // 配置信息
    netConfig: {
      status: true,
      type: null // offline 为断网
    }, // 网络连接状态
    appHided: false,
    keyboardHeight: 0, // 键盘高度，全局监听
  },
  mutations: {
    [mutationsTypes.SET_CONFIG]: (state, res) => {
      state.config = res;
    },
    [mutationsTypes.SET_NET_CONFIG]: (state, res) => {
      state.netConfig = res;
    },
    [mutationsTypes.SET_KEY_BOARD_HEIGHT]: (state, height) => {
      state.keyboardHeight = height;
    },
    [mutationsTypes.SET_APP_HIDED]: (state, hided) => {
      state.appHided = hided;
    },

  },
  actions: {
    [actionsTypes.CHANGE_APP_ENV]: async ({ commit, state, dispatch }, payload) => {
      if (process.env.NODE_ENV != 'production') {
        state.baseApi = baseApiFor(payload);
        uni.setStorageSync("gr-app-env", payload);
      }
    },
  },
  getters: {
		
  },
};