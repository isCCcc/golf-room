<template>
  <view class="competition_calendar h-full">
    <view class="header">
      <view class="time"> {{ nowYear }} {{ monthTitle }} </view>
      <view class="title">比赛周历</view>
    </view>
    <view class="content">
      <view :class="['item']" v-for="(item, i) in calendarInfo" :key="item.day">
        <view class="days flex-center">
          <view :class="['cri', item.day == nowDate ? 'cri-active' : '']">
            <view class="cri-day"> {{ item.day }} </view>
            <view class="cri-week">
              {{ item.week }}
            </view>
          </view>
        </view>
        <view :class="['competion-list flex-col', i !== calendarInfo.length - 1 ? 'bor-r' : '']">
          <template v-if="item.competition_list.length">
            <view
              class="box"
              v-for="(competion, i) in getCompetions(item)"
              :key="i"
              @click="handleJump(competion)"
            >
              <view class="start-time text-over">{{ competion.start_time }}</view>
              <view class="course-name text-over-2">{{ competion.course_name }}</view>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { getNowYear, getNowMonth, getNowDate } from '@/utils'
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

export default {
  props: {
    info: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      nowMonth: getNowMonth(),
      nowYear: getNowYear(),
      nowDate: getNowDate(),
      
    }
  },
  computed: {
    monthTitle() { 
      return dayjs().locale('zh-cn').format('MMMM')
    },
    calendarInfo() {
      console.log('this.info;', this.info)
      // const info = this.info.map((item) => {
      //   return {
      //     ...item,
      //     competition_list: [
      //       { course_name: "aa32121212121121212a", start_time: "09:00" },
      //       { course_name: "aaa", start_time: "09:00" },
      //     ],
      //   };
      // });
      // return info;
      return this.info
    },
    competionInfo: {
      get: (list) => {
        return list?.[0]
      },
    },
  },
  methods: {
    handleJump(competion) {
      if (competion.competition_id)
        uni.navigateTo({
          url: `/pages/chat-room/index/index?id=${competion.competition_id}`,
        })
    },
    getCompetions(competion) {
      return competion?.competition_list?.slice(0, 2)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../home-swipe.scss';

.competition_calendar {
  margin-top: $home-swipe-top;

  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0px 4px 30px rgba(57, 80, 69, 0.08);
  backdrop-filter: blur(25px);
}
.header {
  height: 38rpx;
  background: rgba(23, 31, 28, 0.7);
  backdrop-filter: blur(14.9506px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 18rpx;
  padding-right: 13rpx;
  font-size: 20rpx;
  @include rubikVar();

  .time {
    font-style: normal;
    font-weight: 500;
  }
  .title {
    font-weight: 400;
    font-size: 20rpx;
  }
}
.content {
  height: calc(100% - 38rpx);
  display: flex;
  .item {
    // width: 100rpx;
    flex: 1;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    .days {
      width: 100%;
      height: 93rpx;
      .cri {
        width: 68rpx;
        height: 68rpx;
        // padding-top: 5rpx;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        @include rubikVar();
        font-style: normal;
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &-active {
          background: rgba(23, 31, 28, 0.7);
          backdrop-filter: blur(14.9506px);
          border-radius: 100%;
        }
        &-day {
          font-weight: 700;
          font-size: 28rpx;
          line-height: 33rpx;
        }
        &-week {
          font-weight: 300;
          font-size: 18rpx;
          line-height: 21rpx;
        }
      }
    }
    .competion-list {
      height: calc(100% - 93rpx);
      border-top: 1rpx solid #6b825b;
      overflow: hidden;

      .box {
        height: 50%;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: inset 0rpx 4rpx 0rpx #9fbe3d;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-style: normal;
        .start-time {
          @include rubikVar(700);
          font-size: 24rpx;
          line-height: 28rpx;
        }
        .course-name {
          margin-top: 8rpx;
          width: 80rpx;
          max-height: 45rpx;
          font-family: 'PingFang SC';
          font-weight: 400;
          font-size: 20rpx;
          line-height: 22rpx;
          text-align: center;
          // letter-spacing: -0.3px;
        }
      }
    }
    .bor-r {
      border-right: 1rpx solid #6b825b;
    }
  }
}
</style>
