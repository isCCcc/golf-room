<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view>
    <view class="rules-wrapper">
      <view class="box">
        <!-- S pk公开 -->
        <view class="h-120 plr-32 flex border-b"
              @click="handleShow">
          <GCell isLink
                 label="PK公开"
                 class="flex-1"
                 iconSize="36rpx">
            <view class="flex-end h-120 mr-10">
              <view class="col-999 fs-28 fw-400">
                {{ pkInfo.is_private == 0 ? "对外公开" : "仅同组可见" }}</view>
            </view>
          </GCell>
        </view>
        <!-- E pk公开 -->

        <!-- S 设置洞 -->
        <view class="h-120 plr-32 flex border-b"
              @click="handleSet">
          <GCell isLink
                 label="起始洞、跳洞"
                 class="flex-1"
                 iconSize="36rpx">
            <view class="flex-end h-120 mr-10">
              <view class="col-999 fs-28 fw-400 flex-end">
                <view class="start flex-center fs-28 fw-400 col-black">{{
                  pkInfo.start_hold
                }}</view>
                <view>号洞开始 共{{ pkHoles.length }}洞
                  {{ pkHoles.length == 18 ? "无" : "有" }}跳洞</view>
              </view>
            </view>
          </GCell>
        </view>
        <!-- E 设置洞 -->
        <!-- S 出发排名 -->
        <view class="plr-32 pb-32 flex flex-wrap"
              v-if="isShowRank">
          <GCell :isLink="false"
                 label="出发排名"
                 class="flex-1"
                 iconSize="36rpx">
            <view class="flex-end h-140 mr-10">
              <view class="col-999 fs-28 fw-400 flex-end">
                <view>
                  <view class="mt-8 tr flex-end" @click="handleChou"
                        ><!-- @click.stop="handleSyns" -->
                    <text class="fs-28 col-999 fw-400 col-53 mr-10">系统自动分配</text><g-checkbox :checked="isShowChou"/>
                  </view>
                </view>
              </view>
            </view>
          </GCell>
          <view class="bg-col-f9 flex plr-32 w-full" style="margin-top: -12rpx;">
            <view class="flex1 departure-list">
              <view v-for="(player, index) in pkInfo.start_player" class="flex player">
                <text class="col-999 fw-400 fs-28">{{index + 1}}</text>
                <image :src="getGenderedAvatar(competitorList[player])" class="avatar" mode="widthFix" />
                <text class="text-over fs-28 fw-400 ml-10 flex1" style="">{{competitorList[player].username}}</text>
              </view>
            </view>
            <view class="flex-shrink-0 flex-center pl-32" @click="handleDeparture">
              <text class="adjust">手动调整</text>
              <image src="http://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/icons/depature_change.png" 
                class="adjust-icon" mode="widthFix"/>
            </view>
          </view>
        </view>
        <!-- E 设置洞 -->
      </view>
      <!-- S PK规则 -->
      <view class="plr-32 label fs-32 fw-400">PK规则</view>
      <view class="box mb-40">
        <template v-for="(item, index) in pkRules">
          <view :key="index"
                class="border-bn h-160 flex plr-32"
                @click="handleItem(item, index)">
            <GCell isLink
                   class="flex-1"
                   iconSize="36rpx">
              <view slot="left"
                    class="flex">
                <view class="del-icon"
                      @click.stop="handleDel(item, index)"></view>
                <text class="fs-28 fw-400 ml-16">{{
                  item.pk_id | ruleName
                }}</text>
              </view>
              <view class="flex-end mr-10">
                <view class="item-text">
                  <view class="col-999 fs-24 fw-400 item-desc">{{
                    item.rules.desc
                  }}</view>
                  <HolesCell :pkHoles="pkHoles"
                             :validHoles="item.rules.valid_holes"></HolesCell>
                </view>
              </view>
            </GCell>
          </view>
        </template>
      </view>
      <!-- E PK规则 -->

    </view>
    <view class="fixed-bottom fixed-bg">
      <view class="flex ml-32 mr-32" v-if="!isTourists">
        <button class="button plain fw-500 fs-28 add"
                @click="handleAdd">
          添加规则
        </button>
        <button class="button sub fw-600 flex1"
                @click="handleSub"
                :loading="confirmLoading">
          确认并返回
        </button>
      </view>

      <div v-if="isTourists" class="but-disabled">当前状态下，您无法更改PK设置</div>
    </view>

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->
  </view>
</template>
<script>
// 组件
import GCell from '@components/g-cell/index.vue';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import ActionModal from '../../pk-rules-setting/components/action-modal';
import HolesCell from '@pages/pk/pk-rules-setting/components/holes';

import { groupAdd, groupUpd, pkUpdList } from '@api/pk';
import { genderedAvatar } from '@/utils/image';
export default {
  components: {
    GCell,
    ActionModal,
    HolesCell
  },
  data() {
    return {
      confirmLoading: false,
      actionList: [
        { type: 0, label: '对外公开' },
        { type: 1, label: '仅同组可见' }
      ],
      competitorList:{},
      isSystemAllocating: false, // 系统分配
    };
  },
  filters: {
    // 规则明显
    ruleName(type) {
      let nameList = new Map([
        [1, '单挂比杆'],
        [2, '单挂比洞'],
        [3, '单挂8421'],
        [4, '斗地主'],
        [5, '4人拉斯'],
        [7, '打老虎']
      ]);
      return nameList.get(type);
    }
  },
  computed: {
    ...mapState({
      pkRules: (state) => state.pk.pkRules,
      pkInfo: (state) => state.pk.pkInfo,
      pkHoles: (state) => state.pk.pkHoles || [],
      competitionData: (state) => state.chatRoom.competitionData, // 球局信息
      isUsersChanged: (state) => state.pk.isUsersChanged, // 是否是球局成员变动
      isTourists: (state) => state.pk.isTourists, // 是否是游客
      isNowGroup: (state) => state.chatRoom.isNowGroup,
      userInfo: (state) => state.user.userInfo,
    }),
    ...mapGetters({
      isWhiteList: 'user/isWhiteList',
    }),
    // 参与球局成员
    isUsers() {
      this.competitionData?.competitor_list?.forEach((item) => { this.$set(this.competitorList, item.competitor_id, item ) })
      
      return this.competitionData?.competitor_list?.map((e) => ({
        avatar_url: e.avatar_url,
        competitor_id: e.competitor_id * 1,
        group: e.group,
        username: e.username,
        uid: e.uid
      }));
    },
    // 编辑状态
    isEdit() {
      return !!this.pkInfo?.competition_group_pk_id;
    },
    // 总信息提交参数
    groupParams() {
      return {
        competition_id: this.pkInfo?.competition_id,
        group: this.pkInfo?.group,
        hold_list: JSON.stringify([...(this.pkInfo?.hold_list || [])]),
        start_hold: JSON.stringify(this.pkInfo.start_hold),
        hold_name: this.pkInfo.hold_name || `${'测试pk规则'}`,
        is_private: this.pkInfo.is_private,
        start_player: JSON.stringify([...(this.pkInfo?.start_player || [])]), // 出发排名
        start_player_display: JSON.stringify([
          ...(this.pkInfo?.start_player_display || [])
        ]), // 手动排序
        start_desc: this.pkInfo.start_desc,
        syn_order: 0 // 同步到球手顺序
      };
    },
    // 规则列表提交参数
    rulesParams() {
      return {
        competition_id: this.pkInfo?.competition_id,
        rules_list: JSON.stringify(
          this.pkRules.map((e) => {
            let item = {
              competition_id: e.competition_id,
              pk_id: e.pk_id,
              competitor_ids: e.competitor_ids,
              group: e.group,
              rules: e.rules
            };

            if (e.competition_pk_id)
              item.competition_pk_id = e.competition_pk_id;
            return item;
          })
        )
      };
    },
    // 显示出发排名
    isShowRank() {
      return this.pkRules.some((e) => [4,7].includes(e.pk_id * 1) || 5 == (e.pk_id * 1) && e.rules.sub_type );
    },
    // 显示抽标签
    isShowChou() {
      //假如组里一开始只有三个人先选了斗地主（会有出发排序生成），后来加了一个球员，这时出发顺序应该再增一人，因此将原来的start_player数据置0，系统重新排一遍
      let competitorList = this.competitionData?.competitor_list?.filter(e => e.group == this.isNowGroup).map(
                              (e) => e.competitor_id * 1
                            );
      let resetStartPlayer = false
      
      competitorList.forEach((competitor_id) => {
        if (this.pkInfo.start_player.indexOf(competitor_id) == -1) {
          resetStartPlayer = true
        }
      })
      
      if (resetStartPlayer) {
        this.pkInfo.start_player = competitorList;
        this.handleChou()
      }
      if (
        this.pkInfo?.start_player_display?.length &&
        this.pkInfo?.start_player?.length
      ) {
        return this.pkInfo.start_player_display?.every(
          (e, idx) => this.pkInfo.start_player[idx] == e
        );
      }
      return false;
    },
    isChecked() {
      return !!this.pkInfo.syn_order;
    },
  },
  methods: {
    ...mapMutations({
      SET_PAGE_STATUS: 'SET_PAGE_STATUS',
      SET_PK_RULES: 'SET_PK_RULES',
      SET_PK_KEY: 'SET_PK_KEY'
    }),
    ...mapActions({
      GET_PK_INFO: 'GET_PK_INFO'
    }),
    getGenderedAvatar(user) {
      return genderedAvatar(user)
    },
    handleSyns() {
      this.pkInfo.syn_order = this.pkInfo.syn_order ? 0 : 1;
      this.SET_PK_KEY({ key: 'pkInfo', data: this.pkInfo });
    },
    // 显示
    handleShow() {
      if(this.isTourists) {
        uni.showToast({
          title: '当前状态下，你无法进行pk设置',
          icon: 'none'
        })
        return;
      }
      this.$refs.actionModal.open(this.pkInfo.is_private);
    },
    // 获取操作信息
    getAction({ type }) {
      this.pkInfo.is_private = type;
      this.SET_PK_KEY({ key: 'drapkInfow_get', data: this.pkInfo });
      this.$refs.actionModal.close();
    },
    // 删除规则
    handleDel(item, idx) {
      if(this.isTourists) {
        uni.showToast({
          title: '当前状态下，你无法进行pk设置',
          icon: 'none'
        })
        return;
      }
      this.pkRules.splice(idx, 1);
      this.SET_PK_RULES(this.pkRules);
    },
    // 修改有效球洞
    handleSet() {
      if(this.isTourists) {
        uni.showToast({
          title: '当前状态下，你无法进行pk设置',
          icon: 'none'
        })
        return;
      }
      uni.navigateTo({ url: '/pages/pk/pk-holes-setting/index' });
    },
    handleDeparture() {
      if(this.isTourists) {
        uni.showToast({
          title: '当前状态下，你无法进行pk设置',
          icon: 'none'
        })
        return;
      }
      uni.navigateTo({ url: '/pages/pk/pk-departure-rank/index' });
    },
    // 添加规则
    handleAdd() {
      this.SET_PAGE_STATUS(2);
    },
    // 操作规则
    handleItem(item, idx) {
      console.log('item:', item);

      if(this.isTourists && !this.isWhiteList) {
        uni.showToast({
          title: '当前状态下，你无法进行pk设置',
          icon: 'none'
        })
        return;
      }
      this.SET_PK_KEY({ key: 'pkRulesIdx', data: idx });
      // 初始化pkConfig, pkUsers
      this.SET_PK_KEY({ key: 'pkConfig', data: { ...item.rules } });
      const competitorIds = item.competitor_ids.map((e) => e * 1);
      let pkUsers = this.isUsers.filter((e) =>
        competitorIds.includes(e.competitor_id)
      );
      pkUsers.map((e, i) => {
        e.rangGan = false;
        e.rangFen = false;
        if (e.competitor_id == item.rules.rang) {
          item.rules.sub_type == 1 ? (e.rangFen = true) : (e.rangGan = true);
        }
        // 8421
        if (item.pk_id == 3) {
          e.x8421 = item.rules.x8421[i];
        }
        // 斗地主 -- 计分类型是8421
        if (item.pk_id == 4 && item.rules.jifen_type == 1) {
          e.sflag = item.rules.x8421[i].sflag;
        }
        // 4人拉斯 -- 计分类型是8421
        if (item.pk_id == 5 && item.rules.jifen_type == 1) {
          e.x8421 = item.rules.x8421[i];
        }
      });
      this.SET_PK_KEY({
        key: 'pkUsers',
        data: pkUsers
      });
      // 打老虎
      if (item.pk_id == 7) {
        // 固定老虎
        if (item.rules.tiger_style == 0) {
          let tigerIndex = pkUsers.findIndex(
            (e) => e.competitor_id == item.rules.players[0]
          );
          let tigerUser = pkUsers.splice(tigerIndex, 1)[0];
          this.SET_PK_KEY({
            key: 'tigerUser',
            data: tigerUser
          });
          this.SET_PK_KEY({
            key: 'tigerUserList',
            data: pkUsers
          });
        } else {
          // 流动老虎
          this.SET_PK_KEY({
            key: 'tigerLiuDongList',
            data: pkUsers
          });
        }
      }

      uni.navigateTo({
        url: `/pages/pk/pk-rules-setting/index?pk_id=${item.pk_id}`
      });
    },
    // 确认保存
    async handleSub() {
      if (this.isSystemAllocating) {
        return;
      }
      this.confirmLoading = true;
      try {
        await this.handleVaild();
        if (this.isEdit) {
          // let params1 = {
          //   ...this.groupParams,
          //   competition_group_pk_id: this.pkInfo?.competition_group_pk_id
          // };
          // console.log('params1', params1);
          await groupUpd({
            ...this.groupParams,
            competition_group_pk_id: this.pkInfo?.competition_group_pk_id
          });
          // let params2 = {
          //   ...this.rulesParams,
          //   competition_group_pk_id: this.pkInfo?.competition_group_pk_id
          // };
          await pkUpdList({
            ...this.rulesParams,
            competition_group_pk_id: this.pkInfo?.competition_group_pk_id
          });
          // console.log('params2', params2);
          this.SET_PK_KEY({ key: 'isUsersChanged', data: false });

          this.confirmLoading = false;
          await this.GET_PK_INFO({
            competition_id: this.pkInfo?.competition_id,
            group: this.pkInfo?.group
          });
          
          //如果是返回得分页，则通知得分页要更新成绩
          let pages = getCurrentPages(); //当前页面栈
          if (pages.length > 1) {
            let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
            if (beforePage.route == "pages/pk/pk-score/index") {
               beforePage.data.refreshCompetitionPk = true;
            }
          }
          
          uni.navigateBack();
          return false;
        }
        const {
          data: { data }
        } = await groupAdd({ ...this.groupParams });
        await pkUpdList({
          ...this.rulesParams,
          competition_group_pk_id: data.competition_group_pk_id
        });
        this.SET_PK_KEY({ key: 'isUsersChanged', data: false });

        this.confirmLoading = false;
        await this.GET_PK_INFO({
          competition_id: this.pkInfo?.competition_id,
          group: this.pkInfo?.group
        });
        uni.navigateBack();
      } catch (err) {
        if (err.msg) {
          uni.showToast({ title: err.msg, icon: 'none' });
          this.confirmLoading = false;
        }
      } finally {
      }
    },
    // 提交参数之前验证
    handleVaild() {
      return new Promise((resolve, reject) => {
        const findRules = this.pkRules.filter((e) => [4,7].includes(e.pk_id * 1) || 5 == (e.pk_id * 1) && e.rules.sub_type);
        if (findRules.length && !this.pkInfo.start_player.length) {
          reject({ msg: '还需设置：出发排名' });
        }
        resolve();
      });
    },
    handleChou() {
      if(this.isTourists) {
        uni.showToast({
          title: '当前状态下，你无法进行pk设置',
          icon: 'none'
        })
        return;
      }
      if (this.isSystemAllocating) {
        return;
      }
      
      this.isSystemAllocating = true
      this.pkInfo.start_player_display = this.pkInfo.start_player //先让打勾显示出来

      let timer = setInterval(() => {
        this.pkInfo.start_player.sort(function () {
          return Math.random() - 0.5;
        });
      }, 200);
      
      let that = this
      setTimeout(function() {
        clearInterval(timer);
        
        that.isSystemAllocating = false
        that.pkInfo.start_player_display = that.pkInfo.start_player
        
        that.SET_PK_KEY({
          key: 'pkInfo',
          data: that.pkInfo
        });
      },2000)
    },
  }
};
</script>
<style lang="scss" scoped>
.rules-wrapper {
  padding: 32rpx 32rpx 0;
  padding-bottom: calc(110rpx + env(safe-area-inset-bottom));
  .box {
    background-color: $white;
    border-radius: 4rpx;
    box-shadow: 0px 4rpx 30rpx rgba(57, 80, 69, 0.08);
    .start {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      background-color: #ededed;
    }
  }
  .label {
    height: 86rpx;
    line-height: 86rpx;
  }
  .del-icon {
    width: 42rpx;
    height: 42rpx;
    border-radius: 50%;
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ic_del.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  .ml-16 {
    margin-left: 16rpx;
  }
  .mb-40 {
    margin-bottom: 40rpx;
  }
  .item-text {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .item-desc {
      max-width: 300rpx;
      white-space: nowrap;
      overflow-x: auto;
    }
    .item-desc ::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
      -webkit-appearance: none;
      background: transparent;
    }
  }
}
button.button {
  height: 96rpx;
  line-height: 96rpx;
}

.button.add {
  width: 218rpx;
  border: 1rpx solid rgba(0, 60, 61, 0.4);
  margin-right: 20rpx!important;
}
.h-160 {
  height: 160rpx;
}
.chou {
  display: inline-block;
  width: 38rpx;
  height: 34rpx;
  line-height: 34rpx;
  background: #95d171;
  font-size: 24rpx;
  font-weight: 400;
  color: #fff;
  text-align: center;
}
.text {
  font-size: 28rpx;
  font-weight: 400;
  color: #ff7777;
}
.h-140 {
  height: 140rpx;
}
.but-disabled {
  margin: 0 auto;
  width: 482rpx;
  height: 71rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 28rpx;
  background: rgba(83, 83, 83, 0.02);
  border: 1rpx solid rgba(83, 83, 83, 0.1);
  border-radius: 80rpx;
}
.departure-list {
  border-right: 1rpx solid #E9E9E9;
  padding: 32rpx 0;
  .player {
    margin-bottom:28rpx;
    color:#1A1A1A;
    &:first-child {
      margin-top:unset;
    }
    &:last-child {
      margin-bottom:unset;
    }
  }
  .avatar {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    margin-left: 12rpx;
  }
}
.adjust {
  color: #1E3E42;
  height: 30rpx;
  line-height: 30rpx;
  font-weight: 500;
  font-size: 28rpx;
}
.adjust-icon {
  width: 18rpx;
  height:21rpx;
  margin-left: 6rpx;
}
.fixed-bg {
  padding-top: 32rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 16.4%)!important;
  backdrop-filter: blur(10rpx)!important;
}
</style>
