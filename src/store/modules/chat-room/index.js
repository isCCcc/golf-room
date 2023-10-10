/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */

import { mutationsTypes, actionsTypes } from "./types";
import { getCompetitionDetail, teeColorList, getCompetitorImIdList } from '@api/chat-room/index'
import { calcRecord, detailData } from '@pages/chat-room/index/utils'
import { toNumber } from "@/utils/third/tools";
import { isEmptyObj } from "@/utils";
import { getOtherUserInfo } from '@/api/user'


const groupMappingLoading = () => {
  var map = {}
  try {
    const groupMappingJSON = uni.getStorageSync('com-cur-groups-map')
    map = JSON.parse(groupMappingJSON)
  } catch (e) { }
  return map;
}

export default {
  state: {
    // ===== 不可重置 ===== //

    teeColorList: [], // tee颜色列表, 这个暂时是全局使用，不能重置

    // ===== 可重置 ===== //

    competition_id: 0, // 球赛 ID
    competitionData: {}, // 球赛信息
    memberList: [], // 群会员列表
    scoreboardH: 0, // 计分板高度
    // allTimes: {}, // 所有时间
    messagesList: [], // 当前聊天记录, 注意，这里仅保存服务器返回的消息。不是本地发送中的消息
    localMessagesList: [], // 当前房间本地消息，如新成员进入房间的消息，不会发送的消息。
    groupId: null, // 群id
    groupReady: false, // 群是否准备好
    usersImId: [], // 球局参赛成员的im id。注意⚠️：这个数据，需要另外请求，有可能和 competitionData 中的数据不同步。

    queryHistoryMessageId: 0, // 历史记录查询开始id
    queryHistoryRecords: {}, // map of sid:queryTimes

    groupMapping: groupMappingLoading(), // 分组
    isNowGroup: 'A', // 当前操作的组
    sendWrapperH: 0
  },
  mutations: {
    // 球赛id
    [mutationsTypes.SET_COMPETITION_ID]: (state, data) => {
      state.competition_id = data;
    },
    // 球赛信息
    [mutationsTypes.SET_COMPETITION_DATA]: (state, data) => {
      if (isEmptyObj(data) // 空对象，用于清空数据
        || (data.time && data.time >= (state.competitionData.time || 0))) // 判断数据时间
      {
        state.competitionData = data;
        return true;
      } else {
        return false;
      }
    },
    // 球赛信息(item)
    [mutationsTypes.SET_COMPETITION_ITEM]: (state, { key, data }) => {
      state.competitionData[key] = data;
    },
    // Tee颜色列表
    [mutationsTypes.SET_TEE_COLOR]: (state, data) => {
      state.teeColorList = data;
    },
    // 群会员列表
    [mutationsTypes.SET_MEMBER_LIST]: (state, data) => {
      state.memberList = data;
    },
    // 计分板高度
    [mutationsTypes.SET_SCOREBOARD_HEIGHT]: (state, data) => {
      state.scoreboardH = data;
    },
    // 修改message
    [mutationsTypes.SET_MESSAGE]: (state, data) => {
      state.messagesList = data;
    },
    // 添加一条message
    [mutationsTypes.SET_ADD_MESSAGE]: (state, data = {}) => {
      const newMsg = data;
      const messagesList = state.messagesList;

      /**
       * 是否包含相同的信息
       */ 
      var containSame = false;
      var targetIndex = -1;
      for (var index = 0; index < messagesList.length; index++) {
        const oldMsg = messagesList[index];
        if (toNumber(oldMsg.id) === toNumber(newMsg.id)) {
          containSame = true
          break;
        }
        if (toNumber(oldMsg.timestamp) > toNumber(newMsg.timestamp)) {
          targetIndex = index;
          break;
        }
      }
      if (containSame) {
        // 相同 id 的信息，不插入。
        return;
      }
      else {
        if (targetIndex > -1) {
          messagesList.splice(targetIndex, 0, newMsg)
          return
        } else {
          messagesList.push(newMsg)
          return
        }
      }
    },
    
    // 添加一条本地 message
    [mutationsTypes.SET_ADD_LOCAL_MESSAGE]: (state, data = {}) => {
      const newMsg = data;
      const localMessagesList = state.localMessagesList;
      var newMsgExt = undefined;
      try {
        newMsgExt = JSON.parse(newMsg.ext)
      } catch (e) {
        console.error('Failed to parse newMsgExt'), newMsg.ext
      }

      /**
       * 是否包含相同的信息
       */ 
      var containSame = false;
      var targetIndex = -1;
      var removeIndexes = [];
      for (var index = 0; index < localMessagesList.length; index++) {
        const oldMsg = localMessagesList[index];
        var oldMsgExt = undefined;
        try {
          oldMsgExt = JSON.parse(oldMsg.ext)
        } catch (e) {
          console.error('Failed to parse oldMsgExt'), newMsg.ext
        }
        
        if (toNumber(oldMsg.id) === toNumber(newMsg.id)) {
          containSame = true
          break;
        } else if (newMsgExt?.msg_type == 'enter_room'
          && newMsgExt?.msg_type == oldMsgExt?.msg_type
          && newMsgExt?.im_id == oldMsgExt?.im_id) { // 同一个人的进入消息，不提示两次。 注意 ⚠️： 这里 user_id 是 im 的用户 id。
          containSame = true
          break;
        } else if (newMsgExt?.msg_sub_type == 'competition_end'
          && newMsgExt?.msg_sub_type == oldMsgExt?.msg_sub_type) { 
          removeIndexes.push(index);
          continue;
        // } else if (newMsgExt?.msg_type == 'announcement' && newMsgExt.im_id == oldMsgExt.im_id) { // 同一个人的进入消息，不提示两次。 注意 ⚠️： 这里 user_id 是 im 的用户 id。
        //   containSame = true
        //   break;
        }

        if (toNumber(oldMsg.timestamp) > toNumber(newMsg.timestamp)) {
          targetIndex = index;
          break;
        }
      }
      if (containSame) {
        // 判定相同，不插入。
        return;
      }
      else {
        // 倒叙删除需要删除的
        for (var rIndex = removeIndexes.length - 1; rIndex >= 0; rIndex--) {
          localMessagesList.splice(rIndex, 1)  
        }

        targetIndex -= removeIndexes.length;

        if (targetIndex > -1) {
          localMessagesList.splice(targetIndex, 0, newMsg)
          return
        } else {
          localMessagesList.push(newMsg)
          return
        }
      }
    },
    
    // 群id
    [mutationsTypes.SET_GROUP_ID]: (state, data) => {
      state.groupId = data;
    },
    // 群聊是否准备好
    [mutationsTypes.SET_GROUP_READY]: (state, ready) => {
      state.groupReady = ready;
    },
    // 球局成员im id
    [mutationsTypes.SET_USERS_IM_ID]: (state, data) => {
      state.usersImId = data;
    },
    [mutationsTypes.SET_SEND_WRAPPER_HEIGHT]: (state, data) => {
      state.sendWrapperH = data;
    },
  },
  actions: {
    // 球赛信息
    [actionsTypes.GET_COMPETITION_DETAIL]: async ({ commit, state, rootState }, payload) => {
      let { data: { data } } = await getCompetitionDetail(payload);

      
      
      // // 为了分享时，可以获取到房间创建者的名称
      // if (data.uid !== rootState.user.userInfo.uid) {
      //   try {
      //     const res = await getOtherUserInfo({uid: data.uid}, false)
      //     data.gr_host = res.data.data
      //   } catch (error) {
      //     console.error('Cannot get room host info', error)
      //   }
      // } else {
      //   data.gr_host = rootState.user.userInfo
      // }
      
      detailData(data);
      
      // 计算球洞分数
      calcRecord(data, []);
      
      // 尝试补充数据获取时间。
      if (data.time == undefined) {
        data.time = new Date().getTime()
      }

      commit(mutationsTypes.SET_COMPETITION_DATA, data);
      return data;
    },
    // Tee颜色列表
    [actionsTypes.GET_TEE_COLOR]: async ({ commit, state },) => {
      // 有缓存读缓存
      // let cacheTeeColor = uni.getStorageSync('golf-tee-color');
      const cacheTeeColor = [{"color":"#FF7777","label":"红","value":1},{"color":"#FFFFFF","label":"白","value":2},{"color":"#41A2FF","label":"蓝","value":3},{"color":"#CABD8E","label":"金","value":4},{"color":"#000000","label":"黑","value":5}];
      if (cacheTeeColor) {
        return commit(mutationsTypes.SET_TEE_COLOR, cacheTeeColor);
      }
      // 无缓存请求接口
      /* let { data: { data } } = await teeColorList();
      const teeData = data?.filter(e => e.value) || [];
      uni.setStorageSync('golf-tee-color', teeData)
      commit(mutationsTypes.SET_TEE_COLOR, teeData); */
    },
    // 球局成员imid
    [actionsTypes.GET_USERS_IM_ID]: async ({ commit, state }, payload) => {
      let { data: { data } } = await getCompetitorImIdList(payload);
      commit(mutationsTypes.SET_USERS_IM_ID, data)

    },

    // 更新当前球赛的操作分组
    [actionsTypes.UPDATE_CUR_GROUP]: ({state}, group) => {
      var oldGroup = state.groupMapping[state.competition_id]
      var targetGroup = state.isNowGroup;
      if (group == undefined) { // 如果传入 undefined，则加载历史数据
        targetGroup = oldGroup || 'A';
      } else {
        if (state.competitionData?.group_list.includes(group)) {
          targetGroup = group; 
        }
      }

      state.isNowGroup = targetGroup;
      // 改变了就保存
      if (oldGroup !== targetGroup) {
        state.groupMapping[state.competition_id] = targetGroup;
        uni.setStorageSync('com-cur-groups-map',  JSON.stringify(state.groupMapping))
      }
    },
    
    /**
     * 清除 chat room （比赛详情）数据，防止数据被不同比赛的同一个界面复用
     * @param {*} param0 
     * @param {*} group 
     */
    [actionsTypes.CLEAR_CHAT_ROOM]: ({ state }) => {
      // state.teeColorList = []; 

      state.competition_id = 0;
      state.competitionData = {};
      state.memberList = [];
      state.scoreboardH = 0;
      state.messagesList = [];
      state.localMessagesList = [];
      state.groupId = null;
      state.groupReady = false;
      state.usersImId = [];
      state.queryHistoryMessageId = 0;
      state.queryHistoryRecords = {};
      state.groupMapping = groupMappingLoading();
      state.isNowGroup = "A";
      state.sendWrapperH = 0;
    },

  },

  getters: {
    // 球赛信息
    getCompetitionData(state) {
      return state.competitionData
    },
    // Tee颜色列表
    getTeeColorList(state) {
      return state.teeColorList;
    },
    // 群会员列表
    getMemberList(state) {
      return state.memberList;
    },
    // 群普通成员列表
    getGroupMembers(state) {
      // 删除管理员
      return state.memberList.filter(e => !(e.nick_name === 'admin' && !e.avatar))
    },
    // 观赛成员列表
    getWatchMembers(state, rootGetters, rootState) {
      
      let watcherList = state.memberList.filter(e => !(e.user_id == rootState.user.userAcount?.im_admin_id) && !state.usersImId.some(u => u.im_id == e.user_id))
      watcherList = watcherList.sort((a, b) => b.join_time - a.join_time);
      
      return watcherList;
    },
    // 计分板高度
    getScoreboardHeight(state) {
      return state.scoreboardH
    },
    // 聊天记录
    getMessages(state) {
      console.log('触发获取消息列表');
      console.log('state.messagesList', state.messagesList);
      return state.messagesList;
    },
    // 聊天记录
    getLocalMessagesList(state) {
      console.log('state.localMessagesList', state.localMessagesList);
      return state.localMessagesList;
    },
    // // 聊天输入框的高度
    // getSendWrapperHeight(state) {
    //   return state.sendWrapperH;
    // },
    // 群id
    getGroupId(state) {
      return state.groupId;
    },
    getGroupReady(state) {
      return state.groupReady;
    },
  }
};