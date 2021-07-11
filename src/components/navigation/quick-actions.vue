<script>
export default {
  name: 'quick-actions'
}
</script>

<template lang="pug">
.quick-actions.full-width
  q-list
    q-item-label(header) Quick Actions
    q-item(clickable v-ripple)
      q-item-section(avatar)
        q-icon(name="fas fa-exclamation-triangle")

      q-item-section
        q-item-label(lines="1") Claim period(s)
        q-item-label(caption lines="2") You have 2 claimable periods
    q-item(clickable v-ripple)
      q-item-section(avatar)
        q-icon(name="fas fa-percentage")

      q-item-section
        q-item-label(lines="1") Adjust your commitment
        q-item-label(caption lines="2") Edit your commitment for a period of time
    q-item(clickable v-ripple)
      q-item-section(avatar)
        q-icon(name="far fa-file-alt")

      q-item-section
        q-item-label(lines="1") Extend Assignment
        q-item-label(caption lines="2") Extend your assignment in 24 days
</template>
