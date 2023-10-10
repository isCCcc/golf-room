<!--
 * @Author: simon
 * @Description: 球洞
 * @LastEditors: simon
-->
<template>
  <view class="tc" :class="{landscape: landscape}">
    <view class="sub-color mb-5 hole-no">
      <text class="fs-28">{{ hole.hole_no2}}</text>
    </view>
    <view class="op-5 fs-28 lh-1" :style="[parStyle]">{{hole.par}}</view>
  </view>
</template>

<script>
export default {
  props: {
    // 球洞信息
    hole: {
      type: Object
    },
    // 标准杆样式
    parStyle: {
      type: Object,
      default: {}
    },
    // 横屏模式
    landscape: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.mb-5 {
  margin-bottom: 5rpx;
}
.hole-no {
  display: flex;
  align-items: flex-start;
}
.landscape {
  .fs-28 {
    font-size: 14px;
  }
  .mb-5 {
    margin-bottom: 0;
  }
}
</style>

