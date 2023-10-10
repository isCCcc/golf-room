<!--
 * @Author: simon
 * @Description: pk活动cell
 * @LastEditors: simon
-->

<template>
  <view class="pk-cell flex-between">
    <view class="pk-info">
      <view class="fs-36 fw-bol pk-title">{{info.pk_name}}</view>
      <view class="fs-24 col-999 mt-10">{{info.pk_desc}}</view>
      <view class="count-box flex">
        <image :src="`${ossUrl}/images/pk/icon-hot.png`"
               class="icon-hot"
               mode="widthFix"></image>
        <view class="progress-box">
          <view class="progress-avtive" :style="{width: `${info.popularity}rpx`}"></view>
        </view>
        <view class="fs-24 dincond-black num">{{info.popularity}}</view>
      </view>
    </view>
    <!-- /活动信息 -->
    <view class="pk-image" :style="{backgroundImage: `url(${ossUrl}/images/pk/game/game00${info.pk_id}.png)`}"></view>
    <!-- /活动图片 -->
  </view>
</template>

<script>
export default {
  props: {
    info: Object
  },
  data(){
    return {
      ossUrl: this.$ossUrl,
      
    }
  },
  
};
</script>

<style lang="scss" scoped>
.pk-cell {
  height: 201rpx;
  box-sizing: border-box;
  background: linear-gradient(
      247.55deg,
      rgba(30, 62, 66, 0.06) 14.25%,
      rgba(149, 209, 113, 0) 64.62%
    ),
    #ffffff;
  border: 4rpx solid #ffffff;
  box-shadow: 0px 4rpx 30rpx rgba(57, 80, 69, 0.16);
  border-radius: 1px;
  // pk活动信息
  .pk-info {
    padding: 15rpx 28rpx;
    .pk-title {
      letter-spacing: 5rpx;
    }
    .count-box {
      margin-top: 30rpx;
      .icon-hot {
        width: 25rpx;
      }
      .progress-box {
        @include wh(111rpx, 16rpx);
        margin: 0 10rpx;
        background-color: $br-col-ed;
        transform: skew(-8deg,0);
        .progress-avtive {
          height: 100%;
          transform: skew(-8deg,0);
          background-color: $sub-color;
        }
      }
      .num {
        color: #c4c4c4;
      }
    }
  }
  // pk活动图片
  .pk-image {
    flex: 0 0 241rpx;
    @include wh(241rpx, 100%);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
  }
}
</style>
