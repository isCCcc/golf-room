<!--
 * @Author: simon
 * @Description: 计分
 * @LastEditors: simon
-->
<template>
  <view>
    <!-- S 计分 -->
    <view class="h-120 flex border-b"
          @click="handleShow({type: 'actionModal',data: pkConfig.jifen_type})">
      <GCell className="plr-32"
             label="计分"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-score.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 cell-name">{{current}}</view>
        </view>
      </GCell>
    </view>
    <!-- E 计分 （1/2/3分 和 四人拉斯-头尾肉）-->
    <PkScore v-show="jifenType  == 0 || (pkConfig.type == 5 && jifenType == 2)" :oldJifenType="oldJifenType"/>
   
    <ScoreRules  v-show="jifenType  == 1"/>

    <!-- S 用户列表 -->
    <view class="user-list p-32"
          v-show="jifenType == 1">
      <view v-for="(item,index) in pkUsers"
            :key="item.competitor_id"
            class="user-cell flex">
        <view class="flex flex1">
          <view class="g-avatar"
                :style="{backgroundImage:  `url(${item.avatar_url || ''})`}"></view>
          <view class="text-over ml-10">{{item.username}}</view>
        </view>
        <view class="box-8421 tc"
              @click="handleSflag(index)">{{pkConfig.type == 5 ? item.x8421 : item.sflag}}</view>
      </view>
    </view>
    <!-- E 用户列表 -->

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->

    <NumberLlistModal ref="numberModal"
                      :type="pkConfig.type == 5 ? 2 : 1"
                      @onClick="getNumber" />
    <!-- /数字列表 -->
    <InputModal ref="inputModal"
                placeholder="请输入4位或5位数字"
                type="8421"
                @onChange="getInputValue" />
  </view>
</template>
<script>
// 组件
import GCell from '@components/g-cell/index.vue';
import ActionModal from './action-modal';
import PkScore from './pk-score';
import ScoreRules from '@/pages/pk/pk-rules-setting/components/score-rules';
import NumberLlistModal from '@/pages/pk/pk-rules-setting/components/number-llist-modal';
import InputModal from '@/pages/pk/pk-rules-setting/components/input-modal';
// mixins
import PkMixins from '../mixins/index';
// vuex
import { mapMutations, mapState } from 'vuex';
import { mutationsTypes } from '@/store/modules/pk/types';

export default {
  mixins: [PkMixins],
  components: { GCell, ActionModal, PkScore, ScoreRules, NumberLlistModal, InputModal },
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,

      // 计分规则
      actionList: [
        { label: '1/2/3分', type: 0 },
        { label: '8421+', type: 1 },
        { label: '杆数相乘', type: 2 }
      ],
      sindex: -1, // 当前分数索引
      actionList2: [
        { label: '4310', type: '4310' },
        { label: '4210', type: '4210' },
        { label: '5310', type: '5310' },
        { label: '5321', type: '5321' },
        { label: '6421', type: '6421' },
        { label: '7421', type: '7421' },
        { label: '7321', type: '7321' },
        { label: '8321', type: '8321' },
        { label: '8421', type: '8421' },
        { label: '8431', type: '8431' },
        { label: '8521', type: '8521' },
        { label: '8531', type: '8531' }
      ],
      uindex: -1, // 当前用户索引
      oldJifenType: 0
    };
  },
  computed: {
    ...mapState({
	  pkConfig: (state) => {
      return state.pk.pkConfig;
	  },
    pkUsers: (state) => {
      return state.pk.pkUsers;
      }
    }), // 参与选手
    userList() {
      let list = this.pkUsers.map((e) => {
        e.sflag = e.sflag || '8421';
        e.x8421 = e.x8421 || '8421';
        return e;
      });
      return list;
    },
    // 当前操作
    current() {
	  if (this.pkConfig.type == 5) {
		  this.actionList = [
		    { label: '1/2/3分', type: 0 },
		    { label: '8421+', type: 1 },
		    // { label: '头尾肉(公母鸡)', type: 2 },
		    { label: '杆数相乘', type: 3 },
		    { label: '杆数相加', type: 4 }
		  ]
	  }
      let target = this.actionList.find(
        (e) => e.type == this.pkConfig?.jifen_type
      );
      return target?.label;
    },
    // 计分类型
    jifenType() {
      return this.pkConfig.jifen_type;
    }
  },
  methods: {
    ...mapMutations([mutationsTypes.SET_PK_KEY]),
    // 获取分数
    getNumber({ type }) {
      // 自定义分数
      if (type == 'custom') {
        this.$refs.numberModal.close();
        this.$refs['inputModal'].open();
        return;
      }
      if (this.pkConfig.type == 5) {
        this.pkUsers[this.uindex].x8421 = type
      } else {
        this.pkUsers[this.uindex].sflag = type;
      }

      this.SET_PK_KEY({ key: 'pkUsers', data: this.pkUsers });
      this.$refs.numberModal.close();
      this.$forceUpdate()
    },
    // 点击分数
    handleSflag(index) {
      this.uindex = index;
      this.handleShow({
        type: 'numberModal',
        data: this.pkConfig.type == 5 ? this.pkUsers[this.uindex].x8421 : this.pkUsers[this.uindex].sflag
      });
    },

    // 获取操作信息
    getAction({ type }) {
      this.oldJifenType = this.pkConfig.jifen_type
      this.SET_PK_CONFIG_ITEM({ key: 'jifen_type', data: type });
      if (this.pkConfig.jifen_type == 2) {  //头尾肉的时候重置
        this.SET_PK_CONFIG_ITEM({ key: 'pk_best', data: 1 });
        this.SET_PK_CONFIG_ITEM({ key: 'unit_best', data: 1 });
        this.SET_PK_CONFIG_ITEM({ key: 'pk_worst', data: 1 });
        this.SET_PK_CONFIG_ITEM({ key: 'unit_worst', data: 1 });
        this.SET_PK_CONFIG_ITEM({ key: 'pk_total', data: 0 });
        this.SET_PK_CONFIG_ITEM({ key: 'unit_total', data: 0 });
      }
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow({ type, data }) {
      this.$refs[type].open(data);
    },
    // 获取输入的值
    getInputValue(value) {
      this.pkUsers[this.uindex].x8421 = value + '';
      this.SET_PK_KEY({ key: 'pkUsers', data: this.pkUsers });
      this.$refs.inputModal.close();
      this.$forceUpdate()
    },
  }
};
</script>
<style lang="scss" scoped>
.cell-name {
  margin-top: -7rpx;
}
.ml-22 {
  margin-left: 22rpx;
}
// 图标
.left-icon {
  margin-right: 13rpx;
  width: 40rpx;
}

// S 选手列表
.user-list {
  padding-right: 200rpx;
  .user-cell {
    .g-avatar {
      flex:  0 0 80rpx;
      @include wh(80rpx, 80rpx);
    }
    margin-bottom: 32rpx;
    .box-8421 {
      flex: 0 0 90rpx;
      width: 90rpx;
      line-height: 40rpx;
      color: $col-1e3;
      background: $sub-color;
      border-radius: 2rpx;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
// E 选手列表
</style>
