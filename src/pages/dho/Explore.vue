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
    dhos: {
      query () {
        if (this.sort === 'Recently added') return require('~/query/dao/dao-list-recent.gql')
        if (this.sort === 'Sort alphabetically') return require('~/query/dao/dao-list-asc.gql')
        return require('~/query/dao/dao-list.gql')
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
          daoName: this.daoName,
          first: this.first,
          offset: 0
        }
      }
    }
  },
  methods: {
    updateSort (selectedSort) {
      this.sort = selectedSort
      this.restart = true
      this.offset = 0
      this.more = true
      this.resetPagination()
    },
    updateDaoName (daoName) {
      this.daoName = daoName
      this.restart = true
      this.offset = 0
      this.more = true
      this.resetPagination()
    },
    async onLoad (index, done) {
      if (this.more) {
        this.offset = this.restart ? this.offset : this.offset + this.first
        await this.$apollo.queries.dhos.fetchMore({
          variables: {
            daoName: this.daoName,
            offset: this.offset,
            first: this.first
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.queryDao.length === 0) this.more = false
            if (this.restart) {
              prev.queryDao = []
              this.restart = false
            }
            return {
              queryDao: [
                ...prev.queryDao,
                ...fetchMoreResult.queryDao
              ],
              hasMore: this.more
            }
          }
        })
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
      filter-widget(
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
