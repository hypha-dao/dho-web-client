<script>

export default {
  name: 'options-policies',
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },

  props: {},

  data () {
    return {
      policy: { label: 'Select', value: null }
    }
  },

  apollo: {
    policies: {
      query: require('~/query/policy/dao-policy-list.gql'),
      update: data => data?.queryPolicy,
      variables () {
        return {
          daoId: this.$store.state.dao.docId
        }
      }
    }
  },

  computed: {
    hasPolicies () { return this.policies.length > 0 },
    isLoading () { return this.$apollo.queries.policies.loading }
  },

  watch: {
    policy: {
      immediate: true,
      deep: true,
      async handler (policy) {
        if (policy.value || policy.value === '') { this.$emit('select', policy) }
      }
    }
  },

  methods: {
    filteredPolicies (policies) {
      const noneOption = [{ label: 'None', value: '', __typename: 'Policy' }]
      return noneOption.concat(policies)
    }
  }

}
</script>

<template lang="pug">
.options-policies.q-mt-xl
  section(v-if="isLoading")
    .row.justify-center.q-my-md
      loading-spinner(color="primary" size="40px")
  section(v-else)
    div(v-if="hasPolicies")
      .h-h4.q-pt-xl {{ $t('pages.proposals.create.optionspolicies.chooseAParentPolicy') }}
        .row.full-width.q-mt-xs
          .col-6.q-pr-xxs
            q-select.q-mt-xs(:options="filteredPolicies(policies)" dense dropdown-icon="fas fa-chevron-down" hide-bottom-space options-dense outlined rounded v-model="policy")
    .row.justify-center(v-else)
      .q-py-sm.q-mt-sm.text-center.full-width {{ $t('pages.proposals.create.optionspolicies.noPoliciesExistYet') }}

</template>

<style lang="stylus" scoped>
</style>
