import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify';
import router from './router'
import Toast from 'vue-toastification';
import moment from 'moment'
import _ from 'lodash'
import 'vue-toastification/dist/index.css';

Vue.config.productionTip = false

Vue.prototype.$moment = moment
Vue.prototype.$_ = _

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  newestOnTop: true,
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.7,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false,
});

Vue.filter('humanDate', ((value) => {
  if (!value) return ''
  return moment(value).format('DD.MM.YYYY')
}))

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
