<template>
  <view>
    <UniNavBar
      title="选择半场"
      statusBar
      class="g-nav-bar"
      backgroundColor="transparent"
      color="#ffffff"
      :border="false"
      fixed
      left-icon="back"
      @clickLeft="back"
    />

    <view class="name">{{ course_name }}</view>

    <view class="wrapper">
      <view v-for="(course, index) in courseList" :key="index" class="col">
        <view class="row border-b head">
          <text class="head-icon">{{ course.icon }}</text>
          <view>{{ course.name }}</view>
        </view>
        <view class="row border-b tips">按选定{{ course.name }}场地</view>
        <view
          v-for="half in halfList"
          :key="half.course_half_court_id"
          class="row half"
          @tap="handleClickHalf(half.course_half_court_id, index)"
        >
          <g-checkbox
            :checked="selected[index] === half.course_half_court_id"
            :disabled="selected[index ? 0 : 1] === half.course_half_court_id"
          />
          <text class="half-name border-b">{{ half.half_court_name }}</text>
        </view>
      </view>
    </view>

    <button class="button" :disabled="disabled" @tap="onSubmit">确定保存</button>
  </view>
</template>

<script>
import UniNavBar from '@components/uni-nav-bar/uni-nav-bar.vue'
import { getCourseDetail } from '@api/course'

export default {
  components: {
    UniNavBar,
  },
  data() {
    return {
      course_id: '',
      course_name: '',
      selected: ['', ''],
      halfList: [],
      courseList: [
        {
          name: '前九',
          icon: 'OUT',
        },
        {
          name: '后九',
          icon: 'IN',
        },
      ],
    }
  },
  computed: {
    disabled() {
      return this.selected.some(item => !item)
    },
  },
  onLoad(option) {
    this.course_id = option.course_id
    this.course_name = option.course_name
    this.getCourseDetail()
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    getCourseDetail() {
      getCourseDetail(this.course_id).then(({ data: res }) => {
        const data = res.data[0]
        this.halfList = data.course_half_court_list
      })
    },
    handleClickHalf(id, index) {
      const orign = this.selected[index]
      const other = this.selected[index ? 0 : 1]

      if (other === id) return

      this.$set(this.selected, index, orign === id ? '' : id)
    },
    onSubmit() {
      uni.$emit('selectCourse', {
        course_id: this.course_id,
        course_name: this.course_name,
        course_half_court_ids: this.selected.join(','),
        course_half_court_names: this.selected.map(id => {
          return this.halfList.find(item => item.course_half_court_id === id)?.half_court_name
        }),
      })
      uni.navigateBack({
        delta: 2,
      })
    },
  },
}
</script>

<style lang="scss" scoped>

.name {
  font-size: 32rpx;
  line-height: 45rpx;
  padding: 26rpx 32rpx;
}

.wrapper {
  display: flex;
  gap: 14rpx;
}

.col {
  background: #ffffff;
  box-shadow: 0px 4px 30px rgba(57, 80, 69, 0.08);
  border-radius: 0px 4px 4px 0px;
  flex: 1;
}

.row {
  height: 96rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  font-size: 28rpx;
  line-height: 39rpx;
}

.head {
  &-icon {
    background-color: $theme-color;
    border-radius: 4rpx;
    height: 34rpx;
    width: 52rpx;
    line-height: 34rpx;
    margin-right: 8rpx;
    font-size: 20rpx;
    font-weight: 500;
    color: $sub-color;
    text-align: center;
  }
}

.tips {
  background-color: #f9f9f9;
  color: #999999;
}

::v-deep .checkbox {
  margin-right: 22rpx;
}

.half {
  padding-right: 0;
}

.half-name {
  line-height: 96rpx;
  flex: 1;
}

.button {
  height: 96rpx;
  line-height: 96rpx;
  margin: 96rpx 32rpx 32rpx 32rpx;

  &[disabled] {
    background-color: $theme-color;
    color: white;
    opacity: 0.2;
  }
}
</style>
