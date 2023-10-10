const genWxml = function(competitionInfo, multiGroup, rankListWxml, shareQrcodeWxml) {
  return `<view class="long-image-wrapper">
      <!-- S 标题 -->
      <image class="title-bg" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/whole_rank/title-bg.png"></image>
      <image class="logo-bg" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/whole_rank/logo-bg.png"></image>
      <image class="table-title-bg" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/whole_rank/table-title.png"></image>
      <text class="competition-name">${competitionInfo.competition_name || ''}</text>
      <text class="competition-course">${competitionInfo.course_name || ''}</text>
      <!-- E 标题 -->

      <!-- S 列表 -->
      <view class="table-wrapper">
        <view class="table-header sub-color flex">
          <text class="table-header table-header-rank tc">POS</text>
          <text class="table-header table-header-name flex1">PLAYER</text>
          ${multiGroup ? '<text class="table-header table-header-group tc">GROUP</text>' : ''}
          <text class="table-header table-header-total tc">TOTAL</text>
          <text class="table-header table-header-part tc">PAR${competitionInfo.total_score}</text>
        </view>
        <!-- /表头 -->

        <view class="table-body">
        ${rankListWxml}
        </view>
      </view>
      <!-- E 列表 -->
      
      <!-- S 底部分享信息 -->
      <view class="share-bottom-wrapper">
        <image class="room-info" src="https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/score_share/room-no-wrapper.png"></image>
        <text class="room-no">${competitionInfo.competition_no}</text>
        ${shareQrcodeWxml}
      </view>
    </view>`
}

const genRankListWxml = function(rankList, ossUrl, multiGroup) {
  let rankListWxml = ''
  rankList.forEach((item, index) => {
    rankListWxml += `<view class="flex list-cell-wrapper ${index%2 ? '' : 'even'}">
      <view class="table-header-rank tc list-cell list-cell-rank rubik ${item.ranking_num === 1 ? 'op-100' : item.ranking_num !== 1 && item.ranking_num < 4 ? 'op-5' : 'op-3'}">
        <text>${ rankList.length > 1 && index > 0 ? (rankList[index - 1].ranking_num === item.ranking_num && item.ranking_num !== 'WD' ? '' : item.ranking_num) : item.ranking_num}</text>
      </view>
      <view class="flex flex1 list-cell list-cell-info mr-8">
        <image class="g-avatar" src="${item.avatar_url}"></image>
        <view class="tee tee-color${item.tee}"></view>
        <view class="gender-box">
          <image class="icon-gender" src="${ossUrl}/icons/${ item.gender == 1 ? 'icon-male' : 'icon-female'}.png"/>
        </view>
        <text class="competitor-name">${item.username}</text>
      </view>
      ${multiGroup ? '<text class="list-cell list-cell-group table-header-group">' + item.group + '组</text>' : ''}
      <text class="list-cell list-cell-total table-header-total tc rubik sub-color  ${item.score_sum < 0 ? 'col-41A2FF' : ''}">${item.score_sum > 0 ? '+'+item.score_sum : item.score_sum}</text>
      <text class="list-cell list-cell-part table-header-part tc rubik ${item.complete_hold_num === item.hold_num ? 'complete-num' : ''}">
        ${item.complete_hold_num === item.hold_num ? item.par_sum : item.complete_hold_num}</text>
    </view>`
  })
  return rankListWxml
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

const convertPx = function(px, screenWidth) {
  return screenWidth * px / 750
}

const genStyle = function(screenWidth, screenHeight, competitorNums) {
  // 顶部208、底部149
  let contentHeight = convertPx(88, screenWidth) * competitorNums + convertPx(387, screenWidth)
  let imageHeight = contentHeight > screenHeight ? contentHeight : screenHeight
  
  return {
    imageHeight: imageHeight,
    op100: {
      color: '#fff'
    },
    op5: {
      color: 'rgba(255, 255, 255, 0.5)'
    },
    op3: {
      color: 'rgba(255, 255, 255, 0.3)'
    },
    subColor: {
      color: '#95D171'
    },
    rubik: {
      fontFamily: 'Rubik-Med-ASCII'
    },
    flex: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: ""
    },
    flex1: {
      flex: 1
    },
    tc: {
      textAlign: 'center'
    },
    longImageWrapper: {
      width: screenWidth,
      height: imageHeight,
      position: 'relative'
    },
    titleBg: {
      position: 'absolute',
      width: screenWidth,
      height: convertPx(127, screenWidth),
      top: 0,
      left: 0
    },
    logoBg: {
      position: 'absolute',
      width: screenWidth,
      height: convertPx(69, screenWidth),
      top: convertPx(112, screenWidth),
      left: 0
    },
    tableTitleBg: {
      position: 'absolute',
      width: screenWidth,
      height: convertPx(60, screenWidth),
      top: convertPx(181, screenWidth),
      left: 0
    },
    competitionName: {
      fontSize: 16,
      color: '#fff',
      position: 'absolute',
      width: screenWidth,
      textAlign: 'center',
      top: convertPx(80, screenWidth),
      left: 0
    },
    competitionCourse: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.6)',
      position: 'absolute',
      width: screenWidth,
      textAlign: 'center',
      top: convertPx(139, screenWidth),
      left: 0
    },
    tableWrapper: {
      width: screenWidth,
      height: convertPx(91 * competitorNums + 60, screenWidth),
      position: 'absolute',
      left: 0,
      top: convertPx(181, screenWidth)
    },
    tableHeader: {
      height: convertPx(60, screenWidth),
      fontSize: 10,
      lineHeight: convertPx(60, screenWidth)/10 + 'em'
    },
    tableHeaderRank: {
      width: convertPx(100, screenWidth)
    },
    tableHeaderGroup: {
      width: convertPx(124, screenWidth)
    },
    tableHeaderTotal: {
      width: convertPx(124, screenWidth)
    },
    tableHeaderPart: {
      width: convertPx(148, screenWidth)
    },
    tableBody: {
      width: screenWidth,
      height: imageHeight - convertPx(357, screenWidth),
      backgroundColor: '#284743'
    },
    listCellWrapper: {
      width: screenWidth,
      height: convertPx(88, screenWidth),
      alignItems: 'center',
      fontSize: 16,
      textAlign: 'center',
      color: '#fff'
    },
    even: {
      backgroundColor: 'rgba(255, 255, 255, 0.02)'
    },
    listCell: {
      height: convertPx(88, screenWidth),
      lineHeight: convertPx(88, screenWidth)/16 + 'em'
    },    
    listCellGroup: {
      fontSize: 10,
      lineHeight: convertPx(88, screenWidth)/10 + 'em'
    },
    listCellTotal: {
      backgroundColor: 'rgba(126, 180, 104, 0.2)'
    },
    gAvatar: {
      width: convertPx(50, screenWidth),
      height: convertPx(50, screenWidth),
      borderRadius: convertPx(25, screenWidth),
      marginRight: convertPx(15, screenWidth),
      marginLeft: convertPx(4, screenWidth)
    },
    tee: {
      height: convertPx(16, screenWidth),
      width: convertPx(4, screenWidth),
      marginRight: convertPx(4, screenWidth),
    },
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
    competitorName: {
      fontSize: 12,
      color: '#fff',
      height: convertPx(88, screenWidth),
      lineHeight: convertPx(88, screenWidth)/12 + 'em'
      // width: 100
    },
    genderBox: {
      width: convertPx(20, screenWidth),
      height: convertPx(20, screenWidth),
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: convertPx(10, screenWidth),
      marginLeft: convertPx(4, screenWidth),
      textAlign: 'center',
      boxSizing: 'border-box',
      padding: convertPx(4, screenWidth)
    },
    iconGender: {
      width: convertPx(12, screenWidth),
      height: convertPx(12, screenWidth)
    },
    completeNum: {
      color: '#FFFA79'
    },
    // 底部分享区域
    shareBottomWrapper: {
      width: screenWidth,
      height: convertPx(149, screenWidth),
      position: 'absolute',
      left: 0,
      top: imageHeight - convertPx(149, screenWidth),
      backgroundColor: '#1A2828'
    },
    roomInfo: {
      width: convertPx(287, screenWidth),
      height: convertPx(56, screenWidth),
      position: 'absolute',
      left: convertPx(24, screenWidth),
      top: convertPx(47, screenWidth)
    },
    roomNo: {
      fontSize: 10,
      color: '#fff',
      position: 'absolute',
      left: convertPx(114, screenWidth),
      top: convertPx(62, screenWidth)
    },
    // 分享图
    shareWrapper: {
      position: 'absolute',
      width: convertPx(360, screenWidth),
      height: convertPx(134, screenWidth),
      right: convertPx(24, screenWidth),
      top: convertPx(-10, screenWidth)
    },
    shareLeftWrap: {
      position: 'absolute',
      width: convertPx(192, screenWidth),
      height: convertPx(80, screenWidth),
      top: convertPx(35, screenWidth),
      left: 0
    },
    shareScan: {
      width: convertPx(192, screenWidth),
      height: convertPx(46, screenWidth),
      fontSize: 16,
      color: '#fff'
    },
    pointer: {
      position: 'absolute',
      top: convertPx(49, screenWidth),
      left: convertPx(200, screenWidth),
      width: convertPx(14, screenWidth),
      height: convertPx(20, screenWidth)
    },
    shareTip: {
      width: convertPx(192, screenWidth),
      height: convertPx(28, screenWidth),
      fontSize: 10,
      textAlign: 'right',
      color: 'rgba(255, 255, 255, 0.6)'
    },
    shareQrcode: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: convertPx(125, screenWidth),
      height: convertPx(125, screenWidth),
      borderRadius: convertPx(63, screenWidth)
    },
    col41A2FF: {
      color: '#41A2FF',
    },
  }
}

export default {
  genWxml,
  genRankListWxml,
  genQrcodeWxml,
  genStyle
}
