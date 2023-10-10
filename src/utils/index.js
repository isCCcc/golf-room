/*
 * @Author: simon
 * @Description:
 * @LastEditors: simon
 */

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { stringToArray } from "./third/string-array";

const timeNow = new Date();

export const getTimeState = () => {
  // 获取当前小时
  let hours = timeNow.getHours();
  if (hours > 18 && hours <= 24) {
    return "night";
  }
  return "day";
};
export const isDay = getTimeState() === "day";

//当前年
export const getNowYear = () => {
  const tYear = timeNow.getFullYear();
  return tYear;
};

//当前月
export const getNowMonth = () => {
  let tMonth = timeNow.getMonth();
  let m = tMonth + 1;
  if (m.toString().length == 1) {
    m = "0" + m;
  }
  return m;
};


//当前日期
export const getNowDate = () => {
  let tDate = timeNow.getDate();
  if (tDate.toString().length == 1) {
    tDate = "0" + tDate;
  }
  return tDate;
};

export const formatDate = (date, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  if (!date) return ''
  const t = new Date(typeof date === 'string' ? date.replace(/\-/g, '/') : date)

  const o = {
    'M+': t.getMonth() + 1,                    // 月份
    'd+': t.getDate(),                         // 日
    'h+': t.getHours(),                        // 小时
    'm+': t.getMinutes(),                      // 分
    's+': t.getSeconds(),                      // 秒
    'q+': Math.floor((t.getMonth() + 3) / 3),  // 季度
    S: t.getMilliseconds(),                    // 毫秒
  }

  let str = fmt

  if (/(y+)/.test(str)) {
    str = str.replace(RegExp.$1, (t.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(str)) {
      str = str.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }

  return str
}

export const debounce = (fn, delay = 500) => {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(args)
      timer = null
    }, delay)
  }
}

export const getDistance = (lat1, lng1, lat2, lng2) => {
  const rad = d => (d * Math.PI) / 180.0

  const radLat1 = rad(lat1)
  const radLat2 = rad(lat2)
  const a = radLat1 - radLat2
  const b = rad(lng1) - rad(lng2)
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    )
  s = s * 6378.137 // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000 //输 出为公里

  let distance = s
  let distance_str = ''

  if (parseInt(distance) >= 1) {
    distance_str = distance.toFixed(1) + 'km'
  } else {
    distance_str = (distance * 1000).toFixed(1) + 'm'
  }

  return distance_str
}



export const isValid = (target) => {
  return (
    target != "" &&
    target != undefined &&
    target !== null &&
    target?.length !== 0 &&
    !Object.is(target, NaN)
  );
};




/**
  * 本算法来源于简书开源代码，详见：https://www.jianshu.com/p/fdbf293d0a85
  * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier)
  * 一般用于多个组件之间,给它一个唯一的标识符,或者v-for循环的时候,如果使用数组的index可能会导致更新列表出现问题
  * 最可能的情况是左滑删除item或者对某条信息流"不喜欢"并去掉它的时候,会导致组件内的数据可能出现错乱
  * v-for的时候,推荐使用后端返回的id而不是循环的index
  * @param {Number} len uuid的长度
  * @param {Boolean} firstU 将返回的首字母置为"u"
  * @param {Number} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
  */
export function guid(len = 32, firstU = true, radix = null) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  radix = radix || chars.length

  if (len) {
    // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r
    // rfc4122标准要求返回的uuid中,某些位为固定的字符
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guid不能用作id或者class
  if (firstU) {
    uuid.shift()
    return 'u' + uuid.join('')
  } else {
    return uuid.join('')
  }
};

// 获取聊天时间（相差300s内的信息不会显示时间）
export function getChatTime(v1, v2) {
  v1 = v1.toString().length < 13 ? v1 * 1000 : v1;
  v2 = v2.toString().length < 13 ? v2 * 1000 : v2;
  if (((parseInt(v1) - parseInt(v2)) / 1000) > 300) {
    return gettime(v1);
  }
};
// 人性化时间格式
export function gettime(shorttime) {
  shorttime = shorttime.toString().length < 13 ? shorttime * 1000 : Number(shorttime);
  /**
   * 同一天： HH:mm
   * 隔天：   昨天 HH:mm
   * 同一周： 周一 HH:mm
   * 同一年： XX月xx日 HH:mm
   * 隔年：   xxxx年 XX月xx日 HH:mm
   */

  const curDj = dayjs()
  const dj = dayjs(parseInt(shorttime)).locale('zh-cn')
  if (dj.isSame(curDj, 'day')) {
    return dj.format('HH:mm')
  } else if (dj.isSame(curDj.subtract(1, 'day'), 'day')) { // 隔天
    return dj.format('昨天 HH:mm')
  } else if (dj.isSame(curDj, 'week')) {
    return dj.format('ddd HH:mm')
  } else if (dj.isSame(curDj, 'year')) {
    return dj.format('MMMDD日 HH:mm')
  } else {
    return dj.format('YYYY年 MMMDD日 HH:mm')
  }
};

export function parseNumber(num) {
  return num < 10 ? "0" + num : num;
};

export function dateFormat(date, formatStr) {
  let dateObj = {},
    rStr = /\{([^}]+)\}/,
    mons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  dateObj["Y"] = date.getFullYear();
  dateObj["M"] = date.getMonth() + 1;
  dateObj["MM"] = parseNumber(dateObj["M"]);
  dateObj["Mon"] = mons[dateObj['M'] - 1];
  dateObj["D"] = date.getDate();
  dateObj["DD"] = parseNumber(dateObj["D"]);
  dateObj["h"] = date.getHours();
  dateObj["hh"] = parseNumber(dateObj["h"]);
  dateObj["t"] = dateObj["h"] > 12 ? dateObj["h"] - 12 : dateObj["h"];
  dateObj["tt"] = parseNumber(dateObj["t"]);
  dateObj["A"] = dateObj["h"] > 12 ? '下午' : '上午';
  dateObj["i"] = date.getMinutes();
  dateObj["ii"] = parseNumber(dateObj["i"]);
  dateObj["s"] = date.getSeconds();
  dateObj["ss"] = parseNumber(dateObj["s"]);
  console.log('dateObj',dateObj);

  while (rStr.test(formatStr)) {
    formatStr = formatStr.replace(rStr, dateObj[RegExp.$1]);
  }
  return formatStr;
};

// 获取地理位置
export async function getLocation() {
  return new Promise((success, fail) => {
    uni.getLocation({
      isHighAccuracy: true,
      success,
      fail,
    })
  })
};

let recentLocation = null;
let recentLocationLoading = Promise.resolve(recentLocation);
/**
 * 获取最近坐标信息，默认1.5小时更新获取一次。
 * 
 * @returns {Object} 坐标信息, 可能为空
 */
export async function tryGetRecentLocation({ force = false, interval = 1.5 * 60 * 60 * 1000 }) {
  await recentLocationLoading;
  recentLocationLoading = new Promise(async (resolve, reject) => {
    const nowTime = new Date().getTime();
    if (
      force ||
      recentLocation == null ||
      nowTime - (recentLocation?.gr_update_time || 0) > interval
    ) {
      const location = await getLocation().catch(() => {
        return null;
      });
      location && (location.gr_update_time = nowTime)
      recentLocation = location;
    }
    resolve(recentLocation);
  }).finally((recentLocation) => {
    recentLocationLoading = Promise.resolve(recentLocation);
  });
  return recentLocationLoading;
};

/**
 * 是否是空对象
 */
export function isEmptyObj(obj) {
  return obj // 👈 null and undefined check
    && Object.keys(obj).length === 0
    && Object.getPrototypeOf(obj) === Object.prototype
}

/**
 * 是否是为空，包括 null，空对象，空字符串等。NOTICE: Does not support evaluating a Set or a Map. See: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_isempty
 */
export const isEmpty = obj => [Object.name, Array.name].includes((obj || {}).constructor.name) && !Object.entries((obj || {})).length;

/**
 * 取整数部分
 * @param { Number } num 
 * @returns 
 */
export function trunc(num) {
  return num >= 0 ? Math.floor(num) : Math.ceil(num)
}

export const UserNameMinLength = 1;
export const UserNameMaxLength = 20;
/**
 * 
 */
export function isUserNameLegal(userName) {
  const userNameArr = stringToArray(userName || '')
  if (userNameArr.length < UserNameMinLength || userNameArr.length > UserNameMaxLength) {
    return false;
  }
  return true;
}

export function trimUserName(userName) {
  const userNameArr = stringToArray(userName || '')
  let ret = userNameArr.slice(0, UserNameMaxLength).join('');

  // remove newline
  ret = ret.replace(/\t|\n|\v|\r|\f/g, '');
  // remove continues spaces
  ret = ret.replace(/\x20{2}/g, ' ');

  return ret;
}
