<template>
  <view>
    <!-- S 顶的定义 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             label="顶的定义"
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
    <!-- E 顶的定义 -->

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
        { type: 0, label: '得分打平' },
        { type: 1, label: '杆数单项完全一样' },	
        { type: 2, label: '得分差不超过1分' },
        { type: 3, label: '得分差不超过2分' },
        { type: 4, label: '得分差不超过3分' },
        { type: 5, label: '得分差不超过4分' },
        { type: 6, label: '得分差不超过5分' },
      ]
    };
  },
  computed: {
    // 当前操作
    current() {
      let target = this.actionList.find(
        (e) => e.type == this.pkConfig?.draw_define
      );
      return target.label;
    }
  },

  methods: {
    // 获取操作信息
    getAction({ type }) {
      this.SET_PK_CONFIG_ITEM({ key: 'draw_define', data: type });
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow() {
      this.$refs.actionModal.open(this.pkConfig.draw_define);
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
