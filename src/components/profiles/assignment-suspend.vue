<script>
export default {
  name: 'assignment-suspend',

  props: {
    owner: String,
    title: String,
    submitting: Boolean
  },

  data () {
    return {
      reason: ''
    }
  }
}
</script>

<template lang="pug">
.assignment-suspend.row.q-pa-md(@click.stop)
  .q-pa-md
    .text-bold.q-mb-md SUSPEND
    .row.q-col-gutter-md
      .col-12
        .text-body2
          span This action will propose a suspension of {{ owner }}'s assignment
          span.text-italic.q-pa-xs {{ title }}.
          span Please provide a reason.
      .col-12
        q-input(v-model="reason" dense rounded outlined label="Reason" @click.stop)
        q-btn.full-width.q-mt-md(
          rounded
          unelevated
          :color="reason === '' ? 'grey-5' : 'negative'"
          :disable="reason === '' || submitting"
          :loading="submitting"
          @click.stop
        ) Suspend
          q-popup-proxy(anchor="center middle" self="bottom middle")
            .bg-white.q-pa-lg
              .text-bold Suspending {{ owner }}'s assignment
              .text-italic {{ title }}
              .text-body2.q-mt-md Are you sure you want to propose a suspension of this assignment?
              .text-body2
                span.text-italic Reason:
                span.q-pa-xs {{ reason }}
              .row.flex.justify-between.q-mt-md
                q-btn(color="primary" label="Cancel" size="md" outline rounded v-close-popup="-1")
                q-btn(color="negative" label="Suspend" size="md" rounded @click="$emit('suspend', reason)" v-close-popup="-1")
</template>
