<template>
  <view class="root" :style="{'--nav-height': navTotalHeight + 'px', '--bottom-safe-height': bottomSafeHeight +'px', '--info-box-offset': infoBoxOffset + 'rpx', '--root-gap': rootGap + 'rpx'}">
    <GNavbar class="nav" 
              :show-back='containTabBar == false' 
              :title="containTabBar ? ' ' : userInfo.username " 
              :title-opacity="navBgOpacity" 
              :bg-opacity="navBgOpacity" />

    <scroll-view class="content-box"
                  scroll-y
                  enhanced="true"
                  @scroll="contentBoxScroll"
                  >
      <!-- 个人信息 -->
      <view class="user-info-box" @click.stop="handleInfoBoxClick">
        <view class="header-bg-default"></view>
        <view v-if="showUserHeader" class="header-bg" :style="{'background-image' : headerBgImageStyle}">
          <view class="header-cover"></view>
        </view>
        
        <!-- <view class="user-info-bg"></view> -->
        <!-- 上部分 -->
        <view class="user-info-box-top">
          <view class="flex" @click.stop="handleProfilePartsClick">
            <GAvatar class="g-avatar"
                      :avatar-data="userInfo" 
                      :border="'4rpx solid #F9F9F9'" 
                      :size-in-rpx='110'
                      :radius="'96rpx'"
                      :custom-click-handling="true"
                      @avatar-click="handleAvatarClick" />
            <view class="flex-col">
              <view class="col-white fw-600 fs-32 lh-44">
                <span>{{ userName }}</span>
                <span class="gender-box" v-if="gender > 0">
                  <image :src="`${ossUrl}/icons/${ gender == 1 ? 'icon-male' : 'icon-female'}.png`"
                        class="icon-gender"
                        mode="widthFix" />
                </span>
              </view>
              <view v-if="ipLocation" class="ip-location">{{ ipLocation }}</view>
            </view>
          </view>
          <view v-if="isMe" 
                class="edit-btn"
                @click.stop="handleProfilePartsClick"> 
                编辑资料
          </view>
          <view v-else class="flex-center">
            <view :class="isFollowing? 'followed-btn' : 'follow-btn'" 
                  @click.stop="handleFollowBtnClick">
                    {{ isFollowing ? '已关注' : '关注' }}
            </view>
            <view class="chat-btn" 
                  @click.stop="handleChatBtnClick">
              <view class="chat-btn-icon"></view>
            </view>
          </view>
        </view>
        <!-- 下部分 -->
        <view class="user-info-box-bot">
          <!-- 左边的内容 -->
          <view class="flex-col">
            <!-- 关注，粉丝 -->
            <view class="friendship" @click.stop="handleFansAndFollowsClick">
              <view>
                <span>{{ following }}</span>
                <span class="unit">{{ ' ' + '关注' }}</span>
              </view>
              <view>
                <span>{{ followed }}</span>
                <span class="unit">{{ ' ' + '粉丝' }}</span>
              </view>
            </view>
            <!-- 简介 -->
            <text class="intro" @click.stop="">{{ intro }}</text>
          </view>
          <!-- 右边内容 -->
          <view v-if="isMe" class="message" @click.stop="handleMessageClick">
            <!-- 消息通知 -->
            <view :class="['message-icon', unreadCount > 0 ? 'unread' : '']"></view>
            <view class="message-text">{{ unreadCount > 0 ? `${unreadCount}条新消息` : '消息通知' }}</view>
          </view>
        </view>
      </view>

      <!-- 历史信息 -->
      <view v-if="isMe" class="history-info-box flex flex-between">
        <view class="history-warp flex flex-between" @click="handleJumpHistory">
          <view class="flex-col">
            <view class="title">球局记录</view>
            <view class="number">{{ userInfo.history_competition_count || '--' }}</view>
          </view>
          <slot name="right">
            <uni-icons class="right" type="right" size="40rpx" color="#C4C4C4"></uni-icons>
          </slot>
        </view>
        <view class="history-warp flex flex-between" @click="handleJumpWatchedList">
          <view class="flex-col">
            <view class="title">观赛历史</view>
            <view class="number">{{ userInfo.watched_competition_count || '--' }}</view>
          </view>
          <slot name="right">
            <uni-icons class="right" type="right" size="40rpx" color="#C4C4C4"></uni-icons>
          </slot>
        </view>
      </view>

      <!-- 列表 -->
      <view class="list-box" :style="{'--list-top-offset': listTopOffset + 'rpx'}">
        <!-- 总揽 -->
        <view class="data-card summary">
          <!-- 最佳 -->
          <ProfileLargeScore class="best" :data="bestData" />
          <view class="line-v"></view>
          <!-- 平均 -->
          <ProfileLargeScore class="average" :data="averageData" />
          <view class="line-v"></view>
          <!-- 右边历史 -->
          <view class="history">
            <!-- 打过球场 -->
            <ProfileHistoryNumberView class="course" :data="courseData" :userInfo="userInfo" type="course"></ProfileHistoryNumberView>
            <view class="line-h"></view>
            <!-- 比赛次数 -->
            <ProfileHistoryNumberView class="times" :data="timesData" :userInfo="userInfo" type="time"></ProfileHistoryNumberView>
          </view>
        </view>
        <!-- 差点 -->
        <view class="data-card summary-second">
          <!-- 最佳 -->
          <ProfileLargeScore class="handicap" :data="handicapData" />
          <view class="line-v"></view>
          <ProfileDataDiagramView class="recent-score" 
                                  :changeable="isMe" 
                                  :is-public="userInfo.is_public_score_list || false"
                                  :public-type="'recent'"
                                  :input-data="recentData" />
        </view>
        <!-- 球洞得分 -->
        <ProfileSelectableDiagrams class="data-card"
                                    :default-type="'par_4'"
                                    :changeable="isMe"
                                    :input-data="holeAverage"/>
        <!-- 得分类型 -->
        <ProfileSelectableDiagrams class="data-card"
                                    :default-type="'pars'"
                                    :changeable="isMe"
                                    :input-data="scoreTypesData" />
      </view>

      <view class="bottom-spacing-box"></view>
    </scroll-view>

    <!-- 更多按钮 -->
    <view v-if="isMe" class="more" :style="{ '--more-top': moreTop + 'px', '--more-left': moreLeft + 'px' }" @click.stop="handleMore">
      <view class="bars"></view>
      <view class="bars"></view>
      <view class="bars"></view>
    </view>
    <GImagePreviewing ref="preview" 
                      :imgList="headerBackground" 
                      :show-center-btn="isMe"
                      @centerButtonClick="handleChangeHeaderBg"
                      />
  </view>
</template>

<script>
import GNavbar from '@/components/g-navbar/index.vue'
import UniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
import { mapGetters } from 'vuex'
import { getOtherUserInfo, unfollowUser, followUser, getImIdFromUid, getUserIdFromImId } from '@/api/user'
import ProfileLargeScore from './ProfileLargeScore.vue'
import ProfileHistoryNumberView from './ProfileHistoryNumberView.vue'
import ProfileSelectableDiagrams from './ProfileSelectableDiagrams.vue'
import ProfileDataDiagramView from './ProfileDataDiagramView.vue'
import GAvatar from '@/components/g-avatar/g-avatar.vue'
import { shareUser } from '@/utils/share'
import GImagePreviewing from '@/components/g-popups/g-image-previewing.vue'

import ProfileMixinTestData from '../mixins/ProfileMixinMockData.js'
import { isString } from 'util'
import { toNumber } from '@/utils/third/tools'

export default {
  components: {
    GNavbar,
    GAvatar,
    UniIcons,
    ProfileLargeScore,
    ProfileHistoryNumberView,
    ProfileSelectableDiagrams,
    ProfileDataDiagramView,
    GImagePreviewing,
  },
  mixins: [ProfileMixinTestData],
  props: {
    uid: {
      type: [Number, undefined],
      default: undefined,
    },
    customBottomSafeHeight: {
      type: [Number, undefined],
      default: undefined,
    }
  },
  data() {
    return {
      ossUrl: this.$ossUrl,

      moreTop: 0,
      moreLeft: 0,
      navTotalHeight: 0,
      containTabBar: false,
      userInfoHeight: 0,
      contentScrollOffset: 0,
      sysSafeBottomHeight: 0,

      /**
       * 非本人的用户数据
       */
      userInfoData: undefined,
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'user/isLogin',
      isAuth: 'user/isAuth',
      meUserInfoInStore: 'user/userInfo',
      messageUnreadCount: 'messageUnreadCount',
      conversationsUnreadCount: 'flooim/conversationsUnreadCount',
    }),
    

    navBgOpacity() {
      if (this.userInfoHeight <= 0) return 0;
      const beginPos = 10; // 变化开始位置。
      const percentage = (this.contentScrollOffset < beginPos || this.userInfoHeight <= 0) ? 0 : this.contentScrollOffset / this.userInfoHeight;
      return Math.min(Math.max(0, percentage), 1);
    },

    showUserHeader() {
      return this.headerBgImageStyle !== 'inherit'
    },

    headerBgImageStyle() {
      const headerUrl = this.userInfo.bg_image_url
      return headerUrl && headerUrl.length > 0 ? `url(${headerUrl})` : 'inherit'
    },

    /**
    *  底部安全距离。In px
    */
    bottomSafeHeight() {
      return this.customBottomSafeHeight || this.sysSafeBottomHeight
    },

    /**
     *  View 块之间的间隔 In rpx
     */
    rootGap() {
      return 20;
    },
    /**
     *  用户信息头部的移位，其他用户会上移 20rpx 。 In rpx
     */
    infoBoxOffset() {
      return (this.isMe ? 0 : -20);
    },
    /**
     *  数据列表顶部 offset，其他用户，数据部分会提高插入用户信息头部约 30rpx。In rpx
     */
    listTopOffset() {
       return (this.isMe ? this.rootGap : -30);
    },
    
    meUserInfo() { 
      return this.meUserInfoInStore || {};
    },

    userInfo() {
      return (this.isMe ? this.meUserInfoInStore : this.userInfoData) || {}
    },

    isMe() {
      return this.uid === this.meUserInfo.uid;
    },

    userName() {
      return (this.isMe ? (this.isAuth ? this.userInfo.username : '未登录，请先登录') : this.userInfo.username) || '--'
    },

    gender() {
      return this.userInfo.gender || 0
    },

    ipLocation() {
      if (this.isMe && this.isAuth !== true) return undefined;

      var locationNames = []
      if (this.userInfo.ip_addr) {
        locationNames.push(this.userInfo.ip_addr)
      }
      return locationNames.length > 0 ? 'IP属地：' + locationNames.join(' ') : undefined;
    },

    headerBackground() {
      return [this.userInfo.bg_image_url || 'https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/img_profile_bg.png']
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
      return (intro && intro.length > 0) ? intro : (this.isMe ? '给球友们简单介绍一下自己吧' : '这个人很懒一句话都没有写！');
    },

    unreadCount() {
      return this.messageUnreadCount + this.conversationsUnreadCount;
    },

    bestData() {
      // return this.mockLargeData().best;
      return {
        score: this.userInfo.best,
        comparing: this.userInfo.best_transcend ? `超${this.userInfo.best_transcend}球友` : undefined,
        enTitle: 'Best Score',
        cnTitle: '最佳杆数',
      }
    },
    averageData() {
      // data = this.mockLargeData().average;
      return {
        score: this.userInfo.avg,
        comparing: this.userInfo.avg_transcend ? `超${this.userInfo.avg_transcend}球友` : undefined,
        enTitle: 'Average Score',
        cnTitle: '平均杆数',
      }
    },
    courseData() {
      // data = this.mockLargeData().course;
      return {
        score: this.userInfo.total_played_course,
        enTitle: 'Courses\nPlayed',
        cnTitle: '打过球场',
      }
    },
    timesData() {
      // return this.mockLargeData().times;
      return {
        score: this.userInfo.total_golf_games,
        enTitle: 'Games\nPlayed',
        cnTitle: '比赛次数',
      }
    },
    handicapData() {
      // return this.mockLargeData().handicap;
      return {
        title: 'HCP',
        score: this.userInfo.hcp,
        comparing: this.userInfo.hcp_transcend ? `超${this.userInfo.hcp_transcend}球友` : undefined,
        enTitle: 'Handicap',
        cnTitle: '差点',
      };
    },

    recentData() {
      // return this.mockRecentData();
      return {
        data: this.userInfo.score_list,
        diagramEnTitle: "Data in Last 10 Games",
        diagramCnTitle: "最近十场杆数走势",
        diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
        diagramCoverEmptyTitle: "暂无球局数据",
        diagramFootnoteL: "最前一场",
        diagramFootnoteR: "最后一场",
      };
    },

    holeAverage() {
      // return this.mockHoleData()
      return {
        isPublic: this.userInfo.is_public_avg_score_list || false,
        publicType: 'hole_average',
        items: [
          {
            type: 'par_3',
            enTitle: "Par 3 av. Score",
            cnTitle: "三杆洞单场平均杆",
            data: this.userInfo.par_3_avg_score_list,
            diagramEnTitle: "Data in Last 10 Games",
            diagramCnTitle: "最近十场杆数走势",
            diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
            diagramCoverEmptyTitle: "暂无球局数据",
            diagramFootnoteL: "最前一场",
            diagramFootnoteR: "最后一场",
          },
          {
            type: 'par_4',
            enTitle: "Par 4 av. Score",
            cnTitle: "四杆洞单场平均杆",
            data: this.userInfo.par_4_avg_score_list,
            diagramEnTitle: "Data in Last 10 Games",
            diagramCnTitle: "最近十场杆数走势",
            diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
            diagramCoverEmptyTitle: "暂无球局数据",
            diagramFootnoteL: "最前一场",
            diagramFootnoteR: "最后一场",
          },
          {
            type: 'par_5',
            enTitle: "Par 5 av. Score",
            cnTitle: "五杆洞单场平均杆",
            data: this.userInfo.par_5_avg_score_list,
            diagramEnTitle: "Data in Last 10 Games",
            diagramCnTitle: "最近十场杆数走势",
            diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
            diagramCoverEmptyTitle: "暂无球局数据",
            diagramFootnoteL: "最前一场",
            diagramFootnoteR: "最后一场",
          },
        ],
      };
    },

    scoreTypesData() {
      // return this.mockScoreTypesData()
      return {
        isPublic: this.userInfo.is_public_statistics_score_list || false,
        publicType: 'score_type',
        items: [
          {
            type: 'eagles',
            enTitle: "Eagles -",
            cnTitle: "老鹰 (-2)或更好",
            data: this.userInfo.eagles_list,
            diagramEnTitle: "Data in Last 10 Games",
            diagramCnTitle: "最近十场杆数走势",
            diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
            diagramCoverEmptyTitle: "暂无球局数据",
            diagramFootnoteL: "最前一场",
            diagramFootnoteR: "最后一场",
          },
          {
            type: 'birdies',
            enTitle: "Birdies",
            cnTitle: "小鸟 (-1)",
            data: this.userInfo.birdies_list,
            diagramEnTitle: "Data in Last 10 Games",
            diagramCnTitle: "最近十场杆数走势",
            diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
            diagramCoverEmptyTitle: "暂无球局数据",
            diagramFootnoteL: "最前一场",
            diagramFootnoteR: "最后一场",
          },
          {
            type: 'pars',
            enTitle: "Pars",
            cnTitle: "标准杆 (0)",
            data: this.userInfo.pars_list,
            diagramEnTitle: "Data in Last 10 Games",
            diagramCnTitle: "最近十场杆数走势",
            diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
            diagramCoverEmptyTitle: "暂无球局数据",
            diagramFootnoteL: "最前一场",
            diagramFootnoteR: "最后一场",
          },
          {
            type: 'bogeys',
            enTitle: "Bogeys",
            cnTitle: "帕忌 (+1)",
            data: this.userInfo.bogeys_list,
            diagramEnTitle: "Data in Last 10 Games",
            diagramCnTitle: "最近十场杆数走势",
            diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
            diagramCoverEmptyTitle: "暂无球局数据",
            diagramFootnoteL: "最前一场",
            diagramFootnoteR: "最后一场",
          },
          {
            type: 'double_bogeys',
            enTitle: "Double Bogeys +",
            cnTitle: "双帕忌 (+2)或更差",
            data: this.userInfo.double_bogeys_list,
            diagramEnTitle: "Data in Last 10 Games",
            diagramCnTitle: "最近十场杆数走势",
            diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
            diagramCoverEmptyTitle: "暂无球局数据",
            diagramFootnoteL: "最前一场",
            diagramFootnoteR: "最后一场",
          }
        ],
      };
    }
  },
  mounted() {
    this.containTabBar = getCurrentPages().length <= 1;

    const menuBtnRect = wx.getMenuButtonBoundingClientRect()
    this.moreTop = menuBtnRect.top;
    this.moreLeft = menuBtnRect.left - 8 - 32 // px

    const sysInfo = uni.getSystemInfoSync();
    this.sysSafeBottomHeight = sysInfo.safeAreaInsets.bottom;
    const navigationBarBottom = sysInfo.statusBarHeight + 44 ;
    this.navTotalHeight = navigationBarBottom;

    this.onGREvent('profile_data_public_state_change', (publicType) => {
      if (this.isMe == false) { return }

      let changed = false;
      switch (publicType) {
        case 'recent':
          this.userInfo.is_public_score_list = this.userInfo.is_public_score_list == 0 ? 1 : 0;
          changed = true;
          break;
        case 'hole_average':
          this.userInfo.is_public_avg_score_list = this.userInfo.is_public_avg_score_list == 0 ? 1 : 0;
          changed = true;
          break;
        case 'score_type':
          this.userInfo.is_public_statistics_score_list = this.userInfo.is_public_statistics_score_list == 0 ? 1 : 0;
          changed = true;
          break;
        default:
          break;
      }

      if (changed) {
        const info = Object.assign(this.$store.state.user.userInfo || {}, {
        });
        info.first_golf_time = info.first_golf_time || ''
        this.$store.dispatch("user/UPDATE_USER_INFO", { data: info, gl: false });
      }
    })


    // 设置 scroll view 在 iOS 微信小程序上的表现，取消 bounces 等。https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/ScrollViewContext.html
    this.$nextTick(() => {
      uni
        .createSelectorQuery()
        .in(this)
        .select(".content-box")
        .node()
        .exec((res) => {
          const scrollView = res[0].node;
          scrollView.bounces = false; // 取消 bounces
          scrollView.showScrollbar = false; // 取消滚动条
        })
    })

  },
  

  methods: {
    loadData(gl = true) {
      if (this.isMe) {
        this.isAuth && this.$store.dispatch('user/GET_USER_INFO', { showLoadingWithData: false })
      } else {
        getOtherUserInfo({ uid: this.uid }, gl).then(({ data: { data } }) => {
          const oldImId = this.userInfoData?.im_id;
          this.userInfoData = data;

          if (this.userInfoData.im_id == null) {
            this.userInfoData.im_id = oldImId;
          }

          const newUserInfo = data;

          new Promise(async (resolve, reject) => {
            if (newUserInfo.im_id || oldImId) {
              resolve(newUserInfo.im_id || oldImId)
              return;
            }
            const { data: { data } } = await getImIdFromUid({ uid: newUserInfo.uid }).catch((e) => {
              console.error('Cannot get IM ID from UID', e);
            })
            resolve(data?.im_id)
          }).then((im_id) => {
            this.userInfoData.im_id = im_id
            // 尝试更新用户的 IM 信息
            if (im_id) {
              this.$store.dispatch("flooim/REFRESH_ROSTERS_INFO", [toNumber(im_id)]);
            }
          }).catch((e) => {
            console.error('Cannot refresh roster info', e);
          })
        });
      }
    },
    onHostPageReady() {
      uni.createSelectorQuery()
        .in(this)
        .select('.user-info-box')
        .boundingClientRect(({ height }) => {
          this.userInfoHeight = height;
        })
        .exec();
    },

    contentBoxScroll(e) {
      this.contentScrollOffset = e.detail.scrollTop;
    },
    
    handleMore() {
      uni.navigateTo({
        url: '/pages/common/more/More',
      })
    },
    handleOpenAuthPopup() {
      this.grTryShowAuthorization()
    },
    handleJump(url) {
      if (this.grTryShowAuthorization()) {
        return
      }
      uni.navigateTo({
        url: url,
        fail: (e) => {
          console.error(e);
        }
      });
    },
    handleProfilePartsClick(e) {
      if (this.isMe) {
        this.handleJump(`/pages/tabbar/profile/editUser/index`)
      }
    },
    handleAvatarClick() {
      const scope = this;
      if (!this.isMe) {
        if (this.userInfo.avatar_url) {
          uni.previewImage({
            urls: [this.userInfo.avatar_url],
          })
        }
      }
    },
    handleFansAndFollowsClick() {
      if (this.isMe == false) { return }
      this.handleJump(`/pages/common/friend/Friends`)
    },
    handleInfoBoxClick() {
      if (this.isMe) {
        this.$refs.preview.handlePreviewImg()
      }
    },
    handleChangeHeaderBg() {
      if (!this.isMe) { return }
      uni.chooseImage({
        count: 1,  //图片可选择数量
        sizeType: ['original', 'compressed'],  //original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'],   //album 从相册选图，camera 使用相机，默认二者都有。
        success: async res => {
          let imgFiles = res.tempFilePaths   //图片的本地文件路径列表
          console.log('chooseImage', res)
          const targetImage = imgFiles[0];

          const preProcessedImage = targetImage//  await preProcessImage(targetImage)
          
          uni.navigateTo({
            url: `/pages/common/image/ImageCrop?w=${750}&h=${562}&m=${375 * 3}`,
            events: {
              finished: ({ croppedImage, uploadedImage }) => {
                if (isString(uploadedImage) && uploadedImage.length > 0) {
                  this.userInfo.bg_image_url = uploadedImage;

                  const newInfo = Object.assign(this.userInfo || {}, {});
                  this.$store.dispatch("user/UPDATE_USER_INFO", { data: newInfo, gl: false })
                }
              }
            },
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('cropImage', preProcessedImage);
              res.eventChannel.emit('behavior', { autoUpload: true });
            }
          })
        }
      })
    },
    handleJumpHistory() {
      this.handleJump(`/pages/common/profile/historyList/index`)
    },
    handleJumpWatchedList() {
      this.handleJump(`/pages/common/profile/watchedList/index`)
    },

    // 点击关注按钮
    handleFollowBtnClick() {
      if (this.grTryShowAuthorization()) { return }
      const gl = false;
      const apiPromise = this.isFollowing ? unfollowUser : followUser;
      apiPromise({ friend_uid: this.userInfo.uid}, gl).then(({ data: { data } }) => {
        this.loadData(gl);
      });
    },

    async handleChatBtnClick() {
      const { data: { data } } = await getImIdFromUid({ uid: this.userInfo.uid }).catch(e => {
        console.error('Cannot get IM ID', e)
        return { data: { data: {} }}
      })
      const im_id = data?.im_id
      this.handleJump(`/pages/common/im/conversation?uid=${this.userInfo.uid}&im_id=${im_id}&nick=${this.userInfo.username}`)
    },

    handleMessageClick() {
      this.handleJump(`/pages/common/message/MessageList`)
    },

    shareAppMessage(res) {
      return this.pageSharing(res)
    },
    shareTimeline(res) {
      return this.pageSharing(res)
    },
    pageSharing(res) {
      return shareUser({
        uid: this.userInfo.uid,
        name: this.userInfo.username,
        suid: this.meUserInfoInStore.uid
      })
    }
  },
}
</script>

<style lang="scss" scoped>
$root-h-spacing: 40rpx;

.root {
  width: 100%;
  height: 100%;
}

.nav {
  position: absolute;
  z-index: 1;
}

.more {
  z-index: 1;
  position: fixed;
  box-sizing: border-box;
  top: var(--more-top);
  left: var(--more-left);
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14.9506px);
  /* Note: backdrop-filter has minimal browser support */
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;

  .bars {
    $color: white;
    $width: 12px;
    $height: 2px;

    background-color: $color;
    width: $width;
    height: $height;
    border-radius: 11px;
  }
}

.content-box {
  position: absolute;
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


.user-info-box {
  position: relative;
  display: flex;
  flex-direction: column;

  // min-height: 562rpx;

  @mixin headerBgSetting() {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-size: cover;
    background-repeat: no-repeat;
    box-sizing: border-box;
  }

  .header-bg-default {
    @include headerBgSetting();
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/img_profile_bg.png');
  }

  .header-bg {
    @include headerBgSetting();
    // background: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/img_profile_bg.png');

    .header-cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      background-color: black;
      opacity: 0.4;
    }
  }
  

  .user-info-box-top {
    padding: 0rpx 40rpx;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: calc(100rpx - 4rpx + var(--nav-height) + var(--info-box-offset));
  }

  .user-info-box-bot {
    padding: 0rpx 40rpx;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 20rpx;
    margin-bottom: calc(62rpx - var(--info-box-offset));
  }

  .g-avatar {
    box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.15);
    margin-right: 16rpx;
  }

  .gender-box {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // flex: 0 0 20rpx;
    width: 24rpx;
    height: 44rpx;
    // background: rgba(0, 0, 0, 0.3);
    // backdrop-filter: blur(15rpx);
    // border-radius: 50%;
    margin-left: 4rpx;
  }
  .ip-location {
    font-weight: 400;
    font-size: 22rpx;
    line-height: 31rpx;
    margin-top: 4rpx;
    color: rgba(255, 255, 255, 0.6);
  }

  .edit-btn {
    padding: 10rpx 20rpx;
    text-align: center;
    font-weight: 500;
    font-size: 24rpx;
    line-height: 34rpx;
    color: #fff;
    
    background: rgba(255, 255, 255, 0.1);
    border: 2rpx solid rgba(255, 255, 255, 0.3);
    box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
    backdrop-filter: blur(25rpx);
    border-radius: 4rpx;
  }

  .follow-btn {
    min-width: 112rpx;
    padding: 10rpx 0rpx;
    text-align: center;
    font-weight: 500;
    font-size: 24rpx;
    line-height: 34rpx;

    color: #1E3E42;
    
    background: #95D171;
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 4rpx;
  }
  .followed-btn {
    min-width: 112rpx;
    padding: 10rpx 0rpx;
    text-align: center;
    font-weight: 500;
    font-size: 24rpx;
    line-height: 34rpx;
    color: rgba(255, 255, 255, 0.4);
    
    background: rgba(255, 255, 255, 0.1);
    border: 2rpx solid rgba(255, 255, 255, 0.3);
    box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
    backdrop-filter: blur(25rpx);
    border-radius: 4rpx;
  }

  .chat-btn {
    margin-left: 20rpx;
    padding: 10rpx 20rpx;
    
    background: rgba(255, 255, 255, 0.1);
    border: 2rpx solid rgba(255, 255, 255, 0.5);
    box-shadow: 0rpx 4rpx 30rpx rgba(57, 80, 69, 0.08);
    backdrop-filter: blur(25rpx);
    border-radius: 4rpx;

    .chat-btn-icon {
      @include bgImage(34rpx, 34rpx, "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_profile_chat.svg")
    }
  }

  .friendship {
    display: flex;
    gap: 20rpx;

    font-weight: 600;
    font-size: 32rpx;
    line-height: 45rpx;
    color: #FFFFFF;

    .unit {
      font-weight: 400;
      font-size: 24rpx;
      line-height: 34rpx;

      color:  rgba(255, 255, 255, 0.6);
    }
  }

  .intro {
    margin-top: 12rpx;
    flex: 1;
    font-weight: 400;
    font-size: 24rpx;
    line-height: 34rpx;
    color: #FFFFFF;

    @include ell(10); // 设定最多显示的行数。按照限制，应该用不了 10 行那么多，防止意外。
  }

  .message {
    display: flex;
    flex-direction: column;
    gap: 18rpx;
    align-items: center;

    min-width: 136rpx;

    .message-icon {
      width: 32rpx;
      height: 34rpx;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_profile_noti.svg');

      &.unread {
        background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/svgs/ico_profile_noti_unread.svg');
      }
    }
    .message-text {
      font-weight: 400;
      font-size: 24rpx;
      line-height: 34rpx;

      color: #FFFFFF;
    }
  }
}

.history-info-box {
  position: relative;
  margin: var(--root-gap) 32rpx 0rpx 32rpx;
  .history-warp {
    box-sizing: border-box;
    padding: 20rpx 32rpx;
    width: 335rpx;
    height: 120rpx;
    background: #fff;
    border-radius: 4rpx;
    box-shadow: 0px 4rpx 20rpx rgba(0, 0, 0, 0.12);
  }
  .title {
    font-size: 20rpx;
    font-weight: 500;
    line-height: 28rpx;
    color: $col-999;
  }
  .number {
    margin-top: 4rpx;
    @include rubikVar();
    font-style: normal;
    font-size: 40rpx;
    line-height: 48rpx;
  }
  .right {
    margin-right: -8rpx;
  }
}

.list-box {
  position: relative;
  
  margin-top: var(--list-top-offset); 
  padding: 0 32rpx;
  border-radius: 4rpx;

  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .data-card {
    background: #FFFFFF;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.12);
  }

  .line-h {
      // width: 100%;
      height: 1rpx;
      background-color: #ECECEC;
    }
  .line-v {
    width: 1rpx;
    // height: 100%;
    background-color: #ECECEC;
  }

  .summary {
    display: flex;
    min-height: 244rpx;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    
  
    .best {
      width: 33%;
      box-sizing: border-box;
      margin-top: auto;
      padding-bottom: 26rpx;
      padding-left: 32rpx;
    }

    .average {
      width: 33%;
      box-sizing: border-box;
      margin-top: auto;
      padding-bottom: 26rpx;
      padding-left: 32rpx;
    }

    .history {
      flex: 1;
      display: flex;
      flex-direction: column;

      .course {
        flex: 1;
      }

      .times {
        flex: 1;
      }
    }
  }

  .summary-second {
    position: relative;
    min-height: 315rpx;
    
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: stretch;

    .handicap {
      width: 33%;
      box-sizing: border-box;
      margin-top: auto;
      padding-left: 32rpx;
      padding-bottom: 26rpx;
    }

    .recent-score {
      flex: 200;
    }
  }
}
</style>
