<template>
  <view class="root">
    <view v-if="containTitle" class="title">{{data.title}}</view>
    <view :class="['number', containTitle ? 'titled' : '']" :style="{'--num-color': scoreColor}">
      <span class="integer">{{ scoreInt }}</span>
      <span class="fraction">{{ scoreFraction }}</span>
    </view>
    <view :class="['comparing', containTitle ? 'titled' : '']">
      <view class="bg"></view>
      <view class="text">{{ (data && data.comparing) || '&nbsp'}}</view>
    </view>
    <view :class="['en-title', containTitle ? 'titled' : '']">{{ (data && data.enTitle) || '--'}}</view>
    <view class="cn-title">{{ (data && data.cnTitle) || '--'}}</view>
  </view>
</template>

<script>
import { trunc } from '@utils/index'
export default {
  props: {
    /**
     * 需要属性：`title`, `score`, `comparing`, `enTitle`, `cnTitle`
     */
    data: {
      type: [Object, undefined],
      default: undefined,
    }
  },
  computed: {
    containTitle() {
      const data = this.data
      return data && data.title && data.title.length > 0
    },
    scoreColor() {
      return this.data?.score != undefined ? 'black' : 'rgba(0, 0, 0, 0.1)'
    },
    scoreInt() {
      if (this.data?.score == undefined) return 'N/A';
      return '' + trunc(this.data.score)
    },
    scoreFraction() {
      if (this.data?.score == undefined) return '';
      const fraction = this.data.score % 1;
      if (fraction == 0) return ''
      return '.' + fraction.toFixed(1).split('.')[1];
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .title {
    margin-bottom: -8rpx;
    @include rubikVar(600);
    font-style: normal;
    font-size: 40rpx;
    line-height: 47rpx;
    color: #000000;
  }

  .number {
    @include rubikVar(600);
    font-style: normal;
    font-size: 60rpx;
    line-height: 72rpx;

    color: var(--num-color);

    .fraction {
      font-size: 40rpx;
      line-height: 48rpx;
    }
  }

  .comparing {
    position: relative;
    margin-top: 15rpx;
    height: 28rpx;

    font-weight: 500;
    font-size: 20rpx;
    line-height: 28rpx;

    color: #000000;

    &.titled {
      margin-top: 4rpx;
    }
    
    .bg {
      position: absolute;
      top: 9rpx;
      right: 5rpx;
      bottom: 7rpx;
      left: 2rpx;
      background: linear-gradient(270.1deg, #7BFF90 0.12%, #B9FFB8 96.88%);
      filter: blur(6rpx);
      border-radius: 99999rpx;
    }
    .text {
      position: relative;
      transform: matrix(1, 0, -0.19, 0.98, 0, 0);
    }
  }

  .en-title {
    margin-top: 16.5rpx;
    @include rubikVar(400);
    font-style: normal;
    font-size: 20rpx;
    line-height: 24rpx;
    color: #999999;

    &.titled {
      margin-top: 8.5rpx;
    }
  }

  .cn-title {
    margin-top: 0rpx;
    font-weight: 500;
    font-size: 20rpx;
    line-height: 28rpx;
    color: #999999;
  }
}
</style>
