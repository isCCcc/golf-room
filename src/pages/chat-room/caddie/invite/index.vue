<template>
  <view id="page" class="root" :style="{ '--nav-height': navTotalHeight + 'px', '--bottom-safe-height': bottomSafeHeight + 'px'}">
    <GNavbar fixed :title="navBarTitle" class="nav" :bg-opacity="navBgOpacity" :bg-style="'#003C3D'" />
    <scroll-view scroll-y class="pa content-box" @scroll="scrollViewScroll">
      <view class="pa top-bg"></view>
      <!-- 球赛概览 -->
      <view class="flex-center com-brief">
        <!-- 时间部分 -->
        <view class="d-flex flex-column date-part">
          <view class="time">{{ startTime }}</view>
          <view class="day">{{ startDay }}</view>
        </view>
        <view class="mt-12 ml-28 mr-38 separator"></view>
        <view class="flex-1 flex-column name-part">
          <view class="name">{{ name }}</view>
          <view class="mt-6 course-name">{{ courseName }}</view>
        </view>
      </view>
      <!-- 球员分组 -->
      <view class="d-flex flex-column com-group-card">
        <view class="flex-center mt-30 mr-30 ml-30 group-top">
          <view class="group-title" >{{ targetGroupName || '-' }}</view>
          <view class="ml-12 group-icon"/>
        </view>
        <view class="flex-around competitor-list">
          <Competitor v-for="(item, index) in competitors" :key="index"
                      class="flex-1 competitor"
                      :competitor="item" />
        </view>
      </view>
      <!-- 分享卡片 -->
      <view v-if="iAmCompetitorInGroup" class="flex-center flex-column sharing-card">
        <view class='flex-center over-hid qr-code'>
            <img :style="{ width: '90%', height: '90%' }" :src="qrCode" />
        </view>
        
        <text class="qr-code-hint">球童使用微信「扫一扫」扫码，根据提示\n完成注册，进入房间即可记分。</text>
        <view class="caddie-container">
          <view class="caddie-title">{{ caddieTitle }}</view>
          <view class="caddie-list">
            <Caddie v-for="(caddie, index) in caddies" :key="index"
                    class="caddie"
                    :caddie="caddie"
                    :avatar-size-in-rpx="100"
                    :show-delete="caddie.localShowDelete"
                    @add="handleAdd"
                    @delete="handleDelete" />
          </view>
        </view>
        <view class="mt-40 mb-40 common-large-btn" @click="handleConfirm">
          <view>{{ confirmBtnTitle }}</view>
        </view>
        <view class="caddie-footnote">注：一位球童可为所有同组球手记分但不可夸组记分。每个小组最多容纳 4 位球童。</view>
      </view>
      <!-- 加入卡片 -->
      <view v-if="!iAmCompetitorInGroup" class="flex-center flex-column accepting-card">
        <!-- 球童部分 -->
        <view class="caddie-container">
          <view class="caddie-title">{{ caddieTitle }}</view>
          <view class="caddie-list">
            <Caddie v-for="(caddie, index) in caddies" :key="index"
                    class="caddie"
                    :caddie="caddie"
                    :avatar-size-in-rpx="100"
                    :show-delete="caddie.localShowDelete"
                    @add="handleAdd"
                    @delete="handleDelete" />
          </view>
        </view>
        <!-- 刷新按钮 -->
        <!-- <view class="mt-20 flex-center caddie-refresh" @click="？？">
          <view class="caddie-refresh-icon"></view>
          <view class="caddie-refresh-title">刷新状态</view>
        </view> -->
        <!-- 球童规则 -->
        <view class="mt-20 d-flex flex-column caddie-rules" @click="handleConfirm">
          <view v-for="(rule, index) in rules" :key="index" 
                class="d-flex rule-container">
            <!-- 规则序号 -->
            <view class="rule-serial">{{ index + 1 }}</view>
            <!-- 规则详情 -->
            <view>
              <span v-for="(rulePart, pIndex) in rule" :key="pIndex"
                    :class="['flex-1', rulePart.isBold == true ? 'rule-content-bold' : '']">
                    {{ rulePart.content }}
              </span>
            </view>
          </view>
        </view>
        <!-- 按钮 -->
        <view class="mt-40 common-large-btn" @click="handleConfirm">
          <view>{{ acceptConfirmBtnTitle }}</view>
        </view>
      </view>
      <!-- 底部 -->
      <view class="bottom-spacing-box"></view>
    </scroll-view>
    <view class="logo"></view>

    <!-- 添加分组 -->
    <Friends ref="setFriendsModal" @confirm="handleFriendsConfirm" />

    <!-- 自定义授权弹窗：注意要在 page.json 里面定义里去掉默认的；`"label": []` -->
    <GrAuthPopup ref="grAuthPopup">
      <!-- auth-stage-content -->
      <template v-slot:authStageContent="">
        <view class="flex flex-column auth-invite-slot">
          <GAvatar class="invite-avatar" :avatar-data="inviter" :size-in-rpx='120' :radius="'100%'" handle-click="false" />
          <text class="invite-title">{{ inviteTitle }}</text>
        </view>
      </template>
    </GrAuthPopup>
  </view>
</template>

<script>
import GNavbar from "@/components/g-navbar/index.vue";
import Friends from '@pages/chat-room/add-room/components/friends/index.vue';
import { listCaddies, batchAddCaddies, caddieSave } from "@api/competition";
//vuex
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import Competitor from "./components/competitor.vue";
import Caddie from "./components/caddie.vue";
import { getCompetitionDetail } from "@/api/chat-room";
import { PAGES, generatePageShareParamString, shareCompetitionCaddieInvite } from "@/utils/share";
import { getWxQRCode } from "@/api/utils";
import { awaitWrap } from "@/utils/function-helper";
import { realtimeLogger } from "@/mixins/gr-mp-logging";
import GrAuthPopup from "@/components/auth-popup/gr-auth-popup.vue";
import GAvatar from "@/components/g-avatar/g-avatar.vue";

export default {
  components: {
    GNavbar,
    Competitor,
    Caddie,
    Friends,
    GrAuthPopup,
    GAvatar
  },
  data() {
    return {

      navTotalHeight: 0,
      sysSafeBottomHeight: 0,
      contentHeightUnderNav: 0,
      contentScrollOffset: 0,

      /**
       * @type Number 邀请者的 ID
       */
      fromUid: null,
      /**
       * @type Competition 球赛
       */
      competition: null,

      maxCaddies: 4,
      cachedAllCaddies: [],

      rules: [
        [
          {
            content: '球童可为所有',
            isBold: false,
          },
          {
            content: '同组球手',
            isBold: true,
          },
          {
            content: '记分但不可夸组记分',
            isBold: false,
          },
        ],
        [
          {
            content: '每一个小组最多容纳 4 位球童',
            isBold: false,
          }
        ],
      ],

      qrCode: null,

      // loading: false,
      // competitionId: "",
      // competitionNo: "",
      // roomType: "new", // new新建 edit修改
      // tempGroup: "",
    };
  },
  computed: {
    ...mapGetters(["getCompetitionData"]),
    ...mapGetters({
      userInfo: "user/userInfo",
      isAuth: 'user/isAuth',
    }),
    /**
    *  底部安全距离。In px
    */
    bottomSafeHeight() {
      return this.sysSafeBottomHeight
    },
    // 导航拦标题
    navBarTitle() {
      return `邀请球童`
    },
    navBgOpacity() {
      if (this.contentHeightUnderNav <= 0) return 0;
      const beginPos = 10; // 变化开始位置。
      const percentage = (this.contentScrollOffset < beginPos || this.contentHeightUnderNav <= 0) ? 0 : this.contentScrollOffset / this.contentHeightUnderNav;
      return Math.min(Math.max(0, percentage), 1);
    },
    competitionStart() {
      return this.competition?.start_time ? dayjs(this.competition.start_time).locale('zh-cn') : null
    },
    startTime() {
      return this.competitionStart?.format('HH:mm') || '--:--'
    },
    startDay() {
      return this.competitionStart?.format('YYYY/MM/DD') || '----/--/--'
    },
    name() {
      return this.competition?.competition_name || '--'
    },
    courseName() {
      return this.competition?.course_name || '--'
    },

    targetGroup() {
      return this.competition?.competitor_list.find((competitor) => {
        return competitor.uid === this.fromUid
      })?.group || undefined
    },
    targetGroupName() {
      return this.targetGroup ? this.targetGroup + '组' : null
    },

    competitors() {
      if (this.targetGroup == null) return [];
      return this.competition?.competitor_list?.filter((com) => { return com.group === this.targetGroup }) || []
    },

    inviter() {
      return this.competitors.find(competitor => { return this.fromUid === competitor.uid })
    },

    inviteTitle() {
      return `${this.inviter?.username}邀请您成为球童`
    },

    isValidInvite() {
      return this.inviter != null
    },

    iAmCaddieInCompetition() {
      return this.cachedAllCaddies?.find(caddie => { return this.userInfo.uid === caddie.uid }) || false
    },
    iAmCaddieInGroup() {
      return this.caddies?.find(caddie => { return this.userInfo.uid === caddie.uid }) || false
    },
    iAmCompetitorInGroup() {
      const meCompetitor = this.competitors.find(competitor => { return this.userInfo.uid === competitor.uid })
      return meCompetitor != null
    },
    

    caddieTitle() {
      return (this.targetGroupName ? this.targetGroupName + ' · ' : '') + `球童`
    },
    caddies() {
      const targetCaddies = [...Array(this.maxCaddies)].map((val, index) => {
        return { username: `球童${index+1}` }
      })

      if (this.targetGroup) {
        const realCaddies = this.currentGroupCaddies
        // const realCaddies = this.cachedAllCaddies;
        realCaddies.forEach((caddie, index) => {
          caddie.localShowDelete =
            this.userInfo.uid === this.fromUid // 我是分享者
            || this.userInfo.uid === caddie.uid // 或者球童是我自己
        })

        for (let index = 0; index < targetCaddies.length; index++) {
          const realCaddie = realCaddies[index]
          if (realCaddie) {
            targetCaddies.splice(index, 1, realCaddie)
          }
        }
      }
      return targetCaddies
    },
    currentGroupCaddies() {
      return this.cachedAllCaddies.filter((caddie) => { return caddie.group == this.targetGroup }) || []
    },

    confirmBtnTitle() {
      return '确定并返回房间'
    },
    acceptConfirmBtnTitle() {
      return this.iAmCaddieInGroup ? '进入房间开始记分' : '进入房间'
    },
  },
  watch: {
    isAuth(newVal, oldVale) {
      if (oldVale == false && newVal == true) {
        this.tryAddMySelfToCaddies();
      }
    },
    iAmCompetitorInGroup(nVal, oVal) {
      const menus = ['shareTimeline']
      if (nVal != true) {
        menus.push('shareAppMessage')
      }

      uni.hideShareMenu({ menus: menus })
    },
  },
  onLoad(options) {
    // console.log("options", options);

    this.fromUid = Number(options.fUid);
    this.competitionId = Number(options.cid);
    this.group = options.group; 

    const sysInfo = uni.getSystemInfoSync();
    this.sysSafeBottomHeight = sysInfo.safeAreaInsets.bottom;
    const navigationBarBottom = sysInfo.statusBarHeight + 44;
    this.navTotalHeight = navigationBarBottom;
  },
  mounted() {
    this.loadCompetitionIfNeed();
  },
  onReady() {
    uni.createSelectorQuery()
      .in(this)
      .select('.top-bg')
      .boundingClientRect(({ height }) => {
        console.log("contentHeightUnderNav", height);
        this.contentHeightUnderNav = height - this.navTotalHeight;
      })
      .exec();
  },
  methods: {
    async loadCompetitionIfNeed() {
      if (this.competitionId == null) {
        return;
      }

      if (this.competition == null) {
        let { data: { data } } = await getCompetitionDetail({ competition_id: this.competitionId });
        this.competition = data
      }

      this.synAllCaddies(this.competition?.caddie_briefs || [])

      if (this.isValidInvite != true) {
        uni.showToast({
          title: '邀请已失效',
          icon: 'error',
          mask: false
        })
        return
      }

      if (this.iAmCompetitorInGroup) {
        const res = await this.getQrCode()
      } else {
        this.tryAddMySelfToCaddies();
      }
    },

    async getQrCode() {

      /*
        {
          page: PAGES.caddieInvite,
          params: {"fUid":361,"cid":214,"group":"A"}
        },
      */
      const paramsStr = generatePageShareParamString(
        {
          page: PAGES.caddieInvite,
          params: {
            fUid: this.userInfo.uid,
            cid: this.competitionId,
            group: this.group,
          }
        }
      );

      // this.competition?.caddie_briefs?.filter((caddie) => { return caddie.group == this.targetGroup }) || []
      this.synAllCaddies(this.competition?.caddie_briefs || [])

      const res = await getWxQRCode({ scene: paramsStr })
      if (typeof res.data === 'string') {
        this.qrCode = 'data:image/png;base64,' + res.data
      }
    },

    checkIfValid() {
      if (this.competition == null || this.competition) {

      }
    },

    async tryAddMySelfToCaddies() {

      if (this.grTryShowAuthorization()) {
        return;
      }

      if (this.iAmCaddieInCompetition) {
        return;
      }

      const [cErr, cRes] = await awaitWrap(
        new Promise((resolve, reject) => {
          uni.showModal({
            title: '是否成为本组的球童？',
            cancelText: '取消',
            confirmText: '确认',
            confirmColor: '#95D171',
            success: async (res) => {
              if (res.confirm) {
                resolve(true)
                // this.addToCaddieToCache(this.userInfo)

              } else if (res.cancel) {
                resolve(false)
              }
            }
          });
        })
      )

      if (cErr || cRes == false) {
        return;
      }

      uni.showLoading()

      const [err, res] = await awaitWrap(caddieSave({
        competition_id: this.competition?.competition_id,
        group: this.targetGroup,
        action: 1,
      }, false))

      const [rErr, rRes] = await awaitWrap(this.refreshCaddies(false))

      uni.hideLoading()

      if (err) {
        uni.showToast({
          title: '保存失败, 请重试',
          icon: 'none',
          mask: false
        })
      }
    },

    async tryDeleteMeCaddieFromCaddies() {
      if (this.grTryShowAuthorization()) {
        return;
      }

      if (!this.iAmCaddieInCompetition) {
        return;
      }

      uni.showLoading()

      const [err, res] = await awaitWrap(caddieSave({
        competition_id: this.competition?.competition_id,
        group: this.targetGroup,
        action: 0,
      }, false))

      const [rErr, rRes] = await awaitWrap(this.refreshCaddies(false))

      uni.hideLoading()

      if (err) {
        uni.showToast({
          title: '保存失败, 请重试',
          icon: 'none',
          mask: false
        })
      }
    },

    async refreshCaddies(gl = false) {
      const { data: { data } } = await listCaddies({
        competition_id: this.competition?.competition_id
      }, gl)
      this.synAllCaddies(data)
    },

    synAllCaddies(allCaddies) {
      this.cachedAllCaddies = [...allCaddies]
      if (this.competition) {
        this.competition.caddie_briefs = [...allCaddies]
      }
    },

    addToCaddieToCache(caddie) {
      if (caddie == null) return;
      const realCaddies = this.currentGroupCaddies
      if (realCaddies.length >= this.maxCaddies) {
        uni.showToast({
          title: `最多设置 ${this.maxCaddies} 个球童`,
          icon: 'none',
          mask: true
        })
      }
      caddie.group = this.targetGroup
      this.cachedAllCaddies.push(caddie)

      this.applyCaddiesChanges();
    },
    deleteCaddieFromCache(caddieToDelete) {
      if (caddieToDelete == null) return;
      const allCaddies = this.cachedAllCaddies;
      for (let index = allCaddies.length - 1; index >= 0; index--) {
        const caddie = allCaddies[index]
        if (caddie && caddie.uid === caddieToDelete.uid) {
          allCaddies.splice(index, 1)
        }
      }

      this.applyCaddiesChanges();
    },
    changeCaddiesFromCache(caddies) {
      const oldGroupCaddieIds = (this.competition?.caddie_briefs || [])
        .filter((caddie) => caddie.group === this.targetGroup)
        .map((caddie) => caddie.uid)
      for (let index = 0; index < this.cachedAllCaddies.length; index++) {
        const cCaddie = this.cachedAllCaddies[index];
        if (oldGroupCaddieIds.includes(cCaddie.uid)) {
          this.cachedAllCaddies.splice(index, 1)
          index--
        }
      }

      caddies.forEach((caddie) => {
        caddie.group = this.targetGroup
      })
      this.cachedAllCaddies.push(...caddies)

      this.applyCaddiesChanges();
    },

    async applyCaddiesChanges() {
      const oldGroupCaddieIds = (this.competition?.caddie_briefs || [])
        .filter((caddie) => caddie.group === this.targetGroup)
        .map((caddie) => caddie.uid)
      const cacheCaddieIds = this.cachedAllCaddies.map((caddie) => caddie.uid)

      const curGroupCaddies = this.currentGroupCaddies
      const curGroupCaddieIds = curGroupCaddies.map((caddie) => caddie.uid)

      if (curGroupCaddieIds.equals(oldGroupCaddieIds)) { // 没有改变，直接返回
        return true
      }

      uni.showLoading({
        title: '保存中',
        mask: true
      })

      // 加载当前所有球童数据
      const [err, res] = await awaitWrap(
        listCaddies({ competition_id: this.competition?.competition_id }, false)
      )
      if (err != null || res?.data?.data === null || !Array.isArray(res?.data?.data)) {
        uni.hideLoading();
        uni.showToast({
          title: err?.data?.msg ||'保存失败，请重试',
          icon: 'none',
          mask: true
        })
        this.synAllCaddies(this.competition?.caddie_briefs || [])
        return false;
      }

      const allRemoteCaddies = res.data.data
      const allRemoteCaddieIds = allRemoteCaddies.map((caddie) => caddie.uid)
      const otherGroupRemoteCaddies = allRemoteCaddies.filter((caddie) => caddie.group !== this.targetGroup)
      const otherGroupRemoteCaddieIds = otherGroupRemoteCaddies.map((caddie) => caddie.uid)

      // 排除其它分组的球童
      const caddiesExistInOtherGroup = otherGroupRemoteCaddies.filter((otherGroupCaddie) => {
        return cacheCaddieIds.includes(otherGroupCaddie.uid)
      })
      if (caddiesExistInOtherGroup.length > 0) {
        const names = caddiesExistInOtherGroup.map((caddie) => caddie.uid == this.userInfo.uid ? '你自己' : caddie.username)
        uni.hideLoading();
        uni.showToast({
          title: `${names.join('、')}已是其它组的球童，请重新设置`,
          icon: 'none',
          mask: true
        })
        this.synAllCaddies(allRemoteCaddies)
        return false;
      }

      const remoteGroupCaddies = allRemoteCaddies.filter((caddie) => caddie.group === this.targetGroup)
      const remoteGroupCaddieIds = remoteGroupCaddies.map((caddie) => caddie.uid)

      // 检查服务器球童列表是否已经改变
      const intersection = remoteGroupCaddieIds.filter((rCaddieId) => oldGroupCaddieIds.includes(rCaddieId) )
      if (intersection.length != remoteGroupCaddieIds.length) {
        uni.hideLoading();
        uni.showToast({
          title: '球童列表已经改变，请重新设置',
          icon: 'none',
          mask: true
        })

        this.synAllCaddies(allRemoteCaddies)
        return false;
      }

      
      // if (false) {
      //   remoteGroupCaddieIds.forEach(async (rCaddieId) => {
      //     const [err, res] = await awaitWrap(deleteCaddie(
      //       {
      //         competition_id: this.competition.competition_id,
      //         group: this.targetGroup,
      //         caddie_uid: rCaddieId,
      //       },
      //       false)
      //     )
      //     console.log('deleteCaddie', err, res);
      //   })

      //   curGroupCaddieIds.forEach(async (cCaddieId) => {
      //     const [err, res] = await awaitWrap(addCaddie(
      //       {
      //         competition_id: this.competition.competition_id,
      //         group: this.targetGroup,
      //         caddie_uid: cCaddieId,
      //       },
      //       false)
      //     )
      //     console.log('addCaddie', err, res);
      //   })
      // }

      const [batchAddErr, batchAddRes] = await awaitWrap(batchAddCaddies(
        {
          competition_id: this.competition.competition_id,
          group: this.targetGroup,
          caddies: `[${curGroupCaddieIds.join(',')}]`,
        },
        false,
      ))
      if (batchAddErr) {
        uni.hideLoading();
        uni.showToast({
          title: batchAddErr?.data?.msg || '保存失败，请重试',
          icon: 'none',
          mask: true
        })
        this.synAllCaddies(allRemoteCaddies)
        return;
      }

      uni.hideLoading();
      
      this.synAllCaddies(curGroupCaddies)      

      return true
    },

    chooseFromFriends() {
      const caddieIds = this.caddies.map((caddie) => caddie.uid)
      const validCaddies = this.caddies.filter((caddie) => caddie.uid > 0)
      const disabledList = this.competition.competitor_list.filter((com) => {
        return com.uid != this.userInfo.uid && !caddieIds.includes(com.uid)
      }).map((com) => com.uid)
      this.handleType = 'addCompetitors'

      const sharing = this.iAmCompetitorInGroup ? {
        pageSharing: () => {
          return this.pageSharing()
        },
      } : null
      this.$refs.setFriendsModal.open({users: validCaddies, group: this.targetGroup}, disabledList, sharing);
    },

    handleAdd() {
      if (this.isValidInvite != true) {
        uni.showToast({
          title: '邀请已失效',
          icon: 'error',
          mask: false
        })
        return
      }

      if (this.iAmCompetitorInGroup) { // 
        this.chooseFromFriends();
      } else {
        this.tryAddMySelfToCaddies();
      }
    },
    handleDelete(caddieToDelete) {
      const isCompetitor = this.iAmCompetitorInGroup
      uni.showModal({
        title: isCompetitor ? `确认删除【${caddieToDelete.username || ''}】吗?` : `确认退出`,
        cancelText: isCompetitor ? '不删除' : '取消',
        confirmText: isCompetitor ? '删除' : '确认',
        confirmColor: '#FF6A6A',
        success: async (res) => {
          if (res.confirm) {
            if (isCompetitor) {
              this.deleteCaddieFromCache(caddieToDelete)
            } else { 
              this.tryDeleteMeCaddieFromCaddies(caddieToDelete)
            }
          }
        }
      });
    },
    
    handleFriendsConfirm(list) {
      this.changeCaddiesFromCache(list)
    },

    async handleConfirm() {
      // const [err, res] = await awaitWrap(this.applyCaddiesChanges())
      // if (err) {
      //   return;
      // }
      // if (res != true) {
      //   return;
      // }

      this.navToCompetition()
    },

    navToCompetition() {
      const pages = getCurrentPages()
      const prePage = pages[pages.length - 2]
      if (prePage?.route == "pages/chat-room/index/index"
        && prePage.$vm) {
        if (prePage.$vm.competition_id && Number(prePage.$vm.competition_id) === this.competition.competition_id) {
          uni.navigateBack()
          return;
        } else {
          const warning = ['Caddie invite, competition in pre page is not the same', prePage.$vm]
          console.warn(...warning);
          realtimeLogger.rtWarn(...warning)
        }
      }

      uni.redirectTo({
        url: `/pages/chat-room/index/index?id=${this.competition.competition_id}`,
        fail: (err) => {
          const errorMsgs = ['Caddie invite, cannot redirect to competition', prePage.$vm]
          console.error(...errorMsgs);
          realtimeLogger.rtError(...errorMsgs)
        },
      })
      return
    },

    scrollViewScroll(e) {
      this.contentScrollOffset = e.detail.scrollTop;
    },

    onShareAppMessage(res) {
      return this.pageSharing(res)
    },
    onShareTimeline(res) {
      return this.pageSharing(res)
    },
    pageSharing(res) {
      const share = this.getTopPageInjectedShare();
      if (share) return share;

      const data = this.competition

      return shareCompetitionCaddieInvite({
        cid: data.competition_id,
        name: data?.competition_name,
        group: this.targetGroup,
        fUid: this.userInfo.uid,
        shareRoomName: data?.competition_name,
        imageUrl: undefined, // 使用默认图
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.root {
  width: 100%;
  height: 100%;
}
.nav {
  z-index: 1;
}
.content-box {
  overflow-y: scroll;
  top: 0;
  width: 100%;
  height: 100%;
  
  box-sizing: border-box;
  // display: flex;
  // flex-direction: column;
  // gap:var(--root-gap);
  // padding-bottom: var(--bottom-safe-height);// calc(env(safe-area-inset-bottom) + 23rpx + 47px); // 23rpx padding top，47px tab-box 高度 


  .bottom-spacing-box {
    margin-top: 0;
    width: 100%;
    height: 20rpx;
    padding-bottom: var(--bottom-safe-height);
  }
}

.top-bg {
  z-index: -1;
  top: 0;

  background-color: #003C3D;

  width: 100%;
  height: 480rpx;
  background-image: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/img_caddie_invite_bg_2.png");
  background-size: 100%;
  background-repeat: no-repeat;
}

.com-brief {
  margin-top: calc(10rpx + var(--nav-height));
  margin-left: 72rpx;
  margin-right: 72rpx;
  margin-bottom: 40rpx;
  .date-part {
    min-width: 132rpx;

    color: #FFFFFF;
    letter-spacing: -0.3rpx;
    font-style: normal;

    .time {
      @include rubikVar(500);
      font-size: 40rpx;
      line-height: 47rpx;
    }
    .day {
      @include rubikVar(400);
      font-size: 24rpx;
      line-height: 28rpx;
    }
  }
  .separator {
    align-self: stretch;
    padding-top: 13rpx;
    width: 4rpx;
    background-color: #9FBE3D;
  }
  .name-part {
    color: #FFFFFF;
    
    font-family: 'PingFang SC';
    font-style: normal;
    // line-height: 109%;
    letter-spacing: -0.3rpx;

    .name {
      @include ell(4);
      font-weight: 500;
      font-size: 28rpx;
    }
    .course-name {
      @include ell(2);
      font-weight: 400;
      font-size: 24rpx;
    }
  }
}

@mixin card {
  margin-left: 32rpx;
  margin-bottom: 20rpx;
  margin-right: 32rpx;

  box-shadow: 0rpx 4rpx 30rpx rgba(0, 0, 0, 0.08);
  border-radius: 4rpx;
}

.caddie-container {
  margin-left: 36rpx;
  margin-right: 36rpx;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .caddie-title {
    margin-bottom: 40rpx;

    font-weight: 500;
    font-size: 32rpx;
    line-height: 45rpx;
    letter-spacing: -0.05rpx;

    color: #000000;
  }

  .caddie-list {
    align-self: stretch;
    min-height: 143rpx;
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    .caddie {
      min-width: 25%;
    }
  }
}
// .caddie-refresh {
//   padding: 8rpx 24rpx;
//   gap: 14rpx;
  
//   background: #FAFAFA;
//   border-radius: 99999rpx;

//   .caddie-refresh-icon {
//     width: 20rpx;
//     height: 20rpx;
//     background-color: red;
//   }
//   .caddie-refresh-title {
//     font-family: 'PingFang HK';
//     font-style: normal;
//     font-weight: 400;
//     font-size: 24rpx;
//     line-height: 34rpx;
//     /* identical to box height */
//     text-align: center;
//     letter-spacing: -0.3rpx;

//     color: #000000;
//   }
// }

.caddie-rules {
  padding: 40rpx 68rpx 40rpx 68rpx;
  align-items: stretch;
  gap: 36rpx;
  .rule-container {
    font-style: normal;
    font-weight: 400;
    font-size: 28rpx;
    line-height: 40prx;
    letter-spacing: -0.03rpx;

    color: #000000;
    
    gap: 12rpx;
    align-items: flex-start;
    
    .rule-serial {
      min-width: 40rpx;
      background: #95D171;
      border-radius: 999999rpx;
      text-align: center;
      color: white;
    }

    .rule-content-bold {
      font-weight: 600;
    }
  }
}
.common-large-btn {
  margin-left: 78rpx;
  margin-right: 78rpx;
  height: 96rpx;

  align-self: stretch;
  display: flex;
  justify-content: center;
  align-items: center;
  
  background: #003C3D;
  border: 2rpx solid #003C3D;
  border-radius: 4rpx;

  font-style: normal;
  font-weight: 600;
  font-size: 28rpx;
  line-height: 39rpx;
  text-align: center;
  letter-spacing: -0.3rpx;

  color: #FFFFFF;
}

.com-group-card {
  @include card();
  background: linear-gradient(149.3deg, #ECF8EF 20.12%, #FFFFFF 34.56%);

  .group-top {
    gap: 12rpx;
    
    .group-title {
      font-style: normal;
      font-weight: 500;
      font-size: 32rpx;
      line-height: 45rpx;
      /* identical to box height */
      letter-spacing: -0.03rpx;

      color: #000000;
    }
    .group-icon {
      @include bgImage(77rpx, 27rpx, 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_caddie_player_mark.svg')
    }
  }

  .competitor-list {
    margin: 32rpx 64rpx 36rpx 64rpx;
    min-height: 96rpx;
    .competitor {
      margin: 0rpx 18rpx;
      min-width: 122rpx;
      flex-grow: 1;
    }
  }
}

.sharing-card {
  @include card();
  padding-top: 54rpx;
  padding-bottom: 50rpx;

  .qr-code {
    margin-bottom: 33rpx;
    box-sizing: border-box;
    width: 310rpx;
    height: 310rpx;
    background: #FFFFFF;
    border-radius: 999999rpx;
    border: 1px solid #E7E7E7;
    box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.08);
  }
  .qr-code-hint {
    margin-bottom: 30rpx;
    font-style: normal;
    font-weight: 400;
    font-size: 28rpx;
    line-height: 39rpx;
    text-align: center;
    letter-spacing: -0.05rpx;

    color: #666666;
  }

  .caddie-footnote {
    margin-left: 50rpx;
    margin-right: 50rpx;
    font-style: normal;
    font-weight: 400;
    font-size: 24rpx;
    line-height: 34rpx;
    letter-spacing: -0.05rpx;

    color: #999999;
  } 
}

.accepting-card {
  @include card();
  
  padding-top: 38rpx;
  padding-bottom: 70rpx;
}


.auth-invite-slot  {
  .invite-avatar {
    margin-top: 71rpx;
  }

  .invite-title {
    margin-top: 53rpx;
    margin-bottom: 10rpx;

    font-weight: 400;
    font-size: 32rpx;
    line-height: 45rpx;
    text-align: center;
    letter-spacing: -0.3rpx;

    color: #003C3D;
  }
}


</style>
