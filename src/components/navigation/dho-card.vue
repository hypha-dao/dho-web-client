<script>
import { copyToClipboard } from 'quasar'
import { dateToStringShort } from '~/utils/TimeUtils.js'
import ipfsy from '~/utils/ipfsy'

export default {
  name: 'dho-card',
  components: {},

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

    }
  },

  computed: {

    isCardView () { return this.view === 'card' },
    isListView () { return this.view === 'list' },

    dateAndMonth () {
      const [date, month] = dateToStringShort(this.date).split(' ')
      return `${date} ${month} `
    },

    year () { return dateToStringShort(this.date).split(' ')[2] }
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
q-card.dho-card.q-pa-md(flat :class="{'dho-card--card': isCardView, 'dho-card--list': isListView }")
  q-btn.absolute-top-right.q-pa-xxs.z-10(
    id="share-button"
    @click="copyToClipboardADaoLink"
    color="white"
    icon="fas fa-share-alt"
    padding="12px"
    rounded unelevated size="sm"
    text-color="primary"
    :class="{ 'q-mt-md q-mr-md': isCardView, '': isListView, '': !$q.screen.gt.sm }"
  )

  q-card-section.q-pa-none.row.justify-center.items-center(:class="{'col-auto q-pr-xs': isListView, 'full-width': !$q.screen.gt.sm }" :style="[isCardView ? {'height': '200px'}: {}]")
    q-avatar(:size="isListView && $q.screen.gt.sm ? '82px' : '140px'" color="primary" text-color="white" @click="goToDaoInNewTab").relative-position
      img(:src="ipfsy(logo)" v-if="logo").object-cover
      span(v-if="!logo") {{name && name[0].toUpperCase()}}

  q-card-section.q-pa-none(@click="goToDaoInNewTab" :class="{ 'col': isCardView, 'col row items-center': isListView, 'full-width': !$q.screen.gt.sm }")
    div
      .h-h5.text-bold {{ title }}
      .h-b2.q-mt-xs(v-if="isCardView") {{ description }}

  q-card-section.q-pa-none.row.justify-between.items-center(@click="goToDaoInNewTab" :class="{ '': isCardView, 'col': isListView, 'full-width q-pt-md': !$q.screen.gt.sm }" :style="[isCardView && $q.screen.gt.xs ? {'height': '80px'} : {}]")
    .full-width.row.items-center(:class="{ 'col-12': isCardView }")
      .col-6.text-center.border-right
        q-icon.q-py-xs(color="grey-7" name="fas fa-calendar-alt")
        .text-grey-7.h-b2.q-pl-xs.q-pr-xxs {{ dateAndMonth }}
        .text-grey-7.h-b2 {{ year }}
      .col-6.text-center
        q-icon.q-py-xs(color="grey-7" name="fas fa-users")
        .text-grey-7.h-b2.q-px-xs {{ members }}
        .text-grey-7.h-b2 Members

</template>

<style lang="stylus" scoped>
.dho-card
  display: flex
  position: relative
  cursor: pointer
  border-radius 32px
.dho-card--card
  flex-direction: column
  justify-content: space-between
  height: auto
  @media (min-width: $breakpoint-xs)
    height: 560px

.dho-card--list
  flex-direction: row

.border-right
  border-right 1px solid $internal-bg
</style>
