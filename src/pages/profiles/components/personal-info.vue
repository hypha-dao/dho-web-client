<script>
import { timeZones } from '~/mixins/time-zones'

export default {
  name: 'personal-info',
  mixins: [timeZones],
  components: {
    Widget: () => import('~/components/widget.vue')
  },

  props: {
    joined: String,
    publicData: Object,
    username: String
  },

  computed: {
    joinDate () {
      return this.formatDate(this.joined, { year: 'numeric' })
    },

    timezone () {
      if (this.publicData) {
        const tz = this.timeZonesOptions.find(v => v.value === this.publicData.timeZone)
        if (tz) {
          return tz.text
        }
      }
      return null
    }
  },

  methods: {
    formatDate (date, opts) {
      if (!date) return undefined
      const options = Object.assign({ month: 'short', day: 'numeric' }, opts)
      return new Date(date).toLocaleDateString(undefined, options)
    }
  }
}
</script>

<template lang="pug">
Widget
  .row.q-pa-md.q-col-gutter-md
    .col-12.col-sm-6.col-md-12
      .flex.justify-center.q-my-md
        q-avatar(v-if="publicData && publicData.avatar" size="200px")
          img(:src="publicData.avatar")
        q-avatar(v-else color="accent" text-color="white" size="200px") {{ username.slice(0, 2).toUpperCase() }}
    .col-12.col-sm-6.col-md-12
      .name.text-h5.text-bold.text-center {{ publicData ? publicData.name : username }}
      .account.text-subtitle1.text-center {{ '@' + username }}
      .hashtags.flex.justify-center(v-if="publicData")
        .q-mx-xs(v-for="(tag, idx) in publicData.tags" :key="idx") {{ '#' + tag }}
      .text-body2.q-mt-md
        .row.items-center(v-if="joined")
          q-icon.on-left(color="primary" name="fas fa-user")
          .detail-text Joined {{ joinDate }}
        .row.items-center(v-if="timezone")
          q-icon.on-left(color="primary" name="fas fa-map-marker-alt")
          .detail-text {{ timezone }}
</template>

<style lang="stylus" scoped>
.detail-text
  max-width calc(100% - 28px)
</style>
