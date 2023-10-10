# URI

`https://golfroom.cn` 旧版本是 `https://golfroom.me`

## 'Page Inside' handling

`https://golfroom.cn/pi?`:

* examples:
  * `https://golfroom.cn/pi?j=%7B%22cr%22%3A%7B%22modal%22%3A%22whole_rank%22%7D%7D`
    * `pi?j={"cr":{"modal":"whole_rank"}}`
  * `https://golfroom.cn/pi?j=%7B%22p%22%3A%7B%22uid%22%3AXXXX%7D%7D`
    * `p?j={"p":{"uid":XXXX}}`
* `pi`: page inside
  * `j`: JSON
    * `cr`: Chat Room, 聊天室
      * `model`: 模态弹窗
        * `whole_rank`: 总成绩
* `p`: page
  * `j`: JSON
    * `p`: Profile, 用户主页
      * `uid`: 用户 ID
