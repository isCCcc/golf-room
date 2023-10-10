<!--
 * @Author: simon
 * @Description: 受让杆球手
 * @LastEditors: simon
-->
<template>
  <view v-show="!pkConfig.transferee_name">
    <button class="button plain fw-500 fs-28 button-box"
            @click="handleShow('userModal',{list: competitorList,number: 1})">
      + 受让杆球手
    </button>
    <UserModal ref="userModal"
               type="confirm"
               :maxNum="srMaxNum"
               :tips="srTips"
               @onChange="getUsers" />
    <!-- /选择人 -->
  </view>
</template>

<script>
// 组件
import UserModal from '@/pages/pk/pk-rules-setting/components/user-modal';
// mixins
import PkMixins from '../mixins/index';
import { mapState } from 'vuex';

export default {
  components: { UserModal },
  mixins: [PkMixins],
  data() {
    return {
      srMaxNumConfig: {//最大受让
        5: 3, 
      },
      srTipsList: {
        5: '选受让杆球手(1-3人)'
      }
    };
  },
  computed: {
    // 参赛选手
    competitorList() {
      return this.competitionData?.competitor_list;
    },
    ...mapState({ pkConfig: (state) => state.pk.pkConfig }),
    srMaxNum() {
    	return this?.srMaxNumConfig?.[this.pkConfig.type] || 0;
    },
    srTips() {
    	return this?.srTipsList?.[this.pkConfig.type] || '选受让杆球手';
    }
  },
  methods: {
    // 获取人员
    getUsers(data) {
      let ids = data.map((e) => e.competitor_id);
      let name = data.map((e) => e.username).join(',');
      this.SET_PK_CONFIG_ITEM({ key: 'transferee_ids', data: ids });
      this.SET_PK_CONFIG_ITEM({ key: 'transferee_name', data: name });
      console.log(this.pkConfig);
    },
    // 显示
    handleShow(modal, data) {
      console.log(data);
      this.$refs[modal].open(data || null);
    }
  }
};
</script>

<style lang="scss" scoped>
button.button {
  height: 96rpx;
  line-height: 96rpx;
}

.button.button-box {
  background: transparent;
  border: 1rpx solid rgba(0, 60, 61, 0.4);
}
</style>
