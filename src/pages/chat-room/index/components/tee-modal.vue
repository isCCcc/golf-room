<template>
  <uni-popup background-color="transparent"
             type="center"
             ref="popup"
             @maskClick="showSelect = false">
    <view class="modal-wrapper">
      <!-- S 标题 -->
      <view class="title-wrapper pr">
        <image :src="`${ossUrl}/icons/logo.png`"
               class="title-logo y-center"
               mode="widthFix" />
      </view>
      <!-- E 标题 -->

      <view class="bg-white">
        <!-- S 用户信息 -->
        <view class="user-wrapper flex-between" @click="handleToUserProfile">
          <view class="pr">
            <GAvatar class="g-avatar"
                      :avatar-data="{ avatar_url: competitor.avatar_url}" 
                      :size-in-rpx='120'
                      :border="'2px solid white'"
                      :radius="'100%'" 
                      handle-click="false"/>
            <view class="fs-32 fw-bol user-name">{{competitor.username}}</view>
          </view>
          <!-- <view>
            <view class="fs-40 fw-bol">28</view>
            <view class="fs-24">差点</view>
          </view> -->
        </view>
        <!-- E 用户信息 -->

        <!-- S 当前tee -->
        <view class="tee-wrapper">
          <view class="fs-24 ml-10">当前 Tee 台</view>
          <view class="pr  mt-32">
            <viwe class="color-current color-cell flex-between"
                  @tap="handleSelect">
              <view class="flex">
                <view class="color-area"
                      :class="{ border: teeColor.label === '白' }"
                      :style="{backgroundColor: teeColor.color}"></view>
                <view class="fs-28 fw-bol">{{teeColor.label}} Tee</view>
              </view>
              <view class="flex"
                    v-if="isSelfCompetitor">
                <text class="fs-20">更换</text>
                <image :src="`${ossUrl}/icons/polygon5.png`"
                       class="icon-arrow ml-10"
                       mode="widthFix" />
              </view>
            </viwe>

            <!-- S 颜色选择器 -->
            <view class="color-select trans"
                  :style="{ height: showSelect ? '360rpx' : 0,borderBottom: showSelect ? '1rpx' : 0 }">
              <view class="flex color-cell"
                    v-for="item in candidateTeeColorList"
                    :key="item.color"
                    @click="teeColor = item;showSelect= false">
                <view class="color-area"
                      :class="{ border: item.label === '白' }"
                      :style="{ backgroundColor: item.color }"></view>
                <view class="fs-28 fw-bol">{{ item.label }} Tee</view>
              </view>
            </view>
            <!-- E 颜色选择器 -->
          </view>
        </view>
        <!-- E 当前tee -->

        <!-- S 按钮 -->
        <view class="btn-wrapper flex-between"
              v-if="isSelfCompetitor">
          <button class="button plain flex1"
                  style="margin-right: 32rpx"
                  @click="handleDel"
                  :loading="delLoading"
                  v-if="(isLeader && !isSelf) || (!isLeader && !isSelf)">踢出球友</button>
          <button class="button flex1"
                  @click="confirm"
                  :loading="confirmLoading">确认</button>
        </view>
        <!-- E 按钮 -->

      </view>

    </view>
  </uni-popup>
</template>

<script>
// 组件
import uniPopup from '@/components/uni-popup/uni-popup';
// vuex
import { mapGetters, mapMutations } from 'vuex';
import { mutationsTypes } from '@/store/modules/chat-room/types.js';
// api
import { updTee, delCompetitor } from '@/api/chat-room/index';
// utils
import { checkTee, pushTask } from '@utils/error-task/index';
import {handleDelCompetitor} from '../utils';
import GAvatar from '@/components/g-avatar/g-avatar.vue';

export default {
  props: {
    // 用户信息
    userInfo: {
      type: [Object, null],
      default: () => ({})
    },
    // 本人是否是参赛人员
    isSelfCompetitor: {
      type: Boolean,
      default: false
    }
  },

  components: {
    uniPopup,
    GAvatar
},

  data() {
    return {
      ossUrl: this.$ossUrl,
      showSelect: false,
      teeColor: {}, // 球员tee颜色
      competitor: {}, // 球员信息
      confirmLoading: false, // 确认loading
      delLoading: false // 踢出loading
    };
  },

  computed: {
    ...mapGetters(['getTeeColorList', 'getCompetitionData']),
    candidateTeeColorList() {
      return this.getTeeColorList.filter((tee) => {
        return tee.color != this.teeColor.color
      })
    },
    // 是否是群主
    isLeader() {
      return this.getCompetitionData.uid === this.competitor.uid;
    },
    // 是否是本人
    isSelf() {
      console.log("tee-modal")
      return this.competitor.uid === this.userInfo.uid;
    }
  },

  methods: {
    ...mapMutations([mutationsTypes.SET_COMPETITION_ITEM]),
    handleToUserProfile() {
      if (this.competitor.hasOwnProperty('user_type') && this.competitor.user_type == 0) {
        return uni.showToast({
          icon: 'none',
          title: '该用户为虚拟用户'
        });
      }

      if (this.competitor?.uid) {
        uni.navigateTo({
          url: `/pages/tabbar/profile/UserProfile?uid=${this.competitor.uid}`,
          fail: (e) => {
            console.error(e);
          }
        });
      }
    },
    // // 踢出球友 -- 成功处理
    // handleSuccessDel(dataSource) {
    //   let { competitor_list } = this.getCompetitionData;
    //   let index = competitor_list.findIndex(
    //     (e) => e.competitor_id == dataSource
    //   );
    //   if (index != -1) {
    //     competitor_list.splice(index, 1);
    //     this.SET_COMPETITION_ITEM('competitor_list', competitor_list);
    //   }
    // },
    // 更换tee颜色 -- 成功处理
    handleSuccessUpdateTee(dataSource) {
      let { competitor_list } = this.getCompetitionData;
      let index = competitor_list.findIndex(
        (e) => e.competitor_id == dataSource.competitorId
      );
      if (index != -1) {
        competitor_list[index].tee = parseInt(dataSource.tee);
        this.SET_COMPETITION_ITEM({
          key: 'competitor_list',
          data: competitor_list
        });
      }
    },
    // 选择颜色
    handleSelect() {
      if (!this.isSelfCompetitor) return;
      this.showSelect = !this.showSelect;
    },
    // 踢出球友
    async handleDel() {
      uni.showModal({
        title: `确认删除【${this.competitor.username}】吗?`,
        cancelText: '不删除',
        confirmText: '删除',
        confirmColor: '#FF6A6A',
        success: async (res) => {
          if (res.confirm) {
            handleDelCompetitor(this,this.competitor.competitor_id);
            this.close();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    // 确认
    async confirm() {
      let params = {
        competitor_id: this.competitor.competitor_id,
        tee: this.teeColor.value
      };
      this.confirmLoading = true;
      try {
        let {
          data: { data }
        } = await updTee(params);
        this.handleSuccessUpdateTee(data);
        this.close();
      } catch ({ errMsg, statusCode }) {
        if (errMsg.includes('request:fail') || statusCode === 500) {
          const newParams = checkTee(params);
          pushTask('tee', newParams, updTee);
        }
      } finally {
        this.confirmLoading = false;
      }
    },
    // 打开
    open(competitor) {
      this.teeColor =
        this.getTeeColorList.find((item) => item.value == competitor.tee) || {};
      this.competitor = competitor;
      this.$refs.popup.open();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
      this.showSelect = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/teel-modal.scss';
</style>
