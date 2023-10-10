/*
 * @Author: max
 * @LastEditors: simon
 * @LastEditTime: 2022-12-10 19:32:04
 * @Description:
 */
import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import user from "./modules/user";
import flooim from "./modules/flooim";
import chatRoom from "./modules/chat-room"
import pk from "./modules/pk"
import message from "./modules/message"

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    flooim,
    chatRoom,
    pk,
    message,
  },
});

export default store;
