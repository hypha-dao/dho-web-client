<script>
/**
 * Base component for any card-like element on screen
 * Handles title styling, margins and content padding
 */
import { dateToStringShort } from '~/utils/TimeUtils.js'
import { copyToClipboard } from 'quasar'

// const parseSize = (size, type) => `${size}${type}`

export default {
  name: 'dho-card',

  components: {
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue')
  },

  props: {
    name: String,
    url: String,
    title: String,
    description: String,
    primaryColor: String,
    secondaryColor: String,
    logo: String,
    members: Number,
    date: String,
    proposals: Number
  },
  data () {
    return {
      height: '265'
      // width: '300px'
    }
  },
  computed: {
    dateAndMonth () {
      const [date, month] = dateToStringShort(this.date).split(' ')
      return `${date} ${month} `
    },
    year () {
      return dateToStringShort(this.date).split(' ')[2]
    }
  },
  methods: {
    async copyToClipboardADaoLink () {
      try {
        const resolved = this.$router.resolve({ name: 'login', params: { dhoname: this.name } })
        const host = window.location.host
        const url = `${host}${resolved.href}`
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
    },
    goToDaoInNewTab () {
      const resolved = this.$router.resolve({ name: 'login', params: { dhoname: this.url } })
      // const host = window.location.host
      // const url = `${host}/${resolved.href}`
      const url = `${resolved.href}`
      window.open(url, '_blank')
    }
  }
}
</script>

<template lang="pug">
q-card.dho-card(flat).flex.column.items-center.justify-between
  q-card-section(:style="{ 'height': height + 'px' }").row.relative-position.justify-center.items-end.full-width
    q-btn.absolute-top-right.q-mt-md.q-mr-md.q-pa-xxs.share-btn(
      rounded unelevated size="sm"
      padding="12px"
      icon="fas fa-share-alt"
      color="white"
      text-color="primary"
      @click="copyToClipboardADaoLink"
    )
    div.cursor-pointer(@click="goToDaoInNewTab")
      ipfs-image-viewer(
        :ipfsCid="logo"
        :showDefault = "true"
        :defaultLabel="name"
        :size="height/1.5 + 'px'"
      )

  q-card-section.text-section.q-px-none.cursor-pointer(@click="goToDaoInNewTab").full-width
    .row.items-start.full-height.q-px-xxl.q-py-xs
      .col-12.justify-between.items-between.full-height.flex.column
        .col
          .h-h5.text-bold.q-pb-xxs {{ title }}
          .text-ellipsis.h-b2 {{ description }}
        .row.items-center.q-mt-md
          .col-4.text-center
            .column.items-center
              q-icon.q-py-xxs(color="grey-7" name="fas fa-calendar-alt" size="11px")
              .h-b2.text-no-wrap {{ dateAndMonth }}
              .h-b2.text-no-wrap {{ year }}
          .col-4.text-center.left-border
            .column.items-center
              q-icon.q-py-xxs(color="grey-7" name="fas fa-map-marker-alt" size="11px")
              .h-b2.text-no-wrap {{ members }}
              .h-b2.text-no-wrap Members
          .col-4.text-center.left-border
            .column.items-center
              q-icon.q-py-xxs(color="grey-7" name="fas fa-vote-yea" size="11px")
              .h-b2.text-no-wrap {{ proposals }}
              .h-b2.text-no-wrap Projects
</template>

<style lang="stylus" scoped>
.dho-card
  border-radius 32px
  width: clamp(200px, 100%, 302px)
  min-height: 507px
  .share-btn
    z-index 1
  .left-border
    border-left 1px solid $internal-bg
  .text-section
    flex: 1
.card-icon
  font-size: 5rem !important
</style>
