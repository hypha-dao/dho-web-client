<script>
import TimeFormat from '~/mixins/time-format'

export default {
  name: 'new-members',
  mixins: [TimeFormat],
  components: {
    Widget: () => import('../common/widget.vue')
  },

  props: {
    /**
     * Array list of members { avatar, name, joinedDate, profileLink }
     */
    members: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<template lang="pug">
widget.full-height(title="New Members")
  #member-item.row.q-pa-md(v-for="member in members")
    q-avatar
      img(:src="member.avatar")
    .col.q-ml-md
      .text-caption.text-weight-bold {{ member.name }}
      .row.q-gutter-sm
        q-icon(name="fas fa-calendar-alt")
        .text-caption.text-italic {{ member.joinedDate | timeAgo }}
  q-btn.q-mt-md.full-width(
    label="See all"
    flat
    no-caps
    to="members"
  )
</template>
