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
          originalApprovedDate: policy.system_originalApprovedDate_t,
          masterpolicy: policy?.masterpolicy
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
.version-history(v-if="versionHistory?.state !== PROPOSAL_STATE.DRAFTED")
  .text-grey.text-italic.q-mb-sm(:style="{ 'font-size': '12px' }") {{ $t('proposals.version-history.versionHistory') }}
  .row
    .bg-internal-bg.q-mr-md.q-mb-md.rounded-border.q-pa-md(v-if="versionHistory?.masterpolicy.length" :style="{ 'min-width': '160px', 'position': 'relative' }" :class="{ 'selected-card': !versionHistory?.masterpolicy[0].system_originalApprovedDate_t, 'rejected-card': versionHistory?.masterpolicy[0].details_state_s === PROPOSAL_STATE.REJECTED }")
      q-icon.absolute(v-if="versionHistory?.masterpolicy[0].system_originalApprovedDate_t" name="fas fa-arrow-right" :style="{ 'right': '20px', 'top': '28px' }")
      div(:style="{ 'border-radius': '50%', 'background': '#242F5D', 'width': '30px', 'height': '30px', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }" :class="{ 'selected-icon': !versionHistory?.masterpolicy[0].system_originalApprovedDate_t }")
        q-icon(name="fas fa-check" :color="versionHistory?.masterpolicy[0].system_originalApprovedDate_t ? 'white' : versionHistory?.state === PROPOSAL_STATE.REJECTED ? 'negative' : 'primary'")
      .h-h5.text-weight-700.q-mt-sm.q-mb-md(:class="{ 'selected-title': !versionHistory?.masterpolicy[0].system_originalApprovedDate_t }") {{ $t('proposals.version-history.original') }}
      div {{ parsedDate(versionHistory?.masterpolicy[0].system_originalApprovedDate_t) }}
    .bg-internal-bg.q-mr-md.q-mb-md.rounded-border.q-pa-md(v-else :style="{ 'min-width': '160px', 'position': 'relative' }" :class="{ 'selected-card': !versionHistory?.masterpolicy.length, 'rejected-card': versionHistory?.state === PROPOSAL_STATE.REJECTED }")
      div(:style="{ 'border-radius': '50%', 'background': '#242F5D', 'width': '30px', 'height': '30px', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }" :class="{ 'selected-icon': !versionHistory?.masterpolicy.length }")
        q-icon(name="fas fa-check" :color="versionHistory?.masterpolicy.length ? 'white' : versionHistory?.state === PROPOSAL_STATE.REJECTED ? 'negative' : 'primary'")
      .h-h5.text-weight-700.q-mt-sm.q-mb-md(:class="{ 'selected-title': !versionHistory?.masterpolicy.length }") {{ $t('proposals.version-history.original') }}
      div(v-if="versionHistory?.state === PROPOSAL_STATE.PROPOSED") {{ $t('proposals.version-history.currentOnVoting') }}
      div(v-else-if="versionHistory?.state === PROPOSAL_STATE.REJECTED") {{ $t('proposals.version-history.rejected') }}
      div(v-else) {{ parsedDate(versionHistory?.originalApprovedDate) }}
    .bg-internal-bg.q-mr-md.q-mb-md.rounded-border.q-pa-md(v-if="versionHistory?.masterpolicy.length" :style="{ 'min-width': '160px', 'position': 'relative' }" :class="{ 'selected-card': versionHistory?.masterpolicy[0].system_originalApprovedDate_t, 'rejected-card': versionHistory?.state === PROPOSAL_STATE.REJECTED }")
      div(:style="{ 'border-radius': '50%', 'background': '#242F5D', 'width': '30px', 'height': '30px', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }" :class="{ 'selected-icon': versionHistory?.masterpolicy[0].system_originalApprovedDate_t }")
        q-icon(name="fas fa-check" :color="versionHistory.masterpolicy[0].system_originalApprovedDate_t ? 'primary' : 'white'")
      .h-h5.text-weight-700.q-mt-sm.q-mb-md(:class="{ 'selected-title': versionHistory?.masterpolicy[0].system_originalApprovedDate_t }") Version 2
      div(v-if="versionHistory?.state === PROPOSAL_STATE.PROPOSED") {{ $t('proposals.version-history.currentOnVoting') }}
      div(v-else-if="versionHistory?.state === PROPOSAL_STATE.REJECTED") {{ $t('proposals.version-history.rejected') }}
      div(v-else) {{ parsedDate(versionHistory?.originalApprovedDate) }}

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
