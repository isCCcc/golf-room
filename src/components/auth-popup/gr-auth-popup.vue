<template>
  <uni-popup ref="popup" class="popup-container" :mask-click="false">
    <view class="root">
      <view class="top-bg"></view>
      <view>
        <!-- 授权 -->
        <view v-if="displayStage == stageDef.Auth" class="auth-part">
          <slot name="authStageContent" v-bind="">
            <view class="logo" />
            <text class="com-text auth-hint">{{ `登录后创建高球房间、观看\n和关注球局` }}</text>
          </slot>
          <button :class="['hl-btn', 'flex', 'auth-confirm']" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            <view class="wx-icon"></view>
            <view>{{ '微信一键登录' }}</view>
          </button>
        </view>

        <!-- 设置性别昵称 -->
        <view v-if="displayStage == stageDef.GenderUserName" class="gender-user-name-part">
          <!-- 性别 -->
          <view class="gender-part">
            <view class="com-text part-title">{{ '性别' }}</view>
            <view class="gender-segment">
              <view class="gender-segment-indicator" :style="{ transform: `translate(${gender == 1 ? 0 : 160}rpx)`, 'transition-duration': '0.15s'}"></view>
              <view v-for="item in genderArray" :key="item.value" :class="['gender-btn', gender != item.value ? 'gender-btn-unselected' : '']" @click="gender = item.value">
                <view class="">{{ item.label }}</view>
                <image :class="['gender-icon', gender != item.value ? 'gray-out' : '']" :src="`${ossUrl}/icons/${ item.value == 1 ? 'icon-male' : 'icon-female'}.png`"/>
              </view>
            </view>
          </view>
          <!-- 昵称 -->
          <view class="user-name-part">
            <view class="com-text part-title">{{ '设置昵称' }}</view>
            <view class="name-part-right">
              <!-- 注意 input 尽量在真机测试 -->
              <input
                v-if="showing"
                class="user-name-input"
                type="nickname"
                placeholder="请输入昵称"
                placeholder-class="col-999"
                :adjust-position="true"
                @input="handleNameChange"
                @confirm="handleNameInputConfirm" />
              <view class="under-line"></view>
            </view>
          </view>
          <view :class="[isUserNameValid ? 'hl-btn' : 'disable-btn', 'gender-name-confirm']" @click="handleNameConfirm">
            <view>{{ '确定' }}</view>
          </view>
        </view>

        <!-- 设置头像 -->
        <view v-if="displayStage == stageDef.Avatar" class="avatar-part">
          <view class="avatar" @click="onChooseAvatar" >
            <GAvatar :avatar-data="{ avatar_url: tmpAvatar, gender: gender}" :size-in-rpx='180' :radius="'100%'" handle-click="false"/>
          </view>
          <view class="com-text avatar-text">{{ '设置头像' }}</view>
          <view :class="[isAvatarAvailable ? 'n-btn' : 'hl-btn', 'flex', 'avatar-album']" @click="onChooseAvatar">
            <view class="album-icon"></view>
            <view>{{ '相册上传头像' }}</view>
          </view>
          <view :class="[isAvatarAvailable ? 'hl-btn' : 'n-btn', 'avatar-confirm']" @click="handleAvatarConfirm">
            <view>{{ '确定' }}</view>
          </view>
        </view>
      </view>

      <view v-show="showCloseBtn" class="close-btn" @click="handleClose"></view>
    </view>
  </uni-popup>
</template>

<script>
import GAvatar from '@/components/g-avatar/g-avatar.vue';
import { getWxPhoneNumber, updateUserInfo } from "@/api/user";
import {
    uploadAvatar
} from '@/utils/uploadImage.js'
import { mapGetters, mapState } from "vuex";
import { isString } from "util";
import { isUserNameLegal, trimUserName, UserNameMinLength, UserNameMaxLength, isEmpty } from '@utils/index'

const AuthDisplayStage = {
  Auth: 0,
  GenderUserName: 1,
  Avatar: 2,
}

export default {
  components: {
    GAvatar,
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
      showing: false,
      changed: false,
      avatar_url: null,
      tmpAvatar: null,
      username: null,
      phone_number: null,
      gender: 1,
      genderArray: [
        { value: 1, label: "男" },
        { value: 2, label: "女" },
      ],
      stageDef: AuthDisplayStage,
      displayStage: AuthDisplayStage.Auth,
      displayStages: [AuthDisplayStage.Auth, AuthDisplayStage.GenderUserName, AuthDisplayStage.Avatar]
    };
  },
  computed: {
    ...mapState({
      keyboardHeight: (state) => state.app.keyboardHeight,
    }),
    ...mapGetters({
      isLogin: 'user/isLogin',
      isAuth: 'user/isAuth',
      userInfoInStore: 'user/userInfo',
    }),
    isAvatarAvailable() {
      return this.tmpAvatar && this.tmpAvatar.length > 0;
    },
    showCloseBtn() {
      return this.displayStage == AuthDisplayStage.Auth
        || this.displayStage == AuthDisplayStage.Avatar
    },
    isUserNameValid() {
      return isUserNameLegal(this.username)
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    async tryOpen() {
      if (this.isAuth) return;

      // 如果没登录，尝试登录。
      if (this.isLogin != true) {
        await getApp()?.$vm?.tryLogin();
        if ((this.userInfoInStore?.uid || -1) < 1) {
          uni.showToast({
            title: '获取信息失败，请稍后再试',
            icon: 'none',
          })
          return;
        }

        // 登录完成后，再次检查是否授权
        if (this.isAuth) return;
      }

      this.open();
    },
    open() {
      this.avatar_url = this.userInfoInStore.avatar_url;
      this.tmpAvatar = this.avatar_url;
      this.phone_number = this.userInfoInStore.phone_number;

      this.displayStages = []
      if (isEmpty(this.phone_number)) {
        this.displayStages.push(AuthDisplayStage.Auth)
      }
      this.displayStages.push(...[AuthDisplayStage.GenderUserName, AuthDisplayStage.Avatar])
      this.displayStage = this.displayStages[0];
      console.log('open');
      this.showing = true;
      this.$refs.popup.open("center");
    },
    async close(changed) {
      if (changed === true) {
        await this.saveUserInfoChanges({
          avatar_url: this.avatar_url,
          username: this.username,
          gender: this.gender,
          phone_number: this.phone_number,
        })
      }
      this.showing = false;
      this.$refs.popup.close();
    },
    onChooseAvatar(e) {
      uni.chooseImage({
        count: 1,  //图片可选择数量
        sizeType: ['original', 'compressed'],  //original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'],   //album 从相册选图，camera 使用相机，默认二者都有。
        success: async res => {
          let imgFiles = res.tempFilePaths   //图片的本地文件路径列表
          const preProcessedImage = imgFiles[0] // await preProcessImage(imgFiles[0])
          uni.navigateTo({
            url: '/pages/common/avatar/crop/index',
            events: {
              finished: ({ croppedAvatar, uploadedAvatar }) => {
                if (isString(croppedAvatar) && croppedAvatar.length > 0) {
                  this.tmpAvatar = croppedAvatar;
                }
              }
            },
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('cropAvatar', preProcessedImage);
              res.eventChannel.emit('behavior', { autoUpload: false });
            }
          })
        }
      })
    },
    handleNameInputConfirm(e) {
      this.username = trimUserName(e.detail.value);
      return this.username;
    },
    handleNameChange(e) {
      this.username = trimUserName(e.detail.value);
      return this.username;
    },

    async getPhoneNumber(e) {
      console.log("getPhoneNumber~~ ", e);
      if (!!e?.detail?.code == false) {
        uni.showToast({
          title: '你已拒绝登录',
          icon: 'none'
        })
        return
      }

      try {
        const { data: res } = await getWxPhoneNumber({
          code: e?.detail?.code,
        });

        if (res?.code === 0) {
          this.phone_number = res.data?.phone_number;

          this.changed = true;
          this.changeDisplayStage();
        } else {
          uni.showToast({ title: res?.msg || "请稍后重试", icon: "error" });
        }
      } catch (error) {
        uni.showToast({
          title: error?.data?.msg || "请稍后重试",
          icon: "error",
        });
      }
    },

    async saveUserInfoChanges(info) {
      uni.showLoading({
        title: '正在保存信息'
      });
      await new Promise((resolve, reject) => {
        this.$store.dispatch("user/UPDATE_USER_INFO", { data: info, gl: false }).finally((res) => {
          resolve();
        });  
      })
      uni.hideLoading();
      uni.$emit('auth_popup_finish_update')
    },


    changeDisplayStage() {
      this.displayStages.splice(0, 1)
      const nextStage = this.displayStages[0];
      if (nextStage == undefined) {
        this.close(this.changed);
        return
      }
      this.displayStage = nextStage;
    },

    handleClose() {
      this.close(this.changed)
    },

    handleNameConfirm() {
      if (this.isUserNameValid == false) {
        uni.showToast({
          title: `请输入昵称，长度${UserNameMinLength}~${UserNameMaxLength}个字`,
          icon: 'none'
        })
        return;
      }
      this.changed = true;
      this.changeDisplayStage();
    },

    async handleAvatarConfirm() {
      this.avatar_url = this.tmpAvatar;
      if (this.avatar_url !== this.userInfoInStore.avatar_url) {
        if (this.avatar_url) {
          try {
            uni.showLoading({
              title: '上传中'
            })
            const uploadedUrl = await uploadAvatar(this.avatar_url);
            this.avatar_url = uploadedUrl;
            uni.hideLoading();
            this.changed = true;
          } catch (error) {
            uni.hideLoading();
            uni.showToast({
              title: '上传失败'
            })
          }
        }
      }
      this.changeDisplayStage();
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-container {
  position: absolute;
  z-index: 10001;
}
.root {
  position: relative;
  background: #FFFFFF;
  border-radius: 4rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  margin-left: 72rpx;
  margin-right: 72rpx;
  padding-bottom: 64rpx;
  width: 606rpx;
  
  .top-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 81.85vw;
    
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/img_auth_popup_top_bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
  }

  .close-btn {
    position: absolute;
    @include bgImage(76rpx, 62rpx, 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_auth_popup_close.svg');

    top: 0rpx;
    right: 0rpx;
  }


  @mixin btn-common() {
    box-sizing: border-box;

    border-radius: 4rpx;

    width: 100%;
    height: 96rpx;
    
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10rpx;

    font-style: normal;
    font-weight: 400;
    font-size: 28rpx;
    // line-height: 39rpx;
    text-align: center;
    letter-spacing: -0.3rpx;

    color: #FFFFFF;
  }

  // Highlight button
  .hl-btn {
    @include btn-common();
    font-weight: 600;
    background: #003C3D;
  }

  // normal button
  .n-btn {
    @include btn-common();
    border: 2rpx solid #003C3D;
    font-weight: 400;
    color: #003C3D;
  }

  // Disable button
  .disable-btn {
    @include btn-common();
    border: 2rpx solid #C8C8C8;
    font-weight: 400;

    color: #C8C8C8;
  }

  // common text
  .com-text {
    font-weight: 400;
    font-size: 28rpx;
    line-height: 39rpx;
    text-align: center;
    letter-spacing: -0.3rpx;

    color: #003C3D;
  }

  .wx-icon {
    padding-bottom: 4rpx; // 为了看起来与文字中间对齐
    @include bgImage(44rpx, 34rpx, 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_wechat_dark.svg');
  }

  .album-icon {
    @include bgImage(42rpx, 32rpx, 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_album.svg')
  }

  @mixin content() {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 0rpx 64rpx;
  }

  .auth-part {
    @include content();
    .logo {
      @include bgImage(200rpx, 108rpx, 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_logo_light.svg');

      margin-top: 74rpx;
    }

    .auth-hint {
      margin-top: 38rpx;
    }

    .auth-confirm {
      margin-top: 40rpx;
    }
  }

  

  .gender-user-name-part {
    @include content();
    margin-top: 60rpx;

    .part-title {
      width: 138rpx;
      height: 40rpx;
      text-align: left;
    }

    .gender-part {
      padding: 4rpx;

      width: 100%;
      flex: 1;
      
      display: flex;
      justify-content: left;
      align-items: center;
      gap: 16rpx;

      .gender-segment {
        position: relative;
        display: flex;

        background: #EAEAEA;
        border-radius: 4px;
        
        .gender-segment-indicator {
          position: absolute;
          background-color: white;
          margin: 4rpx;
          width: 160rpx;
          height: 66rpx;
        }

        .gender-btn {
          position: relative;
          margin: 4rpx;
          width: 156rpx;
          height: 66rpx;

          font-weight: 500;
          font-size: 28rpx;
          line-height: 39rpx;
          letter-spacing: -0.3rpx;

          color: #003C3D;

          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6rpx;

          .gray-out {
            filter: grayscale(100%);
          }
          
          .gender-icon {
            width: 24rpx;
            height: 24rpx;
          }
        }
        

        .gender-btn-unselected {
          font-weight: 400;
          color: #959595;
        }
      }
    }

    .user-name-part {
      position: relative;
      margin-top: 26rpx;
      display: flex;
      justify-content: left;
      align-items: center;
      gap: 16rpx;
      flex: 1;

      .name-part-right {
        position: relative;
        flex: 1;

        display: flex;
        flex-direction: column;
        .user-name-input {
          @include ell(1);
          margin: 16rpx 0rpx;

          flex: 1;
          min-height: 38rpx; // input 需要设置， 才能显示完全

          @include rubikVar(500);
          font-style: normal;
          font-size: 32rpx;
          line-height: 38rpx;
          letter-spacing: -0.3rpx;

          color: #003C3D;
        }
        .under-line {
          position: absolute;
          bottom: 0;
          background-color: #003C3D;
          width: 100%;
          height: 1rpx;
        }
      }
    }

    .gender-name-confirm {
      margin-top: 28rpx;
    }
  }

  .avatar-part {
    @include content();

    .avatar {
      margin-top: -18rpx;
      width: 180rpx;
      height: 180rpx;

      background: linear-gradient(180deg, #91A5B4 0%, #D3D9DE 100%);
      border: 8rpx solid #FFFFFF;
      box-shadow: 0rpx 6rpx 20rpx rgba(0, 0, 0, 0.08);
      border-radius: 100%;

      display: flex;
      justify-content: center;
    }

    .avatar-text {
      margin-top: 30rpx;
    }

    .avatar-album {
      margin-top: 36rpx;
    }
    
    .avatar-confirm {
      margin-top: 20rpx;
    }
  }
  .root-bot {
    height: 64rpx;
  }
}
</style>
