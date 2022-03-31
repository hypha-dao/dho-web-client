<script>
export default {
  name: 'page-explore',
  components: {
    DhoCard: () => import('~/components/navigation/dho-card.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue')
  },

  data () {
    return {
      optionArray: ['Recently added', 'Sort alphabetically'],
      sort: '',
      daoName: '',
      first: 3,
      offset: 0,
      more: true,
      restart: false
    }
  },
  apollo: {
    dhosRes: {
      query () {
        return require('~/query/dao/dao-list-recent.gql')
      },
      update: data => {
        const mapdhos = data.queryDao.map(dao => {
          return {
            name: dao.details_daoName_n,
            members: dao.memberAggregate.count,
            date: dao.createdDate,
            description: dao.settings[0].settings_daoDescription_s,
            proposals: dao.proposalAggregate.count
          }
        })

        return mapdhos
      },
      variables () {
        return {
          filter: this.daoName ? { details_daoName_n: { regexp: `/.*${this.daoName}.*/i` } } : null,
          first: this.first,
          offset: 0
        }
      },
      skip: true
    },
    dhosAlp: {
      query () {
        return require('~/query/dao/dao-list-asc.gql')
      },
      update: data => {
        const mapdhos = data.queryDao.map(dao => {
          return {
            name: dao.details_daoName_n,
            members: dao.memberAggregate.count,
            date: dao.createdDate,
            description: dao.settings[0].settings_daoDescription_s,
            proposals: dao.proposalAggregate.count
          }
        })

        return mapdhos
      },
      variables () {
        return {
          filter: this.daoName ? { details_daoName_n: { regexp: `/.*${this.daoName}.*/i` } } : null,
          first: this.first,
          offset: 0
        }
      },
      skip: true
    }
  },
  computed: {
    dhos () {
      if (this.optionArray[0] === this.sort) return this.dhosRes
      if (this.optionArray[1] === this.sort) return this.dhosAlp
      return []
    }
  },
  methods: {
    updateSort (selectedSort) {
      if (this.optionArray[0] === selectedSort) this.$apollo.queries.dhosRes.start()
      if (this.optionArray[1] === selectedSort) this.$apollo.queries.dhosAlp.start()
      this.sort = selectedSort
      this.restart = true
      this.offset = 0
      this.more = true
      this.resetPagination()
    },
    updateDaoName (daoName) {
      if (this.optionArray[0] === this.sort) this.$apollo.queries.dhosRes.start()
      if (this.optionArray[1] === this.sort) this.$apollo.queries.dhosAlp.start()
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
            first: this.first
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
        if (this.optionArray[0] === this.sort) await this.$apollo.queries.dhosRes.fetchMore(fetchMore)
        if (this.optionArray[1] === this.sort) await this.$apollo.queries.dhosAlp.fetchMore(fetchMore)
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
  },
  meta: {
    title: 'Explore'
  }
}
</script>

<template lang="pug">
.page-explore.full-width
  .row.q-mt-sm
    .col-9.q-px-sm.q-py-md(ref="scrollContainer")
        q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollContainer" ref="scroll")
          .row.q-gutter-md
            template(v-for="dho in dhos")
              dho-card(v-bind="dho")
    .col-3.q-pa-sm.q-py-md
      filter-widget.sticky(
        filterTitle="Search DHOs"
        :optionArray.sync="optionArray"
        :showToggle="false"
        :showViewSelector="false"
        :showCircle="false"
        @update:sort="updateSort"
        @update:textFilter="updateDaoName",
        :debounce="1000"
      )
      //- Commented for MVP
      //- widget.q-my-md(title="Create your DHO")
      //-   .text-ellipsis.text-grey-7 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      //-   q-btn.q-mt-xl.q-px-lg(rounded color="primary" no-caps) New DHO
</template>

<style lang="sass" scoped>

</style>
