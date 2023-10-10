<!--
  Copy from the floo im
 -->
<template>
  <view class="page root">
    <GNavbar class="nav" :left-titled="true" :title="navTitle" :zIndex="999" :light-theme="true" :bg-style="'#FFF'">
      <template slot="nav-left">
        <view :style="{ width: '20rpx', height: '20rpx', backgroundColor: 'red'}"></view>
      </template>

      <view class="w-auto flex-start ml-20" @click="handleNavUserClick">
        <GAvatar :avatar-data="{ avatar_url: rosterAvatar }" 
                  :size-in-rpx='64'
                  :radius="'100%'"
                  handle-click="false"/>
        <view class="nav-user-name">{{ rosterUserName || '' }}</view>
        <!-- <view class="nav-center-part" @click="copyRoomNum">
          <view class="fs-30 fw-bol text-over" :style="{ lineHeight: '100%' }">{{ '房间号:' + (competitionData.competition_no || '') }}</view>
          <view class="copy-btn"></view>
        </view>
        <view class="fs-24 text-over" :style="{ lineHeight: '109%' }">{{ courseName || '' }}</view> -->
      </view>


    </GNavbar>
    <scroll-view id="msg-scroll-view"
                  class="msg-scroll-view" 
                  scroll-y="true" 
                  enable-back-to-top="true"
                  :scroll-with-animation="scrollWidthAnimation"
                  :scroll-top="scrollTop"
                  @scroll="scrollViewScroll"
                  @scrolltoupper="onScrollToUpper"
                  >
      <view id="msg-bottom-view" style="height: 10rpx;"></view>
      <block v-for="(message, index) in allMessages" :key="message.id" >
        <RosterMessage :message="message"
                        :preMsg="index != 0 ? allMessages[index-1] : undefined"
                        @resend="handleResend" />
      </block>
      <view id="msg-bottom-view" style="height: 24rpx;"></view>
    </scroll-view>

    <view v-if="showSubscribing" class="subscribe-container">
      <!-- 消息订阅 -->
      <view class="subscribe">
        <view class="subs-left">
          <view class="subs-title">不想错过她的消息？</view>
          <view class="subs-subtitle">订阅通知，不再错过互动消息</view>
        </view>
        <view class="subs-right">
          <view class="subs-confirm" @click="handleSubscribing">订阅通知</view>
          <view class="subs-close" @click="handleSubscribeClose">
            <view class="subs-close-icon"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- /输入弹窗 -->
    <ChatInput id="send-wrapper" 
                placeholder="说点什么吧～"
                :blur-after-confirm="false"
                @inputHeightChange="handleInputHeightChange"
                @inputConfirm="handleInputConfirm" />
  </view>
</template>

<script>
import { toLong, toNumber } from '@/utils/third/tools';
import { mapActions, mapState } from 'vuex';
import GNavbar from '@/components/g-navbar/index.vue';
import GAvatar from '@/components/g-avatar/g-avatar.vue'
import message from './Components/RosterMessage.vue';
import ChatInput from '@/components/chat-input/chat-input.vue';
import RosterMessage from './Components/RosterMessage.vue';
import { guid } from '@/utils';
import { toUserProfile } from '@/utils/router';
import dayjs from 'dayjs';
import { throttle } from '@utils/function-helper'

export default {
  data() {
    return {
      pageLoaded: false,

      messages: [],
      uid: 0,
      im_id: 0,
      rosterInfo: {},
      queryHistoryMessageId: -1,

      curScrollTop: -1,
      curScrollHeight: 0,
      curScrollViewHeight: 0,
      scrollTop: -1,
      scrollWidthAnimation: true,

      throttledScrolling: null,

      showSubscribing: false,

      inputValue: '',
      showing: false,
      navTitle: '',
      wh: 0,
      navHeight: 0,
      showvoice: false,
      recordTxt: '按下录音',
      startTime: 0,
      duration: 0,
      timer: null,
      recordFile: ''
    };
  },
  computed: {
    ...mapState({
      isIMLogin: (state) => state.flooim.isIMLogin,
      imInfo: (state) => state.flooim.imInfo,
      sendingMessagesList:  (state) => state.flooim.sendingMessagesList,
      userInfo: (state) => state.user.userInfo,
    }),

    isConversationReady() {
      return this.pageLoaded && this.isIMLogin;
    },

    rosterAvatar() {
      return this.rosterInfo.avatar
    },

    rosterUserName() {
      return this.rosterInfo.nick_name
    },

    allMessages() {
      const msgs = [...this.messages];
      this.sendingMessagesList.forEach(sendingMsg => {
        // 排除不是本聊天室的消息
        if (sendingMsg.uid != this.im_id) { 
          return;
        }

        sendingMsg.avatar = sendingMsg.avatar || this.userInfo.avatar_url
        sendingMsg.nick_name = sendingMsg.nick_name || this.userInfo.avatar_url
        
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

      return msgs;
    }
  },
  watch: {

    isConversationReady(nVal, oVal) {
      if (nVal) {
        console.log('isConversationReady', nVal);

        this.updateUserIMInfo()
        this.tryGetHistoryMessage();
      }
    },

    allMessages(newVal, oldVal) { 

      /**
       * 1. 如果自己发的“新”消息，滚动到最新；
       * 2. 如果是别人的新消息，如果距离底部比较近，则滚动到最新；
       * 3. 其它情况不变（比如下拉，拉取历史消息）
       */

      // 从没有到有，滚动到底部
      if (oldVal.length < 1 && newVal.length > 0) {
        this.scrollToShowBottom({ animate: false });
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
    }
  },

  components: {
    GNavbar,
    GAvatar,
    ChatInput,
    message,
    RosterMessage
  },
  props: {},
  onShow: function () {
    this.showing = true;
  },
  onUnload: function () {
    this.showing = false;
  },
  onLoad: function (options) {
    this.showing = false;

    // TODO: add subscribing logic
    // this.showSubscribing = true;

    let { nick = '', im_id } = options;
    // this.uid = uid;
    im_id = toNumber(im_id);
    this.im_id = im_id;

    const im = this.imInfo;
    if (im) {
      this.onGREvent('im_onRosterMessage', this.receiveNewMessage);
      this.onGREvent('im_onReceiveHistoryMsg', this.receiveHistoryMsg);
      this.onGREvent('im_onMessageStatusChanged', this.onMessageStatusChanged);
      this.onGREvent('im_onSendingMessageStatusChanged', this.onSendingMessageStatusChanged);
      this.onGREvent('im_onRosterInfoUpdate', this.onRosterInfoUpdate);
    }

    /** 设置title */
    const uMaps = im.rosterManage.getAllRosterDetail();
    let fromUserObj = uMaps[im_id] || { user_id: im_id };
    if (im_id == 0) fromUserObj.username = '系统通知';
    this.navTitle = decodeURI(nick) || fromUserObj.nick_name || fromUserObj.username || fromUserObj.user_id

    this.pageLoaded = true;
  },
  methods: {
    ...mapActions({
      SEND_ROSTER_MESSAGE: 'flooim/SEND_ROSTER_MESSAGE',
    }),
    handleInputHeightChange(inputHeight, focusing) { 
      focusing && this.scrollToShowBottom({delivery: 0});
    },
    handleInputConfirm(inputText) {
      const content = inputText;
      if (content) {
        let msg = {
          content,
          uid: this.im_id,
          type: 'text',
          ext: JSON.stringify({
            // avatar_url: this.userInfo.avatar_url,
            // username: this.userInfo.username,
            g_msg_guid: guid() // 消息的 GUID， 用于跟踪消息发送情况，入已经发送的消息，
          })
        };
        this.SEND_ROSTER_MESSAGE(msg)
      }
    },

    handleNavUserClick() {
      toUserProfile({ uid: this.uid, imUid: this.im_id })
    },

    // 重发消息
    handleResend(msg) { 
      this.SEND_ROSTER_MESSAGE(msg)
      this.scrollToShowBottom({delivery: 0});
    },

    // 订阅用户信息
    handleSubscribing() {
      // TODO: 
      console.log('handleSubscribing');
    },
    handleSubscribeClose() {
      // TODO: 
      console.log('handleSubscribeClose');
      this.showSubscribing = false;
    },

    onMessageStatusChanged: ({ mid }) => {
      console.log('Message status changed, mid: ', mid);
      //TODO: refresh page
    },
    onSendingMessageStatusChanged: ({ status, mid }) => {
      console.log('Sending Message status changed to ', status, ' mid: ', mid);
    },
    onRosterInfoUpdate(res) {
      // 文档有误，SDK 中， res 就是 id 的集合
      if (Array.isArray(res) && res.includes(this.im_id)) {
        this.updateUserIMInfo();
      }
    },

    // 获取历史信息
    tryGetHistoryMessage() {
      // if (!this.imInfo || this.im_id == undefined || this.queryHistoryMessageId < 1) return false;
      // this.imInfo.sysManage.requireHistoryMessage(this.im_id, this.queryHistoryMessageId || 0, 20);

      const im = this.imInfo
      if (!im) return;


      if (this.queryHistoryMessageId === 0) {
        console.log('No more histories');
        return;
      }
      // Query histories older than the message with id:mid, 0 means from the last message;
      const mid = Math.max(0, this.queryHistoryMessageId);

      const amount = 20; // Batch size of one time history message query.
      im.sysManage.requireHistoryMessage(this.im_id, mid, amount);
    },

    
    appendMessage: function (data) {
      const newMessages = data.messages || [];
      const isHistory = data.history;
      if (isHistory) {
        this.queryHistoryMessageId = toNumber(data.next);
      }
      const myImId = this.imInfo.userManage.getUid();
      const oldMessages = this.messages || [];

      let uMaps = this.imInfo.rosterManage.getAllRosterDetail();

      let allMessages = [];
      let i = 0, j = 0;
      while (i < newMessages.length && j < oldMessages.length) {
        const newMeta = newMessages[i];
        if (newMeta.ext && newMeta.ext.input_status) {
          i++;
          continue;
        }
        const { from, to } = newMeta;
        const fromImId = toNumber(from);
        const toImId = toNumber(to);

          
        let saveUid = fromImId === myImId ? toImId : fromImId;
        if (saveUid + '' !== this.im_id + '') {
          return; // rosterchat, 必须有一个id是 sid
        }

        const oldMeta = oldMessages[j];
        const c = toLong(newMeta.id).comp(toLong(oldMeta.id));
        if (-1 === c) {
          allMessages.push(newMeta);
          i++;
        } else if (1 === c) {
          allMessages.push(oldMeta);
          j++;
        } else {
          //same id, which means message info updated
          allMessages.push(newMeta);
          i++;
          j++;
        }
      }

      if (i < newMessages.length) {
        allMessages = allMessages.concat(newMessages.slice(i, newMessages.length));
      }

      if (j < oldMessages.length) {
        allMessages = allMessages.concat(oldMessages.slice(j, oldMessages.length));
      }

      for (const msg of newMessages) {
        const fromImId = toNumber(msg.from);
        let extData = msg.ext ? JSON.parse(msg.ext) : {};
        msg.nick_name =
          uMaps[fromImId]?.nick_name ||
          uMaps[fromImId]?.username ||
          extData?.username;
        msg.avatar = uMaps[fromImId]?.avatar || extData?.avatar_url;
        msg.isSelf = toNumber(myImId) === toNumber(fromImId);
      }
  
      this.messages = [...allMessages];
    },

    receiveNewMessage(message) {
      const im = this.imInfo;
      if (!im) return;

      const myImId = im.userManage.getUid();
      const to = message.to;
      const from = message.from;
      const pid = this.im_id;

      if ((myImId == to && from == pid) || (myImId == from && to == pid)) {
        if (!this.checkTyping(message)) {
          // we might reload all messages because of message operations, which could be message deletion;
          // const smessages = im.rosterManage.getRosterMessageByRid(this.im_id - 0);
          console.log('Got: ', message);
          this.appendMessage({ messages: [message] });
        }
      }

      if (this.showing && from !== myImId) {
        //do not read message sent by oneself
        im.rosterManage.readRosterMessage(this.im_id, message.id);
      }
    },

    receiveHistoryMsg({ next }) {
      this.queryHistoryMessageId = toNumber(next);

      // 数量不足，还有消息的情况下，请求更多数据
      if (this.queryHistoryMessageId > 0 && this.messages.length < 20) {
        this.tryGetHistoryMessage();
      }
    },

    checkTyping(message) {
      const { ext = {} } = message;

      if (typeof ext.input_status !== 'undefined') {
        let status = ext.input_status;

        if (status == 'nothing') {
          // this.header.querySelector(".typing").style.display = "none";
        } else {
          // this.header.querySelector(".typing").style.display = "inline";
          // this.header.querySelector(".typing").innerHTML = status + "...";
        }
        return true;
      }
      return false;
    },

    // 获取 scroll view 当前高度
    getScrollViewHeight(callback) { 
      const query = uni.createSelectorQuery().in(this);
      query
        .select('#msg-scroll-view')
        .boundingClientRect(({ height }) => {
          this.curScrollViewHeight = height;
          callback();
        })
        .exec();
    },

    scrollToShowBottom({ delivery = 0,  animate = true }) { 
      if (this.throttledScrolling == null) {
        const scope = this
        const scrolling = async ({ animate = true }) => {

          // 先获取 scroll-view 的 scrollTop 当前值。有可能已经滚动，但是 @scroll 还没有发出，直接设置旧的值，可能会一起跳动。
          await new Promise((resolve, reject) => {
            uni.createSelectorQuery().in(scope)
              .select('#msg-scroll-view')
              .fields({ size: true, scrollOffset: true }, (data) => {
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
                .select('#msg-scroll-view')
                .fields({ size: true, scrollOffset: true }, (data) => {
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

    scrollViewScroll(scrollView) {
      this.curScrollTop = scrollView.detail.scrollTop;
      this.curScrollHeight = scrollView.detail.scrollHeight;
    },

    onScrollToUpper() {
      this.tryGetHistoryMessage()
    },

    async updateUserIMInfo() {
      this.rosterInfo = this.imInfo.rosterManage.getRosterInfo(this.im_id);
    },

    deleteConversation() {
      const also_delete_other_devices = true;
      this.imInfo.sysManage.deleteConversation(this.im_id, also_delete_other_devices);
      this.backClick();
    },

    voiceHandler() {
      this.showvoice = !this.showvoice
    },

    startRecord() {
      // wx.authorize({
      //   scope: 'scope.record',
      //   success: function () {
      //     console.log('录音授权成功');
      //   },
      //   fail: function () {
      //     console.log('录音授权失败');
      //   }
      // });
      // var that = this;
      // const recorderManager = wx.getRecorderManager();
      // recorderManager.onError((res) => {
      //   console.log('录音错误: ', res);
      // });
      // recorderManager.onStop(function (res) {
      //   this.recordFile = res.tempFilePath;
      //   this.duration = Math.ceil((new Date().getTime() - that.startTime) / 1000)
      //   console.log('录音完成: ', that.recordFile);
      //   that.uploadVoice(that.recordFile);
      // });
      // const options = {
      //   sampleRate: 44100,
      //   numberOfChannels: 1,
      //   encodeBitRate: 192000,
      //   format: 'mp3'
      // };
      // recorderManager.start(options);
      // this.startTime = new Date().getTime();
      // this.recordTxt = '录音中'
      // const timer = setTimeout(() => {
      //   this.stopRecord();
      // }, 30000);
      // this.timer = timer;
    },

    stopRecord() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      const recorderManager = wx.getRecorderManager();
      recorderManager.stop();
      this.recordTxt = '按下录音'
    },

    uploadVoice(path) {
      const that = this;
      const im = this.imInfo;
      im.sysManage
        .asyncFileUpload({
          file: path,
          to_id: this.im_id,
          fileType: 'audio-mp3',
          toType: 'chat',
          chatType: 'roster'
        })
        .then((res) => {
          console.log('录音上传成功');
          that.sendVoiceMessage(res.url);
        })
        .catch((err) => {
          console.log('录音发送失败：' + err);
        });
    },

    sendVoiceMessage(url) {
      const im = this.imInfo;
      const fileInfo = {
        dName: 'file',
        url,
        duration: this.duration
      };
      im.sysManage.sendRosterMessage({
        type: 'audio',
        uid: this.im_id,
        content: '',
        attachment: fileInfo
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.root {
  height: 100vh;

  display: flex;
  flex-direction: column;
}
.nav {
  z-index: 999;
}

.nav-user-name {
  @include ell(1);
  margin-left: 24rpx;
  font-weight: 400;
  font-size: 28rpx;
  // line-height: 109%;  // 不要用 -webkit-line-clamp 的时候，同时设置 line-height, 否则 iOS 上会出现异常，... 出来了，但是会显示第二行的顶部。
  letter-spacing: -0.3rpx;
  color: #000000;
}

.msg-scroll-view {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: block;
  background: #fefefe;
}

.subscribe-container {
  position: relative;
  height: 0rpx;
  .subscribe {
    position: absolute;
    box-sizing: border-box;
    left: 0;
    bottom: -1px;
    width: 100%;
    padding: 20rpx 32rpx;
    box-shadow: 0px -1px 0px rgba(0, 0, 0, 0.08);
    background-color: #fff;
    display: flex;
    align-items: center;
    gap: 20rpx;
    .subs-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .subs-title {
        @include ell(1);
        font-weight: 400;
        font-size: 28rpx;
        line-height: 40rpx;
        color: #000000;
      }
      .subs-subtitle {
        @include ell(1);

        font-weight: 400;
        font-size: 24rpx;
        line-height: 40rpx;
        color: #999999;
      }
    } 
    .subs-right {
      margin-left: auto;

      display: flex;
      align-items: center;
      gap: 16rpx;

      .subs-confirm {
        padding: 10rpx 16rpx;

        background: #95D171;
        border: 1rpx solid rgba(255, 255, 255, 0.2);
        border-radius: 4rpx;

        font-weight: 500;
        font-size: 24rpx;
        line-height: 34rpx;
        text-align: center;
        letter-spacing: -0.3px;
      }
      .subs-close {
        padding: 16rpx;
        margin-right: -16rpx;
        .subs-close-icon {
          $url: "data:image/svg+xml,%3Csvg fill='none' height='18' viewBox='0 0 17 18' width='17' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath clip-rule='evenodd' d='M16.645 2.813L14.524.69l-6.01 6.01-5.656-5.656L.737 3.166l5.656 5.656L.38 14.834l2.122 2.12 6.011-6.01 6.365 6.364L17 15.187l-6.365-6.365z' fill='%23000' fill-opacity='.2' fill-rule='evenodd'/%3E%3C/svg%3E";
          @include bgImage(16rpx, 16rpx, $url);
        }
      }
    }
  }
}
.input-container {
  height: 100rpx;
  width: 750rpx;
  bottom: 20rpx;
  left: 5rpx;
  border-top: 1rpx solid #ccc;
  background: white;
}
</style>
