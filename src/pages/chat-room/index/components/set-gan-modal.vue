<template>
  <uni-popup background-color="#f9f9f9" type="bottom" :safe-area="false" ref="popup">
    <view class="flex flex-col items-stretch popup-content-root" 
          :style="{ '--max-height': maxHeight + 'px', 
                    '--bottom-inset': bottomInset + 'px', }">
      <!-- S 标题 -->
      <view class="fs-32 title-wrapper pr col-999">
        <view>
          <text class="fw-600 sub-color mr-16">{{ holeInfo.hole_no2 + '号洞' }}</text>
          <text>Par{{ holeInfo.par }}</text>
        </view>
        <view class="close-btn" @click="handleClose"></view>
      </view>
      <!-- E 标题 -->

      <!-- S 列表 -->
      <scroll-view scroll-y class="flex-1 list-wrapper col-black pr">
        <view v-for="(item, index) in competitorList" :key="item.competitor_id" 
              class=" mr-28 ml-28 mb-20 flex flex-col items-stretch cell">
          <view :class="[expandingIndex == index ? 'border-b' : '']" class="flex cell-basic">
            <GAvatar class="g-avatar" :avatar-data="item" :size-in-rpx='80' :radius="'100%'" handle-click="false"/>
            <text class="ml-20 flex-1 fs-32 text-over">{{ item.username }}</text>
            
            <!-- 总杆标题  -->
            <view v-if="expandingIndex == index" class="ml-24 total-title">总杆数</view>
            <!-- 总杆设置 -->
            <view class="ml-24 number-box flex trans tc">
              <view class="number-box-square flex-center"
                    @click="handleSetScore(item, { count: -1, type: 'setScore' })">
                <text>-</text>
              </view>
              <view class="number-box-value flex-center pr">
                <picker-view
                  :indicator-style="indicatorStyle"
                  :value="[item.setScoreIdx]"
                  @change="pickerChange(item, { type: 'setScore' }, $event)"
                  class="picker-view"
                >
                  <picker-view-column class="picker-view-column">
                    <!-- <view > -->
                      <view v-for="(pItem, index) in parList" :key="index"
                        class="picker-view-item"
                        @click="handlePickerItem(item, pItem)"
                        >
                        <text v-if="pItem == '重置'">重置</text>
                        <text v-else class="rubik">
                          {{ pItem > 0 ? "+" : "" }}{{ pItem === null ? '' : pItem}}
                        </text>
                      </view>
                    <!-- </view> -->
                  </picker-view-column>
                </picker-view>
              </view>

              <view class="number-box-square flex-center" 
                    @click="handleSetScore(item, { count: 1, type: 'setScore' })">
                <text>+</text>
              </view>
            </view>

            <!-- 分割线 -->
            <view v-if="expandingIndex != index" class="separator"></view>
            <!-- 展开按钮 -->
            <view v-if="expandingIndex != index" class="flex-center expand-btn"
                  @click="handleExpanding(index)">
              <view>展开</view>
              <view class="arrow"></view>
            </view>
          </view>
          <!-- 展开部分 -->
          <view v-if="expandingIndex == index" class="border-b cell-expand">
            <view class="border-b">
              <!-- 推杆部分 -->
              <view class="flex-end push">
                <!-- 推杆标题  -->
                <view class="push-title">推杆数</view>
                <!-- 推杆设置 -->
                <view class="ml-24 number-box flex trans tc">
                  <view class="number-box-square flex-center"
                        @click="handleSetScore(item, { count: -1, type: 'setPush' })" >
                        <text>-</text>
                  </view>
                  <view class="number-box-value flex-center rubik">{{ item.setPush === null ? "" : item.setPush }}</view>
                  <view class="number-box-square flex-center" 
                        @click="handleSetScore(item, { count: 1, type: 'setPush' })">
                    <text>+</text>
                  </view>
                </view>
              </view>
              <!-- 开球部分 -->
              <view v-if="holeInfo.par > 3" class="flex-end fairway">
                <!-- 开球标题 -->
                <view class="fs-32">开球</view>
                <!-- 开球按钮 -->
                <view class="ml-38 flex fairway-btns">
                  <view v-for="state in fairwayStates" :key="state.value"
                        :style="{ '--selected' :  state.value == (item.setFairway || 0)}" 
                        class="flex flex-col f-state"
                        @click="handleSetFairway(item, state.value)">
                    <view class="f-state-icon" 
                          :style="{ transform: `rotate(${state.rotate}deg)`,
                                    backgroundColor: fairwayBg(state.value == (item.setFairway || 0)),
                                    border: fairwayBorder(state.value == (item.setFairway || 0)),
                                    '--bg-image': state.imageHandling(state.value == (item.setFairway || 0)) }" >
                      <!-- <view :style="{ transform: `rotate(${state.rotate}deg)`, backgroundImage: state.imageHandling(state.value == (item.setFairway || 0)) }" /> -->
                    </view>
                    <view class="mt-8 fs-22 col-333 f-state-title">{{ state.name }}</view>
                  </view>
                </view>
              </view>
            </view>
            <!-- 收起 -->
            <view class="flex-center fs-28 collapse-btn" @click="handleCollapse(index)">
              <view class="flex">收起</view>
              <view class="ml-8 arrow"></view>
            </view>
          </view>
        </view>
      </scroll-view>
      <!-- E 列表 -->

      <!-- S 底部按钮 -->
      <view class="flex footer-btn">
        <button class="button plain reset-btn" @click="handleReset">清除</button>
        <button class="button flex1" :loading="saveLoading" @click="confirm">确定</button>
      </view>
      <!-- E 底部按钮 -->
    </view>
  </uni-popup>
</template>

<script>
// 组件
import GAvatar from "@/components/g-avatar/g-avatar.vue";
import uniPopup from "@/components/uni-popup/uni-popup";

export default {
  props: {
    // 用户信息
    userInfo: {
      type: [Object, null],
      default: () => ({}),
    },
    // 本人是否是参赛人员
    isSelfCompetitor: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    uniPopup,
    GAvatar,
},

  data() {
    return {
      maxHeight: 400, // In px
      bottomInset: uni.upx2px(30), // In px

      competitorList: [], // 球员信息
      holeInfo: {}, // 球洞信息
      recordIndex: -1, // 计分记录索引
      indicatorStyle: `height: 58rpx;`,
      // 打开的位置
      expandingIndex: -1,
      fairwayStates: [
        {
          name: '上球道',
          imageHandling: this.circleImage,
          rotate: 0,
          value: 0,
        },
        {
          name: '拉左',
          imageHandling: this.arrowImage,
          rotate: 0,
          value: 1,
        },
        {
          name: '拉右',
          imageHandling: this.arrowImage,
          rotate: 180,
          value: 2,
        },
        {
          name: '打穿',
          imageHandling: this.arrowImage,
          rotate: 90,
          value: 3,
        },
        {
          name: '打短',
          imageHandling: this.arrowImage,
          rotate: -90,
          value: 4,
        },
      ]
    };
  },
  computed: {
    // // 移动距离
    // moveInfo() {
    //   return this.showNavBar
    //     ? {
    //         move1: 100, // 头像移动
    //         move2: 109, // 杆数整列移动
    //         move3: "80rpx", // 推杆整列移动
    //         move4: "340rpx", // 表头推杆移动
    //       }
    //     : {
    //         move1: 350,
    //         move2: 109,
    //         move3: "50vw",
    //         move4: "50vw",
    //       };
    // },
    // 球洞可选列表
    parList() {
      let list = ["重置",null];
      for (let i = -Number(this.holeInfo.par - 1); i <= 50; i++) {
        list.push(i);
      }
      return list;
    },
  },

  mounted() {
    const res = uni.getSystemInfoSync();
    const menuBtnRect = wx.getMenuButtonBoundingClientRect()
    this.maxHeight = res.screenHeight - menuBtnRect.bottom - uni.upx2px(32);
    this.bottomInset = Math.max(uni.upx2px(30), res.safeAreaInsets.bottom);
  },
  methods: {
    circleImage(selected) {
      const color = selected ? 'fff' : '999';
      const image = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='translate(16.5 16.5)' fill='none' fill-rule='evenodd'%3E%3Ccircle stroke='%23${color}' stroke-width='3' cx='13.5' cy='13.5' r='13.5'/%3E%3Ccircle fill='%23${color}' fill-rule='nonzero' cx='13.5' cy='13.5' r='6'/%3E%3C/g%3E%3C/svg%3E`
      return `url(\"${image}\")`
    },
    arrowImage(selected) {
      const color = selected ? 'fff' : '999';
      const image = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M41 31.5a1.5 1.5 0 0 0 0-3v3zm-23.06-2.56a1.5 1.5 0 0 0 0 2.12l9.545 9.547a1.5 1.5 0 1 0 2.122-2.122L21.12 30l8.486-8.485a1.5 1.5 0 1 0-2.122-2.122L17.94 28.94zM41 28.5H19v3h22v-3z' fill='%23${color}' fill-rule='nonzero'/%3E%3C/svg%3E`
      return `url(\"${image}\")`
    },
    fairwayBg(selected) {
      return selected ? '#003C3D' : 'inherit'
    },
    fairwayBorder(selected) {
      return selected ? 'inherit' : '2rpx solid #D5D5D5'
    },

    // 重置
    handleReset() {
      this.competitorList.forEach((item) => {
        item.setScore = null;
        item.setScoreIdx = 1;
        item.setPush = null;
        item.setFairway = 0;
      });
    },
    // picker数据被改变
    pickerChange(item, { type }, { detail: { value } }) {
      const [first] = value;
      if (![0, 1].includes(first)) {
        this.handleSetScore(item, {
          type,
          count: this.parList[first] - item.setScore,
        });
      } else if(first === 1){
        this.$set(item, type, null);
        this.$set(item, 'setScoreIdx', 1)
      } else {
        this.$set(item, type, null);
        this.$set(item, 'setScoreIdx', 0)
      }
    },
    // picker 被点击
    handlePickerItem(item, pItem) {
      if(!pItem) {
        this.handleSetScore(item, {
          type: 'setScore',
          count: 0,
        });
      }
    },
    // 提交分数
    confirm() {
      let list = this.competitorList.filter(
        (item) =>
          item.setScore !== item.record[this.recordIndex].score ||
          item.setPush !== item.record[this.recordIndex].push ||
          item.setFairway !== item.record[this.recordIndex].fairway 
      );
      this.$emit("update", list, this.recordIndex, this.holeInfo);
      this.close();
    },
    // 设置分数
    handleSetScore(item, { count, type }) {
      let score = Number(item[type]) + count;
      const scoreLimit = {
        setScore: { max: 50, min: -Number(this.holeInfo.par) + 1 },
        setPush: { max: Number(this.holeInfo.par) + Number(item.setScore) - 1, min: 0 },
      };
      
      const { max, min } = scoreLimit[type];
      if (score > max || score < min) return;
      // score = score > 0 ? `+${score}` : score;
      this.$set(item, type, score);
      if (type === "setScore") {
        let idx = this.parList.findIndex((e) => e === score);
        this.$set(item, "setScoreIdx", idx);
      }
      // 当前用户每次修改杆差都要重置推杆的输入
      if(type === "setScore") {
        this.$set(item, "setPush", null);
        // this.$set(item, "setFairway", 0);
      }
    },
    handleSetFairway(item, value) {
      this.$set(item, "setFairway", value);
    },

    handleExpanding(index) {
      this.expandingIndex = index
    },
    handleCollapse(index) {
      this.expandingIndex = -1
    },
    handleClose() {
      this.close();
    },
    // 打开
    open({ holeInfo, competitorList, recordIndex }) {
      this.expandingIndex = -1;
      this.holeInfo = holeInfo;
      this.recordIndex = recordIndex;
      this.competitorList = competitorList.map((item) => {
        let score = item.record[recordIndex].score;
        let idx = this.parList.findIndex(
          (e) => e === item.record[recordIndex].score
        );
        this.$set(item, "setScore", score); // 设置杆数
        if (idx !== -1) {
          this.$set(item, "setScoreIdx", idx); // 设置picker-view 的index
        } else {
          this.$set(item, "setScoreIdx", 1);
        }
        this.$set(item, "setPush", item.record[recordIndex].push); // 设置推杆数
        this.$set(item, "setFairway", item.record[recordIndex].fairway); // 设置开球
        return item;
      });
      this.$refs.popup.open();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/set-gan-modal.scss";
.picker-view {
  width: 100%;
  height: 100%;
}
.picker-view-column {
  width: 84rpx;
  height: 58rpx;
}
.picker-view-item {
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  text-align: center;
}
// .num-box {
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   z-index: 10;
//   background-color: #f9f9f9;
// }
</style>
