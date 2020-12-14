<script>
export default {
  name: 'lunar-cycles-display',
  props: {
    startPhase: { type: Object },
    endPhase: { type: Object },
    text: { type: String }
  },
  computed: {
    cycle () {
      if (!this.endPhase) return ''
      return (this.endPhase.value - this.startPhase.value) / 4
    }
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
    .col-5(:style="{width:'39%'}")
      q-input.bg-grey-4.text-black(
        v-model="startPhase && new Date(startPhase.startDate).toLocaleDateString()"
        outlined
        dense
        readonly
      )
        template(v-slot:append)
          q-icon(:name="getIcon(startPhase && startPhase.phase)")
    .col-5(:style="{width:'39%'}")
      q-input.bg-grey-4.text-black(
        v-model="endPhase && new Date(endPhase.startDate).toLocaleDateString()"
        outlined
        dense
        readonly
      )
        template(v-slot:append)
          q-icon(:name="getIcon(endPhase && endPhase.phase)")
    .col-2(:style="{width:'22%'}")
      q-input.bg-grey-4.text-black(
        v-model="cycle"
        outlined
        dense
        readonly
      )
        template(v-slot:append)
          q-icon(name="fas fa-hashtag")
</template>

<style lang="stylus" scoped>

</style>
