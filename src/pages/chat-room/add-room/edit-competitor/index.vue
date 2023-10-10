<!--
 * @Author: simon
 * @Description: 编辑参赛人员
 * @LastEditors: simon
-->

<template>
  <view>
    <GNavbar title="编辑参赛人员"
             :custom-back="true"
             @clickLeft="handleBack"
             class="g-nav-bar" />
    <!-- / 自定义导航 -->
    <view class="fs-24 col-999 plr-32 title-box">踢出球友或修改球员排序</view>
    <!-- S 球员列表 -->
    <view class="user-list"
          id="user-list">
      <DragSorts ref="dragSorts"
                 :list="renderList"
                 @confirm="sortChange"
                 @onSelect="handleSelect"
                 @onDel="handleDel"
                 :showGCell="false"
                 :showDel="true"
                 :listHeight="300" />

    </view>
    <!-- E 球员列表 -->
    <view class="fixed-bottom">
      <button class="button"
              @click="handleSave">保存</button>
    </view>
  </view>
</template>




<script>
// 组件
import GCell from '@/components/g-cell/index';
import DragSorts from './components/HM-dragSorts/HM-dragSorts.vue';
import GNavbar from '@/components/g-navbar/index.vue';

import { mapState } from 'vuex';
import { genderedAvatar } from '@/utils/image';

export default {
  components: {
    GCell,
    DragSorts,
    GNavbar
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
      competitorList: [], // 球员列表
      itemHeight: 120,
      currentGroupIndex: 0, // 当前分组
      renderList: [] // 渲染用的列表
    };
  },

  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('getcompetitorList', ({ list, index }) => {
      this.competitorList = list.map((e) => {
        // 因为要放到 DragSorts 里面，需要提前处理一下头像
        let avatar_url = genderedAvatar(e)
        this.$set(e, 'avatar_url', avatar_url);
        this.$set(e, 'check', false);
        return e;
      });
      this.renderList = JSON.parse(JSON.stringify(this.competitorList));
      console.log('renderList', this.renderList)
      this.currentGroupIndex = index;
    });
  },
  methods: {
    // 导航返回
    handleBack() {
      uni.navigateBack();
    },
    // // 选择球员
    handleSelect({ index, row }) {
      this.competitorList[index].check = row.check;
    },
    // 修改球员列表
    updateList() {
      uni.$emit('update-competitor', {
        list: this.competitorList,
        index: this.currentGroupIndex
      });

      this.getOpenerEventChannel().emit('update-competitor', {
        list: this.competitorList,
        index: this.currentGroupIndex
      });
    },
    // 删除球员列表
    handleDel({ index, row }) {
      if (row.uid == this.userInfo.uid) {
        uni.showToast({
          title: '不能删除自己',
          icon: 'error',
          duration: 1500,
        });
        return false;
      }
      
      uni.showModal({
        content: '确定删除选中的球员吗？',
        cancelText: '不删除',
        confirmText: '删除',
        confirmColor: '#FF6A6A',
        success: async (res) => {
          if (res.confirm) {
            console.log('用户点击确定');
            this.competitorList.forEach((e, i) => {
              if (e.uid == row.uid) {console.log(i)
                this.competitorList.splice(i, 1);
              }
            });
            //this.competitorList = this.competitorList.filter((e) => !e.check);
            this.renderList = JSON.parse(JSON.stringify(this.competitorList));
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    // 排序事件
    sortChange({ list }) {
      console.log(list);
      this.competitorList = [...list];
      console.log('competitorList', this.competitorList);
    },
    handleSave() {
      uni.showModal({
        title: '是否保存',
        content: '是否保存你的操作？',
        cancelText: '暂不保存',
        confirmText: '保存',
        confirmColor: '#003C3D',
        cancelColor: '#999999',
        success: async (res) => {
          if (res.confirm) {
            console.log('用户点击确定');
            this.updateList();
            uni.showToast({
              title: '已保存',
              icon: 'success',
              duration: 1000,
            });
            setTimeout(() => {
              this.handleBack()
            },1000)
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// 编辑标题
.title-box {
  line-height: 87rpx;
  background-color: $bg-col-f9;
}
// 球员列表
.user-list {
  .user-cell {
    height: 120rpx;
    // height: 100%;
    .radio-box {
      flex: 0 0 58rpx;
      width: 58rpx;
    }
    .g-avatar {
      margin-right: 16rpx;
      width: $img-size-80;
      height: $img-size-80;
    }
    .icon-sort {
      flex: 0 0 35rpx;
      width: 35rpx;
      height: 24.5rpx;
      background: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/icon-sort.png')
        no-repeat center;
      background-size: 100%;
    }
  }
}
// 按钮
.fixed-bottom {
  padding: 66rpx;
  bottom: 560rpx;
  .button {
    height: 96rpx;
    line-height: 96rpx;
  }
}

//scoped 在当前页生效 不影响子组件
.drag-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
