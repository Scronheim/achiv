import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    achievements: [],
    user: {},
    status: '',
    token: localStorage.getItem('token') || '',
  },
  mutations: {
    setAchievements(state, payload) {
      state.achievements = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, data){
      state.status = 'success'
      state.token = data.token
      state.user = data.user
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.status = ''
      state.token = ''
      state.user = {}
    },
  },
  actions: {
    getAchievements({commit}) {
      axios.get(`/api/achievements`).then((response) => {
        commit('setAchievements', response.data.results)
      })
    },
    getUser(context) {
      axios.get(`https://randomuser.me/api/`).then((response) => {
        context.commit('setUser', response.data.results[0])
      })
    },
    aboutMe({state, commit}) {
      return axios.get('/api/me', {headers: {'x-access-token': state.token}}).then((response) => {
        let data = {
          token: state.token,
          user: response.data
        }
        commit('auth_success', data)
      }).catch(() => {
        localStorage.removeItem('token')
      })
    },
    saveAboutMe(context, text) {
      let payload = {
        username: context.getters.user.username,
        about: text
      }
      return axios.patch('/api/aboutMe', payload)
    },
    login(context, user) {
      return new Promise((resolve, reject) => {
        context.commit('auth_request')
        axios({url: `/api/login`, data: user, method: 'POST' })
          .then(resp => {
            localStorage.setItem('token', resp.data.token)
            axios.defaults.headers.common['Authorization'] = resp.data.token
            let data = {token: resp.data.token, user:resp.data.user}
            context.commit('auth_success', data)
            resolve(resp)
          })
          .catch(err => {
            context.commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    register(context, user) {
      return new Promise((resolve, reject) => {
        context.commit('auth_request')
        axios({url: `/api/register`, data: user, method: 'POST' })
          .then(resp => {
            if (resp.data.success) {
              let data = {token: resp.data.data.token, user: resp.data.data.user}
              localStorage.setItem('token', resp.data.data.token)
              axios.defaults.headers.common['Authorization'] = resp.data.data.token
              context.commit('auth_success', data)
              resolve(resp)
            } else {
              context.commit('auth_error')
              reject(resp)
            }
          })
          .catch(err => {
            context.commit('auth_error', err)
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    logout({commit}) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    },
  },
  modules: {
  },
  getters: {
    user: state => state.user,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    isAdmin: state => !!state.user.is_admin,
  }
})
