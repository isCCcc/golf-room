<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view id="page">
    <GNavbar fixed :title="navBarTitle" class="g-nav-bar"/>

    <!-- / 自定义导航 -->
    <view class="ml-32 mr-32 mt-32">
      <RoomInfo ref="roomInfoRef"
                :disabled="!!competitionId && roomType == 'new'"
                :room-type="roomType"></RoomInfo>
    </view>

    <!-- / 球局信息 -->
    <view v-show="competitionId"
          class="ml-32 mr-32">
      <view class="pl-28 fs-32 fs-400 h-86">球员</view>
      <RoomUser ref="roomUserRef"
                :room-type="roomType"></RoomUser>
    </view>
    <!-- / 球员 -->
    
    <view class="empty-box" />

    <!-- / fixed 底部操作 -->
    <view v-if="competitionId"
          class="fixed-bottom fixed-bg">
      
      <view class="flex ml-32 mr-32">
        <button class="button plain add fs-28 fw-500"
                @tap="handleAddGroup">
          添加分组
        </button>
        <button class="button sub fw-600 flex1"
                :loading="loading"
                @tap="submitCompetition">
          完成
        </button>    
      </view>
    </view>

    <button v-else
            class="button fs-28 fw-600 mt-120"
            :loading="loading"
            @tap="createCompetition">
      保存并选择球员
    </button>
  </view>
</template>

<script>
import GNavbar from '@/components/g-navbar/index.vue'
import RoomInfo from '@pages/chat-room/add-room/components/room-info/index.vue'
import RoomUser from '@pages/chat-room/add-room/components/room-user/index.vue'
import { createCompetition, batchAdd, updCompetition } from '@api/competition';
//vuex
import { mapGetters, mapActions } from 'vuex';
import { actionsTypes } from '@/store/modules/chat-room/types.js';
import { shareCompetitionInvite } from '@utils/share';

export default {
  components: {
    GNavbar,
    RoomInfo,
    RoomUser
  },
  provide() {
    return {
      getCompetitionId: () => this.competitionId,
      getCompetitionNo: () => this.competitionNo,
      getCompetitionInfo: () => this.$refs.roomInfoRef.formData,
    }
  },
  data() {
    return {
      loading: false,
      competitionId: '',
      competitionNo: '',
      roomType: 'new', // new新建 edit修改
      tempGroup: '',
    };
  },
  computed: {
    ...mapGetters(['getCompetitionData']),
    ...mapGetters({
      userInfo: 'user/userInfo',
    }),
    // 导航拦标题
    navBarTitle() {
      return `${this.roomType === 'new' ? '创建' : '编辑'}球局`;
    }
  },
  onLoad(options) {
    console.log('options', options);
    // 从球局详情过来
    if (options.from === 'scoreboard') {
      this.competitionId = options.id;
      this.competitionNo = options.no;
      this.roomType = options.type;
    }

    this.onGREvent('shareGroup', group => {
      this.tempGroup = group
    })
  },
  methods: {
    ...mapActions([
      actionsTypes.GET_COMPETITION_DETAIL,
      actionsTypes.GET_USERS_IM_ID,
    ]),

    // 分享当前球局页面
    onShareAppMessage(res) {
      return this.pageSharing(res)
    },
    onShareTimeline(res) {
      return this.pageSharing(res)
    },
    pageSharing(res) {
      const share = this.getTopPageInjectedShare();
      if (share) return share;

      return shareCompetitionInvite({
        id: this.competitionId,
        group: this.tempGroup,
        uid: this.userInfo.uid,
        shareRoomName: this.$refs.roomInfoRef?.formData?.competition_name,
        imageUrl: '',
      });
    },

    async createCompetition() {
      const formData = await this.$refs.roomInfoRef.validate();
      this.loading = true;

      createCompetition(formData)
        .then((res) => {
          this.competitionId = res.data.data.competition_id;
          this.competitionNo = res.data.data.competition_no;
        })
        .catch((err) => {
          if (err.data) {
            uni.showToast({ title: err.data.msg, icon: 'none' });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async submitCompetition() {
      this.loading = true;
      this.roomType == 'new' ? this.handleAdd() : this.handleEdit();
    },
    // 编辑球局
    async handleEdit() {
      try {
        let competitors = await this.$refs.roomUserRef.validate();
        console.log('competitors', competitors);
        let formData = await this.$refs.roomInfoRef.validate();
        console.log('formData', formData);

        let params = {
          competition_id: this.competitionId,
          ...formData,
          competitors
        };
        // return;
        await updCompetition(params);
        uni.showToast({
          title: '编辑成功',
          icon: 'success'
        });
        // 请求球局详情
        this.GET_COMPETITION_DETAIL({ competition_id: this.competitionId });
        // 获取群组中的参赛成员im id
        this.GET_USERS_IM_ID({ competition_id: this.competitionId });
        uni.navigateBack();
      } finally {
        this.loading = false;
      }
    },

    // 创建球局
    async handleAdd() {
      const competitors = await this.$refs.roomUserRef.validate();
      console.log('competitors', competitors);
      batchAdd({
        competition_id: this.competitionId,
        competitors
      })
        .then((res) => {
          uni.showToast({
            title: '创建成功',
            icon: 'success'
          });

          setTimeout(() => {
            uni.redirectTo({
              url: `/pages/chat-room/index/index?id=${this.competitionId}`
            });
          }, 300);
        })
        .catch((err) => {
          if (err.data) {
            uni.showToast({ title: err.data.msg, icon: 'none' });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleAddGroup() {
      this.$refs.roomUserRef.handleAddGroup();
      //滑动到页面最底部
      wx.createSelectorQuery().select('#page').boundingClientRect(function(rect){
        wx.pageScrollTo({
          scrollTop: rect.bottom
        })
      }).exec()
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  margin: 0 66rpx;
  height: 96rpx;
  line-height: 96rpx;
}

.pl-28 {
  padding-left: 28rpx;
}

.h-86 {
  height: 86rpx;
  line-height: 86rpx;
}

.mt-120 {
  margin-top: 120rpx;
}

.fixed-button {
  height: 96rpx;
  margin-top: 32rpx;
  @include safearea(30rpx);

  .button {
    position: fixed;
    width: calc(100% - 66rpx * 2);
    z-index: 2;
    @include safearea(30rpx, bottom);
  }
}
.button.add {
  width: 218rpx;
  border: 1rpx solid rgba(0, 60, 61, 0.4);
  margin-right: 20rpx!important;
}
.button.sub, .button.add {
  margin:0 0;
}
.fixed-bg {
  padding-top: 32rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 16.4%)!important;
  backdrop-filter: blur(10rpx)!important;
}
.empty-box {
  height: calc(96rpx + 32rpx + 44rpx + env(safe-area-inset-bottom));
}
</style>
