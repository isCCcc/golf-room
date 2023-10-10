
<template>
  <view>
    <!-- S 出门顶洞 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             label="出门顶洞"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-groove.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{pkConfig.start_ding}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 出门顶洞 -->
	
	<uniPopup type="bottom" ref="popup"  background-color="#fff">
		<view class="holes-wrapper">
			<view class="holes-cell"
			      :class="{ active: pkConfig.start_ding == 0 }"
			      @click="setStartDing(0)">0</view>
		  <template v-for="(item, idx) in pkConfig.valid_holes">
		    <view class="holes-cell"
		          :key="item"
		          :class="{ active: idx+1 == pkConfig.start_ding }"
		          @click="setStartDing(idx+1)">{{idx+1}}</view>
		  </template>
		  <view class="holes-cell"
		        :class="{ active: pkConfig.start_ding == 19 }"
		        @click="setStartDing(19)">19</view>
		</view>
        <view class="action-cell h-120 flex-center col-53"
         @click="close()">取消</view>
	</uniPopup>
  </view>
</template>
<script>
// 组件
import GCell from '@components/g-cell/index.vue';
import uniPopup from '@/components/uni-popup/uni-popup';
// mixins
import PkMixins from '../mixins/index';
// js
import { award } from '../setting';
export default {
  mixins: [PkMixins],
  components: { GCell, uniPopup},
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      // 操作列表
      // actionList: []
    };
  },

  methods: {
    // 获取操作信息
    setStartDing(startDing) {
      this.SET_PK_CONFIG_ITEM({ key: 'start_ding', data: startDing });
      this.$refs.popup.close();
    },
    // 显示
    handleShow() {
      this.$refs.popup.open();
    },
    close() {
        this.$refs.popup.close();
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
.holes-wrapper {
  padding: 40rpx 32rpx;
  display: grid;
  grid-row-gap: 39.26rpx;
  grid-column-gap: 22.87rpx;
  grid-template-columns: repeat(6, 1fr);
  border-bottom: 12rpx solid $bg-col-f9;
}
.holes-cell {
  height: 90rpx;
  width: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background-color: #FFFFFF;
  border: 1rpx #e9e9e9 solid;
  border-radius: 50%;
  font-size: 24rpx;
  font-weight: 400;
}
.holes-cell.active {
	background: rgba(30, 62, 66, 0.1);
	border: 1rpx solid #1E3E42;
}
</style>
