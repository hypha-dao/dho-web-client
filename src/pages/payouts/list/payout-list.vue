<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import PayoutCard from '../components/payout-card'

export default {
  name: 'page-payout-list',
  components: { PayoutCard },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Contributions' }])
    await this.loadPayouts()
  },
  computed: {
    ...mapGetters('payouts', ['payouts'])
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('payouts', ['loadPayouts'])
  }
}
</script>

<template lang="pug">
.row
  payout-card(
    v-for="payout in payouts"
    :key="payout.hash"
    :payout="payout"
  )
</template>
