import { LocalStorage } from 'quasar'

export default function () {
  return {
    use: LocalStorage.getItem('printer.use') || null,
    BTPrinter: LocalStorage.getItem('printer.BTPrinter') || null,
  }
}
