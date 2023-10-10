<!--
 * @Author: simon
 * @Description: 包洞
 * @LastEditors: simon
-->
<template>
  <view>
    <!-- S 包洞 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             label="包洞"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-baodong.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{current}} </view>
        </view>
      </GCell>
    </view>
	<GCell v-show="pkConfig.baodong &&pkConfig.type == 5"
		  class="h-120 flex border-b flex-center">
		  <view class="flex" @click="handleBaocond()">
			  <g-checkbox :checked="pkConfig.bao_cond == 1 " />
			  <text class="ml-22 fw-400 col-black">最好成绩必须至少打平（包洞附加条件）</text>
		  </view>
	</GCell>
    <!-- E 包洞 -->

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->

  </view>
</template>
<script>
// components
import GCell from '@components/g-cell/index.vue';
import ActionModal from './action-modal';
// mixins
import PkMixins from '../mixins/index';


export default {
  components: { GCell, ActionModal },
  mixins:[PkMixins],
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      // 操作列表
      actionList: [
        { label: '不包洞' ,type: 0},
        { label: '双帕包洞' ,type: 1},
        { label: '双帕+1包洞',type: 2 }
      ],
     
    };
  },
  computed: {
    // 当前操作
    current() {
      if (this.pkConfig.type == 5) {
        this.actionList = [
          { label: '不包洞' ,type: 0},
          { label: '双帕包洞' ,type: 1},
          { label: '双帕+1包洞',type: 2 },
          { label: '杆数差为洞标准杆',type: 3 },
          { label: '杆数差3杆或更多',type: 4 }
        ]
      }
      let target = this.actionList.find((e) => e.type == this.pkConfig?.baodong);
      return target?.label;
    }
  },


  methods: {
    // 获取操作列表
    getAction({type}) {
      this.SET_PK_CONFIG_ITEM({ key: 'baodong', data: type });
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow() {
      this.$refs.actionModal.open(this.pkConfig?.baodong);
    },
	handleBaocond() {
		let baocond = this.pkConfig.bao_cond == 1 ? 0 : 1 
		this.SET_PK_CONFIG_ITEM({ key: 'bao_cond', data: baocond });
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
