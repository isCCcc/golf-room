<!--
 * @Author: simon
 * @Description: 奖励
 * @LastEditors: simon
-->
<template>
  <view>
    <!-- S 奖励 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             :label="pkConfig.type == 5 ? '奖励多少' : '奖励'"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-award.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{current}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 奖励 -->

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
  </view>
</template>
<script>
// 组件
import GCell from '@components/g-cell/index.vue';
import ActionModal from './action-modal';
// mixins
import PkMixins from '../mixins/index';
// js
import { award } from '../setting';
export default {
  mixins: [PkMixins],
  components: { GCell, ActionModal },
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      // 操作列表
      // actionList: []
    };
  },

  computed: {
    // 当前操作
    current() {
      let target = this.actionList.find((e) => e.type == this.pkConfig?.award);
      return target.label;
    },
    actionList(){
       let index = award.findIndex((e) => e.value.includes(this.pkConfig.type));
       if (this.pkConfig.type == 5 && this.pkConfig.jiang == 1) { //四人拉斯-鸟鹰奖励-合并pk
         index = 1
       }
       return award[index].list;
    }
  },

  methods: {
    // 获取操作信息
    getAction({ type }) {
      this.SET_PK_CONFIG_ITEM({ key: 'award', data: type });
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow() {
      this.$refs.actionModal.open(this.pkConfig?.award);
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
