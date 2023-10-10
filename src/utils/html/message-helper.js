import { allCompetitionGroupedPkScoreSummary, allCompetitionPkList } from "@/api/pk";
import { FirstDisplayTimeMap } from "@/storage/competition";
import { guid } from "..";


function getCommonClasses(lineHeight) {
  return `
  .name {
    color: black;
  }
  .distance {
    color: #95d171;
  }
  .lead {
    color: #000;
  }
  .link {
    color: #4181BE;
  }
  `
}

/**
 * 系统播报统一样式
 */
const styleBaseLineHeight = 36
export const systemBroadcastStyle = `
<style>
  .root {
    font-weight: 400;
    font-size: 24rpx;
    line-height: ${styleBaseLineHeight}rpx;
    letter-spacing: -0.3rpx;
    color: #999;
    background: #f9f9f9;
    
    
    margin-left: 22rpx;
    margin-right: 22rpx;
    padding: 10rpx 14rpx;
    border-radius: 2rpx;
  }
  ${getCommonClasses(styleBaseLineHeight)}
</style>
`

/**
 * 解说相关 统一样式
 */
const commentaryLineHeight = 36
const commentaryBadgeIconHeight = 28
export const commentaryStyle = `
<style>
  .root {
    font-weight: 400;
    font-size: 26rpx;
    line-height: ${commentaryLineHeight}rpx;
    letter-spacing: -0.3rpx;
    color: #999;
    
    // margin-left: 22rpx;
    // margin-right: 22rpx;
    // padding: 10rpx 14rpx;
    // border-radius: 2rpx;
  }
  .commentary-badge {
    display: inline-flex;
    height: ${commentaryLineHeight}rpx;
    margin-right: 6rpx;
    align-items: center;
    // background-color: red;
    vertical-align: text-bottom;
  }
  .commentary-badge-icon {
    width: 84rpx;
    height: 30rpx;
    background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/ico_message_commentay_v2_green.png');
    background-size: 100%;
    background-repeat: no-repeat;
  }
  ${getCommonClasses(commentaryLineHeight)}
</style>
`

/**
 * @typedef {Object} CompetitionUserEnterInfo 球赛聊天室用户进入消息
 * @property {number} time 消息时间
 * @property {number} group_id 球赛对应 IM 聊天室的 ID
 * @property {boolean} isMe 是否是自己
 * @property {number} im_id 用户的 IM ID
 * @property {?string} avatar_url 用户头像
 * @property {?string} username 用户名称
 * @property {?function} msgHandler 消息处理函数
 */

/**
 * 处理用户进入的消息
 * @param {CompetitionUserEnterInfo} data
 */
export function handleUserEnteringMessage({ time, group_id, isMe, im_id, avatar_url, username, msgHandler }) {
  let enteringMsg = {
    id: time,
    gid: group_id,
    content: '',
    type: 'local_msg',
    priority: 0,
    timestamp: time,
    ext: JSON.stringify({
      msg_type: 'enter_room',
      msg_sub_type: isMe == true ? 'enter_room_me' : 'enter_room_other',
      im_id: im_id,
      username: username,
      avatar_url: avatar_url,
      g_msg_guid: guid(), // 消息的 GUID
    })
  };
  msgHandler && msgHandler(enteringMsg)
}


/**
 * @typedef {Object} CompetitionInfos 
 * @property {object} competitionData 球赛详情
 * @property {number} group_id 球赛对应 IM 聊天室的 ID
 * @property {boolean} canManipulatePk 是否是可以操作 PK
 * @property {PkCategory[]} pkCategories PK 基础分类集合
 * @property {?function} msgHandler 消息处理函数
 */

/**
 * 处理进入聊天室时的信息
 * @param {CompetitionInfos} data
 */
export async function handleCompetitionEnteringMessages({ competitionData, group_id, canManipulatePk, msgHandler }) {
  const allMessages = [];

  var curTime = new Date().getTime();

  const announcement = competitionData?.announcement;
  if (announcement && announcement.length > 0) {
    // 公告 announcement
    let announcementMsg = {
      id: curTime,
      gid: group_id,
      content: announcement,
      type: 'local_msg',
      priority: 0,
      timestamp: curTime,
      ext: JSON.stringify({
        msg_type: 'announcement',
        g_msg_guid: guid(), // 消息的 GUID
      })
    };
    allMessages.push(announcementMsg)
    curTime++;
  }

  /**
   * 创建成功，对有权限的人，提示可以创建 PK 规则。“创建高球房间成功，点击右下角PK规则按钮可添加PK玩法。”
   */
  const displayTime = FirstDisplayTimeMap.competitionValidDisplayTime(competitionData.competition_id, competitionData.start_time);
  const shouldShow = canManipulatePk == true
    && competitionData.status !== 2
    && displayTime == null
  if (shouldShow) {
    const createHint = `
      <div class="root">
        <span>创建高球房间成功，点击右下角PK规则按钮可添加PK玩法。</span>
      <div>
      `.replace(/\s*\n\s*/gi, ''); // 替换 空格+换行+空格，防止 span 之间有空格，并且压缩
    
    // 第一次进入球场，提示创建成功，提示 PK 可创建
    let createSuccessMsg = {
      id: curTime,
      gid: group_id,
      content: '',
      type: 'local_msg',
      priority: 0,
      timestamp: curTime,
      ext: JSON.stringify({
        msg_type: 'system_broadcast',
        msg_sub_type: 'pk_hint',
        html_content: createHint,
        g_msg_guid: guid(), // 消息的 GUID
      })
    };
    allMessages.push(createSuccessMsg);
    curTime++;
  }

  allMessages.forEach((msg) => {
    msgHandler && msgHandler(msg);
  })
}


/**
 * 处理比赛状态相关信息，包括 PK 内容。
 * @param { CompetitionInfos } competitionData
 */
export async function handleCompetitionStateMessages({competitionData, group_id, canManipulatePk, pkCategories, msgHandler}) {

  const allMessages = [];

  const competitors = competitionData.competitor_list
  const groupedCompetitors = competitors.reduce((grouped, competitor) => {
    const groupName = competitor.group;
    if (grouped[groupName] == null) {
      grouped[groupName] = [];
    }
    grouped[groupName].push(competitor)
    return grouped
  }, {})
  const multiGroupCompetition = Object.keys(groupedCompetitors).length > 1 // 团体比赛（多个分组）

  /**
   * @type CompetitionPk[]
   */
  const allPkList = (
    await allCompetitionPkList({ competition_id: competitionData.competition_id })
      .catch((e) => {
        console.error('Failed to load competition PK list', e);
      })
  )?.data?.data?.list || [];

  /** 
   * @type Object.<string, Array<CompetitionPk>>
   * 注意，这个只包含有 PK 的分组信息
   */
  const groupedPks = allPkList.reduce((grouped, competitionPk) => {
    if (competitionPk.group == null) return;
    const groupName = competitionPk.group;

    /** @type PkCategory */
    const pkCategory = pkCategories.find(tool => {
      return tool.pk_id == competitionPk.pk_id
    })
    if (pkCategory == null) {
      console.warn('Cannot find basic rule for pk', competitionPk.rules);
      return grouped
    };
    
    // 找出有效的 PK
    /** @type string[] */
    const pkCompetitorIds = competitionPk.competitor_ids?.split(",") || []
    if (pkCompetitorIds.length < 1) {
      return grouped
    }
    /** @type number[] */
    const competitorIdsInCompetition = (groupedCompetitors[groupName] || []).map((com) => com.competitor_id)
    const idNotExist = pkCompetitorIds.find((idStr) => {
      return !competitorIdsInCompetition.includes(idStr * 1)
    })
    if (idNotExist) {
      console.warn('PK containing a competitor that is not exist', idNotExist);
      return grouped
    }


    competitionPk.gr_pk_category = pkCategory;

    if (grouped[groupName] == null) {
      grouped[groupName] = [];
    }
    grouped[groupName].push(competitionPk)
    return grouped;
  }, {})
  const groupNamesWithPK = Object.keys(groupedPks);
  const showPKGroupName = groupNamesWithPK.length > 1 || multiGroupCompetition
  
  var curTime = new Date().getTime();

  let competitionStatus = competitionData.status

  /**
   * 比赛概况播报
   */
  if (true) {
    let competitionStateInfo;
    if (competitionStatus === 0) { // 未开始
      // TODO: 添加微信通知, 通知开球
      competitionStateInfo = `
        <div class="root">
          <span>欢迎来到</span>
          ${competitionData.competitor_list.map((com) => {
            return `<a href="https://golfroom.cn/p?j=%7B%22p%22%3A%7B%22uid%22%3A${com.uid}%7D%7D" class='name'> @${com.username}</a>`
          }).join('\n')}
          <span> 的高球房间！</span>
          <span>本场比赛将于</span>
          <span>${competitionData.start_time}</span>
          <span>在</span>
          <span>${competitionData.course_name}</span>
          <span>进行。</span>
          ${groupNamesWithPK.length > 0 && false ? // p 屏蔽 PK 信息
            `<span>比赛</span>
            ${groupNamesWithPK.map((groupName, index) => {
              const pksInGroup = groupedPks[groupName];
              return `<span>${showPKGroupName ? ' ' + groupName + '组' : ''}将采用</span>`
                + pksInGroup.map((pk, index) => {
                  const name =pk.gr_pk_category.pk_name
                  if (index == 0) {
                    return `<span>${name}</span>`
                  } else if (index == pksInGroup.length - 1) {
                    return `<span>及</span><span>${name}</span>`
                  } else {
                    return `<span>、</span><span>${name}</span>`
                  }
                }).join('')
              })}
            <span>的规则进行PK。</span>` : ''
          }
          <!-- <span class="link">开球时通知我</span> -->
        </div>
        `.replace(/\s*\n\s*/gi, ''); // 替换 空格+换行+空格，防止 span 之间有空格，并且压缩

    } else if (competitionStatus === 1) { // 进行中
      const leadingScore = [...competitionData.competitor_list]
        .sort((a, b) => {
          return a.totalDiff - b.totalDiff;
        })
        .shift().totalDiff;
      const leadingCompetitors = competitionData.competitor_list.filter(
        (com) => {
          return com.totalDiff <= leadingScore;
        }
      );
      competitionStateInfo = `
        <div class="root">
          <span>欢迎来到</span>
          ${competitionData.competitor_list.map((com) => {
            return `<a href="https://golfroom.cn/p?j=%7B%22p%22%3A%7B%22uid%22%3A${com.uid}%7D%7D" class='name'> @${com.username}</a>`
          }).join('\n')}
          <span> 的高球房间！</span>
          <span>本场比赛在</span>
          <span>${competitionData.course_name}</span>
          <span>进行。</span>
          ${ (competitionData.competitor_list.length > leadingCompetitors.length) ?
              leadingCompetitors.map(com => {
                return `<a href="https://golfroom.cn/p?j=%7B%22p%22%3A%7B%22uid%22%3A${com.uid}%7D%7D" class='name'>@${com.username}</a>`
              }).join('、')
              + `<span> 以总杆差 </span>
                <span>${leadingCompetitors[0].totalDiff > 0 ? '+' : ''}</span>
                <span>${leadingCompetitors[0].totalDiff}</span>
                <span> 领先，</span>`
            : ''
          }
          <span>欢迎各位围观球员积极互动，点赞支持，见证球友打出卓越成绩！</span>
        </div>
        `.replace(/\s*\n\s*/gi, ''); // 替换 空格+换行+空格，防止 span 之间有空格，并且压缩
    } else if (competitionStatus === 2) { // 结束  
      const finishedCompetitors = [...competitionData.competitor_list].filter((com) => com.is_played_all_hold)
      const leadingScore = [...finishedCompetitors]
        .sort((a, b) => {
          return a.totalDiff - b.totalDiff;
        })
        .shift()?.totalDiff;
      const leadingCompetitors = leadingScore ? finishedCompetitors.filter(
        (com) => {
          return com.totalDiff <= leadingScore;
        }
      ) : [];
      competitionStateInfo = `
        <div class="root">
          <span>本场比赛已结束。</span>
          ${ (leadingCompetitors.length > 0 && competitionData.competitor_list.length > leadingCompetitors.length) ?
              leadingCompetitors.map(com => {
                return `<a href="https://golfroom.cn/p?j=%7B%22p%22%3A%7B%22uid%22%3A${com.uid}%7D%7D" class='name'>@${com.username}</a>`
              }).join('、')
              + `<span> 以总杆数 </span>
                <span>${leadingCompetitors[0].total_score}</span>
                <span> 的成绩排名榜首。</span>`
            : ''
          }
          <a href="https://golfroom.cn/pi?j=%7B%22cr%22%3A%7B%22modal%22%3A%22whole_rank%22%7D%7D" class='link'>点击此处查看成绩总排名。</a>
          <span>点击积分卡球员头像可查看记分卡详细数据并生成分享海报。</span>
        </div>
        `.replace(/\s*\n\s*/gi, ''); // 替换 空格+换行+空格，防止 span 之间有空格，并且压缩
    }

    if (competitionStateInfo) {
      // 第一次进入球场，提示创建成功，提示 PK 可创建
      let competitionStateInfoMsg = {
        id: curTime,
        gid: group_id,
        content: '',
        type: 'local_msg',
        priority: 0,
        timestamp: curTime,
        ext: JSON.stringify({
          msg_type: 'system_broadcast',
          msg_sub_type: 'competition_state_info',
          html_content: competitionStateInfo,
          g_msg_guid: guid(), // 消息的 GUID
        })
      };
      allMessages.push(competitionStateInfoMsg);
      curTime++;
    }
  }

  /**
   * PK总揽播报
   */
  if (groupNamesWithPK.length > 0) {

    /** @type Object.<string, PKScoreSummary> */
    const competitionGroupedPkScoreSummary = (await allCompetitionGroupedPkScoreSummary({ competition_id: competitionData.competition_id }))?.data?.data || []

    // 整合数据
    groupNamesWithPK.map((groupName, gIndex) => {
      const pksInGroup = groupedPks[groupName];
      const competitorsInGroup = competitionGroupedPkScoreSummary[groupName]?.competitor_list?.filter((competitor) => competitor.group === groupName) || [];
      // 按的得分排序的球员列表
      const sortedCompetitors = [...competitorsInGroup].sort((a, b) => {
        return b.total_pk_score - a.total_pk_score
      });
      const leadingScore = sortedCompetitors[0]?.total_pk_score || 0;
      // 领先的球员（可能有同分）
      let leadingCompetitors = [];
      // 不是领先的球员
      let theRestCompetitors = [];
      sortedCompetitors.forEach((com) => {
        (com.total_pk_score === leadingScore ? leadingCompetitors : theRestCompetitors).push(com)
      })

      pksInGroup.gr_leading_score = leadingScore;
      pksInGroup.gr_sorted_competitors = sortedCompetitors;
      pksInGroup.gr_leading_competitors = leadingCompetitors;
      pksInGroup.gr_the_rest_competitors = theRestCompetitors;
    });
    
    
    let pk_state_info;
    if (competitionStatus === 1) { // 进行中
      pk_state_info = `
        <div class="root">
          ${groupNamesWithPK.length < 1 ? '' :
          `<span>本场比赛</span>`
          + groupNamesWithPK.map((groupName, gIndex) => {
            /** @type Array<CompetitionPk> */
            const pksInGroup = groupedPks[groupName];
            /** @type number */
            const leadingScore = pksInGroup.gr_leading_score;
            /** @type Array<Competitor> */
            const sortedCompetitors = pksInGroup.gr_sorted_competitors;
            /** @type Array<Competitor> */
            const leadingCompetitors = pksInGroup.gr_leading_competitors;
            /** @type Array<Competitor> */
            const theRestCompetitors = pksInGroup.gr_the_rest_competitors;
              
            return `<span>${showPKGroupName ? groupName + '组' : ''}采取</span>`
              // 规则总结
              + pksInGroup.map((pk, index) => {
                  const name = pk.gr_pk_category.pk_name
                  if (index == 0) {
                    return `<span>${name}</span>`
                  } else if (index == pksInGroup.length - 1) {
                    return `<span>及</span><span>${name}</span>`
                  } else {
                    return `<span>、</span><span>${name}</span>`
                  }
                }
              ).join('')
              + `<span>的 PK 规则</span>`
              // 得分
              + (sortedCompetitors.length < 1
                ? ''
                : '<span>，目前战况</span>'
                  + ((theRestCompetitors.length > 0 && leadingCompetitors.length > 0)
                    ? leadingCompetitors.map((com, index) => {
                        return `<a href="https://golfroom.cn/p?j=%7B%22p%22%3A%7B%22uid%22%3A${com.uid}%7D%7D" class='name'> @${com.username}</a>`
                      }).join(' ')
                      + `<span> 以${leadingScore}分领先</span>`
                      + `<span>${theRestCompetitors.length > 0 ? '，' : ''}</span>`
                      + theRestCompetitors.map((com, index) => {
                        return `<a href="https://golfroom.cn/p?j=%7B%22p%22%3A%7B%22uid%22%3A${com.uid}%7D%7D" class='name'>@${com.username}</a>`
                        + `<span>  ${com.total_pk_score}分</span>`
                      }).join('，')
                    : `<span> </span>`
                      + sortedCompetitors.map((com, index) => {
                        return `<a href="https://golfroom.cn/p?j=%7B%22p%22%3A%7B%22uid%22%3A${com.uid}%7D%7D" class='name'>@${com.username}</a>` 
                          + `<span> ${com.total_pk_score}分</span>`
                      }).join('，')
                    )
                )
            }).join('。')
          }
          <span>。（可点击“PK得分”按钮查阅详细得分情况）</span>
        </div>
        `.replace(/\s*\n\s*/gi, ''); // 替换 空格+换行+空格，防止 span 之间有空格，并且压缩

    } else if (competitionStatus === 2) { // 结束
      pk_state_info = `
        <div class="root">
          <span>本场 PK 已结束。</span>
          ${groupNamesWithPK < 1 ? '' : '' + groupNamesWithPK.map((groupName, gIndex) => {
            /** @type Array<CompetitionPk> */
            const pksInGroup = groupedPks[groupName];
            /** @type Array<Competitor> */
            const sortedCompetitors = pksInGroup.gr_sorted_competitors;
            return `<span>${showPKGroupName ? groupName + '组 ' : ''}</span>`
              + sortedCompetitors.map((com, index) => {
                return `<a href="https://golfroom.cn/p?j=%7B%22p%22%3A%7B%22uid%22%3A${com.uid}%7D%7D" class='name'>@${com.username}</a>` 
                  + `<span> ${com.total_pk_score}分</span>`
              }).join('，')
              + `<span>。</span>`
            }).join('')
          }
        </div>
        `.replace(/\s*\n\s*/gi, ''); // 替换 空格+换行+空格，防止 span 之间有空格，并且压缩
    }

    if (pk_state_info) {
      // 第一次进入球场，提示创建成功，提示 PK 可创建
      let pkStateInfoMsg = {
        id: curTime,
        gid: group_id,
        content: '',
        type: 'local_msg',
        priority: 0,
        timestamp: curTime,
        ext: JSON.stringify({
          msg_type: 'system_broadcast',
          msg_sub_type: 'competition_pk_state_info',
          html_content: pk_state_info,
          g_msg_guid: guid(), // 消息的 GUID
        })
      };
      allMessages.push(pkStateInfoMsg);
      curTime++;
    }
  }

  allMessages.forEach((msg) => {
    msgHandler && msgHandler(msg);
  })
}