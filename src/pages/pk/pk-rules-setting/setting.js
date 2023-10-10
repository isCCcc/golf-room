/*
 * @Author: simon
 * @Description:
 * @LastEditors: simon
 */

// 挂杆布局规则
const zeroRules = {
  type: 1,
  title: "挂杆",
  subtitle: "比杆",
  subtitleBgImg:
    "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/game/game01.png",
  rules: [
    {
      component: "top",
      holes: true,
      joinNumbers: true,
    },
    {
      component: "content",
      players: true, // 选手
      danRang: true, // 单让
    },
    {
      component: "bottom",
      award: true, // 奖励
    },
  ],
};

// 挂洞布局规则
const oneRules = {
  type: 2,
  title: "挂洞",
  subtitle: "比洞",
  subtitleBgImg:
    "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/game/game02.png",
  rules: [
    {
      component: "top",
      holes: true,
      joinNumbers: true,
    },
    {
      component: "content",
      players: true, // 选手
      danRang: true, // 单让
      rangGan: true, // 让杆
    },
    {
      component: "bottom",
      award: true, // 奖励
      dingDong: true, // 顶洞
      shouDingDong: true, // 收顶洞
    },
  ],
};

// 挂8421布局规则
const twoRules = {
  type: null,
  title: "挂8421",
  subtitle: "挂8421",
  subtitleBgImg:
    "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/game/game03.png",
  rules: [
    {
      component: "top",
      holes: true,
      joinNumbers: true,
    },
    {
      component: "content",
      players: true, // 选手
      danRang: true, // 单让
      showNumber: true, // 显示8421
      scoreRules: true, // 扣分规则
    },
    {
      component: "bottom",
      dingDong: true, // 顶洞
      shouDingDong: true, // 收顶洞
    },
  ],
};

// 斗地主布局规则
const threeRules = {
  type: 4,
  title: "斗地主",
  subtitle: "斗地主",
  subtitleBgImg:
    "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/game/game04.png",
  rules: [
    {
      component: "top",
      holes: true,
      fenlei: true,
    },
    {
      component: "content",
      players: true, // 选手
	  xuandizhu: true,	//选地主
      scoring: true, // 计分
    },
    {
      component: "bottom",
      award: true, // 奖励
      dingDong: true, // 顶洞
      shouDingDong: true, // 收顶洞
      daShou: true, // 打手
      nongMin: true, // 农民
      baoDong: true, // 包洞
      chouShui: true, // 抽水
      dingDongLiu: true, // 顶洞留给谁收
    },
  ],
};

// 4人拉斯布局规则
const fourRules = {
  type: 5,
  title: "4人拉斯",
  subtitle: "4人拉斯",
  subtitleBgImg:
    "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/game/game05.png",
  rules: [
    {
      component: "top",
      holes: true,
      fenzu: true,
    },
    {
      component: "content",
	  players:true,
      scoring: true, // 计分
    },
    {
      component: "bottom",
      jiang: true,
      award: true, // 奖励多少
      baoDong: true, // 包洞
      bangStyle:true, //爆洞
      drawDefine: true,	//顶的定义
      dingDong: true, // 顶洞处理
      startDing: true, //出门顶洞
      minDing: true,//强加顶
      shouDingDong: true,
      //minFlag: true,//最近旗杆奖励
      chouShui: true, // 抽水
      shouRang: true,	//受让杆
    },
  ],
};

// 大拉斯布局规则
const fiveRodRules = {
  type: 6,
  title: "大拉斯",
  subtitle: "大拉斯",
  subtitleBgImg:
    "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/game/game06.png",
  rules: [
    {
      component: "top",
      holes: true,
      joinNumbers: true,
    },
    {
      component: "content",
      players: true, // 选手
      handicap: true, // 让分
    },
    {
      component: "bottom",
      award: true, // 奖励
    },
  ],
};

// 打老虎布局规则
const sixRules = {
  type: 7,
  title: "打老虎",
  subtitle: "打老虎",
  subtitleBgImg:
    "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/pk/game/game07.png",
  rules: [
    {
      component: "top",
      holes: true,
    },
    {
      component: "content",
      fenleiTiger: true,
      tigerPlayers: true,
    },
    {
      component: "bottom",
      award: true, // 奖励
      dingDong: true, // 顶洞
      shouDingDong: true, // 收顶洞
      biWhat: true, // 比什么
      shouRang: true, // 受让杆球手
    },
  ],
};

// 规则类型
export const RuleTypes = [
  {}, // 表里么的数据是从1开始
  zeroRules,
  oneRules,
  twoRules,
  threeRules,
  fourRules,
  fiveRodRules,
  sixRules,
];
const validHoles = new Array(18).fill(1);

// 比杆
let bigan = {
  valid_holes: [...validHoles],
  type: null,
  number: 2,
  // unit: 1,
  // mine: 1,
  rang_style: 0,
  players: [],
  // rang3: 0, //3杆洞让分第一个选项。0选项是不让
  // rang4: 0, //4杆洞让分第一个选项。0选项是不让
  // doubles: "",
  // rang5: 0, //5杆洞让分第一个选项。0选项是不让
  award: 1,
  // draw_get: 1,
  sub_type: 1,
  pankou: 0,
  // draw_type: 1,
  desc: "",
  // rang: "" //配置了让杆的人 players里面其中一个 多人挂洞没有
};
// 挂洞
let guadong = {
  // competition_id: null, // 球局id
  // competition_pk_id: null, // 规则id
  // pk_id: null, // 规则类型
  type: 1, // 规则类型
  number: 3,
  valid_holes: [...validHoles], // 有效洞
  number: 2,
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

};
// 8421
let gua8421 =
// 挂8421
{
  type: null,
  mine: 1,
  unit: 1,
  pankou: 0,
  koufen: 0,
  valid_holes: [...validHoles], // 有效洞
  koufen1: 0,
  koufen2: 0,
  koufen_par3: 0,
  rang_style: 0,
  doubles: '',
  players: [],
  number: 2,
  draw_type: 1,
  draw_get: 1,
  x8421: [],
  desc: '',
  sub_type: 1,

};
// 斗地主
let doudizhu = {
  number: 3,
  type: 4,
  unit: 1,
  mine: 1,
  players: [],
  draw_get: 1, // 收顶洞选项
  award: 1, // 奖励选项
  doubles: '',
  dashou: '', // 打手
  draw_get_style: 0,
  nm_pk: 0, // 农民之间pk选项
  valid_holes: [...validHoles], // 有效洞
  baodong: 0, // 包洞
  draw_type: 1, // 顶洞选项
  sub_type: 1, // 分类 0是斗第一，1是斗第二，2是4人斗地主
  cs_unit: 1, // 抽水下半的选项 赢家全抽0，每位赢家 1，每位输家 2
  cs_style: 0, // 抽水选项
  cs_holes: 0, // cs_style为1的时候。抽到第几个洞
  cs_score: 0, // cs_style为2的时候。抽到多少分为止
  jifen_type: 0, // //计分方式 0：1/2/3分，1：8421，2:杆数相乘
  pk_best: 0, //  计分方式 0 较好成绩打勾
  pk_worst: 0, // 计分方式 0 较差成绩打勾
  pk_total: 1, // 计分方式 0 双方总杆成绩打勾
  unit_best: 1, //计分方式 0 较好成绩 数值
  unit_worst: 1, //计分方式 0 较差成绩 数值
  unit_total: 1, //计分方式 0 双方总杆成绩 数值
  koufen: 0,//扣分方式 1：扣分， 2：只扣1分（+4以上） 3：只扣1分（双par以上） 
  koufen_par3: 0, // 3杆洞从+3开始扣 选中为1
  koufen1: 0,
  koufen2: 0,
  x8421: [],
  desc: '',
  heti: [],
  guding: 0,
  gd_uid: "",
  idx: 0
};
let sirenlasi = {
	number: 4,
	type: 5,
	valid_holes: [...validHoles], // 有效洞
	unit: 1,
	cs_unit:1,
	mine:1,
	draw_define:0,	//顶的定义
	fin_award:0,
	bao_cond:0, //包洞附加条件
	dffz:0, //分组依据
	min_ding:0, //强加顶
	min_flag:0, //最近旗杆奖励选项
	sub_type:1, //分组选项：0-固拉，1-乱拉，2-抽签（每洞抽）
	draw_get:1, //收顶洞选项
	draw_get_style:1, //收不完的顶洞选项：0-只留给原组合收，1-都可以收
	who_cq:0, //谁来抽选项：0-谁都可以抽，1-成绩最好的优先抽
	transferee_only_pk_total:0,  //仅总杆PK让
	par_not:0,  //受让杆-打帕/鸟/鹰不让选项：0-否，1-是
	doubles:"",
	jiang:0,	//鸟鹰奖励选项：0-单项PK时奖励，1-合并PK项赢了后才奖
	award:1,  //奖励选项
	cs_style:0, // 抽水选项：0-不抽，1-抽指定洞数，2-抽够分为止
	cs_holes:0,   //抽指定洞数（cs_style=1时）
	cs_score:0, //抽够分为止分数（cs_style=2时）
	bang_style:0, //爆洞
	start_ding:0, //出门顶洞选项（jifen_type=2时无效）
	baodong:0,  //包洞选项
	draw_type:1,  //顶洞选项
	jifen_type:0, //计分选项：0-1/2/3分，1-8421+，2-头尾肉（公母鸡），3-杆数相乘，4-杆数相加
	pk_best:1,  //计分-较好成绩PK选项：0-不打钩，1-打钩
	pk_worst:1, // 计分-较差成绩PK选项：0-不打钩，1-打钩
	pk_total:1,  //计分-较好成绩PK选项：0-不打钩，1-打钩
	pk_total_flag:0,  //计分-总杆选项：0-双方总杆PK，1-杆数相乘PK，2-双方总杆差为所得分
	unit_best:1, // 计分-较好成绩PK分数
	unit_worst:1,  //计分-较差成绩PK分数
	unit_total:1,  //计分-较好成绩PK分数
	koufen:0, //扣分（+4扣1分，+5扣2分...）：0-未选中，1-选中。koufen、koufen1和koufen2只能选中其中1个
	koufen_par3:0,  //3杆洞从+3开始扣分选项（koufen=1时才生效）：0-未选中，1-选中
	koufen_max:1, //最多扣分分数（koufen1=1或koufen2=1时）
	transferee: [], // 参与让杆格式数据
  transferee_ids: [], //// 参与让杆的参赛者id,让杆人数必须小于参与pk人数
	transferee_name: '', // 参与让杆的参赛者
	transferee3: 0, // 3杆洞受让杆选项：0-不让，1-让0.5杆,2-让1杆,3-让1.5杆,4-让2杆
	transferee4: 0, // 4杆洞受让杆选项
	transferee5: 0, // 5杆洞受让杆选项
	transferee_holes:[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	players:[],
	bjm:[], //高手不见面
	sub_group:[],	//固拉分组
	x8421:[],
	desc:"",
	idx:0
	
}
// 打老虎
let dalaohu = {
  valid_holes: [...validHoles], // 有效洞
  sub_type: 0, // 0-比洞，1-比杆
  draw_get: 1, // 收顶洞选项
  award: 1, //  奖励：0-无，其他跟随模式，比杆与比洞的奖励不同的
  tiger_style: 0, //  打老虎模式：0-固定老虎，1-流动老虎
  par_not: 0, //  让杆-打帕/鸟/鹰不让选项：0-否，1-是
  only_tiger: 0, //  让杆-当老虎才让选项：0-否，1-是
	transferee: [], // 参与让杆格式数据
  transferee_ids: [], //// 参与让杆的参赛者id,让杆人数必须小于参与pk人数
  transferee_name: '', // 参与让杆的参赛者
  transferee3: 1, // 3杆洞受让杆选项：0-不让，1-让0.5杆,2-让1杆,3-让1.5杆,4-让2杆
  transferee4: 1, // 4杆洞受让杆选项
  transferee5: 1, // 5杆洞受让杆选项
  players: [],// 参与pk的参赛者id,若是固定老虎必须为第一个
  doubles: '',
  draw_type: 1, // 顶洞选项
  desc: '' // 描述
};


// 规则config
export const RULE_CONFIG = new Map([
  [1, bigan],
  [2, guadong],
  [3, gua8421],
  [4, doudizhu],
  [5, sirenlasi],
  [7, dalaohu],
])
// 规则对应的参与人数
export const RULE_LENGTH = new Map([
  [1, 2],
  [2, 2],
  [3, 2],
  [4, 3],
  [5, 4],
  [7, 3],
])
// holes: true,
// joinNumbers: true,
// class: false,
// group: false,
// masterNotSee: false,

// 提交数据json
const rule_json = {
  ver: 2,
  pk_open: 1,
  start_hole: 0,
  start_desc: "",
  keep_time: 0,
  start_player: "",
  team: ["828952", "824804", "853025", "883931", "715393", "868734", "828869"],
  rules: [
    {
      valid_holes: [0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 有效洞
      type: 1, // 规则类型
      number: 7,
      unit: 1,
      mine: 1,
      rang_style: 0,
      players: [
        "828952",
        "824804",
        "853025",
        "883931",
        "715393",
        "868734",
        "828869",
      ], // 参与人
      rang3: 0,
      rang4: 0,
      doubles: "",
      rang5: 0,
      award: 1,
      draw_get: 1,
      sub_type: 0,
      pankou: 0,
      draw_type: 1,
      desc: "7人互挂 平打 下洞加1分 ",
      force_mark: 0,
      idx: 0,
    },
  ],
  double_holes: "",
  pk_holes_desc: "号洞出发 共18洞 无跳洞",
  pk_holes: "",
  syn_order: 0,
};

let awardList1 = [
  { type: 0, label: '没有奖励' },
  { type: 1, label: '鸟2/鹰5/HIO(双鹰)10' },
  { type: 2, label: '鸟2/鹰10/HIO(双鹰)20' },
  { type: 3, label: '鸟2/鹰4/HIO(双鹰)8' },
  { type: 4, label: '鸟2/鹰16/HIO(双鹰)32' },
]
let awardList2 = [
  { type: 0, label: '没有奖励' },
  { type: 1, label: '鸟+1/鹰+5/HIO(双鹰)+10' },
  { type: 2, label: '鸟+1/鹰+10/HIO(双鹰)+20' },
  { type: 3, label: '鸟*2/鹰*4/HIO(双鹰)*8' },
  { type: 4, label: '鸟*2/鹰*5/HIO(双鹰)*10' },
]
let awardList3 = [
  { type: 0, label: '没有奖励' },
  { type: 1, label: '鸟2/鹰5/HIO(双鹰)10' },
  { type: 2, label: '鸟2/鹰10/HIO(双鹰)20' },
  { type: 3, label: '鸟2/鹰4/HIO(双鹰)8' },
  { type: 4, label: '鸟2/鹰16/HIO(双鹰)32' },
  { type: 4, label: '帕2/鸟3/鹰6/HIO(双鹰)11' },
]


export const award = [
  { list: awardList1, value: [7,4,5] },
  { list: awardList2, value: [1] },
  { list: awardList3, value: [2] },
]
