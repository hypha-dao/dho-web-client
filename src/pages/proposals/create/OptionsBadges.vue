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
      text: null
    }
  },

  apollo: {
    dho: {
      query: require('../../../query/badges/badges-options.gql'),
      update: data => {
        const badge = data.getDao.badge.map(b => {
          return {
            ...b,
            details_description_s: b.details_description_s.slice(0, 150) + '...'
          }
        })
        return {
          ...data.getDao,
          badge
        }
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
  mounted () {
    if (this.reference !== null) {
      const headerName = this.$route.meta.title.split('>')
      this.$route.meta.title = `${headerName[0]} > ${headerName[1]} > ${this.reference.details_title_s}`
    }
  },

  methods: {
    // TODO: Move this code to shared location?
    badges (dho) {
      if (dho.badge && Array.isArray(dho.badge)) {
        return dho.badge
      }
      return []
    },

    filtered (badge) {
      if (!this.text) return true
      const needle = this.text.toLocaleLowerCase()
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
.options-badges
  .h-h4.q-py-sm.q-mt-sm Choose a badge type
  q-input.q-mt-xxs.rounded-border(
        dense
        label="Filter badges"
        outlined
        v-model="text"
  )
  .row.q-mt-sm(v-if="dho")
    template(v-for="badge in badges(dho)")
      .col-4.q-pr-sm.q-pb-sm(v-if="filtered(badge)")
        badge-radio(
          :badge="badge"
          :selected="reference && badge.docId === reference.docId"
          @click="select(badge)"
        )
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
