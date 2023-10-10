
var mixinObj2 = {};

if (process.env.NODE_ENV === "development") {
  mixinObj2 = {
    methods: {
      /**
       * 用户数据
       * @returns
       */
      async mockUsersData({ start = 0, count = 20 }) {
        const promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(this.mockWithSource(usersSource, start, count))
          }, 500);
        }) 
        return promise;
      },

      /**
       * 球场数据
       * @returns
       */
      async mockCompetitionsData({ start = 0, count = 20 }) {
        const promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(this.mockWithSource(competitionsSource, start, count))
          }, 500);
        }) 
        return promise;
      },


      mockWithSource(source, start, count) {
        const ret = [...source];
        while (ret.length < count * 2) {
          ret.push(...source);
        }
        return [...ret].splice(start % count, count);
      }
    },
  };

  const usersSource = [
    {
      uid: 65,
      username: "乔治一喝微跪",
      avatar_url:
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/user/avatar/20230217/126147656263ef817f6e913.jpg",
      friend_uid: 65,
      gender: 1,
      follow_count: 999,
      fans_count: 999,
    },
    {
      uid: 211,
      username: "🏎处长🏎",
      avatar_url:
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301311263d89907bb623.jpg",
      friend_uid: 211,
      gender: 1,
      follow_count: 999,
      fans_count: 999,
    },
    {
      uid: 171,
      username: "佳宝",
      avatar_url:
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301291463d615feae772.jpg",
      friend_uid: 171,
      gender: 2,
      follow_count: 999,
      fans_count: 999,
    },
    {
      uid: 60,
      username: "吉.吉 ",
      avatar_url:
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d762bd5adb7.jpg",
      friend_uid: 60,
      gender: 1,
      follow_count: 999,
      fans_count: 999,
    },
    {
      uid: 61,
      username: "KELLY",
      avatar_url:
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120322638b56b0003a3.jpg",
      friend_uid: 61,
      gender: 2,
      follow_count: 999,
      fans_count: 999,
    },
    {
      uid: 57,
      username: "🍀",
      avatar_url:
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120321638b538df2d58.jpeg",
      friend_uid: 57,
      gender: 1,
      follow_count: 999,
      fans_count: 999,
    },
    {
      uid: 83,
      username: "¿",
      avatar_url:
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301041563b5295028c90.jpg",
      friend_uid: 83,
      gender: 2,
      follow_count: 999,
      fans_count: 999,
    },
    {
      uid: 58,
      username: "胖大喵",
      avatar_url:
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120322638b5bd87805b.jpg",
      friend_uid: 58,
      gender: 1,
      follow_count: 999,
      fans_count: 999,
    },
    {
      uid: 115,
      username: "马广",
      avatar_url:
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301271263d35a204635e.jpg",
      friend_uid: 115,
      gender: 1,
      follow_count: 999,
      fans_count: 999,
    },
    {
      uid: 207,
      username: "陈晓宁",
      avatar_url:
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d75d783eb48.jpg",
      friend_uid: 207,
      gender: 1,
      follow_count: 999,
      fans_count: 999,
    },
  ];

  const competitionsSource = [
    {
      competition_no: "76806807",
      competition_id: 113,
      uid: 65,
      competition_name: "乔治一喝微跪的球局",
      course_name: "北京天安假日高尔夫俱乐部",
      status: 2,
      start_time: "2023-02-20 11:15:00",
      course_id: 2995,
      course_half_court_ids: "62,64",
      is_hot_recommend: 0,
      is_valid: 0,
      city_id: 72,
      start_date: "2023/02/20",
      start_hour_minute: "11:15",
      competitor_avatar_url_list: [
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/user/avatar/20230217/126147656263ef817f6e913.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d762bd5adb7.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120321638b538df2d58.jpeg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120322638b56b0003a3.jpg",
      ],
      competitor_list: [
        {
          competitor_id: 1644,
          uid: 65,
          username: "乔治一喝微跪",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/user/avatar/20230217/126147656263ef817f6e913.jpg",
          total_score: 72,
          tee: 3,
        },
        {
          competitor_id: 1645,
          uid: 60,
          username: "吉.吉 ",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d762bd5adb7.jpg",
          total_score: 72,
          tee: 3,
        },
        {
          competitor_id: 1646,
          uid: 57,
          username: "🍀",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120321638b538df2d58.jpeg",
          total_score: 72,
          tee: 3,
        },
        {
          competitor_id: 1647,
          uid: 61,
          username: "KELLY",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120322638b56b0003a3.jpg",
          total_score: 73,
          tee: 1,
        },
      ],
      is_friend_join: 1,
      course_half_court_list: ["A", "C"],
      weather: {
        daytime: 20230220,
        day_weather: "晴",
        night_weather: "晴",
        day_air_temperature: "6",
        night_air_temperature: "-6",
        day_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_04.png",
        night_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_01.png",
        day_wind_direction: "东北风",
        night_wind_direction: "东北风",
        day_wind_power: "0-3级",
        night_wind_power: "0-3级",
        weather_area_code: "110000",
      },
      watching: 1,
    },
    {
      competition_no: "10537150",
      competition_id: 101,
      uid: 67,
      competition_name: "Gavin Chyi的球局",
      course_name: "番禺莲花山高尔夫球会",
      status: 2,
      start_time: "2023-02-16 10:25:00",
      course_id: 3069,
      course_half_court_ids: "228,229",
      is_hot_recommend: 0,
      is_valid: 1,
      city_id: 270,
      start_date: "2023/02/16",
      start_hour_minute: "10:25",
      competitor_avatar_url_list: [
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120502638ce33c03b00.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202212122263973a8e807a1.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301311263d89907bb623.jpg",
      ],
      competitor_list: [
        {
          competitor_id: 1622,
          uid: 67,
          username: "Gavin Chyi",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120502638ce33c03b00.jpg",
          total_score: 87,
          tee: 3,
        },
        {
          competitor_id: 1624,
          uid: 80,
          username: "ZYK",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202212122263973a8e807a1.jpg",
          total_score: 89,
          tee: 3,
        },
        {
          competitor_id: 1623,
          uid: 211,
          username: "🏎处长🏎",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301311263d89907bb623.jpg",
          total_score: 117,
          tee: 3,
        },
      ],
      is_friend_join: 1,
      course_half_court_list: [],
      weather: {
        daytime: 20230220,
        day_weather: "晴",
        night_weather: "晴",
        day_air_temperature: "22",
        night_air_temperature: "12",
        day_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_04.png",
        night_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_01.png",
        day_wind_direction: "北风",
        night_wind_direction: "北风",
        day_wind_power: "3-4级",
        night_wind_power: "3-4级",
        weather_area_code: "440100",
      },
      watching: 1,
    },
    {
      competition_no: "11278145",
      competition_id: 99,
      uid: 120,
      competition_name: "小虫的球局",
      course_name: "北京翡翠湖高尔夫俱乐部",
      status: 2,
      start_time: "2023-02-16 09:30:00",
      course_id: 2997,
      course_half_court_ids: "67,68",
      is_hot_recommend: 0,
      is_valid: 1,
      city_id: 72,
      start_date: "2023/02/16",
      start_hour_minute: "09:30",
      competitor_avatar_url_list: [
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301261063d1e02fb21d3.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202302160963ed8ae938fb9.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202302160963ed8b0b0ae80.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301291463d615feae772.jpg",
      ],
      competitor_list: [
        {
          competitor_id: 1615,
          uid: 120,
          username: "小虫",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301261063d1e02fb21d3.jpg",
          total_score: 94,
          tee: 3,
        },
        {
          competitor_id: 1617,
          uid: 252,
          username: "蹦",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202302160963ed8ae938fb9.jpg",
          total_score: 105,
          tee: 3,
        },
        {
          competitor_id: 1618,
          uid: 253,
          username: "家蓉💛",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202302160963ed8b0b0ae80.jpg",
          total_score: 103,
          tee: 1,
        },
        {
          competitor_id: 1616,
          uid: 171,
          username: "佳宝",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301291463d615feae772.jpg",
          total_score: 99,
          tee: 1,
        },
      ],
      is_friend_join: 1,
      course_half_court_list: [],
      weather: {
        daytime: 20230220,
        day_weather: "晴",
        night_weather: "晴",
        day_air_temperature: "6",
        night_air_temperature: "-6",
        day_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_04.png",
        night_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_01.png",
        day_wind_direction: "东北风",
        night_wind_direction: "东北风",
        day_wind_power: "0-3级",
        night_wind_power: "0-3级",
        weather_area_code: "110000",
      },
      watching: 11,
    },
    {
      competition_no: "42185275",
      competition_id: 91,
      uid: 65,
      competition_name: "冯丰_George的球局",
      course_name: "北京天安假日高尔夫俱乐部",
      status: 2,
      start_time: "2023-02-15 11:50:00",
      course_id: 2995,
      course_half_court_ids: "62,63",
      is_hot_recommend: 0,
      is_valid: 1,
      city_id: 72,
      start_date: "2023/02/15",
      start_hour_minute: "11:50",
      competitor_avatar_url_list: [
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120322638b5bd87805b.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d762bd5adb7.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/user/avatar/20230217/126147656263ef817f6e913.jpg",
      ],
      competitor_list: [
        {
          competitor_id: 1596,
          uid: 58,
          username: "胖大喵",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120322638b5bd87805b.jpg",
          total_score: 85,
          tee: 3,
        },
        {
          competitor_id: 1595,
          uid: 60,
          username: "吉.吉 ",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d762bd5adb7.jpg",
          total_score: 82,
          tee: 3,
        },
        {
          competitor_id: 1594,
          uid: 65,
          username: "乔治一喝微跪",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/user/avatar/20230217/126147656263ef817f6e913.jpg",
          total_score: 89,
          tee: 3,
        },
      ],
      is_friend_join: 1,
      course_half_court_list: ["A", "B"],
      weather: {
        daytime: 20230220,
        day_weather: "晴",
        night_weather: "晴",
        day_air_temperature: "6",
        night_air_temperature: "-6",
        day_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_04.png",
        night_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_01.png",
        day_wind_direction: "东北风",
        night_wind_direction: "东北风",
        day_wind_power: "0-3级",
        night_wind_power: "0-3级",
        weather_area_code: "110000",
      },
      watching: 2,
    },
    {
      competition_no: "62384089",
      competition_id: 88,
      uid: 87,
      competition_name: "Blade🏌 的球局",
      course_name: "广州麓湖高尔夫球乡村俱乐部",
      status: 2,
      start_time: "2023-02-13 21:55:00",
      course_id: 3067,
      course_half_court_ids: "224,225",
      is_hot_recommend: 0,
      is_valid: 0,
      city_id: 270,
      start_date: "2023/02/13",
      start_hour_minute: "21:55",
      competitor_avatar_url_list: [
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301292163d6762dd9a4c.jpg",
      ],
      competitor_list: [
        {
          competitor_id: 1589,
          uid: 87,
          username: "Blade🏌 ",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301292163d6762dd9a4c.jpg",
          total_score: 72,
          tee: 3,
        },
      ],
      is_friend_join: 0,
      course_half_court_list: [],
      weather: {
        daytime: 20230220,
        day_weather: "晴",
        night_weather: "晴",
        day_air_temperature: "22",
        night_air_temperature: "12",
        day_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_04.png",
        night_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_01.png",
        day_wind_direction: "北风",
        night_wind_direction: "北风",
        day_wind_power: "3-4级",
        night_wind_power: "3-4级",
        weather_area_code: "440100",
      },
      watching: 1,
    },
    {
      competition_no: "84254393",
      competition_id: 66,
      uid: 65,
      competition_name: "冯丰_George的球局",
      course_name: "海南七仙岭温泉高尔夫球会",
      status: 2,
      start_time: "2023-02-05 11:25:00",
      course_id: 3511,
      course_half_court_ids: "1205,1206",
      is_hot_recommend: 0,
      is_valid: 1,
      city_id: 2435,
      start_date: "2023/02/05",
      start_hour_minute: "11:25",
      competitor_avatar_url_list: [
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/user/avatar/20230217/126147656263ef817f6e913.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d75d8564434.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d75d783eb48.jpg",
      ],
      competitor_list: [
        {
          competitor_id: 1523,
          uid: 65,
          username: "乔治一喝微跪",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/user/avatar/20230217/126147656263ef817f6e913.jpg",
          total_score: 92,
          tee: 3,
        },
        {
          competitor_id: 1524,
          uid: 206,
          username: "宝巍琦",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d75d8564434.jpg",
          total_score: 91,
          tee: 3,
        },
        {
          competitor_id: 1525,
          uid: 207,
          username: "陈晓宁",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d75d783eb48.jpg",
          total_score: 103,
          tee: 3,
        },
      ],
      is_friend_join: 1,
      course_half_court_list: [],
      weather: {
        daytime: 20230220,
        day_weather: "多云",
        night_weather: "多云",
        day_air_temperature: "27",
        night_air_temperature: "17",
        day_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_03.png",
        night_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_02.png",
        day_wind_direction: "无持续风向",
        night_wind_direction: "无持续风向",
        day_wind_power: "0-3级",
        night_wind_power: "0-3级",
        weather_area_code: "469029",
      },
      watching: 9,
    },
    {
      competition_no: "61521219",
      competition_id: 71,
      uid: 60,
      competition_name: "吉.吉 的球局",
      course_name: "佛山顺德君兰国际高尔夫俱乐部",
      status: 2,
      start_time: "2023-02-05 17:30:00",
      course_id: 3430,
      course_half_court_ids: "1025,1026",
      is_hot_recommend: 0,
      is_valid: 1,
      city_id: 275,
      start_date: "2023/02/05",
      start_hour_minute: "17:30",
      competitor_avatar_url_list: [
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d762bd5adb7.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/user/avatar/20230217/63178930663ef3d22d020c.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120321638b538df2d58.jpeg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301041563b5295028c90.jpg",
      ],
      competitor_list: [
        {
          competitor_id: 1541,
          uid: 60,
          username: "吉.吉 ",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301301463d762bd5adb7.jpg",
          total_score: 80,
          tee: 3,
        },
        {
          competitor_id: 1542,
          uid: 68,
          username: "fafa😎",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/user/avatar/20230217/63178930663ef3d22d020c.jpg",
          total_score: 78,
          tee: 3,
        },
        {
          competitor_id: 1543,
          uid: 57,
          username: "🍀",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120321638b538df2d58.jpeg",
          total_score: 80,
          tee: 3,
        },
        {
          competitor_id: 1544,
          uid: 83,
          username: "¿",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301041563b5295028c90.jpg",
          total_score: 80,
          tee: 1,
        },
      ],
      is_friend_join: 1,
      course_half_court_list: ["B", "C"],
      weather: {
        daytime: 20230220,
        day_weather: "晴",
        night_weather: "晴",
        day_air_temperature: "23",
        night_air_temperature: "13",
        day_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_04.png",
        night_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_01.png",
        day_wind_direction: "无持续风向",
        night_wind_direction: "无持续风向",
        day_wind_power: "0-3级",
        night_wind_power: "0-3级",
        weather_area_code: "440600",
      },
      watching: 4,
    },
    {
      competition_no: "61463316",
      competition_id: 59,
      uid: 87,
      competition_name: "Blade🏌 的球局",
      course_name: "广州南湖高尔夫俱乐部",
      status: 2,
      start_time: "2023-02-03 12:19:52",
      course_id: 3068,
      course_half_court_ids: "226,227",
      is_hot_recommend: 0,
      is_valid: 0,
      city_id: 270,
      start_date: "2023/02/03",
      start_hour_minute: "12:19",
      competitor_avatar_url_list: [
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301292163d6762dd9a4c.jpg",
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120813639171ec3ae0f.jpg",
      ],
      competitor_list: [
        {
          competitor_id: 1502,
          uid: 87,
          username: "Blade🏌 ",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301292163d6762dd9a4c.jpg",
          total_score: 76,
          tee: 3,
        },
        {
          competitor_id: 1503,
          uid: 79,
          username: "blade🏌 ",
          group: "B",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/2022120813639171ec3ae0f.jpg",
          total_score: 72,
          tee: 3,
        },
      ],
      is_friend_join: 0,
      course_half_court_list: [],
      weather: {
        daytime: 20230220,
        day_weather: "晴",
        night_weather: "晴",
        day_air_temperature: "22",
        night_air_temperature: "12",
        day_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_04.png",
        night_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_01.png",
        day_wind_direction: "北风",
        night_wind_direction: "北风",
        day_wind_power: "3-4级",
        night_wind_power: "3-4级",
        weather_area_code: "440100",
      },
      watching: 1,
    },
    {
      competition_no: "14830127",
      competition_id: 60,
      uid: 87,
      competition_name: "Blade🏌 的球局",
      course_name: "番禺莲花山高尔夫球会",
      status: 2,
      start_time: "2023-02-03 15:15:00",
      course_id: 3069,
      course_half_court_ids: "228,229",
      is_hot_recommend: 0,
      is_valid: 0,
      city_id: 270,
      start_date: "2023/02/03",
      start_hour_minute: "15:15",
      competitor_avatar_url_list: [
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301292163d6762dd9a4c.jpg",
      ],
      competitor_list: [
        {
          competitor_id: 1505,
          uid: 87,
          username: "Blade🏌 ",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301292163d6762dd9a4c.jpg",
          total_score: 72,
          tee: 3,
        },
      ],
      is_friend_join: 0,
      course_half_court_list: [],
      weather: {
        daytime: 20230220,
        day_weather: "晴",
        night_weather: "晴",
        day_air_temperature: "22",
        night_air_temperature: "12",
        day_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_04.png",
        night_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_01.png",
        day_wind_direction: "北风",
        night_wind_direction: "北风",
        day_wind_power: "3-4级",
        night_wind_power: "3-4级",
        weather_area_code: "440100",
      },
      watching: 1,
    },
    {
      competition_no: "90129232",
      competition_id: 50,
      uid: 87,
      competition_name: "Blade🏌 的球局",
      course_name: "海南陵水鉴湖蓝湾高尔夫俱乐部球场",
      status: 2,
      start_time: "2023-02-01 16:04:37",
      course_id: 3744,
      course_half_court_ids: "1465,1466",
      is_hot_recommend: 0,
      is_valid: 0,
      city_id: 2434,
      start_date: "2023/02/01",
      start_hour_minute: "16:04",
      competitor_avatar_url_list: [
        "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301292163d6762dd9a4c.jpg",
      ],
      competitor_list: [
        {
          competitor_id: 1478,
          uid: 87,
          username: "Blade🏌 ",
          group: "A",
          avatar_url:
            "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301292163d6762dd9a4c.jpg",
          total_score: 73,
          tee: 3,
        },
      ],
      is_friend_join: 0,
      course_half_court_list: [],
      weather: {
        daytime: 20230220,
        day_weather: "多云",
        night_weather: "多云",
        day_air_temperature: "25",
        night_air_temperature: "19",
        day_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_03.png",
        night_weather_pic:
          "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon_02.png",
        day_wind_direction: "东北风",
        night_wind_direction: "北风",
        day_wind_power: "3-4级",
        night_wind_power: "3-4级",
        weather_area_code: "469028",
      },
      watching: 2,
    },
  ];
}

export default mixinObj2;
