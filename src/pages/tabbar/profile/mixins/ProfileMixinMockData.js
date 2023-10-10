/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */

// vuex


var mixinObj = {}

if (process.env.NODE_ENV === 'development') {
  mixinObj = {
    methods: {

      /**
       * 差点数据
       * @returns 
       */
      mockLargeData() {
        return {
          best: {
            score: 0,
            comparing: '超64%球友',
            enTitle: 'Best Score',
            cnTitle: '最佳杆数',
          },
          average:  {
            score: undefined,
            comparing: undefined,
            enTitle: 'Average Score',
            cnTitle: '平均杆数',
          },
          course: {
            score: 86,
            enTitle: 'Courses\nPlayed',
            cnTitle: '打过球场',
          },
          times: {
            score: 102,
            enTitle: 'Games\nPlayed',
            cnTitle: '比赛次数',
          },
          handicap: {
            title: 'Hcp',
            score: 8.2,
            comparing: '超92%球友',
            enTitle: 'Handicap',
            cnTitle: '差点',
          }
        }
      },

      /**
       * 最近比赛的数据
       * @returns 
       */
      mockRecentData() {
        return {
          data: [81, 78, 80, 82, 79, 74, 77, 76, 74, 73, 999, 999],
          diagramEnTitle: "Data in Last 10 Games",
          diagramCnTitle: "最近十场杆数走势",
          diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
          diagramCoverEmptyTitle: "暂无球局数据",
          diagramFootnoteL: "最前一场",
          diagramFootnoteR: "最后一场",
        };
      },

      /**
       * 球洞相关数据
       * @returns 
       */
      mockHoleData() {
        return {
          isPublic: false,
          items: [
            {
              type: 'par_3',
              enTitle: "Par 3 av. Score",
              cnTitle: "三杆洞单场平均杆",
              data: [4.8, 4.3, 3.8, 3.5, 4.3, 4.4, 3.5, 4.2, 3, 3.8, 777, 444],
              diagramEnTitle: "Data in Last 10 Games",
              diagramCnTitle: "最近十场杆数走势",
              diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
              diagramCoverEmptyTitle: "暂无球局数据",
              diagramFootnoteL: "最前一场",
              diagramFootnoteR: "最后一场",
            },
            {
              type: 'par_4',
              enTitle: "Par 4 av. Score",
              cnTitle: "四杆洞单场平均杆",
              data: undefined,
              diagramEnTitle: "Data in Last 10 Games",
              diagramCnTitle: "最近十场杆数走势",
              diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
              diagramCoverEmptyTitle: "暂无球局数据",
              diagramFootnoteL: "最前一场",
              diagramFootnoteR: "最后一场",
            },
            {
              type: 'par_5',
              enTitle: "Par 5 av. Score",
              cnTitle: "五杆洞单场平均杆",
              data: [81, 78, 80, 82, 79, 74, 77, 76, 74, 73, 999, 999],
              diagramEnTitle: "Data in Last 10 Games",
              diagramCnTitle: "最近十场杆数走势",
              diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
              diagramCoverEmptyTitle: "暂无球局数据",
              diagramFootnoteL: "最前一场",
              diagramFootnoteR: "最后一场",
            },
          ],
        };
      },

      /**
       * 球洞相关数据
       * @returns 
       */
      mockScoreTypesData() {
        return {
          isPublic: false,
          items: [
            {
              type: 'eagles',
              enTitle: "Eagles -",
              cnTitle: "老鹰 (-2)或更好",
              data: [],
              diagramEnTitle: "Data in Last 10 Games",
              diagramCnTitle: "最近十场杆数走势",
              diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
              diagramCoverEmptyTitle: "暂无球局数据",
              diagramFootnoteL: "最前一场",
              diagramFootnoteR: "最后一场",
            },
            {
              type: 'birdies',
              enTitle: "Birdies",
              cnTitle: "小鸟 (-1)",
              data: undefined,
              diagramEnTitle: "Data in Last 10 Games",
              diagramCnTitle: "最近十场杆数走势",
              diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
              diagramCoverEmptyTitle: "暂无球局数据",
              diagramFootnoteL: "最前一场",
              diagramFootnoteR: "最后一场",
            },
            {
              type: 'pars',
              enTitle: "Pars",
              cnTitle: "标准杆 (0)",
              data: [3, 1, 4, 9, 2, 3, 6, 6, 5, 5,],
              diagramEnTitle: "Data in Last 10 Games",
              diagramCnTitle: "最近十场杆数走势",
              diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
              diagramCoverEmptyTitle: "暂无球局数据",
              diagramFootnoteL: "最前一场",
              diagramFootnoteR: "最后一场",
            },
            {
              type: 'bogeys',
              enTitle: "Bogeys",
              cnTitle: "帕忌 (+1)",
              data: [3, 1, 4, 9, 2, 3, 6, 6, 5, 5, 999, 999, 999],
              diagramEnTitle: "Data in Last 10 Games",
              diagramCnTitle: "最近十场杆数走势",
              diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
              diagramCoverEmptyTitle: "暂无球局数据",
              diagramFootnoteL: "最前一场",
              diagramFootnoteR: "最后一场",
            },
            {
              type: 'double_bogeys',
              enTitle: "Double Bogeys +",
              cnTitle: "双帕忌 (+2)或更差",
              data: [3, 1, 4, ],
              diagramEnTitle: "Data in Last 10 Games",
              diagramCnTitle: "最近十场杆数走势",
              diagramCoverPrivateTitle: "对方未公开最近十场球局数据",
              diagramCoverEmptyTitle: "暂无球局数据",
              diagramFootnoteL: "最前一场",
              diagramFootnoteR: "最后一场",
            }
          ],
        };
      },

      /**
       * 
       */
      mockChartData() {
        //模拟从服务器获取数据时的延时
        setTimeout(() => {
          //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
          let res = {
              categories: ["2018","2019","2020","2021","2022","2023"],
              series: [
                {
                  name: "成交量A",
                  data: [35, 8, 25, 37, 4, 20],
                  textOffset: uni.upx2px(-8),
                  textColor: '#000',
                  customDrawPointText: this.customDrawPointText,
                },
                {
                  name: "成交量B",
                  data: [70, 40, 65, 100, 44, 68],
                  textOffset: uni.upx2px(-8),
                  textColor: '#000',
                  customDrawPointText: this.customDrawPointText,
                },
                {
                  name: "成交量C",
                  data: [100.2, 80.4, 95.5, 150.1, 112.6, 132.9],
                  textOffset: uni.upx2px(-8),
                  textColor: '#000',
                  customDrawPointText: this.customDrawPointText,
                }
              ]
            };
          this.drawCharts(this.guid, res);
        }, 500);
      },
    },
  };
}


export default mixinObj;