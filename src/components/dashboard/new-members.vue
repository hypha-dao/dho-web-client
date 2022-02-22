<script>
import TimeFormat from '~/mixins/time-format'

export default {
  name: 'new-members',
  mixins: [TimeFormat],
  components: {
    Widget: () => import('../common/widget.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
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
widget.full-height
  .row.justify-between.q-mt-md.q-mb-md
    .col-9
      .h4.q-px-md New Members
    .col
      q-btn.full-width.b2(
        label="See all"
        flat
        no-caps
        dense
        to="members"
      )
  #member-item.row.q-pa-md(v-for="member in members")
    profile-picture(:username="member.name" size="2.8rem")
    .col.q-ml-xs
      .h7.q-pl-md {{ member.name }}
      .row.q-gutter-sm.q-pl-md.q-pt-xs
        q-icon(name="fas fa-calendar-alt")
        .b3 {{ member.joinedDate | timeAgo }}
</template>
