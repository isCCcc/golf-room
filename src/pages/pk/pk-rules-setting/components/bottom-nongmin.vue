<!--
 * @Author: simon
 * @Description: 农民之间
 * @LastEditors: simon
-->
<template>
  <view>
    <!-- S 农民之间 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             label="农民之间"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-nongming.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{current}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 农民之间 -->

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->
  </view>
</template>
<script>
// components
import GCell from '@components/g-cell/index.vue';
import ActionModal from './action-modal';
// mixins
import PkMixins from '../mixins/index';

export default {
  components: { GCell, ActionModal },
  mixins: [PkMixins],
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      // 操作列表
      actionList: [
        { label: '不PK', type: 0 },
        { label: '简单比杆(无奖)', type: 1 },
        { label: '简单比洞(无奖顶过)', type: 2 }
      ]
    };
  },

  computed: {
    // 当前操作
    current() {
      let target = this.actionList.find((e) => e.type == this.pkConfig?.nm_pk);
      return target?.label;
    }
  },

  methods: {
    // 获取操作列表
    getAction({ type }) {
      this.SET_PK_CONFIG_ITEM({ key: 'nm_pk', data: type });
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow() {
      this.$refs.actionModal.open(this.pkConfig.nm_pk);
    }
  }
};
</script>
<style lang="scss" scoped>
.cell-name {
  margin-top: -7rpx;
}
.left-icon {
  margin-right: 13rpx;
  width: 40rpx;
}
</style>
