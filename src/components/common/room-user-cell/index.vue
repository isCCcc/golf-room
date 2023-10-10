<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="flex-center flex-column">
    <slot>
      <view class="g-avatar" :style="{ backgroundImage: 'url(' + avatarUrl + ')' }"></view>
    </slot>
    <view class="fw-500 fs-24 h-34 text-over text" :style="{ color: textColor }">{{ text }}</view>
  </view>
</template>

<script>
import { genderedAvatar } from '@/utils/image';

export default {
  props: {
    avatar: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    textColor: {
      type: String,
      default: '#000000',
    },
  },
  data() {
    return {}
  },
  computed: {
    avatarUrl() {
      return genderedAvatar({ avatar_url: this.avatar });
    }
  }
}
</script>

<style lang="scss" scoped>
.g-avatar {
  width: 80rpx;
  height: 80rpx;
}
.h-34 {
  height: 34rpx;
  line-height: 34rpx;
}
.text {
  padding: 0 14rpx;
  margin-top: 6rpx;
}
</style>
