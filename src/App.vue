<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<script>
// import {mapActions} from 'vuex';
// import {actionsTypes} from '@/store/modules/chat-room/index'
import { getNetwork, offNetworkListener } from '@utils/network/index';
import { realtimeLogger } from '@mixins/gr-mp-logging.js'

import {mapGetters, mapMutations, mapState} from 'vuex';
import { mutationsTypes } from './store/modules/app/types';
const TAB_BAR_TYPE = {
  HOME: 'home',
  MINE: 'mine'
}
export default {
  onLaunch: function (options) {
    console.log("App Launch");
    
    getNetwork();

    this.tryLogin({loadUserInfo: true});

    this.setupFont();

    this.doIfLogin();
    
    this.updateHandling();

    this.$isResolve()

    uni.onKeyboardHeightChange(this.onKeyboardHeightChangeInApp);
  },
  onShow: function (options) {
    this.$store.commit(mutationsTypes.SET_APP_HIDED, false)
    if (this.$store.getters["user/isImAcount"]) {
      this.$store.dispatch("flooim/ENSURE_IM_LOGIN");
    }

    this.checkStorage();
  },
  onHide: function () {
    this.$store.commit(mutationsTypes.SET_APP_HIDED, true)
    console.log("App Hide");
  },
  onUnload() {
    console.log("App onUnload");
    offNetworkListener()
    uni.offKeyboardHeightChange(this.onKeyboardHeightChangeInApp);
    if (this.$store.getters["user/isImAcount"]) {
      this.$store.dispatch("flooim/REMOVE_IM_LISTENERS");
    }
  },
  computed: {
    ...mapState({
        keyboardHeight: (state) => state.app.keyboardHeight,
    }),
    ...mapGetters({
      isLogin: 'user/isLogin',
      messageUnreadCount: 'messageUnreadCount',
      conversationsUnreadCount: 'flooim/conversationsUnreadCount',
    }),

    /**
     * 红点数, “首页” 
     * @returns 
     */
     homeRedPointCount() {
      return 0;
    },

    /**
     * 红点数, "我的" 
     * @returns 
     */
    mineRedPointCount() {
      return this.messageUnreadCount + this.conversationsUnreadCount;
    },
  },
  watch: {
    mineRedPointCount(nVal, oVal) {
      this.setTabBarRedPoint(TAB_BAR_TYPE.MINE, nVal);
    }
  },
  methods: {
    ...mapMutations(['SET_KEY_BOARD_HEIGHT']),
    checkStorage() {
      uni.getStorageInfo({
        fail(res) {
          realtimeLogger.rtError('Failed to checked storage', res)
          console.error('Failed to checked storage', res);
        },
        success(res) {
          if ((res.currentSize / res.limitSize) > 0.95) {
            realtimeLogger.rtError('Storage is nearly OUT of stock', (res.currentSize / res.limitSize))
            realtimeLogger.rtError('Current storage info', res)
          }
        }
      })
    },
    setupFont() {
      uni.loadFontFace({
        global: true,
        scopes: ['webview', 'native'], // 'native': 可以在 canvas2d 中使用
        family: 'Rubik-Med-ASCII',
        source: 'url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/font-icon/Rubik-Medium-ASCII.ttf")',
        success() {
          console.log('Font load success')
        },
        fail(e) {
          console.error('Font load failed', e)
        }
      })
    },

    /**
     * 初始化？
     * @param { loadUserInfo } option 选项：`loadUserInfo` 是否
     */
    async tryLogin(option) {
      let loadUserInfo = option?.loadUserInfo;
      if (!this.isLogin || option?.force == true) {
        const loginResult = await uni.login();
        console.log("login result loginResult", loginResult)

        if (Array.isArray(loginResult) && loginResult.length > 1 && loginResult[1]) { 
          // 获取用户 token
          await this.$store.dispatch("user/GET_TOKEN", { code: loginResult[1].code })
        }

        // 没有登录或者强制，都需要重新加载用户信息。
        loadUserInfo = true;
      }

      // 根据情况，获取用户信息, 指定不获取，就进行获取
      if (loadUserInfo) { 
        await this.$store.dispatch('user/GET_USER_INFO', { syncWithIM: true });
      }

      this.doIfLogin();
    },
    async doIfLogin() {
      if (this.isLogin) {
        // 如果到这里已经信息完整了，获取更多数据
        await this.$store.dispatch("GET_TEE_COLOR");
      }
    },
    // 检查版本提示更新
    updateHandling() {
      const updateManager = uni.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {});
      updateManager.onUpdateReady(function () {
        uni.showModal({
          title: "更新提示",
          content: "新版本已经准备好，是否重启应用？",
          success(res) {
            if (res.confirm) {
              updateManager.applyUpdate(); // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            }
          },
        });
      });
      updateManager.onUpdateFailed(function () {});
    },

    syncRedPoints() {
      // “首页” 红点
      this.setTabBarRedPoint(TAB_BAR_TYPE.HOME, this.$vm.homeRedPointCount)
      // “我的” 红点
      this.setTabBarRedPoint(TAB_BAR_TYPE.MINE, this.$vm.mineRedPointCount)
    },
    setTabBarRedPoint(type, count) {
      const getTabBarFunc = getCurrentPages()[0]?.$vm?.$mp?.page?.getTabBar;
      if (
        typeof getTabBarFunc === "function" &&
        getCurrentPages()[0]?.$vm?.$mp?.page?.getTabBar()
      ) {
        const tabBar = getCurrentPages()[0]?.$vm?.$mp?.page?.getTabBar();
        tabBar.setTabBarRedPoint(type, count)
      }
    },
    getTabBarRedPoint(type) {
      const getTabBarFunc = getCurrentPages()[0]?.$vm?.$mp?.page?.getTabBar;
      if (
        typeof getTabBarFunc === "function" &&
        getCurrentPages()[0]?.$vm?.$mp?.page?.getTabBar()
      ) {
        const tabBar = getCurrentPages()[0]?.$vm?.$mp?.page?.getTabBar();
        return tabBar.data.tabBarRedPoints[type]
      }

      return undefined
    },

    onKeyboardHeightChangeInApp({ height }) {
      this.SET_KEY_BOARD_HEIGHT(height)
    },
  },
};
</script>

<style>
/*每个页面公共css */
@import "@/assets/icons/rubik.scss";
@import "@/assets/icons/dincond-black.css";
</style>
