<template>
  <view class="par-statistic-wrapper">
    <view class="item">
      <view class="num rubik">{{eagles}}</view>
      <view class="label">Eagles-</view>
    </view>
    <view class="item">
      <view class="num rubik">{{birdies}}</view>
      <view class="label">Birdies</view>
    </view>
    <view class="item">
      <view class="num rubik">{{pars}}</view>
      <view class="label">Pars</view>
    </view>
    <view class="item">
      <view class="num rubik">{{avg}}</view>
      <view class="label">平均杆</view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      eagles: {
        type: Number,
        default: 0
      },
      birdies: {
        type: Number,
        default: 0
      },
      pars: {
        type: Number,
        default: 0
      },
      avg: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {}
    }
  }
</script>

<style lang="scss" scoped>
  .par-statistic-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-around;
    padding: 12rpx 20rpx;
    border: 1px solid #F1F1F1;
    border-radius: 4rpx;
    .num {
      font-size: 28rpx;
      color: #000;
    }
    .label {
      font-size: 20rpx;
      color: #999;
    }
  }
</style>