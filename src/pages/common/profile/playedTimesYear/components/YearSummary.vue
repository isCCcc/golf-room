<template>
  <view class="summary-wrapper flex">
    <view class="left">
      <view class="title">
        <text class="year rubik">{{ year }}</text>
        <text>合计</text>
      </view>
      <view class="legend flex">
        <view class="square once mr-8"></view>
        <text class="mr-8">1次</text>
        <view class="square times mr-8"></view>
        <text>多次</text>
      </view>
    </view>
    <view class="right w-auto tr">
      <text class="count rubik">{{ count }}</text>
      <text>次</text>
    </view>
  </view>
</template>

<script>
  export default {
    props: ['year', 'count'],
    data() {
      return {}
    }
  }
</script>

<style lang="scss" scoped>
  .summary-wrapper {
    padding: 32rpx 32rpx 24rpx;
    .left {
      flex: 0 0 160rpx;
      .title {
        color: #000;
        font-size: 24rpx;
        .year {
          font-size: 40rpx;
        }
      }
      .legend {
        font-size: 20rpx;
        color: #C0C0C0;
        .square {
          width: 16rpx;
          height: 16rpx;
          border-radius: 3rpx;
          background-color: #f8f8f8;
          &.once {
            background-color: #9FBE3D;
          }
          &.times {
            background-color: #3C6F30;
          }
        }
      }
    }
    .right {
      color: #000;
      font-size: 24rpx;
      .count {
        font-size: 80rpx;
        margin-right: 4rpx;
      }
    }
  }
</style>