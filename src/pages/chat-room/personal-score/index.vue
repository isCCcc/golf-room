<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="root" :style="{ '--nav-height': navTotalHeight + 'px'}">

  <!-- S 自定义bar -->
  <uni-nav-bar class="nav"
                  statusBar
                  backgroundColor="transparent"
                  :border="false"
                  color="#333333"
                  @clickLeft="handleBack">
      <view class="flex-center back-arrow"
            slot="left">
        <image :src="`${ossUrl}/icons/icon-back-black.png`"
                class="icon-back"
                mode="widthFix" />
      </view>
      <view class="flex-center w-auto fs-36"
            style="padding-left: 25rpx">个人成绩</view>
    </uni-nav-bar>
    <!-- E 自定义bar -->

    <!-- S 总成绩 -->
    <view class="score-top">
      <view class="flex mt-10">
        <view style="margin-right: 60rpx;position: relative;">
          <view class="score-num">
            {{competitor.total_score || '--'}}
          </view>
          <image src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score-unerline.png" style="display: block;width: 145rpx;float: right;" mode="widthFix" />
          <image src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/zonggan.png" style=" position: absolute;right: -60rpx;bottom:48rpx;width: 50rpx;" mode="widthFix" />
        </view>
        <view class="flex1">
          <view class="flex-end">
            <view class="flex">
              <view>
                <view class="flex-end">
                  <view class="color-area"
                        :style="{backgroundColor: teeColor.color}"></view>
                  <view class="fs-32 fw-600 col-1e3">{{user.username}}</view>
                </view>
                <view class="fs-24 fw-400" style="color: #939999;">{{cometitionStartTime}}</view>
              </view>
              <GAvatar class="avatar-box" :avatar-data="user" :size-in-rpx='76' :border="'3rpx solid #FEFEFE'" :radius="'2rpx'" />
            </view>
          </view>
          <view class="linear-line"/>
          <view class="text-box fs-22 fw-400 flex">
            <image src="http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/course_loc.png" style="height: 20rpx;margin-right: 4rpx;" mode="heightFix" />
            <view class="text-over">{{competition.course_name}}</view>
          </view>
        </view>
      </view>
      
    </view>
    <!-- E 总成绩 -->

    <!-- S 成绩明细 -->
    <view class="score-bottom">
      <!-- /标题 -->
      <view class="score-detail">
        <!-- S 前九 -->
        <view :key="name"
              v-for="(value,name) in recordData">
          <view class="title-box flex-center h-38">
            <text class="fs-20 op-5">{{name}}</text>
          </view>
          <!-- /标题 -->
          <view class="detail-content flex">
            <view class="flex-1"
                  v-for="record in value.data"
                  :key="record.competition_record_id">
              <view class="h-74 flex-center hole-cell">
                <HoleCell :hole="{par: record.par,hole_no2: record.hole_no2}"
                          :parStyle="{'font-size': '24rpx'}" />
                <!-- /洞号 -->
              </view>
              <view class="record-cell">
                <view class="h-74 flex-center boder-t">
                  <RecordCell :record="{score: record.score,unusual: false}"
                              :wrapperStyle="{width: `48rpx`,height: `48rpx`}"
                              :scoreStyle="{'font-size':  `28rpx`}" />
                </view>
                <!-- /球分 -->
                <view class="fs-24 op-7 tc h-38  gan-score boder-t flex"
                      v-show="value.show">
                  <view class="flex-1">{{record.on !== null ? record.on : ''}}</view>
                  <view class="flex-1">{{record.push !== null ? record.push : ''}}</view>
                </view>
              </view>

            </view>
            <view class="half-cell">
              <view class="flex-center h-74 half-hole-cell">
                <view class="tc">
                  <view class="op-5 fs-20 mb-5">{{name == '前九' ? 'OUT' : 'IN'}}</view>
                  <view class="fs-24 lh-1 op-5">{{parData[name]}}</view>
                </view>
              </view>
              <!-- /半场标准杆数 -->
              <view class="flex-center half-total-cell"
                    :style="{height: value.show ? '114rpx' : '74rpx'}">
                <view class="tc">
                  <view class="fs-32 lh-1 sub-color">{{scoreData[name] > 0 ? '+'  : ''}}{{scoreData[name]}}</view>
                </view>
              </view>
              <!-- /半场总分数 -->
            </view>
          </view>
        </view>

        <!-- E 前九 -->

        <!-- S 统计信息 -->
        <view>
          <view class="title-box flex-center">
            <text class="fs-20 op-5">统计信息</text>
          </view>
        </view>
        <view class="flex">
          <view class="flex1">
            <!-- E 统计信息 -->
              <view class="detail-content score-bg">
                <view class="score-item1 flex">
                  <view v-for="item in termList"
                        :key="item.label"
                        class="flex-center flex-1 item-text">
                    <text class="fs-20 op-5">{{item.label}}</text>
                  </view>
                </view>
                <view class="score-item2 flex">
                  <view v-for=" item in termList "
                        :key="item.label"
                        class="flex-center flex-1 term-score rubik-regular">
                    <text class="fs-32">{{competitor.record_count[item.value]}}</text>
                  </view>
                </view>
              </view>
                   
            <!-- S 推数 -->
            <view class="push-box mt-4">
              <view class="detail-content score-bg">
                <view class="score-item1 flex">
                  <view v-for="item in pushList"
                        :key="item.value"
                        class="flex-center item-text"
                        :class="[item.label == '标on率' ? 'flex2' : 'flex1']">
                    <text class="fs-20 op-5">{{item.label}}</text>
                  </view>
                </view>
                <view class="score-item2 flex">
                  <view v-for=" item in pushList "
                        :key="item.value"
                        class="flex-center term-score rubik-regular"
                        :class="[item.label == '标on率' ? 'flex2' : 'flex1']">
                    
                      <template v-if="showPushFlag">
                        <text class="fs-32">
                          {{item.label == '标on率' ? abbreviating(competitor.push_count[item.value], 1) : competitor.push_count[item.value]}}
                        </text>
                        <text v-if="item.label == '标on率'">%</text>
                      </template>
                      <template v-else="showPushFlag">
                       <text class="fs-32 fw-400 op-2"> - </text>
                      </template>
                  </view>
                </view>
              </view>
            </view>
            <!-- E 推数 -->  
                             
            <!-- S 球道 -->
            <view class="push-box mt-4">
              <view class="detail-content score-bg">
                <view class="score-item1 flex">
                  <view v-for="item in fairwayList"
                        :key="item.value"
                        class="flex-center item-text"
                        :class="[item.label == '上球道率' ? 'flex2' : 'flex1']">
                    <text class="fs-20 op-5">{{item.label}}</text>
                  </view>
                </view>
                <view class="score-item2 flex">
                  <view v-for=" item in fairwayList "
                        :key="item.value"
                        class="flex-center term-score rubik-regular"
                        :class="[item.label == '上球道率' ? 'flex2' : 'flex1']">
                    
                      <template v-if="showfairwayFlag">
                        <text class="fs-32">
                          {{item.label == '上球道率' ? abbreviating(competitor.fairway_count[item.value], 1) : competitor.fairway_count[item.value]}}
                        </text>
                        <text v-if="item.label == '上球道率'">%</text>
                      </template>
                      <template v-else="showfairwayFlag">
                       <text class="fs-32 fw-400 op-2"> - </text>
                      </template>
                  </view>
                </view>
              </view>
            </view>
            <!-- E 球道 -->
            
          </view>
          <view class="flex-shrink-0 p-14 ">
            <image class="logo-img" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/logo.png" mode="widthFix" />
            <view class="fs-16 tc">扫码进入房间</view>
            <view style="width: 0; height: 0;border-width: 7rpx;border-style: solid;border-color:#95D171 transparent transparent transparent;margin: 5rpx auto;" />
            <view class="pr">
              <image :src="qrcode" class="qr" @load='finishLoad()' />
              <view class="wrapper" v-if="!finishLoadQr">
                   <view class="line1"></view>
                   <view class="line2"></view>
                   <view class="line3"></view>
                   <view class="line4"></view>
                   <view class="line5"></view>
                   <view class="line6"></view>
                   <view class="line7"></view>
                   <view class="line8"></view>
                   <view class="line9"></view>
                   <view class="line10"></view>
                   <view class="line11"></view>
                   <view class="line12"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- E 成绩明细 -->

    <!-- S 底部分享 -->
    
    <view class="share-box">
      <view class="fw-400 fs-28 tc">与好友分享喜悦</view>
      <view class="flex-between" style="align-items: unset;padding-top: 75rpx;">
        
        <view @click="savePic()">
          <image :src="`${ossUrl}/icons/btn_photo.png`"
                 class="icon-cell"
                 mode="aspectFit" />
          <view class="tc fw-400 fs-22">保存相册</view>
          <view  class="tc fw-400 fs-20 sub-color ">多种样式</view>
        </view>
<!--        <view @click="handleShareTimeLine()" class="pr">
          <image :src="`${ossUrl}/icons/btn_moment.png`"
                 class="icon-cell"
                 mode="aspectFit" />
          <view class="tc fw-400 fs-22">分享至朋友圈</view>
          <view class="bubble_frame" v-if="showTips">点击右上角分享至朋友圈</view>
        </view> -->
        <button  plain class="share-button" open-type="share">
          <image :src="`${ossUrl}/icons/btn_wechat.png`"
                 class="icon-cell"
                 mode="aspectFit" />
          <view class="tc fw-400 fs-22">分享至群聊</view>
        </button>
      </view>
    </view>
    <!-- E 底部分享 -->

  </view>
</template>

<script>
// 组件
import HoleCell from '@/pages/chat-room/index/components/hole-cell';
import recordCell from '@/pages/chat-room/index/components/record-cell';
// api
import { getCompetitorDetail } from '@/api/chat-room';
import { getWxQRCode } from '@/api/utils';

// vuex
import { mapGetters } from 'vuex';
import { formatDate, guid } from '@/utils'
import { PAGE_CHAT_SHARE_TYPE,  generatePageShareParamString, PAGES, shareCompetition } from '@utils/share';
import GAvatar from '@/components/g-avatar/g-avatar.vue';

const holeTitle = new Map([
  [0, '前九'],
  [1, '后九']
]);
export default {
  components: {
    HoleCell,
    recordCell,
    GAvatar
},
  data() {
    return {
      navTotalHeight: 20,
      ossUrl: this.$ossUrl,
      competitorDetail: {}, // 个人比赛详情
      // 半场总分数
      scoreData: {
        前九: 0,
        后九: 0
      },
      // 半场总杆数
      parData: {
        前九: 0,
        后九: 0
      },
      // 术语
      termList: [
        { value: 'Big-Eagle', label: '信天翁' },
        { value: 'Eagle', label: '老鹰' },
        { value: 'Birdie', label: '小鸟' },
        { value: 'Par', label: 'PAR' },
        { value: 'Bogey', label: '柏忌' },
        { value: 'Double-Bogey', label: '双柏忌' },
        { value: 'Big-Bogey', label: '打爆' }
      ],
      id: '', // 球员id
      // 推数
      pushList: [
        { value: 'All-Push', label: '推杆数' },
        { value: 'Push', label: '一推' },
        { value: 'Double-Push', label: '二推' },
        { value: 'Triple-Push', label: '三推' },
        { value: 'Big-Push', label: '超三推' },
        { value: 'On-Percent', label: '标on率' }
      ],
      fairwayList: [
        { value: 'Nice-On', label: '命中' },
        { value: 'Pull-Shot', label: '打左' },
        { value: 'Push-Out-Shot', label: '打右' },
        { value: 'Over-Swing', label: '打穿' },
        { value: 'Short', label: '打短' },
        { value: 'On-Percent', label: '上球道率' }
      ],
      qrcode: '',
      showTips: false,
      injectedShareId: guid(),
      finishLoadQr: false
    };
  },

  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      console.log("id of ", this.id)
      this.fetch();
    }

    const navigationBarBottom = uni.getSystemInfoSync().statusBarHeight + 44 ;
    console.log("navigationBarBottom", navigationBarBottom)
    this.navTotalHeight = navigationBarBottom;
  },

  computed: {
    ...mapGetters(['getTeeColorList']),
    // 球赛信息
    competition() {
      return this.competitorDetail.competition;
    },
    // 球员信息
    competitor() {
      return this.competitorDetail.competitor;
    },
    // 用户信息
    user() {
      let user = this.competitorDetail?.user || {}
      user.uid = user.uid || this.competitor?.uid;
      return user;
    },
    // tee颜色
    teeColor() {
      return this.getTeeColorList.find(
        (item) => item.value == this.competitor?.tee
      );
    },
    // 球分构造
    recordData() {
      let recordData = {};
      this.competition?.course_half_court_ids.map((court, cindex, array) => {
        let parTotal = 0; // 半场总杆数
        let scoreTotal = 0; // 半场总分数
        let show = false; // on/push 存在则显示
        // 结构是 {‘前九‘: {data: [{},{}], show: false},'后九': {data: [{},{}], show: false}}
        recordData[holeTitle.get(cindex)] = {
          data: this.competitor?.record.filter(
            (e) => e.course_half_court_id == court
          ),
          show: false
        };
        const len = cindex != 0 ? 9 : 0;
        recordData[holeTitle.get(cindex)].data.map((record) => {
          record.hole_no2 = record.hole_no + len;
          parTotal += record.par; // 计算 半场总杆数
          scoreTotal += record.score; // 计算 半场总分数
          if (record.push !== null || record.on !== null) {
            show = true;
          }
        });
        recordData[holeTitle.get(cindex)].show = show;
        this.parData[holeTitle.get(cindex)] = parTotal;
        this.scoreData[holeTitle.get(cindex)] = scoreTotal;
      });
      return recordData;
    },

    // 天气信息
    weatherData() {
      return this.competition?.weather;
    },
    // 天气日期
    weatherDate() {
      let dateArr = this.weatherData?.daytime.split('-') || [];
      return `${dateArr[1]}月${dateArr[2]}日`;
    },

    weatherText() {
      return `${this.weatherDate} · ${this.weatherData?.day_air_temperature}°C ～ ${this.weatherData?.night_air_temperature}°C ${this.weatherData?.day_weather}转${this.weatherData?.night_weather}`;
    },
    // 显示推杆数据 如果推杆数都为0则不显示
    showPushFlag() {
      let flag = this.pushList.some(
        (item) => this.competitor?.push_count[item.value] > 0
      );
      return flag;
    },
    cometitionStartTime() {
      const time = this.competition?.start_time
      return time ? formatDate(time, 'MM/dd hh:mm') : ''
    },
    showfairwayFlag() {
      let flag = this.fairwayList.some(
        (item) => this.competitor?.fairway_count[item.value] > 0
      );
      return flag;
    }
  },

  methods: {
    // 获取个人总成绩
    async fetch() {
      let params = {
        competitor_id: this.id,
        gl: false
      };
      let {
        data: { data }
      } = await getCompetitorDetail(params);
      this.competitorDetail = data;
      let { course_half_court_ids } = data.competition;
      this.competitorDetail.competition.course_half_court_ids =
        course_half_court_ids.split(',');
      this.getQrcode();
    },
    handleShare(method) {
      console.log(method)
      this.onShareTimeline()
      this.$options.methods[method](this.id) //在方法里拿不到this.id
    },
    handleBack() {
      // 判断是否有上一页
      let pages = getCurrentPages();
      if (pages.length > 1) {
        return uni.navigateBack();
      }
      uni.switchTab({
        url: '/pages/tabbar/home/index'
      });
    },
    gotoProfile() {
      uni.navigateTo({
        url: `/pages/tabbar/profile/UserProfile?uid=${this.competitor.uid}`,
        fail: (e) => {
          console.error(e);
        },
      })
    },
    savePic() {
      uni.navigateTo({
        url: `/pages/chat-room/personal-score/share/index?competitor_id=${this.id}`,
      });
    },
    async getQrcode() {
      const paramsStr = generatePageShareParamString(
        {
          page: PAGES.chat,
          params: [
            PAGES.invite,
            this.competitor.competition_id,
            this.competition.group_id,
            this.competitor.uid
          ]
        }
      );
      const res = await getWxQRCode({ scene: paramsStr, gl: false })
      if (typeof res.data === 'string') {
        this.qrcode = 'data:image/png;base64,' + res.data
      }
    },
    onShareAppMessage(res) {
      return this.pageSharing(res)
    },
    pageSharing(res) {
      const share = this.getTopPageInjectedShare();
      if (share) return share;
    
      return shareCompetition({
        id: this.competition.competition_id,
        group: this.competition.group_id,
        uid: this.competitor.uid,
        shareRoomName: this.competition.name,
        imageUrl: '',
      });
    },
    handleShareTimeLine() {
      let that = this
      that.showTips = true
      setTimeout(function() {
        that.showTips = false
      }, 2000);
    },
    finishLoad() {
      this.finishLoadQr = true
    },

    abbreviating(value, fixed = 1) {
      return Number(Number(value || 0).toFixed(fixed))
    },
  },
  onShareTimeline(res) {
    return this.pageSharing(res)
  },
};
</script>

<style lang="scss" scoped>
.mb-5 {
  margin-bottom: 5rpx;
}
.h-74 {
  height: 74rpx;
  box-sizing: border-box;
}

.root {
  height: 100vh;

  display: flex;
  flex-direction: column;
  background-color: #013d3e;
}
.nav {
  position: fixed;
  width: 100%;
}

// S 总成绩
.score-top {
  // height: 396rpx;
  padding: var(--nav-height) 0 28rpx 50rpx;
  box-sizing: border-box;
  background: #e4e4e4
    url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/pic_head.png')
    no-repeat center;
  background-size: 100%;
  // .shadow-box {
  //   background: #e4e4e4
  //     url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/bg-shadow2.png')
  //     no-repeat center;
  //   background-size: 100%;
  //   text-align: center;
  // }
  // 分数
  // .score-box {

  // }
  .score-num {
    font-size: 160rpx;
    line-height: 160rpx;
    color: #1c3f40;
    font-family: 'DINCond-Black';
  }
  .color-area {
    margin-right: 6rpx;
    // width: 22rpx;
    // height: 22rpx;
    width: 6rpx;
    height: 22rpx;
  }
  .avatar-box {
    margin-left: 14rpx;
    margin-right: 40rpx;
  }

  // tee颜色
  .tee-box {
    padding: 15rpx;
    &::before,
    &::after {
      display: block;
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 228rpx;
      height: 1px;
      background: linear-gradient(
        90deg,
        rgba(217, 217, 217, 0) 0%,
        #d9d9d9 25.34%,
        rgba(217, 217, 217, 0.458333) 77.65%,
        rgba(217, 217, 217, 0) 103.53%
      );
    }
    &::before {
      top: 0;
    }
    &::after {
      bottom: 0;
    }
    // .color-area {
    //   margin-right: 14rpx;
    //   // width: 22rpx;
    //   // height: 22rpx;
    //   width: 12rpx;
    //   height: 22rpx;
    // }
  }
  .linear-line {
    margin: 20rpx 0;
    height: 1rpx;
    background: linear-gradient(to right, rgba(210, 210, 210, 0) 0%, rgba(210, 210, 210, 0.5) 21.66%, #D2D2D2 98.13%);
  }
  // 文案信息
  .text-box {
    margin: 0 40rpx;
    float: right;
    color: #999999;
    letter-spacing: 2rpx;
  }
}
// E 总成绩

// S 成绩明细
.score-bottom {
  @include rubikVar();
  // 成绩明细
  .score-detail {
    color: $white;
    background: #003C3D;//linear-gradient(180deg, rgba(0, 60, 61, 0.8) 2.09%, #003C3D 64.81%);
    .title-box {
      height: 38rpx;
    }
    .detail-content {
      background-color: #1c504f;;
      //background-color: #013d3e;
    }
    // 球洞
    .hole-cell {
      box-sizing: border-box;
      //background: linear-gradient(180deg, #284a4c, #2d504f);
      background: #1c504f;
    }
    // 球分
    .record-cell {
      box-sizing: border-box;
      //background: linear-gradient(180deg, #416261, #3f6261);
      background: #2f6160;
    }
    // 半场
    .half-cell {
      flex: 0 0 103rpx;
      width: 103rpx;
      // height: 100%;
    }
    .half-hole-cell {
      box-sizing: border-box;
      background: linear-gradient(180deg, #2c4f4e, #3b6053);
    }
    .half-total-cell {
      height: 114rpx;
      box-sizing: border-box;
      background: linear-gradient(180deg, #517465, #64886d);
    }
    .boder-t {
      // border-top: 1px solid rgba(255, 255, 255, 0.01);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .mt-4 {
      margin-top: 4rpx;
    }
    .score-bg {
      background: #1c504f;
    }
    .score-item1 {
      //background: #294f4f;
      // height: 36rpx;
      height:36rpx;
      // border-bottom: 1px solid rgba($color: $white, $alpha: 0.1);
      .item-text {
        height: 100%;
        align-items: flex-end;
        border-right: 1px solid rgba($color: $white, $alpha: 0.2);
        &:last-child {
          border-right: none;
        }
      }
    }
    .score-item2 {
      // padding: 8rpx 0;
      //background: #3c6060;
      height: 54rpx;
      box-sizing: border-box;
      .term-score {
        height: 100%;
        border-right: 1px solid rgba($color: $white, $alpha: 0.2);
        &:last-child {
          border-right: none;
        }
      }
    }
    .gan-score {
      padding: 0 10rpx;
      // border-top: 1px solid rgba(255, 255, 255, 0.1);
      height: 40rpx;
      box-sizing: border-box;
    }
  }
}
// E 成绩明细

// S 底部分享
.share-box {
  flex: 1;
  color: $white;
  padding: 65rpx 210rpx 0 210rpx;
  background-color: #1A2828;
  padding-bottom: calc(31rpx + env(safe-area-inset-bottom));
  .icon-cell {
    display: block;
    width:120rpx;
    height:120rpx;
    margin: 0 auto;
  }
}
.logo-img {
  display: block;
  width: 111rpx;
  margin: 0 auto 8rpx auto;
}
.fs-16 {
  font-size: 16rpx;
}
.qr {
  display: block;
  width: 134rpx;
  height: 134rpx;
  border-radius: 50%;
}
.p-14 {
  padding: 14rpx 14rpx;
}
.share-button {
  color: unset;
  padding: unset;
  margin: unset;
  background: unset;
  border: unset;
  line-height: unset;
}
.bubble_frame {
  font-size: 20rpx;
  word-break: keep-all;
  color: #333333;
  padding: 20rpx 12rpx;
  background: #FFFFFF;
  position: absolute;
  top: 154rpx;
  left: -50rpx;
  border-radius: 12rpx;
  z-index: 10;
  box-shadow: 1rpx 1rpx 4rpx 4rpx #E4E4E4;
 
}
.bubble_frame:before{
  position: absolute;
  top: -10rpx;
  left: 110rpx;
  content: '';
  width: 20rpx;
  height: 20rpx;
  background: #FFFFFF;
  transform: rotate(135deg);
  box-shadow:0rpx 0rpx 0rpx 0rpx #E4E4E4;
}
.bubble_frame:after{
  position: absolute;
  top: 1rpx;
  left: 40rpx;
  content: '';
  width: 66rpx;
  height: 16rpx;
  background: #FFFFFF;
}
// E 底部分享

@-webkit-keyframes loading {
   from {opacity:1;width:5rpx;height:20rpx;}
   to {opacity: 0.25;width:5rpx;height:20rpx;}
 }
 .wrapper {
   position: absolute;
   top:50%;
   left:50%;
   display: inline-block;
   zoom: 0.4; /*通过修改这个值(值的区间为0-1)的大小来设置菊花的大小*/
 }
 .wrapper view {
   width:3rpx;
   height:16rpx;
   background: #a4a2a4;
   position: absolute;
   left: 100%;
   top: 100%;
   opacity:1;
 
   -webkit-animation: loading 1.2s linear infinite;
 }
 .wrapper .line1 {-webkit-transform:rotate(0deg) translate(0, -34px); -webkit-animation-delay: 0s;}
 .wrapper .line2 {-webkit-transform:rotate(30deg) translate(0, -34px); -webkit-animation-delay: 0.1s;}
 .wrapper .line3 {-webkit-transform:rotate(60deg) translate(0, -34px); -webkit-animation-delay: 0.2s;}
 .wrapper .line4 {-webkit-transform:rotate(90deg) translate(0, -34px); -webkit-animation-delay: 0.3s;}
 .wrapper .line5 {-webkit-transform:rotate(120deg) translate(0, -34px); -webkit-animation-delay: 0.4s;}
 .wrapper .line6 {-webkit-transform:rotate(150deg) translate(0, -34px); -webkit-animation-delay: 0.5s;}
 .wrapper .line7 {-webkit-transform:rotate(180deg) translate(0, -34px); -webkit-animation-delay: 0.6s;}
 .wrapper .line8 {-webkit-transform:rotate(210deg) translate(0, -34px); -webkit-animation-delay: 0.7s;}
 .wrapper .line9 {-webkit-transform:rotate(240deg) translate(0, -34px); -webkit-animation-delay: 0.8s;}
 .wrapper .line10 {-webkit-transform:rotate(270deg) translate(0, -34px); -webkit-animation-delay: 0.9s;}
 .wrapper .line11 {-webkit-transform:rotate(300deg) translate(0, -34px); -webkit-animation-delay: 1.0s;}
 .wrapper .line12 {-webkit-transform:rotate(330deg) translate(0, -34px); -webkit-animation-delay: 1.1s;}
</style>
