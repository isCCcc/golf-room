/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */
export const tasks = []; // 队列任务集合
let pending = false; // 是否正在处理（promise的pending状态）

// 队列任务收集
export function nextTick(cb, cxt) {
  var _resolve; // 处理完的回调方法
  tasks.push(() => {
    if(cb) {
      try {
        cb.call(ctx); // 把cb函数的执行,this指向当前实例
        console.log('cb', cb);
      } catch (err) {
        console.log('err', err);
      }
    } else if(_resolve) {
      _resolve(ctx);
    }
  });

  if(!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve;
    })
  }
}

// 清空当前队列任务
function flushTasks() {
  pending = false;
  const copies = tasks.slice(0);
  tasks.length = 0;
  // 在当前队列清空，执行相应的回调函数
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}
// 开始执行处列
export function runQueue() {
  console.log('开始执行队列');
  if(pending) return false;
  pending = true;
  Promise.resolve().then(flushTasks)
}