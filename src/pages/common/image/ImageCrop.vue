<template>
  <view class="page" style="{background-color: black}">
    <GNavbar class="nav" title=" " :bg-opacity="0" :zIndex="9999"></GNavbar>
    <ksp-cropper ref='cropper' class="cropper" mode="ratio" :width="width" :height="height" :maxWidth="maxSize" :maxHeight="maxSize"
      :btnFontSize="35" :cropCornerColor="scssVars.themeSubColor" cropCornerBorder="4rpx" :url="imageToCrop"
      :displayScale="0.9" 
      :imageBorderSize="'0'"
      @cancel="cropCancel" @ok="cropSuccess" />

    <!-- <view class="fixed-bottom tool">
      <button class="save-button"
              @click="handleSave">
        {{ '更换封面图' }}
      </button>
    </view> -->

    <helang-compress ref="helangCompress"></helang-compress>
  </view>
</template>

<script>
import KspCropper from "@/pages/common/uni_modules/ksp-cropper/components/ksp-cropper/ksp-cropper.vue"
import GNavbar from '@/components/g-navbar/index.vue'
import HelangCompress from "@/pages/common/components/helang-compress/helang-compress.vue"
import {
  uploadImage, UploadImageType
} from '@/utils/uploadImage.js'
import scssVars from '@assets/styles/_export.scss'
import {
  isUndefined,
  isString
} from "util"


export default {
  components: {
    GNavbar,
    KspCropper,
    HelangCompress
  },
  onLoad: function (option) {
    // 获取设定的宽
    if (option.w) { this.width = option.w }
    // 获取设定的高
    if (option.h) { this.height = option.h }
    // 获取设定的图片最大边值
    if (option.m) { this.maxSize = option.m }
    
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('cropImage', (image) => {
      this.imageToCrop = image;
    })
    eventChannel.on('behavior', ({
      autoUpload
    }) => {
      this.autoUpload = autoUpload;
    })
    this.eventChannel = eventChannel;
  },
  onUnload: function () {
    this.eventChannel.off('cropImage');
    this.eventChannel.off('behavior')
  },
  data() {
    return {
      scssVars,
      imageToCrop: "",
      eventChannel: undefined,
      autoUpload: true,
      croppedImage: undefined,
      uploadedImage: undefined,

      width: 1024,
      height: 1024,
      maxSize: 1024,      
    }
  },
  methods: {
    async cropSuccess(e) {
      const url = e.path;

      const _avatar_url = e.path

      // 保存裁剪后的路径
      this.croppedImage = _avatar_url;

      if (_avatar_url?.length < 1) {
        uni.showToast({
          title: "裁剪错误，请重试",
          icon: 'none'
        });
        this.back();
        return;
      }

      uni.showLoading({
        title: "处理中"
      });

      const compressedUrl = await this.compressImage(_avatar_url);
      this.croppedImage = compressedUrl;
      // const cachedUrl = await this.cacheImage(compressedUrl);

      if (this.autoUpload) {
        uni.showLoading({
          title: "上传中"
        });
        const uploadedUrl = await uploadImage(UploadImageType.UserProfileBg, compressedUrl);

        // 保存上传后的路径
        this.uploadedImage = uploadedUrl
      }

      uni.hideLoading();
      this.back();
    },
    cropCancel() {
      this.back();
    },
    async compressImage(url) {

      const compressedUrl = await new Promise((resolve, reject) => {
        uni.compressImage({
          src: url,
          success: (res) => {
            resolve(res.tempFilePath)
          },
          fail: (err) => {reject(err)}
        })
      }).catch((err) => {
        console.error("压缩失败", err)
      });
      // const compressedUrl = await this.$refs.helangCompress.compress({
      //   src: url,
      //   maxSize: this.maxSize,
      //   fileType: 'jpg',
      //   quality: 0.9,
      //   minSize: -1
      // }).catch((err) => {
      //   console.error("压缩失败", err)
      // });
      return isString(compressedUrl) ? compressedUrl : url;
    },
    async cacheImage(url) {
      const saveUrl = await new Promise((resolve, reject) => {
        const fs = uni.getFileSystemManager()
        fs.saveFile({
          tempFilePath: url, // 传入一个本地临时文件路径
          success: (res) => {
            resolve(res.savedFilePath)
          },
          fail: () => {
            console.error("缓存失败", err)
            reject()
          },
        })
      })
      return isString(saveUrl) ? saveUrl : url;
    },

    handleSave() {
      this.$refs.cropper.onok();
    },

    back() {
      const scope = this;
      uni.navigateBack({
        complete: function () {
          scope.eventChannel.emit('finished', {
            croppedImage: scope.croppedImage,
            uploadedImage: scope.uploadedImage
          })
        }
      });
    }
  },
}
</script>

<style lang="scss">
.tool {
  z-index: 1000;

  .save-button {
    width: 310rpx;
    height: 100rpx;
    background: rgba(255, 255, 255, 0.1);
    border: 1rpx solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(14.9506rpx);
    border-radius: 68rpx;

    font-weight: 500;
    font-size: 28rpx;
    line-height: 39rpx;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    color: #FFFFFF;
  }
}
</style>
