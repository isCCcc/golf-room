<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: Please set LastEditors
-->
<template>
  <view class="page root">
    <view class="top-bg">
      <GNavbar title="更多" />
    </view>
    <view class="content-box" @click="handleContentPartClick">
      <!-- 列表 -->
      <view class="list-box">
        <view class="border-b h-120 flex">
          <GCell label="关于 golfroom" isLink class="flex1">
            <uni-icons
              slot="left-icon"
              type="info"
              size="40rpx"
              color="#999999"
              class="icon"
            ></uni-icons>
          </GCell>
        </view>
        <button plain class="h-120 flex p-0 border-0" open-type="contact">
          <uni-icons
            slot="left-icon"
            type="email"
            size="40rpx"
            color="#999999"
            class="icon"
          ></uni-icons>
          <GCell label="联系我们" isLink class="flex1" />
        </button>

        <button v-if="showOptions" plain class="h-120 flex p-0 border-0" @click.stop="handleLogout">
          <uni-icons
            slot="left-icon"
            type="clear"
            size="40rpx"
            color="#999999"
            class="icon"
          ></uni-icons>
          <GCell label="退出登录" isLink class="flex1" />
        </button>

        <button v-if="showOptions" plain class="h-120 flex p-0 border-0" @click.stop="handleSwitch">
          <uni-icons
            slot="left-icon"
            type="loop"
            size="40rpx"
            color="#999999"
            class="icon"
          ></uni-icons>
          <GCell label="切换环境" isLink class="flex1" />
        </button>
      </view>
    </view>
    <!-- 版本信息显示，简单添加，后期注意布局 -->
    <view v-if="versionInfos.length" class="flex-center w-auto fixed-bottom col-c4">
      <text class="fs-20 mt-10 mb-10 tc"> {{ versionInfos }}</text>
    </view>
  </view>
</template>

<script>
import GNavbar from '@/components/g-navbar/index.vue'
import UniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
import { mapGetters } from 'vuex'
import TabBar from '@mixins/tabbar'
import GCell from '@components/g-cell/index'
import { APP_ENV_TYPES } from '@/store/modules/app'
import { SysStaticInfo } from '@/utils/system/static-info'
import { realtimeLogger } from '@/mixins/gr-mp-logging'

export default {
  components: { GNavbar, UniIcons, GCell },
  mixins: [TabBar],
  data() {
    return {
      acts: [],
      showOptions: false,
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
      userInfoInStore: 'user/userInfo',
    }),

    userInfo() { 
      return this.isAuth ? this.userInfoInStore : {};
    },

    showLogout() {
      return this.isAuth && false;
    },

    versionInfos() {
      return [
        SysStaticInfo.versionInfo,
        SysStaticInfo.wxVersionInfo,
      ].join('\n') 
    },
  },
  mounted() {
    const accountInfo = uni.getAccountInfoSync();
    this.mpVersion = accountInfo?.miniProgram?.version
    this.mpEnvVersion = accountInfo?.miniProgram?.envVersion
    this.theGCHash = process.env.G_C_HASH
    this.theGWip = process.env.G_WIP
  },
  onShow() {
    // this.isAuth && this.$store.dispatch('user/GET_USER_INFO', { showLoadingWithData: false })
  },

  methods: {
    handleOpenAuthPopup() {
      this.grTryShowAuthorization()
    },

    handleLogout() { 
      console.log("handleLogout")

      this.$store.dispatch("user/CLEAR_LOGIN_INFO")
      // #ifdef MP-WEIXIN
      wx.reLaunch({
        url: '/pages/tabbar/home/index'
      })
      // #endif
    },

    handleContentPartClick(e) {
      
      if (process.env.NODE_ENV !== "production") {
        this.acts.splice(0, 0, e)
        this.acts.splice(20)

        let continuousClicks = 10
        if (this.acts.length >= continuousClicks) {
          let lastTimestamp = undefined
          for (const act of this.acts) {
            if (lastTimestamp == undefined || (lastTimestamp - act.timeStamp < 200)) {
              lastTimestamp = act.timeStamp;
              continuousClicks--;
              continue;
            }
            break;
          }
          if (continuousClicks < 1) {
            realtimeLogger.rtInfo('Dev showOptions')
            this.showOptions = !this.showOptions;
            this.acts.length = 0;
          }
        }
      }

    },

    handleSwitch() {
      if (process.env.NODE_ENV !== "production") {
        const options = [
          { title: '生产环境', env: APP_ENV_TYPES.PRO },
          { title: '开发环境', env: APP_ENV_TYPES.DEV },
        ]
        uni.showActionSheet({
          title: '选择环境',
          itemList: options.map((option) => { return option.title }),
          success: (res) => {
            console.log("选择环境", options[res.tapIndex].env)
            this.$store.dispatch("CHANGE_APP_ENV", options[res.tapIndex].env)    
            this.$store.dispatch("user/CLEAR_LOGIN_INFO")

            this.handleLogout();
          }
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.top-bg {
  // position: relative;
  width: 100%;
  z-index: 999;
  background: linear-gradient(180deg, rgba(30, 36, 31, 0.5) 0%, #003c3d 100%),
    url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/user-bg2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.content-box {
  flex: 1;
  padding: 32rpx 32rpx 0rpx 32rpx;
  box-sizing: border-box;
  position: relative;
}
/* 顶部布局样式 */


.user-info-box {
  width: 686rpx;
  height: 184rpx;
  border-radius: 4rpx;
  padding: 42rpx 32rpx;
  box-sizing: border-box;
  // margin-top: 11%;
  box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08), inset -2rpx 4rpx 2rpx rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(30rpx);
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)),
    radial-gradient(
        111.14% 186.41% at 8.6% 100%,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(255, 255, 255, 0) 100%
      )
      /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
    radial-gradient(
        155.16% 1032.36% at 25.73% 76.36%,
        rgba(255, 255, 255, 0.9) 0%,
        rgba(255, 255, 255, 0) 100%
      )
      /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
}

.g-avatar {
  width: $img-size-100;
  height: $img-size-100;
  background: #ddd;
  border: 2rpx solid #ffffff;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.15);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 24rpx;
}

.edit-btn {
  width: 100rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  border-radius: 4rpx;
  font-size: 20rpx;
  color: #fff;
  background-color: $col-1e3;
}

.history-info-box {
  margin: 32rpx 0;
  .history-warp {
    box-sizing: border-box;
    padding: 32rpx;
    width: 335rpx;
    height: 156rpx;
    background: #fff;
    border-radius: 4rpx;
  }
  .title {
    font-size: 24rpx;
    color: $col-999;
  }
  .number {
    @include rubikVar();
    font-style: normal;
    margin-top: 12rpx;
    font-size: 40rpx;
  }
  font-weight: 400;
}
.chadian {
  font-weight: 600;
  font-size: 24rpx;
  line-height: 34rpx;
  margin-top: 5rpx;
  color: #999999;
}

.list-box {
  background-color: #ffffff;
  border-radius: 4rpx;
  padding: 0 34rpx;
  .icon {
    margin-right: 20rpx;
  }
}

.p-0 {
  padding: 0;
}
.border-0 {
  border: none;
}
</style>
