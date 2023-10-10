<template>
  <!-- S 总汇：状态+分组+观看人 -->
  <view class="summary">
    <!-- 球赛状态 -->
    <view class="flex-center summary-label">
      <view class="circle circle-red mr-10" :class="[competitionStatus === 'LIVE' ? 'circle-red' : 'circle-gray',]">
      </view>
      <view :class="[competitionStatus === 'LIVE' ? '' : 'normal']">{{ competitionStatus }}</view>
    </view>
    <!-- 分组 -->
    <view class="summary-group">
      <view class="group-list-bg"></view>
      <scroll-view class="group-list-wrapper" :scroll-with-animation="true" scroll-x :scroll-left="groupListScrollLeft"
        @scroll="scrollviewScroll">
        <view class="group-list" :animation="groupListAniData">
          <!-- 滑动指示器 -->
          <view v-if="curGroup != undefined && summaryReady" class="slider-line"
            :style="{ transform: `translate(${translate}px)`, 'transition-duration': (translateDuration || 'inherit') }">
          </view>
          <!-- 分组列表 -->
          <view v-for="(item, index) in competitionData.group_list" :key="index" class="group-cell"
            :id="'group-cell-' + index" @click="handleClickGroup(index, item)">
            <view class="group-cell-label" :class="{ 'active-group': curGroup == item }">
              {{ item }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 总 -->
    <view class="total" @click="handleRankModal">
      <view class="total-label" :class="{ 'sub-color': wholeFlag }">总</view>
    </view>
    <!-- 观看 -->
    <view class="flex-end flex1">
      <view class="avatar-wrapper flex" @click="handleShowWatcherModal">
        <!-- <view v-for="index in renderMemberCount" :key="index" class="g-avatar avatar-cell ml-8 pr"
          :style="{ backgroundImage: watcherList[index].avatar_url ? `url(${watcherList[index].avatar_url})` : '' }">
        </view> -->
        <GAvatar v-for="index in renderMemberCount" :key="index" 
                  class="ml-8 pr" 
                  :avatarData="watcherList[index]" 
                  size-in-rpx='50' 
                  radius="100%" 
                  :handle-click="false" ></GAvatar>
      </view>
      <view class="num-wrapper fs-20 ml-8 flex-center" v-if="watcherList.length > 3" @click="handleShowWatcherModal">
        {{ watcherTotal }}</view>
      <view class="more-btn ml-8 pr" @click="moreSelect = !moreSelect">
        <MoreModal v-if="moreSelect" :status="competitionData.status" :role="role" 
          :selfCompetitor="selfCompetitor"
          :endTime="competitionData.end_time" :isValid="competitionData.is_valid" @onClick="handleMore"></MoreModal>
      </view>
    </view>
  </view>
  <!-- E 总汇：状态+分组+观看人 -->
</template>

<script>
// Store

// Components
import MoreModal from '@/pages/chat-room/index/components/more-model';
import GAvatar from '@/components/g-avatar/g-avatar.vue'

export default {
  props: {
    // 观众列表数据，请求回来的数据，undefined 表示没有经过请求，请求失败设置为空数组
    watcherListData: {
      type: [Array, undefined],
      default: undefined,
    },
    watcherTotal: {
      type: [Number, undefined],
      default: undefined,
    },
    userInfo: {
      type: Object,
      default: {},
    },
    competitionData: {
      type: Object,
      default: {},
    },
    competitionStatus: {
      type: String,
      default: '---',
    },
    selfCompetitor: {
      type: [Object, undefined],
      default: undefined,
    },
    // 当前的分组
    curGroup: {
      type: String,
      default: "A"
    },
    // 是否是比赛者
    isSelfCompetitor: {
      type: Boolean,
      default: false
    },
    // 用户角色
    role: {
      type: Number,
      default: 2 // 2 表示观赛者
    },
    // 总分展示状态
    wholeFlag: {
      type: Boolean,
      default: false // 2 表示观赛者
    },
  },
  emits: [
    'more',
    'groupSelected',
    'wholeRank',
    'watchers',
  ],
  components: {
    MoreModal,
    GAvatar,
  },

  data() {
    return {
      moreSelect: false, // 更多操作

      translate: 0,
      translateDuration: undefined,

      groupListAniShow: false,
      groupListAniData: {}, //

      groupListScrollLeft: 0,
      groupListScrollLeftOld: 0,
    };
  },

  computed: {
    // 观众列表
    watcherList() {
      return this.watcherListData || [];
    },

    // 渲染成员人数
    renderMemberCount() {
      return this.watcherList.length > 3 ? 3 : this.watcherList.length;
    },

    // 当前分组 index
    curGroupIndex() {
      return this.competitionData?.group_list?.indexOf(this.curGroup)
    },

    // 总汇的数据已经好了，可以进行最后布局（观看者列表和分组列表有 UI 位置上的争夺）
    summaryReady() {
      return this.watcherListData != undefined && this.competitionData?.group_list != undefined
    }
  },
  watch: {
    curGroupIndex: {
      handler: function (nVal) {
        this.moveIndicatorFor(nVal, this.summaryReady);
        this.groupListAniShow && this.centerIndicatorFor(nVal);
      },
      immediate: true
    },
    summaryReady(nVal) {
      if (nVal) {
        this.animateGroupListIfNeeded();
      }
    },
  },

  methods: {

    // 查看观众列表
    handleShowWatcherModal() {
      this.$emit('watchers')
    },
    
    // 总分板弹窗
    handleRankModal() {
      this.$emit("wholeRank")
    },
    // 更多操作
    handleMore(e) {
      this.$emit("more", e)
      this.moreSelect = false;
    },
    // 选择分组
    handleClickGroup(index, group) {
      this.$emit('groupSelected', index, group)
    },

    scrollviewScroll(scrollview) {
      console.log("scrollviewScroll", this.groupListScrollLeftOld);
      this.groupListScrollLeftOld = scrollview.detail.scrollLeft
    },

    /**
     * 将指示器移动到 index 对应的 group 那里
     * @param {*} index 
     */
    moveIndicatorFor(index, animate) {
      let offset = uni.upx2px((50 - 30) / 2);

      // index == undefined: 数据有可能没有加载，先放到预期的第一的位置。
      if (index == undefined) {
        this.translate = offset
          + uni.upx2px(10) // padding in group-list
        return;
      }

      /**
       * 通过查询 DOM 来获取位置。单纯从固定的参数进行累加 （50rpx * index），在不是 375px （750rpx） 的机型上， 上出现移位。
       */
      const scope = this;
      uni
        .createSelectorQuery()
        .in(scope)
        .select(".group-list")
        .boundingClientRect((listRect) => {
          if (listRect == undefined) return;
          uni
            .createSelectorQuery()
            .in(scope)
            .select("#group-cell-" + index)
            .boundingClientRect(cell => {
              if (cell?.width == undefined) return;
              const outOffset = cell.left - listRect.left

              scope.translate = offset + outOffset;
              if (animate) scope.translateDuration = '0.3s'
            })
            .exec()
        })
        .exec()
    },

    /**
     * 将指示器和指示中的分组，展示在分组列表中间
     * @param {*} index 
     * @param {*} callback 
     */
    centerIndicatorFor(index, callback) {
      const scope = this;
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .in(scope)
          .select(".group-list-wrapper")
          .boundingClientRect(scrollRect => {
            console.log("group-list-wrapper", scrollRect);
            if (scrollRect == undefined) {
              callback && callback(false); return;
            };

            uni
              .createSelectorQuery()
              .in(scope)
              .select("#group-cell-" + index)
              .boundingClientRect(cell => {
                if (cell == undefined) {
                  callback && callback(false); return;
                }

                const cellCenter = cell.left + (cell.width / 2)

                const scrollCenter = scrollRect.left + (scrollRect.width / 2)
                const offset = cellCenter - scrollCenter

                /**
                 * scroll-view 超出范围时会自动停止滚动，这里省略边界计算
                 */

                const newScrollLeft = scope.groupListScrollLeftOld + offset

                scope.groupListScrollLeft = scope.groupListScrollLeftOld;
                scope.groupListScrollLeft = newScrollLeft

                callback && callback(true)

              })
              .exec()
          })
          .exec()
      })
    },

    /**
     * 当分组不能全部展示，用动画展示分组的情况（滑动一下，展示所有分组），最后居中展示当前分组
     */
    animateGroupListIfNeeded() {
      if (this.groupListAniShow) return;
      const scope = this;

      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .in(scope)
          .select(".group-list")
          .boundingClientRect((listRect) => {
            if (listRect == undefined) return;

            const elId = "#group-cell-" + (scope.competitionData?.group_list?.length - 1 || 0)
            uni
              .createSelectorQuery()
              .in(scope)
              .select(elId)
              .boundingClientRect(lastCellRect => {
                if (lastCellRect?.width == undefined) return;
                const outOffset = lastCellRect.right - listRect.right
                if (outOffset > 4) {

                  // 居中最后一个组
                  scope.centerIndicatorFor(scope.competitionData.group_list.length - 1, (success) => {
                    setTimeout(() => {
                      // 居中当前组
                      scope.centerIndicatorFor(scope.curGroupIndex, (success) => {
                        setTimeout(() => {
                          this.groupListAniShow = true;
                        }, 500);
                      })
                    }, 500); // 预估 scroll-view 动画时间接近 300ms 
                  })

                  // // 初始化一个动画
                  // const totalDuration = 500;
                  // const delay = 500;
                  // var animation = uni.createAnimation({
                  //   timingFunction: 'ease-out',  //linear 全程匀速运动
                  //   delay: delay  //延迟执行动画
                  // })
                  // animation.translateX(-(outOffset)).step({ duration: totalDuration / 2 })
                  // animation.translateX(0).step({ duration: totalDuration / 2 })
                  // scope.groupListAniData = animation.export();

                  // setTimeout(() => {
                  //   this.$nextTick(() => {
                  //     scope.groupListAniShow = true;
                  //     scope.centerIndicatorFor(scope.curGroupIndex);
                  //   })
                  // }, totalDuration + delay * 2 + 250);
                }
              })
              .exec()
          })
          .exec()
      })
    }
  }
};

</script>

<style lang="scss" scoped>

// S 总汇
.summary {
  $content-height: 48rpx;
  $indicator-offset-y: 22rpx;

  font-size: 20rpx;

  margin-top: 10rpx;
  padding: 0 16rpx calc(30rpx - $indicator-offset-y) 16rpx;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10rpx;

  // 状态
  &-label {
    flex: 0 0 96rpx;
    width: 96rpx;
    height: $content-height;
    box-sizing: border-box;
    border: 1rpx solid rgba($color: $white, $alpha: 0.08);
    background: rgba($color: $white, $alpha: 0.1);
    font-style: italic;
    @include rubikVar();

    .normal {
      font-style: normal;
    }
  }

  &-group {
    height: calc($content-height + $indicator-offset-y);

    overflow: hidden;

    position: relative;

    .group-list-bg {
      width: 100%;
      height: $content-height;

      position: absolute;
      box-sizing: border-box;
      border: 1rpx solid rgba($color: $white, $alpha: 0.08);
      background: rgba($color: $white, $alpha: 0.1);
    }

    // 添加这一层主要为了动画
    .group-list-wrapper {
      height: 100%;
      overflow-x: scroll;
    }

    // 分组
    .group-list {
      position: relative;
      height: 100%;

      padding: 0 10rpx;

      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      .group-cell {
        flex: 0 0 50rpx;
        width: 50rpx;
        height: 46rpx;
        line-height: 24rpx;
        text-align: center;
        @include rubikVar();

        &:last-child {
          margin-right: 0;
        }

        .group-cell-label {
          margin-bottom: 5rpx;
          opacity: 0.2;
        }

        .active-group {
          opacity: 1;
        }
      }

      // 滑动指示器
      .slider-line {
        position: absolute;
        bottom: $indicator-offset-y;
        left: 0;
        width: 30rpx;
        height: 4rpx;
        background: $sub-color;
        transition: all 0.2s ease;

        &::after {
          display: block;
          content: "";
          position: absolute;
          bottom: calc(0rpx - $indicator-offset-y);
          left: 0;
          transform: translate(8rpx);
          width: 16rpx;
          height: 12rpx;
          background: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/icon-%20slider-arrow.png") no-repeat;
          background-size: 100%;
        }
      }
    }
  }

  .total {
    margin-right: cal(24rpx - 10rpx);
    position: relative;
    flex: 0 0 50rpx;
    width: 50rpx;
    height: $content-height;
    line-height: $content-height;
    text-align: center;
    @include rubikVar(700);

    box-sizing: border-box;
    border: 1rpx solid rgba($color: $white, $alpha: 0.08);
    background: rgba($color: $white, $alpha: 0.1);

    .total-label {
      margin-bottom: 5rpx;
    }
  }


  // 头像
  .avatar-wrapper {
    .avatar-cell {
      width: $img-size-50;
      height: $img-size-50;
      background-color: $bg-col-f5;

      .icon-v {
        position: absolute;
        right: -4rpx;
        bottom: -2rpx;
        width: 20rpx;
        height: 20rpx;
      }
    }
  }

  // 数量
  .num-wrapper {
    background: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/rectangle702.png") no-repeat;
    background-size: 100% 100%;
    min-width: 68rpx;
    padding: 0 17rpx;
    height: 50rpx;
    border-radius: 28rpx;
    box-sizing: border-box;
  }

  // 更多操作
  .more-btn {
    width: $img-size-50;
    height: $img-size-50;
    background: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/btn_more.png") no-repeat center;
    background-size: 100%;
  }
}
// E 总汇

</style>