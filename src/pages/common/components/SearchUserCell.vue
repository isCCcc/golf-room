<template>
  <view class="root" :style="{ backgroundColor: rootBgColor}">
    <GAvatar class="avatar" :avatar-data="user" :size-in-rpx='100' :radius="'100%'" />
    <!-- 昵称和备注 -->
    <view class="mid" @click.stop="handleCellClick">
      <view class="mid-top">
        <view class="name-parts">
          <text class="name">{{ user.username || '用户' }}</text>
          <!-- <text class="name">{{ nameParts[0] }}</text>
          <text class="name-highlight">{{ nameParts[1] }}</text>
          <text class="name">{{ nameParts[2] }}</text> -->
          <!-- <mp-html :content="showKeyWord(keyword, user.username)" :copy-link="false" @linktap="handleLinkTap"></mp-html> -->
        </view>
        <image v-if="user && user.gender > 0" :src="`${ossUrl}/icons/${user.gender == 1 ? 'icon-male' : 'icon-female'}.png`" class="gender"/>
      </view>
      <view class="mid-bot">
        <text v-if="subtitle && subtitle.length > 0" class="subtitle">{{ subtitle }}</text>
      </view>
    </view>
    <view class="right">
      <view class="profile-btn" @click.stop="handleCellClick">{{ '主页' }}</view>
    </view>
  </view>
</template>

<script>
import GAvatar from '@/components/g-avatar/g-avatar.vue';
import mpHtml from "@/components/mp-html/components/mp-html/mp-html.vue"

export default {
  emits: ['changeFollow', 'delete'],
  components: {
    GAvatar,
    mpHtml,
  },
  props: {
    user: {
      type: [Object, undefined],
      default: undefined,
    },

    keyword: {
      type: [String, undefined],
      default: undefined,
    },

    showExtra: {
      type: [Boolean],
      default: false,
    }
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
    };
  },
  computed: {
    rootBgColor() {
      return '#FFFFFF00'
    },
    nameParts() {
      const userName = this.user.username;
      const keyword = this.keyword;
      const sIndex = userName.indexOf(keyword) 
      {
        // Test code
        console.log('name parts', userName.split(keyword));
      }
      if (userName == undefined || userName.length < 1 ||  keyword == undefined || keyword.length < 1) {
        return [this.user.name || '', '', '']
      }
      
      let parts = userName.split(keyword);
      if (sIndex == 0) {
        parts = []
      }
      if (parts)
      return 
    },
    subtitle() {
      var subtitle = '';
      if (this.user.fans_count) {
        subtitle = `${subtitle.length > 0 ? subtitle + " " : ""}粉丝${this.user.fans_count}`
      }
      if (this.user.hcp) {
        subtitle = `${subtitle.length > 0 ? subtitle + " " : ""}差点${this.user.hcp}`
      }
      return subtitle;
    },
  },
  methods: {
    showKeyWord(keyword, targetStr) {
      let str = targetStr;
      if (keyword && keyword.length > 0) {
        // 1.传入关键词数组keyWordArr
        let keyWordArr = keyword.split('');

        // 2.定制关键词对应正则
        keyWordArr.forEach(e => {
          let regStr = '' + `(${e})`;
          let reg = new RegExp(regStr, "g");
          // 3.正则替换，关键词飘红
          str = str.replace(reg, '<span style="color:red;">' + e + '</span>')
        })
      }

      {
        // Test code
        console.log('showKeyWord', keyword, targetStr, str);
      }
      return str;
    },
    handleCellClick() {
      if (this.user?.uid) {
        uni.navigateTo({
          url: `/pages/tabbar/profile/UserProfile?uid=${this.user.uid}`,
          fail: (e) => {
            console.error(e);
          }
        });
      }
    },
    followBtnClick() {
      this.$emit('changeFollow', this.user)
    },
    closeBtnClick() {
      this.$emit('delete')
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  padding: 6rpx 32rpx;
  gap: 20rpx;

  .avatar {
    padding: 12rpx;
  }

  .mid {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8rpx;

    .mid-top {
      display: flex;
      align-items: center;
      gap: 10rpx;
      
      .name-parts {
        @include ell(1);
        font-weight: 400;
        font-size: 28rpx;
        line-height: 40rpx;
        color: #000000;
        
        .name-highlight {
          color: #95D171;
        }
      }

      .gender {
        width: 24rpx;
        min-width: 24rpx;
        height: 24rpx;
      }
    }

    .mid-bot {
      .subtitle {
        @include ell(2);
        font-weight: 400;
        font-size: 22rpx;
        line-height: 114%;
        color: #999999;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .profile-btn {
      
      padding: 16rpx 20rpx;

      border: 2rpx solid #1E3E42;
      border-radius: 1rpx;

      font-weight: 400;
      font-size: 24rpx;
      line-height: 108.5%;

      color: #1E3E42;

      .profile-btn-title {

      }
    }
  }
}
</style>
