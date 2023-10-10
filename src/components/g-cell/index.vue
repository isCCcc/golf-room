<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view :class="['flex-between', className]">
    <slot name="left">
      <slot name="left-icon" />
      <text class="fs-28 fw-400">{{ label }}</text>
    </slot>
    <view class="flex1">
      <slot></slot>
    </view>
    <slot name="right">
      <uni-icons type="right" :size="iconSize" color="#C4C4C4" v-if="isLink"></uni-icons>
    </slot>
  </view>
</template>
<script>
import UniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
export default {
  components: { UniIcons },
  props: {
    label: {
      type: String,
      default: '',
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: '',
    },
    iconSize: {
      type: String,
      default: '28rpx'
    }
  },
  data() {
    return {}
  },
}
</script>
<style lang="scss" scoped></style>
