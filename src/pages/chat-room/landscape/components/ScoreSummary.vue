<template>
  <view class="score-summary-wrap">
    <view v-for="item in competitorList"
          :key="item.competitor_id"
          class="score-summary-item">
      <view class="score-header">
        <!-- 头像 -->
        <view
          class="g-avatar compt-avatar"
          :style="{ backgroundImage: item.avatar_url ? `url(${item.avatar_url })` : ''}">
        </view>
        <!-- 得分 -->
        <view class="score-wrapper fw-500 tc">
          <view class="rubik">{{ item.total_score }}</view>
          <view class="rubik hcp">{{ item.hcp }}</view>
        </view>
      </view>
      <!-- 名称 -->
      <view class="score-bottom text-over tc">{{ item.username }}</view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      competitionData: (state) => state.chatRoom.competitionData,
      isNowGroup: (state) => state.chatRoom.isNowGroup || 'A'
    }),
    // 当前分组球员信息
    competitorList() {
      return this.competitionData?.competitor_list?.filter(
          (item) => item.group === this.isNowGroup
        ) || []
    }
  }
}
</script>

<style lang="scss" scoped>
  .score-summary-wrap {
    //display: inline-block;
    display: flex;
    height: 41px;
    .score-summary-item {
      position: relative;
      margin-right: 26px;
      width: 66px;
      display: inline-block;
      .score-header {
        height: 25px;
        .compt-avatar {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          width: 25px;
          height: 25px;
        }
        .score-wrapper {
          box-sizing: border-box;
          position: absolute;
          left: 15px;
          top: 0;
          width: 51px;
          height: 25px;
          color: #fff;
          font-size: 12px;
          padding-top: 1px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 103.85%);
          .hcp {
            font-size: 8px;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
      .score-bottom {
        font-size: 10px;
        margin-top: 2px;
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
</style>
