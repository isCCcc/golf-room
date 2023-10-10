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
        <view class="cancel"
              @click="close">取消</view>
        <view class="title">历史排序</view>
      </view>
      <scroll-view scroll-y
                   class="scroll-view">
        <view class="action-list fs-24">
          <view class="content">
            <view v-for="(item,index) in list"
                  :key="index"
                  class="list-cell pr">
              <!-- S 时间 -->
              <view class="flex time-box pr">
                <text class="col-53">{{item.add_time}}</text>
                <text class="chou-label tc ml-16"
                      v-if="item.is_random == 1">抽</text>
                <view class="flex ml-16">
                  <view class="g-avatar"
                        :style="{backgroundImage: `url(${item.avatar_url})`}"></view>
                  <view>{{item.username}}</view>
                </view>
              </view>
              <!-- E 时间 -->
              <!-- S 成员列表 -->
              <view class="user-list">
                <view v-for="players in item.start_player_user_list"
                      :key="players.uid"
                      class="user-cell flex">
                  <view class="g-avatar"
                        :style="{backgroundImage: `url(${players.avatar_url})`}">
                  </view>
                  <view class="text-over">{{players.username}}</view>
                </view>
              </view>
              <!-- E 成员列表 -->
            </view>
          </view>
        </view>
      </scroll-view>
      <!-- /操作列表 -->

    </view>
  </uni-popup>
</template>
<script>
export default {
  props: {
    // 数据
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    };
  },

  methods: {
    // handleReachBottom() {
    //   console.log('触发地步');
    // },
    // 打开
    open(data) {
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
.ml-16 {
  margin-left: 16rpx;
}
.modal-wrapper {
  background-color: $white;
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
  .scroll-view {
    margin-top: 16rpx;
    height: 50vh;
    // min-height: 50vh;
  }
  .action-list {
    padding: 0 49rpx;
    // .scroll-view {

    .content {
      border-left: 2rpx solid $br-col-ed;
    }
    .list-cell {
      .g-avatar {
        margin-right: 6rpx;
        flex: 0 0 48rpx;
        @include wh(48rpx, 48rpx);
      }
      // 时间
      .time-box {
        padding-left: 18rpx;
        margin-bottom: 16rpx;
        &::before {
          position: absolute;
          display: block;
          content: '';
          width: 8rpx;
          height: 8rpx;
          border: 4rpx solid $col-999;
          background: $white;
          border-radius: 100%;
          top: 50%;
          // left: -10rpx;
          left: 0;
          transform: translate(-55%, -50%);
          z-index: 9999;
        }
        .chou-label {
          flex: 0 0 38rpx;
          width: 38rpx;
          line-height: 34rpx;
          color: $white;
          background: $sub-color;
        }
      }
      // 成员列表
      .user-list {
        padding-left: 78rpx;
        .user-cell {
          padding-bottom: 16rpx;
        }
      }
    }
    // }
  }
}
</style>