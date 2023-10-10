<template>
  <scroll-view class="scroll-view" scroll-y="true" @scrolltolower="scrollToLower">
    <FollowUserCell v-for="user in listItem.list" :key="user.uid" 
                    :user="user" 
                    :subtitle="user.reason"
                    :show-extra="false" 
                    :type="type"
                    @changeFollow="handleChangeFollow" />

    <view v-if="listItem.list.length < 1" class="empty">
      <view class="ph-image"></view>
      <view class="ph-title">{{ listItem.emptyTitle }}</view>
    </view>

    <view v-if="listItem.noMore == true && listItem.list.length > 0"
          :style="{'padding-bottom': (safeBottom || 0) + 'px'}"
          class="flex flex-center col-999 mt-12">
      没有更多了...
    </view>
  </scroll-view>
</template>


<script>
import FollowUserCell from './FollowUserCell.vue';

export default {
  components: {
    FollowUserCell,
  },
  emits: ['loadMoreTriggered', 'changeFollow', 'delete'],
  props: {
    listItem: {
      type: [Object, undefined],
      default: undefined
    },
    safeBottom: {
      type: [Number, undefined],
      default: undefined
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    scrollToLower() {
      this.$emit('loadMoreTriggered')
    },
    handleChangeFollow(e) {
      this.$emit('changeFollow', e, this.listItem)
    },
  },
}
</script>

<style lang="scss" scoped>
.scroll-view {
  width: 100%;
  height: 100%;
  .empty {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .ph-image {
      margin-top: 56%;

      width: 434rpx;
      height: 190rpx;
      background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/svg/img_emtp_ph.svg');
      background-size: 100%;
      background-repeat: no-repeat;
    }

    .ph-title {
      margin-top: 26rpx;
      font-weight: 400;
      font-size: 32rpx;
      line-height: 45rpx;
      color: #999999;
    }
  }
}
</style>