// export function debounce(func, wait, immediate) {
//   var timeout;
//   return function() {
//   	var context = this, args = arguments;
//   	clearTimeout(timeout);
//   	timeout = setTimeout(function() {
//   		timeout = null;
//   		if (!immediate) func.apply(context, args);
//   	}, wait);
//   	if (immediate && !timeout) func.apply(context, args);
//   };
// }

/**
 * 生成节流函数，可以使用最近一次调用时的参数。
 * @param {function} func 被节流的函数。
 * @param {number} interval 间隔时间，单位毫秒
 * @param {*} immediate 是否第一次调用就执行
 * @returns 
 */
export function throttle(func, interval, immediate) {
  let timeout;
  let lastArgs;
  let lastCalled = null; // 记录上一次调用的时间
  
  return function(...args) {
    const now = Date.now();
    lastArgs = args;

    clearTimeout(timeout);

    if ((lastCalled == null && immediate) || (lastCalled != null && now - lastCalled >= interval)) {
      func.apply(this, lastArgs);
      lastArgs = undefined;
      lastCalled = now;
    } else {
      // 如果不是立即执行，并且不存在上一次调用，这个时候可以将上一次调用的时间设定为现在
      if (immediate == false && lastCalled == null) {
        lastCalled = now;
      }
      timeout = setTimeout(() => {
        timeout = undefined;
        func.apply(this, lastArgs);
        lastArgs = undefined;
        lastCalled = now; // 重置最后调用时间，
      }, interval - (now - (lastCalled || now)));
    }
  };
}

/**
 * 将 await 包起来，返回一个 promise，结果是：[err, data]，err 是错误（reject），data 是结果（resolve） 
 * @param {*} promise 
 * @returns 
 */
export function awaitWrap(promise) {
  return promise.then((data) => [null, data]).catch((err) => [err, null]);
}