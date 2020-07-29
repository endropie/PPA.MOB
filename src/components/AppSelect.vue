<template>
  <q-select
    ref="QSelect"
    class="ux-selet"
    v-model="value"
    v-bind="$attrs"
    v-on="$listeners"
    @filter="filterFunc"
    @input="inputFunction"
    :options="opt"
    :use-input="PROP.useInput"
    :fill-input="PROP.fillInput"
    :hide-selected="PROP.hideSelected"
    :input-debounce="inputDebounce"
    autocomplete="off">

    <!--  -->
    <template v-slot:option="scope">
      <slot name="option" :scope="{...scope}">
        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" >
          <slot name="option-prepend" :option="{...scope}">
            <q-item-section side v-if="scope.opt.icon">
              <q-item-section avatar v-if="scope.opt.icon">
                <q-icon :name="scope.opt.icon" />
              </q-item-section>
            </q-item-section>
          </slot>
          <q-item-section>
            <slot name="option-item" :option="{...scope}">
              <q-item-label v-html="getOptionLabel(scope.opt)" />
              <q-item-label caption>{{ getOptionSublabel(scope.opt) }}</q-item-label>
            </slot>
          </q-item-section>
          <slot name="option-append" :option="{...scope}">
            <q-item-section side v-if="scope.opt.stamp || $attrs['option-stamp']">
              <q-badge :label="scope.opt.stamp || $attrs['option-stamp']" />
            </q-item-section>
            <q-item-section side v-if="scope.opt.disable">
              <q-icon name="block" color="red"/>
            </q-item-section>
          </slot>
        </q-item>
      </slot>
    </template>

    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          <span v-if="Boolean(isFilterSkip)" v-html="$tc('messages.input_min_character', 1, {v:filterMin})"/>
          <span v-else v-html="$tc('messages.no_results')" />
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected-item="scope"  v-if="$attrs['use-chips'] === undefined">
      <slot name="selected-item" :scope="{...scope}">
        {{getOptionLabel(scope.opt)}}
      </slot>
    </template>

    <template v-slot:before><slot name="before" /></template>
    <template v-slot:prepend><slot name="prepend" /></template>
    <template v-slot:append><slot name="append" /></template>
    <template v-slot:after><slot name="after" /></template>

    <template v-slot:hint><slot name="hint" /></template>
    <template v-slot:counter><slot name="counter" /></template>

    <template v-slot:default>
      <slot></slot>
    </template>

  </q-select>

</template>
<script>
export default {
  name: 'AppSelect',
  inheritAttrs: false,
  props: {
    source: {type: String, default:null},
    sourceFilters: {type: Array, default: () => []},
    sourceFields: {type: Array, default: () => []},
    sourceIncludes: {type: Array, default: () => []},
    sourceLimit: {type: Number || String, default: 20 },
    filter: {type: Boolean, default: false },
    filterMin: {default:0},
    useInput: {type: Boolean },
    fillInput: {type: Boolean },
    hideSelected: {type: Boolean },
    inputDebounce: {type: Number, default: 600 }
  },
  data () {
    return {
      value: this.$attrs.value,
      options: this.$attrs.options || [],
      isFilterSkip: false
    }
  },
  created() {

  },
  watch:{
    '$attrs.value': 'setValue',
    '$attrs.options': 'setOptions',
  },
  computed: {
    PROP () {
      let def = {
        'use-input': this.filter,
        'fill-input': this.filter,
        'hide-selected': this.filter,
      }

      if (this.$attrs['multiple'] !== undefined) {
        def['fill-input'] = false
        def['hide-selected'] = false
      }

      return {
        useInput: def['use-input'],
        fillInput: def['fill-input'],
        hideSelected: def['hide-selected'],
      }
    },
    QSelect() {
      return this.$refs.QSelect || null
    },
    opt () {
      if (!this.filter) return this.$attrs.options
      return this.options
    }
  },
  methods: {
    setValue(v) {
      this.value = v
    },
    setOptions(v) {
      this.options = v
    },
    getOptionDisable(option) {
      if (!Boolean(this.$attrs['option-disable'])) return option.disable

      if (typeof this.$attrs['option-disable'] === 'function') {
        return this.$attrs['option-disable'](option)
      }
      return option[this.$attrs['option-disable']]
    },
    getOptionLabel(option) {
      if (typeof option === 'string') {
        return option
      }
      else if (typeof this.$attrs['option-label'] === 'function') {
        return this.$attrs['option-label'](option)
      }

      const label = this.$attrs['option-label'] || 'label'
      return option[label]
    },
    getOptionSublabel(option) {
      if (!Boolean(this.$attrs['option-sublabel'])) return option.sublabel

      if (typeof this.$attrs['option-sublabel'] === 'function') {
        return this.$attrs['option-sublabel'](option)
      }
      return option[this.$attrs['option-sublabel']]
    },
    filterFn (val, update, abort) {
      if (this.$listeners['filter'] && typeof this.$listeners['filter'] === 'function') {
        this.$emit('filter', val, update, abort)
        return
      }

      const min = Number(this.filterMin)
      if (min) {
        if (String(val).length < min) {
          this.isFilterSkip = true
          return update()
        }
        this.isFilterSkip = false
      }

      if (this.options.length && !String(val).length) {
        update()
        return
      }

      if (this.source) {
        const separator = String(this.source).indexOf('?') < 0 ? '?' : '&'
        let search = `search=${val}`
        if (this.sourceFilters) search += `&search-keys=${this.sourceFilters.join(',')}`
        if (this.sourceFields) search += `&field=${this.sourceFields.join(',')}`
        if (this.sourceIncludes) search += `&include=${this.sourceIncludes.join(',')}`

        if (this.sourceLimit) search += `&limit=${Number(this.sourceLimit)}`

        const apiUrl = this.source + separator + search
        console.info(`[PLAY] Source GET: ${apiUrl}`);
        return this.$axios.get(apiUrl)
          .then(response => {
            console.info(`[PLAY] Response:`, response.data);
            this.options = response.data
          })
          .catch(error => {
            console.error(error || error.response)
          })
          .finally(() => {
            return update()
          })
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.$attrs.options.filter(v => {

          let needles = String(needle).split(' ')
          for (let i = 0; i < needles.length; i++) {
            if (needles[i] && !String(v.label + v.sublabel).toLowerCase().includes(needles[i])) return false
          }
          return true
        })
      })
    },
    filterFunc (v, u, a) {
      this.$listeners['filter'] && typeof this.$listeners['filter'] === 'function'
        ? this.$emit('filter', v, u, a)
        : this.filterFn(v, u)
    },
    inputFunction(v) {
      this.$nextTick(() => {
        let innerValue = v
        if (this.QSelect) {
          if (this.QSelect.multiple) innerValue = this.QSelect.innerValue
          else {
            innerValue = this.QSelect.innerValue[0] || null
          }
        }

        this.$emit('selected', this.value, innerValue)
      })
    }
  }
}
</script>

<style lang="stylus">
.q-field__before:empty,
.q-field__prepend:empty
  display none

.q-field__bottom
  // display none
  min-height: 0px;
  padding-top: 0;

  .q-field__messages:not(:empty),
  .q-field__counter:not(:empty)
    min-height: 12px
    margin-top: 4px


</style>
