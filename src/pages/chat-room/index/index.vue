<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->

<template>
  <view class="page d-flex flex-column chat-room" @touchstart="handleRootTS">
    <Scoreboard ref="borad" />
    <!-- /计分版 -->
    
    <ChatWindow class="chat-window" />
    <!-- /聊天室 -->

    <InviteModal ref="inviteModal"
                 @update="handleRefresh" />
    <!-- /邀请弹窗 -->
    
    <view  class="fixed-pk" :style="{bottom: fixedPkBottom}">
      <!-- S PK得分 -->
      <view v-show="isShowPkScore" class="flex-start flex-column pk-score" @click="linkToScore()">
        <view class="content">{{ 'PK' }}</view>
      </view>
      <!-- E PK得分 -->
      
      <!-- S PK规则 -->
      <view v-show="isShowPkRules" class="flex-start flex-column pk-rules" @click="linkToPk()">
        <view class="num">{{ pkRules.length || 'PK' }}</view>
      </view>
      <!-- E PK规则 -->
    </view>
    
    <UserModal ref="userModal" />
  </view>
</template>

<script>
// 组件
import Scoreboard from './components/scoreboard';
import ChatWindow from './components/chat-window';
import InviteModal from '@/pages/chat-room/index/components/invite-modal';

// vuex
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import {
  actionsTypes,
  mutationsTypes
} from '@/store/modules/chat-room/types.js';
import { PAGE_CHAT_SHARE_TYPE, shareCompetition } from '@/utils/share';
import { guid } from '@/utils';
// api

// utils
import { toNumber } from '@/utils/third/tools';

import urlParse from 'url-parse'
import URLSearchParams from '@ungap/url-search-params';
import { toUserProfile } from '@/utils/router';

import pRetry from 'p-retry'
import { FirstDisplayTimeMap } from '@/storage/competition';
import { handleUserEnteringMessage, handleCompetitionStateMessages, handleCompetitionEnteringMessages } from '@/utils/html/message-helper';

import UserModal from '@/components/g-avatar/user-modal.vue'

import { getUserIdFromImId } from "@/api/user/index";
import { realtimeLogger } from '@/mixins/gr-mp-logging';

export default {
  components: {
    Scoreboard,
    ChatWindow,
    InviteModal,
    UserModal
  },

  data() {
    return {
      competition_id: '', // 球赛id
      group_id: '', // 聊天室id
      wasHide: false, // 是否曾经 hide 过。
      isApplyGroup: false, // 是否已经加入聊天室
      isGroupOpened: false, // 是否打开了聊天室
      isInGroup: false, // 是否确认进入聊天室
      // isAnnouncementOrWelcomeLoaded: false, // 是否加载公告和欢迎信息加载完成
      isShareIn: false, // 分享进来，避免"分享进来"重复触发imLogin
    };
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      imInfo: (state) => state.flooim.imInfo,
      isIMLogin: (state) => state.flooim.isIMLogin,
      competitionData: (state) => state.chatRoom.competitionData, // 球赛信息
      status: (state) => state.chatRoom.competitionData.status, // 球局状态
      netConfig: (state) => state.app.netConfig, // 网络状态
      isNowGroup: (state) => state.chatRoom.isNowGroup, // 当前操作的组

      /**
       * @type PkCategory[]
       */
      pkTools: (state) => state.pk.pkTools,

      pkRules: (state) => state.pk.pkRules,
      pkInfo: (state) => state.pk.pkInfo,
      isTourists: (state) => state.pk.isTourists, // 是否是游客
      sendWrapperH: (state) => state.chatRoom.sendWrapperH,
    }),
    ...mapGetters({
      isAuth: 'user/isAuth',
      getStateMemberList: 'getMemberList',
    }),

    // 用户所在组
    userGroup() {
		return this.competitionData?.competitor_list?.find(e => e.uid == this.userInfo.uid)?.group || this.isNowGroup;
    },

    isGroupReady() {
      return this.isIMLogin && this.isGroupOpened;
    },
    // 当前用户所在组/当前操作的组
    isUserGroup() {
      return (
        this.competitionData?.competitor_list?.find(
          (e) => e.uid == this.userInfo.uid
        )?.group || this.isNowGroup
      )
    },
    // 当前球局用户所在当前组的所有成员
    isUsers() {
      return this.competitionData?.competitor_list?.filter(e => e.group == this.isUserGroup).map(
        (e) => e.competitor_id * 1
      );
    },
    // 当前pk规则成员汇总
    isPkUsers() {
      return this.pkRules.reduce((acc, cur) => {
        const arr = cur.competitor_ids.map((e) => e * 1);
        acc = [...acc, ...arr];
        return acc;
      }, []);
    },
    differentiateRules() {  //根据球员数据和规则里的数据分别出有效规则和无效规则
      let competitorList = this.competitionData?.competitor_list?.filter(e => e.group == this.isNowGroup).map(
                              (e) => e.competitor_id * 1
                            );
      let validRules = []
      let invalidRules = []
      
      this.pkRules.forEach((rule) => {
        let ruleCompetitors = rule.competitor_ids
        let diff = []
        
        diff = ruleCompetitors.filter((id) => { return competitorList.indexOf(id * 1) == -1})
        if (diff.length) {
          invalidRules.push(rule)
        } else {
          validRules.push(rule)
        }
      })
      return {validRules: validRules, invalidRules: invalidRules}
    },
    fixedPkBottom() {
      let bottom = '220rpx'
      if (this.sendWrapperH) {
        bottom = this.sendWrapperH + 'px'
      }
      
      return bottom
    },
    isShowPkScore() {
      //无pk规则，不展示
      if (this.pkRules.length == 0) {
        return false;
      }
      return true;
    },
    isShowPkRules() {
      //无规则且是观众或其他组的，不展示
      let group = this.competitionData?.competitor_list?.find(e => e.uid == this.userInfo.uid)?.group || ''
      let isTourists = group != this.isNowGroup
      
      this.SET_PK_KEY({key: 'isTourists', data: isTourists});
    
      if (this.pkRules.length == 0 && !group) {
        return false;
      }
      if (isTourists) {
        return false;
      }
      return true;
    },
  },
  watch: {
    'netConfig.status'(newVal, oldVal) {
      // 无网状态转有网状态
      if (!oldVal && newVal) {
        console.log('netConfig.status');
        if (!this.isIMLogin) {
          this.SET_IM_LOGIN();
        }
        this.GET_COMPETITION_DETAIL({ competition_id: this.competition_id });
      }
    }, 

    // 比赛状态变化
    status(nVal, oldVal) {
      if (oldVal != null && nVal == 2) { // 球局结束，请求结束语
        handleCompetitionStateMessages({
          competitionData: this.competitionData,
          group_id: this.group_id,
          canManipulatePk: this.isTourists == false,
          pkCategories: this.pkTools,
          msgHandler: this.SET_ADD_LOCAL_MESSAGE
        })
      }
    },

    isGroupReady(nVal) {
      this.SET_GROUP_READY(nVal)
    },
  },
  async onLoad(options) {
    console.log('聊天页面=====', options);
    if (options.id && options.shareType) this.isShareIn = true;
    this.addIMListeners();
    this.onGREvent('link_tap_chat_msg', (link) => {
      const url = new urlParse(link);
      if (url == undefined
        || ((url.hostname !== 'golfroom.me') && url.hostname !== 'golfroom.cn'))
      {
        return;
      }

      const searchParams = new URLSearchParams(url.query)
      if (url.pathname === '/pi') {
        const jsonStr = searchParams.get('j');
        const obj = JSON.parse(decodeURIComponent(jsonStr || ''));
        if (obj.cr?.modal === 'whole_rank') {
          this.$refs.borad?.handleRankModal()
        }
      } else if (url.pathname === '/p') {
        const jsonStr = searchParams.get("j");
        const obj = JSON.parse(decodeURIComponent(jsonStr || ''));
        if (obj?.p?.uid) {
          // toUserProfile({ uid: obj.p.uid })
          this.showUserModal({ uid: obj.p.uid })
        }
      } 
      
    });
    this.onGREvent('name_tap_chat_msg', (im_id) => {
      this.showUserModal({ im_id: im_id })
    });
    this.onGREvent('auth_popup_finish_update', () => {
      this.reJoinCurrentChat()
    })
    if (options.id) {
      options.id && (this.competition_id = options.id);
      var reqData = {
        competition_id: this.competition_id
      }
      
      this.GET_COMPETITION_DETAIL(reqData).then(
        async (res) => {
          /**
           * 详情中会返回 IM 聊天室的 id
           */ 
          this.group_id = res.group_id;
          this.isShareIn = false; // 恢复
          this.joinChat();
          this.SET_COMPETITION_ID(res.competition_id)
          this.SET_GROUP_ID(res.group_id);
          this.trySelectGroup(res);
          this.$refs.borad.getWatchList({});  
          //02 = 创建球局后分享场景
          if (options.shareType == PAGE_CHAT_SHARE_TYPE.invite) { 
            setTimeout(() => {
              this.addMemberFormShare(options, res);
            }, 300);
          }
          // 初始化pk
          this.initPk()

          // 尝试滚动记分板到第一项有记分的地方
          this.$nextTick(() => {
            this.$refs.borad?.centerLastScoredCell();
          })

          FirstDisplayTimeMap.markCompetitionDisplayed(res.competition_id);
          return;
        }
      );
      // 获取群组中的参赛成员im id
      this.GET_USERS_IM_ID({ competition_id: this.competition_id });
    }
  },
  onShow() {
    if (!this.isIMLogin && !this.isShareIn) {
      console.log('onShow-this.isIMLogin');
      this.SET_IM_LOGIN();
    }

    if (this.wasHide) {
      this.wasHide = false;

      // 根据情况详情一次，防止推送过慢，或者进入后台后，推送断开等情况。 通过 competition data 中的 `time` 进行比较，
      if (this.competitionData
        && this.competitionData.time
        && (new Date().getTime() - this.competitionData.time / 1000) > 10) {
        this.GET_COMPETITION_DETAIL({ competition_id: this.competition_id });
      }

      /**
       * 注意⚠️：现在使用的是聊天室，group info 的 type 是 2，据 蓝莺 IM 的人员说，聊天室，离线 2 分钟，会被踢出。
       */
      const scoped = this;
      this.ensureInCurrentChat({ maxTimes: 3 }).then((success) => {
        if (success == false) {
          console.log("不在聊天室内，可能被踢，重新加入");
          scoped.joinChat();
        }
      })
    }
  },
  onHide() {
    this.wasHide = true;
  },
  onUnload() {
    this.leaveGroup(this.group_id);
    // this.removeIMListeners();
  },
  destroyed() {
    this.SET_PK_KEY({key: 'pkInfo', data: {}})
    this.SET_PK_RULES([])
    this.CLEAR_CHAT_ROOM()
  },
  methods: {
    ...mapActions({
      GET_COMPETITION_DETAIL: actionsTypes.GET_COMPETITION_DETAIL,
      GET_USERS_IM_ID: actionsTypes.GET_USERS_IM_ID,
      UPDATE_CUR_GROUP: actionsTypes.UPDATE_CUR_GROUP,
      CLEAR_CHAT_ROOM: actionsTypes.CLEAR_CHAT_ROOM,
      SET_IM_LOGIN: 'flooim/SET_IM_LOGIN',
      GET_PK_INFO: 'GET_PK_INFO',
      GET_PK_TOOLS: 'GET_PK_TOOLS'
    }),
    ...mapMutations([
      mutationsTypes.SET_MEMBER_LIST,
      mutationsTypes.SET_COMPETITION_ID,
      mutationsTypes.SET_GROUP_ID,
      mutationsTypes.SET_GROUP_READY,
      mutationsTypes.SET_ADD_LOCAL_MESSAGE,
      mutationsTypes.SET_ADD_MESSAGE,
      'SET_PK_KEY',
      'SET_PK_RULES'
    ]),
    // touchstart 监听， 用于通知 emoji 收起
    handleRootTS(e) { 
      uni.$emit("page-touch-start", e);
    },


    // 刷新页面
    handleRefresh() {
      let params = { competition_id: this.competition_id };
      this.GET_COMPETITION_DETAIL(params);
      this.GET_USERS_IM_ID(params);
    },
    // 分享场景-添加球员
    async addMemberFormShare(options, res) {
      // 被分享者是否存在球员列表
      let targetUser = res.competitor_list.find(
        (item) => item.uid == this.userInfo.uid
      );
      // 分享者信息
      let shareUser = res.competitor_list.find(
        (item) => item.uid == options.uid
      );
      // 分组球员是否还有空位
      let targetGroup = res.competitor_list.filter(
        (item) => item.group == options.group
      );
      // 分组index
      let groupIndex = res.group_list.findIndex(
        (item) => item == options.group
      );

      // 被分享者不存在球员列表 && 分组还有空位 则加入球员
      if (!targetUser && targetGroup.length < 4) {
        let payload = {
          competitor_list: targetGroup, // 对应分组参赛球员
          course_name: res.course_name, // 球场名
          start_time: res.start_time, // 球局开始时间
          share_user: shareUser, // 分享者信息
          competition_id: options.id, // 球局id
          group: options.group, // 分组
          user_info: this.userInfo // 用户信息
        };
        this.$refs.inviteModal.open(payload);
      }
      // 更新计分板分组
      this.$refs.borad.handleClickGroup(groupIndex, options.group);
    },
    // 开始im的信息监听
    addIMListeners() {
      if (!this.imInfo) return false;
      console.log('开始监听聊天室内的变化～index');
      // 群（聊天室）成员列表更新
      this.onGREvent('im_onGroupMemberChanged', (groupId) => {
        if (Number(groupId) === Number(this.group_id) && this.isApplyGroup) {
          this.updateGroupMembers();
        }
      })
    },
    // 初始化群聊天室
    async joinChat() {
      console.log('申请加入聊天室');
      if (this.group_id.length < 1) {
        return false;
      }
      
      // 已经在群聊中不需要重复加入 注意返回需要退出聊天室
      this.imInfo.groupManage
        .asyncApply({ group_id: this.group_id, reason: '加入聊天室' })
        .then((res) => {
          console.log('加入聊天室成功～', res);
          this.isApplyGroup = true;
          this.ensureInCurrentChat().then((success) => {
            if (success) this.openGroup()
          })
        })
        .catch((err) => {
          const { data } = err;
          if (data && data.code === 20017) {
            // 已经加入群聊
            console.log('已经在聊天室中～');
            this.isApplyGroup = true;
            this.ensureInCurrentChat().then((success) => {
              if (success) this.openGroup()
            })
          } else {
            console.error('加入聊天室失败～', err);
          }
        });
    },


    /**
     * 重新加入聊天室
     */
    async reJoinCurrentChat() {
      {
        // Test code
        console.log('reJoinCurrentChat');
      }
      

      // 1. make sure leave the IM chat room
      const scope = this;
      const leaveGroup = async () => {
        const result = await scope.imInfo.groupManage.asyncLeave({ group_id: scope.group_id })
        {
          // Test code
          console.log('重新加入聊天室 leaveGroup', result);
        }
      }
      await pRetry(leaveGroup, {
        retries: 10,
        onFailedAttempt: async (e) => {
          {
            // Test code
            console.log('重新加入聊天室 leaveGroup 错误', e);
          }
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve()
            }, 300);
          })
        }
      })

      // 2. make sure to join the IM chat room
      const joinGroup = async () => {
        try {
          const res = await scope.imInfo.groupManage.asyncApply({ group_id: scope.group_id, reason: '加入聊天室' })
          {
            // Test code
            console.log('重新加入聊天室 joinGroup', res);
          }
          if (res) this.openGroup()
        } catch (err) {
          // 这里的 catch 到的不是 instanceof Error, 直接抛出，p-retry 会报错。
          console.log('重新加入聊天室 joinGroup 错误', err);

          const { data } = err;
          if (data && data.code === 20017) {
            // 已经加入群聊
            console.log('已经在聊天室中～');
            this.isApplyGroup = true;
            this.ensureInCurrentChat().then((success) => {
              if (success) this.openGroup()
            })
          } else {
            throw new Error(JSON.stringify(err))
          }
        }
      }
      await pRetry(joinGroup, {
        retries: 10,
        onFailedAttempt: async (err) => {
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve()
            }, 300);
          })
        }
      })
    },
    
    // 获取加入的聊天室列表，保证在聊天室中
    async ensureInCurrentChat(option = {}) {
      const maxTimes = option.maxTimes == undefined ? 10 : option.maxTimes;
      const nextDelay = option.nextDelay == undefined ? 1000 : option.nextDelay;
      const groupId = toNumber(this.group_id);
      if (maxTimes < 1) {
        console.warn('没能真正加入聊天室？', groupId);
        return false;
      }

      var groups = undefined;
      try {
        groups = await this.imInfo.groupManage.asyncGetJoinedGroups(true);
      } catch (e) {
        console.error("Cannot get joined groups", e);
      }

      if (groups !== undefined && groups.includes(toNumber(this.group_id))) {
        return true;
      } else {
        await new Promise((resolve, reject) => {
          setTimeout(async () => {
            resolve()
          }, nextDelay);
        });

        return await this.ensureInCurrentChat({maxTimes: maxTimes - 1, nextDelay: nextDelay});
      }
    },
    // 打开群聊
    async openGroup() {
      console.log('打开聊天室====');
      try {
        this.imInfo.groupManage.openGroup(this.group_id);
        
        this.imInfo.groupManage.asyncGetGroupInfo(this.group_id)
          .then((groupInfo) => {
            console.log('groupInfo', groupInfo);
          });

        this.isGroupOpened = true;

        // 移除
        this.imInfo.groupManage.asyncGetJoinedGroups(true).then((res) => {
          console.log('获取加入的聊天室', res);
          // 当前用户存在多个聊天室，退出其他聊天室保留当前聊天室
          if (res.length && res.length > 1) {
            res.map(e => {
              if (e != this.group_id) {
                console.log('退出其它聊天室', e);
                this.leaveGroup(e)
              }
            })
          }
        })

        // 显示我进入房间的消息
        handleUserEnteringMessage({
          time: new Date().getTime(),
          group_id: this.group_id,
          isMe: true,
          im_id: this.userInfo.im_id,
          username: this.userInfo.username,
          avatar_url: this.userInfo.avatar_url,
          msgHandler: this.SET_ADD_LOCAL_MESSAGE,
        })
      } catch (e) {
        console.error('获取加入的聊天室失败～', e);
      }
    },
    // 获取群聊会员列表
    async updateGroupMembers() {
      console.log('群成员列表更新');

      const members = await this.imInfo.groupManage.asyncGetMemberList(
        this.group_id,
        true
      );

      try {
        // 尝试请求群成员数据
        const rosterIdList = members.map((r) => { return r.user_id })
        const rosters = await this.imInfo.rosterManage.asnycGetRosterListDetailByIds(rosterIdList)
      } catch (error) {
        console.error('Try to get roster with ids with error', error);
      }

      const allMaps = this.imInfo.rosterManage.getAllRosterDetail() || {};

      // 先提取缓存的成员，避免后面代码的更新造成数据不可以用
      const cachedAllMembers = [...(this.getStateMemberList || [])]

      const newMembers = members.map(({ user_id, join_time }) => {
        const im_id = user_id; // 这个 user_id 是 IM 系统里的 UID
        let info = {
          im_id: im_id,
          join_time,
          nick_name: allMaps[im_id]?.nick_name || allMaps[im_id]?.username,
          avatar: allMaps[im_id]?.avatar
        };

        const publicInfo = JSON.parse(allMaps[im_id]?.public_info || '{}');
        // gender 0 未知 1男 2女
        info.gender = publicInfo.gender || 0;

        // 是否需要授权（没授权就意味没登录）
        info.not_auth = publicInfo.not_auth

        return info;
      });
      this.SET_MEMBER_LIST(newMembers);

      console.log('群（聊天室）成员', newMembers.map((m) => { return m.nick_name }));

      // 新的成员列表对应的 ID 集合
      const newMembersIds = newMembers.map(({ im_id, join_time }) => {
        return im_id;
      })

      // 缓存的成员列表对应的 ID 集合
      const cachedAllMemberImIds = cachedAllMembers.map(({ im_id, join_time }) => {
        return im_id;
      })

      // 新加入的成员 (当缓存有数据的时候，才能比较是否时新加入成员)
      const newlyJoinMembers = cachedAllMemberImIds.length > 0 ? newMembers.filter((info) => {
        return !cachedAllMemberImIds.includes(info.im_id)
      }) : [];

      // 新离开成员
      const newlyLeaveMembers = cachedAllMembers.filter((info) => {
        return !newMembersIds.includes(info.im_id)
      })

      // 获取未授权的用户
      const usersNotAuth = [...newMembers, ...cachedAllMembers].filter((info) => {
        return info.not_auth === 1
          // 排除自己
          && (this.userInfo.im_id == null
            || info.im_id == null
            || toNumber(this.userInfo.im_id) !== toNumber(info.im_id)
        )
      })

      // 对新加入或离开的成员，进行信息更新，更新完毕，尝试更新消息列表
      const toUpdateRosterImIds =
        [...newlyLeaveMembers, ...newlyJoinMembers, ...usersNotAuth].map((info) => {
          return info.im_id
        })
      
      const uniqueToUpdateRosterImIds = toUpdateRosterImIds.filter(function (item, pos) {
        return toUpdateRosterImIds.indexOf(item) == pos;
      })

      if (uniqueToUpdateRosterImIds.length > 0) {
        this.$store.dispatch("flooim/REFRESH_ROSTERS_INFO", uniqueToUpdateRosterImIds);
      }

      // 当缓存有成员的时候，才进行新成员比较。
      if (cachedAllMembers.length > 0) {
        
        // 排除球员
        const competitorImIds = this.competitionData?.competitor_ids
          || this.competitionData?.competitor_list?.map((c) => { return toNumber(c.im_id) })
          || [];
        const newlyJoinWatchers = newlyJoinMembers.filter((info) => {
          return !competitorImIds.includes(info.im_id)
        })

        // 新进入的有效观众（不是球员）才显示进入房间的欢迎信息。
        newlyJoinWatchers.forEach((memberInfo, index) => {

          // 如果用户还是没有授权登陆，不显示信息。
          if (memberInfo.not_auth == null || memberInfo.not_auth === 1) {
            return;
          }

          if (memberInfo.nick_name && memberInfo.nick_name.startsWith('rel_gr')) {
            console.error('name error', memberInfo);
            realtimeLogger.rtWarn('Group member user name error', memberInfo)
          }

          handleUserEnteringMessage({
            time: new Date().getTime(),
            group_id: this.group_id,
            isMe: false,
            im_id: memberInfo.im_id,
            username: memberInfo.nick_name,
            avatar_url: memberInfo.avatar,
            msgHandler: this.SET_ADD_LOCAL_MESSAGE,
          })
        })
      }
    },
    // 离开球局页面-退出群聊
    leaveGroup(group_id) {
      this.imInfo.groupManage.asyncLeave({ group_id }).then((res) => {
        console.log('退出聊天室成功', group_id, res);
      });
    },
    trySelectGroup(competitionData) {
      var group = undefined;
      let me = competitionData?.competitor_list?.find(
        (item) => item.uid === this.userInfo.uid
      );
      if (me) {
        group = me.group;
      }

      this.UPDATE_CUR_GROUP(group); // 尝试（球员）选择我所在的组，或者（观众）加载历史选择的 group （使用 undefined）
    },
    async initPk() {
      await this.GET_PK_INFO({competition_id: this.competition_id, group: this.userGroup})
      await this.GET_PK_TOOLS()

      await handleCompetitionEnteringMessages({
        competitionData: this.competitionData,
        group_id: this.group_id,
        canManipulatePk: this.isTourists == false,
        pkCategories: this.pkTools,
        msgHandler: this.SET_ADD_LOCAL_MESSAGE
      })
      await handleCompetitionStateMessages({
        competitionData: this.competitionData,
        group_id: this.group_id,
        canManipulatePk: this.isTourists == false,
        pkCategories: this.pkTools,
        msgHandler: this.SET_ADD_LOCAL_MESSAGE
      })
    },
    linkToScore() {
      if (this.pkInfo.is_private && !this.userGroup) {	//如果pk不公开&&不是当前组参与者，则弹框提示不可查看pk
        return uni.showToast({title: '当前组PK不公开', icon: 'none'});
      }
      let ruleList = this.differentiateRules

      if (ruleList.invalidRules.length) {
        if (this.isTourists && ruleList.validRules.length == 0) {
          return uni.showToast({title: 'PK规则失效', icon: 'none'});
        }
         uni.showModal({
           title: `PK规则失效啦`,
           content: `人员变动导致旧的PK规则${ruleList.validRules.length ? '部分' : ''}失效，需要重新设置规则`,
           confirmText: '知道啦',
           confirmColor: '#95D171',
           showCancel: false,
           success: async (res) => {
             if (res.confirm) {
               this.SET_PK_KEY({key: 'isUsersChanged', data: ruleList.invalidRules.length > 0});
               this.SET_PK_KEY({key: 'pkRules', data: ruleList.validRules});
               uni.navigateTo({
                 url: '/pages/pk/pk-rules-list/index'
               });
             } else if (res.cancel) {
               console.log('用户点击取消');
             }
           }
         });
         return;
      }
      uni.navigateTo({
        url: '/pages/pk/pk-score/index',
      });
      return;
    },
    linkToPk() {
      // 检测pk成员变动情况
      let competitorList = this.competitionData?.competitor_list?.filter(e => e.group == this.isNowGroup).map(
                              (e) => e.competitor_id * 1
                            );
      let ruleList = this.differentiateRules
      
      if (ruleList.invalidRules.length) {
        if (this.isTourists && ruleList.validRules.length == 0) {
          return uni.showToast({title: 'PK规则失效', icon: 'none'});
        }
         uni.showModal({
           title: `PK规则失效啦`,
           content: `人员变动导致旧的PK规则${ruleList.validRules.length ? '部分' : ''}失效，需要重新设置规则`,
           confirmText: '知道啦',
           confirmColor: '#95D171',
           showCancel: false,
           success: async (res) => {
             if (res.confirm) {
               this.SET_PK_KEY({key: 'isUsersChanged', data: ruleList.invalidRules.length > 0});
               this.SET_PK_KEY({key: 'pkRules', data: ruleList.validRules});
               uni.navigateTo({
                 url: '/pages/pk/pk-rules-list/index'
               });
             } else if (res.cancel) {
               console.log('用户点击取消');
             }
           }
         });
         return;
      }
      uni.navigateTo({
        url: '/pages/pk/pk-rules-list/index',
      });
    },

    async showUserModal({ im_id, uid }) {
      let targetUid = uid;
      if (targetUid == null && im_id != null) {
        const res = await getUserIdFromImId({ im_id: im_id }).catch((e) => {
          console.error('Cannot get UID from IM_ID', e);
        })
        targetUid = res?.data?.data?.uid;
      }

      if (targetUid == null) {
        return;
      }

      const targetCompetitor = this.competitionData.competitor_list.find((com) => com.uid == targetUid)
      if (targetCompetitor?.hasOwnProperty('user_type') && targetCompetitor.user_type == 0) {
        return uni.showToast({
          icon: 'none',
          title: '该用户为虚拟用户'
        });
      }
      
      this.$refs.userModal.loadData(targetCompetitor || { uid: targetUid }, false)
    },
    
    onShareAppMessage(res) {
      return this.pageSharing(res)
    },
    onShareTimeline(res) {
      return this.pageSharing(res)
    },
    pageSharing(res) {
      const share = this.getTopPageInjectedShare();
      if (share) return share;

      const data = this.competitionData
      return shareCompetition({
        id: data?.competition_id,
        group: this.group_id,
        uid: this.userInfo.uid,
        shareRoomName: data.competition_name,
        imageUrl: '',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-room {
  background: $white;
  max-height: 100vh;
}

.chat-window {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.fixed-pk {
  position: fixed;
  right: 0;
  bottom: 0;

  margin-right: 18rpx;
  margin-bottom: 24rpx;
  .pk-score {
    margin-bottom: 24rpx;
    @include bgImage(90rpx, 90rpx, 'http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/pk_float_btn_score.svg');
    border-radius: 20rpx;
    box-shadow: 0px 4px 20px rgba(255, 106, 60, 0.3);

    .content {
      @include ell(1);
      max-width: 100%;
      
      margin-top: 5rpx;
      margin-left: 5rpx; // 看起来居中

      font-family: 'DINCond-Black';
      font-style: normal;
      font-weight: 500;
      font-size: 40rpx;
      line-height: 48rpx;
      text-align: center;
      // letter-spacing: -0.3rpx;
      color: #FFFFFF;

      text-shadow: 0rpx 4rpx 6rpx rgba(218, 102, 36, 0.5);
      
      transform: matrix(1, 0, -0.2, 0.98, 0, 0);
    }
  }
  .pk-rules {
    position: relative;
    @include bgImage(90rpx, 90rpx, 'http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/pk_float_btn_rule.svg');
    box-shadow: 0px 4px 20px rgba(79, 148, 146, 0.4);
    border-radius: 20rpx;

    .num {
      @include ell(1);
      max-width: 100%;
      
      margin-top: 5rpx;
      margin-left: 5rpx; // 看起来居中

      font-family: 'DINCond-Black';
      font-style: normal;
      font-weight: 500;
      font-size: 40rpx;
      line-height: 48rpx;
      text-align: center;
      // letter-spacing: -0.3rpx;
      color: #FFFFFF;

      text-shadow: 0rpx 4rpx 6rpx rgba(68, 97, 68, 0.25);

      transform: matrix(1, 0, -0.2, 0.98, 0, 0);
    }
  }
}
</style>
