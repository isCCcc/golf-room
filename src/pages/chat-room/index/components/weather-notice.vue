<!--
 * @Author: simon
 * @Description: 计分板天气通知
 * @LastEditors: simon
-->
<template>
  <view class="root" :class="{landscape: landscape}">
    <view class="logo-container"></view>
    <view class="flex-1 fs-24 flex weather-wrapper" :id="'weather-wrapper'">
      <view v-for="(index) in [0, 1]" :key="index">
        <view class="flex weather-content" :id="'weather-content-' + index" :style="{'--duration': duration + 's', '--delay': delay + 's'}">
          <view v-if="startTime && startTime.length > 0" class="flex weather-area">
            <view class="circle circle-green"></view>
            <text>{{startTime}}</text>
          </view>
          <view v-if="name && name.length > 0" class="flex weather-area sub-color">
            <view class="circle circle-green"></view>
            <text>{{ name }}</text>
          </view>
          <view v-if="uvStatus.length > 0" class="flex weather-area">
            <view class="circle circle-green"></view>
            <text>{{ uvStatus }}</text>
          </view>
          <view v-if="temperatureSummery.length" class="flex weather-area">
            <view class="circle circle-green"></view>
            <text>{{ temperatureSummery }}</text>
          </view>
          <view v-if="weatherSummery.length" class="flex weather-area">
            <view class="circle circle-green"></view>
            <text>{{ weatherSummery }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { isEmpty } from '@/utils';
import { throttle } from '@/utils/function-helper';
import dayjs from 'dayjs';

export default {
  props: {
    /**
     * 球赛开始时间
     */
    startTimeStr: {
      type: String,
      default: ''
    },
    /**
     * 场地名称
     */
    name: {
      type: String,
      default: ''
    },

    /**
     * 动画开始是时间（timestamp ms）。用于同步动画进度
     */
    beginDisplayTime: {
      type: Number,
      default: new Date().getTime(),
    },

    // 天气信息
    weatherData: {
      type: [Object, null],
      default: () => ({})
    }
  },
  data() {
    return {
      containerWidth: 0,
      contentWidth: 0,
      selfDisplayTime: new Date().getTime(),

      throttledUpdateContentWidth: null,
    }
  },
  watch: {
    $props(nVal, oVal) {
      console.log('$props', nVal);
    }
  },
  watch: {
    $props(nVal, oVal) {
      console.log('$props', nVal);
    }
  },
  mounted() {
    this.selfDisplayTime = new Date().getTime()
  },
  updated() {
    this.updateContentWidthIfNeeded();
  },
  computed: {
    // 比赛开始时间
    startTime() {
      if (this.startTimeStr == undefined || this.startTimeStr.length < 1) return null;
      const day = dayjs(this.startTimeStr)
      return day.locale('zh-cn').format('YYYY年MM月DD日 HH:mm')
    },

    // 天气状况
    weatherStatus() {
      if (isEmpty(this.weatherData) || (this.weatherData.day_weather == null && this.weatherData.night_weather == null)) {
        return ''
      }

      const weatherData = this.weatherData
      if (weatherData.day_weather === weatherData.night_weather) {
        return `全天${weatherData.day_weather}`;
      } else {
        return [weatherData.day_weather, weatherData.night_weather].join('转')
      }
    },

    windStatus() {
      const strArr = []
      if (isEmpty(this.weatherData)) {
        return ''
      }
      const weatherData = this.weatherData
      if (weatherData.day_wind_direction === weatherData.night_wind_direction
        && weatherData.day_wind_power === weatherData.night_wind_power) {
        weatherData.day_wind_direction && strArr.push(weatherData.day_wind_direction)
        weatherData.day_wind_power && strArr.push(weatherData.day_wind_power)
      } else {
        if (weatherData.day_wind_direction || weatherData.day_wind_power) {
          strArr.push('白天:')
          weatherData.day_wind_direction && strArr.push(weatherData.day_wind_direction)
          weatherData.day_wind_power && strArr.push(weatherData.day_wind_power)
        }

        if (weatherData.night_wind_direction || weatherData.night_wind_power) {
          strArr.push('夜间:')
          weatherData.night_wind_direction && strArr.push(weatherData.night_wind_direction)
          weatherData.night_wind_power && strArr.push(weatherData.night_wind_power)
        }
      }
      
      return strArr.join(' ')
    },

    weatherSummery() {
      const strArr = []
      this.weatherStatus.length && strArr.push(this.weatherStatus)
      this.windStatus.length && strArr.push(this.windStatus)
      return strArr.join(' ');
    },

    /**
     * 
     */
    temperatureSummery() {
      if (isEmpty(this.weatherData)) {
        return ''
      }
      const weatherData = this.weatherData
      const strArr = []
      weatherData.day_air_temperature?.length && strArr.push(`${weatherData.day_air_temperature}°C`)
      weatherData.night_air_temperature?.length && strArr.push(`${weatherData.night_air_temperature}°C`)
      return strArr.join(' ～ ')
    },

    /**
     * 紫外线状况
     */
    uvStatus() {
      const uv = this.weatherData?.uv;
      return uv && uv.length > 0 ? `紫外线: ${uv}` : '';
    },

    /**
     * 完整天气信息的滚动时长，以一个屏幕宽度为单位。
     */
    duration() {
      console.log('duration', this.contentWidth, this.containerWidth);
      return this.contentWidth / this.containerWidth * 15; // 
    },

    /**
     * 动画开始延时时间。默认 2s
     */
    delay() {
      return 2 - (this.selfDisplayTime - this.beginDisplayTime) / 1000;
    }
  },
  methods: {
    updateContentWidthIfNeeded() {
      if (this.throttledUpdateContentWidth == null) {
        const scope = this;
        const updating = async () => {
          this.$nextTick(() => {
            uni.createSelectorQuery()
              .in(this)
              .select(`#weather-wrapper`)
              .boundingClientRect(ret => {
                if (ret == undefined) return;
                scope.containerWidth = ret.width;
              })
              .exec()
          })
          this.$nextTick(() => {
            uni.createSelectorQuery()
              .in(this)
              .select(`#weather-content-0`)
              .boundingClientRect(ret => {
                console.log('weather-content-0', ret);
                if (ret == undefined) return;
                scope.contentWidth = ret.width;
              })
              .exec()
          })
        }
        this.throttledUpdateContentWidth = throttle(updating, 100)
      }

      this.throttledUpdateContentWidth();
    }
  },
};
</script>


<style lang="scss" scoped>
.root {
  position: relative;
  width: 100%;
  height: 54rpx;

  background: linear-gradient(270.04deg, #042d2c 2.32%, #032221 99.99%);
  display: flex;

  overflow: hidden; // 为了防止父元素设置 border 的时候，跑马灯部分露出来。
}
.logo-container {
  z-index: 1;
  @include bgImage(114rpx, 54rpx, 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_weather_logo_bg.png');
  min-width: 114rpx;
}
// S 天气预报
.weather-wrapper {
  // flex: 1;
  margin-left: -16rpx;
  padding: 0 32rpx;
  
  backdrop-filter: blur(6rpx);
  box-sizing: border-box;
  color: rgba($color: #fff, $alpha: 0.8);
  overflow: hidden;
  .weather-content {
    // padding-left: 750rpx;
    padding-right: 80rpx;
    animation: notice var(--duration) var(--delay) linear infinite;
    white-space: nowrap;
    animation-play-state: running;
    .weather-area {
      margin-right: 21rpx;
      .circle {
        margin-right: 5rpx;
      }
    }
  }
}
@keyframes notice {
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}
// E 天气预报
</style>
