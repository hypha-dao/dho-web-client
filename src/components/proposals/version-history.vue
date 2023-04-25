<script>
import { PROPOSAL_STATE } from '~/const'
import { dateToStringShort } from '~/utils/TimeUtils'
import { mapGetters } from 'vuex'

export default {
  name: 'version-history',

  props: {
    proposalId: String
  },

  data () {
    return {
      PROPOSAL_STATE
    }
  },

  apollo: {
    versionHistory: {
      query: require('~/query/policy/dao-policy-version-history.gql'),
      update: data => {
        const policy = data.queryPolicy[0]

        return {
          state: policy.details_state_s,
          originalApprovedDate: policy.system_originalApprovedDate_t
        }
      },
      skip () { return !this.selectedDao?.docId || !this.proposalId },
      variables () { return { daoId: this.selectedDao.docId, id: this.proposalId } }
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao'])
  },

  methods: {
    parsedDate (date) { return dateToStringShort(date) }
  }
}
</script>
<template lang="pug">
.version-history(v-if="versionHistory.state !== PROPOSAL_STATE.DRAFTED && versionHistory.state !== PROPOSAL_STATE.APPROVED")
  .text-grey.text-italic.q-mb-sm(:style="{ 'font-size': '12px' }") Version History
  .row
    div.bg-internal-bg.q-mr-md.q-mb-md.rounded-border.q-pa-md(:style="{ 'min-width': '160px', 'position': 'relative' }" :class="{ 'selected-card': !versionHistory.originalApprovedDate, 'rejected-card': versionHistory.state === PROPOSAL_STATE.REJECTED }")
      q-icon.absolute(v-if="versionHistory.originalApprovedDate" name="fas fa-arrow-right" :style="{ 'right': '20px', 'top': '28px' }")
      div(:style="{ 'border-radius': '50%', 'background': '#242F5D', 'width': '30px', 'height': '30px', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }" :class="{ 'selected-icon': !versionHistory.originalApprovedDate }")
        q-icon(name="fas fa-check" :color="versionHistory.originalApprovedDate ? 'white' : versionHistory.state === PROPOSAL_STATE.REJECTED ? 'negative' : 'primary'")
      .h-h5.text-weight-700.q-mt-sm.q-mb-md(:class="{ 'selected-title': !versionHistory.originalApprovedDate }") Original
      div(v-if="versionHistory.state === PROPOSAL_STATE.PROPOSED") Current - on voting
      div(v-else-if="versionHistory.state === PROPOSAL_STATE.REJECTED") Rejected
      div(v-else) {{ parsedDate(versionHistory.originalApprovedDate) }}
    div.bg-internal-bg.q-mr-md.q-mb-md.rounded-border.q-pa-md(v-if="versionHistory.originalApprovedDate" :style="{ 'min-width': '160px', 'position': 'relative' }" :class="{ 'selected-card': versionHistory.originalApprovedDate }")
      div(:style="{ 'border-radius': '50%', 'background': '#242F5D', 'width': '30px', 'height': '30px', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }" :class="{ 'selected-icon': versionHistory.originalApprovedDate }")
        q-icon(name="fas fa-check" :color="versionHistory.originalApprovedDate ? 'primary' : 'white'")
      .h-h5.text-weight-700.q-mt-sm.q-mb-md(:class="{ 'selected-title': versionHistory.originalApprovedDate }") Version 2
      div(v-if="versionHistory.state === PROPOSAL_STATE.PROPOSED") Current - on voting
      div(v-else-if="versionHistory.state === PROPOSAL_STATE.REJECTED") Rejected
      div(v-else) {{ parsedDate(versionHistory.originalApprovedDate) }}

</template>
<styles lang="stylus">
.rounded-border
  border-radius: 15px
.selected-icon
  background: #fff !important
.selected-card
  color: #fff !important
  background: #242F5D !important
.selected-title
  color: #fff !important
.rejected-card
  background: #EF3F69 !important
</styles>
