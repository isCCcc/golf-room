<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: Blade cenweixiang@carben.com
-->
<template>
  <!-- S 房间信息 -->
  <view class="box" 
        :style="{
          '--h-gap': hGap,
          '--decorates': showDecorate ? decoratePaddings : '0rpx',
          '--decorate-t': showDecorate ? decoratePaddingT : '0rpx',
          '--decorate-r': showDecorate ? decoratePaddingR : '0rpx',
          '--decorate-b': showDecorate ? decoratePaddingB : '0rpx',
          '--decorate-l': showDecorate ? decoratePaddingL : '0rpx',
        }">
    <view class="main-root" :class="[roomInfo.status == 1 ? 'room-ing' : '']">
      <view v-if="showDecorate" class="decorate">
        <view class="multi-group">
          <view class="bg"></view>
          <view class="top-part">
            <view class="trophy"></view>
            <view class="title"></view>
            <view class="com-count">{{ '参赛球员：' + totalCompetitorCount }}</view>
          </view>
        </view>
      </view>

      <uni-swipe-action class="swipe-wrapper">
        <uni-swipe-action-item
          class="swipe-item"
          :autoClose="false" 
          :show="shouldShow"
          :disabled="couldSwipe"
          @change="handleSwipeChange($event)"
        >
          
        
    
        <view class="main">
          <view class="top">
            <view class="flex avatar-list" :class="info.status == 1 ? 'alive' : ''" v-if="competitorAvatarList.length">
              <ListAvatar
                v-for="(item, index) in competitorAvatarList"
                :key="item.competitor_id"
                :status="roomInfo.status"
                :avatarData="item"
                :showScore="roomInfo.status"
                :class="[' flex-shrink-0 ', 'avatar', index === 0 ? '' : 'ml-16']"
                :contentStyle="roomInfo.status == 1 ? 'background: linear-gradient(90deg, #D8ECCE 0%, rgba(238, 238, 238, 0) 103.85%);' : ''"
              />
            </view>
            <view v-if="info.status == 0" class="flex competition-status not-begin">
              <image src="http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/competition_notbegin_text.png" 
                class="status-text-img" mode="aspectFit"/>
            </view>
            <view v-else-if="info.status == 1" class="flex competition-status ing"/>
            <view v-else-if="info.status == 2" class="flex competition-status finish">
                <image src="http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/competition_finish_text.png" 
                  class="status-text-img" mode="aspectFit"/>
            </view>
          </view>

          <view class="flex ml-24">
<!--            <CompetitionStatus 
            class="" 
            :height="28"
            :status="info.status || 0"
            :fontColor="'#999999'"
            :competitorCount="competitorCountInStatus"
            :watchCount="info.watching || 0"
            :indicatorColor="info.status === 1 ? scssVars.bgColorRed : '#A0A0A0'"
            :statusBgColor="info.status === 1 ? '#474747' : '#EDEDED'"
            :infoBg="'#F9F9F9'"
            /> -->

            <!-- 标记 -->
            <view class="mark-root"><!-- ml-10 -->
              <view class="mark hot-text" v-if="roomInfo.is_hot_recommend">
                <view class="hot" />
                热门
              </view>
              
              <view class="mark friend-text" v-if="roomInfo.is_friend_join">
                <view class="friend" />
                好友
              </view>
              
              <view class="mark nearby-text" v-if="roomInfo.isNearby && !(roomInfo.is_hot_recommend && roomInfo.is_friend_join)"><!-- 热门 好友 附近(按优先级排序) 最多显示两个 -->
                <view class="nearby" />
                附近{{roomInfo.distance}}KM
              </view>
              
              <view v-if="info.is_private" class="mark col-999">
                <view class="private" />
                私密房间
              </view>
              
              <view v-if="info.watching" class="mark watching col-999">
                <view class="square" v-if="roomInfo.is_hot_recommend || roomInfo.is_friend_join || roomInfo.isNearby || info.is_private"/>
                {{info.watching}}人围观
              </view>
              
              <view class="mark watching col-999" 
                  v-if="!roomInfo.is_hot_recommend && !roomInfo.is_friend_join && !roomInfo.isNearby && !info.watching && !info.is_private">
                暂无围观
              </view>
            </view>
          </view>

          <view class="bottom-part">
            <view class="bottom-left">
              <view class="text-over competition-name">{{ roomInfo.competition_name || '' }}</view>
              <view class="mt-4 mb-12 fw-400 fs-26 theme-h-color text-over">
                <text>{{ roomInfo.course_name || '' }}</text>
                <text v-if="courseHalfCourtList.length"> · </text>
                <text v-for="(item, i) in courseHalfCourtList" :key="i">
                  {{ item }}
                  <template v-if="i !== courseHalfCourtList.length - 1">&</template>
                </text>
              </view>
            </view>

            <view class="weather">
              <view
                class="icon-weather"
                v-if="weatherInfo.weather_pic"
                :style="{ backgroundImage: 'url(' + weatherInfo.weather_pic + ')' }" />
              <view v-if="weatherInfo.weatherSum.length" class="text">{{ weatherInfo.weatherSum }}</view>
            </view>
          </view>
          <view v-if="info.status == 0" class="border-top" />
          <view v-if="info.status == 0" class="flex-between ml-24 mr-24 ptb-12">
            <view>
              <text class="fw-500 fs-26 rubik">{{ dateInfo }}</text>
              <text class="fw-400 fs-26 ml-10 rubik-regular">{{ timeInfo }}</text>
            </view>
            <view>
              <text class="fs-22 col-999 fw-400">距比赛开始还有</text>
              <view class="fs-22 col-black fw-400 ml-6 rubik-regular inline-block">
                <template v-if="countdownObj.d != '' " >
                  <view v-if="countdownObj.d != '' "
                    :class="[countdownObj.d.length > 2 ? 'inline-block w-38' : 'inline-block w-28']">
                    {{countdownObj.d}}
                  </view>
                  天
                </template>
                <view class="inline-block w-80">{{countdownObj.time}}</view>
              </view>
            </view>
          </view>
        </view>


        <template v-slot:right>
          <view class="swipe-del" @click.stop="handleDel()">
            <view class="swipe-del-icon"></view>
          </view>
        </template>

        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
  </view>
</template>
<script>
import { isDay } from '@/utils'
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import ListAvatar from '@/components/g-avatar/list-avatar.vue'
import CompetitionStatus from "../home-swiper/components/competition-status.vue"
import scssVars from '@assets/styles/_export.scss'

export default {
  components: {
    ListAvatar,
    CompetitionStatus,
  },
  emits: [
    "del", 'swipeChange'
  ],
  props: {
    hGap: {
      type: String,
      default: '32rpx',
    },
    info: {
      type: Object,
      default: () => ({}),
    },
    couldSwipe: {
      type: Boolean,
      default: false,
    },
    swipeShowStatus: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    decoratePaddings() {
      return [this.decoratePaddingT, this.decoratePaddingR, this.decoratePaddingB, this.decoratePaddingL].join(' ')
    },
    roomInfo() {
      return this.info
    },
    showDecorate() {
      return this.groupCount > 1;
    },
    // 分组数
    groupCount() {
      if (this.roomInfo?.group_list && this.roomInfo.group_list.length) {
        return this.roomInfo.group_list.length
      }
      const groups = new Set(this.roomInfo?.competitor_list.map((competitor) => { return competitor.group ?? 'A' }))
      return groups.size;
    },
    // 比赛状态部分显示的比赛人数。如果是团体比赛，显示在 decoration 部分中，其它情况，> 4，才显示。
    competitorCountInStatus() {
      return this.showDecorate ? null : this.roomInfo.competitor_list.length > 4 ?  this.roomInfo.competitor_list.length : undefined
    },
    // 总人数
    totalCompetitorCount() {
      return this.roomInfo?.competitor_list?.length || 0;
    },

    // 半场列表
    courseHalfCourtList() {
      return this.roomInfo?.course_half_court_list || []
    },
    competitorAvatarList() {
      return this.roomInfo?.competitor_list.slice(0, 4)
    },
    weatherInfo() {
      const info = this.roomInfo?.weather
      const sumArr = []
      const weatherStatus = isDay ? info?.day_weather : info?.night_weather;
      const temperature = isDay ? info?.day_air_temperature : info?.night_air_temperature;
      weatherStatus && sumArr.push(weatherStatus)
      temperature && sumArr.push(temperature + '°C')
      return {
        weather_pic: isDay ? info?.day_weather_pic : info?.night_weather_pic,
        weatherSum: sumArr.join(' ')
      }
    },
    dateInfo() { 
      return dayjs(this.roomInfo?.start_time).locale('zh-cn').format("MM/DD");
    },
    timeInfo() { 
      return dayjs(this.roomInfo?.start_time).locale('zh-cn').format("HH:mm");
    },

    shouldShow() {
      return (this.swipeShowStatus.id === this.info.competition_id ? this.swipeShowStatus.show : 'none') || 'none'
    },
    endTimestamp () {
      return this.roomInfo ? new Date(this.roomInfo?.start_time).getTime() / 1000  : ''
    },
  },
  data() {
    return {
      scssVars,
      decoratePaddingT: '57rpx',
      decoratePaddingR: '12rpx',
      decoratePaddingB: '12rpx',
      decoratePaddingL: '12rpx',
      statusText: ['未开始', '进行中', '已结束'], // 0-未开始，1-进行中，2-已结束
      countdownObj: {d: '', time: ''},
      loadTimer: false,
      timer: null
    }
  },
  created() {
    this.loadTimer = true
    if (this.info.status == 0 && this.loadTimer) {
     this.countDown(this.info.start_time)
    }
  },
  onPageShow() {
    this.loadTimer = true
    console.log('on page show')
    if (this.info.status == 0 && this.loadTimer) {
      this.countDown(this.info.start_time)
    }
  },
  onPageHide() {
    this.loadTimer = false
    console.log('hide clear timer')
    clearInterval(this.timer)
  },
  methods: {
    handleSwipeChange(e) {
      this.$emit('swipeChange', e, this.info)
    },

    handleDel() {
      this.$emit('del', this.info)
    },
    
    countDown(endTime){
      console.log(endTime)
      let timestamp = new Date(endTime.replace(/\-/g, '/')).getTime() / 1000
      let that = this
      that.timer = setInterval(function(){
      	let nowTime = new Date();
      	let endTime = new Date(timestamp * 1000);
      	let t = endTime.getTime() - nowTime.getTime();
      	if(t>0){
      		let day = Math.floor(t/86400000);
      		let hour=Math.floor((t/3600000)%24);
      		let min=Math.floor((t/60000)%60);
      		let sec=Math.floor((t/1000)%60);
      		day = day < 10 && day > 0 ? "0" + day : '';
      		hour = hour < 10 ? "0" + hour : hour;
      		min = min < 10 ? "0" + min : min;
      		sec = sec < 10 ? "0" + sec : sec;
      		let format = '';
      		// if(day > 0){
      		// 	format = `${day}天${hour}:${min}:${sec}`;
      		// }
          that.countdownObj.d = day
      		if(hour > 0 ){//day <= 0 && 
      			format = `${hour}:${min}:${sec}`;
      		}
      		if(day <= 0 && hour <= 0){
      			format =`00:${min}:${sec}`;
      		}
          that.countdownObj.time = format
      	}else{
      		clearInterval(that.timer);
          that.competitionStart()
      	}
      },1000);
    },
    
    competitionStart() {
      this.$emit('start', this.info)
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
}

.main-root {
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;

  max-width: calc(100% - var(--h-gap) * 2 + var(--decorate-l) + var(--decorate-r));

  box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);

  .decorate {
    position: absolute;
    width: 100%;
    height: 100%;

    display: flex;

    .multi-group {
      position: relative;
      display: flex;
      flex-grow: 1;
      flex-shrink: 1;
      
      background: linear-gradient(294.47deg, rgba(10, 107, 255, 0.2) 11.91%, rgba(44, 79, 135, 0.2) 56.57%), linear-gradient(180deg, #2A3629 0%, #244495 100%);
      box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
      border-radius: 4rpx;

      .bg {
        overflow: hidden;
        
        position: absolute;
        width: 100%;
        height: 100%;

        border-radius: 4rpx;

        background: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/svg/img_multi_group.svg");
        background-size: 100% 100%;

        box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
      }
      
      .top-part {
        position: relative;

        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        flex-direction: row;
        justify-content: flex-start;
        gap: 8rpx;
        
        align-items: center;

        height: 34rpx;

        margin-top: 14rpx;
        margin-right: 18rpx;
        margin-left: 32rpx;

        .trophy {
          width: 30rpx;
          height: 28rpx;
          background: url(https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/icon_trophy_gold.svg);
          background-size: 100% 100%;
        }
        
        .title {
          width: 106rpx;
          height: 28rpx;
          background: url(https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/icon_group_com.svg);
          background-size: 100% 100%;
        }
        
        .com-count {
          margin-left: auto; // 右对齐
          
          color: #FFFFFF;
          font-style: normal;
          font-weight: 400;
          font-size: 24rpx;
          line-height: 34rpx;
        }
      }
    }
  }

  .swipe-wrapper {
    position: relative;
    width: 100%;
    // display: flex;
    // flex-direction: column;
    // flex-grow: 1;
    // flex-shrink: 1;

    .swipe-item {
      position: relative;
      // display: flex;
      // flex-direction: column;
      // flex-grow: 1;
      // flex-shrink: 1;

      

      .main {
        position: relative;
  
        background-color: white;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        flex-shrink: 1;
  
        margin: var(--decorate-t) var(--decorate-r) var(--decorate-b) var(--decorate-l);
  
        padding: 8rpx;
  
        background: $white;
        box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
        border-radius: 4rpx;
        
        overflow: hidden
      }
    }
  }
}

.room-ing {
  box-shadow: 0px 6px 28px #DEE3D6;
  border: 2rpx rgba(158,225,117) solid;
  border-radius:4rpx;
}

.top {
  position: relative;
  margin-bottom: 20rpx;
}

.avatar-list {
  overflow: hidden;
  padding: 24rpx;
  padding-right: 14rpx;

  flex: 1;

  box-sizing: border-box;
  background: #F8F8F8;
  border: 1rpx solid #EDEDED;
}

.alive {
  background: linear-gradient(270deg, rgba(247, 255, 236, 0.675) 0%, rgba(249, 255, 241, 0.9) 52.08%, rgba(245, 255, 242, 0.621) 100%);border: 1rpx solid #D5EBD2;
}

.avatar {
  flex-basis: calc((100% - 16rpx * 3) / 4);
}
.start-time {
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translateY(100%);

  width: 214rpx;
  height: 56rpx;

  background-image: url("data:image/svg+xml,%3Csvg fill='none' height='56' viewBox='0 0 213 56' width='213' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M26.108 47.684A16 16 0 0 0 40.142 56H213V0H0z' fill='%23ededed'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  
  box-sizing: border-box;
  padding-left: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  @include rubikVar(600);
  font-style: normal;
  font-size: 24rpx;
  line-height: 28rpx;
  letter-spacing: -0.3rpx;

  color: #000000;
  .date {
    margin-left: 9rpx;
  }
}
.bottom-part {
  margin-top: 20rpx;
  margin-left: 24rpx;
  position: relative;
  display: flex;
  gap: 36rpx;
  .bottom-left {
    flex: 1;
  }
}
.competition-name {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 26rpx;
  line-height: 36rpx;
  letter-spacing: -0.3rpx;
  color: #999999;
}
/* 标签状态 */
.status-tag {
  display: inline-block;
  padding: 0 10rpx 0rpx 20rpx;
  height: 32rpx;
  font-size: 20rpx;
  line-height: 28rpx;
  border-radius: 4rpx;
  background-color: #f9f9f9;
  &::before {
    content: '';
    position: absolute;
    left: 9rpx;
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

.mark-root {
  display: flex;
  gap: 10rpx;

  .mark {
    width: fit-content;
    display: flex;
    align-items: center;

    font-weight: 400;
    font-size: 22rpx;
    // line-height: 28rpx;
    letter-spacing: -0.3rpx;

    color: $col-999;

    
    .hot {  
      width: 22rpx;
      height: 28rpx;
      margin-right: 4rpx;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_list_hot_01.svg');
    }

    .friend {
      width: 28rpx;
      height: 26rpx;
      margin-right: 4rpx;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_list_user_01.svg');
    }
    
    .watching {
      height: 20rpx;
      margin-right: 4prx;
    }
    
    .square {
      width: 4rpx;
      height: 4rpx;
      background: #DDDDDD;
      margin-right: 6rpx;
    }

    .nearby {
      width: 21rpx;
      height: 26rpx;
      margin-right: 4rpx;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_subtract.svg');
    }
    .private {
      width: 17rpx;
      height: 20rpx;
      margin-right: 4rpx;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ic_privacy.svg');
    }
  }

  .hot-text {
    color: #E95939;
  }

  .friend-text {
    color: #4E76A7;
  }
  
  .nearby-text {
    color: #61AE34;
  }
  .h-28 {
    height: 28rpx;
  }
}

.weather {
  margin-right: 20rpx;
  

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6rpx;

  .icon-weather {
    width: 40rpx;
    height: 40rpx;
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/icon8.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top center;
  }
  .text {
    font-weight: 400;
    font-size: 20rpx;
    line-height: 28rpx;
    /* identical to box height */
    text-align: center;
    letter-spacing: -0.3rpx;

    color: rgba(0, 0, 0, 0.3);
  }
}

.swipe-del {

  margin: var(--decorate-t) var(--decorate-r) var(--decorate-b) 0rpx;

  width: 134rpx;
  margin-left: 8rpx;

  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(194.14deg, rgba(255, 119, 119, 0.2) 0%, rgba(255, 119, 119, 0.1) 100%);
  // box-shadow: 0px 4px 30px rgba(57, 80, 69, 0.08);
  background-color: white;
  border-radius: 4rpx;

  .swipe-del-icon {
    width: 44rpx;
    height: 44rpx;
    background: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_del_red.svg");
    background-size: 100% 100%;
  }
}
.competition-status {
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translateY(100%);
  width: 227rpx;
  height: 56rpx;
  background-repeat: no-repeat;
  background-size: cover;
  &.not-begin {
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/competition_notbegin_bg.png');
  }
  &.ing {
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/competition_ing.png');
  }
  &.finish {
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/competition_finish_bg.png');
  }
  .status-text-img {
    height:29rpx;
    width:119rpx;
    display:block;
    margin:auto auto auto 64rpx;
  }
}
.border-top {
  background: #E9E9E9;
  box-shadow: 0px 4rpx 30rpx rgba(57, 80, 69, 0.08);
  width: 100vw;
  height: 1rpx;
  margin-left: -8rpx;
}
.ptb-12 {
  padding: 12rpx 0;
}
.inline-block {
  display: inline-block;
}
.w-38 {
  width: 38rpx;
}
.w-28 {
  width: 28rpx;
}
.w-80 {
  width: 84rpx;
}
</style>
