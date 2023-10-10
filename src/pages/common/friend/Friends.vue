<template>
  <view class="page root">
    <GNavbar class="nav" title="互动列表" />
    <view class="content-box">
      <!-- 分段 -->
      <view class="segment">
        <view class="switch-wrapper">
          <view v-for="(item, index) in items" 
                :key="item.type" 
                :class="['item', item.type === currentItem.type ? 'selected' : '', 'item-' + index]" 
                @click="switchItem(index)"
                >
                {{ item.title }}
          </view>
          <view class="indicator" 
                :style="{ transform: `translate(${indicatorTranslate}px)`, 'transition-duration': (indicatorTranslateDuration || 'inherit')  }">
          </view>
        </view>
<!--        <view class="name-filter-wrapper">
          <view class="input-wrapper">
            <image class="icon-search" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/search.png"></image>
            <input
              class="username-input"
              confirm-type="search"
              @confirm="handleSearch"
              @input="nameInput"
              placeholder="搜索用户" />
          </view>
        </view> -->
      </view>
      
      <view class="filter-wrapper">
        <view
          v-for="item in filters"
          class="filter-item tc"
          :class="{active: filterData.sort === item.value}"
          :key="item.value"
          @click="switchFilter(item.value)">{{item.label}}
        </view>
      </view>
      
      <!-- 列表 -->
      <swiper class="swiper" :current="current" :duration="300" @change="onSwiperChange">
        <swiper-item v-for="item in items" :key="item.type">
          <FriendsUserList :listItem="item" 
                            :safeBottom="listSafeBottom"
                            :type="filterData.sort"
                            @loadMoreTriggered="loadMoreTriggered"
                            @changeFollow="handleChangeFollow"/>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
import { getFansList, getFollowingList, followUser, unfollowUser } from '@/api/user'
import GNavbar from '@/components/g-navbar/index.vue'
import { mapGetters } from 'vuex'
import FriendsUserList from '../components/FriendsUserList.vue'

const TAB_ITEM = {
  FOLLOWING: {
    type: 'following',
    title: '关注'
  },
  FANS: {
    type: 'fans',
    title: '粉丝'
  },
}

export default {
  components: { GNavbar, FriendsUserList },
  data() {
    return {
      items: [
        {
          type: 'following',
          title: '关注',
          fetchFunc: getFollowingList,
          list: [],
          emptyTitle: '暂无关注的人',
          noMore: false,
        }, {
          type: 'fans',
          title: '粉丝',
          fetchFunc: getFansList,
          list: [],
          emptyTitle: '暂无关注你的人',
          noMore: false,
        },
      ],
      filters: [
        {
          label: '名称排序',
          value: 1
        }, {
          label: '同组次数',
          value: 2
        }, {
          label: '差点排序',
          value: 3
        }
      ],
      filterData: {
        username: '',
        sort: 1
      },
      current: 0,
      indicatorTranslate: 0,
      indicatorTranslateDuration: '',
      listSafeBottom: 0,
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
      userInfoInStore: 'user/userInfo',
    }),
    displayingList() {
      return this.currentItem.list;
    },
    currentItem() {
      return this.items[this.current]
    }
  },
  beforeMount() {
    this.current = 0;
  },
  mounted() {
    const res = uni.getSystemInfoSync();
    this.listSafeBottom = res.safeAreaInsets.bottom;
    this.moveIndicatorFor(this.current, false);

    this.loadData(true);
  },

  methods: {
    switchItem(index) {
      this.current = index;
      this.moveIndicatorFor(index)
      const item = this.items[index]
      if (item.list.length < 1 && item.noMore == false) {
        this.loadData();
      }
    },

    moveIndicatorFor(index, animate = true) {
      /**
       * 通过查询 DOM 来获取位置。
       */
      const scope = this;
      uni
        .createSelectorQuery()
        .in(scope)
        .select(`.item-${index}`)
        .boundingClientRect((itemRect) => {
          if (itemRect == undefined) return;
          uni
            .createSelectorQuery()
            .in(scope)
            .select(".indicator")
            .boundingClientRect(indicatorRect => {
              if (indicatorRect == undefined) return;

              const outOffset = (itemRect.width - indicatorRect.width) / 2.0;

              scope.indicatorTranslate = itemRect.left + outOffset;
              if (animate) scope.indicatorTranslateDuration = '0.15s'
            })
            .exec()
        })
        .exec()
    },

    onSwiperChange(e) {
      if (e.detail.source === 'touch') {
        this.switchItem(e.detail.current)
      }
    },

    loadMoreTriggered() {
      this.loadData();
    },

    loadData(refresh = false) {
      const item = this.currentItem; // 获取操作对象，防止异步带来问题
      if (item.noMore && !refresh) return;
      const count = 20;
      item.fetchFunc({
        start: refresh ? 0 : item.list.length,
        count: count,
        sort: this.filterData.sort,
        username: this.filterData.username
      }).then(({ data: { data } }) => {
        const retList = data.list;
        if (retList.length < count) {
          item.noMore = true;
        };

        // 数据补充，后期字段返回了，可以考虑去掉。
        retList.forEach((listItem) => {
          if (listItem.is_follow == undefined) { // 未返回，补充
            listItem.is_follow = item.type === 'follow' ? true : false;
          }
          if (listItem.is_fans == undefined) { // 未返回，补充
            listItem.is_fans = item.type === 'fans' ? true : false;
          }
        })
        if (refresh) {
          item.list = retList
        } else {
          item.list.push(...retList)
        }
      })
    },

    handleChangeFollow(user, listItem) {
      function changeFollowState(user, lists) {
        lists.forEach((list) => {
          list.forEach((listItem) => {
            if (listItem.uid == user.uid) {
              listItem.is_follow = !user.is_follow
            }
          })
        })
      }
      const gl = false;
      const apiPromise = user.is_follow ? unfollowUser : followUser;
      apiPromise({ friend_uid: user.uid}, gl).then(({ data: { data } }) => {
        changeFollowState(user, this.items.map((item) => { return item.list }));
      });
    },
    
    switchFilter(sort) {
      this.filterData.sort = sort
      this.loadData(true)
    },
    nameInput(e) {
      this.filterData.username = e.detail.value.replace(/\s+/g, '')
    },
    handleSearch() {
      this.loadData(true)
    }
  },
}
</script>

<style lang="scss" scoped>
.root {
  height: 100vh;

  display: flex;
  flex-direction: column;

}
.nav {
  z-index: 999;
}

.content-box {
  flex: 1;
  box-sizing: border-box;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  .segment {
    height: 96rpx;
    background: #FFF;
    z-index: 1; // 为了凸显 shadow

    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04);
    
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    position: relative;
    
    .switch-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 260rpx;
      .item {
        font-weight: 600;
        font-size: 30rpx;
        line-height: 42rpx;
        color: #999999;
      
        display: flex;
        align-items: center;
        text-align: center;
        
        &.selected {
          color: #1E3E42;
        }
      }
      .indicator {
        width: 60rpx;
        height: 4rpx;
        position: absolute;
        left: 0;
        bottom: 0;
        background: #1E3E42;
      }
    }
    
    .name-filter-wrapper {
      width: 252rpx;
      .input-wrapper {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 220rpx;
        height: 60rpx;
        background: #F9F9F9;
        border: 1px solid #E4E4E4;
        border-radius: 66rpx;
        margin-top: 14rpx;
        padding: 0 38rpx;
        .icon-search {
          width: 60rpx;
          height: 24rpx;
        }
        .username-input {
          color: #999;
          font-size: 24rpx;
          margin-left: 18rpx;
        }
      }
    }
  }
  
  .filter-wrapper {
    box-sizing: border-box;
    width: 608rpx;
    height: 68rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 2rpx;
    margin: 20rpx auto;
    background: rgba(118, 118, 128, 0.12);
    border-radius: 4rpx;
    .filter-item {
      width: 200rpx;
      height: 60rpx;
      line-height: 60rpx;
      color: #999;
      font-size: 24rpx;
      background-color: transparent;
      &.active {
        color: #000;
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.04);
        box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.12), 0px 3px 1px rgba(0, 0, 0, 0.04);
        border-radius: 4rpx;
      }
    }
  }
  
  .swiper {
    height: 100%;
  }
}
</style>
