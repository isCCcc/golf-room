import urlParse from 'url-parse'
import URLSearchParams from '@ungap/url-search-params';
import { trunc } from '@utils/index'

export const preProcessImage = async (image) => {
  const targetImage = image

  const preProcessFailed = (title) => {
    uni.hideLoading();
    uni.showToast({ title: title, icon: "none" });
  };
  const preProcessFinished = (title) => {
    uni.hideLoading();
  };
  uni.showLoading({ title: "预处理中" });

  // 获取图片参数：宽和高
  const { width, height, orientation } = await new Promise(
    (resolve, reject) => {
      uni.getImageInfo({
        src: targetImage,
        success: function (image) {
          console.log("getImageInfo", image);
          resolve({
            width: image.width,
            height: image.height,
            orientation: image.orientation,
          });
        },
        failed: function (e) {
          console.error("getImageInfo", e);
          preProcessFailed("获取图片信息失败");
          reject();
        },
      });
    }
  );

  // 压缩图片至指定最大宽高
  let scale = 1;
  /**
   * 微信提供的 Canvas 最大宽高值 1365x1365，由于 ksp-cropper 使用了 canvas 来进行裁剪，我们不要超过一定的宽度。
   * 实际测试过程中，iPhone 12 Pro Max 可以去掉 1800+。
   * 详见 https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html
   */
  const maxEdgeSize = 1365;
  if (width > maxEdgeSize || height > maxEdgeSize) {
    scale = maxEdgeSize / Math.max(width, height);
  }
  let targetWidth = width;
  let targetHeight = height;
  if (orientation === "right" || orientation === "left") {
    targetWidth = height;
    targetHeight = width;
  }
  const preProcessedImage = await new Promise((resolve, reject) => {
    wx.compressImage({
      src: targetImage,
      quality: 100,
      compressedWidth: targetWidth * scale,
      compressedHeight: targetHeight * scale,
      success: (compressResult) => {
        console.log("compressResult", compressResult);
        resolve(compressResult.tempFilePath);
      },
      fail: (e) => {
        console.error("压缩图片失败", e);
        preProcessFailed("压缩图片失败");
        reject();
      },
    });
  });
  preProcessFinished();

  return preProcessedImage;
};


/**
 * 替换微信默认头像 
 * @param {string} originUrl 
 */
export const filteringEmptyOrWXDefault = (originUrl) => {
  return (originUrl == null || originUrl === 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0') ? null : originUrl
}

/**
 * 默认头像
 * @param {?Gender} gender 性别
 * @returns 
 */
export const defaultAvatar = (gender) => {
  if (gender == 2) { // 女
    return '/static/images/default_female.jpg'
  }

  return '/static/images/default_male.jpg'
}

/**
 * 获取有性别区分的头像
 * @param {?User} userInfo 
 * @returns 
 */
export const genderedAvatar = (userInfo) => {
  return filteringEmptyOrWXDefault(userInfo?.avatar_url) || defaultAvatar(userInfo?.gender)
}

export const ossResize = (originUrl, defaultUrl, widthInPixel) => {
  const targetUrl = originUrl || defaultUrl;
  if (targetUrl?.length < 1) {
    return targetUrl
  }

  const url = new urlParse(targetUrl);
  /** @type string */
  const hostname = url.hostname
  if (!hostname.endsWith('aliyuncs.com') && !hostname.endsWith('golfroom.cn')) {
    return targetUrl;
  }

  const lowercasePathname = url.pathname.toLowerCase();
  if (!lowercasePathname.endsWith('.png') && !lowercasePathname.endsWith('.jpg') && !lowercasePathname.endsWith('.jpeg')) {
    return targetUrl;
  }
  
  const searchParams = new URLSearchParams(url.query);
  searchParams.set('x-oss-process', `image/resize,w_${trunc(widthInPixel)}`)
  url.query = searchParams.toString()

  return `${url.origin}${url.pathname}?${url.query}`;
}