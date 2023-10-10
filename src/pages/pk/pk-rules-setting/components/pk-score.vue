<!--
 * @Author: simon
 * @Description: 1/2/3分
 * @LastEditors: simon
-->
<template>
  <view>
    <view class="rule-box flex">
      <view class="rule-left flex-1">
        <view class="flex-between h-120 border-b rule-cell  fs-24"
              v-for="(item,index) in rules"
              :key="item.type"
              @click="handleCheck(item)">
          <view class="change-flag"  @click.stop="changeFlag">
            <image v-if="pkConfig.type == 5 && index == 2 && pkConfig.jifen_type == 0"
            	 :src="`${ossUrl}/jifen-transfer.png`"
                   style="width: 40rpx;"
                   mode="widthFix"
            	/>
          </view>
          <view class="flex">
            <g-checkbox :checked="pkConfig[item.key1] == 1 " />
            <text class="ml-22 fw-400"
                  :class="(item.hasOwnProperty('highlight') && item.highlight) ? 'highlight' : (pkConfig[item.key1] == 1 ? 'col-black': 'col-999') ">{{item.label}}</text>
          </view>
          <view v-if="!(plusFlag && item.hasOwnProperty('pk_total_flag'))"
                class="rule-score tc col-white"
                :class="{'isCheck': pkConfig[item.key1] == 1}"
                @click.stop="handleScore(index)">{{pkConfig[item.key2]}}分</view>
        </view>
      </view>
      <view class="rule-right flex-center">
          <view class="rubik big-score">{{totalScore}}</view>
          <view class="rubik plus-flag" v-if="plusFlag">+</view>
          <view class="unit ml-10">分</view>
      </view>
    </view>
    <InputModal ref="inputModal"
                strict
                @onChange="getInputValue" />
    <!-- /输入数值弹窗 -->
  </view>

</template>

<script>
// 组件
import InputModal from '@/pages/pk/pk-rules-setting/components/input-modal';
// mixins
import PkMixins from '../mixins/index';

export default {
  components: { InputModal },
  mixins: [PkMixins],
  props: {
    oldJifenType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 规则列表
      ruleList: [
        {
          label: '较好成绩PK',
          type: 1,
          key1: 'pk_best',
          key2: 'unit_best',
          score: 1
        },
        {
          label: '较差成绩PK',
          type: 2,
          key1: 'pk_worst',
          key2: 'unit_worst',
          score: 1
        },
        {
          label: '双方总杆PK',
          type: 3,
          key1: 'pk_total',
          key2: 'unit_total',
          score: 1
        }
      ],
      pkTotalFlags: [
        {
          label: '双方总杆PK',
          type: 3,
          key1: 'pk_total',	//计分-总杆PK选项：0-未选中，1-选中
          key2: 'unit_total',
          score: 1,
          flag: 0,
          plusFlag: false,
          pk_total_flag: 0,
        },
        {
          label: '杆数相乘PK',
          type: 3,
          key1: 'pk_total',	//计分-总杆PK选项：0-未选中，1-选中
          key2: 'unit_total',
          score: 1,
          flag: 1,
          highlight: true,
          plusFlag: false,
          pk_total_flag: 1,
        },
        {
          label: '双方总杆差为所得分',
          type: 3,
          key1: 'pk_total',	//计分-总杆PK选项：0-未选中，1-选中
          key2: 'unit_total',	
          score: 1,
          flag: 2,
          highlight: true,
          plusFlag: true,
          pk_total_flag: 2,
        }
      ],
      plusFlag: false,
      flagIdx: 0,
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      resetTWR: false,
    };
  },
  computed: {
	  rules() {
		  if (this.pkConfig.type == 5 && this.pkConfig.jifen_type == 0) { //四人拉斯-1/2/3分
        this.pkTotalFlags.forEach((item, index) => {
          if (item.pk_total_flag == this.pkConfig.pk_total_flag) {
            this.flagIdx = index
          }
        })
        let newRule3 = this.pkTotalFlags[this.flagIdx]
        this.plusFlag = newRule3.plusFlag && this.pkConfig['pk_total']
        this.ruleList[2] = newRule3
		  } else if (this.pkConfig.jifen_type == 2 && 
                !this.resetTWR && 
                (!this.pkConfig.competition_pk_id || this.oldJifenType != this.pkConfig.jifen_type)) { //新增的规则或修改计分，头尾肉只选中前两项
        this.SET_PK_CONFIG_ITEM({ key: 'pk_total', data: 0 });
        this.resetTWR = true
      }
		  return this.ruleList
	  },
    // 总分
    totalScore() {
      let sum = 0;
      let checkList = this.ruleList.filter((e) => this.pkConfig[e.key1] == 1);
      checkList.map((e) => {
        sum += this.pkConfig[e.key2];
      });
	  if (this.plusFlag) {
		  sum -= this.pkConfig.unit_total
	  }
      return sum;
    }
  },
  methods: {
    // 获取输入的值
    getInputValue(value) {
      this.$set(this.ruleList[this.sindex], 'score', value);
      this.SET_PK_CONFIG_ITEM({
        key: this.ruleList[this.sindex].key2,
        data: value
      });
    },
    // 点击分数
    handleScore(index) {
      if (this.pkConfig.jifen_type == 2) {  //头尾肉不弹出
        return
      }
      this.sindex = index;
      console.log(this.ruleList[index].score);
      this.handleShow({ type: 'inputModal', data: this.ruleList[index].score });
    },
    // 显示
    handleShow({ type, data }) {
      this.$refs[type].open(data);
    },
     // 勾选规则
    handleCheck(item) {
      if(this.pkConfig.type == 5 && this.pkConfig.jifen_type == 2) { //头尾肉
        this.handleTWRCheck(item);
        return;
      }
      
      let value = this.pkConfig[item.key1];
      this.SET_PK_CONFIG_ITEM({ key: item.key1, data: value == 1 ? 0 : 1 });
      
      if (item.hasOwnProperty('pk_total_flag')) {
        this.SET_PK_CONFIG_ITEM({ key: 'pk_total_flag', data: this.pkConfig[item.key1] ? item.pk_total_flag : 0});
        this.plusFlag = item?.plusFlag && this.pkConfig[item.key1]
      }
    },
    changeFlag() {
    	let nextFlagIdx = this.flagIdx + 1
    	if (!this.pkTotalFlags.hasOwnProperty(nextFlagIdx)) {
    		nextFlagIdx = 0
    	}
    	this.flagIdx = nextFlagIdx
    	this.plusFlag = this.pkTotalFlags[nextFlagIdx].plusFlag && this.pkConfig['pk_total']
    	this.pkTotalFlags[nextFlagIdx].pk_total = this.pkConfig['pk_total']
      if (this.pkTotalFlags[nextFlagIdx].hasOwnProperty('pk_total_flag')) {
        this.SET_PK_CONFIG_ITEM({ key: 'pk_total_flag', data: this.pkTotalFlags[nextFlagIdx].pk_total_flag });
      }
    },
    // 头尾肉勾选规则
    handleTWRCheck(item) {
    	if (['pk_worst', 'pk_total'].indexOf(item.key1) != -1) {
    		let nextCheckKey = item.key1 == 'pk_worst' ? 'pk_total' : 'pk_worst'
    		let val = this.pkConfig[item.key1] == 1 ? 0 : 1
    		let nextCheckKeyVal = val == 1 ? 0 : 1
    		this.SET_PK_CONFIG_ITEM({ key: item.key1, data: val});
    		this.SET_PK_CONFIG_ITEM({ key: nextCheckKey, data: nextCheckKeyVal});
    	}
    }
  }
};
</script>

<style lang="scss" scoped>
// S 规则列表
.rule-box {
  // 左边
  .rule-left {
    border-right: 1px solid $col-e9;
    .rule-cell {
      padding: 0 18rpx 0 100rpx;
      .rule-score {
        min-width: 63rpx;
        height: 34rpx;
        line-height: 34rpx;
        background: #dddddd;
        border-radius: 2rpx;
      }
      .isCheck {
        background: $col-1e3;
      }
	  .change-flag {
          position: absolute;
		  width: 50rpx;
		  height: fit-content;
		  left: 32rpx;
	  }
	  .highlight {
	  	color: #49B30A!important;
	  }
    }
  }
  .rule-right {
    min-width: 223rpx;
    .big-score {
      font-size: 128rpx;
      color: $col-1e3;
    }
    .unit {
        margin-top: 48rpx;
      font-size: 40rpx;
      color: #c4c4c4;
    }
	.plus-flag {
	  font-size: 64rpx;
	  color: $col-1e3;
	}
  }
}
// E 规则列表
</style>
