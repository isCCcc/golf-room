<!--
 * @Author: simon
 * @Description: 收顶洞
 * @LastEditors: simon
-->
<template>
  <view v-show="pkConfig.draw_type != 0">
    <!-- S 收顶洞 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             :label="pkConfig.type == 5 && pkConfig.jifen_type == 2 ? '收锅里肉' : '收顶洞'"
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
    <!-- E 收顶洞 -->
    
    <!-- S 收不完的顶洞 -->
    <view v-if="pkConfig.draw_get > 0 && pkConfig.type == 5"
          class="h-120 flex border-b"
          @click="handleShowStyle">
      <GCell className="plr-32"
             label="收不完的顶洞"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-groove.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{drawGetStyle}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 收不完的顶洞 -->

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
                 
    <ActionModal ref="style"
                 :list="styleList"
                 @onClick="getStyle" />
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
        { type: 1, label: '赢洞则全收' },
        { type: 2, label: '帕收1/鸟收2/鹰全收' },
        { type: 3, label: '帕收1/鸟收2/鹰收4' },
        { type: 4, label: '赢收1/鸟收2/鹰全收' },
        { type: 5, label: '不管赢多少只收1洞' },
        { type: 6, label: '帕收2/鸟收3/鹰全收' }
      ],
      styleList: [
        { type: 0, label: '只留给原组合收' },
        { type: 1, label: '都可以收' },
      ]
    }
  },
  computed: {
    // 当前操作
    current() {
      let target = this.actionList.find(
        (e) => e.type == this.pkConfig?.draw_get
      );
      return target?.label;
    },
    drawGetStyle() {
      let target = this.styleList.find(
        (e) => e.type == this.pkConfig?.draw_get_style
      );
      return target?.label;
    }
  },
  methods: {
    // 获取操作信息
    getAction({ type }) {
      this.SET_PK_CONFIG_ITEM({ key: 'draw_get', data: type });
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow() {
      this.$refs.actionModal.open(this.pkConfig.draw_get);
    },
    handleShowStyle() {
      this.$refs.style.open(this.pkConfig.draw_get_style);
    },
    getStyle({ type }) {
      this.SET_PK_CONFIG_ITEM({ key: 'draw_get_style', data: type });
      this.$refs.style.close();
    },
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
