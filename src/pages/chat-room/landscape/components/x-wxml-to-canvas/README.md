

### 介绍
* 基于uniapp目前仅测试小程序与h5
* 根据微信小程序wxml-to-canvas封装，<font color=#FF000 >__支持的 css 属性及写法 一定一定 要 按__ </font> [官方文档](https://developers.weixin.qq.com/miniprogram/dev/extended/component-plus/wxml-to-canvas.html)
* [uni插件市场](https://ext.dcloud.net.cn/plugin?id=3998)

### 使用
#### 1、页面引用
``` 
import xWxmlToCanvas from '@/components/x-wxml-to-canvas/x-wxml-to-canvas';

```
#### 2、components声明
```
components: {
		xWxmlToCanvas
	} 
```
#### 3、使用
```
<xWxmlToCanvas ref="xWxmlToCanvas" :hide="true" :width="300" :height="300" :xStyle="style" :xWxml="wxml"></xWxmlToCanvas>
```
#### 4、方法调用

```
this.$refs.xWxmlToCanvas.renderToCanvas() //渲染至canvas
this.$refs.xWxmlToCanvas.canvasToTempFilePath() //生成图片
this.$refs.xWxmlToCanvas.getCanvasImage() //获取图片
this.$refs.xWxmlToCanvas.saveImageToPhotosAlbum() //下载图片

```

### 相关字段
|  字段   | 类型  |默认值  |描述  |
|  ----  | ----  |----  |----  |
| isMode  | Boolean |false| 是否支持image标签的mode
| hide  | Boolean |false| canvas是否在页面可见 true 通过fixed将canvas移至屏幕外
| width  | Number |300| canvas宽度
| height  | Number |300| canvas高度
| xWxml  | String || wxml 模板
| xStyle  | Object |{}| 样式
|useCORS|Boolean | true | canvas 图片跨域

---
### 相关方法
|  方法名    |描述  | 返回值 |
|  ----    |----  |----  |
| renderToCanvas  | 将wxml渲染至页面|无 |
| canvasToTempFilePath  | 将canvas转为图片地址 (H5端 Canvas 内绘制的图像需要支持跨域访问才能成功)|promise函数，返回 图片地址，h5为base64 |
| getCanvasImage  | renderToCanvas 与 canvasToTempFilePath 合并 |promise函数，返回 图片地址，h5为base64 |
| saveImageToPhotosAlbum  | 图片保存至本地 |promise函数，返回 true / flase|
---