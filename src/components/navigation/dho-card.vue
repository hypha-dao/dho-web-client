<script>
/**
 * Base component for any card-like element on screen
 * Handles title styling, margins and content padding
 */
import { dateToString } from '~/utils/TimeUtils.js'
import { copyToClipboard } from 'quasar'

export default {
  name: 'dho-card',
  props: {
    name: String,
    description: String,
    color: String,
    image: String,
    members: Number,
    date: String
  },

  data () {
    return {
      height: '265px',
      width: '282px'
    }
  },

  computed: {
    titleClass () {
      const clazz = {}
      clazz[`bg-${this.color}`] = true
      return clazz
    },
    dateAndMonth () {
      const [date, month] = dateToString(this.date).split(' ')
      return `${date} ${month} `
    },
    year () {
      return dateToString(this.date).split(' ')[2]
    }
  },

  methods: {
    async copyToClipboardADaoLink () {
      try {
        const resolved = this.$router.resolve({ name: 'login', params: { dhoname: this.name } })
        const host = window.location.host
        const url = `${host}/${resolved.href}`
        await copyToClipboard(url)
        this.$q.notify({
          color: 'secondary',
          textColor: 'white',
          message: 'The link has been copied',
          icon: 'far fa-copy',
          timeout: 5000,
          actions: [{ icon: 'fas fa-times', color: 'white' }]
        })
      } catch (error) {
        this.$q.notify({
          color: 'negative',
          textColor: 'white',
          message: 'Error',
          timeout: 5000,
          actions: [{ icon: 'fas fa-times', color: 'white' }]
        })
      }
    }
  }
}
</script>

<template lang="pug">
q-card.dho-card(flat :style="{ width }")
  q-card-section(:class="titleClass" :style="{ height }").relative-position
    q-btn.absolute-top-right.q-mt-md.q-mr-md.q-pa-xs.share-btn(
      rounded unelevated size="sm"
      padding="12px"
      icon="fas fa-share-alt"
      color="white"
      text-color="primary"
      @click="copyToClipboardADaoLink"
    )
    img(v-if="image" :src="image")
    q-icon(v-else name="far fa-building" size="xl").absolute-center.text-primary.card-icon
  q-card-section.q-px-none
    .row.items-center.justify-between
      .col-12.q-px-xl
        .column.items-center
      .col-12.q-px-lg.q-mb-md
        .text-h6.text-bold.q-pb-sm {{ name }}
        .text-ellipsis.text-grey-7 {{ description }}
      .col-12.q-px-xs
        .row.items-center
          .col-4.q-px-md.text-center
            .column.items-center
              q-icon.q-pa-sm(color="grey-7" name="fas fa-calendar-alt")
              .text-grey-7.text-no-wrap {{ dateAndMonth }}
              .text-grey-7.text-no-wrap {{ year }}
          .col-4.q-px-md.text-center.left-border
            .column.items-center
              q-icon.q-pa-sm(color="grey-7" name="fas fa-map-marker-alt")
              .text-grey-7.text-no-wrap {{ members }}
              .text-grey-7.text-no-wrap Members
          .col-4.q-px-md.text-center.left-border
            .column.items-center
              q-icon.q-pa-sm(color="grey-7" name="fas fa-vote-yea")
              .text-grey-7.text-no-wrap 29
              .text-grey-7.text-no-wrap Projects
</template>

<style lang="stylus" scoped>
.dho-card
  border-radius 32px

  .share-btn
    z-index 1

  .left-border
    border-left 1px solid $grey-4

.card-icon
  font-size: 5rem !important
</style>
