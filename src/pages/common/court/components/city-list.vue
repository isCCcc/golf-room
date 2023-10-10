<template>
  <view>
    <view>
      <view class="title">热门城市</view>
      <view class="popular">
        <view v-for="city in hotCity" :key="city.id" class="item" @tap="onClickCity({ city_id: city.id, name: city.name })">
          {{ city.name }}
        </view>
      </view>
    </view>

    <view>
      <view class="title">省份</view>
      <view class="province">
        <view v-for="item in provinces" :key="item.id" class="item border-b" @tap="onClickCity({ province_id: item.id, name: item.name })">
          <g-cell :label="item.name" is-link>
            <view class="num">{{ item.cource_num }}个球场</view>
          </g-cell>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import GCell from '@components/g-cell/index.vue'
import { getHotCity, getProvinces } from '@api/course'

export default {
  components: {
    GCell,
  },
  data() {
    return {
      hotCity: [],
      provinces: [],
    }
  },
  created() {
    this.getHotCity()
    this.getProvinces()
  },
  methods: {
    getHotCity() {
      getHotCity().then(({ data: res }) => {
        this.hotCity = res.data.list || []
      })
    },
    getProvinces() {
      getProvinces().then(({ data: res }) => {
        this.provinces = res.data.list || []
      })
    },
    onClickCity(value) {
      // uni.showToast({
      //   title: '功能开发中',
      //   icon: 'none',
      // })
      this.$emit('select', value)
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 32rpx;
  line-height: 45rpx;
  font-weight: 500;
  color: #000;
  padding: 32rpx;
}

.popular {
  padding: 0 32rpx;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .item {
    @include sequence(24rpx, 4);
    background-color: #fff;
    border-radius: 4rpx;
    height: 65rpx;
    line-height: 65rpx;
    text-align: center;
    font-size: 28rpx;
  }
}

.province {
  .item {
    background-color: #fff;
    height: 120rpx;
    line-height: 120rpx;
    padding: 0 32rpx;

    ::v-deep .uni-icons {
      font-size: 30rpx !important;
    }
  }

  .num {
    text-align: right;
    font-size: 28rpx;
    color: $col-999;
    margin-right: 8rpx;
  }
}
</style>
