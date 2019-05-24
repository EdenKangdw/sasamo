import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/components/IndexPage'
import LoginPage from '@/components/LoginPage'
import MovieIndexPage from '@/components/MovieIndexPage'
import MovieShowPage from '@/components/MovieShowPage'
import sasamo from '@/components/Sasamo_index'
import sasamo_main from '@/components/Sasamo_main'
import sasamo_signup from '@/components/Sasamo_signup'



Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/movie',
      name: 'MovieIndexPage',
      component: MovieIndexPage
    },
    {
      path: '/movie/:id',
      name: 'MovieShowPage',
      component: MovieShowPage
    },
    {
      path: '/sasamo',
      name: 'sasamo',
      component: sasamo
    },
    {
      path: '/sasamo/main',
      name: 'sasamo_main',
      component: sasamo_main
    },
    {
      path: '/sasamo/signup',
      name: 'sasamo_signup',
      component: sasamo_signup
    }
  ]
})
