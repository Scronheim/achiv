import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import Main from '../views/MainPage'

// import guest from './middleware/guest'
import auth from './middleware/auth'
import admin from './middleware/admin'
import middlewarePipeline from './middlewarePipeline'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Main
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Login')
  },
  {
    path: '/register',
    name: 'Register page',
    component: () => import('../views/Register')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {
      middleware: [auth]
    },
    component: () => import('../views/Profile')
  },
  {
    path: '/user/:winlogin',
    name: 'User profile',
    meta: {
      middleware: [auth]
    },
    component: () => import('../views/UserProfile')
  },
  {
    path: '/admin',
    name: 'Admin page',
    meta: {
      middleware: [auth, admin]
    },
    component: () => import('../views/Admin')
  }
]

const router = new VueRouter({
  routes
})
//https://webdevblog.ru/ispolzovanie-middleware-vo-vue/
router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware
  const context = {
    to,
    from,
    next,
    store
  }
  return middleware[0]({
    ...context,
    nextMiddleware: middlewarePipeline(context, middleware, 1)
  })
})

export default router
