<!--
 * @Author: simon
 * @Description: 观众列表
 * @LastEditors: simon
-->
<template>
  <uni-popup background-color="#fff"
             type="bottom"
             ref="popup"
             @maskClick="close">

    <scroll-view scroll-y
                 class="list-wrapper"
                 lower-threshold="50"
                 @scrolltolower="handlePageSize">
      <!-- 把标题挪进来，否则弹出user-modal的时候遮罩层无法罩住标题 -->
      <view class="title-wrapper fs-24 tc col-999">在线观众</view>
      <view class="list-container">
        <view class="list-cell flex"
              v-for="(item, index) in watchList"
              :key="index" 
              @click="handleCellClick(item)">
          <GAvatar 
            class="g-avatar"
            :avatar-data="item"
            :size-in-rpx='80'
            :radius="'100%'"
            :customClickHandling="true"
            @avatar-click="handleCellClick(item)" />
          <view class="fs-24 col-black">{{item.username || ''}}</view>
          <view class="gender-box"
                v-if="item.gender">
            <image :src="`${ossUrl}/icons/${ item.gender == 1 ? 'icon-male' : 'icon-female'}.png`"
                   class="icon-gender"
                   mode="widthFix" />
          </view>
        </view>
      </view>
    </scroll-view>

    <UserModal ref="userModal" />
  </uni-popup>
</template>

<script>
// api
import { getWatchList } from '@/api/chat-room';
import GAvatar from '@/components/g-avatar/g-avatar.vue'
import UserModal from '@/components/g-avatar/user-modal.vue'
const pageConifg = {
  start: 0, // 查询数据开始位置
  page: 1, // 当前页
  pageSize: 10, // 每页总条数
  page_count: 0 // 总页数
};
export default {
  components: {
    GAvatar,
    UserModal,
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
      watchList: [], // 观众列表
      dataSource: [], // 观众列表(源数据)
      competitionId: '', // 球局id
    };
  },

  methods: {
    // 获取围观列表
    async getWatchList() {
      let params = {
        start: pageConifg.start,
        count: pageConifg.pageSize,
        competition_id: this.competitionId
      };
      let {
        data: {data: { list, total }}
      } = await getWatchList(params);
      pageConifg.page_count = Math.ceil(total / pageConifg.pageSize);
      
      this.watchList = [...this.watchList, ...list];
    },
    // // 触发下拉事件
    handlePageSize() {
      console.log('触发分页');
      if (pageConifg.page >= pageConifg.page_count) return;
      
      pageConifg.page++;
      pageConifg.start = pageConifg.start + pageConifg.pageSize;
      this.getWatchList();
    },
    // // 渲染列表
    // renderList() {
    //   let oldList = [...this.watchList];
    //   let newList = this.dataSource.splice(0, pageConifg.pageSize);
    //   this.watchList = [...oldList, ...newList];
    // },
    // 打开
    open({ id }) {
      // this.dataSource = [...data];
      // this.renderList();
      this.competitionId = id;
      this.getWatchList();
      this.$refs.popup.open();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
      this.watchList = [];
      pageConifg.page = 1;
      pageConifg.start = 0;
      pageConifg.page_count = 0;
    },

    handleCellClick(item) {
      this.$refs.userModal?.loadData(item, false)
    },
  }
};
</script>

<style lang="scss" scoped>
// 标题
.title-wrapper {
  line-height: 90rpx;
  position:fixed;
  width:100vw;
  z-index: 2;
  background:#FFFFFF;
}
.list-container {
  position:absolute;
  top:90rpx;
  width:100vw;
}
// 列表
.list-wrapper {
  height: 50vh;
  .list-cell {
    padding: 0 32rpx;
    height: 120rpx;
    border-top: 1px solid $col-e9;
    // height: 1000rpx;
    .g-avatar {
      margin-right: 16rpx;
    }
    .gender-box {
      margin-left: 15rpx;
      // padding: 2rpx;
      // background: #FFF5F5;
      // border-radius: 2px;
      // color: #FF7777;
      .icon-gender {
        width: 25rpx;
      }
    }
  }
}
</style>
