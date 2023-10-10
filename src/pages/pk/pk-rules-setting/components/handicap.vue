<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view>
    <view class="h-120 flex border-b">
      <GCell className="plr-32" label="让分" isLink class="flex1">
        <template #right>
          <SwichBox :checked="isChecked" @change="handleChange"></SwichBox>
        </template>
      </GCell>
    </view>
    <view class="bg-col-f9 h-209 flex-center" v-show="isChecked">
      <RoomUserCell text="添加球员">
        <view class="g-avatar add-avatar pr"></view>
      </RoomUserCell>
      <view class="allow d-flex flex-column justify-center">
        <view class="tc sub-color fs-32 fw-600">让</view>
        <!-- <view class="allow-icon"></view> -->
        <image :src="`${ossUrl}/icon-transfer.png`" mode="widthFix" class="icon-transfer"/>
      </view>
      <RoomUserCell text="添加球员">
        <view class="g-avatar add-avatar pr"></view>
      </RoomUserCell>
      <view class="allow-right">
        <view class="right-box d-flex items-center">
          <input class="allow-int tc" type="text" value="0"/>
          <text class="fs-24 fw-400">分</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// components
import GCell from "@components/g-cell/index.vue";
import SwichBox from "@pages/pk/pk-rules-setting/components/switch";
import RoomUserCell from "@components/common/room-user-cell/index";
export default {
  components: {
    GCell,
    SwichBox,
    RoomUserCell
  },
  data() {
    return {
      isChecked: false,
      ossUrl: `${this.$ossUrl}/images/pk/icons`
    };
  },
  mounted() {},
  methods: {
    handleChange(checked) {
      this.isChecked = checked;
    },
  },
};
</script>
<style scoped lang="scss">
@import "../styles/index.scss";
.h-209 {
  height: 209rpx;
}
.allow {
  margin: 0 32rpx;
}
// .allow-icon {
//   margin-top: 27rpx;
//   width: 72rpx;
//   height: 34rpx;
//   background-color: #e9e9e9;
// }
.allow-right {
  margin-left: 32rpx;
  height: 120rpx;
}
.right-box {
  height: 80rpx;
}
.allow-int {
  margin-right: 24rpx;
  width: 84rpx;
  background-color: $white;
}
.icon-transfer {
  margin-top: 27rpx;
  width: 72rpx;
}
</style>
