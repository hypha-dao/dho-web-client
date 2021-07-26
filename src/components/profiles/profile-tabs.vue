<script>
export default {
  name: 'profile-tabs',

  data () {
    return {
      tab: 'works'
    }
  }
}
</script>

<template lang="pug">
q-card(flat)
  q-toolbar(class="bg-primary")
    q-tabs(v-model="tab" align="left" class="text-white")
      q-tab(label="Activities" name="works")
      q-tab(label="Voting History" name="votes")
      q-tab(label="About" name="about")
    q-space
    q-tabs(v-model="tab" align="right" class="text-white")
      q-tab(icon="fas fa-cog" align="right" name="settings")

  q-separator

  q-tab-panels(v-model="tab" animated)
    q-tab-panel(name="works")
      .text-body1 My Works
    q-tab-panel(name="votes")
      .text-body1 Votes
    q-tab-panel(name="about")
      .text-body1 About me
    q-tab-panel(name="settings")
      .text-body1 Settings

</template>
