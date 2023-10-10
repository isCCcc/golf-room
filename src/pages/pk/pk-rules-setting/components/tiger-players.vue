<!--
 * @Author: simon
 * @Description: 老虎人员设置
 * @LastEditors: simon
-->
<template>
  <view>
    <!-- S 固定老虎 -->
    <view class="flex-between p-32 players-wrapper"
          v-if="pkConfig.tiger_style == 0">
      <view class="d-flex">
        <view class="mt-18 mr-10">老虎</view>
        <!-- S 选手 -->
        <RoomUserCell :text="tigerUser.username || '添加球员'"
                      textColor="#999999"
                      @click.native="handleUser('tiger',1)">
          <view v-if="!tigerUser.competitor_id" class="g-avatar pr add-avatar"></view>
          <GAvatar v-else :avatar-data="tigerUser" :size-in-rpx='80' :radius="'100%'" :handle-click="false"/>
        </RoomUserCell>
        <!-- E 选手 -->

      </view>
      <view class="d-flex">
        <view class="mr-40 mt-18">参与者</view>
        <view class="players-list flex"
              v-if="tigerUserList.length">
          <template v-for="(item,index) in tigerUserList">
            <view :key="index"
                  class="user-cell mb-32">
              <RoomUserCell :text="item.username || '添加球员'"
                            textColor="#999999"
                            @click.native="handleUser('list',2)">
                <!-- <view class="g-avatar pr"
                      :class="{'add-avatar': !item.competitor_id}"
                      :style="{backgroundImage:  `url(${getGenderedAvatar(item)})`}"></view> -->
                <view v-if="!item.competitor_id" class="g-avatar pr add-avatar"></view>
                <GAvatar v-else :avatar-data="item" :size-in-rpx='80' :radius="'100%'" :handle-click="false"/>
              </RoomUserCell>
            </view>
          </template>
        </view>
        <!-- S 选手 -->
        <RoomUserCell :text="'添加球员'"
                      textColor="#999999"
                      @click.native="handleUser('list',2)"
                      v-else>
          <view class="g-avatar pr add-avatar2"
                :class="{'add-avatar': true}"></view>
        </RoomUserCell>
        <!-- E 选手 -->

      </view>
    </view>
    <!-- E 固定老虎 -->

    <!-- S 流动老虎 -->
    <view class="p-32 players-list2 flex"
          v-if="pkConfig.tiger_style == 1">
      <template v-for="(item,index) in tigerLiuDongList">
        <view :key="index"
              class="user-cell">
          <RoomUserCell :text="item.username || '添加球员'"
                        textColor="#999999"
                        @click.native="handleUser('liudong',3)">
            <view v-if="!item.competitor_id" class="g-avatar pr add-avatar"></view>
            <GAvatar v-else :avatar-data="item" :size-in-rpx='80' :radius="'100%'" :handle-click="false"/>
          </RoomUserCell>
        </view>
      </template>
    </view>
    <!-- E 流动老虎 -->

    <UserModal ref="userModal"
               :type="type == 'tiger' ? 'change' : 'confirm'"
               @onChange="getUsers" />
    <!-- /选择人 -->
  </view>
</template>

<script>
// 组件
import RoomUserCell from '@components/common/room-user-cell/index';
import UserModal from '@/pages/pk/pk-rules-setting/components/user-modal';
// mixins
import PkMixins from '../mixins/index';
import { mapState } from 'vuex';
import GAvatar from '@/components/g-avatar/g-avatar.vue';

export default {
  components: {
    RoomUserCell,
    UserModal,
    GAvatar
},
  mixins: [PkMixins],

  data() {
    return {
      type: '' // 选择人员类型
    };
  },
  computed: {
    ...mapState({
      tigerUser: (state) => state.pk.tigerUser,
      tigerUserList: (state) => state.pk.tigerUserList,
      tigerLiuDongList: (state) => state.pk.tigerLiuDongList
    }),
    // 参赛选手
    competitorList() {
      return this.competitionData?.competitor_list;
    }
  },
  methods: {
    // 获取人员
    getUsers(info) {
      const dataMap = new Map([
        ['tiger', { key: 'tigerUser', data: info[0] }],
        ['list', { key: 'tigerUserList', data: info }],
        ['liudong', { key: 'tigerLiuDongList', data: info }]
      ]);
      let { key, data } = dataMap.get(this.type);
      this.SET_PK_KEY({ key, data });

      let players = [];
      // 固定老虎
      if (this.pkConfig.tiger_style == 0) {
        players = this.tigerUserList.map((e) => e.competitor_id);
        players.unshift(this.tigerUser.competitor_id);
      } else {
        // 流动老虎
        players = this.tigerLiuDongList.map((e) => e.competitor_id);
      }

      this.SET_PK_CONFIG_ITEM({ key: 'players', data: players });
    },
    // 点击选择人员
    handleUser(type, number) {
      this.type = type;
      let list = this.competitorList;
      this.handleShow('userModal', { list, number });
    },
    // 打开对应选项模块
    handleShow(modal, data) {
      this.$refs[modal].open(data || null);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/index.scss';
.mr-40 {
  margin-right: 40rpx;
}
.mt-18 {
  margin-top: 18rpx;
}
.g-avatar {
  flex: 0 0 80rpx;
  @include wh(80rpx, 80rpx);
}
.add-avatar2 {
  width: 270rpx;
  border-radius: 4rpx;
}
.players-wrapper {
  align-items: flex-start;
  .players-list {
    width: 210rpx;
    flex-wrap: wrap;
    justify-content: space-between;
    .user-cell {
      flex: 0 0 80rpx;
    }
  }
}
.players-list2 {
  .user-cell {
    width: calc((100vw - 64rpx) / 4);
  }
}
</style>
