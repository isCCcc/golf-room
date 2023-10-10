/*
 * @Author: simon
 * @Description: 球局计分 接口异常重推
 * @LastEditors: simon
 */
export const tasks = []; // 任务收集

// 执行任务队列
export function runTasks() {
  console.log('开始执行任务队列')
  const runs = tasks.slice(0);
  tasks.length = 0;
  for (let i = 0; i < runs.length; i++) {
    runs[i].fn(runs[i].params);
  }
}

// 推任务进队列
export function pushTask(type, params = {}, fn) {
  tasks.push({type, params: {...params}, fn});
}
// score tee del

// 处理score类型的数据
export function checkScore(params) {
  const findIdx = tasks.findIndex(e => e.type === 'score' && e.params.competition_id == params.competition_id);
  if(findIdx === -1) return params;
  const [first] = tasks.splice(findIdx, 1);
  const newScore = JSON.parse(params.records);
  const oldScore = JSON.parse(first.params.records);
  const score = {};
  newScore.forEach(e => {
    score[e.competition_record_id] = {...e};
  });
  oldScore.forEach(e => {
    score[e.competition_record_id] = {...e};
  })
  return {...params, records: JSON.stringify(Object.values(score))};
}

// 处理Tee的修改异常
export function checkTee(params) {
  const findIdx = tasks.findIndex(e => e.type === 'tee' && e.params.competitor_id == params.competitor_id);
  if(findIdx === -1) return params;
  const [first] = tasks.splice(findIdx, 1);
  first.params.tee = params.tee;
  return first;
}
