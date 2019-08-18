import Vue from 'vue'
import Router from 'vue-router'
import sasamo from '@/components/Sasamo_index'
import sasamo_main from '@/components/Sasamo_main'
import sasamo_signup from '@/components/Sasamo_signup'
import sasamo_myteam from '@/components/Sasamo_myteam'

Vue.use(Router)

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
    },
    {
      path: '/myteam',
      name: 'sasamo_myteam',
      component: sasamo_myteam
    }
  ]
})
