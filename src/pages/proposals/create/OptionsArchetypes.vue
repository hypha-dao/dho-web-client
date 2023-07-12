<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'

const TIERS_QUERY = `
  querySalaryband(
    filter: {
      details_dao_i: { in: [0, $daoId] },
    }
  ) {
    id: docId
    name: details_name_s
    annualAmount: details_annualUsdSalary_a
    minDeferred: details_minDeferredX100_i
  }
`

const ROLES_QUERY = `
  queryRole(
    filter: { 
      details_dao_i: { in: [0, $daoId] },
      details_autoApprove_i: { eq: 1 } 
    }
  ) {
    id: docId
    name: details_title_s
  }
`

export default {
  name: 'options-archetypes',
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },

  apollo: {

    tiers: {
      query: gql`query TIERS($daoId: Int64!) { ${TIERS_QUERY} }`,
      update: data => data?.querySalaryband?.map(level => ({
        label: level?.name,
        value: { ...level }
      })),
      skip () { return !this.selectedDao?.docId },
      variables () { return { daoId: this.selectedDao.docId } },
      subscribeToMore: {
        document: gql`subscription TIERS($daoId: Int64!) { ${TIERS_QUERY} }`,
        skip () { return !this.selectedDao?.docId },
        variables () { return { daoId: this.selectedDao.docId } },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }

          return subscriptionData.data
        }
      }
    },

    archetypes: {
      query: gql`query ROLES($daoId: Int64!) { ${ROLES_QUERY} }`,
      update: data => data?.queryRole?.map(archetype => ({
        label: archetype?.name,
        value: { ...archetype }
      })),
      skip () { return !this.selectedDao?.docId },
      variables () { return { daoId: this.selectedDao.docId } },
      subscribeToMore: {
        document: gql`subscription ROLES($daoId: Int64!) { ${ROLES_QUERY} }`,
        skip () { return !this.selectedDao?.docId },
        variables () { return { daoId: this.selectedDao.docId } },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }

          return subscriptionData.data
        }
      }
    }

  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),

    archetype: {
      get () { return this.$store.state.proposals.draft.role || { label: this.$t('pages.proposals.create.optionsarchetypes.form.archetype.label') } },
      set (archetype) {
        this.$store.commit('proposals/setRole', archetype)
      }

    },

    tier: {
      get () { return this.$store.state.proposals.draft.tier || { label: this.$t('pages.proposals.create.optionsarchetypes.form.tier.label') } },
      set (tier) {
        this.$store.commit('proposals/setTier', tier)

        this.$store.commit('proposals/setAnnualUsdSalary', tier?.value?.annualAmount || 0)
        this.$store.commit('proposals/setMinDeferred', tier?.value?.minDeferred || 0)
        this.$store.commit('proposals/setMinCommitment', 0)

        this.$store.commit('proposals/setCommitment', parseFloat(1))
        this.$store.commit('proposals/setDeferred', parseFloat(tier.value.minDeferred))
      }
    },

    hasArchetypes () { return this.archetypes && this?.archetypes.length > 0 },
    hasTiers () { return this.tiers && this?.tiers.length > 0 },
    isLoading () { return this.$apollo.queries.archetypes.loading && this.$apollo.queries.tiers.loading }
  },

  updated () {
    if (this.archetype.value && this.tier.value) {
      this.$emit('select', null)
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
    div(v-if="hasArchetypes && hasTiers")
        .row.full-width.q-mt-xs
          .col-6.q-pr-xxs
            .h-h4.q-pt-xl {{ $t('pages.proposals.create.optionsarchetypes.chooseARoleArchetype') }}
            q-select.q-mt-xs(:options="archetypes" dense dropdown-icon="fas fa-chevron-down" hide-bottom-space options-dense outlined rounded v-model="archetype")
          .col-6.q-pl-xxs
            .h-h4.q-pt-xl {{ $t('pages.proposals.create.optionsarchetypes.chooseARoleArchetype') }}
            q-select.q-mt-xs(:options="tiers" dense dropdown-icon="fas fa-chevron-down" hide-bottom-space options-dense outlined rounded v-model="tier")
    .row.justify-center(v-else)
      .q-py-sm.q-mt-sm.text-center.full-width {{ $t('pages.proposals.create.optionsarchetypes.noArchetypesExistYet') }}
      q-btn.text-xs.q-pa-none.q-ma-none.text-weight-900.text-secondary.text-underline(flat padding="0px" no-caps @click="$emit('changeOption','archetype')") {{ $t('pages.proposals.create.optionsarchetypes.pleaseCreateThemHere') }}

</template>

<style lang="stylus" scoped>
</style>
