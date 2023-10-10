<!--
 * @Author: simon
 * @Description: 操作列表
 * @LastEditors: simon
-->
<template>
  <uni-popup background-color="#fff"
             type="bottom"
             ref="popup">
    <view class="modal-wrapper fs-28 tc">

      <view class="action-list">
        <!-- <view class="l-120 p-32">
          <text class="fs-28 rubik">总成绩</text>
          <g-checkbox />
        </view> -->
        <view class="action-cell border-b border-bn p-32"
              :class="[current == item.competition_pk_id ? 'col-black' : 'col-999']"
              v-for="(item,index) in list"
              :key="item.competition_pk_id"
              @click="handleAction(item.competition_pk_id,index)">
          <view class="flex-between title-box">
            <text class="fs-28 rubik">{{item.desc}}</text>
            <g-checkbox :checked="current == item.competition_pk_id" :customized="true" :size="current == item.competition_pk_id ? '48rpx' : '40rpx'" />
          </view>
          <view class="flex user-list">
            <view class="user-cell"
                  v-for="ids in item.competitor_ids"
                  :key="ids">
              <view class="g-avatar"
                    :style="{backgroundImage: `url(${playersInfo[ids].avatar_url})`}"></view>
              <view class="fs-24 text-over"
                    :class="[current == item.competition_pk_id ? 'col-53' : 'col-999']">{{playersInfo[ids].username}}
              </view>
            </view>
          </view>
        </view>

      </view>
      <!-- /操作列表 -->
      <view class="h-120 flex-center fs-32 col-53"
            @click="close">取消</view>
    </view>

  </uni-popup>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  props: {
    list: {
      type: Array
    }
  },
  data() {
    return {
      current: ''
    };
  },
  computed: {
    ...mapState({
      competitionData: (state) => state.chatRoom.competitionData
    }),
    // 球员信息
    playersInfo() {
      let info = {};
      this.competitionData.competitor_list.map((e) => {
        info[e.competitor_id] = e;
      });
      return info;
    }
  },
  methods: {
    ...mapMutations(['SET_PK_KEY']),
    handleAction(id,index) {
      this.current = id;
      this.$emit('onClick', this.list[index]);
      this.close();
    },
    // 打开
    open(data) {
      this.current = data;
      this.$refs.popup.open();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
    },
    handleChange({ show }) {}
  }
};
</script>

<style lang="scss" scoped>
.modal-wrapper {
  background-color: $white;
  overflow: auto;
  .action-list {
    max-height: 50vh;
    overflow-y: auto;
    border-bottom: 12rpx solid $bg-col-f9;
    .action-cell {
      &:nth-child(even) {
        background: $bg-col-f9;
      }
      .title-box {
        padding: 6rpx 6rpx 20rpx 0;
      }
      .user-list {
        .user-cell {
          flex: 0 0 100rpx;
          margin-right: 16rpx;
          text-align: center;
          .g-avatar {
            margin: 0 auto 5rpx;
            @include wh(68rpx, 68rpx);
          }
        }
      }
    }
  }
}
</style>
