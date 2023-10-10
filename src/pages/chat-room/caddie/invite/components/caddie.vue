<template>
  <view
    class="pr flex-center flex-column"
    :style="{ '--avatar-size': avatarSizeInRpx + 'rpx' }"
  >
    <view class="d-flex">
      <view>
        <!-- 头像 -->
        <GAvatar
          v-if="isAddable"
          class="avatar"
          :avatar-data="caddie"
          :size-in-rpx="avatarSizeInRpx"
          :radius="'100%'"
        />
        <view v-else class="addable flex-center" @click="handleAdding">
          <view class="add-icon"></view>
        </view>
      </view>
      <view v-if="showDelete" class="close-btn" @click="handleDelete"></view>
    </view>
    <!-- 昵称 -->
    <text class="mt-10 name">{{ caddie.username }}</text>
  </view>
</template>

<script>
import GAvatar from "@/components/g-avatar/g-avatar.vue";

export default {
  components: { GAvatar },
  props: {
    /**  */
    caddie: {
      type: [Object, undefined],
      default: undefined,
    },
    showDelete: {
      type: [Boolean, undefined],
      default: false,
    },

    avatarSizeInRpx: {
      type: [Number, undefined],
      default: 100,
    },
  },
  data() {
    return {};
  },
  computed: {
    isAddable() {
      return (this.caddie?.uid || 0) > 0;
    },
  },
  methods: {
    handleAdding() {
      this.$emit("add");
    },
    handleDelete() {
      this.$emit("delete", this.caddie);
    },
  },
};
</script>

<style lang="scss" scoped>
.addable {
  width: var(--avatar-size);
  height: var(--avatar-size);
  background: #F0F0F0;
  border-radius: 100%;

  .add-icon {
    @include bgImage(
      34rpx,
      34rpx,
      "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_common_add_raw.svg"
    );
  }
}
.close-btn {
  margin-left: -20rpx;
  @include bgImage(
    32rpx,
    32rpx,
    "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_caddie_invite_close.svg"
  );
}

.name {
  width: 112rpx;
  max-width: 112rpx;
  min-height: 34rpx;
  @include ell(1);
  
  font-family: 'PingFang HK';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 34rpx;
  text-align: center;
  letter-spacing: -0.3rpx;

  color: #000000;
}
</style>
