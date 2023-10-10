<template>
  <view class="profile h-full">
    <view class="avatarContainer">
      <GAvatar :avatar-data="{ avatar_url: profileInfo.avatar_url }" :size-in-rpx='334' handle-click="false"/>
      <view v-if="profileInfo.avatar_url == undefined || profileInfo.avatar_url.length < 1" class="album" @click="handleAlbum">
        <view class="icon-album"></view>
        <view>{{ '相册上传头像' }}</view>
      </view>
    </view>
    
    <view class="right-panel">
      <!-- <image :src="profileInfo.avatar_url"></image> -->
      <view class="p-top">
        <view class="username text-over">{{ profileInfo.username }}</view>
        <view class="region flex">
          <view class="flag"></view>
          <view class="region-name">中国</view>
        </view>
      </view>
      <view class="separator-line"></view>

      <view class="p-bottom">
        <view class="bot-line">
          <view class="line-item">
            <view class="value">{{ profileInfo.golf_age || 0 }}
              <text>年</text>
            </view>
            <view class="label">球龄</view>
          </view>
          <view class="line-item">
            <view class="value">{{ profileInfo.total_golf_games || 0 }}</view>
            <view class="label">比赛次数</view>
          </view>
          <view class="line-item">
            <view class="value">{{ profileInfo.total_played_course || 0 }}</view>
            <view class="label">打过球场</view>
          </view>
        </view>
        <view class="bot-line">
          <view class="line-item">
            <view class="value">{{ profileInfo.hcp || 0 }}</view>
            <view class="label">差点</view>
          </view>
          <view class="line-item">
            <view class="value">{{ profileInfo.best || 0 }}</view>
            <view class="label">最佳杆数</view>
          </view>
          <view class="line-item">
            <view class="value">{{ profileInfo.avg || 0 }}</view>
            <view class="label">平均杆数</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import GAvatar from '@/components/g-avatar/g-avatar.vue'

export default {
  components: {
    GAvatar,
  },
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    profileInfo() {
      return this.info
    },
  },
  data() {
    return { }
  },
  methods: {
    handleAlbum() {
      this.$emit('changeAvatar')
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../home-swipe.scss';


/*
  90 / 638  ( 330 / 638 * 90 = 46rpx, (334 -46) / 334 =  )= 81.970504705771
*/

$m-right: 42rpx;
.profile {
  margin-top: $home-swipe-top;
  
  color: white;
  position: relative;
  // background-color: #fff;
  background: rgba(23, 31, 28, 0.7);
  backdrop-filter: blur(14.9506px);
  display: flex;
  
  .avatarContainer {
    width: 48.688047%; // 334 / 686
    z-index: 1;

    clip-path: polygon(
      0% 0%, 100% 0%, 
      86.227545% 100%, 0% 100%);

    .album {
      position: absolute;
      padding: 4rpx 16rpx;
      left: 58rpx;
      bottom: 34rpx;

      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10rpx);
      border-radius: 44rpx;

      font-size: 20rpx;
      line-height: 24rpx;
      letter-spacing: -0.3rpx;
      color: #FFFFFF;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4rpx;

      .icon-album {
        @include bgImage(20rpx, 16rpx, "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_album_white.svg")
      }
    }
  }


  
  .right-panel {
    position: absolute;
    top: 0;
    right: 0;
    width: 58.017493%; // 398 / 686
    height: 100%;

    display: flex;
    flex-direction: column;

    .p-top {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      
      margin-top: 28rpx;
      margin-right: $m-right;
    
      .username { 
        margin-left: calc(46rpx + 28rpx);
        @include rubikVar(700);
        font-size: 32rpx;
        line-height: 38rpx;
      }

      .region {
        gap: 6rpx;
        .flag{
          width: 26rpx;
          height: 18rpx;
          background: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/flags/4x3/cn.svg');
          background-size: 100%;
        }
        .region-name {
          font-weight: 400;
          font-size: 20rpx;
          line-height: 28rpx;
        }
      }
    }

    .separator-line {
      margin-top: 24rpx;
      width: 100%;
      height: 4rpx;
      background: rgba(255, 255, 255, 0.08);
    }

    .p-bottom {
      margin-top: 28rpx;
      margin-right: $m-right;
      margin-bottom: 36rpx;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;

      gap: 22rpx;

      .bot-line {
        display: flex;
        justify-content: flex-end;
        
        .line-item {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;

          margin-left: 42rpx;
          width: 80rpx;

          .value {
            position: absolute;
            top: 0rpx;
            right: 0rpx;

            @include rubikVar(500);
            font-size: 28rpx;
            line-height: 33rpx;
            letter-spacing: -0.3rpx;
            color: #FFFFFF;

            > text {
              font-size: 20rpx;
              line-height: 24rpx;
              padding-left: 2rpx;
            }
          }

          .label {
            margin-top: 33rpx;
            text-align: right;
            font-weight: 400;
            font-size: 20rpx;
            line-height: 28rpx;
            letter-spacing: -0.3rpx;
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }
    }
  }
}

.align-center-x {
  transform: translateX(-50%);
}
</style>
