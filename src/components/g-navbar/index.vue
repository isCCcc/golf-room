<template>
  <view class="root" :style="{'z-index': zIndex, '--title-opacity': titleOpacity, '--bg-opacity': bgOpacity, '--bg-style': bgStyle}">
    <view class="nav-bg"></view>
    <uni-nav-bar
      class="nav"
      :fixed="fixed"
      :height="height"
      :leftWidth="leftTitled? 32 : 60"
      :rightWidth="leftTitled ? 87 : 60"
      statusBar
      backgroundColor="transparent"
      color="#ffffff"
      :border="false"
      @clickLeft="handleClickLeft"
    >
      <!-- 左边部分 -->
      <template slot="left">
        <view v-if="showBack" :class="['flex-center', lightTheme ? 'back-arrow-light' : 'back-arrow'] " >
          <view class="icon-back" />
        </view>
      </template>
      
      <!-- 中间部分 -->
      <slot>
        <view class="tc w-auto title-container">
          <view class="title">{{ title }}</view>
        </view>
      </slot>
    </uni-nav-bar>
  </view>
</template>

<script>
// import UniNavBar from "@components/uni-nav-bar/uni-nav-bar.vue";

export default {
  name: "g-navbar",
  components: {
    // UniNavBar,
  },
  props: {
    zIndex: {
      type: [Number, String],
      default: 'inherit',
    },
    lightTheme: {
      type: [Boolean, undefined],
      default: false,
    },
    showBack: {
      type: Boolean,
      default: true,
    },
    /**
     * 自定义返回处理
     */
    customBack: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [Number, String],
      default: 44,
    },
    fixed: {
      type: [Boolean, String],
      default: false,
    },
    leftTitled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "aa",
    },
    titleOpacity: {
      type: [Number, undefined],
      default: 1,
    },
    bgOpacity: {
      type: [Number, undefined],
      default: 1,
    },
    bgStyle: {
      type: [String, undefined],
      default: 'linear-gradient(180deg, rgba(30, 36, 31, 0.5) 0%, #003c3d 100%), url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/user-bg2.png")',
    }
  },
  data() {
    return {};
  },
  methods: {
    handleClickLeft() {
      if (this.showBack === false) return; 

      // 自定义 back 处理？
      if (this.customBack == true) {
        this.$emit("clickLeft");
        return
      }

      let pages = getCurrentPages();
      if (pages.length > 1) {
        uni.navigateBack();
      } else {
        uni.switchTab({
          url: '/pages/tabbar/home/index'
        });
      }
      
      // 最后通知一下
      this.$emit("backHandled");
    },
  },
};
</script>

<style lang="scss" scoped>
.root {
  width: 100vw;
  position: relative;
}
.nav-bg {
  position: absolute;
  opacity: var(--bg-opacity);
  width: 100%;
  height: 100%;

  // 同 .g-nav-bar
  background: var(--bg-style);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.nav {
  position: relative;
}


.title-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: var(--title-opacity);
}
.title {
  font-size: 18px;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
}
</style>
