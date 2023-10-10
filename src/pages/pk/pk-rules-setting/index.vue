<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="page">
    <!-- S 自定义导航 -->
    <GNavbar fixed
             :title="ruleConfig.title"
             class="g-nav-bar" />
    <!-- E 自定义导航 -->

    <view class="main">
      <!-- S 副标题 -->
      <Subtitle :title="ruleConfig.subtitle"
                :bg-img="ruleConfig.subtitleBgImg"
                :batchType="batchType"></Subtitle>
      <!-- E 副标题 -->

      <!-- S 规则设置区域 -->
      <view class="plr-32 rule-wrapper">
        <template v-for="item in ruleConfig.rules">
          <view :key="item.component">
            <Top v-if="item.component === 'top'"
                 :options="item"></Top>
            <Content v-if="item.component === 'content'"
                     :options="item"></Content>
            <Bottom v-if="item.component === 'bottom'"
                    :options="item"></Bottom>
          </view>
        </template>
      </view>
      <!-- E 规则设置区域 -->
    </view>

    <!-- S 底部操作 -->
    <view class="empry-box"></view>
    <view class="btn-wrapper flex-between p-32" v-if="!isTourists">
      <button class="button common-setting plain button-box"
              v-if="pkConfig.type == 5"
              @click="showCommonSetting()">
            常用设置<text style="color: #49B20A;margin-left: 6rpx;" v-if="commonSettingList.length"> {{commonSettingList.length}}</text>
      </button>
      <button class="button flex1"
              :loading="saveLoading"
              @click="handleSub">
        {{batchType ? '批量创建' : '确认并返回' }}
      </button>
    </view>
    
    <!-- S 常用设置列表 -->
    <UniPopup background-color="#fff"
               type="bottom"
               ref="setting-list"
               style="z-index: 55">
    	<view class="tips flex-center">常用设置</view>
      <view class="modal-wrapper fs-28 tc">
          <view class="setting-list pb-32 mb-20">
            <view v-for="(item, index) in commonSettingList"
                  :key="index"
                  class="setting border-b border-bn flex-between h-120 plr-32"
                  @click="handleSetting(index)">
              <view class="del-icon mr-16" @click.stop="delSetting(index)" />
              <view class="flex1 flex">
                <view class="text-over fw-400 fs-28 mr-16">{{ item.title }}</view>
                <view class="default flex-shrink-0" v-if="item.is_default">缺省</view>
              </view>
              <view class="fw-400 fs-24 col-999" @click.stop="editSetting(index)">编辑</view>
            </view>
          </view>
          <view class="add-setting"
                  @click="addSetting()">
            + 设当前规则为常用
          </view>
        <view class="action-cell h-120 flex-center col-53 mt-32" style="border-top: 12rpx solid #F9F9F9;"
         @click="closeCommonSetting()">取消</view>
      </view>
    </UniPopup>
     <!-- E 常用设置列表 -->
     
     <!-- S 单个设置 -->
     <UniPopup ref="setting" background-color="#fff" type="center" :isMaskClick="false">
         <view class="input-wrapper">
             <view class="input-box">
                 <input placeholder="输入常用设置名称"
                          :adjust-position="false"
                          class="input"
                          placeholder-style="color: #999"
                          maxlength="20"
                          v-model="setting.title" />
             </view>
                          
              <view class="flex mlb-48" @click="checkSetting()">
                  <g-checkbox :checked="setting.is_default" />
                  <view class="fs-24 fw-400 col-black ml-32">设为缺省规则</view>
              </view>
              
              <!-- S 按钮 -->
           <view class="btn-box flex">
             <view class="flex-1 flex-center h-full col-999 fs-32 btn-cancel" @click="closeSetting()">取消</view>
             <view class="flex-1 flex-center h-cull col-1e3 fs-32"
                   @click="saveSetting()">确定</view>
           </view>
         <!-- E 按钮 -->
       </view>
     </UniPopup>
     <!-- E 单个设置 -->
  </view>
</template>
<script>
// components
import GNavbar from '@/components/g-navbar/index.vue';
import Subtitle from '@/pages/pk/pk-rules-setting/components/subtitle';
import Top from '@/pages/pk/pk-rules-setting/components/top';
import Content from '@/pages/pk/pk-rules-setting/components/content';
import Bottom from '@/pages/pk/pk-rules-setting/components/bottom';
import UniPopup from '@components/uni-popup/uni-popup.vue'

// utils
import { RuleTypes } from './setting';

import { mapMutations, mapState } from 'vuex';

import { userPkRulesList, updUserPkRules, addUserPkRules, delUserPkRules, getUserPkRules } from '@/api/pk/index';

export default {
  components: {
    GNavbar,
    Subtitle,
    Top,
    Content,
    Bottom,
    UniPopup
  },
  data() {
    return {
      ruleConfig: {},
      saveLoading: false,
      commonSettingList: [],
      setting: {
          id: 0,
          title: '',
          is_default: 0
      }
    };
  },
  onLoad(options) {
    console.log('rules-list', options);
    this.ruleConfig = RuleTypes[Number(options?.pk_id) || 1];
    this.loadCommonSetting()
    
  },
  computed: {
    ...mapState({
      pkConfig: (state) => state.pk.pkConfig, // pk规则设置
      pkUsers: (state) => state.pk.pkUsers, // 选中的参与人
      pkRules: (state) => state.pk.pkRules, //pk规则列表
      pkInfo: (state) => state.pk.pkInfo, // pkinfo信息
      pkRulesIdx: (state) => state.pk.pkRulesIdx, // 当前操作的pkRules中index数据
      showBackButton: (state) => state.pk.showBackButton,
      batchType: (state) => state.pk.batchType, // 批量类型
      tigerLiuDongList: (state) => state.pk.tigerLiuDongList, // 流动老虎
      tigerUser: (state) => state.pk.tigerUser, // 固定老虎
      tigerUserList: (state) => state.pk.tigerUserList, // 固定老虎-参与选手
      batchUserList: (state) => state.pk.batchUserList, // 批量人员
      userInfo: (state) => state.user.userInfo,
      competitionData: (state) => state.chatRoom.competitionData, // 球赛信息
      isNowGroup: (state) => state.chatRoom.isNowGroup, // 当前操作的组
      isTourists: (state) => state.pk.isTourists, // 是否是游客
    }),
    // 计分总分
    totalScore() {
      let sum =
        (this.pkConfig.pk_best ? this.pkConfig.unit_best : 0) +
        (this.pkConfig.pk_worst ? this.pkConfig.unit_worst : 0) +
        (this.pkConfig.pk_total ? this.pkConfig.unit_total : 0);
      return sum;
    },
    // 是否有扣分
    isKouFen() {
      let flag = [
        this.pkConfig.koufen,
        this.pkConfig.koufen1,
        this.pkConfig.koufen2
      ].some((e) => e == 1);
      return flag;
    },
  },
  mounted() {
    // uni.$on()
  },
  methods: {
    ...mapMutations({
      SET_PAGE_STATUS: 'SET_PAGE_STATUS',
      SET_PK_CONFIG_ITEM: 'SET_PK_CONFIG_ITEM',
      SET_PK_RULES: 'SET_PK_RULES',
      SET_PK_ADD_RULE: 'SET_PK_ADD_RULE',
      SET_PK_KEY: 'SET_PK_KEY'
    }),

    back() {
      uni.navigateBack();
    },
    handleSub() {
      this.batchType ? this.handleBatchRules() : this.handleSingRules();
    },
    // 批量处理规则
    async handleBatchRules() {
      try {
        await this.handleVaildBatch();
        this.saveLoading = true;
        // 新增规则
        let composeData = this.combination(this.batchUserList, 2);
        composeData.map((e) => {
          this.SET_PK_KEY({ key: 'pkUsers', data: e });
          this.SET_PK_CONFIG_ITEM({
            key: 'players',
            data: e.map((v) => v.competitor_id)
          });
          this.handleDec(); // 文案描述
          this.batchType == 3 &&
            this.SET_PK_CONFIG_ITEM({
              key: 'x8421',
              data: ['8421', '8421']
            });
          // 新增规则
          const config = this.handleConfig();
          this.SET_PK_ADD_RULE({ ...config, rules: { ...this.pkConfig } });
        });

        console.log('批量规则', this.pkRules);
        this.SET_PAGE_STATUS(1); // 修改显示状态
        this.back();
      } catch (err) {
        console.log('参数设置错误');
        if (err.msg) {
          uni.showToast({ title: err.msg, icon: 'none' });
        }
      } finally {
        this.saveLoading = false;
      }
    },
    // 处理单个规则
    async handleSingRules() {
      try {
        this.saveLoading = true;
        await this.handleVaild();
        this.handleComposeParams();
        if (this.pkRulesIdx !== -1) {
          // 规则编辑保存
          this.pkRules[this.pkRulesIdx].rules = { ...this.pkConfig };
          this.SET_PK_RULES(this.pkRules);
        } else {
          // 新增规则
          const config = this.handleConfig();
          this.SET_PK_ADD_RULE({ ...config, rules: { ...this.pkConfig } });
        }

        this.SET_PAGE_STATUS(1); // 修改显示状态
        console.log('pkRules', this.pkRules);
        console.log('pkConifg', this.pkConfig);
        this.back();
      } catch (err) {
        if (err.msg) {
          uni.showToast({ title: err.msg, icon: 'none' });
        }
      } finally {
        this.saveLoading = false;
      }
    },
    // 规则验证--单个规则
    handleVaild() {
      return new Promise((resolve, reject) => {
        let {
          number,
          type,
          dashou,
          sub_type,
          transferee,
          transferee_ids,
          tiger_style,
          players,
          guding,
          gd_uid,
          baodong
        } = this.pkConfig;
        if ([1, 2, 3, 4].includes(type)) {
          if (!this.pkUsers.length) return reject({ msg: '请选择选手' });
          if (number != this.pkUsers.length)
            return reject({ msg: `请选择${number}人` });
        }
        // 斗地主
        let dashouFlag = this.pkUsers.find((e) => e.competitor_id == dashou);
        if (type == 4 && sub_type != 2 && dashouFlag) {
          return reject({ msg: `打手人员重复` });
        }
		
		if (type == 4 && guding) {
			let ids = this.pkUsers.map((e) => e.competitor_id)
			if (ids.indexOf(gd_uid) == -1) {
			  return reject({ msg: `重选固定地主` });
			}
		}
		
        // 打老虎
        if (type == 7) {
          if (
            tiger_style == 0 &&
            (!Object.keys(this.tigerUser).length || !this.tigerUserList.length)
          ) {
            return reject({ msg: `请选择球手` });
          }
          if (tiger_style == 1 && !this.tigerLiuDongList.length) {
            return reject({ msg: `请选择球手` });
          }
          // 老虎与参与人员不能重复
          let target = this.tigerUserList.find(
            (e) => e.competitor_id == this.tigerUser.competitor_id
          );
          if (target) {
            return reject({ msg: `老虎设置错误` });
          }
          // 让杆选手不能大于参赛人员
          let tigerStyle = {
            0: this.tigerUserList,
            1: this.tigerLiuDongList
          };
          if (transferee_ids.length > tigerStyle[tiger_style].length) {
            return reject({ msg: `让杆球手设置错误` });
          }
        }
        
        if (type == 5) {
        	if (transferee_ids.length && baodong) {
        	  return reject({ msg: `让杆不能包洞` });
        	}
        }

        resolve();
      });
    },
    // 规则验证--批量处理
    handleVaildBatch() {
      return new Promise((resolve, reject) => {
        if (this.batchUserList.length < 3) {
          return reject({ msg: `请选择3个以上选手` });
        }
        resolve();
      });
    },
    // 处理汇总信息
    handleConfig() {
      let config = {
        competition_id: this.pkInfo?.competition_id,
        pk_id: this.pkConfig.type,
        competitor_ids: this.pkConfig.players,
        group: this.pkInfo.group
      };
      if (this.pkRulesIdx != -1) {
        config.competition_pk_id = this.pkRules.competition_pk_id;
      }
      return config;
    },
    // 处理参数
    handleComposeParams() {
      // 找出是否有让分的人
      let rangTarget = this.pkUsers.find((e) => e.rangGan || e.rangFen);
      if (rangTarget) {
        // 指定让分的人
        this.SET_PK_CONFIG_ITEM({
          key: 'rang',
          data: rangTarget.competitor_id
        });
        // 指定让分类型
        this.SET_PK_CONFIG_ITEM({
          key: 'sub_type',
          data: rangTarget.rangFen ? 1 : 0
        });
      } else if (this.pkConfig.rang) {
        this.SET_PK_CONFIG_ITEM({
          key: 'rang',
          data: 0
        });
      }
      // 没选让杆，清除让杆的分数
      if (
        (!rangTarget || !rangTarget.rangGan) &&
        [2].includes(this.pkConfig.type)
      ) {
        let keyList = ['rang3', 'rang4', 'rang5'];
        for (let i = 0; i < keyList.length; i++) {
          this.SET_PK_CONFIG_ITEM({
            key: keyList[i],
            data: 0
          });
        }
      }
      // 挂8421
      if (this.pkConfig.type == 3) {
        let numberList = this.pkUsers.map((e) => e.x8421);
        this.SET_PK_CONFIG_ITEM({
          key: 'x8421',
          data: numberList
        });
      }

      // 斗地主
      if (this.pkConfig.type == 4) {
        let x8421 = [];
        // 8421计分
        if (this.pkConfig.jifen_type == 1) {
          x8421 = this.pkUsers.map((e, i) => {
            return {
              idx: i,
              user_id: e.uid,
              sflag: e.sflag
            };
          });
        }
        this.SET_PK_CONFIG_ITEM({
          key: 'x8421',
          data: x8421
        });
        // 顶洞留给谁收
        if (this.pkConfig.draw_get != 2) {
          this.SET_PK_CONFIG_ITEM({
            key: 'draw_get_style',
            data: 0
          });
        }
      }

      // 打老虎
      if (this.pkConfig.type == 7) {
        // 流动老虎
        if (this.pkConfig.tiger_style == 1) {
          this.SET_PK_CONFIG_ITEM({ key: 'sub_type', data: 0 });
        }

        // 固定老虎-笔杆
        if (this.pkConfig.tiger_style == 0 && this.pkConfig.sub_type == 1) {
          this.SET_PK_CONFIG_ITEM({ key: 'transferee_name', data: '' });
          this.SET_PK_CONFIG_ITEM({ key: 'transferee_ids', data: [] });
        }
      }

	  if (this.pkConfig.type == 5) {
	  	if (this.pkConfig.transferee_ids.length && this.pkConfig.baodong) {
	  	  return reject({ msg: `让杆不能包洞` });
	  	}
      if(this.pkConfig.jifen_type > 0) {
        this.SET_PK_CONFIG_ITEM({ key: 'transferee_name', data: '' });
        this.SET_PK_CONFIG_ITEM({ key: 'transferee_ids', data: [] });
      }
      
      if (this.pkConfig.sub_type == 0 && this.pkConfig.sub_group.length != 2) {
        return reject({ msg: `固拉分组错误` });
      }
      
      let numberList = this.pkUsers.map((e) => e.x8421);
      this.SET_PK_CONFIG_ITEM({
        key: 'x8421',
        data: numberList
      });
	  }

	  //处理transferee格式
	  if (this.pkConfig.hasOwnProperty('transferee_ids') && this.pkConfig.transferee_ids.length) {
      let transferee = {
          transferee_players: this.pkConfig.transferee_ids,
          transferee_players_name: this.pkConfig.transferee_name,
          transferee3: this.pkConfig.transferee3,
          transferee4: this.pkConfig.transferee4,
          transferee5: this.pkConfig.transferee5,
      }

			if (this.pkConfig.transferee_holes) {
				transferee.transferee_holes = this.pkConfig.transferee_holes
			}	
			this.SET_PK_CONFIG_ITEM({ key: 'transferee', data: [transferee] });
	  
	  }
      // 描述备注
      this.handleDec();
    },
    // 处理描述
    handleDec() {
      // 描述备注
      let {
        number,
        rang_style = 0,
        jifen_type = 0,
        dashou = '',
        heti = [],
        sub_type = 0,
        type,
        tiger_style,
        pankou,
        guding,
        koufen = 0,
        koufen1 = 0,
        koufen2 = 0,
        draw_type = 0,
        baodong = 0,
        transferee_name = '',
        pk_best=0,
        pk_worst=0,
        pk_total=0
      } = this.pkConfig;

      let dec1 = `${number}人${number > 2 ? '互' : '单'}挂`;
      let dec2 = `${rang_style > 0 ? '互让' : (pankou > 0 ? '有让' : '平打')}`;
      let dec3 = '' //this.pkUsers.map((e) => e.username).join(';'); //pk列表不要人名了
      let content = {
        0: `${this.totalScore ? `斗${this.totalScore}分` : ''}`,
        1: `斗8421/${this.isKouFen ? '扣分' : '不扣分'}`,
        2: `杆数相乘`
      };

      let dec4 = `${guding ? '固定' : ''}${sub_type == 1 ? content[jifen_type] : ''}`;
      let dec5 = `${dashou ? '有打手' : ''}`;
      let dec6 = `${heti.length ? '(有2人合体)' : ''}`;
      let dec7 = `${this.tigerUser.username} PK 其他${
        this.tigerUserList.length
      }人 ${sub_type == 0 ? '比洞' : '比杆'}`;
      let dec8 = `流动老虎(${this.tigerLiuDongList.length})人参与`;
      let finalDec = '';
      // 斗地主
      if (type == 4) {
        finalDec =
          sub_type == 2 ? `四人斗地主${dec6}` : `${dec4} ${dec3} ${dec5}`;
      }
      // 打老虎
      else if (type == 7) {
        finalDec = tiger_style == 0 ? dec7 : dec8;
      } 
	  //四人拉斯
	  else if (type == 5) {
		  let desc1 = ['固拉', '乱拉', '抽签'][sub_type];
		  let desc2 = `${[`${pk_best*1 + pk_worst*1 + pk_total*1}分`, 
                      '8421', '头尾肉(公母鸡)', '杆数相乘', '杆数相加'][jifen_type]}${jifen_type == 1 ? (koufen || koufen1 || koufen2) ? '/扣分' : '/不扣分' : ''}`;
		  let desc3 = ['顶平过', '顶洞加1分', '顶洞加倍', '顶洞加2分', '顶洞加3分', '连续翻倍', '顶洞吃肉'][draw_type];
		  let desc4 = baodong == 0 ? '不包洞' : '包洞';
		  let desc5 = jifen_type == 0  ? (transferee_name ? '有让杆' : '不让杆') :  '';
		  finalDec = `${desc1}${desc2} ${desc3} ${desc4} ${desc5}`;
	  }
	  else {
        finalDec = `${dec1} ${dec2} ${dec3}`;
      }

      this.SET_PK_CONFIG_ITEM({
        key: 'desc',
        data: finalDec
      });
    },
    //arr表示源数组，size表示选取元素的个数
    combination(arr, size) {
      //定义数组保存结果
      var result = [];

      //selected数组包含已经选中的元素
      //arr数组包含未选中元素数组，size表示还需选取元素的个数
      function _combine(selected, arr, size) {
        //如果size===0，则一次组合完成，存入result数组并返回
        if (size === 0) {
          result.push(selected);
          return;
        }
        //遍历所有可能选中的元素，遍历的次数为数组长度减去(size-1)
        for (let i = 0; i < arr.length - (size - 1); i++) {
          //复制数组，避免对selected数组数据的更改
          let temp = selected.slice();
          temp.push(arr[i]);
          _combine(temp, arr.slice(i + 1), size - 1);
        }
      }

      _combine([], arr, size);
      return result;
    },
    async loadCommonSetting() {
        if (this.pkConfig.type != 5) {
            return;
        }
        let {data: {data}} = await userPkRulesList({pk_id: 5});
        this.commonSettingList = data
        
        if (this.pkRulesIdx == -1) {
          let defaultSetting = this.commonSettingList.filter((setting) => {
              return setting.is_default == 1
          })
          
          if (defaultSetting?.[0]) {
            let {data: {data}} = await getUserPkRules({user_pk_rules_id: defaultSetting[0].user_pk_rules_id});
            if (data?.rules) {
              let pkConfigs = data.rules
              this.setConfigBySetting(pkConfigs[0])
              uni.showToast({
                title: '缺省规则已启用',
                icon: 'success',
                duration: 2000,
              });
            }
          }
        }
    },
    showCommonSetting() {
      this.$refs['setting-list'].open();
    },
    closeCommonSetting() {
        this.$refs['setting-list'].close();
    },
    addSetting() {
      this.setting = {name:'', is_default: 0}
      this.$refs.setting.open()    
    },
    editSetting(index) {
      this.setting = this.commonSettingList[index]
      this.$refs.setting.open()
    },
    async delSetting(index) {
      uni.showModal({
        content: `确定删除${this.commonSettingList[index].title}配置吗？`,
        cancelText: '取消',
        confirmText: '删除',
        confirmColor: '#FF6A6A',
        success: async (res) => {
          if (res.confirm) {
            let {data: {data}} = await delUserPkRules({user_pk_rules_id: this.commonSettingList[index].user_pk_rules_id});
            if (data) {
              uni.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              });
              this.$delete(this.commonSettingList, index)
            } else {
              uni.showToast({
                title: '删除失败',
                icon: 'error',
                duration: 2000
              });
            }
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    async saveSetting() {
      let pkConfig = JSON.parse(JSON.stringify(this.pkConfig))
      let resetList = {
        players: [],
        bjm: [],
        sub_group: [],
        x8421: [],
        transferee_only_pk_total: 0,
        par_not: 0,
        transferee: [],
        transferee_ids: [],
        transferee_name: ''
      }
      for (let key in resetList) {
        if (pkConfig?.[key]) {
          pkConfig[key] = resetList[key]
        }
      }
      if (!this.setting.user_pk_rules_id) {
        await addUserPkRules({pk_id: 5, title: this.setting.title, is_default: this.setting.is_default, rules: JSON.stringify([pkConfig])});
        let {data: {data}} = await userPkRulesList({pk_id: 5});
        this.commonSettingList = data
        this.$forceUpdate()
      } else {
        let {data: {data}} = await updUserPkRules({user_pk_rules_id: this.setting.user_pk_rules_id, title: this.setting.title, is_default: this.setting.is_default});
      }
      if (this.setting.is_default) {
        this.commonSettingList.forEach((e) => {
          if (e.user_pk_rules_id != this.setting.user_pk_rules_id && e.is_default) {
            e.is_default = false
          }
        })
      }
      uni.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1500
      });
      this.closeSetting()
    },
    closeSetting() {
      this.$refs['setting'].close();
    },
    checkSetting() {
        this.setting.is_default = this.setting.is_default ? 0 : 1
    },
    handleSetting(index) {
      uni.showModal({
        content: `确定采用${ this.commonSettingList[index].title}配置吗？`,
        cancelText: '取消',
        confirmText: '确定',
        confirmColor: '#FF6A6A',
        success: async (res) => {
          if (res.confirm) {
            let {data: {data}} = await getUserPkRules({user_pk_rules_id: this.commonSettingList[index].user_pk_rules_id});
            this.setConfigBySetting(data.rules[0])
            uni.showToast({
              title: '设置成功',
              icon: 'success',
              duration: 1500
            });
            this.$refs['setting-list'].close()
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    setConfigBySetting(settingConfig) {
      //特殊处理规则里涉及到球手的情况，如高手不见面、固拉、x8421、受让杆
      let resetKeys = ['players', 'bjm', 'sub_group', 'x8421', 'transferee_only_pk_total', 'par_not', 'transferee', 'transferee_ids', 'transferee_name',]
      
      resetKeys.forEach((key) => {
        if (settingConfig?.[key]) {
          settingConfig[key] = this.pkConfig[key]
        }
      })
      
      this.SET_PK_KEY({ key: 'pkConfig', data: settingConfig});
      console.log(this.pkConfig)
      this.$forceUpdate()
    }
  },

  destroyed() {
    this.SET_PK_KEY({ key: 'pkRulesIdx', data: -1 }); // 把数据数据重置
    this.SET_PK_KEY({ key: 'pkConfig', data: {} }); // 清空规则数据
    this.SET_PK_KEY({ key: 'pkUsers', data: [] }); // 清空规则数据
    this.SET_PK_KEY({ key: 'batchType', data: null }); // 清空批量操作
    this.SET_PK_KEY({ key: 'tigerUser', data: {} }); // 固定老虎
    this.SET_PK_KEY({ key: 'tigerUserList', data: [] }); // 固定老虎参赛选手
    this.SET_PK_KEY({ key: 'tigerLiuDongList', data: [] }); // 流动老虎
    this.SET_PK_KEY({ key: 'batchUserList', data: [] }); // 批量人员
  }
};
</script>
<style scoped lang="scss">

// 导航栏
::v-deep .g-nav-bar {
  .uni-navbar > .uni-navbar__content {
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/bg-navbar.png') !important;
  }
}
.rule-wrapper {
  z-index: 1;
  margin-top: -102rpx;
}
.btn-wrapper {
  position: fixed;
  bottom: 0;
  z-index: 2;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 16.4%)!important;
  backdrop-filter: blur(10rpx);
  // background: $bg-col-f5;
  padding-bottom: calc(44rpx + env(safe-area-inset-bottom));
}
.button {
  height: 96rpx;
  line-height: 96rpx;
}
.empry-box {
  height: calc(96rpx + 32rpx + 44rpx + env(safe-area-inset-bottom));
}
.main {
  //max-height: calc(100vh - (96rpx + 32rpx + 44rpx + env(safe-area-inset-bottom)) - 64px);
  overflow-y: auto;
}
.tips {
	height: 90rpx;
	text-align: center;
	color: #999999;
	font-size: 24rpx;
	font-weight: 400;
}
.common-setting {
    font-weight: 600;
    font-size: 28rpx;
    text-align: center;
    color: #1E3E42;
    margin-right: 16rpx!important;
}
.add-setting {
    margin: 0 32rpx;
    height: 88rpx;
    line-height: 88rpx;
    border: 1.5rpx solid rgba(30, 62, 66, 0.4);
    border-radius: 4rpx;
    color: #1E3E42;
    font-size: 28rpx;
    font-weight: 400;
    text-align: center;
}
.setting-list {
    max-height: 31vh;
    overflow-x: auto;
}
.setting {
    .del-icon {
      width: 42rpx;
      height: 42rpx;
      border-radius: 50%;
      background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ic_del.png');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
    .default {
      background: #EDEDED;
      border-radius: 4rpx;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 0rpx 10rpx;
      width: 59rpx;
      height: 34rpx;
      font-size: 20rpx;
      font-weight: 400;
    }
}
.input-wrapper {
  width: 85vw;
  background: $white;
  border-radius: 4rpx;
  .input-box {
    padding: 48rpx;
    .input {
      padding: 0 24rpx;
      height: 86rpx;
      height: 86rpx;
      background: #f3f3f3;
      border-radius: 8rpx;
    }
  }
  .mlb-48 {
      margin-left: 48rpx;
      margin-bottom: 48rpx;
  }
  .btn-box {
    padding: 28rpx 0;
    height: 120rpx;
    border-top: 1px solid #e7e7e7;
    box-sizing: border-box;
    .btn-cancel {
      border-right: 1px solid #e7e7e7;
    }
  }
}
</style>
