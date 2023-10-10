/*
 * @Author: simon
 * @Description:
 * @LastEditors: simon
 */
// api
import {
  delCompetitor
} from '@/api/chat-room';

/**
 * 计算分数
 * @param {*} competitionData 
 * @param {*} dataSource 
 */
export const calcRecord = function (competitionData, dataSource) {
  let { competitor_list, hole_list } = competitionData;
  let params = {
    competitorList: competitor_list,
    holeList: hole_list,
    dataSource
  };
  handleHoleScore(params);
};

// 修改计分榜
export const handleHoleScore = function ({
  competitorList,
  holeList,
  dataSource,
}) {
  dataSource.map((item) => {
    let index = competitorList.findIndex(
      ({ competitor_id }) => competitor_id == item.competitor_id
    );
    // 找到对应球员修改信息
    if (index !== -1) {
      // 找到球洞修改分数
      competitorList[index].total_score = item.total_score;
      competitorList[index].record.map((record) => {
        if (record.competition_record_id == item.competition_record_id) {
          record.loading = false;
          record.score = item.score;
          record.push = item.push;
          record.unusual = false;
        }
      });
    }
  });
  holeList.forEach((hole) => {
    competitorList.forEach((com) => {
      let totalHalfScore = 0; // 半场分数
      // ======== 处理半场分数 ========
      // 找到半场球场
      let halfCourse = com.record.filter(
        (rec) =>
          !rec.type && rec.course_half_court_id == hole.course_half_court_id
      );
      // 找到记录半场的总分数record
      let halfScoreTarget = com.record.find(
        (item) =>
          item.type === "half" &&
          item.course_half_court_id == hole.course_half_court_id
      );
      // 半场是否每个洞都记录了分数
      let totalHalfFlag = halfCourse.every((item) => item.score !== null);
      // 计算半场得分
      // if (totalHalfFlag) {
        halfCourse.map((item) => {
          totalHalfScore += item.score;
        });
      // }
      // 半场洞数完成
      if (halfScoreTarget) {
        halfScoreTarget.totalHalfFlag = totalHalfFlag;
        halfScoreTarget.totalHalfScore = totalHalfScore;
      }
      // ======== 处理总差数 ========
      let totalDiff = 0;
      let halfTarget = com.record.filter((e) => e.type === "half"); // 找出半场record
      let totalFlag = halfTarget.every((e) => e.totalHalfFlag); // 两个球场洞数是否都已经填写完
      // if (totalFlag) {
        halfTarget.forEach((e) => {
          totalDiff += e.totalHalfScore;
        });
      // }
      com.totalDiff = totalDiff; // 总差
      com.totalFlag = totalFlag; // 两个球场洞数是否都已经填写完
    });
  });

  // console.log("competitorList===", competitorList);
  return competitorList;
};

/**
 * 处理球局详情的数据: 计算总杆，插入半场数据（OUT，IN 的总分数）
 */ 
export const detailData = function (data) {
  let multiple = 0;
  // 下半场球洞 + 上半场球洞的基数
  data.hole_list.forEach((course, cindex, array) => {
    const len = cindex !== 0 ? array[cindex - 1].grCourseHole.length : 0;
    const holeLen = course.grCourseHole.length;
    multiple += holeLen;
    let totalPar = 0;
    course.grCourseHole.forEach((hole) => {
      hole.hole_no2 = hole.hole_no + len;
      totalPar += hole.par;
    });
    course.totalPar = totalPar; // 半场总杆数
    // 插入out 和 in
    data.competitor_list.forEach((com) => {
      let totalHalfScore = 0; // 半场分数
      // 找到半场球场
      let halfCourse = com.record.filter(
        (rec) =>
          !rec.type && rec.course_half_court_id === course.course_half_court_id
      );
      // 半场是否每个洞都记录了分数
      let totalHalfFlag = halfCourse.every((item) => item.score !== null);
      // 计算半场得分
      if (totalHalfFlag) {
        halfCourse.map((item) => {
          totalHalfScore += item.score;
        });
      }
      com.record.splice(multiple, 0, {
        totalHalfFlag: totalHalfFlag,
        totalHalfScore: totalHalfScore,
        competitor_id: cindex - 2,
        type: "half",
        course_half_court_id: course.course_half_court_id,
      });
    });
    multiple += 1;
  });

  // 计算每个球员的总分
  data.competitor_list.forEach((com) => {
    let totalDiff = 0;
    com.record.forEach((v) => {
      v.loading = false; // loading
      v.unusual = false; // 是否异常(网路)
    });
    let halfTarget = com.record.filter((e) => e.type === "half"); // 找出半场record
    let totalFlag = halfTarget.every((e) => e.totalHalfFlag); // 两个球场洞数是否都已经填写完
    if (totalFlag) {
      halfTarget.forEach((e) => {
        totalDiff += e.totalHalfScore;
      });
    }
    com.totalDiff = totalDiff; // 总差
    com.totalFlag = totalFlag; // 两个球场洞数是否都已经填写完
  });

  return data;
};

// 处理比对数据
export const checkInfoChange = function (oldVal, newVal) {
  let { competitor_list, status } = oldVal;
  const competitorList = newVal.competitor_list;
  if (status !== newVal.status) {
    oldVal.status = newVal.status;
  }

  // 检查是否新增成员/减少成员; 新增成员，把新增的成员添加到old的数据中; 减少成员，把减少的成员从old的数据中移除
  if (competitor_list.length != competitorList.length) {
    competitor_list = checkCompetitorList(competitor_list, competitorList);
  }

  // 比对tee是否相同
  competitor_list = checkCompetitorTee(competitor_list, competitorList);

  // 对比每一个洞的值是否相同
  competitor_list = checkCompetitor(competitor_list, competitorList)



  return oldVal;
}

// 处理出最新
const checkCompetitorList = (oldVal, newVal) => {
  // 剔除成员
  if (oldVal.length > newVal.length) {
    return oldVal.filter(e => newVal.findIndex(n => n.competitor_id == e.competitor_id) !== -1)
  }
  // 增加成员 找出新增加的成员并且在对应下标插入
  newVal.forEach((e, idx) => {
    if (newVal[idx] != oldVal[idx]) {
      oldVal.splice(idx, 0, newVal[idx]);
    }
  })

  return oldVal;
}

// 对比tee
const checkCompetitorTee = (oldVal, newVal) => {
  newVal.forEach((e, idx) => {
    if (newVal[idx].tee != oldVal[idx].tee) {
      oldVal[idx].tee = newVal[idx].tee
    }
  })

  return oldVal;

}
// 对比当前球员变化
const checkCompetitor = (oldVal, newVal) => {
  newVal.forEach((n, idx) => {
    oldVal[idx] = checkCompetitorRecord(oldVal[idx], n);
  })
  return oldVal;
}

// 对比球洞比分变化
const checkCompetitorRecord = (oldVal, newVal) => {
  let { record } = oldVal;
  const newRecord = newVal.record;
  newRecord.forEach((n, idx) => {
    if (!n.type && n.score !== record[idx].score) {
      record[idx].score = n.score;
      record[idx].loading = false; // loading
      record[idx].unusual = false; // 是否异常(网路)
    }
    if (!n.type && n.push !== record[idx].push) {
      record[idx].push = n.push;
      record[idx].loading = false; // loading
      record[idx].unusual = false; // 是否异常(网路)
    }
    if (n.type && n.totalHalfScore !== record[idx].totalHalfScore) {
      record[idx].totalHalfScore = n.totalHalfScore;
      record[idx].totalHalfFlag = n.totalHalfFlag;
    }


  });
  oldVal.totalDiff = newVal.totalDiff; // 总差
  oldVal.totalFlag = newVal.totalFlag; // 两个球场洞数是否都已经填写完

  return oldVal;
}

// 处理删除球员
export const handleDelCompetitor = async (self, id) => {
  await delCompetitor({
    competitor_id: id
  });
  let { competitor_list, competition_id } = self.$store.getters.getCompetitionData;
  let index = competitor_list.findIndex(
    (e) => e.competitor_id == id
  );
  // 找到球员。删除球员
  if (index != -1) {
    competitor_list.splice(index, 1);
    self.$store.commit('SET_COMPETITION_ITEM', { key: 'competitor_list', data: competitor_list })

    // 加载详情数据一次
    await self.$store.dispatch('GET_COMPETITION_DETAIL', { competition_id: competition_id })

    uni.$emit('competitor_del', id, competition_id)
  }
}