const genWxml = function(courseName, weatherWxml, scoreBoardWxml, scoreSummaryWxml, shareQrcodeWxml) {
  return `
    <view class="score-landscape-page">
      <image class="bg-image" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/score_share_landscape_bg.png"></image>
      <view class="container">
        <view class="landscape-nav-bar">
          <view class="tc landscape-title">
            <text class="title-text">${courseName}</text>
          </view>
          ${weatherWxml}
        </view>
        ${scoreBoardWxml}
        ${scoreSummaryWxml}
        ${shareQrcodeWxml}
      </view>
    </view>
  `
}

const genWeatherWxml = function(weatherText) {
  return `
    <view class="weather-wrapper">
      <text class="tc weather-area">${weatherText}<text>
    </view>
  `
}

const cutString = function(str, len) {
  if (!str || !len) return
  if (str.length <= len) {
    return str
  } else {
    return str.slice(0, len) + '...'
  }
}

const genBoardWxml = function(competitorList, holeList, competitionData) {
  // 左边用户列表
  let competitorListWxml = ''
  // 右边洞分
  let holeCellScoreWxml = ''
  for (let i in competitorList) {
    let evenClass = i%2 ? '' : 'even'
    competitorListWxml += `<view class="left-td-cell ${evenClass}">
                  <image class="td-avatar" src="${competitorList[i].avatar_url}"></image>
                  <text class="td-name">${cutString(competitorList[i].username, 4)}</text>
                  <view class="tee-wrapper tee-color${competitorList[i].tee}"></view>
                </view>`
    
    // 右边洞分
    let holeCellWxml = ''
    let record = competitorList[i].record
    for (let j in record) {
      // 生成record cell wxml
      let cellWxml = ''
      let halfScore = record[j].totalHalfScore
      let cellScore = record[j].score
      if (record[j].type === 'half') {
        // 半场分
        cellWxml = `<view class="right-td-cell right-cell-bg">
                      <text class="td-diff rubik bold">${halfScore > 0 ? '+' + halfScore : halfScore !== null ? halfScore : ''}</text>
                    </view>`
      } else {
        // 背景图片
        let bgImage = ''
        cellScore > 0 && (bgImage += '<image class="cell-image cell-image-lg" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/square-lg.png"></image>')
        cellScore > 1 && (bgImage += '<image class="cell-image cell-image-sm" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/square-sm.png"></image>')
        cellScore < 0 && (bgImage += '<image class="cell-image cell-image-lg" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/circle-lg.png"></image>')
        cellScore < -1 && (bgImage += '<image class="cell-image cell-image-sm" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/circle-sm.png"></image>')
        // 球洞分record cell
        cellWxml = `<view class="td-cell-inner">
                      ${bgImage}
                      <text class="td-score rubik bold">${cellScore > 0 ? '+' + cellScore : cellScore !== null ? cellScore : ''}</text>
                    </view>`
      }
      holeCellWxml += `<view class="right-td-cell ${evenClass}">
                        ${cellWxml}
                      </view>`
    }
    holeCellScoreWxml += `<view class="right-tr-cell">
                            ${holeCellWxml}
                            <!-- S 总差 -->
                            <view class="right-td-cell ${evenClass}">
                              <view class="diff-cell-bg">
                                <text class="right-td-cell td-diff rubik bold">${competitorList[i].totalDiff > 0 ? '+' : ''}${competitorList[i].totalDiff === null ?  '' : competitorList[i].totalDiff}</text>
                              </view>
                            </view>
                            <!-- E 总差 -->

                            <!-- S 总杆 -->
                            <view class="right-td-cell ${evenClass}">
                              <text class="right-td-cell td-score rubik bold ${competitorList[i].totalFlag == false ? 'op-5' : ''}">${competitorList[i].total_score}</text>
                            </view>
                            <!-- E 总杆 -->
                          </view>`
  }
  
  // 球洞编号
  let holeListWxml = ''
  for (let i in holeList) {
    let holeCellWxml = ''
    let courseHole = holeList[i].grCourseHole
    for (let j in courseHole) {
      holeCellWxml += `<view class="right-th-cell">
                        <text class="th-no rubik bold">${courseHole[j].hole_no2}</text>
                        <text class="th-score rubik bold">${courseHole[j].par}</text>
                      </view>`
    }
    holeListWxml += `<view class="half-wrapper">
                      ${holeCellWxml}
                      <view class="right-th-cell right-cell-bg">
                        <text class="th-no th-no-half rubik bold">${i > 0 ? 'IN' : 'OUT'}</text>
                        <text class="th-score rubik bold">${holeList[i].totalPar}</text>
                      </view>
                    </view>`
  }
  
  return `<view class="scoreboard-wrap pr">
    <!-- S 计分板 -->
    <image class="board-bg" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/bg-scoreboard.png"></image>
    <view class="left-border"></view>
    <!-- S 左边 -->
    <view class="table-left">
      <view class="left-th-cell">
        <text class="th-hole rubik">HOLE</text>
        <text class="th-par rubik">PAR</text>
      </view>
      ${competitorListWxml}
    </view>
    <!-- E 左边 -->
    
    <!-- S 右边 -->
    <view class="table-right-wrapper">
      <!-- S 球洞编号 -->
      <view class="right-th-wrapper">
        ${holeListWxml}
        <view class="right-th-cell diff-cell-bg">
          <text class="th-no">总差</text>
          <text class="th-score rubik">0</text>
        </view>
        <view class="right-th-cell">
          <text class="th-no">总杆</text>
          <text class="th-score rubik">${competitionData.total_score}</text>
        </view>
      </view>
      <!-- E 球洞编号 -->
      
      <!-- S 洞分 -->
      ${holeCellScoreWxml}
      <!-- E 洞分 -->
    </view>
    <!-- E 右边 -->
  </view>`
}

const genSummaryWxml = function(competitorList) {
  let innerWxml = ''
  competitorList.forEach(item => {
    innerWxml += `<view class="score-summary-item">
                    <view class="score-header">
                      <image class="score-bg" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/score-bg.png"></image>
                      <view class="score-inner-wrapper">
                        <text class="score-wrapper tc rubik">${item.total_score}</text>
                        <text class="hcp tc rubik">${item.hcp}</text>
                      </view>
                      <image class="compt-avatar" src="${item.avatar_url}"></image>
                    </view>
                    <text class="score-bottom tc">${item.username}</text>
                  </view>`
  })
  
  return '<view class="score-summary-wrapper">' + innerWxml + '</view>'
}

const genQrcodeWxml = function(qrCode) {
  return `
    <view class="share-wrapper">
      <view class="share-left-wrap">
        <text class="share-scan">扫码进入房间</text>
        <text class="share-tip">和我一起组建球局</text>
      </view>
      <image class="pointer" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/pointer.png"></image>
      <image class="share-qrcode" src="${qrCode}"></image>
    </view>
  `
}

const convertPx = function(px, deviceWidth) {
  return deviceWidth * px / 812
}

const genStyle = function(width, height, competitorNo) {
  // 头像cell宽度
  const A_CELL_WIDTH = convertPx(48, width)
  // 洞分cell宽度
  const C_CELL_WIDTH = (width - A_CELL_WIDTH)/22
  // 标题高度
  const TH_CELL_HEIGHT = convertPx(41, width)
  // 洞分高度
  const CELL_HEIGHT = convertPx(48, width)
  const SUB_COLOR = '#95d171'
  // 计分板高度
  const BOARD_HEIGHT = TH_CELL_HEIGHT + CELL_HEIGHT * competitorNo
  
  return {
    scoreLandscapePage: {
      width: width,
      height: height
    },
    tc: {
      textAlign: 'center'
    },
    bold: {
      fontWeight: 500
    },
    rubik: {
      fontFamily: 'Rubik-Med-ASCII'
    },
    bgImage: {
      width: width,
      height: height
    },
    container: {
      width: width,
      height: height,
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 2
    },
    // 标题
    landscapeNavBar: {
      width: width,
      height: convertPx(69, width)
    },
    landscapeTitle: {
      width: width,
      height: convertPx(42, width)
    },
    titleText: {
      width: width,
      height: convertPx(42, width),
      lineHeight: '2.6em',
      fontSize: 16,
      color: '#fff'
    },
    // 天气
    weatherWrapper: {
      width: width,
      height: convertPx(27, width)
    },
    weatherArea: {
      width: width,
      height: convertPx(27, width),
      fontSize: 10,
      color: 'rgba(255, 255, 255, 0.6)',
      lineHeight: '2.7em'
    },
    // 每个人总分统计
    scoreSummaryWrapper: {
      position: 'absolute',
      width: 600,
      height: convertPx(72, width),
      left: 0,
      top: convertPx(270, width),
      padding: 22,
      flexDirection: 'row',
      alignItems: 'center'
    },
    scoreSummaryItem: {
      width: 62,
      height: convertPx(52, width),
      marginRight: 27
    },
    scoreHeader: {
      position: 'relative',
      width: 62,
      height: convertPx(26, width),
    },
    scoreBg: {
      position: 'absolute',
      top: 0,
      left: 15,
      width: 51,
      height: 25
    },
    comptAvatar: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 25,
      height: 25,
      borderRadius: 13
    },
    scoreInnerWrapper: {
      position: 'absolute',
      left: 16,
      top: 0,
      width: 51,
      height: 25,
      paddingTop: 2
    },
    scoreWrapper: {
      width: 51,
      height: 14,
      fontSize: 12,
      lineHeight: '1em',
      color: '#fff',
      textAlign: 'cemter'
    },
    hcp: {
      width: 51,
      height: 12,
      fontSize: 8,
      lineHeight: '1em',
      color: 'rgba(255, 255, 255, 0.5)',
      textAlign: 'cemter'
    },
    scoreBottom: {
      width: 62,
      height: 14,
      fontSize: 10,
      lineHeight: '1.4em',
      color: 'rgba(255, 255, 255, 0.5)'
    },
    // 分享图
    shareWrapper: {
      position: 'absolute',
      width: 180,
      height: 67,
      right: 30,
      top: convertPx(260, width),
    },
    shareLeftWrap: {
      position: 'absolute',
      width: 96,
      height: 40,
      top: 14,
      left: 0
    },
    shareScan: {
      width: 96,
      height: 23,
      fontSize: 16,
      color: '#fff'
    },
    pointer: {
      position: 'absolute',
      top: 20,
      left: 100,
      width: 7,
      height: 10
    },
    shareTip: {
      width: 96,
      height: 14,
      fontSize: 10,
      textAlign: 'right',
      color: 'rgba(255, 255, 255, 0.6)'
    },
    shareQrcode: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 67,
      height: 67,
      borderRadius: 34
    }, 
    // 计分板
    scoreboardWrap: {
      width: width,
      height: BOARD_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center'
    },
    boardBg: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: width,
      height: BOARD_HEIGHT
    },
    subColor: {
      color: SUB_COLOR
    },
    leftBorder: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 2,
      height: BOARD_HEIGHT,
      backgroundColor: SUB_COLOR
    },
    tableLeft: {
      position: 'absolute',
      width: A_CELL_WIDTH,
      height: BOARD_HEIGHT,
      left: 0,
      top: 0
    },
    leftThCell: {
      width: A_CELL_WIDTH,
      height: TH_CELL_HEIGHT,
      fontSize: 10,
      textAlign: 'left',
      padding: 10
    },
    thHole: {
      width: A_CELL_WIDTH,
      height: convertPx(13, width),
      lineHeight: '1em',
      color: SUB_COLOR,
      fontSize: 10
    },
    thPar: {
      width: A_CELL_WIDTH,
      height: convertPx(10, width),
      lineHeight: '1em',
      color: 'rgba(255, 255, 255, 0.5)'
    },
    leftTdCell: {
      position: 'relative',
      width: A_CELL_WIDTH,
      height: CELL_HEIGHT,
      padding: 10
    },
    even: {
      backgroundColor: 'rgba(249, 249, 249, 0.1)'
    },
    tdAvatar: {
      width: convertPx(18, width),
      height: convertPx(18, width),
      borderRadius: 9
    },
    tdName: {
      width: A_CELL_WIDTH,
      lineHeight: '1.5em',
      fontSize: 10,
      color: '#fff'
    },
    teeWrapper: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: 2,
      height: A_CELL_WIDTH,
      backgroundColor: 'transparent'
    },
    // [{1:"#FF7777"},{2:"#FFFFFF"},{3:"#41A2FF"},{4"#CABD8E"},{5:"#000000"}]
    teeColor1: {
      backgroundColor: "#FF7777"
    },
    teeColor2: {
      backgroundColor: "#FFFFFF"
    },
    teeColor3: {
      backgroundColor: "#41A2FF"
    },
    teeColor4: {
      backgroundColor: "#CABD8E"
    },
    teeColor5: {
      backgroundColor: "#000000"
    },
    tableRightWrapper: {
      position: 'absolute',
      top: 0,
      left: A_CELL_WIDTH,
      width: width - A_CELL_WIDTH,
      height: BOARD_HEIGHT
    },
    rightThWrapper: {
      width: width - A_CELL_WIDTH,
      height: TH_CELL_HEIGHT,
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    rightThCell: {
      width: C_CELL_WIDTH,
      height: TH_CELL_HEIGHT,
      paddingTop: 8,
      textAlign: 'center'
    },
    rightCellBg: {
      backgroundColor: 'rgba(149, 209, 113 ,0.2)'
    },
    diffCellBg: {
      backgroundColor: 'rgba(149, 209, 113 ,0.4)'
    },
    thNo: {
      width: C_CELL_WIDTH,
      height: convertPx(13, width),
      lineHeight: '1em',
      color: SUB_COLOR,
      fontSize: 10,
      textAlign: 'center'
    },
    thNoHalf: {
      color: 'rgba(255, 255, 255, 0.5)'
    },
    thScore: {
      width: C_CELL_WIDTH,
      lineHeight: '1em',
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.5)',
      fontFamily: 'Rubik-Med-ASCII'
    },
    halfWrapper: {
      width: (width - A_CELL_WIDTH - 2 * C_CELL_WIDTH)/2,
      height: CELL_HEIGHT,
      flexDirection: 'row'
    },
    rightTrCell: {
      width: width - A_CELL_WIDTH,
      height: CELL_HEIGHT,
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    rightTdCell: {
      width: C_CELL_WIDTH,
      height: CELL_HEIGHT,
      textAlign: 'center',
      fontFamily: 'Rubik-Med-ASCII'
    },
    tdCellInner: {
      position: 'relative'
    },
    cellImage: {
      position: 'absolute'
    },
    cellImageLg: {
      width: convertPx(27, width),
      height: convertPx(27, width),
      top: (CELL_HEIGHT - convertPx(27, width))/2,
      left: (C_CELL_WIDTH - convertPx(27, width))/2
    },
    cellImageSm: {
      width: convertPx(23, width),
      height: convertPx(23, width),
      top: (CELL_HEIGHT - convertPx(23, width))/2,
      left: (C_CELL_WIDTH - convertPx(23, width))/2
    },
    tdDiff: {
      width: C_CELL_WIDTH,
      color: SUB_COLOR,
      fontSize: 16,
      lineHeight: CELL_HEIGHT/16 + 'em',
      textAlign: 'center'
    },
    tdScore: {
      color: '#fff',
      fontSize: 16,
      lineHeight: CELL_HEIGHT/16 + 'em',
      textAlign: 'center'
    }
  }
}

export default {
  genWxml,
  genWeatherWxml,
  genBoardWxml,
  genSummaryWxml,
  genQrcodeWxml,
  genStyle
}
