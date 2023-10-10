<!--
 * @Author: simon
 * @Description: 打手
 * @LastEditors: simon
-->
<template>
  <view>
    <!-- S 打手 -->
    <view class="h-120 flex border-b"
          @click="handleShow('actionModal')">
      <GCell className="plr-32"
             :label="hetiFlag ? '球手合体' : '打手'"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-dashou.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name text-over"> {{currentLabel}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 打手 -->

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->

    <UserModal ref="userModal"
                tips="请选择1人"
               @onChange="getUsers" />
    <!-- /选择人 -->

  </view>
</template>
<script>
// components
import GCell from '@components/g-cell/index.vue';
import ActionModal from './action-modal';
import UserModal from '@/pages/pk/pk-rules-setting/components/user-modal';
// mixins
import PkMixins from '../mixins/index';

export default {
  components: { GCell, ActionModal, UserModal },
  mixins: [PkMixins],
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      // 操作列表
      actionList: [
        { label: '(空缺)', type: 'no' },
        { label: '选择打手...', type: 'yes' }
      ],
      // 当前奖励
      current: 'no'
    };
  },

  computed: {
    competitorList() {
      return this.competitionData?.competitor_list || [];
    },

    // 找出打手信息
    dashouInfo() {
      return (
        this.competitorList.find(
          (e) => e.competitor_id == this.pkConfig?.dashou
        ) || {}
      );
    },
    // labe标题
    hetiFlag() {
      return this.pkConfig.sub_type == 2;
    },
    // 找出合体成员
    hetiInfo() {
      let list = this.competitorList.filter((e) =>
        this.pkConfig.heti.some((v) => v == e.competitor_id)
      );
      return list.map((e) => e.username) || [];
    },
    // 打手名字显示
    currentLabel() {
      let label1 = this.pkConfig?.dashou ? this.dashouInfo.username : '(空缺)';
      let label2 = this.hetiInfo.length ? this.hetiInfo.join('/') : '(空缺)';
      return this.hetiFlag ? label2 : label1;
    }
  },

  methods: {
    // 获取人员
    getUsers(data) {
      let params = {
        heti: this.hetiFlag ? data.map((e) => e.competitor_id) : [],
        dashou: this.hetiFlag ? '' : data[0].competitor_id
      };
      this.setDashou(params);
    },
    // 设置打手值
    setDashou({ heti, dashou }) {
      this.SET_PK_CONFIG_ITEM({
        key: 'heti',
        data: heti
      });
      this.SET_PK_CONFIG_ITEM({
        key: 'dashou',
        data: dashou
      });
    },
    // 获取操作列表
    getAction({ type }) {
      // 空缺
      if (type == 'no') {
        this.SET_PK_CONFIG_ITEM({
          key: 'dashou',
          data: ''
        });
      }
      switch (type) {
        case 'no':
          break;
        // 选择人员
        case 'yes':
          if (this.competitorList.length < 4) {
            return uni.showToast({
              icon: 'none',
              title: '人数不够'
            });
          }
          let params = {
            list: this.competitorList,
            number: this.hetiFlag ? 2 : 1
          };
          this.handleShow('userModal', params);
          break;
        default:
          break;
      }
      this.$refs.actionModal.close();
    },
    // 打开对应选项模块
    handleShow(modal, data) {
      this.$refs[modal].open(data || {});
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
