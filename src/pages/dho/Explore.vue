<script>
export default {
  name: 'page-explore',
  components: {
    CreateDhoWidget: () => import('~/components/organization/create-dho-widget.vue'),
    DhoCard: () => import('~/components/navigation/dho-card.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue')
  },

  data () {
    return {
      optionArray: ['Creation date ascending', 'Creation date descending', 'Sort alphabetically'],
      sort: '',
      daoName: '',
      first: 3,
      offset: 0,
      more: true,
      restart: false,
      order: { desc: 'createdDate' }
    }
  },
  apollo: {
    dhos: {
      query () {
        return require('~/query/dao/dao-list.gql')
      },
      update: data => {
        return data?.queryDao?.map(dao => {
          return {
            name: dao.settings[0].settings_daoName_n,
            title: dao.settings[0].settings_daoTitle_s,
            members: dao.memberAggregate.count,
            date: dao.createdDate,
            description: dao.settings[0].settings_daoDescription_s,
            proposals: dao.proposalAggregate.count,
            logo: dao.settings[0].settings_logo_s,
            primaryColor: dao.settings[0].settings_primaryColor_s,
            secondaryColor: dao.settings[0].settings_secondaryColor_s
          }
        })
      },
      variables () {
        return {
          order: this.order,
          filter: this.daoName ? { details_daoName_n: { regexp: `/.*${this.daoName}.*/i` } } : null,
          first: this.first,
          offset: 0
        }
      }
    }
  },

  methods: {
    updateSort (selectedSort) {
      if (this.optionArray[0] === selectedSort) this.order = { desc: 'createdDate' }
      if (this.optionArray[1] === selectedSort) this.order = { asc: 'createdDate' }
      if (this.optionArray[2] === selectedSort) this.order = { asc: 'details_daoName_n' }

      this.$apollo.queries.dhos.start()

      this.sort = selectedSort
      this.restart = true
      this.offset = 0
      this.more = true
      this.resetPagination()
    },

    updateDaoName (daoName) {
      if (this.optionArray[0] === this.sort) this.order = { desc: 'createdDate' }
      if (this.optionArray[1] === this.sort) this.order = { asc: 'details_daoName_n' }

      this.$apollo.queries.dhos.start()

      this.daoName = daoName || ''
      this.restart = true
      this.offset = 0
      this.more = true
      this.resetPagination()
    },

    async onLoad (index, done) {
      if (this.more) {
        const fetchMore = {
          variables: {
            daoName: this.daoName,
            offset: this.offset,
            first: this.first,
            order: this.order
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.queryDao.length === 0) this.more = false
            if (this.restart) {
              this.restart = false
              return fetchMoreResult
            }
            return {
              queryDao: [
                ...prev.queryDao,
                ...fetchMoreResult.queryDao
              ],
              hasMore: this.more
            }
          }
        }
        await this.$apollo.queries.dhos.fetchMore(fetchMore)
        this.offset = this.offset + this.first
        done()
      }
    },

    async resetPagination () {
      await this.$nextTick()
      this.$refs.scroll.stop()
      await this.$nextTick()
      this.$refs.scroll.resume()
      await this.$nextTick()
      this.$refs.scroll.trigger()
    }
  }

}
</script>
<template lang="pug">
.page-explore.full-width
  .row.q-mt-sm(:class="{ 'column-sm': !$q.screen.gt.sm }")
    .col-12.col-md.col-lg.col-xl.q-py-md(ref="scrollContainer")
        q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollContainer" ref="scroll")
          .row.q-gutter-md(:class="{ 'justify-center': $q.screen.width < 770}")
            template(v-for="dho in dhos")
              dho-card.col-sm-6.col-md-5.col-lg-3.col-xl-4(v-bind="dho")
    .col-12.col-md-5.col-lg-4.col-xl-3.q-pa-sm.q-py-md
      filter-widget.sticky.z-30(
        filterTitle="Search DHOs"
        :optionArray.sync="optionArray"
        :showToggle="false"
        :defaultOption="1"
        :showViewSelector="false"
        :showCircle="false"
        @update:sort="updateSort"
        @update:textFilter="updateDaoName",
        :debounce="1000"
      )
      //- Commented for the MVP
      //- create-dho-widget.z-10
</template>
<style lang="stylus" scoped>
.column-sm
  flex-direction: column-reverse
</style>
