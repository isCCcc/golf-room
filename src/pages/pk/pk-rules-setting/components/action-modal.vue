<!--
 * @Author: simon
 * @Description: 操作列表
 * @LastEditors: simon
-->
<template>
  <uni-popup background-color="#fff"
             type="bottom"
             ref="popup" @change="handleChange">
    <view class="modal-wrapper fs-28 tc">
      <view class="action-list">
        <view v-for="(item,index) in list"
              :key="index"
              class="action-cell border-b border-bn"
              :class="[current == item.type ? 'col-black' : 'col-999']"
              @click="handleAction(item)">{{item.label}}</view>
              
      </view>
      <!-- /操作列表 -->
      <view class="action-cell fs-32 col-53"
            @click="close">取消</view>
    </view>

  </uni-popup>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    list: {
      type: Array
    }
  },
  data(){
    return {
      current: '',
    }
  },
  computed: {
    ...mapState({
      showBackButton: state => state.pk.showBackButton
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
    handleChange({show}) {
      if(show) {
        this.SET_PK_KEY({key: 'showBackButton', data: !this.showBackButton})
        return;
      }
      setTimeout(() => {
        this.SET_PK_KEY({key: 'showBackButton', data: !this.showBackButton})
      }, 300)
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-wrapper {
  background-color: $white;
  max-height: 90vh;
  overflow: auto;
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
