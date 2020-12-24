<script>
export default {
  name: 'lunar-cycles-display',
  props: {
    startPhase: { type: Object },
    periodCount: { type: Number },
    text: { type: String }
  },
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
fieldset.q-mt-sm
  legend Lunar cycles
  p {{ text }}
  .row.q-col-gutter-xs
    .col-6
      q-input.bg-grey-4.text-black(
        v-model="startPhase && new Date(startPhase.startDate).toLocaleDateString()"
        outlined
        dense
        readonly
      )
        template(v-slot:append)
          q-icon(:name="getIcon(startPhase && startPhase.phase)")
    .col-6
      q-input.bg-grey-4.text-black(
        v-model="periodCount"
        outlined
        dense
        readonly
      )
        template(v-slot:append)
          q-icon(name="fas fa-hashtag")
</template>

<style lang="stylus" scoped>

</style>
