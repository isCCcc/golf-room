<template>
  <view class="page">
    <GNavbar fixed title="分享二维码" />
    <view class="wrapper">
      <view class="head">
        <view class="head-name">{{ info.name }}</view>
        <view class="head-info">
          <image
            src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_date.png"
            class="icon-date mr-10"
            mode="widthFix"
          />
          {{ displayTime }}
        </view>
        <view class="head-info">
          <image
            src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_location.png"
            mode="widthFix"
            class="icon-map mr-10"
          />
          {{ info.course }}
        </view>
      </view>
      <view class="body">
        <image class="body-qrcode" :src="qrcode" />
        <view class="body-tips">{{ bodyTips }}</view>
        <view class="mt-28 flex room-part">
          <view class="flex-center room-info">
            <view class="room-title">房间号</view>
            <view class="room-num"> {{info.no}} </view>
          </view>
          <view class="flex copy-btn" @click.stop="copyRoomNum">
            <view class="copy-btn-icon"></view>
            <view class="">复制</view>
          </view>
        </view>
      </view>
      <view class="foot">
        <view class="foot-user">
          <image class="foot-user__avatar" :src="getGenderedAvatar(userInfo)" />
          <view class="flex-col">
            <view class="foot-user__name">{{ userInfo ? userInfo.username : '' }}</view>
            <view v-if="userInfo && userInfo.hcp" class="foot-user__hcp">{{ "最新差点 " + (userInfo ? userInfo.hcp : '') }}</view>
          </view>
        </view>
        <view class="foot-text">
          <view>来组队打球</view>
          <view>结识志同道合的球友</view>
        </view>
      </view>
      <button class="share-btn" open-type="share">
        <view class="share-btn-icon"></view>
        <view class="">分享到微信</view>
      </button>
    </view>

    <image
      class="logo"
      mode="widthFix"
      src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/logo.png"
    />

    <image
      class="bg"
      src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/bg.png"
    />
  </view>
</template>

<script>
import GNavbar from '@/components/g-navbar/index.vue'
import { formatDate } from '@/utils'
import { mapGetters, mapState } from 'vuex'
import { getJoinWxmpCode } from '@api/competition'
import { generatePageShareParamString, PAGES, PAGE_CHAT_SHARE_TYPE, shareCompetition, shareCompetitionInvite } from '@utils/share';
import { getWxQRCode } from '@/api/utils';
import { genderedAvatar } from '@/utils/image';

export default {
  components: {
    GNavbar,
  },
  data() {
    return {
      info: {},
      qrcode: '',
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    displayTime() {
      const { time } = this.info
      return time ? formatDate(time, 'yyyy年MM月dd日 hh:mm') : ''
    },
    bodyTips() {
      const tips = {}; 
      tips[PAGE_CHAT_SHARE_TYPE.share] = '扫码围观比赛球局'
      tips[PAGE_CHAT_SHARE_TYPE.invite] = '扫码加入比赛球局'
      return tips[this.info.type] || ""
    }
  },
  onLoad({ params }) {
    try {
      this.info = JSON.parse(decodeURIComponent(params))
      this.getQrcode()
    } catch (error) {
      console.error('params info', error);
    }
  },
  methods: {
    getGenderedAvatar(user) {
      return genderedAvatar(user)
    },
    async getQrcode() {

      /*
        {
          page: PAGES.chat,
          params: [PAGE_CHAT_SHARE_TYPE.invite, id, group, uid]
        },

        const paramsStr = 'c=01-130-A-26'
      */
      const paramsStr = generatePageShareParamString(
        {
          page: PAGES.chat,
          params: [
            this.info.type,
            this.info.id,
            this.info.group,
            this.info.uid
          ]
        }
      );
      const res = await getWxQRCode({ scene: paramsStr })
      if (typeof res.data === 'string') {
        this.qrcode = 'data:image/png;base64,' + res.data
      }
    },
    copyRoomNum() { 
      uni.setClipboardData({
        data: this.info.no + '',
        success: (result) => {
          uni.showToast({ title: "复制成功", icon: 'success'})
        },
        fail: (error) => {
          uni.showToast({ title: "复制失败", icon: 'error'})
          console.log("复制", error);
        }
      })
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

      if (this.info.type == PAGE_CHAT_SHARE_TYPE.share) {
        return shareCompetition({
          id: this.info.id,
          group: this.info.group,
          uid: this.info.uid,
          shareRoomName: this.info.shareRoomName,
          imageUrl: '',
        });
      } else if (this.info.type == PAGE_CHAT_SHARE_TYPE.invite) {
        return shareCompetitionInvite({
          id: this.info.id,
          group: this.info.group,
          uid: this.info.uid,
          shareRoomName: this.info.shareRoomName,
          imageUrl: '',
        });
      } else { 
        return {};
      }
    }
  },
}
</script>

<style lang="scss">
page,
.page {
  background: linear-gradient(180deg, rgba(7, 62, 61, 0.7) 0%, rgba(7, 62, 61, 0.16) 100%),
    linear-gradient(180deg, rgba(7, 62, 61, 0.16) 0%, rgba(7, 62, 61, 0.7) 100%);
}

.page {
  padding-bottom: 120rpx;
  position: relative;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wrapper {
  margin: 72rpx 66rpx 48rpx 66rpx;
  position: relative;
  z-index: 1;
}

.head {
  // background-color: #95d171;
  background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/head.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center top;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 52rpx 0 40rpx 0;
  color: #fff;
  border-top-left-radius: 4rpx;
  border-top-right-radius: 4rpx;

  &-name {
    font-size: 32rpx;
    line-height: 45rpx;
    font-weight: 600;
    margin-bottom: calc(32rpx - 24rpx);
  }

  &-info {
    font-size: 24rpx;
    line-height: 34rpx;
    margin-top: 24rpx;
    display: flex;
    align-items: center;
  }

  .icon-date {
    width: 23rpx;
  }

  .icon-map {
    width: 36rpx;
  }
}

.body {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50rpx 0rpx 20rpx;

  &-qrcode {
    width: 420rpx;
    height: 420rpx;
  }

  &-tips {
    margin-top: 8rpx;
    font-weight: 500;
    font-size: 32rpx;
    line-height: 45rpx;
  }
}

.foot {
  margin-top: -2rpx; // 防止出现缝线
  // background-color: #ededed;
  height: 215rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 36rpx 32rpx 0 32rpx;
  background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/footer.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center bottom;

  &-user {
    display: flex;
    align-items: center;

    &__avatar {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      margin-right: 16rpx;
      flex-shrink: 0;
    }

    &__name {
      font-size: 24rpx;
      line-height: 34rpx;
      color: #535353;
    }

    &__hcp {
      margin-top: 3rpx;
      font-weight: 400;
      font-size: 20rpx;
      line-height: 28rpx;
      color: #C4C4C4;
    }
  }

  &-text {
    font-size: 22rpx;
    line-height: 160.5%;
    color: #999;
    text-align: right;
  }
}

.room-part {
  .room-info {
    justify-content: center;
    align-items: center;
    min-width: 316rpx;
    height: 64rpx;
    font-size: 28rpx;
    line-height: 39rpx;
    gap: 8rpx;
    background: #F9F9F9;
    border-radius: 2px;
    
    .room-title {
      font-weight: 400;
      color: #535353;
    }
    .room-num {
      font-weight: 500;
      color: #000000;
    }
  }

  .copy-btn {
    justify-content: center;
    align-items: center;
    gap: 8rpx;
    width: 146rpx;
    height: 64rpx;
    font-weight: 500;
    color: #284743;
    border-radius: 1rpx;
    background-color: $sub-color;

    .copy-btn-icon {
      width: 20rpx;
      height: 20rpx;
      background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_copy.svg');
      background-size: 100% 100%;
    }
  }
}

.share-btn {
  border-radius: unset;
  margin-top: 28rpx;
  background-color: $sub-color;
  width: 100%;
  height: 90rpx;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8rpx;

  font-weight: 500;
  font-size: 28rpx;
  line-height: 39rpx;
  color: #284743;

  .share-btn-icon {
    width: 44rpx;
    height: 34rpx;
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_wechat.svg');
    background-size: 100% 100%;
    fill: red;
  }
}


.logo {
  width: 116rpx;
  margin: 0 auto;
  display: block;
  position: relative;
  z-index: 1;
}
</style>
