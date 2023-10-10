<template>
  <view class="page root">
    <view class="top-bg">
      <Gnavbar title="观赛历史" />
    </view>
    <scroll-view scroll-y="true" class="content" @scrolltolower="loadMore" @scroll="scrollviewScroll">    
      <view v-if="historyList.length > 0" class="mt-32"></view>
      <view
        class="plr-32 mb-20"
        v-for="item in historyList"
        :key="item.competition_id"
        @click="handleRoom(item)"
      >
        <uni-swipe-action class="item-wrapper">
          <uni-swipe-action-item 
                                  :autoClose="false" 
                                  :show="shouldShow(item)" 
                                  @change="handleSwipeChange($event, item)">

            <Card :info="item" />

            <template v-slot:right>
              <view class="swipe-del" @click.stop="handleDel(item)">
                <view class="swipe-del-icon"></view>
              </view>
            </template>
            
          </uni-swipe-action-item>
        </uni-swipe-action>
        
      </view>
      <view class="flex flex-center col-999" v-if="noMore">
        没有更多了...
      </view>
      <view class="safe-bottom"></view>
    </scroll-view>
  </view>
</template> 

<script>
import { exitWatching } from "@/api/competition";
import { getWatchedList } from "@/api/competition/index";
import Gnavbar from "@/components/g-navbar/index.vue";
import Card from "@/pages/common/components/cards/card-watch/index.vue";

export default {
  components: {
    Card,
    Gnavbar,
  },
  data() {
    return {
      historyList: [],
      noMore: false,
      loading: false,
      query: {
        start: 0,
        count: 10,
        // status: "", // 0-未开始，1-进行中，2-已结束
      },
      swipeShowStatus: {},
    };
  },
  onLoad() {
    this.getCompetitionHistorys();
  },
  
  methods: {
    async getCompetitionHistorys({ resetStart } = { resetStart: true }) {
      if (resetStart) {
        this.query.start = 0;
      }
      try {
        const { data: res } = await getWatchedList(this.query);
        console.log("getWatchedList~~ ", res);
        if (res.code === 0) {
          const list = res.data.list;
          if (list.length < this.query.count) {
            this.noMore = true;
          }
          if (!resetStart) {
            this.historyList = [...this.historyList, ...list];
          } else {
            this.historyList = list;
          }
          this.loading = false;
        } else {
          this.noMore = true;
        }
      } catch (error) {
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
    handleRoom(val) {
      this.swipeShowStatus = {};
      uni.navigateTo({
        url: `/pages/chat-room/index/index?id=${val.competition_id}`,
      });
    },

    handleSwipeChange(e, val) {
      if (e !== 'none') {
        var status = {}
        status.id = val.competition_id;
        status.show = e;
        this.swipeShowStatus = status;
      }
    },

    async handleDel(val) {

      try {
        const ret = await exitWatching({ competition_id: val.competition_id });
        if (ret?.data?.data == true) {
          // 从 UI 删除
          const list = [...this.historyList]
          for (let index = this.historyList.length - 1; index >= 0; index--) {
            const item = this.historyList[index];
            if (item.competition_id === val.competition_id) {
              this.historyList.splice(index, 1)
            }
          }
        }

      } catch (e) {
        console.error("Exist with error", e);
      }
    },

    shouldShow(val) {
      return this.swipeShowStatus.id == val.competition_id ? this.swipeShowStatus.show : 'none'
    },

    scrollviewScroll() {
      this.swipeShowStatus = {};
    },
  },
};
</script>
<style lang="scss" scoped>

/*根元素需要有固定的高度*/
.root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;  
  overflow: hidden;
}

.top-bg {
  // position: relative;
  width: 100%;
  z-index: 999;
  background: linear-gradient(180deg, rgba(30, 36, 31, 0.5) 0%, #003c3d 100%),
    url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/user-bg2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.content {
  flex: 1;
  overflow: scroll;
}

.safe-bottom {
  @include safearea(0rpx);
}

.item-wrapper {
  box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
}

.swipe-del {
  width: 134rpx;
  margin-left: 8rpx;

  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(194.14deg, rgba(255, 119, 119, 0.2) 0%, rgba(255, 119, 119, 0.1) 100%);
  // box-shadow: 0px 4px 30px rgba(57, 80, 69, 0.08);
  border-radius: 4rpx;

  .swipe-del-icon {
    width: 44rpx;
    height: 44rpx;
    background: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_del_red.svg");
    background-size: 100% 100%;
  }
}
</style>
