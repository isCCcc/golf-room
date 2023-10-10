export default {
  data() {
    return {
      sharablePages: ["/pages/tabbar/home/index"],
      share: {
        // 转发的标题 （默认标题）
        title: "邀你一起来 Golfroom 打高尔夫，点击链接参加吧！",
        // 默认是当前页面，必须是以‘/’开头的完整路径
        path: "/pages/tabbar/home/index",
        //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，
        //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
        imageUrl:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/img_vx_share_01.png",
      },
    };
  },

  /*
    在要分享的页面 生命周期中  设置当前页面分享标题
    onLoad() {
        this.share.title = "当前页面分享标题"
    },
  */
  
  onLoad(options) {
    this.wxAdjustCurPageShare();
    
    // uni.hideShareMenu({
    //   hideShareItems: ['shareTimeline'],
    //   complete: (e) => {
    //     console.log('uni.hideShareMenu complete', e);
    //   },
    //   fail: (e) => {
    //     console.log('uni.hideShareMenu', e);
    //   }
    // })
    wx.hideShareMenu({
      menus: ['shareTimeline']
    })
  },
  
  methods: {
    wxCanShare(path) {
      return this.sharablePages.includes(path);
    },

    wxAdjustCurPageShare(res) {
      // 来自页面内的按钮的转发 ???
      if (res?.from == "button") {
        console.log("按钮转发--配置");
      }
  
      // 获取加载的页面
      let pages = getCurrentPages();
      // 获取当前页面的对象
      let view = pages[pages.length - 1];
      // 获取路径
      let path = `/${view.route}`;

      if (this.wxCanShare(path)) {
        this.share.path = path;
      }
    },

    /**
     * 设置分享参数。注意⚠️：主要给 page 上的 component 使用，覆盖 page 的分享设置。
     * @param {*} param0 
     * @returns 
     */
    setTopPageInjectedShare({ id, share }) {
      let pages = getCurrentPages();
      // 获取当前页面的对象
      let view = pages[pages.length - 1];
      const oldInjectedShare = view.$vm.injectedShare;

      if (oldInjectedShare == undefined || oldInjectedShare.id == id) {
        view.$vm.injectedShare = { id, share };
        return true;
      }

      return false;
    },
    getTopPageInjectedShare() {
      let pages = getCurrentPages();
      // 获取当前页面的对象
      let view = pages[pages.length - 1];
      const oldInjectedShare = view.$vm.injectedShare;
      if (oldInjectedShare && oldInjectedShare.id && oldInjectedShare.share) {
        return oldInjectedShare.share;
      }
      return undefined
    },
    removeTopPageInjectedShare(id) {
      let pages = getCurrentPages();
      // 获取当前页面的对象
      let view = pages[pages.length - 1];
      if (view.$vm.injectedShare?.id === id) {
        view.$vm.injectedShare = {}
      }
    },
  },
  
  

  /**
   * 发送给聊天
   * @param {*} res 
   * @returns 
   */
  onShareAppMessage(res) {
    //转发参数
    return this.share;
  },

  /**
   * 分享到朋友圈
   * @param {*} res 
   * @returns 
   */
  onShareTimeline(res) {
    //转发参数
    this.share.query = {}
    return this.share;
  },
};
