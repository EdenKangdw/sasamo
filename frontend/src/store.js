import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    token: "",
    log : "HELLO",
    event: "",
  },
  mutations: {
    updateToken(state, payload) {
      state.token = payload
      localStorage.setItem("access_token", payload)
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!",state.token)
    },
    updateEvent(state, payload) {
      state.event = payload
      localStorage.setItem("Event", payload)
      console.log('Store : update event:', state.event)
    }
  },
  actions: {
    login() {

    }
  }
})