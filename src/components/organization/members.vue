<script>
import TimeFormat from '~/mixins/time-format'
import helpers from '~/mixins/helpers'

export default {
  name: 'members',
  mixins: [TimeFormat, helpers],
  components: {
    Widget: () => import('../common/widget.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },

  props: {
    title: {
      type: String,
      default: 'Members'
    },
    members: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    moreClicked () {
      this.$router.push({ name: 'people', params: { dhoname: this.$route.params.dhoname, applicants: false } })
    }
  }
}
</script>

<template lang="pug">
widget.full-height(more morePosition="top" :title="title" @more-clicked="moreClicked")
  .row.q-pt-xs(v-for="member in members")
    profile-picture(:username="member.name || member.username" size="50px" show-name link)
      template(v-slot:detail)
        .row.q-gutter-xxs.q-pt-xxs.text-h-gray
          q-icon(name="fas fa-calendar-alt")
          .text-xs {{ member.joinedDate | timeAgo }}
    .col.row.items-center.justify-end
      .row.q-gutter-xs(v-if="hasListener('enroll') && hasListener('reject')")
        q-btn.q-pa-xxs(@click="$emit('reject', member.username)" color="negative" icon="fas fa-times" round size="xs" unelevated)
        q-btn.q-pa-xxs(@click="$emit('enroll', member.username)" color="positive" icon="fas fa-check" round size="xs" unelevated)

</template>
