<template>
  <view class="page played-times-page">
    <view class="top-bg">
      <Gnavbar title="比赛次数" />
    </view>
    <scroll-view scroll-y="true" class="main-container">
      <view
        class="item-wrapper"
        v-for="(item,key) in competitionRecord"
        :key="key">
        <YearSummary :year="key" :count="item.num"></YearSummary>
        <view class="calendar">
          <view v-for="num in 12" :key="num" class="fs-16 flex mb-4">
            <view class="rubik mr-16 month">{{num + 1}}</view>
            <view class="month-wrapper flex">
              <view class="square" v-for="d in 31" :key="d" :class="[getDayClass(key, num+1, d+1)]"></view>
            </view>
          </view>
        </view>
        <view class="flex bottom-wrap">
          <ParsStatistic
            class="statis-wrap"
            :pars="item.pars"
            :eagles="item.eagles"
            :birdies="item.birdies"
            :avg="item.avg">
          </ParsStatistic>
          <view class="go-month-wrapper" @click="showMonthDetail(key)">
            <image class="arrow-img" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/play.png"></image>
            <view class="rubik">按月份展示</view>
          </view>
        </view>
      </view>
      <view class="flex flex-center col-999">
        没有更多了...
      </view>
      <view class="safe-bottom"></view>
    </scroll-view>
  </view>
</template>

<script>
  import Gnavbar from '@/components/g-navbar/index'
  import { mapActions, mapGetters } from 'vuex'
  import YearSummary from './components/YearSummary'
  import ParsStatistic from './components/ParsStatistic'
  import { parseNumber } from '@/utils/index'
  
  export default {
    components: {
      Gnavbar,
      YearSummary,
      ParsStatistic
    },
    data() {
      return {
        uid: null
      }
    },
    computed: {
      ...mapGetters({
        competitionRecord: 'user/userCompetitionRecord'
      })
    },
    onLoad(option) {
      this.uid = option.uid
    },
    onShow() {
      this.GET_USER_COMPETITION_RECORD({uid: this.uid})
    },
    methods: {
      ...mapActions({
        GET_USER_COMPETITION_RECORD: 'user/GET_USER_COMPETITION_RECORD'
      }),
      getDayClass(year, month, day) {
        let monthRecord = this.competitionRecord[year] ? this.competitionRecord[year][parseNumber(month)]?.record_list : null
        if (monthRecord && monthRecord.length) {
          let dayRecord = monthRecord.filter(item => {
            return item.start_date === `${year}-${parseNumber(month)}-${parseNumber(day)}`
          })
          if (dayRecord && dayRecord.length) {
            return dayRecord[0].num === 1 ? 'once' : 'times'
          }
          return ''
        } else {
          return ''
        }
      },
      showMonthDetail(year) {
        uni.navigateTo({
          url: `/pages/common/profile/playedTimesMonth/index?year=${year}`
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mb-4 {
    margin-bottom: 4rpx;
  }
  .fs-16 {
    font-size: 16rpx;
  }
  .played-times-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: stretch;  
    overflow: hidden;
    
    .main-container {
      padding: 16rpx;
      box-sizing: border-box;
    }
    
    .top-bg {
      width: 100%;
      z-index: 999;
      background: linear-gradient(180deg, rgba(30, 36, 31, 0.5) 0%, #003c3d 100%),
        url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/user-bg2.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    
    .safe-bottom {
      @include safearea(0rpx);
    }
    
    .item-wrapper {
      background: #FFFFFF;
      box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
      border-radius: 4rpx;
      margin-bottom: 20rpx;
      .calendar {
        color: #c7c7c7;
        padding: 20rpx 28rpx 28rpx;
        .month {
          width: 20rpx;
          text-align: center;
        }
        .month-wrapper {
          width: 100%;
          justify-content: space-around;
          align-items: center;
        }
      }
      .square {
        width: 16rpx;
        height: 16rpx;
        border-radius: 3rpx;
        background-color: #f8f8f8;
        &.once {
          background-color: #9FBE3D;
        }
        &.times {
          background-color: #3C6F30;
        }
      }
      .bottom-wrap {
        box-sizing: border-box;
        justify-content: space-between;
        padding: 0 32rpx 28rpx;
      }
      .statis-wrap {
        width: 448rpx;
      }
      .go-month-wrapper {
        font-size: 22rpx;
        color: #999;
        text-align: right;
        .arrow-img {
          width: 30rpx;
          height: 30rpx;
          margin-bottom: 6rpx;
        }
      }
    }
  }
</style>