/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */
export const mutationsTypes = {
  'SET_COMPETITION_ID': 'SET_COMPETITION_ID', // 群id
  'SET_COMPETITION_DATA': 'SET_COMPETITION_DATA', // 球赛信息
  'SET_COMPETITION_ITEM': 'SET_COMPETITION_ITEM', // // 球赛信息(item)
  'SET_TEE_COLOR': 'SET_TEE_COLOR', // Tee颜色列表
  'SET_MEMBER_LIST': 'SET_MEMBER_LIST', // 群会员列表
  'SET_SCOREBOARD_HEIGHT': 'SET_SCOREBOARD_HEIGHT', // 计分板高度
  'SET_MESSAGE': 'SET_MESSAGE', // 设置消息列表
  'SET_ADD_MESSAGE': 'SET_ADD_MESSAGE', // 添加消息
  'SET_ADD_LOCAL_MESSAGE': 'SET_ADD_LOCAL_MESSAGE', // 添加本地消息
  'SET_SEND_WRAPPER_HEIGHT': 'SET_SEND_WRAPPER_HEIGHT', // 聊天输入框高度
  'SET_GROUP_ID': 'SET_GROUP_ID', // 群id
  'SET_GROUP_READY': 'SET_GROUP_READY', // 群准备好
  'SET_USERS_IM_ID': 'SET_USERS_IM_ID', // 球局成员im id
}

export const actionsTypes = {
  'GET_COMPETITION_DETAIL': 'GET_COMPETITION_DETAIL', // 球赛请求
  'GET_TEE_COLOR': 'GET_TEE_COLOR', // Tee颜色列表
  'GET_USERS_IM_ID': 'GET_USERS_IM_ID', // 获取球局成员im id
  'UPDATE_CUR_GROUP': 'UPDATE_CUR_GROUP', // 更新当前操作分组
  'CLEAR_CHAT_ROOM': 'CLEAR_CHAT_ROOM', // 清除 chat room （比赛详情）数据，防止数据被复用
}