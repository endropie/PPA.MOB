
<script>
import BTPrintControl from '@/components/BTPrintControl'
import AppModal from '@/components/AppModal'
const elPrinter = window.BTPrinter

export default {
  name: 'BTPrintMix',
  data () {
    return {
      BTPRINT: {
        pre: () => {
          this.$q.loading.show()
          return new Promise((resolve, reject) => {
            const item = this.$store.state.printer.BTPrinter
            let rejection = {
              device: item,
              support: Boolean(elPrinter),
              message: 'BT Printer was failed!'
            }

            if (!elPrinter) {
              this.$q.loading.hide()
              return reject({...rejection, message: 'BT printer has not supported!'})
            }
            setTimeout(() => {
              if (!item) {
                this.$q.loading.hide()
                return reject({...rejection, message:'Device has not selected.'})
              }
              else return elPrinter.printText((done) => {
                this.$q.loading.hide()
                resolve(elPrinter)
              },() => {
                return elPrinter.connect((conn) => {
                  console.warn('on->Connecting..!')
                  this.$q.loading.hide()
                  resolve(elPrinter)
                }, (fail) => {
                  this.$q.notify(`Connecting [${item.name || item.address}] Fail`)
                  this.$q.loading.hide()
                  reject({...rejection, message:String(fail)})
                }, item.name)
              }, '\n')
            }, 1000)
          })
        },
        on: (callback) => {
          return new Promise ((resolve, reject) => {
            return this.BTPRINT.pre()
              .then((e) => {
                callback(e)
                setTimeout(() => resolve(), 1000)
              }).catch((err) => {
                if (!err.support) {
                  this.$q.notify(JSON.stringify(err.message))
                  setTimeout(() => reject(), 1000)
                }
                else {
                  this.BTPRINT.control()
                  .then((res) => {
                    console.warn('control->done', res);
                    callback(elPrinter)
                    setTimeout(() => resolve(), 1000)
                  }).catch((err) => {
                    console.warn('control->error', err)
                    this.$q.notify(JSON.stringify('Printer Canceled!'))
                    setTimeout(() => reject(), 1000)
                  })
                }
              })
          })
        },
        control: (attrs = {}) => {
          return new Promise ((resolve, reject) => {
            this.$app.modal({
              component: BTPrintControl,
              parent: this,
              title: 'BT Print Manager',
            }).onOk(resolve).onCancel(reject)
          })
        },
        connect(item) {
          return new Promise((resolve, reject) => {
            return elPrinter.connect((conn) => {
              this.$store.commit('printer/setBTPrinter', item)
              setTimeout(() => {
                resolve(conn)
              }, 1500)
            },(fail) => {
              reject(fail)
            }, item.name)
          })
        },
        disconnect (item) {
          return new Promise((resolve, reject) => {
            return elPrinter.disconnect((conn) => {
              this.$store.commit('printer/setBTPrinter', null)
              setTimeout(() => {
                resolve(conn)
              }, 500)
            },(fail) => {
              reject(fail)
            }, item.name)
          })
        },
        nl2br: function (str, replaceMode, isXhtml) {
          var breakTag = (isXhtml) ? '<br />' : '<br>';
          var replaceStr = (replaceMode) ? '$1'+ breakTag : '$1'+ breakTag +'$2';
          return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
        }
      }
    }
  },
  created() {
    // this.BTPRINT.pre()
  },
}
</script>
