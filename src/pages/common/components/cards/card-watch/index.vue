<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <!-- S 房间信息 -->
  <view class="box p-32">
    <view class="flex-between">
      <view class="flex-1">
        <view class="fs-32 fw-600 text-over">{{
          roomInfo.competition_name || ""
        }}</view>
        <view class="fw-400 fs-24 col-999">
          <text>{{ roomInfo.course_name || "" }}</text>
          <text v-if="courseHalfCourtList.length"> · </text>
          <text v-for="(item, i) in courseHalfCourtList" :key="i">
            {{ item }}
            <template v-if="i !== courseHalfCourtList.length - 1">&</template>
          </text>
        </view>
        <view class="flex fw-400 fs-22 col-999 lh-36">
          <view class="icon-date"></view>
          <text>{{ roomInfo.start_time }}</text>
          <view class="icon-user"></view>
          <text>{{ roomInfo.watching || 0 }}人围观</text>
        </view>
      </view>
      <!-- /房间信息 -->
      <view class="flex-130 flex-col flex-dir flex-item-end">
        <view
          class="icon-weather"
          v-if="weatherInfo.weather_pic"
          :style="{ backgroundImage: 'url(' + weatherInfo.weather_pic + ')' }"
        />
        <view class="flex-center fw-400 fs-20 col-bd lh-36"
          >{{ weatherInfo.weather }} {{ weatherInfo.air_temperature }}°C</view
        >
      </view>
      <!-- /天气信息 -->
    </view>
    <!-- /房间信息&天气 -->

    <view class="flex-between mt-22">
      <view class="flex avatar-list">
        <view
          v-for="(avatar, index) in competitorAvatarList"
          :class="[
            ' flex-shrink-0 flex-center',
            index === 0 ? '' : '-ml-12',
            index === competitorAvatarList.length - 1 ? 'items-end' : '',
          ]"
          :key="index"
          :style="{ zIndex: index }"
        >
          <view
            class="g-avatar"
            :style="{ backgroundImage: 'url(' + avatar + ')' }"
          />
          <view
            :style="{ zIndex: competitorAvatarList.length + 1 }"
            v-if="index === competitorAvatarList.length - 1"
            class="player -ml-12 flex-center"
          >
            选手
          </view>
        </view>
      </view>
      <text
        class="status-tag flex-shrink-0 pr fs-20 fw-400 col-b0"
        :class="{ active: roomInfo.status === 1 }"
        >{{ statusText[roomInfo.status] }}</text
      >
    </view>
    <!-- / 用户&状态 -->
  </view>
  <!-- E 房间信息 -->
</template>
<script>
import { isDay } from "@/utils";
export default {
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
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
  },
  data() {
    return {
      statusText: ["未开始", "进行中", "已结束"], // 0-未开始，1-进行中，2-已结束
    };
  },
};
</script>
<style lang="scss" scoped>
.box {
  padding-left: 40rpx;
  background: $white;
  box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
  border-radius: 4rpx;
}

.flex-item-end {
  align-items: flex-end;
}
.flex-justify-start {
  justify-content: flex-start;
}

.flex-130 {
  flex: 0 0 130rpx;
  width: 130rpx;
}
.lh-36 {
  height: 36rpx;
  line-height: 36rpx;
}
/* 图标样式 */
.icon-date {
  width: 22rpx;
  height: 22rpx;
  margin-right: 8rpx;
  background-image: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_calendar.png");
  background-size: cover;
  background-repeat: no-repeat;
}
.icon-user {
  width: 29rpx;
  height: 23rpx;
  margin-right: 8rpx;
  margin-left: 22rpx;
  background-image: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_users.png");
  background-size: cover;
  background-repeat: no-repeat;
}
.icon-weather {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 17rpx;
  background-image: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/icon8.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top center;
}

.avatar-list {
  overflow: hidden;
}
/* 标签状态 */
.status-tag {
  margin-left: 10rpx;
  display: inline-block;
  padding: 0 20rpx 0 38rpx;
  height: 44rpx;
  line-height: 44rpx;
  border-radius: 4rpx;
  background-color: #f9f9f9;
  &::before {
    content: "";
    position: absolute;
    left: 20rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 8rpx;
    height: 8rpx;
    background-color: #cfcfcf;
    border-radius: 50%;
  }
  &.active {
    color: #000000;
    &::before {
      background-color: $sub-color;
    }
  }
}
.mt-22 {
  margin-top: 22rpx;
}

.-ml-12 {
  margin-left: -12rpx;
}
.g-avatar {
  width: 50rpx;
  height: 50rpx;
  border-radius: 100%;
  border: 3rpx solid #fff;
  filter: drop-shadow(0rpx 4rpx 8rpx rgba(0, 0, 0, 0.08));
}

.player {
  padding: 2rpx 4rpx;
  width: 40rpx;
  height: 26rpx;
  background: #f6fff0;
  border-radius: 1rpx;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 500;
  font-size: 16rpx;
  line-height: 22rpx;
  letter-spacing: -0.3rpx;
  /* 辅色 */
  color: #95d171;
}
</style>
