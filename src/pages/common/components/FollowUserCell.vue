<template>
  <view class="root" :style="{ backgroundColor: rootBgColor}">
    <GAvatar class="avatar" :avatar-data="user" :size-in-rpx='80' :radius="'100%'" />
    <!-- 昵称和备注 -->
    <view class="mid" @click.stop="handleCellClick">
      <view class="mid-top">
        <text class="name">{{ user.username || '用户' }}</text>
        <image v-if="user && user.gender > 0" :src="`${ossUrl}/icons/${user.gender == 1 ? 'icon-male' : 'icon-female'}.png`" class="gender"
          mode="widthFix" />
      </view>
      <view class="mid-bot">
        <text v-if="subtitle && subtitle.length > 0 && type === 1" class="subtitle">{{ subtitle }}</text>
        <view class="col-999 fs-22" v-if="type === 2">差点：<text class="fs-26 col-black">{{user.hcp || 0}}</text></view>
        <view class="col-999 fs-22" v-if="type === 3">同组：<text class="fs-26 col-black">{{user.played_times || 0}}</text>次</view>
      </view>
    </view>
    <view class="right">
      <view v-if="type === 1" :class="[isFollowing ? 'unfollow-btn' : 'follow-btn']" @click.stop="followBtnClick">
        <text class="text">{{ isFollowing ? (isFans ? '互相关注' : '已关注') :  (isFans ? '回关' : '关注') }}</text>
      </view>
      <view v-else class="sub-wrap">
        <text class="fs-24 col-1e3" v-if="type === 2">同组：<text class="fs-32">{{user.played_times || 0}}</text></text>
        <text class="fs-24 col-1e3" v-if="type === 3">差点：<text class="fs-32">{{user.hcp || 0}}</text></text>
      </view>
    </view>
    <view v-if="showExtra" class="extra">
      <view class="close-btn" @click.stop="closeBtnClick">
        <view class="icon"></view>
      </view>
    </view>
  </view>
</template>

<script>
import GAvatar from '@/components/g-avatar/g-avatar.vue';

export default {
  emits: ['changeFollow', 'delete'],
  components: {
    GAvatar
  },
  props: {
    user: {
      type: [Object, undefined],
      default: undefined,
    },

    subtitle: {
      type: [String, undefined],
      default: undefined,
    },

    isUnread: {
      type: [Boolean],
      default: false,
    },

    showExtra: {
      type: [Boolean],
      default: false,
    },
    // 展示类型： 1:名称排序/2:同组次数/3:差点排序
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
    };
  },
  computed: {
    rootBgColor() {
      return this.isUnread ? '#F8FFF4' : '#FFFFFF'
    },
    isFollowing() {
      return this.user.is_follow || false;
    },
    isFans() {
      return this.user.is_fans || false;
    },
  },
  methods: {
    handleCellClick() {
      if (this.user?.uid) {
        uni.navigateTo({
          url: `/pages/tabbar/profile/UserProfile?uid=${this.user.uid}`,
          fail: (e) => {
            console.error(e);
          }
        });
      }
    },
    followBtnClick() {
      this.$emit('changeFollow', this.user)
    },
    closeBtnClick() {
      this.$emit('delete')
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  padding: 20rpx 32rpx;
  gap: 20rpx;

  // .avatar {}

  .mid {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .mid-top {
      display: flex;
      align-items: center;
      .name {
        @include ell(1);
        font-weight: 400;
        font-size: 28rpx;
        line-height: 40rpx;
        color: #000000;
      }

      .gender {
        width: 24rpx;
        height: 24rpx;
      }
    }

    .mid-bot {
      .subtitle {
        @include ell(2);
        font-weight: 400;
        font-size: 22rpx;
        line-height: 40rpx;
        color: #999999;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @mixin btnMixin() {
      box-sizing: border-box;
      padding: 0rpx 16rpx;
      min-width: 128rpx;
      min-height: 56rpx;

      text-align: center;
      font-weight: 500;
      font-size: 24rpx;

      border-radius: 4rpx;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .follow-btn {
      @include btnMixin();
      
      background: #95D171;
      border: 1rpx solid rgba(255, 255, 255, 0.2);
      color: #1E3E42;
    }

    .unfollow-btn {
      @include btnMixin();
      
      border: 1rpx solid #C4C4C4;
      border-radius: 4rpx;
      color: #535353;
    }
    
    .sub-wrap {
      width: 158rpx;
      height: 65rpx;
      line-height: 65rpx;
      background: #F6FFF0;
      border-radius: 4px;
      text-align: center;
    }
  }

  .extra {
    margin-left: -20rpx;
    margin-right: -32rpx;
    min-width: 80rpx;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .close-btn {
      position: relative;
      width: 56rpx;
      height: 56rpx;

      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        width: 16rpx;
        height: 16rpx;
        background-image: url("data:image/svg+xml,%3Csvg width='17' height='18' viewBox='0 0 17 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16.645 2.813L14.524.69l-6.01 6.01-5.656-5.656L.737 3.166l5.656 5.656L.38 14.834l2.122 2.12 6.011-6.01 6.365 6.364L17 15.187l-6.365-6.365 6.01-6.01z' fill='%23000' fill-opacity='.2'/%3E%3C/svg%3E");
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
