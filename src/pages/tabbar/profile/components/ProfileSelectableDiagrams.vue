<template>
  <view class="root">
    <view class="item-group" :style="{'--item-height': itemHeight + 'rpx'}">
      <view class="item-indicator" :style="{ transform: `translateY(${indicatorTranslateY}px)`, 'transition-duration': (indicatorTransDuration || 'inherit') }"></view>
      <view class="items">
        <view v-for="(item, index) in items"
              :key="index"
              class="item"
              @click="handleItemClick(item, index)"
              :style="{'color': index == curIndex ? '#000' : '#C4C4C4'}">
          <view class="en-title">{{ item.enTitle }}</view>
          <view class="cn-title">{{ item.cnTitle }}</view>
        </view>
      </view>
    </view>
    <view class="line-v"></view>
    <ProfileDataDiagramView class="diagram" 
                            :input-data="currentItem" 
                            :is-public="currentItemPublic"
                            :public-type="displayData.publicType || ''"
                            :changeable="changeable"/>
  </view>
</template>

<script>
import ProfileDataDiagramView from './ProfileDataDiagramView.vue';

export default {
  components: {
    ProfileDataDiagramView,
  },
  props: {
    /**
     * 需要属性：
     */
    inputData: {
      type: [Object, undefined],
      default: undefined,
    },

    /**
     * 
     */
    defaultType: {
      type: [String, undefined],
      default: undefined,
    },

    /**
     * 数据是否改变
     */
    changeable: {
      type: [Boolean],
      default: false,
    },
  },
  computed: {
    displayData() {
      return this.inputData;
    },
    items() {
      // TODO: get data
      return this.displayData.items || []
    },
    currentItem() {
      return this.items.length > this.curIndex ? this.items[this.curIndex] : {}
    },
    currentItemPublic() {
      // TODO: get public state
      const isPublic = this.displayData?.isPublic;
      return isPublic != undefined ? isPublic : false;
    }
  },
  data() {
    return {
      itemHeight: 100, 
      indicatorTranslateY: 0,
      indicatorTransDurationDefault: '150ms',
      indicatorTransDuration: '150ms',

      curIndex: 0,
    };
  },
  beforeMount() {
    if (this.defaultType != undefined) {
      const index = this.items.findIndex((item) => {
        return item.type && item.type == this.defaultType;
      })
      if (index >= 0) {
        this.selectIndex(index, false)
      }
    }
  },
  methods: {
    handleItemClick(item, index) {
      this.selectIndex(index);
    },

    selectIndex(index, animate = true) {
      this.curIndex = index;
      this.indicatorTranslateY = uni.upx2px(this.itemHeight * index);
      this.indicatorTransDuration = animate ? this.indicatorTransDurationDefault : 0;
    }
  },
  components: { ProfileDataDiagramView }
};
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: row;
  align-items: stretch;

  background-color: #F8F8F8;

  .line-v {
    width: 1rpx;
    // height: 100%;
    background-color: #ECECEC;
  }
  

  .item-group {
    position: relative;
    width: 33.3%;

    min-height: calc(var(--item-height) * 3);

    .item-indicator {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-color: #FFF;
      height: var(--item-height);

      &::before {
        content: '';
        position: absolute;
        left: 0rpx;
        top: 0rpx;
        width: 8rpx;
        height: 100%;
        background-color: #9FBE3D;
      }
      &::after {
        content: '';
        position: absolute;
        top: calc(50% - (15rpx / 2)) ;
        right: 18rpx;
        width: 9rpx;
        height: 15rpx;
        background: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_profile_data_triangle.svg');
        background-size: 100%;
      }
    }

    .item {
      position: relative;
      padding: 8rpx 32rpx 8rpx 32rpx;
      box-sizing: border-box;
      width: 100%;
      height: var(--item-height);

      color: #C4C4C4; // 默认颜色

      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .en-title {
        @include rubikVar(400);
        font-style: normal;
        font-size: 20rpx;
        line-height: 24rpx;
        letter-spacing: -0.3rpx;
      }
      .cn-title {
        font-weight: 500;
        font-size: 20rpx;
        line-height: 28rpx;
        letter-spacing: -0.3rpx;
      }
    }
  }

  .diagram {
    position: relative;
    flex: 1;

    background-color: #FFF;

  }
}
</style>
