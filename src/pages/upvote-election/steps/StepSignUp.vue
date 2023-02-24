<script>
import { mapGetters } from 'vuex'
const ordersMap = [{ asc: 'createdDate' }, { desc: 'createdDate' }, { asc: 'details_title_s' }]
export default {
  name: 'step-sign-up',
  components: {
    AssetList: () => import('~/components/organization-asset/asset-list.vue')
  },

  apollo: {
    daoBadges: {
      query: require('~/query/badges/dao-badges.gql'),
      update: data => {
        const validBadges = []
        data.getDao.badge.forEach(badge => {
          if (badge.details_title_s === 'Voter' || badge.details_title_s === 'Delegate') {
            validBadges.push({
              title: badge.details_title_s,
              description: badge.details_description_s,
              icon: badge.details_icon_s,
              docId: badge.docId,
              assignmentAggregate: badge.assignmentAggregate,
              assignment: badge.assignment.map((ownedby) => {
                return {
                  username: ownedby.details_assignee_n,
                  daoName: ownedby.dao[0].details_daoName_n
                }
              })
            })
          }
        })
        return validBadges
      },
      variables () {
        return {
          first: this.pagination.first,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.textFilter ? { details_title_s: { regexp: `/.*${this.textFilter}.*/i` } } : null
        }
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId
      },
      debounce: 500,
      loadingKey: 'loadingQueriesCount',
      result ({ data, loading, networkStatus }) {
        if (this.pagination.offset === 0) {
          this.$refs.scroll?.resume()
        }
      }
    }
  },

  props: {
    step: Object
  },
  data () {
    return {
      pagination: {
        first: 6,
        offset: 0,
        fetchMore: true
      },
      textFilter: null,
      order: ordersMap[0]
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao'])
  }
}
</script>

<template lang="pug">
.step-sign-up
  .h-b2.q-mb-xxl {{ step.description }}
  asset-list(:assetList="daoBadges" bordered)
</template>

<style lang="stylus" scoped>
</style>
