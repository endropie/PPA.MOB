import { axiosInstance } from 'boot/axios'
import { LocalStorage } from 'quasar'

const REGISTER_ROUTE = 'api/auth/register'
const VERIFICATION_ROUTE = 'api/auth/verify'
const LOGIN_ROUTE = 'api/auth/login'
const PASSWORD_FORGOT_ROUTE = 'api/auth/password/forgot'
const PASSWORD_RESET_ROUTE = 'api/auth/password/reset'
const FETCH_USER_ROUTE = 'api/profile?field=*,permissions'

export function register (state, data) {
  return axiosInstance.post(REGISTER_ROUTE, data)
}

export function login (state, data) {
  const p = new Promise(function (resolve, reject) {
    return axiosInstance
      .post(LOGIN_ROUTE, data.body)
      .then(response => {
        state.commit('setUser', response.data)
        const token = response.data.meta.token
        axiosInstance.defaults.headers.common['Authorization'] =
          'Bearer ' + token
        state.dispatch('setToken', {
          token: token,
          rememberMe: data.rememberMe
        })
        resolve()
      })
      .catch(error => {
        console.error(error.response || error)
        reject(error)
      })
  })
  return p
}

export function setToken (state, data) {
  axiosInstance.defaults.headers.common['Authorization'] =
    'Bearer ' + data.token
  if (data.rememberMe) {
    LocalStorage.set('authorization_token', data.token, {
      expires: 365
    })
  } else {
    LocalStorage.set('authorization_token', data.token)
  }
}

export async function fetch (state) {
  if (state.user) {
    return true
  }
  var token = LocalStorage.getItem('authorization_token')
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token
    return axiosInstance.get(FETCH_USER_ROUTE).then(response => {
      state.commit('setUser', response.data)
    })
  }
}

export function logout (state) {
  if (LocalStorage.has('authorization_token')) LocalStorage.remove('authorization_token')
  state.commit('setUser', null)
}

export function verify (state, token) {
  return axiosInstance.get(VERIFICATION_ROUTE + '?token=' + token)
}

export function passwordForgot (state, data) {
  return axiosInstance.post(PASSWORD_FORGOT_ROUTE, data)
}

export function passwordReset (state, { token, data }) {
  return axiosInstance.post(PASSWORD_RESET_ROUTE + '?token=' + token, data)
}
