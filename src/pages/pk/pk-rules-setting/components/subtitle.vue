<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view
    class="subtitle-wrapper"
    :style="{ backgroundImage: bgImg ? `url(${bgImg})` : '' }"
  >
    <view class="title col-1e3 fs-48 fw-600"
      ><view>{{ title }}</view><view class="text fs-20 fw-600 theme-color" v-if="!!batchType">批量</view></view
    >
  </view>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    bgImg: {
      type: String,
      default: "",
    },
    batchType: {
      type: Number,
      default: null
    }
  },
}
</script>
<style scoped lang="scss">
.subtitle-wrapper {
  height: 284rpx;
  background-color: aliceblue;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .title {
    margin-top: 59rpx;
    margin-left: 64rpx;
    display: flex;
    align-items: center;
  }
  .text {
    margin-left: 10rpx;
    display: flex;
    width: 72rpx;
    height: 36rpx;
    align-items: center;
    justify-content: center;
    background-color: $sub-color;
  }
}
</style>
