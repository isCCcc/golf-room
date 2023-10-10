<template>
  <picker-view
    class="pane"
    :value="pickerValue"
    :indicator-style="indicatorStyle"
    :immediate-change="true"
    @change="bindChange"
  >
    <picker-view-column>
      <view class="item" v-for="h in hours" :key="h">{{ h }}</view>
    </picker-view-column>
    <picker-view-column>
      <view class="item" v-for="m in minutes" :key="m">{{ m }}</view>
    </picker-view-column>
  </picker-view>
</template>

<script>
import { padZero } from './utils'

const hours = Array.from({ length: 24 }, (_, i) => padZero(i))
const minutes = Array.from({ length: 60 / 5 }, (_, i) => padZero(i * 5))

export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Array,
      default: () => [0, 0],
    },
  },
  data() {
    return {
      hours,
      minutes,
    }
  },
  computed: {
    indicatorStyle() {
      return `height: ${uni.upx2px(80)}px`
    },
    pickerValue: {
      get() {
        const [m, s] = this.value
        return [m, Math.ceil(s / 5)]
      },
      set(value) {
        const [m, s] = value
        this.$emit('input', [m, s * 5])
      },
    },
  },
  methods: {
    bindChange({ detail: { value } }) {
      this.pickerValue = value
    },
  },
}
</script>

<style lang="scss" scoped>
.pane {
  height: 100%;
}

.item {
  text-align: center;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
}
</style>
