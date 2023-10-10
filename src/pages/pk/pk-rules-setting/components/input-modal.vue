<!--
 * @Author: simon
 * @Description: 数值输入
 * @LastEditors: simon
-->
<template>
  <view>
    <uni-popup ref="popup"
               background-color="#fff">
      <view class="input-wrapper">
        <view class="input-box border-b">
          <view v-if="title" class="mb-20">{{title}}</view>
          <input :placeholder="placeholder"
                 :adjust-position="false"
                 type="number"
                 class="input"
                 placeholder-style="color: #999"
                 v-model="value"
                 :maxlength="type == '8421' ? 5 : -1" />
        </view>
        <view class="btn-box tc fs-32"
              @click="submit">确认</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  props: {
    // 是否开启严格模式
    strict: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '输入数值'
    },
    type: {
      type: String
    },
    title: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      value: '' // 内容
    };
  },

  methods: {
    submit() {
      let value = parseInt(this.value);
      if (!value && this.strict) {
        return uni.showToast({
          icon: 'none',
          title: '输入错误'
        });
      }
      // 8421的自定义输入限制
      let num = value.toString();
      if (this.type == '8421' && num.length < 4) {
        return uni.showToast({
          icon: 'none',
          title: '4-5位数字'
        });
      }

      this.$emit('onChange', value || 0);
      this.close();
    },
    // 打开
    open(data) {
      this.value = data || '';
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
.input-wrapper {
  width: 85vw;
  background: $white;
  border-radius: 4rpx;
  .input-box {
    padding: 48rpx;
    .input {
      padding: 0 24rpx;
      height: 86rpx;
      height: 86rpx;
      background: #f3f3f3;
      border-radius: 8rpx;
    }
  }
  .btn-box {
    height: 120rpx;
    line-height: 120rpx;
    color: $col-1e3;
  }
}
</style>
