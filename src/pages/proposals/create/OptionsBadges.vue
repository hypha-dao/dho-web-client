<script>
export default {
  name: 'options-badges',
  components: {
    BadgeRadio: () => import('~/components/badges/badge-radio.vue')
  },

  props: {
    reference: Object
  },

  data () {
    return {
      text: null
    }
  },

  apollo: {
    dho: {
      query: require('../../../query/badges/badges-options.gql'),
      update: data => data.getDao,
      variables () {
        return {
          daoId: this.$store.state.dao.docId,
          filter: { details_state_s: { regexp: '/.*approved*./i' } }
        }
      }
    }
  },

  methods: {
    // TODO: Move this code to shared location?
    badges (dho) {
      if (dho.badge && Array.isArray(dho.badge)) {
        return dho.badge
      }
      return []
    },

    filtered (badge) {
      if (!this.text) return true
      const needle = this.text.toLocaleLowerCase()
      return badge && badge.details_title_s.toLocaleLowerCase().indexOf(needle) > -1
    }
  }
}
</script>

<template lang="pug">
.options-badges
  .text-h6.q-pa-sm Choose a badge
  q-input.rounded-border.q-px-sm(outlined v-model="text" label="Filter badges")
  .row.q-mt-sm(v-if="dho")
    template(v-for="badge in badges(dho)")
      .col-4.q-pa-sm(v-if="filtered(badge)")
        badge-radio(
          :badge="badge"
          :selected="reference && badge.docId === reference.docId"
          @click="$emit('select', {...badge, type: 'Badge'})"
        )
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
