<template>
  <view class="page root">
    <GNavbar class="nav" title="搜索" />
    <view class="search-bar">
      <view class="search-top">
        <view class="search-inner">
          <uni-icons type="search" size="36rpx" />
          <input
            class="search-input"
            placeholder="输入关键字进行搜索"
            v-model="searchKeyWord"
            @input="handleInputChange"
          />
        </view>
      </view>
      <view class="search-bot"></view>
    </view>
    

    <!--  -->
    <scroll-view class="scroll-view" scroll-y @scrolltolower="onScrollToLower">
      <!-- 用户列表 -->
      <view v-if="displayingUsers.length > 0" class="group-title">
        <text class="title-keyword">{{ searchedKeyWord }}</text>
        <text class="title-subtitle">{{ '用户' }}</text>
      </view>
      <SearchUserCell v-for="(user, index) in displayingUsers" 
                      :key="user.uid" 
                      class="user-cell" 
                      :user="user"
                      :keyword="searchedKeyWord" />
      <!-- 用户加载更多 -->
      <view v-if="displayingUsers.length > 0 && noMoreDisplayingUsers == false" 
            class="user-more"
            @click="handleUserMore">
        <view class="user-more-title">展开查看更多用户</view>
        <view class="user-more-arrow"></view>
      </view>

      <!-- 球赛列表 -->
      <view v-if="competitions.list.length > 0" class="group-title">
        <text class="title-keyword">{{ searchedKeyWord }}</text>
        <text class="title-subtitle">{{ '房间' }}</text>
      </view>
      <!-- <view v-for="(competition, index) in competitions.list" :key="competition.id" class="competition-cell"> -->

      <view v-for="com in competitions.list" :key="com.competition_id"
            class="competition-cell-wrapper"
            @click="handleCompetitionClick(com)" >
        <HomeCardNew  :info="com"
                      :hGap="'32rpx'"
                      :couldSwipe="false" />
      </view>

      <view v-if="isEmpty" class="empty">
        <view class="ph-image"></view>
        <view class="ph-title">{{ '找不到内容，换个关键词试试？' }}</view>
      </view>

      <view class="flex flex-center col-999 safeBottom" v-if="showBottomNoMore">
        没有更多了...
      </view>
      <view v-else class="safeBottom"></view>
    </scroll-view>
  </view>
</template>

<script>
import GNavbar from '@/components/g-navbar/index.vue'
import UniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
import SearchMockMixin from '../mixins/SearchMixinMockData.js'
import GCell from '@components/g-cell/index'
import user from '@/store/modules/user'
import SearchUserCell from '../components/SearchUserCell.vue'
import HomeCardNew from '../../tabbar/home/components/home-card-new/index.vue'
import { searchCompetitions } from '@/api/competition/index'
import { searchUsers } from '@/api/user/index'

export default {
  components: { GNavbar, UniIcons, SearchUserCell, HomeCardNew },
  mixins: [SearchMockMixin],
  data() {
    return {
      searchKeyWord: undefined,
      searchedKeyWord: undefined,
      searchTimer: null,
      countOfUsersToDisplay: Infinity,
      users: {
        list: [],
        noMore: false,
      },
      competitions: {
        list: [],
        noMore: false,
      }
    }
  },
  computed: {
    displayingUsers() {
      return [...this.users.list].splice(0, this.countOfUsersToDisplay)
    },
    noMoreDisplayingUsers() {
      return (this.countOfUsersToDisplay === Infinity && this.users.noMore) // 当显示的数量不限制，同时没有了更多 API 数据。
              || (this.users.list.length <= this.countOfUsersToDisplay) // 当用户数据少于等于要显示的数量
    },
    showBottomNoMore() {
      if (this.competitions.noMore && this.competitions.list.length < 1) {
        if (this.noMoreDisplayingUsers == false) {
          return false;
        } 
      }
      return this.isEmpty == false && this.competitions.noMore;
    },
    isEmpty() {
      return this.users.list.length < 1 && this.competitions.list.length < 1
    }
  },
  onLoad(options) {
    if (options.k) {
      this.searchKeyWord = options.k;
      this.searchedKeyWord = this.searchKeyWord;
    }
  },
  mounted() {
    if (this.searchKeyWord) {
      this.beginFullSearch();
    }
  },

  onUnload() {
    this.searchTimer && clearTimeout(this.searchTimer)
  },

  methods: {
    async beginFullSearch() {
      return new Promise(async (resole, reject) => {
        uni.showLoading({
          title: "搜索中"
        });
        try {
          this.countOfUsersToDisplay = 3;
          await this.searchForUsers({ refresh: true , gl: false});
          await this.searchForCompetitions({ refresh: true, gl: false });

          // 如果没有比赛结果，展开显示所有用户
          if (this.competitions.list.length < 1) {
            this.countOfUsersToDisplay = Infinity
          }
        } catch (error) {
          console.error('beginFullSearch', error)
        }
        uni.hideLoading()
        resole();
      })
      
    },

    async searchForUsers({ start = 0, count = 20, refresh = false, gl = true}) {
      if (this.users.noMore && refresh == false) {
        return;
      }

      // { // Test code
      //   console.log('searchForUsers', this)
      //   const users = await this.mockUsersData({ start, count });
      //   this.users.list.push(...users);
      //   if (this.users.list.length > 10) {
      //     this.users.noMore = true;
      //   }
      //   return;
      // }

      const keyword = this.searchedKeyWord;
      const { data: { data } } = await searchUsers({ start: (refresh ? 0 : start), count, keyword }, gl)
      if (refresh) {
        this.users.list.length = 0;
        this.users.noMore = false;
      }
      this.users.list.push(...data.list);
      if (data.list.length < count) {
        this.users.noMore = true;
      }
    },

    async searchForCompetitions({ start = 0, count = 20, refresh = false, gl = true}) {
      if (this.competitions.noMore && refresh == false) {
        return;
      }
      
      // { // Test code
      //   const competitions = await this.mockCompetitionsData({ start, count });
      //   this.competitions.list.push(...competitions);
      //   if (this.competitions.list.length > 10) {
      //     this.competitions.noMore = true;
      //   }
      //   return;
      // }

      const keyword = this.searchedKeyWord;
      const { data: { data } } = await searchCompetitions({ start: (refresh ? 0 : start), count, keyword }, gl)
      if (refresh) {
        this.competitions.list.length = 0;
        this.competitions.noMore = false;
      }
      this.competitions.list.push(...data.list);
      if (data.list.length < count) {
        this.competitions.noMore = true;
      }
    },

    onScrollToLower() {
      this.searchForCompetitions({start: this.competitions.list.length})
    },

    handleInputChange(e) {
      const newKey = e.detail.value.trim();
      if (newKey.length < 1) {
        return;
      }

      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }

      this.searchTimer = setTimeout(() => {
        this.searchedKeyWord = newKey;
        this.beginFullSearch();
      }, 500)
    },

    handleUserMore() {
      if (this.countOfUsersToDisplay != Infinity) {
        this.countOfUsersToDisplay = Infinity
      } else {
        this.searchForUsers({start: this.users.list.length})
      }
    },

    handleCompetitionClick(com) {
      uni.navigateTo({
        url: `/pages/chat-room/index/index?id=${com.competition_id}`,
      });
    },
  },
}
</script>

<style lang="scss" scoped>
$gradient-view-height: 20rpx;

.root {
  background-color: $bg-col-f9;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  .nav {
    z-index: 10;
  }

  .search-bar {
    box-sizing: border-box;
    z-index: 2;

    display: flex;
    flex-direction: column;
    .search-top {
      background-color: #fff;

      .search-inner {
        margin: 32rpx 32rpx 0 32rpx;
        display: flex;
        align-items: center;
        height: 80rpx;
        background-color: #ededed;
        padding: 0 24rpx;
        border-radius: 4rpx;


        .search-input {
          margin-left: 20rpx;
          font-size: 30rpx;
          flex: 1;
        }
      }
    }
  
    .search-bot {
      height: $gradient-view-height;
      background: linear-gradient(
        180deg,
        rgb(255, 255, 255) 0%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  }

  .scroll-view {
    flex: 1;
    margin-top: calc(0px - $gradient-view-height);
    // background-color: white;
    overflow: scroll;

    .group-title {
      
      display: inline-flex;
      gap: 12rpx;
      margin: 20rpx 60rpx 0rpx 60rpx;
      font-weight: 600;
      font-size: 28rpx;
      line-height: 114%;
      .title-keyword {
        flex: 1;
        @include ell(1);
        color: #95D171;
      }
      .title-subtitle {
        color: #999999;
      }
    }

    .user-cell {
      height: 100rpx;
      background-color: red;
    }

    .user-more {
      margin: 14rpx 32rpx 20rpx 32rpx;
      padding-top: 20rpx;
      padding-bottom: 20rpx;
      background: #EDEDED;

      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4rpx;

      .user-more-title {
        font-weight: 400;
        font-size: 24rpx;
        line-height: 108.5%;
        color: #535353;
      }

      .user-more-arrow {
        width: 16rpx;
        height: 10rpx;
        background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_search_user_more_down_arrow.svg');
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }

    .competition-cell-wrapper {
      margin: 12rpx 0rpx 12rpx 0rpx;
      // background: #FFFFFF;
      // box-shadow: 0px 4rpx 30rpx rgba(57, 80, 69, 0.08);
      // border-radius: 4rpx;
    }


    .empty {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .ph-image {
        margin-top: 56%;

        width: 434rpx;
        height: 190rpx;
        background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/svg/img_emtp_ph.svg');
        background-size: 100%;
        background-repeat: no-repeat;
      }

      .ph-title {
        margin-top: 26rpx;
        font-weight: 400;
        font-size: 32rpx;
        line-height: 45rpx;
        color: #999999;
      }
    }
    .safeBottom {
      @include safearea(0rpx);
    }    
  }
}
</style>
