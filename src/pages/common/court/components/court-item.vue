<template>
  <view class="item border-b" @tap="handleClickItem">
    <view class="item-label">{{ item.course_name }}</view>
    <view class="item-distance">{{ distance(item) }}</view>
  </view>
</template>

<script>
import { getCourseDetail } from '@api/course'
import { getDistance } from '@utils/index'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  inject: ['getLocation'],
  computed: {
    distance() {
      return ({ lat, lng }) => {
        const local = this.getLocation?.()
        return local ? getDistance(local.latitude, local.longitude, Number(lat), Number(lng)) : ''
      }
    },
  },
  methods: {
    handleClickItem() {
      getCourseDetail(this.item.course_id).then(({ data: res }) => {
        const data = res.data[0]

        if (!data) {
          uni.showToast({ title: '球场数据异常', icon: 'error' })
          return
        }

        if (data.course_half_court_list?.length > 2) {
          uni.navigateTo({
            url: `/pages/common/court/half/index?course_id=${data.course_id}&course_name=${data.course_name}`,
          })
          return
        }

        uni.$emit('selectCourse', {
          course_id: data.course_id,
          course_name: data.course_name,
          course_half_court_ids: data.course_half_court_list
            .map(item => item.course_half_court_id)
            .join(','),
          course_half_court_names: [],
        })
        uni.navigateBack()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.item {
  height: 110rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;

  &-label {
    font-size: 28rpx;
    color: #000;
  }

  &-distance {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
