<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <!-- S 输入框 -->
  <view class="">
    <view v-if="showClickMask" class="input-click-mask" @touchstart="handleTouch"></view>
    <view class="input-content" id="inputContent">
      <view id='send-wrapper' class="send-wrapper flex-between" :style="{ '--bottom-height': keyboardHeight > 0 ? `${keyboardHeight}px` : ( notEmptyBottom ? 'unset' : 'env(safe-area-inset-bottom)') }">
        <view class="flex1 flex input-wrapper">
          <input class="flex1 h-auto"
                  v-model="inputText"
                  placeholder-class="col-999"
                  :placeholder="placeholder"
                  @confirm="handleConfirm"
                  :focus="focus"
                  :cursor-spacing="40"
                  :always-embed="false"
                  :adjust-position="false"
                  confirm-type="send"
                  @focus='textInputFocus'
                  @blur='textInputBlur'
                  confirm-hold
                  :disabled="isAuth != true"
                  readonly="readonly"
                  @click="isAuth ? '' : handleCoverClick($event) " />
          <view class="emoji-wrapper flex-center h-auto" @click.stop="handleEmojiClick">
            <image :src="emojiSwitchIcon"
                    class="icon-face"
                    mode="widthFix" />
          </view>
        </view>
        <view v-if="showTools" class="tool-wrapper flex">
          <image v-if="giftEnabled" class="tool-add"
                  :src="`${ossUrl}/icons/ico_add.png`"
                  mode="widthFix"
                  @click="handleGiftAdd" />
        </view>
      </view>
      <EmojiPicker :showEmojis="showEmojis"
                    :curLength="inputText.length"
                    @delete="handleEmojiDel" 
                    @send="handleEmojiSend" 
                    @emojiPicked="handleEmojiPicked" />

      <GiftPicker v-if="giftEnabled"
                  :showGifts="showGifts"/>

      <cover-view v-if="isAuth != true" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1;" @click.stop="handleCoverClick" />
    </view>
  </view>
  <!-- E 输入框 -->
</template>

<script>
// vuex
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import EmojiPicker from './emoji-picker.vue';
import GiftPicker from './gift-picker.vue';
import { stringToArray } from '@/utils/third/string-array';

export default {
  emits: ['inputFocusing', 'inputHeightChange'],
  components: {
    EmojiPicker,
    GiftPicker,
  },
  props: {
    /**
     * 是否使用 mask 层，判断点击组件以外的地方，用于收起键盘，表情选择框等。
     * 如果不使用这种方式，请在页面中添加 touch start 事件监听，并 emit "page-touch-start"
     */
    maskForClick: {
      type: [Boolean, String],
      default: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    giftEnabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否在输入确定后，取消焦点
     */
    blurAfterConfirm: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
      inputText: '',
      focus: false,
      showEmojis: false,
      showGifts: false,
      currentHeight: 0,
    };
  },
  computed: {
    ...mapState({
      keyboardHeight: (state) => state.app.keyboardHeight,
    }),
    ...mapGetters({
      isLogin: 'user/isLogin',
      isAuth: 'user/isAuth',
    }),
    showTools() {
      return this.giftEnabled
    },
    showClickMask() {
      return (this.maskForClick === true || this.maskForClick === 'true') && this.inputFocusing
    },
    emojiSwitchIcon() { 
      return this.showEmojis ? `${this.ossUrl}/icons/svgs/ico_emoji_kb.svg` : `${this.ossUrl}/icons/ico_face.png`;
    },

    inputFocusing() {
      return this.focus || this.showEmojis || this.showGifts
    },

    notEmptyBottom() {
      return this.showEmojis || this.showGifts;
    },
  },
  watch: {
    currentHeight() {
      this.emitHeightChange();
    },
    inputFocusing() {
      this.emitFocusingState()
    },
    keyboardHeight(nVal) {
      this.keyboardHeightChange(nVal);
    }
  },
  mounted() {
    this.onGREvent("page-touch-start", (e) => {
      this.handleTouch(e)
    })
    this.tryUpdateHeight();
  },
  methods: {
    ...mapMutations([
    ]),
    ...mapActions({
    }),
    keyboardHeightChange(height) {
      console.log('keyboardHeightChange', height);
      if (height > 0) { 
        // keyboard 出现，收起 emoji。由于 input 的 foucs 有延迟（未知原因），这里提前收起 emoji
        this.showEmojis = false;
        this.showGifts = false;
      }
    },

    tryUpdateHeight() {
      console.log("tryUpdateHeight calling", this.focus, this.showEmojis, this.showGifts);
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .in(this)
          .select("#inputContent")
          .boundingClientRect((rect) => {
            console.log('tryUpdateHeight', rect);
            if (rect?.height == null) {
              return;
            }
            this.currentHeight = rect.height;
          })
          .exec()
      })
    },

    emitFocusingState() {
      uni.$emit('inputFocusing', this.inputFocusing);
      this.$emit('inputFocusing', this.inputFocusing);
    },

    emitHeightChange() {
      uni.$emit('inputHeightChange', this.currentHeight, this.inputFocusing);
      this.$emit('inputHeightChange', this.currentHeight, this.inputFocusing);
    },

    handleTouch(e) {
      const touch = e.changedTouches[0];
      if (touch) {
        uni
          .createSelectorQuery()
          .in(this)
          .select("#inputContent")
          .boundingClientRect((rect) => {
            if (rect == null) {
              return;
            }
            if (touch.clientY < rect.top || touch.clientY > rect.bottom
              || touch.clientX < rect.left || touch.clientX > rect.right) {
              this.showEmojis = false; // 手动关闭 emoji
              this.showGifts = false; // 手动关闭 礼物

              this.currentHeight = rect.height;
            }
          })
          .exec()
      }
    },

    // 输入获取光标
    textInputFocus() {
      if (this.grTryShowAuthorization()) {
        this.focus = true;
        this.$nextTick(() => {
          this.focus = false;
        })
      }
      
      this.focus = true;
      this.showEmojis = false;
      this.showGifts = false;
      this.tryUpdateHeight();
    },
    // 文本输入失去光标
    textInputBlur() {
      if (this.showEmojis == false && this.showGifts == false) {
        this.focus = false;
        this.tryUpdateHeight();
      }
    },
    // 发送
    handleConfirm() {
      if (!this.inputText) return false;
      const finalInputText = this.inputText;
      this.$emit('inputConfirm', finalInputText);

      this.inputText = '';

      if (this.blurAfterConfirm) {
        // 发送后收起键盘
        this.focus = false;
        this.showEmojis = false;
        this.showGifts = false;
      }
    },
    handleEmojiClick() {
      this.showEmojis = !this.showEmojis;
      if (this.showGifts) {
        this.showGifts = false;
      }
      if (this.showEmojis) {
        // 如果展示 emoji， 就需要取消 focus 状态，同时设置键盘高度为 0 （键盘高度变化有延迟，会出现高度叠加，撑高输入框）
        this.focus = !this.showEmojis
        // this.SET_KEY_HEIGHT(0); // FIXME: 转成 App 全局监听键盘高度后，看看这个是否会有问题
      } else { 
        // 切换成键盘输入
        this.focus = true;
      }
      this.tryUpdateHeight();
    },
    handleEmojiDel() { 
      this.inputText = stringToArray(this.inputText).slice(0, -1).join('');
    },
    handleEmojiSend() { 
      if (!this.inputText) return false;
      this.handleConfirm();
    },
    handleEmojiPicked(emoji) { 
      this.inputText += emoji;
    },

    handleGiftAdd() {
      this.showGifts = !this.showGifts;
      this.showEmojis = false;
      this.focus = false;
      // this.SET_KEY_HEIGHT(0);
      this.tryUpdateHeight();
    },

    handleCoverClick() {
      this.grTryShowAuthorization();
    }
  }
};
</script>

<style lang="scss" scoped>
@import './chat-input.scss';

.input-root {
  position: relative;
}
.input-content {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
  transition: all 0.2s;
}
.input-click-mask {
  position: fixed;
  width: 100vh;
  height: 100vh;
  top: 0;
  left: 0;
  // background-color: rgba(255, 0, 0, 0.262);
}

.input-container {
  z-index: 9;
  transition: all .2s;
}
</style>
