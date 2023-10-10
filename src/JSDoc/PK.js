/**
 * @typedef {Object} PkCategory PK 基础分类
 * @property {number} pk_id 规则 ID
 * @property {string} pk_name 规则名称
 * @property {string} pk_desc 规则描述
 * @property {number} popularity
 */

/**
 * @typedef {Object} CompetitionPk 球赛 PK
 * @property {number} competition_pk_id 球赛 PK ID
 * @property {string} add_time 添加时间
 * @property {string} update_time 更新时间
 * @property {number} is_delete 是否删除
 * @property {number} competition_id 球赛 ID
 * @property {number} uid 创建者 ID ？？
 * @property {string} competitor_ids 球员 ID 集合
 * @property {string} uids 参与球员的用户 ID 集合, 逗号分隔
 * @property {string} group 球赛分组，指明规则所在分组
 * @property {number} competition_group_pk_id
 * @property {number} pk_id PK 分类 ID
 * @property {string} rules 规则详情
 */

/**
 * @typedef {Object} PKScoreSummary PK 成绩汇总 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/球局pk/pk成绩汇总
 * @property {Competitor[]} competitor_list
 * @property {Array<Array<PkRecord>> } pk_record_list pk记录列表，顺序与pk洞顺序一致，其中分数记录，顺序与球员顺序一致
 */

/**
 * @typedef {Object} Competitor
 * @property {number} competitor_id
 * @property {string} add_time
 * @property {number} competition_id
 * @property {number} uid
 * @property {string} group
 * @property {number} tee
 * @property {number} total_score
 * @property {number} sort
 * @property {number} is_played_all_hold
 * @property {object} eagles
 * @property {object} birdies
 * @property {object} pars
 * @property {object} bogeys
 * @property {object} double_bogeys
 * @property {number} total_cs_score 抽水分数
 * @property {number} handicap 差点
 * @property {number} total_pk_score
 * @property {string} username
 * @property {string} avatar_url
 */

/**
 * @typedef {Object} PkRecord 分数记录，顺序与球员顺序一致
 * @property {number} competition_record_id
 * @property {number} course_half_court_id
 * @property {number} hole_no
 * @property {number} par
 * @property {?number} score
 * @property {?number} push
 * @property {number} uid
 * @property {number} is_light
 * @property {string} competitor_id
 * @property {?number} total_pk_score
 * @property {?number} pk_score
 * @property {?number} cs_score
 */



/** 
* @typedef {Object} PkGroupInfo 组总信息。比如，分组有效洞设置。 与球赛分组对应 http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/球局pk/组总信息
* @property {number} competition_group_pk_id 球赛分组 PK ID
* @property {string} add_time
* @property {string} update_time
* @property {number} is_delete 是否删除
* @property {number} competition_id 球赛 ID
* @property {number} uid
* @property {string} group 球赛分组
* @property {number[]} hold_list 有效洞列表，排序+有效的洞
* @property {string} hold_name
* @property {string} start_hold 开始洞洞号
* @property {number} is_private 是否私密：0-否，1-是
* @property {string} start_player
* @property {string} start_desc
* @property {string} start_player_display
* @property {number} syn_order
*/
