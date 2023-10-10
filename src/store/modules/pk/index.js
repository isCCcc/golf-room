/*
 * @Author: simon
 * @Description:
 * @LastEditors: simon
 */
import { mutationsTypes, actionsTypes } from "./types";
import { groupGet, pkList, pkTooList } from "@api/pk";

export default {
  state: {
    pageStatus: 0, // 2 显示工具列表 1 显示已设置的规则 0 数据加载中状态
    pkTools: [], // pk工具列表
    pkConfig: {
      competition_id: null, // 球局id
      competition_pk_id: null, // 规则id
      pk_id: null, // 规则类型
      type: null, // 规则类型
      valid_holes: [], // 有效洞
      number: 0,
      unit: 1,
      mine: 1,
      rang_style: 0, // 互让选项
      players: [], // 参与人
      rang3: 0, //2人比赛单独生效
      rang4: 0, //2人比赛单独生效
      doubles: "",
      rang5: 0, //2人比赛单独生效
      award: 1,// 奖励选项。 0没有，12345对应相对的奖励项目
      draw_get: 2,//顶洞收分选项 1 2 3 4
      sub_type: 0,
      pankou: 0,
      draw_type: 1, //顶洞规则选项。 0平过，12345对应选项
      desc: "",
      force_mark: 0,
      idx: 0,

    }, // 当前设置活动的数据
    pkRulesIdx: -1, // 编辑pkRules中下标
    pkInfo: {}, // 有效洞列表，排序+有效的洞, 开始球洞, 是否私密
    pkRules: [], // 编辑好的pk规则列表
    pkUsers: [], // pk 选择的用户
    pkAllUsers: [], // 当前球局球局中所有成员
    pkHoles: [], // 有效球局
    batchType: null,// 批量类型
    showBackButton: true, // 设置中返回按钮显示隐藏
    tigerUser: {}, // 老虎信息
    tigerUserList: [], // 老虎参赛人员
    tigerLiuDongList: [], // 老虎流动人员
    batchUserList: [], // 批量人员
    isUsersChanged: false, // 球局成员变动，重置pkRules数据
    isTourists: false, // 游客角色
  },
  mutations: {
    // 设置页面操作状态
    [mutationsTypes.SET_PAGE_STATUS]: (state, res) => {
      state.pageStatus = res;
    },
    // 设置可选pk工具列表
    [mutationsTypes.SET_PK_TOOLS]: (state, res) => {
      state.pkTools = res;
    },
    // 设置pk规则列表
    [mutationsTypes.SET_PK_RULES]: (state, res) => {
      console.log('SET_PK_RULES',res);
      state.pkRules = res;
    },
    // 添加pk规则到列表
    [mutationsTypes.SET_PK_ADD_RULE]: (state, res) => {
      console.log('SET_PK_RULES',res);
      state.pkRules.push(res);
    },
    // 设置pk state的数据
    [mutationsTypes.SET_PK_KEY]: (state, { key, data }) => {
      state[key] = data;
    },
    // 设置pk 规则的单个值
    [mutationsTypes.SET_PK_CONFIG_ITEM]: (state, { key, data }) => {
      state.pkConfig[key] = data;
      console.log('state.pkConfig',state.pkConfig);
    },
    // 添加参与人
    [mutationsTypes.ADD_USERS]: (state, res) => {
      state.pkUsers.push(res);
    },
  },
  actions: {
    // 获取pk工具列表
    [actionsTypes.GET_PK_TOOLS]: async({ commit, state }, res) => {
      if(state.pkTools.length) return ;
      const {
        data: { data },
      } = await pkTooList();
      commit(mutationsTypes.SET_PK_TOOLS, data);
    },
    [actionsTypes.GET_PK_INFO]: async ({ commit, state }, payload) => {
      try {
        const {
          data: { data },
        } = await groupGet(payload);

        if (data) {
          // 更新pkInfo的数据
          
          data.start_hold = data.start_hold * 1;
          data.syn_order = data.syn_order || 0;
          data.hold_list = data.hold_list || [];
          data.start_player = data.start_player?JSON.parse(data.start_player):[];
          data.start_player_display = data.start_player_display?JSON.parse(data.start_player_display):[];
          commit(mutationsTypes.SET_PK_KEY,{ key: "pkInfo", data: data });
          commit(mutationsTypes.SET_PK_KEY, { key: "pkHoles", data: data.hold_list });
          

          // S 活动规则
          const rulesRes = await pkList({
            competition_group_pk_id: data.competition_group_pk_id,
          });
         
          let ruleList = rulesRes.data.data?.list?.map((e) => {
            e.rules = JSON.parse(e.rules);
            e.competitor_ids = e.competitor_ids?.split(',')
            e.rules.type = e.pk_id; // 如果组件中不依赖这个类型，则可以删除这行代码
            return e;
          });
           console.log("rulesRes", ruleList);
          commit(mutationsTypes.SET_PK_RULES, ruleList);
          // E 活动规则
          commit(mutationsTypes.SET_PAGE_STATUS, 1);
        } else {
          commit(mutationsTypes.SET_PK_KEY,{ key: "pkInfo", data: {} });
          commit(mutationsTypes.SET_PK_KEY, { key: "pkHoles", data: [] });
          commit(mutationsTypes.SET_PK_RULES, []);  //切换到其他组的时候，接口会因为这个组没有设置过规则而报未知组，此时页面上的数据是前一组的pk rules
          commit(mutationsTypes.SET_PAGE_STATUS, 2);
        }
      } finally {
        
      }
    }
  },
 
};
