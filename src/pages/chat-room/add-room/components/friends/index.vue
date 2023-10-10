<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <UniPopup background-color="#fff" type="bottom" ref="popup" :isMaskClick="false">
    <view>
      <!-- S 操作 -->
      <view class="flex-between plr-32 h-112 border-b">
        <text class="fw-500 col-999 fs-32" @click="close">取消</text>
        <text class="fs-32 fw-500 col-black">{{group}}组</text>
        <text class="col-1e3 fs-32 fw-500" @click="handleSub">确定</text>
      </view>
      <!-- E 操作 -->

      <view class="popup-body">
        <!-- S 分享操作 -->
        <view v-if="sharing" class="plr-32 border-b">
          <view v-if="havePageSharing" class="h-120 flex border-b">
            <GCell :isLink="true" class="flex1">
              <template #left>
                <button class="flex h-120 fs-28 fw-400 share" style="color: #000000!important;" open-type="share">
                  <image
                    class="icon"
                    src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/share-wechat.png"
                  />
                  分享到微信
                </button>
              </template>
            </GCell>
          </view>
          <view v-if="haveGoShareQRCode" class="h-120 flex border-b">
            <GCell :isLink="true" class="flex1">
              <template #left>
                <view class="flex fs-28 fw-400 h-120 w-auto col-black" @tap="goShareQRCode">
                  <image
                    class="icon"
                    src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/share-qrcode.png"
                  />
                  二维码
                </view>
              </template>
            </GCell>
          </view>
          <view v-if="canCreateVirtual" class="h-120 flex">
            <GCell :isLink="true" class="flex1" :style="{ 'opacity': isFull ? '30%' : 'inherit' }">
              <template #left>
                <view class="flex fs-28 fw-400 h-120 w-auto col-black" @tap="handleCreateVirtualUser">
                  <image
                    class="icon"
                    src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_friend_choosing_add.svg"
                  />
                  添加虚拟球员
                </view>
              </template>
            </GCell>
          </view>
        </view>
        <!-- E 分享操作 -->
        <!-- S 好友列表 -->
        <template>
          <view>
            <view v-if="sharing" class="plr-32 key-index fs-24 fw-500"></view>
            
            <!-- 搜索 -->
            <uni-search-bar ref="searchBar"
                            class="search-bar" 
                            radius="1" 
                            bgColor="#F9F9F9" 
                            border="1rpx solid #E4E4E4"
                            placeholder="搜索用户" 
                            clearButton="auto" 
                            cancelButton="none" 
                            @confirm="handleSearch"
                            @clear="clear"/>
            
            <scroll-view class=" scroll-view" scroll-y @scrolltolower="loadMore" v-if="displayingList.length">
              <view class="plr-32">
                <template v-for="item in displayingList">
                  <view :key="item.uid" class="h-120 flex border-b" @tap="onSelect(item)">
                    <GCell :isLink="false" class="flex1">
                      <template #left>
                        <view class="flex w-full">
                          <GAvatar :avatar-data="item" :size-in-rpx='80' :radius="'100%'" :handle-click="false"/>
                          <view class="ml-20 flex-1">
                            <view class="fs-28 fw-400 col-black">{{ item.username }}</view>
                            <view class="flex">
                              <text class="fs-22 fw-400 col-999">差点：</text>
                              <text class="fs-26 fw-500 col-black">{{ item.hcp != null && item.hcp != 'null' ? item.hcp : '-' }}</text>
                            </view>
                          </view>
                          <view class="fs-22 fw-400 col-999 mr-20 ml-20" v-if="!searchUsers">
                            同组<text class="fs-26 fw-500 col-black ml-8 mr-8 d">{{ item.played_times || 0 }}</text>次
                          </view>
                        </view>
                      </template>
                      <template #right>
                        <g-checkbox
                          :checked="checked(item.uid)"
                          :disabled="disabled.includes(item.uid)"
                          size="42rpx"
                          circle
                        />
                      </template>
                    </GCell>
                  </view>
                </template>
              </view>
            </scroll-view>
            <view class="tc col-999 fs-26 plr-32 fw-400" v-else>暂无相关用户</view>
          </view>
        </template>
        <!-- E 好友列表 -->
      </view>
    </view>

    <VirtualUserCreate ref="virtualUserCreate" @virtual-user-info="onNewVirtualUserInfo"/>
  </UniPopup>
</template>

<script>
import UniPopup from '@components/uni-popup/uni-popup.vue'
import GCell from '@components/g-cell/index.vue'
import { getfriendList, searchUsers } from '@api/user'
import { PAGE_CHAT_SHARE_TYPE, shareCompetitionInvite } from '@/utils/share'
import { guid } from '@/utils'
import GAvatar from '@/components/g-avatar/g-avatar.vue'
import VirtualUserCreate from '../virtual-user-create/index.vue'
import { awaitWrap } from '@/utils/function-helper'
import { createVirtualUser } from '@/api/competition'

export default {
  components: {
    UniPopup,
    GCell,
    GAvatar,
    VirtualUserCreate,
},
  data() {
    return {
      injectedShareId: guid(),
      competition: null,
      sharing: null,
      canCreateVirtual: false,
      list: [],
      oldUsers: [],
      selected: [],
      disabled: [],
      newVirtualUsers: [],
      group: '',
      keyword:'',
      searchUsers: false,
      users: {
        list: [],
        noMore: false,
      },
      tmpSelectedUids: [],
    }
  },
  computed: {
    displayingList() {
      const dList = []
      if (!this.searchUsers) {
        dList.push(...this.usersNotInFriendsList)
        dList.push(...this.newVirtualUsers)
      }

      dList.push(...this.list)
      return dList
    },
    usersNotInFriendsList() {
      const listUserIds = this.list?.map((user) => user.uid) || []
      return this.oldUsers.filter((user) => !listUserIds.includes(user.uid)) || [] 
    },
    isFull() {
      return this.selected.length >= 4
    },
    checked() {
      return (uid) => this.selected.some((item) => item.uid === uid)
    },

    havePageSharing() {
      return this.sharing?.pageSharing != null
    },
    haveGoShareQRCode() {
      return this.sharing?.goShareQRCode != null
    }
  },
  created() {
    this.getfriendList()
  },
  methods: {
    // 打开
    open({ users, group }, disabled, sharing, competition, canCreateVirtual = false) {
      console.log('Friends open', competition);
      this.competition = competition
      this.shareGroup(group)
      this.oldUsers = [...users]
      this.selected = users
      this.disabled = disabled
      this.sharing = sharing
      this.canCreateVirtual = canCreateVirtual

      this.$refs.popup.open()

      console.log('sharing', sharing);

      if (sharing?.pageSharing) {
        this.setTopPageInjectedShare({ id: this.injectedShareId, share: sharing.pageSharing() })
      }
    },
    getfriendList() {
      let params = {
        sort: 2
      }
      getfriendList(params).then((res) => {
        if (res.data?.code === 0) {
          const { list } = res.data.data
          this.list = list
        }
      })
    },
    // 关闭
    close() {
      this.shareGroup('')
      this.$refs.popup.close()
      this.$refs.searchBar.clear()
      this.sharing = null
      this.newVirtualUsers = []
      this.removeTopPageInjectedShare(this.injectedShareId);
    },
    // 发送给页面的组名，用于分享
    shareGroup(data) {
      this.group = data
      uni.$emit('shareGroup', data)
    },
    async handleSub() {
      const virtualUsersToAdd = this.selected.filter((user) => user.uid < 0)
      if (virtualUsersToAdd.length > 0) {
        uni.showLoading({
          title: '创建虚拟球手中',
          mask: true
        })

        var createErr = null
        for(let user of virtualUsersToAdd) {
          const [err, res] = await awaitWrap(createVirtualUser({
            competition_id: this.competition?.competition_id,
            group: this.group,
            username: user.username,
            gender: user.gender,
          }, false))
          console.log('handleSub', err, res);
          const realUid = res?.data?.data?.uid;
          if (err) {
            createErr = err
            break;
          } else if (realUid == null) {
            createErr = new Error("Failed to create user")
          }
          user.uid = realUid
        }

        uni.hideLoading()
        if (createErr) {
          uni.showToast({
            title: '创建虚拟球员失败' + (createErr?.data?.msg ? ': ' + createErr?.data?.msg : '') + '。请重试，或者取消选择',
            icon: 'none',
            mask: false
          })
          return;
        }
      }
      

      this.tmpSelectedUids = []
      this.$emit('confirm', [...this.selected])
      this.close()
    },
    onSelect(row) {
      if (this.disabled.includes(row.uid)) return

      const index = this.selected.findIndex((item) => item.uid === row.uid)
      if (index === -1) {
        if (this.selected.length >= 4) return
        this.selected.push(row)
        this.tmpSelectedUids.push(row.uid)
      } else {
        this.selected.splice(index, 1)
        let tmpIndex = this.tmpSelectedUids.findIndex((item) => item === row.uid)
        tmpIndex > 0 ? this.selected.splice(tmpIndex, 1) : null
      }
    },
    goShareQRCode() {
      this.sharing?.goShareQRCode()
    },
    handleCreateVirtualUser() {
      if (this.isFull) {
        uni.showToast({
          title: '已满员',
          icon: 'error',
          mask: false,
        })
        return
      }

      this.$refs.virtualUserCreate?.open()
    },
    onNewVirtualUserInfo(virtualUserInfo) {
      const nextUid = this.newVirtualUsers.reduce((nextUid, user) => {
        return (user.uid && user.uid <= nextUid) ? user.uid - 1 : nextUid
      }, -1) 
      virtualUserInfo.uid = nextUid
      virtualUserInfo.group = this.group
      this.selected.push(virtualUserInfo)
      this.newVirtualUsers.push(virtualUserInfo)
    },
    verification(e) {
        this.keyword = e.detail.value.trim();//e.detail.value.replace(/\s+/g, '')
    },
    async handleSearch(result) {
      //this.$refs.searchBar.cancel();
      if (this.keyword == result.value.trim()) {
        return;
      }
      this.keyword = result.value.trim()
      if (this.keyword !== '') {
        this.searchForUsers({ refresh: true })
        //重新搜索了就要重置选择了又未保存的
        this.resetSelected()
        this.searchUsers = true
      } else {
        this.getfriendList()
        //重新搜索了就要重置选择了又未保存的
        this.resetSelected()
        this.searchUsers = false
        this.users = {
          list: [],
          noMore: false,
        }
      }
    },
    async searchForUsers({ start = 0, count = 20, refresh = false, gl = true}) {
      if (this.users.noMore && refresh == false) {
        return;
      }
      const keyword = this.keyword;
      const { data: { data } } = await searchUsers({ start: (refresh ? 0 : start), count, keyword }, gl)
      if (refresh) {
        this.users.list.length = 0;
        this.users.noMore = false;
      }
      this.users.list.push(...data.list);
      if (data.list.length < count) {
        this.users.noMore = true;
      }
      this.list = this.users.list
    },
    searchBlur() {
      if (this.keyword == '') {
        this.$refs.searchBar.cancel();
      }
    },
    loadMore() {
      if (this.searchUsers) {
        this.searchForUsers({start: this.users.list.length})
      }
    },
    resetSelected() {
      if (this.tmpSelectedUids.length == 0) 
      {
        return
      }
      this.selected = this.selected.filter((item) => {
        let uid = item.uid
        return this.tmpSelectedUids.indexOf(uid) == -1
      })
    },
    clear() {
      if (!this.searchUsers) {
        return
      }
      this.getfriendList()
      this.resetSelected()
      this.keyword = ''
      this.searchUsers = false
      this.users = {
        list: [],
        noMore: false,
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.popup-body {
  height: 75vh;
  //overflow-y: scroll;
}

.h-112 {
  height: 112rpx;
  line-height: 112rpx;
}
.h-120 {
  height: 120rpx;
}
.key-index {
  height: 38rpx;
  line-height: 38rpx;
  background-color: $bg-col-f9;
}
.ml-20 {
  margin-left: 20rpx;
}
.share {
  padding: 0;
  // font-size: inherit;
  line-height: inherit;
  background-color: transparent;
  color: inherit;
  width: 100%;

  &::after {
    border: none;
  }
}
.icon {
  width: 50rpx;
  height: 50rpx;
  flex-shrink: 0;
  margin-right: 8rpx;
}
.search-container {
  margin: 32rpx 32rpx;
  background: #F9F9F9;
  border: 1px solid #E4E4E4;
  width:686rpx;
  height:60rpx;
  border-radius:1rpx;
  // align-items: center;
}
::v-deep .uni-searchbar {
  padding: unset;
}
.scroll-view {
  height: 50vh;
  overflow: scroll;
}
</style>
