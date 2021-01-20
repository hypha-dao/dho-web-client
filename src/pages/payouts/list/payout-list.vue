<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import PayoutCard from '../components/payout-card'

export default {
  name: 'page-payout-list',
  components: { PayoutCard },
  data () {
    return {
      pagination: {
        first: 10,
        offset: 0
      },
      loaded: false
    }
  },
  async beforeMount () {
    this.clearPayouts()
    this.setBreadcrumbs([{ title: 'Contributions' }])
  },
  computed: {
    ...mapGetters('payouts', ['payouts'])
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapMutations('payouts', ['clearPayouts']),
    ...mapActions('payouts', ['loadPayouts', 'loadUserPayouts']),
    async onLoad (index, done) {
      if (this.$route.params.user) {
        this.loaded = await this.loadUserPayouts({
          ...this.pagination,
          user: this.$route.params.user
        })
      } else {
        this.loaded = await this.loadPayouts(this.pagination)
      }
      if (!this.loaded) {
        this.pagination.offset += this.pagination.first
      }
      done()
    }
  }
}
</script>

<template lang="pug">
q-infinite-scroll(
  :disable="loaded"
  @load="onLoad"
  :offset="250"
)
  .row
    payout-card(
      v-for="payout in payouts"
      :key="payout.hash"
      :payout="payout"
    )
  template(v-slot:loading)
    .row.justify-center.q-my-md
      q-spinner-dots(
        color="primary"
        size="40px"
      )
</template>
