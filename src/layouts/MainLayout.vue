<template>
  <q-layout view="hHr lpr lFr" class="bg-blue-grey-10">
    <!-- <q-header reveal class="bg-transparent">
      <q-toolbar>
        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <q-btn
          icon="menu" aria-label="Menu" color="red" text-color="red"
          @click="onRightDrawer = !onRightDrawer"
          v-if="loggedIn"
        />
        <q-btn v-else flat dense round icon="input" aria-label="Login" to="/admin/auth/login" />
      </q-toolbar>
    </q-header> -->

    <q-drawer side="right" overlay behavior="mobile" elevated
      v-model="onRightDrawer"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">Essential Links</q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'
import { mapGetters } from 'vuex'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      onRightDrawer: false,
      essentialLinks: [
        {
          title: 'Docs',
          caption: 'quasar.dev',
          icon: 'school',
          link: 'https://quasar.dev'
        },
        {
          title: 'Github',
          caption: 'github.com/quasarframework',
          icon: 'code',
          link: 'https://github.com/quasarframework'
        },
        {
          title: 'Discord Chat Channel',
          caption: 'chat.quasar.dev',
          icon: 'chat',
          link: 'https://chat.quasar.dev'
        },
        {
          title: 'Forum',
          caption: 'forum.quasar.dev',
          icon: 'record_voice_over',
          link: 'https://forum.quasar.dev'
        },
        {
          title: 'Twitter',
          caption: '@quasarframework',
          icon: 'rss_feed',
          link: 'https://twitter.quasar.dev'
        },
        {
          title: 'Facebook',
          caption: '@QuasarFramework',
          icon: 'public',
          link: 'https://facebook.quasar.dev'
        }
      ]
    }
  },

  created() {
    // console.warn('MainLayout CREATED!')
  },

  computed: {
    ...mapGetters('auth', ['user', 'loggedIn'])
  }
}
</script>
