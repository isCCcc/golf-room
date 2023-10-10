<!--
 * @Author: simon
 * @Description: 球洞设置
 * @LastEditors: simon
-->
<template>
  <view class="page">
    <!-- S 自定义导航 -->
    <GNavbar fixed title="球洞设置" class="g-nav-bar" />
    <!-- E 自定义导航 -->

    <view class="p-32">
      <!-- S 自定义始洞 -->
      <view class="h-120 flex start bg-white" @click="handle">
        <GCell className="plr-32" label="Pk起始洞" isLink class="flex1">
          <view class="flex-end h-120">
            <view class="col-999"> {{ startHold }} </view>
          </view>
        </GCell>
      </view>
      <!-- E 自定义始洞 -->

      <!-- S 滑动球洞顺序调整 -->
      <view class="flex-center h-80">
        <text class="fs-28 fw-400 col-999">滑动球洞调整顺序</text>
      </view>
      <view class="bg-white radius-4 effective">
        <template v-for="(item, index) in holes">
          <view
            :key="index"
            class="holes-cell holes-box"
            :data-id="isActive == item ? 'acitve' : ''"
            data-node="old"
            :class="{
              active: isActive == item,
              isMove: isActive == item && isMoveNode,
            }"
            @touchstart="onTouchStart(item, index, $event)"
            @touchend="onTouchEnd"
            @touchmove="onTouchMove"
            >{{ item }}</view
          >
        </template>
        <view class="active-node" :style="[oldNodeStyle]">{{ isActive }}</view>
      </view>
      <!-- E 滑动球洞顺序调整 -->

      <!-- S 无效球洞 -->
      <view class="radius-4 not-effective">
        <view class="text">不参与PK的洞移到此</view>
        <view class="not_effective box">
          <template v-for="(item, idx) in notHoles">
            <view
              class="not-holes-cell"
              :key="idx"
              :style="[item.styles]"
              :class="{ isHiden: isActive == item.value && isMoveNode }"
              data-node="new"
              @touchstart="onTouchStart(item.value, idx, $event)"
              @touchend="onTouchEnd"
              @touchmove="onTouchMove"
              >{{ item.value }}</view
            >
          </template>

          <view class="active-node" :style="[newNodeStyle]">{{
            isActive
          }}</view>
        </view>
      </view>
      <!-- E 无效球洞 -->
    </view>
    <!-- S 确认 -->
    <view class="fixed-bottom">
      <button
        class="button sub fw-600"
        @click="handleSub"
        :loading="confirmLoading"
      >
        确认并返回
      </button>
    </view>
    <!-- E 确认 -->
    <!-- 跳洞设置 -->
    <HoleModal ref="hole" @change="handleHoleChange"></HoleModal>
  </view>
</template>
<script>
// components
import GNavbar from "@/components/g-navbar/index.vue"
import GCell from "@components/g-cell/index.vue"
import HoleModal from "@/pages/pk/pk-rules-setting/components/hole-modal"

import { mapState, mapMutations } from "vuex"
export default {
  components: {
    GNavbar,
    GCell,
    HoleModal,
  },
  data() {
    return {
      holes: [], // 有效球洞
      isActive: null, // 当前开始拖拽的节点
      // 有效球洞拖动区域边界值
      effective: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      //  有效果球洞的每一个洞的定位
      effSizes: [],
      notEffSizes: [], // 跳洞的定位
      handleType: "old",
      // 不参与球洞拖动区域边界值
      notEffective: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      isMove: false, // 正在移动
      isMoveNode: false, // 移动超出范围，移除当前节点
      // 原始位置
      oldPoint: {
        x: 0,
        y: 0,
      },
      // 当前坐标
      point: {
        x: 0,
        y: 0,
      },
      // 当前坐标的差值
      tapPoint: {
        x: 0,
        y: 0,
      },
      // 当前定位
      stylePoint: {
        x: 0,
        y: 0,
      },
      // 当前定位在上方的节点
      activeNodeStyle: {
        display: "none",
        top: 0,
        left: 0,
      },
      // 带定位的球洞数据
      notHoles: [],
      // 触摸点和临界值之间的误差值
      errorData: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      confirmLoading: false,
    }
  },
  computed: {
    ...mapState({
      pkHoles: (state) => state.pk.pkHoles,
      pkInfo: (state) => state.pk.pkInfo,
      pkRules: (state) => state.pk.pkRules, //pk规则列表
    }),
    oldNodeStyle() {
      if (this.handleType === "old") return this.activeNodeStyle
      return {}
    },
    newNodeStyle() {
      if (this.handleType === "new") return this.activeNodeStyle
      return {}
    },
    startHold() {
      return this.holes.length ? this.holes[0] : "不能没有洞"
    },
  },
  watch: {
    holes: {
      handler(val) {
        this.$nextTick(() => {
          this.initChildren()
        })
      },
      deep: true,
    },
  },
  mounted() {
    this.holes = [...this.pkHoles]
    if(this.pkHoles.length !== 18) {
      let arr = [];
      for(let i = 1; i < 19; i++) {
        if(!this.holes.includes(i)) {
          arr.push({value: i, styles: {display: 'inline-block', margin:'20rpx 12rpx'}})
        }
      }
      this.notHoles = arr
    }
    this.init()
  },
  methods: {
    ...mapMutations(["SET_PK_KEY", "SET_PK_RULES"]),
    back() {
      uni.navigateBack()
    },
    init() {
      // 获取有效球洞的临界值
      uni
        .createSelectorQuery()
        .in(this)
        .select(".effective")
        .boundingClientRect(({ top, bottom, left, right }) => {
          this.effective = { top, bottom, left, right }
        })
        .exec()
      this.initChildren()

      // 获取不参与球洞的临界值
      uni
        .createSelectorQuery()
        .in(this)
        .select(".not_effective")
        .boundingClientRect(({ top, bottom, left, right }) => {
          this.notEffective = { top, bottom, left, right }
        })
        .exec()
    },
    initChildren() {
      // 获取每个球洞的定位
      uni
        .createSelectorQuery()
        .in(this)
        .selectAll(".holes-box")
        .boundingClientRect((res) => {
          this.effSizes = [...res]
        })
        .exec()
    },
    getNotChildren() {
      uni
        .createSelectorQuery()
        .in(this)
        .selectAll(".not-holes-cell")
        .boundingClientRect((res) => {
          this.notEffSizes = [...res]
          console.log("this.notEffSizes", this.notEffSizes)
        })
        .exec()
    },
    handle() {
      this.$refs.hole.open(null)
    },
    handleHoleChange(val) {
      let holes = new Array(18).fill(1).map((e, idx) => idx + 1)
      let first = holes.slice(val - 1)
      let seconed = holes.slice(0, val - 1)
      let newHoles = [...first, ...seconed]
      this.holes = newHoles
      this.notHoles = []
    },

    // 拖拽开始
    onTouchStart(value, idx, e) {
      console.log("onTouchStart", e)

      this.isActive = value
      this.isMoveNode = false
      this.handleType = e.currentTarget.dataset.node
      const { currentTarget, touches } = e
      const { offsetLeft, offsetTop, dataset } = currentTarget
      this.stylePoint = {
        x: offsetLeft,
        y: offsetTop,
      }

      this.activeNodeStyle = {
        display: "block",
        top: offsetTop + "px",
        left: offsetLeft + "px",
      }
      // 记录原始定位
      this.oldPoint = {
        x: touches[0].pageX,
        y: touches[0].pageY,
      }
      // 记录当前定位
      this.point = {
        x: touches[0].pageX,
        y: touches[0].pageY,
      }
      const { node } = dataset
      let left = 0,
        top = 0,
        right = 0,
        bottom = 0
      if (node === "old") {
        left = this.effSizes[idx].left
        top = this.effSizes[idx].top
        right = this.effSizes[idx].right
        bottom = this.effSizes[idx].bottom
        console.log(
          "item",
          left,
          top,
          right,
          bottom,
          "this.point.x",
          this.point.x
        )
      }
      if (node === "new") {
        left = this.notEffSizes[idx].left
        top = this.notEffSizes[idx].top
        right = this.notEffSizes[idx].right
        bottom = this.notEffSizes[idx].bottom
        console.log(
          "item",
          left,
          top,
          right,
          bottom,
          "this.point.x",
          this.point.x
        )
      }

      // 当前坐标x距离临界点的距离
      this.errorData = {
        left: left - this.point.x,
        top: top - this.point.y,
        right: right - this.point.x,
        bottom: bottom - this.point.y,
      }
      console.log("this.errorData", this.errorData)
      console.log("this.holes::", this.holes)
    },
    // 拖拽过程中
    onTouchMove(e) {
      console.log("onTouchMove", e)
      if (!this.isActive) return
      if (this.isMove) return
      this.isMove = true
      this.tapPoint = {
        x: this.point.x - e.touches[0].pageX,
        y: this.point.y - e.touches[0].pageY,
      }
      this.point = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY,
      }

      this.stylePoint = {
        x: this.stylePoint.x - this.tapPoint.x,
        y: this.stylePoint.y - this.tapPoint.y,
      }

      this.activeNodeStyle.left = this.stylePoint.x + "px"
      this.activeNodeStyle.top = this.stylePoint.y + "px"

      // 当前定位和历史定位对比, 如果移动超出范围则截取当前球洞
      let xLength = this.point.x - this.oldPoint.x
      let yLength = this.point.y - this.oldPoint.y
      if (
        (xLength < -20 || xLength > 20 || yLength < -20 || yLength > 20) &&
        !this.isMoveNode
      ) {
        this.isMoveNode = true
      }

      this.isMove = false
    },
    // 拖拽结束
    onTouchEnd(e) {
      console.log("onTouchEnd", e)
      const { node } = e.currentTarget.dataset
      if (!this.isActive) return

      this.tapPoint = {
        x: this.point.x - e.changedTouches[0].pageX,
        y: this.point.y - e.changedTouches[0].pageY,
      }
      this.point = {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
      }
      this.stylePoint = {
        x: this.stylePoint.x - this.tapPoint.x,
        y: this.stylePoint.y - this.tapPoint.y,
      }
      this.activeNodeStyle.left = this.stylePoint.x + "px"
      this.activeNodeStyle.top = this.stylePoint.y + "px"

      this.handleEffective(node)
    },
    setHoles({ type, idx, node }) {
      console.log("this.isMoveNode", type, idx, this.isMoveNode, this.isActive)

      if (type === 0) {
        if (idx === -1) {
          this.holes.push(this.isActive)
        } else {
          const finIdx = this.holes.findIndex((e) => e == this.isActive)
          
          if (finIdx !== idx) {
            if(finIdx !== -1) {
              this.holes.splice(finIdx, 1)
            }
            this.holes.splice(idx, 0, this.isActive)
          }
        }
      }
      if (type === 1) {
        const finIdx = this.holes.findIndex((e) => e == this.isActive)
        if (finIdx !== -1) {
          this.holes.splice(finIdx, 1)
          this.holes.push(this.isActive)
        }
      }
      if (type === 2 && idx !== -1) {
        this.holes.splice(idx, 1)
      }

      this.activeNodeStyle.display = "none"
      this.isActive = null
      console.log("this.holes", this.holes)
    },
    handleEffective(node) {
      const { x, y } = this.point
      console.log("x", x, "y", y)

      let left = x + this.errorData.left
      let top = y + this.errorData.top
      let right = x + this.errorData.right
      let bottom = y + this.errorData.bottom
      console.log("left", left, this.effective.left)
      console.log("top", top, this.effective.top)
      console.log("right", right, this.effective.right)
      console.log("bottom", bottom, this.effective.bottom)

      if (
        left > this.effective.left &&
        top > this.effective.top &&
        right < this.effective.right &&
        bottom < this.effective.bottom
      ) {
        // 找出临近位置的下标
        const idx = this.effSizes.findIndex((n) => {
          if (
            this.point.x >= n.left &&
            this.point.x <= n.right &&
            this.point.y >= n.top &&
            this.point.y <= n.bottom
          ) {
            return true
          } else if (this.point.x < n.left && this.point.y < n.top) {
            return true
          }
          return false
        })
        if(node == 'new') {
          const findIdx = this.notHoles.findIndex((e) => e.value == this.isActive)
          if(findIdx !== -1) {
            this.notHoles.splice(findIdx, 1)
          }
          
        }

        this.setHoles({ type: 0, idx, node })
        return
      }
      console.log("执行到这里吗")
      this.handleNotEffected(node)
    },
    handleNotEffected(node) {
      const { x, y } = this.point

      let left = x + this.errorData.left
      let top = y + this.errorData.top
      let right = x + this.errorData.right
      let bottom = y + this.errorData.bottom
      console.log("top", top, this.notEffective.top)
      console.log("left", left, this.notEffective.left)
      console.log("right", right, this.notEffective.right)
      console.log("bottom", bottom, this.notEffective.bottom)
      if (
        left > this.notEffective.left &&
        top > this.notEffective.top &&
        right < this.notEffective.right &&
        bottom < this.notEffective.bottom
      ) {
        console.log(
          "拖动有效-移动到新位置",
          this.notEffective.top,
          this.stylePoint.y
        )
        const newLeft = this.stylePoint.x
        let newTop = 0
        if (node == "old") {
          newTop =
            this.stylePoint.y - (this.notEffective.top - this.effective.top)
        }
        if (node == "new") {
          newTop = this.stylePoint.y
        }

        console.log("this.stylePoint.y", this.stylePoint.y, newTop)
        const findIdx = this.notHoles.findIndex((e) => e.value == this.isActive)
        if (findIdx == -1) {
          this.notHoles.push({
            value: this.isActive,
            styles: {
              left: newLeft + "px",
              top: newTop + "px",
              zIndex: this.notHoles.length + 5,
              display: "block",
              position: "absolute",
            },
          })
        } else {
          this.$set(this.notHoles[findIdx].styles, "left", newLeft + "px")
          this.$set(this.notHoles[findIdx].styles, "top", newTop + "px")
        }

        const idx = this.holes.findIndex((e) => e == this.isActive)
        this.setHoles({ type: 2, idx: idx, node })
        this.$nextTick(() => {
          this.getNotChildren()
        })
        return
      }
      console.log("执行到这里吗????")
      this.setHoles({ type: 1, idx: -1, node })
    },

    handleSub() {
      this.confirmLoading = true
      
      
      let oldHoles = this.pkHoles
      //检测pkHoles顺序是否有变化，有的话pk里valid_holes也要跟着变化
      let that = this
      let holeNoChanged = oldHoles.length == that.holes.length && oldHoles.every(function(v,i) { return v === that.holes[i]})
      if (!holeNoChanged) {
        this.pkRules.forEach((rule, rindex) => {
          
          let oldValidHoles = rule.rules.valid_holes
          let oldValidHolesObject = {}
          oldHoles.forEach((holeNo, hindex) => {
            this.$set(oldValidHolesObject, holeNo, oldValidHoles[hindex])
          })
          
          let newValidHoles =  new Array(that.holes.length).fill(0);
          that.holes.forEach((holeNo, hindex) => {
            newValidHoles[hindex] = oldValidHolesObject?.[holeNo]
          })
          console.log(newValidHoles)
          this.pkRules[rindex].rules.valid_holes = newValidHoles
        })
        
        this.SET_PK_RULES(this.pkRules);
      }
      
      
      this.SET_PK_KEY({ key: "pkHoles", data: this.holes })
      this.pkInfo.start_hold = this.startHold
      this.pkInfo.hold_list = this.holes
      this.SET_PK_KEY({ key: "pkInfo", data: this.pkInfo })
      this.back()
    },
  },
}
</script>
<style scoped lang="scss">
// 导航栏
::v-deep .g-nav-bar {
  .uni-navbar > .uni-navbar__content {
    background-image: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/bg-navbar.png") !important;
  }
}
.start {
  border-bottom: 1rpx solid #e9e9e9;
}
.radius-4 {
  border-radius: 4rpx;
}
.h-80 {
  height: 80rpx;
}
.effective {
  height: 383rpx;
  padding-top: 10rpx;
  padding-left: 28rpx;
  position: relative;
}
.not-effective {
  position: relative;
  margin-top: 42rpx;
  height: 393rpx;
  position: relative;
  background-color: #f4f4f4;
  border: 1rpx solid #dddddd;
  .text {
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999999;
    font-size: 28rpx;
    font-weight: 400;
  }
  .box {
    z-index: 2;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding-top: 10rpx;
    padding-left: 28rpx;
  }
}
.holes-cell {
  display: inline-block;
  margin: 20rpx 12rpx;
  width: 80rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 50%;
  background-color: $sub-color;
  color: #FFFFFF;
  text-align: center;

  &[data-id="acitve"] {
    opacity: 0;
  }
  &.isMove {
    display: none;
  }
  &.active {
    background-color: $sub-color;
  }
}
.active-node {
  z-index: 10;
  position: absolute;
  display: none;
  width: 80rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 50%;
  text-align: center;
  background-color: $sub-color;
}
.not-holes-cell {
  width: 80rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 50%;
  text-align: center;
  background-color: #E9E9E9;
  color: #999999;
  &.isHiden {
    display: none !important;
  }
}
// 底部确认按钮
button.button {
  height: 96rpx;
  line-height: 96rpx;
}
button.button.sub {
  margin: 0 32rpx;
}
</style>
