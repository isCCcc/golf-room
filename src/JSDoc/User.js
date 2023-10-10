/**
 * @typedef {number} Gender 性别， 0: 未知，1: 男， 2: 女
 */

/**
 * @typedef {object} User 用户
 * 
 * @property {?number} uid 用户id
 * @property {?string} add_time 创建时间 "2022-12-04 20:40:56",  
 * @property {?string} openid 微信 openid "oJGiT5FM_Fl7OMXvOdsKkN6XXXX",  
 * @property {?string} username 用户名
 * @property {?string} phone_number 手机号 "135166368xx"
 * @property {?Gender} gender 性别：1-男，2-女
 * @property {?string} avatar_url 头像
 * @property {?string} introduction 自我介绍 ""
 * @property {?string} bg_image_url 背景图链接 ""
 * @property {?string} im_id "6606081142944",
 * @property {?string} im_username "dev_gr_2022120420405668",
 * @property {?string} im_password "6e3d7b0a85964d79acd0df9771faa5bf",
 * @property {?string} im_appid "tqiglvkkXXXX",
 * @property {?string} im_admin_id "6640451618XXXX",
 * @property {?string} ip "113.119.172.XXX"
 * @property {?string} ip_addr "广东省 广州市"
 * @property {?string} city 城市
 * @property {?string} province 省份
 * @property {?string} country 国家
 * @property {?string} first_golf_time 首次打球时间 "2021-12-01 00:00:00",
 * @property {?number} golf_age 球龄，年 1
 * @property {?number} follow_count 关注数 9
 * @property {?number} fans_count 粉丝数 9,  
 * @property {?number} history_competition_count 历史球局数 16
 * @property {?number} watched_competition_count 围观球局数 6
 * @property {?number} total_golf_games 比赛次数 4
 * @property {?number} total_played_course 打过球场 3
 * @property {?number} hcp 差点 5.3,  
 * @property {?number} best 最佳杆数 70
 * @property {?number} avg 平均杆数 77.3
 * @property {?string} hcp_transcend 差点超越 "86.4%"
 * @property {?string} best_transcend 最佳杆数超越 "57.1%"
 * @property {?string} avg_transcend 平均杆数超越 "90%"
 * @property {?number} is_public_score_list 主页否公开历史杆数：0-否，1-是
 * @property {?number} is_public_avg_score_list  主页是否公开平均杆数：0-否，1-是
 * @property {?number} is_public_statistics_score_list 主页是否公开杆数统计（鹰、鸟、啪叽那些）：0-否，1-是
 * @property {?number[]} score_list 近10场历史杆数 [ 85, 76, 78, 70 ],
 * @property {?number[]} par_3_avg_score_list 近10场3par洞平均杆数 [ 1.3, 0.5, 0.5, 0.8 ],
 * @property {?number[]} par_4_avg_score_list 近10场4par洞平均杆数 [ 0.7, 0.2, 0.2, -0.5 ],
 * @property {?number[]} par_5_avg_score_list 近10场5par洞平均杆数 [ 0.3, 1, 2, 0 ],
 * @property {?number[]} eagles_list 近10场打鹰或更好次数 [ 0, 0, 0, 3 ],
 * @property {?number[]} birdies_list 近10场打鸟次数 [ 0, 0, 0, 0 ],
 * @property {?number[]} pars_list 近10场打par次数 [ 0, 0, 0, 0 ],
 * @property {?number[]} bogeys_list 近10场打帕忌次数[ 0, 0, 0, 0 ],
 * @property {??number[]} double_bogeys_list 近10场打双啪叽或更差次数 [ 18, 9, 9, 15 ]
 */