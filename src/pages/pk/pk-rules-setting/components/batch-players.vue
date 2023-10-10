<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: superJane
-->
<template>
  <view class="p-32">
    <view class="fs-28">批量哪些人?</view>
    <view class="players-list flex">
      <template v-for="(item,index) in batchUserList">
        <view :key="index"
              class="user-cell">
          <RoomUserCell :text="item.username || '添加球员'"
                        textColor="#999999"
                        @click.native="handleUser">
            <view v-if="!item.competitor_id" class="g-avatar pr add-avatar"></view>
            <GAvatar v-else :avatar-data="item" :size-in-rpx='80' :radius="'100%'" :handle-click="false"/>
          </RoomUserCell>
        </view>
      </template>
    </view>
    <UserModal ref="userModal"
               type="confirm"
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
  computed: {
    ...mapState({
      isNowGroup: (state) => state.chatRoom.isNowGroup,
      batchUserList: (state) => {
        return state.pk.batchUserList;
      } // 参与选手
    }),
    // 参赛选手
    competitorList() {
      return this.competitionData?.competitor_list.filter((e) => {
        if (e.group == this.isNowGroup) {
          return e
        }
      });
    }
  },
  methods: {
    // 获取人员
    getUsers(data) {
      this.SET_PK_KEY({ key: 'batchUserList', data });
    },
    // 点击选择人员
    handleUser() {
      let list = [...this.competitorList];
      this.handleShow('userModal', { list, number: 3 });
    },
    // 打开对应选项模块
    handleShow(modal, data) {
      this.$refs[modal].open(data || null);
    }
  }
};
</script>

<style lang="scss" scoped>
.players-list {
  margin-top: 50rpx;
  .user-cell {
    width: calc((100vw - 64rpx) / 4);
    .g-avatar {
      flex: 0 0 80rpx;
      @include wh(80rpx, 80rpx);
    }
  }
}
</style>
