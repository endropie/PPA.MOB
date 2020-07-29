<template>
  <q-page padding v-if="RECORD.show">
    <q-card>
      <q-card-section class="row text-no-wrap">
        <div class="row col">
          <div class="text-h6"># {{rsView.number}}</div>
          <q-space/>
          <q-chip  :label="rsView.status" color="blue-10" text-color="white"/>
        </div>
        <div class="col-auto">
          <q-btn flat outline round icon="more_vert" >
            <q-menu>
              <q-list style="min-width: 200px" dense>
                <q-item clickable v-close-popup :to="`${RECORD.resource.uri}/create`">
                  <q-item-section side><q-avatar icon="add_circle" size="42px"/></q-item-section>
                  <q-item-section>NEW</q-item-section>
                </q-item>
                <q-item clickable v-close-popup :to="`${RECORD.resource.uri}/${$route.params.id}/edit`" v-if="ON.EDITABLE()">
                  <q-item-section side><q-avatar icon="edit" size="42px"/></q-item-section>
                  <q-item-section>EDIT</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="setDelete()" v-if="ON.EDITABLE()">
                  <q-item-section side><q-avatar icon="delete" size="42px"/></q-item-section>
                  <q-item-section>DELETE</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="setVoid()" v-if="ON.VOID()">
                  <q-item-section side><q-avatar icon="block" size="42px"/></q-item-section>
                  <q-item-section>VOID</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <!-- <div class="text-subtitle2" v-if="rsView.user_by">By: {{rsView.user_by.name}}</div> -->
      </q-card-section>
      <q-card-section class="q-pa-md q-gutter-md">
        <div class="text-no-wrap ellipsis">
          <div class="text-weight-bold">{{rsView.item.part_name}}</div>
          <div class="text-grey">[{{rsView.item.customer_code}}] No. {{rsView.item.part_number}}</div>
        </div>
        <div class="row items-center">
          <div>
            <div class="text-grey">Quantity</div>
            {{rsView.quantity}}
            <span class="on-right">{{rsView.unit.code}}</span>
          </div>
          <q-space />
          <q-chip square :label="rsView.stockist" class="text-weight-medium"/>
        </div>
        <div class="text-no-wrap ellipsis text-grey">
          <div class="text-subtitle2">By: {{rsView.user_by.name}}</div>
          <div class="">{{rsView.created_at}}</div>
        </div>
      </q-card-section>
    </q-card>
    <q-page-sticky position="bottom-right" :offset="[25, 25]">
      <q-btn dense fab icon="print" color="primary" @click="toPrintView(rsView)" />
    </q-page-sticky>
     <q-dialog ref="dialogCreateNew" v-if="rsView">
      <q-card>
        <q-bar>
          <div>CREATE NEW</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          Redirect to create new again.
        </q-card-section>

        <q-card-actions class="q-pt-none">
          <q-btn flat color="primary" label="Create New" @click="$router.push(`${RECORD.resource.uri}/create`)" />
          <q-btn color="primary" icon="library_add" label="Create Last Part"
            @click="$router.push(`${RECORD.resource.uri}/create?id=${rsView.id}&item_id=${rsView.item_id}&stockist=${rsView.stockist}`)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import RecordMix from '@/mixins/RecordMix'
import DialogMix from '@/mixins/DialogMix'
import BTPrintMix from '@/mixins/BTPrintMix';
export default {
  name: 'OpnameVoucherView',
  mixins: [RecordMix, DialogMix, BTPrintMix],
  data: () => ({
    RECORD: {
      resource: {
        uri: '/admin/warehouses/opname-vouchers',
        api: '/api/warehouses/opname-vouchers',
        includes: ['item','unit','user_by'],
        fields: ['*,**']
      },
      data: null,
      default: () => ({
        id: null,
        number: null,
        quantity: null,
        stockist: null,
        item: null,
        unit: null,
      })
    },
    rsView: null,
  }),
  computed: {
    ON () {
      return {
        EDITABLE: () => {
          if (this.RECORD.data.deleted_at) return false
          if (this.RECORD.data.status !== 'OPEN') return false
          return true
        },
        VOID: () => {
          if (this.RECORD.data.deleted_at) return false
          if (this.RECORD.data.status === 'OPEN') return false
          return true
        }
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    load () {
      let { query } = this.RECORD.meta()
      this.dataload(data => {
        this.rsView = data
        if (query.autoprint) {
          this.toPrintView(data)
        }
      })
    },
    setVoid() {

      const submit = () => {
        let { url } = this.RECORD.meta()
        this.RECORD.loading = true
        this.$axios.delete(url + '?mode=void')
        .then((response) => {
          this.$app.notify.success('VOID Success!')
          // this.load()
          setTimeout(() => this.$router.replace(this.RECORD.resource.uri), 500)
        }).catch((error) => {
          console.error(error.response || error)
          this.$app.notify.error('VOID was invalid!')
        }).finally(() => {
          this.RECORD.loading = false
        })
      }

      this.$nextTick(() => {
        this.$app.confirm({ title: 'VOID', message: 'Are you sure to VOID ?'}).onOk(() => submit())
      })
    },
    toPrintView (data) {
      let vTextHead =
         '\n'
        + `${data.number}\n`
        + `[${data.item.customer_code}]\n`
      let vTextBody =
          `[NAME] `
        + `${data.item.part_name}\n\n`
        + `[P/N] `
        + `${data.item.part_number}\n\n`

        + `[QTY] ${Math.round(data.quantity)} ${data.unit.code}\n`
        + `[STOKIST] ${data.stockist}\n`
      let vTextFoot =
          `BY: ${data.user_by.name}\n`
        + `AT: ${data.created_at}\n`

      const redirect = () => {
        const {query} =  this.RECORD.meta()
        if (query.autocreate) {
          this.$nextTick(() => {
            console.warn('REF', this.$refs)
            this.$refs['dialogCreateNew'].show()
          })
          // this.$router.replace(`${this.RECORD.resource.uri}/create`)
          // this.$q.dialog({
          //   title: 'CREATE NEW',
          //   message: 'Redirect to create new again.',
          //   ok: { label: 'LAST PART', icon: 'library_add', flat: true },
          //   test: { label: 'NEW PART', icon: 'add_box', flat: true },
          // })
          // .onOk(() => this.$router.replace(`${this.RECORD.resource.uri}/create?item_id=1&stockist=1`))
          // .onTest(() => this.$router.replace(`${this.RECORD.resource.uri}/create`))
        }
        else {
          console.warn('no redirected!')
        }
      }

      // sizes = ['31', '10', '61']

      this.BTPRINT.on((e) => {
        e.printText(null,null, '\n\n')
        e.printTextSizeAlign(null,null, vTextHead, '30', '1')
        e.printTextSizeAlign(null,null, '================\n', '20', '1')
        e.printTextSizeAlign(null,null, vTextBody, '31', '0')
        e.printTextSizeAlign(null,null, '================\n', '20', '1')
        e.printTextSizeAlign(null,null, vTextFoot, '10', '0')
        e.printText(null,null, '\n\n\n')
      })
      .finally(() => {
        console.warn('Finally->BTPRINTER')
        redirect()
      })
    }
  },
}
</script>
