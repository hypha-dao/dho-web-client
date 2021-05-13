<script>
export default {
  name: 'voting-option-yes-no'
}
</script>

<template lang="pug">
.voting-option-yes-no.q-pa-md.bg-grey-2
  .row.justify-around
    q-btn(
      color="positive"
      icon="fas fa-check-square"
      label="Yes"
      rounded
      unelevated
    )
    q-btn(
      color="warning"
      icon="fas fa-check-square"
      label="Abstain"
      rounded
      unelevated
    )
    q-btn(
      color="negative"
      icon="fas fa-check-square"
      label="No"
      rounded
      unelevated
    )
</template>
