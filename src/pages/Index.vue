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
      <!-- <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
      <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" /> -->

      <q-carousel-slide :name="1" img-src="~/assets/images/home-1.jpg" />
      <!-- <q-carousel-slide :name="2" img-src="~/assets/images/home-2.jpg" />
      <q-carousel-slide :name="3" img-src="~/assets/images/home-3.jpg" /> -->
      <q-carousel-slide :name="2" img-src="~/assets/images/pot-1.jpg" />
      <q-carousel-slide :name="3" img-src="~/assets/images/pot-2.jpg" />
      <q-carousel-slide :name="4" img-src="~/assets/images/pot-3.jpg" />

      <template v-slot:control>
        <q-carousel-control
          position="bottom"
          :offset="[50, 50]"
        >
        <div class="row justify-center">
          <q-btn glossy rounded color="red-14" size="lg" :label="$t('auth.login.title')" @click="loginForm()" v-if="login"/>
        </div>
        </q-carousel-control>
      </template>

    </q-carousel>
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
  }),
  created() {
    this.load()
  },
  methods: {
    load() {
      setTimeout(() => {
        if (this.$store.getters['auth/user']) this.$router.push('/admin')
        else this.login = true
      }, 1000)
    },
    loginForm() {
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
    }
  },
}
</script>
