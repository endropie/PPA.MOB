<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="q-pb-none text-white"
      :style=" $q.dark.isActive
        ? 'background: radial-gradient(circle, #bdbdbd 0%, #757575 100%)'
        : 'background: radial-gradient(circle, #658dad 0%, #0f4561 100%)'
      "
    >
      <div class="fit q-pt-md">
        <div class="column content-center">
          <q-avatar size="72px" icon="person" class="self-center bg-blue-grey-10" />
          <div class="">
            <div class="column text-no-wrap text-center q-my-sm">
              <span class="text-ellipsis text-weight-thin text-uppercase" style="font-size:22px">{{USER.name}}</span>
              <small class="text-ellipsis text-weight-medium">{{USER.email}}</small>
            </div>
            <div class="text-weight-light"></div>
          </div>
        </div>
        <!-- <div class="row justify-end q-pa-xs">
          <q-btn dense push flat icon="mdi-cogs" color="blue-grey-2" @click="isMenu = !isMenu" v-show="isMenu">
            <q-tooltip>Setting</q-tooltip>
          </q-btn>
          <q-btn dense push flat icon="mdi-apps" color="blue-grey-2" @click="isMenu = !isMenu" v-show="!isMenu">
            <q-tooltip>Menu</q-tooltip>
          </q-btn>
          <q-btn dense push flat icon="mdi-login-variant" color="blue-grey-2" class="on-right" @click="logout">
            <q-tooltip>Sign out</q-tooltip>
          </q-btn>
        </div> -->
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="no-padding">
      <q-tabs
        v-model="menutab"
        active-color="secondary"
        class="text-primary"
      >
        <q-tab name="apps" icon="apps" />
        <q-tab name="settings" icon="settings" />
        <q-tab name="user" icon="person" />

      </q-tabs>
      <q-tab-panels v-model="menutab" animated class="bg-transparent">
        <q-tab-panel name="apps" class="q-pa-xs">
          <q-list separator>
            <q-item-label header  class="text-weight-light">Applications</q-item-label>
            <q-separator />
            <q-item v-for="(menu, index) in menus" :key="index" :to="menu.path">
              <q-item-section>
                <q-item-label>{{menu.label}}</q-item-label>
                <q-item-label caption>{{menu.text}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-avatar :icon="menu.icon" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="settings" class="q-pa-xs">
          <q-list separator>
            <q-item-label header class="text-weight-light">Setting</q-item-label>
            <q-separator />
            <q-item>
              <q-item-section>Night mode</q-item-section>
              <q-item-section side>
                <q-btn outline size="xs" label="auto" @click="isDark = 'auto'" v-show="$q.dark.mode != 'auto'"/>
              </q-item-section>
              <q-item-section side>
                <q-toggle dense v-model="isDark" />
              </q-item-section>
            </q-item>
            <q-item clickable @click="BTPRINT.control()">
              <q-item-section>
                <q-item-label>Printer Connet</q-item-label>
                <q-item-label caption>Manage Device Printer</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-avatar icon="print" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="user" class="q-pa-xs">
          <q-list separator>
            <q-item-label header class="text-weight-light">Profile</q-item-label>
            <q-separator />
            <q-item clickable @click="logout">
              <q-item-section>Sign out</q-item-section>
              <q-item-section side>
                <q-avatar icon="mdi-login-variant" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script>
import BTPrintMix from '@/mixins/BTPrintMix';
import BTPrintControl from '@/components/BTPrintControl';

export default {
  name: 'AdminMenu',
  mixins: [ BTPrintMix ],
  data: () => ({
    menutab: 'apps',
    isMenu: true,
    menus: [
      { path: '/admin',
        label: 'Desktop', icon: 'wigets',
        text: 'Dashboard of application.'
      },
      { path: '/admin/warehouses/opname-vouchers',
        label: 'Opname Voucher', icon: 'assignment',
        text: 'Voucher by operator stock opname.'
      }
    ]
  }),
  computed: {
    USER () {
      return this.$store.getters['auth/user']
    },
    isDark: {
      get() {
        return this.$q.dark.isActive
      },
      set(v) {
        this.$q.dark.set(v)
        this.$q.localStorage.set('dark.mode', this.$q.dark.mode)
      }
    }
  },
  methods: {
    setBTPControl() {
      this.$app.modal({
        component: BTPrintControl,
        parent: this,
        title: 'BT Printer Control'
      })
    },
    logout () {
      this.$q.dialog({
        title: this.$i18n.t('auth.logout.confirm'),
        message: this.$i18n.t('auth.logout.logout_confirmation'),
        ok: this.$i18n.t('auth.logout.logout'),
        cancel: this.$i18n.t('auth.logout.cancel')
      }).onOk(() => {
        this.$auth.logout().then(() => {
          this.$router.push('/')
        })
      }).onCancel(() => {
        // this.$router.go(-1)
      })
    }
  }
}
</script>
