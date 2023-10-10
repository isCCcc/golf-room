<template>
  <view class="avatarContainer"
        :style="{
          width: sizeInRpx + 'rpx',
          height: sizeInRpx + 'rpx',
          border: border,
          'border-radius': radius,
          boxSizing: boxSizing,
          backgroundImage: 'url(' + defaultAvatarForBg + ')',
          }"
        >
    <image class="avatar"
      :style="{
        'border-radius': radius,
        boxSizing: boxSizing
      }"
      :src="avatarUrl"
      mode="aspectFill"
      @click="handleAvatarClick"
    />
  </view>
</template>

<script>
import { defaultAvatar, filteringEmptyOrWXDefault, genderedAvatar, ossResize } from '@/utils/image';

export default {
  components: {
    // UserModal
  },
  props: {
    avatarData: {
      type: [Object, undefined],
      default: {},
    },

    /**
     * In rpx
     */
    sizeInRpx: {
      type: [Number],
      default: '68',
    },

    /**
    * In rpx
    */
    border: {
      type: [String],
      default: '0rpx',
    },

    radius: {
      type: [String],
      default: '0rpx',
    },

    boxSizing: {
      type: [String],
      default: 'content-box'
    },

    /**
     * 是否处理点击事件，默认处理
     */
    handleClick: {
      type: [Boolean],
      default: true,
    },

    customClickHandling: {
      type: [Boolean],
      default: false,
    },
  },
  data() {
    return {
      // In px
      avatarRealWidth: 0,
      defaultAvatarForBg: defaultAvatar(),
    }
  },
  computed: {
    avatarUrl() {
      return ossResize(
        genderedAvatar(this.avatarData),
        null,
        this.sizeInRpx
      )
    },
  },
  methods: {
    handleAvatarClick() {
      if (this.handleClick == false) return;
      
      if (this.avatarData.hasOwnProperty('user_type') && this.avatarData.user_type == 0) {
        return uni.showToast({
          icon: 'none',
          title: '该用户为虚拟用户'
        });
      }

      if (this.customClickHandling) {
        this.$emit('avatar-click')
        return;
      }

      // 默认操作: 跳转用户详情
      if (this.avatarData?.uid) {
        this.gotoProfile()
      }
    },
    gotoProfile() {
      uni.navigateTo({
        url: `/pages/tabbar/profile/UserProfile?uid=${this.avatarData.uid}`,
        fail: (e) => {
          console.error(e);
        }
      });
    },
  },
}
</script>
<style lang="scss" scoped>
.avatarContainer {
  overflow: hidden;
  box-sizing: content-box;

  // 通过 style 来设置，避免打包的时候，转成 base64
  // background-image: url($ico_default_user_avatar);
  background-color: white;
  background-size: 100%;
  background-repeat: no-repeat;

  .avatar {
    width: 100%;
    height: 100%;

    // background: #ddd;
    // box-sizing: content-box;
    // background-position: center;
    // background-size: contain;
    // background-repeat: no-repeat;
  }
}

</style>
