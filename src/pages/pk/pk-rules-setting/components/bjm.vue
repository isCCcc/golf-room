
<template>
  <view>
    <!-- S 高手不见面 -->
    <view class="h-120 flex border-b"
          @click="handleShow('actionModal', pkConfig.bjm.length == 0 ? 0 : 1)">
      <GCell className="plr-32"
             label="高手不见面"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-fenzu.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{current()}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 高手不见面 -->
    
    <!-- S 分组依据 8421的时候才有 -->
    <view v-if="pkConfig.jifen_type == 1"
          class="h-120 flex border-b"
          @click="handleShow('dffzModal', pkConfig.dfzz)">
      <GCell className="plr-32"
             label="分组依据"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-fenzu.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{dffzCurrent}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 分组依据 -->
    
    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
                 
    <ActionModal ref="dffzModal"
                 :list="dffzList"
                 @onClick="getDffz" />
    <!-- /操作列表 -->
    <UserModal ref="userModal"
               type="change"
               :maskClick=false
               tips="选择球手(2人)"
               @onChange="getUsers" />
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
        { type: 0, label: '不限制' },
        { type: 1, label: '设置高手...' },
      ],
      dffzList: [
        { type: 0, label: '个人洞成绩' },
        { type: 1, label: '个人8421得分' },
      ]
    };
  },
  computed: {
    competitorList() {
      return this.competitionData?.competitor_list || [];
    },
    bjm() {
    	return this.pkConfig.bjm
    },
    bjmNames() {
    	let bjmNames = []
    	
    	this.competitorList.forEach((competitor) => {
    		if (this.bjm.indexOf(competitor.competitor_id) != -1) {
    			bjmNames.push(competitor.username)
    		}
    	})
    	
    	return bjmNames
    },
    dffzCurrent() {
      let target = this.dffzList.find(
        (e) => e.type == this.pkConfig?.dffz
      );
      return target?.label;
    }
  },

  methods: {
	  current() {
		  return this.bjm.length ? this.bjmNames.join(',') : '不限制'
	  },
    // 获取操作信息
    getAction({ type }) {
      if (type == 0) {
      	this.SET_PK_CONFIG_ITEM({ key: 'bjm', data: [] });
      	this.$refs.actionModal.close();
      	return;
      }
      this.$refs.actionModal.close();
      let list = this.competitorList
      let number = 2
      this.handleShow('userModal', { list, number });
    },
    // 打开对应选项模块
    handleShow(modal, data) {
      console.log(data)
      this.$refs[modal].open(data !== null ? data : null);
    },
    getUsers(info) {
    	let bjm = []
    	let bjmNames = []
    	
    	info.forEach((competitor) => {
    		bjm.push(competitor.competitor_id)
    	})
    	
    	this.SET_PK_CONFIG_ITEM({ key: 'bjm', data: bjm });
    },
    getDffz({ type }) {
      this.SET_PK_CONFIG_ITEM({ key: 'dffz', data: type });
      this.$refs.dffzModal.close();
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
