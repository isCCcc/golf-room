<template>
  <view
    class="root"
    :style="{
      '--target-height': (showEmojis ? height : 0) + 'rpx',
      visibility: showEmojis ? 'visible' : 'hidden',
    }"
  >
    <scroll-view scroll-y="true" class="emoji-scroll" >
      <view class="emoji-container">
        <view v-for="emoji in emojis" :key="emoji" class="emoji-item" @click="handleEmojiPicked(emoji)">
          <text class="emoji-text">{{ emoji }}</text>
        </view>
      </view>
    </scroll-view>
    <view class="bot-ctrl flex" :class="{'disabled': !ctrlBtnEnabled}">
      <button class="del btn flex-center" :disabled="!ctrlBtnEnabled" @click="handleDel">
        <view class="del-icon"></view>
      </button>
      <button class="send btn" :disabled="!ctrlBtnEnabled" @click="handleSend">发送</button>
    </view>
  </view>
</template>

<script>
export default {
  emits: ["delete", "send", "emojiPicked"],
  props: {
    showEmojis: {
      type: Boolean,
      default: false,
    },
    curLength: {
      type: [Number, undefined],
      default: undefined,
    },
    // 表情框高度，单位 rpx, 默认 346 * 2
    height: {
      type: [Number, undefined],
      default: 246 * 2,
    },
  },
  watch: {
    showEmojis(newVal, oldVale) { 
      if (newVal) { 
        console.log("showEmojis changed", document)
      }
    }
  },
  data() {
    return {
      scrollTop: 0,
      old: {
        scrollTop: 0,
      },
      emojis: [
        // Faces
        "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "💀", "👻", "👽", "🤖", "💩",
        // Gestures
        "🤲", "👐", "🙌", "👏", "🤝", "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐", "🖖", "👋", "🤙", "💪", "🖕", "✍️", "🙏",
        // Animals
        "🐦", "🦅",
        // Golf
        "🕳️", "⛳", "🏌️‍♀️", "🏌🏻‍♀️", "🏌🏼‍♀️", "🏌🏽‍♀️", "🏌🏾‍♀️", "🏌🏿‍♀️", "🏌️‍♂️", "🏌🏻‍♂️", "🏌🏼‍♂️", "🏌🏽‍♂️", "🏌🏾‍♂️", "🏌🏿‍♂️",
        // Medals
        "🏆", "🥇", "🥈", "🥉", "🏅", "🎖", "🏵", 
      ],
    };
  },
  computed: {
    ctrlBtnEnabled() { 
      return this.curLength && this.curLength > 0;
    },
  },
  methods: {
    handleEmojiPicked(emoji) { 
      this.$emit("emojiPicked", emoji)
    },
    handleDel() {
      this.$emit("delete");
    },
    handleSend() {
      this.$emit("send");
    },
  },
};
</script>

<style lang="scss" scoped>
$bgCol: white;
$ctrl-btn-height: 80rpx;


.root {
  background-color: $bgCol;
  height: var(--target-height);
  overflow: hidden;
}

.emoji-scroll {
  height: 100%;

  .emoji-container {
    display: flex;
    flex-direction: row;
    flex-flow: row wrap;
    justify-content: flex-start;
    padding: 16rpx;
    overflow: scroll;
    padding-bottom: calc(env(safe-area-inset-bottom) + $ctrl-btn-height + 16rpx);
    gap: calc((100% / 8) - 88rpx);;

    .emoji-item {
      width: 88rpx;
      height: 88rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .emoji-text {
        $item-size: 60rpx;

        width: $item-size;
        height: $item-size;
        font-size: $item-size;
        line-height: $item-size;
      }
    }
  }
}

.disabled {
  opacity: 0.5;
}
.bot-ctrl {
  $margin: 16rpx;
  position: absolute;
  right: $margin;
  bottom: calc($margin + env(safe-area-inset-bottom));
  gap: 16rpx;

  .btn {
    padding: 0;
    width: 110rpx;
    height: $ctrl-btn-height;
    border-radius: 8rpx;
    line-height: $ctrl-btn-height;

    &::after {
      border: none;
    } // 去除 button 自带的边框
  }

  .del {
    background-color: $bgCol;

    .del-icon {
      width: 54rpx;
      height: 35rpx;
      background: url(https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_emoji_del.svg);
      background-size: 100% 100%;
    }
  }
  .send {
    width: 110rpx;

    color: white;
    background-color: $theme-color;

    font-weight: 400;
    font-size: 32rpx;
  }
}
</style>
