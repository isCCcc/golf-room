<!--
 * @Author: simon
 * @Description: 抽水
 * @LastEditors: simon
-->
<template>
  <uni-popup ref="popup"
             background-color="#fff">
    <view class="modal-wrapper">
      <!-- S 上面 -->
      <view class="top-box">
        <view class="h-120 flex plr-32 border-b border-bn"
              v-for="item in ruleList1"
              :key="item.value"
              @click="handleRules({key: 'rule1',data:
              item})">
          <!-- handleRules({key: 'cs_style',data:
              item}) -->
          <g-checkbox :size="'36rpx'"
                      :checked="item.value == chouInfo.rule1" />
          <text class="fs-24 ml-22">{{item.label}}</text>
          <!-- S 洞数 -->
          <picker-view @change="pickerChange($event,'holes')"
                       class="picker-view"
                       v-show="chouInfo.rule1 == 1 && item.value == 1"
                       :value="[chouInfo.holes]">
            <picker-view-column class="picker-view-column">
              <template v-for="item in 18">
                <view class="picker-view-item flex-center"
                      :key="item">
                  {{item}}洞
                </view>
              </template>
            </picker-view-column>
          </picker-view>
          <!-- E 洞数 -->
          <!-- S 分数 -->
          <picker-view @change="pickerChange($event,'score')"
                       class="picker-view"
                       v-show="chouInfo.rule1 == 2 && item.value == 2"
                       :value="[chouInfo.score]">
            <picker-view-column class="picker-view-column">
              <template v-for="item in 100">
                <view class="picker-view-item flex-center"
                      :key="item">
                  {{item * 2}}分
                </view>
              </template>
            </picker-view-column>
          </picker-view>
          <!-- E 分数 -->
          <text class="col-999 fs-20"
                v-show="chouInfo.rule1 != 0 && item.value == chouInfo.rule1">上下滑动</text>
        </view>

      </view>
      <!-- E 上面 -->

      <!-- S 下面 -->
      <view class="bottom-box"
            v-show="chouInfo.rule1 != 0">
        <view class="h-120 flex plr-32 border-b border-bn"
              v-for="item in ruleList2"
              :key="item.value"
              @click="handleRules({key: 'rule2',data:
              item})">
          <!-- handleRules({key: 'cs_unit',data:
              item}) -->
          <g-checkbox :size="'36rpx'"
                      :checked="item.value == chouInfo.rule2" />
          <text class="fs-24 ml-22">{{item.label}}</text>
        </view>
      </view>
      <!-- E 下面 -->

      <!-- S 按钮 -->
      <view class="btn-box flex">
        <view class="flex-1 flex-center h-full col-999 fs-32 btn-cancel" @click="close">取消</view>
        <view class="flex-1 flex-center h-cull col-1e3 fs-32"
              @click="confirm">确定</view>
      </view>
      <!-- E 按钮 -->
    </view>
  </uni-popup>
</template>

<script>
// 组件
import uniPopup from '@/components/uni-popup/uni-popup';
// mixins
import PkMixins from '../mixins/index';

export default {
  mixins: [PkMixins],
  components: {
    uniPopup
  },
  data() {
    return {
      // 抽水上半部分
      ruleList1: [
        { value: 0, label: '不抽水' },
        { value: 1, label: '抽指定洞数', show: false },
        { value: 2, label: '抽够分为止', show: false }
      ],
      // 抽水下半部分
      ruleList2: [
        { value: 0, label: '“赢”家全抽' },
        { value: 1, label: '每位“赢”家抽1分' },
        { value: 2, label: '每位“输”家抽1分' }
      ],
      chouInfo: {
        rule1: 0, // 规则1
        rule2: 1, // 规则2
        holes: 5, // 洞数
        score: 10,// 分数
      }
    };
  },
  computed: {
    // 抽水类型
    csStyle() {
      return this.pkConfig.cs_style;
    },
    // 抽水下半项类型
    csUnit() {
      return this.pkConfig.cs_unit;
    }
  },
  mounted() {
  },

  methods: {
    // 确认
    confirm() {
      let { rule1, rule2, holes, score } = this.chouInfo;
      this.SET_PK_CONFIG_ITEM({ key: 'cs_style', data: rule1 });
      rule1 != 0 && this.SET_PK_CONFIG_ITEM({ key: 'cs_unit', data: rule2 });
      rule1 == 1 && this.SET_PK_CONFIG_ITEM({ key: 'cs_holes', data: holes });
      rule1 == 2 &&
        this.SET_PK_CONFIG_ITEM({ key: 'cs_score', data: score * 2 });
      this.close();
    },
    // 选择规则
    handleRules({ key, data }) {
      // this.SET_PK_CONFIG_ITEM({ key, data: data.value });
      this.chouInfo[key] = data.value;
    },
    pickerChange({ detail }, key) {
      let value = detail.value[0];
      // this.SET_PK_CONFIG_ITEM({ key, data: value });
      this.chouInfo[key] = value;
    },
    // 打开
    open(data) {
      this.chouInfo = { ...data };
      this.$refs.popup.open();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.ml-22 {
  margin-left: 22rpx;
}
.col-1e3 {
  color: $col-1e3;
}
.modal-wrapper {
  width: 85vw;
  .bottom-box {
    border-top: 10rpx solid $br-col-ed;
  }

  .picker-view {
    margin: 0 16rpx;
    width: 96rpx;
    height: 80rpx;
    background: linear-gradient(
        180deg,
        rgba(153, 153, 153, 0.2) 4.69%,
        rgba(255, 255, 255, 0.2) 32.29%,
        rgba(255, 255, 255, 0.2) 70.31%,
        rgba(153, 153, 153, 0.2) 94.79%
      ),
      #ffffff;
    &-column {
      height: 80rpx;
      align-items: center;
      justify-content: center;
      text-align: center;
      .picker-view-item {
      }
    }
  }

  .btn-box {
    padding: 28rpx 0;
    height: 120rpx;
    border-top: 1px solid #e7e7e7;
    box-sizing: border-box;
    .btn-cancel {
      border-right: 1px solid #e7e7e7;
    }
  }
}
</style>
