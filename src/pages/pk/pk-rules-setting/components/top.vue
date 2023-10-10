<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: superJane
-->
<template>
  <view class="wrapper mb-32">
    <!-- S 有效洞 -->
    <view class="border-b h-120 flex">
      <GCell className="plr-32"
             label="有效洞"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-hole.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120"
              @click="handleModal('holes', {holes: isHoles})">
          <HolesCell :pkHoles="pkHoles"
                     :validHoles="isHoles"></HolesCell>
        </view>
      </GCell>
    </view>
    <!-- E 有效洞 -->

    <!-- S 参与人数 -->
    <view class="h-120 flex"
          v-if="isJoinNumbers">
      <GCell className="plr-32"
             label="参与人数"
             isLink
             class="flex1"
             iconSize="36rpx"
             @click.native="handleModal('actionModal',pkConfig.number)">
        <image :src="`${ossUrl}/icon-join.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 pr-10">
          <view class="col-999"> {{currentLabel}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 参与人数 -->

    <FenLei v-if="isFenlei" />
    <!-- /分类 斗地主 -->
    
    <!-- S 分组 -->
    <FenZu v-if="options.fenzu" />
      <!-- E 分组 -->

    <HolesModal ref="holes" />
    <!-- /选择有效球洞 -->
    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
  </view>
</template>

<script>
// 组件
import GCell from '@components/g-cell/index.vue';
import HolesModal from '@/pages/pk/pk-rules-setting/components/holes-modal';
import ActionModal from './action-modal';
import FenLei from './fenlei';
import HolesCell from '@pages/pk/pk-rules-setting/components/holes';
import FenZu from './fenzu';
// mixins
import PkMixins from '../mixins/index';
import { mapMutations, mapState } from 'vuex';
import { mutationsTypes } from '@/store/modules/pk/types';

export default {
  mixins: [PkMixins],
  components: {
    GCell,
    HolesModal,
    ActionModal,
    FenLei,
	HolesCell,
    FenZu,
	
  },
  props: {
    options: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`
    };
  },
  computed: {
    ...mapState({
      pkHoles: (state) => state.pk.pkHoles,
      pkConfig: (state) => state.pk.pkConfig,
      batchType: (state) => state.pk.batchType, // 批量类型
      pkUsers(state) {	//() => {}函数语法，因为它过早地绑定了this，导致后面用不了this;新增规则时检验组里参与人员是否等于游戏规则人数，是的话自动填充
        let competitorList = state.chatRoom.competitionData?.competitor_list?.filter(e => e.group == state.chatRoom.isNowGroup).map(
                (e) => e
         );
         return competitorList
      } // 参与选手
    }),
    // 有效球洞
    isHoles() {
      return this.pkConfig?.valid_holes;
    },
    // 有参与人数选项
    isJoinNumbers() {
      return this.options.joinNumbers && !this.batchType;
    },
    // 分类 斗地主
    isFenlei() {
      return this.options.fenlei;
    },
    // 有分组选项
    isGroup() {
      return this.options.group;
    },
    // 有高手不见面选项
    isMasterNotSee() {
      return this.options.masterNotSee;
    },
    // 操作列表
    actionList() {
      let list = [{ type: 2, label: '2人单挂' }];
      if (this.pkUsers?.length > 2) {
        for (let i = 3; i <= this.pkUsers.length; i++) {
          list.push({
            type: i,
            label: `${i}人互挂`
          });
        }
      }

      return list;
    },
    // 当前操作
    currentLabel() {
      let target = this.actionList?.find(
        (e) => e.type == this.pkConfig?.number
      );
      return target?.label;
    },
    
  },
  methods: {
    ...mapMutations([mutationsTypes.SET_PK_KEY]),
    // 获取操作列表
    getAction({ type }) {
      let preNum = this.pkConfig.number; // 上一次选择的人数
      let competitorList = this.competitionData?.competitor_list || [];
      this.SET_PK_CONFIG_ITEM({ key: 'number', data: type });
	  
	  if (this.pkConfig.hasOwnProperty('pankou')) {	//原来pankou>0，重新选参与人数时要置零
	  	this.SET_PK_CONFIG_ITEM({ key: 'pankou', data: 0 });
	  }

      // 如果选择人数 等于 球员人数时，直接显示全部
      if (type == competitorList.length && preNum != type) {
        this.SET_PK_KEY({
          key: 'pkUsers',
          data: competitorList.map((e) => {
            this.$set(e, 'rangGan', false);
            this.$set(e, 'rangFen', false);
            this.$set(e, 'x8421', '8421');
            this.$set(e, 'sflag', '8421');
            return e;
          })
        });

        this.SET_PK_CONFIG_ITEM({
          key: 'players',
          data: competitorList.map((e) => e.competitor_id)
        });
		
        return this.$refs.actionModal.close();
      }
      // 选择人数时清空列表
      if (preNum != type) {
        this.SET_PK_KEY({
          key: 'pkUsers',
          data: []
        });

        this.SET_PK_CONFIG_ITEM({
          key: 'players',
          data: []
        });
      }
      this.$refs.actionModal.close();
    },
    // 打开对应选项模块
    handleModal(modal, data) {
      this.$refs[modal].open(data || {});
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/index.scss';
.pr-10 {
  padding-right: 10rpx;
}

// 图标大小
.left-icon {
  margin-right: 13rpx;
  width: 40rpx;
}
</style>
