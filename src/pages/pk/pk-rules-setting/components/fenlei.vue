<!--
 * @Author: simon
 * @Description: 分类--斗地主
 * @LastEditors: simon
-->
<template>
  <view>
    <!-- S 分类 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             label="分类"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-class.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{current}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 分类 -->

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
        { type: 0, label: '斗第一名(3人)', number: 3 },
        { type: 1, label: '斗第二名(3人)', number: 3 },
        // { type: 2, label: '四人斗地主', number: 4 }
      ]
    };
  },
  computed: {
    // 当前操作
    current() {
      let target = this.actionList.find(
        (e) => e.type == this.pkConfig?.sub_type
      );
      return target?.label;
    },
    competitorList() {
      return this.competitionData?.competitor_list || [];
    }
  },

  methods: {
    // 获取操作信息
    getAction({ type, number }) {
      let preNumber = this.pkConfig.number; // 上一次的人数
      this.SET_PK_CONFIG_ITEM({ key: 'sub_type', data: type });
      this.SET_PK_CONFIG_ITEM({ key: 'number', data: number });
      // 如果选择人数 等于 球员人数时，直接显示全部
      if (number == this.competitorList.length) {
        this.SET_PK_KEY({
          key: 'pkUsers',
          data: this.competitorList
        });
        this.SET_PK_CONFIG_ITEM({
          key: 'players',
          data: this.competitorList.map((e) => e.competitor_id)
        });
        return this.$refs.actionModal.close();
      }
      // 选择人数时清空列表
      if (this.pkConfig.number != preNumber) {
        this.SET_PK_CONFIG_ITEM({ key: 'heti', data: [] });
        this.SET_PK_CONFIG_ITEM({ key: 'dashou', data: '' });
        this.SET_PK_CONFIG_ITEM({ key: 'players', data: [] });
        this.SET_PK_CONFIG_ITEM({ key: 'x8421', data: [] });
        this.SET_PK_KEY({
          key: 'pkUsers',
          data: []
        });
      }
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow() {
      this.$refs.actionModal.open(this.pkConfig.sub_type);
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
