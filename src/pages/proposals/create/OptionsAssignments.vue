<script>
export default {
  name: 'options-assignments',
  components: {
    AssignmentRadio: () => import('~/components/assignments/assignment-radio.vue')
  },

  props: {
    selectedHash: String
  },

  apollo: {
    profile: {
      query: require('../../../query/assignments/assignments-past.gql'),
      update: data => data.queryMember[0],
      variables () {
        return {
          username: 'lukegravdent'
        }
      }
    }
  },

  methods: {
    // TODO: move this to a shared place
    assignments (profile) {
      return profile && profile.assigned
    }
  }
}
</script>

<template lang="pug">
.options-assignments
  .text-h6.q-pa-sm {{ $t('pages.proposals.create.optionsassignments.chooseARecent') }}
  .row
    template(v-for="assign in assignments(profile)")
      .q-pb-sm(:class="{ 'col-4':$q.platform.is.desktop, 'q-pr-sm':$q.platform.is.desktop, 'full-width':$q.platform.is.mobile }")
        assignment-radio(:assignment="assign" :selected="assign.hash===selectedHash" @click="$emit('select', assign.hash)")

</template>
