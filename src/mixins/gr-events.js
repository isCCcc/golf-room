/**
 * 主要是为了替换 `uni.$on`, 在 destroyed 中自动移除相关事件监听
 */
export default {
  data() {
    return {
      grEventMaps: [],
    };
  },
  destroyed() {
    this.offGREvents()
  },

  methods: {
    onGREvent(eventName, handler) {
      uni.$on(eventName, handler)
      this.grEventMaps.push({
        eventName: eventName,
        handler: handler,
      })
    },
    offGREvents() {
      for (const eventMap of this.grEventMaps) {
        uni.$off(eventMap.eventName, eventMap.handler)
      }
    },
  }
}