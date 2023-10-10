<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="root mb-10">
    <view class="mt-32 mb-14 flex top-banner">
      <view class="ml-18 time-node"></view>
      <text class="ml-18 ff-pingfang-hk fs-24 fw-400 competition-time">{{ competitionTimeTitle }}</text>

      <!-- 更多按钮 -->
      <view v-if="couldShowMore" class="mr-16 flex-center more" @click.stop="handleClickMore($event)">
        <view class="ml-2 mr-2 more-dot"></view>
        <view class="ml-2 mr-2 more-dot"></view>
        <view class="ml-2 mr-2 more-dot"></view>
      </view>
      <chunLei-popups
        v-if="couldShowMore"
        v-model="isShowMore"
        @tapPopup="tapPopup"
        :x="morePosX"
        :y="morePosY"
        placement="top-end"
        maskBg="rgb(0,0,0, 0.1)"
        radius="2rpx"
        padding="0rpx"
      >
        <view class="flex p-more col-red" :style="{'padding': '28rpx 32rpx'}" @click.stop="handleClickDel">
          <view class="icon-del mr-8" style="width: 36rpx; height: 36rpx"></view>
          <text class="">删除球局</text>
        </view>
      </chunLei-popups>
    </view>
    
    <view class="box">
      <view class="content-bg"></view>
      <view v-if="showMyScore" class="content-score-bg">
        <text class="bg-score"> {{ myTotalClub }} </text>
      </view>
      <view class="content-main">
        <!--  -->
        <view class="mt-20 mr-26 ml-26 flex">
          <view class="coordinate icon-coordinate"></view>

          <!-- 球局地址 -->
          <view class="ml-8 fs-28 fw-400 ff-pingfang-sc text-over">
            <text>{{ roomInfo.course_name || "" }}</text>
            <text v-if="courseHalfCourtList.length"> · </text>
            <text v-for="(item, i) in courseHalfCourtList" :key="i">
              {{ item }}
              <template v-if="i !== courseHalfCourtList.length - 1">&</template>
            </text>
          </view>
        </view>

        <!-- 球局名称 -->
        <view class="mt-6 ml-26 fs-24 fw-400 ff-pingfang-sc col-c4">{{ roomInfo.competition_name || "" }}</view>

        <!-- 球局选手列表 -->
        <view class="mt-16 ml-26 flex flex-1 avatar-list">
          <view v-for="(avatar, index) in displayAvatarList" :class="[
            ' flex-shrink-0 flex-center',
            index === 0 ? '' : '-ml-12',
            index === maxAvatar ? 'items-end' : '',
          ]" :key="index">
            <view v-if="avatar.length > 0" class="g-avatar" :style="{ backgroundImage: 'url(' + avatar + ')' }" />
            <view v-else class="g-avatar flex-center rubik fs-20 col-white">
              {{avatar}}
            </view>
          </view>
        </view>

        <!-- 我的得分 -->
        <view v-if="showMyScore" class="score-bar mt-30 mb-6 ml-6">
          <!-- 得分类型汇总列表 -->
          <view class="ml-26 flex">
            <view class="">
              <span class="score-unit">Eagle:</span>
              <span class="score-value">{{ myEagleCount }}</span>
              <span class="score-unit">Birdie:</span>
              <span class="score-value">{{ myBirdieCount }}</span>
              <span class="score-unit">&nbsp;&nbsp;&nbsp;Par:&nbsp;</span>
              <span class="score-value">{{ myParCount }}</span>
              <span class="score-unit">&nbsp;&nbsp;&nbsp;Bogey+:&nbsp;</span>
              <span class="score-value">{{ myBogeyPlusCount }}</span>
            </view>

            <!-- HIO -->
            <view v-if="myHioCount > 0" class="score-hio-mark icon-hio-mark" />
          </view>

          <!-- 总杆 -->
          <view class="score-club icon-score-banner flex">
            <view v-if="roomInfo.is_caddie" class="score-club-caddie-mark">我是球童</view>
            <template v-else>
              <text class="fs-20 fw-500 ff-pingfang-hk score-club-title">我的杆数</text>
              <text class="fs-40 fw-500 rubik score-club-value">{{ myTotalClub }}</text>
            </template>
            
          </view>
        </view>
        <view v-else class="mb-6" :style="{ height: '32rpx' }" />

        <text v-if="!isValidCompetition" class="col-b0 bg-col-f9 fs-20 fw-400 ff-pingfang-sc invalid-hint">
          无效比赛
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import { isDay } from "@/utils";
import { isNumber } from "util";
import "./static/icon-score-banner.css";
import "./static/icon-hio-mark.css";
import "./static/icon-coordinate.css";
import "./static/icon-del.css";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

import chunLeiPopups from "@/components/chunLei-popups/chunLei-popups.vue";
import { genderedAvatar } from '@/utils/image';

export default {
  components: {
    chunLeiPopups,
  },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo, //用户信息
    }),

    /**
     * 是否可以显示更多，目前仅用在删除
     */
    couldShowMore() {
      // 没有数据
      if (this.roomInfo === undefined) return false;
      // 不是创建者
      if (this.roomInfo.uid != this.userInfo?.uid) return false;

      const status = this.roomInfo.status;
      const endTime = this.roomInfo.end_time;
      // 没开始，或者正在进行中
      if (status == 0 || status === 1) return true;
      // 无效球局随时删除
      if (status == 2 && this.roomInfo.is_valid === 0) return true; 
      // 结束 7 天内
      if (status == 2 && endTime && dayjs().subtract(7, 'day').isBefore(endTime)) return true

      return false;
    },
    roomInfo() {
      return this.info;
    },
    // 半场列表
    courseHalfCourtList() {
      return this.roomInfo?.course_half_court_list || [];
    },
    competitorAvatarList() {
      return [...this.roomInfo?.competitor_avatar_url_list] || [];
    },
    displayAvatarList() {
      const list = (this.roomInfo?.competitor_avatar_url_list || []).map((avatar) => {
        return genderedAvatar({avatar_url: avatar})
      });
      return list.length > this.maxAvatar
        ? [...list.slice(0, this.maxAvatar), list.length]
        : list;
    },
    weatherInfo() {
      const info = this.roomInfo?.weather;
      return {
        weather_pic: isDay ? info?.day_weather_pic : info?.night_weather_pic,
        weather: isDay ? info?.day_weather : info?.night_weather ?? "",
        air_temperature: isDay
          ? info?.day_air_temperature
          : info?.night_air_temperature ?? 0,
      };
    },
    isValidCompetition() {
      return this.roomInfo?.status != 2 || this.roomInfo?.is_valid != undefined && this.roomInfo?.is_valid == 1;
    },
    showMyScore() {
      return this.isValidCompetition;
    },
    competitionTimeTitle() {
      return dayjs(this.roomInfo?.start_time).locale('zh-cn').format("MMMDD日 ddd HH:MM");
    },
    myHioCount() {
      return 0;
    },
    myEagleCount() {
      return this.roomInfo?.eagle_num || 0;
    },
    myBirdieCount() {
      return this.roomInfo?.birdie_num || 0;
    },
    myParCount() {
      return this.roomInfo?.par_num || 0;
    },
    myBogeyPlusCount() {
      return this.roomInfo?.bogey_num || 0;
    },
    myTotalClub() {
      return this.roomInfo?.my_total_score || 0;
    },
  },
  data() {
    return {
      statusText: ["未开始", "进行中", "已结束"], // 0-未开始，1-进行中，2-已结束
      maxAvatar: 4,
      isShowMore: false,
      morePosX: 0,
      morePosY: 0,
    };
  },
  methods: {
    handleClickMore(event) {
      let dom = uni.createSelectorQuery().in(this);
      dom.select(".more").boundingClientRect();
      dom.exec((data) => {
        let width = uni.getSystemInfoSync().windowWidth
        let height = uni.getSystemInfoSync().windowHeight
        
        this.morePosX = (data[0].left + data[0].right) / 2 * (375 / width);
        this.morePosY = data[0].bottom * (375 / width);
        this.isShowMore = !this.isShowMore;
      });
    },

    handleClickDel() {
      console.log("deleting...");
      this.isShowMore = !this.isShowMore;
      this.$emit("del", this.info);
    },
  },
};
</script>

<style lang="scss" scoped>
.top-banner {
  width: 100%;
  height: 34rpx;
}

.time-node {
  // box-sizing: border-box;
  box-sizing: content-box;
  width: 6rpx;
  height: 6rpx;
  border-radius: 100%;
  background: #ffffff;
  border: 2px solid #999999;
  transform: translateX(-50%);
}

.competition-time {
  color: #535353;
}

.more {
  // width: 34rpx;
  height: 34rpx;
  margin-left: auto; // 右对齐

  // 放到点击范围
  border: 10rpx solid transparent;
}
.more-dot {
  width: 3px;
  height: 3px;
  border-radius: 100%;
  background-color: $col-c4;
}

.box {
  position: relative;
  display: flex;
  flex-direction: column;
}

@mixin contentFill {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.content-bg {
  background: linear-gradient(
      247.55deg,
      rgba(30, 62, 66, 0.06) 14.25%,
      rgba(149, 209, 113, 0) 64.62%
    ),
    #ffffff;
  border: 4rpx solid #ffffff;
  box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.1);
  border-radius: 4rpx;
  @include contentFill;
}

.content-score-bg {
  overflow: hidden;
  @include contentFill;
}

.content-main {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

.coordinate {
  width: 36rpx;
  height: 36rpx;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.score-bar {
  height: 40rpx;
  // margin-left: 6rpx;
  background: linear-gradient(
    90deg,
    #f0f2f4 0%,
    #f2f3f4 46.88%,
    rgba(242, 243, 244, 0) 100%
  );
  border-bottom-left-radius: 4rpx;

  white-space: pre;
}

.bg-score {
  position: absolute;
  top: -36rpx;
  right: 12rpx;

  color: transparent;
  font-family: "DINCond-Black";
  font-style: normal;
  font-weight: 500;
  font-size: 220rpx;
  line-height: 262rpx;
  text-align: right;
  letter-spacing: -10rpx;

  opacity: 0.2;
  -webkit-text-stroke: 1.5rpx $col-999;
}
@mixin score-text {
  font-size: 22rpx;
  font-style: normal;
  font-weight: 400;
  line-height: 26rpx;
  /* identical to box height */
  letter-spacing: -0.3px;
}
.score-unit {
  color: $col-999;
  font-weight: 100;
  @include score-text;
}
.score-value {
  margin-left: 0.25em;
  margin-right: 0.75em;
  color: #535353;
  @include rubikVar();
  @include score-text;
}
.score-hio-mark {
  width: 67rpx;
  height: 31rpx;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.score-club {
  position: absolute;
  width: 200rpx;
  height: 54rpx;
  right: -4rpx;
  bottom: 4rpx;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  // background-color: red;
}
.score-club-caddie-mark {
  position: absolute;
  bottom: 6rpx;
  left: 56rpx;

  font-style: normal;
  font-weight: 500;
  font-size: 28rpx;
  line-height: 39rpx;
  letter-spacing: -0.3rpx;
  color: #FFFFFF;
}
.score-club-title {
  position: absolute;
  color: $sub-color;
  bottom: 8rpx;
  left: 32rpx;
}
.score-club-value {
  position: absolute;
  color: white;
  top: 4rpx;
  right: 12rpx;
}
.invalid-hint {
  position: absolute;
  right: 26rpx;
  bottom: 32rpx;
  padding: 4rpx 18rpx;

  border: 1px solid #ededed;
  border-radius: 4px;
}

.avatar-list {
  overflow: hidden;
}

.-ml-12 {
  margin-left: -12rpx;
}
.p-more {
  padding: 28rpx, 32rpx;
}
.g-avatar {
  width: 50rpx;
  height: 50rpx;
  border-radius: 100%;
  border: 3rpx solid #fff;
  background-color: #ededed;
  box-sizing: border-box;
  // filter: drop-shadow(0rpx 4rpx 8rpx rgba(0, 0, 0, 0.08));
}
</style>
