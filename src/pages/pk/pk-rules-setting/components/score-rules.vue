<!--
 * @Author: simon
 * @Description: 扣分规则
 * @LastEditors: simon
-->
<template>
  <!-- S 扣分规则 -->
  <view>
    <view class="plr-32 h-120 flex border-b"
          :class="{ 'pl-102': item.key == 'koufen_par3' }"
          v-for="(item, index) in ruleList"
          :key="index"
          @click="handleCheck(item, index)">
      <g-checkbox :checked="pkConfig[item.key]"
                  :size="item.type == 1 ? '36rpx' : '28rpx'" />
      <view class="fs-24 ml-22"
            :class="[pkConfig[item.key] ? 'col-black' : 'col-999']">
			<template v-if="pkConfig.type != 5">
				{{ item.label }}
			</template>
			<template v-else>
				{{ item.koufenMaxFlag ? '最多扣' : item.label }}
				
				<template v-if="item.koufenMaxFlag">	
					<view class="koufen-max tc col-white ml-6 mr-6"
					      :class="{'isCheck': pkConfig[item.key] == 1}"
					      @click.stop="handleScore()">
						  {{pkConfig.koufen_max}}
					</view>
					{{item.label}}
				</template>
			</template>
	  </view>
    </view>
	
	<InputModal ref="inputModal"
	            strict
	            @onChange="getInputValue" />
	<!-- /输入数值弹窗 -->
  </view>
  <!-- E 扣分规则 -->
</template>

<script>
// 组件
import InputModal from '@/pages/pk/pk-rules-setting/components/input-modal';
// mixins
import PkMixins from '../mixins/index';

export default {
  components: { InputModal },
  mixins: [PkMixins],
  data() {
    return {
      // 扣分规则
      ruleList: [
        {
          label: '扣分（+4扣1分 +5扣2分...以此类推)',
          check: false,
          type: 1,
          key: 'koufen'
        },
        {
          label: '3杆洞从+3开始扣分',
          check: false,
          type: 2,
          key: 'koufen_par3'
        },
        { label: '只扣1分（+4及以上)', type: 1, check: false, key: 'koufen1' },
        {
          label: '只扣1分（双帕及以上)',
          type: 1,
          check: false,
          key: 'koufen2'
        }
      ],
      //四人拉斯时的规则
      rule5List: [
        {
          label: '一直扣（+4扣1分 +5扣2分...以此类推)',
          check: false,
          type: 1,
          key: 'koufen',
          koufenMaxFlag: false,
        },
        {
          label: '3杆洞从+3开始扣分',
          check: false,
          type: 2,
          key: 'koufen_par3'
        },
        { 
          label: '分（+4开始扣)',
          type: 1, 
          check: false, 
          key: 'koufen1',
          koufenMaxFlag: true,
        },
        {
          label: '分（双帕开始扣)',
          type: 1,
          check: false,
          key: 'koufen2',
          koufenMaxFlag: true,
        }
      ]

    };
  },

  mounted() {
	if (this.pkConfig.type == 5) {
		this.ruleList = this.rule5List
	}
    this.ruleList = this.ruleList.map((e) => {
      if (this.pkConfig[e.key]) {
        e.check = true;
      }
      return e;
    });
  },
  methods: {
    handleCheck(item, index) {
      this.ruleList = this.ruleList.map((e) => {
        if (e.type == item.type && e.key != item.key) {
          e.check = false;
          this.SET_PK_CONFIG_ITEM({ key: e.key, data: 0 });
        }
        if (e.key == item.key) {
          e.check = !e.check;
          this.SET_PK_CONFIG_ITEM({ key: e.key, data: e.check ? 1 : 0 });
        }
        if (!this.pkConfig.koufen) {
          this.SET_PK_CONFIG_ITEM({ key: 'koufen_par3', data: 0 });
          this.rule5List[1].check = false
        }
        return e;
      });
    },    
    // 点击分数
    handleScore() {
		this.$refs.inputModal.open(this.pkConfig.koufen_max);
    },
    // 获取输入的值
    getInputValue(value) {
      this.SET_PK_CONFIG_ITEM({
        key: 'koufen_max',
        data: value
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.ml-22 {
  margin-left: 22rpx;
}
.pl-102 {
  padding-left: 102rpx;
}
.koufen-max {
	display: inline-block;
	min-width: 63rpx;
	height: 34rpx;
	line-height: 34rpx;
	background: #dddddd;
	border-radius: 2rpx;
}
.isCheck {
	background: $col-1e3;
}
</style>
