<template>
  <view class="pane" :style="[{ '--box-height': rowHeight + 'px' }]">
    <view class="pane-head">
      <view v-for="week in weeks" :key="week" class="block">
        <text>{{ week }}</text>
      </view>
    </view>
    <scroll-view
      class="pane-body"
      scroll-y
      :upper-threshold="threshold"
      :scroll-into-view="intoView"
      @scroll="onScroll"
      @scrolltoupper="onScrolltoupper"
      @scrolltolower="onScrolltolower"
    >
      <view class="calendar">
        <view v-for="i in beforeBoxs" :key="i" class="block"></view>
        <view v-for="day in days" :key="day.key" :id="day.key" class="block">
          <text
            :class="[
              'date-item',
              {
                'date-item__reveal': centerDay && day.y === centerDay.y && day.m === centerDay.m,
                'date-item__first': day.d === 1,
                'date-item__disabled': disabledDate && disabledDate(day),
                'date-item__active': genKey(dateValue) === day.key,
              },
            ]"
            @tap="onClickDate(day)"
          >
            {{ day.text }}
          </text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { padZero } from './utils'

const weeks = ['日', '一', '二', '三', '四', '五', '六']
const months = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]

let flag = false
const THRESHOLD_ROWS = 5 * 8

export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Array,
    },
    disabledDate: {
      type: Function,
    },
  },
  data() {
    return {
      weeks,
      days: [],
      now: new Date(),
      intoView: '',
      centerDay: null,
      initialized: false,
    }
  },
  computed: {
    beforeBoxs() {
      const [first] = this.days
      if (!first) return 0
      const { y, m, d } = first
      return new Date(y, m - 1, d).getDay()
    },
    dateValue: {
      get() {
        if (this.value?.length) {
          const [y, m, d] = this.value
          return { y, m, d }
        }

        return {
          y: this.now.getFullYear(),
          m: this.now.getMonth() + 1,
          d: this.now.getDate(),
        }
      },
      set(day) {
        if (!this.disabledDate?.(day)) {
          this.$emit('input', [day.y, day.m, day.d])
        }
      },
    },
    genKey() {
      return ({ y, m, d }) => `d-${y}-${padZero(m)}-${padZero(d)}`
    },
    rowHeight() {
      return uni.upx2px(100)
    },
    threshold() {
      return this.rowHeight * THRESHOLD_ROWS
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { y, m } = this.dateValue
      const t = new Date(y, m).getTime()

      const nY = this.now.getFullYear()
      const nM = this.now.getMonth() + 1
      const nT = this.now.getTime()

      this.days = this.getDaysList(...(t > nT ? [nY, nM] : [y, m]))
      this.onScroll({ detail: { scrollTop: 0 } })
      this.$nextTick(() => (this.intoView = this.genKey({ y, m, d: 1 })))
    },
    /** 根据年月获取该月有多少天 */
    getDays(y, m) {
      const length = new Date(y, m, 0).getDate()
      return Array.from({ length }, (_, index) => {
        const d = index + 1
        const text = index === 0 ? months[m - 1] : `${d}`
        const key = this.genKey({ y, m, d })
        return { y, m, d, text, key }
      })
    },
    /** 根据开始年月，返回一年内的日期 */
    getDaysList(y, m) {
      let list = []

      const isJan = m === 1

      const endY = isJan ? y : y + 1
      const endM = isJan ? 12 : m - 1

      if (y === endY) {
        for (let i = m; i <= endM; i++) {
          list = list.concat(this.getDays(y, i))
        }
      } else {
        for (let i = m; i <= 12; i++) {
          list = list.concat(this.getDays(y, i))
        }

        for (let i = 1; i <= endM; i++) {
          list = list.concat(this.getDays(endY, i))
        }
      }

      return list
    },
    onClickDate(day) {
      this.dateValue = day
      this.$emit('click', day)
    },
    onScroll({ detail: { scrollTop } }) {
      const line = Math.floor(scrollTop / this.rowHeight)
      const index = line * 7 - this.beforeBoxs + 17
      const inCenterViewDay = this.days[index]
      this.centerDay = inCenterViewDay
    },
    onScrolltoupper() {
      // if (flag) return
      // flag = true
      // const viewDay = this.days.at(7 * THRESHOLD_ROWS - this.beforeBoxs)
      // const { y } = this.days.at(0)
      // const list = this.getDaysList(y - 1)
      // this.days.unshift(...list)
      // this.$nextTick(() => {
      //   this.intoView = this.genKey(viewDay)
      //   flag = false
      // })
    },
    onScrolltolower() {
      // const { y } = this.days.at(-1)
      // const list = this.getDaysList(y + 1)
      // this.days.push(...list)
    },
  },
}
</script>

<style lang="scss" scoped>
.pane {
  height: 100%;
  --box-height: 100rpx;
}

.pane-head {
  display: flex;
  align-items: center;
  color: $col-999;
  font-size: 24rpx;
}

.pane-body {
  height: calc(100% - var(--box-height));
}

.block {
  height: var(--box-height);
  width: percentage(calc(1 / 7));
  display: flex;
  align-items: center;
  justify-content: center;

  > text {
    line-height: calc(var(--box-height) * 0.8);
    text-align: center;
    width: 80rpx;
    height: 80%;
  }
}

.calendar {
  display: flex;
  flex-wrap: wrap;
}

.date-item {
  font-size: 28rpx;
  font-weight: 500;
  color: #ddd;
  border-radius: 4rpx;
  transition: color 0.1s ease-in-out;

  &__reveal {
    color: $theme-color;
  }

  &__first {
    color: $sub-color;
    font-weight: 600;
  }

  &__disabled {
    color: $col-e9;
  }

  &__active {
    color: #fff;
    background-color: $theme-color;
  }
}
</style>
