import { getUserIdFromImId, getImIdFromUid } from "@/api/user/index";


/**
 * 跳转用户主页
 * @param {*} { uid, imUid, toast = false } 
 * @returns 
 */
export const toUserProfile = async ({ uid, imUid, toast = false }) => {
  const errorHandling = (title) => {
    if (toast) {
      uni.showToast({
        title: title,
        icon: 'error',
        mask: true
      })
    }
  }

  let tUid = uid;

  if ((tUid == undefined || tUid < 1) && imUid) {
    const { data: { data } } = await getUserIdFromImId({ im_id: imUid }).catch(e => {
      console.error('Cannot get IM ID', e)
    })
    tUid = data.uid 
  }

  if (tUid == undefined) {
    console.error('参数错误', uid, imUid)
    toast && errorHandling('参数错误')
    return false
  }

  return await new Promise((resolve, reject) => {
    uni.navigateTo({
      url: `/pages/tabbar/profile/UserProfile?uid=${tUid}`,
      success: (res) => {
        resolve(true)
      },
      fail: (e) => {
        console.error(e);
        resolve(false)
      },
    });
  })
}


/**
 * 跳转用户聊天
 * @param {*} { uid, imUid, toast = false } 
 * @returns 
 */
export const toUserConversation = async ({ uid, imUid, toast = false }) => {
  const errorHandling = (title) => {
    if (toast) {
      uni.showToast({
        title: title,
        icon: 'error',
        mask: true
      })
    }
  }

  let tUid = uid;

  if ((tUid == undefined || tUid < 1) && imUid) {
    const { data: { data } } = await getUserIdFromImId({ im_id: imUid }).catch(e => {
      console.error('Cannot get IM ID', e)
    })
    tUid = data.uid 
  }

  if (tUid == undefined) {
    console.error('参数错误', uid, imUid)
    toast && errorHandling('参数错误')
    return false
  }

  return await new Promise((resolve, reject) => {
    uni.navigateTo({
      url: `/pages/common/im/conversation?uid=${tUid}&im_id=${imUid}&nick=`,
      success: (res) => {
        resolve(true)
      },
      fail: (e) => {
        console.error(e);
        resolve(false)
      },
    });
  })
}


let toInviteCaddiePromise = Promise.resolve(0);
/**
 * 邀请球童
 * @param {*} { uid, cid, toast = false } 
 * @returns 
 */
export const toInviteCaddie = async ({ fUid, cid, group, competitionData, toast = false }) => {
  await toInviteCaddiePromise
  
  const errorInfoHandling = (title) => {
    if (toast) {
      uni.showToast({
        title: title,
        icon: 'error',
        mask: true
      })
    }
  }

  let tCid = cid;

  if ((tCid == undefined || tCid < 1) && competitionData) {
    tCid = competitionData.competition_id 
  }

  if (fUid == undefined || tCid == undefined || group == undefined) {
    console.error('参数错误', `分享者：${fUid}`, `球赛：${cid}`, `分组：${group}`, `球赛详情：${competitionData}`)
    errorInfoHandling('参数错误')
    return false
  }

  toInviteCaddiePromise = await new Promise((resolve, reject) => {
    uni.navigateTo({
      url: `/pages/chat-room/caddie/invite/index?fUid=${fUid}&cid=${tCid}&group=${group}`,
      success: (res) => {
        // TODO: passing competition data
        resolve(cid);
      },
      fail: (e) => {
        console.error(e);
        errorInfoHandling('跳转失败')
        reject(tCid || 0);
      },
    });
  })

  return toInviteCaddiePromise;
}