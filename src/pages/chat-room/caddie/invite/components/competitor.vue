<template>
  <view class="flex-center flex-column">
    <!-- 头像 -->
    <GAvatar class="avatar" :avatar-data="competitor" :size-in-rpx='80' :radius="'100%'" />
    <!--  -->
    <view class="mt-8 flex-center">
      <!-- Tee -->
      <view class="tee-bar" :class="{ 'bordered': competitor.tee === 2 }" :style="{ background: teeColor }" />
      <!-- 用户名称 -->
      <text class="ml-4 name">{{ competitor.username }}</text>
    </view>
  </view>
</template>

<script>
import GAvatar from '@/components/g-avatar/g-avatar.vue';
import { mapGetters } from 'vuex';

export default {
  components: { GAvatar },
  props: {
    /** Competitor */
    competitor: {
      type: [Object, undefined],
      default: undefined,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getTeeColorList"]),
    teeColor() {
      const teeBgList = this.getTeeColorList;
      return (teeBgList.length ? teeBgList.find((item) => item.value === this.competitor.tee)?.color : undefined) || "#41A2FF";
    },
  },
}
</script>

<style lang="scss" scoped>
.tee-bar {
  min-width: 4rpx; // 避免名字太长，压缩到了 tee bar，变成 1.875 等
  width: 4rpx;
  height: 22rpx;
}
.tee-bar.bordered {
  min-width: 2rpx;
  width: 2rpx;
  height: 22rpx;
  border: 1rpx solid #747474;
}

.name {
  @include ell(1);

  min-height: 34rpx;
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 34rpx;
  /* identical to box height */
  letter-spacing: -0.3rpx;

  color: #333333;
  padding: 0 14rpx;
  margin-top: 6rpx;
}
</style>
