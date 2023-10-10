<template>
  <view class="pr competion-calendar h-full px-32" @click="handleRoom">
    <view v-if="info.is_caddie" class="pa flex caddie-mark">
      <view class="caddie-mark-icon"></view>
      <view class="caddie-mark-title">我是球童</view>
    </view>
    <view class="left-panel flex-1">
      <CompetitionStatus 
        class="top" 
        :status="info.status || 0"
        :competitorCount="info.competitor_list.length > 4 ?  info.competitor_list.length : undefined"
        :watchCount="info.watching || 0"
        :indicatorColor="info.status === 1 ? scssVars.bgColorRed : '#A0A0A0'"
        :statusBgColor="info.status === 1 ? undefined : 'rgba(23, 31, 28, 0.4)'"
        :isHotRecommend="info.is_hot_recommend"
         />
      <view class="flex-center">
        <GlanceAvatar
          :class="[i === 0 ? '' : 'ml-20', 'flex-shrink-0']"
          v-for="(item, i) in competitorList"
          :key="i"
          :status="info.status"
          :avatarData="item"
        />
      </view>
      <view class="competion-name name flex">
        <view class="text-over flex-1">{{ info.competition_name }}</view>
        <view v-if="info.is_private" class="pr">
          <view class="private flex-shrink-0 " />
          <image v-if="!readPrivateTips"
            class="private-tips" 
            mode="widthFix" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/svg/private_tips.svg"/>
        </view>
      </view>
      <view class="course-name name text-over-2">{{ info.course_name }}</view>
    </view>
    <view class="right-panel flex-col flex-shrink-0">
      <view class="top flex-center right-panel-theme">{{ title }}</view>
      <view class="mid flex-1">
        <view class="start_date rubik">{{ info.start_date }}</view>
        <view class="start_time rubik">{{ info.start_time }}</view>
        <view class="weather">
          温度{{ weatherInfo.air_temperature || 0 }}°C {{ weatherInfo.weather }}
        </view>
      </view>
      <view class="bot flex-center right-panel-theme">
        <view>查看计分板</view>
        <view class="arrow"></view>
      </view>
    </view>
  </view>
</template>
<script>
import { isDay } from '@/utils'
import GlanceAvatar from '@/components/g-avatar/glance-avatar.vue'
import CompetitionStatus from "./competition-status.vue"
import scssVars from '@assets/styles/_export.scss'
import { mapState } from 'vuex'
export default {
  components: {
    GlanceAvatar,
    CompetitionStatus
  },
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      scssVars,
      status: 0,
      statusText: ['未开始', '进行中', '已结束'], // 0-未开始，1-进行中，2-已结束
      timer: null,
      readPrivateTips: 0
    }
  },
  created() {
    let read = uni.getStorageSync("read-private-tips") || 0
    this.readPrivateTips = read
    if (!read && this.info.is_private) {
      this.timer = setTimeout( () => {
        console.log('set read-private-tips')
        uni.setStorageSync("read-private-tips", 1)
        this.readPrivateTips = 1
      }, 5000)
    }
  },
  onPageHide() {
    console.log('clear timer')
    clearTimeout(this.timer)
    //如果用户没等4秒弹框关闭去点击别的页面，返回后弹框定时器没法执行，导致弹框关闭不了
    if (!this.readPrivateTips) {
      uni.setStorageSync("read-private-tips", 1)
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo, //用户信息
    }),
    weatherInfo() {
      const info = this.info?.weather
      console.log('info?.night_air_temperature@@ ', info?.night_air_temperature)
      return {
        weather_pic: isDay ? info?.day_weather_pic : info?.night_weather_pic,
        weather: isDay ? info?.day_weather : info?.night_weather ?? '',
        air_temperature: isDay ? info?.day_air_temperature : info?.night_air_temperature ?? 0,
      }
    },
    competitorList() {
      if (this.info?.competitor_list?.length < 1) return [];
      const competitors = this.info.competitor_list;

      // 查找我的信息
      let group = competitors.find((one) => {
        return one.uid == this.userInfo.uid;
      })?.group

      if (group == null) {
        group = this.info.caddie_briefs?.find((one) => {
          return one.uid == this.userInfo.uid;
        })?.group
      }

      // 筛选出同组人员
      const sameGroupCompetitors = competitors.filter((one) => {
        return one.group === group;
      })

      return (sameGroupCompetitors.length > 0 ? sameGroupCompetitors : competitors).slice(0, 4)
    },
    title() {
      const _statusText = ['比赛即将开始', '比赛进行中', '比赛已结束']
      return _statusText[this.info.status]
    },
  },
  methods: {
    handleRoom() {
      uni.navigateTo({
        url: `/pages/chat-room/index/index?id=${this.info.competition_id}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../home-swipe.scss';

.competion-calendar {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
  backdrop-filter: blur(25rpx);
  display: flex;
  margin-top: $home-swipe-top;
  padding-top: 46rpx;
}
.caddie-mark {
  @include bgImage(154rpx, 40rpx, 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_home_swipe_tr_mark_bg.svg');
  top: calc(0rpx - $home-swipe-top);
  right: -4rpx;

  font-style: normal;
  font-weight: 500;
  font-size: 24rpx;
  line-height: 24rpx;
  /* identical to box height */
  text-align: center;
  letter-spacing: -0.3rpx;
  color: #FFFFFF;

  gap: 6rpx;
  .caddie-mark-icon {
    margin-left: 21rpx;
    margin-bottom: 4rpx; // 提升高度
    @include bgImage(22rpx, 20rpx, 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_caddie_raw_dark.svg')
  }
}
.left-panel {
  width: 335rpx;
  margin-right: 18rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // overflow: hidden;
  .top {
    margin-bottom: 20rpx;
  }
  .live {
    width: 83rpx;
    height: 32rpx;
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/live.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
  /* 标签状态 */
  .status-tag {
    display: inline-block;
    padding: 0 10rpx 0rpx 20rpx;
    height: 32rpx;
    font-weight: 500;
    font-size: 20rpx;
    line-height: 32rpx;
    border-radius: 1rpx;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(14.9506rpx);
    &::before {
      content: '';
      position: absolute;
      left: 9rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 8rpx;
      height: 8rpx;
      background-color: #999999;
      border-radius: 50%;
    }
    &.active {
      color: #000000;
      &::before {
        background-color: $sub-color;
      }
    }
  }
  .watching {
    padding: 0 10rpx;
    height: 32rpx;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(14.9506rpx);
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 20rpx;
    line-height: 32rpx;
    letter-spacing: -0.3rpx;
  }

  .name {
    position: relative;
    padding-left: 24rpx;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 22rpx;
    line-height: 32rpx;
    letter-spacing: -0.3rpx;
    color: #FFFFFF;
    
    &::before {
      content: '';
      position: absolute;
      top: 14rpx;
      left: 7rpx;
      width: 6rpx;
      height: 6rpx;
      background-color: #9fbe3d;
      border-radius: 100%;
    }
  }
  .competion-name {
    margin-top: 18rpx;
  }
  .course-name {
    margin-top: 4rpx;
  }
  .avatar {
    width: 50rpx;
    height: 50rpx;
    border-radius: 100%;
    border: 3rpx solid #fff;
    filter: drop-shadow(0rpx 4rpx 8rpx rgba(0, 0, 0, 0.08));
  }
  .-m-12 {
    margin-left: -12rpx;
  }
  .total {
    background: #003c3d;
    box-shadow: 0rpx 4rpx 8rpx rgba(0, 0, 0, 0.08);
    margin-left: -12rpx;
    color: #fff;
  }
  .g-avatar {
    width: 100%;
    height: 100%;
  }
  .private {
      width: 17rpx;
      height: 19rpx;
      margin-left: 4rpx;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ic_banner_privacy.png');
    }
    .private-tips {
      position:absolute;
      top: -70rpx;
      width:317rpx;
      height:49rpx;
      left: 50%;
      transform: translateX(-50%);
    }
}
.right-panel {
  width: 262rpx;
  height: 238rpx;
  box-shadow: 0rpx 8rpx 20rpx rgba(0, 0, 0, 0.12);
  border-radius: 4rpx;
  .top {
    height: 38rpx;
    font-size: 20rpx;
    font-weight: 400;
  }
  .bot {
    height: 60rpx;
    font-weight: 600;
    font-size: 24rpx;

    .arrow {
      margin-left: 2rpx;
      width: 7.07rpx;
      height: 7.07rpx;

      border-top: 2rpx solid white;
      border-right: 2rpx solid white;
      border-radius: 0.2rpx;
      transform: rotate(45deg);
    }
  }
  .mid {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #ffffff 88.6%, #ffffff 100%);
  }
  .start_date {
    font-weight: 600;
    font-size: 20rpx;
    line-height: 24rpx;
    color: #666666;
  }
  .start_time {
    margin-top: -6rpx;
    font-weight: 600;
    font-size: 54rpx;
    line-height: 64rpx;
    color: #000000;
  }
  .weather {
    margin-top: -6rpx;
    color: #999999;
    font-weight: 400;
    font-size: 20rpx;
    line-height: 28rpx;
  }
}
.icon-user {
  width: 29rpx;
  height: 23rpx;
  margin-right: 8rpx;
  background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_users.png');
  background-size: cover;
  background-repeat: no-repeat;
}
.mt-18 {
  margin-top: 18rpx;
}

.ml-20 {
  margin-left: 20rpx;
}

.right-panel-theme {
  background: rgba(23, 31, 28, 0.7);
  backdrop-filter: blur(14.9506rpx);
  border-radius: 1rpx;
}
</style>
