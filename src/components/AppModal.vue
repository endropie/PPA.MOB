<template>
  <q-dialog ref="dialog"
    v-bind="{...this.$attrs,...this.$props}"
    v-on="$listeners">
    <q-card>
      <q-bar v-if="!noTopbar" class="text-white"  style="min-height: 42px;"
        :class="{'bg-primary': !$q.dark.isActive, 'bg-grey-8': $q.dark.isActive}"
      >
        <div class="text-uppercase text-weight-medium">{{title}}</div>
        <q-space />
        <q-btn dense outline icon="clear" v-close-popup />
      </q-bar>
      <!-- <component :is="co"  v-if="co" /> -->
      <div class="flex flex-center no-padding" v-if="BODY" >
        <component :is="BODY" @ok="ok" @hide="hide" />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>

export default {
  name: 'AppModal',
  props: {
    children: { required: true },
    title: String,
    noTopbar: Boolean,
    // modal: { type: Object, default: () => {}},
  },
  data () {
    return {
      componentChild: null
    }
  },
  computed: {
    BODY () {
      if (!this.children) return null
      // console.warn('BODY',`${this.children}`, import(`${this.children}`))
      return this.children
      // return () => import(`@/${this.path.substring(1)}`)
    }
  },
  beforeMount() {
    // console.warn('beforemount', this);
  },
  mounted() {
    // console.warn('ini mounted', this)
  },
  methods: {
    show() {
      this.$refs['dialog'].show()
    },
    hide() {
      this.$refs['dialog'].hide()
    },
    ok() {
      this.$emit('ok')
      this.$refs['dialog'].hide()
    }
  }
}
</script>
