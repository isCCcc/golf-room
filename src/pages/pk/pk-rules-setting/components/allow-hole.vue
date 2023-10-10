<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view>
    <view class="h-120 flex border-b">
      <GCell className="plr-32" label="每洞让杆" isLink class="flex1">
        <template #right>
          <SwichBox :checked="isChecked" @change="handleChange"></SwichBox>
        </template>
      </GCell>
    </view>
    <view class="bg-col-f9 h-360 plr-32" v-show="isChecked">
      <template v-for="item in holes">
        <view :key="item.label" class="h-120 d-flex">
          <view class="w-162 flex items-center col-999 fw-400 fs-28">{{ item.label }}</view>
          <view class="flex1 d-flex flex-wrap">
            <template v-for="child in item.values">
              <view :key="child.id" class="w-33 flex-center fs-28 fw-400">{{ child.value }}</view>
            </template>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>
<script>
// components
import GCell from "@components/g-cell/index.vue";
import SwichBox from "@pages/pk/pk-rules-setting/components/switch";
export default {
  components: {
    GCell,
    SwichBox,
  },
  data() {
    return {
      isChecked: false,
      holes: [
        {
          label: "三杆洞",
          values: [
            {
              id: 1,
              value: 0,
            },
            {
              id: 2,
              value: 0,
            },
          ],
        },
        {
          label: "四杆洞",
          values: [
            {
              id: 1,
              value: 0,
            },
            {
              id: 2,
              value: 0,
            },
          ],
        },
        {
          label: "五杆洞",
          values: [
            {
              id: 1,
              value: 0,
            },
            {
              id: 2,
              value: 0,
            },
          ],
        },
      ],
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
<style lang="scss" scoped>
@import "../styles/index.scss";
.h-360 {
  height: 360rpx;
}
.w-162 {
  width: 162rpx;
}
</style>
