<template>
  <q-dialog ref="dialog"
    v-model="dialog"
    v-bind="$attrs"
    v-on="$listeners"
    >
    <q-card>
      <q-bar v-if="!noTopbar" class="text-white"  style="min-height: 42px;"
        :class="{'bg-primary': !$q.dark.isActive, 'bg-grey-8': $q.dark.isActive}"
      >
        <q-btn dense flat icon="arrow_back" class="on-left" v-go-back.single v-if="!modal" />
        <div class="text-weight-medium">{{title}}</div>
        <q-space />
        <q-btn dense outline icon="clear" @click="hide"  v-if="true" />
        <slot name="topbar-right" />
      </q-bar>
      <slot></slot>
      <div class="flex flex-center" :class="{'no-padding': modal}">
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'BaseDialog',
  props: {
    modal: Boolean,
    noTopbar: Boolean,
    title: String,
    //
  },
  data () {
    return {
      dialog: this.$attrs.value || true,
      maximized: true
    }
  },
  watch: {
    '$attrs.value': function (v) {
      console.warn('change', v);
      this.dialog = v
    }
  },
  created () {
    console.warn('BaseDialog created', this);
  },
  methods: {
    show() {
      console.warn('BaseDialog->show')
      this.dialog = true
    },
    hide() {
      this.$emit('ok')
      this.dialog = false
    },
    ok() {
      console.warn('BaseDialog->OK')
      this.$emit('ok')
    }
  }
}
</script>
