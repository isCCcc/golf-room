<template>
  <view class="root">
  
    <!-- 公告 -->
    <view v-if="msgExt.msg_type === 'announcement'" class="announcement">
      <span>{{ message.content }}</span>
    </view>

    <!-- 系统通知显示类型 -->
    <view v-else-if="msgExt.msg_type === 'commentary'" class="commentary">
      <mp-html :content="commentaryHtml" :copy-link="false" @linktap="handleLinkTap"></mp-html>
    </view>

    <!-- 系统通知显示类型 -->
    <view v-else-if="msgExt.msg_type === 'system_broadcast'" class="system-broadcast">
      <mp-html :content="systemBroadcastHtml" :copy-link="false" @linktap="handleLinkTap"></mp-html>
    </view>

    <!-- 比赛结束 -->
    <view v-else-if="msgExt.msg_type === 'competition_end'" class="competition-end">
      <mp-html :content="competitionEndHtml" :copy-link="false" @linktap="handleLinkTap"></mp-html>
    </view>

    <!-- 播报，广播 -->
    <view v-else-if="msgExt.msg_type === 'broadcast'" class="broadcast">
      <span class="broadcast-mark">
        <image class="broadcast-img"
        src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/icon_broadcast.svg"
        mode="aspectFit"
        />
        <text class="broadcast-title">{{'播报'}}</text>
      </span>
      <span class="common-name">{{ namePart }}</span>
      <span class="broadcast-content">{{ message.content }}</span>
    </view>

    <!-- 进入房间 -->
    <view v-else-if="msgExt.msg_type === 'enter_room'" class="enter-room">
      <span>{{"欢迎"}}</span>
      <span class="name" @click="handleNameClick">{{ ' @' + userName + ' ' }}</span>
      <span>进入房间</span>
    </view>

    <!-- text-content 需要通过 msg_type 排除，暂时不支持显示的消息 -->
    <view v-else-if="message.type == 'text' && msgExt.msg_type == null" class="text-content">
      <view v-if="message.isCompetitor == true" 
            class="competitor-badge" 
            @click="handleNameClick">
        <view class="badge-icon"></view>
      </view>
      <view v-else-if="message.isCaddie == true" 
            class="caddie-badge" 
            @click="handleNameClick">
        <view class="badge-icon"></view>
      </view>
      <span :class="[namePartClass]"
            @click="handleNameClick">{{ namePart }}</span>
      <span :class="[contentPartClass]">{{ message.content }}</span>
      <!-- 添加重发按钮 -->
      <!-- <span>
        <view class="resend">
          <uni-icons type="refresh" size="40rpx" @click.stop="resend"></uni-icons>
        </view>
      </span> -->
    </view>

  </view>
</template>

<script>
// vuex
import { mapState } from 'vuex';
import mpHtml from "@/components/mp-html/components/mp-html/mp-html.vue"
import { Base64 } from 'js-base64'
import { systemBroadcastStyle, commentaryStyle } from '@/utils/html/message-helper';

export default {
  emits: ['resend'],
  props: {
    /**
     * 前一条消息
     */
    preMsg: {
      type: [Object, undefined],
      default: undefined
    },
    /**
     * 当前消息
     */
    message: {
      type: Object,
      default: () => ({})
    },
  },

  components: {
    mpHtml,
  },

  computed: {
    ...mapState({
      imInfo: (state) => state.flooim.imInfo,
      userInfo: (state) => state.user.userInfo,
    }),
    // 附件信息
    // attachImage() {
    //   return this.getImage({});
    // },
    // // 动态设置是否显示时间
    // showTime() {
    //   return getChatTime(this.message.timestamp, this.pretime);
    // },
    // sameUserWithLastMsg() { 
    //   return this.preMsg?.from === this.message.from
    // },
    // showAvatar() { 
    //   return this.message.g_client_mid == undefined && (this.sameUserWithLastMsg == false || this.showTime) ;
    // },
    // showName() { 
    //   return this.message.isSelf === false && this.sameUserWithLastMsg === false;
    // },

    /**
     * 消息 ext 的对象化，可能为空
     */
    msgExt() {
      var result = null;
      try {
        result = JSON.parse(this.message.ext)
      } catch (e) {
        console.error("Cannot parse message ext", this.message.ext);
      }
      return result || {};
    },

    userName() {
      return this.message.nick_name
        || (this.message.isSelf && this.userInfo.username)
        || this.msgExt.username
        || '微信用户'
    },

    namePart() {
      return (this.message.isSelf ? '[我]' : '') + this.userName + ": "
    },

    namePartClass() {
      console.log('namePartClass', this.message);
      if (this.message.isCompetitor) {
        return 'competitor-name'
      } else if (this.message.isCaddie) {
        return 'caddie-name'
      } 
      return 'common-name'
    },
    contentPartClass() {
      if (this.message.isCompetitor) {
        return 'competitor-text'
      } else if (this.message.isCaddie) {
        return 'caddie-text'
      } 
      return ''
    },

    systemBroadcastHtml() {
      const baseStyle = systemBroadcastStyle;
      const origHtml = this.msgExt.html_content || Base64.decode(this.msgExt.html_encoded || '');
      const newStyledHtml = [baseStyle, origHtml.replace(/<style>(.*)<\/style>/gi, '')].join('\n')
      return newStyledHtml
    },

    commentaryHtml() {
      const baseStyle = commentaryStyle;
      const origHtml = this.msgExt.html_content || Base64.decode(this.msgExt.html_encoded || '');
      let newStyledHtml = [baseStyle, origHtml.replace(/<style>(.*)<\/style>/gi, '')].join('\n')
      newStyledHtml = newStyledHtml.replace(/<div class='root'>/gi, "<div class='root'>"
        // + `<img class="commentary-badge-icon" 
        //         src='https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_message_commentay.png' />`

        // + `
        //   <view class="commentary-badge">
        //     <img class="commentary-badge-icon"
        //           src='https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_message_commentay.png' />
        //   </view>
        //   `

        + `<view class="commentary-badge">
            <view class="commentary-badge-icon"></view>
          </view>`

        // + `<view class="commentary-badge-icon"></view>`
      )
      return newStyledHtml
    },

    competitionEndHtml() {
      return this.message.content;
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
    },

    handleNameClick() {
      uni.$emit('name_tap_chat_msg', this.message.from || this.msgExt.im_id)
    },

    handleLinkTap(e) {
      uni.$emit('link_tap_chat_msg', e.href)
    },
  }
};
</script>

<style lang="scss" scoped>
.root {
  $base-line-height: 36rpx;
  margin-top: 20rpx;

  font-style: normal;
  font-weight: 400;
  font-size: 26rpx;
  line-height: $base-line-height;

  @mixin common_h_margin($offset: 0rpx) {
    margin-left: calc(36rpx + $offset);
    margin-right: calc(36rpx + $offset);
  }

  .announcement {
    @include common_h_margin();
    
    text-align: center;

    font-weight: 400;
    font-size: 22rpx;
    letter-spacing: -0.3rpx;

    color: #AEAEAE;
  }

  .commentary {
    @include common_h_margin();
  }

  .system-broadcast {
    @include common_h_margin(-36rpx);
  }

  .broadcast {
    @include common_h_margin();

    .broadcast-mark {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      gap: 4rpx;

      color: #9A937B;
      background: #FBF7F1;
      border: 1px solid #E6DFC9;
      border-radius: 34rpx;
      height: 34rpx;
      padding: 0rpx 12rpx;
      margin-right: 8rpx;
    }
    .broadcast-img {
      width: 22rpx;
      height: 20rpx;
    }
    .broadcast-title {
      font-weight: 400;
      font-size: 20rpx;
    }
    .broadcast-content {
      color: #A8845B;
      line-height: 38rpx;
    }
  }
  

  .common-name {
    color: #A3A3A3;
  }

  .competitor-badge {
    display: inline-flex;
    align-items: center;
    height: $base-line-height;
    margin-right: 8rpx;
    vertical-align: text-bottom;

    .badge-icon {
      @include bgImage(84rpx, 30rpx, 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_message_live_player_v4_blue.png')
    }
  }
  .competitor-name {
    font-weight: 500;
    color: #235579;
  }

  .competitor-text {
    color: #235579;
  }
  
  .caddie-badge {
    display: inline-flex;
    align-items: center;
    height: $base-line-height;
    margin-right: 8rpx;
    vertical-align: text-bottom;

    .badge-icon {
      @include bgImage(116rpx, 30rpx, 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_message_live_caddie_v2_green.png')
    }
  }
  .caddie-name {
    font-weight: 500;
    color: #768F24;
  }

  .caddie-text {
    color: #768F24;
  }

  .enter-room {
    @include common_h_margin();

    color: #A3A3A3 ;

    .name {
      color: black;
    }
  }

  .text-content {
    @include common_h_margin();
  }
  

  .resend {
    height: 34rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    float: right;
  }
}
</style>
