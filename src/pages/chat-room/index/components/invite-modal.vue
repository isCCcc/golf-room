<!--
 * @Author: simon
 * @Description: 邀请弹窗
 * @LastEditors: simon
-->
<template>
  <uni-popup background-color="transparent"
             type="center"
             ref="popup"
             :mask-click="fasle">
    <view class="modal-wrapper pr">
      <image :src="`${ossUrl}/icons/icon-close.png`"
             class="icon-close"
             mode="widthFix"
             @click="close" />

      <!-- S 球局信息 -->
      <view class="modal-top">
        <view class="bg-invite col-white flex-center">
          <view>
            <view class="fs-32 line-1">INVITATION</view>
            <view class="fs-24 line-2">球局邀请</view>
          </view>
        </view>
        <!-- /背景 -->
        <view class="fs-40 invite-label col-black fw-bol">{{inviteInfo.share_user.username || ''}}邀请你加入球局</view>
        <!-- /邀请名 -->
        <view class="split-box">
          <view class="split"></view>
        </view>
        <!-- /分割线 -->

        <view class="info-box">
          <view class="time-box fs-22 flex-center">
            <image src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_date.png"
                   class="icon-date mr-10"
                   mode="widthFix" />
            {{startTime}}
          </view>
          <view class="name-box fs-24 flex-center">
            <image src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_location.png"
                   mode="widthFix"
                   class="icon-map mr-10" />
            {{inviteInfo.course_name}}
          </view>
        </view>
        <!-- /球赛信息 -->
      </view>
      <!-- E 球局信息 -->
      <view class="line-border"></view>

      <!-- S 球局选手 -->
      <view class="modal-bottom pr">
        <view class="col-999 fs-28 competitor-title tc">球局选手</view>
        <view class="flex competitor-list">
          <view class="flex-1 competitor-cell"
                :class="{'share-user': item.uid == inviteInfo.share_user.uid}"
                v-for="item in inviteInfo.competitor_list"
                :key="item.uid">
            <GAvatar class="g-avatar" :avatar-data="{ avatar_url: item.avatar_url}" :size-in-rpx='80' :radius="'100%'" handle-click="false"/>
            <view class="fs-28 user-name text-over">{{item.username || ''}}</view>
          </view>
          <view class="flex-1 competitor-cell"
                v-for="item in (4-inviteInfo.competitor_list.length)"
                :key="item">
            <view class="g-avatar empty-avatar"></view>
            <view class="col-999 fs-28">可加入</view>
          </view>
        </view>
        <view class="btn-box">
          <button class="button"
                  @click="confirm"
                  :loading="confirmLoading">确定加入</button>
        </view>
      </view>
      <!-- E 球局选手 -->

    </view>
  </uni-popup>
</template>

<script>
// api
import { batchAdd } from '@/api/competition/index';
import GAvatar from '@/components/g-avatar/g-avatar.vue';
export default {
  components: { GAvatar },
  data() {
    return {
      ossUrl: this.$ossUrl,
      inviteInfo: {}, // 邀请信息
      confirmLoading: false // 按钮loading
    };
  },

  computed: {
    // 开始时间
    startTime() {
      let startTimeArr = this.inviteInfo?.start_time?.split(' ');
      let dateArr = startTimeArr?.[0].split('-');
      let timeArr = startTimeArr?.[1].split(':');

      return dateArr && dateArr.length
        ? `${dateArr?.[1]}月${dateArr[2]}日 ${timeArr[0]}:${timeArr[1]}`
        : [];
    }
  },

  mounted() {},
  methods: {
    // 确认加入
    async confirm() {
      if (this.grTryShowAuthorization()) {
        return
      }
      try {
        this.confirmLoading = true;
        let {
          competition_id,
          user_info: { username, uid, avatar_url },
          group
        } = this.inviteInfo;
        this.inviteInfo.competitor_list.push({
          group,
          username,
          uid,
          avatar_url
        });
        let params = {
          competition_id,
          competitors: JSON.stringify([{ uid, group }])
        };
        await batchAdd(params);
        this.close();
        this.$emit('update')
      } finally {
        this.confirmLoading = false;
      }
    },
    // 打开
    open(data) {
      this.inviteInfo = data;
      this.$refs.popup.open();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-wrapper {
  width: 606rpx;
  
  // 关闭icon
  .icon-close {
    position: absolute;
    right: 0;
    top: 0;
    width: 76rpx;
  }
  // 上面
  .modal-top {
    padding: 26rpx 32rpx;
    text-align: center;
    background-color: $white;
    // 背景图片
    .bg-invite {
      width: 100%;
      height: 155rpx;
      background: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/bg-invite.png')
        no-repeat center;
      background-size: 100%;
      .line-1 {
        @include rubikVar();
      }
      .line-2 {
        letter-spacing: 17rpx;
      }
    }
    .invite-label {
      padding: 36rpx 0;
      font-weight: 500;
    }
    .split-box {
      .split {
        margin: 0 auto;
        width: 44rpx;
        height: 4rpx;
        background-color: #ddd;
      }
    }
    .info-box {
      padding: 40rpx 0 2rpx;
      color: #535353;
      .time-box {
        margin-bottom: 15rpx;
      }
      .icon-date {
        width: 23rpx;
      }
      .icon-map {
        width: 36rpx;
      }
    }
  }
  .line-border {
    position: relative;
    height: 47rpx;
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/line-img.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // background-color: $white;
    // &::before,
    // &::after {
    //   display: block;
    //   content: '';
    //   position: absolute;
    //   top: 50%;
    //   width: 30rpx;
    //   height: 30rpx;
    //   border-radius: 100%;
    //   z-index: 99;
    //   transform: translateY(-50%);
    //   background: #D9D9D9;
    // }
    // &::before {
    //   left: -15rpx;

    // }
    // &::after {
    //   right: -15rpx;
    // }
  }
  // 下面
  .modal-bottom {
    background-color: $white;
    .competitor-title {
      line-height: 77rpx;
    }
    .competitor-list {
      padding: 0 20rpx;
      .competitor-cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .g-avatar {
          margin-bottom: 6rpx;
        }
        .user-name {
          color: #535353;
        }
        .empty-avatar {
          width: $img-size-80;
          height: $img-size-80;
          box-sizing: border-box;
          border: 3rpx dashed #c4c4c4;
        }
      }
      .share-user {
        .g-avatar {
          border: 4rpx solid $col-1e3;
        }
        .user-name {
          color: $col-1e3;
        }
      }
    }
    .btn-box {
      padding: 70rpx 32rpx 38rpx;
      .button {
        height: 96rpx;
        line-height: 96rpx;
      }
    }
  }
}
</style>
