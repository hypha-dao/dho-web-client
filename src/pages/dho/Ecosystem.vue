<script>
import { mapActions, mapGetters } from 'vuex'
import { dateToStringShort } from '~/utils/TimeUtils.js'
import ipfsy from '~/utils/ipfsy'

export default {
  name: 'page-ecosystem',
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    CreateDhoWidget: () => import('~/components/organization/create-dho-widget.vue'),
    DhoCard: () => import('~/components/navigation/dho-card.vue'),
    EcosystemInfo: () => import('~/components/ecosystem/ecosystem-info.vue'),
    FilterOpenButton: () => import('~/components/filters/filter-open-button.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    FilterWidgetMobile: () => import('~/components/filters/filter-widget-mobile.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      mobileFilterOpen: false,

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
        'Alphabetically',
        'Creation date ascending',
        'Creation date descending'
      ],
      showApplicants: false,
      mobileFilterStyles: {
        width: this.$q.screen.md ? '400px' : '100%',
        right: this.$q.screen.md ? '0' : '0',
        left: this.$q.screen.md ? 'auto' : '0'
      },

      filters: [
        {
          label: 'All',
          enabled: true,
          filter: () => true
        },
        {
          label: 'Generic Contributions',
          enabled: false,
          filter: (p) => p.__typename === 'Payout'
        },
        {
          label: 'Role Assignments',
          enabled: false,
          filter: (p) => p.__typename === 'Assignment' || p.__typename === 'Edit'
        },
        {
          label: 'Role Archetypes',
          enabled: false,
          filter: (p) => p.__typename === 'Role'
        },
        {
          label: 'Badge Types',
          enabled: false,
          filter: (p) => p.__typename === 'Badge'
        },
        {
          label: 'Badge Assignments',
          enabled: false,
          filter: (p) => p.__typename === 'Assignbadge'
        },
        {
          label: 'Suspension',
          enabled: false,
          filter: (p) => p.__typename === 'Suspend'
        }
      ]

    }
  },

  apollo: {
    ecosystem: {
      query () { return require('~/query/ecosystem/ecosystem-info.gql') },
      update: data => {
        const settings = data.queryDao[0].settings[0]

        return {
          name: settings?.ecosystem_name_s,
          logo: settings?.ecosystem_logo_s,
          domain: settings?.ecosystem_domain_s,
          purpose: settings?.ecosystem_purpose_s
        }
      },
      variables () { return { daoId: this.selectedDao.docId } },
      skip () { return !this.selectedDao?.docId }
    },

    dhos: {
      query () { return require('~/query/ecosystem/ecosystem-child-list.gql') },
      update: data => {
        if (!data.getDao) return []

        return [
          ...data?.getDao?.childdraft.map(_ => ({ ..._, status: 'INACTIVE' })),
          ...data?.getDao?.anchorchild.map(_ => ({ ..._, status: 'ACTIVE' }))
        ].map((dao) => {
          const [date, year] = dateToStringShort(dao.createdDate).split(',')

          return {
            id: dao.docId,
            name: dao.settings[0].settings_daoName_n,
            title: dao.settings[0].settings_daoTitle_s,
            description: dao.settings[0].settings_daoDescription_s,

            status: dao.status,
            created: { date, year },

            logo: dao.settings[0].settings_logo_s,
            url: dao.settings[0].settings_daoUrl_s,

            membersCount: dao.memberAggregate ? dao.memberAggregate.count : 0,
            foundedBy: dao.settings[0].settings_onboarderAccount_n

          }
        })
      },
      variables () { return { daoId: this.selectedDao.docId } },
      skip () { return !this.selectedDao?.docId },
      pollInterval: 1000 // THIS IS JUST TEMPORARY UNTIL GRAPHQL SUBSCRIPTION IS READY
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isAdmin']),
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'selectedDaoPlan', 'isHypha']),

    activeChildrenCount () {
      const anchor = this.selectedDaoPlan.isEcosystemActivated ? 1 : 0
      const children = this.dhos ? this.dhos.filter(_ => _.status === 'ACTIVE').length : 0
      return anchor + children
    },

    inactiveChildrenCount () {
      const anchor = this.selectedDaoPlan.isEcosystemActivated ? 0 : 1
      const children = this.dhos ? this.dhos.filter(_ => _.status === 'INACTIVE').length : 0
      return anchor + children
    },

    order () {
      if (this.optionArray[1] === this.sort) return { asc: 'createdDate' }
      if (this.optionArray[2] === this.sort) return { desc: 'createdDate' }
      if (this.optionArray[3] === this.sort) return { asc: 'details_daoName_n' }

      return null
    },

    isBasicInfoAdded () { return this.ecosystem ? this.ecosystem.name : false }
  },

  methods: {
    ...mapActions('dao', ['updateEcosystemSettings']),

    async _updateEcosystemSettings (data) {
      try {
        await this.updateEcosystemSettings({ docId: this.selectedDao.docId, data })

        const ecosystemRefetchInterval = setInterval(() => {
          this.$apollo.queries.ecosystem.refetch()
          if (
            this.ecosystem.name === data.name &&
            this.ecosystem.logo === data.logo &&
            this.ecosystem.domain === data.domain &&
            this.ecosystem.purpose === data.purpose
          ) {
            clearInterval(ecosystemRefetchInterval)
          }
        }, 300)
      } catch (error) {}
    },

    ipfsy,

    onCreateDAO () {
      this.$router.push({ name: 'dao-launcher', query: { parentId: this.selectedDao.docId } })
    },

    async onLoad (index, done) {
      // if (this.more) {
      //   // if (this.offset === 0) {
      //   //   this.offset += 1
      //   // } else {
      //   //   this.offset += this.first
      //   // }

      //   const fetchMore = {
      //     variables: {
      //       filter: this.textFilter ? { details_daoName_n: { regexp: `/.*${this.textFilter}.*/i` } } : null,
      //       order: this.order,
      //       offset: this.offset,
      //       first: this.first
      //     },
      //     updateQuery: (prev, { fetchMoreResult }) => {
      //       if (fetchMoreResult.queryDao.length === 0) this.more = false
      //       if (this.restart) {
      //         this.restart = false
      //         return fetchMoreResult
      //       }
      //       return {
      //         queryDao: [
      //           ...prev.queryDao,
      //           ...fetchMoreResult.queryDao
      //         ]
      //       }
      //     }
      //   }
      //   try {
      //     await this.$apollo.queries.dhos.fetchMore(fetchMore)
      //     this.offset += this.first
      //   } catch (err) {
      //   }
      //   done()
      // }
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
q-page.page-ecosystem
  ecosystem-info(v-bind="{ data: ecosystem, isAdmin }" @save="_updateEcosystemSettings")

  .row.bg-secondary.text-white.rounded-full.q-px-xl.q-py-xs.q-my-md(:style="{'opacity': isBasicInfoAdded ? '1' : '0.3'}")
    .row.full-width.items-center
        .q-pr-xl
          .text-lg.text-white.text-bold {{ activeChildrenCount }} Active
            span.q-pl-xxs.text-weight-500 DAOs
        .q-px-xl(:style="{'border-left': '1px solid rgba(255, 255, 255, .2)'}")
          .text-lg.text-white.text-bold {{ inactiveChildrenCount }} Inactive
            span.q-pl-xxs.text-weight-500 DAOs

  .row
    .col-sm-12.col-md-12.col-lg-9.q-pr-md(ref="scrollContainer")
      widget.full-width(:class="{'no-click': !isBasicInfoAdded }" :style="{'opacity': isBasicInfoAdded ? '1' : '0.3'}")
        .row
          .col-9.q-pr-xl.row.items-center
            .col-auto
              q-avatar(size="160px" color='primary')
                img(:src="ipfsy(selectedDao.logo)" v-if="selectedDao.logo").object-cover
                span(v-if="!logo") {{selectedDao && selectedDao.title && selectedDao.title[0].toUpperCase()}}
            .col.q-pl-md
              q-chip.q-ma-none.q-pa-none.text-xxs.q-px-xs.q-py-none.text-uppercase(:color="selectedDaoPlan.isEcosystemActivated ? 'positive' : 'negative'" text-color="white" size='10px') {{ selectedDaoPlan.isEcosystemActivated ? 'Active ' : 'Inactive' }}
              .text-2xl.text-weight-900.text-primary.leading-none.q-mt-sm {{ selectedDao.title }}
              .text-base.text-weight-900.text-secondary.leading-normal {{ ecosystem && ecosystem.name ? ecosystem.name : 'Ecosystem not defined' }}
              .text-xs.text-h-gray.leading-loose.q-mt-xs {{ selectedDao && selectedDao.purpose ? selectedDao.description :  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,'}}
          .col
            .column.justify-between.full-width.full-height
              div
                .row.items-center
                  q-icon.q-py-xs(color="primary" name="fas fa-calendar-alt")
                  //- .text-xs.text-h-gray.q-px-xs Activation date
                  .text-xs.text-h-gray.q-px-xs {{ selectedDao.createdDate }}
                  //- {{selectedDao.foundedBy}}
                .row.items-center
                  q-icon.q-py-xs(color="grey-7" name="fas fa-users")
                  .text-xs.text-h-gray.q-px-xs 56 Core members
                .row.items-center
                  q-icon.q-py-xs(color="grey-7" name="fas fa-users")
                  .text-xs.text-h-gray.q-px-xs 0 Community members
              div(v-if="!selectedDaoPlan.isEcosystemActivated")
                router-link(:to="{ name: 'ecosystem-checkout', params: { type:'ECOSYSTEM', quantity: 1 } }")
                  q-btn.q-px-xl.rounded-border.text-bold.full-width(
                    :disable="!isAdmin"
                    color="primary"
                    label="Activate"
                    no-caps
                    rounded
                    unelevated
                  )
                  q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings
              div(v-else)
                .text-xs.text-weight-900.text-secondary.q-mt-xxs Founded by:
                p {{selectedDao.foundedBy}}

      q-infinite-scroll.q-mt-md(@load="onLoad" :offset="250" :scroll-target="$refs.scrollContainer" ref="scroll")
        .row.q-col-gutter-md(:class="{'no-click': !isBasicInfoAdded }" :style="{'opacity':isBasicInfoAdded ? '1' : '0.3'}")
          .col-4(v-for="(dho,index) in dhos" :key="dho.name" :class="{ 'col-6': $q.screen.lt.lg, 'full-width':  view === 'list' || $q.screen.lt.sm}")
            dho-card.full-width(
              v-bind="dho"
              :bubble="ecosystem.logo"
              :subtitle="ecosystem.name"
              view="card"
            )
              template(v-slot:header)
                header.row.justify-center.items-center
                  q-chip.q-ma-none.q-pa-none.text-xxs.q-px-xs.q-py-none.text-uppercase(:color="dho.status ==='ACTIVE' ? 'positive' : 'negative'" text-color="white" size='10px') {{ dho.status ==='ACTIVE' ? 'Active' : 'Inactive' }}
              template(v-slot:footer)
                footer.row.justify-center.items-center(v-if="dho.status ==='INACTIVE'")
                  router-link.full-width(:to="{ name: 'ecosystem-checkout', params: { type:'CHILD', quantity: 1, daoId: dho.id, daoName: dho.name } }")
                    q-btn.q-px-xl.rounded-border.text-bold.full-width(
                      color="primary"
                      label="Activate"
                      no-caps
                      rounded
                      unelevated
                    )
                footer.full-width.row.items-center(v-else)
                  .col-6.text-center
                    q-icon.q-pb-xs(color="grey-7" name="fas fa-calendar-alt")
                    .text-grey-7.h-b2.q-pl-xs.q-pr-xxs {{ dho.created.date }},
                    .text-grey-7.h-b2 {{ dho.created.year }}
                  .col-6.text-center(:style="{'border-left': '1px solid #CBCDD1'}")
                    q-icon.q-pb-xs(color="grey-7" name="fas fa-users")
                    .text-grey-7.h-b2.q-px-xs {{ dho.membersCount }}
                    .text-grey-7.h-b2 Members

          .col-4(:class="{ 'col-6': $q.screen.lt.lg }")
            dho-card.full-width(v-bind="{title:'Create new DAO', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.', logo: '/svg/create-new-dao.svg'}" view="card")
              template(v-slot:footer)
                footer.row.justify-center.items-center
                  q-btn.q-px-xl.rounded-border.text-bold.full-width(
                    :disabled="!selectedDaoPlan.isEcosystemActivated || !isAdmin"
                    @click="onCreateDAO"
                    color="primary"
                    label="Create New DAO"
                    no-caps
                    rounded
                    unelevated
                  )
                  q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDaoPlan.isEcosystemActivated") You need to activate anchor DAO before you can create child DAOs.
                  q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-else-if="!isAdmin") Only DAO admins can change the settings

    .col-3(v-if="$q.screen.gt.md" :class="{'no-click': !isBasicInfoAdded }" :style="{'opacity': isBasicInfoAdded ? '1' : '0.3'}")
      .sticky
        filter-widget(
          :chipsFiltersLabel="'Proposal types'",
          :circle.sync="circle",
          :circleArray.sync="circleArray"
          :debounce="1000"
          :defaultOption="1",
          :filters.sync="filters"
          :optionArray.sync="optionArray",
          :showCircle="false",
          :showToggle="true"
          :sort.sync="sort",
          :textFilter.sync="textFilter",
          :toggle.sync="showApplicants",
          :toggleDefault="true"
          :toggleLabel="'Funds Needed'"
          :view.sync="view",
          :viewSelectorLabel="'View'",
          filterTitle="Search DHOs"
        )
        create-dho-widget(@create="onCreateDAO")

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
