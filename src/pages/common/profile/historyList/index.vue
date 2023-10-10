<template>
  <view class="page root">
    <view class="timeline"></view>
    <view class="top-bg">
      <Gnavbar title="球局记录" />
    </view>
    <scroll-view scroll-y="true" class="scroll-root" @scrolltolower="loadMore">
      <view 
      v-for="(group, gIndex) in groupedHistoryList"
      :key="group.groupName">
        <view class="group-banner rubik fs-28 fw-400">
          {{ group.groupTitle }}
        </view>
        <view
          class="plr-32"
          v-for="(item, index) in group.groupArr"
          :key="item.competition_id" 
          @click="handleRoom(item)"
        >
          <Card :info="item" @del="handleItemNeedDel"/>
        </view>
        <!-- For sticky -->
        <view v-if="gIndex != groupedHistoryList.length - 1" :style="{ height: '32rpx', 'background-color': 'transparent'  }"></view>
      </view>
      <view class="flex flex-center col-999" v-if="noMore">
        没有更多了...
      </view>
      <view class="safe-bottom"></view>
    </scroll-view>
    
    <uni-popup
      ref="delPopup"
      type="center"
      background-color="#fff0" 
      @maskClick="showDeletePopup = false">
    		<view class="modal-wrapper">
          <view class="modal-content-wrapper">
            <text class="tc fs-34 fw-500 ff-pingfang-sc col-black">确定要删除比赛吗？</text>
            <text class="tc fs-30 fw-400 ff-pingfang-sc col-999">删除比赛不可恢复！</text>
          </view>
          <view class="modal-separator col-black"></view>
          <view class="modal-option-wrapper">
            <text class="modal-option col-black" @click="this.$refs.delPopup.close()">不删除</text>
            <view class="modal-option-separator"></view>
            <text class="modal-option col-red" @click="handleItemDel">删除</text>
          </view>
        </view>
    </uni-popup>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import { getCompetitionHistoryList } from "@/api/competition/index";
import Gnavbar from "@/components/g-navbar/index.vue";
import Card from "@/pages/common/components/cards/card-history/index.vue";
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import uniPopup from '@/components/uni-popup/uni-popup';

// api
import { delCompetition } from '@/api/competition';

export default {
  components: {
    Card,
    Gnavbar,
    uniPopup,
  },
  data() {
    return {
      groupedHistoryList: [],
      noMore: false,
      loading: false,
      query: {
        start: 0,
        count: 10,
        // status: "", // 0-未开始，1-进行中，2-已结束
      },
      showDeletePopup: false,
      itemToDel: undefined,
    };
  },
  onLoad() {
    this.getCompetitionHistorys();


    const scope = this;

    this.onGREvent('competitor_del', (competitorId, competitionId) => {
      const competitions = scope.groupedHistoryList.reduce((sum, groupedHistory) => {
        sum.push(...groupedHistory.groupArr);
        return sum;
      }, [])
      const competition = competitions.find((com) => {
        return com.competition_id === competitionId
      })
      if (competition === undefined) return;

      const competitor = competition.competitor_list?.find((com) => {
        return com.competitor_id == competitorId
      })
      if (competitor === undefined) return;

      if (competitor.uid === scope.userInfo.uid)
      this.removeCompetitionFromList(competitionId)
    })
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    })
  },
  methods: {
    async getCompetitionHistorys({ resetStart } = { resetStart: true }) {
      if (resetStart) {
        this.query.start = 0;
      }
      try {
        const { data: res } = await getCompetitionHistoryList(this.query);
        console.log("getCompetitionHistoryList~~ ", res);
        
        if (res.code === 0) {
          const list = res.data.list;
          if (list.length < this.query.count) {
            this.noMore = true;
          }
          
          this.processData(list, resetStart)
          
          this.loading = false;
        } else {
          this.noMore = true;
        }
      } catch (error) {
        console.error(error);
        this.noMore = true;
        this.loading = false;
      }
    },
    loadMore() {
      console.log("触底了~~");
      if (this.noMore || this.loading) return;
      this.query.start += this.query.count;
      this.getCompetitionHistorys({ resetStart: false });
    },
    processData(list, clear = false) {
      if (clear) {
        this.groupedHistoryList.length = 0;
      }
      
      list.forEach((info) => {
        const dj = dayjs(info.start_time).locale('zh-cn');
        // `groupName` for sorting
        const groupName = dj.format('YYYYMM')
        var group = this.groupedHistoryList.find((group) => { return group.groupName === groupName });
        if (group == undefined) {
          group = {};
          group.groupName = groupName;
          // `groupTitle` for displaying
          group.groupTitle = dj.format('YYYY年MMM')
          group.groupArr = [];
          this.groupedHistoryList.push(group)
        }
        group.groupArr.push(info)
      })
      
      // 组排序
      this.groupedHistoryList.sort((lg, rg) => { return rg.groupName.localeCompare(lg.groupName) });
      // 组内排序
      this.groupedHistoryList.forEach((group) => {
        group.groupArr.sort((l, r) => { return r.start_time.localeCompare(l.start_time) });
      })
    },
    removeCompetitionFromList(competitionId) {
      const groupList = this.groupedHistoryList;
      for (var gIndex = groupList.length - 1; gIndex >= 0 && gIndex < groupList.length; gIndex--) {
        const group = groupList[gIndex];

        const groupArr = group.groupArr
        for (var index = groupArr.length - 1; index >= 0 && index < groupArr.length; index--) {
          const item = groupArr[index];
          if (item.competition_id == competitionId) {
            groupArr.splice(index, 1);
          }
        }

        if (group.groupArr.length < 1) {
          groupList.splice(gIndex, 1);
        }
      }
    },
    handleRoom(val) {
      uni.navigateTo({
        url: `/pages/chat-room/index/index?id=${val.competition_id}`,
      });
    },
    handleItemNeedDel(item) {
      this.itemToDel = item;
      this.$refs.delPopup.open();
    },
    async handleItemDel() {
      const competition = this.itemToDel
      this.$refs.delPopup.close();

      this.removeCompetitionFromList(competition.competition_id)

      uni.showLoading({
        title: "删除中"
      });
      try {
        const result =  await delCompetition({
          competition_id: competition.competition_id
        });
        uni.hideLoading();
        

      } catch (error) {
        uni.showToast({
          title: "请稍后重试",
          icon: "error",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
}

.timeline {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  margin-left: 49rpx;
  width: 0rpx;
  height: 100%;
  border: 1px solid #EDEDED;
}

.top-bg {
  position: relative;
  width: 100%;
  background: linear-gradient(180deg, rgba(30, 36, 31, 0.5) 0%, #003c3d 100%),
    url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/user-bg2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.scroll-root {
  flex: 1;
  overflow: scroll;
  min-height: 0px;
}

.group-banner {
  z-index: 1;
  position: sticky;
  top: -0.5rpx; // 防止有缝隙
  padding: 14rpx 32rpx;
  background-color: $br-col-ed;
}
.safe-bottom {
  @include safearea(0rpx);
}

.modal-wrapper {
  display: flex;  
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  /* 功能色/中性色/White */
  background: #FFFFFF;
  border-radius: 4rpx;
}
.modal-content-wrapper {
  // position: absolute;
  box-sizing: border-box;
  width: 640rpx;

  display: flex;  
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 46rpx 48rpx;
  gap: 32rpx;

  /* 功能色/中性色/White */
  background: #FFFFFF;
  border-radius: 4rpx;
}
.modal-separator {
  width: 100%;
  height: 1rpx;
  background-color: #e7e7e7;
}
.modal-option-wrapper {
  display: flex;
  flex-direction: row;
  gap: 26rpx;
  justify-content: space-between;
  // justify-items: space-between;
  // align-content: stretch;
  align-items: center;
  height: 112rpx;
}

.modal-option {
  height: 100%;
  width: auto;
  flex-grow: 1;
  flex-basis: 0;
  text-align: center; 
  line-height: 112rpx;

  font-size: 32rpx;
  font-weight: 500;
}
.modal-option-separator {
  width: 1rpx;
  height: 50%;
  background-color: #e7e7e7;
}
</style>
