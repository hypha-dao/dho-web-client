<script>
export default {
  name: 'confirm-action-modal',
  props: {
    value: Boolean,
    title: String
  }
}
</script>

<template lang="pug">
q-dialog(:value="value" @hide="$emit('input', false)" persistent)
    q-card.q-pa-md
        .h-h4 {{ title }}
        slot(name="buttons-actions")
          .row.q-mt-sm.q-col-gutter-md
            .col
              q-btn.full-width(
                no-caps rounded color="primary"
                label="Yes"
                @click="$emit('responded', true)"
              )
            .col
              q-btn.full-width(
                no-caps rounded color="negative"
                label="No"
                @click="$emit('responded', false)"
              )
</template>
