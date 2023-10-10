<!--
 * @Author: simon
 * @Description: 球洞设置-0跳洞-1出门顶洞
 * @LastEditors: simon
-->
<template>
  <uni-popup
    background-color="#fff"
    type="bottom"
    ref="popup"
    style="z-index: 55"
  >
    <view class="modal-wrapper fs-28 tc">
      <view class="action-list">
        <!-- S 球洞 -->
        <view class="holes-wrapper">
          <template v-for="item in holes">
            <view
              class="holes-cell flex-center fs-24 fw-400 rubik col-999"
              :key="item"
              :class="{ active: current == item }"
              @click="handleHole(item)"
              >{{ item }}</view
            >
          </template>
        </view>
        <!-- E 球洞 -->
      </view>
      <!-- /操作列表 -->
      <view class="action-cell fs-32 col-53" @click="close">取消</view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  props: {
    type: {
      type: Number,
      default: 0, // 0 跳洞， 1 顶洞
    },
  },
  data() {
    return {
      current: null,
    }
  },
  computed: {
    holes() {
      if (this.type == 0) {
        return new Array(18).fill(1).map((e, index) => index + 1)
      }
      return new Array(20).fill(1).map((e, index) => index)
    },
  },
  methods: {
    handleHole(item) {
      this.current = item
      this.$emit("change", item)
      this.close()
    },
    // 打开
    open(data) {
      this.current = data
      this.$refs.popup.open()
    },
    // 关闭
    close() {
      this.$refs.popup.close()
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
  background-color: $white;
  .action-list {
    border-bottom: 12rpx solid $bg-col-f9;
  }
  .action-cell {
    line-height: 120rpx;
  }
}

.holes-wrapper {
  padding: 60rpx 26rpx;
  display: grid;
  grid-row-gap: 20rpx;
  grid-column-gap: 26rpx;
  grid-template-columns: repeat(6, 1fr);
}
.holes-cell {
  height: 90rpx;
  border-radius: 50%;
  border: 2rpx solid #DDDDDD;
}
.holes-cell.active {
  background: rgba(30, 62, 66, 0.1);
  border: 2rpx solid #1E3E42;
}
</style>
