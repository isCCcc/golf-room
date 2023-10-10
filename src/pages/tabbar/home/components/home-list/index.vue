<template>
  <view class="content" :style="{ '--h-gap': hGap}">
  
    <!-- 搜索 -->
    <uni-search-bar :readonly="!isLogin" ref="searchBar"
                    class="search-bar" 
                    radius="1rpx" 
                    bgColor="#EEEEEE" 
                    placeholder="输入房间号，或其它内容进行搜索" 
                    clearButton="auto" 
                    cancelButton="none" 
                    @confirm="handleSearch"
                    @blur="searchBlur" />

    <!-- 筛选 -->
    <view class="flex-between search plr-16">
      <RoomTabs :current.sync="roomCurrent" :list="RoomTabsList" duration="0.25" @change="handleRoomChange" />

      <golf-select
        class="home-select"
        v-model="query.filter"
        :localdata="filters"
        :clear="false"
        @change="handleSelecrChange"
        @toggleSelector="handleToggleSelector"
      ></golf-select>
    </view>

    <!-- 房间列表 -->
    <scroll-view
      :scroll-top="scrollTop"
      :lower-threshold="50"
      scroll-y="true"
      class="scroll-Y"
      id="room-scroll"
      @scrolltolower="handleLower"
      @scroll="scrollviewScroll"
    >
      <template>
        <template v-if="roomList.length">
          <view
            class="mt-4 mb-20"
            v-for="item in roomList"
            :key="item.competition_id"
            @click="handleRoom(item)"
          >
            <home-card-new  :info="item"
                            :hGap="hGap"
                            :couldSwipe="couldSwipe"
                            :swipeShowStatus="swipeShowStatus"
                            @del="handleDel"
                            @start="handleStart"
                            @swipeChange="handleSwipeChange" />
          </view>
          <view class="flex flex-center col-999 no-more" v-if="noMore"> 没有更多了... </view>
        </template>
        <!-- 创建房间 -->
        <unloginOrCreateRoomBox v-else :unLogin="!isAuth" @login="$emit('login')" />
        <!-- 创建房间 -->
      </template>
    </scroll-view>
    
  </view>
</template>

<script>
import HomeCardNew from '../home-card-new/index.vue'
import golfSelect from '@/components/golf-select/index.vue'
import unloginOrCreateRoomBox from './unloginOrCreateRoomBox'
import RoomTabs from './tabs/u-tabs.vue'
import { getCompetionList, getAllList } from '@/api/list/index'
import { getWatchingList } from '@/api/competition/index'

import { mapGetters } from 'vuex'

import { exitWatching } from '@/api/competition'
import { tryGetRecentLocation } from '@/utils'

export default {
  components: { HomeCardNew, golfSelect, unloginOrCreateRoomBox, RoomTabs },
  props: {},
  options: {
    styleIsolation: 'shared',
  },
  data() {
    return {
      // 水平方向上的 margin
      hGap: '32rpx',
      noMore: false,
      loading: false,
      scrollTop: -1,
      query: {
        start: 0, // 跳过了多少页
        count: 10,
        // status: '', // 0-未开始，1-进行中，2-已结束
        filter: '',  // 1-热门，2-附近, 3-好友
        lat: null, // 纬度
        lng: null, // 经度
      },
      filters: [
        { value: '', text: '所有房间' },
        { value: 1, text: '热门' },
        { value: 2, text: '附近' },
        { value: 3, text: '好友' },
      ],
      roomList: [],
      roomCurrent: 0, // 0 发现房间  1观赛房间 2所有房间（仅对内部人员开放）
      RoomTabsList: [{ name: '发现房间' }, { name: '观赛房间' }],
      swipeShowStatus: {},
      location: null,
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'user/isLogin',
      isAuth: 'user/isAuth',
      isWhiteList: 'user/isWhiteList',
      userInfo: 'user/userInfo',
    }),
    couldSwipe() {
      return this.roomCurrent === 0;
    },
  },
  watch: {
    isLogin: {
      handler(val) {
        if (val) {
          //登录有token在请求
          this.getCourseData({resetStart: true, gl: true})
          
          if (this.isWhiteList) {
            this.RoomTabsList.push({ name: '所有房间' })
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.onGREvent("home-touch-start", (e) => {
      const touch = e.changedTouches[0];
      if (touch) {
        uni
          .createSelectorQuery()
          .in(this)
          .select("#room-scroll")
          .boundingClientRect((rect) => {
            if (rect == null) {
              return;
            }
            if (touch.clientY < rect.top || touch.clientY > rect.bottom
              || touch.clientX < rect.left || touch.clientX > rect.right) {
                this.swipeShowStatus = {} // 手动关闭 swipe
            }
          })
          .exec()
      }
    });

    tryGetRecentLocation({});
  },
  methods: {
    onParentPageHide() {
      this.swipeShowStatus = {};
    },

    /**
     * @param resetStart {boolean|undefined}  刷新数据
     * @param gl {boolean|undefined}  是否展示 global loading toast
     * @param glWithEmpty {boolean|undefined}  默认情况下，gl 未定义，则根据数据是否为空来判断是否展示 gl
     */
    async getCourseData({ resetStart, gl, glWithEmpty } = { resetStart: undefined, gl: undefined, glWithEmpty: undefined }) {
      if (!this.isLogin) return
      
      // 默认参数修正：`resetStart`：ture，`gl`：false 
      if (resetStart === undefined) resetStart = true;
      if (gl === undefined) {
        // 检查数据是否为空，比如从房间退回来，不展示 global loading
        gl = (glWithEmpty === true && this.roomList.length > 0) ? false : true;
      }
      
      this.loading = true;

      // 如果是请求附近，尝试更新地理位置信息
      if (this.query.filter === 2) {
        const recentLocation = await tryGetRecentLocation({});
        this.query.lat = recentLocation?.latitude || null;
        this.query.lng = recentLocation?.longitude || null;
      }
      
      if (resetStart) {
        this.query.start = 0
      }
      
      if (!this.location) {
        this.location = await this.getLocation().catch(() => null)
      }
      
      if (this.location) {
        this.query.lat = this.location?.latitude;
        this.query.lng = this.location?.longitude;
      }
      console.log('location', this.location)
      
      let fn
      if (this.roomCurrent == 2) {
        fn = getAllList(this.query, gl)
      } else {
        fn =
          +this.roomCurrent === 0 ? getCompetionList(this.query, gl) : getWatchingList(this.query, gl)
      }
      
      try {
        const { data: res } = await fn
        if (res.code === 0) {
          const list = res.data.list
          list.forEach((item) => {
            item.isNearby = (item?.distance != null && item?.distance <= 150) ? true : false
          })
          this.noMore = list.length < this.query.count
          console.log('resetStart~  ,', resetStart)
          this.roomList = !resetStart ? [...this.roomList, ...list] : list
          
          
          this.loading = false

          this.$nextTick(() => {
            if (resetStart) {
              console.log(222, this.scrollTop)
              this.scrollTop = 0
            }
          })
        } else {
          this.noMore = true
        }
      } catch (error) {
        this.noMore = true
        this.loading = false
      }
    },
    handleLower() {
      if (this.noMore || this.loading) return
      this.query.start += this.query.count
      this.getCourseData({ resetStart: false, gl: true })
    },
    handleSelecrChange(val) {
      if (this.loading) return
      this.query.filter = val // 这个有bug 要赋值
      this.getCourseData({resetStart: true, gl: true})
      this.$emit('toggleSelector', false)
    },
    handleToggleSelector(val) {
      this.$emit('toggleSelector', val)
    },
    handleRoom(val) {
      uni.navigateTo({
        url: `/pages/chat-room/index/index?id=${val.competition_id}`,
      })
    },
    //发现房间 or 观赛房间
    handleRoomChange() {
      if (this.loading) return
      this.getCourseData({ gl: false, resetStart: true }) //切换房间不要吐司
    },
    searchBlur() { 
      this.$refs.searchBar.cancel();
    },
    async handleSearch(result) {
      this.$refs.searchBar.cancel();
      try {
        const { data: resp } = await getCompetionList({ 'competition_no': result.value }, true)
        var competition = resp?.data?.list?.find((data) => {
          return data.competition_no === result.value && data.competition_id != undefined
        })
        if (competition?.competition_id != undefined) { 
          uni.navigateTo({
            url: `/pages/chat-room/index/index?id=${competition.competition_id}`,
          })
        } else { 
          uni.navigateTo({
            url: `/pages/common/search/Search?k=${result.value}`,
          })
        }
      } catch(e) { 
        console.error("Searching with error", e)
        uni.showToast({ title: "找不到房间", icon: 'error' });
      }
    },

    scrollviewScroll() {
      this.swipeShowStatus = {};
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
          const list = [...this.roomList]
          for (let index = this.roomList.length - 1; index >=0; index--) {
            const item = this.roomList[index];
            if (item.competition_id === val.competition_id) {
              this.roomList.splice(index, 1)
            }
          }
        }
        
      } catch (e) {
        console.error("Exist with error", e);
      }
    },
    handleStart(val) {
      const list = [...this.roomList]
      for (let index = this.roomList.length - 1; index >=0; index--) {
        const item = this.roomList[index];
        if (item.competition_id === val.competition_id) {
          this.roomList[index].status = 1
        }
      }
    },
    async getLocation() {
      return new Promise((success, fail) => {
        uni.getLocation({
          isHighAccuracy: true,
          success,
          fail,
        })
      })
    },
  },
}
</script>
<style lang="scss" scoped>
/* 房间列表样式 */
.content {
  // width: 100%;
  height: 100%;

  padding-top: 10rpx;
  // padding-bottom: calc(120rpx + env(safe-area-inset-bottom));

  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search {
  margin-left: var(--h-gap);
  margin-right: var(--h-gap);
  margin-bottom: 10rpx;
}
.search-bar {
  // padding: unset;
  margin-left: var(--h-gap);
  margin-right: var(--h-gap);

  margin-top: 24rpx;
  margin-bottom: 16rpx;
}

::v-deep .uni-searchbar {
  padding: unset;
}

.plr-16 {
  padding-left: 16rpx;
  padding-right: 16rpx;
}
.scroll-Y {
  // height: calc(100vh - 600rpx - 50rpx - 120rpx - 40rpx - env(safe-area-inset-bottom));
  flex: 1;
  overflow: scroll;
}
/* 下拉框重置样式 */

::v-deep .uni-select__selector-item {
  font-size: 22rpx;
}
::v-deep .uni-select__input-text {
  font-size: 22rpx;
  font-weight: 500;
}
::v-deep .uni-stat__select {
  width: 150rpx !important;
  height: 51rpx;
}
::v-deep .uni-select {
  height: 51rpx;
  // padding: 10rpx 20rpx;
  background: #eeeeee;
  border: none !important;
  .uni-select__input-box {
    height: 51rpx !important;
  }
}

.no-more {
  padding-bottom: 30rpx;
}
</style>
