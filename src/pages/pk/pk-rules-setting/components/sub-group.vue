
<template>
  <view>
    <!-- S 固拉 -->
	<view v-if="subGroup.length == 2" class="flex-between p-32 h-160" @click="openUserModal">
		<view class="flex1 flex-column">
			<view v-for="(competitor, index) in subGroup1" class="flex user">
				<image :src="getGenderedAvatar(competitor)" class="avatar flex-shrink-0 mr-16" mode="aspectFit" />
				<view class="fw-500 fs-24 h-34 text-over text">{{competitor.username}}</view>
			</view>
		</view>
		<image class="pk" :src="`${ossUrl}/gula-pk.png`" mode="widthFix"/>
		<view class="flex1 flex-column">
			<view v-for="(competitor, index) in subGroup2" class="flex user">
				<image :src="getGenderedAvatar(competitor)" class="avatar flex-shrink-0 mr-16 ml-48" mode="aspectFit" />
				<view class="fw-500 fs-24 h-34 text-over text">{{competitor.username}}</view>
			</view>
		</view>
	</view>
    <!-- E 固拉 -->
	
	<UserModal ref="userModal"
	           type="change"
             :maskClick=false
             tips="选择球手(2人)"
	           @onChange="getUsers"
             @onCancel="cancel"
             />
  </view>
</template>
<script>
// 组件
import UserModal from '@/pages/pk/pk-rules-setting/components/user-modal';
// mixins
import PkMixins from '../mixins/index';
// vuex
import { mapState } from 'vuex';
import { genderedAvatar } from '@/utils/image';

export default {
  mixins: [PkMixins],
  components: { UserModal },
  props: {
  	oldSubType: {
  		type: Number,
  		default: 1
  	}
  },
  data() {
    return {
        ossUrl: `${this.$ossUrl}/images/pk/icons`,
    };
  },
  computed: {
    competitorList() {
      return this.competitionData?.competitor_list.filter((e) => {
        if (e.group == this.isNowGroup) {
          return e
        }
      }); ;
    },
    subGroup() {
    	return this.pkConfig?.sub_group || []
    },
    subGroup1() {
    	let subGroup1 = []
    	let sub_group1 = this.pkConfig?.sub_group?.[0] || []
    	this.competitorList.forEach((competitor) => {
    		if (sub_group1.indexOf(competitor.competitor_id) != -1) {
    			subGroup1.push(competitor)
    		}
    	})
    	
    	return subGroup1
    	
    },
    subGroup2() {
    	let subGroup2 = []
    	let sub_group2 = this.pkConfig?.sub_group?.[1] || []
    	this.competitorList.forEach((competitor) => {
    		if (sub_group2.indexOf(competitor.competitor_id) != -1) {
    			subGroup2.push(competitor)
    		}
    	})
    	
    	return subGroup2
    },
    ...mapState({
      isNowGroup: (state) => state.chatRoom.isNowGroup,
    }),
    getGenderedAvatar(com) {
      return (com) => {
        return genderedAvatar(com)
      }
    },
  },
  mounted() {
	  this.pkConfig.sub_type == 0 && this.pkConfig?.sub_group.length == 0 && this.openUserModal()
  },
  methods: {
    // 获取操作信息
    openUserModal() {
		let list = this.competitorList
		let number = 2
		this.handleShow('userModal', { list, number });
    },
	// 打开对应选项模块
	handleShow(modal, data) {
	  this.$refs[modal].open(data || null);
	},
	getUsers(info) {
		let subGroup1Ids = []
		let subGroup2Ids = []
		
		info.forEach((competitor) => {
			subGroup1Ids.push(competitor.competitor_id)
		})
		
		this.competitorList.forEach((competitor) => {
			if (subGroup1Ids.indexOf(competitor.competitor_id) == -1) {
				subGroup2Ids.push(competitor.competitor_id)
			}
		})
		
		let subGroup = [subGroup1Ids, subGroup2Ids]

		this.SET_PK_CONFIG_ITEM({ key: 'sub_group', data: subGroup });
	},
    cancel(info) {
      this.SET_PK_CONFIG_ITEM({ key: 'sub_type', data: this.oldSubType });
  }
	},
};
</script>
<style lang="scss" scoped>
.cell-name {
  margin-top: -7rpx;
}
.left-icon {
  margin-right: 13rpx;
  width: 40rpx;
}
.h-160 {
	height: 160rpx;
}
.ml-48 {
    margin-left: 48rpx;
}
.user {
    &:nth-child(2n-1) {
      margin-bottom: 24rpx;
    }
	.avatar {
	  width: 64rpx;
	  height: 64rpx;
	  border-radius: 50%;
	}
}
.pk {
    width: 134rpx;
    margin: 0 16rpx;
}
</style>
