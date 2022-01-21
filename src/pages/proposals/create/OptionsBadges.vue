<script>
export default {
  name: 'options-badges',
  components: {
    BadgeRadio: () => import('~/components/badges/badge-radio.vue')
  },

  props: {
    selectedHash: String
  },

  data () {
    return {
      text: null
    }
  },

  apollo: {
    dho: {
      query: require('../../../query/badges/badges.gql'),
      update: data => data.getDho,
      variables () {
        return {
          hash: '52a7ff82bd6f53b31285e97d6806d886eefb650e79754784e9d923d3df347c91'
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
  q-input(outlined v-model="text" label="Filter badges")
  .row
    template(v-for="badge in badges(dho)")
      .col-4.q-pa-sm(v-if="filtered(badge)")
        badge-radio(
          :badge="badge"
          :selected="badge.hash===selectedHash"
          @click="$emit('select', badge.hash)"
        )
</template>
