<!-- Copy from the floo im conversation -->
<template>
  <view class="w-auto h-auto">
    <scroll-view class="container w-auto h-auto" scroll-y="true">
      <view v-for="(conversation, index) in conversationList" 
            :key="index"
            :data-type="conversation.type" 
            :data-sid="conversation.sid" 
            @tap="touchConversation"
            @longpress="handleLongPress(conversation)"
            class="item">

        <!-- <view v-if="conversation.sid == 0">
          <image :src="system_avatar.avatar" class="avatar"></image>
          <view class="name">
            <text>{{ system_avatar.name }}</text>
          </view>
        </view> -->
        <GAvatar :avatar-data="{ avatar_url: conversation.avatar}" :size-in-rpx='100' :radius="'100%'" handle-click="false"/>
        <view class="left">
          <view class="first-line">
            <text class="name">{{ conversation.name }}</text>
            <image v-if="conversation.public_info && conversation.public_info.gender > 0" 
                    class="gender"
                    :src="`${ossUrl}/icons/${conversation.public_info.gender == 1 ? 'icon-male' : 'icon-female'}.png`" 
                    mode="widthFix" />
            <view class="time">{{ conversationTime(conversation) }}</view>
          </view>
          <view class="second-line">
            <view class="last_msg">
              <text>{{ conversation.content }}</text>
            </view>
            <view v-if="conversation.unread != 0" class="unread_number">
              <text>{{ conversation.unread }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="conversationList.length < 1" class="empty">
        <view class="ph-image"></view>
        <view class="ph-title">暂无新消息</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { gettime } from '@/utils';
import { toUserConversation } from '@/utils/router';
import GAvatar from '@/components/g-avatar/g-avatar.vue';
import { mapState } from 'vuex';

export default {
  components: { GAvatar },
  props: {
    safeBottom: {
      type: [Number, undefined],
      default: undefined
    }
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
      navHeight: 0,
      system_avatar: {
        name: '系统通知',
        avatar: null
      }
    };
  },
  computed: {
    ...mapState({
      imInfo: (state) => state.flooim.imInfo,
      conversationList: (state) => state.flooim.conversationList
    })
  },
  methods: {
    touchConversation(e) {
      var id = e.currentTarget.dataset.sid;
      const type = e.currentTarget.dataset.type;

      if (type === 'roster') {
        toUserConversation({ imUid: id })
      } else {
        // TODO: to group
        console.error("TODO: to group conversation");
        // wx.navigateTo({
        //   url: '../group/index?gid=' + id
        // });
      }
    },
    handleLongPress(conversation) {
      const scope = this;
      const options = [
        {
          title: '删除',
          exec: () => {
            const also_delete_other_devices = true;
            scope.imInfo.sysManage.deleteConversation(conversation.sid, also_delete_other_devices);
          }
        },
      ]
      uni.showActionSheet({
        title: '选择操作',
        itemList: options.map((option) => { return option.title }),
        success: (res) => {
          options[res.tapIndex].exec()
        }
      })
    },

    conversationTime(conversation) {
      return gettime(conversation.timestamp);
    }
  }
};
</script>
<style lang="scss" scoped>
// .container {
  
//   padding: 20rpx 32rpx;
//   display: flex;
// }
.item {
  position: relative;
  padding: 20rpx 32rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  
  // .avatar {
    
  // }

  .left {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;

    .first-line {
      flex: 1;

      display: flex;
      align-items: center;
      gap: 4rpx;

      .name {
        @include ell(1);

        font-weight: 400;
        font-size: 28rpx;
        line-height: 40rpx;
        color: #000000;
      }

      .gender {
        width: 24rpx;
        height: 24rpx;
      }
      
      .time {
        margin-left: auto;

        font-style: normal;
        font-weight: 400;
        font-size: 20rpx;
        line-height: 40rpx;
        color: #999999;
      }
    }

    .second-line {
      flex: 1;

      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10rpx;

      .last_msg {
        @include ell(1);
        font-weight: 400;
        font-size: 24rpx;
        line-height: 40rpx;
        color: #999999;
      }
      .unread_number {
        margin-left: auto;
        padding: 0rpx 8rpx;
        border-radius: 47rpx;
        
        background: #FEC44D;

        font-weight: 600;
        font-size: 20rpx;
        line-height: 30rpx;
        text-align: center;
        display: flex;
        align-items: center;

        color: #000000;
      }
    } 
  }
}
.empty {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;


    .ph-image {
      margin-top: 56%;

      width: 434rpx;
      height: 190rpx;
      background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/svg/img_emtp_ph.svg');
      background-size: 100%;
      background-repeat: no-repeat;
    }

    .ph-title {
      margin-top: 26rpx;
      font-weight: 400;
      font-size: 32rpx;
      line-height: 45rpx;
      color: #999999;
    }
  }
</style>
