<template>
  <q-page
    padding
    class="flex flex-center"
  >
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{Network}}
        </div>
        {{Response}}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>

export default {
  name: 'Callback',
  data () {
    return {

    }
  },
  computed: {
    Network() {
      return this.$route.params.network || 'NONE'
    },
    Response() {
      if (this.$route.query) this.$q.localStorage.set(`callback.${this.Network}`, this.$route.query)
      return this.$route.query || {}
    }
  },
  created() {
    console.warn('ROUTE', this.$route)
  }
}
</script>
