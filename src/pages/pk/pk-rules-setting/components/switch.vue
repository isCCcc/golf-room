<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="switch" :class="{'active': isChecked}" @click="handleSwitch">
    
  </view>
</template>
<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      isChecked: false,
    }
  },
  watch: {
    checked() {
      this.isChecked = this.checked;
    }
  },
  mounted() {
    this.isChecked = this.checked;
  },
  methods: {
    handleSwitch() {
      this.isChecked = !this.isChecked
      this.$emit('change', this.isChecked);
    }
  }
  
}
</script>
<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 88rpx;
  height: 48rpx;
  padding: 6rpx;
  background: #DDDDDD;
  border-radius: 4rpx;
  box-sizing: border-box;
  &::after,&::before {
    content: '';
    position: absolute;
    top: 6rpx;
    width: 38rpx;
    height: 36rpx;
    background-color: $white;
    transition-duration: .2s;
  }
  &::before {
    left: 6rpx;
  }
  &.active {
    background: $theme-color;
    &::before {
      transform: scale(0);
      transform: translateX(38rpx);
      transition-duration: .3s;
    }
    &::after {
      transform: scale(0);
      transition-duration: .1s;
    }
    
  }
}
</style>