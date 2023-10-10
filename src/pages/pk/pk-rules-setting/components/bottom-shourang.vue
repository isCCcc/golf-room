<!--
 * @Author: simon
 * @Description: 受让杆者
 * @LastEditors: simon
-->
<template>
  <view v-show="showRang">
    <!-- S 受让杆者 -->
    <view class="h-120 flex border-b"
          @click="handleShow('actionModal')"
          v-show="pkConfig.transferee_name">
      <GCell className="plr-32"
             label="受让杆者"
             isLink
             class="flex1"
             iconSize="36rpx">
        <image :src="`${ossUrl}/icon-shourangzhe.png`"
               class="left-icon"
               mode="widthFix"
               slot="left-icon" />
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name text-over"> {{ pkConfig.transferee_name  || '无'}} </view>
        </view>
      </GCell>
    </view>
    <!-- E 受让杆者 -->
    <!-- S 杆设置 -->
    <view class="gan-list"
          v-show="pkConfig.transferee_name">
      <view class="h-120 flex border-b check-cell">
        <view v-for="item in checkGanList"
              :key="item.key"
              class="flex1 flex"
              @click="handleCheck(item)">
          <g-checkbox :checked="pkConfig[item.key] == 1" />
          <text class="ml-20 fs-24"
                :class="[pkConfig[item.key] == 1 ? 'col-black' : 'col-999']">{{item.label}}</text>
        </view>
      </view>
      <view>
        <view class="h-120 flex-between border-b plr-32 bg-col-f9"
              v-for="item in ganList"
              :key="item.key">
          <view>{{item.label}}</view>
          <view class="number-box flex tc">
            <view class="number-box-square flex-center"
                  @click="handleSetScore(item, { count: -0.5})"><text>-</text></view>
            <view class="number-box-value fs-32 tc">
              <text v-if="item.value == 0">不让杆</text>
              <text v-else>让{{item.value}}杆</text>
            </view>
            <view class="number-box-square flex-center"
                  @click="handleSetScore(item, { count: 0.5 })"><text>+</text></view>
          </view>
        </view>
      </view>
    </view>
    <!-- E 杆设置 -->
	
	<!-- S 洞设置 -->
	<view  v-show="pkConfig.type == 5 && pkConfig.transferee_name" class="bg-col-f9">
		<view class="fs-32 fw-400 Rubik pt-32 plr-32 h-32">让哪些洞？（点击修改）</view>
		<view class="holes-wrapper p-32" v-show="pkConfig.transferee_name">
		    <view  v-for="(hole, idx) in pkConfig.transferee_holes"
				class="holes-cell"
		          :key="idx"
		          :class="{ active: hole==1 }"
		          @click="handleTransfereeHole(idx, hole)"
				  >
				  {{idx+1}}
			</view>
		</view>
	</view>
	<!-- E 洞设置 -->
	
    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->

    <UserModal ref="userModal"
               type="confirm"
               :maxNum="srMaxNum"
               :tips="srTips"
               @onChange="getUsers" />
    <!-- /选择人 -->
  </view>
</template>
<script>
// components
import GCell from '@components/g-cell/index.vue';
import ActionModal from './action-modal';
import UserModal from '@/pages/pk/pk-rules-setting/components/user-modal';
import { mapState } from 'vuex';

// mixins
import PkMixins from '../mixins/index';

const valueMap = new Map([
  [0, 0],
  [0.5, 1],
  [1, 2],
  [1.5, 3],
  [2, 4]
]);
const valueMap2 = new Map([
  [0, 0],
  [1, 0.5],
  [2, 1],
  [3, 1.5],
  [4, 2]
]);

export default {
  components: { GCell, ActionModal, UserModal },
  mixins: [PkMixins],
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      // 操作列表
      actionList: [
        { label: '取消让杆', type: 0 },
        { label: '受让选手', type: 1 }
      ],
      checkGanList: [
        { label: '打帕/鸟/鹰不让', key: 'par_not' },
        { label: '当老虎才让', key: 'only_tiger' }
      ],
      transfereeHoles: [],
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
    showRang() {
      // 打老虎
      if (this.pkConfig.type == 7) {
        return this.pkConfig.sub_type == 0;
      }
	  if (this.pkConfig.type == 5) {	//修改checkGanList
		  this.checkGanList = [
			{ label: '仅总杆PK让', key: 'transferee_only_pk_total' },
			{ label: '打帕/鸟/鹰不让', key: 'par_not' }
		]
		this.transfereeHoles = this.pkConfig.transferee_holes
	  }
      return true;
    },
    ganList() {
      return [
        {
          label: '3杆洞受让杆',
          key: 'transferee3',
          value: valueMap2.get(this.pkConfig.transferee3)
        },
        {
          label: '4杆洞受让杆',
          key: 'transferee4',
          value: valueMap2.get(this.pkConfig.transferee4)
        },
        {
          label: '5杆洞受让杆',
          key: 'transferee5',
          value: valueMap2.get(this.pkConfig.transferee5)
        }
      ];
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
    handleCheck({ key }) {
      let value = this.pkConfig[key];
      this.SET_PK_CONFIG_ITEM({ key, data: value == 0 ? 1 : 0 });
    },
    // 设置让杆分数
    handleSetScore(item, { count }) {
      if (item.value == 2 && count == 0.5) return;
      if (item.value == 0 && count == -0.5) return;
      item.value += count;
      item.value;

      this.SET_PK_CONFIG_ITEM({
        key: item.key,
        data: valueMap.get(item.value)
      });
    },
    // 获取操作列表
    getAction({ type }) {
      if (type == 1) {
        this.handleShow('userModal', { list: this.competitorList, number: 1 });
      } else {
        this.SET_PK_CONFIG_ITEM({ key: 'transferee_ids', data: [] });
        this.SET_PK_CONFIG_ITEM({ key: 'transferee_name', data: '' });
        this.SET_PK_CONFIG_ITEM({ key: 'transferee3', data: 1 });
        this.SET_PK_CONFIG_ITEM({ key: 'transferee4', data: 1 });
        this.SET_PK_CONFIG_ITEM({ key: 'transferee5', data: 1 });
      }
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow(modal, data) {
      this.$refs[modal].open(data || null);
    },
    handleTransfereeHole(idx, val) {
    	this.$set(this.transfereeHoles, idx, val ? 0 : 1)
    	this.SET_PK_CONFIG_ITEM({ key: 'transferee_holes', data: this.transfereeHoles});
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
.ml-20 {
  margin-left: 20rpx;
}
// 按钮
button.button {
  height: 96rpx;
  line-height: 96rpx;
}

.button.button-box {
  background: transparent;
  border: 1rpx solid rgba(0, 60, 61, 0.4);
}

// 杆设置
.gan-list {
  background: $bg-col-f9;
  .check-cell {
    padding-left: 32rpx;
    border-right: 1rpx solid #e9e9e9;
    &:last-child {
      border-right: 0;
    }
  }
  // 计数器
  .number-box {
    &-square {
      padding-bottom: 5rpx;
      width: 58rpx;
      height: 58rpx;
      color: $theme-color;
      background-color: $col-e9;
      font-weight: bold;
      font-size: 40rpx;
    }
    &-value {
      padding-top: 10rpx;
      width: 192rpx;
      height: 58rpx;
      color: #535353;
    }
  }
}
.holes-wrapper {
  background: $bg-col-f9;
  display: grid;
  grid-row-gap: 39.26rpx;
  grid-column-gap: 22.87rpx;
  grid-template-columns: repeat(6, 1fr);
  grid-template-columns: repeat(6, 1fr);
  .holes-cell {
    height: 80rpx;
    width: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: #E9E9E9;
    color: #999999;;
    border-radius: 50%;
    font-size: 32rpx;
    font-weight: 400;
  }
  .holes-cell.active {
  	background: #95D171;
  	color: #FFFFFF;
  }
}
</style>
