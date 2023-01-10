<script>

export default {
  name: 'options-badges',
  components: {
    BadgeRadio: () => import('~/components/badges/badge-radio.vue')
  },

  props: {
    reference: Object
  },

  data () {
    return {
      query: null
    }
  },

  apollo: {
    badges: {
      query: require('~/query/badges/badges-options.gql'),
      update: data => {
        const dao = data.getDao
        if (dao && dao.badge && Array.isArray(dao.badge)) {
          return dao.badge.map(_ => ({
            ..._,
            details_description_s: _.details_description_s.slice(0, 150) + '...'
          }))
        }

        return []
      },
      variables () {
        return {
          daoId: this.$store.state.dao.docId,
          filter: { details_state_s: { regexp: '/.*approved*./i' } },
          order: { asc: 'details_title_s' }
        }
      }
    }
  },

  computed: {
    basBadges () { return this.badges.length > 0 },
    isLoading () { return this.$apollo.queries.badges.loading }
  },

  mounted () {
    if (this.reference !== null) {
      const headerName = this.$route.meta.title.split('>')
      this.$route.meta.title = `${headerName[0]} > ${headerName[1]} > ${this.reference.details_title_s}`
    }
  },

  methods: {
    filtered (badge) {
      if (!this.query) return true
      const needle = this.query.toLocaleLowerCase()
      return badge && badge.details_title_s.toLocaleLowerCase().indexOf(needle) > -1
    },

    select (badge) {
      this.$emit('select', { ...badge, type: 'Badge' })
      const headerName = this.$route.meta.title.split('>')
      this.$route.meta.title = `${headerName[0]} > ${headerName[1]} > ${badge.details_title_s}`
    }
  }
}
</script>

<template lang="pug">
.options-badges.q-mt-md
  section(v-if="isLoading")
    .row.justify-center.q-my-md
      loading-spinner(color="primary" size="40px")
  section(v-else)
    div(v-if="basBadges")
      .h-h4.q-py-sm.q-mt-sm Choose a badge type
      q-input.q-mt-xxs.rounded-border(
        dense
        label="Filter badges"
        outlined
        v-model="query"
      )
      .row.q-mt-sm
        template(v-for="badge in badges")
          .q-pb-sm(:class="{ 'col-4':$q.platform.is.desktop, 'q-pr-sm':$q.platform.is.desktop, 'full-width':$q.platform.is.mobile && !$q.screen.sm, 'col-6 q-px-xs':$q.screen.sm }" v-if="filtered(badge)")
            badge-radio(
              :badge="badge"
              :selected="reference && badge.docId === reference.docId"
              @click="select(badge)"
            )
    div(v-else).row.justify-center
      .q-py-sm.q-mt-sm.text-center.full-width No badges exist yet.
      q-btn.text-xs.q-pa-none.q-ma-none.text-weight-900.text-secondary.text-underline(flat padding="0px" no-caps @click="$emit('changeOption','obadge')") Please create them here.

</template>

<style lang="stylus" scoped>
</style>
