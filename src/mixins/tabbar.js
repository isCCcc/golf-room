/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      /**
       * Tab bar 高度
       */
      tabBarHeight: undefined,
    };
  },
  onShow() {
    this.updateTabBarHeight()
    
    this.GET_HAS_NEW()

    getApp().syncRedPoints();
  },

  methods: {
    ...mapActions({
      GET_HAS_NEW: 'GET_HAS_NEW',
    }),

    setTabBarIndex(index) {
      if (
        typeof this.$mp.page.getTabBar === "function" &&
        this.$mp.page.getTabBar()
      ) {
        this.$mp.page.getTabBar().setData({
          tabIndex: index,
        });
      }
    },

    
    async updateTabBarHeight() {
      const page = this;
      var rect;
      if (
        typeof page.$mp.page.getTabBar === "function" &&
        page.$mp.page.getTabBar()
      ) {
        try {
          rect = await page.$mp?.page?.getTabBar()?.queryRect()
        } catch (e) {
          console.error('updateTabBarHeight', e);
        }
      }
      
      if (rect !== undefined) {
        this.tabBarHeight = rect.height;
      } else {
        const sysInfo = uni.getSystemInfoSync()
        this.tabBarHeight = sysInfo.safeAreaInsets.bottom;
      }
            
      return this.tabBarHeight;
    },
  }
}