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
widget(more morePosition="top" title="New Members" @more-clicked="$router.push({ path: `/${$route.params.dhoname}/members`})").full-height
  #member-item.row.q-pt-xs(v-for="member in members")
    profile-picture(:username="member.name" size="2.8rem" show-name link)
      template(v-slot:detail)
        .row.q-gutter-sm.q-pt-xs
          q-icon(name="fas fa-calendar-alt")
          .h-b3 {{ member.joinedDate | timeAgo }}
</template>
