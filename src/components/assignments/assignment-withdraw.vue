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
    .text-bold.q-mb-md {{ $t('assignments.assignment-withdraw.withdraw') }}
    .row.q-col-gutter-md
      .col-12.col-lg-6
        .text-body2 {{ $t('assignments.assignment-withdraw.ifYouWithdraw') }}
        .text-bold.text-italic.q-pt-xs {{ $t('assignments.assignment-withdraw.warningThisAction') }}
      .col-12.col-lg-6
        q-input(v-model="notes" dense rounded outlined :label="$t('assignments.assignment-withdraw.notes')" @click.stop)
        q-btn.full-width.q-mt-md(rounded unelevated :color="notes === '' ? 'disabled' : 'negative'" :disable="notes === '' || submitting" :loading="submitting" @click.stop) {{ $t('assignments.assignment-withdraw.withdraw1') }}
          q-popup-proxy(anchor="center middle" self="bottom middle")
            .bg-white.q-pa-lg
              .text-bold {{ $t('assignments.assignment-withdraw.withdrawingFromYourAssignment') }}
              .text-body2.q-pt-xs {{ $t('assignments.assignment-withdraw.areYouSure') }}
              .text-body2
                span.text-italic {{ $t('assignments.assignment-withdraw.notes1') }}
                span.q-pa-xs {{ notes }}
              .text-bold.text-italic.q-pt-sm {{ $t('assignments.assignment-withdraw.warningThisAction1') }}
              .row.flex.justify-between.q-mt-md
                q-btn(color="primary" :label="$t('assignments.assignment-withdraw.cancel')" size="md" outline rounded v-close-popup="-1")
                q-btn(color="negative" :label="$t('assignments.assignment-withdraw.withdraw2')" size="md" rounded @click="$emit('withdraw', notes)" v-close-popup="-1")
</template>

<style lang="stylus" scoped>
.assignment-withdraw
  border-radius 24px
  background-color #F6F6F7
</style>
