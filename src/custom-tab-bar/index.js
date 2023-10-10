/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */
Component({
  data: {
    tabIndex: 0,
    isMask: false,
    tabMBottom: 100,
    tabBarRedPoints: {
      home: 0,
      mine: 0,
    },
    rect: {},
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      const sysInfo = wx.getSystemInfoSync();
      const safeBottom = sysInfo.safeArea.bottom - sysInfo.safeArea.height;
      this.setData({
        tabMBottom: safeBottom > 0 ? safeBottom + 'rpx' : '24rpx',
      })
    },
    ready: function () {
      
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  
  methods: {
    switch({ currentTarget }) {
      var isAuth = false;
      try {
        isAuth = getApp().$vm.$store.getters["user/isAuth"]
      } catch (e) {
        console.error(e);
      }
      
      if(this.data.isMask) return
      const {type, url} = currentTarget.dataset
      
      if (type === 'game') {
        if (isAuth) {
          wx.navigateTo({url})
        } else {
          const vm = getApp().$vm
          if (vm.grTryShowAuthorization && typeof vm.grTryShowAuthorization === "function") {
            vm.grTryShowAuthorization();
          }
        }
        return;
      }
      
      wx.switchTab({url});
    },

    /**
     * 尝试获取 Tab Bar Rect
     * @returns 
     */
    async queryRect() {
      const scope = this;
      return new Promise((resolve, reject) => {
        scope.createSelectorQuery()
          .select("#tab-bar")
          .boundingClientRect((rect) => {
            scope.setData({
              rect: rect,
            });
            resolve(rect);
          })
          .exec();
      });
    },

    setTabBarRedPoint(tabType, count) {
      const redPoints = this.data.tabBarRedPoints;
      redPoints[tabType] = count
      this.setData({
        tabBarRedPoints: redPoints,
      })
    },
  }
})