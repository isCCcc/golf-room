<template>
  <view class="root">
    <GAvatar class="avatar"
              :avatar-data="avatarData"
              :size-in-rpx='68'
              :radius="'100%'"
              :handle-click="false" />
    <view class="content" :style="contentStyle">
      <text class="name">{{ avatarData.username }}</text>
      <view class="flex" v-if="showScore">
        <view class="line" :class="{ 'bordered' : avatarData.tee === 2 }" :style="{ background: teeColor }" />
        <text :class="['score', isScoreValid ? '' : 'score-invalid']">{{ isScoreValid ? avatarData.total_score : 'N/A'}}</text>
      </view>
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
    showScore: {
      type: Boolean,
      default: true,
    },
    contentStyle: {
      type: String,
      default: ''
    }
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
.root {
  position: relative;
  display: flex;
  align-items: stretch;
}
.content {
  
  margin-left: -34rpx;
  padding-left: calc(34rpx + 10rpx);
  // height: 100%;
  width: 60rpx; // 80 - 10

  display: flex;
  flex-direction: column;
  justify-content: center;

  
  background: linear-gradient(90deg, #EAEAEA 0%, rgba(238, 238, 238, 0) 103.85%);
}
.avatar {
  // position: relative;
  filter: drop-shadow(0rpx 4rpx 8rpx rgba(0, 0, 0, 0.08));
}
.name {
  max-width: 70rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  /*禁止换行显示*/
  white-space: nowrap;
  word-break: break-all;

  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx;
  line-height: 28rpx;
  letter-spacing: -0.3rpx;
  color: #999999;
}
.line {
  margin-top: -1rpx; // 稍微偏移一下，达到视觉上对齐
  width: 4rpx;
  height: 16rpx;
}
.line.bordered {
  width: 2rpx;
  height: 14rpx;
  border: 2rpx solid #747474;
}
.score {
  margin-left: 4rpx;
  @include rubikVar(500);
  font-style: normal;
  font-size: 24rpx;
  line-height: 28rpx;
  text-align: center;
  letter-spacing: -0.3rpx;

  color: #000000;
}
.score-invalid {
  color: #C7C7C7;
}
</style>
