/*
 * @Author: simon
 * @Description:
 * @LastEditors: simon
 */
import { mutationsTypes, actionsTypes } from "./types"
import { userLogin } from "@api/login"
import { updateUserInfo, getUserInfo, getPlayedTimesList } from '@/api/user/index'
import { openAppFormShare } from '@utils/share/index'
import { realtimeLogger } from "@/mixins/gr-mp-logging";


const token = uni.getStorageSync("golf-token") || null;

const golfUserInfo = uni.getStorageSync("golf-userInfo");
const userInfo = golfUserInfo ? JSON.parse(golfUserInfo) : null;

const golfAcount = uni.getStorageSync("golf-acount");
const userAcount = golfAcount ? JSON.parse(golfAcount) : null;

export default {
  namespaced:true, // 带命名空间的模块
  state: {
    firstUserInfoLoaded: false,
    token: token, // token
    username: userInfo?.username,
    userInfo,   // 用户信息
    userAcount, // 用户的账户信息
    competitionRecord: null,
    evaluateAuthState: (userInfo) => {
      return !!(
        userInfo
        && userInfo.uid
        && userInfo.phone_number
        && userInfo.phone_number.length > 0
        // && userInfo.username
        // && userInfo.username.length > 0
      )
    },
  },
  getters: {
    userInfoAllSyncOnce: (state, getters, rootState) => {
      return state.firstUserInfoLoaded && rootState.flooim.firstProfileSynced
    },
    isLogin: (state) => {
      return !!(state.token && state.userInfo?.uid)
    },
    isAuth: (state, getters, rootState) => {
      return !!(state.token && state.evaluateAuthState(state.userInfo))
    },
    isWhiteList:(state) => {
      //57:🍀, 60:吉.吉, 68:fafa😎, 83:¿,67:齐宇,66:smleeee,77:派大鑫,520:golfroom管理员
      let whiteList = [57,60,68,83,67,66,77,520]
      return !!(state.token && state.userInfo?.uid && whiteList.indexOf(state.userInfo.uid) > -1)
    },
    userInfo : (state) => state.userInfo,
    isImAcount: (state) => {
      return !!state.userAcount?.im_id
    },
    userCompetitionRecord: (state) => state.competitionRecord
  },
  mutations: {
    [mutationsTypes.SET_TOKEN]: (state, res) => {
      state.token = res;
    },
    [mutationsTypes.SET_USER_INFO]: (state, res) => {
      state.userInfo = res;
      state.username = res.username;// 为了组件的computer or watch 监听得到
    },
    [mutationsTypes.SET_USER_ACOUNT]: (state, res) => {
      state.userAcount = res;
    },
    [mutationsTypes.SET_USER_COMPETITION_RECORD]: (state, res) => {
      state.competitionRecord = res
    }
  },
  actions: {
    [actionsTypes.CLEAR_LOGIN_INFO]: async ({ commit, state, dispatch }, payload) => {
      try {
        
        state.firstUserInfoLoaded = false;
        state.token = undefined;
        state.userInfo = undefined
        state.username = undefined;
        state.userAcount = undefined;

        uni.setStorageSync("golf-token", undefined);
        uni.setStorageSync("golf-userInfo", undefined);
        uni.setStorageSync("golf-acount", undefined);

        await dispatch('flooim/SET_IM_OUT', {}, {root: true});
        
        // uni.clearStorageSync(); // 环境设置应该不能清掉。

        // TODO: make it real logout, request API (not yet ready)
      } catch (e) {}
    },
    [actionsTypes.GET_TOKEN]: async ({ commit, state, dispatch }, payload) => {
      try {
        const {data: {data}} = await userLogin(payload);
        const {token, im_appid, im_admin_id} = data;
        commit('SET_TOKEN',token);
        commit('SET_USER_ACOUNT', data);

        uni.setStorageSync("golf-token", token);
        uni.setStorageSync("golf-acount", JSON.stringify(data));
      } catch (e) {
        realtimeLogger.rtError('GET_TOKEN error', e);
        console.error('GET_TOKEN', e);
      }
    },
    //获取用户信息
    [actionsTypes.GET_USER_INFO]: async ({ commit, state, dispatch, getters, rootState}, payload) => {
      try {
        
        var gl; // 默认显示 loading
        if (payload && payload.showLoadingWithData === false) {
          const golfUserInfo = uni.getStorageSync("golf-userInfo");
          const userInfo = golfUserInfo ? JSON.parse(golfUserInfo) : null;
          if (userInfo) {
            gl = false;
          }
        }
        
        const { data:{ data } } = await getUserInfo(undefined, gl);
        
        commit('SET_USER_INFO', data);

        uni.setStorageSync("golf-userInfo", JSON.stringify(data));

        state.firstUserInfoLoaded = true;

        if (getters.isImAcount) {
          await dispatch('flooim/ENSURE_IM_LOGIN', {}, {root: true});
        }

        if (payload.syncWithIM) {
          if(!rootState.flooim.isIMLogin) { // FIXME: `username` cannot be use for judgement?
            commit('flooim/SET_UP_IM_USER', true, {root: true})
          } else {
            await dispatch('flooim/SYNC_USER_INFO', {}, {root: true})
          }
        }

      } catch (e) {
        console.error('GET_USER_INFO', e);
      }
    },
    //更新用户信息
    [actionsTypes.UPDATE_USER_INFO]: async ({ commit, state, dispatch, rootState }, payload, gl) => {
      try {
        const res = await updateUserInfo(payload.data, payload.gl);

        await dispatch('GET_USER_INFO', { showLoadingWithData: payload.gl, syncWithIM: true });  //更新完查询用户信息获取uid
      } catch (error) {
        uni.showToast({ title: error?.data?.msg || "请稍后重试",icon:'error' });
      }
    },
    // 获取用户按时间统计比赛记录统计
    [actionsTypes.GET_USER_COMPETITION_RECORD]: async ({ commit }, data) => {
      const res = await getPlayedTimesList(data)
      commit(mutationsTypes.SET_USER_COMPETITION_RECORD, res.data.data || null)
    }
  }
};
