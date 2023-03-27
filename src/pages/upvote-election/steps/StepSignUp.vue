<script>
import { mapGetters } from 'vuex'
const ordersMap = [{ asc: 'createdDate' }, { desc: 'createdDate' }, { asc: 'details_title_s' }]
export default {
  name: 'step-sign-up',
  components: {
    AssetList: () => import('~/components/organization-asset/asset-list.vue')
  },

  apollo: {
    memberBadges: {
      query: require('~/query/badges/member-badges.gql'),
      update: data => {
        return data.getDao?.badge?.map(badge => {
          return {
            title: badge.details_title_s,
            description: badge.details_description_s,
            icon: badge.details_icon_s,
            docId: badge.assignment[0]?.docId,
            assignments: badge.assignment
          }
        })
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          username: this.account
        }
      },
      skip () {
        return !this.account || !this.selectedDao || !this.selectedDao.docId
      },
      fetchPolicy: 'no-cache'
    },
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
                  daoName: ownedby.dao[0].details_daoName_n,
                  id: ownedby.docId
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
    step: Object,
    currentElectionIndex: Number
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
    ...mapGetters('dao', ['selectedDao']),
    ...mapGetters('accounts', ['account'])
  }
}
</script>

<template lang="pug">
.step-sign-up
  .h-b2.q-mb-xxl {{ step.description }}
  asset-list(:assetList="daoBadges" :memberBadges="memberBadges" ownerStyles bordered :currentElectionIndex="currentElectionIndex")
</template>

<style lang="stylus" scoped>
</style>
