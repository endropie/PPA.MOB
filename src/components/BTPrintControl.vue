<template>
  <q-card>
    <q-card style="width: 280px">
      <q-card-section class="q-gutter-sm">
        <div class="row">
          <q-btn label="Print Test" class="content-stretch" @click="testPrint()" v-if="true" />
          <q-space/>
          <q-btn flat round icon="refresh" @click="loadBTPrinter" />
        </div>
        <q-list bordered>
          <q-item clickable v-ripple @click="register(item)"
            v-for="(item, index) in BTP.list" :key="index">
            <q-item-section >
              <q-item-label v-text="item.name" />
              <q-item-label v-text="item.address" :caption="Boolean(item.name)" class="text-grey-8"/>
            </q-item-section>
            <q-item-section side v-if="BTPrinter && BTPrinter.address === item.address">
              <q-avatar icon="check" text-color="positive" />
            </q-item-section>
          </q-item>
          <q-item v-if="BTP.list.length == 0">
            <q-item-section top avatar>
              <q-avatar icon="warning" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption lines="2">
                No Result Bluetooth devices is paired.
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    <q-inner-loading :showing="BTP.loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
const eBTPrinter = window.BTPrinter || null

export default {
  name: 'BTPrintControl',
  data: () => ({
    BTP: {
      loading: false,
      list: []
    }
  }),
  computed: {
    ...mapGetters('printer', ['BTPrinter'])
  },
  created () {
    this.loadBTPrinter()
  },
  methods: {
    testPrint () {
      console.warn('TEST', eBTPrinter)
      const e = window.BTPrinter

      if (!e) this.$q.notify('BT Printer no supported!')
      e.printText(() => {
        console.warn('printer', e)
        // e.printText(null,null,  `\x1b\x44\x04\x00` + `\x091234567890\n`) // TAB
        // e.printText(null,null,  `\x1b\x2d\x02` + `1234567890\n`) // underline

        e.printTextSizeAlign(null, null, 'Font 8\n' + '12345678901234567890123456789012\n', '8', '0')
        // e.printTextSizeAlign(null,null, 'Font 10\n'+"12345678901234567890123456789012\n", '10','0')
        // e.printTextSizeAlign(null,null, 'Font 11\n'+"123456789012345678901234567890123456789012\n", '11','0')
        // e.printTextSizeAlign(null,null, 'Font 20\n'+"1234567890123456\n", '20','0')
        // e.printTextSizeAlign(null,null, 'Font 30\n'+"1234567890123456\n", '30','0')
        // e.printTextSizeAlign(null,null, 'Font 31\n'+"123456789012345678901\n", '31','0')
        // e.printTextSizeAlign(null,null, 'Font 51\n'+"123456789012345678901234567890123456789012\n", '51','0')
        // e.printTextSizeAlign(null,null, 'Font 61\n'+"123456789012345678901\n", '61','0')
        e.printText((done) => console.warn, console.error, '\n\n')
      }, (fail) => {
        this.$q.notify('PRINT TEST FAILED!')
      }, '')
    },
    register (item) {
      this.BTP.loading = true
      const connecting = () => {
        setTimeout(() => {
          this.connect(item)
            .then(() => {
              this.$q.notify('Connecting success!')
              this.$emit('ok')
              this.$emit('hide')
            }).catch((fail) => {
              this.$q.notify('Connecting Fail!')
            }).finally(() => {
              this.BTP.loading = false
            })
        }, 1000)
      }

      const disconnecting = (reconnect = false) => {
        setTimeout(() => {
          this.disconnect(this.BTPrinter)
            .then((done) => {
              if (!reconnect) this.$q.notify('Disconnecting success!')
            }).catch((fail) => {
              if (!reconnect) this.$q.notify('Disconnecting Fail!')
            }).finally(() => {
              if (!reconnect) this.BTP.loading = false
              else reconnect()
            })
        }, 1000)
      }

      if (!this.BTPrinter) return connecting()
      else if (this.BTPrinter.address === item.address) disconnecting()
      else {
        disconnecting(() => connecting())
      }
    },
    connect (item) {
      return new Promise((resolve, reject) => {
        return eBTPrinter?.connect((conn) => {
          this.$store.commit('printer/setBTPrinter', item)
          setTimeout(() => {
            resolve(conn)
          }, 1500)
        }, (fail) => {
          reject(fail)
        }, item.name)
      })
    },
    disconnect (item) {
      return new Promise((resolve, reject) => {
        return eBTPrinter?.disconnect((conn) => {
          this.$store.commit('printer/setBTPrinter', null)
          setTimeout(() => {
            resolve(conn)
          }, 500)
        }, (fail) => {
          reject(fail)
        }, item.name)
      })
    },
    loadBTPrinter () {
      const listen = () => {
        this.listenBTPrinter()
          .then((data) => {
            this.BTP.list = data
          }).catch((error) => {
            console.error(error)
          })
      }
      if (eBTPrinter) listen()
      else this.$q.notify('BT Printer not supported!')
    },
    listenBTPrinter () {
      const lister = (data) => {
        const list = []
        for (let i = 0; i < data.length; i += 3) {
          list.push({
            name: data[i],
            address: data[i + 1],
            type: data[i + 2]
          })
        }
        return list
      }
      console.warn('LISTEN', eBTPrinter, this.$q.cordova)
      return new Promise(function (resolve, reject) {
        return eBTPrinter?.list((data) => {
          resolve(lister(data))
        }, (fail) => {
          reject(fail)
        })
      })
    }
  }
}
</script>
