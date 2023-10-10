<!--
 * @Author: simon
 * @Description:  更多操作
 * @LastEditors: simon
-->
<template>
  <uni-popup background-color="#fff"
             type="bottom"
             ref="popup">
    <view class="modal-wrapper fs-36 tc">
      <view class="fs-24 col-999 title-box border-b">编辑分组</view>
      <!-- /标题 -->
      <view class="action-list">
        <view v-for="item in actionList"
              :key="item.type"
              class="action-cell border-b border-bn"
              :class="{'col-red': item.type == 'del-group'}"
              @click="handleAction(item)">{{item.label}}</view>
      </view>
      <!-- /操作列表 -->
      <view class="action-cell"
            @click="close">取消</view>
    </view>

  </uni-popup>
</template>

<script>
export default {
  data() {
    return {
      actionList: [
        { label: '编辑球员', type: 'edit-users' },
        { label: '删除分组', type: 'del-group' }
      ]
    };
  },
  methods: {
    handleAction(e) {
      this.$emit('onClick', e);
    },
    // 打开
    open() {
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
.col-red {
  color: #ff7777;
}
.modal-wrapper {
  background-color: $white;
  .title-box {
    line-height: 90rpx;
  }
  .action-list {
    border-bottom: 12rpx solid $bg-col-f9;
  }
  .action-cell {
    line-height: 120rpx;
  }
}
</style>
