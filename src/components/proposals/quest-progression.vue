<script>
import { mapGetters } from 'vuex'
import { dateToStringShort } from '~/utils/TimeUtils'
export default {
  name: 'quest-progression',
  data () {
    return {}
  },
  props: {
    proposalId: String
  },
  apollo: {
    progression: {
      query: require('~/query/quests/dao-quest-progression.gql'),

      update: data => {
        return {
          currentQuest: {
            status: data.queryQueststart[0]?.details_state_s,
            rejectedDate: data.queryQueststart[0]?.updatedDate,
            approvedDate: data.queryQueststart[0]?.system_originalApprovedDate_t,
            title: data.queryQueststart[0]?.details_title_s
          },
          ascendants: data.queryQueststart[0]?.ascendant.map(ascendant => {
            return {
              title: ascendant.details_title_s,
              status: ascendant.details_state_s,
              approvedDate: ascendant.system_originalApprovedDate_t
            }
          })
        }
      },
      skip () { return !this.selectedDao?.docId },
      variables () {
        return {
          id: this.proposalId,
          daoId: this.selectedDao.docId
        }
      }
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao'])
  },
  methods: {
    parsedDate (date) {
      return dateToStringShort(date)
    },
    cardColor (status) {
      return {
        'bg-primary': status === 'proposed',
        'bg-positive': status === 'approved',
        'bg-negative': status === 'rejected',
        bordered: status === 'pending'
      }
    },
    iconColor (status) {
      let color = ''
      switch (status) {
        case 'proposed':
          color = 'primary'
          break
        case 'approved':
          color = 'positive'
          break
        case 'rejected':
          color = 'negative'
          break
        case 'pending':
          color = 'white'
          break
      }
      return color
    },
    cardStatus (card) {
      let status = ''
      if (card.approvedDate) {
        status = this.parsedDate(card.approvedDate)
      } else if (card.status === 'rejected') {
        status = this.parsedDate(card.rejectedDate)
      } else if (card.status === 'proposed') {
        status = 'On voting'
      }
      return status
    },
    completionCardTitle () {
      let title = ''
      if (this.progression.currentQuest.status === 'proposed') {
        title = 'Not available yet'
      } else {
        title = 'Create now!'
      }
      return title
    }
  }
}
</script>
<template lang="pug">
.quest-progression(v-if="progression.currentQuest.status !== 'drafted'")
  .text-grey.text-italic.q-mb-sm(:style="{ 'font-size': '12px' }") Quest Progression
  .row
    template(v-if="progression.ascendants" v-for="card in progression.ascendants")
      div.q-mr-md.q-mb-md.rounded-border.q-pa-md(
        :style="{ 'min-width': '160px', 'max-width': '160px' }"
        :class="cardColor(card.status)"
      )
        .icon-container(:class="{ 'bg-primary': card.status === 'pending' }")
          q-icon(name="fa fa-map-marker" :color="iconColor(card.status)")
        .h-h5.text-white(:style="{ 'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden' }") {{ card.title }}
          q-tooltip {{ card.title }}
        .h-h7.text-white.q-mt-md(:class="{ 'text-grey': card.status === 'pending'}") {{ cardStatus(card) }}
    div.q-mr-md.q-mb-md.rounded-border.q-pa-md(
      :style="{ 'min-width': '160px', 'max-width': '160px' }"
      :class="cardColor(progression.currentQuest.status)"
    )
      .icon-container(:class="{ 'bg-primary': progression.currentQuest.status === 'pending' }")
        q-icon(name="fa fa-map-marker" :color="iconColor(progression.currentQuest.status)")
      .h-h5.text-white(:style="{ 'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden' }") {{ progression.currentQuest.title }}
        q-tooltip {{ progression.currentQuest.title }}
      .h-h7.text-white.q-mt-md(:class="{ 'text-grey': progression.currentQuest.status === 'pending'}") {{ cardStatus(progression.currentQuest) }}
    div.q-mr-md.q-mb-md.rounded-border.q-pa-md(
      :style="{ 'min-width': '160px', 'max-width': '160px' }"
      :class="cardColor('pending')"
    )
      .icon-container.bg-primary
        q-icon(name="fa fa-map-marker" :color="iconColor('pending')")
      .h-h5.text-black(:style="{ 'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden' }") {{ 'Completion' }}
      .h-h7.text-white.q-mt-md.text-grey {{ completionCardTitle() }}
</template>
<styles lang="stylus">
.icon-container
  display: flex
  align-items: center
  justify-content: center
  border-radius: 50%
  background: #fff
  margin-bottom: 15px
  width: 30px
  height: 30px
.bordered
  border: 1px solid #84878E
.rounded-border
  border-radius: 15px
</styles>
