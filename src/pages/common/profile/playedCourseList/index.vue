<template>
  <view class="page played-course-page">
    <view class="top-bg">
      <Gnavbar title="打过球场" />
    </view>
    <scroll-view scroll-y="true" class="content" @scrolltolower="loadMore">
      <view class="item-wrapper">
        <view
          class="record-item"
          v-for="item in courseList"
          :key="item.course_name">
          <view class="course-name">{{item.course_name}}</view>
          <view class="location">{{formatLocation(item.province, item.city)}}</view>
          <view class="badge">
            <view class="num-wrapper">
              <view class="no rubik">{{item.num}}</view>
              <view>次</view>
            </view>
            <view class="avg-wrapper">
              <text>平均杆</text>
              <text class="avg rubik">{{formatAvg(item.avg)}}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="flex flex-center col-999" v-if="noMore">
        没有更多了...
      </view>
      <view class="safe-bottom"></view>
    </scroll-view>
  </view>
</template>

<script>
import { getPlayedCourseList } from '@/api/user'
import Gnavbar from '@/components/g-navbar/index.vue'

export default {
  components: {
    Gnavbar
  },
  data() {
    return {
      uid: null,
      courseList: [],
      noMore: false,
      query: {
        start: 0,
        count: 10,
        uid: null
      },
      loading: false
    };
  },
  onLoad(option) {
    this.query.uid = option.uid
    this.getList()
  },
  methods: {
    formatLocation(pro, city) {
      return pro === city ? pro : `${pro} ${city}`
    },
    // 94.444000 => 94.444
    formatAvg(num) {
      num += ''
      let a = num.split('.')
      let t = a[1].replace(/0*$/, '')
      // 保留一位小数
      return a[0] + (t ? '.' + t.slice(0, 1) : '')
    },
    async getList() {
      if (this.noMore) return
      this.loading = true
      const { data: res } = await getPlayedCourseList(this.query)
      if (res.code === 0) {
        const list = res.data.list
        if (list.length < this.query.count) {
          this.noMore = true
        }
        this.courseList = [...this.courseList, ...list]
        this.loading = false
      } else {
        this.noMore = true
      }
    },
    loadMore() {
      if (this.noMore || this.loading) return
      this.query.start += this.query.count
      this.getList()
    }
  }
};
</script>
<style lang="scss" scoped>

.played-course-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;  
  overflow: hidden;

  .top-bg {
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
    padding: 45rpx 32rpx;
    .record-item {
      position: relative;
      padding: 44rpx;
      box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
      margin-bottom: 25rpx;
      .course-name {
        font-size: 32rpx;
        line-height: 1;
        margin-bottom: 19rpx;
        color: #000;
      }
      .location {
        font-size: 24rpx;
        line-height: 1;
        color: #999;
      }
      .badge {
        position: absolute;
        right: 20rpx;
        top: -9rpx;
        width: 150rpx;
        height: 141rpx;
        text-align: center;
        .num-wrapper {
          box-sizing: border-box;
          background-color: #9fbe3d;
          width: 80rpx;
          height: 96rpx;
          margin: 0 auto;
          font-size: 20rpx;
          color: #fff;
          padding-top: 16rpx;
          box-shadow: 0rpx 4rpx 16rpx rgba(159, 190, 61, 0.2);
          border-radius: 4rpx;
          line-height: 1;
          .no {
            font-size: 40rpx;
          }
        }
        .avg-wrapper {
          font-size: 24rpx;
          color: #999;
          margin-top: 18rpx;
          .avg {
            font-size: 28rpx;
            margin-left: 8rpx;
          }
        }
      }
    }
  }
}

</style>
