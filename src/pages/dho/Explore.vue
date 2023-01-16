<script>
import { mapGetters } from 'vuex'
import ipfsy from '~/utils/ipfsy'

export default {
  name: 'page-explore',
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    DhoCard: () => import('~/components/navigation/dho-card.vue'),
    FilterOpenButton: () => import('~/components/filters/filter-open-button.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    FilterWidgetMobile: () => import('~/components/filters/filter-widget-mobile.vue')
  },

  data () {
    return {
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
        { label: 'Sort by', disable: true },
        'Creation date descending',
        'Creation date ascending',
        'Alphabetically'
      ],
      showApplicants: false,
      mobileFilterStyles: {
        width: this.$q.screen.md ? '400px' : '100%',
        right: this.$q.screen.md ? '0' : '0',
        left: this.$q.screen.md ? 'auto' : '0'
      }
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
          filter: this.textFilter ? { details_daoName_n: { regexp: `/.*${this.textFilter}.*/i` } } : null,
          first: this.first,
          offset: 0
        }
      }

    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'isHypha']),

    banner () {
      return {
        title: this.daoSettings.exploreTitle || 'Discover the Hypha DAO network',
        description: this.daoSettings.exploreParagraph || 'Welcome to the global DAO directory! Click on any card to open the DAO and to take a look under the hood. You can learn more about them, apply as a member or simply take a look around.',
        background: ipfsy(this.daoSettings.exploreBackgroundImage),
        color: this.daoSettings.primaryColor,
        pattern: this.daoSettings.pattern,
        patternColor: this.daoSettings.patternColor,
        patternAlpha: this.daoSettings.patternOpacity
      }
    },

    order () {
      if (this.optionArray[1] === this.sort) return { asc: 'createdDate' }
      if (this.optionArray[2] === this.sort) return { desc: 'createdDate' }
      if (this.optionArray[3] === this.sort) return { asc: 'details_daoName_n' }

      return null
    }
  },

  async mounted () {
    if (localStorage.getItem('showExploreBanner') === 'false') {
      this.isExploreBannerVisible = false
    }
  },

  methods: {
    hideExploreBanner () {
      localStorage.setItem('showExploreBanner', false)
      this.isExploreBannerVisible = false
    },

    async onLoad (index, done) {
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

    async resetPagination () {
      await this.$nextTick()
      this.$refs.scroll.stop()
      await this.$nextTick()
      this.$refs.scroll.resume()
      await this.$nextTick()
      this.$refs.scroll.trigger()
    }
  },

  watch: {
    sort: {
      handler: async function (value) {
        // const index = this.optionArray.findIndex(option => option === value)
        // this.order = ordersMap[index]
        // this.shouldReset = true

        this.restart = true
        this.offset = 0
        this.more = true
        this.resetPagination()
      },
      immediate: false
    }
  }

}

</script>
<template lang="pug">
q-page.page-explore
  .row.full-width(v-if="isExploreBannerVisible")
    base-banner(v-bind="banner" @onClose="hideExploreBanner" :compact="!$q.screen.gt.sm")
      template(v-slot:buttons)
        a(target="_tab" href='https://hypha.earth/')
          q-btn.q-px-lg.h-btn1(no-caps rounded unelevated color="secondary" href="https://hypha.earth/" target="_blank") Discover More

  .row.q-py-md
    .col-sm-12.col-md-12.col-lg-9(ref="scrollContainer")
      q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollContainer" ref="scroll")
        .row
          .col-4.q-mb-md(v-for="(dho,index) in dhos" :key="dho.name" :class="{ 'col-6': $q.screen.lt.lg, 'q-pr-md': $q.screen.lt.sm ? false : $q.screen.gt.md ? true : index % 2 === 0, 'full-width':  view === 'list' || $q.screen.lt.sm}")
            dho-card.full-width(v-bind="dho" :view="view")

    .col-3(v-if="$q.screen.gt.md")
      filter-widget.sticky(
        :debounce="1000"
        :defaultOption="1",
        :optionArray.sync="optionArray",
        :showCircle="false"
        :showToggle="false",
        :sort.sync="sort",
        :textFilter.sync="textFilter",
        :toggle.sync="showApplicants",
        :toggleDefault="false",
        :toggleLabel="'Show daos'"
        :view.sync="view",
        :viewSelectorLabel="'View'",
        filterTitle="Search DHOs"
      )

    div(v-else)
      filter-open-button(@open="mobileFilterOpen = true")
      filter-widget-mobile(
        :debounce="1000"
        :defaultOption="1"
        :optionArray.sync="optionArray"
        :showCircle="false"
        :showToggle="false"
        :showViewSelector="false"
        @close="mobileFilterOpen = false"
        @update:sort="updateSort"
        @update:textFilter="updateDaoName",
        filterTitle="Search DHOs",
        v-show="mobileFilterOpen",
        :style="mobileFilterStyles"
      )

</template>
<style lang="stylus" scoped>
</style>
