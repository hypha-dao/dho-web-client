<script>
/**
 * Base component for any card-like element on screen
 * Handles title styling, margins and content padding
 */
import { dateToStringShort } from '~/utils/TimeUtils.js'
import { copyToClipboard } from 'quasar'
import ipfsy from '~/utils/ipfsy'
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
    proposals: Number,

    view: String
  },
  data () {
    return {
      height: '256'
      // width: '300px'
    }
  },
  computed: {

    isListView () { return this.view === 'list' },

    isCardView () { return this.view === 'card' },

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

    goToDaoInNewTab (e) {
      console.log(e)
      console.log(e.target)
      const resolved = this.$router.resolve({ name: 'login', params: { dhoname: this.url } })
      // const host = window.location.host
      // const url = `${host}/${resolved.href}`
      const url = `${resolved.href}`
      window.open(url, '_blank')
    },

    ipfsy
  }
}
</script>

<template lang="pug">
q-card.dho-card.q-pa-md.row(flat :class="{'dho-card--card': isCardView, 'dho-card--list': isListView }")
  q-btn.absolute-top-right.q-mt-md.q-mr-md.q-pa-xxs.z-50(
    id="share-button"
    @click="copyToClipboardADaoLink"
    color="white"
    icon="fas fa-share-alt"
    padding="12px"
    rounded unelevated size="sm"
    text-color="primary"
  )

  q-card-section.q-pa-none.row.justify-center.items-center(:class="{'col': isCardView, 'col-auto q-pr-md': isListView }")
    q-avatar(:size="isListView ? '82px' : '200px'" color="primary" text-color="white" @click="goToDaoInNewTab").relative-position
      img(:src="ipfsy(logo)" v-if="logo").object-cover
      //- loading-spinner()
      span(v-if="!logo") {{name && name[0].toUpperCase()}}

  q-card-section.q-pa-none.col.row.justify-between.items-center(@click="goToDaoInNewTab")
    .col(:class="{ 'col-12': isCardView }")
      .h-h5.text-bold {{ title }}
      .h-b2.q-mt-xs(v-if="isCardView") {{ description }}

    .col-8.row.items-center.q-mt-md(:class="{ 'col-12': isCardView }")
      .col-4.justify-center(:class="{ 'row items-center': isListView }")
        .items-center(:class="{ 'row': isListView, 'column': isCardView }")
          q-icon.q-py-xs(color="grey-7" name="fas fa-calendar-alt")
          .text-grey-7.h-b2.q-pl-xs.q-pr-xxs {{ dateAndMonth }}
          .text-grey-7.h-b2 {{ year }}
      .col-4.justify-center(:class="{ 'row items-center': isListView }").border
        .items-center(:class="{ 'row': isListView, 'column': isCardView }")
          q-icon.q-py-xs(color="grey-7" name="fas fa-users")
          .text-grey-7.h-b2.q-px-xs {{ members }}
          .text-grey-7.h-b2 Members
      .col-4.justify-center(:class="{ 'row items-center': isListView }")
        .items-center(:class="{ 'row': isListView, 'column': isCardView }")
          q-icon.q-py-xs(color="grey-7" name="fas fa-vote-yea")
          .text-grey-7.text-no-wrap.h-b2.q-px-xs {{ proposals }}
          .text-grey-7.text-no-wrap.h-b2 Projects

</template>

<style lang="stylus" scoped>
.dho-card
  display: flex
  position: relative
  cursor: pointer
.dho-card--card
  border-radius 32px
  min-height: 512px
  flex-direction: column
  justify-content: space-between

.dho-card--list
  border-radius 32px
  // min-height: 512px
  // flex-direction: column
  // justify-content: space-between

.border
  border-left 1px solid $internal-bg
  border-right 1px solid $internal-bg
</style>
