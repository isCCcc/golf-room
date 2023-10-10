<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: Please set LastEditors
-->
<template>
  <view class="page">
    <Profile ref="profile"
              class="profile"
              :uid="userInfo.uid"
              :custom-bottom-safe-height="tabBarHeight"/>
  </view>
</template>

<script>
import TabBar from '@mixins/tabbar'

import Profile from './components/Profile.vue'

import { mapGetters } from 'vuex';

export default {
  components: {
    Profile,
  },
  mixins: [TabBar],
  data() {
    return { }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo',
    }),
  },
  onShow() {
    this.setTabBarIndex(1)
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
