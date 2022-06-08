<script>
export default {
  name: 'badges-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    BadgeCard: () => import('./badge-card.vue'),
    EmptyWidgetLabel: () => import('../common/empty-widget-label.vue')
  },
  props: {
    /**
     * Circles Array
     */
    badges: {
      type: Array,
      default: () => []
    },
    /**
     * Show compact style
     */
    compact: {
      type: Boolean,
      default: false
    },
    fromProfile: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * On badge click
     */
    onClick (docId) {
      !this.fromProfile
        ? this.$router.push({ path: `/${this.$route.params.dhoname}/organization/assets/badge/${docId}` })
        : this.$router.push({ path: `/${this.$route.params.dhoname}/proposals/${docId}` })
    }
  }
}
</script>

<template lang="pug">
widget(title="Badges" :more="!fromProfile" morePosition="top" @more-clicked="$router.push({ path: `/${$route.params.dhoname}/organization/assets/badge` })"
  tooltip="Badges assigned to members recognise certain skills or achievements and/or confirm a status level. These badges serve as a digital proof following a vote.").full-width
  .q-mt-xs
  .row(v-if="!badges ||badges.length === 0")
    empty-widget-label(sectionTitle="badges")
  .row(v-else v-for="badge in badges")
      .col-12
          badge-card(v-bind="badge" :compact="compact" @click.native="onClick(badge.docId)")
</template>
