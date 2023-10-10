<template>
  <uni-popup background-color="#fff"
             type="bottom"
             ref="popup"
             style="z-index: 55">
    <view class="modal-wrapper fs-28 tc h-400">
      <view class="fs-24 col-999 plr-32 title-box">修改球员排序</view>
      <!-- S 球员列表 -->
      <view class="user-list col-black"
            id="user-list">
            <DragSorts ref="dragSorts"
                       :list="renderList"
                       @confirm="sortChange"
                       :showGCell="false"
                       :listHeight="300" />
      
      </view>
      <!-- E 球员列表 -->
      <view class="fixed-bottom">
        <button class="button plain"
                @click="confirm">保存</button>
      </view>
    </view>
  </uni-popup>
</template>


<script>
// 组件
import DragSorts from './HM-dragSorts/HM-dragSorts.vue';

export default {
  components: {
    DragSorts,
  },
  computed: {},
  data() {
    return {
      ossUrl: this.$ossUrl,
      competitorList: [], // 球员列表
      itemHeight: 120,
      renderList: [], // 渲染用的列表
      show: false
    };
  },
  methods: {
    open(users) {
      this.competitorList = users
      this.renderList = JSON.parse(JSON.stringify(this.competitorList));
      this.$refs.popup.open()
    },
    // 修改球员列表
    confirm() {
      console.log('confirm', this.competitorList)
      this.$emit('confirm', this.competitorList)
      this.$refs.popup.close()
    },
    // 排序事件
    sortChange({ list }) {
      this.competitorList = [...list];
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
.h-400 {
  height: 400px;
}
</style>
