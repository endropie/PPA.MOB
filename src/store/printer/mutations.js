import { LocalStorage } from 'quasar'

export function usePrinter (state, data) {
  if (data) {
    LocalStorage.set('printer.use', data)
    state.use = data
  }
  else {
    LocalStorage.remove('printer.use')
    state.use = null
  }
}

export function setBTPrinter (state, data) {
  if (data) {
    LocalStorage.set('printer.BTPrinter', data)
    state.BTPrinter = data
  }
  else {
    LocalStorage.remove('printer.BTPrinter')
    state.BTPrinter = null
  }
}
