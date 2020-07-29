<template>
    <q-card square class="no-shadow q-ma-sm"
      style="width:280px"
      :class="{'full-width':$q.screen.lt.sm}"
      v-if="show">
      <q-card-section>
        <div class="text-h6 text-uppercase text-primary">{{$t('auth.login.title')}}</div>
        <q-space />
      </q-card-section>
      <q-separator />
      <q-card-section class="q-col-gutter-lg" >
        <q-form @submit="onSubmit" class="column " >
          <q-input type="email"
            id="email"
            v-model.trim="data.body.email"
            :label="this.$t('auth.login.email')"
            :rules="validations['email']"
            lazy-rules
            autofocus
          />
          <q-input type="password"
            id="password"
            v-model="data.body.password"
            :label="this.$t('auth.login.password')"
            :rules="validations['password']"
            lazy-rules
          />
          <div class="row justify-between no-wrap">
            <q-checkbox id="rememberMe" v-model="data.rememberMe" :label="this.$t('auth.login.remember_me')" />
            <q-space />
            <span>
              <!-- <q-btn dense flat no-caps size="sm" tabindex="100"
                :label="$t('auth.login.password_forgot')"
                to="/password/forgot" /> -->
            </span>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions>
        <q-btn class="col" :label="$t('auth.login.login')" color="primary" @click="onSubmit" />
        <!-- <q-btn class="col" :label="$t('auth.register.register')" outline color="secondary" to="/admin/auth/register" /> -->
      </q-card-actions>
      <q-space/>
      <div class="self-end q-pa-md text-center text-caption text-grey" v-if="$app.env.DEV">DEV:[{{location}}]</div>
    </q-card>
</template>

<script>
import isEmail from 'validator/lib/isEmail'
export default {
  name: 'Login',
  data () {
    return {
      profile: null,
      data: {
        body: {
          email: '',
          password: ''
        },
        rememberMe: false
      },
      validations: {
        email: [
          val => !!val || this.$t('auth.validations.required'),
          val => isEmail(val) || this.$t('auth.validations.email')
        ],
        password: [val => !!val || this.$t('auth.validations.required')]
      }
    }
  },
  computed: {
    location() {
      return window.location.host
    }
  },
  created() {
    console.warn('LOGIN->window', window);
    this.load()
  },
  methods: {
    show() {
      console.warn('ini show')
    },
    load() {
      if (this.$store.getters['auth/loggedIn']) {
        this.$emit('hide')
        this.$router.replace('/admin')
      }
      else {
        this.show = true
      }
    },
    onSubmit () {
      this.$q.loading.show()
      this.$auth
        .login(this.data)
        .then(response => {
          this.$emit('ok')
          setTimeout(() => this.$router.push('/admin'), 500);
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 401) {
              const messageI18n = error.response.data.message && String(error.response.data.message).indexOf('auth.login.') == 0
                ? error.response.data.message: 'auth.login.verification_required'
              this.$q.dialog({
                title: this.$tc('auth.login.failed'),
                message: this.$t(messageI18n),
                stackButtons: true,
              })
            } else if (error.response.status === 403) {
              this.$q.dialog({
                title: this.$tc('auth.login.failed'),
                message: this.$t('auth.login.invalid_credentials')
              })
            } else {
              console.error(error)
            }
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.$q.loading.hide()
          }, 500)
        })
    }
  }
}
</script>
