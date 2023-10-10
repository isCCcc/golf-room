<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="page">
    <!-- S 自定义导航 -->
    <GNavbar fixed
             title="出发排名"
             class="g-nav-bar" />
    <!-- E 自定义导航 -->
    <view class="rank-top">
      <view class="d-flex rank-top-container">
        <text class="fs-24 fw-400 col-999 mt-32"
              v-if="!haveHistory && !drawLotsList.length">滑动球手调整顺序</text>
<!--        <view v-if="haveHistory"
              @click="handleHistory">
          <view class="icon icon-40"></view>
          <view class="fs-24 fw-400 mt-6">历史</view>
        </view> -->
        <view class="tab"
              v-if="drawLotsList.length">
          <view class="tab-cell col-999 fw-500 fs-20"
                :class="[isTab === 0? 'active': '']"
                @click="isTab = 0"
                >手动顺序</view>
          <view class="tab-cell col-999 fw-500 fs-20"
                :class="[isTab === 1? 'active': '']" @click="handleChaDian">差点排序</view>
        </view>

<!--        <view @click="handleChaDian">
          <view class="icon icon-50"></view>
          <view class="fs-24 fw-400 mt-6">差点</view>
        </view> -->
      </view>
      <view v-if="isTab == 0 && (drawLotsList.length || haveHistory)"
            class="mt-26"><text class="fs-24 fw-400 col-999">滑动球手调整顺序</text></view>
      <view v-else-if="isTab == 1"
            class="mt-26 tr"><text class="fs-24 fw-400 col-999">差点</text></view>

    </view>

    <view class="d-flex bg-white">
      <view class="sort-rank">
        <template v-for="item in renderList.length">
          <view :key="item"
                class="h-120 flex-center col-999">{{item + 1}}</view>
        </template>
      </view>
      <view class="flex-1">
        <DragSorts v-if="isTab == 0"
                  :list="renderList"
                   :rowHeight="rpx2px(120)"
                   autoScroll="false"
                   longTouch="false"
                   :listHeight="listHeight"
                   @confirm="sortChange" />
        <view v-else>
          <view v-for="(item, index) in chadianSortList" class="chadian flex h-120">
            <image :src="item.icon" mode="widthFix" class="icon"  />
            <text class="fs-24 fw-400 col-black text-over flex1">{{item.name}}</text>
            <text class="fs-24 fw-400 col-black ml-16 mr-40">{{item.hcp? item.hcp : '?'}}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="flex-center bottom-container"
          v-if="isShowStop || isShowChou">
      <view class="box">
        <view v-if="isShowStop"
              class="stop"
              @click="handleStop">停</view>
        <view v-if="isShowChou"
              class="chou"
              @click="handleChou"></view>
      </view>

    </view>

    <view class="fixed-bottom">
      <button class="button sub fw-600"
              @click="handleSub"
              :loading="confirmLoading">
        {{isTab == 0 ? '确认并返回' : '按差点排序'}}
      </button>
    </view>

    <AlmostModal ref="almost"
                 @change="handleChange"></AlmostModal>
    <HistoryModal ref="historyModal" :list="historyList"/>
    <!-- /历史排序 -->
  </view>
</template>
<script>
// components
import GNavbar from '@/components/g-navbar/index.vue';
import DragSorts from './components/HM-dragSorts/HM-dragSorts.vue';
import AlmostModal from './components/almost-modal/index.vue';
import HistoryModal from './components/history-modal/index.vue';
// vuex
import { mapState, mapMutations } from 'vuex';
// api
import { getStartPlayerListHistory } from '@/api/pk/index';
export default {
  components: {
    GNavbar,
    DragSorts,
    AlmostModal,
    HistoryModal
  },
  data() {
    return {
      isTab: 0, // 默认是0
      confirmLoading: false,
      drawLotsList: [], // 抽签数据
      renderList: [], // 当前的排序数据
      isShowStop: false, // 是否显示抽签停止
      isShowChou: false, // 是否显示抽签
      timer: null,
      historyList: [], // 历史列表数据
      chadianSortList:[], //差点排序
    };
  },
  computed: {
    ...mapState({
      pkInfo: (state) => state.pk.pkInfo,
      competitionData: (state) => state.chatRoom.competitionData
    }),
    listHeight() {
      return uni.upx2px(this.renderList.length * 120);
    },
    haveHistory(){
      return !!this.historyList.length
    }
  },
  mounted() {
    this.init();
    this.getHistory();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapMutations(['SET_PK_KEY']),
    // 获取历史排名数据
    async getHistory() {
      let params = {
        competition_group_pk_id: this.pkInfo.competition_group_pk_id
      };
      let res = await getStartPlayerListHistory(params);
      this.historyList = res.data?.data || [];
    },
    // 历史记录
    handleHistory() {
      this.$refs.historyModal.open();
    },
    back() {
      uni.navigateBack();
    },
    init() {
      const { start_player, start_player_display } = this.pkInfo;
      if (start_player?.length) {
        const drawLotsList =
          start_player_display && start_player_display.length
            ? start_player_display.reduce((acc, cur) => {
                const flag = this.competitionData.competitor_list.find(
                  (e) => e.competitor_id == cur
                );
                if (flag) {
                  acc.push({
                    icon: flag.avatar_url,
                    competitor_id: flag.competitor_id,
                    hcp: flag.hcp,
                    name: flag.username
                  });
                }
                return acc;
              }, [])
            : [];
        this.drawLotsList = drawLotsList;

        const data = start_player.reduce((acc, cur) => {
          const flag = this.competitionData.competitor_list.find(
            (e) => e.competitor_id == cur
          );
          if (flag) {
            acc.push({
              icon: flag.avatar_url,
              competitor_id: flag.competitor_id,
              hcp: flag.hcp,
              name: flag.username
            });
          }
          return acc;
        }, []);
        // 对比两个数据是否相同
        if (!start_player_display.length) {
          // 还没抽签过
          this.isShowChou = true;
        }
        if (start_player_display && start_player_display.length) {
          const isAll = start_player_display.every(
            (e, idx) => start_player[idx] == e
          );
          //this.isTab = isAll ? 1 : 0;
        }
        this.renderList = data;

        return;
      }
      this.initDefault();
    },
    initDefault() {
      const data = this.competitionData.competitor_list.map((e) => {
        return {
          icon: e.avatar_url,
          competitor_id: e.competitor_id,
          hcp: e.hcp,
          name: e.username
        };
      });
      this.renderList = data;
      this.isShowChou = true;
    },
    // 排序事件
    sortChange({ list }) {
      this.renderList = list;
      //this.isTab = 1;
    },
    handleSub() {
      this.confirmLoading = true;
      if (this.isTab) {
        this.renderList = this.chadianSortList
      }
      let { player, desc } = this.renderList.reduce(
        (acc, cur) => {
          let { player, desc } = acc;
          player.push(cur.competitor_id);
          desc = `${desc}${desc.length ? '/' : ''}${cur.name}`;

          return { player, desc };
        },
        { player: [], desc: '' }
      );
      this.pkInfo.start_player = player;
      this.pkInfo.start_desc = desc;
      this.pkInfo.start_player_display = this.drawLotsList.map(
        (e) => e.competitor_id
      );

      this.SET_PK_KEY({
        key: 'pkInfo',
        data: this.pkInfo
      });
      this.back();
    },
    handleStop() {
      clearInterval(this.timer);
      this.isShowStop = false;
      this.drawLotsList = this.renderList;
    },
    handleChou() {
      this.isShowStop = true;
      this.isShowChou = false;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.renderList.sort(function () {
          return Math.random() - 0.5;
        });
      }, 1000);
    },
    handleReset() {
      if (!this.isTab) return false;
      this.renderList = [...this.drawLotsList];
      this.isTab = 0;
    },
    handleChaDian() {
      this.isTab = 1
      // this.$refs.almost.open(this.renderList);
      let list = [...this.renderList];
      list.sort((a, b) => a.hcp - b.hcp);
      this.handleChange(list)
    },
    handleChange(val) {
      this.chadianSortList = [...val];
      // this.isTab = 0;
    },
    rpx2px(rpxVal) {
      console.log(uni.upx2px(rpxVal))
      return uni.upx2px(rpxVal)
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: calc(96rpx + 32rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}
.top {
  padding: 22rpx 32rpx;
  justify-content: space-between;
  align-items: flex-end;
}
.icon {
  width: 40rpx;
  height: 29rpx;
  &.icon-40 {
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/icons/icon-40.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  &.icon-50 {
    width: 44rpx;
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/icons/icon-50.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
.rank-top {
  padding: 32rpx;
  .rank-top-container {
    justify-content: center;
    align-items: center;
  }
  .tab {
    width: 480rpx;
    height: 68rpx;
    padding: 4rpx;
    display: flex;
    background: rgba(118, 118, 128, 0.12);
    border-radius: 4rpx;
    .tab-cell {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1rpx solid transparent;
      &.active {
        background: #ffffff;
        border: 1rpx solid rgba(0, 0, 0, 0.04);
        box-shadow: 0px 3rpx 8rpx rgba(0, 0, 0, 0.12),
          0px 3rpx 1rpx rgba(0, 0, 0, 0.04);
        border-radius: 4rpx;
      }
    }
  }
}
.sort-rank {
  width: 74rpx;
}

button.button {
  height: 96rpx;
  line-height: 96rpx;
}
button.button.sub {
  margin: 0 32rpx;
}
.bottom-container {
  flex: 1;
}
.box {
  .stop {
    width: 238rpx;
    height: 238rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    font-weight: 400;
    color: #000000;
    background: #95d171;
    border-radius: 50%;
  }
  .chou {
    width: 404rpx;
    height: 404rpx;
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/icons/chou.gif');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
  }
}
.chadian {
  border-bottom: 1rpx solid #E9E9E9;
  &:last-child {
    border-bottom: unset;
  }
  .icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 13px;
    margin-left: 12px;
  }
}
</style>