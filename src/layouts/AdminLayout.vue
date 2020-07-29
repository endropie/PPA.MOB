<template>
  <q-layout view="hHr lpr lFr">
    <q-header reveal elevated :class="{'bg-grey-9': $q.dark.isActive}">
      <q-toolbar>
        <q-icon name="widgets" class="q-ml-md" style="font-size:30px" />
        <!-- <q-avatar color="white" > -->
          <!-- <img src="~/assets/ppa-icon.svg" class="q-pb-xs"> -->
          <!-- <q-icon name="widgets" /> -->
        <!-- </q-avatar> -->

        <q-toolbar-title>
          PPA SYSTEM
        </q-toolbar-title>

        <q-btn flat dense round icon="menu" aria-label="Menu"
          @click="onRightDrawer = !onRightDrawer"
          v-if="loggedIn"
        />
        <q-btn v-else flat dense round icon="input" aria-label="Login" to="/admin/auth/login" />
      </q-toolbar>
    </q-header>

    <q-drawer side="right" overlay behavior="mobile" elevated
      v-model="onRightDrawer"
      show-if-above
      bordered
      :content-class="{'bg-grey-3': !$q.dark.isActive, 'bg-grey-10': $q.dark.isActive}"
    >
      <admin-menu />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import AdminMenu from '@/components/AdminMenu'
import { mapGetters } from 'vuex'

export default {
  name: 'MainLayout',

  components: {
    AdminMenu
  },

  data () {
    return {
      onRightDrawer: false,
    }
  },

  created() {
    // console.warn('AdminLayout CREATED!')
  },

  computed: {
    ...mapGetters('auth', ['user', 'loggedIn'])
  }
}
</script>
