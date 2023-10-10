<!--
 * @Author: simon
 * @Description: 顶洞留给谁收
 * @LastEditors: simon
-->
<template>
  <view v-show="pkConfig.draw_get == 2">
    <!-- S 顶洞留给谁收 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             label="顶洞留给谁收"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-groove.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{current}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 顶洞留给谁收 -->

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->
  </view>
</template>
<script>
// 组件
import GCell from '@components/g-cell/index.vue';
import ActionModal from './action-modal';
// mixins
import PkMixins from '../mixins/index';

export default {
  mixins: [PkMixins],
  components: { GCell, ActionModal },
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      // 操作列表
      actionList: [
        { type: 0, label: '只留给原组合收' },
        { type: 1, label: '都可以收' },
      ]
    };
  },
  computed: {
    // 当前操作
    current() {
      let target = this.actionList.find(
        (e) => e.type == this.pkConfig?.draw_get_style
      );
      return target.label;
    }
  },

  methods: {
    // 获取操作信息
    getAction({ type }) {
      this.SET_PK_CONFIG_ITEM({ key: 'draw_get_style', data: type });
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow() {
      this.$refs.actionModal.open(this.pkConfig.draw_get_style);
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

