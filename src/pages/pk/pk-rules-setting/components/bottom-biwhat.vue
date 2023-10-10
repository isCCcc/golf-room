<!--
 * @Author: simon
 * @Description: 比什么
 * @LastEditors: superJane
-->
<template>
  <view v-show="pkConfig.tiger_style == 0">
    <!-- S 比什么 -->
    <view class="h-120 flex border-b"
          @click="handleShow">
      <GCell className="plr-32"
             label="比什么"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-hole.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{current}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 比什么 -->

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
        { label: '比洞' ,type: 0},
        { label: '比杆' ,type: 1},
      ],
     
    };
  },
  computed: {
    // 当前操作
    current() {
      let target = this.actionList.find((e) => e.type == this.pkConfig?.sub_type);
      return target?.label;
    }
  },


  methods: {
    // 获取操作列表
    getAction({type}) {
      this.SET_PK_CONFIG_ITEM({ key: 'sub_type', data: type });
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow() {
      this.$refs.actionModal.open(this.pkConfig?.sub_type);
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
