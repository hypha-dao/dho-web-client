<script>
import { copyToClipboard } from 'quasar'
import ipfsy from '~/utils/ipfsy'

export default {
  name: 'dho-card',
  components: {},

  props: {
    name: String,
    url: String,
    title: String,
    subtitle: String,
    description: String,
    logo: String,

    bubble: String,

    date: String,
    view: String
  },

  computed: {
    isCardView () { return this.view === 'card' },
    isListView () { return this.view === 'list' }
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

    ipfsy,

    // TODO: Refactor to utils`
    isValidPath (path) { return /[<>:"/\\|?*]/.test(path) }
  }

}
</script>

<template lang="pug">
q-card.dho-card.q-px-md.q-py-md(flat :class="{'dho-card--card': isCardView, 'dho-card--list': isListView }")
  slot(name="icon")
  q-btn.absolute-top-right.q-pa-xxs.z-10(
    :class="{ 'q-mt-sm q-mr-sm': isCardView, '': isListView, '': !$q.screen.gt.sm }"
    @click="copyToClipboardADaoLink"
    color="internal-bg"
    icon="fas fa-share-alt"
    id="share-button"
    padding="8px"
    round
    size="sm"
    text-color="primary"
    unelevated
    v-if="url"
  )

  q-card-section.q-pa-none.row.justify-center.items-center(:class="{'col-auto q-pr-xs': isListView, 'full-width': !$q.screen.gt.sm }" :style="[isCardView ? {'height': '200px'}: {}]")
    .full-width
      slot(name="header")
    .relative-position
      q-avatar(
        :size="isListView && $q.screen.gt.sm ? '82px' : '150px'"
        @click="goToDaoInNewTab"
        color="primary"
        text-color="white"
      )
        img(:src="isValidPath(logo) ? logo : ipfsy(logo)" v-if="logo").object-cover
        span(v-if="!logo") {{name && name[0].toUpperCase()}}
      q-avatar.absolute-bottom-right(v-if="bubble" size="48px")
        img(:src="ipfsy(bubble)").object-cover

  q-card-section.q-pa-none(@click="goToDaoInNewTab" :class="{ 'col': isCardView, 'col row items-center': isListView, 'full-width': !$q.screen.gt.sm }")
    div(:class="{ 'text-center q-mt-md': isCardView, '': isListView }")
      .h-h5.text-bold {{ title }}
      .text-xs.text-weight-900.text-secondary.q-mt-xxs(:style="{'height': '16px'}") {{ subtitle }}
      .text-xs.leading-loose.text-h-gray.q-mt-xs(v-if="isCardView" :style="{'height': '104px'}") {{ description }}

  q-card-section.q-pa-none.row.justify-between.items-center(:class="{ '': isCardView, 'col': isListView, 'full-width q-pt-md': !$q.screen.gt.sm }" :style="[isCardView && $q.screen.gt.xs ? {'height': '80px'} : {}]")
    .full-width
      slot(name="footer")

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

.dho-card--list
  flex-direction: row

</style>
