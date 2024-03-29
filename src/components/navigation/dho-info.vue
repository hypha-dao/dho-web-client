<template lang="pug">
q-card.dho-info(flat :style="{ width }")
  q-card-section.relative-position(:class="titleClass" :style="{ height }")
    q-btn.absolute-top-right.q-mt-md.q-mr-md.q-pa-xs.share-btn(rounded unelevated size="10px" icon="fas fa-share-alt" color="white" text-color="primary" @click="copyToClipboardADaoLink")
  q-card-section.q-px-none
    .row.items-center.justify-between
      .col-12.q-px-lg.q-mb-md
        .text-h6.text-bold.q-pb-sm {{ name }}
        .text-ellipsis.text-grey-7 {{ description }}
      .col-12.q-px-lg.q-mb-md
        q-expansion-item(dense dense-toggle="dense-toggle" expand-separator="expand-separator" :label="$t('navigation.dho-info.moreInfo')")
          .row
            .text-ellipsis.text-grey-7 {{ $t('navigation.dho-info.votingDuration', { '1': formatPeriod(votingDuration) }) }}
          .row
            .text-ellipsis.text-grey-7 {{ $t('navigation.dho-info.periodDuration', { '1': formatPeriod(periodDuration) }) }}
          .row.justify-center
            .text-ellipsis.text-grey-7.text-bold {{ $t('navigation.dho-info.admins') }}
          .row.justify-center(v-for="admin of admins")
            .text-ellipsis.text-grey-7 {{ admin.details_member_n }}

</template>

<script>
import { copyToClipboard } from 'quasar'

export default {
  name: 'dho-info',
  props: {
    name: String,
    description: String,
    admins: Array,
    votingDuration: Number,
    periodDuration: Number
  },
  data () {
    return {
      height: '50px',
      width: '282px'
    }
  },
  computed: {
    titleClass () {
      const clazz = {}
      clazz[`bg-${this.color}`] = true
      return clazz
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
          message: this.$t('messages.linkCopied'),
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
    formatPeriod (period) {
      const DAY_SEG = 86400
      const HR_SEG = 3600
      const MIN_SEG = 60

      let textDays = ''
      let textHours = ''
      let textMin = ''
      let textSeg = ''
      let lessTime
      const days = Math.floor(period / DAY_SEG)
      textDays = days > 0 ? (days === 1 ? `${days} day ` : `${days} days`) : ''
      lessTime = period - (days * DAY_SEG)
      const hours = Math.floor(lessTime / HR_SEG)
      textHours = hours > 0 ? `${hours}h ` : textHours
      lessTime = period - (days * DAY_SEG) - (hours * HR_SEG)
      const min = Math.floor(lessTime / MIN_SEG)
      textMin = min > 0 ? `${min}min ` : textMin
      lessTime = period - (days * DAY_SEG) - (hours * HR_SEG) - (min * MIN_SEG)
      textSeg = lessTime > 0 ? `${lessTime}s` : textSeg

      return `${textDays}${textHours}${textMin}${textSeg}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.dho-info
  border-radius 32px

  .share-btn
    z-index 1

  .left-border
    border-left 1px solid $internal-bg

</style>
