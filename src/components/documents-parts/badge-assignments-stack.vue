<script>
import { mapActions, mapGetters } from 'vuex'
import { documents } from '~/mixins/documents'

export default {
  name: 'badge-assignments-stack',
  mixins: [documents],
  props: {
    username: { type: String, required: true }
  },
  methods: {
    ...mapActions('badges', ['loadBadgeAssignments']),
    getBadgeIcon (badgeAssignment) {
      return badgeAssignment.badge && this.getValue(badgeAssignment.badge[0], 'details', 'icon')
    },
    getBadgeName (badgeAssignment) {
      return this.getValue(badgeAssignment, 'details', 'title')
    }
  },
  async beforeMount () {
    await this.loadBadgeAssignments()
  },
  computed: {
    ...mapGetters('badges', ['badgeAssignments'])
  }
}
</script>

<template lang="pug">
.relative-position(v-if="badgeAssignments && badgeAssignments[username] && badgeAssignments[username].length")
  q-img.badge(
    v-for="(badge, i) in badgeAssignments[username]"
    :key="`badge_${i}`"
    :src="getBadgeIcon(badge)"
    :style="{top: `${i * 30}px`}"
  )
    q-tooltip {{ getBadgeName(badge) }}
</template>

<style lang="stylus" scoped>
.badge
  position absolute
  width 50px
  right 0
  z-index 100
</style>
