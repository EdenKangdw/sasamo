import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import sasamo from '@/components/Sasamo_index'
import sasamo_main from '@/components/Sasamo_main'
import sasamo_signup from '@/components/Sasamo_signup'



Vue.use(Router)
Vue.use(Vuex)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'sasamo',
      component: sasamo
    },
    {
      path: '/main',
      name: 'sasamo_main',
      component: sasamo_main
    },
    {
      path: '/signup',
      name: 'sasamo_signup',
      component: sasamo_signup
    }
  ]
})
