# IM

使用 [蓝莺 IM](https://www.lanyingim.com)

注意事项⚠️：

- 监听 SDK 的事件时 （`flooim.on(options, ext)`）
  - 由于 SDK 仅能添加一个 handler， 需要统一在一个地方做监听，`src/store/modules/flooim/index.js`,
  - 需要监听 IM 的事件，写 IM 事件处理逻辑时，在统一监听的地方，将监听到的内容，换成事件名称 `im_[ IM 事件名称]`，并用 `uni.$emit()` 转发出去，其它地方通过 `this.onGREvent()` 获取事件并处理。
  - 加了监听后，需要在特定的时候取消监听。`flooim.off(options, ext)`

## 蓝莺 IM

### 消息发送流程

发送消息（群消息为例）

1. 调用 `sysManage.sendGroupMessage()` 发送消息
2. SDK 回调 `onSendingMessageStatusChanged()`， status == 'sending' mid 等于对应值
3. `sysManage.sendGroupMessage()` 返回 mid （client_mid）

SDK 完成发送消息后

1. SDK 回调 `onGroupMessage()`，返回刚刚发送的消息
2. SDK 回调 `onSendingMessageStatusChanged()`， status == 'sent' mid 等于对应值

### 相关文件

- "src/store/modules/flooim/index.js"

### 球局消息推送 （单聊消息）

机制：

- 通过 roster 消息来接收
- 服务器
  - 系统每间隔一定时间就给在群聊的用户（在群成员）主动推送消息，包括：球局详情（`competition_detail`），球局结束（`competition_finish`）等。
- 前端：
  - 进入房间开始接收 roster 消息（私聊消息，蓝莺 IM 的 `onRosterMessage` 事件）
  - 通过`group_id`判断是否是当前房间相关的消息
  - 通过`is_system`判断是否是系统消息
  - 类型
    - `competition_detail`: 球局详情推送
    - `competition_finish`: 球局结束推送
      - 前端接收后，目前仅修改球局状态为 `2`
      - 注意：后端发出这个消息后，`competition_detail` 相关数据就会停止发送，这个消息后端会发出两次，防止丢失。
    - deprecated
      - `record_update`: 分数相关，计算分数 (后端目前也不会推送，`competition_detail` 能获得最新数据)
        - 前端接收后，目前仅重新计算分数，`competition_detail` 也有相关操作
      - `update_tee`: 修改 Tee (后端目前也不会推送，`competition_detail` 能获得最新数据)
        - 前端接收后，目前仅修改对应球员的 Tee 色
      - `competitor_delete`: 删除球员 (后端会推送, `competition_detail` 能获得最新数据)
        - 前端接收后，目前仅删除 competition 数据中对应的球员，

疑问：

1. 如果进入房间过多，IM 的 `onRosterMessage` 会不会不断被调用，形成信息风暴？【如果加入多个群聊，而不退出，现在后台会对群成员推送球局最新信息（更新数据相关 UI），虽然前端不显示，但是会使用 IM 后台发送消息，前端 IM SDK 会在后台不断接收信息】。

#### 代码或数据

```java
this.imInfo.on({
   onRosterMessage: this.onRosterMessage()
});
```

```json
{
  "id": "1096721966196326420",
  "from": "0",
  "to": "6606084419600",
  "type": "text",
  "ext": "",
  "status": 0,
  "timestamp": "1672915281308",
  "toType": "roster",

  // "content" 原数据为字符串类型，这里已经转成 JSON 对象
  "content": {
    "competition_finish": {
      "competition_id": "421"
    },
    "competition_detail": {
      "time": 1675222315116, // 数据获取时间，用于前端更新数据。后台文档目前没有写。http://gitlab.yuancangipr.com/yc/wx-GolfRoom/wikis/球局/详情

      "competition_id": 421,
      "add_time": "2023-01-05 11:24:51",
      "update_time": "2023-01-05 11:58:59",
      "is_delete": 0,
      "uid": 69,
      "competition_name": "Blade的球局",
      "status": 1,
      "start_time": "2023-01-05 11:25:00",
      "end_time": null,
      "course_id": 3076,
      "course_half_court_ids": "243,244",
      "total_score": 72,
      "is_private": 0,
      "group_id": "6614683607026",
      "group_name": "dev_Blade的球局",
      "group_type": 2,
      "is_valid": 0,
      "is_hot_recommend": 0,
      "competition_no": "80072866",
      "group_list": [
        "A",
        "B"
      ],
      "course_name": "广州九龙湖国王球场",
      "weather": {
        "daytime": "2023-01-05",
        "day_weather": "多云",
        "night_weather": "多云",
        "day_air_temperature": "22",
        "night_air_temperature": "13",
        "day_weather_pic": "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon03.png",
        "night_weather_pic": "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/icons/weather/icon02.png",
        "day_wind_direction": "无持续风向",
        "night_wind_direction": "无持续风向",
        "day_wind_power": "0-3级",
        "night_wind_power": "0-3级"
      },
      "hole_list": [
        {
          "course_half_court_id": 243,
          "course_id": 3076,
          "half_court_name": "A",
          "grCourseHole": [
            {
              "course_half_court_id": 243,
              "hole_no": 1,
              "par": 5
            },
            ......
          ]
        },
        {
          "course_half_court_id": 244,
          "course_id": 3076,
          "half_court_name": "B",
          "grCourseHole": [
            {
              "course_half_court_id": 244,
              "hole_no": 1,
              "par": 4
            },
            ......
          ]
        }
      ],
      "course_half_court_count": 3,
      "competitor_list": [
        {
          "competitor_id": 1023,
          "add_time": "2023-01-05 11:24:51",
          "competition_id": 421,
          "uid": 69,
          "group": "A",
          "tee": 3,
          "total_score": 74,
          "sort": 0,
          "username": "Blade",
          "avatar_url": "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/20221207176390562bc188f.jpg",
          "im_id": "6606084419600",
          "hcp": -6,
          "record": [
            {
              "competition_record_id": 18235,
              "course_half_court_id": 243,
              "hole_no": 1,
              "par": 5,
              "score": 2,
              "push": null
            },
            {
              "competition_record_id": 18236,
              "course_half_court_id": 243,
              "hole_no": 2,
              "par": 3,
              "score": null,
              "push": null
            },
            ......
          ]
        },
        {
          "competitor_id": 1024,
          "add_time": "2023-01-05 11:25:00",
          "competition_id": 421,
          "uid": 83,
          "group": "B",
          "tee": 2,
          "total_score": 72,
          "sort": 0,
          "username": "¿",
          "avatar_url": "https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/202301041563b5295028c90.jpg",
          "im_id": "6846609871152",
          "hcp": 0,
          "record": [
            {
              "competition_record_id": 18253,
              "course_half_court_id": 243,
              "hole_no": 1,
              "par": 5,
              "score": null,
              "push": null
            },
            ......
          ]
        }
      ]
    },
    "group_id": "6614683607026",
    "competition_id": 421,
    "is_system": true
  }
}
```

### 群聊消息（聊天室）

目前，球赛（球局）详情里的，群聊是“聊天室”形式（见[GroupInfoAndSettings](https://docs.lanyingim.com/reference/floo-web/types.html#module_types__groupinfoandsettings) 中的 `type` === 2）。注意以下的关键点

* `聊天室`成员，断线 2 分钟后，会被踢，将不在成员列表内。

发送中，组装起来的消息

```json
{
  gid: "6709171704114"        // 群信息中，group id
  priority: 0
  type: "text"
  content: "aaaaaa"
  ext: "{"avatar_url":"https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/20221207176390562bc188f.jpg","username":"Blade","g_msg_guid":"uyyhQvQmdiywIVuy3U5IIkwDhrLwVLpn"}" // 'g_msg_guid' 用于标记信息，与发送后返回的消息进行比对，用于删除发送中信息等。如果这个比对用 mid （也是一个时间戳）进行，感觉不可靠

  // 下面为自己添加的属性
  g_client_mid: 1672227980934 // 自定义记录的，通过 SDK 进行发送后，返回的 mid
  g_send_status: "failed"     // 自定义记录的发送状态，依照 SDK 里的状态有 'sending', 'sent', 'failed'
  isSelf: true                // 是不是自己的信息。这个在发送中，自己做标记，用于UI显示的判断。
  timestamp: "1672227980934"  // 发送中，这个时间戳直接于 mid 相关
}
```

发送后，接收到的消息

```json
{
  content: "ddddd"
  ext: "{"avatar_url":"https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/upload/20221207176390562bc188f.jpg","username":"Blade","g_msg_guid":"u7uIoKz9Fl8Ku8rqbyEXcp6gH1UD14Fx"}"
  from: "6606084419600"
  id: "1093770044233482260"
  status: 2
  timestamp: "1672227983420"
  to: "6709171704114"
  toType: "group"
  type: "text"
}
```

## 房间重构-聊天室

1. 公告：如："golfroom 严禁出现违法违规，低俗色情，⼈身伤害等内容"
   1. 前端通过 API 查询，显示在最顶部的位置。
2. 消息
   1. 观众进入房间的欢迎消息：
      1. 范围：个人，仅自己
      2. 发送时机与机制：
         1. 当用户第一次加入房间，服务器生成，标记 groupid
         2. 前端接口查询获取，并显示在第一行位置（通过 groupid 作为关键字段）
      3. 消息内容：
          1. 比赛成员列表：
              1. 名称
          2. 比赛场地：
              1. 名称（包含 AB 场），
              2. 坐标（距离计算）
          3. 比赛进度：
              1. 几号洞，
              2. 领先人员:名称, 领先杆数
   2. 其他人进入房间的欢迎消息：本地自定义消息，获取到成员列表变化后，本地自动生成显示，重复进入，不显示之前的欢迎信息。
   3. 普通消息：文本，图片等，使用蓝莺 IM 的接口或方法。
   4. ~~礼物消息：送出 👍x12，送出 💗x12 等~~
      1. ext 中附带 gift 信息
   5. 播报信息： 如 "【播报】谁谁谁：连续抓下 2 只小鸟，目前总成绩来到+3，pk 得分连 续吃肉加倍，状态来了，感觉自己又是那个了!!🐦🐦🐦"
      1. 范围：全员
      2. 发送时机与机制：
            1. 当用户填入某洞杆数，后台结算并在群中发送消息
      3. 消息内容：
          1. 用户 id：判断是否是我自己
          2. 用户昵称：显示
          3. 内容：【需要定义，参考产品文档】
   6. ~~其它方面的礼物消息【暂时不做】~~
   7. ~~用户等级显示【暂时没有用户等级】~~
   8. 球局结束的系统消息：
      1. 多媒体消息？？？
3. ~~礼物弹窗：收到礼物消息后界面显示【暂时不做】~~

技术支撑

局限性：

1. 目前蓝莺 IM，在群组里，没有针对特定用户欢迎词这方面的支持，他们建议前端向服务器拉取。
2. 前端需要不断重复进入房间，退出房间 （参考球局消息推送机制）

前端：

1. 使用 ext 字段，进行自定义消息处理
2. 自定义消息类型（消息体 `ext` -> `msg_type`）：
   1. 进入房间：`enter_room`
   2. 播报：`boardcast`
   3. ~~礼物：`gift`【暂时不做】~~
3. 前端可能会不断重复进入房间，退出房间
4. ~~显示自定义 emoji（参考 [uniapp 文字穿插表情消息处理](https://blog.csdn.net/gd898989/article/details/116231480)）~~ 【自定义表情暂时不做】
   1. 表情列表：
      1. 从服务器拉取，在特定位置显示对应表情
      2. 格式如 `[{"url":"100.gif",alt:"[微笑]"}, ...`
   2. 特定组件，表情替换： '[开心]' 替换成 😄

后端：

1. 群通用公告，通过 API 下发，可随时更改。
2. 当用户第一次加入房间，服务器生成欢迎词内容，放在后端数据库，关联 groupid，方面前端查询，
3. 当填入用户在某洞的杆数，在群中，发送`播报`信息，同时有多个播报，建议间隔时间，按特定顺序发送
4. ~~表情列表，格式参考前端部分。~~【自定义表情暂时不做】

疑问：

1. 自己第一次进入房间的欢迎消息，需要常驻么？【常驻，服务器生成，前端 api 查询，显示到第一条位置】
2. 播报的消息，需要常驻么？常驻。

---
新需求

> golfroom 弹幕文案
>
> 1. 系统提示：欢迎进入xxx的高球房间，房间号xxx。golfroom严谨出现违法违规，低俗色情，人身伤害等不良信息，希望广大球友文明观赛，一起为球员们加油打气吧！（只**观众**自己可以见，进入房间后看到，按照现有后台给出）
>
> 2. 系统提示：本场比赛已结束。@Adam取得了 79 杆的好成绩，排名第 1。点击此处查看总成绩榜。 点击记分卡球员头像可查看详细数据及分享图。（**全部可见**）
>
> 3. 欢迎@XXX进入房间（**全部可见**，仅显示观众的进入。）
>
> 4. 📢播报：本场比赛采取XXXX（如果有多个就排列写）pk规则（详细pk规则请点击pk按钮查看），目前战况 @xxx以xx分领跑，@xxx xx分，@xxx xx分，@xxx xx分。（**球员**自己可以见，进入房间后看到，类似1，但展示形式按照播报来）
>
> 5. 📢播报：目前比赛已进行到第X洞，@xxx 以+x暂时领跑，@xxx 以+x紧随其后，@xxx和@xxx分别拿到+x和+x，暂列三四位。（只**观众**自己可以见，一进来就有）
>
> 6. 📢播报：xx过后pk战况，该洞成绩 @xxx xx分，@xxx xx分，@xxx xx分，@xxx xx分，总成绩@xxx xx分，@xxx xx分，@xxx xx分，@xxx xx分。（**全部**可见，每一洞，同组所有人都填完的时候）
>

消息分类（聊天室）：

1. 普通聊天消息（IM）
   1. 限制：
      - IM 消息所有人都能获取，不要安排部分人才能看到的消息，会影响历史的拉取，比如拉取 20 条，全部都是“我”不可见的消息。
   2. 类型
      1. 文字，Unicode 表情
2. 系统提示
   1. 类型：
      1. 观众进入房间的欢迎信息
         1. "系统提示：欢迎进入xxx的高球房间，房间号xxx。golfroom严谨出现违法违规，低俗色情，人身伤害等不良信息，希望广大球友文明观赛，一起为球员们加油打气吧！（只观众自己可以见）"
3. 播报
   1. 来源：推送
   2. 类型
      1. 球员进入是，看到的比赛进展播报
      2. 观众看到的，比赛进展播报
      3. 全部人看到的 PK 播报
4. 进入房间（观众）
   1. 来源：`本地`，观测成员变化后，对比是否是观众，
   2. 显示条件：
      1. 观测成员变化本地对比
      2. 是否是观众
      3. 是否已经展示过（不重复展示）
5. ~~礼物~~
   1. 来源：`推送`

消息来源：

1. `IM`
   1. 普通消息接收
   2. 推送消息：ID 为 0 的私信推送
      1. 播报
         1. 观众看到的比赛进展（比如：某洞结束后）
         2. PK 进展（比如：某洞结束后）
2. `API`
   1. 进入房间
      1. 观众看到的欢迎
      2. 球员看到的欢迎？？？（未确定）
   2. 比赛结束
      1. 结束语
3. `本地`
   1. IM 系统的监听
      1. 聊天室成员变化
   2. 自主生成？？

消息结构定义：

```json
{
  /**
    `m_type`：消息类型：0: 默认， 1：系统消息，2：播报 
   */
  "m_type": 0,
  /**
    `c_type`：content 类型，0: 纯文本, 1: html 文本
   */
  "c_type": 0, // 
  /**
  `content` 字符串，可以是纯文本， html 文本，
   */
  "content": "",
}
```

疑问：

1. 公告还有么？
2. 需要划定内容的类型
   1. 比如，推送的消息，有 type 字段，前端判断是用 “播报”，还是“系统消息” 的形式展示。
