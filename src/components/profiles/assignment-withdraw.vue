<script>
export default {
  name: 'assignment-withdraw',

  props: {
    submitting: Boolean
  },

  data () {
    return {
      notes: ''
    }
  }
}
</script>

<template lang="pug">
.assignment-withdraw.row.q-pa-md(@click.stop)
  .q-pa-md
    .text-bold.q-mb-md WITHDRAW
    .row.q-col-gutter-md
      .col-12.col-lg-6
        .text-body2
          | If you withdraw your assignment, it will be removed from the DHO
          | and claims will no longer be processed, effective from the period
          | you withdraw the assignment. Please provide a note below.
        .text-bold.text-italic.q-pt-xs WARNING: This action is irreversible.
      .col-12.col-lg-6
        q-input(v-model="notes" dense rounded outlined label="Notes" @click.stop)
        q-btn.full-width.q-mt-md(
          rounded
          unelevated
          :color="notes === '' ? 'grey-5' : 'negative'"
          :disable="notes === '' || submitting"
          :loading="submitting"
          @click.stop
        ) Withdraw
          q-popup-proxy(anchor="center middle" self="bottom middle")
            .bg-white.q-pa-lg
              .text-bold Withdrawing from your assignment
              .text-body2.q-pt-xs Are you sure you want to withdraw from this assignment?
              .text-body2
                span.text-italic Notes:
                span.q-pa-xs {{ notes }}
              .text-bold.text-italic.q-pt-sm WARNING: This action is irreversible.
              .row.flex.justify-between.q-mt-md
                q-btn(color="primary" label="Cancel" size="md" outline rounded v-close-popup="-1")
                q-btn(color="negative" label="Withdraw" size="md" rounded @click="$emit('withdraw', notes)" v-close-popup="-1")
</template>

<style lang="stylus" scoped>
.assignment-withdraw
  border-radius 24px
  background-color #F6F6F7
</style>
