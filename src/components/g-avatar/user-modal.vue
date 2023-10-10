<template>
  <uni-popup background-color="#fff"
             type="bottom"
             ref="popup">
      <view class="plr-40">
        <view class="flex">
          <view class="flex-1 flex">
            <GAvatar class="" :avatar-data="userInfo" :size-in-rpx='110' :radius="'100%'" handle-click="false"/>
            <view class="ml-16">
              <view>
                <text class="col-black fw-600 fs-32 lh-44">{{ userInfo.username }}</text>
                <image v-if="gender"
                      :src="`${ossUrl}/icons/${ gender == 1 ? 'icon-male' : 'icon-female'}.png`"
                      class="icon-gender"
                      mode="widthFix" />
              </view>
              <view v-if="ipLocation" class="ip-location">{{ ipLocation }}</view>
            </view>
          </view>
          
          <view v-if="userInfo.hcp">
            <view class="Rubik fw-500 col-black tc fs-40">{{userInfo.hcp}}</view>
            <view class="hcp-text">近10场均值差点</view>
          </view>
        </view>
        
        <view class="flex friendship mt-12">
          <view>
            <span>{{ following }}</span>
            <span class="unit">{{ ' ' + '关注' }}</span>
          </view>
          <view>
            <span>{{ followed }}</span>
            <span class="unit">{{ ' ' + '粉丝' }}</span>
          </view>
        </view>
        
         <text class="intro">{{ intro }}</text>
         
         <view class="flex mt-20">
           <view class="mr-24" v-if="!isMe && isLogin" :class="isFollowing ? 'follow following' : 'follow'" @click="handleFollowBtnClick()">
             {{isFollowing ? '已关注' : '关注'}}
           </view>
           <view class="flex-1 goto-profile" @click="gotoProfile()">
             查看主页
           </view>
         </view>
      </view>
  </uni-popup>
</template>

<script>
import GAvatar from '@/components/g-avatar/g-avatar.vue'

import { getOtherUserInfo, unfollowUser, followUser } from '@/api/user'

import { mapGetters } from 'vuex'
import { awaitWrap } from '@/utils/function-helper';

export default {
  components: {
    GAvatar,
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
      userInfoData: {},
      targetId: null,
    };
  },
  computed: {
    ...mapGetters({
      isLogin: 'user/isLogin',
      isAuth: 'user/isAuth',
      meUserInfoInStore: 'user/userInfo',
    }),
    isMe() {
      return this.targetId === this.meUserInfo.uid;
    },
    isFollowing() {
      return this.userInfo.is_follow || false;
    },
    
    following() {
      return this.userInfo.follow_count || '--'
    },
    
    followed() {
      return this.userInfo.fans_count || '--'
    },
    
    intro() {
      const intro = this.userInfo.introduction;
      return (intro && intro.length > 0) ? intro : '这个人很懒一句话都没有写！';
    },
    userInfo() {
      return (this.isMe ? this.meUserInfoInStore : this.userInfoData) || {}
    },
    gender() {
      return this.userInfo.gender || 0
    },
    ipLocation() {
      var locationNames = []
      if (this.userInfo.ip_addr) {
        locationNames.push(this.userInfo.ip_addr)
      }
      return locationNames.length > 0 ? 'IP属地：' + locationNames.join(' ') : '';
    },
    meUserInfo() {
      return this.meUserInfoInStore || {};
    },
  },
  methods: {
    async loadData(target, gl = true) {
      this.targetId = target.uid || 0
      if (this.targetId == 0) {
        return
      }
      let userInfoData = {}
      // 先把有的数据赋值上,随后请求接口的时候再更新
      target?.avatar_url ? userInfoData.avatar_url = target?.avatar_url : null
      target?.username ? userInfoData.username = target?.username : null
      target?.ip_addr ? userInfoData.ip_addr = target?.ip_addr : null
      target?.hcp ? userInfoData.hcp = target?.hcp : null
      target?.gender ? userInfoData.gender = target?.gender : null
      target?.introduction ? userInfoData.introduction = target?.introduction : null
      target?.follow_count ? userInfoData.follow_count = target?.follow_count : null
      target?.fans_count ? userInfoData.fans_count = target?.fans_count : null
      target?.is_follow ? userInfoData.is_follow = target?.is_follow : null
      
      this.userInfoData = userInfoData
      this.$refs.popup.open()
      
      console.log(`userInfoData have ${Object.keys(this.userInfoData).length} keys`)
      
      if (this.isMe) {
        this.isAuth && this.$store.dispatch('user/GET_USER_INFO', { showLoadingWithData: false })
      } else if (Object.keys(this.userInfoData)?.length != 9) {  //数据都有就不请求接口了
        const [err, res] = await awaitWrap(getOtherUserInfo({ uid: this.targetId }, gl))
        if (err) {
          this.$nextTick(() => {
            uni.showToast({
              title: err?.data?.msg || '加载失败，请重试',
              icon: 'none',
              mask: false
            })
            this.$refs.popup.close()
          })
          return;
        }

        const newUserInfo = res?.data?.data
        if (newUserInfo == null || newUserInfo.hasOwnProperty('user_type') && newUserInfo.user_type == 0) {
          this.$nextTick(() => {
            uni.showToast({
              title: '该用户为虚拟用户',
              icon: 'none',
              mask: false
            })
            this.$refs.popup.close()
          })
          return
        }

        this.userInfoData = res.data.data;
        // await getOtherUserInfo({uid: this.targetId}, gl).then(({ data: { data } }) => {
        //   this.userInfoData = data;
        // });
      }
    },
    handleFollowBtnClick() {
      if (this.grTryShowAuthorization()) { return }
      const gl = false;
      const apiPromise = this.isFollowing ? unfollowUser : followUser;
      apiPromise({ friend_uid: this.userInfo.uid}, gl).then(({ data: { data } }) => {
        uni.showToast({
          title: !this.isFollowing ? '关注成功' : '取消成功',
          icon: 'success',
        })
        this.userInfo.is_follow = !this.isFollowing
      });
    },
    gotoProfile() {
      uni.navigateTo({
        url: `/pages/tabbar/profile/UserProfile?uid=${this.targetId}`,
        fail: (e) => {
          console.error(e);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .plr-40 {
    padding: 40rpx;
  }
  .icon-gender {
    margin-left: 6rpx;
    width: 25rpx;
    height: 25rpx;
  }
  .ip-location {
    font-weight: 400;
    font-size: 22rpx;
    line-height: 31rpx;
    margin-top: 4rpx;
    color: rgba(0, 0, 0, 0.6);
  }
  .hcp-text {
    font-family: PingFang HK;
    font-size: 24rpx;
    font-weight: 500;
    line-height: 34rpx;
    letter-spacing: -0.3rpx;
    text-align: center;
    color: #666666;
  }
  .friendship {
    display: flex;
    gap: 20rpx;
    font-weight: 600;
    font-size: 32rpx;
    line-height: 45rpx;
    color: #000000;
    .unit {
      font-weight: 400;
      font-size: 24rpx;
      line-height: 34rpx;
      color: rgba(0, 0, 0, 0.6);
    }
  }
  .intro {
    margin-top: 12rpx;
    flex: 1;
    font-weight: 400;
    font-size: 24rpx;
    line-height: 34rpx;
    color: #666666;
  
    @include ell(10); // 设定最多显示的行数。按照限制，应该用不了 10 行那么多，防止意外。
  }
  .follow {
    width: 320rpx;
    height: 87rpx;
    line-height: 87rpx;
    text-align: center;
    background: #95D171;
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 4rpx;
    color: #1E3E42;
    font-size: 28rpx;
    font-weight: 500;
    &.following {
      background: rgba(0, 0, 0, 0.2);
    }
  }
  .goto-profile {
    height: 87rpx;
    line-height: 87rpx;
    text-align: center;
    border: 1rpx solid #1E3E42;
    border-radius: 4rpx;
    color: #1E3E42;
    font-size: 28rpx;
    font-weight: 500;
  }
</style>
