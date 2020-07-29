<script>
import BaseDialog from '@/components/BaseDialog'

export default {
  name: 'DialogMix',
  components: { BaseDialog },
  data () {
    return {
      DIALOG: {
        show: true,
        modal: false,
      }
    }
  },
  created() {
    // console.warn('mix DIalog', this.dialog())
  },
  methods: {
    show() {
      this.DIALOG.show = true
      this.DIALOG.modal = true
    },
    hide() {
      console.warn('DialogMix->hide', this.DIALOG);
    },
    dialog (attr, propComponent = {}) {
      v = {parent: this, ...attr, child: propComponent}
      return console.warn('attr', v)
    }
  },
}
</script>
