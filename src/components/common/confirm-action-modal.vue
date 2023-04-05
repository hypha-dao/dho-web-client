<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'confirm-action-modal',
  props: {
    value: Boolean,
    title: String
  }
})
</script>

<template lang="pug">
q-dialog(:value="value", @hide="$emit('input', false)", persistent)
  q-card.q-pa-md.card-container
    .row.justify-end
      q-btn.close-btn(
        flat,
        round,
        size="sm",
        icon="fas fa-times",
        color="primary",
        @click="$emit('input', false)"
      )
    .row
      .h-h4 {{ title }}
    slot(name="buttons-actions")
      .row.q-mt-sm.q-col-gutter-md.justify-end
        .col-10
          .row
            .col
              q-btn.full-width(
                no-caps,
                rounded,
                color="primary",
                label="No",
                @click="$emit('responded', false)",
                flat
              )
            .col
              q-btn.full-width(
                no-caps,
                rounded,
                color="primary",
                label="Yes",
                @click="$emit('responded', true)"
              )
</template>

<style lang="sass" scoped>
.card-container
  border-radius: 26px
</style>
