<script>
import ipfsy from '~/utils/ipfsy'
import { mapGetters } from 'vuex'

export default {
  name: 'page-explore',
  components: {
    CreateDhoWidget: () => import('~/components/organization/create-dho-widget.vue'),
    DhoCard: () => import('~/components/navigation/dho-card.vue'),
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue')
  },
  async mounted () {
    if (localStorage.getItem('showExploreBanner') === 'false') {
      this.isShowingExploreBanner = false
    }
  },
  data () {
    return {
      optionArray: ['Creation date ascending', 'Creation date descending', 'Sort alphabetically'],
      isShowingExploreBanner: true,
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
            secondaryColor: dao.settings[0].settings_secondaryColor_s,
            url: dao.settings[0].settings_daoUrl_s
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

  computed: {
    ...mapGetters('dao', ['daoSettings']),
    ...mapGetters('accounts', ['isAdmin', 'isProduction']),
    ...mapGetters('dao', ['isHypha', 'daoSettings']),

    banner () {
      return {
        title: 'Discover the Hypha DAO network',
        description: 'Welcome to the global DAO directory! Click on any card to open the DAO and to take a look under the hood. You can learn more about them, apply as a member or simply take a look around.',
        background: ipfsy(this.daoSettings.dashboardBackgroundImage),
        color: this.daoSettings.primaryColor,
        pattern: this.daoSettings.pattern,
        patternColor: this.daoSettings.patternColor,
        patternAlpha: this.daoSettings.patternOpacity
      }
    },
    order () {
      if (this.optionArray[0] === this.sort) {
        return { asc: 'createdDate' }
      }
      if (this.optionArray[1] === this.sort) {
        return { desc: 'createdDate' }
      }
      if (this.optionArray[2] === this.sort) {
        return { asc: 'details_daoName_n' }
      }
      return null
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
      this.daoName = daoName || ''
      this.restart = true
      this.offset = 0
      this.more = true
      this.resetPagination()
    },
    hideExploreBanner () {
      localStorage.setItem('showExploreBanner', false)
      this.isShowingExploreBanner = false
    },
    async onLoad (index, done) {
      if (this.more) {
        const fetchMore = {
          variables: {
            filter: this.daoName ? { details_daoName_n: { regexp: `/.*${this.daoName}.*/i` } } : null,
            order: this.order,
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
              ]
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
  .row.full-width(v-if="isShowingExploreBanner")
    base-banner(v-bind="banner" @onClose="hideExploreBanner" :compact="!$q.screen.gt.sm")
      template(v-slot:buttons)
        q-btn.q-px-lg.h-btn1(v-show="!isProduction && isHypha && isAdmin" no-caps rounded unelevated color="secondary" :to="{ name: 'dho-creation' }") Create your own DAO
        a(target="_tab" href='https://hypha.earth/')
          q-btn.h-h7(color="white" no-caps flat rounded label="More about Hypha" href='https://hypha.earth/')
  .row.q-mt-sm(:class="{ 'column-sm': !$q.screen.gt.sm }")
    .col-12.col-md.col-lg.col-xl.q-py-md(ref="scrollContainer")
        q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollContainer" ref="scroll")
          .row.q-gutter-md(:class="{ 'justify-center': $q.screen.width < 770}")
            template(v-for="dho in dhos")
              dho-card.col-sm-6.col-md-5.col-lg-3.col-xl-4(v-bind="dho")
    .col-12.col-md-5.col-lg-4.col-xl-3.q-pa-sm.q-py-md(v-if="$q.screen.gt.sm")
      .sticky.z-30
        filter-widget(
          filterTitle="Search DHOs"
          :optionArray.sync="optionArray"
          :showToggle="false"
          :defaultOption="0"
          :showViewSelector="false"
          :showCircle="false"
          @update:sort="updateSort"
          @update:textFilter="updateDaoName",
          :debounce="1000"
        )
        create-dho-widget(v-show="!isProduction && isHypha && isAdmin").z-10

</template>
<style lang="stylus" scoped>
.column-sm
  flex-direction: column-reverse
</style>
