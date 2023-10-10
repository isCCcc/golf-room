<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="unlogin-box">
    <view class="unlogin-box-bg" />
    <view class="col-black text-32px text" v-if="unLogin">未登录</view>
    <view class="col-999 text-32px text">
      {{ unLogin ? "请先登录账号" : "暂无高球房间" }}
    </view>
    <button class="button btn flex-center" @click="handleClick">
      {{ unLogin ? "登录" : "创建房间" }}
    </button>
  </view>
</template>
<script>
export default {
  props: {
    unLogin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleLogin() {
      this.$emit("login");
    },
    handleClick() {
      if (this.unLogin) {
        this.handleLogin();
        return;
      }
      //创建房间
      uni.navigateTo({
        url: "/pages/chat-room/add-room/index",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.unlogin-box {
  padding-top: calc(171rpx - 20rpx);
  padding-bottom: 50rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-bg {
    width: 434rpx;
    height: 189rpx;
    background-image: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/img_noroom.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.text-32px {
  font-size: 32rpx;
  line-height: 45rpx;
}
.text {
  margin-top: 28rpx;
}
.btn {
  margin-top: 58rpx;
  width: 420rpx;
  height: 96rpx;
  font-size: 28rpx;
}
</style>
