<template>
  <view class="page">
    <view class="top-bg">
      <Gnavbar title="我的资料" />
    </view>
    <view class="flex-col px-32 bg-white">
      <view class="py-32 border-b flex-between">
        <GAvatar class="user-avatar" 
                  :avatar-data="userData"
                  :size-in-rpx='120'
                  :border="'2rpx solid #ffffff'"
                  :radius="'100%'"
                  :handle-click="false"
                  @click="previewAvatar" />
        <view>
          <button class="user-btn" @click="onChooseAvatar">
            修改头像
          </button>
        </view>
      </view>
      <view class="border-b h-120 flex">
        <GCell label="用户名" class="flex1">
          <input type="text" class="text-right fs-32" :value="userData.username" @input="handleNameChange" />
        </GCell>
      </view>
      <view class="border-b h-120 flex">
        <GCell label="性别" class="flex1">
          <picker
            @change="bindGenderPickerChange"
            :value="selectGenderIndex"
            :range="genderArray"
            range-key="label"
          >
            <view class="text-right fs-32">
              {{ genderLabel }}
            </view>
          </picker>
        </GCell>
      </view>
      <view class="border-b h-120 flex">
        <GCell label="手机号" class="flex1">
          <!-- <input type="number" class="text-right fs-32" v-model="userData.phone_number" /> -->
          <button class="get-phone-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            {{ userData.phone_number || '' }}
          </button>
        </GCell>
      </view>
      <view class="border-b h-120 flex">
        <GCell label="球龄（首次打球时间）" class="flex1">
          <picker
            mode="multiSelector"
            :range="datePickerRange"
            range-key="label"
            :value="dateIndex"
            @columnchange="onDateColumnChange"
            @change="onDateChange"
          >
            <view class="text-right fs-32">
              {{ dateLabel || '请选择' }}
            </view>
          </picker>
        </GCell>
      </view>
      <view class="border-b h-120 flex">
        <GCell label="个人介绍" class="flex1">
          <view class="text-right col-999 fs-32 flex-end" @click="openIntroduction()">
            <text class="text-over ml-32">{{ userData.introduction || '未填写' }}</text>
            <uni-icons type="right" :size="iconSize" color="#C4C4C4"></uni-icons>
          </view>
        </GCell>
      </view>
    </view>
    <button :loading="saveLoading" class="button save-btn" @click="handleSave">保存</button>
    
    <InputPopup ref="inputPopupRef"
                label="个人介绍"
                placeholder="请填写个人介绍"
                :value="introduction"
                type="textarea"
                maxlength="100"
                @confirm="saveIntroduction" />
    
  </view>
</template>

<script>
import Gnavbar from '@/components/g-navbar/index.vue'
import GAvatar from '@/components/g-avatar/g-avatar.vue';
import GCell from '@components/g-cell/index.vue'
import InputPopup from '@components/common/input-popup/index.vue';
import { mapGetters } from 'vuex'
import { getUserInfo, getWxPhoneNumber } from '@/api/user/index'
import { formatDate, trimUserName } from '@utils/index'
import { isString } from 'util'

const START_YEAR = 1900

export default {
  components: { Gnavbar, GCell, InputPopup, GAvatar },
  data() {
    return {
      unLoginAvatarUrl: 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/logo.png',
      userData: {},
      genderArray: [
        { id: 1, label: '男' },
        { id: 2, label: '女' },
      ],
      selectGenderIndex: 0,
      saveLoading: false,

      now: new Date(),
      dateArray: [],
      dateIndex: [],
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
      userInfo: 'user/userInfo',
    }),
    genderLabel() {
      return this.genderArray[this.selectGenderIndex].label
      // const genderId = this.userData?.gender || 1; // 默认男
      // const index = this.genderArray.findIndex((item) => item.id === +genderId);
      // if (index !== -1) {
      //   return this.genderArray[index].label;
      // }
    },
    datePickerRange() {
      const [yList = [], mList = []] = this.dateArray
      const [yIndex, mIndex] = this.dateIndex

      if (yIndex === yList.length - 1) {
        const month = yList.at(-1)?.month || 12
        if (mIndex > month - 1) this.$set(this.dateIndex, 1, 0)
        return [yList, mList.slice(0, month)]
      }

      return this.dateArray
    },
    dateLabel() {
      const time = this.userData?.first_golf_time      
      return time ? formatDate(time, 'yyyy年MM月') : ''
    },
    introduction() {
      return this.userData?.introduction || ''
    }
  },
  onLoad() {
    this.getUserData()
    this.genDateArray()
  },
  methods: {
    getUserData() {
      getUserInfo()
        .then((_res) => {
          const { data: res } = _res
          if (res.code === 0) {
            this.userData = res.data
          } else {
            this.userData = this.userInfo || {}
          }
        })
        .catch((e) => {
          this.userData = this.userInfo || {}
        })
        .finally(() => {
          if (this.userData.gender === 2) {
            this.selectGenderIndex = 1
          } else {
            this.selectGenderIndex = 0 // 默认男
          }

          this.setDateIndex()
        })
    },
    bindGenderPickerChange(e) {
      const index = e.detail.value
      this.selectGenderIndex = index
      this.userData.gender = this.genderArray[index].id
    },
    previewAvatar() {
      uni.previewImage({
        urls: [this.userData.avatar_url],
      })
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
                if (isString(uploadedAvatar) && uploadedAvatar.length > 0) {
                  this.userData.avatar_url = uploadedAvatar;

                  // 上传完毕立即保存
                  this.handleSave()
                }
              }
            },
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('cropAvatar', preProcessedImage);
              res.eventChannel.emit('behavior', { autoUpload: true });
            }
          })
        }
      })
    },
    handleNameChange(e) {
      this.userData.username = trimUserName(e.detail.value);
      return this.userData.username
    },

    async getPhoneNumber(e) {
      console.log("getPhoneNumber~~ ", e);
      if (!!e?.detail?.code == false) {
        // uni.showToast({
        //   title: '你已拒绝登录',
        //   icon: 'none'
        // })
        return
      }

      try {
        const { data: res } = await getWxPhoneNumber({
          code: e?.detail?.code,
        });

        if (res?.code === 0) {
          this.userData.phone_number = res.data?.phone_number;

          // 修改完毕立即保存
          this.handleSave()
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

    handleSave() {
      this.saveLoading = true
      const info = Object.assign(this.$store.state.user.userInfo, this.userData)
      this.$store.dispatch('user/UPDATE_USER_INFO', {data: info}).finally((res) => {
        this.saveLoading = false
        setTimeout(() => {
          uni.showToast({
            title: '修改信息成功',
            icon: 'success',
            duration: 3000,
          })
        }, 500)
        //uni.hideLoading();导致结束
      })
    },
    genDateArray() {
      const y = this.now.getFullYear()

      const yList = []
      for (let i = START_YEAR; i <= y; i++) {
        const value = i.toString()
        yList.push({
          label: value,
          value,
          month: 12,
        })
      }
      yList.at(-1).month = this.now.getMonth() + 1

      const mList = []
      for (let i = 1; i <= 12; i++) {
        const value = `${i}`.padStart(2, '0')
        mList.push({
          label: value + '月',
          value,
        })
      }

      this.dateArray = [yList, mList]
    },
    setDateIndex() {
      if (this.userData.first_golf_time) {
        const time = new Date(this.userData.first_golf_time.replace(/\-/g, '/'))
        this.dateIndex = [time.getFullYear() - START_YEAR, time.getMonth()]
      } else {
        const [yList = [], mList = []] = this.dateArray
        this.dateIndex = [yList.length - 1, mList.length - 1]
      }
    },
    onDateColumnChange({ detail: { column, value } }) {
      this.$set(this.dateIndex, column, value)
    },
    onDateChange({ detail: { value }}) {
      const [yIndex, mIndex] = value
      const y = this.dateArray[0][yIndex].value
      const m = this.dateArray[1][mIndex].value
      this.$set(this.userData, 'first_golf_time', `${y}-${m}-01 00:00:00`)
    },
    openIntroduction() {
      this.$refs.inputPopupRef.open()
    },
    saveIntroduction(value) {
      this.userData.introduction = value;
      this.closeIntroduction()
      // 修改完成立即保存
      this.handleSave()
    },
    closeIntroduction() {
      this.$refs.inputPopupRef.close()
    }
  },
}
</script>

<style lang="scss" scoped>
.top-bg {
  // height: 186rpx;
  background: linear-gradient(180deg, rgba(30, 36, 31, 0.5) 0%, #003c3d 100%),
    url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/user-bg2.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.user-avatar {
  width: 120rpx;
  height: 120rpx;
}

.text-right {
  text-align: right;
}

.user-btn {
  min-width: 152rpx;
  height: 54rpx;
  background: #f9f9f9;
  border: 1.5rpx solid #1e3e42;
  border-radius: 4rpx;
  font-weight: 400;
  font-size: 24rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  &::after {
    content: '';
    border-radius: inherit;
    border: inherit;
  }
}

.get-phone-btn {
  
  border: 0rpx;
  padding: 0rpx 0rpx 0rpx 10rpx;

  background: #00000000;
  font-weight: 400;
  font-size: 32rpx;
  text-align: right;

  
  // display: flex;
  // justify-content: center;
  // align-items: center;

  &::after {
    content: '';
    border-radius: inherit;
    border: inherit;
  }
}

.save-btn {
  margin-top: 150rpx;
  width: 686rpx;
  height: 96rpx;
  line-height: 96rpx;
}
</style>