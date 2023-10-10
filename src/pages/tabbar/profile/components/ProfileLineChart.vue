<template>
  <view class="root">
    <canvas class="charts" 
            :style="{visibility: canvasVisible ? 'inherit' : 'hidden'}"
            :canvas-id="canvasId" 
            :id="canvasId" 
            type="2d" 
            @touchend="tap"/>
    <image v-if="canvasVisible == false" 
            class="fakeCanvas" :src="fakeCanvasSrc"
            mode="fill" />
  </view>
</template>

<script>
import uCharts from '@components/u-charts/u-charts.js'
import { guid, isEmptyObj, trunc } from '@utils/index'

var uChartsInstance = {};
export default {
  props: {
    inputData: {
      type: [Object, undefined],
      default: undefined,
    },
  },
  data() {
    return {
      canvasId: guid(),
      canvasVisible: true,  // 是否显示 canvas 的内容，主要为了小程序模拟器 canvas 浮动问题。
      fakeCanvasSrc: undefined,
      dataMultiply: 100, // 通过倍数，避免 ucharts 在显示小数时的问题。如 最大值4.8，不会放到最高位置，最高位置会是 5. 同时避免每组数值相同，位置显示不一致的问题。
      maxLength: 10, // 设置最多显示的数据点，也用于屏蔽作为额外标点的去除。代码中，会填充显示外的最大最小值，缩减曲线在 y 轴上的显示范围。
      isCanvasReady: false,
      cWidth: 750,
      cHeight: 500,
      pixelRatio: 2,
      padding: [0, 0, 0, 0],
      fontFamily: 'Rubik-Med-ASCII'
    };
  },
  mounted() {
    const sysInfo = uni.getSystemInfoSync();
    // 模拟器，隐藏 canvas，并在绘制完成后生成图片，并用 fakeCanvas 来显示。
    this.canvasVisible = sysInfo.platform === 'devtools' ? false : true;
    this.pixelRatio = sysInfo.pixelRatio;
    this.padding = [
      uni.upx2px(24),
      uni.upx2px(44),
      1,
      uni.upx2px(40),
    ]

    uni.createSelectorQuery()
      .in(this)
      .select('.root')
      .boundingClientRect(({ width, height }) => {

        //这里的 750 对应 css .charts 的 width
        this.cWidth = width;
        //这里的 500 对应 css .charts 的 height
        this.cHeight = height;
        
        this.isCanvasReady = true;
      })
      .exec();
  },
  computed: {
    shouldDrawData() {
      return this.isCanvasReady
    },
    chartData() {
      if (this.isCanvasReady == false) return null;

      const maxLength = this.maxLength
      const textOffset = uni.upx2px(-8)
      const textColor = '#000';
      const textDrawHandler = this.customDrawPointText;
      const pointShapeHandler = this.customDrawPointShape;

      var dataForChar = [...(this.inputData.data || [])].splice(0, maxLength);
      
      const minValue = Math.min(...dataForChar)
      const maxValue = Math.max(...dataForChar)
      let gapValue = maxValue - minValue;
      if (gapValue == 0) { // 数据值相同, 间隔值使用定义的倍数 * 2 来规避每组数值均相同，位置不一致的问题。同时避免全 0 的情况
        gapValue = this.dataMultiply * 2;
      }
      
      // 用 null 填充数组，使得其可以在后面添加最大最小值，缩减曲线在 y 轴上的显示范围。
      if (dataForChar.length < maxLength) {
        const lastLength = dataForChar.length;
        dataForChar.length = maxLength;
        dataForChar.fill(null, lastLength, maxLength) 
      }

      // 填充显示外的最大最小值，缩减曲线在 y 轴上的显示范围。
      if (minValue != Infinity) {
        dataForChar.push(minValue - gapValue * 52 / 180);
      }
      if (maxValue != -Infinity) {
        dataForChar.push(maxValue + gapValue * 30 / 180);
      }

      dataForChar = dataForChar.map((val) => {
        return val === null ? val : val * this.dataMultiply;
      })

      return {
        categories: ["0","1","2","3","4","5","6","7","8","9"],
        series: [
          {
            name: "",
            data: dataForChar,
            textOffset: textOffset,
            textColor: textColor,
            customDrawPointText: textDrawHandler,
            customDrawPointShape: pointShapeHandler,
          }
        ]
      };
    }
  },
  watch: {
    chartData(nVal, oVal) {
      if (oVal == null && nVal != null) {
        this.drawCharts(this.canvasId, nVal)
      } else if (oVal != null && nVal != null) {
        uChartsInstance[this.canvasId]?.updateData({
          grOpts: {
            maxLength: this.maxLength,
          },
          categories: nVal.categories,
          series: nVal.series,
        })
      } 
    },
  },
  methods: {

    drawCharts(id, data) {
      const query = uni.createSelectorQuery().in(this);
      query.select('#' + id).fields({ node: true, size: true }).exec(res => {
        if (res[0]) {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          canvas.width = res[0].width * this.pixelRatio;
          canvas.height = res[0].height * this.pixelRatio;
          const chart = new uCharts({
            grOpts: {
              maxLength: this.maxLength,
            },
            type: "line",
            context: ctx,
            width: this.cWidth * this.pixelRatio,
            height: this.cHeight * this.pixelRatio,
            categories: data.categories,
            series: data.series,
            pixelRatio: this.pixelRatio,
            animation: false,
            timing: "easeOut",
            duration: 1000,
            rotate: false,
            rotateLock: false,
            background: "#FFFFFF",
            color: ["#E8E8E8", "#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
            padding: this.padding,
            fontSize: 20,
            fontColor: "#9f07f5",
            dataLabel: true,
            dataPointShape: true,
            dataPointShapeType: "hollow",
            touchMoveLimit: 60,
            enableScroll: false,
            enableMarkLine: false,
            legend: {
              show: false,
              position: "bottom",
              float: "center",
              padding: 5,
              margin: 5,
              backgroundColor: "rgba(0,0,0,0)",
              borderColor: "rgba(0,0,0,0)",
              borderWidth: 0,
              fontSize: 13,
              fontColor: "#666666",
              lineHeight: 11,
              hiddenColor: "#CECECE",
              itemGap: 10
            },
            xAxis: {
              disableGrid: false,
              disabled: true,
              axisLine: false,
              axisLineColor: "#CCCCCC", 
              calibration: false,
              fontColor: "#db2020",
              fontSize: 20,
              lineHeight: 20,
              marginTop: 0,
              rotateLabel: false,
              rotateAngle: 45,
              itemCount: 5,
              boundaryGap: "justify",
              splitNumber: 5,
              gridColor: "#CCCCCC",
              gridType: "solid",
              dashLength: 4,
              gridEval: 1,
              scrollShow: false,
              scrollAlign: "left",
              scrollColor: "#A6A6A6",
              scrollBackgroundColor: "#EFEBEF",
              title: "",
              titleFontSize: 20,
              titleOffsetY: 0,
              titleOffsetX: 0,
              titleFontColor: "#666666",
              formatter: "",
              customDrawGrid: this.customDrawGrid,
            },
            yAxis: {
              gridType: "dash",
              dashLength: 2,
              disabled: true,
              disableGrid: true,
              splitNumber: 5,
              gridColor: "#CCCCCC",
              padding: 10,
              showTitle: false,
              data: []
            },
            extra: {
              line: {
                type: "straight",
                width: 2,
                activeType: "hollow",
                linearType: "none",
                onShadow: true,
                animation: "vertical"
              },
              tooltip: {
                showBox: true,
                showArrow: true,
                showCategory: false,
                borderWidth: 0,
                borderRadius: 0,
                borderColor: "#000000",
                borderOpacity: 0.7,
                bgColor: "#000000",
                bgOpacity: 0.7,
                gridType: "solid",
                dashLength: 4,
                gridColor: "#CCCCCC",
                boxPadding: 3,
                fontSize: 13,
                lineHeight: 20,
                fontColor: "#FFFFFF",
                legendShow: true,
                legendShape: "auto",
                splitLine: true,
                horizentalLine: false,
                xAxisLabel: false,
                yAxisLabel: false,
                labelBgColor: "#FFFFFF",
                labelBgOpacity: 0.7,
                labelFontColor: "#666666"
              },
              markLine: {
                type: "solid",
                dashLength: 4,
                data: []
              }
            }
          });
          uChartsInstance[id] = chart
          chart.addEventListener('renderComplete', () => {
            if (this.canvasVisible == false) {
              const image = canvas.toDataURL('image/png')
              this.fakeCanvasSrc = image;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          })
        } else {
          console.error("[uCharts]: 未获取到 context");
        }
      });
    },
    tap(e) {
      // uChartsInstance[e.target.id].touchLegend(e);
      // uChartsInstance[e.target.id].showToolTip(e);
    },

    /**
     * 自定义 Grid 的绘制
     * @param {*} context 
     * @param {*} xAxisPoints 
     * @param {*} opts 
     */
    customDrawGrid(context, xAxisPoints, startY, endY, opts) {
      var gradient = context.createLinearGradient(0, 0, 0, this.cHeight * opts.pix);
      // 给渐变对象添加渐变色
      gradient.addColorStop(0,'#FFFFFF00');
      gradient.addColorStop(0.5,'#F1F1F1');
      gradient.addColorStop(1.0,'#FFFFFF00');
      // 把渐变对象给到样式填充图形
      context.setStrokeStyle(gradient);

      // context.setStrokeStyle(opts.xAxis.gridColor || "#cccccc");
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
    },
    
    /**
     * 自定义数据点的绘制
     * @param {*} points 
     * @param {*} color 
     * @param {*} shape 
     * @param {*} context 
     * @param {*} opts 
     */
    customDrawPointShape(points, series, context, opts) {
      const color = series.color;
      const shape = series.pointShape;

      context.beginPath();

      context.setStrokeStyle('#9FBE3D');
      context.setFillStyle(opts.background);
      context.setLineWidth(2.0 * opts.pix);

      // Draw in hollow
      points.forEach(function (item, index) {
        // 超出需要显示的范围，不做处理
        if (index >= (opts.grOpts?.maxLength || Infinity)) {
          return;
        }
        if (item !== null) {
          context.moveTo(item.x + 2.5 * opts.pix, item.y);
          context.arc(item.x, item.y, 2.5 * opts.pix, 0, 2 * Math.PI, false);
        }
      });

      // // Draw in circle
      // points.forEach(function (item, index) {
      //   if (item !== null) {
      //     context.moveTo(item.x + 2.5 * opts.pix, item.y);
      //     context.arc(item.x, item.y, 3.5 * opts.pix, 0, 2 * Math.PI, false);
      //   }
      // });

      context.closePath();
      context.fill();
      context.stroke();
      return true;
    },

    customDrawPointText(context, formatVal, item, index, textOffset, series, opts, measureText) {
      // console.log('customDrawPointText', context, formatVal, item, index, series, opts)

      if (index >= (opts.grOpts?.maxLength || Infinity)) {
        context.closePath();
        return true;
      }
      
      formatVal = formatVal === null ? formatVal : formatVal / this.dataMultiply;
      formatVal = Number(formatVal.toFixed(1))

      const scale = opts.pix || opts.pixelRatio;

      const intFontSize = uni.upx2px(20 * scale);
      const fractionFontSize = uni.upx2px(16 * scale);
      const intFontConf = `600 ${intFontSize}px ${this.fontFamily}`
      const fractionFontConf = `600 ${fractionFontSize}px ${this.fontFamily}`

      const intAndPoint = this.parseIntAndPoint(formatVal)
      const fraction = this.scoreFraction(formatVal)

      context.font = intFontConf
      const intAndPointTextWidth = context.measureText(intAndPoint).width
      context.font = fractionFontConf
      const fractionTextWidth = context.measureText(fraction).width
      const totalWidth = intAndPointTextWidth + fractionTextWidth

      const yOffset = item.y - 3.5 * opts.pix + textOffset * scale; // TODO: replace 4 with actual half point width
      {
        context.setTextAlign('left');
        context.font = intFontConf
        context.fillText(
          String(intAndPoint),
          item.x - totalWidth / 2,
          yOffset,
        );
      }
      {
        context.setTextAlign('left');
        context.font = fractionFontConf
        context.fillText(
          String(fraction),
          item.x - totalWidth / 2 + intAndPointTextWidth,
          yOffset,
        );
      }
      context.closePath();
      context.stroke();
      context.setTextAlign('left');
      return true;
    },

    parseIntAndPoint(value) {
      return '' + trunc(value) + (this.scoreFraction(value).length > 0 ? '.' : '')
    },
    scoreFraction(value) {
      const fraction = value % 1;
      if (fraction == 0) return ''
      return fraction.toFixed(1).split('.')[1];
    },
  }
};
</script>

<style scoped>
.root {
  position: relative;
  width: 100%;
  height: 100%;
}
.charts{
  width: 100%;
  height: 100%;
}
.fakeCanvas {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>