import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    }
  },
  actions: {
    getUser(context) {
      axios.get(`https://randomuser.me/api/`).then((response) => {
        context.commit('setUser', response.data.results[0])
      })
    }
  },
  modules: {
  },
  getters: {
    user: state => state.user
  }
})
