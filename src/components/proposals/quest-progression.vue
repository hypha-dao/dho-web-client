<script>
import { dateToStringShort } from '~/utils/TimeUtils'
export default {
  name: 'quest-progression',
  data () {
    return {
      questSteps: [ // temorarily variable
        {
          status: 'voting', // temp statuses: approved, declined, pending, voting
          votedDate: ''
        },
        {
          status: 'pending', // temp statuses: approved, declined, pending, voting
          votedDate: ''
        },
        {
          status: 'approved', // temp statuses: approved, declined, pending, voting
          votedDate: 'Tue Feb 21 2023 04:56:53 GMT+0000'
        },
        {
          status: 'declined', // temp statuses: approved, declined, pending, voting
          votedDate: 'Tue Feb 28 2023 04:56:53 GMT+0000'
        }
      ]
    }
  },
  props: {
    // questSteps: Array // for external array
  },
  methods: {
    parsedDate (date) {
      return dateToStringShort(date)
    },
    cardColor (status) {
      return {
        'bg-primary': status === 'voting',
        'bg-positive': status === 'approved',
        'bg-negative': status === 'declined',
        bordered: status === 'pending'
      }
    },
    iconColor (status) {
      let color = ''
      switch (status) {
        case 'voting':
          color = 'primary'
          break
        case 'approved':
          color = 'positive'
          break
        case 'declined':
          color = 'negative'
          break
        case 'pending':
          color = 'white'
          break
      }
      return color
    },
    cardStatus (card, index) {
      let status = ''
      if (card.votedDate) {
        status = this.parsedDate(card.votedDate)
      } else if (card.status === 'voting') {
        status = 'On voting'
      } else if (index === 1) {
        status = 'Not available'
      }
      return status
    }
  }
}
</script>
<template lang="pug">
.quest-progression
  .h-h7.q-mb-md.text-grey.text-italic Quest Progression
  .row
    template(v-for="card, index in questSteps")
      div.q-mr-md.q-mb-md.rounded-border.q-pa-md(
        :style="{ 'min-width': '160px' }"
        :class="cardColor(card.status)"
      )
        .icon-container(:class="{ 'bg-primary': card.status === 'pending' }")
          q-icon(name="fa fa-map-marker" :color="iconColor(card.status)")
        .h-h5.text-white(v-if="index === 0") {{ 'Quest Start' }}
        .h-h5.text-white(v-else :class="{ 'text-black': card.status === 'pending'}") {{ 'Completion' }}
        .h-h7.text-white.q-mt-md(:class="{ 'text-grey': card.status === 'pending'}") {{ cardStatus(card, index) }}
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
