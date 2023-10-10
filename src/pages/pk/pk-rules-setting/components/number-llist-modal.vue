<!--
 * @Author: simon
 * @Description: 分数
 * @LastEditors: simon
-->
<template>
  <uni-popup background-color="#fff"
             type="bottom"
             ref="popup"
             @change="handleChange">
    <view class="modal-wrapper fs-32 tc">
      <view class="action-list p-32">
        <view v-for="(item,index) in actionList"
              :key="index"
              class="action-cell number-cell"
              :class="{'acitve': current == item.type}"
              @click="handleAction(item)">{{item.label}}</view>

      </view>
      <!-- /操作列表 -->
      <view class="action-cell fs-32 col-53"
            @click="close">取消</view>
    </view>

  </uni-popup>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  props: {
    // 类型
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      current: '',
      actionList: [
        { label: '4310', type: '4310' },
        { label: '4210', type: '4210' },
        { label: '5310', type: '5310' },
        { label: '5321', type: '5321' },
        { label: '6421', type: '6421' },
        { label: '7421', type: '7421' },
        { label: '7321', type: '7321' },
        { label: '8321', type: '8321' },
        { label: '8421', type: '8421' },
        { label: '8431', type: '8431' },
        { label: '8521', type: '8521' },
        { label: '8531', type: '8531' }
      ]
    };
  },
  mounted() {
    if (this.type == 2) {
      this.actionList.push(
        {
          label: '84321',
          type: '84321'
        },
        { label: '自定义', type: 'custom' }
      );
    }
  },

  computed: {
    ...mapState({
      showBackButton: (state) => state.pk.showBackButton
    })
  },
  methods: {
    ...mapMutations(['SET_PK_KEY']),
    handleAction(e) {
      this.$emit('onClick', e);
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
    handleChange({ show }) {
      if (show) {
        this.SET_PK_KEY({ key: 'showBackButton', data: !this.showBackButton });
        return;
      }
      setTimeout(() => {
        this.SET_PK_KEY({ key: 'showBackButton', data: !this.showBackButton });
      }, 300);
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-wrapper {
  background-color: $white;
  max-height: 90vh;
  overflow: auto;

  .action-list {
    display: grid;
    grid-row-gap: 32rpx;
    grid-column-gap: 32rpx;
    grid-template-columns: repeat(2, 1fr);
    border-bottom: 12rpx solid $bg-col-f9;
    .number-cell {
      line-height: 60rpx;
      color: #000;
      border: 1px solid $br-col-ed;
    }
    .acitve {
      background: rgba($color: $col-1e3, $alpha: 0.1);
      border-color: $col-1e3;
    }
  }
  .action-cell {
    line-height: 120rpx;
  }
}
</style>
