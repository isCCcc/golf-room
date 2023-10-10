<template>
  <uni-popup ref="popup" class="popup-container" :mask-click="false">
    <view class="root">
      <view>
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
                placeholder="请输入昵称"
                placeholder-class="col-999"
                :adjust-position="true"
                :focus="isFocus"
                @input="handleNameChange"
                @confirm="handleNameInputConfirm" />
              <view class="under-line"></view>
            </view>
          </view>
          <view class="flex flex-1 buttons">
            <view :class="['n-btn', 'cancel-btn']" @click="handleCancel">
              <view>{{ '取消' }}</view>
            </view>
            <view :class="[isUserNameValid ? 'hl-btn' : 'disable-btn', 'flex-1', 'confirm-btn']" @click="handleConfirm">
              <view>{{ '添加虚拟球员' }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view :style="[{ height: `${keyboardHeight}px` }]"></view>   
  </uni-popup>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isUserNameLegal, trimUserName, UserNameMinLength, UserNameMaxLength, isEmpty } from '@utils/index'

export default {
  components: {
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
      showing: false,
      isFocus: false,
      // changed: false,
      username: null,
      gender: 1,
      genderArray: [
        { value: 1, label: "男" },
        { value: 2, label: "女" },
      ],
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
    isUserNameValid() {
      return isUserNameLegal(this.username)
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    open() {
      this.showing = true;
      this.gender = 1; // 默认值
      this.$refs.popup.open("center");

      setTimeout(() => {
        this.isFocus = true;
      }, 350);
    },

    close() {
      this.showing = false;
      this.isFocus = false;
      this.$refs.popup.close();
    },

    handleNameInputConfirm(e) {
      this.username = trimUserName(e.detail.value);
      return this.username;
    },
    handleNameChange(e) {
      this.username = trimUserName(e.detail.value);
      return this.username;
    },


    // async saveUserInfoChanges(info) {
    //   uni.showLoading({
    //     title: '正在保存信息'
    //   });
    //   await new Promise((resolve, reject) => {
    //     this.$store.dispatch("user/UPDATE_USER_INFO", { data: info, gl: false }).finally((res) => {
    //       resolve();
    //     });  
    //   })
    //   uni.hideLoading();
    //   uni.$emit('auth_popup_finish_update')
    // },

    handleCancel() {
      this.close()
    },

    handleConfirm() {
      if (this.isUserNameValid == false) {
        uni.showToast({
          title: `请输入昵称，长度${UserNameMinLength}~${UserNameMaxLength}个字`,
          icon: 'none'
        })
        return;
      }

      const virtualUser = {
        gender: this.gender,
        username: this.username,
        gr_virtual: true,
      }

      this.$emit('virtual-user-info', virtualUser);

      this.close()
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
    font-weight: 600;
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

    color: #666666;
  }

  @mixin content() {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 0rpx 64rpx;
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

          color: #000000;

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

          color: #000;
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

    .buttons {
      margin-top: 48rpx;
      width: 100%;
      gap: 28rpx;
      
      .cancel-btn {
        width: 130rpx;
      }
      .confirm-btn {
        
      }
    }
    
  }

  .root-bot {
    height: 64rpx;
  }
}
</style>
