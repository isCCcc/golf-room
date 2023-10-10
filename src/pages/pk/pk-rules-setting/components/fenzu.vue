
<template>
  <view>
    <!-- S 分组 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             label="分组"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-fenzu.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{current}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 分组 -->
	
	<!-- E 固拉 -->
	<SubGroup v-if="pkConfig.sub_type == 0" :oldSubType=oldSubType />
	<!-- E 固拉 -->
	
	<!-- E 乱拉 -->
	<Bjm v-else-if="pkConfig.sub_type == 1" />
	<!-- E 乱拉 -->
	
	<!-- E 谁来抽 -->
	<WhoCq v-else-if="pkConfig.sub_type == 2" />
	<!-- E 谁来抽 -->

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
import SubGroup from './sub-group';
import Bjm from './bjm';
import WhoCq from './who-cq';
// mixins
import PkMixins from '../mixins/index';

export default {
  mixins: [PkMixins],
  components: { GCell, ActionModal, SubGroup, Bjm, WhoCq },
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      // 操作列表
      actionList: [
        { type: 0, label: '固拉'},
        { type: 1, label: '乱拉' },
        { type: 2, label: '抽签（每洞抽）' }
      ],
      oldSubType: 1
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
    getAction({ type }) {
      this.oldSubType = this.pkConfig.sub_type
      this.SET_PK_CONFIG_ITEM({ key: 'sub_type', data: type });
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
