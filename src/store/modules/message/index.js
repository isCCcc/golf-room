
import { getHasNewMessage, markMessageAllRead } from '@/api/message';
import {mutationsTypes, actionsTypes} from './types'
export default {
  state: {
    unreadCount: 0
  },
  getters: {
    messageUnreadCount(state) {
      return state.unreadCount;
    }
  },
  mutations: {
  },
  actions: {
    [actionsTypes.GET_HAS_NEW]: ({state}, res) => {
      try {
        getHasNewMessage(false, true).then(({ data: { data } }) => {           
          if (data?.read_tag == undefined) {
            console.error('GET_HAS_NEW no data ??')
            return;
          }
          if (data?.read_tag == true) { // true 有未读消息
            if (state.unreadCount < 1) {
              state.unreadCount = 1;
            } 
          } else { // 有未读消息
            state.unreadCount = 0;
          }          
        })
      } catch (e) {
        console.error('GET_HAS_NEW', e)
      }
    },
    [actionsTypes.MARK_ALL_READ]: async (state, res) => {
      markMessageAllRead().then(({ data: { data } }) => {
        state.unreadCount = 0;
      })
    },
  },
};