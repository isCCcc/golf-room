 <template>
  <view class="root" :style="{ '--root-height' : height + 'rpx', '--bg-filter': bgFilter, '--font-color': fontColor}" >
     <!-- 状态部分 -->
    <view class="status-container" :style="{'--status-bg' : statusBgColor || defaultStatusBgColor}">
       <view class="indicator" :style="{'--indicator-color' : indicatorColor}"></view>
       <view v-if="status === 1" :class="['live-mark']"></view>
       <view v-else :class="['live-font']">{{ statusText[status] }}</view>
    </view>
     <!-- 信息部分 -->
    <view class="info-container" :style="{ '--info-bg': infoBg }">
       <view> {{ (competitorCount ? `${competitorCount}位球手 · ` : '')  + watchCount }}人围观</view>
    </view>
 <!--    <div v-if="isHotRecommend" class="flex">
       <view class="hot" /> <view class="hot-text">热门</view>
     </div> -->
  </view>
 </template>


<script>
export default {
  components: {
  },
  props: {
    // in RPX
    height: {
      type: Number,
      default: 32,
    },
    bgFilter: {
      type: String,
      default: "blur(14px)"
    },
    fontColor: {
      type: String,
      default: "#FFFFFF",
    },
    indicatorColor: {
      type: String,
      default: "#FF0000",
    },
    status: {
      type: Number,
      default: 0,
    },
    statusBgColor: {
      type: [String | undefined],
      default: undefined,
    },

    competitorCount: {
      type: [Number | undefined],
      default: undefined,
    },
    watchCount: {
      type: Number,
      default: 0,
    },

    infoBg: {
      type: String,
      default: 'rgba(255, 255, 255, 0.2)',
    },
    
    isHotRecommend: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultStatusBgColor: "rgba(23, 31, 28, 0.7)",
      statusText: ['未开始', 'LIVE', '已结束'], // 0-未开始，1-进行中，2-已结束
    }
  },
  computed: {
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>
.root {
  height: var(--root-height); // testing

  display: flex;
  justify-content: flex-start;
  align-items: stretch;

  font-size: 20rpx;
  font-weight: 400;

  color: var(--font-color);

  .status-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 6rpx;
    padding: 8rpx;
    border-radius: 1rpx;

    background-color: var(--status-bg);
    backdrop-filter: blur(14rpx);
    z-index: 1;
  }
  .indicator {
    width: 8rpx;
    height: 8rpx;
    border-radius: 100% 100%;
    background-color: var(--indicator-color);
  }

  .live-status {
    margin-right: 13rpx;
    // flex: 0 0 96rpx;
    // width: 96rpx;
    // height: 46rpx;
    border: 1rpx solid rgba($color: $white, $alpha: 0.08);
    background: rgba($color: $white, $alpha: 0.1);
    font-style: italic;
    @include rubikVar();
  }

  // .live-font {
  //   font-style: italic;
  //   font-weight: 900;
  // }
  .live-mark {
    width: 51rpx;
    height: 14rpx;
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/LIVE.svg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  $watch-padding-x: 10rpx;
  $watch-radius: 1rpx;
  .info-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: calc(0rpx - $watch-radius);
    padding-right: $watch-padding-x;
    padding-left: calc($watch-padding-x + $watch-radius);
    border-radius: $watch-radius;

    background-color: var(--info-bg);
    backdrop-filter: var(--bg-filter);
  }
  .hot {
    width: 16rpx;
    height: 22rpx;
    margin: auto 4rpx auto 10rpx;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_list_hot_01.svg');
  }
  .hot-text {
    font-size: 20rpx;
    margin: auto 0;
  }
}
</style>
