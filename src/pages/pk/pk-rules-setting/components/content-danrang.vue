<!--
 * @Author: simon
 * @Description: 单让
 * @LastEditors: simon
-->
<template>
  <view>
    <!-- S 单让 -->
    <view class="h-120 flex border-b"
          @click="handleShow({key: 'actionModal',data: pkConfig.rang_style})">
      <GCell className="plr-32"
             :label="isMutual ? '互让' : '单让'"
             isLink
             class="flex1"
             iconSize="36rpx">
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{current}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 单让 -->

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->

    <InputModal ref="inputModal"
                :title="inputTitle"
                @onChange="getInputValue" />
    <!-- /输入弹窗 -->
  </view>
</template>
<script>
// 组件
import GCell from '@components/g-cell/index.vue';
import ActionModal from './action-modal';
import InputModal from '@/pages/pk/pk-rules-setting/components/input-modal';
// mixins
import PkMixins from '../mixins/index';
// vuex
import { mapMutations, mapState } from 'vuex';

export default {
  mixins: [PkMixins],
  components: { GCell, ActionModal, InputModal },
  data() {
    return {
      // 当前奖励
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      inputTitle: '让分：'
    };
  },

  computed: {
    ...mapState({
      pkUsers: (state) => {
        return state.pk.pkUsers;
      }, // 参与选手
      batchType: (state) => state.pk.batchType // 批量类型
    }),
    // 当前让分
    current() {
      let target = this.actionList.find(
        (e) => e.type == this.pkConfig?.rang_style
      );
      if (target.type == 5) {
        return `${target.label}${this.pkConfig.pankou}分`;
      } else if (target.label == '单让：固定分') {
        return `总分：让${this.pkConfig.pankou}分`;
      } else {
        return target.label;
      }
    },
    // 是否单让
    isMutual() {
      return this.pkConfig?.rang_style > 0 || this.pkConfig.number > 2;
    },

    // 操作列表
    actionList() {
      let firstLabel = this.batchType
        ? '不让'
        : this.pkConfig.number > 2
        ? '不让'
        : '单让：固定分';
      let list = [
        { type: 0, label: firstLabel },
        { type: 1, label: '相互：2让1' },
        { type: 2, label: '相互：3让1' },
        { type: 3, label: '相互：4让1' },
        { type: 4, label: '相互：5让1' },
        { type: 5, label: '相互：虚让' }
      ];
      return list;
    }
  },

  methods: {
    // 获取输入的值
    getInputValue(value) {
      this.SET_PK_CONFIG_ITEM({ key: 'pankou', data: value });
    },
    // 获取操作信息
    getAction({ type, label }) {
      this.SET_PK_CONFIG_ITEM({ key: 'rang_style', data: type });
      this.$refs.actionModal.close();
      if (this.batchType) return;
      // 虚让弹出输入值
      (type == 5 || label == '单让：固定分') &&
        this.handleShow({ key: 'inputModal' });
      // 非虚让类型，清空需让值s
      (type != 5 || label == '单让：固定分') &&
        this.SET_PK_CONFIG_ITEM({ key: 'pankou', data: 0 });
    },
    // 显示
    handleShow({ key, data }) {
      this.$refs[key].open(data);
    }
  }
};
</script>
<style lang="scss" scoped>
.cell-name {
  margin-top: -7rpx;
}
.ml-22 {
  margin-left: 22rpx;
}
.pl-102 {
  padding-left: 102rpx;
}
</style>
