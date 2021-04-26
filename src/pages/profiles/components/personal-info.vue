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
      if (this.joined) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(this.joined).toLocaleDateString(undefined, options)
      }
      return null
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
  }
}
</script>

<template lang="pug">
Widget
  .row.q-pa-md.q-col-gutter-md
    .header.col-12.col-sm-6.col-md-12
      .flex.justify-center.q-my-md
        q-avatar(size="200px")
          img(v-if="publicData" :src="publicData.avatar")
    .details.col-12.col-sm-6.col-md-12
      .name.text-h5.text-bold.text-center {{ publicData ? publicData.name : username }}
      .account.text-subtitle1.text-center {{ username + '@' }}
      .hashtags.flex.justify-center(v-if="publicData")
        .q-mx-xs(v-for="(tag, idx) in publicData.tags" :key="idx") {{ '#' + tag }}
      .text-body2.q-mt-md
        .row.items-center(v-if="joined")
          q-icon.detail-icon(name="fas fa-user")
          .detail-text Joined {{ joinDate }}
        .row.items-center(v-if="timezone")
          q-icon.detail-icon(name="fas fa-map-marker-alt")
          .detail-text {{ timezone }}
            q-tooltip {{ timezone }}
</template>

<style lang="stylus" scoped>
.details
  font-weight 500

  .detail-header
    font-weight 600
    color black

  .detail-icon
    padding-right 8px
    color #0880AE

  .detail-text
    color #728191
    max-width calc(100% - 22px)
</style>
