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
q-dialog(:value="value" @hide="$emit('input', false)" persistent="persistent")
  q-card.q-pa-md.card-container
    .row.justify-end
      q-btn.close-btn(@click="$emit('input', false)" color="primary" flat icon="fas fa-times" round size="sm")
    .row
      .h-h4 {{title}}
    slot(name="buttons-actions")
      .row.q-mt-sm.q-col-gutter-md.justify-end
        .col-10
          .row
            .col
              q-btn.full-width(@click="$emit('responded', false)" color="primary" flat :label="$t('common.confirm-action-modal.no')" no-caps rounded)
            .col
              q-btn.full-width(@click="$emit('responded', true)" color="primary" :label="$t('common.confirm-action-modal.yes')" no-caps rounded)
</template>

<style lang="sass" scoped>
.card-container
  border-radius: 26px
</style>
