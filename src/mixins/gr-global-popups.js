const mixinObj = {
  methods: {
    /**
     * 尝试判断并打开授权弹框。
     * @returns 有没有打开弹框，也是能否进行下一步的判断。true 打开了弹框， false 没有打开，可以进行下一步
     */
    grTryShowAuthorization() {
      var isAuth = false;
      try {
        isAuth = this.$store.getters["user/isAuth"]
      } catch (e) {
        console.error(e);
      }

      if (isAuth === false) {
        const pages = getCurrentPages();
        const topPage = pages[pages.length - 1];
        topPage?.$vm.$refs?.grAuthPopup?.tryOpen();

        return true;
      }
      
      return false;
    }
  }
}


// 定义 Loading 对象
const installObj = {
  // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
  install: function(Vue, options) {
    Vue.mixin(mixinObj);
  }
}

// 导出
export default installObj