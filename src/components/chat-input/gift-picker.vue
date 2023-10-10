<template>
  <view
    class="root"
    :style="{
      '--target-height': (showGifts ? height : 0) + 'rpx',
      visibility: showGifts ? 'visible' : 'hidden',
    }"
  >
    <view v-if="gifts.length < 1" class="empty">
      <view class="image"></view>
      <text class="text">即将上线打赏与表情包功能，敬请期待</text>
    </view>
    <view v-else></view>
  </view>
</template>

<script>

export default {
  emits: [],
  props: {
    showGifts: {
      type: Boolean,
      default: false,
    },
    // 礼物框高度，单位 rpx, 默认 305
    height: {
      type: [Number, undefined],
      default: 305,
    },
  },
  data() {
    return {
      gifts: [],
      scrollTop: 0,
      old: {
        scrollTop: 0,
      },
    };
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
$bgCol: #F4F4F4;

.root {
  background-color: $bgCol;
  height: var(--target-height);
  overflow: hidden;
}


.empty {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .image {
    margin-top: 8rpx;
    width: 434rpx;
    height: 168rpx;
    background-image: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/svg/img_gift_empty_ph.svg");
    background-size: 100% 100%;
  }
  .text {
    margin-top: 4rpx;
    font-style: normal;
    font-weight: 400;
    font-size: 24rpx;
    line-height: 34rpx;
    /* identical to box height */
    text-align: center;
    letter-spacing: -0.3rpx;

    /* 999999 */
    color: #999999;
  }
}
</style>
