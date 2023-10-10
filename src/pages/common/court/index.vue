<template>
  <view>
    <GNavbar fixed title="球场" class="g-nav-bar"/>
    <view class="search" :style="[{ top: searchTop }]">
      <view class="search-inner">
        <uni-icons type="search" size="36rpx" />
        <input
          class="search-input"
          placeholder="搜索球场"
          v-model="keyword"
          @input="handleSearch"
        />
      </view>

      <view class="h-32"></view>

      <view v-if="keyword" class="search-result">
        “{{ keyword }}”{{ pagination.total }}个搜索结果
      </view>
      <view v-else class="tabs">
        <view
          v-for="(tab, tabIndex) in tabs"
          :key="tab"
          :class="['tab', { tab__active: tabCurrent === tabIndex }]"
          @tap="switchTab(tabIndex)"
        >
          {{ tab }}
        </view>
      </view>
    </view>

    <view v-show="isShowList" class="list">
      <CourtItem v-for="item in list" :key="item.course_id" :item="item" />
    </view>
    <CityList v-show="tabCurrent === 1 && !address" @select="onSelectCity" />
  </view>
</template>

<script>
import GNavbar from '@/components/g-navbar/index.vue'
import GCell from '@components/g-cell/index.vue'
import CourtItem from './components/court-item.vue'
import CityList from './components/city-list.vue'
import { getCourseList } from '@api/course'
import { tryGetRecentLocation } from '@/utils'

export default {
  components: {
    GNavbar,
    GCell,
    CourtItem,
    CityList,
  },
  data() {
    return {
      searchTop: 20 + 44,
      tabCurrent: 0,
      pagination: {
        start: 0,
        count: 20,
        total: 0,
        final: false,
      },
      list: [],
      keyword: '',
      location: null,
      listLoading: false,
      searchTimer: null,
      address: null,
    }
  },
  computed: {
    isShowList() {
      return this.tabCurrent === 0 || this.address
    },
    hasCityList() {
      return this.tabCurrent === 1 && this.address
    },
    tabs() {
      const list = ['附近', '城市']

      if (this.address) {
        list[1] = `城市 (${this.address.name})`
      }

      return list
    },
  },
  provide() {
    return {
      getLocation: () => this.location,
    }
  },
  mounted() {
    this.searchTop = uni.getSystemInfoSync().statusBarHeight + 44 + 'px'
  },
  onLoad() {
    this.getCourseList(true)
  },
  onUnload() {
    this.searchTimer && clearTimeout(this.searchTimer)
  },
  onReachBottom() {
    if (this.isShowList) this.getCourseList()
  },
  methods: {
    
    switchTab(index) {
      if (index === this.tabCurrent) {
        if (index === 1 && this.hasCityList) {
          this.address = null
          this.scrollToTop()
        }
        return
      }

      if (index === 0) this.onSelectCity(null)
      this.tabCurrent = index
      this.scrollToTop()
    },
    scrollToTop() {
      this.$nextTick(() => {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 0,
        })
      })
    },
    handleSearch() {
      this.tabCurrent = 0

      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }

      this.searchTimer = setTimeout(() => {
        this.getCourseList(true)
      }, 500)
    },
    onSelectCity(value) {
      this.address = value
      this.list = []
      this.getCourseList(true)
    },
    async getCourseList(reset) {
      if (this.listLoading) return

      if (!this.location) {
        this.location = await tryGetRecentLocation({}).catch(() => null)
      }

      if (reset) {
        this.pagination = {
          start: 0,
          count: 20,
          total: 0,
          final: false,
        }
      }

      if (this.pagination.final) return

      this.listLoading = true

      const { start, count } = this.pagination

      var reqData = {
        start,
        count,
        course_name: this.keyword,
        ...(this.keyword ? {} : this.address || {}),
      }

      // location 可能没有
      if (this.location) {
        reqData.lat = this.location?.latitude;
        reqData.lng = this.location?.longitude;
      }

      const { data: res } = await getCourseList(reqData).finally(() => {
        this.listLoading = false
      })

      if (!res.data) return

      const { list, total } = res.data
      this.pagination.total = total
      this.pagination.start += count
      this.pagination.final = list.length < count

      if (reset) {
        this.list = list
      } else {
        this.list.push(...list)
      }
    },
  },
}
</script>

<style lang="scss">
page {
  background-color: $bg-col-f5;
}
</style>

<style lang="scss" scoped>
.h-32 {
  height: 32rpx;
}

.search {
  position: sticky;
  top: 64px;
  background-color: #fff;
  padding: 24rpx 32rpx 0 32rpx;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  z-index: 3;
}

.search-inner {
  display: flex;
  align-items: center;
  height: 80rpx;
  background-color: #ededed;
  padding: 0 24rpx;
  border-radius: 4rpx;
}

.search-input {
  margin-left: 20rpx;
  font-size: 30rpx;
  flex: 1;
}

.search-result {
  color: #999999;
  font-size: 24rpx;
  line-height: 34rpx;
  padding-bottom: 24rpx;
}

.tabs {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab {
  font-size: 30rpx;
  color: #999;
  height: 42rpx;
  line-height: 42rpx;
  padding-bottom: 16rpx;
  position: relative;
  display: flex;
  align-items: center;

  + .tab {
    margin-left: 125rpx;
  }

  &::before {
    content: '';
    height: 4rpx;
    background-color: $theme-color;
    position: absolute;
    left: 50%;
    bottom: 0;
    opacity: 0;
    width: 0;
    transform: translateX(-50%);
    transition: 0.3s;
  }

  &.tab__active {
    color: $theme-color;
    font-weight: 600;
    &::before {
      width: 100%;
      opacity: 1;
    }
  }
}

.list {
  padding: 0 32rpx;
  box-sizing: border-box;
  background-color: #fff;
}
</style>
