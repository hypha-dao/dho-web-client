<script>

export default {
  name: 'options-archetypes',
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },

  props: {},

  data () {
    return {
      archetype: { label: 'Select' }
    }
  },

  apollo: {
    archetypes: {
      query: require('~/query/archetypes/dao-archetypes.gql'),
      update: data => data?.getDao?.role?.map(archetype => ({
        label: archetype.details_title_s,
        value: { ...archetype }
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

  computed: {
    hasArchetypes () { return this.archetypes.length > 0 },
    isLoading () { return this.$apollo.queries.archetypes.loading }
  },

  watch: {
    archetype: {
      immediate: true,
      deep: true,
      async handler ({ value: archetype }) {
        if (archetype) { this.$emit('select', archetype) }
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
    div(v-if="hasArchetypes")
      .h-h4.q-pt-xl Choose a role archetype
        .row.full-width.q-mt-xs
          .col-6.q-pr-xxs
            q-select.q-mt-xs(
              :options="archetypes"
              dense
              dropdown-icon="fas fa-chevron-down"
              hide-bottom-space
              options-dense
              outlined
              rounded
              v-model="archetype"
            )

    div(v-else).row.justify-center
      .q-py-sm.q-mt-sm.text-center.full-width No archetypes exist yet.
      q-btn.text-xs.q-pa-none.q-ma-none.text-weight-900.text-secondary.text-underline(flat padding="0px" no-caps @click="$emit('changeOption','archetype')") Please create them here.

</template>

<style lang="stylus" scoped>
</style>
