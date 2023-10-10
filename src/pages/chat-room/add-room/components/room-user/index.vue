<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="box">
    <template>
      <view class="h-200 plr-50 border-b flex flex-justity-start pr"
            v-for="(item, index) in list" :key="item.id"
            @click="handleShowMore(index)">
        <template>
          <view class="w-25"
                v-for="(child) in item.users.slice(0, 4)"
                :key="child.uid">
            <RoomUserCell :avatar="getGenderedAvatar(child)"
                          :text="child.username"></RoomUserCell>
          </view>
        </template>
        <!-- /成员列表 -->
        <view class="w-25 add-user"
              @tap.stop="handleAdd(index)"
              v-if="item.users.length < 4">
          <RoomUserCell text="添加球员"
                        textColor="#999999">
            <view class="g-avatar add-avatar pr"></view>
          </RoomUserCell>
        </view>
        <!-- / 添加成员 -->
        <view class="class-tag pa">
          <text class="fs-24 fw-400">{{ item.group }}组</text>
        </view>
        <!-- / 定位组名称-->
        <uni-icons type="more-filled"
                   :size="18"
                   color="#C4C4C4"
                   class="icon-more pa"></uni-icons>
        <!-- /更多icon -->
      </view>
    </template>
    <!-- / 分组列表 -->
<!--    <view class="h-155 flex-center">
      <button class="button plain add-sub fs-28 fw-500"
              @tap="handleAddGroup">
        添加分组
      </button>
    </view> -->

    <!-- 添加分组 -->
    <Friends ref="setFriendsModal"></Friends>
    <!-- / 好友列表 -->

    <MoreModal ref="moreModal"
               @onClick="handleMore" />
  </view>
</template>

<script>
// 组件
import Friends from '@pages/chat-room/add-room/components/friends/index.vue';
import RoomUserCell from '@components/common/room-user-cell/index.vue';
import { mapGetters } from 'vuex';
import UniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
import MoreModal from './more-modal.vue';
import { genderedAvatar } from '@/utils/image';
import { trunc } from '@/utils';
import { PAGE_CHAT_SHARE_TYPE, shareCompetitionInvite } from '@/utils/share';
export default {
  props: {
    // 类型 new创建 edit修改
    roomType: {
      type: String
    }
  },
  components: {
    RoomUserCell,
    Friends,
    UniIcons,
    MoreModal
  },
  inject: ['getCompetitionId', 'getCompetitionNo', 'getCompetitionInfo'],
  data() {
    return {
      list: [
        {
          id: 0,
          group: 'A',
          users: []
        }
      ],
      tempIndex: 0,
      currentGroupIndex: 0 // 选择的分组
    };
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
      userInfo: 'user/userInfo',
      competitionData: 'getCompetitionData' // 球局详情
    }),
  },
  mounted() {
    this.onGREvent('update-competitor', ({ list, index }) => {
      console.log('update-competitor', list);
      this.$set(this.list[index], 'users', list);
      // if (list.length == 0) {
      //   this.resetList(index)
      // }
    });
    let typeData = {
      new: this.newInit,
      edit: this.editInit
    };
    typeData[this.roomType]();
  },
  methods: {
    getGenderedAvatar(user) {
      return genderedAvatar(user)
    },
    // 更多操作处理
    handleMore(e) {
      switch (e.type) {
        case 'edit-users':
          uni.navigateTo({
            url: '/pages/chat-room/add-room/edit-competitor/index',
            success: (res) => {
              res.eventChannel.emit('getcompetitorList', {
                list: [...this.list[this.currentGroupIndex].users],
                index: this.currentGroupIndex
              });
            }
          });
          this.$refs.moreModal.close();
          break;
        case 'del-group':
          this.$refs.moreModal.close();
          uni.showModal({
            title: `删除分组`,
            content: `将删除此分组及组内球员`,
            cancelText: '取消',
            confirmText: '删除',
            confirmColor: '#FF6A6A',
            success: async (res) => {
              if (res.confirm) {
                // this.list.map((e, index) => {
                //   if (index > this.currentGroupIndex)
                //     e.group = String.fromCharCode(e.group.charCodeAt(0) - 1);
                // });
                 this.list.splice(this.currentGroupIndex, 1);
                
                //this.resetList(this.currentGroupIndex)
                
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        default:
          break;
      }
    },
    // 打开更多操作
    handleShowMore(index) {
      this.currentGroupIndex = index;
      this.$refs.moreModal.open();
    },
    // 编辑初始化
    editInit() {
      let groupNamePrefix = [...Array(26)].map((v,i) => String.fromCharCode(i + 65))
      let lastIndex = -1
      this.list = []
      this.competitionData.group_list.map((e, i) => {
        let groupIndex = groupNamePrefix.indexOf(e)
        
        if (lastIndex + 1 != groupIndex) {  //不是按顺序连贯组的，则要将中间空缺组补上去
          let fillings =  groupIndex - lastIndex - 1  //中间要填充的个数
          let fillIndex = lastIndex + 1 //要填充的下标
          for (let i = 0; i < fillings; i++, fillIndex++) {
            this.list.push({
              id: fillIndex,
              group: groupNamePrefix[fillIndex],
              users: []
            })
          }
        }
        //将正主push进list
        this.list.push({
          id: groupIndex,
          group: e,
          users: []
        })
        
        lastIndex = groupIndex
      });

      this.list.map((e) => {
        let filterGroup = this.competitionData.competitor_list.filter(
          (v) => v.group == e.group
        );
        e.users = filterGroup;
      });
      console.log('列表', this.list);
    },
    // 创建初始化
    newInit() {
      //自动把创建人加入第一组
      if (this.isAuth && this.userInfo?.uid) {
        this.list[0].users.push({
          avatar_url: this.userInfo.avatar_url,
          uid: this.userInfo.uid,
          username: this.userInfo.username
        });
        console.log('球员列表', this.list);
      }
    },
    // 删除球员
    // handleRemove(index, childIndex) {
    //   this.list[index].users.splice(childIndex, 1);
    // },
    handleAdd(index) {
      this.tempIndex = index;
      const disabledList = this.list.reduce(
        (pre, { users }, idx) =>
          idx === index ? pre : [...pre, ...users.map(({ uid }) => uid)],
        []
      );
      if (this.roomType === 'edit') { // edit 的时候，才能有完整的 competitionData
        const caddiesIds = this.competitionData.caddie_briefs?.map((caddie) => caddie.uid)
        disabledList.push(...(caddiesIds || []))
      }
      const targetCompetitionInfo = this.list[index];


      const competitionInfoInNew = this.getCompetitionInfo()
      const targetCompetitionData = this.roomType === 'edit' ? this.competitionData : {
        competition_id : this.competitionData.competition_id || Number(this.getCompetitionId()),
        competition_name : this.competitionData.competition_name || competitionInfoInNew.competition_name,
        competition_no : this.competitionData.competition_no || this.getCompetitionNo(),
        uid : this.competitionData.uid || this.userInfo.uid,
        group : targetCompetitionInfo.group,
        start_time : this.competitionData.start_time || competitionInfoInNew.start_time,
        course_name : this.competitionData.course_name || competitionInfoInNew.course_name,
        course_id : this.competitionData.course_id || competitionInfoInNew.course_id,
      }

      const sharing = {
        pageSharing: () => {
          const data = targetCompetitionData

          return shareCompetitionInvite({
            id: data.competition_id,
            name: data?.competition_name,
            group: targetCompetitionInfo.group,
            uid: data?.uid,
            shareRoomName: data?.competition_name,
            imageUrl: undefined, // 使用默认图
          });
        },
        goShareQRCode: () => {
          const data = targetCompetitionData

          const params = {
            id: data.competition_id,
            no: data.competition_no,
            group: targetCompetitionInfo.group,
            time: data?.start_time,
            course: data?.course_name,
            course_id: data?.course_id,
            type: PAGE_CHAT_SHARE_TYPE.invite,
            uid: data?.uid,
            shareRoomName: data?.competition_name,
          }

          uni.navigateTo({
            url: `/pages/chat-room/add-room/share/index?params=${encodeURIComponent(
              JSON.stringify(params)
            )}`,
          })
        }
      }

      this.$refs.setFriendsModal.open(targetCompetitionInfo, disabledList, sharing, targetCompetitionData, true);
    },
    handleSetFriends(value) {
      this.list[this.tempIndex].users = value;
    },
    handleAddGroup() {
      const groupNamePrefix = [...Array(26)].map((v,i) => String.fromCharCode(i + 65))
      const last = this.list.at(-1);
      
      // if (last.users.length == 0) {
      //   return uni.showToast({
      //           title: `请先添加${last.group}组球员后再添加分组。`,
      //           icon: "none",
      //           duration: 2000,
      //         });
      // }
      
      const newId = last ? last.id + 1 : 0;
      const newGroup = groupNamePrefix[newId % groupNamePrefix.length] + '' + (trunc(newId / groupNamePrefix.length) || '');
      this.list.push({
        id: newId,
        group: newGroup,
        users: [],
      });
    },
    getCompetitors() {
      return this.list.reduce((pre, { users, group }) => {
        const list = users
          .filter((item) => !pre.some((ele) => ele.uid === item.uid))
          .map((item, index) => {
            console.log('球员item====',item);
            let obj = {
              uid: item.uid,
              group
            };
            // 序号
            if (this.roomType == 'edit') {
              obj.sort = index + 1;
              // 有competitor_id传competitor_id
              if(item.competitor_id){
                obj.competitor_id = item.competitor_id
              }
            }
            return obj;
          });
        return [...pre, ...list];
      }, []);
    },
    async validate() {
      const list = this.getCompetitors();
      if (!list.length) {
        uni.showToast({ title: '请添加成员', icon: 'none' });
        return Promise.reject();
      }
      return JSON.stringify(list);

      // const flag = this.list.some(({ group, users }) => {
      //   if (!users.length) {
      //     uni.showToast({
      //       title: `请添加${group}组成员`,
      //       icon: 'none',
      //     })
      //     return true
      //   }
      // })

      // return flag ? Promise.reject() : this.getCompetitors()
    },
    resetList(currentGroupIndex) {
        let list = []
        this.list.forEach((item, index) => {
        if (index < currentGroupIndex) {
          list.push(item)
        } else if (index >= currentGroupIndex && index != this.list.length -1 ) { //最后一个不插入
          item.users = this.list[index + 1].users
          list.push(item) //把后一个元素的users往前挪
        }
      })
      this.list = list
    },
  }
};
</script>

<style lang="scss" scoped>
.box {
  background: #ffffff;
  box-shadow: 0px 4rpx 30rpx rgba(57, 80, 69, 0.08);
  border-radius: 4rpx;
}
.plr-50 {
  padding: 0 50rpx;
}
.h-200 {
  height: 200rpx;
}

.flex-justity-start {
  justify-content: flex-start;
}
.w-25 {
  width: 25%;
}

.h-155 {
  height: 155rpx;
}
.add-sub {
  width: 439rpx;
  height: 75rpx;
}
.add-avatar {
  width: 80rpx;
  height: 80rpx;
  background-color: #ededed;
  &::after {
    height: 100%;
    content: '+';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 50rpx;
    color: #999999;
  }
}

.class-tag {
  left: 10rpx;
  top: 0;
  width: 57rpx;
  height: 66rpx;
  text-align: center;
  color: $sub-color;
  background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/bg-tag.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top center;
}
.icon-more {
  top: 10rpx;
  right: 20rpx;
}
</style>
