<!--
 * @Author: simon
 * @Description: 收起计分板
 * @LastEditors: simon
-->
<template>
  <view class="mini-scoreboard col-white" @click="()=> $emit('onClick','toggle')">
    <!-- S 球员列表 -->
    <view class="flex user-list">
      <view v-for="(item, index) in competitorList"
            class="user-cell pr"
            :class="{ 'final':  index == (competitorList.length - 1) }"
            :key="item.competitor_id">
        <view class="top">
          <view class="g-avatar"
                :style="{backgroundImage: `url(${item.avatar_url})`}"></view>
          <view class="score-wrapper fs-32 fw-500 rubik flex-center">
            <view class="">{{item.total_score}}</view>
          </view>
        </view>
        <view class="mt-4 fs-20 lh-28 tc text-over" :style="{ color: 'rgba(255, 255, 255, 0.7)'}">{{item.username}}</view>
      </view>
    </view>
  </view>
</template>

<script>
import WeatherNotice from '@/pages/chat-room/index/components/weather-notice';
export default {
  components: {
    WeatherNotice
  },
  props: {
    // 组员列表
    competitorList: {
      type: Array,
      default: () => []
    },
  }
};
</script>

<style lang="scss" scoped>
.mini-scoreboard {
  // background: linear-gradient(180deg, #415546 100%, #44544b 100%, #3a5144 100%);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0px 4px 30px rgba(57, 80, 69, 0.08);
  backdrop-filter: blur(4px);
  /* Note: backdrop-filter has minimal browser support */
  border-radius: 4px;
}
// 球员列表
.user-list {
  padding: 18rpx 0;
  border-left: 4rpx solid $sub-color;
  .user-cell {
    width: calc(100vw / 4);
    border-right: 1px solid rgba(255, 255, 255, 0.1);

    display: flex;
    flex-direction: column;
    align-items: center;

    .top {
      display: flex;
      // background-color: red;

      // 头像
      .g-avatar {
        position: absolute;
        width: 54rpx;
        height: 54rpx;
      }
      // 总分
      .score-wrapper {
        // padding: 0 10rpx;
        margin-left: 27rpx;
        padding-left: 20rpx;
        width: 102rpx;
        height: 54rpx;

        background: linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 103.85%);
      }
    }
  }
  .user-cell.final {
    border-right: unset;
  }
}
</style>
