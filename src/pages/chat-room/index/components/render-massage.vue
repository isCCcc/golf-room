<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="chat-cell pr"
        :class="{'isSame': sameUserWithLastMsg}">
    <view class="mt-24 mb-20 tc fs-24 fw-400 chat-time"
          :style="{color: '#AEAEAE'}"
          v-if="showTime">{{showTime}}</view>
    <!-- /信息时间 -->
    <!--S  内容信息 -->
    <view class="chat-info">
      <view class="g-avatar avatar-box"
            :class="{'isSelf': message.isSelf}"
            :style="{ backgroundImage: showAvatar ? `url(${ message.avatar })` : undefined, visibility : showAvatar ? 'visible' : 'hidden' }"></view>
      <!-- /头像 -->

      <view class="chat-content"
            :class="{'isSelf': message.isSelf}">
        <!-- /用户名称 -->

        <view class="fs-28 message-box"
              :class="{'isSelf': message.isSelf}">
          <view v-if="showName" class="fs-20 fw-400 col-999"
              :class="{'tr': message.isSelf}">{{message.nick_name || '微信用户'}}</view>
          <view v-if="message.type == 'text'">
            {{message.content}}
          </view>
          <!-- /文字 -->

          <view v-if="message.type === 'image'">
            <image class="msg-image" :src="attachImage"
                   v-if="attachImage !== ''"
                   mode="widthFix" />
          </view>
          <!-- /图片 -->
        </view>
      </view>

      <view v-if="message.g_send_status === 'failed'" class="resend">
        <uni-icons type="refresh" size="40rpx" @click.stop="resend"></uni-icons>
      </view>
    </view>

    <!--E  内容信息 -->

  </view>
</template>

<script>
// vuex
import { mapState } from 'vuex';
// utils
import { getChatTime } from '@/utils/index';
export default {
  emits: ['resend'],
  props: {
    message: {
      type: Object,
      default: () => ({})
    },
    pretime: [Number, String], // 上一条信息的时间
    preMsg: {
      type: [Object, undefined],
      default: undefined
    },
  },

  computed: {
    ...mapState({
      imInfo: (state) => state.flooim.imInfo
    }),
    // 附件信息
    attachImage() {
      return this.getImage({});
    },
    // 动态设置是否显示时间
    showTime() {
      return getChatTime(this.message.timestamp, this.pretime);
    },
    sameUserWithLastMsg() { 
      return this.preMsg?.from === this.message.from
    },
    showAvatar() { 
      return this.message.g_client_mid == undefined && (this.sameUserWithLastMsg == false || this.showTime) ;
    },
    showName() { 
      return this.message.isSelf === false && this.sameUserWithLastMsg === false;
    },
  },

  methods: {
    // 处理附件信息
    getImage({ url = '', type = 'roster', thumbnail = true }) {
      if (!url) {
        const attach = this.message.attach || {};
        url = attach.url;
      }
      return this.imInfo?.sysManage.getImage({ avatar: url, type, thumbnail });
    },

    resend() { 
      this.$emit('resend', this.message)
    }
  }
};
</script>

<style lang="scss" scoped>
.chat-cell {
  margin-top: 12rpx;
  .chat-info {
    overflow: hidden;
  }
  .chat-content {
    margin: 0 12rpx;
    float: left;
  }
  .chat-content.isSelf {
    float: right;
  }
  // 信息
  .message-box {
    display: inline-block;
    box-sizing: border-box;
    // margin-top: 5rpx;
    padding: 14rpx 20rpx;
    max-width: 492rpx;
    line-height: 1.5;
    border-radius: 0rpx 12rpx 12rpx 12rpx;
    background-color: #f7f8f8;
    word-wrap: break-word;
    .msg-image {
      width: 300rpx;
      // max-height: 300rpx;
    }
  }
  .message-box.isSelf {
    float: right;
    background-color: #e4f2ea;
    border-radius: 12rpx 0 12rpx 12rpx;
  }
  // 头像
  .avatar-box {
    float: left;
  }
  .avatar-box.isSelf {
    float: right;
  }
  .g-avatar {
    width: 64rpx;
    height: 64rpx;
  }

  .resend {
    // padding: 0rpx 8rpx;
    height: 68rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    float: right;
  }
}
.chat-cell.isSame {
  margin-top: 4rpx;
}
</style>
