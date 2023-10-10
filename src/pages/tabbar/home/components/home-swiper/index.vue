<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <!-- S 轮播图 -->
  <view class="h-auto w-auto pr">
    <swiper class="swiper" @change="handleSwiperChange">
      <swiper-item
        v-for="item in swiperData"
        :key="item.key"
        class="swiper-item"
      >
        <!-- <components :is="item.key"></components> 小程序不支持-->
        <view class="px-32 col-white h-full">
          <competition v-if="item.key.startsWith('cur_competition')" :info="item.data" />
          <profile v-if="item.key === 'profile'" :info="item.data" @changeAvatar="handleChangeAvatar" />
          <competition_calendar v-if="item.key === 'competition_calendar'" :info="item.data" />
        </view>
      </swiper-item>
    </swiper>
    <!-- / 轮播 -->
    <view class="pa dots">
      <view
        class="dot"
        v-for="(_, index) in swiperData"
        :key="index"
        :class="[index === current ? 'dot-active' : '', index !== 0 ? 'ml-6' : '']"
      />
    </view>

    <!-- / 轮播指示点 -->
  </view>
  <!-- E 轮播图 -->
</template>
<script>
import { isValid } from '@/utils'
import { getBannerList } from '@/api/list/index'
import competition_calendar from './components/competition_calendar.vue'
import competition from './components/competition.vue'
import profile from './components/profile.vue'
import { isString } from 'util'

export default {
  options: {
    styleIsolation: 'shared',
  },
  components: {
    competition_calendar,
    competition,
    profile,
  },
  data() {
    return {
      current: 0,
      list: [
        { key: 'today_competition_list', data: null }, //正在进行的球局列表
        { key: 'profile', data: null }, //资料卡
        { key: 'competition_calendar', data: null }, //比赛日历
      ],
    }
  },
  created() {
    this.getBannerLists()
  },
  computed: {
    swiperData() {
      let swiperArr = []
      const filterList = this.list.filter((item) => isValid(item.data)) //过滤不为空的
      // 如果today_competition_list今日比赛的列表为空
      if (filterList?.length === 2) {
        swiperArr = filterList
      } else {
        filterList.forEach((item) => {
          if (item.key === 'today_competition_list') {
            item.data.forEach((ch) => {
              swiperArr.push({
                key: 'cur_competition' + (ch.competition_id || 0),
                data: ch,
              })
            })
          } else {
            swiperArr.push({
              key: item.key,
              data: item.data,
            })
          }
        })
      }
      return swiperArr
    },
  },
  methods: {
    handleSwiperChange(e) {
      const { current: _current } = e.detail
      this.current = _current
      this.getBannerLists() // 更新轮播信息
    },
    
    async getBannerLists() {
      try {
        const { data: res } = await getBannerList()
        if (res?.code === 0) {
          this.list = this.list.map((item) => {
            return { ...item, data: res?.data?.[item.key] }
          })
        }
      } catch (error) {}
    },

    handleChangeAvatar() {
      this.$emit('change-avatar')
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
              finished: async ({ croppedAvatar, uploadedAvatar }) => {
                if (isString(uploadedAvatar) && uploadedAvatar.length > 0) {
                  // 上传完毕立即保存
                  const info = {
                    avatar_url: uploadedAvatar
                  }
                  await this.$store.dispatch("user/UPDATE_USER_INFO", { data: info, gl: true });
                  this.getBannerLists();
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
  },
}
</script>
<style lang="scss" scoped>
@import './home-swipe.scss';

.swiper {
  height: calc($home-swipe-content-height + $home-swipe-top);
  ::v-deep .uni-swiper-wrapper .uni-swiper-dots {
    background-color: red;
  }
}
.swiper-item {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.dots {
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  bottom: 15rpx;
  .dot {
    width: 8rpx;
    height: 4rpx;
    background: rgba(255, 255, 255, 0.2);
    &-active {
      width: 14rpx;
      height: 7rpx;
      background: #ffffff;
    }
  }
}
.ml-6 {
  margin-left: 6rpx;
}
</style>
