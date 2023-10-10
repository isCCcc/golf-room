<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view>
    <uni-transition key="1"
                    name="mask"
                    mode-class="fade"
                    :styles="maskClass"
                    :duration="duration"
                    :show="showMask"
                    @click="onTap" />
    <view class="arrow-top"></view>
    <view class="select-wrapper">
      <view v-for="item in showList"
            :key="item.type"
            class="select-cell flex pr"
            @click.stop="handleMore(item)">
        
        <image :src="item.icon"
               class="icon-select"
               mode="widthFix" />
        <view class="fs-28 select-cell-name"
              :class="[item.type === 'end' ? 'col-red' : 'col-black']">{{ item.label }}</view>
        <view class="split-box"></view>
        <!-- /分割线 -->
        <!-- <button class="hide-el" v-if="item.type == 'share'" open-type="share"></button> -->
        <!-- /分享按钮 -->

        <button
          v-if="item.type === 'report'"
          class="report-btn"
          open-type="contact"
          hover-class="button-hover"
          @click=""
        >
        </button>
      </view>
    </view>

  </view>
</template>

<script>
import UniTransition from '@/components/uni-transition/uni-transition';
import dayjs from "dayjs";
import { mapState } from 'vuex';
export default {
  components: { UniTransition },
  props: {
    // 当前操作的角色
    role: {
      type: Number,
      default: 2, // 0是创建者,1是球局成员,2是观赛者, 3球童
    },
    status: {
      type: Number,
      default: 0, // 当前球局状态 0未开始、1进行中、2已结束
    },
    selfCompetitor: {
      type: [Object, undefined],
      default: undefined // 
    },
    // 是否是有效球局
    isValid: {
      type: Number,
      default: true,
    },
    // 比赛结束时间
    endTime: {
      type: [String, undefined],
      default: undefined
    },
  },

  data() {
    return {
      maskClass: {
        zIndex: 10,
        position: 'fixed',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
      },
      duration: 300,
      // 控制模糊层显示
      showMask: true,
      // 更多操作列表
      moreSelectList: [
        {
          label: '修改球局',
          icon: `${this.$ossUrl}/icons/icon-3101.png`,
          type: 'edit',
          status: [0, 1],
          roles: [0] 
        },
        {
          label: '添加球手',
          icon: `${this.$ossUrl}/icons/add_players.png`,
          type: 'addCompetitors',
          status: [0, 1],
          roles: [0, 1] 
        },
        {
          label: '球手排序',
          icon: `${this.$ossUrl}/icons/sort_players.png`,
          type: 'sortCompetitors',
          status: [0, 1],
          roles: [0, 1] 
        },
        {
          label: '邀请球童',
          icon: `${this.$ossUrl}/icons/svgs/ico_option_caddie_light.svg`,
          type: 'inviteCaddie',
          status: [0, 1],
          roles: [0, 1]
        },
        {
          label: '退出记分',
          icon: `${this.$ossUrl}/icons/svgs/ico_option_caddie_light.svg`,
          type: 'exitCaddie',
          status: [0, 1, 2],
          roles: [3]
        },
        {
          label: '分享',
          icon: `${this.$ossUrl}/icons/icon-3104.png`,
          type: 'share',
          status: [0, 1, 2],
          roles: [0, 1, 2, 3]
        },
        {
          label: '反馈错误',
          icon: `${this.$ossUrl}/icons/icon-3105.png`,
          type: 'report',
          status: [0, 1, 2],
          roles: [0, 1, 2, 3]
        },
        {
          label: '退出球局',
          icon: `${this.$ossUrl}/icons/icon-3107.png`,
          type: 'out',
          status: [0, 1],
          roles: [1]
        },
        {
          label: '撤销结束球局',
          icon: `${this.$ossUrl}/icons/icon-3108.png`,
          type: 'cancel',
          status: [2],
          roles: [0,]
        },
        {
          label: '结束球局',
          icon: `${this.$ossUrl}/icons/icon-3100.png`,
          type: 'end',
          status: [0, 1],
          roles: [0]
        }
      ]
    };
  },
  computed: {
    ...mapState({
      isNowGroup: (state) => state.chatRoom.isNowGroup, // 当前操作的组
      competitionData: (state) => state.chatRoom.competitionData, // 球赛信息
    }),
    // 显示更多列表
    showList() {
      return this.moreSelectList.filter((item) => {
        // 当有结束时间，结束7天内，参赛者可以退出球局。无效球局随时退出。
        const canQuit = function (isValid, status, endTime) {
          // 没开始，或者正在进行中
          if (status == 0 || status === 1) return true;
          // 无效球局随时退出
          if (status == 2 && isValid === 0) return true; 
          // 结束 7 天内
          if (status == 2 && endTime && dayjs().subtract(7, 'day').isBefore(endTime)) return true

          //  其余情况不允许退出
          return false;
        }
        
        let that = this
        const canAdd = function () {
          let competitors = that.competitionData?.competitor_list?.filter(e => e.group == that.isNowGroup).map(
            (e) => e.competitor_id * 1
          );
          return competitors.length < 4 
        }

        const canInvite = function () {
          return that.selfCompetitor?.group === that.isNowGroup
        }
        
        if (item.type === 'out' && canQuit(this.isValid, this.status, this.endTime)) {
          return item.roles.includes(this.role)
        } else if (item.type === 'addCompetitors') {  //当前组不足4人才显示
          return canAdd() && item.roles.includes(this.role) && item.status.includes(this.status) 
        } else if (item.type === 'inviteCaddie') {  // 需要时当前组的球员才可以邀请球童
          return canInvite() && item.roles.includes(this.role) && item.status.includes(this.status) 
        } else { 
          return item.status.includes(this.status) && item.roles.includes(this.role)
        }
      })
    },
    // 更多操作选择高度
    // moreSelectHeight() {
    //   return `${this.moreSelectList.length * 100}rpx`;
    // }
  },
  methods: {
    onTap() {},
    // 更多操作
    handleMore(e) {
      this.$emit('onClick', e);
    },
  }
};
</script>
<style lang="scss" scoped>
// S 更多选择样式
.arrow-top {
  position: absolute;
  top: 68rpx;
  right: 17rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: $white;
  transform: rotate(-45deg);
  z-index: 11;
  background-color: $white;
}
.select-wrapper {
  position: absolute;
  top: 75rpx;
  right: 0;
  z-index: 10;
  width: 269rpx;
  position: absolute;
  background-color: $white;
  box-sizing: border-box;
  border-radius: 2rpx;
  overflow: hidden;
  transition: all 0.3s;
  .select-cell {
    position: relative;
    padding-left: 26rpx;
    width: 100%;
    height: 100rpx;
    box-sizing: border-box;
    // 图标
    .icon-select {
      margin-right: 10rpx;
      width: 36rpx;
      height: 36rpx;
    }
    // 分割线

    .report-btn {
      position: absolute;
      opacity: 0.0;
      width: 100%;
      height: 100%;
    }
    .split-box {
      position: absolute;
      bottom: 0;
      right: 0;
      width: calc(269rpx - 26rpx - 36rpx - 10rpx);
      height: 1px;
      background: $col-e9;
    }
    &:last-child {
      .split-box {
        background: $white;
      }
    }
  }
}
// E 更多选择样式
</style>
