import dayjs from 'dayjs';

export const FirstDisplayTimeMap = {
  _key: 'com-first-display-time-map',
  /** @type Object.<number, number> */
  map: null,
  _prepareIfNeed: function () {
    if (this.map == null) {
      this._load()
    }
  },
  _load: function() {
    try {
      const groupMappingJSON = uni.getStorageSync(this._key)
      this.map = JSON.parse(groupMappingJSON || '{}')
    } catch (e) { }
  },
  _save: function() {
    try {
      uni.setStorageSync(this._key,  JSON.stringify(this.map))
    } catch (e) { }
  },


  /**
   * 球赛有效的展示时间
   * @param {*} competition_id 
   * @param {*} startTime 
   * @param {*} expire 
   * @returns 
   */
  competitionValidDisplayTime: function (competition_id, startTime, expire = 14 * 24 * 60 * 60 * 1000) {    
    this._prepareIfNeed();

    if (this.map[competition_id] == null) {
      return null;
    }


    const startTimeDJ = dayjs(startTime);

    // 没有过期，返回
    const displayTime = this.map[competition_id]
    if (startTimeDJ.add(expire, 'millisecond').isAfter(displayTime)) {
      return displayTime;
    }

    // 过期后，删除键值
    delete this.map[competition_id]
    this._save();

    return null;
  },
  markCompetitionDisplayed: function (competition_id) {
    this._prepareIfNeed();
    if (this.map[competition_id] != null) {
      return;
    }
    
    this.map[competition_id] = new Date().getTime();
    this._save();
  },
}