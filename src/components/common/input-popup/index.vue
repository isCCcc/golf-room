<template>
  <UniPopup ref="popup" background-color="#fff" type="bottom" :isMaskClick="false">
    <view class="popup-head flex-between plr-32">
      <text class="fw-500 col-999 fs-32" @tap="close">取消</text>
      <text class="fw-500 fs-32">{{ label }}</text>
      <text class="col-1e3 fs-32 fw-500" @tap="confirm">确定</text>
    </view>

    <view class="popop-body">
      <textarea v-if="type == 'textarea'" 
        class="popop-textarea fs-32"
        v-model.trim="inputValue"
        :focus="focus"
        :placeholder="placeholder"
        :adjust-position="false"
        @blur="onInputBlur"
        :maxlength="maxlength"
      />
      <input v-else
        class="popop-input fs-32"
        v-model.trim="inputValue"
        :focus="focus"
        :placeholder="placeholder"
        :adjust-position="false"
        @blur="onInputBlur"
        :maxlength="maxlength"
      />

      <view :style="[{ height: `${keyboardHeight}px`, transition: '0.3s ease-in-out' }]"></view>
    </view>
  </UniPopup>
</template>

<script>
import UniPopup from '@components/uni-popup/uni-popup.vue'
import { mapState } from 'vuex'

export default {
  components: {
    UniPopup,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'input',
    },
    maxlength: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      inputValue: '',
      focus: false,
    }
  },
  computed: {
    ...mapState({
      keyboardHeight: (state) => state.app.keyboardHeight,
    }),
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    open() {
      this.inputValue = this.value
      this.$refs.popup.open()
      setTimeout(() => {
        this.focus = true
      }, 300)
    },
    close() {
      this.$refs.popup.close()
    },
    confirm() {
      this.$emit('confirm', this.inputValue)
    },
    onInputBlur() {
      this.focus = false
    },
  },
}
</script>

<style lang="scss" scoped>
.popup-head {
  height: 112rpx;
}

.popop-body {
  padding: 48rpx 32rpx;
}

.popop-input {
  height: 80rpx;
  width: 100%;
  background-color: $br-col-ed;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.popop-textarea {
  min-height: 200rpx;
  width: 100%;
  background-color: $br-col-ed;
  padding: 32rpx 28rpx;
  box-sizing: border-box;
}
</style>
