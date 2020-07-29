<template>
  <q-page class="column flex flex-center">
    <!-- <code>{{$app}}</code>
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <!-- <span class="text-weight-light">[ version.{{ $q.version }} ]</span> -->
     <q-carousel swipeable animated
      navigation
      navigation-position="top"
      control-type="push"
      v-model="slide"
      fullscreen
      transition-prev="slide-right"
      transition-next="slide-left"
    >
      <q-carousel-slide :name="1" img-src="~/assets/images/home-1.jpg" />
      <q-carousel-slide :name="2" img-src="~/assets/images/pot-1.jpg" />
      <q-carousel-slide :name="3" img-src="~/assets/images/pot-2.jpg" />
      <q-carousel-slide :name="4" img-src="~/assets/images/pot-3.jpg" />

      <template v-slot:control>
        <q-carousel-control
          position="bottom"
          :offset="[50, 50]"
        >
        <div class="column justify-center q-gutter-sm">

          <q-btn glossy color="red-14" size="lg" label="L O G I N" @click="loginForm()" v-if="login"/>
          <q-btn glossy color="blue-grey" size="lg" :label="'Configuration'" @click="configDialog = true" />

        </div>
        </q-carousel-control>
      </template>

    </q-carousel>
    <q-dialog v-model="configDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px">
        <q-card-section class="bg-teal text-white q-pa-sm">
          <div class="text-h6">Configuration</div>
        </q-card-section>
        <q-card-section class=" q-pa-sm">
          <q-select
            label="API Host"
            :value="$axios.defaults.baseURL"
            :options="$axios.defaults.optBaseURL"
            @input="setHostAPI"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Cancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import LoginComponent from '@/pages/auth/Login'
import store from '@/store'
import AppModal from '../components/AppModal'

export default {
  name: 'PageIndex',
  data: () => ({
    login: false,
    slide: 1,
    configDialog: false
  }),
  created() {
    console.warn('BASE', this.$axios.defaults.baseURL)
    this.load()
  },
  methods: {
    load() {
      setTimeout(() => {
        if (this.$store.getters['auth/user']) this.$router.push('/admin')
        else this.login = true
      }, 1000)
    },
    loginForm () {
      this.$app.modal({
        component: LoginComponent,
        parent: this,
        title: this.$t('auth.login.title'),
        persistent: true,
        // maximized: true,
        // fullWidth: true
        // ...more.props...
      }).onOk(() => {
        console.log('OK')
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Called on OK or Cancel')
      })
    },
    setHostAPI (v) {
      this.$axios.defaults.setBaseURL(v)
      this.configDialog = false
      setTimeout(() => {
        this.$q.notify('API Host changed to '+ v)
      }, 500)
    },
    config () {
      this.$axios.setBaseURL('localhost:8001')
      console.warn('URL', this.$axios.defaults.baseURL)
      // console.warn('CONFIG', this.$axios.defaults)
    }
  },
}
</script>
