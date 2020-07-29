import { Dark, LocalStorage, Dialog, Notify } from 'quasar'
import AppModal from '@/components/AppModal';
import AppSelect from '@/components/AppSelect'

const attrProp = function(prop) {
  if (typeof prop === 'object') return Object.assign({ ...prop})
  if (typeof prop === 'string') return Object.assign({message: prop})
  return {}
}

const attrError = function(error, prop) {
  const element = attrProp(prop)
  let attrs = Object.assign({
    title: 'Response Failed',
    message: 'Data resource failed! Please Contact Administrator',
    noEscDismiss: true,
    noBackdropDismiss: true,
    html: true}, element)

  if (error.response) {
    attrs.message += `<br><small class="q-mt-md">[CODE:${error.response.status}] ${error.response.statusText}</small>`
  }
  else {
    attrs.message = `Data resource failed! Please Contact Administrator`
                  + `<br><small class="q-mt-md">${String(error)}</small>`
  }

  return attrs
}


export default ({ app, router, store, Vue }) => {
  Vue.component('app-select', AppSelect)
  if (LocalStorage.has('dark.mode')) Dark.set(LocalStorage.getItem('dark.mode'))

  let { routes } = router.options

  let routeData = {
    path: '/settings',
    meta: {},
    component: () => import('@/layouts/AdminLayout'),
    children: [
      { path: '', name: 'SettingIndex', component: () => import('@/pages/settings/Index') },
    ]
  }

  router.addRoutes([routeData])

  const appInstance = {
    // ...process,
    env: process.env,
    modal: (attrs) => {
      const modal = {}
      for (const x in attrs) {
        if (!['parent', 'component'].find(f => f === x)) {
          modal[x] =  attrs[x]
        }
      }
      const attribute = Object({
        component: AppModal,
        children: attrs.component,
        parent: attrs.parent,
        modal })

      return Dialog.create(attribute)
    },
    response: {
      error: (error, prop) => {
        const attribute = attrError(error, prop)
        return Dialog.create(attribute)
      }
    },
    notify: {
      success: (val) => Notify.create(Object.assign({ message: 'Transaction Done!', color: 'positive'}, attrProp(val))),
      error: (val) => Notify.create(Object.assign({ message: 'Transaction error!', color: 'negative'}, attrProp(val)))
    },
    confirm: (val) => Dialog.create(Object.assign({
      title: 'CONFIRMATION',
      message: 'Are you sure next step',
      cancel: 'CANCEL',
      ok: 'OK',
    }, val))
  }
  Vue.prototype.$app = appInstance

}

