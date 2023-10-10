<template>
  <view class="tabs">
    <view class="tabs-wrap">
      <view
        v-for="(tab, index) in list"
        :key="tab.key"
        :class="['tabs-item', { 'tabs-item__active': index === currentValue }]"
        @tap="changeTab(index)"
      >
        {{ tab.name }}
      </view>
    </view>

    <slot name="action"></slot>
  </view>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    currentValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    changeTab(index) {
      this.currentValue = index
    },
  },
}
</script>

<style lang="scss" scoped>
.tabs {
  --tabs-height: 112rpx;

  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--tabs-height);
  box-sizing: border-box;
  padding: 0 38rpx;
}

.tabs-wrap {
  display: flex;
  align-items: center;
}

.tabs-item {
  $selector: &;

  position: relative;
  font-size: 30rpx;
  line-height: var(--tabs-height);
  font-weight: 500;
  color: #000;

  + #{&} {
    margin-left: 60rpx;
  }

  &::after {
    content: '';
    width: 0;
    height: 4rpx;
    border-radius: 2rpx;
    background-color: $theme-color;
    position: absolute;
    left: 50%;
    bottom: 0;
    opacity: 0;
    transition: 0.3s ease-in-out;
    transform: translateX(-50%);
  }

  &#{&}__active::after {
    width: 100%;
    opacity: 1;
  }
}
</style>
