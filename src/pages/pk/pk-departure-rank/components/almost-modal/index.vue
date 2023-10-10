<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <uni-popup background-color="#fff"
             type="bottom"
             ref="popup"
             style="z-index: 55">
    <view class="modal-wrapper">
      <view class="top-title">
        <view class="cancel" @click="handleCancel">取消</view>
        <view class="title">球手差点</view>
      </view>
      <view class="action-list">
        <view v-for="(item, index) in list"
              :key="index"
              class="action-cell border-b border-bn flex-between h-120 plr-32">
          <view class="flex">
            <view class="g-avatar mr-10"
                  :style="{ backgroundImage: `url(${item.icon})` }"></view>
            <view>{{ item.name }}</view>
          </view>
          <text class="hcp">{{item.hcp? item.hcp : '?'}}</text>
        </view>
      </view>
      <!-- /操作列表 -->

      <view class="plr-32">
        <button class="button sub fw-600"
                @click="submit">
          按差点排序
        </button>
      </view>

    </view>
  </uni-popup>
</template>
<script>
export default {
  data() {
    return {
      list: []
    };
  },
  methods: {
    submit() {
      this.$emit('change', this.list);
      this.close();
    },
    handleCancel() {
      this.close();
    },
    // 打开
    open(data) {
      const list = [...data];
      list.sort((a, b) => a.hcp - b.hcp);
      this.list = list;
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
  background-color: $white;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top-title {
    position: relative;
    height: 101rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .cancel {
      position: absolute;
      left: 32rpx;
      top: 50%;
      transform: translateY(-50%);
      color: $col-999;
      font-weight: 500;
      font-size: 32rpx;
    }
    .title {
      font-size: 32rpx;
      font-weight: 500;
    }
  }
  .action-list {
    margin-bottom: 32rpx;
    flex: 1;
    overflow: scroll;

    .action-cell {
      .g-avatar {
        @include wh(80rpx, 80rpx);
      }
    }
    .hcp {
      color: $sub-color;
      font-weight: 400;
      font-size: 32rpx;
    }
  }
}
button.button {
  height: 96rpx;
  line-height: 96rpx;
}
button.button.sub {
  margin: 0 32rpx;
}
</style>