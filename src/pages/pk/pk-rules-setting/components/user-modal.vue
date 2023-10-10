<!--
 * @Author: simon
 * @Description: 操作列表
 * @LastEditors: simon
-->
<template>
  <uni-popup background-color="#fff"
             type="bottom"
             ref="popup"
             style="z-index: 55"
             :maskClick=maskClick
             @change="handleChange">
	<view class="tips flex-center" v-if="tips">{{tips}}</view>
    <view class="modal-wrapper fs-28 tc">
      <view class="action-list">
        <view v-for="(item, index) in userList"
              :key="index"
              class="action-cell border-b border-bn flex-between h-120 plr-32"
              @click="handleAction(item,index)">
          <view class="flex">
            <view class="g-avatar mr-10"
                  :style="{ backgroundImage: `url(${getGenderedAvatar(item)})` }"></view>
            <view>{{ item.username }}</view>
          </view>
          <g-checkbox :checked="item.check" />
        </view>
      </view>
      <!-- /操作列表 -->
      <view class="action-cell h-120 flex-center border-b"
            @click="submit" v-show="type == 'confirm'">确认</view>

      <view v-show="canCancel"
			class="action-cell h-120 flex-center col-53"
            @click="close(true)">取消</view>
    </view>
  </uni-popup>
</template>

<script>
// mixnis
import PkMixins from '../mixins/index';
import { mapMutations, mapState } from 'vuex';
import { mutationsTypes } from '@/store/modules/pk/types';
import { genderedAvatar } from '@/utils/image';

export default {
  mixins: [PkMixins],
  props: {
    // 类型：确认关闭 / 勾选确定人数后关闭
    type: {
      type: String,
      default: 'change'
    },
    maskClick: {
      type: Boolean,
      default: true
    },
    canCancel: {
      type: Boolean,
      default: true
    },
    tips: {
      type: String,
      default: ''
    },
    maxNum: {
    	type: Number,
    	default: 0
    }
  },
  data() {
    return {
      list: [],
      number: 0
    };
  },

  computed: {
    ...mapState({ 
      showBackButton: (state) => state.pk.showBackButton,
      isNowGroup: (state) => state.chatRoom.isNowGroup,
    }),
    userList() {
      // let list = this.competitionData?.competitor_list?.map((e) => {
      let list = this.list.map((e) => {
        this.$set(e, 'check', false);
        // this.$set(e, "rangGan", false)
        // this.$set(e, "rangFen", false)
        // this.$set(e, "x8421", "8421")
        return e;
      });
      return list;
    }
  },
  methods: {
    ...mapMutations([mutationsTypes.SET_PK_KEY]),
    getGenderedAvatar(user) {
      return genderedAvatar(user)
    },
    // 确认
    submit() {
      let checkList = this.userList.filter((e) => e.check);
      if(checkList.length < this.number){
        return uni.showToast({
          title: `至少选${this.number}人`,
          icon: 'none'
        })
      }
      this.$emit('onChange', checkList);
      this.close(false);
    },
    // 选择人员
    handleAction(e, i) {
	  let checkedList = this.userList.filter((e) => e.check);
	  if (!e.check && this.maxNum && checkedList.length >= this.maxNum) {	//设置了最大选择人数
		  return uni.showToast({
		    title: `至多选${this.maxNum}人`,
		    icon: 'none'
		  })
	  }
      e.check = !e.check;
      // 勾选确定人数后返回
      if (this.type == 'change') {
        let checkList = this.userList.filter((e) => e.check);
        if (checkList.length == this.number) {
          this.$emit('onChange', checkList);
          this.close(false);
        }
      }
    },
    // 打开
    open({ list, number }) {
      let competitorList = list.filter((e) => {
        if (e.group == this.isNowGroup) {
          return e
        }
      });
      this.list = [...competitorList];
      this.number = number;
      this.$refs.popup.open();
    },
    // 关闭
    close(isClick) {  //是否点击的取消
      this.$refs.popup.close();
      if (isClick) {
        this.$emit('onCancel', []);
      }
    },
    handleChange({ show }) {
      if (show) {
        this.SET_PK_KEY({ key: 'showBackButton', data: !this.showBackButton });
        return;
      }
      setTimeout(() => {
        this.SET_PK_KEY({ key: 'showBackButton', data: !this.showBackButton });
      }, 300);
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-wrapper {
  background-color: $white;
  .title-box {
    line-height: 90rpx;
  }
  .action-list {
    border-bottom: 12rpx solid $bg-col-f9;
    .action-cell {
      .g-avatar {
        @include wh(80rpx, 80rpx);
      }
    }
  }
}
.tips {
	height: 90rpx;
	text-align: center;
	color: #999999;
	font-size: 24rpx;
	font-weight: 400;
}
</style>
