import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    count: "안녕하세요. 사사모사역자님",
    token: ""
  },
  mutations: {
    decrement (state) {
      state.count--
    },
    updateToken(state, payload) {
      state.token = payload
      localStorage.setItem("access_token", payload)
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!",state.token)
    }
  },
  actions: {
    login() {

    }
  }
})