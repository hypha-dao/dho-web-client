<script>
import { mapGetters } from 'vuex'
import { EXPLORE_BY } from '~/const'
import ipfsy from '~/utils/ipfsy'
import { dateToString } from '~/utils/TimeUtils'
import lodash from 'lodash'

export default {
  name: 'page-explore',
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    DhoCard: () => import('~/components/navigation/dho-card.vue'),
    FilterOpenButton: () => import('~/components/filters/filter-open-button.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    FilterWidgetMobile: () => import('~/components/filters/filter-widget-mobile.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    ExploreByWidget: () => import('~/components/common/explore-by-widget.vue'),
    EcosystemCard: () => import('~/components/ecosystem/ecosystem-card.vue')
  },

  data() {
    return {
      lodash,
      dateToString,
      EXPLORE_BY,
      mobileFilterOpen: false,

      isExploreBannerVisible: true,
      daoName: '',
      first: 6,
      offset: 0,
      more: true,
      restart: false,

      view: 'card',
      sort: '',
      textFilter: null,
      optionArray: [
        { label: this.$t('pages.dho.explore.sortBy'), disable: true },
        this.$t('pages.dho.explore.newestFirst'),
        this.$t('pages.dho.explore.oldestFirst'),
        this.$t('pages.dho.explore.alphabetically')
      ],
      showApplicants: false,
      mobileFilterStyles: {
        width: this.$q.screen.md ? '400px' : '100%',
        right: this.$q.screen.md ? '0' : '0',
        left: this.$q.screen.md ? 'auto' : '0'
      },
      exploreBy: EXPLORE_BY.DAOS
    }
  },

  apollo: {
    dhos: {
      query() { return require('~/query/dao/dao-list.gql') },

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

      variables() {
        return {
          order: this.order,
          filter: this.textFilter ? { details_daoName_n: { regexp: `/.*${this.textFilter}.*/i` } } : null,
          first: this.first,
          offset: 0
        }
      }

      // pollInterval: 1000

    },

    ecosystemsList: {
      query() {
        return require('~/query/ecosystem/ecosystems-list.gql')
      },
      update: data => {
        return data?.queryDao?.map(ecosystem => {
          return {
            name: ecosystem.settings[0].ecosystem_name_s,
            purpose: ecosystem.settings[0].ecosystem_purpose_s,
            logo: ecosystem.settings[0].ecosystem_logo_s,
            domain: ecosystem.settings[0].ecosystem_domain_s,
            createdDate: ecosystem.createdDate,
            daosCount: ecosystem.anchorchildAggregate.count,
            comMembersCount: ecosystem.commemberAggregate.count,
            coreMembersCount: ecosystem.memberAggregate.count
          }
        })
      },
      variables() {
        return {
          order: this.order,
          filter: this.textFilter ? { details_daoName_n: { regexp: `/.*${this.textFilter}.*/i` } } : { and: { details_daoType_s: { regexp: '/anchor/' }, details_isWaitingEcosystem_i: { eq: 0 } } },
          first: this.first,
          offset: 0
        }
      }
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'isHypha']),

    banner() {
      return {
        title: this.daoSettings.exploreTitle || this.$t('pages.dho.explore.discoverTheHyphaDAONetwork'),
        description: this.daoSettings.exploreParagraph || this.$t('pages.dho.explore.welcomeToTheGlobalDAO'),
        background: ipfsy(this.daoSettings.exploreBackgroundImage),
        color: this.daoSettings.primaryColor,
        pattern: this.daoSettings.pattern,
        patternColor: this.daoSettings.patternColor,
        patternAlpha: this.daoSettings.patternOpacity
      }
    },

    order() {
      if (this.optionArray[1] === this.sort) return { desc: 'createdDate' }
      if (this.optionArray[2] === this.sort) return { asc: 'createdDate' }
      if (this.optionArray[3] === this.sort) return { asc: 'details_daoName_n' }

      return null
    },

    filterPlacehoder() {
      if (this.exploreBy === EXPLORE_BY.DAOS) {
        return this.$t('pages.dho.explore.searchDHOs')
      } else if (this.exploreBy === EXPLORE_BY.ECOSYSTEMS) {
        return this.$t('pages.dho.explore.searchEcosystems')
      }
      return ''
    }
  },

  async mounted() {
    if (localStorage.getItem('showExploreBanner') === 'false') {
      this.isExploreBannerVisible = false
    }
  },

  methods: {
    hideExploreBanner() {
      localStorage.setItem('showExploreBanner', false)
      this.isExploreBannerVisible = false
    },

    async onLoad(index, done) {
      if (this.more) {
        // if (this.offset === 0) {
        //   this.offset += 1
        // } else {
        //   this.offset += this.first
        // }

        const fetchMore = {
          variables: {
            filter: this.textFilter ? { details_daoName_n: { regexp: `/.*${this.textFilter}.*/i` } } : null,
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
        try {
          await this.$apollo.queries.dhos.fetchMore(fetchMore)
          this.offset += this.first
        } catch (err) {
        }
        done()
      }
    },

    ipfsy,

    async resetPagination() {
      this.restart = true
      this.offset = 0
      this.more = true

      await this.$nextTick()
      this.$refs.scroll.stop()
      await this.$nextTick()
      this.$refs.scroll.resume()
      await this.$nextTick()
      this.$refs.scroll.trigger()
    },

    yearFromDate(date) {
      return this.dateToString(date).split(',')[1]
    }
  },

  watch: {

    textFilter: {
      handler: async function (value) {
        this.resetPagination()
      },
      immediate: false
    },

    sort: {
      handler: async function (value) {
        // const index = this.optionArray.findIndex(option => option === value)
        // this.order = ordersMap[index]
        // this.shouldReset = true
        this.resetPagination()
      },
      immediate: false
    }
  }

}

</script>
<template lang="pug">
q-page.page-explore(:style="'overflow-x: hidden'")
  .row.full-width(v-if="isExploreBannerVisible")
    base-banner(v-bind="banner" @onClose="hideExploreBanner" :compact="!$q.screen.gt.sm")
      template(v-slot:buttons)
        a(target="_tab" href="https://hypha.earth/")
          q-btn.q-px-lg.h-btn1(no-caps rounded unelevated color="secondary" href="https://hypha.earth/" target="_blank") {{ $t('pages.dho.explore.discoverMore') }}
  .row.q-py-md(:class="{ 'block': $q.screen.lt.sm, 'overflow-x': 'hidden' }")
    .col-sm-12.col-md-12.col-lg-9(ref="scrollContainer" v-if="exploreBy === EXPLORE_BY.DAOS")
      q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollContainer" ref="scroll")
        .row
          .col-4.q-mb-md(v-for="(dho,index) in lodash.uniqBy(dhos, 'name')" :key="dho.name" :class="{'col-6': $q.screen.lt.lg, 'q-pr-md': $q.screen.lt.sm ? false : $q.screen.gt.md ? true : index % 2 === 0, 'full-width':  view === 'list' || $q.screen.lt.sm}")
            dho-card.full-width(v-bind="dho" :view="view" useIpfsy ellipsis)
              template(v-slot:footer)
                footer.full-width.row.items-center
                  .col-6.text-center
                    q-icon.q-pb-xs(color="grey-7" name="fas fa-calendar-alt")
                    .col
                    .text-grey-7.h-b2 {{ dateToString(dho.date, false) }}
                      | ,
                    .text-grey-7.h-b2 {{ yearFromDate(dho.date) }}
                  .col-6.text-center(:style="{'border-left': '1px solid #CBCDD1'}")
                    q-icon.q-pb-xs(color="grey-7" name="fas fa-users")
                    .text-grey-7.h-b2.q-px-xs {{ dho.members }}
                    .text-grey-7.h-b2 {{ $t('pages.dho.explore.members') }}
    .col-9(v-if="exploreBy === EXPLORE_BY.ECOSYSTEMS")
      q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollContainer" ref="scroll")
        .row.q-col-gutter-md.q-mr-md
          .full-width(v-for="(ecosystem,index) in ecosystemsList" :key="ecosystem.name")
            ecosystem-card(:data="ecosystem")
    .col-3(v-if="$q.screen.gt.md")
      explore-by-widget(:type="exploreBy" @change="type => exploreBy = type")
      filter-widget.sticky(:debounce="1000" :defaultOption="1" :optionArray.sync="optionArray" :showCircle="false" :showToggle="false" :sort.sync="sort" :textFilter.sync="textFilter" :toggle.sync="showApplicants" :toggleDefault="false" :toggleLabel="'Show daos'" :showViewSelector="false" :filterTitle="filterPlacehoder")
    div(v-else)
      filter-open-button(@open="mobileFilterOpen = true")
      filter-widget-mobile(:debounce="1000" :defaultOption="1" :optionArray.sync="optionArray" :showCircle="false" :showToggle="false" :sort.sync="sort" :textFilter.sync="textFilter" :toggle.sync="showApplicants" :showViewSelector="false" @close="mobileFilterOpen = false" @update:sort="updateSort" @update:textFilter="updateDaoName" :filterTitle="filterPlacehoder" v-show="mobileFilterOpen" :style="mobileFilterStyles")

</template>
<style lang="stylus" scoped>
</style>
