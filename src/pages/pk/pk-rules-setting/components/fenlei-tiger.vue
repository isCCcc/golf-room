<!--
 * @Author: simon
 * @Description: 分类-打老虎
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
        <image :src="`${ossUrl}/icon-dashou.png`"
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
import { mapState } from 'vuex';

export default {
  mixins: [PkMixins],
  components: { GCell, ActionModal },
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      // 操作列表
      actionList: [
        { type: 0, label: '固定老虎' },
        { type: 1, label: '流动老虎' }
      ]
    };
  },
  computed: {
    ...mapState({
      tigerLiuDongList: (state) => state.pk.tigerLiuDongList
    }),
    // 当前操作
    current() {
      let target = this.actionList.find(
        (e) => e.type == this.pkConfig?.tiger_style
      );
      return target?.label;
    },
    // 参赛选手
    competitorList() {
      return this.competitionData?.competitor_list || [];
    }
  },

  methods: {
    // 获取操作信息
    getAction({ type, number }) {
      if (type == 1) {
        let list = this.tigerLiuDongList.length
          ? this.tigerLiuDongList
          : this.competitorList;
        this.SET_PK_KEY({
          key: 'tigerLiuDongList',
          data: list
        });
        this.SET_PK_CONFIG_ITEM({
          key: 'players',
          data: list.map((e) => e.competitor_id)
        });
      }
      this.SET_PK_CONFIG_ITEM({ key: 'tiger_style', data: type });
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow() {
      this.$refs.actionModal.open(this.pkConfig.tiger_style);
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
