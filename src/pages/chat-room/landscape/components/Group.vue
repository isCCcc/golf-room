<template>
  <!-- 分组 -->
  <view class="summary-group">
    <view class="group-list">
      <!-- 滑动指示器 -->
      <view v-if="isNowGroup" class="slider-line"
        :style="{ transform: `translate(${translate}px)` }">
      </view>
      <!-- 分组列表 -->
      <view
        v-for="(item, index) in groupList"
        :key="index" class="group-cell"
        :id="'group-cell-' + index"
        :class="{ 'active': isNowGroup === item }"
        @click="handleClickGroup(item)">{{ item }}
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  emits: ['changeGroup'],
  data() {
    return {}
  },
  computed: {
    ...mapState({
      competitionData: (state) => state.chatRoom.competitionData,
      isNowGroup: (state) => state.chatRoom.isNowGroup || 'A'
    }),
    groupList() {
      return this.competitionData.group_list
    },
    translate() {
      return this.competitionData?.group_list?.indexOf(this.isNowGroup) * 25 + 15
    }
  },
  methods: {
    handleClickGroup(group) {
      this.$emit('changeGroup', group)
      return
    }
  }
}
</script>

<style lang="scss" scoped>
  // 分组
  .group-list {
    position: relative;
    box-sizing: border-box;
    height: 25px;
    line-height: 25px;
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    padding: 0 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(15px);
    border-radius: 1px;
    display: inline-block;
    vertical-align: top;

    .group-cell {
      display: inline-block;
      width: 25px;
      height: 25px;
      text-align: center;
      @include rubikVar();
      vertical-align: top;
      opacity: 0.2;
      &.active {
        opacity: 1;
      }
    }
  
    // 滑动指示器
    .slider-line {
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 15px;
      height: 2px;
      background: $sub-color;
      transition: all 0.2s ease;
  
      &::after {
        display: block;
        content: "";
        position: absolute;
        top: 6px;
        left: 4px;
        width: 8px;
        height: 6px;
        background: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/icon-%20slider-arrow.png") no-repeat;
        background-size: cover;
      }
    }
  }
</style>
