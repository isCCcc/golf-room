<template>
  <view class="borad-wrapper col-white trans"
        id="borad-wrapper">
    
    <!-- 顶部通用背景 -->
    <view class="bg-top-common" :style="{ height: `${miniScoreBoardMaxY || 100}px`}" />
    
    <!-- position relatvie 包裹 -->
    <view class="pr"> 
    
    <view id="top-part">
      <!-- S 自定义bar -->
      <uni-nav-bar statusBar
                   backgroundColor="transparent"
                   :border="false"
                   :leftIcon="true"
                   :leftWidth="'32px'"
                   :rightWidth="'87px'"
                   color="#fff"
                   @clickLeft="handleBack">
        <view class="flex-center back-arrow"
              slot="left">
          <image :src="`${ossUrl}/icons/ico_back.png`"
                 class="icon-back"
                 mode="widthFix" />
        </view>
        <view class="w-auto nav-title-container">
          <view class="nav-center-part" @click="copyRoomNum">
            <view class="fs-30 fw-bol text-over" :style="{ lineHeight: '100%' }">{{ '房间号:' + (competitionData.competition_no || '') }}</view>
            <view class="copy-btn"></view>
          </view>
          <view class="fs-24 text-over" :style="{ lineHeight: '109%' }">{{ courseName || '' }}</view>
        </view>
      </uni-nav-bar>
      <!-- E 自定义bar -->
      <ScoreboardSummaryBar :userInfo="userInfo"
                            :competitionData="competitionData"
                            :competitionStatus="competitionStatus"
                            :watcherListData="watchListData"
                            :watcherTotal="watcherTotal"
                            :curGroup="isNowGroup"
                            :role="thisRole"
                            :selfCompetitor="selfCompetitor"
                            :wholeFlag="wholeFlag"
                            @more="handleMore"
                            @groupSelected="handleClickGroup"
                            @wholeRank="handleRankModal"
                            @watchers="handleShowWatcherModal" />
    </view>
    


    <!-- S 展开的计分板 -->
    <view v-show="!toggle" key="expand" class="trans expend-score-table"
          :style="{height: expendTableHeight}">
      <!-- S 计分板 -->
      <view class="table-wrapper fs-20 flex trans"
            :style="{height: `${tableHeight}rpx`}">
        <!-- v-if="competitorList.length" -->
        <!-- S 左边 -->
        <view class="table-left">
          <view class="left-th-cell flex">
            <view>
              <view class="sub-color mb-10">HOLE</view>
              <view class="op-5 lh-1">PAR</view>
            </view>
          </view>
          <view v-for="com in competitorList"
                :key="com.competitor_id"
                class="left-td-cell pr flex"
                :class="{'h-110':com.showPush}"
                @click="handleShowModal('teeModal',com)">
            <view class="pr">
              <view class="flex">
                <GAvatar class="table-avatar"
                  :avatar-data="com"
                  :size-in-rpx='44'
                  :radius="'100%'"
                  :handle-click="false" />
                <view class="score-wrapper">
                  <view class="ml-22 fs-28 rubik">{{ com.total_score }}</view>
                </view>
              </view>
              <view class="mt-4 mr-8 text-over fs-20 fw-400" :style="{color: 'rgba(255, 255, 255, 0.7)'}">{{ com.username }}</view>
            </view>
            <view class="tee-wrapper"
                  :style="{backgroundColor: teeColor(com.tee)}"></view>
          </view>
        </view>
        <!-- E 左边 -->

        <!-- S 右边 -->
        <view class="table-right-wrapper"
              id="table-right-wrapper"
              catchtouchmove="return">
          <scroll-view scroll-x
                       class="table-right-content"
                       :scroll-with-animation="true"
                       :scroll-left="rightTableScrollLeft"
                       @scroll="rightTableScrollViewScroll">
            <!-- <view class="table-right-content"> -->
            <!-- S 球洞编号 -->
            <view class="right-th-wrapper flex">
              <view class="flex"
                    v-for="(court,cindex) in holeList"
                    :key="cindex">
                <view class="right-th-cell flex-center"
                      v-for="(hole,hindex) in court.grCourseHole"
                      :key="hindex"
                      :id="`hole-cell-${hole.course_half_court_id}-${hole.hole_no}`">
                  <HoleCell :hole="hole" />
                </view>
                <view class="right-th-cell flex-center th-half">
                  <view class="tc">
                    <view class="hole-no op-5">
                      <text>{{cindex > 0 ? 'IN' : 'OUT'}}</text>
                    </view>
                    <view class="fs-28 lh-1 op-5">{{court.totalPar}}</view>
                  </view>
                </view>
              </view>
              <view class="right-th-cell flex-center th-diff">
                <view class="tc">
                  <view class="hole-no op-5">
                    <text>总差</text>
                  </view>
                  <view class="op-5 fs-28 lh-1">0</view>
                </view>
              </view>
              <view class="right-th-cell flex-center th-total-score">
                <view class="tc sub-color">
                  <view class="hole-no">
                    <text>总杆</text>
                  </view>
                  <view class="fs-28 lh-1">{{competitionData.total_score}}</view>
                </view>
              </view>
            </view>
            <!-- E 球洞编号 -->

            <!-- S 洞分 -->
            <view v-for="(com,cindex) in competitorList"
                  :key="com.competitor_id"
                  class="flex right-tr-cell"
                  :class="{'h-110':com.showPush}">
              <view class="flex-center right-td-cell pr"
                    :class="[record.unusual?'unusual':'', com.showPush ? 'unset-flex-center right-td-push' : '']"
                    v-for="(record,rindex) in com.record"
                    :key="record.competition_record_id"
                    @click="handleSetGanModal(record,rindex,com.competitor_id)">
                <template v-if="record.type === 'half'">
                  <view class="flex-center w-auto h-auto"
                        :class="[`td-half-${cindex}`]">
                    <view class="fs-32 col-sub">
                      {{record.totalHalfScore > 0 ? '+' : ''}}{{ record.totalHalfScore }}
                    </view>
                  </view>
                </template>
                <template v-else>
                  <!-- S loading -->
                  <view style="height: 18rpx;" v-if="com.showPush"/>
                  <view class="dots-loading"
                        v-if="record.loading">
                    <view class="dots-view"></view>
                    <view class="dots-view"></view>
                    <view class="dots-view"></view>
                  </view>
                  <!-- E loading -->
                  <RecordCell :record="record"
                              :showPush="com.showPush"
                              v-else />
                </template>

              <view v-if="com.showPush && record.push!==null && record.type !== 'half'" 
                  class="flex fs-28 rubik-regular push-box">
                <view class="flex-1">{{record.par + record.score - record.push}}</view>
                <view class="flex-1 ml-20">{{record.push}}</view>
              </view>
              </view>
              <!-- S 总差 -->
              <template>
                <view class="flex-center right-td-cell"
                      :class="[com.showPush && record.push?'right-td-push':'']"
                      @click="handleSetGanModal(null,null,com.competitor_id)">
                  <view class="flex-center w-auto h-auto"
                        :class="[`td-diff-${cindex}`]">
                    <view class="fs-30 col-sub">
                      {{com.totalDiff > 0 ? '+' : ''}}{{com.totalDiff === null ?  '' : com.totalDiff}}
                    </view>
                  </view>
                </view>
              </template>
              <!-- E 总差 -->

              <!-- S 总杆 -->
              <template>
                <view class="flex-center right-td-cell"
                      :class="[com.showPush && record.push?'right-td-push':'']"
                      @click="handleSetGanModal(null,null,com.competitor_id)">
                  <view class="flex-center w-auto h-auto td-total-score" id="td-total-score">
                    <view class="fs-30" :class="{ 'op-5': com.totalFlag == false}">
                      {{com.total_score}}
                    </view>
                  </view>
                </view>
              </template>
              <!-- E 总杆 -->
              
            </view>
            <!-- E 洞分 -->

            <!-- </view> -->
          </scroll-view>
        </view>
        <!-- E 右边 -->
      </view>
      <!-- E 计分板 -->
    </view>
    <!-- E 展开的计分板 -->

    <MiniScoreboard v-show="toggle"
                    key="mini"
                    class="trans over-hid mini-scoreboard-root"
                    :competitorList="competitorList"
                    @onClick="handleTool"
                    id="mini-scoreboard" />

    <!-- 天气预报 -->
    <WeatherNotice :weatherData="weatherData"
                    :beginDisplayTime="weatherBeginDisplayTime"
                    :name="competitionData.competition_name"
                    :startTimeStr="startTime"/>
    <!-- 工具栏 -->
    <ScoreboardTool v-show="!toggle" :isSelfCompetitor="isSelfCompetitor" @onClick="handleTool" />
      
    <!-- 展开盒子 -->
    <view v-show="toggle" class="fs-20 toggle-box tc flex-center" @click="handleTool('toggle', undefined)">
      展开记分卡
      <image src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/icon-arrow2.png" mode="widthFix" class="icon-arrow"/>
    </view>

    <!-- /收起计分板 -->
    <SetGanModal ref="setGanModal"
                 @update="updateScore"
                 :user-info="userInfo"
                 :isSelfCompetitor="isSelfCompetitor" />
    <!-- /设置分数 -->
    <TeeModal ref="teeModal"
              :user-info="userInfo"
              :isSelfCompetitor="isSelfCompetitor" />
    <!-- /修改tee颜色 -->
    <WholeRankModal ref="wholeRankModal"
                    @onClose="wholeFlag = false"
                    :competitionId="competitionData.competition_id || 0" />
    <!-- /总成绩 -->
    <WatcherModal ref="watcherModal" />
    <!-- /观众列表 -->

    <!-- 添加球手 -->
    <Friends ref="setFriendsModal" @confirm="setCompetitors()" />
    
    <SortCompetitors ref="setCompetitorSort" @confirm="setCompetitors()" v-if="handleType=='sortCompetitorsHT'"/> <!-- 用v-if控制销毁组件，否则第二次打开组件拖拽的时候会报错 -->
    
    <!-- 结束球赛 -->
    <uni-popup
      ref="finishCompetiton"
      type="center">
    		<view class="finish-container">
          <image class="finish-head" src="http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/finish-head.png" mode="aspectFill"/>
          <view class="finish-content bg-white">
            已完成本场比赛全部成绩的记录，是否确认结束球局？
          </view>
          <view class="bg-white flex">
            <view class="flex-1" />
            <view class="flex mb-40 mr-40">
              <view class="finish-button mr-26" @click="handleFinish">结束球局</view>
              <view class="not-finish-button" @click="this.$refs.finishCompetiton.close()">暂不结束</view>
            </view>
          </view>
        </view>
    </uni-popup>
    <!-- /position relatvie 包裹 -->  
    </view> 
  </view>
</template>

<script>
// 组件
import ScoreboardSummaryBar from '@/pages/chat-room/index/components/scoreboard-summary-bar.vue';
import SetGanModal from '@/pages/chat-room/index/components/set-gan-modal';
import TeeModal from '@/pages/chat-room/index/components/tee-modal';
import WholeRankModal from '@/pages/chat-room/index/components/whole-rank-modal';
import WeatherNotice from '@/pages/chat-room/index/components/weather-notice';
import ScoreboardTool from '@/pages/chat-room/index/components/scoreboard-tool';
import HoleCell from '@/pages/chat-room/index/components/hole-cell';
import RecordCell from '@/pages/chat-room/index/components/record-cell';
import MiniScoreboard from '@/pages/chat-room/index/components/mini-scoreboard';
import WatcherModal from '@/pages/chat-room/index/components/watcher-modal';
import Friends from '@pages/chat-room/add-room/components/friends/index.vue';
import SortCompetitors from '@pages/chat-room/add-room/edit-competitor/components/sort-competitors.vue';
// vuex
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import { mutationsTypes } from '@/store/modules/chat-room/types.js';
import { actionsTypes } from '@/store/modules/chat-room/types.js';

// api
import {
  updateCompetitionScore,
  finishCompetition,
  resetFinish,
  getWatchList
} from '@/api/chat-room';

import { caddieSave, updCompetition } from '@api/competition';
// utils
import {
  detailData,
  calcRecord,
  checkInfoChange,
  handleDelCompetitor
} from '../utils';
import { checkScore, pushTask } from '@utils/error-task/index';
import { toNumber } from '@utils/third/tools';
import { PAGE_CHAT_SHARE_TYPE, shareCompetitionInvite } from '@/utils/share';
import GAvatar from '@/components/g-avatar/g-avatar.vue';
import { awaitWrap, throttle } from '@/utils/function-helper';
import uniPopup from '@/components/uni-popup/uni-popup';
import { toInviteCaddie } from '@/utils/router';


export default {
  components: {
    ScoreboardSummaryBar,
    SetGanModal,
    TeeModal,
    WholeRankModal,
    WeatherNotice,
    ScoreboardTool,
    HoleCell,
    RecordCell,
    MiniScoreboard,
    WatcherModal,
    Friends,
    SortCompetitors,
    GAvatar
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
      translate: 0,
      translateDuration: undefined,
      holeInfo: {}, // 球洞信息
      wholeFlag: false, // 总分flag
      toggle: false, // 收起

      throttledGettingCompetitionData: null,

      throttledGettingWatchData: null,
      watchListData: undefined, // 观众列表数据，请求回来的数据，undefined 表示没有经过请求，请求失败设置为空数组
      watcherTotal: undefined, // 观众总数
      miniScoreBoardMaxY: undefined, // mini score board 高低
      groupListAniShow: false,
      groupListAniData: {}, //

      rightTableScrollLeft: 0,
      rightTableScrollLeftOld: 0,

      /**
       * 天气滚动动画开始时间，用于同步不同位置组件的动画进度
       */
      weatherBeginDisplayTime: new Date().getTime(),
      formatCompetitonInfo: [],
      handleType:'',
      showPushCount: 0,
      notShowPushCount: 0
      
    };
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo, //用户信息
      imInfo: (state) => state.flooim.imInfo,
      competitionData: (state) => state.chatRoom.competitionData, // 球局信息
      keyboardHeight: (state) => state.app.keyboardHeight,
      groupId: (state) => state.chatRoom.groupId, // 群组id
      isNowGroup: (state) => state.chatRoom.isNowGroup, // 当前操作的组
    }),
    ...mapGetters(['getTeeColorList']),
    // 球场名称
    courseName() {
      if (this.competitionData.course_half_court_count > 2) {
        let { course_name, hole_list } = this.competitionData;
        let names = hole_list?.map((e) => e.half_court_name);
        return `${course_name}·${names?.join('&')}`;
      }
      return this.competitionData.course_name;
    },
    // 球洞信息
    holeList() {
      return this.competitionData.hole_list;
    },
    /** 球员信息（注意⚠️：是当前分组的球员） */
    competitorList() {
      const group = this.competitionData?.group_list?.includes(this.isNowGroup) ? this.isNowGroup : "A"
      
      let pushCount = 0;
      let noPushCount = 0;
      
      let list =
        this.competitionData?.competitor_list?.filter(
          (item) => {
            
            if (item.group === group) {
              let showPush = item?.record.some(
                (ritem) => ritem.push !== null && ritem.type != 'half'
              );
              
              item.showPush = showPush
              
              item.showPush ? pushCount += 1 : noPushCount += 1
            }
            
            return item.group === group
          } 
        ) || [];
        
        this.showPushCount = pushCount
        this.notShowPushCount = noPushCount
        
      return list;
    },
    caddieList() {
      const group = this.competitionData?.group_list?.includes(this.isNowGroup) ? this.isNowGroup : "A"
      let list =
        this.competitionData?.caddie_briefs?.filter(
          (item) => item.group === group
        ) || [];
      return list;
    },
    // 开始时间
    startTime() {
      return this.competitionData?.start_time;
    },
    // 天气信息
    weatherData() {
      return this.competitionData.weather;
    },
    // 会员tee颜色
    teeColor() {
      return function (tee) {
        let teeTarget = this.getTeeColorList.find((e) => e.value == tee);
        return (teeTarget && teeTarget.color) || 'transparent';
      };
    },
    // 球局进行中
    competitionStatus() {
      let list = ['未开始', 'LIVE', '已结束'];
      return list[this.competitionData.status];
    },
    // 本人是否是参赛人员
    isSelfCompetitor() {
      return !!this.selfCompetitor;
    },
    isSelfCaddie() {
      return !!this.selfCaddie;
    },
    // 当前用户角色 0是创建者,1是球局成员,2是观赛者，3是球童
    thisRole() {
      if (this.competitionData.uid == this.userInfo.uid) return 0;
      if (this.isSelfCompetitor) return 1;
      if (this.isSelfCaddie) return 3;
      return 2;
    },
    // 参赛人员信息(自己)
    selfCompetitor() {
      let target = this.competitorList.find(
        (item) => item.uid === this.userInfo.uid
      );
      return target;
    },
    selfCaddie() {
      let target = this.caddieList?.find(
        (item) => item.uid === this.userInfo.uid
      );
      return target;
    },

    // 计分表高度
    tableHeight() {
      return this.competitorList?.length
        ? this.showPushCount * 110 + this.notShowPushCount * 100 + 83
        : 0;
    },
    expendTableHeight() {
      return this.tableHeight + 54 + 94;
    }
  },
  watch: {
    // 比赛成员变化，重新获取高度
    competitorList() {
      // console.log('competitorList', this.competitorList);
      this.getScoreboardHeight();
    },

    // 聊天状态,重新获取高度
    keyboardHeight() {
      this.getScoreboardHeight();
    },

    // 记分板变化,重新获取高度
    toggle() {
      this.getScoreboardHeight();
    },
  },

  mounted() {
    // 进入输入状态，计分板收起来
    this.onGREvent('inputHeightChange', (inputHeight, focusing) => {
      this.toggle = focusing;
    });
    this.addIMListeners();

    this.weatherBeginDisplayTime = new Date().getTime();
  },
  updated() {
    if (this.miniScoreBoardMaxY == undefined) { 
      this.getMiniScoreBoardMaxY();
    }
  },
  destroyed() {
    console.log('出发菏泽=');
    this.SET_COMPETITION_DATA({}); // 清空vuex球局信息
    // this.removeIMListeners(); // 清空监听
  },

  methods: {
    ...mapMutations([
      mutationsTypes.SET_COMPETITION_ITEM,
      mutationsTypes.SET_SCOREBOARD_HEIGHT,
      mutationsTypes.SET_COMPETITION_DATA,
      mutationsTypes.SET_ADD_LOCAL_MESSAGE
    ]),
    ...mapActions({
      UPDATE_CUR_GROUP: actionsTypes.UPDATE_CUR_GROUP,
      GET_USERS_IM_ID: actionsTypes.GET_USERS_IM_ID,
      GET_COMPETITION_DETAIL: actionsTypes.GET_COMPETITION_DETAIL,
      GET_PK_INFO: 'GET_PK_INFO'
    }),
    // 获取围观列表
    async getWatchList({ start = 0, count = 10, competition_id}) {
      let params = {
        start: start,
        count: count,
        competition_id: competition_id || this.competitionData.competition_id
      };
      let { data } = await getWatchList(params);
      this.watchListData = data?.data?.list || []; // 空数组，防止请求失败，导致数据不完全，显示异常
      this.watcherTotal = data?.data?.total || this.watchListData.length;
    },


    throttledGetCompetitionData() {
      if (this.throttledGettingCompetitionData == null) {
        const scope = this
        const getting = async ({ competition_id }) => {
          this.GET_COMPETITION_DETAIL({ competition_id: competition_id });
        }
        this.throttledGettingCompetitionData = throttle(getting, 5 * 1000, false);
      }
      this.throttledGettingCompetitionData({ competition_id: this.competitionData?.competition_id })
    },

    throttledGetWatchList({ start = 0, count = 10, competition_id }) {
      if (this.throttledGettingWatchData == null) {
        const scope = this
        const getting = async ({ start, count, competition_id }) => {
          scope.getWatchList({ start, count, competition_id })
        }
        this.throttledGettingWatchData = throttle(getting, 10 * 1000, false);
      }
      this.throttledGettingWatchData({ start, count, competition_id })
    },

    // 查看观众列表
    handleShowWatcherModal() {
      this.$refs.watcherModal.open({ id: this.competitionData.competition_id });
    },

    // 处理工具库事件
    handleTool(type, extra) {
      switch (type) {
        case 'toggle':
          this.toggle = !this.toggle;
          this.getScoreboardHeight();
          this.getMiniScoreBoardMaxY();
          break;

        case 'toggleAdd':
          if (this.competitorList.length >= 4) { // 满员，去编辑页面
            this.handleModifyCompetitors(false)
          } else {
            this.handleAddCompetitors();
          }
          break;

        case 'toggleScreen':
          uni.navigateTo({
            url: '/pages/chat-room/landscape/index'
          })
          break;
		
        case 'ad':
          if (extra?.wxmp && extra.wxmp.id) {
            uni.navigateToMiniProgram({
              appId: extra.wxmp.id,
              path: extra.wxmp.path || '',
              success: (result) => {
                console.log('navigateToMiniProgram success', result);
              },
              fail: (error) => {
                console.log('navigateToMiniProgram failed', error);
              }
            })
          }
          break;

        default:
          break;
      }
    },

    // 开始im的信息监听
    addIMListeners() {
      if (!this.imInfo) return false;
      console.log('开始监听聊天室内的变化～scoreboard');
      this.onGREvent('im_onRosterMessage', this.onRosterMessage())

      // 群（聊天室）成员列表更新
      this.onGREvent('im_onGroupMemberChanged', (groupId) => {
        // 是同一个组（球赛），球赛状态不为进行中（没有了球赛数据推送），则尝试刷新观众人数。
        if (Number(groupId) === Number(this.group_id) && this.status != 1) {
          this.throttledGetWatchList();
        }
      })
    },
    onRosterMessage() {
      let _this = this;
      return function (meta) {
        const targetGroupId = toNumber(_this.groupId);

        let ext = {}
        try {
          ext = JSON.parse(meta.ext);
        } catch (error) {
          // console.error('Failed to parse content', error);
        }

        if (ext.to_group_id != null && targetGroupId === toNumber(ext.to_group_id) && ext.msg_type != null) {
          // Convert to local message
          meta.orig_type = meta.type;
          meta.type = 'local_msg';
          meta.orig_timestamp = meta.timestamp;
          meta.timestamp = new Date().getTime(); // 推送消息可能会延迟，导致消息在中间蹦出来，设置为当前时间来防止。
          _this.SET_ADD_LOCAL_MESSAGE(meta);
          return;
        }

        let content = {}
        try {
          content = JSON.parse(meta.content);
        } catch (error) {
          // console.error('Failed to parse content', error); 
        }

        // console.log('meta-scoreboard-onRosterMessage', content);

        // const toUid = toNumber(meta.to);
        const groupId = toNumber(content.group_id);
        if (groupId === targetGroupId) {
          const nowTimestamp = new Date().getTime()
          
          // 系统消息处理
          if (content.is_system) {
            // 修改球局状态
            let finishFlag = content.competition_finish;
            finishFlag && _this.statusFinish(finishFlag);

            // 定时推送的detail信息
            let details = content.competition_detail;
            if (toNumber(meta.timestamp) > (nowTimestamp - 20 * 1000)) { // 仅处理 20 秒内的详情推送，避免在后台过久，消息堆叠过多，
              details && _this.getChatRoomDetails(details);
            }

            // // 为了避免 detail 信息的巨大数据，改成收到 competition_detail_notice, 自己拉数据更新。顺便做个 throttle。
            // let notice = content.competition_detail_notice;
            // if (notice && toNumber(meta.timestamp) > (nowTimestamp - 20 * 1000)) { // 仅处理 20 秒内的详情推送，避免在后台过久，消息堆叠过多，
            //   _this.throttledGetCompetitionData();
            // }

            // 观看总人数
            let competitionWatcherCount = content.competition_watcher_count;
            if (competitionWatcherCount != null && _this.watcherTotal != competitionWatcherCount) { // 观看总人数变化，刷新观赛者数据
              _this.throttledGetWatchList({competition_id: _this.competitionData.competition_id});
            }
          }
        }

        if (content.group_id && content.is_system) {
          /**
           * 尝试删除推送的消息，防止消息过多，特别现在推送的比赛详情，导致 SDK 本地缓存数据过多，导致问题
           * 2023-03-03 17:48:39.701 [error] stringify error: Error: APP-SERVICE-SDK:setStorageSync:fail exceed storage max size 10Mb
           */
          setTimeout(() => {
            _this.imInfo.rosterManage.readRosterMessage(meta.from, meta.id);
            _this.imInfo.rosterManage.deleteMessage(meta.from, meta.id);
          }, 0);
        }
      };
    },
    // 更新details数据
    getChatRoomDetails(data) {
      
      // const checkVal = checkInfoChange(this.competitionData, newData);

      detailData(data);

      // 重新计算分数
      calcRecord(data, [])

      this.SET_COMPETITION_DATA(data);
    },
    // 复制房间号
    copyRoomNum() { 
      uni.setClipboardData({
        data: this.competitionData.competition_no + '',
        success: (result) => {
          uni.showToast({ title: "复制成功", icon: 'success'})
        },
        fail: (error) => {
          uni.showToast({ title: "复制失败", icon: 'error'})
          console.log("复制", error);
        }
      })
    },
    // 获取计分板高度
    getScoreboardHeight() {
      setTimeout(() => {
        this.$nextTick(() => {
          const query = uni.createSelectorQuery().in(this);
          query
            .select('#borad-wrapper')
            .boundingClientRect(({ height }) => {
              //console.log('获取计分板高度', height);
              this.SET_SCOREBOARD_HEIGHT(height);
            })
            .exec();
        });
      }, 300);
    },
    // 获取 mini score board 的最大高度，用于背景图的拉伸
    getMiniScoreBoardMaxY() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('#top-part')
          .boundingClientRect(({ height }) => {
            this.miniScoreBoardMaxY = height + 61 * uni.getSystemInfoSync().screenWidth / 375; // 一开始 mini score board 没有展示，我们写一个固定值作为其高度
          })
          .exec();
      });
    },
    // 修改球赛状态
    statusFinish(dataSource) {
      if (this.competitionData.competition_id == dataSource.competition_id) {
        this.changeStatus(2);
      }
    },
    // 撤销球局状态
    changeStatus(data) {
      this.SET_COMPETITION_ITEM({ key: 'status', data });
    },

    // 总分板弹窗
    handleRankModal() {
      this.wholeFlag = true;
      let { competition_name, course_name, total_score, competition_no } = this.competitionData;
      let data = {
        competition_name,
        course_name,
        total_score,
        competition_no
      };
      this.handleShowModal('wholeRankModal', data);
    },
    // 更多操作
    handleMore({ type }) {
      switch (type) {
        case 'report':
          break;
        case 'end': // 结束比赛
          this.handleFinish();
          break;
        case 'out': // 退出比赛
          this.handleOut();
          break;
        case 'cancel':
          this.handleCancel();
          break;
        case 'edit': // 编辑球局
          uni.navigateTo({
            url: `/pages/chat-room/add-room/index?from=scoreboard&id=${this.competitionData.competition_id}&no=${this.competitionData.competition_no}&type=edit`
          });
          break;
        
        case 'share':
          const data = this.competitionData
          const params = {
            id: data.competition_id,
            no: data?.competition_no,
            group: data?.group_id,
            time: data?.start_time,
            course: data?.course_name,
            course_id: data?.course_id,
            type: PAGE_CHAT_SHARE_TYPE.share,
            uid: this.userInfo.uid,
            shareRoomName: data?.competition_name,
          }
          uni.navigateTo({
            url: `/pages/chat-room/add-room/share/index?params=${encodeURIComponent(
              JSON.stringify(params)
            )}`,
          })
          break;
          
        case 'addCompetitors': //添加球员
          this.handleAddCompetitors();
          break;
          
        case 'sortCompetitors': //球员排序
          this.handleModifyCompetitors(true);
          break;

        case 'inviteCaddie': // 邀请球童
          const uid = this.userInfo.uid
          toInviteCaddie({
            fUid: uid,
            cid: this.competitionData.competition_id,
            group: this.selfCompetitor?.group,
            toast: true
          });
          break;

        case 'exitCaddie': // 退出球童身份
          this.exitCaddie();
          break;

        default:
          break;
      }
    },
    // 撤销球局结束
    handleCancel() {
      uni.showModal({
        title: '撤销结束球局确定',
        content: '球局将会恢复成进行中状态',
        cancelText: '暂不撤销',
        confirmText: '撤销',
        confirmColor: '#003C3D',
        success: async (res) => {
          if (res.confirm) {
            console.log('用户点击确定');
            await resetFinish({
              competition_id: this.competitionData.competition_id
            });
            this.changeStatus(1);
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    // 结束比赛
    handleFinish() {
      uni.showModal({
        title: '结束比赛确定',
        content: '结束后比赛成绩将不可修改',
        cancelText: '暂不结束',
        confirmText: '结束',
        confirmColor: '#FF6A6A',
        success: async (res) => {
          if (res.confirm) {
            console.log('用户点击确定');
            await finishCompetition({
              competition_id: this.competitionData.competition_id
            });
            this.changeStatus(2);
            this.$refs.finishCompetiton.close();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    // 杆数弹窗
    handleSetGanModal(record, rindex, competitor_id) {
      if (this.competitionStatus === '未开始') {
        return uni.showToast({
                title: "比赛未开始，若提前开球，请修改比赛时间。",
                icon: "none",
                duration: 2500,
              });
      }
      if (this.competitionStatus === '已结束') {
        uni.navigateTo({
          url: `/pages/chat-room/personal-score/index?id=${competitor_id}`
        });
        return false;
      }
      if (!record) return false;
      // 找出球场
      let halfCourt =
        this.holeList.find(
          (item) => item.course_half_court_id == record.course_half_court_id
        ) || {};
      let holeInfo = halfCourt.grCourseHole.find(
        (item) => item.hole_no === record.hole_no
      );
      this.handleShowModal('setGanModal', {
        holeInfo,
        competitorList: [...this.competitorList],
        recordIndex: rindex,
        competitor_id
      });
    },

    // 更换分数
    async updateScore(list, recordIndex, holeInfo) {
      if (!list.length) return;
      let records = this.handleRecordsParams(list, recordIndex);
      let params = {
        competition_id: this.competitionData.competition_id,
        records: JSON.stringify(records),
        hole_no: holeInfo.hole_no,
        hole_no2: holeInfo.hole_no2
      };
      console.log('params', params);
      try {
        let {
          data: { data }
        } = await updateCompetitionScore(params);
        this.handleSuccessUpdateScore(data);
      } catch (error) {
        let errMsg = error.errMsg
        let statusCode = error.statusCode

        // 网络异常处理
        let unusual = errMsg.includes('request:fail') || statusCode === 500;
        let businessError = statusCode == 200 && error?.data?.code === 0 && error?.data?.data === false && error?.data?.msg
        this.handleCatchUpdateScore(list, unusual, recordIndex, businessError);

        if (businessError) {
          uni.showToast({
            title: error?.data?.msg,
            icon: "none",
            duration: 3000,
          })
          return
        }

        // console.log('task:::', tasks);
        const newParams = checkScore(params);
        pushTask('score', newParams, updateCompetitionScore);
      } finally {
      }
    },

    // 更换分数 -- record参数处理
    handleRecordsParams(list, recordIndex) {
      let competitorList = [...this.competitorList];
      // 处理loading
      list.forEach((e) => {
        competitorList.forEach((v) => {
          if (e.competitor_id === v.competitor_id) {
            v.record[recordIndex].loading = true;
          }
        });
      });
      this.SET_COMPETITION_ITEM({
        key: 'competitor_list',
        data: competitorList
      });
      // 开始构造参数
      let records = list.map((item) => {
        return {
          competition_record_id: item.record[recordIndex].competition_record_id,
          hole_no: item.record[recordIndex].hole_no,
          score: item.setScore,
          push: item.setPush,
          fairway: item.setFairway || 0,
        };
      });
      return records;
    },
    // 更换分数 -- 成功处理
    handleSuccessUpdateScore(list) {

      calcRecord(this.competitionData, list)
      // 更新数据后，重新获取一下全部详情，使数据为最新。
      this.GET_COMPETITION_DETAIL({ competition_id: this.competitionData.competition_id, gl: false });
      
      if (this.competitionData.status == 1 && this.competitionData.group_list.length == 1) {  //只有一组且所有球员18洞数据已经填写完成时，询问是否结束球赛
        let finish = true
        this.competitionData?.competitor_list.forEach((competitor) => {
          competitor?.record.forEach((data) => {
            if (data?.type != 'half' && data.score === null) {
              finish = false
            }
          })
        })
        
        if (finish) {
          this.$refs.finishCompetiton.open()
        }
        
      }
    },
    // 更换分数 -- 网络异常处理
    handleCatchUpdateScore(list, unusual, recordIndex, businessError) {
      let competitorList = this.competitionData.competitor_list;
      list.map((item) => {
        let index = competitorList.findIndex(
          ({ competitor_id }) => competitor_id === item.competitor_id
        );
        // 找到对应球员修改信息
        if (index !== -1) {
          let recordTarget = competitorList[index].record[recordIndex];
          recordTarget.loading = false;
          if (unusual) {
            recordTarget.score = item.setScore;
            recordTarget.push = item.setPush;
            recordTarget.unusual = true;
          }
        }
      });
      this.SET_COMPETITION_ITEM({
        key: 'competitor_list',
        data: competitorList
      });

      // 更新数据后，重新获取一下全部详情，使数据为最新。
      this.GET_COMPETITION_DETAIL({ competition_id: this.competitionData.competition_id, gl: false });
    },
    // 导航返回
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
    // 弹窗
    handleShowModal(modal, data = {}) {
      // 活动未开始(改分可以)
      // if (this.competitionStatus === '未开始') {
      //   return uni.showToast({
      //     title: '球赛未开始',
      //     icon: 'none'
      //   });
      // }
      // 活动已结束(球员弹出成绩单)
      console.log(
        'this.isSelfCompetitor',
        this.isSelfCompetitor,
        this.competitionStatus
      );
      // 非球员、球童，点击头像，应该展示成绩卡
      if ((this.competitionStatus === '已结束' || (this.isSelfCompetitor == false && this.isSelfCaddie == false)) && modal !== 'wholeRankModal') {
        uni.navigateTo({
          url: `/pages/chat-room/personal-score/index?id=${data.competitor_id}`
        });
        return;
      }
      // 非球赛员只能点击总榜单/Tee
      if (
        !['wholeRankModal', 'teeModal'].includes(modal) &&
        !this.isSelfCompetitor &&
        !this.isSelfCaddie
      )
        return;
      this.$refs[modal].open(data);
    },
    // 选择分组
    handleClickGroup(index, group) {
      // this.group = group;
      this.handleUpdateGroup(group);
      this.wholeFlag = false;
    },
    // 更新分组
    async handleUpdateGroup(group) {
      this.UPDATE_CUR_GROUP(group)
      
      // 更新数据后，重新获取一下全部详情，使数据为最新。
      await this.GET_COMPETITION_DETAIL({ competition_id: this.competitionData.competition_id, gl: false });

      await this.GET_PK_INFO({
        competition_id: this.competitionData.competition_id,
        group: group
      });
      
      this.$nextTick(() => {
        this.centerLastScoredCell();
      })
    },
    // 退出球局
    handleOut() {
      uni.showModal({
        content: '确定退出该球局吗？',
        cancelText: '暂不退出',
        confirmText: '退出',
        confirmColor: '#FF6A6A',
        success: async (res) => {
          if (res.confirm) {
            console.log('用户点击确定');
            handleDelCompetitor(this, this.selfCompetitor.competitor_id);
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    handleAddCompetitors() {
      let index = 0
      this.formatCompetitonInfo = this.competitionData.group_list.map((e, i) => {
        if (e == this.isNowGroup) {
          index = i
        }
        let obj = {
          id: i,
          group: e,
          users: []
        };
        return obj;
      });
      
      this.formatCompetitonInfo.map((e) => {
        let filterGroup = this.competitionData.competitor_list.filter(
          (v) => v.group == e.group
        );
        e.users = filterGroup;
      });
      
      const disabledList = this.formatCompetitonInfo.reduce(
        (pre, { users }, idx) =>
          idx === index ? pre : [...pre, ...users.map(({ uid }) => uid)],
        []
      );
      this.handleType = 'addCompetitors'

      const caddiesIds = this.competitionData.caddie_briefs?.map((caddie) => caddie.uid)
      disabledList.push(...caddiesIds)
      const targetCompetitionInfo = this.formatCompetitonInfo[index];

      const sharing = {
        pageSharing: () => {
          const data = this.competitionData

          return shareCompetitionInvite({
            id: data.competition_id,
            name: data?.competition_name,
            group: targetCompetitionInfo.group,
            uid: data?.uid,
            shareRoomName: data?.competition_name,
            imageUrl: undefined, // 使用默认图
          });
        },
        goShareQRCode: () => {
          const data = this.competitionData

          const params = {
            id: data.competition_id,
            no: data.competition_no,
            group: targetCompetitionInfo.group,
            time: data?.start_time,
            course: data?.course_name,
            course_id: data?.course_id,
            type: PAGE_CHAT_SHARE_TYPE.invite,
            uid: data?.uid,
            shareRoomName: data?.competition_name,
          }

          uni.navigateTo({
            url: `/pages/chat-room/add-room/share/index?params=${encodeURIComponent(
              JSON.stringify(params)
            )}`,
          })
        }
      }
      this.$refs.setFriendsModal.open(targetCompetitionInfo, disabledList, sharing, this.competitionData, true);
    },
    handleModifyCompetitors(justSort = false) {
      let index = 0
      this.formatCompetitonInfo = this.competitionData.group_list.map((e, i) => {
        if (e == this.isNowGroup) {
          index = i
        }
        let obj = {
          id: i,
          group: e,
          users: []
        };
        return obj;
      });
      
      this.formatCompetitonInfo.map((e) => {
        let filterGroup = this.competitionData.competitor_list.filter(
          (v) => v.group == e.group
        );
        e.users = filterGroup;
      });
      this.handleType = justSort ? 'sortCompetitorsHT' : 'modifyCompetitorsHT'
      this.$nextTick(() => {
        const users = this.formatCompetitonInfo[index].users;
        if (justSort) {
          this.$refs.setCompetitorSort.open(users)
        } else {
          uni.navigateTo({
            url: '/pages/chat-room/add-room/edit-competitor/index',
            success: (res) => {
              res.eventChannel.emit('getcompetitorList', {
                list: [...users],
                index: index,
              });

              res.eventChannel.once('update-competitor', ({ list, index }) => {
                this.setCompetitors(list)
              })
            }
          });
        }
      });
    },
    async setCompetitors(list) {
      try {
        if (this.handleType == 'addCompetitors') {  //新增球员是会把所有组所选信息返回
          this.formatCompetitonInfo.users = list
        } else if (this.handleType === 'sortCompetitorsHT' || this.handleType == 'modifyCompetitorsHT') {
          let index = 0
          this.competitionData.group_list.map((e, i) => {
            if (e == this.isNowGroup) {
              index = i
            }
          })
          this.formatCompetitonInfo[index].users = list
        }
        let competitors = this.formatCompetitonInfo.reduce((pre, { users, group }) => {
          const list = users.filter((item) => !pre.some((ele) => ele.uid === item.uid))
            .map((item, index) => {
              let obj = {
                uid: item.uid,
                group
              };
              obj.sort = index + 1;
              // 有competitor_id传competitor_id
              if(item.competitor_id){
                obj.competitor_id = item.competitor_id
              }
              return obj;
            });
          return [...pre, ...list];
        }, []);
        
        if (!competitors.length) {
          uni.showToast({ title: '请添加成员', icon: 'none' });
          return Promise.reject();
        }
        competitors = JSON.stringify(competitors);
            
        let params = {
          competition_id: this.competitionData.competition_id,
          competition_name: this.competitionData.competition_name,
          course_half_court_ids: this.competitionData.course_half_court_ids,
          course_id: this.competitionData.course_id,
          is_private: this.competitionData.is_private,
          start_time: this.competitionData.start_time,
          competitors: competitors
        }

        let res = await updCompetition(params);

        uni.showToast({
          title: '保存成功',
          icon: 'success'
        });
        // 请求球局详情
        this.GET_COMPETITION_DETAIL({ competition_id: params.competition_id });
        // 获取群组中的参赛成员im id
        this.GET_USERS_IM_ID({ competition_id: params.competition_id  });
      } finally {
        this.handleType = ''
      }
    },

    rightTableScrollViewScroll(scrollView) {
      this.rightTableScrollLeftOld = scrollView.detail.scrollLeft
    },


    /**
     * 居中最新一个有记分的洞（第一个后面洞没有计分的洞）。注意，有可能从前后半场开始打，前半场的分数可能还没有
     */
    centerLastScoredCell() {
      const competitorList = this.competitorList;      
      const flatRecords = new Array();
      for (let cIndex = 0; cIndex < competitorList.length; cIndex++) {
        const competitor = competitorList[cIndex];
        const filteredRecords = competitor.record.filter((r) => { return r.hole_no != null })
        for (let rIndex = 0; rIndex < filteredRecords.length; rIndex++) {
          if (flatRecords.length <= rIndex) {
            flatRecords.splice(rIndex, 0, filteredRecords[rIndex])
            continue;
          }

          if (flatRecords[rIndex]?.score != null) {
            continue;
          }

          flatRecords.splice(rIndex, 1, filteredRecords[rIndex])
        }
      }

      // 找出第一个后面洞没有计分的洞
      let targetRecord
      let targetIndex
      
      for (let rIndex = 0; rIndex < flatRecords.length; rIndex++) {
        const record = flatRecords[rIndex];
        if (targetRecord != null && record.score == null) {
          break;
        }
        if (record.score != null) {
          targetRecord = record
          targetIndex = rIndex
        }
      }

      let fullFilled = false;
      if (targetIndex != null && flatRecords.length - 1 == targetIndex) {
        fullFilled = true
      }

      if (targetRecord) {
        this.moveHoleCellToCenter(targetRecord.course_half_court_id, targetRecord.hole_no, fullFilled)
      }
    },
    // 居中某洞
    moveHoleCellToCenter(courseId, holeNo, fullFilled, callback) {
      /**
       * 通过查询 DOM 来获取位置。
       */

      const scope = this;
      scope.rightTableScrollLeft = scope.rightTableScrollLeftOld;
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .in(scope)
          .select("#table-right-wrapper")
          .boundingClientRect(rTableRect => {
            if (rTableRect == undefined) {
              callback && callback(false); return;
            };

            const targetIdSelector = fullFilled ? '#td-total-score' : `#hole-cell-${courseId}-${holeNo}`
            uni
              .createSelectorQuery()
              .in(scope)
              .select(targetIdSelector)
              .boundingClientRect(cellRect => {
                if (cellRect == undefined) {
                  callback && callback(false); return;
                }

                const cellCenter = cellRect.left + (cellRect.width / 2)

                const tableCenter = rTableRect.left + (rTableRect.width / 2)
                const offset = cellCenter - tableCenter

                /**
                 * scroll-view 超出范围时会自动停止滚动，这里省略边界计算
                 */

                const newScrollLeft = scope.rightTableScrollLeftOld + offset

                console.log('newScrollLeft', newScrollLeft)

                scope.rightTableScrollLeft = newScrollLeft

                callback && callback(true)

              })
              .exec()
          })
          .exec()
      })
    },

    async exitCaddie() {
      const [err, res] = await awaitWrap(caddieSave({
        competition_id: this.competitionData?.competition_id,
        group: this.targetGroup,
        action: 0,
      }, true))

      // 更新数据后，重新获取一下全部详情，使数据为最新。
      this.GET_COMPETITION_DETAIL({ competition_id: this.competitionData.competition_id, gl: false });
    },
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/scoreboard.scss';

.bg-line {
  background: #003c3d;
}
.ml-8 {
  margin-left: 8rpx;
}

.fs-14 {
  font-size: 14rpx;
}

.mini-scoreboard-root {
  display: block;
}

// S 展开盒子
.toggle-box {
  line-height: 32rpx;
  background: $col-1e3;
  .icon-arrow {
    margin-left: 8rpx;
    width: 12rpx;
  }
}
// E 展开盒子

.finish-container {
  width: 606rpx;
  height: fit-content;
  border-radius: 4rpx;
  overflow: hidden;
  box-sizing: border-box;
  .finish-head {
    width: 606rpx;
    height: 140rpx
  }
  .finish-content {
    padding: 40rpx 40rpx;
    color: #003C3D;
    font-size: 32rpx;
    line-height: 45rpx;
  }
  .finish-button {
    background: #003C3D;
    border-radius: 4rpx;
    width: 166rpx;
    height: 78rpx;
    line-height: 78rpx;
    color: #FFFFFF;
    text-align: center;
    font-weight: 600;
    font-size: 28rpx;
    font-family: PingFang HK;
  }
  .not-finish-button {
    background: #FFFFFF;
    border-radius: 4rpx;
    width: 162rpx;
    height: 74rpx;
    line-height: 74rpx;
    color: #003C3D;
    text-align: center;
    font-weight: 600;
    font-size: 28rpx;
    font-family: PingFang HK;
    border: 2rpx solid #003C3D;
  }
}
</style>
