import { SysStaticInfo } from "@/utils/system/static-info";

var logger =
  // #ifdef MP-WEIXIN
  wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
  // #else
  null
  // #endif
 
export const realtimeLogger = {
  /** */
  rtInfo(...params) {
    if (!logger) return;
    logger.info.apply(logger, this._handleParams(params));
  },
  rtWarn(...params) {
    if (!logger) return;
    logger.warn.apply(logger, this._handleParams(params));
  },
  rtError(...params) {
    if (!logger) return;
    logger.error.apply(logger, this._handleParams(params));
  },
  
  rtSetFilterMsg(msg) { // 从基础库2.7.3开始支持
    if (!logger || !logger.setFilterMsg) return
    if (typeof msg !== 'string') return
    logger.setFilterMsg(msg)
  },
  rtAddFilterMsg(msg) { // 从基础库2.8.1开始支持
    if (!logger || !logger.addFilterMsg) return
    if (typeof msg !== 'string') return
    logger.addFilterMsg(msg)
  },

  /**
   * 处理参数
   * @param {?Array} params 
   */
  _handleParams(params) {
    const mixParams = this._handleErrorsInParams((params || []))

    // 倒序插入用户 ID 
    const uid = getApp().$vm?.$store?.state?.user?.userInfo?.uid
    if (process.env.NODE_ENV === 'development') {
      console.warn('_handleParams No user id');
    }
    mixParams.unshift(uid || 'No ID')
    
    // 倒序插入版本
    mixParams.unshift(SysStaticInfo.versionInfo)
    return mixParams
  },

  /**
   * 目前小程序日志不能直接显示出 Error 的 message 部分，直接显示堆栈信息。这里解析出 message 部分。
   * @param {Array} params 
   */
  _handleErrorsInParams(params) {
    const newParams = []
    params.forEach((param) => {
      if (param?.constructor?.name && param.constructor.name === 'Error' && param.message) {
        newParams.push(param.message)
        newParams.push(param)
      } else {
        newParams.push(param)
      }
    })
    return newParams;
  }
}


// export function grDebug() {
//   if (!log) return;
//   log.debug.apply(log, arguments);
// }
// export function grInfo() {
//   if (!log) return;
//   log.info.apply(log, arguments);
// }
// export function grWarn() {
//   if (!log) return;
//   log.warn.apply(log, arguments);
// }
// export function grError() {
//   if (!log) return;
//   log.error.apply(log, arguments);
// }

// export function setFilterMsg(msg) { // 从基础库2.7.3开始支持
//   if (!log || !log.setFilterMsg) return
//   if (typeof msg !== 'string') return
//   log.setFilterMsg(msg)
// }
// export function addFilterMsg(msg) { // 从基础库2.8.1开始支持
//   if (!log || !log.addFilterMsg) return
//   if (typeof msg !== 'string') return
//   log.addFilterMsg(msg)
// }
