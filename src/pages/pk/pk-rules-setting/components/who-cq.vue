
<template>
  <view>
    <!-- S 谁来抽 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             label="谁来抽"
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
        { type: 0, label: '任何人都可以抽' },
        { type: 1, label: '成绩最好的优先抽' },
      ]
    };
  },
  computed: {
    // 当前操作
    current() {
      let target = this.actionList.find(
        (e) => e.type == this.pkConfig?.who_cq
      );
      return target.label;
    }
  },

  methods: {
    // 获取操作信息
    getAction({ type }) {
      this.SET_PK_CONFIG_ITEM({ key: 'who_cq', data: type });
      this.$refs.actionModal.close();
	  
	  if (type == 1) {	//	弹框
		  uni.showModal({
		    title: `请其他人保持手机开机`,
		    content: `打的最好的优先抽签，如一分钟内没有抽，可由其他人代抽`,
		    confirmText: '知道啦',
		    confirmColor: '#95D171',
		    showCancel: false,
		    success: async (res) => {
		      if (res.confirm) {
		      } else if (res.cancel) {
		        console.log('用户点击取消');
		      }
		    }
		  });
	  }
    },
    // 显示
    handleShow() {
      this.$refs.actionModal.open(this.pkConfig.who_cq);
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
