<!--
 * @Author: simon
 * @Description: 洞分
 * @LastEditors: simon
-->
<template>
  <view class="flex-center"
        :class="{'border-wrpper': !record.unusual,'blue-border': record.score < 0, 'white-border': record.score > 0, 'landscape': landscape}" :style="[wrapperStyle]">
    <view v-if="(record.is_light == 1 || record.is_light == 3) && !landscape"
          :class="['light'+record.is_light, showPush&&record.push!=null ? 'reset-light-position' : '']"/>
    <view class="flex-center w-auto h-auto"
          :class="{'blue-circle': record.score < -1, 'white-squre': record.score > 1}">
      <view :class="[record.score > 9 || record.score < -9 ? 'fs-26' : 'fs-30']" :style="[scoreStyle]">
        {{record.score > 0 ? '+' : ''}}{{record.score === null ?  record.unusual ? '重置' : '' : record.score}}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 洞分
    record: {
      type: Object
    },
    // 外层样式
    wrapperStyle: {
      type: Object,
      default: {}
    },
    // 外层样式
    scoreStyle: {
      type: Object,
      default: {}
    },
    // 横屏模式
    landscape: {
      type: Boolean,
      default: false
    },
    showPush: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.border-wrpper {
  padding: 3rpx;
  width: 52rpx;
  height: 52rpx;
  box-sizing: border-box;
  border: 2rpx solid transparent;
  &.landscape {
    padding: 1px;
    width: 26px;
    height: 26px;
    border: 1px solid transparent;
  }
}
.border-wrpper.blue-border {
  border-radius: 100%;
  border-color: #41a2ff;
  .blue-circle {
    background-color: #41a2ff;
    border-radius: 100%;
  }
}
.border-wrpper.white-border {
  border-color: $white;
  .white-squre {
    border: 2rpx solid $white;
    box-sizing: border-box;
  }
  &.landscape {
    .white-squre {
      border: 1px solid $white;
    }
  }
}
.light1 {
  position: absolute;
  width: 44rpx;
  height: 20rpx;
  background-image: url('http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/icons/islight1.png');
  background-repeat: no-repeat;
  background-size: contain;
  top: 50%;
  transform: translateY(-50%);
  left: 8rpx;
}
.light3 {
  position: absolute;
  width: 44rpx;
  height: 20rpx;
  background-image: url('http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/icons/light_draw.png');
  background-repeat: no-repeat;
  background-size: contain;
  top: 50%;
  transform: translateY(-50%);
  left: 8rpx;
}
.reset-light-position {
  top: 38%;
  transform: translateY(-38%);
}
.landscape {
  .fs-26 {
    font-size: 13px;
  }
  .fs-30 {
    font-size: 15px;
  }
  .light1, .light3 {
    width: 22px;
    height: 10px;
    left: 4px;
  }
}
</style>
