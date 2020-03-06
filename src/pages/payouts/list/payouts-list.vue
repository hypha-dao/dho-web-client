<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import PayoutCard from '../components/payout-card'

export default {
  name: 'page-payouts-list',
  components: { PayoutCard },
  data () {
    return {
      right: false,
      payoutId: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('payouts', ['payouts', 'payoutsLoaded'])
  },
  mounted () {
    this.clearData()
  },
  methods: {
    ...mapActions('payouts', ['fetchData']),
    ...mapMutations('payouts', ['clearData']),
    async onLoad (index, done) {
      await this.fetchData()
      done()
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .payouts-list(ref="payoutsListRef")
    q-infinite-scroll(
      :disable="payoutsLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.payoutsListRef"
    )
      .row.text-center
        payout-card(
          v-for="payout in payouts"
          :key="payout.id"
          :payout="payout"
          @open="() => { right = true; payoutId = payout.id }"
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
</template>
