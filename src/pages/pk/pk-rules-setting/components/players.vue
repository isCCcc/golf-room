<!--
 * @Author: simon
 * @Description: 选手
 * @LastEditors: simon
-->
<template>
  <view :style="[5].includes(pkConfig.type) ? 'display:none;' : ''">
    <!-- S 选手 -->
    <view class="border-b players-wrapper">
      <view class="label fs-28 fw-400 flex items-center">选手</view>
      <view class="flex1 d-flex flex-wrap players-list"
            :class="{'flex-end': pkConfig.number == 2}">
        <template v-for="item in pkConfig.number">
          <view :key="item"
                class="mb-32 players-cell"
                :class="{'ml-32': pkConfig.number == 2}"
                :style="{'width': widthStyle}"
                >
            <!-- S 选手 -->
            <RoomUserCell :text="pkUsers[item].username || '添加球员'"
                          textColor="#999999"
                          @click.native="handleUser">
              <view v-if="pkUsers[item] == null" class="g-avatar pr add-avatar"></view>
              <GAvatar v-else :avatar-data="pkUsers[item]" :size-in-rpx='80' :radius="'100%'" :handle-click="false"/>
            </RoomUserCell>
            <!-- E 选手 -->

            <!-- S 让分/让杆 -->
            <view>
              <view class="box-8421 tc mt-32"
                    v-if="showNumber && pkUsers[item].username"
                    @click="handleNumber(item)">{{pkUsers[item].x8421}}</view>
              <template v-if="pkUsers.length == 2">
                <view class="fs-24 box-rang tc mt-32"
                      :class="{'is-active': pkUsers[item].rangGan}"
                      @click="handleRang({key: 'rangGan',index: item})"
                      v-if="rangGan">让杆</view>
                <view class="fs-24 box-rang tc mt-32"
                      :class="{'is-active': pkUsers[item].rangFen}"
                      @click="handleRang({key: 'rangFen',index: item})"
                      v-if="pkConfig.rang_style == 0">让分</view>
              </template>
            </view>
            <!-- E 让分/让杆 -->

          </view>
        </template>
      </view>
    </view>
    <!-- E 选手 -->

    <Ganddong v-show="showGandong" />

    <UserModal ref="userModal"
               @onChange="getUsers" />
    <!-- /选择人 -->
    <NumberLlistModal ref="numberModal"
                      :type="2"
                      @onClick="getNumber" />
    <!-- /数字列表 -->
    <InputModal ref="inputModal"
                placeholder="请输入4位或5位数字"
                type="8421"
                @onChange="getInputValue" />
    <!-- /输入框 -->
  </view>

</template>
<script>
//组件
import RoomUserCell from '@components/common/room-user-cell/index';
import UserModal from '@/pages/pk/pk-rules-setting/components/user-modal';
import Ganddong from '@/pages/pk/pk-rules-setting/components/ganddong';
import NumberLlistModal from '@/pages/pk/pk-rules-setting/components/number-llist-modal';
import InputModal from '@/pages/pk/pk-rules-setting/components/input-modal';
// mixins
import PkMixins from '../mixins/index';
// vuex
import { mapState } from 'vuex';
import GAvatar from '@/components/g-avatar/g-avatar.vue';

export default {
  props: ['rangGan', 'showNumber'],
  mixins: [PkMixins],
  components: {
    RoomUserCell,
    UserModal,
    Ganddong,
    NumberLlistModal,
    InputModal,
    GAvatar
},

  data() {
    return {
      uindex: -1 // 当前用户索引
    };
  },
  computed: {
    ...mapState({
      pkUsers(state) {	//() => {}函数语法，因为它过早地绑定了this，导致后面用不了this;新增规则时检验组里参与人员是否等于游戏规则人数，是的话自动填充
		  let competitorList = state.chatRoom.competitionData?.competitor_list?.filter(e => e.group == state.chatRoom.isNowGroup).map(
              (e) => e
       );
		  if (state.pk.pkUsers.length == 0 && state.pk.pkConfig.number == competitorList.length) {
		  	this.getUsers(competitorList)
		  }
		  return state.pk.pkUsers;
	  } // 参与选手
    }),
    showGandong() {
      return this.pkUsers?.some((e) => e.rangGan);
    },
    widthStyle() {
      let num = this.pkConfig.number == 4 ? 4 : 3;
      return `calc((100vw - 100rpx - 32rpx - 32rpx - 32rpx) / ${num})`
    },
  },
  methods: {
    // 获取输入的值
    getInputValue(value) {
      this.pkUsers[this.uindex].x8421 = value + '';
      this.SET_PK_KEY({ key: 'pkUsers', data: this.pkUsers });
      this.$refs.inputModal.close();
    },
    // 获取分数
    getNumber({ type }) {
      // 自定义分数
      if (type == 'custom') {
        this.$refs.numberModal.close();
        this.handleShow('inputModal', '');
        return;
      }
      this.pkUsers[this.uindex].x8421 = type;
      this.SET_PK_KEY({ key: 'pkUsers', data: this.pkUsers });
      this.$refs.numberModal.close();
    },
    // 点击分数
    handleNumber(index) {
      this.uindex = index;
      this.handleShow('numberModal', this.pkUsers[this.uindex].x8421);
    },
    // 获取人员
    getUsers(data) {
      let list = data.map((e) => {
        this.$set(e, 'rangGan', false);
        this.$set(e, 'rangFen', false);
        this.$set(e, 'x8421', '8421');
        this.$set(e, 'sflag', '8421');
        return e;
      });
      this.SET_PK_KEY({ key: 'pkUsers', data: list });
      this.SET_PK_CONFIG_ITEM({
        key: 'players',
        data: list.map((e) => e.competitor_id)
      });
    },
    // 点击选择人员
    handleUser() {
      let list = this.competitionData.competitor_list;
      this.handleShow('userModal', { list, number: this.pkConfig.number });
    },
    // 让分/让杆
    handleRang({ key, index }) {
      this.pkUsers[index][key] = !this.pkUsers[index][key];
      if (this.pkUsers[index][key]) {
        key == 'rangGan'
          ? (this.pkUsers[index]['rangFen'] = false)
          : (this.pkUsers[index]['rangGan'] = false);
      }
      this.pkUsers.map((e, i) => {
        if (i != index) {
          e.rangGan = false;
          e.rangFen = false;
        }
      });
      this.SET_PK_KEY({ key: 'pkUsers', data: this.pkUsers });
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

.mt-22 {
  margin-top: 22rpx !important;
}

.players-wrapper {
  padding: 32rpx 0 0 32rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .label {
    width: 100rpx;
    height: 80rpx;
  }
  .players-list {
    justify-content: flex-end;
    .g-avatar {
      @include wh(80rpx, 80rpx);
    }
    .players-cell {
      // width: calc((100vw - 100rpx - 32rpx - 32rpx - 32rpx) / 4);
    }
  }
}

.box-rang {
  margin-right: auto;
  margin-left: auto;
  width: 112rpx;
  height: 54rpx;
  line-height: 54rpx;
  border: 1px solid $col-e9;
  border-radius: 2rpx;
  background: $white;
  color: $black;
}
.box-rang.is-active {
  background: $col-1e3;
  color: $white;
}
.box-8421 {
  margin-right: auto;
  margin-left: auto;
  width: 90rpx;
  line-height: 40rpx;
  color: $col-1e3;
  background: $sub-color;
  border-radius: 2rpx;
}
</style>
