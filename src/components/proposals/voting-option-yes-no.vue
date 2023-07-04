<script>
export default {
  name: 'voting-option-yes-no'
}
</script>

<template lang="pug">
.voting-option-yes-no.q-pa-md.bg-grey-2
  .row.justify-around
    q-btn(color="positive" icon="fas fa-check-square" :label="$t('proposals.voting-option-yes-no.yes')" rounded unelevated)
    q-btn(color="warning" icon="fas fa-check-square" :label="$t('proposals.voting-option-yes-no.abstain')" rounded unelevated)
    q-btn(color="negative" icon="fas fa-check-square" :label="$t('proposals.voting-option-yes-no.no')" rounded unelevated)

</template>
