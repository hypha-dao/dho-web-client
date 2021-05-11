<script>
export default {
  name: 'voting-option-yes-no'
}
</script>

<template lang="pug">
.q-gutter-xs
  q-btn(
    color="positive"
    icon="fas fa-check-square"
    label="Yes"
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
  q-btn(
    color="warning"
    icon="fas fa-check-square"
    label="Abstain"
    rounded
    unelevated
  )
</template>
