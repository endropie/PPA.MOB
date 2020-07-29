<template>
  <q-page padding class="flex flex-center">
    <p class="text-weight-thin text-grey-5" >
      <q-icon name="mdi-shield-alert-outline" size="200px"  />
    </p>
    <div class=" text-center">
      <p class="text-weight-thin" style="font-size:48px">{{CODE}}</p>
      <p class="text-faded">{{TextMessage}} </p>
      <q-btn color="secondary" style="width:200px;" label="Go back" v-go-back.single/>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'AdminError',
  computed: {
    CODE () {
      return this.$route.query.code ?? null
    },
    TextMessage () {
      const messages = {
        401: 'Access Denied',
        403: 'Access Forbiden',
      }
      return messages[this.CODE] || 'Access Failed!'
    }
  }
}
</script>
