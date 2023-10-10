<!--
 * @Author: simon
 * @Description: 抽水
 * @LastEditors: simon
-->
<template>
  <view>
    <!-- S 抽水 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             label="抽水/捐锅"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-choushui.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{current}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 抽水 -->

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->
    <ChoushuiModal ref="choushuiModal" />
  </view>
</template>
<script>
// components
import GCell from '@components/g-cell/index.vue';
import ChoushuiModal from '@/pages/pk/pk-rules-setting/components/choushui-modal';
// mixins
import PkMixins from '../mixins/index';

export default {
  components: { GCell, ChoushuiModal },
  mixins: [PkMixins],
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`
    };
  },
  computed: {
    // 当前操作
    current() {
      if (this.pkConfig?.cs_style == 1) {
        return `抽前${this.pkConfig?.cs_holes}洞`;
      } else if (this.pkConfig?.cs_style == 2) {
        return `抽满${this.pkConfig?.cs_score}分为止`;
      }
      return `不抽水`;
    }
  },

  methods: {
    // 获取操作列表
    getAction({ type }) {
      this.SET_PK_CONFIG_ITEM({ key: 'baodong', data: type });
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow() {
      let params = {
        rule1: this.pkConfig.cs_style,
        rule2: this.pkConfig.cs_unit,
        holes: this.pkConfig.cs_holes || 5,
        score: this.pkConfig.cs_score / 2 || 5
      };
      this.$refs.choushuiModal.open(params);
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
