<template>
  <view class="flex-col">
    <GAvatar class="avatar"
              :avatar-data="avatarData"
              :size-in-rpx='68'
              :radius="'100%'"
              :handle-click="false" />
    <view class="flex-center mt-4">
      <view class="line" :class="{ 'bordered' : avatarData.tee === 2 }" :style="{ background: teeColor }" />
      <text :class="['score', isScoreValid ? '' : 'score-invalid']">{{ isScoreValid ? avatarData.total_score : 'N/A'}}</text>
      </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import GAvatar from '@/components/g-avatar/g-avatar.vue'
export default {
  components: {
    GAvatar,
  },
  props: {
    status: {
      type: Number,
      default: 0,
    },
    avatarData: {
      type: Object,
      default: {},
    },
  },
  computed: {
    ...mapGetters(['getTeeColorList']),
    isScoreValid() { 
      return this.avatarData.total_score != undefined && this.status !== 0;
    },
    teeColor() {
      const teeBgList = this.getTeeColorList //uni.getStorageSync('golf-tee-color')
      return (teeBgList.length ? teeBgList.find((item) => item.value === this.avatarData.tee)?.color : undefined) || '#41A2FF'
    },
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>
.avatar {
  filter: drop-shadow(0rpx 4rpx 8rpx rgba(0, 0, 0, 0.08));
}
.line {
  margin-top: -1rpx; // 稍微偏移一下，达到视觉上对齐
  width: 4rpx;
  height: 18rpx;
}
// .line.bordered {
//   width: 2rpx;
//   border: 1rpx solid #747474;
// }
.score {
  margin-left: 4rpx;
  @include rubikVar(500);
  font-style: normal;
  font-size: 24rpx;
  line-height: 28rpx;
  text-align: center;
  letter-spacing: -0.3rpx;

  color: #FFFFFF;
}
.score-invalid {
  color: #C7C7C7;
}
</style>
