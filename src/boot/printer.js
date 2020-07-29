import { Dialog } from 'quasar'
import printer from '../store/printer'
// import enUS from '../i18n/en-us/printer'

export default ({ app, router, store, Vue }) => {

  // Register i18n
  // app.i18n.mergeLocaleMessage('en-us', enUS)

  // Register printer store
  store.registerModule('printer', printer)


  var btprint = {}
  btprint.connect = (item) => { return store.dispatch('printer/connectBTPrinter', item) }
  btprint.disconnect = (item) => { return store.dispatch('printer/disconnectBTPrinter', item) }
  Vue.prototype.$btprint = btprint
}
