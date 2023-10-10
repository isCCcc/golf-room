/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */
import Vue from 'vue'
import App from './App'
import store from './store';
import "@assets/styles/base.scss";
import wxShareBasic from './utils/share/wxShareBasic';
import grEvents from './mixins/gr-events';

import GrAuthPopup from '@/components/auth-popup/gr-auth-popup.vue'
import popupPlugin from './mixins/gr-global-popups';
import './utils/prototype-enhance.js'

// import "@/utils/log/gr-log.js"

Vue.config.productionTip = false
Vue.prototype.$store = store;
Vue.prototype.$ossUrl = 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room';

//onLaunch异步方法与onLoad执行顺序问题
Vue.prototype.$onLaunched = new Promise(resolve => {
  Vue.prototype.$isResolve = resolve
});

Vue.mixin(wxShareBasic);
Vue.mixin(grEvents);

Vue.component('GrAuthPopup', GrAuthPopup)
Vue.use(popupPlugin);

  App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
