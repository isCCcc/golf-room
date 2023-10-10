<template>
  <view class="root">
    <view class="top">
      <ProfileLineChart class="diagram" :style="diagramHidingStyle" :inputData="displayData" />
      <view v-if="showCover" class="cover">
        <view class="c-title">{{ coverTitle }}</view>
      </view>
      <view class="footnote">
        <view class="left">{{ displayData.diagramFootnoteL }}</view>
        <view class="right">{{ displayData.diagramFootnoteR }}</view>
      </view>
    </view>
    <view class="bottom">
      <view class="b-left">
        <view class="b-en-title">{{ displayData.diagramEnTitle }}</view>
        <view class="b-cn-title">{{ displayData.diagramCnTitle }}</view>
      </view>
      <view v-if="changeable" class="b-right" @click="handleChangePublicState">
        <view class="public-title">{{ isPublicTitle }}</view>
        <view v-if="isPublic" class="public-icon"></view>
        <view v-else class="private-icon"></view>
      </view>
    </view>
  </view>
</template>

<script>
import ProfileLineChart from './ProfileLineChart.vue';

export default {
  components: {
    ProfileLineChart
  },
  props: {
    /**
     * 需要属性：
     * {
            enTitle: 'Par 3 av. Score',
            cnTitle: '三杆洞单场平均杆',
            data: [
              4.8, 4.3, 3.8, 3.5, 4.3, 4.4, 3.5, 4.2, 3, 3.8, 777, 444
            ],
            diagramEnTitle: 'Data in Last 10 Games',
            diagramCnTitle: '最近十场杆数走势',
            diagramCoverPrivateTitle: '对方未公开最近十场球局数据',
            diagramCoverEmptyTitle: '暂无球局数据',
            diagramFootnoteL: '最前一场',
            diagramFootnoteR: '最后一场',
          }
     */
    inputData: {
      type: [Object, undefined],
      default: undefined,
    },
    isPublic: {
      type: [Boolean],
      default: false,
    },
    publicType: {
      type: [String],
      default: '',
    },
    changeable: {
      type: [Boolean],
      default: false,
    }
  },
  computed: {
    displayData() {
      return this.inputData || {};
    },
    diagramHidingStyle() {
      return (this.changeable == false && this.isPublic == false) ? 'opacity: 0.3; filter: blur(10rpx);' : ''
    },
    showCover() {
      return this.coverTitle.length > 0;
    },
    coverTitle() {
      if (this.changeable == false && this.isPublic == false) { // 不是我的数据，且不公开，显示未公开
        return this.displayData.diagramCoverPrivateTitle
      } else if (this.displayData.data == undefined || this.displayData.data.length < 1) { // 数据为空，显示暂无数据
        return this.displayData.diagramCoverEmptyTitle;
      }

      return '';
    },
    isPublicTitle() {
      return this.isPublic ? '公开' : '隐藏'
    },
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
    };
  },
  methods: {
    handleChangePublicState() {
      uni.$emit('profile_data_public_state_change', this.publicType)
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  .top {
    flex: 1;

    

    display: flex;
    flex-direction: column;
    justify-items: stretch;

    position: relative;


    .diagram {
      width: 100%;
      height: 100%;
    }

    .cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      
      .c-title {
        font-weight: 400;
        font-size: 20rpx;
        line-height: 28rpx;
        letter-spacing: -0.3rpx;
        color: #999999;
      }
    }

    .footnote {
      position: absolute;
      
      margin-top: 24rpx;
      margin-left: 24rpx;
      margin-right: 24rpx;

      display: flex;
      justify-content: space-between;

      left: 0;
      right: 0;
      bottom: 2rpx;

      font-weight: 400;
      font-size: 20rpx;
      line-height: 28rpx;
      letter-spacing: -0.3rpx;
      color: #C5C5C5;
    }
  }

  .bottom {
    margin: 6rpx 24rpx 24rpx 24rpx;

    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .b-left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4rpx;

      color: #999999;
      .b-en-title {
        @include rubikVar(400);
        font-style: normal;
        font-size: 20rpx;
        line-height: 24rpx;
        letter-spacing: -0.3rpx;
      }
      .b-cn-title {
        font-weight: 500;
        font-size: 20rpx;
        line-height: 28rpx;
        letter-spacing: -0.3rpx;
      }
    }

    .b-right {
      display: flex;
      align-items: center;
      gap: 4rpx;

      .public-title {
        font-weight: 500;
        font-size: 20rpx;
        letter-spacing: -0.3rpx;
        color: #999999;
      }
      .public-icon {
        width: 26rpx;
        height: 18rpx;
        background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_profile_public.svg');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      .private-icon {
        width: 26rpx;
        height: 18rpx;
        background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_profile_lock.svg');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}
</style>
