<!--
 * @Author: wsw 944627549@qq.com
 * @Date: 2022-11-27 22:55:25
 * @LastEditors: wsw 944627549@qq.com
 * @LastEditTime: 2022-12-01 12:50:40
 * @FilePath: /wx-GolfRoom/src/pages/tabbar/home/components/home-list/tabs/index.vue
-->
<template>
  <view class="tabs">
    <view
      v-for="(item, i) in list"
      :key="item.value"
      :id="`tab-item-${item.value}`"
      :class="[
        'tab-item relative',
        current === item.value ? 'tab-item-active' : '',
        i !== 0 ? 'ml-32' : '',
      ]"
      @click="handleClick(item)"
    >
      {{ item.label }}
      <view class="line" v-show="current === item.value" />
    </view>
  </view>
</template>
<script>
export default {
  props: {
    current: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      list: [
        {
          label: '发现房间',
          value: '1',
        },
        {
          label: '观赛房间',
          value: '2',
        },
      ],
      translateX: '',
    }
  },
  methods: {
    handleClick(item) {
      this.$emit('update:current', item.value)
      this.$emit('change')
    },
  },
}
</script>
<style lang="scss" scoped>
.relative {
  position: relative;
}
.tabs {
  display: flex;
  align-items: center;
}
.line {
  position: absolute;
  bottom: -5rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 4rpx;
  background: #003c3d;
}
.tab-item {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 26rpx;
  line-height: 36rpx;
  color: #999999;
  transition: all 0.09s;
  &-active {
    font-weight: 500;
    font-size: 32rpx;
    line-height: 45rpx;
    color: #000000;
  }
}
.ml-32 {
  margin-left: 32rpx;
}
</style>
