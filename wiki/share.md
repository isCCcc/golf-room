# Share

## 微信小程序

微信官方文档：

* [onShareAppMessage](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object)
* [onShareTimeline](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareTimeline)

主要文件

* `src/utils/share/index.js`
  * 二维码分享，具体页面分享
* `src/utils/share/wxShareBasic.js`
  * 全局分享配置，默认分享首页，需要 `import wxShareBasic from './utils/share/wxShareBasic'; Vue.mixin(wxShareBasic);`

注意：默认分享配置在 `wxShareBasic.js` 做。如果想修改默认行为，请在页面中实现 `onShareAppMessage`, `onShareTimeline` 方法。
