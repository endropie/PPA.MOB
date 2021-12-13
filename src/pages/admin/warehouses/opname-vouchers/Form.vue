<template>
  <!-- <base-dialog maximized v-if="true"> -->
    <q-page padding v-if="RECORD.show">
      <q-card class="column" >
        <q-card-section class="row text-no-wrap"  v-if="rsForm">
          <div class="text-h6">
            <span v-if="RECORD.data.number">#{{RECORD.data.number}}</span>
          </div>
          <q-space/>
          <div class="text-subtitle2" v-if="rsForm.user_by">By: {{rsForm.user_by.name}}</div>
        </q-card-section>
        <q-card-section class="col-stretch row q-col-gutter-sm">
          <!-- <q-input class="col-12 col-sm-6" type="text"
            label="Number"
            v-model="rsForm.number"
            :error="$v.rsForm.number.$error"
            :error-message="$vuelidate.message($v.rsForm.number, 'Number')"
          /> -->
          <q-select class="col-12 col-md-6"
            label="Stockist"
            v-model="rsForm.stockist"
            :options="['FM', 'WIP', 'PFG', 'FG', 'NC', 'NCR','NG']"
            :error="$v.rsForm.stockist.$error"
            :error-message="$vuelidate.message($v.rsForm.stockist, 'Number')"
          />
          <app-select class="col-12 col-md-6"
            label="Part"
            v-model="rsForm.item"
            filter clearable
            source="/api/common/items?mode=limitation&enable=1"
            :XXsource-filters="['part_number','part_name']"
            :source-fields="['*','enable','unit_convertions']"
            optio-value='id'
            :option-label="(opt)=> opt.part_name"
            :option-sublabel="(opt) => `[${opt.customer_code}] No. ${opt.part_number}`"
            :option-disable="(opt) => !opt.enable"
            @input="(v) => {
              rsForm.item_id = v ? v.id : null
              rsForm.unit = null
            }"
            :error="$v.rsForm.item.id.$error"
            :error-message="$vuelidate.message($v.rsForm.item.id, 'Part')"
          />
          <q-input class="col-12 col-md-6" type="number"
            label="Quantity"
            v-model="rsForm.quantity"
            :error="$v.rsForm.quantity.$error"
            :error-message="$vuelidate.message($v.rsForm.quantity, 'Quantity')" >
            <q-select slot="after" class="no-padding" style="min-width: 75px"
              label="Unit"
              v-model="rsForm.unit"
              :options="rsForm.item ? rsForm.item.unit_convertions : []"
              option-value="id"
              option-label="code"
              @input="(v) => {
                rsForm.unit_id = rsForm.unit ? rsForm.unit.id : null
                rsForm.unit_rate = rsForm.unit ? rsForm.unit.rate : 1
              }"
              :error="$v.rsForm.unit.id.$error"
              :error-message="$vuelidate.message($v.rsForm.unit.id, 'Unit')"
            />

          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn glossy color="grey-5" icon="refresh" label="Reset" />
          <q-btn glossy color="positive" icon="save" label="Save" @click="save" />
        </q-card-actions>
      </q-card>
      <q-inner-loading :showing="RECORD.loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-page>
  <!-- </base-dialog> -->
</template>

<script>
import RecordMix from '@/mixins/RecordMix'
import DialogMix from '@/mixins/DialogMix'

export default {
  name: 'OpnameVoucherForm',
  mixins: [RecordMix, DialogMix],
  data: () => ({
    DIALOG: {
      show: true
    },
    RECORD: {
      show: false,
      resource: {
        uri: '/admin/warehouses/opname-vouchers',
        api: '/api/warehouses/opname-vouchers',
        includes: ['item', 'unit', 'user_by'],
        fields: ['*,**']
      },
      default: () => ({
        id: null,
        number: null,
        quantity: null,
        stockist: null,
        item: null,
        unit: null,
        status: 'VALIDATED'
      })
    },
    rsForm: null
  }),
  validations () {
    const { required, minValue } = this.$validator
    return {
      rsForm: {
        // number: { required, minLength: minLength(3) },
        stockist: { required },
        item: { id: { required } },
        unit: { id: { required } },
        quantity: { required, minValue: minValue(0) }
      }
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      this.RECORD.show = false
      this.$v.$reset()
      this.dataload(data => {
        let meta = this.RECORD.meta()
        if (meta.mode === 'create' && Boolean(meta.query.id)) {
          this.RECORD.show = false
          this.RECORD.loading = true
          let api = `${this.RECORD.resource.api}/${meta.query.id}?${this.RECORD.apiParameters().join('&')}`
          this.$axios.get(api)
            .then(response => {
              const data = { ...response.data, number: null, fullnumber: null, quantity: null }
              this.RECORD.data = JSON.parse(JSON.stringify(data))
              this.rsForm = data
            })
            .catch(error => {
              this.$app.response.error(error).onOk(() => this.$router.back())
            })
            .finally(() => {
              this.RECORD.show = true
              this.RECORD.loading = false
            })
        } else {
          this.rsForm = data
          this.RECORD.show = true
        }
      })
    },
    save () {
      const submit = () => {
        let { mode, method, url } = this.RECORD.meta()
        this.RECORD.loading = true
        console.warn('SAVE', method, url, this.rsForm)
        this.$axios.set(method, url, this.rsForm)
          .then((response) => {
            this.$v.$reset()
            console.warn('response', response)

            const redirect = (mode !== 'create')
              ? `${this.RECORD.resource.uri}/${response.data.id}`
              : `${this.RECORD.resource.uri}/${response.data.id}?autoprint=true&autocreate=true`

            console.warn('redirect', redirect)
            this.$router.replace(redirect)
          }).catch((error) => {
            console.error(error.response || error)
            this.$app.notify.error('Saving was invalid!')
          }).finally(() => {
            this.RECORD.loading = false
          })
      }

      this.$v.$touch()
      this.$nextTick(() => {
        // console.warn('$v', this.$v.$reset());
        if (this.$v.$error) {
          console.warn('error', this.$v.$error)
          return this.$app.notify.error({ message: 'The field was invalid!' })
        }
        this.$app.confirm({ title: 'SUBMIT', message: 'Are you sure next to saving record?' }).onOk(() => submit())
      })
    }
  }
}
</script>
