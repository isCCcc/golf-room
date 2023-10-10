/**
 * @typedef {Object} ImMessage IM 信息
 * @property {string} id 消息ID
 * @property {string} from 发送者
 * @property {string} to 接收者
 * @property {string} content 消息内容
 * @property {string} type 消息类型： text - 文本, image - 图片， audio - 语音, video - 视频，file - 文件, location - 位置， command - 命令, forward - 转发
 * @property {string|ImMessageExt} ext 扩展字段
 * @property {string|object} config SDK扩展字段
 * @property {string|object} attach 附件信息
 * @property {number} status 消息状态： 0 - 未读, 1 - 已投递, 2 - 已读
 * @property {string} timestamp 消息发送时间戳（毫秒）
 * @property {string} toType 接收者类型： roster - 好友， group - 群组
 * @property {number} priority (发送时有效) 设置消息的扩散优先级，默认为0。0表示扩散，数字越小扩散的越多。
 * @property {?boolean} isSelf [本地定义] 是否是自己，目前用于房间聊天室，和私聊
 * @property {?boolean} isCompetitor [本地定义] 发送者是否是球员，目前用于房间聊天室
 * @property {?string} nick_name [本地定义] 发送者昵称，目前用于房间聊天室，和私聊
 * @property {?string} avatar [本地定义] 发送者头像，目前用于房间聊天室，和私聊
 */


/**
 * @typedef {Object} ImMessageExt IM 信息的 ext
 * @property {?string} g_msg_guid 消息的 GUID， 用于跟踪消息发送情况，入已经发送的消息，
 * @property {?string} g_client_mid ????
 * @property {?string} msg_type 消息类型，主要是定义展示形式
 * @property {?string} msg_sub_type 消息子类型，同展示形式下，具体分类，如：比赛结束，
 * @property {?string} html_content HTML 部分内容，不需要 CSS 部分。使用本地定义 CSS。
 * @property {?string} html_encoded Base64 编码的 HTML 部分内容，不需要 CSS 部分。使用本地定义 CSS。
 * @property {?string} im_id 发送者用户 IM ID，用于跳转用户详情等
 * @property {?string} avatar_url 发送者用户头像，
 * @property {?string} username 发送者用户昵称。如 IM 系统通知，又可能发送者 ID 是 0。
 */

