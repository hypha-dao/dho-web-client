<template>
<q-page>
  <div class="q-pa-md q-gutter-md">
    <q-card>
      <div class="text-subtitle1">
        Stewards
      </div>
      <q-list bordered separator>
        <q-item :v-for="row in stewards">
          {{ row.member }}
        </q-item>
      </q-list>
    </q-card>

  </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      isWalletConnected: state => state.wallet.isConnected,
      stewards: state => state.wallet.stewards,
      nominees: state => state.wallet.nominees
    })
  },
  mounted () {
    if (this.isWalletConnected) {
      this.$store.dispatch('members/loadBoardMembers')
      this.$store.dispatch('members/loadNominees')
    }
  },
  watch: {
    isWalletConnected () {
      this.$store.dispatch('members/loadBoardMembers')
      this.$store.dispatch('members/loadNominees')
    }
  }
}
</script>
