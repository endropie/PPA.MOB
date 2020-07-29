import { Notify } from 'quasar'
import { axiosInstance } from './axios'
import { jsonapiModule } from 'jsonapi-vuex'
import auth from '../store/auth'
import enUS from '../i18n/en-us/auth'

const ADMIN_ROUTE = '/admin'

/* eslint-enable no-use-before-define */
function isArrayOrString (variable) {
  if (typeof variable === typeof [] || typeof variable === typeof '') {
    return true
  }
  return false
}

export default ({ app, router, store, Vue }) => {
  axiosInstance.interceptors.response.use((response) => {
    return response
  }, (error) => {
    if (!error.response) {
      Notify.create({
        message: app.i18n.t('auth.network_error'),
        color: 'red',
        position: 'top'
      })
    }
    return Promise.reject(error)
  })

  /**
   * Register i18n
   */
  app.i18n.mergeLocaleMessage('en-us', enUS)

  /**
   * Register auth store
   */
  store.registerModule('auth', auth)

  store.registerModule('jv', jsonapiModule(axiosInstance))

  /**
   * Set route guard
   */
  router.beforeEach((to, from, next) => {

    // const record = to.matched.find(record => record.meta.auth)
    const record = to.meta.auth ? to : to.matched.find(record => record.meta.auth)
    if (record) {
      store.dispatch('auth/fetch').then(() => {
        if (!store.getters['auth/loggedIn']) {
          next('/admin/error?code=401')
        }
        else if (isArrayOrString(record.meta.auth) && !store.getters['auth/check'](record.meta.auth)) {
          next(`/admin/error?code=403`)
        }
        else next()
      }).catch(err => {
        console.error('BeforeEach -> [Not redirect]', err.response || err)
      })
    }
    else if (['/admin/auth/login','/admin/auth/register'].find(x => x === to.path))
    {
      store.dispatch('auth/fetch').then(() => {
        if (store.getters['auth/loggedIn']) {
          next(ADMIN_ROUTE)
        }
        else next()
      }).catch(err => {
        console.error('BeforeEach -> [Not redirect]', err.response || err)
        next()
      })
    }
    else next()

  })

  /**
   * Set authentication routes
   */
  let { routes } = router.options
  let routeData = routes.find(r => r.path === '/')
  routeData.children = [
    {
      path: '/admin/auth/login',
      name: 'login',
      component: () => import('pages/auth/Login')
    },
    {
     path: '/admin/auth/logout',
      name: 'logout',
      component: () => import('pages/auth/Logout')
    },
    {
     path: '/admin/auth/register',
      name: 'register',
      component: () => import('pages/auth/Register')
    },
    {
     path: '/admin/auth/callback/:network',
      name: 'callback',
      component: () => import('pages/auth/Callback')
    },
    {
     path: '/admin/auth/verification',
      name: 'verification',
      component: () => import('pages/auth/Verification')
    },
    {
     path: '/admin/auth/password',
      name: 'password',
      component: { render: h => h('router-view') },
      children: [
        {
         path: '/admin/auth/forgot',
          name: 'forgot',
          component: () => import('pages/auth/password/Forgot')
        },
        {
         path: '/admin/auth/reset',
          name: 'reset',
          component: () => import('pages/auth/password/Reset')
        }
      ]
    },
  ]

  router.addRoutes([routeData])

  store.dispatch('auth/fetch').catch(() => {
    // store.dispatch('auth/logout')
  })

  var helper = {}
  helper.register = (data) => { return store.dispatch('auth/register', data) }
  helper.loggedIn = () => { return store.getters['auth/loggedIn'] }
  helper.check = (roles) => { return store.getters['auth/check'](roles) }
  helper.login = async (data) => { return store.dispatch('auth/login', data) }
  helper.setToken = (data) => { return store.dispatch('auth/setToken', data) }
  helper.logout = () => { return store.dispatch('auth/logout') }
  helper.verify = (token) => { return store.dispatch('auth/verify', token) }
  helper.passwordForgot = (data) => { return store.dispatch('auth/passwordForgot', data) }
  helper.passwordReset = (data) => { return store.dispatch('auth/passwordReset', data) }
  helper.fetch = () => { return store.dispatch('auth/fetch') }
  helper.user = () => { return store.getters['auth/user'] }
  Vue.prototype.$auth = helper
}
