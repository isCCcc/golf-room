<template>
  <view class="page score-landscape-page trans" id="landscapePage" ref="landscapePage">
    <!-- position relatvie 包裹 -->
    <view class="pr"> 
      <view >
        <!-- S 自定义bar -->
        <view class="landscape-nav-bar">
          <!-- 左侧功能按钮 -->
          <view class="flex-center left-wrapper">
            <view class="flex-center back-arrow" @click="handleBack">
              <image :src="`${ossUrl}/icons/ico_back.png`"
                     class="icon-back"
                     mode="widthFix" />
            </view>
            <view class="flex-center export-btn" @click="exportLandscapeImage">
              <image :src="`${ossUrl}/icons/icon-upload.png`"
                     class="icon-upload"
                     mode="widthFix" />
              <view>导出图片</view>
            </view>
          </view>
          <!-- 标题 -->
          <view class="tc w-auto landscape-title">
            <view class="text-over">{{ pageTitle || '' }}</view>
            <!-- 比赛天气情况 -->
            <!-- <WeatherNotice :landscape="true"
                           :weatherData="weatherData"
                           :beginDisplayTime="weatherBeginDisplayTime"
                           :name="competitionData.competition_name"
                           :startTimeStr="startTime"
                           v-if="weatherData" /> -->
            <view class="weather-wrapper tc">
              <text>{{weatherText}}</text>
            </view>
          </view>
        </view>
        
        <view class="score-board-wrap">
          <Group class="group" @changeGroup="updateCurGroup" />
          <ScoreSummary class="score" />
          <ScoreBoard class="board" :cellWidth="cellWidth" />
        </view>
      </view>
    </view>
    <cover-image :src="imagePath"
           v-if="imageShow"
           :style="{width: screenWidth + 'px', height: screenHeight + 'px'}"
           class="gen-image"
           mode="scaleToFill"
           @click="hideImage"/>
    <x-wxml-to-canvas
      v-if="painterShow"
      :hide="true"
      :isMode="false"
      ref="xWxmlToCanvas"
      :width="screenWidth"
      :height="screenHeight"
      :xWxml="xWxml"
      :xStyle="xStyle">
    </x-wxml-to-canvas>
  </view>
</template>

<script>
  import { getWxQRCode } from '@/api/utils'
  // import WeatherNotice from '@/pages/chat-room/index/components/weather-notice'
  import Group from './components/Group'
  import ScoreSummary from './components/ScoreSummary'
  import ScoreBoard from './components/ScoreBoard'
  // import Painter from './components/Painter'
  import xWxmlToCanvas from './components/x-wxml-to-canvas/x-wxml-to-canvas.vue'
  import { mapState, mapActions } from 'vuex'
  import fn from './painter.js'
  import dayjs from 'dayjs'
  import { generatePageShareParamString, PAGES, shareCompetition } from '@utils/share'
  import { actionsTypes } from '@/store/modules/chat-room/types.js'
  
  export default {
    components: {
      // WeatherNotice,
      Group,
      ScoreSummary,
      ScoreBoard,
      xWxmlToCanvas
      // Painter
    },
    data() {
      return {
        weatherBeginDisplayTime: new Date().getTime(),
        ossUrl: this.$ossUrl,
        screenHeight: 300,
        screenWidth: 300,
        xWxml: null,
        xStyle: null,
        painterShow: false,
        imagePath: null,
        imageShow: false,
        // 计算表格单元格宽度
        cellWidth: 36
      }
    },
    computed: {
      ...mapState({
        userInfo: (state) => state.user.userInfo,
        competitionData: (state) => state.chatRoom.competitionData,
        isNowGroup: (state) => state.chatRoom.isNowGroup || 'A'
      }),
      // 球场名称
      pageTitle() {
        if (this.competitionData.course_half_court_count > 2) {
          let { course_name, hole_list } = this.competitionData;
          let names = hole_list?.map((e) => e.half_court_name);
          return `${course_name}·${names?.join('')}场`;
        }
        return this.competitionData.course_name;
      },
      // 开始时间
      startTime() {
        return this.competitionData?.start_time
      },
      // 天气信息
      weatherData() {
        return this.competitionData.weather
      },
      weatherText() {
        const courseName = this.competitionData.competitor_list?.map(item => item.username).join('、') + '的球局'
        const dayWeather = this.competitionData?.weather?.day_weather
        const temperature = this.competitionData?.weather?.day_air_temperature + '°C'
        const startTime = dayjs(this.competitionData?.start_time).locale('zh-cn').format('YYYY年MM月DD日 dddd HH:mm')
        
        return `${courseName} ${dayWeather} ${temperature} ${startTime}`
      }
    },
    mounted() {
      this.weatherBeginDisplayTime = new Date().getTime()
      uni.getSystemInfo({
        success: (res) => {
          this.screenHeight = res.windowHeight
          this.screenWidth = res.windowWidth
          // 小数的误差视觉上会产生偏移
          this.cellWidth = parseInt((this.screenWidth - 132)/22)
          // 初始化画布内容
          this.initPainterWxml()
        }
      })
    },
    methods: {
      ...mapActions({
        UPDATE_CUR_GROUP: actionsTypes.UPDATE_CUR_GROUP,
        GET_COMPETITION_DETAIL: actionsTypes.GET_COMPETITION_DETAIL
      }),
      // 导航返回
      handleBack() {
        // 判断是否有上一页
        let pages = getCurrentPages()
        if (pages.length > 1) {
          return uni.navigateBack()
        }
        uni.switchTab({
          url: '/pages/tabbar/home/index'
        })
      },
      async getQrcode() {
        const paramsStr = generatePageShareParamString(
          {
            page: PAGES.chat,
            params: [
              PAGES.chat,
              this.competitionData.competition_id,
              this.isNowGroup
            ]
          }
        );
        const res = await getWxQRCode({ scene: paramsStr, gl: false })
        if (typeof res.data === 'string') {
          return 'data:image/png;base64,' + res.data
        } else {
          return ''
        }
      },
      async initPainterWxml() {
        // 生成天气wxml
        const weatherWxml = fn.genWeatherWxml(this.weatherText)

        const competitorList = this.competitionData?.competitor_list?.filter(
            (item) => item.group === this.isNowGroup
          ) || []
        // 生成计分板wxml
        const scoreBoardWxml = fn.genBoardWxml(competitorList, this.competitionData.hole_list, this.competitionData)
        // 生成人员统计wxml
        const scoreSummaryWxml = fn.genSummaryWxml(competitorList)

        // 生成分享二维码
        const shareQrcode = await this.getQrcode()
        const shareQrcodeWxml = fn.genQrcodeWxml(shareQrcode)
        this.xWxml = fn.genWxml(this.pageTitle, weatherWxml, scoreBoardWxml, scoreSummaryWxml, shareQrcodeWxml)
        // console.log(this.xWxml)
        // 生成画布样式对象
        this.xStyle = fn.genStyle(this.screenWidth, this.screenHeight, competitorList.length)

        this.painterShow = true
        // setTimeout(() => {
        //   // this.painterShow = true
        //   this.$refs.xWxmlToCanvas.renderToCanvas()
        // }, 500)
      },
      async exportLandscapeImage() {
        await this.$refs.xWxmlToCanvas.renderToCanvas()
        const imagePath = await this.$refs.xWxmlToCanvas.canvasToTempFilePath()
        // const imagePath = await this.$refs.xWxmlToCanvas.getCanvasImage()
        this.showImage(imagePath)
        uni.saveImageToPhotosAlbum({
          filePath: imagePath,
          success: function () {
            uni.showToast({
            	title: '图片已保存至相册',
            	icon: 'success'
            })
          }
        })
      },
      showImage(path) {
        this.imagePath = path
        this.imageShow = true
      },
      hideImage() {
        this.imageShow = false
      },
      async updateCurGroup(group) {
        this.UPDATE_CUR_GROUP(group)
        // 更新数据后，重新获取一下全部详情，使数据为最新。
        await this.GET_COMPETITION_DETAIL({ competition_id: this.competitionData.competition_id })
        // 更新画布内容
        this.initPainterWxml()
      },
      onShareAppMessage(res) {
        return this.pageSharing(res)
      },
      pageSharing(res) {
        const share = this.getTopPageInjectedShare();
        if (share) return share;

        const data = this.competitionData
        return shareCompetition({
          id: data?.competition_id,
          group: this.group_id,
          uid: this.userInfo.uid,
          shareRoomName: data.competition_name,
          imageUrl: ''
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .score-landscape-page {
    background: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/landscape_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top left;
    position: relative;
    .landscape-nav-bar {
      display: flex;
      padding: 0 10px;
      flex-direction: row;
      height: 69px;
      color: #fff;
      .left-wrapper {
        position: absolute;
        left: 0;
        top: 10px;
        width: 160px;
      }
      .export-btn {
        box-sizing: border-box;
        width: 90px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        margin-left: 6px;
        padding: 0 10px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        .icon-upload {
          width: 8px;
          margin-right: 8px;
        }
      }
      .landscape-title {
        font-size: 16px;
        padding: 16px 0 10px;
        .weather-wrapper {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 10px;
        }
      }
    }
    .score-board-wrap {
      padding: 12rpx 42rpx;
      position: relative;
      .score {
        position: absolute;
        top: 12rpx;
        right: 127rpx;
      }
      .board {
        margin: 0 auto;
      }
    }
    .gen-image {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
    
    .gen-image {
      will-change: transform;
      z-index: 10;
    }
  }
</style>
