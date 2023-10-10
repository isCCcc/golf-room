<template>
  <view class="root" @click="viewHistoryList">
    <view class="left">
      <text class="en-title">{{ data.enTitle || '--'}}</text>
      <text class="cn-title">{{ data.cnTitle || '--'}}</text>
    </view>
    <view class="right">
      <view class="number" :style="{ '--num-col' : numberColor }">{{ data.score || '--'}}</view>
      <image class="detail-image" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/play.png"></image>
    </view>
    
  </view>
</template>

<script>
export default {
  props: {
    /**
     * 需要属性： `enTitle`, `cnTitle`, `score`
     */
    data: {
      type: [Object, undefined],
      default: undefined,
    },
    type: {
      type: String,
      default: 'time'
    },
    userInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    numberColor() {
      return this.data?.score != undefined ? '#000000' : '#999999'
    },
  },
  data() {
    return {};
  },
  methods: {
    viewHistoryList() {
      uni.navigateTo({
        url: (this.type === 'time' ? '/pages/common/profile/playedTimesYear/index' : '/pages/common/profile/playedCourseList/index') + '?uid=' + this.userInfo.uid
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  padding: 26rpx 32rpx 20rpx 32rpx;
  display: flex;
  align-items: center;

  .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    color: #999999;

    .en-title {
      @include rubikVar(400);
      font-style: normal;
      font-size: 20rpx;
      line-height: 24rpx;
      letter-spacing: -0.3rpx;
    }

    .cn-title {
      font-weight: 500;
      font-size: 20rpx;
      line-height: 28rpx;
      letter-spacing: -0.3rpx;
    }
  }
  

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;

    .number {
      @include rubikVar(600);
      font-style: normal;
      font-size: 40rpx;
      line-height: 47rpx;
      text-align: center;
      letter-spacing: -0.3rpx;
      color: var(--num-col);
    }
    
    .detail-image {
      width: 24rpx;
      height: 24rpx;
    }
  }
  
}
</style>
