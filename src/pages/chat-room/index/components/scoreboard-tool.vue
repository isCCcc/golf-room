<!--
 * @Author: simon
 * @Description: 计分版工具栏
 * @LastEditors: simon
-->
<template>
  <view class="foot-wrapper flex-between">
    
    <view class="swiper-container">
      <image class="banner-img" :src="ad.image" @click="handleTool('ad', ad)"></image>

<!--      <swiper vertical="true" :autoplay="true" :circular="true" interval="3000">
      	<swiper-item v-for="(ad, index) in ads">
      		<image class="banner-img" :src="ad.image" @click="handleTool('ad', ad)"></image>
      	</swiper-item>
      </swiper> -->
    </view>
    
    <view class="tool-box flex fs-20">
      <!-- <view class="tool-cell"
            @click="handleTool('toggle', undefined)">
        <view class="tool-icon tool-icon-toggle"></view>
        <view>收起</view>
      </view> -->
      <view class="tool-cell" :style="{ opacity: isSelfCompetitor ? 'inherit' : '0.3' }" @click="isSelfCompetitor && handleTool('toggleAdd')">
        <view class="tool-icon tool-icon-add"></view>
        <view>球员</view>
      </view>
      <view class="tool-cell" @click="handleTool('toggleScreen')">
        <view class="tool-icon tool-icon-scale"></view>
        <view>横屏</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    isSelfCompetitor: {
      type: [Boolean, undefined],
      default: false,
    },
  },
  data() {
    return {
      ads: [
        {
          wxmp: {
            id: 'wxd44b92011bdeefe6',
            path: '',
          },
          image:`https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pic_ad_banner_cb_1.png?t=${new Date().getTime()}`,
        },
        {
          wxmp: {
            id: 'wxbedf86c7fab79e45',
            path: 'pages/home/dashboard/index',
          },
          image: `https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/ad_humanuniform.jpg?t=${new Date().getTime()}`,
        },
        {
          wxmp: {
            id: 'wx870ed11b27aaedd8',
            path: 'pages/home/dashboard/index',
          },
          image: `https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/ad_3.jpg?t=${new Date().getTime()}`,
        }
      ]
    }
  },
  computed: {
    ad() {
      // let random = Math.floor(Math.random() * 10)
      // let key = random % 3
      let key = Math.round(Math.random() * (this.ads.length - 1))
      return this.ads[key];
    }
  },
  methods: {
    handleTool(type, extra) {
      this.$emit('onClick', type, extra);
    }
  }
};
</script>

<style lang="scss" scoped>
// S 底部
.foot-wrapper {
  padding: 0 12rpx;
  background-color: #003c3d;
  height: 94rpx;
  .banner-img {
    flex: 1;
    // background: url(var(--ad-img-url))
    //   no-repeat center;
    background-size: cover;
    height: 70rpx;
  }

  .tool-box {
    .tool-cell {
      padding: 5rpx 0;
      margin-left: 12rpx;
      width: 70rpx;
      flex: 0 0 70rpx;
      height: 70rpx;
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      box-sizing: border-box;
      .tool-icon {
        margin: 0 auto;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        height: 34rpx;
      }
      .tool-icon-toggle {
        background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/icon-arrow-top.png');
        width: 25rpx;
      }
      .tool-icon-add {
        width: 24rpx;
        background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12h24M12 0v24' stroke='%23fff' stroke-width='3'/%3E%3C/svg%3E");
      }
      .tool-icon-scale {
        width: 40rpx;
        background-image: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/icon-screen-landscape.png");
      }
    }
  }
}
.swiper-container {
  width: 100%;
  height: 70rpx;
  overflow: hidden;
}
// E 底部
</style>
