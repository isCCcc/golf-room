<!--
 * @Author: wsw 944627549@qq.com
 * @Date: 2022-11-27 22:55:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-04 11:45:17
 * @FilePath: /wx-GolfRoom/src/components/g-avatar/index.vue
-->
<template>
  <view class="avatar" :style="{ backgroundImage: avatarUrl ? 'url(' + avatarUrl + ')' : null }">
    <view class="bg flex-col" v-if="avatarData.total_score">
      <text class="scope">{{ avatarData.total_score }}</text>
      <view class="line" :style="{ background: getLineBg(avatarData.tee) || '#41A2FF' }" />
    </view>
  </view>
</template>
<script>
import { genderedAvatar } from '@/utils/image'

export default {
  props: {
    avatarData: {
      type: Object,
      default: {},
    },
  },
  computed: {
    avatarUrl() {
      return genderedAvatar(this.avatarData)
    },
  },
  methods: {
    getLineBg(val) {
      const treeBgList = uni.getStorageSync('golf-tee-color')
      return treeBgList.length ? treeBgList.find((item) => item.value === val)?.color : '#41A2FF'
    },
  },
}
</script>
<style lang="scss" scoped>
.avatar {
  width: 68rpx;
  height: 68rpx;
  filter: drop-shadow(0rpx 4rpx 8rpx rgba(0, 0, 0, 0.08));
  position: relative;
  border-radius: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .bg {
    position: absolute;
    width: 45rpx;
    height: 45rpx;
    left: 44rpx;
    top: -2rpx;
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/scopeBg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // justify-content: center;
    align-items: center;
    padding-top: 10rpx;
    .scope {
      @include rubikVar(500);
      font-style: normal;
      font-size: 20rpx;
      line-height: 21rpx;
      /* identical to box height */
      text-align: center;
      letter-spacing: -0.3rpx;
      color: #000000;
    }
    .line {
      width: 18rpx;
      height: 3rpx;
      padding-left: 2rpx;
      margin-top: 5rpx;
    }
  }
}
</style>
