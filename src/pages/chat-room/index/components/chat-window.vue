<!--
 * @Author: simon
 * @Description: 聊天窗
 * @LastEditors: simon
-->
<template>
  <view class="d-flex flex-column flex-1" style="background: #fff; overflow: hidden">
    <!-- <view> -->
    <ChatMessage class="messages" ref="messages" />
    <!-- /聊天内容 -->
    <ChatInput id="send-wrapper" 
                maskForClick="false"
                placeholder="给选手打打气～"
                giftEnabled="true"
                @inputHeightChange="handleInputHeightChange"
                @inputConfirm="handleInputConfirm" />
    <!-- /输入弹窗 -->
  </view>
</template>

<script>
// 组件
import ChatMessage from '@/pages/chat-room/index/components/chat-message';
import ChatInput from '@/components/chat-input/chat-input.vue';

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { mutationsTypes } from '@/store/modules/chat-room/types.js';
import { guid } from '@/utils';

export default {
  components: { ChatMessage, ChatInput },
  data() {
    return { };
  },
  watch: { },
  computed: {
    ...mapState({
      imInfo: (state) => state.flooim.imInfo,
      userInfo: (state) => state.user.userInfo,
    }),
    ...mapGetters(['getGroupId']),
  },

  mounted() {
    
  },

  methods: {
    ...mapActions({
      SEND_GROUP_MESSAGE: 'flooim/SEND_GROUP_MESSAGE',
    }),
    ...mapMutations([
      mutationsTypes.SET_SEND_WRAPPER_HEIGHT,
    ]),
    handleInputHeightChange(inputHeight, focusing) { 

      if (focusing) {
        this.$refs.messages.scrollToShowBottom({ delivery: 300 }); // 300ms 延时，防止 scroll view 正在 scrolling
      }

      this.SET_SEND_WRAPPER_HEIGHT(inputHeight);
    },
    handleInputConfirm(inputText) {
      let msg = {
        gid: this.getGroupId,
        content: inputText,
        type: 'text',
        priority: 0,
        ext: JSON.stringify({
          avatar_url: this.userInfo.avatar_url,
          username: this.userInfo.username,
          g_msg_guid: guid() // 消息的 GUID， 用于跟踪消息发送情况，入已经发送的消息，
        })
      };
      this.SEND_GROUP_MESSAGE(msg);
    },
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/chat-window.scss';

.messages {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
