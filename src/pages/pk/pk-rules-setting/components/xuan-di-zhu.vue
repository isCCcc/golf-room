<template>
  <view>
    <!-- S 选地主 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             label="选地主"
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
    <!-- E 选地主 -->

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->
	
	<UserModal ref="userModal"
	           type="change"
             :maskClick=false
             :canCancel=false
             tips="请选择1人"
	           @onChange="getUsers"
				/>
	<!-- /选择人 -->
  </view>
</template>
<script>
// 组件
import GCell from '@components/g-cell/index.vue';
import ActionModal from './action-modal';
import UserModal from '@/pages/pk/pk-rules-setting/components/user-modal';
// mixins
import PkMixins from '../mixins/index';

export default {
  mixins: [PkMixins],
  components: { GCell, ActionModal, UserModal },
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      // 操作列表
      actionList: [
        { type: 0, label: '流动地主', subtitle: '流动' },
        { type: 1, label: '固定地主', subtitle: '固定' },
      ]
    };
  },
  computed: {
    // 当前操作
    current() {
	  let current = ''
      let target = this.actionList.find(
        (e) => e.type == this.pkConfig?.guding
      );
	  current = target?.subtitle

	  if (this.pkConfig?.guding) {
		  let gdUser = this.competitorList.filter((e) => {return e.competitor_id == this.pkConfig.gd_uid})
		  let gdUserName = gdUser?.[0]?.username
		  current += gdUserName ? `:${gdUserName}` : ''
	  }

      return current;
    },
    competitorList() {
      return this.competitionData?.competitor_list || [];
    }
  },

  methods: {
	  // 获取操作信息
	  getAction({ type }) {
	    this.SET_PK_CONFIG_ITEM({ key: 'guding', data: type });
	    this.$refs.actionModal.close();
		if (type == 1) {
			this.$refs.userModal.open({ list: this.competitorList, number: 1 });
		} else {
			this.SET_PK_CONFIG_ITEM({ key: 'gd_uid', data: "" });
		}
	  },
	  // 显示
	  handleShow() {
	    this.$refs.actionModal.open(this.pkConfig.guding);
	  },
	  getUsers(data) {
      let ids = data.map((e) => e.competitor_id);
      this.SET_PK_CONFIG_ITEM({ key: 'gd_uid', data: ids[0] });
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
