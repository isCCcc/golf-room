<!--
 * @Author: simon
 * @Description: 批量操作
 * @LastEditors: simon
-->
<template>
  <view class="batch-box flex">
    <GCell isLink class="flex-1">
      <view slot="left"
            class="flex">
        <image src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/icon-batch.png"
               class="icon-batch"
               mode="widthFix"></image>
        <view>
          <view class="fs-24">批量挂单工具</view>
          <view class="fs-20 col-999 mt-5">批量“比杠”、批量“比洞”、批量“8421”</view>
        </view>
      </view>
    </GCell>
  </view>
</template>

<script>
import GCell from '@components/g-cell/index.vue';

export default {
  components: {
    GCell
  }
};
</script>

<style lang="scss" scoped>
// 批量
.batch-box {
  padding: 0 34rpx;
  height: 140rpx;
  background: $white;
  border: 1px solid $col-e9;
  border-radius: 1px;
  .icon-batch {
    margin-right: 28rpx;
    width: 45rpx;
  }
}
</style>
