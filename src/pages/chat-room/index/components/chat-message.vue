<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <scroll-view ref="msgsScroll"
               id="msgsScroll"
               :scroll-y="true"
               class="chat-wrapper"
               :scroll-top="scrollTop"
               :scroll-with-animation="scrollWidthAnimation"
               @scroll="scrollViewScroll"
               @scrolltoupper="onScrollToUpper">
    <view id="msg-top-view" style="height: 10rpx;"></view>
    <block v-for="(item, index) in allMessages" :key="message.id" >
      <RenderMassageLive :message="item"
                        :preMsg="index != 0 ? allMessages[index-1] : undefined"
                        @resend="handleResend" />
    </block>
    <view id="msg-bottom-view" style="height: 28rpx;"></view>
    <!-- <view class="loading-wrapper" v-if="loading">
      <view class="circle-loading"></view> -->
    <!-- </view> -->
  </scroll-view>
</template>

<script>
// vuex
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import {
  mutationsTypes
} from '@/store/modules/chat-room/types.js';
// utils
import { toNumber, numToString } from '@utils/third/tools';
// 组件
import RenderMassageLive from '@/pages/chat-room/index/components/render-message-live.vue';
import dayjs from 'dayjs';
import { throttle } from '@utils/function-helper'

export default {
  components: { RenderMassageLive },

  data() {
    return {

      // 下次取历史消息的key. undefined 表示没有请求过， 或者不成功, 如果是成功，但没有消息，这个会是 0。
      nextHistoryKey: undefined,
      historyCheckTimer: undefined,

      messageList: [],
      scrollTop: 0, // 距离顶部高度
      curScrollTop: 0,
      curScrollHeight: 0,
      curScrollViewHeight: 0,
      scrollWidthAnimation: true,

      throttledScrolling: null,

      // triggered: false
      loading: false
    };
  },

  watch: {
    // 群组是否准备好
    getGroupReady: {
      handler: function (newVal, oldVal) {
        console.log("getGroupReady watched", newVal)
        if (newVal) {
          this.tryGetHistoryMessage();
        }
      },
      immediate: true,
    },
      

    allMessages(newVal, oldVal) { 

      /**
       * 1. 如果自己发的“新”消息，滚动到最新；
       * 2. 如果是别人的新消息，如果距离底部比较近，则滚动到最新；
       * 3. 其它情况不变（比如下拉，拉取历史消息）
       */

      this.$nextTick(() => {
        // 从没有到有，滚动到底部
        if (oldVal.length < 1 && newVal.length > 0) {
          this.scrollToShowBottom({ delivery: 0, animate: false });
          return;
        }

        const uid = this.imInfo.userManage.getUid();

        const newLast = newVal[newVal.length - 1];
        const oldLast = oldVal[oldVal.length - 1];
        if (toNumber(newLast?.timestamp || '0') > toNumber(oldLast?.timestamp || '0')) {  // 有新消息
          if (toNumber(newLast?.from) === uid || newLast?.g_client_mid != null) { // 自己发送的
            this.scrollToShowBottom({});
          } else { // 其它人发送的
            this.getScrollViewHeight(() => {
              // 如果距离底部少于 200rpx ，则滚动
              if (this.curScrollHeight - this.curScrollTop - this.curScrollViewHeight < uni.upx2px(400)) {
                this.scrollToShowBottom({});
              }
            });
          }
        }
      })
    } 
  },

  mounted() {
    this.addIMListeners();
    this.beginHistoryStatusChecking()
  },

  destroyed() {
    clearTimeout(this.historyCheckTimer);
    // this.removeIMListeners();
    // 清除当前消息
    this.SET_MESSAGE([]);
  },

  computed: {
    ...mapState({
      imInfo: (state) => state.flooim.imInfo,
      competitionData: (state) => state.chatRoom.competitionData, // 球局信息
      sendingMessagesList:  (state) => state.flooim.sendingMessagesList,
    }),
    ...mapGetters([
      'getScoreboardHeight',
      'getMessages',
      'getLocalMessagesList',
      'getGroupId',
      'getGroupReady',
    ]),
    competitorImIds() {
      return this.competitionData?.competitor_list?.map((c) => { return toNumber(c.im_id) }) || [];
    },
    caddieImIds() {
      return this.competitionData?.caddie_briefs?.map((c) => { return toNumber(c.im_id) }) || [];
    },
    // 消息列表
    allMessages() {
      // "timestamp 1670134230673"
      const msgs = [];

      // 如果 SDK 没有加载历史消息的动作，直接不显示消息。
      if (this.nextHistoryKey === undefined) return msgs;

      msgs.push(...this.getMessages);
      msgs.forEach((item) => {
        item.aid = numToString(item.id);
        let { from } = item;
        let uid = this.imInfo.userManage.getUid();
        let umaps = this.imInfo.rosterManage.getAllRosterDetail();
        let extData = item.ext ? JSON.parse(item.ext) : {};
        let fromId = toNumber(from);
        // console.log('uid', uid);
        // console.log('umaps', umaps);
        item.nick_name =
          umaps[fromId]?.nick_name ||
          umaps[fromId]?.username ||
          extData?.username;
        (item.avatar = umaps[fromId]?.avatar || extData?.avatar_url),
          (item.isSelf = toNumber(uid) === fromId);
        item.isCompetitor = this.competitorImIds.includes(fromId)
        item.isCaddie = this.caddieImIds.includes(fromId)
      });

      const gid = this.getGroupId;

      this.sendingMessagesList.forEach(sendingMsg => {
        // 排除不是本聊天室的消息
        if (sendingMsg.gid != gid) { 
          return;
        }
        
        const sendingMsgTimestamp = toNumber(sendingMsg.g_client_mid);

        console.log("sendingMsg", sendingMsg);

        if (dayjs().subtract(5, 'minute').isAfter(sendingMsg.g_client_mid) && sendingMsg.g_send_status !== 'sent') { 
          sendingMsg.g_send_status = 'failed'
        }
        
        for (var index = 0; index < msgs.length; index++) { 
          if (sendingMsg.g_client_mid == undefined) continue;

          const msg = msgs[index];
          const timestamp = msg.timestamp || msg.g_client_mid;
          if (timestamp ==  undefined) continue;

          // 对比时间插入, 找到第一个时间比发送中消息更后的位置，插入其中
          if ( toNumber(timestamp) > sendingMsgTimestamp) { 
            msgs.splice(index, 0, sendingMsg);
            break;
          }
          // 如果找不到时间，插入到最后
          if (index === msgs.length - 1) { 
            msgs.push(sendingMsg)
            break;
          }
        }
      })

      // 插入本地消息
      this.getLocalMessagesList.forEach(localMsg => {
        const localMsgTimestamp = localMsg.timestamp;
        if (localMsgTimestamp == undefined) return;

        if (msgs.length < 1) {
          msgs.push(localMsg);
          return;
        }

        for (var index = 0; index < msgs.length; index++) { 

          const msg = msgs[index];
          const timestamp = msg.timestamp || msg.g_client_mid;
          if (timestamp ==  undefined) continue;

          // 对比时间插入, 找到第一个时间比发送中消息更后的位置，插入其中
          if ( toNumber(timestamp) > localMsgTimestamp) { 
            msgs.splice(index, 0, localMsg);
            break;
          }
          // 如果找不到时间，插入到最后
          if (index === msgs.length - 1) { 
            msgs.push(localMsg)
            break;
          }
        }
      })

      return msgs;
    }
  },

  methods: {
    ...mapMutations([
      mutationsTypes.SET_ADD_MESSAGE,
      mutationsTypes.SET_MESSAGE
    ]),
    ...mapActions(['queryHistory']),
    ...mapActions({
      SEND_GROUP_MESSAGE: 'flooim/SEND_GROUP_MESSAGE',
    }),

    // 获取群历史信息
    tryGetHistoryMessage() {
      if (!this.imInfo || this.getGroupId == undefined) return false;
      const latestMsg = this.getMessages[0]
      this.imInfo.sysManage.requireHistoryMessage(this.getGroupId, latestMsg?.id || 0, 20);
    },
    // 添加群消息
    async addGroupMessage(dataSource) {
      const toId = toNumber(dataSource.to);
      const gid = toNumber(this.getGroupId);
      const myImUid = this.imInfo.userManage.getUid();
      if (toId === gid) {
        // 设置已读，不是自己发送的
        if (myImUid + '' !== dataSource.from + '') {
          this.imInfo.groupManage.readGroupMessage(this.group_id);
        }

        this.SET_ADD_MESSAGE(dataSource);
      }
    },
    // 开始im的信息监听
    addIMListeners() {
      if (!this.imInfo) return false;

      this.onGREvent('im_onGroupMessage', this.onGroupMessage())
      this.onGREvent('im_onReceiveHistoryMsg', ({ next }) => {
        this.nextHistoryKey = toNumber(next);
        console.log('收到的历史消息', this.nextHistoryKey);
        // TODO: retrieve `im_id` to `uid` mapping.
      })
    },

    // 
    beginHistoryStatusChecking() {
      clearTimeout(this.historyCheckTimer)
      
      if (this.nextHistoryKey == undefined) {

        // try to get histories
        this.tryGetHistoryMessage();

        // begin next loop
        const scope = this
        this.historyCheckTimer = setTimeout(() => {
          scope.beginHistoryStatusChecking()
        }, 1000);
      }
    },

    // 接收到的群信息(计分、tee更改、聊天信息)
    onGroupMessage() {
      let _this = this;
      return function (meta) {
        // console.log('收到聊天信息', JSON.stringify({ ...meta }));
        _this.addGroupMessage(meta);
      };
    },

    // 重发消息
    handleResend(msg) { 
      this.SEND_GROUP_MESSAGE(msg)

      this.scrollToShowBottom({});
    },

    // 获取 scroll view 当前高度
    getScrollViewHeight(callback) { 
      this.$nextTick(() => {
        console.log("allMessages this.$refs", this.$refs)

        const query = uni.createSelectorQuery().in(this);
        query
          .select('#msgsScroll')
          .fields({ size: true, scrollOffset: true }, (data) => {
            // console.log('allMessages SCROLL VIEW HEIGHT scrollHeight', new Date().getTime() / 1000, data.scrollHeight, data.scrollTop);
            this.curScrollViewHeight = data.height;
            callback && callback();
          })
          .exec();
      });
    },

    onScrollToUpper() {
      this.tryGetHistoryMessage()
    },

    scrollViewScroll(scrollView) { 
      this.curScrollTop = scrollView.detail.scrollTop
      this.curScrollHeight = scrollView.detail.scrollHeight;
    },
    
    scrollToShowBottom({ delivery = 0,  animate = true }) { 
      if (this.throttledScrolling == null) {
        const scope = this
        const scrolling = async ({ animate = true }) => {

          // 先获取 scroll-view 的 scrollTop 当前值。有可能已经滚动，但是 @scroll 还没有发出，直接设置旧的值，可能会一起跳动。
          await new Promise((resolve, reject) => {
            uni.createSelectorQuery().in(scope)
              .select('#msgsScroll')
              .fields({ size: true, scrollOffset: true }, (data) => {
                // console.log('allMessages SCROLL VIEW HEIGHT scrollHeight', new Date().getTime() / 1000, data.scrollHeight, data.scrollTop);
                scope.curScrollViewHeight = data.height;
                scope.curScrollTop = data.scrollTop;
                resolve();
              })
              .exec();
          })
          scope.scrollWidthAnimation = animate;
          scope.scrollTop = scope.curScrollTop;

          setTimeout(() => {
            scope.$nextTick(() => {
              uni.createSelectorQuery().in(scope)
                .select('#msgsScroll')
                .fields({ size: true, scrollOffset: true }, (data) => {
                  // console.log('scrollToShowBottom scrollHeight', new Date().getTime() / 1000, data.scrollHeight, data.scrollTop);
                  if (data?.scrollHeight != null) {
                    scope.scrollTop = data.scrollHeight;
                    scope.curScrollTop = scope.scrollTop;
                  }
                })
                .exec();
            });
          }, delivery);
        }
        this.throttledScrolling = throttle(scrolling, 350, false); // 有这些组件，比如 mp-html 需要时间来准备 dom，350ms 延时，避开高度不准确的问题。
      }
      this.throttledScrolling({ delivery, animate })
    },
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/chat-message.scss';
</style>
