<template>
  <view class="page root">
    <GNavbar class="nav" title="消息通知" @backHandled="backByNav"/>
    <view class="content-box">
      <!-- 分段 -->
      <view class="segment">
        <view v-for="(item, index) in items" 
              :key="item.type" 
              :class="['item', item.type === currentItem.type ? 'selected' : '', 'item-' + index]" 
              @click="switchItem(index)"
              >
              {{ item.title }}
        </view>
        <view class="indicator" 
              :style="{ transform: `translate(${indicatorTranslate}px)`, 'transition-duration': (indicatorTranslateDuration || 'inherit')  }">
        </view>
      </view>
      <!-- 列表 -->

      <!-- 列表 -->
      <swiper class="swiper" :current="current" :duration="300" @change="onSwiperChange">
        <swiper-item v-for="item in items" :key="item.type">
          <!-- 聊天消息 -->
          <ConversationList  v-if="item.type === 'conversation'"
                            :safeBottom="listSafeBottom"/>
          
          <!-- 系统消息 -->
          <scroll-view v-else-if="item.type === 'follow'"
                       class="scroll-view" scroll-y="true" @scrolltolower="scrollToLower" >
            <view v-for="msg in messages" :key="msg.message_id">
              <FollowUserCell v-if="msg.message_type === 'add_friend'" 
                              :user="mapToUser(msg)" 
                              :subtitle="msg.message_context"
                              :is-unread="!msg.is_read || false"
                              :show-extra="true"
                              @changeFollow="handleChangeFollow($event, msg)"
                              @delete="handleMessageDel(msg)"/>
            </view>

            <view v-if="messages.length < 1" class="empty">
              <view class="ph-image"></view>
              <view class="ph-title">暂无新消息</view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
import GNavbar from '@/components/g-navbar/index.vue'
import { mapActions, mapGetters } from 'vuex'
import FollowUserCell from '../components/FollowUserCell.vue'
import { actionsTypes } from '@/store/modules/message/types.js';

import { getMessageList, deleteMessage } from '@api/message/index'
import { unfollowUser, followUser } from '@/api/user'
import ConversationList from '../im/Components/ConversationList.vue';

export default {
  components: { GNavbar, FollowUserCell, ConversationList },
  data() {
    return {
      items: [
        {
          type: 'conversation',
          title: '互动消息',
          // fetchFunc: getFollowingList,
          // list: [],
          // emptyTitle: '暂无新消息',
          // noMore: false,
        },
        {
          type: 'follow',
          title: '新增关注',
          // fetchFunc: getFansList,
          // list: [],
          // emptyTitle: '暂无新消息',
          // noMore: false,
        },
      ],
      current: 0,
      indicatorTranslate: 0,
      indicatorTranslateDuration: '',
      listSafeBottom: 0,
      
      messages: [],
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
      userInfoInStore: 'user/userInfo',
    }),
    currentItem() {
      return this.items[this.current]
    }
  },

  mounted() {
    const res = uni.getSystemInfoSync();
    this.listSafeBottom = res.safeAreaInsets.bottom;
    this.moveIndicatorFor(this.current, false);

    this.loadMessages();
  },

  methods: {
    ...mapActions({
      MARK_ALL_READ: actionsTypes.MARK_ALL_READ,
    }),

    switchItem(index) {
      this.current = index;
      this.moveIndicatorFor(index)

      // TODO: load data ??
      // const item = this.items[index]
      // if (item.list.length < 1 && item.noMore == false) {
      //   this.loadData();
      // }
    },

    moveIndicatorFor(index, animate = true) {
      /**
       * 通过查询 DOM 来获取位置。
       */
      const scope = this;
      uni
        .createSelectorQuery()
        .in(scope)
        .select(`.item-${index}`)
        .boundingClientRect((itemRect) => {
          if (itemRect == undefined) return;
          uni
            .createSelectorQuery()
            .in(scope)
            .select(".indicator")
            .boundingClientRect(indicatorRect => {
              if (indicatorRect == undefined) return;

              const outOffset = (itemRect.width - indicatorRect.width) / 2.0;

              scope.indicatorTranslate = itemRect.left + outOffset;
              if (animate) scope.indicatorTranslateDuration = '0.15s'
            })
            .exec()
        })
        .exec()
    },

    onSwiperChange(e) {
      if (e.detail.source === 'touch') {
        this.switchItem(e.detail.current)
      }
    },
    
    loadMessages() {
      getMessageList().then(({ data: { data } }) => {
        this.messages = data.list

        // 请求成功，就标记全部已读，防止返回时标记已读请求，慢过读取未读的请求。注意⚠️：这种仅限于当前全部消息一起返回，没有分页的情况
        this.MARK_ALL_READ();
      })
    },

    mapToUser(msg) {
      const data = msg.message_data;
      return {
        uid: data?.add_uid,
        username: data?.username,
        avatar_url: data?.avatar_url,
        is_follow: data?.is_follow,
        is_fans: data?.is_fans,
        gender: data?.gender,
      }
    },

    backByNav() {
      //
    },

    scrollToLower() {
      // TODO: load more
    },


    handleChangeFollow(user, msg) {
      function switchFollowState(msg, messages) {
        for (let index = messages.length - 1; index >= 0; index--) {
          const message = messages[index];
          if (message.message_data) {
            const messageData = message.message_data;
            if (message.message_id == msg.message_id) {
              messageData.is_follow = !user.is_follow;
            } else if (messageData.add_uid && messageData.add_uid === user.uid) {
              messageData.is_follow = !user.is_follow;
            }
          }
        }
      }

      const gl = false;
      const apiPromise = user.is_follow ? unfollowUser : followUser;
      apiPromise({ friend_uid: user.uid}, gl).then(({ data: { data } }) => {
        switchFollowState(msg, this.messages);
      });
    },

    handleMessageDel(msg) {
      deleteMessage({ message_id: msg.message_id }).then(({ data: { data } }) => {
        const messages = this.messages;
        for (let index = messages.length - 1; index >= 0; index--) {
          const message = messages[index];
          if (message.message_id == msg.message_id) {
            messages.splice(index, 1);
          }
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;

  .nav {
    z-index: 999;
  }
  
  .content-box {
    flex: 1;
    box-sizing: border-box;
    position: relative;
    height: 100%;

    .segment {
      height: 96rpx;
      background: #FFF;
      z-index: 1; // 为了凸显 shadow

      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04);
      
      display: flex;
      justify-content: space-evenly;
      align-items: stretch;
      position: relative;
      
      .item {
        font-weight: 600;
        font-size: 30rpx;
        line-height: 42rpx;
        color: #999999;

        display: flex;
        align-items: center;
        text-align: center;
        
        &.selected {
          color: #1E3E42;
        }
      }
      .indicator {
        width: 60rpx;
        height: 4rpx;
        position: absolute;
        left: 0;
        bottom: 0;
        background: #1E3E42;
      }
    }

    .swiper {
      height: 100%;
      background-color: #FFF;
    }

    .scroll-view {
      position: relative;
      width: 100%;
      height: 100%;
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
  }
}
</style>
