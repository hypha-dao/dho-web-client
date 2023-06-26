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
    .text-bold.q-mb-md {{ $t('assignments.assignment-suspend.suspend') }}
    .row.q-col-gutter-md
      .col-12
        .text-body2
          span {{ $t('assignments.assignment-suspend.thisActionWill', { '1': owner }) }}
          span.text-italic.q-pa-xs {{ title }}
            | .
          span {{ $t('assignments.assignment-suspend.pleaseProvideAReason') }}
      .col-12
        q-input(v-model="reason" dense="dense" rounded="rounded" outlined="outlined" :label="$t('assignments.assignment-suspend.reason')" @click.stop)
        q-btn.full-width.q-mt-md(rounded="rounded" unelevated="unelevated" :color="reason === '' ? 'disabled' : 'negative'" :disable="reason === '' || submitting" :loading="submitting" @click.stop) {{ $t('assignments.assignment-suspend.suspend1') }}
          q-popup-proxy(anchor="center middle" self="bottom middle")
            .bg-white.q-pa-lg
              .text-bold {{ $t('assignments.assignment-suspend.suspendingSAssignment', { '1': owner }) }}
              .text-italic {{ title }}
              .text-body2.q-mt-md {{ $t('assignments.assignment-suspend.areYouSure') }}
              .text-body2
                span.text-italic {{ $t('assignments.assignment-suspend.reason1') }}
                span.q-pa-xs {{ reason }}
              .row.flex.justify-between.q-mt-md
                q-btn(color="primary" :label="$t('assignments.assignment-suspend.cancel')" size="md" outline="outline" rounded="rounded" v-close-popup="-1")
                q-btn(color="negative" :label="$t('assignments.assignment-suspend.suspend2')" size="md" rounded="rounded" @click="$emit('suspend', reason)" v-close-popup="-1")
</template>
