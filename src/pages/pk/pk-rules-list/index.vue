<!--
 * @Author: simon
 * @Description: pk列表
 * @LastEditors: simon
-->
<template>
  <view>
    <!-- S 导航栏 -->
    <GNavbar fixed title="PK规则" class="g-nav-bar" />
    <!-- E 导航栏 -->
    <!-- S 列表 -->
    <List v-if="pageStatus === 2"></List>
    <!-- E 列表 -->

    <!-- S 设置的规则 -->
    <Rules v-if="pageStatus === 1"></Rules>
    <!-- E 设置的规则 -->
  </view>
</template>

<script>
// 组件
import GNavbar from "@/components/g-navbar/index.vue"
import List from "@pages/pk/pk-rules-list/components/list"
import Rules from "@pages/pk/pk-rules-list/components/rules"

import { mapActions, mapMutations, mapState } from "vuex"

export default {
  components: { GNavbar, List, Rules },
  data() {
    return {
      holes: [],
    }
  },
  computed: {
    ...mapState({
      pageStatus: (state) => state.pk.pageStatus,
      pkRules: (state) => state.pk.pkRules,
      pkTools: (state) => state.pk.pkTools,
      pkInfo: (state) => state.pk.pkInfo,
      competitionData: (state) => state.chatRoom.competitionData,
      userInfo: (state) => state.user.userInfo,
      isNowGroup: (state) => state.chatRoom.isNowGroup, // 当前操作的组
      isUsersChanged: state => state.pk.isUsersChanged // 是否是球局成员变动
    }),
    // 当前用户所在组/当前操作的组
    isUserGroup() {
      return (
        this.competitionData?.competitor_list?.find(
          (e) => e.uid == this.userInfo.uid
        )?.group || this.isNowGroup
      )
    },
    
    
  },
  onLoad(options) {
    console.log("options", options)
  },
  mounted() {
    // 初始化holes
    let holes = []
    for (let i = 1; i < 19; i++) {
      holes.push(i)
    }
    this.holes = holes

    this.init()

    if(this.pkRules.length) {
      this.SET_PAGE_STATUS(1)
    } else {
      this.SET_PAGE_STATUS(2)
    }
  },
  methods: {
    ...mapMutations({
      SET_PAGE_STATUS: "SET_PAGE_STATUS",
      SET_PK_KEY: "SET_PK_KEY",
      SET_PK_RULES: "SET_PK_RULES",
    }),
    ...mapActions({
      GET_PK_TOOLS: "GET_PK_TOOLS",
    }),
    async init() {
      if (!this.pkInfo.competition_group_pk_id) {
        // 更新依赖的有效球局
        this.SET_PK_KEY({ key: "pkHoles", data: this.holes })
        // 更新pkInfo
        this.SET_PK_KEY({
          key: "pkInfo",
          data: {
            competition_group_pk_id: null, //id
            competition_id: this.competitionData.competition_id, //比赛id
            group: this.isNowGroup, //比赛组
            hold_list: this.holes, //有效洞列表，排序+有效的洞
            hold_name: ``,
            start_hold: this.holes[0], //*号开始洞
            is_private: 0,
            start_player: [], // 当前出发排名
            start_player_display: [], // 抽签的出发排名(当前出发排名如果和抽签相同则为抽签)
            start_desc: "",
            syn_order: 0 // 同步到球手顺序
          },
        })
      }
      // 检测pk成员变动情况
        if (this.isUsersChanged) {
          const info = {...this.pkInfo}
          info.start_player = [];
          info.start_player_display = [];
          info.start_desc = "";
          info.syn_order = 0;
          this.SET_PK_KEY({key: 'pkInfo', data: info})
          uni.showModal({
            title: `人员变动，对应规则被删除`,
            content: `人员变动导致旧的PK规则失效`,
            confirmText: '知道啦',
            confirmColor: '#95D171',
            showCancel: false,
            success: async (res) => {
              if (res.confirm) {
                
                
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        }
    },
  },
}
</script>

<style lang="scss" scoped>
// 导航栏
::v-deep .g-nav-bar {
  .uni-navbar > .uni-navbar__content {
    background-image: url("https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/bg-navbar.png") !important;
  }
}
</style>
