<script>

export default {
  name: 'RecordMix',
  data()  {
    return ({
      RECORD: {
        show: false,
        loading: false,
        resource: {
          uri: null,
          api: null,
          fields: ['*','**'],
          includes: []
        },
        data: null,
        default: () => ({}),
        apiParameters: () => {
          let params = []
          let fields = [ ...this.RECORD.resource.fields ]
          let includes = this.RECORD.resource.includes

          if (fields.length) params.push(`field=${fields.join(',')}`)
          if (includes.length) params.push(`include=${includes.join(',')}`)
          return params
        },
        meta: () => {
          const meta = this.$route.meta || {}
          const params = this.$route.params || {}
          const query = this.$route.query || {}
          return ({
            ...meta,
            params,
            query,
            method: meta.submit || (meta.mode === 'create' ? 'POST' : 'PUT') || null,
            url: this.RECORD.resource.api + (meta.mode === 'create' ? '' : `/${String(params.id || '')}`),
          })
        },
      },
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // vm.load()
    })
  },
  beforeRouteUpdate(to, from, next) {
    next(vm => {
      //
    })
    this.$nextTick(() => this.load())
  },
  created() {
    this.load
  },
  methods: {
    load() {
      this.dataload(data => {
        // exam:
        // this.rsForm = data
      })
    },
    dataload (callback = false) {
      this.RECORD.data = []
      let { params, mode } = this.RECORD.meta()
      if (params.id && ['update', 'view'].find(x => x === mode)) {
        this.RECORD.show = false
        this.RECORD.loading = true
        let api = `${this.RECORD.resource.api}/${this.$route.params.id}?${this.RECORD.apiParameters().join('&')}`
        this.$axios.get(api)
        .then(response => {
          // console.warn('[APP] Response', response)
          this.RECORD.data = JSON.parse(JSON.stringify(response.data))
          if(callback) callback(response.data)
        })
        .catch(error => {
          this.$app.response.error(error).onOk(() => this.$router.back())
          console.error('[APP] Error', error.response||error)
        })
        .finally(() => {
          this.RECORD.show = true
          this.RECORD.loading = false
        })
      }
      else {
        this.RECORD.data = this.RECORD.default()
        callback(this.RECORD.default())
      }
    },
  },
}
</script>
