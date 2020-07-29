
<script>
export default {
  name: 'TableMix',
  data() {
    return {
      TABLE: {
        loading: false,
        resource: {
          uri: null,
          api: null,
          includes: [],
          fields: []
        },
        data: [],
        columns: [],
        search: {
          input: '',
          model: [],
          options: this.SearchOptions
        },
        searcheable: {},
        filterable: {},
        pagination: {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0,
          sortBy: null,
          descending: false,
        },
        searchFn: (val, doneFn, abortFn) => {
          this.TABLE.search.input = val
          doneFn(
            () => {},
            ref => {
              if (val !== '' && ref.options.length > 0 && ref.optionIndex === -1) {
                ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
                // ref.toggleOption(ref.options[ref.optionIndex], true) // toggle the focused option
              }
            })
        },
        searchSelected: (v) => {
          this.$refs.searcheable.updateInputValue('')
        },
        syncParameter: () => {
          if (this.$route.query.limit) this.TABLE.pagination.rowsPerPage = this.$route.query.limit
          if (this.$route.query.sort) this.TABLE.pagination.sortBy = this.$route.query.sort
        },
        getParameters: (values = null) => {
          let params = []
          const pagination = Object.assign(this.TABLE.pagination, values)
          if (pagination.page > 1) params.push(`page=${pagination.page}`)
          if (pagination.sortBy) params.push(`sort=${pagination.sortBy}`)
          if (pagination.descending) params.push(`descending`)
          if (pagination.hasOwnProperty('rowsPerPage')) params.push(`limit=${pagination.rowsPerPage}`)

          let
            includes = this.TABLE.resource.includes,
            fields = [
            ...this.TABLE.columns.filter(row => typeof row.field === 'string' ).map(row => row.field),
            ...this.TABLE.resource.fields
          ]

          if (fields.length) params.push(`field=${fields.join(',')}`)
          if (includes.length) params.push(`include=${includes.join(',')}`)

          if (this.TABLE.search.model && this.TABLE.search.model.length) {
            const model = this.TABLE.search.model
            let searcheable = {}
            for (let i = 0; i < model.length; i++) {
              if (!searcheable.hasOwnProperty(model[i].fill)) {
                searcheable[model[i].fill] = model[i].value
              }
              else searcheable[model[i].fill] += model[i].value
              searcheable[model[i].fill] = model[i].value
            }
          }
          return params
        },
        submitSearch: () => {

          console.warn('SUBMIT SEARCH', this.TABLE.getParameters())
        }
      }
    }
  },
  computed: {
    _TableSearchOptions() {
      let searcheable = { search: {noAvatar: true, label: 'Search', value: null} }
      if (String(this.TABLE.search.input).length) {
        searcheable = {...searcheable, ...this.TABLE.searcheable }
      }

      return Object.keys(searcheable).map(row => ({
        value:`${this.TABLE.search.input}`,
        label:`${this.TABLE.search.input}`,
        // input:`${this.TABLE.search.input}`,
        name: searcheable[row].name || row,
        avatar: searcheable[row].avatar || searcheable[row].name || row,
        noAvatar: searcheable[row].noAvatar,
        disable: !String(this.TABLE.search.input).length,
        fill: row
      }))
    }
  },
  watch: {
    '_TableSearchOptions': function(v) {
      this.TABLE.search.options = v
    }
  },
  created() {
    this.$nextTick(() => {
      this.TABLE.search.options = this._TableSearchOptions
      // console.warn(this)
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.init()
    })
  },
  beforeRouteUpdate(to, from, next) {
    next()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      this.TABLE.syncParameter()
      let api = this.TABLE.resource.api
      api += '?' + this.TABLE.getParameters().join('&')
      this.TABLE.loading = true
      this.$axios.get(api)
      .then(response => {
        this.TABLE.data = response.data.data
        const pagination = response.data.meta.pagination
        this.TABLE.pagination.page = Number(pagination.current_page)
        this.TABLE.pagination.rowsNumber = Number(pagination.total)
        this.TABLE.pagination.rowsPerPage = Number(pagination.per_page)
      })
      .catch(error => {
        this.$app.response.error()
      })
      .finally(() => {
        this.TABLE.loading = false
      })
    },
    request(props) {
      const parameters = this.TABLE.getParameters(props.pagination).join('&')
      this.$router.push(`${this.TABLE.resource.uri}?${parameters}`)
    },
  },
}
</script>

<style lang="sass">
.table-top-no-padding
  .q-table__top
    padding: 0
.pagination-fixed-bottom::after
  content: ''
  min-height: 100px
.pagination-fixed-bottom.q-table--grid
  .q-table__bottom
    background-color: #fff
    position: fixed
    right: 0
    bottom: 0
    left: 0

  .q-table__bottom::before
    content: ''
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.2), 0 0px 5px rgba(0, 0, 0, 0.24)

.pagination-fixed-bottom.q-table--grid.q-table--dark .q-table__bottom
  background-color: $grey-10

.my-sticky-virtscroll-table.q-table__card
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

.my-sticky-virtscroll-table.q-dark
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #1d1d1d


.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 410px

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
