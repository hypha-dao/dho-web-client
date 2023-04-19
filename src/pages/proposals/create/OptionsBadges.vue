<script>

export default {
  name: 'options-ability',
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },

  props: {},

  data () {
    return {
      badge: { label: 'Select' }
    }
  },

  apollo: {
    badges: {
      query: require('~/query/badges/badges-options.gql'),
      update: data => data?.getDao?.badge?.map(badge => ({
        label: badge.details_title_s,
        value: { ...badge }
      })),
      variables () {
        return {
          daoId: this.$store.state.dao.docId,
          filter: { details_state_s: { regexp: '/.*approved*./i' } },
          order: { asc: 'details_title_s' }
        }
      }
    }
  },

  updated () {
    console.log(JSON.stringify(this.badges))
  },

  computed: {
    hasBadges () { return this.badges.length > 0 },
    isLoading () { return this.$apollo.queries.badges.loading }
  },

  watch: {
    badge: {
      immediate: true,
      deep: true,
      async handler ({ value: badge }) {
        if (badge) { this.$emit('select', badge) }
      }
    }
  }

}
</script>

<template lang="pug">
.options-archetypes.q-mt-xl
  section(v-if="isLoading")
    .row.justify-center.q-my-md
      loading-spinner(color="primary" size="40px")

  section(v-else)
    div(v-if="hasBadges")
      .h-h4.q-pt-xl Choose a badge
        .row.full-width.q-mt-xs
          .col-6.q-pr-xxs
            q-select.q-mt-xs(
              :options="badges"
              dense
              dropdown-icon="fas fa-chevron-down"
              hide-bottom-space
              options-dense
              outlined
              rounded
              v-model="badge"
            )

    div(v-else).row.justify-center
      .q-py-sm.q-mt-sm.text-center.full-width No archetypes exist yet.
      q-btn.text-xs.q-pa-none.q-ma-none.text-weight-900.text-secondary.text-underline(flat padding="0px" no-caps @click="$emit('changeOption','archetype')") Please create them here.

</template>

<style lang="stylus" scoped>
</style>
