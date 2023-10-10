<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="page root" :style="{'--tab-bar-height': tabBarHeight +'px'}" @touchstart="handleRootTS">
    <!-- S 顶部布局结束 -->
    <view class="top-bg pr">
      <uni-nav-bar statusBar backgroundColor="transparent" :border="false">
        <view class="flex-center w-auto">
          <view class="icon-nav-name w-auto"></view>
        </view>
      </uni-nav-bar>
      <!-- /自定义bar -->
      <view class="swiper pr mt-8">
        <HomeSwiper v-if="isAuth" ref="swiperRef" @click-change="handleSwiperChange"></HomeSwiper>
        <view v-else class="flex-col items-center unlogin">
          <view class="text-desc1">登录注册</view>
          <view class="text-desc2">登录后创建高球房间、观看和关注球局</view>
          <view class="btn" @click="handleOpenAuthPopup">
            <view class="wx-icon"></view>
            <view>{{ '微信一键登录' }}</view>
          </view>
        </view>
      </view>
      <!-- /swiper -->
    </view>
    <!-- E 顶部布局结束 -->

    <!-- S 房间信息 -->
    <HomeList
      class="home-list"
      ref="HomeListRef"
      @login="handleOpenAuthPopup"
      @toggleSelector="handleToggleSelector"
    />
    <!-- E 房间信息 -->
  </view>
</template>

<script>
import UniNavBar from '@components/uni-nav-bar/uni-nav-bar'
import HomeSwiper from './components/home-swiper'
import HomeList from './components/home-list/index.vue'
import { mapGetters } from 'vuex'
import TabBar from '@mixins/tabbar'
import { handleOnload } from '@utils/share/index';

export default {
  components: { UniNavBar, HomeSwiper, HomeList },
  mixins: [TabBar],
  data() {
    return {
      handleOnloadTimeout: false,
    }
  },
  computed: {
    ...mapGetters({
      userInfoAllSyncOnce: 'user/userInfoAllSyncOnce',
      isAuth: 'user/isAuth',
    }),

    userInfoAllSyncOnceOrTimeout() {
      return this.userInfoAllSyncOnce || this.handleOnloadTimeout
    }
  },
  watch: {
    userInfoAllSyncOnceOrTimeout: function (newVal, oldVal) {
      // 用户信息同步状态变化，尝试处理上缓存的参数
      console.log('userInfoAllSyncOnceOrTimeout', newVal);
      if (newVal != true) { return }
      setTimeout(() => {
        this.handleOnloadTimeout = false // 重置
        handleOnload({isReady: newVal});
      }, 0)
    }
  },
  onLoad(options) {
    // 处理分享后的打开行为
    handleOnload({ options, isReady: this.userInfoAllSyncOnceOrTimeout });
    this.onGREvent('handle_onload_option_timeout', (timeout) => {
      this.handleOnloadTimeout = timeout;
    })
  },
  onShow() {
    this.setTabBarIndex(0)
    this.$refs?.swiperRef?.getBannerLists()
    this.$refs?.HomeListRef?.getCourseData({ glWithEmpty: true })
  },

  onHide() {
    this.$refs?.HomeListRef?.onParentPageHide();
  },

  methods: {
    // touchstart 监听， 用于通知 swipe-item 收起
    handleRootTS(e) { 
      uni.$emit("home-touch-start", e);
    },
    handleOpenAuthPopup() {
      this.grTryShowAuthorization();
    },
    handleToggleSelector(isMask) {
      if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
        this.$mp.page.getTabBar().setData({
          isMask,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './components/home-swiper/home-swipe.scss';

.root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
/* 顶部布局样式 */
.top-bg {
  // height: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  background: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/rectangle707.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.icon-nav-name {
  height: 58rpx;
  background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/logo.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.swiper {
  z-index: 10;
  // left: 32rpx;
  // right: 32rpx;
  // bottom: 32rpx;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(30rpx + $home-swipe-content-height + $home-swipe-top);
  .unlogin {
    color: #fff;
    .text-desc1 {
      margin-top: 48rpx;
      font-weight: 600;
      font-size: 48rpx;
      line-height: 67rpx;
    }
    .text-desc2 {
      margin-top: 12rpx;
      font-weight: 400;
      font-size: 24rpx;
      line-height: 34rpx;
    }
    .btn {
      margin-top: 28rpx;
      width: 482rpx;
      height: 96rpx;
      color: #fff;
      border: 1px solid #fff;
      
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
      backdrop-filter: blur(25rpx);
      border-radius: 5rpx;
      font-weight: 600;
      font-size: 28rpx;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10rpx;
      

      .wx-icon {
        padding-bottom: 4rpx; // 为了看起来与文字中间对齐
        width: 44rpx;
        height: 34rpx;
        background-image: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_wechat_white.svg");
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
  }
}
.home-list {
  flex: 1;
  overflow: hidden;
  padding-bottom: var(--tab-bar-height);
}
</style>
