<script>
import { dateToStringShort } from '~/utils/TimeUtils'
import { mapGetters } from 'vuex'

export default {
  name: 'version-history',
  components: {
  },
  data () {
    return {
    }
  },
  props: {
    proposalId: String
  },
  apollo: {
    versionHistory: {
      query: require('~/query/policy/dao-policy-version-history.gql'),
      update: data => {
        return {
          state: data.queryPolicy[0].details_state_s,
          originalApprovedDate: data.queryPolicy[0].system_originalApprovedDate_t
        }
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          id: this.proposalId
        }
      }
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao'])
  },
  methods: {
    // currentPeriod (date) {
    //   return new Date(date) > Date.now()
    // },
    parsedDate (date) {
      return dateToStringShort(date)
    }
  }
}
</script>
<template lang="pug">
.version-history(v-if="versionHistory.state !== 'drafted' && versionHistory.state !== 'approved'")
  .text-grey.text-italic.q-mb-sm(:style="{ 'font-size': '12px' }") Version History
  .row
    div.bg-internal-bg.q-mr-md.q-mb-md.rounded-border.q-pa-md(:style="{ 'min-width': '160px', 'position': 'relative' }" :class="{ 'selected-card': !versionHistory.originalApprovedDate }")
      q-icon.absolute(v-if="versionHistory.originalApprovedDate" name="fas fa-arrow-right" :style="{ 'right': '20px', 'top': '28px' }")
      div(:style="{ 'border-radius': '50%', 'background': '#242F5D', 'width': '30px', 'height': '30px', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }" :class="{ 'selected-icon': !versionHistory.originalApprovedDate }")
        q-icon(name="fas fa-check" :color="!versionHistory.originalApprovedDate ? 'primary' : 'white'")
      .h-h5.text-weight-700.q-mt-sm.q-mb-md(:class="{ 'selected-title': !versionHistory.originalApprovedDate }") Original
      div(v-if="!versionHistory.originalApprovedDate") Current - on voting
      div(v-else) {{ parsedDate(versionHistory.originalApprovedDate) }}
    div.bg-internal-bg.q-mr-md.q-mb-md.rounded-border.q-pa-md(v-if="versionHistory.originalApprovedDate" :style="{ 'min-width': '160px', 'position': 'relative' }" :class="{ 'selected-card': versionHistory.originalApprovedDate }")
      div(:style="{ 'border-radius': '50%', 'background': '#242F5D', 'width': '30px', 'height': '30px', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }" :class="{ 'selected-icon': versionHistory.originalApprovedDate }")
        q-icon(name="fas fa-check" :color="versionHistory.originalApprovedDate ? 'primary' : 'white'")
      .h-h5.text-weight-700.q-mt-sm.q-mb-md(:class="{ 'selected-title': versionHistory.originalApprovedDate }") Version 2
      div(v-if="versionHistory.originalApprovedDate") Current - on voting

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
</styles>
