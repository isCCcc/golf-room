<template>
  <view class="page" style="{background-color: black}">
    <ksp-cropper class="cropper" mode="ratio" :width="1024" :height="1024" :maxWidth="1024" :maxHeight="1024"
      :btnFontSize="35" :cropCornerColor="scssVars.themeSubColor" cropCornerBorder="4rpx" :url="avatarToCrop"
      @cancel="cropCancel" @ok="cropSuccess"></ksp-cropper>
      <helang-compress ref="helangCompress"></helang-compress>
  </view>
</template>

<script>
import KspCropper from "@/pages/common/uni_modules/ksp-cropper/components/ksp-cropper/ksp-cropper.vue"
import HelangCompress from "@/pages/common/components/helang-compress/helang-compress.vue"
  import {
    uploadAvatar
  } from '@/utils/uploadImage.js'
  import scssVars from '@assets/styles/_export.scss'
  import {
    isUndefined,
    isString
  } from "util"
import { realtimeLogger } from "@/mixins/gr-mp-logging.js"

  export default {
    components: {
      KspCropper,
      HelangCompress,
    },
    onLoad: function(option) {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on('cropAvatar', (avatar) => {
        this.avatarToCrop = avatar;
      })
      eventChannel.on('behavior', ({
        autoUpload
      }) => {
        this.autoUpload = autoUpload;
      })
      this.eventChannel = eventChannel;
    },
    onUnload: function() {
      this.eventChannel.off('cropAvatar');
      this.eventChannel.off('behavior')
    },
    data() {
      return {
        scssVars,
        avatarToCrop: "",
        eventChannel: undefined,
        autoUpload: true,
        croppedAvatar: undefined,
        uploadedAvatar: undefined,
      }
    },
    methods: {
      async cropSuccess(e) {
        const url = e.path;

        const _avatar_url = e.path

        // 保存裁剪后的路径
        this.croppedAvatar = _avatar_url;

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
        this.croppedAvatar = compressedUrl;
        // const cachedUrl = await this.cacheImage(compressedUrl);

        if (this.autoUpload) {
          uni.showLoading({
            title: "上传中"
          });
          const uploadedUrl = await uploadAvatar(compressedUrl);

          // 保存上传后的路径
          this.uploadedAvatar = uploadedUrl
        }

        uni.hideLoading();
        this.back();
      },
      cropCancel() {
        this.back();
      },
      async compressImage(url) {
        let compressedUrl = await new Promise((resolve, reject) => {
          uni.compressImage({
            src: url,
            quality: 80,
            success: (res) => {
              resolve(res.tempFilePath)
            },
            fail: (err) => {reject(err)}
          })
        }).catch((err) => {
          console.error("压缩失败", err)
        });

        {
          // Test code
          // Try to compare uni compressing and helang compressing.
          try {

            const res = await new Promise((resolve, reject) => {
              uni.getFileInfo({
                filePath: compressedUrl,
                success: (res) => {
                  console.log('getFileInfo uni.compressImage', res)
                  resolve(res)
                }
              })
            })

            const imageInfoRes = await new Promise((resolve, reject) => {
              uni.getImageInfo({
                src: compressedUrl,
                success: (res) => {
                  resolve(res)
                }
              })
            })

            const testCompressedUrl = await this.$refs.helangCompress?.compress({
              src: url,
              maxSize: Math.max(res.width, res.height),
              fileType: 'jpg',
              quality: 0.8,
              minSize: -1
            }).catch((err) => {
              console.error("压缩失败", err)
            });
            
            const testRes = await new Promise((resolve, reject) => {
              uni.getFileInfo({
                filePath: testCompressedUrl,
                success: (res) => {
                  console.log('getFileInfo helangCompress', res)
                  resolve(res)
                }
              })
            })

            const testImageInfoRes = await new Promise((resolve, reject) => {
              uni.getImageInfo({
                src: testCompressedUrl,
                success: (res) => {
                  resolve(res)
                }
              })
            })
            // realtimeLogger.rtInfo('compressing compare', testRes.size / res.size , res, testRes, imageInfoRes, testImageInfoRes)
          } catch (error) {
            realtimeLogger.rtError('compressing compare', error)
          }
        }

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
            fail: (err) => {
              console.error("缓存失败", err)
              reject()
            },
          })
        })
        return isString(saveUrl) ? saveUrl : url;
      },
      back() {
        const scope = this;
        uni.navigateBack({
          complete: function() {
            scope.eventChannel.emit('finished', {
              croppedAvatar: scope.croppedAvatar,
              uploadedAvatar: scope.uploadedAvatar
            })
          }
        });
      }
    },
  }
</script>

<style>
</style>
