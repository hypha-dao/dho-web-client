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
      this.$router.push({ name: 'members', params: { dhoname: this.$route.params.dhoname, applicants: false } })
    }
  }
}
</script>

<template lang="pug">
widget(more morePosition="top" :title="title" @more-clicked="moreClicked").full-height
  .row.q-pt-xs(v-for="member in members")
    profile-picture(:username="member.name" size="50px" show-name link)
      template(v-slot:detail)
        .row.q-gutter-xxs.q-pt-xxs.text-h-gray
          q-icon(name="fas fa-calendar-alt")
          .text-xs {{ member.joinedDate | timeAgo }}
    .col.row.items-center.justify-end
      .row.q-gutter-xs(v-if="hasListener('approve') && hasListener('deny')")
        q-btn.q-pa-xxs(
          @click="$emit('deny', member.name)"
          color="negative"
          icon="fas fa-times"
          round
          size="xs"
          unelevated
        )
        q-btn.q-pa-xxs(
          @click="$emit('approve', member.account)"
          color="positive"
          icon="fas fa-check"
          round
          size="xs"
          unelevated
        )
</template>
