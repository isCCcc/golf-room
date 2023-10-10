<!--
 * @Author: simon
 * @Description: 扣分
 * @LastEditors: simon
-->
<template>
  <view>
    <template v-for="item in rules">
      <view :key="item.id">
        <view class="border-b h-120 pl-32 d-flex items-center" @click="handleChange(item, 'isChecked')">
          <g-checkbox :checked="item.id == isChecked" />
          <text class="ml-22" :class="{'col-999': item.id != isChecked}">{{ item.label }}</text>
        </view>
        <view
          v-if="item.childrens"
          class="border-b h-120 pl-58 d-flex items-center" @click="handleChange(item.childrens, 'isChildChecked')"
        >
          <g-checkbox
            :checked="item.childrens.id == isChildChecked"
            :disabled="item.id != isChecked"
          />
          <text class="ml-22" :class="{'col-999': item.id != isChildChecked || item.id != isChecked}">{{ item.childrens.label }}</text>
        </view>
      </view>
    </template>
  </view>
</template>
<script>
export default {
  data() {
    return {
      rules: [
        {
          id: 1,
          label: "扣分（+4扣1分 +5扣2分...以此类推）",
          childrens: {
            id: 1,
            label: "3杆洞从+3开始扣分",
          },
        },
        {
          id: 2,
          label: "只扣1分（+4及以上）",
        },
        {
          id: 3,
          label: "只扣1分（双帕及以上）",
        },
      ],
      isChecked: 1,
      isChildChecked: 1,
    };
  },
  methods: {
    handleChange({id}, key) {
      if(this[key] == id) {
        this[key] = null;
        return ;
      }
      this[key] = id
    },
  }
};
</script>
<style scoped lang="scss">
.ml-22 {
  margin-left: 22rpx;
}
.pl-58 {
  padding-left: 58rpx;
}
</style>
