<script>
export default {
  name: 'period-display',
  props: { phase: { type: Object } },
  methods: {
    getIcon (phase) {
      switch (phase) {
        case 'First Quarter':
          return 'fas fa-adjust'
        case 'Full Moon':
          return 'far fa-circle'
        case 'Last Quarter':
          return 'fas fa-adjust reversed'
        case 'New Moon':
          return 'fas fa-circle'
        default:
          return 'fas fa-circle'
      }
    }
  }
}
</script>

<template lang="pug">
q-input.bg-grey-4.text-black(
  v-model="phase && new Date(phase.startDate).toLocaleDateString()"
  outlined
  dense
  readonly
)
  template(v-slot:append)
    q-icon(:name="getIcon(phase && phase.phase)")
</template>

<style lang="sass" scoped>

</style>
