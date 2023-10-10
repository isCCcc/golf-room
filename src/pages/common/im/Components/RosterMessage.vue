<!--
 * Copy from `render-message.vue`
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
      <GAvatar class="avatar-box" 
                :style="{ visibility : showAvatar ? 'visible' : 'hidden' }"
                :class="{'isSelf': message.isSelf}" 
                :avatar-data="{ avatar_url: message.avatar }" 
                :size-in-rpx='64' 
                :radius="'100%'"
                :custom-click-handling="true"
                @avatar-click="handleAvatarClick"/>
      <!-- /头像 -->

      <view class="chat-content"
            :class="{'isSelf': message.isSelf}">
        <!-- /用户名称 -->

        <view class="fs-30 lh-42 message-box"
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
import { toNumber } from '@/utils/third/tools';
import GAvatar from '@/components/g-avatar/g-avatar.vue';
import { toUserProfile } from '@/utils/router';
export default {
  components: {
    GAvatar,
  },
  emits: ['resend'],
  props: {
    message: {
      type: Object,
      default: () => ({})
    },
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
      return getChatTime(this.message.timestamp, this.preMsg?.timestamp || 0);
    },
    sameUserWithLastMsg() { 
      return this.preMsg?.from === this.message.from
    },
    showAvatar() { 
      return true;
      // return this.message.g_client_mid == undefined && (this.sameUserWithLastMsg == false || this.showTime) ;
    },
    showName() { 
      return false;
      // return this.message.isSelf === false && this.sameUserWithLastMsg === false;
    },
  },

  beforeMount() {
    // const message = this.message;

    // const myImId = this.imInfo.userManage.getUid();
    // const fromUserObj = this.imInfo.rosterManage.getRosterInfo(message.from);
    // let extData = message.ext ? JSON.parse(message.ext) : {};
    // message.nick_name =
    //   fromUserObj?.nick_name ||
    //   fromUserObj?.username ||
    //   extData?.username;
    // message.avatar = fromUserObj?.avatar || extData?.avatar_url;
    // message.isSelf = toNumber(myImId) === toNumber(message.from);

    // console.log('beforeMount', this.message);
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

    handleAvatarClick() {
      toUserProfile({imUid: toNumber(this.message.from)})
    },

    resend() { 
      this.$emit('resend', this.message)
    }
  }
};
</script>

<style lang="scss" scoped>
.chat-cell {
  margin-top: 32rpx;
  margin-left: 24rpx;
  margin-right: 24rpx;

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
    padding: 16rpx 22rpx;
    max-width: 496rpx;
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
  margin-top: 32rpx;
}
</style>
