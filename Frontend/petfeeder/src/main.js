import Vue from 'vue'
import App from './App.vue'
//router
import router from './routers/router'
import VueRouter from 'vue-router'
//vuex
import Vuex from 'vuex'
import store from './stores/store.js'
//api
import axios from 'axios'
import VueAxios from 'vue-axios'
// bootstrap
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
