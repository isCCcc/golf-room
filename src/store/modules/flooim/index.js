/*
 * @Author: simon
 * @Description:
 * @LastEditors: simon
 */
import flooim from "@/im/floo-2.0.0.uniapp";
import { mutationsTypes, actionsTypes } from "./types";
import { guid } from "@/utils";
import dayjs from "dayjs";
import { toNumber } from '@utils/third/tools';
import { throttle } from "@/utils/function-helper";
import { realtimeLogger } from "@/mixins/gr-mp-logging";
import pRetry from "p-retry";

const AUTO_LOGIN_DELAY = 2000; // ms
const AUTO_LOGIN_TIMES_MAX = 3; // 最多自动登录次数
let autoLoginTimes = 0; // 自动登录次数
const INIT_CHECK_TIMES_MAX = 20; // 最多初始化次数

export default {
  namespaced: true,
  state: {
    firstProfileSynced: false,
    isIMLogin: false,
    lastNotice: null,
    imInfo: {}, //实例化后的im配置信息
    imUserKick: false,
    imConfig: {
      // dnsServer: "https://dns.lanyingim.com/v2/app_dns",
      ws: true,
      autoLogin: true,
    }, // 配置信息
    upImUser: false, // 是否在登录之后更新im用户信息

    sendingMessagesList: [], // 自定义，发送中聊天记录

    throttledSettingConversationList: throttle((state, res) => {
      state.conversationList = res;
    }, 1000, true),
    /**
     * 回话列表，包含好友会话（roster）， 群组会话（group，暂时不包含聊天室类型。 type 1表示公开群，0表示私有群, 2表示聊天室）
     * 注意⚠️： 不要直接设置，用 `throttledSettingConversationList`
     */
    conversationList: [], 
  },
  getters: {
    
    /**
     * 会话未读信息数
     * @returns 
     */
    conversationsUnreadCount(state, getters) {
      return state.conversationList.reduce((pre, conv) => {
        return pre + conv.unread
      }, 0)
    },
  },
  mutations: {
    [mutationsTypes.SET_CONFIG]: (state, res) => {
      state.config = res;
    },
    [mutationsTypes.SET_IM_Info]: (state, res) => {
      state.imInfo = res;
    },
    [mutationsTypes.SET_IM_LAST_NOTICE]: (state, res) => {
      state.lastNotice = res;
    },
    [mutationsTypes.SET_IM_USER_KICK]: (state, res) => {
      state.imUserKick = res;
    },
    [mutationsTypes.SET_UP_IM_USER]: (state, res) => {
      state.upImUser = res;
    },
    [mutationsTypes.SET_FIRST_PROFILE_SYNC]: (state, res) => {
      state.firstProfileSynced = res;
    },
    [mutationsTypes.SET_IM_LOGIN_STATE]: (state, res) => {
      console.log('SET_IM_LOGIN_STATE', res);
      state.isIMLogin = res;
    },
    [mutationsTypes.SET_CONVERSATION_LIST]: (state, res) => {
      state.throttledSettingConversationList(state, res)
    },
  },
  actions: {
    // 检测当前IM是否init/auto login
    [actionsTypes.ENSURE_IM_LOGIN]: async ({ state, dispatch }) => {
      console.log('检测当前IM是否init/auto')
      const im = state.imInfo;
      if (!(im && im.isReady)) {
        await dispatch(actionsTypes.INIT_FLOOIM);
      }
      await dispatch(actionsTypes.WAIT_IM_READY_LOGIN, 0);
    },
    // 等待im初始化成功开始用户登录
    [actionsTypes.WAIT_IM_READY_LOGIN]: async({ commit, state, dispatch }, times) => {
      const im = state.imInfo;
      //通常来讲，初始化过程会非常快，但由于涉及网络调用，这个时间并无法保证；如果你的业务非常依赖初始化成功，请等待；
      if (im && im.isReady && im.isReady()) {
        console.log("flooim 初始化成功 ", times);
        // 开始登录
        dispatch(actionsTypes.SET_IM_LOGIN);
        return;
      }
      if (times < INIT_CHECK_TIMES_MAX) {
        setTimeout(() => dispatch(actionsTypes.WAIT_IM_READY_LOGIN, times + 1), 1000);
      } else {
        console.error("flooim 初始化失败，请重新初始化");
      }
    },
    // im 登录
    [actionsTypes.SET_IM_LOGIN]: async ({ commit, state, rootState, dispatch }) => {
      console.log('im-login')
      const im = state.imInfo;
      const {im_username, im_password} = rootState.user.userInfo;
      if (!(im && im.isLogin && im.isLogin()) || state.imUserKick == true) {
        // 未登录，需要登录
        await im.login({
          name: im_username,
          password: im_password
        });
      }
    },
    // 退出登录
    [actionsTypes.SET_IM_OUT]: ({ state }) => {
      console.log('SET_IM_OUT')
      state.imInfo.logout();
    },
    // 初始化配置
    [actionsTypes.INIT_FLOOIM]: ({ commit, state, dispatch, rootState }) => {
      console.log('start::NIT_FLOOIM')

      // 清理旧版本带来的数据
      {
        /**
         * 旧版本 SDK 由于逻辑问题，会产生一个 `XXXXXXX_key_roster_message_store` 的键值对。里面的数据是推送数据，比较大
         * 见 https://github.com/maxim-top/lanying-im-uniapp/issues/19
         */

        uni.getStorageInfo({
          success (res) {
            console.log('storage info', res)
            for (const key of res.keys) {
              if (key.endsWith('_key_roster_message_store') || key.endsWith('_key_group_message_store')) {
                try {
                  uni.removeStorageSync(key)
                } catch (error) {
                  console.error('cleaning old keys error,', key, error)
                }
              }
            }
          }
        })
      }

      const { imConfig } = state;
      const { im_appid: appid } = rootState.user.userAcount;
      const { dnsServer, ws, autoLogin } = imConfig;

      const logLevel = 'warn'; // debug|info|warn|error|off
      const config = {
        autoLogin,
        dnsServer,
        appid,
        ws,
        logLevel,
      };
      const im = flooim(config);
      commit("SET_IM_Info", im);

      state.sendingMessagesList = JSON.parse(uni.getStorageSync('golf-sending-msg-' + rootState.user.userInfo.uid) || '[]') 
      state.sendingMessagesList.forEach(msg => {
        // 重启后，将所有没有发送的，都标记成发送失败
        msg.g_send_status = 'failed'
      });

      console.log('end::NIT_FLOOIM', im.isReady())

      dispatch(actionsTypes.REMOVE_IM_LISTENERS);
      dispatch(actionsTypes.ADD_IM_LISTENERS);
    },
    // 开启事件监听
    [actionsTypes.ADD_IM_LISTENERS]: ({ commit, dispatch, state, rootState }) => {
      console.log('IM_LISTENERS ADD');
      const im = state.imInfo;
      if (!im) return;

      /**
       * 注意⚠️： 
       *  所有 IM 的消息监听，都在这里做，并且在最后转换成 uni 事件，通过 `uni.$emit` 发送出去。
       *  最后需要在 `im.off` 里取消 IM 消息监听
       */
      im.on({
        /**
         * 登录成功
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_loginsuccess
         * @param {*} res res	object	空对象
         */
        loginSuccess: (res) => {
          if (state.imUserKick == true) { // 暂时在被踢的情况下才去打印在线日志。
            realtimeLogger.rtInfo("IM on loginSuccess", res);
          }
          
          // 重置自动登陆
          autoLoginTimes = 0 
          
          commit(mutationsTypes.SET_IM_USER_KICK, false)

          dispatch('onLoginSuccess')

          // Lastly emit it
          // uni.$emit('im_loginSuccess', res)
        },

        /**
         * 登录失败
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_loginfail
         * @param {*} desc 
         * @returns 
         */
        loginFail: (desc) => {
          realtimeLogger.rtError("IM on loginFail", res);
          dispatch('onLoginFail', desc)

          // Lastly emit it
          // uni.$emit('im_loginFail', desc)
        },

        /**
         * Floo通知
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_floonotice
         * @param {*} res res.category	string	类别; res.desc	string	描述
         */
        flooNotice: (res) => {
          dispatch(actionsTypes.REFRESH_IM_LOGIN_STATE); // 刷新一下 IM 的登录状态
          const { category, desc } = res;
          console.log("Floo Notice: " + category + " : " + desc);
          switch (category) {
            case "action":
              if ("relogin" == desc) {
                if (autoLoginTimes >= AUTO_LOGIN_TIMES_MAX) {
                  console.log("自动登录失败次数过多，请手工登录。");
                  uni.showToast({ title: "请手工登录" });
                  dispatch(actionsTypes.SET_IM_OUT);
                  realtimeLogger.rtError(
                    "auto re-login failed",
                    autoLoginTimes,
                    res
                  );
                  autoLoginTimes = 0;
                } else {
                  console.log("Token失效，尝试自动登录中:", autoLoginTimes);
                  setTimeout(() => {
                    dispatch(actionsTypes.ENSURE_IM_LOGIN);
                  }, autoLoginTimes * AUTO_LOGIN_DELAY);
                  autoLoginTimes++;
                }
              } else if ("relogin_manually" == desc) {
                // relogin_manually // 需要手动登录
                uni.showToast({ title: "请重新登录" });
                dispatch(actionsTypes.SET_IM_OUT);
                realtimeLogger.rtError("relogin_manually", res);
              } else {
                console.log("Floo Notice: unknown action ", desc);
              }
              break;
            case "userNotice":
              commit(mutationsTypes.SET_IM_LAST_NOTICE, res);

              if (desc === "INFO_UPDATED") {
                // 用户信息改变：profile或setting
                // dispatch(actionsTypes.REFRESH_CONVERSATION_LIST)
              } else if (desc === "KICK_BY_SAME_DEVICE") {
                // 当前设备被相同设备踢下线
                realtimeLogger.rtInfo("KICK_BY_SAME_DEVICE", res);
                commit(mutationsTypes.SET_IM_USER_KICK, true);

                // 如果在前台，重新登陆？
                if (rootState.app?.appHided != true) {
                  dispatch(actionsTypes.ENSURE_IM_LOGIN);
                }
              }
            case "loginMessage":
              console.log("IM login message: ", desc);
              break;
            case "conversation_deleted":
              console.log("Floo Notice: 会话删除 ", desc);
              setTimeout(() => {
                // 稍后执行，防止 SDK 发送通知的时候，数据还没有删除，马上获取，会得到还没来得及删除的数据
                dispatch(actionsTypes.REFRESH_CONVERSATION_LIST);
              }, 0);
              break;
            default:
              console.log("Floo Notice: unknown category " + category);
          }

          // Lastly emit it
          uni.$emit('im_flooNotice', res)
        },

        /**
         * Floo错误
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_flooerror
         * @param {*} res res.category	string	类别; res.desc	string	描述
         */
        flooError: (res) => {
          const { category, desc } = res;
          switch (category) {
            case "USER_BANNED":
              uni.showToast({ title: "用户错误:" + desc });
              break;
            case "DNS_FAILED":
              uni.showToast({ title: "DNS错误: 无法访问 " + desc });
              break;
            case "LICENSE":
              uni.showToast({ title: "服务需要续费: " + desc });
              break;
            default:
              console.log("Floo Error: " + category + " " + desc);
          }

          realtimeLogger.rtError(
            "Floo Error: " + String(category) + " " + String(desc)
          );

          // Lastly emit it
          uni.$emit('im_flooError', res)
        },

        /**
         * 消息状态变更
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_onsendingmessagestatuschanged
         * @param {*} res res.status:	number	发送状态，取值为sending	failed	sent; res.mid:	number	客户端生成的client_mid
         */
        onSendingMessageStatusChanged: (res) => {
          dispatch('MESSAGE_SEND_STATE_CHANGE', res)

          // Lastly emit it
          uni.$emit('im_onSendingMessageStatusChanged', res)
        },

        /**
         * 消息状态变更：撤回/删除/已读
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_onmessagestatuschanged
         * @param {*} res res.uid	string	会话ID; res.mid	string	消息ID
         */
        onMessageStatusChanged: (res) => {
          // Lastly emit it
          uni.$emit('im_onMessageStatusChanged', res)
        },

        /**
         * 消息被撤回
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_onmessagerecalled
         * @param {*} res res.uid	string	会话ID; res.mid	string	消息ID;
         */
        onMessageRecalled: (res) => {
          console.log("消息被撤回：" + res.mid);
          dispatch('deleteMessage', res.mid)

          // Lastly emit it
          uni.$emit('im_onMessageRecalled', res)
        },

        /**
         * 收到历史消息 
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_onreceivehistorymsg
         * @param {*} res res.next	number	下次取历史消息的key
         */
        onReceiveHistoryMsg: (res) => {
          // Lastly emit it
          uni.$emit('im_onReceiveHistoryMsg', res)
        },
        
        /**
         * 收到群消息
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_ongroupmemberchanged
         * @param {*} groupId groupId	number	群ID
         */
        onGroupMemberChanged: (groupId) => {
          // Lastly emit it
          uni.$emit('im_onGroupMemberChanged', groupId)
        },
        
        /**
         * 收到群消息
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_ongroupmessage
         * @param {*} msg meta	Meta	消息内容
         */
        onGroupMessage: (msg) => {
          dispatch('RECEIVE_GROUP_MSG', msg)
          // dispatch(actionsTypes.REFRESH_CONVERSATION_LIST);

          // Lastly emit it
          uni.$emit('im_onGroupMessage', msg)
        },

        /**
         * 收到单聊消息
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_onrostermessage
         * @param {*} msg meta	Meta	消息内容
         */
        onRosterMessage: (msg) => {
          dispatch('RECEIVE_ROSTER_MSG', msg)
          console.log('onRosterMessage', msg);
          // dispatch(actionsTypes.REFRESH_CONVERSATION_LIST);
          
          // Lastly emit it
          uni.$emit('im_onRosterMessage', msg)
        },
        
        /**
         * 好友列表变更 
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_onrosterlistupdate
         * @param {*} meta meta	Meta	好友通知的消息内容
         */
        onRosterListUpdate: (meta) => { 
          dispatch(actionsTypes.REFRESH_CONVERSATION_LIST);

          // Lastly emit it
          uni.$emit('im_onRosterListUpdate', meta)
        },

        /**
         * 好友信息变更
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_onrosterinfoupdate
         * @param {*} res res.rosterIds	Array.<number>	好友的用户ID列表
         */
        onRosterInfoUpdate: (res) => {
          // FIXME: try to update partially

          if (!Array.isArray(res) || res.length < 1) {
            return;
          }

          // SDK 有逻辑错误。即便通过接口请求 roster info，没有数据返回的情况下，也会触发 `onRosterInfoUpdate`, 并且给出的是请求时的 roster IDs
          let validUpdate = true
          for (const rid of res) {
            const rosterInfo = state.imInfo.rosterManage.getRosterInfo(rid);
            // rosterInfo 可能是 {user_id: XXXXX}
            if (rosterInfo == null || Object.getOwnPropertyNames(rosterInfo).length < 2) {
              validUpdate = false
              break
            }
          }
          // 在有效更新的情况下，才刷新列表。避免 REFRESH_CONVERSATION_LIST 中请求 rosterInfo，造成循环。
          if (validUpdate) {
            dispatch(actionsTypes.REFRESH_CONVERSATION_LIST);
          }

          // Lastly emit it
          uni.$emit('im_onRosterInfoUpdate', res)
        },

        /**
         * 
         * https://docs.lanyingim.com/reference/floo-web/types.html#event_onunreadchange
         * @param {*} cid	number	会话ID 可能是 rid (roster id), gid (group id), mid (message id)
         */
        onUnreadChange: (cid) => {
          // if cid === 0, or === my IM UID, it could be competition push logic
          if (toNumber(cid) !== 0 && toNumber(im.userManage.getUid()) !== toNumber(cid)) {
            dispatch(actionsTypes.REFRESH_CONVERSATION_LIST)
          }

          // Lastly emit it
          uni.$emit('im_onUnreadChange', cid)
        },
      });
    },
    // 移除im的监听
    [actionsTypes.REMOVE_IM_LISTENERS]: ({ state }) => {
      console.log('IM_LISTENERS REMOVE');
      const im = state.imInfo;
      if (im) {
        console.log('移除im的监听')
        im.off('loginSuccess', () => {});
        im.off('loginFail', () => {});
        im.off('flooNotice', () => {});
        im.off('flooError', () => {});
        im.off('onSendingMessageStatusChanged', () => { });
        im.off('onMessageStatusChanged', () => { });
        im.off('onMessageRecalled', () => { });
        im.off('onReceiveHistoryMsg', () => { });
        im.off('onGroupMemberChanged', () => { });
        im.off('onGroupMessage', () => { });
        im.off('onRosterMessage', () => { });
        im.off('onRosterListUpdate', () => { });
        im.off('onRosterInfoUpdate', () => { });
        im.off('onUnreadChange', () => {});
      }
    },
    // 登录成功
    onLoginSuccess: ({ state, dispatch, commit, rootState }) => {
      dispatch(actionsTypes.REFRESH_IM_LOGIN_STATE) // 刷新一下 IM 的登录状态
      wx.hideLoading(); 
      if(state.upImUser) {
        dispatch(actionsTypes.SYNC_USER_INFO);
      }
    },
    // 登录出错
    onLoginFail({ dispatch }, msg) {
      dispatch(actionsTypes.REFRESH_IM_LOGIN_STATE) // 刷新一下 IM 的登录状态
      wx.hideLoading();
      uni.showToast({
        title: "登录出错:" + msg,
      });
    },
    // 消息被撤回
    deleteMessage(mid) {
      // refresh ui
    },

    // 同步当前信息到 IM
    [actionsTypes.SYNC_USER_INFO]: async ({ state, commit, dispatch, rootState }, payload) => {
      console.log('SYNC_USER_INFO')
      const updateUserInfoFunc = async () => {
        const res = await dispatch(
          actionsTypes.UPDATE_USER_IM_INFO,
          {
            userInfo: rootState.user.userInfo,
            notAuth: rootState.user.evaluateAuthState(rootState.user.userInfo) ? 0 : 1
          }
        );
        if (res.error) {
          // 被 pRetry 包裹的时候，如果不是 Error， 会出现异常：TypeError: Non-error was thrown: "[object Object]". You should only throw errors.
          if (res.error instanceof Error) {
            throw res.error
          } else {
            throw new Error(JSON.stringify(res.error))
          }
        }
      }
      const syncResult = {}
      try {
        await pRetry(updateUserInfoFunc, {
          // retries: 3,
          maxRetryTime: 3 * 1000,
          onFailedAttempt: async (e) => {
            {
              // Test code
              console.log("SYNC_USER_INFO with failed attempt", e);
            }
            await new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 300);
            });
          },
        });
      } catch (error) {
        console.error("SYNC_USER_INFO with retry failed", `[Is IM login? ${state.isIMLogin}, last notice: ${state.lastNotice}]`, error);
        realtimeLogger.rtError("SYNC_USER_INFO with retry failed", `[Is IM login? ${state.isIMLogin}, last notice: ${state.lastNotice}]`, error);
        syncResult.error = error
      }

      console.log('SYNC_USER_INFO result', syncResult)

      if (!syncResult.error) {
        commit(mutationsTypes.SET_FIRST_PROFILE_SYNC, true);
        commit(mutationsTypes.SET_UP_IM_USER, false);
      }

      return syncResult;
    },

    // 更新im的用户信息
    [actionsTypes.UPDATE_USER_IM_INFO]: async ({state, rootState}, payload) => {
      console.log('flooIm UPDATE_USER_IM_INFO-payload', payload)
      let result = {};
      try {
        // 更新部分信息时，有可能为空
        const { avatar_url, username, gender } = payload.userInfo;
        const not_auth = payload.notAuth
      
        if (avatar_url) { // 新用户可能为空
          await state.imInfo.userManage.asyncUpdateAvatar({ avatar: avatar_url });
        }

        if (username) { // 可能为空，
          await state.imInfo.userManage.asyncUpdateNickName({nick_name: username});
        }

        const profile = await state.imInfo.userManage.asyncGetProfile()
        if (username) { // 可能为空，
          profile.nick_name = username;
        }
        const publicInfo = JSON.parse(profile.public_info || '{}')
        if (gender != undefined) {
          publicInfo.gender = gender;
        }

        if (not_auth != null) {
          publicInfo.not_auth = not_auth;
        }

        profile.public_info = JSON.stringify(publicInfo)
        await state.imInfo.userManage.asyncUpdateProfile(profile);
      
        // 尝试更新 roster 里面的信息，避免修改后，聊天室内缓存的还是旧数据, 比如昵称还是旧的。
        await state.imInfo.rosterManage.asyncGetRosterInfo(profile.user_id, true);

      } catch (err) {
        realtimeLogger.rtError('UPDATE_USER_IM_INFO-err', `[Is IM login? ${state.isIMLogin}, last notice: ${state.lastNotice}]`,  err)
        console.log('UPDATE_USER_IM_INFO-err', `[Is IM login? ${state.isIMLogin}, last notice: ${state.lastNotice}]`, err)

        result.error = err
      }
      return result
    },

    // 发送 group 消息
    [actionsTypes.SEND_GROUP_MESSAGE]: async ({state, dispatch, rootState}, msg) => {
      try {
        // 通过 GUID 标记消息, 用于跟踪消息的发送情况。发送成功后，成功的消息，返回回来，是没有本地用于标记消息的 client_mid 的。
        const msgExt = JSON.parse(msg.ext || '{}')
        if (msgExt.g_msg_guid == undefined) {
          msgExt.g_msg_guid = guid();
          msg.ext = JSON.stringify(msgExt);
        }
        
        const sendingMessagesList = state.sendingMessagesList;
        for (var index = sendingMessagesList.length - 1; index >= 0; index--) {
          const oldMsg = sendingMessagesList[index];
          const oldMsgExt = JSON.parse(oldMsg.ext || '{}')
          // 清除相同 guid 的旧消息。比如重新发送失败的消息
          if (msgExt.g_msg_guid && msgExt.g_msg_guid === oldMsgExt.g_msg_guid) {
            sendingMessagesList.splice(index, 1)
          }
        }

        // 保存发送中的消息
        sendingMessagesList.push(msg);

        const mid = state.imInfo.sysManage.sendGroupMessage(msg);
        msg.g_client_mid = mid; // 这个是他们的 client_mid, 发送成功前，用于本地标记的 message id
        msg.timestamp = mid.toString(); // mid 也是一个 timestamp
        msg.isSelf = true;
        // 根据网络状态设置消息发送状态，如果没有网络，就 'failed'
        msg.g_send_status = rootState.app.netConfig.status ? 'sending' : 'failed'

        // 保存到本地
        dispatch('clearAndSaveSendingMsg');
      } catch (err) {
        console.log("SEND_GROUP_MESSAGE with error", err)
      }
    },

    // 发送 group 消息
    [actionsTypes.SEND_ROSTER_MESSAGE]: async ({state, dispatch, rootState}, msg) => {
      try {
        // 通过 GUID 标记消息, 用于跟踪消息的发送情况。发送成功后，成功的消息，返回回来，是没有本地用于标记消息的 client_mid 的。
        const msgExt = JSON.parse(msg.ext || '{}')
        if (msgExt.g_msg_guid == undefined) {
          msgExt.g_msg_guid = guid();
          msg.ext = JSON.stringify(msgExt);
        }
        
        const sendingMessagesList = state.sendingMessagesList;
        for (var index = sendingMessagesList.length - 1; index >= 0; index--) {
          const oldMsg = sendingMessagesList[index];
          const oldMsgExt = JSON.parse(oldMsg.ext || '{}')
          // 清除相同 guid 的旧消息。比如重新发送失败的消息
          if (msgExt.g_msg_guid && msgExt.g_msg_guid === oldMsgExt.g_msg_guid) {
            sendingMessagesList.splice(index, 1)
          }
        }

        // 保存发送中的消息
        sendingMessagesList.push(msg);

        const mid = state.imInfo.sysManage.sendRosterMessage(msg);
        msg.g_client_mid = mid; // 这个是他们的 client_mid, 发送成功前，用于本地标记的 message id
        msg.timestamp = mid.toString(); // mid 也是一个 timestamp
        msg.isSelf = true;
        // 根据网络状态设置消息发送状态，如果没有网络，就 'failed'
        msg.g_send_status = rootState.app.netConfig.status ? 'sending' : 'failed'

        // 保存到本地
        dispatch('clearAndSaveSendingMsg');
      } catch (err) {
        console.log("SEND_ROSTER_MESSAGE with error", err)
      }
    },

    // 消息发送状态改变
    [actionsTypes.MESSAGE_SEND_STATE_CHANGE]: async ({ state, dispatch }, { status, mid }) => {
      console.log("MESSAGE_SEND_STATE_CHANGE", status, mid)
      try {
        
        var changed = false;
        const sendingMessagesList = state.sendingMessagesList;
        for (var index = sendingMessagesList.length - 1; index >= 0; index--) {
          const oldMsg = sendingMessagesList[index];          
          if (oldMsg.g_client_mid && oldMsg.g_client_mid === mid) {
            oldMsg.g_send_status = status
            if (status === 'sent') {
              sendingMessagesList.splice(index, 1)
              changed = true;
              console.log("message sent", oldMsg.content)
            }
          }
        }

        if (changed) {
          // 改变后保存到本地
          dispatch('clearAndSaveSendingMsg')
        }
      } catch (err) {
        console.log("MESSAGE_SEND_STATE_CHANGE with error", err)
      }
    },
    
    // 收到 group 消息
    [actionsTypes.RECEIVE_GROUP_MSG]: async ({ state, dispatch }, msg) => {
      dispatch(actionsTypes.RECEIVE_IM_MSG, msg)
    },

    // 收到 roster 消息
    [actionsTypes.RECEIVE_ROSTER_MSG]: async ({ state, dispatch }, msg) => {
      dispatch(actionsTypes.RECEIVE_IM_MSG, msg)
    },

    [actionsTypes.RECEIVE_IM_MSG]: async ({ state, dispatch }, msg) => {
      try {
        if (msg.ext === undefined) return;

        const msgExt = JSON.parse(msg.ext || '{}')

        if (msgExt.g_msg_guid) {
          var changed = false;
          const sendingMessagesList = state.sendingMessagesList;
          for (var index = sendingMessagesList.length - 1; index >= 0; index--) {
            const oldMsg = sendingMessagesList[index];
            const oldMsgExt = JSON.parse(oldMsg.ext || '{}')
            // 清除相同 guid 的，发送中的消息。
            if (msgExt.g_msg_guid === oldMsgExt.g_msg_guid) {
              sendingMessagesList.splice(index, 1)
              changed = true;
            }
          }

          if (changed) {
            // 改变后保存到本地
            dispatch('clearAndSaveSendingMsg')
          }
        }
      } catch (err) {
        console.log("RECEIVE_IM_MSG with error", err)
      }
    },



    // 清理并保存发送中的消息
    clearAndSaveSendingMsg({ rootState, state }) {
      const sendingMessagesList = state.sendingMessagesList;
      for (var index = sendingMessagesList.length - 1; index >= 0; index--) {
        const msg = sendingMessagesList[index];
        const timestamp = msg.timestamp || msg.g_client_mid;
        // 删除 7 天前的，还在发送中的消息。
        if (dayjs().subtract(7, 'day').isAfter(toNumber(timestamp))) {
          sendingMessagesList.splice(index, 1)
        }
      }

      uni.setStorageSync("golf-sending-msg-" + rootState.user.userInfo.uid, JSON.stringify(sendingMessagesList));
    },

    /**
     * 根据 IM IDs，强制更新用户 IM 方面信息。目前用于修改改名，聊天室昵称没有变化的问题
     * @param {*} param0 
     * @param {*} payload 
     */ 
    [actionsTypes.REFRESH_ROSTERS_INFO]: async ({ state, dispatch }, payload) => {
      for (const rosterImId of payload) {
        console.log('REFRESH_ROSTERS_INFO', rosterImId);
        try {
          await state.imInfo.rosterManage.asyncGetRosterInfo(rosterImId, true);
        } catch (error) {
          console.warn('REFRESH_ROSTERS_INFO, cannot load Roster info', rosterImId, error)
        }
      }
    },

    [actionsTypes.REFRESH_IM_LOGIN_STATE]: async ({ state, commit, dispatch }, payload) => {
      const im = state.imInfo;
      commit(mutationsTypes.SET_IM_LOGIN_STATE, !!(im && im.isLogin && im.isLogin()))
    },


    /**
     * 刷新会话列表
     * @param {*} param0 
     * @param {*} payload 
     */
    [actionsTypes.REFRESH_CONVERSATION_LIST]: async ({ state, commit, dispatch }, payload) => {
      console.log('REFRESH_CONVERSATION_LIST');
      const im = state.imInfo
      const myImId = im.userManage.getUid();

      let convList = im.userManage.getConversationList();
      convList = convList.filter((x) => x.id !== myImId);

      // 排除一下系统消息（现在系统消息用于球局详情相关推送）
      convList = convList.filter((x) => x.id !== 0);
      
      // 尝试加载用户数据
      const rosterIds = convList.filter((x) => x.type === 'roster' && x.id !== 0).map((x) => x.id)
      await im.rosterManage.asnycGetRosterListDetailByIds(rosterIds)
      // 从缓存中获取用户数据
      const allRosterMap = im.rosterManage.getAllRosterDetail() || {};

      // 尝试加载群数据
      const groupIds = convList.filter((x) => x.type === 'group').map((x) => x.id)
      // await im.groupManage.asyncGetGroupListDetail(groupIds)
      groupIds.forEach(async gid => {
        await im.groupManage.asyncGetGroupInfo(gid)  
      });
      // 从缓存中获取群数据
      const allGroupMap = im.groupManage.getAllGroupDetail();

      // 排除聊天室类型的 group，现在这个类型用于球局详情里
      convList = convList.filter((x) => {
        return !(x.type === 'group' && (allGroupMap[x.id] || {}).type === 2)
      });
      
      const convListWithCount = convList.map((item, index) => {
        let name;
        const id = item.id;
        const content = item.content;
        const timestamp = item.timestamp;
        let avatar = '';
        const unreadCount = item.type == 'roster' ? im.rosterManage.getUnreadCount(id) : im.groupManage.getUnreadCount(id);
        const unread = unreadCount > 0 ? unreadCount : 0;
        let public_info = {}

        if (item.type === 'roster') {
          //roster
          const sRoster = allRosterMap[id] || { user_id: id };
          name = sRoster.nick_name || sRoster.username || (sRoster.user_id === 0 ? '系统消息' : sRoster.user_id);
          avatar = im.sysManage.getImage({
            avatar: sRoster.avatar,
            sdefault: '/static/pages/image/r.png'
          });

          try {
            public_info = JSON.parse(sRoster.public_info || '{}')
          } catch (error) {
            console.error('Cannot parse public info', error);
          }
        } else if (item.type === 'group') {
          //group
          const sGroup = allGroupMap[id] || {};
          name = sGroup.name || id;
          avatar = im.sysManage.getImage({
            avatar: sGroup.avatar,
            type: 'group',
            sdefault: '/static/pages/image/g.png'
          });
        }

        return {
          sid: id,
          type: item.type,
          index,
          name,
          content,
          timestamp,
          avatar,
          public_info,
          unread,
        };
      });

      const sortedConvList = convListWithCount.sort((a, b) => {
        return a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0;
      });
      commit(mutationsTypes.SET_CONVERSATION_LIST, sortedConvList)
    },
  },
};
