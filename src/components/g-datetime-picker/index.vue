<template>
  <UniPopup ref="popup" background-color="#fff" type="bottom" isMaskClick @change="onPopupChange">
    <Tabs v-model="current" :list="tabs">
      <template #action>
        <view class="confirm" @tap="onConfirm">确定</view>
      </template>
    </Tabs>

    <swiper class="swiper" :current="current" :duration="300" @change="onSwiperChange">
      <swiper-item>
        <PaneDate v-if="show" v-model="date" :disabledDate="disabledDate" @click="onClickDate" />
      </swiper-item>
      <swiper-item>
        <PaneTime v-model="time" />
      </swiper-item>
    </swiper>
  </UniPopup>
</template>

<script>
import UniPopup from '@/components/uni-popup/uni-popup.vue'
import Tabs from './Tabs.vue'
import PaneDate from './PaneDate.vue'
import PaneTime from './PaneTime.vue'
import { padZero } from './utils'

export default {
  name: 'g-datetime-picker',
  components: {
    UniPopup,
    Tabs,
    PaneDate,
    PaneTime,
  },
  props: {
    value: {
      type: [Number, String, Date],
    },
    disabledDate: {
      type: Function,
    },
  },
  data() {
    return {
      current: 0,
      date: [],
      time: [0, 0],
      show: false,
    }
  },
  computed: {
    tabs() {
      const [y, m, d] = this.date

      return [
        { key: 'date', name: `${y}年${padZero(m)}月${padZero(d)}日` },
        { key: 'time', name: this.time.map(padZero).join(':') },
      ]
    },
  },
  methods: {
    open() {
      const propValue = typeof this.value === 'string' ? this.value.replace(/\-/g, '/') : this.value

      const time = propValue ? new Date(propValue) : new Date()
      const year = time.getFullYear()
      const month = time.getMonth() + 1
      const day = time.getDate()
      const hour = time.getHours()
      let minute = time.getMinutes()
      if (!propValue) {
        minute = Math.floor(minute / 5) * 5
        if (minute >= 60) minute = 55
      }

      this.date = [year, month, day]
      this.time = [hour, minute]
      this.show = true
      this.$refs.popup.open()
    },
    close() {
      this.$refs.popup.close()
    },
    onConfirm() {
      // const [year, month, day] = this.date
      // const [hour, minute] = this.time

      // this.$emit('confirm', {
      //   year,
      //   month,
      //   day,
      //   hour,
      //   minute,
      // })

      this.$emit(
        'confirm',
        `${this.date.map(padZero).join('-')} ${this.time.map(padZero).join(':')}:00 `
      )
    },
    onSwiperChange({ detail: { current, source } }) {
      if (source === 'touch') {
        this.current = current
      }
    },
    onPopupChange({ show }) {
      if (show) {
        this.show = true
      } else {
        setTimeout(() => {
          this.current = 0
          this.show = false
        }, 300)
      }
    },
    onClickDate() {
      setTimeout(() => {
        this.current = 1
      }, 150)
    },
  },
}
</script>

<style lang="scss" scoped>
.confirm {
  font-size: 32rpx;
  line-height: 40rpx;
  font-weight: 500;
  color: $theme-color;

  &:active {
    opacity: 0.9;
  }
}

.swiper {
  height: 600rpx;
}
</style>
