<template>
  <q-page padding class="flex flex-center">
    <p class="text-weight-thin text-grey-5" >
      <q-icon name="mdi-alert-octagon" size="200px"  />
    </p>
    <div class=" text-center">
      <p class="text-weight-thin" style="font-size:48px">404</p>
      <p class="text-faded">Sorry noting here </p>
      <q-btn color="secondary" style="width:200px;" label="Go back" to="/" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
