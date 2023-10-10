<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="list-wrapper p-32">
    <BatchCell @click.native="handleShow" />
    <!-- /批量 -->
    <view class="list-cell mt-32"
          v-for="item in getPkTools"
          :key="item.pk_id"
          @click="handle(item)">
      <PkCell :info="item" />
    </view>

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->
  </view>
</template>
<script>
// components
import GCell from '@components/g-cell/index.vue';
import BatchCell from '@/pages/pk/pk-rules-list/components/batch-cell';
import PkCell from '@/pages/pk/pk-rules-list/components/pk-cell';
import ActionModal from '@/pages/pk/pk-rules-setting/components/action-modal';
//utils
import { RULE_CONFIG, RULE_LENGTH } from '@pages/pk/pk-rules-setting/setting';

import { mapState, mapMutations } from 'vuex';
export default {
  components: { GCell, BatchCell, PkCell, ActionModal },
  data() {
    return {
      isNavigateing: false,
      // 操作列表
      actionList: [
        { type: 1, label: '批量"比杆"' },
        { type: 2, label: '批量"比洞"' },
        { type: 3, label: '批量"8421"' }
      ]
    };
  },
  computed: {
    ...mapState({
      pkTools: (state) => state.pk.pkTools,
      pkInfo: (state) => state.pk.pkInfo,
      pkConfig: (state) => state.pk.pkConfig,
      pkHoles: (state) => state.pk.pkHoles,
      competitionData: (state) => state.chatRoom.competitionData, // 球局信息
      isTourists: (state) => state.pk.isTourists, // 是否是游客
      isNowGroup: (state) => state.chatRoom.isNowGroup,
    }),
    competitionListLength() {
      let competitorList = this.competitionData?.competitor_list?.filter(e => e.group == this.isNowGroup).map(
        (e) => e.competitor_id * 1
      );

      return competitorList.length;
    },
    getPkTools() {
      this.pkTools.forEach((pk) => {
        if (pk.pk_id == 1) {  //挂杆 49
          pk.popularity = 49
        } else if (pk.pk_id == 2) { //挂洞 63
          pk.popularity = 63
        } else if (pk.pk_id == 3) { // 挂8421 32
          pk.popularity = 32
        } else if (pk.pk_id == 4) { //斗地主 66
          pk.popularity = 66
        } else if (pk.pk_id == 5) { //四人拉斯 86
          pk.popularity = 86
        } else if (pk.pk_id == 7) { //打老虎 39
          pk.popularity = 39
        }
      })
      return this.pkTools
    }
  },
  methods: {
    ...mapMutations({
      SET_PK_KEY: 'SET_PK_KEY',
      SET_PK_CONFIG_ITEM: 'SET_PK_CONFIG_ITEM'
    }),
    // 获取操作信息
    getAction({ type }) {
      this.$refs.actionModal.close();
      this.SET_PK_KEY({ key: 'batchType', data: type });
      const config = { ...RULE_CONFIG.get(type) };
      config.type = type;
      console.log('点击规则', config);

      this.SET_PK_KEY({ key: 'pkConfig', data: config });
      let competitorList = this.competitionData?.competitor_list?.filter((e) => {
        if (e.group == this.isNowGroup) {
          return e
        }
      }) || [];
      this.SET_PK_KEY({ key: 'batchUserList', data: competitorList });
      uni.navigateTo({
        url: `/pages/pk/pk-rules-setting/index?pk_id=${type}`
      });
    },
    // 显示
    handleShow() {
      if(this.isTourists) {
        uni.showToast({
          title: '当前状态下，你无法进行pk设置',
          icon: 'none'
        })
        return;
      }
      if(this.competitionListLength<2){
        uni.showToast({title: '人数不够', icon: 'none'});
        return;
      }
      this.$refs.actionModal.open();
    },
    handle(item) {
      if(this.isTourists) {
        uni.showToast({
          title: '当前状态下，你无法进行pk设置',
          icon: 'none'
        })
        return;
      }
      if(this.competitionListLength<RULE_LENGTH.get(item.pk_id)){
        uni.showToast({title: '人数不够', icon: 'none'});
        return;
      }

      if (this.isNavigateing) return false;
      this.isNavigateing = true;
      setTimeout(() => {
        this.isNavigateing = false;
      });
      const config = { ...RULE_CONFIG.get(item.pk_id) };
      config.type = item.pk_id;
      console.log('点击规则', config);

      this.SET_PK_KEY({ key: 'pkConfig', data: config });
      uni.navigateTo({
        url: `/pages/pk/pk-rules-setting/index?pk_id=${item.pk_id}`
      });
    }
  }
};
</script>
<style lang="scss" scoped>
// 列表
.list-wrapper {
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}
</style>
