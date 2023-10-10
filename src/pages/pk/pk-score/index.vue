<!--
 * @Author: simon
 * @Description: pk比分
 * @LastEditors: simon
-->
<template>
  <view>
    <view class="pk-header">
      <!-- S 导航栏 -->
      <GNavbar title="PK"/>
      <!-- E 导航栏 -->

      <!-- S 选择 -->
      <view class="p-32 select-wrapper flex">
        <view class="group-box pr">
          <view class="current-group h-full op-box flex-center"
                @click=" showGroupSelect = !showGroupSelect;showPkSelect = false;">
            <view class="fs-24 rubik h-full grouo-name">{{currentGroup}}组</view>
          </view>
          <!-- S 分组下拉框 -->
          <view class="mt-10 trans group-select select-box"
                :style="{height: showGroupSelect ? `${groupSelectHeight}rpx` : 0}">
            <view class="select-content">
              <view class="group-cell select-cell flex-center"
                    v-for="item in groupList"
                    :key="item"
                    @click="handleGroup(item)">
                <view class="fs-28  fw-bol"
                      :class="[item === currentGroup ? 'sub-color op-100' : 'col-white op-7']">{{item}}组
                </view>
              </view>
            </view>
          </view>
          <!-- E 分组下拉框 -->
        </view>
        <!-- /分组 -->

        <view class="flex-1 h-full pk-box pr">
          <view class="op-box pk-namebox"
                @click="handleShowPk">
            <view class="flex-between h-full">
              <view class="pk-desc">{{currentPk.desc}}</view>
              <image :src="`${ossUrl}/icons/icon-arrow2.png`"
                     class="icon-arrow"
                     mode="widthFix"
                     v-if="currentPk.desc"></image>
            </view>
          </view>

          <!-- S pk下拉框 -->
          <!-- <view class="mt-10 trans pk-select select-box"
                :style="{height: showPkSelect ? `${pkSelectHeight}rpx` : 0}">
            <view class="select-content">
              <view class="pk-cell select-cell flex-center"
                    v-for="item in pkRuleList"
                    :key="item.competition_pk_id"
                    @click="handlePk(item)">
                <view class="fs-28 fw-bol tc"
                      :class="[item.competition_pk_id == currentPk.competition_pk_id ? 'sub-color op-100' : 'col-white op-7']">
                  {{item.desc}}
                </view>
              </view>
            </view>
          </view> -->
          <!-- E pk下拉框 -->
        </view>
        <vew class="fs-24 h-full pk-rules flex-center"><text @click="handleRule">PK规则</text><text class="length rubik">{{pkRules.length}}</text></vew>
      </view>
      <!-- E 选择 -->

      <!-- S 球员 -->
      <view class="user-wrapper pr">
        <image :src="`${ossUrl}/images/pk/bg-pk.png`"
               class="bg-pk"
               mode="widthFix"
               @click="totalFlag = !totalFlag" />
        <view class="user-list flex-between">
          <view class="user-cell tc"
                v-for="item in competitorList"
                :key="item.uid">
            <view class="g-avatar-box">
              <view class="g-avatar"
                    :style="{backgroundImage: `url(${item.avatar_url})`}"></view>
            </view>
            <view class="text-over fs-28 mt-5">{{item.username}}</view>
          </view>
        </view>

        <view class="leiji-box op-box fs-24 flex-center flex-column"
              :class="{'total-active': totalFlag}"
              @click="totalFlag = !totalFlag">
          <view>累</view>
          <view>计</view>
        </view>
        <!-- /累计 -->
      </view>
      <!-- E 球员 -->
    </view>

    <view class="pk-table rubik pr"  v-if="pkRules.length">
      <!-- S 表头 -->
      <view class="table-head flex">
        <view class="total-text fs-22 col-999 th-cell flex-center flex-83 border-b">
          <view>Total</view>
          <view class="th-border"></view>
        </view>
        <view v-for="item in competitorList"
              :key="item.uid"
              class="flex-1 th-cell  flex-center score-th border-b">
          <view class="fs-32">{{item.total_pk_score}}</view>
          <view class="th-border"></view>
        </view>
      </view>
      <!-- E 表头 -->
      <!-- S 表体 -->
      <view class="table-body">
        <view class="flex">
          <view class="hole-column flex-83">
            <view v-for="item in getHoleList()"
                  :key="item"
                  class="flex-center td-cell border-b"
                  :class="[item == ''?'cs':'']">
              <view class="fs-24">{{item}}</view>
            </view>
          </view>
          <view v-for="item in competitorList"
                :key="item.item.competitor_id"
                class="flex-1 score-tr">
            <view v-for="(record,rindex) in getRecordList()"
                  :key="rindex"
                  class="td-cell col-53 flex-center border-b fs-26"
                  v-if="record[item.competitor_id]"
                  :class="[record[item.competitor_id] && record[item.competitor_id].hasOwnProperty('showCsScore') ?'cs':'', 
                          record[item.competitor_id].showCsScore ?'have-score': '']">
                <!-- 无效洞 -->
                <template v-if="!isValidHoleIdx(rindex)">
                  <view>-</view>
                </template>
                <!-- 有效洞 -->
                <template v-else>
                  <!-- 分组箭头 -->
                  <view v-if="record[item.competitor_id].is_light" :class="'light'+record[item.competitor_id].is_light" />
                  <!-- 以免累计情况下抽水分数显示不出来 -->
                  <view v-if="totalFlag && (!record[item.competitor_id] || !record[item.competitor_id].hasOwnProperty('showCsScore'))">
                    {{record[item.competitor_id] && record[item.competitor_id].total_pk_score != null ? record[item.competitor_id].total_pk_score : ``}}
                  </view>
                  <!-- 不是抽水显示单元格，而是成绩格 -->
                  <view v-else-if="!record[item.competitor_id] || !record[item.competitor_id].hasOwnProperty('showCsScore')">
                    <!-- 显示顶 -->
                    <template v-if="record[item.competitor_id] && record[item.competitor_id].is_draw">
                      <text :class="[record[item.competitor_id].is_draw == 2 ? 'top line-top' : 'top']">顶</text>
                      <view class="only-score tc fw-400 fs-22 rubik-regular" v-if="record[item.competitor_id] && record[item.competitor_id].only_score">{{record[item.competitor_id].only_score}}</view>
                    </template>
                    <!-- 显示成绩 -->
                    <template v-else>
                      <text v-if="record[item.competitor_id] && record[item.competitor_id].pk_score !== null">
                        {{record[item.competitor_id].pk_score}}
                      </text>
                    </template>
                  </view>
                  <!-- 展示抽水 -->
                  <view v-else>
                    <text :class="record[item.competitor_id].showCsScore ? 'have-score' : ''">
                      {{record[item.competitor_id].showCsScore ? '抽水 ：' + record[item.competitor_id].showCsScore : ''}}
                    </text>
                  </view>
                </template>
            </view>
          </view>
        </view>

        <!-- S 抽水 bottom -->
        <view class="count-box col-999 fs-24">
          <view class="flex">
            <view class="flex-83 td-cell flex-center border-b">让</view>
            <view class="flex-1 td-cell flex-center border-b"
                  v-for="item in competitorList"
                  :key="item.uid">
              <view>{{item.handicap}}</view>
            </view>
          </view>
          <view class="flex">
            <view class="flex-83 td-cell flex-center border-b">抽水</view>
            <view v-for="item in competitorList"
                  :key="item.uid"
                  class="flex-1 td-cell flex-center border-b">
              <view>{{item.total_cs_score}}</view>
            </view>
          </view>
          <!-- E 抽水 bottom -->
          <view class="gray-mask"
                v-show="showGroupSelect || showPkSelect"></view>
        </view>
      </view>
      <!-- E 表体 -->

    </view>
    <RulesModal ref="rulesModal"
                :list="pkRuleList"
                @onClick="getRules" />
                <!-- /规则弹窗 -->
  </view>
</template>

<script>
// 组件
import GNavbar from '@/components/g-navbar/index.vue';
import RulesModal from './components/rules-modal';
// api
import { getCompetitionPk, groupGet, pkList, getAllCompetitionPk } from '@/api/pk/index';
// vuex
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';

import { actionsTypes } from '@/store/modules/chat-room/types.js';

const pkTypes = new Map([
  [1, '比杆'],
  [2, '比洞'],
  [3, '单挂8421'],
  [4, '斗地主'],
  [5, '4人拉斯'],
  [7, '打老虎']
]);
export default {
  components: { GNavbar, RulesModal },
  data() {
    return {
      ossUrl: this.$ossUrl,
      currentGroup: 'A', // 当前分组
      showGroupSelect: false, // 分组下拉
      currentPk: {}, // 当前pk规则
      showPkSelect: false,
      competitorList: [], // 参赛人员
      pkRecordList: [], // 分数列表
      holeList: [], // 球洞信息
      pkRuleList: [], // pk规则列表
      totalFlag: false, // 累计
      csList: {},   //有抽水分数的数据
      invalidHolesIdx:[],
    };
  },
  computed: {
    ...mapState({
      competitionData: (state) => state.chatRoom.competitionData,
      pkRules: (state) => state.pk.pkRules,
      pkInfo: (state) => state.pk.pkInfo,
      isNowGroup: (state) => state.chatRoom.isNowGroup, // 当前操作的组
    }),
    ...mapGetters(['getTeeColorList']),

    // 分组高度
    groupSelectHeight() {
      return this.groupList.length * 96;
    },
    // 分组高度
    pkSelectHeight() {
      return this.pkRuleList.length * 96;
    },
    // 会员tee颜色
    teeColor() {
      return function (tee) {
        let teeTarget = this.getTeeColorList.find((e) => e.value == tee);
        return (teeTarget && teeTarget.color) || 'transparent';
      };
    },
    // 分组
    groupList() {
      return this.competitionData?.group_list;
    },
    isValidHoleIdx() {
      return function (holeIdx) {
        return this.invalidHolesIdx.indexOf(holeIdx) > -1 ? false : true
      };
    }
  },
  onShow() {
    wx.hideShareMenu({
      menus: ['shareAppMessage']
    })
    this.currentGroup = this.isNowGroup
    let pages = getCurrentPages(); // 获取当前页面栈
    let currentPage = pages[pages.length - 1]; // 当前页面
    if (currentPage.data.refreshCompetitionPk) {
      this.refreshCompetitionPk()
      currentPage.data.refreshCompetitionPk = false;
    }
  },
  watch: {
    pkRules: {
    	immediate: true,
    	handler(newVal) { //从得分页点进pk规则列表里且更新了pkRules的值，这里也会watch到，又因为新增的pk是没有competition_pk_id，因此会在init被过滤掉，从而加不上。
                        //不watch的话切换组的时候信息无法及时更新，因为限定在当前页watch到的才执行init
        let pages = getCurrentPages()
        if (pages[pages.length - 1].route == "pages/pk/pk-score/index" ) {
          this.init()
        }
    	}
    },
    currentPk: {
      deep: true,
      immediate: true,
      handler: function() {
        if (this.currentPk.competition_pk_id == 0) {  //总成绩不计算无效洞
          this.invalisHolesIdx = []
        } else if(this.currentPk?.valid_holes) {
          let invalidHolesIdx = []
          this.currentPk?.valid_holes.forEach((holeValid, index) => {
            if (!holeValid) {
              invalidHolesIdx.push(index)
            }
          })
          this.invalidHolesIdx = invalidHolesIdx
        }
      },
    },
  },
  methods: {
    ...mapMutations({
      SET_PK_RULES: 'SET_PK_RULES',
    }),
    ...mapActions({
      GET_PK_INFO: 'GET_PK_INFO',  
      UPDATE_CUR_GROUP: actionsTypes.UPDATE_CUR_GROUP,
      GET_COMPETITION_DETAIL: actionsTypes.GET_COMPETITION_DETAIL,
    }),
    // 数据初始化
    async init() {console.log('init')
      
      //删除掉所有规则后返回的页面应是球局详情页，而不是pk页
      if (this.pkRules.length == 0) {
        console.log('this.pkRules 0', this.competitionData)
        this.competitorList = this.competitionData.competitor_list.filter((com) => {return com.group == this.currentGroup})
        this.pkRecordList = []
        this.currentPk = {desc: ""}
        this.holeList = []
        return;
        // this.back()
      }
      
      //新增规则时没有点击“确认并返回”而是直接点的返回时，state.pkRules会错误保存起没有提交的规则，pk页也会报错：未知pk
      let pkRules = this.pkRules.filter((rule) => {
        return rule.hasOwnProperty('competition_pk_id')
      })
      
      if (pkRules.length != this.pkRules.length) {
        this.SET_PK_RULES(pkRules);
      }
      
      let competition_group_pk_id = 0
      
      this.pkRuleList = this.pkRules.map((e) => {
        competition_group_pk_id = e.competition_group_pk_id
        return {
          desc: `${pkTypes.get(e.pk_id)}: ${e.rules.desc}`,
          pk_id: e.pk_id,
          competition_group_pk_id: e.competition_group_pk_id,
          competition_pk_id: e.competition_pk_id,
          competitor_ids: e.competitor_ids,
          valid_holes: e?.rules.valid_holes || [],
          check: false
        };
      });
      
      if (this.pkRuleList.length > 1) {
        this.pkRuleList.unshift({
          desc: '总得分', // 总成绩
          pk_id: 0,
          competition_group_pk_id: competition_group_pk_id,
          competition_pk_id: 0,
          competitor_ids: [],
          check: false
        })
      }

      this.currentPk = this.pkRuleList[0];
      this.holeList = this.pkInfo.hold_list;
      this.getCompetitionPk({
        competition_pk_id: this.pkRuleList[0].competition_pk_id,
        pk_id: this.pkRuleList[0].pk_id,
        competition_group_pk_id: this.pkRuleList[0].competition_group_pk_id,
      });
    },
    // 获取规则详情
    async getCompetitionPk(params) {
      let res
      if(params.competition_pk_id == 0) { //  总成绩
        res = await getAllCompetitionPk({competition_group_pk_id: params.competition_group_pk_id});
      } else {
        res = await getCompetitionPk(params);
      }
      let data = res.data.data
      const { competitor_list, pk_record_list } = data;
      this.competitorList = competitor_list;
      this.pkRecordList = pk_record_list.reduce((acc, cur) => {
        if (Object.prototype.toString.call(cur) === '[object Array]') {
          const item = cur.reduce((childAcc, childCur) => {
            childAcc[childCur.competitor_id] = { ...childCur };
            return childAcc;
          }, {});
          acc.push(item);
        } else {
          acc.push(cur);
        }
        return acc;
      }, []);
      this.pkRecordList.forEach((records, holeNo) => {
        let haveCsScore = false
        let noCsScoreCompetitorIds = []
        for (let competitor_id in records) {
          let record = records[competitor_id]
          if (record?.cs_score) {
            if (!this.csList?.[params.competition_pk_id]) {
                this.csList[params.competition_pk_id] = {}
            }
            if (!this.csList?.[params.competition_pk_id][holeNo]) {
                this.$set(this.csList[params.competition_pk_id], holeNo, {})
            }
            if (!this.csList[params.competition_pk_id][holeNo][record.competitor_id]) {
                this.$set(this.csList[params.competition_pk_id][holeNo], record.competitor_id, {})
            }
            
            this.csList[params.competition_pk_id][holeNo][record.competitor_id] = {showCsScore : record?.cs_score || '', competitor_id: record.competitor_id}
            haveCsScore = true
          } else {
            noCsScoreCompetitorIds.push(competitor_id)
          }
          
          if (haveCsScore && noCsScoreCompetitorIds.length) {  //填充该洞所有数据里有抽水但是没有抽水分数的球手数据
            noCsScoreCompetitorIds.forEach((e) => {
              this.$set(this.csList[params.competition_pk_id][holeNo], e, {showCsScore : '', competitor_id: e} )
            })
            noCsScoreCompetitorIds = []
          }   
        }
      })
    },
    handleShowPk() {
      // this.showPkSelect = !this.showPkSelect;
      if (this.pkRules.length) {
        this.showGroupSelect = false;
        this.$refs.rulesModal.open(this.currentPk.competition_pk_id);
      }
    },
    // 选择pk
    getRules(pk) {
      if (this.currentPk.competition_pk_id != pk.competition_pk_id) {
        this.getCompetitionPk({
          competition_pk_id: pk.competition_pk_id,
          pk_id: pk.pk_id,
          competition_group_pk_id: pk.competition_group_pk_id
        });
        this.currentPk = pk;
      }
      this.showPkSelect = false;
    },
    // 选择分组
    async handleGroup(group) {
      this.currentGroup = group;
      let that = this

      this.UPDATE_CUR_GROUP(group)
      this.GET_COMPETITION_DETAIL({ competition_id: this.competitionData.competition_id })
      this.GET_PK_INFO({
        competition_id: this.competitionData.competition_id,
        group: group
      })
      this.showGroupSelect = false;
    },
    handleRule() {
      uni.navigateTo({
        url: '/pages/pk/pk-rules-list/index'
      });
    },
    back() {
      uni.navigateBack();
    },
    getHoleList() {
      let holeList = JSON.parse(JSON.stringify(this.holeList))
      if (this.csList.hasOwnProperty(this.currentPk.competition_pk_id) && Object.values(this.csList[this.currentPk.competition_pk_id]).length > 0) {
        let csIdxs = Object.keys(this.csList[this.currentPk.competition_pk_id])
        //往holeList插入空值
        csIdxs.forEach((csIdx, eleNum) => {
          let insertIdx = csIdx*1 + 1 + eleNum*1 //+1=>插入前必然有一行，eleNum=>前面已经插入的抽水行数，*1避免变成字符串相加
          holeList.splice(insertIdx, 0, '')
        })
      }
      return holeList
    },
    getRecordList() {
      let recordList = JSON.parse(JSON.stringify(this.pkRecordList))
      if (this.csList.hasOwnProperty(this.currentPk.competition_pk_id) && Object.values(this.csList[this.currentPk.competition_pk_id]).length > 0) {
        //往pkRecordList插值
        let csIdxs = Object.keys(this.csList[this.currentPk.competition_pk_id])
        csIdxs.forEach((csIdx, eleNum) => {
          let insertIdx = csIdx*1 + 1 + eleNum*1 //+1=>插入前必然有一行，eleNum=>前面已经插入的抽水行数，*1避免变成字符串相加
          let csEle = this.csList[this.currentPk.competition_pk_id][csIdx]
          recordList.splice(insertIdx, 0, csEle)
        })
      }
      return recordList
    },
    refreshCompetitionPk() {//修改过规则，重新获取一下pk
      if (this.pkRules.length == 0) {
        console.log('this.pkRules 0', this.competitionData)
        this.competitorList = this.competitionData.competitor_list.filter((com) => {return com.group == this.currentGroup})
        this.pkRecordList = []
        this.currentPk = {desc: ""}
        this.holeList = []
        return;
      }
      
      let pkRules = this.pkRules.filter((rule) => {
        return rule.hasOwnProperty('competition_pk_id')
      })
      
      if (pkRules.length != this.pkRules.length) {
        this.SET_PK_RULES(pkRules);
        return;//会触发init方法 因此不再往下执行
      }
        
      let competition_group_pk_id = 0
      let validCurrentPk = false
      
      this.pkRuleList = this.pkRules.map((e) => {
        competition_group_pk_id = e.competition_group_pk_id
        if (e.pk_id == this.currentPk.pk_id) {  //判断曾经的pk是否还存在，不存在就要重新赋值currentPK
          validCurrentPk = true
        }
        return {
          desc: `${pkTypes.get(e.pk_id)}: ${e.rules.desc}`,
          pk_id: e.pk_id,
          competition_group_pk_id: e.competition_group_pk_id,
          competition_pk_id: e.competition_pk_id,
          competitor_ids: e.competitor_ids,
          valid_holes: e?.rules.valid_holes || [],
          check: false
        };
      });
      
      if (this.pkRuleList.length > 1) {
        this.pkRuleList.unshift({
          desc: '总得分', // 总成绩
          pk_id: 0,
          competition_group_pk_id: competition_group_pk_id,
          competition_pk_id: 0,
          competitor_ids: [],
          check: false
        })
      }
      
      if (!validCurrentPk) {
        this.currentPk = this.pkRuleList[0]
      }
       
       if (this.currentPk.hasOwnProperty('pk_id')) {
         this.getCompetitionPk(this.currentPk)
       }
    }
  }
};
</script>

<style lang="scss" scoped>
.op-box {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
}

// 下拉选择
.select-box {
  position: absolute;
  z-index: 10;
  overflow: hidden;
  .select-content {
    // bottom: -105rpx;
    background: rgba(30, 62, 66, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(14.9506px);
    box-sizing: border-box;
    .select-cell {
      height: 96rpx;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      box-sizing: border-box;
      &:last-child {
        border-bottom: 0;
      }
    }
  }
}

.pk-header {
  background: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/bg-navbar2.png')
    no-repeat top;
  background-size: 100% 100%;
  // S 头部选择
  .select-wrapper {
    height: 68rpx;
    color: $white;
    // 分组
    .group-box {
      flex: 0 0 98rpx;
      z-index: 10;
      .current-group {
        height: 68rpx;
        border-radius: 1px;
        box-sizing: border-box;
      }
      .grouo-name {
        line-height: 68rpx;
        border-bottom: 4rpx solid $sub-color;
      }
      // 分组下拉框
      .group-select {
        width: 100%;
      }
    }
    // pk名字
    .pk-box {
      .pk-namebox {
		height: 68rpx;
        margin: 0 10rpx;
        padding: 0 13rpx;
        border-radius: 4rpx;
        line-height: 68rpx;
        .icon-arrow {
          margin-left: 30rpx;
          width: 20rpx;
        }
      }
      .pk-select {
        left: 10rpx;
        right: 10rpx;
      }

      .pk-desc {
        @include ell(1);

        font-weight: 400;
        font-size: 28rpx;
        line-height: 39rpx;
        letter-spacing: -0.3rpx;
        color: #FFFFFF;
      }
    }

    // pk规则
    .pk-rules {
      position: relative;
      flex: 0 0 120rpx;
      background: rgba(255, 255, 255, 0.02);
      border: 1.5rpx solid rgba(255, 255, 255, 0.2);
      border-radius: 4rpx;
      .length {
        position: absolute;
        display: inline-block;
        right: -1rpx;
        top: -1rpx;
        padding: 3rpx 6rpx;
        font-size: 18rpx;
        color: $col-1e3;
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(2px);
        border-radius: 0 4rpx 0 4rpx;
      }
    }
  }
  // E 头部选择

  // S 球员信息
  .user-wrapper {
    color: $white;
    .bg-pk {
      top: -50rpx;
      left: 0;
      position: absolute;
      width: 134rpx;
    }
    .user-list {
      padding: 16rpx 0px 16rpx 90rpx;
      .user-cell {
        flex: 1;
        .g-avatar-box {
          @include wh(60rpx, 60rpx);
          margin: 0 auto;
          border: 1rpx solid rgba(255, 255, 255, 0.4);
          border-radius: 100%;
        }
        .g-avatar {
          @include wh(60rpx, 60rpx);
        }
      }
    }
  }
  // E 球员信息

  // S 累计
  .leiji-box {
    position: absolute;
    top: 25rpx;
    left: 0;
    width: 42rpx;
    height: 92rpx;
    border-radius: 1px;
  }
  // E 累计
}

// S 表格
.pk-table {
  .th-cell {
    position: relative;
    height: 69rpx;
    .th-border {
      position: absolute;
      left: 1rpx;
      right: 1rpx;
      bottom: 2rpx;
      height: 2rpx;
      background: #e9e9e9;
    }
  }
  .td-cell {
    height: 64rpx;
  }
  .top {
    display: inline-block;
    width: 36rpx;
    text-align: center;
    &.line-top {
      margin-right: 8rpx;
      position: relative;
    }
    &.line-top::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 36rpx;
      height: 1.5rpx;
      background: #535353;
      transform: translate(-50%, -50%);
    }
  }
  .only-score {
    display: inline-block;
    height: 30rpx;
    line-height: 30rpx;
    width: 30rpx;
    border-radius: 50%;
    background: #999999;
    color: #FFFFFF;
  }
  .light2 {
    position: absolute;
    width: 34rpx;
    height: 18rpx;
    background-image: url('http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/icons/islight2.png');
    background-repeat: no-repeat;
    background-size: contain;
    top: 50%;
    transform: translateY(-50%);
    left: 12rpx;
  }
  .light1 {
    position: absolute;
    width: 32rpx;
    height: 16rpx;
    background-image: url('http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/icons/islight1.png');
    background-repeat: no-repeat;
    background-size: contain;
    top: 50%;
    transform: translateY(-50%);
    left: 12rpx;
  }
  .light3 {
    position: absolute;
    width: 32rpx;
    height: 16rpx;
    background-image: url('http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/icons/light_draw.png');
    background-repeat: no-repeat;
    background-size: contain;
    top: 50%;
    transform: translateY(-50%);
    left: 12rpx;
  }
  
  .flex-83 {
    flex: 0 0 83rpx;
  }
  // 表头
  .table-head {
    background: linear-gradient(
        156.17deg,
        rgba(30, 62, 66, 0.12) 6.26%,
        rgba(30, 62, 66, 0) 89.59%
      ),
      #f9f9f9;
  }
  // 表体
  .table-body {
    padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
    height: calc(
      100vh - 64px - 68rpx - 64rpx - 73px - 69rpx - env(safe-area-inset-bottom) -
        32rpx
    );
    overflow: auto;
    .hole-column {
      background: $white;
      color: #c4c4c4;
    }
    .score-tr {
      color: #535353;
      &:nth-child(odd) {
        background: $white;
      }
      &:nth-child(even) {
        background: $bg-col-f9;
      }
    }
  }
  .count-box {
    .td-cell {
      &:nth-child(odd) {
        background: $bg-col-f9;
      }
      &:nth-child(even) {
        background: #f6f7f7;
      }
    }
  }

  .gray-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
// E 表格

.total-active {
  background: $sub-color;
}
.cs {
	height: 36rpx!important;
	line-height: 36rpx;
}
.have-score {
  background: linear-gradient(90deg, rgba(255, 119, 119, 0) 0%, rgba(255, 119, 119, 0.1) 51.56%, rgba(255, 119, 119, 0) 100%);
	color: #FF7777;
	font-size: 22rpx;
	@include rubikVar(400);
}
</style>
