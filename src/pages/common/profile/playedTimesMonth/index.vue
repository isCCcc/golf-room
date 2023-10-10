<template>
  <view class="page played-times-month-page">
    <view class="top-bg">
      <Gnavbar title="比赛次数" />
    </view>
    <scroll-view scroll-y="true" class="main-container">
      <YearSummary :year="year" :count="yearData.num"></YearSummary>
      <view class="card">
        <view
          class="item-wrapper flex"
          v-for="item in monthlyData"
          :key="key">
          <!-- 左侧统计数据 -->
          <view class="left-wrapper w-auto">
            <view class="top-wrapper flex mb-20">
              <view class="num-wrap flex">
                <text class="count rubik">{{ item.num }}</text>
                <text>次</text>
              </view>
              <view class="month-wrap w-auto tr">
                <text class="rubik lh-1">{{ item.month }}月</text>
                <view class="month-en lh-1">{{ monthEn[item.month-1] }}</view>
              </view>
            </view>
            <ParsStatistic
              class="statis-wrap"
              :pars="item.pars"
              :eagles="item.eagles"
              :birdies="item.birdies"
              :avg="item.avg">
            </ParsStatistic>
          </view>
          <!-- 右侧日历 -->
          <view class="right-wrapper">
            <view class="week-day-wrapper flex">
              <text
                class="day rubik"
                v-for="day in weekDay"
                :key="day"
                :class="{weekend: ~['六', '日'].indexOf(day)}">{{day}}</text>
            </view>
            <view class="calendar-wrapper flex">
              <!-- 上一月跨入本月第一周天数 -->
              <view class="square transparent" v-for="num in dayjs(`${year}-${item.month}-1`).get('day')" :key="num"></view>
              <view class="square" v-for="num in 31" :key="num" :class="[getDayClass(item, num+1)]"></view>
            </view>
          </view>
        </view>
      </view>
      <!-- <view class="flex flex-center col-999">
        没有更多了...
      </view> -->
      <view class="safe-bottom"></view>
    </scroll-view>
  </view>
</template>

<script>
  import Gnavbar from '@/components/g-navbar/index'
  import { mapGetters } from 'vuex'
  import YearSummary from '../playedTimesYear/components/YearSummary'
  import ParsStatistic from '../playedTimesYear/components/ParsStatistic'
  import { parseNumber } from '@/utils/index'
  import dayjs from 'dayjs'
  
  export default {
    components: {
      Gnavbar,
      YearSummary,
      ParsStatistic
    },
    data() {
      return {
        uid: null,
        year: null,
        weekDay: ['日', '一', '二', '三', '四', '五', '六'],
        monthEn: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      }
    },
    onLoad(option) {
      this.year = option.year
      this.uid = option.uid
    },
    computed: {
      ...mapGetters({
        competitionRecord: 'user/userCompetitionRecord'
      }),
      yearData() {
        return this.competitionRecord[this.year]
      },
      monthlyData() {
        let monthlyData = []
        for (let i = 1; i < 13; i++) {
          let d = this.yearData ? this.yearData[parseNumber(i)] : null
          d && (d.month = i) && monthlyData.push(d)
        }
        console.log('monthly data +++', monthlyData)
        return monthlyData
      }
    },
    methods: {
      dayjs,
      getDayClass(monthRecord, day) {
        let dayRecord = monthRecord.record_list.filter(item => {
          return item.start_date === `${this.year}-${parseNumber(monthRecord.month)}-${parseNumber(day)}`
        })
        if (dayRecord && dayRecord.length) {
          return dayRecord[0].num === 1 ? 'once' : 'times'
        }
        return ''
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
  .played-times-month-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: stretch;  
    overflow: hidden;
    
    .main-container {
      height: 90vh;
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
    
    .card {
      box-sizing: border-box;
      background: #FFFFFF;
      box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
      border-radius: 4rpx;
      margin-bottom: 48rpx;
    }
    
    .item-wrapper {
      border-bottom: 1px solid #f9f9f9;
      padding: 32rpx;
      &:last-child {
        border-bottom: none;
      }
      .left-wrapper {
        .top-wrapper {
          .num-wrap {
            font-size: 28rpx;
            color: #666;
            align-items: baseline;
            .count {
              font-size: 68rpx;
              color: #000;
              margin-right: 8rpx;
            }
            text {
              vertical-align: bottom;
            }
          }
          .month-wrap {
            font-size: 28rpx;
            color: #666;
            .month-en {
              font-size: 18rpx;
              color: #bfbfbf;
            }
          }
        }
        .statis-wrap {
          width: 100%;
        }
      }
      .right-wrapper {
        flex: 0 0 176rpx;
        margin-left: 34rpx;
        .week-day-wrapper {
          justify-content: space-around;
          margin-bottom: 12rpx;
          .day {
            font-size: 16rpx;
            &.weekend {
              color: #a8a8a8;
            }
          }
        }
        .calendar-wrapper {
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          &:after {
            content: '';
            width: 20rpx;
          }
          .square {
            width: 20rpx;
            height: 20rpx;
            margin: 0 0 6rpx 6rpx;
            border-radius: 3rpx;
            background-color: #f8f8f8;
            &.once {
              background-color: #9FBE3D;
            }
            &.times {
              background-color: #3C6F30;
            }
            &.transparent {
              background-color: transparent;
            }
          }
        }
      }
    }
  }
</style>