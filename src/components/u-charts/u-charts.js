/*
 * uCharts (R)
 * 高性能跨平台图表库，支持H5、APP、小程序（微信/支付宝/百度/头条/QQ/360/快手）、Vue、Taro等支持canvas的框架平台
 * Copyright (C) 2018-2022 QIUN (R) 秋云 https://www.ucharts.cn All rights reserved.
 * Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
 * 复制使用请保留本段注释，感谢支持开源！
 * 
 * uCharts (R) 官方网站
 * https://www.uCharts.cn
 * 
 * 开源地址:
 * https://gitee.com/uCharts/uCharts
 * 
 * uni-app插件市场地址：
 * http://ext.dcloud.net.cn/plugin?id=271
 * 
 */

'use strict';

var config = {
  version: 'v2.5.0-20230101',
  yAxisWidth: 15,
  xAxisHeight: 22,
  padding: [10, 10, 10, 10],
  rotate: false,
  fontSize: 13,
  fontColor: '#666666',
  dataPointShape: ['circle', 'circle', 'circle', 'circle'],
  color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'],
  linearColor: ['#0EE2F8', '#2BDCA8', '#FA7D8D', '#EB88E2', '#2AE3A0', '#0EE2F8', '#EB88E2', '#6773E3', '#F78A85'],
  titleFontSize: 20,
  subtitleFontSize: 15,
};

var assign = function(target, ...varArgs) {
  if (target == null) {
    throw new TypeError('[uCharts] Cannot convert undefined or null to object');
  }
  if (!varArgs || varArgs.length <= 0) {
    return target;
  }
  // 深度合并对象
  function deepAssign(obj1, obj2) {
    for (let key in obj2) {
      obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
        deepAssign(obj1[key], obj2[key]) : obj1[key] = obj2[key];
    }
    return obj1;
  }
  varArgs.forEach(val => {
    target = deepAssign(target, val);
  });
  return target;
};

var util = {
  toFixed: function toFixed(num, limit) {
    limit = limit || 2;
    if (this.isFloat(num)) {
      num = num.toFixed(limit);
    }
    return num;
  },
  isFloat: function isFloat(num) {
    return num % 1 !== 0;
  },
  approximatelyEqual: function approximatelyEqual(num1, num2) {
    return Math.abs(num1 - num2) < 1e-10;
  },
  isSameSign: function isSameSign(num1, num2) {
    return Math.abs(num1) === num1 && Math.abs(num2) === num2 || Math.abs(num1) !== num1 && Math.abs(num2) !== num2;
  },
  isSameXCoordinateArea: function isSameXCoordinateArea(p1, p2) {
    return this.isSameSign(p1.x, p2.x);
  },
  isCollision: function isCollision(obj1, obj2) {
    obj1.end = {};
    obj1.end.x = obj1.start.x + obj1.width;
    obj1.end.y = obj1.start.y - obj1.height;
    obj2.end = {};
    obj2.end.x = obj2.start.x + obj2.width;
    obj2.end.y = obj2.start.y - obj2.height;
    var flag = obj2.start.x > obj1.end.x || obj2.end.x < obj1.start.x || obj2.end.y > obj1.start.y || obj2.start.y < obj1.end.y;
    return !flag;
  }
};

//兼容H5点击事件
function getH5Offset(e) {
  e.mp = {
    changedTouches: []
  };
  e.mp.changedTouches.push({
    x: e.offsetX,
    y: e.offsetY
  });
  return e;
}

// hex 转 rgba
function hexToRgb(hexValue, opc) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + opc + ')';
}

function findRange(num, type, limit) {
  if (isNaN(num)) {
    throw new Error('[uCharts] series数据需为Number格式');
  }
  limit = limit || 10;
  type = type ? type : 'upper';
  var multiple = 1;
  while (limit < 1) {
    limit *= 10;
    multiple *= 10;
  }
  if (type === 'upper') {
    num = Math.ceil(num * multiple);
  } else {
    num = Math.floor(num * multiple);
  }
  while (num % limit !== 0) {
    if (type === 'upper') {
      if (num == num + 1) { //修复数据值过大num++无效的bug by 向日葵 @xrk_jy
        break;
      }
      num++;
    } else {
      num--;
    }
  }
  return num / multiple;
}


function calValidDistance(self, distance, chartData, config, opts) {
  var dataChartAreaWidth = opts.width - opts.area[1] - opts.area[3];
  var dataChartWidth = chartData.eachSpacing * (opts.chartData.xAxisData.xAxisPoints.length - 1);
  if(opts.type == 'mount' && opts.extra && opts.extra.mount && opts.extra.mount.widthRatio && opts.extra.mount.widthRatio > 1){
    if(opts.extra.mount.widthRatio>2) opts.extra.mount.widthRatio = 2
    dataChartWidth += (opts.extra.mount.widthRatio - 1)*chartData.eachSpacing;
  }
  var validDistance = distance;
  if (distance >= 0) {
    validDistance = 0;
    self.uevent.trigger('scrollLeft');
    self.scrollOption.position = 'left'
    opts.xAxis.scrollPosition = 'left';
  } else if (Math.abs(distance) >= dataChartWidth - dataChartAreaWidth) {
    validDistance = dataChartAreaWidth - dataChartWidth;
    self.uevent.trigger('scrollRight');
    self.scrollOption.position = 'right'
    opts.xAxis.scrollPosition = 'right';
  } else {
    self.scrollOption.position = distance
    opts.xAxis.scrollPosition = distance;
  }
  return validDistance;
}


function createCurveControlPoints(points, i) {
  function isNotMiddlePoint(points, i) {
    if (points[i - 1] && points[i + 1]) {
      return points[i].y >= Math.max(points[i - 1].y, points[i + 1].y) || points[i].y <= Math.min(points[i - 1].y,
        points[i + 1].y);
    } else {
      return false;
    }
  }
  function isNotMiddlePointX(points, i) {
    if (points[i - 1] && points[i + 1]) {
      return points[i].x >= Math.max(points[i - 1].x, points[i + 1].x) || points[i].x <= Math.min(points[i - 1].x,
        points[i + 1].x);
    } else {
      return false;
    }
  }
  var a = 0.2;
  var b = 0.2;
  var pAx = null;
  var pAy = null;
  var pBx = null;
  var pBy = null;
  if (i < 1) {
    pAx = points[0].x + (points[1].x - points[0].x) * a;
    pAy = points[0].y + (points[1].y - points[0].y) * a;
  } else {
    pAx = points[i].x + (points[i + 1].x - points[i - 1].x) * a;
    pAy = points[i].y + (points[i + 1].y - points[i - 1].y) * a;
  }

  if (i > points.length - 3) {
    var last = points.length - 1;
    pBx = points[last].x - (points[last].x - points[last - 1].x) * b;
    pBy = points[last].y - (points[last].y - points[last - 1].y) * b;
  } else {
    pBx = points[i + 1].x - (points[i + 2].x - points[i].x) * b;
    pBy = points[i + 1].y - (points[i + 2].y - points[i].y) * b;
  }
  if (isNotMiddlePoint(points, i + 1)) {
    pBy = points[i + 1].y;
  }
  if (isNotMiddlePoint(points, i)) {
    pAy = points[i].y;
  }
  if (isNotMiddlePointX(points, i + 1)) {
    pBx = points[i + 1].x;
  }
  if (isNotMiddlePointX(points, i)) {
    pAx = points[i].x;
  }
  if (pAy >= Math.max(points[i].y, points[i + 1].y) || pAy <= Math.min(points[i].y, points[i + 1].y)) {
    pAy = points[i].y;
  }
  if (pBy >= Math.max(points[i].y, points[i + 1].y) || pBy <= Math.min(points[i].y, points[i + 1].y)) {
    pBy = points[i + 1].y;
  }
  if (pAx >= Math.max(points[i].x, points[i + 1].x) || pAx <= Math.min(points[i].x, points[i + 1].x)) {
    pAx = points[i].x;
  }
  if (pBx >= Math.max(points[i].x, points[i + 1].x) || pBx <= Math.min(points[i].x, points[i + 1].x)) {
    pBx = points[i + 1].x;
  }
  return {
    ctrA: {
      x: pAx,
      y: pAy
    },
    ctrB: {
      x: pBx,
      y: pBy
    }
  };
}


function convertCoordinateOrigin(x, y, center) {
  return {
    x: center.x + x,
    y: center.y - y
  };
}


function fixPieSeries(series, opts, config){
  let pieSeriesArr = [];
  if(series.length>0 && series[0].data.constructor.toString().indexOf('Array') > -1){
    opts._pieSeries_ = series;
    let oldseries = series[0].data;
    for (var i = 0; i < oldseries.length; i++) {
      oldseries[i].formatter = series[0].formatter;
      oldseries[i].data = oldseries[i].value;
      pieSeriesArr.push(oldseries[i]);
    }
    opts.series = pieSeriesArr;
  }else{
    pieSeriesArr = series;
  }
  return pieSeriesArr;
}

function fillSeries(series, opts, config) {
  var index = 0;
  for (var i = 0; i < series.length; i++) {
    let item = series[i];
    if (!item.color) {
      item.color = config.color[index];
      index = (index + 1) % config.color.length;
    }
    if (!item.linearIndex) {
      item.linearIndex = i;
    }
    if (!item.index) {
      item.index = 0;
    }
    if (!item.type) {
      item.type = opts.type;
    }
    if (typeof item.show == "undefined") {
      item.show = true;
    }
    if (!item.type) {
      item.type = opts.type;
    }
    if (!item.pointShape) {
      item.pointShape = "circle";
    }
    if (!item.legendShape) {
      switch (item.type) {
        case 'line':
          item.legendShape = "line";
          break;
        case 'column':
        case 'bar':
          item.legendShape = "rect";
          break;
        case 'area':
        case 'mount':
          item.legendShape = "triangle";
          break;
        default:
          item.legendShape = "circle";
      }
    }
  }
  return series;
}

function fillCustomColor(linearType, customColor, series, config) {
  var newcolor = customColor || [];
  if (linearType == 'custom' && newcolor.length == 0 ) {
    newcolor = config.linearColor;
  }
  if (linearType == 'custom' && newcolor.length < series.length) {
    let chazhi = series.length - newcolor.length;
    for (var i = 0; i < chazhi; i++) {
      newcolor.push(config.linearColor[(i + 1) % config.linearColor.length]);
    }
  }
  return newcolor;
}

function getDataRange(minData, maxData) {
  var limit = 0;
  var range = maxData - minData;
  if (range >= 10000) {
    limit = 1000;
  } else if (range >= 1000) {
    limit = 100;
  } else if (range >= 100) {
    limit = 10;
  } else if (range >= 10) {
    limit = 5;
  } else if (range >= 1) {
    limit = 1;
  } else if (range >= 0.1) {
    limit = 0.1;
  } else if (range >= 0.01) {
    limit = 0.01;
  } else if (range >= 0.001) {
    limit = 0.001;
  } else if (range >= 0.0001) {
    limit = 0.0001;
  } else if (range >= 0.00001) {
    limit = 0.00001;
  } else {
    limit = 0.000001;
  }
  return {
    minRange: findRange(minData, 'lower', limit),
    maxRange: findRange(maxData, 'upper', limit)
  };
}

function measureText(text, fontSize, context) {
  var width = 0;
  text = String(text);
  // #ifdef MP-ALIPAY || MP-BAIDU || APP-NVUE
  context = false;
  // #endif
  if (context !== false && context !== undefined && context.setFontSize && context.measureText) {
    context.setFontSize(fontSize);
    return context.measureText(text).width;
  } else {
    var text = text.split('');
    for (let i = 0; i < text.length; i++) {
      let item = text[i];
      if (/[a-zA-Z]/.test(item)) {
        width += 7;
      } else if (/[0-9]/.test(item)) {
        width += 5.5;
      } else if (/\./.test(item)) {
        width += 2.7;
      } else if (/-/.test(item)) {
        width += 3.25;
      } else if (/:/.test(item)) {
        width += 2.5;
      } else if (/[\u4e00-\u9fa5]/.test(item)) {
        width += 10;
      } else if (/\(|\)/.test(item)) {
        width += 3.73;
      } else if (/\s/.test(item)) {
        width += 2.5;
      } else if (/%/.test(item)) {
        width += 8;
      } else {
        width += 10;
      }
    }
    return width * fontSize / 10;
  }
}

function dataCombine(series) {
  return series.reduce(function(a, b) {
    return (a.data ? a.data : a).concat(b.data);
  }, []);
}

function dataCombineStack(series, len) {
  var sum = new Array(len);
  for (var j = 0; j < sum.length; j++) {
    sum[j] = 0;
  }
  for (var i = 0; i < series.length; i++) {
    for (var j = 0; j < sum.length; j++) {
      sum[j] += series[i].data[j];
    }
  }
  return series.reduce(function(a, b) {
    return (a.data ? a.data : a).concat(b.data).concat(sum);
  }, []);
}

function getTouches(touches, opts, e) {
  let x, y;
  if (touches.clientX) {
    if (opts.rotate) {
      y = opts.height - touches.clientX * opts.pix;
      x = (touches.pageY - e.currentTarget.offsetTop - (opts.height / opts.pix / 2) * (opts.pix - 1)) * opts.pix;
    } else {
      x = touches.clientX * opts.pix;
      y = (touches.pageY - e.currentTarget.offsetTop - (opts.height / opts.pix / 2) * (opts.pix - 1)) * opts.pix;
    }
  } else {
    if (opts.rotate) {
      y = opts.height - touches.x * opts.pix;
      x = touches.y * opts.pix;
    } else {
      x = touches.x * opts.pix;
      y = touches.y * opts.pix;
    }
  }
  return {
    x: x,
    y: y
  }
}

function getSeriesDataItem(series, index, group) {
  var data = [];
  var newSeries = [];
  var indexIsArr = index.constructor.toString().indexOf('Array') > -1;
  if(indexIsArr){
    let tempSeries = filterSeries(series);
    for (var i = 0; i < group.length; i++) {
      newSeries.push(tempSeries[group[i]]);
    }
  }else{
    newSeries = series;
  };
  for (let i = 0; i < newSeries.length; i++) {
    let item = newSeries[i];
    let tmpindex = -1;
    if(indexIsArr){
      tmpindex = index[i];
    }else{
      tmpindex = index;
    }
    if (item.data[tmpindex] !== null && typeof item.data[tmpindex] !== 'undefined' && item.show) {
      let seriesItem = {};
      seriesItem.color = item.color;
      seriesItem.type = item.type;
      seriesItem.style = item.style;
      seriesItem.pointShape = item.pointShape;
      seriesItem.disableLegend = item.disableLegend;
      seriesItem.legendShape = item.legendShape;
      seriesItem.name = item.name;
      seriesItem.show = item.show;
      seriesItem.data = item.formatter ? item.formatter(item.data[tmpindex]) : item.data[tmpindex];
      data.push(seriesItem);
    }
  }
  return data;
}



function getToolTipData(seriesData, opts, index, group, categories) {
  var option = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var calPoints = opts.chartData.calPoints?opts.chartData.calPoints:[];
  let points = {};
  if(group.length > 0){
    let filterPoints = [];
    for (let i = 0; i < group.length; i++) {
      filterPoints.push(calPoints[group[i]])
    }
    points = filterPoints[0][index[0]];
  }else{
    for (let i = 0; i < calPoints.length; i++) {
      if(calPoints[i][index]){
        points = calPoints[i][index];
        break;
      }
    }
  };
  var textList = seriesData.map(function(item) {
    let titleText = null;
    if (opts.categories && opts.categories.length>0) {
      titleText = categories[index];
    };
    return {
      text: option.formatter ? option.formatter(item, titleText, index, opts) : item.name + ': ' + item.data,
      color: item.color,
      legendShape: opts.extra.tooltip.legendShape == 'auto'? item.legendShape : opts.extra.tooltip.legendShape
    };
  });
  var offset = {
    x: Math.round(points.x),
    y: Math.round(points.y)
  };
  return {
    textList: textList,
    offset: offset
  };
}



function filterSeries(series) {
  let tempSeries = [];
  for (let i = 0; i < series.length; i++) {
    if (series[i].show == true) {
      tempSeries.push(series[i])
    }
  }
  return tempSeries;
}

function findCurrentIndex(currentPoints, calPoints, opts, config) {
  var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var current={ index:-1, group:[] };
  var spacing = opts.chartData.eachSpacing / 2;
  let xAxisPoints = [];
  if (calPoints && calPoints.length > 0) {
    if (!opts.categories) {
      spacing = 0;
    }else{
      for (let i = 1; i < opts.chartData.xAxisPoints.length; i++) {
        xAxisPoints.push(opts.chartData.xAxisPoints[i] - spacing);
      }
      if ((opts.type == 'line' || opts.type == 'area') && opts.xAxis.boundaryGap == 'justify') {
        xAxisPoints = opts.chartData.xAxisPoints;
      }
    }
    if (isInExactChartArea(currentPoints, opts, config)) {
      if (!opts.categories) {
        let timePoints = Array(calPoints.length);
        for (let i = 0; i < calPoints.length; i++) {
          timePoints[i] = Array(calPoints[i].length)
          for (let j = 0; j < calPoints[i].length; j++) {
            timePoints[i][j] = (Math.abs(calPoints[i][j].x - currentPoints.x));
          }
        };
        let pointValue =  Array(timePoints.length);
        let pointIndex =  Array(timePoints.length);
        for (let i = 0; i < timePoints.length; i++) {
          pointValue[i] = Math.min.apply(null, timePoints[i]);
          pointIndex[i] = timePoints[i].indexOf(pointValue[i]);
        }
        let minValue = Math.min.apply(null, pointValue);
        current.index = [];
        for (let i = 0; i < pointValue.length; i++) {
          if(pointValue[i] == minValue){
            current.group.push(i);
            current.index.push(pointIndex[i]);
          }
        };
      }else{
        xAxisPoints.forEach(function(item, index) {
          if (currentPoints.x + offset + spacing > item) {
            current.index = index;
          }
        });
      }
    }
  }
  return current;
}


function findLegendIndex(currentPoints, legendData, opts) {
  let currentIndex = -1;
  let gap = 0;
  if (isInExactLegendArea(currentPoints, legendData.area)) {
    let points = legendData.points;
    let index = -1;
    for (let i = 0, len = points.length; i < len; i++) {
      let item = points[i];
      for (let j = 0; j < item.length; j++) {
        index += 1;
        let area = item[j]['area'];
        if (area && currentPoints.x > area[0] - gap && currentPoints.x < area[2] + gap && currentPoints.y > area[1] - gap && currentPoints.y < area[3] + gap) {
          currentIndex = index;
          break;
        }
      }
    }
    return currentIndex;
  }
  return currentIndex;
}

function isInExactLegendArea(currentPoints, area) {
  return currentPoints.x > area.start.x && currentPoints.x < area.end.x && currentPoints.y > area.start.y && currentPoints.y < area.end.y;
}

function isInExactChartArea(currentPoints, opts, config) {
  return currentPoints.x <= opts.width - opts.area[1] + 10 && currentPoints.x >= opts.area[3] - 10 && currentPoints.y >= opts.area[0] && currentPoints.y <= opts.height - opts.area[2];
}









function splitPoints(points,eachSeries) {
  var newPoints = [];
  var items = [];
  points.forEach(function(item, index) {
    if(eachSeries.connectNulls){
      if (item !== null) {
        items.push(item);
      }
    }else{
      if (item !== null) {
        items.push(item);
      } else {
        if (items.length) {
          newPoints.push(items);
        }
        items = [];
      }
    }
    
  });
  if (items.length) {
    newPoints.push(items);
  }
  return newPoints;
}


function calLegendData(series, opts, config, chartData, context) {
  let legendData = {
    area: {
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      },
      width: 0,
      height: 0,
      wholeWidth: 0,
      wholeHeight: 0
    },
    points: [],
    widthArr: [],
    heightArr: []
  };
  if (opts.legend.show === false) {
    chartData.legendData = legendData;
    return legendData;
  }
  let padding = opts.legend.padding * opts.pix;
  let margin = opts.legend.margin * opts.pix;
  let fontSize = opts.legend.fontSize ? opts.legend.fontSize * opts.pix : config.fontSize;
  let shapeWidth = 15 * opts.pix;
  let shapeRight = 5 * opts.pix;
  let lineHeight = Math.max(opts.legend.lineHeight * opts.pix, fontSize);
  if (opts.legend.position == 'top' || opts.legend.position == 'bottom') {
    let legendList = [];
    let widthCount = 0;
    let widthCountArr = [];
    let currentRow = [];
    for (let i = 0; i < series.length; i++) {
      let item = series[i];
      const legendText = item.legendText ? item.legendText : item.name;
      let itemWidth = shapeWidth + shapeRight + measureText(legendText || 'undefined', fontSize, context) + opts.legend.itemGap * opts.pix;
      if (widthCount + itemWidth > opts.width - opts.area[1] - opts.area[3]) {
        legendList.push(currentRow);
        widthCountArr.push(widthCount - opts.legend.itemGap * opts.pix);
        widthCount = itemWidth;
        currentRow = [item];
      } else {
        widthCount += itemWidth;
        currentRow.push(item);
      }
    }
    if (currentRow.length) {
      legendList.push(currentRow);
      widthCountArr.push(widthCount - opts.legend.itemGap * opts.pix);
      legendData.widthArr = widthCountArr;
      let legendWidth = Math.max.apply(null, widthCountArr);
      switch (opts.legend.float) {
        case 'left':
          legendData.area.start.x = opts.area[3];
          legendData.area.end.x = opts.area[3] + legendWidth + 2 * padding;
          break;
        case 'right':
          legendData.area.start.x = opts.width - opts.area[1] - legendWidth - 2 * padding;
          legendData.area.end.x = opts.width - opts.area[1];
          break;
        default:
          legendData.area.start.x = (opts.width - legendWidth) / 2 - padding;
          legendData.area.end.x = (opts.width + legendWidth) / 2 + padding;
      }
      legendData.area.width = legendWidth + 2 * padding;
      legendData.area.wholeWidth = legendWidth + 2 * padding;
      legendData.area.height = legendList.length * lineHeight + 2 * padding;
      legendData.area.wholeHeight = legendList.length * lineHeight + 2 * padding + 2 * margin;
      legendData.points = legendList;
    }
  } else {
    let len = series.length;
    let maxHeight = opts.height - opts.area[0] - opts.area[2] - 2 * margin - 2 * padding;
    let maxLength = Math.min(Math.floor(maxHeight / lineHeight), len);
    legendData.area.height = maxLength * lineHeight + padding * 2;
    legendData.area.wholeHeight = maxLength * lineHeight + padding * 2;
    switch (opts.legend.float) {
      case 'top':
        legendData.area.start.y = opts.area[0] + margin;
        legendData.area.end.y = opts.area[0] + margin + legendData.area.height;
        break;
      case 'bottom':
        legendData.area.start.y = opts.height - opts.area[2] - margin - legendData.area.height;
        legendData.area.end.y = opts.height - opts.area[2] - margin;
        break;
      default:
        legendData.area.start.y = (opts.height - legendData.area.height) / 2;
        legendData.area.end.y = (opts.height + legendData.area.height) / 2;
    }
    let lineNum = len % maxLength === 0 ? len / maxLength : Math.floor((len / maxLength) + 1);
    let currentRow = [];
    for (let i = 0; i < lineNum; i++) {
      let temp = series.slice(i * maxLength, i * maxLength + maxLength);
      currentRow.push(temp);
    }
    legendData.points = currentRow;
    if (currentRow.length) {
      for (let i = 0; i < currentRow.length; i++) {
        let item = currentRow[i];
        let maxWidth = 0;
        for (let j = 0; j < item.length; j++) {
          let itemWidth = shapeWidth + shapeRight + measureText(item[j].name || 'undefined', fontSize, context) + opts.legend.itemGap * opts.pix;
          if (itemWidth > maxWidth) {
            maxWidth = itemWidth;
          }
        }
        legendData.widthArr.push(maxWidth);
        legendData.heightArr.push(item.length * lineHeight + padding * 2);
      }
      let legendWidth = 0
      for (let i = 0; i < legendData.widthArr.length; i++) {
        legendWidth += legendData.widthArr[i];
      }
      legendData.area.width = legendWidth - opts.legend.itemGap * opts.pix + 2 * padding;
      legendData.area.wholeWidth = legendData.area.width + padding;
    }
  }
  switch (opts.legend.position) {
    case 'top':
      legendData.area.start.y = opts.area[0] + margin;
      legendData.area.end.y = opts.area[0] + margin + legendData.area.height;
      break;
    case 'bottom':
      legendData.area.start.y = opts.height - opts.area[2] - legendData.area.height - margin;
      legendData.area.end.y = opts.height - opts.area[2] - margin;
      break;
    case 'left':
      legendData.area.start.x = opts.area[3];
      legendData.area.end.x = opts.area[3] + legendData.area.width;
      break;
    case 'right':
      legendData.area.start.x = opts.width - opts.area[1] - legendData.area.width;
      legendData.area.end.x = opts.width - opts.area[1];
      break;
  }
  chartData.legendData = legendData;
  return legendData;
}

function calCategoriesData(categories, opts, config, eachSpacing, context) {
  var result = {
    angle: 0,
    xAxisHeight: opts.xAxis.lineHeight * opts.pix + opts.xAxis.marginTop * opts.pix
  };
  var fontSize = opts.xAxis.fontSize * opts.pix;
  var categoriesTextLenth = categories.map(function(item,index) {
    var xitem = opts.xAxis.formatter ? opts.xAxis.formatter(item,index,opts) : item;
    return measureText(String(xitem), fontSize, context);
  });
  var maxTextLength = Math.max.apply(this, categoriesTextLenth);
  if (opts.xAxis.rotateLabel == true) {
    result.angle = opts.xAxis.rotateAngle * Math.PI / 180;
    let tempHeight = opts.xAxis.marginTop * opts.pix * 2 +  Math.abs(maxTextLength * Math.sin(result.angle))
    tempHeight = tempHeight < fontSize + opts.xAxis.marginTop * opts.pix * 2 ? tempHeight + opts.xAxis.marginTop * opts.pix * 2 : tempHeight;
    result.xAxisHeight = tempHeight;
  }
  if (opts.enableScroll && opts.xAxis.scrollShow) {
    result.xAxisHeight += 6 * opts.pix;
  }
  if (opts.xAxis.disabled){
    result.xAxisHeight = 0;
  }
  return result;
}

function getXAxisTextList(series, opts, config, stack) {
  var index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
  var data;
  if (stack == 'stack') {
    data = dataCombineStack(series, opts.categories.length);
  } else {
    data = dataCombine(series);
  }
  var sorted = [];
  // remove null from data
  data = data.filter(function(item) {
    //return item !== null;
    if (typeof item === 'object' && item !== null) {
      if (item.constructor.toString().indexOf('Array') > -1) {
        return item !== null;
      } else {
        return item.value !== null;
      }
    } else {
      return item !== null;
    }
  });
  data.map(function(item) {
    if (typeof item === 'object') {
      if (item.constructor.toString().indexOf('Array') > -1) {
        if (opts.type == 'candle') {
          item.map(function(subitem) {
            sorted.push(subitem);
          })
        } else {
          sorted.push(item[0]);
        }
      } else {
        sorted.push(item.value);
      }
    } else {
      sorted.push(item);
    }
  })

  var minData = 0;
  var maxData = 0;
  if (sorted.length > 0) {
    minData = Math.min.apply(this, sorted);
    maxData = Math.max.apply(this, sorted);
  }
  //为了兼容v1.9.0之前的项目
  if (index > -1) {
    if (typeof opts.xAxis.data[index].min === 'number') {
      minData = Math.min(opts.xAxis.data[index].min, minData);
    }
    if (typeof opts.xAxis.data[index].max === 'number') {
      maxData = Math.max(opts.xAxis.data[index].max, maxData);
    }
  } else {
    if (typeof opts.xAxis.min === 'number') {
      minData = Math.min(opts.xAxis.min, minData);
    }
    if (typeof opts.xAxis.max === 'number') {
      maxData = Math.max(opts.xAxis.max, maxData);
    }
  }
  if (minData === maxData) {
    var rangeSpan = maxData || 10;
    maxData += rangeSpan;
  }
  //var dataRange = getDataRange(minData, maxData);
  var minRange = minData;
  var maxRange = maxData;
  var range = [];
  var eachRange = (maxRange - minRange) / opts.xAxis.splitNumber;
  for (var i = 0; i <= opts.xAxis.splitNumber; i++) {
    range.push(minRange + eachRange * i);
  }
  return range;
}

function calXAxisData(series, opts, config, context) {
  //堆叠图重算Y轴
  var columnstyle = assign({}, {
    type: ""
  }, opts.extra.bar);
  var result = {
    angle: 0,
    xAxisHeight: opts.xAxis.lineHeight * opts.pix + opts.xAxis.marginTop * opts.pix
  };
  result.ranges = getXAxisTextList(series, opts, config, columnstyle.type);
  result.rangesFormat = result.ranges.map(function(item) {
    //item = opts.xAxis.formatter ? opts.xAxis.formatter(item) : util.toFixed(item, 2);
    item = util.toFixed(item, 2);
    return item;
  });
  var xAxisScaleValues = result.ranges.map(function(item) {
    // 如果刻度值是浮点数,则保留两位小数
    item = util.toFixed(item, 2);
    // 若有自定义格式则调用自定义的格式化函数
    //item = opts.xAxis.formatter ? opts.xAxis.formatter(Number(item)) : item;
    return item;
  });
  result = Object.assign(result, getXAxisPoints(xAxisScaleValues, opts, config));
  // 计算X轴刻度的属性譬如每个刻度的间隔,刻度的起始点\结束点以及总长
  var eachSpacing = result.eachSpacing;
  var textLength = xAxisScaleValues.map(function(item) {
    return measureText(item, opts.xAxis.fontSize * opts.pix, context);
  });
  if (opts.xAxis.disabled === true) {
    result.xAxisHeight = 0;
  }
  return result;
}










function fixColumeData(points, eachSpacing, columnLen, index, config, opts) {
  return points.map(function(item) {
    if (item === null) {
      return null;
    }
    var seriesGap = 0;
    var categoryGap = 0;
    if (opts.type == 'mix') {
      seriesGap = opts.extra.mix.column.seriesGap * opts.pix || 0;
      categoryGap = opts.extra.mix.column.categoryGap * opts.pix || 0;
    } else {
      seriesGap = opts.extra.column.seriesGap * opts.pix || 0;
      categoryGap = opts.extra.column.categoryGap * opts.pix || 0;
    }
    seriesGap =  Math.min(seriesGap, eachSpacing / columnLen)
    categoryGap =  Math.min(categoryGap, eachSpacing / columnLen)
    item.width = Math.ceil((eachSpacing - 2 * categoryGap - seriesGap * (columnLen - 1)) / columnLen);
    if (opts.extra.mix && opts.extra.mix.column.width && +opts.extra.mix.column.width > 0) {
      item.width = Math.min(item.width, +opts.extra.mix.column.width * opts.pix);
    }
    if (opts.extra.column && opts.extra.column.width && +opts.extra.column.width > 0) {
      item.width = Math.min(item.width, +opts.extra.column.width * opts.pix);
    }
    if (item.width <= 0) {
      item.width = 1;
    }
    item.x += (index + 0.5 - columnLen / 2) * (item.width + seriesGap);
    return item;
  });
}


function fixColumeMeterData(points, eachSpacing, columnLen, index, config, opts, border) {
  var categoryGap = opts.extra.column.categoryGap * opts.pix || 0;
  return points.map(function(item) {
    if (item === null) {
      return null;
    }
    item.width = eachSpacing - 2 * categoryGap;
    if (opts.extra.column && opts.extra.column.width && +opts.extra.column.width > 0) {
      item.width = Math.min(item.width, +opts.extra.column.width * opts.pix);
    }
    if (index > 0) {
      item.width -= border;
    }
    return item;
  });
}

function fixColumeStackData(points, eachSpacing, columnLen, index, config, opts, series) {
  var categoryGap = opts.extra.column.categoryGap * opts.pix || 0;
  return points.map(function(item, indexn) {
    if (item === null) {
      return null;
    }
    item.width = Math.ceil(eachSpacing - 2 * categoryGap);
    if (opts.extra.column && opts.extra.column.width && +opts.extra.column.width > 0) {
      item.width = Math.min(item.width, +opts.extra.column.width * opts.pix);
    }
    if (item.width <= 0) {
      item.width = 1;
    }
    return item;
  });
}


function getXAxisPoints(categories, opts, config) {
  var spacingValid = opts.width - opts.area[1] - opts.area[3];
  var dataCount = opts.enableScroll ? Math.min(opts.xAxis.itemCount, categories.length) : categories.length;
  if ((opts.type == 'line' || opts.type == 'area' || opts.type == 'scatter' || opts.type == 'bubble' || opts.type == 'bar') && dataCount > 1 && opts.xAxis.boundaryGap == 'justify') {
    dataCount -= 1;
  }
  var widthRatio = 0;
  if(opts.type == 'mount' && opts.extra && opts.extra.mount && opts.extra.mount.widthRatio && opts.extra.mount.widthRatio > 1){
    if(opts.extra.mount.widthRatio>2) opts.extra.mount.widthRatio = 2
    widthRatio = opts.extra.mount.widthRatio - 1;
    dataCount += widthRatio;
  }
  var eachSpacing = spacingValid / dataCount;
  var xAxisPoints = [];
  var startX = opts.area[3];
  var endX = opts.width - opts.area[1];
  categories.forEach(function(item, index) {
    xAxisPoints.push(startX + widthRatio / 2 * eachSpacing + index * eachSpacing);
  });
  if (opts.xAxis.boundaryGap !== 'justify') {
    if (opts.enableScroll === true) {
      xAxisPoints.push(startX + widthRatio * eachSpacing + categories.length * eachSpacing);
    } else {
      xAxisPoints.push(endX);
    }
  }
  return {
    xAxisPoints: xAxisPoints,
    startX: startX,
    endX: endX,
    eachSpacing: eachSpacing
  };
}


function getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config) {
  var process = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
  var boundaryGap = 'center';
  if (opts.type == 'line' || opts.type == 'area' || opts.type == 'scatter' || opts.type == 'bubble' ) {
    boundaryGap = opts.xAxis.boundaryGap;
  }
  var points = [];
  var validHeight = opts.height - opts.area[0] - opts.area[2];
  var validWidth = opts.width - opts.area[1] - opts.area[3];
  data.forEach(function(item, index) {
    if (item === null) {
      points.push(null);
    } else {
      var point = {};
      point.color = item.color;
      point.x = xAxisPoints[index];
      var value = item;
      if (typeof item === 'object' && item !== null) {
        if (item.constructor.toString().indexOf('Array') > -1) {
          let xranges, xminRange, xmaxRange;
          xranges = [].concat(opts.chartData.xAxisData.ranges);
          xminRange = xranges.shift();
          xmaxRange = xranges.pop();
          value = item[1];
          point.x = opts.area[3] + validWidth * (item[0] - xminRange) / (xmaxRange - xminRange);
          if(opts.type == 'bubble'){
            point.r = item[2];
            point.t = item[3];
          }
        } else {
          value = item.value;
        }
      }
      if (boundaryGap == 'center') {
        point.x += eachSpacing / 2;
      }
      var height = validHeight * (value - minRange) / (maxRange - minRange);
      height *= process;
      point.y = opts.height - height - opts.area[2];
      points.push(point);
    }
  });
  return points;
}

function getLineDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, lineOption, process){
  var process = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;
  var boundaryGap = opts.xAxis.boundaryGap;
  var points = [];
  var validHeight = opts.height - opts.area[0] - opts.area[2];
  var validWidth = opts.width - opts.area[1] - opts.area[3];
  data.forEach(function(item, index) {
    if (item === null) {
      points.push(null);
    } else {
      var point = {};
      point.color = item.color;
      if(lineOption.animation == 'vertical'){
        point.x = xAxisPoints[index];
        var value = item;
        if (typeof item === 'object' && item !== null) {
          if (item.constructor.toString().indexOf('Array') > -1) {
            let xranges, xminRange, xmaxRange;
            xranges = [].concat(opts.chartData.xAxisData.ranges);
            xminRange = xranges.shift();
            xmaxRange = xranges.pop();
            value = item[1];
            point.x = opts.area[3] + validWidth * (item[0] - xminRange) / (xmaxRange - xminRange);
          } else {
            value = item.value;
          }
        }
        if (boundaryGap == 'center') {
          point.x += eachSpacing / 2;
        }
        var height = validHeight * (value - minRange) / (maxRange - minRange);
        height *= process;
        point.y = opts.height - height - opts.area[2];
        points.push(point);
      }else{
        point.x = xAxisPoints[0] + eachSpacing * index * process;
        var value = item;
        if (boundaryGap == 'center') {
          point.x += eachSpacing / 2;
        }
        var height = validHeight * (value - minRange) / (maxRange - minRange);
        point.y = opts.height - height - opts.area[2];
        points.push(point);
      }
    }
  });
  return points;
}






function getYAxisTextList(series, opts, config, stack, yData) {
  var index = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : -1;
  var data;
  if (stack == 'stack') {
    data = dataCombineStack(series, opts.categories.length);
  } else {
    data = dataCombine(series);
  }
  var sorted = [];
  // remove null from data
  data = data.filter(function(item) {
    //return item !== null;
    if (typeof item === 'object' && item !== null) {
      if (item.constructor.toString().indexOf('Array') > -1) {
        return item !== null;
      } else {
        return item.value !== null;
      }
    } else {
      return item !== null;
    }
  });
  data.map(function(item) {
    if (typeof item === 'object') {
      if (item.constructor.toString().indexOf('Array') > -1) {
        if (opts.type == 'candle') {
          item.map(function(subitem) {
            sorted.push(subitem);
          })
        } else {
          sorted.push(item[1]);
        }
      } else {
        sorted.push(item.value);
      }
    } else {
      sorted.push(item);
    }
  })
  var minData = yData.min || 0;
  var maxData = yData.max || 0;
  if (sorted.length > 0) {
    minData = Math.min.apply(this, sorted);
    maxData = Math.max.apply(this, sorted);
  }
  if (minData === maxData) {
    if(maxData == 0){
      maxData = 10;
    }else{
      minData = 0;
    }
  }
  var dataRange = getDataRange(minData, maxData);
  var minRange = (yData.min === undefined || yData.min === null) ? dataRange.minRange : yData.min;
  var maxRange = (yData.max === undefined || yData.max === null) ? dataRange.maxRange : yData.max;
  var eachRange = (maxRange - minRange) / opts.yAxis.splitNumber;
  var range = [];
  for (var i = 0; i <= opts.yAxis.splitNumber; i++) {
    range.push(minRange + eachRange * i);
  }
  return range.reverse();
}

function calYAxisData(series, opts, config, context) {
  //堆叠图重算Y轴
  var columnstyle = assign({}, {
    type: ""
  }, opts.extra.column);
  //如果是多Y轴，重新计算
  var YLength = opts.yAxis.data.length;
  var newSeries = new Array(YLength);
  if (YLength > 0) {
    for (let i = 0; i < YLength; i++) {
      newSeries[i] = [];
      for (let j = 0; j < series.length; j++) {
        if (series[j].index == i) {
          newSeries[i].push(series[j]);
        }
      }
    }
    var rangesArr = new Array(YLength);
    var rangesFormatArr = new Array(YLength);
    var yAxisWidthArr = new Array(YLength);

    for (let i = 0; i < YLength; i++) {
      let yData = opts.yAxis.data[i];
      //如果总开关不显示，强制每个Y轴为不显示
      if (opts.yAxis.disabled == true) {
        yData.disabled = true;
      }
      if(yData.type === 'categories'){
        if(!yData.formatter){
          yData.formatter = (val,index,opts) => {return val + (yData.unit || '')};
        }
        yData.categories = yData.categories || opts.categories;
        rangesArr[i] = yData.categories;
      }else{
        if(!yData.formatter){
          yData.formatter = (val,index,opts) => {return util.toFixed(val, yData.tofix || 0) + (yData.unit || '')};
        }
        rangesArr[i] = getYAxisTextList(newSeries[i], opts, config, columnstyle.type, yData, i);
      }
      let yAxisFontSizes = yData.fontSize * opts.pix || config.fontSize;
      yAxisWidthArr[i] = {
        position: yData.position ? yData.position : 'left',
        width: 0
      };
      rangesFormatArr[i] = rangesArr[i].map(function(items,index) {
        items = yData.formatter(items,index,opts);
        yAxisWidthArr[i].width = Math.max(yAxisWidthArr[i].width, measureText(items, yAxisFontSizes, context) + 5);
        return items;
      });
      let calibration = yData.calibration ? 4 * opts.pix : 0;
      yAxisWidthArr[i].width += calibration + 3 * opts.pix;
      if (yData.disabled === true) {
        yAxisWidthArr[i].width = 0;
      }
    }
  } else {
    var rangesArr = new Array(1);
    var rangesFormatArr = new Array(1);
    var yAxisWidthArr = new Array(1);
    if(opts.type === 'bar'){
      rangesArr[0] = opts.categories;
      if(!opts.yAxis.formatter){
        opts.yAxis.formatter = (val,index,opts) => {return val + (opts.yAxis.unit || '')}
      }
    }else{
      if(!opts.yAxis.formatter){
        opts.yAxis.formatter = (val,index,opts) => {return val.toFixed(opts.yAxis.tofix ) + (opts.yAxis.unit || '')}
      }
      rangesArr[0] = getYAxisTextList(series, opts, config, columnstyle.type, {});
    }
    yAxisWidthArr[0] = {
      position: 'left',
      width: 0
    };
    var yAxisFontSize = opts.yAxis.fontSize * opts.pix || config.fontSize;
    rangesFormatArr[0] = rangesArr[0].map(function(item,index) {
      item = opts.yAxis.formatter(item,index,opts);
      yAxisWidthArr[0].width = Math.max(yAxisWidthArr[0].width, measureText(item, yAxisFontSize, context) + 5);
      return item;
    });
    yAxisWidthArr[0].width += 3 * opts.pix;
    if (opts.yAxis.disabled === true) {
      yAxisWidthArr[0] = {
        position: 'left',
        width: 0
      };
      opts.yAxis.data[0] = {
        disabled: true
      };
    } else {
      opts.yAxis.data[0] = {
        disabled: false,
        position: 'left',
        max: opts.yAxis.max,
        min: opts.yAxis.min,
        formatter: opts.yAxis.formatter
      };
      if(opts.type === 'bar'){
        opts.yAxis.data[0].categories = opts.categories;
        opts.yAxis.data[0].type = 'categories';
      }
    }
  }
  return {
    rangesFormat: rangesFormatArr,
    ranges: rangesArr,
    yAxisWidth: yAxisWidthArr
  };
}

function calTooltipYAxisData(point, series, opts, config, eachSpacing) {
  let ranges = [].concat(opts.chartData.yAxisData.ranges);
  let spacingValid = opts.height - opts.area[0] - opts.area[2];
  let minAxis = opts.area[0];
  let items = [];
  for (let i = 0; i < ranges.length; i++) {
    let maxVal = Math.max.apply(this, ranges[i]);
    let minVal = Math.min.apply(this, ranges[i]);
    let item = maxVal - (maxVal - minVal) * (point - minAxis) / spacingValid;
    item = opts.yAxis.data && opts.yAxis.data[i].formatter ? opts.yAxis.data[i].formatter(item, i, opts) : item.toFixed(0);
    items.push(String(item))
  }
  return items;
}

function calMarkLineData(points, opts) {
  let minRange, maxRange;
  let spacingValid = opts.height - opts.area[0] - opts.area[2];
  for (let i = 0; i < points.length; i++) {
    points[i].yAxisIndex = points[i].yAxisIndex ? points[i].yAxisIndex : 0;
    let range = [].concat(opts.chartData.yAxisData.ranges[points[i].yAxisIndex]);
    minRange = range.pop();
    maxRange = range.shift();
    let height = spacingValid * (points[i].value - minRange) / (maxRange - minRange);
    points[i].y = opts.height - Math.round(height) - opts.area[2];
  }
  return points;
}

function contextRotate(context, opts) {
  if (opts.rotateLock !== true) {
    context.translate(opts.height, 0);
    context.rotate(90 * Math.PI / 180);
  } else if (opts._rotate_ !== true) {
    context.translate(opts.height, 0);
    context.rotate(90 * Math.PI / 180);
    opts._rotate_ = true;
  }
}

function drawPointShape(points, color, shape, context, opts) {
  context.beginPath();
  if (opts.dataPointShapeType == 'hollow') {
    context.setStrokeStyle(color);
    context.setFillStyle(opts.background);
    context.setLineWidth(2 * opts.pix);
  } else {
    context.setStrokeStyle("#ffffff");
    context.setFillStyle(color);
    context.setLineWidth(1 * opts.pix);
  }
  if (shape === 'diamond') {
    points.forEach(function(item, index) {
      if (item !== null) {
        context.moveTo(item.x, item.y - 4.5);
        context.lineTo(item.x - 4.5, item.y);
        context.lineTo(item.x, item.y + 4.5);
        context.lineTo(item.x + 4.5, item.y);
        context.lineTo(item.x, item.y - 4.5);
      }
    });
  } else if (shape === 'circle') {
    points.forEach(function(item, index) {
      if (item !== null) {
        context.moveTo(item.x + 2.5 * opts.pix, item.y);
        context.arc(item.x, item.y, 3 * opts.pix, 0, 2 * Math.PI, false);
      }
    });
  } else if (shape === 'square') {
    points.forEach(function(item, index) {
      if (item !== null) {
        context.moveTo(item.x - 3.5, item.y - 3.5);
        context.rect(item.x - 3.5, item.y - 3.5, 7, 7);
      }
    });
  } else if (shape === 'triangle') {
    points.forEach(function(item, index) {
      if (item !== null) {
        context.moveTo(item.x, item.y - 4.5);
        context.lineTo(item.x - 4.5, item.y + 4.5);
        context.lineTo(item.x + 4.5, item.y + 4.5);
        context.lineTo(item.x, item.y - 4.5);
      }
    });
  } else if (shape === 'none') {
    return;
  }
  context.closePath();
  context.fill();
  context.stroke();
}

function drawActivePoint(points, color, shape, context, opts, option, seriesIndex) {
  if(!opts.tooltip){
    return
  }
  if(opts.tooltip.group.length>0 && opts.tooltip.group.includes(seriesIndex) == false){
    return
  }
  var pointIndex = typeof opts.tooltip.index === 'number' ? opts.tooltip.index : opts.tooltip.index[opts.tooltip.group.indexOf(seriesIndex)];
  context.beginPath();
  if (option.activeType == 'hollow') {
    context.setStrokeStyle(color);
    context.setFillStyle(opts.background);
    context.setLineWidth(2 * opts.pix);
  } else {
    context.setStrokeStyle("#ffffff");
    context.setFillStyle(color);
    context.setLineWidth(1 * opts.pix);
  }
  if (shape === 'diamond') {
    points.forEach(function(item, index) {
      if (item !== null && pointIndex == index ) {
        context.moveTo(item.x, item.y - 4.5);
        context.lineTo(item.x - 4.5, item.y);
        context.lineTo(item.x, item.y + 4.5);
        context.lineTo(item.x + 4.5, item.y);
        context.lineTo(item.x, item.y - 4.5);
      }
    });
  } else if (shape === 'circle') {
    points.forEach(function(item, index) {
      if (item !== null && pointIndex == index) {
        context.moveTo(item.x + 2.5 * opts.pix, item.y);
        context.arc(item.x, item.y, 3 * opts.pix, 0, 2 * Math.PI, false);
      }
    });
  } else if (shape === 'square') {
    points.forEach(function(item, index) {
      if (item !== null && pointIndex == index) {
        context.moveTo(item.x - 3.5, item.y - 3.5);
        context.rect(item.x - 3.5, item.y - 3.5, 7, 7);
      }
    });
  } else if (shape === 'triangle') {
    points.forEach(function(item, index) {
      if (item !== null && pointIndex == index) {
        context.moveTo(item.x, item.y - 4.5);
        context.lineTo(item.x - 4.5, item.y + 4.5);
        context.lineTo(item.x + 4.5, item.y + 4.5);
        context.lineTo(item.x, item.y - 4.5);
      }
    });
  } else if (shape === 'none') {
    return;
  }
  context.closePath();
  context.fill();
  context.stroke();
}

function drawRingTitle(opts, config, context, center) {
  var titlefontSize = opts.title.fontSize || config.titleFontSize;
  var subtitlefontSize = opts.subtitle.fontSize || config.subtitleFontSize;
  var title = opts.title.name || '';
  var subtitle = opts.subtitle.name || '';
  var titleFontColor = opts.title.color || opts.fontColor;
  var subtitleFontColor = opts.subtitle.color || opts.fontColor;
  var titleHeight = title ? titlefontSize : 0;
  var subtitleHeight = subtitle ? subtitlefontSize : 0;
  var margin = 5;
  if (subtitle) {
    var textWidth = measureText(subtitle, subtitlefontSize * opts.pix, context);
    var startX = center.x - textWidth / 2 + (opts.subtitle.offsetX|| 0) * opts.pix ;
    var startY = center.y + subtitlefontSize * opts.pix / 2 + (opts.subtitle.offsetY || 0) * opts.pix;
    if (title) {
      startY += (titleHeight * opts.pix + margin) / 2;
    }
    context.beginPath();
    context.setFontSize(subtitlefontSize * opts.pix);
    context.setFillStyle(subtitleFontColor);
    context.fillText(subtitle, startX, startY);
    context.closePath();
    context.stroke();
  }
  if (title) {
    var _textWidth = measureText(title, titlefontSize * opts.pix, context);
    var _startX = center.x - _textWidth / 2 + (opts.title.offsetX || 0);
    var _startY = center.y + titlefontSize * opts.pix / 2 + (opts.title.offsetY || 0) * opts.pix;
    if (subtitle) {
      _startY -= (subtitleHeight * opts.pix + margin) / 2;
    }
    context.beginPath();
    context.setFontSize(titlefontSize * opts.pix);
    context.setFillStyle(titleFontColor);
    context.fillText(title, _startX, _startY);
    context.closePath();
    context.stroke();
  }
}

function drawPointText(points, series, config, context, opts) {
  // 绘制数据文案
  var data = series.data;
  var textOffset = series.textOffset ? series.textOffset : 0;
  points.forEach(function(item, index) {
    if (item !== null) {
      context.beginPath();
      var fontSize = series.textSize ? series.textSize * opts.pix : config.fontSize;
      context.setFontSize(fontSize);
      context.setFillStyle(series.textColor || opts.fontColor);
      var value = data[index]
      if (typeof data[index] === 'object' && data[index] !== null) {
        if (data[index].constructor.toString().indexOf('Array')>-1) {
          value = data[index][1];
        } else {
          value = data[index].value
        }
      }
      var formatVal = series.formatter ? series.formatter(value,index,series,opts) : value;

      // 自定义文字绘制
      if (series.customDrawPointText && series.customDrawPointText(context, formatVal, item, index, textOffset, series, opts, measureText)) {
        return;
      }

      context.setTextAlign('center');
      context.fillText(String(formatVal), item.x, item.y - 4 + textOffset * opts.pix);
      context.closePath();
      context.stroke();
      context.setTextAlign('left');
    }
  });
}

function drawColumePointText(points, series, config, context, opts) {
  // 绘制数据文案
  var data = series.data;
  var textOffset = series.textOffset ? series.textOffset : 0;
  var Position = opts.extra.column.labelPosition;
  points.forEach(function(item, index) {
    if (item !== null) {
      context.beginPath();
      var fontSize = series.textSize ? series.textSize * opts.pix : config.fontSize;
      context.setFontSize(fontSize);
      context.setFillStyle(series.textColor || opts.fontColor);
      var value = data[index]
      if (typeof data[index] === 'object' && data[index] !== null) {
        if (data[index].constructor.toString().indexOf('Array')>-1) {
          value = data[index][1];
        } else {
          value = data[index].value
        }
      }
      var formatVal = series.formatter ? series.formatter(value,index,series,opts) : value;
      context.setTextAlign('center');
      var startY = item.y - 4 * opts.pix + textOffset * opts.pix;
      if(item.y > series.zeroPoints){
        startY = item.y + textOffset * opts.pix + fontSize;
      }
      if(Position == 'insideTop'){
        startY = item.y + fontSize + textOffset * opts.pix;
        if(item.y > series.zeroPoints){
          startY = item.y - textOffset * opts.pix - 4 * opts.pix;
        }
      }
      if(Position == 'center'){
        startY = item.y + textOffset * opts.pix + (opts.height - opts.area[2] - item.y + fontSize)/2;
        if(series.zeroPoints < opts.height - opts.area[2]){
          startY = item.y + textOffset * opts.pix + (series.zeroPoints - item.y + fontSize)/2;
        }
        if(item.y > series.zeroPoints){
          startY = item.y - textOffset * opts.pix - (item.y - series.zeroPoints - fontSize)/2;
        }
        if(opts.extra.column.type == 'stack'){
          startY = item.y + textOffset * opts.pix + (item.y0 - item.y + fontSize)/2;
        }
      }
      if(Position == 'bottom'){
        startY = opts.height - opts.area[2] + textOffset * opts.pix - 4 * opts.pix;
        if(series.zeroPoints < opts.height - opts.area[2]){
          startY = series.zeroPoints + textOffset * opts.pix - 4 * opts.pix;
        }
        if(item.y > series.zeroPoints){
          startY = series.zeroPoints - textOffset * opts.pix + fontSize + 2 * opts.pix;
        }
        if(opts.extra.column.type == 'stack'){
          startY = item.y0 + textOffset * opts.pix - 4 * opts.pix;
        }
      }
      context.fillText(String(formatVal), item.x, startY);
      context.closePath();
      context.stroke();
      context.setTextAlign('left');
    }
  });
}






function drawToolTipSplitLine(offsetX, opts, config, context) {
  var toolTipOption = opts.extra.tooltip || {};
  toolTipOption.gridType = toolTipOption.gridType == undefined ? 'solid' : toolTipOption.gridType;
  toolTipOption.dashLength = toolTipOption.dashLength == undefined ? 4 : toolTipOption.dashLength;
  var startY = opts.area[0];
  var endY = opts.height - opts.area[2];
  if (toolTipOption.gridType == 'dash') {
    context.setLineDash([toolTipOption.dashLength, toolTipOption.dashLength]);
  }
  context.setStrokeStyle(toolTipOption.gridColor || '#cccccc');
  context.setLineWidth(1 * opts.pix);
  context.beginPath();
  context.moveTo(offsetX, startY);
  context.lineTo(offsetX, endY);
  context.stroke();
  context.setLineDash([]);
  if (toolTipOption.xAxisLabel) {
    let labelText = opts.categories[opts.tooltip.index];
    context.setFontSize(config.fontSize);
    let textWidth = measureText(labelText, config.fontSize, context);
    let textX = offsetX - 0.5 * textWidth;
    let textY = endY + 2 * opts.pix;
    context.beginPath();
    context.setFillStyle(hexToRgb(toolTipOption.labelBgColor || config.toolTipBackground, toolTipOption.labelBgOpacity || config.toolTipOpacity));
    context.setStrokeStyle(toolTipOption.labelBgColor || config.toolTipBackground);
    context.setLineWidth(1 * opts.pix);
    context.rect(textX - toolTipOption.boxPadding * opts.pix, textY, textWidth + 2 * toolTipOption.boxPadding * opts.pix, config.fontSize + 2 * toolTipOption.boxPadding * opts.pix);
    context.closePath();
    context.stroke();
    context.fill();
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle(toolTipOption.labelFontColor || opts.fontColor);
    context.fillText(String(labelText), textX, textY + toolTipOption.boxPadding * opts.pix + config.fontSize);
    context.closePath();
    context.stroke();
  }
}

function drawMarkLine(opts, config, context) {
  let markLineOption = assign({}, {
    type: 'solid',
    dashLength: 4,
    data: []
  }, opts.extra.markLine);
  let startX = opts.area[3];
  let endX = opts.width - opts.area[1];
  let points = calMarkLineData(markLineOption.data, opts);
  for (let i = 0; i < points.length; i++) {
    let item = assign({}, {
      lineColor: '#DE4A42',
      showLabel: false,
      labelFontSize: 13,
      labelPadding: 6,
      labelFontColor: '#666666',
      labelBgColor: '#DFE8FF',
      labelBgOpacity: 0.8,
      labelAlign: 'left',
      labelOffsetX: 0,
      labelOffsetY: 0,
    }, points[i]);
    if (markLineOption.type == 'dash') {
      context.setLineDash([markLineOption.dashLength, markLineOption.dashLength]);
    }
    context.setStrokeStyle(item.lineColor);
    context.setLineWidth(1 * opts.pix);
    context.beginPath();
    context.moveTo(startX, item.y);
    context.lineTo(endX, item.y);
    context.stroke();
    context.setLineDash([]);
    if (item.showLabel) {
      let fontSize = item.labelFontSize * opts.pix;
      let labelText = item.labelText ? item.labelText : item.value;
      context.setFontSize(fontSize);
      let textWidth = measureText(labelText, fontSize, context);
      let bgWidth = textWidth + item.labelPadding * opts.pix * 2;
      let bgStartX = item.labelAlign == 'left' ? opts.area[3] - bgWidth : opts.width - opts.area[1];
      bgStartX += item.labelOffsetX;
      let bgStartY = item.y - 0.5 * fontSize - item.labelPadding * opts.pix;
      bgStartY += item.labelOffsetY;
      let textX = bgStartX + item.labelPadding * opts.pix;
      let textY = item.y;
      context.setFillStyle(hexToRgb(item.labelBgColor, item.labelBgOpacity));
      context.setStrokeStyle(item.labelBgColor);
      context.setLineWidth(1 * opts.pix);
      context.beginPath();
      context.rect(bgStartX, bgStartY, bgWidth, fontSize + 2 * item.labelPadding * opts.pix);
      context.closePath();
      context.stroke();
      context.fill();
      context.setFontSize(fontSize);
      context.setTextAlign('left');
      context.setFillStyle(item.labelFontColor);
      context.fillText(String(labelText), textX, bgStartY + fontSize + item.labelPadding * opts.pix/2);
      context.stroke();
      context.setTextAlign('left');
    }
  }
}

function drawToolTipHorizentalLine(opts, config, context, eachSpacing, xAxisPoints) {
  var toolTipOption = assign({}, {
    gridType: 'solid',
    dashLength: 4
  }, opts.extra.tooltip);
  var startX = opts.area[3];
  var endX = opts.width - opts.area[1];
  if (toolTipOption.gridType == 'dash') {
    context.setLineDash([toolTipOption.dashLength, toolTipOption.dashLength]);
  }
  context.setStrokeStyle(toolTipOption.gridColor || '#cccccc');
  context.setLineWidth(1 * opts.pix);
  context.beginPath();
  context.moveTo(startX, opts.tooltip.offset.y);
  context.lineTo(endX, opts.tooltip.offset.y);
  context.stroke();
  context.setLineDash([]);
  if (toolTipOption.yAxisLabel) {
    let boxPadding = toolTipOption.boxPadding * opts.pix;
    let labelText = calTooltipYAxisData(opts.tooltip.offset.y, opts.series, opts, config, eachSpacing);
    let widthArr = opts.chartData.yAxisData.yAxisWidth;
    let tStartLeft = opts.area[3];
    let tStartRight = opts.width - opts.area[1];
    for (let i = 0; i < labelText.length; i++) {
      context.setFontSize(toolTipOption.fontSize * opts.pix);
      let textWidth = measureText(labelText[i], toolTipOption.fontSize * opts.pix, context);
      let bgStartX, bgEndX, bgWidth;
      if (widthArr[i].position == 'left') {
        bgStartX = tStartLeft - (textWidth + boxPadding * 2) - 2 * opts.pix;
        bgEndX = Math.max(bgStartX, bgStartX + textWidth + boxPadding * 2);
      } else {
        bgStartX = tStartRight + 2 * opts.pix;
        bgEndX = Math.max(bgStartX + widthArr[i].width, bgStartX + textWidth + boxPadding * 2);
      }
      bgWidth = bgEndX - bgStartX;
      let textX = bgStartX + (bgWidth - textWidth) / 2;
      let textY = opts.tooltip.offset.y;
      context.beginPath();
      context.setFillStyle(hexToRgb(toolTipOption.labelBgColor || config.toolTipBackground, toolTipOption.labelBgOpacity || config.toolTipOpacity));
      context.setStrokeStyle(toolTipOption.labelBgColor || config.toolTipBackground);
      context.setLineWidth(1 * opts.pix);
      context.rect(bgStartX, textY - 0.5 * config.fontSize - boxPadding, bgWidth, config.fontSize + 2 * boxPadding);
      context.closePath();
      context.stroke();
      context.fill();
      context.beginPath();
      context.setFontSize(config.fontSize);
      context.setFillStyle(toolTipOption.labelFontColor || opts.fontColor);
      context.fillText(labelText[i], textX, textY + 0.5 * config.fontSize);
      context.closePath();
      context.stroke();
      if (widthArr[i].position == 'left') {
        tStartLeft -= (widthArr[i].width + opts.yAxis.padding * opts.pix);
      } else {
        tStartRight += widthArr[i].width + opts.yAxis.padding * opts.pix;
      }
    }
  }
}




function drawToolTip(textList, offset, opts, config, context, eachSpacing, xAxisPoints) {
  var toolTipOption = assign({}, {
    showBox: true,
    showArrow: true,
    showCategory: false,
    bgColor: '#000000',
    bgOpacity: 0.7,
    borderColor: '#000000',
    borderWidth: 0,
    borderRadius: 0,
    borderOpacity: 0.7,
    boxPadding: 3,
    fontColor: '#FFFFFF',
    fontSize: 13,
    lineHeight: 20,
    legendShow: true,
    legendShape: 'auto',
    splitLine: true,
  }, opts.extra.tooltip);
  if(toolTipOption.showCategory==true && opts.categories){
    textList.unshift({text:opts.categories[opts.tooltip.index],color:null})
  }
  var fontSize = toolTipOption.fontSize * opts.pix;
  var lineHeight = toolTipOption.lineHeight * opts.pix;
  var boxPadding = toolTipOption.boxPadding * opts.pix;
  var legendWidth = fontSize;
  var legendMarginRight = 5 * opts.pix;
  if(toolTipOption.legendShow == false){
    legendWidth = 0;
    legendMarginRight = 0;
  }
  var arrowWidth = toolTipOption.showArrow ? 8 * opts.pix : 0;
  var isOverRightBorder = false;
  if (opts.type == 'line' || opts.type == 'mount' || opts.type == 'area' || opts.type == 'candle' || opts.type == 'mix') {
    if (toolTipOption.splitLine == true) {
      drawToolTipSplitLine(opts.tooltip.offset.x, opts, config, context);
    }
  }
  offset = assign({
    x: 0,
    y: 0
  }, offset);
  offset.y -= 8 * opts.pix;
  var textWidth = textList.map(function(item) {
    return measureText(item.text, fontSize, context);
  });
  var toolTipWidth = legendWidth + legendMarginRight + 4 * boxPadding + Math.max.apply(null, textWidth);
  var toolTipHeight = 2 * boxPadding + textList.length * lineHeight;
  if (toolTipOption.showBox == false) {
    return
  }
  // if beyond the right border
  if (offset.x - Math.abs(opts._scrollDistance_ || 0) + arrowWidth + toolTipWidth > opts.width) {
    isOverRightBorder = true;
  }
  if (toolTipHeight + offset.y > opts.height) {
    offset.y = opts.height - toolTipHeight;
  }
  // draw background rect
  context.beginPath();
  context.setFillStyle(hexToRgb(toolTipOption.bgColor, toolTipOption.bgOpacity));
  context.setLineWidth(toolTipOption.borderWidth * opts.pix);
  context.setStrokeStyle(hexToRgb(toolTipOption.borderColor, toolTipOption.borderOpacity));
  var radius = toolTipOption.borderRadius;
  if (isOverRightBorder) {
    // 增加左侧仍然超出的判断
    if(toolTipWidth + arrowWidth > opts.width){
      offset.x = opts.width + Math.abs(opts._scrollDistance_ || 0) + arrowWidth + (toolTipWidth - opts.width)
    }
    if(toolTipWidth > offset.x){
      offset.x = opts.width + Math.abs(opts._scrollDistance_ || 0) + arrowWidth + (toolTipWidth - opts.width)
    }
    if (toolTipOption.showArrow) {
      context.moveTo(offset.x, offset.y + 10 * opts.pix);
      context.lineTo(offset.x - arrowWidth, offset.y + 10 * opts.pix + 5 * opts.pix);
    }
    context.arc(offset.x - arrowWidth - radius, offset.y + toolTipHeight - radius, radius, 0, Math.PI / 2, false);
    context.arc(offset.x - arrowWidth - Math.round(toolTipWidth) + radius, offset.y + toolTipHeight - radius, radius,
      Math.PI / 2, Math.PI, false);
    context.arc(offset.x - arrowWidth - Math.round(toolTipWidth) + radius, offset.y + radius, radius, -Math.PI, -Math.PI / 2, false);
    context.arc(offset.x - arrowWidth - radius, offset.y + radius, radius, -Math.PI / 2, 0, false);
    if (toolTipOption.showArrow) {
      context.lineTo(offset.x - arrowWidth, offset.y + 10 * opts.pix - 5 * opts.pix);
      context.lineTo(offset.x, offset.y + 10 * opts.pix);
    }
  } else {
    if (toolTipOption.showArrow) {
      context.moveTo(offset.x, offset.y + 10 * opts.pix);
      context.lineTo(offset.x + arrowWidth, offset.y + 10 * opts.pix - 5 * opts.pix);
    }
    context.arc(offset.x + arrowWidth + radius, offset.y + radius, radius, -Math.PI, -Math.PI / 2, false);
    context.arc(offset.x + arrowWidth + Math.round(toolTipWidth) - radius, offset.y + radius, radius, -Math.PI / 2, 0,
      false);
    context.arc(offset.x + arrowWidth + Math.round(toolTipWidth) - radius, offset.y + toolTipHeight - radius, radius, 0,
      Math.PI / 2, false);
    context.arc(offset.x + arrowWidth + radius, offset.y + toolTipHeight - radius, radius, Math.PI / 2, Math.PI, false);
    if (toolTipOption.showArrow) {
      context.lineTo(offset.x + arrowWidth, offset.y + 10 * opts.pix + 5 * opts.pix);
      context.lineTo(offset.x, offset.y + 10 * opts.pix);
    }
  }
  context.closePath();
  context.fill();
  if (toolTipOption.borderWidth > 0) {
    context.stroke();
  }
  // draw legend
  if(toolTipOption.legendShow){
    textList.forEach(function(item, index) {
      if (item.color !== null) {
        context.beginPath();
        context.setFillStyle(item.color);
        var startX = offset.x + arrowWidth + 2 * boxPadding;
        var startY = offset.y + (lineHeight - fontSize) / 2 + lineHeight * index + boxPadding + 1;
        if (isOverRightBorder) {
          startX = offset.x - toolTipWidth - arrowWidth + 2 * boxPadding;
        }
        switch (item.legendShape) {
          case 'line':
            context.moveTo(startX, startY + 0.5 * legendWidth - 2 * opts.pix);
            context.fillRect(startX, startY + 0.5 * legendWidth - 2 * opts.pix, legendWidth, 4 * opts.pix);
            break;
          case 'triangle':
            context.moveTo(startX + 7.5 * opts.pix, startY + 0.5 * legendWidth - 5 * opts.pix);
            context.lineTo(startX + 2.5 * opts.pix, startY + 0.5 * legendWidth + 5 * opts.pix);
            context.lineTo(startX + 12.5 * opts.pix, startY + 0.5 * legendWidth + 5 * opts.pix);
            context.lineTo(startX + 7.5 * opts.pix, startY + 0.5 * legendWidth - 5 * opts.pix);
            break;
          case 'diamond':
            context.moveTo(startX + 7.5 * opts.pix, startY + 0.5 * legendWidth - 5 * opts.pix);
            context.lineTo(startX + 2.5 * opts.pix, startY + 0.5 * legendWidth);
            context.lineTo(startX + 7.5 * opts.pix, startY + 0.5 * legendWidth + 5 * opts.pix);
            context.lineTo(startX + 12.5 * opts.pix, startY + 0.5 * legendWidth);
            context.lineTo(startX + 7.5 * opts.pix, startY + 0.5 * legendWidth - 5 * opts.pix);
            break;
          case 'circle':
            context.moveTo(startX + 7.5 * opts.pix, startY + 0.5 * legendWidth);
            context.arc(startX + 7.5 * opts.pix, startY + 0.5 * legendWidth, 5 * opts.pix, 0, 2 * Math.PI);
            break;
          case 'rect':
            context.moveTo(startX, startY + 0.5 * legendWidth - 5 * opts.pix);
            context.fillRect(startX, startY + 0.5 * legendWidth - 5 * opts.pix, 15 * opts.pix, 10 * opts.pix);
            break;
          case 'square':
            context.moveTo(startX + 2 * opts.pix, startY + 0.5 * legendWidth - 5 * opts.pix);
            context.fillRect(startX + 2 * opts.pix, startY + 0.5 * legendWidth - 5 * opts.pix, 10 * opts.pix, 10 * opts.pix);
            break;
          default:
            context.moveTo(startX, startY + 0.5 * legendWidth - 5 * opts.pix);
            context.fillRect(startX, startY + 0.5 * legendWidth - 5 * opts.pix, 15 * opts.pix, 10 * opts.pix);
        }
        context.closePath();
        context.fill();
      }
    });
  }
  
  // draw text list
  textList.forEach(function(item, index) {
    var startX = offset.x + arrowWidth + 2 * boxPadding + legendWidth + legendMarginRight;
    if (isOverRightBorder) {
      startX = offset.x - toolTipWidth - arrowWidth + 2 * boxPadding + legendWidth + legendMarginRight;
    }
    var startY = offset.y + lineHeight * index + (lineHeight - fontSize)/2 - 1 + boxPadding + fontSize;
    context.beginPath();
    context.setFontSize(fontSize);
    context.setTextBaseline('normal');
    context.setFillStyle(toolTipOption.fontColor);
    context.fillText(item.text, startX, startY);
    context.closePath();
    context.stroke();
  });
}








function drawLineDataPoints(series, opts, config, context) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var lineOption = assign({}, {
    type: 'straight',
    width: 2,
    activeType: 'none',
    linearType: 'none',
    onShadow: false,
    animation: 'vertical',
  }, opts.extra.line);
  lineOption.width *= opts.pix;
  let xAxisData = opts.chartData.xAxisData,
    xAxisPoints = xAxisData.xAxisPoints,
    eachSpacing = xAxisData.eachSpacing;
  var calPoints = [];
  context.save();
  let leftSpace = 0;
  let rightSpace = opts.width + eachSpacing;
  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
    context.translate(opts._scrollDistance_, 0);
    leftSpace = -opts._scrollDistance_ - eachSpacing * 2 + opts.area[3];
    rightSpace = leftSpace + (opts.xAxis.itemCount + 4) * eachSpacing;
  }
  series.forEach(function(eachSeries, seriesIndex) {
    // 这段很神奇的代码用于解决ios16的setStrokeStyle失效的bug
    context.beginPath();
    context.setStrokeStyle(eachSeries.color);
    context.moveTo(-10000, -10000);
    context.lineTo(-10001, -10001);
    context.stroke();
    let ranges, minRange, maxRange;
    ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
    minRange = ranges.pop();
    maxRange = ranges.shift();
    var data = eachSeries.data;
    var points = getLineDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, lineOption, process);
    calPoints.push(points);
    var splitPointList = splitPoints(points,eachSeries);
    if (eachSeries.lineType == 'dash') {
      let dashLength = eachSeries.dashLength ? eachSeries.dashLength : 8;
      dashLength *= opts.pix;
      context.setLineDash([dashLength, dashLength]);
    }
    context.beginPath();
    var strokeColor = eachSeries.color;
    if (lineOption.linearType !== 'none' && eachSeries.linearColor && eachSeries.linearColor.length > 0) {
      var grd = context.createLinearGradient(opts.chartData.xAxisData.startX, opts.height/2, opts.chartData.xAxisData.endX, opts.height/2);
      for (var i = 0; i < eachSeries.linearColor.length; i++) {
        grd.addColorStop(eachSeries.linearColor[i][0], hexToRgb(eachSeries.linearColor[i][1], 1));
      }
      strokeColor = grd
    }
    context.setStrokeStyle(strokeColor);
    if (lineOption.onShadow == true && eachSeries.setShadow && eachSeries.setShadow.length > 0) {
      context.setShadow(eachSeries.setShadow[0], eachSeries.setShadow[1], eachSeries.setShadow[2], eachSeries.setShadow[3]);
    }else{
      context.setShadow(0, 0, 0, 'rgba(0,0,0,0)');
    }
    context.setLineWidth(lineOption.width);
    splitPointList.forEach(function(points, index) {
      if (points.length === 1) {
        context.moveTo(points[0].x, points[0].y);
        // context.arc(points[0].x, points[0].y, 1, 0, 2 * Math.PI);
      } else {
        context.moveTo(points[0].x, points[0].y);
        let startPoint = 0;
        if (lineOption.type === 'curve') {
          for (let j = 0; j < points.length; j++) {
            let item = points[j];
            if (startPoint == 0 && item.x > leftSpace) {
              context.moveTo(item.x, item.y);
              startPoint = 1;
            }
            if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
              var ctrlPoint = createCurveControlPoints(points, j - 1);
              context.bezierCurveTo(ctrlPoint.ctrA.x, ctrlPoint.ctrA.y, ctrlPoint.ctrB.x, ctrlPoint.ctrB.y, item.x, item.y);
            }
          };
        }
        if (lineOption.type === 'straight') {
          for (let j = 0; j < points.length; j++) {
            let item = points[j];
            if (startPoint == 0 && item.x > leftSpace) {
              context.moveTo(item.x, item.y);
              startPoint = 1;
            }
            if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
              context.lineTo(item.x, item.y);
            }
          };
        }
        if (lineOption.type === 'step') {
          for (let j = 0; j < points.length; j++) {
            let item = points[j];
            if (startPoint == 0 && item.x > leftSpace) {
              context.moveTo(item.x, item.y);
              startPoint = 1;
            }
            if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
              context.lineTo(item.x, points[j - 1].y);
              context.lineTo(item.x, item.y);
            }
          };
        }
        context.moveTo(points[0].x, points[0].y);
      }
    });
    context.stroke();
    context.setLineDash([]);
    if (opts.dataPointShape !== false) {
      if (eachSeries.customDrawPointShape) {
        eachSeries.customDrawPointShape(points, eachSeries, context, opts)
      } else {
        drawPointShape(points, eachSeries.color, eachSeries.pointShape, context, opts);
      }
    }
    drawActivePoint(points, eachSeries.color, eachSeries.pointShape, context, opts, lineOption);
  });
  if (opts.dataLabel !== false && process === 1) {
    series.forEach(function(eachSeries, seriesIndex) {
      let ranges, minRange, maxRange;
      ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
      minRange = ranges.pop();
      maxRange = ranges.shift();
      var data = eachSeries.data;
      var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
      drawPointText(points, eachSeries, config, context, opts);
    });
  }
  context.restore();
  return {
    xAxisPoints: xAxisPoints,
    calPoints: calPoints,
    eachSpacing: eachSpacing
  };
}



function drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints) {
  var toolTipOption = opts.extra.tooltip || {};
  if (toolTipOption.horizentalLine && opts.tooltip && process === 1 && (opts.type == 'line' || opts.type == 'area' || opts.type == 'column' || opts.type == 'mount' || opts.type == 'candle' || opts.type == 'mix')) {
    drawToolTipHorizentalLine(opts, config, context, eachSpacing, xAxisPoints)
  }
  context.save();
  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
    context.translate(opts._scrollDistance_, 0);
  }
  if (opts.tooltip && opts.tooltip.textList && opts.tooltip.textList.length && process === 1) {
    drawToolTip(opts.tooltip.textList, opts.tooltip.offset, opts, config, context, eachSpacing, xAxisPoints);
  }
  context.restore();

}

function drawXAxis(categories, opts, config, context) {

  let xAxisData = opts.chartData.xAxisData,
    xAxisPoints = xAxisData.xAxisPoints,
    startX = xAxisData.startX,
    endX = xAxisData.endX,
    eachSpacing = xAxisData.eachSpacing;
  var boundaryGap = 'center';
  if (opts.type == 'bar' || opts.type == 'line' || opts.type == 'area'|| opts.type == 'scatter' || opts.type == 'bubble') {
    boundaryGap = opts.xAxis.boundaryGap;
  }
  var startY = opts.height - opts.area[2];
  var endY = opts.area[0];

  //绘制滚动条
  if (opts.enableScroll && opts.xAxis.scrollShow) {
    var scrollY = opts.height - opts.area[2] + config.xAxisHeight;
    var scrollScreenWidth = endX - startX;
    var scrollTotalWidth = eachSpacing * (xAxisPoints.length - 1);
    if(opts.type == 'mount' && opts.extra && opts.extra.mount && opts.extra.mount.widthRatio && opts.extra.mount.widthRatio > 1){
      if(opts.extra.mount.widthRatio>2) opts.extra.mount.widthRatio = 2
      scrollTotalWidth += (opts.extra.mount.widthRatio - 1)*eachSpacing;
    }
    var scrollWidth = scrollScreenWidth * scrollScreenWidth / scrollTotalWidth;
    var scrollLeft = 0;
    if (opts._scrollDistance_) {
      scrollLeft = -opts._scrollDistance_ * (scrollScreenWidth) / scrollTotalWidth;
    }
    context.beginPath();
    context.setLineCap('round');
    context.setLineWidth(6 * opts.pix);
    context.setStrokeStyle(opts.xAxis.scrollBackgroundColor || "#EFEBEF");
    context.moveTo(startX, scrollY);
    context.lineTo(endX, scrollY);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.setLineCap('round');
    context.setLineWidth(6 * opts.pix);
    context.setStrokeStyle(opts.xAxis.scrollColor || "#A6A6A6");
    context.moveTo(startX + scrollLeft, scrollY);
    context.lineTo(startX + scrollLeft + scrollWidth, scrollY);
    context.stroke();
    context.closePath();
    context.setLineCap('butt');
  }
  context.save();
  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0) {
    context.translate(opts._scrollDistance_, 0);
  }
  //绘制X轴刻度线
  if (opts.xAxis.calibration === true) {
    context.setStrokeStyle(opts.xAxis.gridColor || "#cccccc");
    context.setLineCap('butt');
    context.setLineWidth(1 * opts.pix);
    xAxisPoints.forEach(function(item, index) {
      if (index > 0) {
        context.beginPath();
        context.moveTo(item - eachSpacing / 2, startY);
        context.lineTo(item - eachSpacing / 2, startY + 3 * opts.pix);
        context.closePath();
        context.stroke();
      }
    });
  }
  //绘制X轴网格
  if (opts.xAxis.disableGrid !== true && opts.xAxis.customDrawGrid == undefined) {
    context.setStrokeStyle(opts.xAxis.gridColor || "#cccccc");
    context.setLineCap('butt');
    context.setLineWidth(1 * opts.pix);
    if (opts.xAxis.gridType == 'dash') {
      context.setLineDash([opts.xAxis.dashLength * opts.pix, opts.xAxis.dashLength * opts.pix]);
    }
    opts.xAxis.gridEval = opts.xAxis.gridEval || 1;
    xAxisPoints.forEach(function(item, index) {
      if (index % opts.xAxis.gridEval == 0) {
        context.beginPath();
        context.moveTo(item, startY);
        context.lineTo(item, endY);
        context.stroke();
      }
    });
    context.setLineDash([]);
  } else if (opts.xAxis.disableGrid !== true && opts.xAxis.customDrawGrid != undefined) {
    opts.xAxis.customDrawGrid(context, xAxisPoints, startY, endY, opts)
  }
  //绘制X轴文案
  if (opts.xAxis.disabled !== true) {
    // 对X轴列表做抽稀处理
    //默认全部显示X轴标签
    let maxXAxisListLength = categories.length;
    //如果设置了X轴单屏数量
    if (opts.xAxis.labelCount) {
      //如果设置X轴密度
      if (opts.xAxis.itemCount) {
        maxXAxisListLength = Math.ceil(categories.length / opts.xAxis.itemCount * opts.xAxis.labelCount);
      } else {
        maxXAxisListLength = opts.xAxis.labelCount;
      }
      maxXAxisListLength -= 1;
    }

    let ratio = Math.ceil(categories.length / maxXAxisListLength);

    let newCategories = [];
    let cgLength = categories.length;
    for (let i = 0; i < cgLength; i++) {
      if (i % ratio !== 0) {
        newCategories.push("");
      } else {
        newCategories.push(categories[i]);
      }
    }
    newCategories[cgLength - 1] = categories[cgLength - 1];
    var xAxisFontSize = opts.xAxis.fontSize * opts.pix || config.fontSize;
    if (config._xAxisTextAngle_ === 0) {
      newCategories.forEach(function(item, index) {
        var xitem = opts.xAxis.formatter ? opts.xAxis.formatter(item,index,opts) : item;
        var offset = -measureText(String(xitem), xAxisFontSize, context) / 2;
        if (boundaryGap == 'center') {
          offset += eachSpacing / 2;
        }
        var scrollHeight = 0;
        if (opts.xAxis.scrollShow) {
          scrollHeight = 6 * opts.pix;
        }
        // 如果在主视图区域内
        var _scrollDistance_ = opts._scrollDistance_ || 0;
        var truePoints = boundaryGap == 'center' ? xAxisPoints[index] + eachSpacing / 2 : xAxisPoints[index];
        if((truePoints - Math.abs(_scrollDistance_)) >= (opts.area[3] - 1) && (truePoints - Math.abs(_scrollDistance_)) <= (opts.width - opts.area[1] + 1)){
          context.beginPath();
          context.setFontSize(xAxisFontSize);
          context.setFillStyle(opts.xAxis.fontColor || opts.fontColor);
          context.fillText(String(xitem), xAxisPoints[index] + offset, startY + opts.xAxis.marginTop * opts.pix + (opts.xAxis.lineHeight - opts.xAxis.fontSize) * opts.pix / 2 + opts.xAxis.fontSize * opts.pix);
          context.closePath();
          context.stroke();
        }
      });
    } else {
      newCategories.forEach(function(item, index) {
        var xitem = opts.xAxis.formatter ? opts.xAxis.formatter(item) : item;
        // 如果在主视图区域内
        var _scrollDistance_ = opts._scrollDistance_ || 0;
        var truePoints = boundaryGap == 'center' ? xAxisPoints[index] + eachSpacing / 2 : xAxisPoints[index];
        if((truePoints - Math.abs(_scrollDistance_)) >= (opts.area[3] - 1) && (truePoints - Math.abs(_scrollDistance_)) <= (opts.width - opts.area[1] + 1)){
          context.save();
          context.beginPath();
          context.setFontSize(xAxisFontSize);
          context.setFillStyle(opts.xAxis.fontColor || opts.fontColor);
          var textWidth = measureText(String(xitem), xAxisFontSize, context);
          var offsetX = xAxisPoints[index];
          if (boundaryGap == 'center') {
            offsetX = xAxisPoints[index] + eachSpacing / 2;
          }
          var scrollHeight = 0;
          if (opts.xAxis.scrollShow) {
            scrollHeight = 6 * opts.pix;
          }
          var offsetY = startY + opts.xAxis.marginTop * opts.pix + xAxisFontSize - xAxisFontSize * Math.abs(Math.sin(config._xAxisTextAngle_));
          if(opts.xAxis.rotateAngle < 0){
            offsetX -= xAxisFontSize / 2;
            textWidth = 0;
          }else{
            offsetX += xAxisFontSize / 2;
            textWidth = -textWidth;
          }
          context.translate(offsetX, offsetY);
          context.rotate(-1 * config._xAxisTextAngle_);
          context.fillText(String(xitem), textWidth , 0 );
          context.closePath();
          context.stroke();
          context.restore();
        }
      });
    }
  }
  context.restore();
  
  //画X轴标题
  if (opts.xAxis.title) {
    context.beginPath();
    context.setFontSize(opts.xAxis.titleFontSize * opts.pix);
    context.setFillStyle(opts.xAxis.titleFontColor);
    context.fillText(String(opts.xAxis.title), opts.width - opts.area[1] + opts.xAxis.titleOffsetX * opts.pix,opts.height - opts.area[2] + opts.xAxis.marginTop * opts.pix + (opts.xAxis.lineHeight - opts.xAxis.titleFontSize) * opts.pix / 2 + (opts.xAxis.titleFontSize + opts.xAxis.titleOffsetY) * opts.pix);
    context.closePath();
    context.stroke();
  }
  
  //绘制X轴轴线
  if (opts.xAxis.axisLine) {
    context.beginPath();
    context.setStrokeStyle(opts.xAxis.axisLineColor);
    context.setLineWidth(1 * opts.pix);
    context.moveTo(startX, opts.height - opts.area[2]);
    context.lineTo(endX, opts.height - opts.area[2]);
    context.stroke();
  }
}

function drawYAxisGrid(categories, opts, config, context) {
  if (opts.yAxis.disableGrid === true) {
    return;
  }
  let spacingValid = opts.height - opts.area[0] - opts.area[2];
  let eachSpacing = spacingValid / opts.yAxis.splitNumber;
  let startX = opts.area[3];
  let xAxisPoints = opts.chartData.xAxisData.xAxisPoints,
    xAxiseachSpacing = opts.chartData.xAxisData.eachSpacing;
  let TotalWidth = xAxiseachSpacing * (xAxisPoints.length - 1);
  if(opts.type == 'mount' && opts.extra && opts.extra.mount && opts.extra.mount.widthRatio && opts.extra.mount.widthRatio > 1 ){
    if(opts.extra.mount.widthRatio>2) opts.extra.mount.widthRatio = 2
    TotalWidth += (opts.extra.mount.widthRatio - 1) * xAxiseachSpacing;
  }
  let endX = startX + TotalWidth;
  let points = [];
  let startY = 1
  if (opts.xAxis.axisLine === false) {
    startY = 0
  }
  for (let i = startY; i < opts.yAxis.splitNumber + 1; i++) {
    points.push(opts.height - opts.area[2] - eachSpacing * i);
  }
  context.save();
  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0) {
    context.translate(opts._scrollDistance_, 0);
  }
  if (opts.yAxis.gridType == 'dash') {
    context.setLineDash([opts.yAxis.dashLength * opts.pix, opts.yAxis.dashLength * opts.pix]);
  }
  context.setStrokeStyle(opts.yAxis.gridColor);
  context.setLineWidth(1 * opts.pix);
  points.forEach(function(item, index) {
    context.beginPath();
    context.moveTo(startX, item);
    context.lineTo(endX, item);
    context.stroke();
  });
  context.setLineDash([]);
  context.restore();
}

function drawYAxis(series, opts, config, context) {
  if (opts.yAxis.disabled === true) {
    return;
  }
  var spacingValid = opts.height - opts.area[0] - opts.area[2];
  var eachSpacing = spacingValid / opts.yAxis.splitNumber;
  var startX = opts.area[3];
  var endX = opts.width - opts.area[1];
  var endY = opts.height - opts.area[2];
  // set YAxis background
  context.beginPath();
  context.setFillStyle(opts.background);
  if (opts.enableScroll == true && opts.xAxis.scrollPosition && opts.xAxis.scrollPosition !== 'left') {
    context.fillRect(0, 0, startX, endY + 2 * opts.pix);
  }
  if (opts.enableScroll == true && opts.xAxis.scrollPosition && opts.xAxis.scrollPosition !== 'right') {
    context.fillRect(endX, 0, opts.width, endY + 2 * opts.pix);
  }
  context.closePath();
  context.stroke();
  
  let tStartLeft = opts.area[3];
  let tStartRight = opts.width - opts.area[1];
  let tStartCenter = opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2;
  if (opts.yAxis.data) {
    for (let i = 0; i < opts.yAxis.data.length; i++) {
      let yData = opts.yAxis.data[i];
      var points = [];
      if(yData.type === 'categories'){
        for (let i = 0; i <= yData.categories.length; i++) {
          points.push(opts.area[0] + spacingValid / yData.categories.length / 2 + spacingValid / yData.categories.length * i);
        }
      }else{
        for (let i = 0; i <= opts.yAxis.splitNumber; i++) {
          points.push(opts.area[0] + eachSpacing * i);
        }
      }
      if (yData.disabled !== true) {
        let rangesFormat = opts.chartData.yAxisData.rangesFormat[i];
        let yAxisFontSize = yData.fontSize ? yData.fontSize * opts.pix : config.fontSize;
        let yAxisWidth = opts.chartData.yAxisData.yAxisWidth[i];
        let textAlign = yData.textAlign || "right";
        //画Y轴刻度及文案
        rangesFormat.forEach(function(item, index) {
          var pos = points[index];
          context.beginPath();
          context.setFontSize(yAxisFontSize);
          context.setLineWidth(1 * opts.pix);
          context.setStrokeStyle(yData.axisLineColor || '#cccccc');
          context.setFillStyle(yData.fontColor || opts.fontColor);
          let tmpstrat = 0;
          let gapwidth = 4 * opts.pix;
          if (yAxisWidth.position == 'left') {
            //画刻度线
            if (yData.calibration == true) {
              context.moveTo(tStartLeft, pos);
              context.lineTo(tStartLeft - 3 * opts.pix, pos);
              gapwidth += 3 * opts.pix;
            }
            //画文字
            switch (textAlign) {
              case "left":
                context.setTextAlign('left');
                tmpstrat = tStartLeft - yAxisWidth.width
                break;
              case "right":
                context.setTextAlign('right');
                tmpstrat = tStartLeft - gapwidth
                break;
              default:
                context.setTextAlign('center');
                tmpstrat = tStartLeft - yAxisWidth.width / 2
            }
            context.fillText(String(item), tmpstrat, pos + yAxisFontSize / 2 - 3 * opts.pix);

          } else if (yAxisWidth.position == 'right') {
            //画刻度线
            if (yData.calibration == true) {
              context.moveTo(tStartRight, pos);
              context.lineTo(tStartRight + 3 * opts.pix, pos);
              gapwidth += 3 * opts.pix;
            }
            switch (textAlign) {
              case "left":
                context.setTextAlign('left');
                tmpstrat = tStartRight + gapwidth
                break;
              case "right":
                context.setTextAlign('right');
                tmpstrat = tStartRight + yAxisWidth.width
                break;
              default:
                context.setTextAlign('center');
                tmpstrat = tStartRight + yAxisWidth.width / 2
            }
            context.fillText(String(item), tmpstrat, pos + yAxisFontSize / 2 - 3 * opts.pix);
          } else if (yAxisWidth.position == 'center') {
            //画刻度线
            if (yData.calibration == true) {
              context.moveTo(tStartCenter, pos);
              context.lineTo(tStartCenter - 3 * opts.pix, pos);
              gapwidth += 3 * opts.pix;
            }
            //画文字
            switch (textAlign) {
              case "left":
                context.setTextAlign('left');
                tmpstrat = tStartCenter - yAxisWidth.width
                break;
              case "right":
                context.setTextAlign('right');
                tmpstrat = tStartCenter - gapwidth
                break;
              default:
                context.setTextAlign('center');
                tmpstrat = tStartCenter - yAxisWidth.width / 2
            }
            context.fillText(String(item), tmpstrat, pos + yAxisFontSize / 2 - 3 * opts.pix);
          }
          context.closePath();
          context.stroke();
          context.setTextAlign('left');
        });
        //画Y轴轴线
        if (yData.axisLine !== false) {
          context.beginPath();
          context.setStrokeStyle(yData.axisLineColor || '#cccccc');
          context.setLineWidth(1 * opts.pix);
          if (yAxisWidth.position == 'left') {
            context.moveTo(tStartLeft, opts.height - opts.area[2]);
            context.lineTo(tStartLeft, opts.area[0]);
          } else if (yAxisWidth.position == 'right') {
            context.moveTo(tStartRight, opts.height - opts.area[2]);
            context.lineTo(tStartRight, opts.area[0]);
          } else if (yAxisWidth.position == 'center') {
            context.moveTo(tStartCenter, opts.height - opts.area[2]);
            context.lineTo(tStartCenter, opts.area[0]);
          }
          context.stroke();
        }
        //画Y轴标题
        if (opts.yAxis.showTitle) {
          let titleFontSize = yData.titleFontSize * opts.pix || config.fontSize;
          let title = yData.title;
          context.beginPath();
          context.setFontSize(titleFontSize);
          context.setFillStyle(yData.titleFontColor || opts.fontColor);
          if (yAxisWidth.position == 'left') {
            context.fillText(title, tStartLeft - measureText(title, titleFontSize, context) / 2 + (yData.titleOffsetX || 0), opts.area[0] - (10 - (yData.titleOffsetY || 0)) * opts.pix);
          } else if (yAxisWidth.position == 'right') {
            context.fillText(title, tStartRight - measureText(title, titleFontSize, context) / 2 + (yData.titleOffsetX || 0), opts.area[0] - (10 - (yData.titleOffsetY || 0)) * opts.pix);
          } else if (yAxisWidth.position == 'center') {
            context.fillText(title, tStartCenter - measureText(title, titleFontSize, context) / 2 + (yData.titleOffsetX || 0), opts.area[0] - (10 - (yData.titleOffsetY || 0)) * opts.pix);
          }
          context.closePath();
          context.stroke();
        }
        if (yAxisWidth.position == 'left') {
          tStartLeft -= (yAxisWidth.width + opts.yAxis.padding * opts.pix);
        } else {
          tStartRight += yAxisWidth.width + opts.yAxis.padding * opts.pix;
        }
      }
    }
  }

}

function drawLegend(series, opts, config, context, chartData) {
  if (opts.legend.show === false) {
    return;
  }
  let legendData = chartData.legendData;
  let legendList = legendData.points;
  let legendArea = legendData.area;
  let padding = opts.legend.padding * opts.pix;
  let fontSize = opts.legend.fontSize * opts.pix;
  let shapeWidth = 15 * opts.pix;
  let shapeRight = 5 * opts.pix;
  let itemGap = opts.legend.itemGap * opts.pix;
  let lineHeight = Math.max(opts.legend.lineHeight * opts.pix, fontSize);
  //画背景及边框
  context.beginPath();
  context.setLineWidth(opts.legend.borderWidth * opts.pix);
  context.setStrokeStyle(opts.legend.borderColor);
  context.setFillStyle(opts.legend.backgroundColor);
  context.moveTo(legendArea.start.x, legendArea.start.y);
  context.rect(legendArea.start.x, legendArea.start.y, legendArea.width, legendArea.height);
  context.closePath();
  context.fill();
  context.stroke();
  legendList.forEach(function(itemList, listIndex) {
    let width = 0;
    let height = 0;
    width = legendData.widthArr[listIndex];
    height = legendData.heightArr[listIndex];
    let startX = 0;
    let startY = 0;
    if (opts.legend.position == 'top' || opts.legend.position == 'bottom') {
      switch (opts.legend.float) {
        case 'left':
          startX = legendArea.start.x + padding;
        break;
        case 'right':
          startX = legendArea.start.x + legendArea.width - width;
        break;
        default:
        startX = legendArea.start.x + (legendArea.width - width) / 2;
      }
      startY = legendArea.start.y + padding + listIndex * lineHeight;
    } else {
      if (listIndex == 0) {
        width = 0;
      } else {
        width = legendData.widthArr[listIndex - 1];
      }
      startX = legendArea.start.x + padding + width;
      startY = legendArea.start.y + padding + (legendArea.height - height) / 2;
    }
    context.setFontSize(config.fontSize);
    for (let i = 0; i < itemList.length; i++) {
      let item = itemList[i];
      item.area = [0, 0, 0, 0];
      item.area[0] = startX;
      item.area[1] = startY;
      item.area[3] = startY + lineHeight;
      context.beginPath();
      context.setLineWidth(1 * opts.pix);
      context.setStrokeStyle(item.show ? item.color : opts.legend.hiddenColor);
      context.setFillStyle(item.show ? item.color : opts.legend.hiddenColor);
      switch (item.legendShape) {
        case 'line':
          context.moveTo(startX, startY + 0.5 * lineHeight - 2 * opts.pix);
          context.fillRect(startX, startY + 0.5 * lineHeight - 2 * opts.pix, 15 * opts.pix, 4 * opts.pix);
          break;
        case 'triangle':
          context.moveTo(startX + 7.5 * opts.pix, startY + 0.5 * lineHeight - 5 * opts.pix);
          context.lineTo(startX + 2.5 * opts.pix, startY + 0.5 * lineHeight + 5 * opts.pix);
          context.lineTo(startX + 12.5 * opts.pix, startY + 0.5 * lineHeight + 5 * opts.pix);
          context.lineTo(startX + 7.5 * opts.pix, startY + 0.5 * lineHeight - 5 * opts.pix);
          break;
        case 'diamond':
          context.moveTo(startX + 7.5 * opts.pix, startY + 0.5 * lineHeight - 5 * opts.pix);
          context.lineTo(startX + 2.5 * opts.pix, startY + 0.5 * lineHeight);
          context.lineTo(startX + 7.5 * opts.pix, startY + 0.5 * lineHeight + 5 * opts.pix);
          context.lineTo(startX + 12.5 * opts.pix, startY + 0.5 * lineHeight);
          context.lineTo(startX + 7.5 * opts.pix, startY + 0.5 * lineHeight - 5 * opts.pix);
          break;
        case 'circle':
          context.moveTo(startX + 7.5 * opts.pix, startY + 0.5 * lineHeight);
          context.arc(startX + 7.5 * opts.pix, startY + 0.5 * lineHeight, 5 * opts.pix, 0, 2 * Math.PI);
          break;
        case 'rect':
          context.moveTo(startX, startY + 0.5 * lineHeight - 5 * opts.pix);
          context.fillRect(startX, startY + 0.5 * lineHeight - 5 * opts.pix, 15 * opts.pix, 10 * opts.pix);
          break;
        case 'square':
          context.moveTo(startX + 5 * opts.pix, startY + 0.5 * lineHeight - 5 * opts.pix);
          context.fillRect(startX + 5 * opts.pix, startY + 0.5 * lineHeight - 5 * opts.pix, 10 * opts.pix, 10 * opts.pix);
          break;
        case 'none':
          break;
        default:
          context.moveTo(startX, startY + 0.5 * lineHeight - 5 * opts.pix);
          context.fillRect(startX, startY + 0.5 * lineHeight - 5 * opts.pix, 15 * opts.pix, 10 * opts.pix);
      }
      context.closePath();
      context.fill();
      context.stroke();
      startX += shapeWidth + shapeRight;
      let fontTrans = 0.5 * lineHeight + 0.5 * fontSize - 2;
      const legendText = item.legendText ? item.legendText : item.name;
      context.beginPath();
      context.setFontSize(fontSize);
      context.setFillStyle(item.show ? opts.legend.fontColor : opts.legend.hiddenColor);
      context.fillText(legendText, startX, startY + fontTrans);
      context.closePath();
      context.stroke();
      if (opts.legend.position == 'top' || opts.legend.position == 'bottom') {
        startX += measureText(legendText, fontSize, context) + itemGap;
        item.area[2] = startX;
      } else {
        item.area[2] = startX + measureText(legendText, fontSize, context) + itemGap;;
        startX -= shapeWidth + shapeRight;
        startY += lineHeight;
      }
    }
  });
}

function drawCanvas(opts, context) {
  context.save();
  context.translate(0, 0.5);
  context.restore();
  context.draw();
}

var Timing = {
  easeIn: function easeIn(pos) {
    return Math.pow(pos, 3);
  },
  easeOut: function easeOut(pos) {
    return Math.pow(pos - 1, 3) + 1;
  },
  easeInOut: function easeInOut(pos) {
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 3);
    } else {
      return 0.5 * (Math.pow(pos - 2, 3) + 2);
    }
  },
  linear: function linear(pos) {
    return pos;
  }
};

function Animation(opts) {
  this.isStop = false;
  opts.duration = typeof opts.duration === 'undefined' ? 1000 : opts.duration;
  opts.timing = opts.timing || 'easeInOut';
  var delay = 17;
  function createAnimationFrame() {
    if (typeof setTimeout !== 'undefined') {
      return function(step, delay) {
        setTimeout(function() {
          var timeStamp = +new Date();
          step(timeStamp);
        }, delay);
      };
    } else if (typeof requestAnimationFrame !== 'undefined') {
      return requestAnimationFrame;
    } else {
      return function(step) {
        step(null);
      };
    }
  };
  var animationFrame = createAnimationFrame();
  var startTimeStamp = null;
  var _step = function step(timestamp) {
    if (timestamp === null || this.isStop === true) {
      opts.onProcess && opts.onProcess(1);
      opts.onAnimationFinish && opts.onAnimationFinish();
      return;
    }
    if (startTimeStamp === null) {
      startTimeStamp = timestamp;
    }
    if (timestamp - startTimeStamp < opts.duration) {
      var process = (timestamp - startTimeStamp) / opts.duration;
      var timingFunction = Timing[opts.timing];
      process = timingFunction(process);
      opts.onProcess && opts.onProcess(process);
      animationFrame(_step, delay);
    } else {
      opts.onProcess && opts.onProcess(1);
      opts.onAnimationFinish && opts.onAnimationFinish();
    }
  };
  _step = _step.bind(this);
  animationFrame(_step, delay);
}

Animation.prototype.stop = function() {
  this.isStop = true;
};

function drawCharts(type, opts, config, context) {
  var _this = this;
  var series = opts.series;
  //兼容ECharts饼图类数据格式
  if (type === 'pie' || type === 'ring' || type === 'mount' || type === 'rose' || type === 'funnel') {
    series = fixPieSeries(series, opts, config);
  }
  var categories = opts.categories;
  if (type === 'mount') {
    categories = [];
    for (let j = 0; j < series.length; j++) {
      if(series[j].show !== false) categories.push(series[j].name)
    }
    opts.categories = categories;
  }
  series = fillSeries(series, opts, config);
  var duration = opts.animation ? opts.duration : 0;
  _this.animationInstance && _this.animationInstance.stop();
  var seriesMA = null;
  if (type == 'candle') {
    let average = assign({}, opts.extra.candle.average);
    if (average.show) {
      seriesMA = calCandleMA(average.day, average.name, average.color, series[0].data);
      seriesMA = fillSeries(seriesMA, opts, config);
      opts.seriesMA = seriesMA;
    } else if (opts.seriesMA) {
      seriesMA = opts.seriesMA = fillSeries(opts.seriesMA, opts, config);
    } else {
      seriesMA = series;
    }
  } else {
    seriesMA = series;
  }
  /* 过滤掉show=false的series */
  opts._series_ = series = filterSeries(series);
  //重新计算图表区域
  opts.area = new Array(4);
  //复位绘图区域
  for (let j = 0; j < 4; j++) {
    opts.area[j] = opts.padding[j] * opts.pix;
  }
  //通过计算三大区域：图例、X轴、Y轴的大小，确定绘图区域
  var _calLegendData = calLegendData(seriesMA, opts, config, opts.chartData, context),
    legendHeight = _calLegendData.area.wholeHeight,
    legendWidth = _calLegendData.area.wholeWidth;

  switch (opts.legend.position) {
    case 'top':
      opts.area[0] += legendHeight;
      break;
    case 'bottom':
      opts.area[2] += legendHeight;
      break;
    case 'left':
      opts.area[3] += legendWidth;
      break;
    case 'right':
      opts.area[1] += legendWidth;
      break;
  }

  let _calYAxisData = {},
    yAxisWidth = 0;
  if (opts.type === 'line' || opts.type === 'column'|| opts.type === 'mount' || opts.type === 'area' || opts.type === 'mix' || opts.type === 'candle' || opts.type === 'scatter'  || opts.type === 'bubble' || opts.type === 'bar') {
      _calYAxisData = calYAxisData(series, opts, config, context);
      yAxisWidth = _calYAxisData.yAxisWidth;
    //如果显示Y轴标题
    if (opts.yAxis.showTitle) {
      let maxTitleHeight = 0;
      for (let i = 0; i < opts.yAxis.data.length; i++) {
        maxTitleHeight = Math.max(maxTitleHeight, opts.yAxis.data[i].titleFontSize ? opts.yAxis.data[i].titleFontSize * opts.pix : config.fontSize)
      }
      opts.area[0] += maxTitleHeight;
    }
    let rightIndex = 0,
      leftIndex = 0;
    //计算主绘图区域左右位置
    for (let i = 0; i < yAxisWidth.length; i++) {
      if (yAxisWidth[i].position == 'left') {
        if (leftIndex > 0) {
          opts.area[3] += yAxisWidth[i].width + opts.yAxis.padding * opts.pix;
        } else {
          opts.area[3] += yAxisWidth[i].width;
        }
        leftIndex += 1;
      } else if (yAxisWidth[i].position == 'right') {
        if (rightIndex > 0) {
          opts.area[1] += yAxisWidth[i].width + opts.yAxis.padding * opts.pix;
        } else {
          opts.area[1] += yAxisWidth[i].width;
        }
        rightIndex += 1;
      }
    }
  } else {
    config.yAxisWidth = yAxisWidth;
  }
  opts.chartData.yAxisData = _calYAxisData;

  if (opts.categories && opts.categories.length && opts.type !== 'radar' && opts.type !== 'gauge' && opts.type !== 'bar') {
    opts.chartData.xAxisData = getXAxisPoints(opts.categories, opts, config);
    let _calCategoriesData = calCategoriesData(opts.categories, opts, config, opts.chartData.xAxisData.eachSpacing, context),
      xAxisHeight = _calCategoriesData.xAxisHeight,
      angle = _calCategoriesData.angle;
    config.xAxisHeight = xAxisHeight;
    config._xAxisTextAngle_ = angle;
    opts.area[2] += xAxisHeight;
    opts.chartData.categoriesData = _calCategoriesData;
  } else {
    if (opts.type === 'line' || opts.type === 'area' || opts.type === 'scatter' || opts.type === 'bubble' || opts.type === 'bar') {
      opts.chartData.xAxisData = calXAxisData(series, opts, config, context);
      categories = opts.chartData.xAxisData.rangesFormat;
      let _calCategoriesData = calCategoriesData(categories, opts, config, opts.chartData.xAxisData.eachSpacing, context),
        xAxisHeight = _calCategoriesData.xAxisHeight,
        angle = _calCategoriesData.angle;
      config.xAxisHeight = xAxisHeight;
      config._xAxisTextAngle_ = angle;
      opts.area[2] += xAxisHeight;
      opts.chartData.categoriesData = _calCategoriesData;
    } else {
      opts.chartData.xAxisData = {
        xAxisPoints: []
      };
    }
  }

  //计算右对齐偏移距离
  if (opts.enableScroll && opts.xAxis.scrollAlign == 'right' && opts._scrollDistance_ === undefined) {
    let offsetLeft = 0,
      xAxisPoints = opts.chartData.xAxisData.xAxisPoints,
      startX = opts.chartData.xAxisData.startX,
      endX = opts.chartData.xAxisData.endX,
      eachSpacing = opts.chartData.xAxisData.eachSpacing;
    let totalWidth = eachSpacing * (xAxisPoints.length - 1);
    let screenWidth = endX - startX;
    offsetLeft = screenWidth - totalWidth;
    _this.scrollOption.currentOffset = offsetLeft;
    _this.scrollOption.startTouchX = offsetLeft;
    _this.scrollOption.distance = 0;
    _this.scrollOption.lastMoveTime = 0;
    opts._scrollDistance_ = offsetLeft;
  }

  
  switch (type) {
    case 'line':
      this.animationInstance = new Animation({
        timing: opts.timing,
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          drawYAxisGrid(categories, opts, config, context);
          drawXAxis(categories, opts, config, context);
          var _drawLineDataPoints = drawLineDataPoints(series, opts, config, context, process),
            xAxisPoints = _drawLineDataPoints.xAxisPoints,
            calPoints = _drawLineDataPoints.calPoints,
            eachSpacing = _drawLineDataPoints.eachSpacing;
          opts.chartData.xAxisPoints = xAxisPoints;
          opts.chartData.calPoints = calPoints;
          opts.chartData.eachSpacing = eachSpacing;
          drawYAxis(series, opts, config, context);
          if (opts.enableMarkLine !== false && process === 1) {
            drawMarkLine(opts, config, context);
          }
          drawLegend(opts.series, opts, config, context, opts.chartData);
          drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.uevent.trigger('renderComplete');
        }
      });
      break;
  }
}

function uChartsEvent() {
  this.events = {};
}

uChartsEvent.prototype.addEventListener = function(type, listener) {
  this.events[type] = this.events[type] || [];
  this.events[type].push(listener);
};

uChartsEvent.prototype.delEventListener = function(type) {
  this.events[type] = [];
};

uChartsEvent.prototype.trigger = function() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  var type = args[0];
  var params = args.slice(1);
  if (!!this.events[type]) {
    this.events[type].forEach(function(listener) {
      try {
        listener.apply(null, params);
      } catch (e) {
          //console.log('[uCharts] '+e);
      }
    });
  }
};

var uCharts = function uCharts(opts) {
  opts.pix = opts.pixelRatio ? opts.pixelRatio : 1;
  opts.fontSize = opts.fontSize ? opts.fontSize : 13;
  opts.fontColor = opts.fontColor ? opts.fontColor : config.fontColor;
  if (opts.background == "" || opts.background == "none") {
    opts.background = "#FFFFFF"
  }
  opts.title = assign({}, opts.title);
  opts.subtitle = assign({}, opts.subtitle);
  opts.duration = opts.duration ? opts.duration : 1000;
  opts.yAxis = assign({}, {
    data: [],
    showTitle: false,
    disabled: false,
    disableGrid: false,
    gridSet: 'number',
    splitNumber: 5,
    gridType: 'solid',
    dashLength: 4 * opts.pix,
    gridColor: '#cccccc',
    padding: 10,
    fontColor: '#666666'
  }, opts.yAxis);
  opts.xAxis = assign({}, {
    rotateLabel: false,
    rotateAngle:45,
    disabled: false,
    disableGrid: false,
    splitNumber: 5,
    calibration:false,
    fontColor: '#666666',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 0,
    gridType: 'solid',
    dashLength: 4,
    scrollAlign: 'left',
    boundaryGap: 'center',
    axisLine: true,
    axisLineColor: '#cccccc',
    titleFontSize: 13,
    titleOffsetY: 0,
    titleOffsetX: 0,
    titleFontColor: '#666666'
  }, opts.xAxis);
  opts.xAxis.scrollPosition = opts.xAxis.scrollAlign;
  opts.legend = assign({}, {
    show: true,
    position: 'bottom',
    float: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
    padding: 5,
    margin: 5,
    itemGap: 10,
    fontSize: opts.fontSize,
    lineHeight: opts.fontSize,
    fontColor: opts.fontColor,
    formatter: {},
    hiddenColor: '#CECECE'
  }, opts.legend);
  opts.extra = assign({
    tooltip:{
      legendShape: 'auto'
    }
  }, opts.extra);
  opts.rotate = opts.rotate ? true : false;
  opts.animation = opts.animation ? true : false;
  opts.rotate = opts.rotate ? true : false;
  opts.canvas2d = opts.canvas2d ? true : false;
  
  let config$$1 = assign({}, config);
  config$$1.color = opts.color ? opts.color : config$$1.color;
  config$$1.pieChartTextPadding = opts.dataLabel === false ? 0 : config$$1.pieChartTextPadding * opts.pix;

  //屏幕旋转
  config$$1.rotate = opts.rotate;
  if (opts.rotate) {
    let tempWidth = opts.width;
    let tempHeight = opts.height;
    opts.width = tempHeight;
    opts.height = tempWidth;
  }

  //适配高分屏
  opts.padding = opts.padding ? opts.padding : config$$1.padding;
  config$$1.yAxisWidth = config.yAxisWidth * opts.pix;
  config$$1.fontSize = opts.fontSize * opts.pix;
  config$$1.titleFontSize = config.titleFontSize * opts.pix;
  config$$1.subtitleFontSize = config.subtitleFontSize * opts.pix;
  if(!opts.context){
    throw new Error('[uCharts] 未获取到context！注意：v2.0版本后，需要自行获取canvas的绘图上下文并传入opts.context！');
  }
  this.context = opts.context;
  if (!this.context.setTextAlign) {
    this.context.setStrokeStyle = function(e) {
      return this.strokeStyle = e;
    }
    this.context.setLineWidth = function(e) {
      return this.lineWidth = e;
    }
    this.context.setLineCap = function(e) {
      return this.lineCap = e;
    }
    this.context.setFontSize = function(e) {
      return this.font = e + "px sans-serif";
    }
    this.context.setFillStyle = function(e) {
      return this.fillStyle = e;
    }
    this.context.setTextAlign = function(e) {
      return this.textAlign = e;
    }
    this.context.setTextBaseline = function(e) {
      return this.textBaseline = e;
    }
    this.context.setShadow = function(offsetX,offsetY,blur,color) {
      this.shadowColor = color;
      this.shadowOffsetX = offsetX;
      this.shadowOffsetY = offsetY;
      this.shadowBlur = blur;
    }
    this.context.draw = function() {}
  }
  //兼容NVUEsetLineDash
  if(!this.context.setLineDash){
    this.context.setLineDash = function(e) {}
  }
  opts.chartData = {};
  this.uevent = new uChartsEvent();
  this.scrollOption = {
    currentOffset: 0,
    startTouchX: 0,
    distance: 0,
    lastMoveTime: 0
  };
  this.opts = opts;
  this.config = config$$1;
  drawCharts.call(this, opts.type, opts, config$$1, this.context);
};

uCharts.prototype.updateData = function() {
  let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  this.opts = assign({}, this.opts, data);
  this.opts.updateData = true;
  let scrollPosition = data.scrollPosition || 'current';
  switch (scrollPosition) {
    case 'current':
      this.opts._scrollDistance_ = this.scrollOption.currentOffset;
      break;
    case 'left':
      this.opts._scrollDistance_ = 0;
      this.scrollOption = {
        currentOffset: 0,
        startTouchX: 0,
        distance: 0,
        lastMoveTime: 0
      };
      break;
    case 'right':
      let _calYAxisData = calYAxisData(this.opts.series, this.opts, this.config, this.context), yAxisWidth = _calYAxisData.yAxisWidth;
      this.config.yAxisWidth = yAxisWidth;
      let offsetLeft = 0;
      let _getXAxisPoints0 = getXAxisPoints(this.opts.categories, this.opts, this.config), xAxisPoints = _getXAxisPoints0.xAxisPoints,
        startX = _getXAxisPoints0.startX,
        endX = _getXAxisPoints0.endX,
        eachSpacing = _getXAxisPoints0.eachSpacing;
      let totalWidth = eachSpacing * (xAxisPoints.length - 1);
      let screenWidth = endX - startX;
      offsetLeft = screenWidth - totalWidth;
      this.scrollOption = {
        currentOffset: offsetLeft,
        startTouchX: offsetLeft,
        distance: 0,
        lastMoveTime: 0
      };
      this.opts._scrollDistance_ = offsetLeft;
      break;
  }
  drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
};

uCharts.prototype.zoom = function() {
  var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.opts.xAxis.itemCount;
  if (this.opts.enableScroll !== true) {
    console.log('[uCharts] 请启用滚动条后使用')
    return;
  }
  //当前屏幕中间点
  let centerPoint = Math.round(Math.abs(this.scrollOption.currentOffset) / this.opts.chartData.eachSpacing) + Math.round(this.opts.xAxis.itemCount / 2);
  this.opts.animation = false;
  this.opts.xAxis.itemCount = val.itemCount;
  //重新计算x轴偏移距离
  let _calYAxisData = calYAxisData(this.opts.series, this.opts, this.config, this.context),
    yAxisWidth = _calYAxisData.yAxisWidth;
  this.config.yAxisWidth = yAxisWidth;
  let offsetLeft = 0;
  let _getXAxisPoints0 = getXAxisPoints(this.opts.categories, this.opts, this.config),
    xAxisPoints = _getXAxisPoints0.xAxisPoints,
    startX = _getXAxisPoints0.startX,
    endX = _getXAxisPoints0.endX,
    eachSpacing = _getXAxisPoints0.eachSpacing;
  let centerLeft = eachSpacing * centerPoint;
  let screenWidth = endX - startX;
  let MaxLeft = screenWidth - eachSpacing * (xAxisPoints.length - 1);
  offsetLeft = screenWidth / 2 - centerLeft;
  if (offsetLeft > 0) {
    offsetLeft = 0;
  }
  if (offsetLeft < MaxLeft) {
    offsetLeft = MaxLeft;
  }
  this.scrollOption = {
    currentOffset: offsetLeft,
    startTouchX: 0,
    distance: 0,
    lastMoveTime: 0
  };
  calValidDistance(this, offsetLeft, this.opts.chartData, this.config, this.opts);
  this.opts._scrollDistance_ = offsetLeft;
  drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
};

uCharts.prototype.dobuleZoom = function(e) {
  if (this.opts.enableScroll !== true) {
    console.log('[uCharts] 请启用滚动条后使用')
    return;
  }
  const tcs = e.changedTouches;
  if (tcs.length < 2) {
    return;
  }
  for (var i = 0; i < tcs.length; i++) {
    tcs[i].x = tcs[i].x ? tcs[i].x : tcs[i].clientX;
    tcs[i].y = tcs[i].y ? tcs[i].y : tcs[i].clientY;
  }
  const ntcs = [getTouches(tcs[0], this.opts, e),getTouches(tcs[1], this.opts, e)]; 
  const xlength = Math.abs(ntcs[0].x - ntcs[1].x);
  // 记录初始的两指之间的数据
  if(!this.scrollOption.moveCount){
    let cts0 = {changedTouches:[{x:tcs[0].x,y:this.opts.area[0] / this.opts.pix + 2}]};
    let cts1 = {changedTouches:[{x:tcs[1].x,y:this.opts.area[0] / this.opts.pix + 2}]};
    if(this.opts.rotate){
      cts0 = {changedTouches:[{x:this.opts.height / this.opts.pix - this.opts.area[0] / this.opts.pix - 2,y:tcs[0].y}]};
      cts1 = {changedTouches:[{x:this.opts.height / this.opts.pix - this.opts.area[0] / this.opts.pix - 2,y:tcs[1].y}]};
    }
    const moveCurrent1 = this.getCurrentDataIndex(cts0).index;
    const moveCurrent2 = this.getCurrentDataIndex(cts1).index;
    const moveCount = Math.abs(moveCurrent1 - moveCurrent2);
    this.scrollOption.moveCount = moveCount;
    this.scrollOption.moveCurrent1 = Math.min(moveCurrent1, moveCurrent2);
    this.scrollOption.moveCurrent2 = Math.max(moveCurrent1, moveCurrent2);
    return;
  }
  
  let currentEachSpacing = xlength / this.scrollOption.moveCount;
  let itemCount = (this.opts.width - this.opts.area[1] - this.opts.area[3]) / currentEachSpacing;
  itemCount = itemCount <= 2 ? 2 : itemCount;
  itemCount = itemCount >= this.opts.categories.length ? this.opts.categories.length : itemCount;
  this.opts.animation = false;
  this.opts.xAxis.itemCount = itemCount;
  // 重新计算滚动条偏移距离
  let offsetLeft = 0;
  let _getXAxisPoints0 = getXAxisPoints(this.opts.categories, this.opts, this.config),
    xAxisPoints = _getXAxisPoints0.xAxisPoints,
    startX = _getXAxisPoints0.startX,
    endX = _getXAxisPoints0.endX,
    eachSpacing = _getXAxisPoints0.eachSpacing;
  let currentLeft = eachSpacing * this.scrollOption.moveCurrent1;
  let screenWidth = endX - startX;
  let MaxLeft = screenWidth - eachSpacing * (xAxisPoints.length - 1);
  offsetLeft = -currentLeft+Math.min(ntcs[0].x,ntcs[1].x)-this.opts.area[3]-eachSpacing;
  if (offsetLeft > 0) {
    offsetLeft = 0;
  }
  if (offsetLeft < MaxLeft) {
    offsetLeft = MaxLeft;
  }
  this.scrollOption.currentOffset= offsetLeft;
  this.scrollOption.startTouchX= 0;
  this.scrollOption.distance=0;
  calValidDistance(this, offsetLeft, this.opts.chartData, this.config, this.opts);
  this.opts._scrollDistance_ = offsetLeft;
  drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
}

uCharts.prototype.stopAnimation = function() {
  this.animationInstance && this.animationInstance.stop();
};

uCharts.prototype.addEventListener = function(type, listener) {
  this.uevent.addEventListener(type, listener);
};

uCharts.prototype.delEventListener = function(type) {
  this.uevent.delEventListener(type);
};

uCharts.prototype.getCurrentDataIndex = function(e) {
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  if (touches) {
    let _touches$ = getTouches(touches, this.opts, e);
    if (this.opts.type === 'pie' || this.opts.type === 'ring') {
      return findPieChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y
      }, this.opts.chartData.pieData, this.opts);
    } else if (this.opts.type === 'rose') {
      return findRoseChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y
      }, this.opts.chartData.pieData, this.opts);
    } else if (this.opts.type === 'radar') {
      return findRadarChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y
      }, this.opts.chartData.radarData, this.opts.categories.length);
    } else if (this.opts.type === 'funnel') {
      return findFunnelChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y
      }, this.opts.chartData.funnelData);
    } else if (this.opts.type === 'map') {
      return findMapChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y
      }, this.opts);
    } else if (this.opts.type === 'word') {
      return findWordChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y
      }, this.opts.chartData.wordCloudData);
    } else if (this.opts.type === 'bar') {
      return findBarChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y
      }, this.opts.chartData.calPoints, this.opts, this.config, Math.abs(this.scrollOption.currentOffset));
    } else {
      return findCurrentIndex({
        x: _touches$.x,
        y: _touches$.y
      }, this.opts.chartData.calPoints, this.opts, this.config, Math.abs(this.scrollOption.currentOffset));
    }
  }
  return -1;
};

uCharts.prototype.getLegendDataIndex = function(e) {
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  if (touches) {
    let _touches$ = getTouches(touches, this.opts, e);
    return findLegendIndex({
      x: _touches$.x,
      y: _touches$.y
    }, this.opts.chartData.legendData);
  }
  return -1;
};

uCharts.prototype.touchLegend = function(e) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  if (touches) {
    var _touches$ = getTouches(touches, this.opts, e);
    var index = this.getLegendDataIndex(e);
    if (index >= 0) {
      if (this.opts.type == 'candle') {
        this.opts.seriesMA[index].show = !this.opts.seriesMA[index].show;
      } else {
        this.opts.series[index].show = !this.opts.series[index].show;
      }
      this.opts.animation = option.animation ? true : false;
      this.opts._scrollDistance_ = this.scrollOption.currentOffset;
      drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
    }
  }

};

uCharts.prototype.showToolTip = function(e) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  if (!touches) {
    console.log("[uCharts] 未获取到event坐标信息");
  }
  var _touches$ = getTouches(touches, this.opts, e);
  var currentOffset = this.scrollOption.currentOffset;
  var opts = assign({}, this.opts, {
    _scrollDistance_: currentOffset,
    animation: false
  });
  if (this.opts.type === 'line' || this.opts.type === 'area' || this.opts.type === 'column' || this.opts.type === 'scatter' || this.opts.type === 'bubble') {
    var current = this.getCurrentDataIndex(e);
    var index = option.index == undefined ? current.index : option.index;
    if (index > -1 || index.length>0) {
      var seriesData = getSeriesDataItem(this.opts.series, index, current.group);
      if (seriesData.length !== 0) {
        var _getToolTipData = getToolTipData(seriesData, this.opts, index, current.group, this.opts.categories, option),
          textList = _getToolTipData.textList,
          offset = _getToolTipData.offset;
        offset.y = _touches$.y;
        opts.tooltip = {
          textList: option.textList !== undefined ? option.textList : textList,
          offset: option.offset !== undefined ? option.offset : offset,
          option: option,
          index: index,
          group: current.group
        };
      }
    }
    drawCharts.call(this, opts.type, opts, this.config, this.context);
  }
  if (this.opts.type === 'pie' || this.opts.type === 'ring' || this.opts.type === 'rose' || this.opts.type === 'funnel') {
    var index = option.index == undefined ? this.getCurrentDataIndex(e) : option.index;
    if (index > -1) {
      var opts = assign({}, this.opts, {animation: false});
      var seriesData = assign({}, opts._series_[index]);
      var textList = [{
        text: option.formatter ? option.formatter(seriesData, undefined, index, opts) : seriesData.name + ': ' + seriesData.data,
        color: seriesData.color,
        legendShape: this.opts.extra.tooltip.legendShape == 'auto' ? seriesData.legendShape : this.opts.extra.tooltip.legendShape
      }];
      var offset = {
        x: _touches$.x,
        y: _touches$.y
      };
      opts.tooltip = {
        textList: option.textList ? option.textList : textList,
        offset: option.offset !== undefined ? option.offset : offset,
        option: option,
        index: index
      };
    }
    drawCharts.call(this, opts.type, opts, this.config, this.context);
  }
};

uCharts.prototype.translate = function(distance) {
  this.scrollOption = {
    currentOffset: distance,
    startTouchX: distance,
    distance: 0,
    lastMoveTime: 0
  };
  let opts = assign({}, this.opts, {
    _scrollDistance_: distance,
    animation: false
  });
  drawCharts.call(this, this.opts.type, opts, this.config, this.context);
};

uCharts.prototype.scrollStart = function(e) {
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  var _touches$ = getTouches(touches, this.opts, e);
  if (touches && this.opts.enableScroll === true) {
    this.scrollOption.startTouchX = _touches$.x;
  }
};

uCharts.prototype.scroll = function(e) {
  if (this.scrollOption.lastMoveTime === 0) {
    this.scrollOption.lastMoveTime = Date.now();
  }
  let Limit = this.opts.touchMoveLimit || 60;
  let currMoveTime = Date.now();
  let duration = currMoveTime - this.scrollOption.lastMoveTime;
  if (duration < Math.floor(1000 / Limit)) return;
  if (this.scrollOption.startTouchX == 0) return;
  this.scrollOption.lastMoveTime = currMoveTime;
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  if (touches && this.opts.enableScroll === true) {
    var _touches$ = getTouches(touches, this.opts, e);
    var _distance;
    _distance = _touches$.x - this.scrollOption.startTouchX;
    var currentOffset = this.scrollOption.currentOffset;
    var validDistance = calValidDistance(this, currentOffset + _distance, this.opts.chartData, this.config, this.opts);
    this.scrollOption.distance = _distance = validDistance - currentOffset;
    var opts = assign({}, this.opts, {
      _scrollDistance_: currentOffset + _distance,
      animation: false
    });
		this.opts = opts;
    drawCharts.call(this, opts.type, opts, this.config, this.context);
    return currentOffset + _distance;
  }
};

uCharts.prototype.scrollEnd = function(e) {
  if (this.opts.enableScroll === true) {
    var _scrollOption = this.scrollOption,
      currentOffset = _scrollOption.currentOffset,
      distance = _scrollOption.distance;
    this.scrollOption.currentOffset = currentOffset + distance;
    this.scrollOption.distance = 0;
    this.scrollOption.moveCount = 0;
  }
};

export default uCharts;