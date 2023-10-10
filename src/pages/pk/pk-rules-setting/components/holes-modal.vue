<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <uni-popup background-color="transparent"
             type="center"
             ref="popup">
    <view class="bg-white modal-wrapper">
      <!-- S 标题 -->
      <view class="title-wrapper pr flex-center">
        <text class="fs-34 fw-500">设置有效洞</text>
        <view class="pa icon-help"></view>
      </view>
      <!-- E 标题 -->

      <!-- S 球洞 -->
      <view class="holes-wrapper">
        <template v-for="(item, idx) in holes">
          <view class="holes-cell flex-center fs-32 fw-400 rubik col-999"
                :key="item"
                :class="{ active: !!actives[idx] }"
                @click="handleHole(item, idx)">{{ pkHoles[idx] ?  pkHoles[idx] : '.'}}</view>
        </template>
      </view>
      <!-- E 球洞 -->

      <!-- S 快捷选择 -->
      <view class="quick-wrapper">
        <template v-for="(item, index) in quickSelect">
          <view :key="item.label"
                class="btn-tag flex-center fs-24 fw-400"
                @click="handelSelect(item, index)">{{ item.label }}</view>
        </template>
      </view>

      <!-- E 快捷选择 -->

      <!-- S 按钮 -->
      <view class="btn-wrapper border-b flex-between">
        <button class="button flex1 col-999 fs-32 fw-500"
                @click="close">
          取消
        </button>
        <view class="line"></view>
        <button class="button flex1 col-1e3 fs-32 fw-500"
                @click="confirm">
          确认
        </button>
      </view>
      <!-- E 按钮 -->
    </view>
  </uni-popup>
</template>

<script>
// 组件
import uniPopup from '@/components/uni-popup/uni-popup';
// vuex
import { mapMutations, mapState } from 'vuex';

export default {
  props: {},

  components: {
    uniPopup
  },

  data() {
    return {
      holes: new Array(18).fill(1).map((e, index) => index + 1),
      actives: [], // 当前选中的球洞
      quickSelect: [
        { label: '所有', start: 0, end: 17 },
        { label: '前九', start: 0, end: 8 },
        { label: '后九', start: 9, end: 17 },
        { label: '前六', start: 0, end: 5 },
        { label: '中六', start: 6, end: 11 },
        { label: '后六', start: 12, end: 17 }
      ] // 快捷选择操作列表
    };
  },

  computed: {
    ...mapState({
      pkHoles: (state) => state.pk.pkHoles,
      pkConfig: (state) => state.pk.pkConfig
    })
  },

  methods: {
    ...mapMutations({
      SET_PK_CONFIG_ITEM: 'SET_PK_CONFIG_ITEM'
    }),
    // 选择球洞
    handleHole(value, idx) {
      let newVal = !!this.actives[idx] ? 0 : 1;
      this.$set(this.actives, idx, newVal);
    },
    // 快捷选择
    handelSelect({ start, end }) {
      let act = new Array(18).fill(0);
      for (let i = start; i <= end; i++) {
        act[i] = 1;
      }
      this.actives = act;
      console.log('actives', this.actives);
    },

    // 确认
    async confirm() {
      this.SET_PK_CONFIG_ITEM({ key: 'valid_holes', data: this.actives });
      this.close();
    },
    // 打开
    open(options) {
      const { holes } = options || {};
      this.actives = holes || [];
      this.$refs.popup.open();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-wrapper {
  width: 640rpx;
  border-radius: 4rpx;
}
.title-wrapper {
  height: 116rpx;
}
.icon-help {
  right: 20rpx;
  top: 50%;
  width: 40rpx;
  height: 40rpx;
  transform: translateY(-50%);
  background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/icon-help.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.holes-wrapper {
  padding: 0 26rpx;
  display: grid;
  grid-row-gap: 39.26rpx;
  grid-column-gap: 22.87rpx;
  grid-template-columns: repeat(6, 1fr);
}
.holes-cell {
  height: 80rpx;
  background-color: #e9e9e9;
  border-radius: 50%;
}
.holes-cell.active {
  background-color: #95d171;
  color: $white;
}
.quick-wrapper {
  padding: 46rpx 26rpx;
  display: grid;
  grid-column-gap: 14rpx;
  grid-template-columns: repeat(6, 1fr);
}

.btn-tag {
  height: 60rpx;
  border: 2rpx solid #c4c4c4;
  border-radius: 4rpx;
}
.btn-tag:active {
  background-color: #1e3e42;
  border-color: #1e3e42;
  color: $white;
}
/* 底部操作 */
.btn-wrapper {
  padding: 28rpx;
}
.border-b::after {
  border-bottom: none;
  border-top: 1px solid #e7e7e7;
}
.button {
  background-color: transparent;
}
.button.col-999 {
  color: $col-999;
}
.button.col-1e3 {
  color: $col-1e3;
}
.line {
  height: 56rpx;
  width: 1rpx;
  background-color: #e7e7e7;
}
</style>
