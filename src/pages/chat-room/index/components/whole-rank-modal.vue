<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <uni-popup background-color="transparent"
             type="center"
             ref="popup">
    <view class="modal-wrapper">
      <!-- S 标题 -->
      <view class="title-wrapper pr flex">
        <view class="logo-wrapper flex-center pr">
          <image :src="`${ossUrl}/icons/logo.png`"
                 class="logo-img"
                 mode="widthFix" />
        </view>
        <view class="title-content">
          <view class="fs-28 text-over-2">{{competitionInfo.competition_name || ''}}</view>
          <view class="fs-20 op-5">{{competitionInfo.course_name || ''}}</view>
        </view>
        <image :src="`${ossUrl}/icons/icon-close.png`"
               class="icon-close"
               mode="widthFix"
               @click="close" />
      </view>
      <!-- E 标题 -->

      <!-- S 列表 -->
      <view class="table-wrapper">
        <view class="table-header sub-color fs-20 flex">
          <view class="table-header-rank tc">POS</view>
          <view class="table-header-name flex1">PLAYER</view>
          <view class="table-header-group tc" v-if="multiGroup">GROUP</view>
          <view class="table-header-total tc">TOTAL</view>
          <view class="table-header-part flex pl-22" @click="handleRankTips">
            PAR{{competitionInfo.total_score}}
            <image class="rank-tips-icon" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/rank_tips_icon.png" mode="widthFix" />
          </view>
        </view>
        <!-- /表头 -->

        <scroll-view class="table-body scrollbar pr"
                     scroll-y>
          <view class="loadding-wrapper" v-if="loading">
            <view class="dots-loading">
              <view></view>
              <view></view>
              <view></view>
            </view>
          </view>
          <template v-else>
            <view v-for="(item,index) in rankList"
                  :key="item.uid"
                  class="flex list-cell">
              <view class="table-header-rank fs-32 tc list-cell-rank"
                    :class="{'op-100': item.ranking_num === 1,
                            'op-5': item.ranking_num !== 1 && item.ranking_num < 4,
                            'op-3': item.ranking_num > 3 || item.ranking_num == '-' || item.ranking_num == 'WD',
                            'rubik-regular': item.ranking_num == '-' || item.ranking_num == 'WD'}">
                <text v-if="item.ranking_num == '-' || item.ranking_num == 'WD'">{{ item.ranking_num }}</text>            
                <text v-else-if="rankList.length > 1">{{ rankList[index - 1].ranking_num === item.ranking_num ? '' : item.ranking_num}}</text>
                <text v-else>{{ item.ranking_num }}</text>
              </view>
              <view class="flex flex1 list-cell-info mr-8" @click="gotoProfile(item)">
                <view class="g-avatar"
                      :style="{backgroundImage: `url(${item.avatar_url})`}"></view>
				<view class="tee" :style="{backgroundColor: teeColor(item.tee)}"></view>
                <view class="fs-24 text-over">{{item.username}}</view>
				<view class="gender-box" v-if="item.gender > 0">
					<image :src="`${ossUrl}/icons/${ item.gender == 1 ? 'icon-male' : 'icon-female'}.png`"
					       class="icon-gender"
					       mode="widthFix" />
				</view>
              </view>
			  <view class="list-cell-group" v-if="multiGroup">{{item.group}}组</view>
              <!-- /用户信息 -->
              <view class="list-cell-total table-header-total flex-center sub-color" :class="{'col-41A2FF': item.score_sum < 0}">
                {{item.score_sum > 0 ? '+'+item.score_sum : item.score_sum}}
              </view>
              <!-- /总分 -->
              <view class="list-cell-part table-header-part flex-center"
                    :class="{'complete-num': isCompleteHole(item)}">
                {{isCompleteHole(item) ? item.par_sum : item.complete_hold_num}}</view>
              <!-- /完成杆数 ｜ 洞数 -->
            </view>
          </template>
          <view style="height:90rpx;" v-if="rankList.length > 9" />
        </scroll-view>
      </view>
      <!-- E 列表 -->
      <!-- S 生成长图 -->
      <view class="gen-share-image-wrapper" @click="genShareImage">
        <image src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_wechat.png"></image>
        <text>生成长图分享好友</text>
      </view>
      <scroll-view v-if="imageShow" scroll-y="true" class="gen-image" :style="{width: screenWidth + 'px', height: screenHeight + 'px'}" @click="hideImage">
        <image :src="imagePath" :style="{width: screenWidth + 'px', height: imageHeight + 'px'}" />
      </scroll-view>
      
      <x-wxml-to-canvas
        v-if="painterShow"
        :hide="true"
        :isMode="false"
        ref="xWxmlToCanvas"
        :width="screenWidth"
        :height="imageHeight"
        :xWxml="xWxml"
        :xStyle="xStyle">
      </x-wxml-to-canvas>
      <!-- E 生成长图 -->
    </view>
    
    <uni-popup background-color="transparent"
               type="center"
               ref="rankTips">
        <view class="pr">
          <view class="close-rank-tips" @click="closeRankTips" />
          <image src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/svg/rank_tips.svg" class="rank-tips" mode="widthFix" />
        </view>
    </uni-popup>
  </uni-popup>
</template>

<script>
// api
import { getAllScore } from '@/api/chat-room/index';
import { getWxQRCode } from '@/api/utils'
import { mapGetters, mapState } from 'vuex';
import xWxmlToCanvas from '@/pages/chat-room/landscape/components/x-wxml-to-canvas/x-wxml-to-canvas.vue'
import fn from './whole-rank-painter.js'
import { generatePageShareParamString, PAGES } from '@utils/share'

export default {
  props: {
    // 球赛id
    competitionId: {
      type: Number,
      default: 0
    }
  },
  components: {
    xWxmlToCanvas
  },
  data() {
    return {
      ossUrl: this.$ossUrl,
      rankList: [], // 总榜单
      loading: false, // loading
      competitionInfo: {}, // 球局信息
      multiGroup: false, //多组
      painterShow: false,
      screenHeight: 300,
      screenWidth: 300,
      imageHeight: 300,
      xWxml: null,
      xStyle: null,
      imagePath: null,
      imageShow: false,
    };
  },

  computed: {
    ...mapState({
      competitionData: (state) => state.chatRoom.competitionData, // 球局信息
    }),
	...mapGetters(['getTeeColorList']),
    // 是否打完所有洞数
    isCompleteHole() {
      return function (data) {
        return data.complete_hold_num === data.hold_num;
      };
    },
    teeColor() {
      return function (tee) {
        let teeTarget = this.getTeeColorList.find((e) => e.value == tee);
        return (teeTarget && teeTarget.color) || 'transparent';
      };
    },
  },
  
  mounted() {
    uni.getSystemInfo({
      success: (res) => {
        this.screenHeight = res.windowHeight
        this.imageHeight = res.windowHeight
        this.screenWidth = res.windowWidth
      }
    })
  },

  methods: {
    // 获取总榜单
    async fetch() {
      try {
        this.loading = true;
        let res = await getAllScore({ competition_id: this.competitionId });
        let list = res.data.data.list;
        let groupList = []
        
        let rankList = []
        let wdList = []
        let rankNum = 1
        let lastTotalScore = 0
        
        list.forEach((item) => {
          
          if (groupList.indexOf(item.group) == -1 && !this.multiGroup) {
            groupList.push(item.group)
            this.multiGroup = groupList.length >= 2
          }
          
          if(this.competitionData.status == 0) {  //未开始
            item.ranking_num = '-'
            item.score_sum = 'E'
            item.complete_hold_num = '-'
            rankList.push(item)
          } else if (this.competitionData.status == 2) {//已结束
              item.score_sum = item.score_sum == 0 ? 'E' : item.score_sum
            if (this.isCompleteHole(item)) {  //已完成所有洞
              item.ranking_num = lastTotalScore != item.score_sum ? rankNum : ''
              rankNum++
              lastTotalScore = item.score_sum
              rankList.push(item)
            } else {
              item.ranking_num = 'WD'
              wdList.push(item)
            }
          } else {
            item.score_sum = item.score_sum == 0 ? 'E' : item.score_sum
            rankList.push(item)
          }
        })
        
        this.rankList = rankList.concat(wdList)
        console.log('this.rankList', this.rankList)
        // 初始化画布内容
        this.initPainterWxml()

      } finally {
        this.loading = false;
      }
    },
    // 打开
    open(data) {
      this.competitionInfo = data;
      this.$refs.popup.open();
      this.fetch();
    },
    // 关闭
    close() {
      this.$emit('onClose')
      this.$refs.popup.close();
    },
    async getQrcode() {
      const paramsStr = generatePageShareParamString(
        {
          page: PAGES.chat,
          params: [
            PAGES.chat,
            this.competitionId
          ]
        }
      );
      const res = await getWxQRCode({ scene: paramsStr, gl: false })
      if (typeof res.data === 'string') {
        return 'data:image/png;base64,' + res.data
      } else {
        return ''
      }
    },
    async initPainterWxml() {
      // 生成wxml
      let rankListWxml = fn.genRankListWxml(this.rankList, this.ossUrl, this.multiGroup)
      // console.log(rankListWxml)
      // 生成分享二维码
      const shareQrcode = await this.getQrcode()
      const shareQrcodeWxml = fn.genQrcodeWxml(shareQrcode)
      this.xWxml = fn.genWxml(this.competitionInfo, this.multiGroup, rankListWxml, shareQrcodeWxml)
      // console.log(this.xWxml)
      // 生成画布样式对象
      this.xStyle = fn.genStyle(this.screenWidth, this.screenHeight, this.rankList.length)
      this.imageHeight = this.xStyle.imageHeight
      // console.log(this.xStyle)
      this.painterShow = true
    },
    async genShareImage() {
      await this.$refs.xWxmlToCanvas.renderToCanvas()
      const imagePath = await this.$refs.xWxmlToCanvas.canvasToTempFilePath()
      // const imagePath = await this.$refs.xWxmlToCanvas.getCanvasImage()
      this.showImage(imagePath)
      uni.saveImageToPhotosAlbum({
        filePath: imagePath,
        success: function () {
          uni.showToast({
          	title: '图片已保存至相册',
          	icon: 'success'
          })
        }
      })
    },
    showImage(path) {
      this.imagePath = path
      this.imageShow = true
    },
    hideImage() {
      this.imageShow = false
    },
    handleRankTips() {
        this.$refs.rankTips.open()
    },
    closeRankTips() {
      this.$refs.rankTips.close()
    },
    gotoProfile(user) {
      if (user.hasOwnProperty('user_type') && user.user_type == 0) {
        return uni.showToast({
          icon: 'none',
          title: '该用户为虚拟用户'
        });
      }
      if (user?.uid) {
        uni.navigateTo({
          url: `/pages/tabbar/profile/UserProfile?uid=${user.uid}`
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/whole-rank-modal.scss';

.gen-image {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  overflow-y: scroll;
}

.rank-tips-icon {
  display:block;
  width:20rpx;
  height:28rpx;
  margin-left:6rpx;
}

.close-rank-tips {
  position: absolute; 
  width: 50rpx; 
  height: 50rpx;
  top: 50rpx;
  right: 40rpx;
}

.rank-tips {
  width:612rpx;
  height:934rpx;
}
.pl-22 {
  padding-left: 22rpx;
  box-sizing: border-box;
}
.col-41A2FF {
  color: #41A2FF;
}
</style>
