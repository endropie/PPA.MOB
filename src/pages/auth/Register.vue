<template>
  <base-dialog v-model="DIALOG.show" :modal="DIALOG.modal">
    <q-card square dark class="bg-box-dark text-white">
      <q-card-section>
        <div class="text-h6">{{ $t('auth.register.register') }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-col-gutter-lg">
        <div class="col-12">
          <q-form class="column" @submit="onSubmit" >
            <q-input type="email" autofocus
              id="email"
              v-model.trim="data.email"
              :label="$t('auth.register.email')"
              bottom-slots
              dark
              :rules="validations['email']"
              lazy-rules
            />
            <q-input type="text"
              v-model.trim="data.fullname"
              :label="$t('auth.register.fullname')"
              dark
              :rules="validations['fullname']"
              lazy-rules
            />
            <q-input type="password"
              id="password"
              v-model="data.password"
              :label="$t('auth.register.password')"
              dark bottom-slots
              :rules="validations['password']"
              lazy-rules
            />
            <q-input type="password"
              id="password_confirmation"
              v-model="data.password_confirmation"
              :label="$t('auth.register.repeat_password')"
              dark bottom-slots
              required
              :rules="validations['password_confirmation']"
              lazy-rules
            />
            <q-btn outline color="green" :label="$t('auth.register.register')" :loading="loading" type="submit"/>
          </q-form>
        </div>
        </q-card-section>
        <q-card-actions>
        </q-card-actions>
    </q-card>
  </base-dialog>
</template>


<script>
import DialogMix from '@/mixins/DialogMix'
import isEmail from 'validator/lib/isEmail'
import equals from 'validator/lib/equals'

const minPasswordLength = 6

export default {
  name: 'Register',
  mixins: [DialogMix],
  data () {
    return {
      data: {
        fullname: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      loading: false,
      minPasswordLength: minPasswordLength,
      validations: {
        email: [
          val => !!val || this.$t('auth.validations.required'),
          val => isEmail(val) || this.$t('auth.validations.email')
        ],
        fullname: [val => !!val || this.$t('auth.validations.required')],
        password: [
          val => !!val || this.$t('auth.validations.required'),
          val =>
            val.length >= minPasswordLength ||
            this.$t('auth.validations.password_length', {
              length: minPasswordLength
            })
        ],
        password_confirmation: [
          val => !!val || this.$t('auth.validations.required'),
          val =>
            equals(val, this.data.password) ||
            this.$t('auth.validations.password_match')
        ]
      }
    }
  },
  created() {
    console.warn('Register Created!', this);
  },
  methods: {
    onSubmit () {
      this.$q
        .dialog({
          message: this.$t('auth.register.check_email', {
            email: this.data.email
          }),
          cancel: true
        })
        .onOk(() => {
          console.warn('REGISTERD OK')
          this.loading = true
          this.$auth
            .register(this.data)
            .then((response) => {
              console.warn('REGISTERD THEN', response)
              if (response.data.token) {
                this.$q
                .dialog({ message: this.$t('auth.register.account_created') })
                .onOk(data => {
                  const UserSaver = this.$store.commit('auth/setUser', response.data.user)
                  const TokenSaver = this.$store.dispatch('auth/setToken', {
                    token: response.data.meta.token,
                    rememberMe: true
                  })
                  setTimeout(() => this.$router.push('/admin'), 500);
                })

                return;
              }
              this.$q
                .dialog({ message: this.$t('auth.register.account_created') })
                .onOk(data => {
                  this.$router.push('/login')
                })
            })
            .catch(error => {
              if (error.response) {
                console.error(error.response || error)
                if (error.response.status === 422) {
                  this.$q.dialog({ message: this.$t('auth.register.invalid_data')})
                } else if (error.response.status === 409) {
                  this.$q.dialog({ message: this.$t('auth.register.already_registered') })
                } else {
                  console.error(error)
                }
              }
            })
            .finally(() => {
              this.loading = false
            })
        })
    }
  }
}
</script>
