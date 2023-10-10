/*
 * @Author: simon
 * @Description: pk接口
 * @LastEditors: simon
 */
import request from "@utils/https/index";

/**
 * 球赛当前 pk 规则总列表（包括各个分组）
 * http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/球局pk/根据比赛id获取全部pk列表
 * @param { Object } data - 请求数据
 * @param { Number } data.competition_id - 球赛 ID
 * @returns {*}
 */
export function allCompetitionPkList(data) {
  return request({ url: "/wxmp/competitionPk/getListByCompetitionId", data, method: "GET", isResolve: true });
}

/**
 * 组总信息（球赛某个分组下，PK 总信息。包含 `competition_pk_id`, 通过其获取对应 PK 详情 ）
 * @description: pk规则总信息
 * @param { Object } data
 * @param { Number } data.competition_id 球赛 ID
 * @param { String } data.group 分组，如 A，B，C
 * @type:
 * @return {*}
 */
export function groupGet(data) {
  return request({ url: "/wxmp/competitionPk/groupGet", data, method: "GET", isResolve: true });
}

/**
 * @description: 创建pk规则总信息
 * @param {*} data
 * @type:
 * @return {*}
 */
 export function groupAdd(data) {
  return request({ url: "/wxmp/competitionPk/groupAdd", data, method: "POST" });
}

/**
 * @description: 更新pk规则总信息
 * @param {*} data
 * @type:
 * @return {*}
 */
export function groupUpd(data) {
  return request({ url: "/wxmp/competitionPk/groupUpd", data, method: "POST" });
}

/**
 * @description: 新增pk规则
 * @param {*} data
 * @type:
 * @return {*}
 */
 export function pkAdd(data) {
  return request({ url: "/wxmp/competitionPk/add", data, method: "POST" });
}
/**
 * @description: 更新pk规则
 * @param {*} data
 * @type:
 * @return {*}
 */
 export function pkUpd(data) {
  return request({ url: "/wxmp/competitionPk/upd", data, method: "POST" });
}
/**
 * @description: 批量新增、更新
 * @param {*} data
 * @type:
 * @return {*}
 */
 export function pkUpdList(data) {
  return request({ url: "/wxmp/competitionPk/updList", data, method: "POST" });
}

/**
 * @description: 获取球局列表
 * @param {*} data
 * @type:
 * @return {*}
 */
 export function pkList(data) {
  return request({ url: "/wxmp/competitionPk/list", data, method: "GET" });
}

/**
 * @description: pk 工具列表
 * @param {*} data
 * @type:
 * @return {*}
 */
 export function pkTooList(data) {
  return request({ url: "/wxmp/pk/list", data, method: "GET" });
}

/**
 * @description: pk 详情
 * @param {*} data
 * @type:
 * @return {*}
 */
 export function getCompetitionPk(data) {
  return request({ url: "/wxmp/competitionPk/get", data, method: "GET" });
}
/**
 * @description: pk 出发排名历史列表
 * @param {*} data
 * @type:
 * @return {*}
 */
export function getStartPlayerListHistory(data) {
  return request({ url: "/wxmp/competitionPk/getStartPlayerListHistory", data, method: "GET" });
}
/**
 * @description: pk 出发排名·抽签上报
 * @param {*} data
 * @type:
 * @return {*}
 */
export function startPlayerRandomSave(data) {
  return request({ url: "/wxmp/competitionPk/startPlayerRandomSave", data, method: "POST" });
}
/**
 * @description: pk总成绩
 * @param {*} data
 * @type:
 * @return {*}
 */
export function getAllCompetitionPk(data) {
  return request({ url: "/wxmp/competitionPk/getAll", data, method: "GET" });
}

/**
 * 球赛当前 pk 获取所有成绩（包括各个分组）
 * http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/球局pk/获取所有比赛成绩
 * @param { Object } data - 请求数据
 * @param { Number } data.competition_id - 球赛 ID
 * @returns {*}
 */
export function allCompetitionGroupedPkScoreSummary(data) {
  return request({ url: "/wxmp/competitionPk/getAllByCompetitionId", data, method: "GET", isResolve: true });
}

/**
 * @description: pk 常用规则-列表
 * @param {*} data
 * @type:
 * @return {*}
 */
export function userPkRulesList(data) {
  return request({ url: "/wxmp/userPkRules/list", data, method: "GET" });
}

/**
 * @description: pk 常用规则-修改
 * @param {*} data
 * @type:
 * @return {*}
 */
export function updUserPkRules(data) {
  return request({ url: "/wxmp/userPkRules/upd", data, method: "POST" });
}

/**
 * @description: pk 常用规则-添加
 * @param {*} data
 * @type:
 * @return {*}
 */
export function addUserPkRules(data) {
  return request({ url: "/wxmp/userPkRules/add", data, method: "POST" });
}

/**
 * @description: pk 常用规则-删除
 * @param {*} data
 * @type:
 * @return {*}
 */
export function delUserPkRules(data) {
  return request({ url: "/wxmp/userPkRules/del", data, method: "POST" });
}

/**
 * @description: pk 常用规则-详情
 * @param {*} data
 * @type:
 * @return {*}
 */
export function getUserPkRules(data) {
  return request({ url: "/wxmp/userPkRules/get", data, method: "GET" });
}