/*
 * @Author: simon
 * @Description: 关于分享的方法,统一落地到首页，由首页跳转到目标页面
 * @LastEditors: simon
 */
import { getWxQRCodeScene } from "@/api/utils";
import { isString } from "@dcloudio/uni-i18n";
import store from "@store";
import { realtimeLogger } from '@mixins/gr-mp-logging.js'
import Vue from "vue";
import { isEmpty } from "..";
import * as router from "../router";

const defaultShareImage = 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/img_vx_share_01.png';

// 页面路由跳转类型
export const ROUTER_TYPE = { nav: 'navigateTo', st: 'switchTab', rl: 'reLaunch', rt:'redirectTo', }

// 把参数转成字符串
export const paramsToString = (arr) => arr.join('-');

export const PAGES = {
  chat: 'c', // Chatroom 跳转聊天室页面, 球局详情
  caddieInvite: 'cci', // ChatroomCaddieInvite
  profile: 'p', // Profile 用户主页
}

// 落地 page 的映射表
export const PAGES_ENUM = function () {
  const map = {};
  map[PAGES.chat] = toChat; // 跳转聊天室页面 params: [competition_id, group_id, uid]
  map[PAGES.caddieInvite] = toInviteCaddie; // 跳转球童邀请页面 params: { fUid, competitionId, group }
  map[PAGES.profile] = toProfile; // 跳转聊天室页面 params: [competition_id, group_id, uid]
  return map;
}()

// 页面选项类型
const OPTION_TYPE = {
  // 目标页面
  TO_PAGE: "tp",
}

// 球局详情分享类型
export const PAGE_CHAT_SHARE_TYPE = {
  share: "s",
  invite: "j"
}

/**
 * 生成页面分享参数， URI encoded。（如：'c=01-130-A-26', 生成后，变成 'c%3D01-130-A-26'），
 * @param {*} param0 
 * @returns 
 */
export function generatePageShareParamString({page, params}) {
  return encodeURIComponent(`${page}=${ Array.isArray(params) ? paramsToString(params) : JSON.stringify(params)}`);
}

/**
 * @description: 页面分享
 * @param {*} page 落地目标页面
 * @param {*} params []
 * @param {*} payload 页面分享参数
 * @return {*} 使用 const scene = shareAppMessage({page: 'c', params: [PAGE_CHAT_SHARE_TYPE.share, 93 , 'A', 35]})
 */
export function shareAppMessage({page, params}, payload) {
  // scene = encodeURIComponent('c=01-130-A-26')
  const pageParams = generatePageShareParamString({page, params})
  console.log('page params ====', pageParams, `${OPTION_TYPE.TO_PAGE}=${pageParams}`);
  console.log('share page payload ====', payload);
  return {path: `/pages/tabbar/home/index?${OPTION_TYPE.TO_PAGE}=${pageParams}`, ...payload};
}

/**
 * @description: 分享球局（房间）
 * @param {*} id 球局 id
 * @param {*} name 球局名称
 * @param {*} group 
 * @param {*} uid 分享者 uid
 * @return {*} 使用 const scene = shareAppMessage({page: 'c', params: [PAGE_CHAT_SHARE_TYPE.share,93, 'A', 35]})
 */
export function shareCompetition({ id, group, uid, shareRoomName, imageUrl = defaultShareImage }) {
  return shareAppMessage(
    {
      page: PAGES.chat,
      params: [PAGE_CHAT_SHARE_TYPE.share, id, group, uid]
    },
    {
      title: shareRoomName ? `${shareRoomName}` : '点击围观高球房间',
      imageUrl: imageUrl,
    }
  )
}
/**
 * @description: 分享球局邀请
 * @param {*} id 球局 id
 * @param {*} group 
 * @param {*} uid 分享者 uid
 * @return {*} 使用 const scene = shareAppMessage({page: 'c', params: ['01',93, 'A', 35]})
 */
export function shareCompetitionInvite({ id, group, uid, shareRoomName, imageUrl = defaultShareImage}) {
  return shareAppMessage(
    {
      page: PAGES.chat,
      params: [PAGE_CHAT_SHARE_TYPE.invite, id, group, uid]
    },
    {
      title: shareRoomName ? `邀请你来加入${shareRoomName}` : '点击进入高球房间',
      imageUrl: imageUrl,
    }
  )
}

/**
 * @description: 分享球局球童邀请
 * @param {*} cid 球局 id
 * @param {*} group 
 * @param {*} fUid 分享者 uid
 * @return {*} 使用 const scene = shareAppMessage({page: 'c', params: ['01',93, 'A', 35]})
 */
export function shareCompetitionCaddieInvite({
  cid,
  group,
  fUid,
  shareRoomName,
  imageUrl = defaultShareImage,
}) {
  return shareAppMessage(
    {
      page: PAGES.caddieInvite,
      params: {
        fUid: fUid,
        cid: cid,
        group: group,
      },
    },
    {
      title: shareRoomName ? `邀请你来${shareRoomName}记分` : "点击进入记分",
      imageUrl: imageUrl,
    }
  );
}

/**
 * @description: 分享用户主页
 * @param {*} uid 用户 id
 * @param {*} suid 分享者 uid
 * @return {*} 使用 const scene = shareAppMessage({page: 'c', params: ['01',93, 'A', 35]})
 */
export function shareUser({ uid, name, suid }) {
  return shareAppMessage(
    {
      page: PAGES.profile,
      params: [uid, suid]
    },
    {
      title: `${name}的主页`,
      // imageUrl: 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/img_vx_share_01.png'
    }
  )
}

/**
 * App.vue 中，监听 onLaunch、 onShow，所带的 options 参数，从分享的小程序链接中打开后
 * 会在小程序列表打开该小程序时，保持不变！
 */

// let lastOptions = null; // onLaunch/onShow 的 options
// /**
//  * @description: 打开小程序
//  * @return {*} options
//  */
// export function openAppFormShare({options, isReady}) {
//   if(!isReady) lastOptions = options; // 当前还没授权用户信息，先缓存起来留着
//   options = options || lastOptions;
  
//   console.log('openAppFormShare, authed', isReady)

//   // 携带scene参数
//   if(options?.query[OPTION_TYPE.TO_PAGE]) {
//     const scene = decodeURIComponent(options.query[OPTION_TYPE.TO_PAGE]);
//     handleToPage(scene, options.scene, isReady);
//   }

//   return options;
// }

let onLoadWatchDog = new Vue({
  data: {
    timer: null,
    actionTimer: null,
  },
  beforeDestroy() {
    this.stopMonitoring()
  },
  methods: {
    startMonitoring(onLoadParams) {
      this.stopMonitoring();
      uni.$emit("handle_onload_option_timeout", false);
      this.timer = setTimeout(() => {
        realtimeLogger.rtError("Onload watching timeout fully", onLoadParams);
      }, 10 * 1000);
      this.actionTimer = setTimeout(() => {
        if (uni.$emit == null) {
          realtimeLogger.rtError(
            "Onload watching cannot get uni.$emit",
            onLoadParams
          );
        }
        uni.$emit("handle_onload_option_timeout", true);
      }, 3 * 1000);
    },

    stopMonitoring() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = null;

      if (this.actionTimer) {
        clearTimeout(this.actionTimer);
      }
      this.actionTimer = null;
    },
  },
  
})

let lastOnloadOptions = null; 
/**
 * 首页 Onload 处理，主要针对分享链接打开之后的处理
 * @param {*} param0 
 * @returns 
 */
export async function handleOnload({ options, isReady }) {
  if (!isEmpty(options) || !isEmpty(lastOnloadOptions)) {
    realtimeLogger.rtInfo("handleOnload", options, lastOnloadOptions, isReady);
    onLoadWatchDog.startMonitoring();
  }

  if (!isReady) {
    if (options != undefined) {
      lastOnloadOptions = options; // 当前还没授权用户信息，先缓存起来留着
    }
    return options;
  }

  options = options || lastOnloadOptions;
  
  console.log('handleOnload', options, isReady)

  // 携带scene参数
  if(options && options[OPTION_TYPE.TO_PAGE]) {
    const pageAndParams = decodeURIComponent(options[OPTION_TYPE.TO_PAGE]);
    handleToPage(pageAndParams, options.scene, isReady);
  } if (options && isString(options['scene'])) {
    // 小程序二维码解析
    const scene = options['scene']
    try {
      const res = await getWxQRCodeScene({ scene: scene });
      const sceneParam = res.data.data.scene;
      if (sceneParam == null
        || isString(sceneParam) == false
        || sceneParam.length < 1) {
        throw {'msg': 'Empty "sceneParam"', data: res?.data}
      }
      const pageAndParams = decodeURIComponent(res.data.data.scene);
      handleToPage(pageAndParams, options.scene, isReady);
    } catch(e) {
      uni.showToast({
        title: '打开失败',
        icon: 'error',
      })
      console.error("option parse error", e);
      realtimeLogger.rtError('handleOnload option parse error', e)
    }
  }

  return options;
}

// 解析
export function handleToPage(pageAndParams, wcScene, isReady) {
  const [page, params] = pageAndParams.split('=');
  console.log("pageAndParams", pageAndParams);
  try {
    if (PAGES_ENUM[page] && PAGES_ENUM[page](params, wcScene, isReady)) {
      lastOnloadOptions = null; // 重置options的缓存
      onLoadWatchDog.stopMonitoring();
    }
  } catch (error) {
    realtimeLogger.rtError('handleToPage failed', error, pageAndParams, wcScene, isReady)
  }
}
// 处理跳转到聊天室
export function toChat(params, wcScene, isReady) {
  if(!isReady) return false;
  const page = '/pages/chat-room/index/index';
  const [shareType, id, group, uid] = params.split('-'); // [分享场景值, competition_id, group_id, uid]
  
  console.log('toChat params:', params)
  
  uni[ROUTER_TYPE.nav]({
    fail: (result) => {
      onLoadWatchDog.error('toChat', result, params, wcScene, isReady)
    },
    url: `${page}?&shareType=${shareType}&id=${id}&group=${group}&uid=${uid}`
  })

  return true;
}

// 处理跳转到聊天室
export async function toInviteCaddie(params, wcScene, isReady) {
  if (!isReady) return false;

  const shareObj = JSON.parse(decodeURIComponent(params) || `{}`)
  router.toInviteCaddie({
    fUid: shareObj.fUid,
    cid: shareObj.cid,
    group: shareObj.group,
    toast: true,
  });

  return true;
}

// 处理跳转用户主页
export function toProfile(params, wcScene, isReady) {
  if(!isReady) return false;
  const page = '/pages/tabbar/profile/UserProfile';
  const [uid, suid] = params.split('-'); // [分享场景值, competition_id, group_id, uid]
  
  console.log('toProfile params:', params)
  
  uni[ROUTER_TYPE.nav]({
    fail: (result) => {
      onLoadWatchDog.error('toProfile', result, params, wcScene, isReady)
    },
    url: `${page}?&uid=${uid}&sid=${suid}`
  })

  return true;
}