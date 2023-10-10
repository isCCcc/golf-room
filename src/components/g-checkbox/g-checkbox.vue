<template>
  <view v-if="!customized"
    :class="[
      'checkbox',
      {
        'checkbox-circle': circle,
        'checkbox-checked': checked,
        'checkbox-disabled': disabled,
      },
    ]"
    :style="[
      {
        width: size,
        height: size,
      },
    ]"
  >
    <uni-icons class="checkbox-icon" type="checkmarkempty" size="28rpx" color="#fff" />
  </view>
  <view v-else>
    <image :src="checked ? 'http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/customized_checked.png' : 'http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/customized_nocheck.png' " 
            mode="widthFix" 
            :style="[{width: size,height: size,}]"/>
  </view>
</template>

<script>
import UniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue'

/**
 * @property {Boolean} checked
 * @property {Boolean} disabled
 * @property {Boolean} circle
 */
export default {
  components: {
    UniIcons,
  },
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    circle: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: '36rpx',
    },
    customized: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.checkbox {
  background-color: #ffffff;
  border: 3rpx solid #dddddd;
  border-radius: 4rpx;
  width: 36rpx;
  height: 36rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.12s;
  overflow: hidden;

  .checkbox-icon {
    opacity: 0;
    transform: translateY(2rpx);
  }

  &.checkbox-circle {
    border-radius: 50%;
  }

  &.checkbox-checked {
    background-color: $theme-color;
    border-color: $theme-color;

    .checkbox-icon {
      opacity: 1;
    }
  }

  &.checkbox-disabled {
    background-color: #dddddd;
    border-color: #dddddd;
  }
}
</style>
