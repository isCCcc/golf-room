<!--
 * @Author: simon
 * @Description: 顶洞
 * @LastEditors: simon
-->
<template>
  <view>
    <!-- S 顶洞 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             :label="pkConfig.type == 5 ? (pkConfig.jifen_type == 2 ? '平头/平尾' : '顶洞处理') : '顶洞'"
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
    <!-- E 顶洞 -->

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
        { type: 0, label: '顶平过' },
        { type: 1, label: '下洞加1分' },
        { type: 2, label: '下洞加倍' },
        { type: 3, label: '下洞加2分' },
        { type: 4, label: '下洞加3分' },
        { type: 5, label: '连续翻倍' }
      ]
    };
  },
  computed: {
    // 当前操作
    current() {
		if (this.pkConfig.type == 5) {	//4人拉斯加玩法
		  this.actionList = [
        { type: 0, label: '顶平过' },
        { type: 1, label: '下洞加1分' },
        { type: 2, label: '下洞加倍' },
        { type: 3, label: '下洞加2分' },
        { type: 4, label: '下洞加3分' },
        { type: 5, label: '连续翻倍' },
        { type: 6, label: '吃肉(北方玩法)' },
      ]
		}
      let target = this.actionList.find(
        (e) => e.type == this.pkConfig?.draw_type
      );
      return target.label;
    }
  },

  methods: {
    // 获取操作信息
    getAction({ type }) {
      this.SET_PK_CONFIG_ITEM({ key: 'draw_type', data: type });
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow() {
      this.$refs.actionModal.open(this.pkConfig.draw_type);
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
