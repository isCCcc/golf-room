<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view>
    <view class="light-holes"
          v-if="!validHoles.every(e => !!e)">
      <template v-for="hole in 18">
        <view :key="hole"
              class="light-holes-cell flex-center fw-400"
              :class="{
                          active:
                            validHoles.length &&
                            !!validHoles[hole]
                        }">{{ pkHoles[hole] ? pkHoles[hole] : '.' }}</view>
      </template>
    </view>
    <view class="all-holes"
          v-else>
      <view class="icon-all"></view>
      <text class="fs-24 fw-400">全部洞有效</text>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    pkHoles: {
      type: Array,
      default: () => []
    },
    validHoles: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style lang="scss" scoped>
.light-holes {
  margin-top: 8rpx;
  width: 230rpx;
  height: 48rpx;

  display: grid;
  grid-column-gap: 4rpx;
  grid-row-gap: 4rpx;
  grid-template-columns: repeat(9, 1fr);
  &-cell {
    height: 22rpx;
    background-color: #f1f1f1;
    border-radius: 50%;
    font-size: 14rpx;
    color: #d0d0d0;
    &.active {
      background-color: $sub-color;
      color: $white;
    }
  }
}
.all-holes {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #c4c4c4;
}
.icon-all {
  margin-left: 4rpx;
  width: 28rpx;
  height: 28rpx;
  background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/all.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>