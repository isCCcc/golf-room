<template>
  <view class="page">
    <Profile ref="profile"
              class="profile"
              :uid="uid"
              :custom-bottom-safe-height="tabBarHeight"/>
  </view>
</template>

<script>
import TabBar from '@mixins/tabbar'

import Profile from './components/Profile.vue'

export default {
  components: {
    Profile,
  },
  mixins: [TabBar],
  data() {
    return {
      /**
       * 当前页面的用户 ID
       */
      uid: undefined,
    }
  },
  computed: {
  },
  onLoad(options) {
    if (options.uid) {
      this.uid = parseInt(options.uid);
    }
  },
  mounted() {

  },
  onShow() {
    this.$nextTick(() => {
      this.$refs.profile.loadData();
    })
  },
  onReady() {
    this.$refs.profile.onHostPageReady();
  },

  methods: {
    onShareAppMessage(res) {
      return this.$refs.profile.shareAppMessage(res)
    },
    onShareTimeline(res) {
      return this.$refs.profile.shareTimeline(res)
    },
  },
}
</script>

<style lang="scss" scoped>
.profile {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
