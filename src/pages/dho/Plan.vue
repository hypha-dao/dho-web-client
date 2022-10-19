<script>
import { mapActions, mapGetters } from 'vuex'

const duration = {
  data () {
    return {
      durationOptions: [
        // { label: '12h', value: 43200 },
        // { label: '1d', value: 86400 },
        // { label: '3d', value: 259200 },
        // { label: '1w', value: 604800 },
        // { label: '2w', value: 1209600 },
        { label: '1m', value: 2628000 }, // TODO: This depeneds on month on selection
        { label: '3m', value: 2628000 }, // TODO: This depeneds on month on selection
        { label: '9m', value: 2628000 } // TODO: This depeneds on month on selection
      ]
    }
  },

  methods: {
    isCustomDuration (duration) { return !this.durationOptions.map((_) => _.value).includes(duration) }
  },

  computed: {
    // isCustomPeriodDuration () { return this.isCustomDuration(this.form.periodDurationSec) },
    // isCustomVoiceTokenDecay () { return this.isCustomDuration(this.form.voiceTokenDecayPeriod) },
    isCustomVotingDuration () { return this.isCustomDuration(this.form.votingDurationSec) }
  }
}

export default {
  name: 'page-plan',
  mixins: [duration],
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue'),
    CustomPeriodInput: () => import('~/components/form/custom-period-input.vue'),
    TreasuryToken: () => import('~/components/organization/treasury-token.vue'),
    Widget: () => import('~/components/common/widget.vue'),

    ChipPlan: () => import('~/components/plan/chip-plan.vue')
  },

  apollo: {
    pageQuery: {
      query: require('~/query/_pages/plan-page-query.gql'),
      update: data => data
    }
  },

  data () {
    return {
      balances: [],

      form: {
        plan: null,
        period: null,
        votingDurationSec: 43200
      },

      state: 'ACTIVE'// ACTIVE, EXPIRING, BILLING, SAVING,

    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('dao', ['selectedDao', 'selectedDaoPlan', 'isFreePlan']),

    canActivate () { return this.form.plan !== null && this.form.period !== null },

    PLANS () {
      return !this.pageQuery
        ? []
        : this.pageQuery.plans.map(_ => ({
          id: _.id,
          key: _.id,
          name: _.name,
          title: `${_.name} plan`,
          maxMembers: _.maxMemberCount,
          priceHypha: parseFloat(_.price.split(' ')[0]).toFixed(2)
        }))
    },

    BILLING () {
      return !this.pageQuery
        ? []
        : this.pageQuery.offers.map(_ => ({
          id: _.id,
          key: _.id,
          title: _.name,
          periods: _.periodCount,
          discountPerc: _.discountPerc / 10000
        }))
    },

    selectedPlan () {
      if (!this.PLANS) return {}
      return this.PLANS.find(_ => _.id === this.form.plan)
    },

    selectedBilling () {
      if (!this.BILLING) return {}
      return this.BILLING.find(_ => _.id === this.form.period)
    },

    loading () { return this.$apollo.queries.pageQuery.loading }

  },

  methods: {
    ...mapActions('dao', ['activateDAOPlan']),
    ...mapActions('profiles', ['getHyphaBalance']),

    async fetchHyphaBalance (account) {
      try {
        const hyphaBalance = await this.getHyphaBalance(account)
        this.balances = [
          { ...hyphaBalance, icon: 'QmQoxvKHRuNknRF4A445vJKAPZvrH5fVTo6N4Zyn1naEKn:png' }
        ]
      } catch (error) {
      }
    },

    async activatePlan () {
      const data = {
        account: this.account,
        quantity: `${parseFloat((this.selectedPlan.priceHypha - (this.selectedPlan.priceHypha * this.selectedBilling.discountPerc)) * this.selectedBilling.periods).toFixed(2)} HYPHA`,
        daoId: this.selectedDao.docId,
        planId: this.selectedPlan.id,
        offerId: this.selectedBilling.id,
        periods: this.selectedBilling.periods
      }

      try {
        await this.activateDAOPlan(data)
        this.state = 'ACTIVE'
        this.period = null
      } catch (error) {

      }
    }

  },

  created () {
    this.fetchHyphaBalance(this.account)
    this.form.plan = this.pageQuery.plans.find(_ => _.name === this.selectedDaoPlan.name).id
    if (this.selectedDaoPlan.isExpiring) {
      this.state = 'BILLING'
    }
  },

  watch: {
    'form.plan': function (newVal, oldVal) {
      if (oldVal === null) return
      this.state = 'BILLING'
    },
    account: function (value) { this.fetchHyphaBalance(value) },
    pageQuery: function (value) {
      this.form.plan = this.pageQuery.plans.find(_ => _.name === this.selectedDaoPlan.name).id
    }
  }
}

</script>

<template lang="pug">
.page-plan(v-if="!loading")
  chip-plan.q-my-sm(v-if="!$q.screen.gt.sm")
  widget(title="Select your plan").q-pa-none.full-width
    //- p.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    .absolute.z-50(:style="{'top': '-60px', 'right': '-30px'}" v-if="$q.screen.gt.sm")
      chip-plan(:plan="selectedDaoPlan.name" :daysLeft="selectedDaoPlan.daysLeft" :color="selectedDaoPlan.isExpiring ? 'negative' : 'secondary'")
        template(v-slot:cta)
          q-btn.h-h4.text-white(v-if="!selectedDaoPlan.isExpiring" :label=" isFreePlan ? 'Upgrade' : 'Extend'" flat no-caps padding="0px" unelevated @click="state = 'BILLING'")
          div.h-h4.text-white.row.items-center.q-gutter-x-sm(v-if="selectedDaoPlan.isExpiring")
            q-icon(name="fas fa-exclamation-triangle" size='sm')
            span Action Required

    .row.items-stretch.q-col-gutter-xs.q-mt-sm
      template(v-for="opts in PLANS")
        .col-12.col-sm-12.col-md-6.col-lg-3
          button-radio.full-height(
            :selected="opts.key === form.plan"
            @click="form.plan = opts.key"
            v-bind="opts"
          )
            template(v-slot:subtitle)
              div.text-weight-900
                span.text-xs $
                span {{opts.priceHypha}}
            template(v-slot:description)
              .row.justify-between.full-width
                .text-ellipsis.text-xs {{opts.maxMembers }} members max
                .text-ellipsis.text-xs {{opts.priceHypha === 0 ? 'Free forever' : `${opts.priceHypha} HYPHA`}}

    .q-mt-xl(v-show="state === 'BILLING' && selectedPlan.name !== 'Founders'")
      .h-h4 Billing Period
      .row.items-stretch.q-col-gutter-xs.q-mt-sm
        template(v-for="(opts, index) in BILLING")
          .col-12.col-sm-12.col-md-6.col-lg-3
            button-radio.full-height(
              :selected="opts.id === form.period"
              @click="form.period = opts.id"
              v-bind="opts"
            )
              .absolute.z-50(:style="{'top': '-12px', 'right': '0px'}" v-if="opts.discountPerc > 0")
                q-chip.q-ma-none.q-px-sm.q-py-sm.text-weight-900(color='secondary' text-color="white" size='10px') {{opts.discountPerc * 100}}% discount!
              template(v-slot:subtitle)
                div.text-weight-900
                  span.text-xs $
                  span {{selectedPlan && parseFloat((selectedPlan.priceHypha - (selectedPlan.priceHypha * opts.discountPerc)) * opts.periods).toFixed(2)}}
              template(v-slot:description)
                .row.justify-end.full-width
                  .text-ellipsis.text-xs {{opts.priceHypha === 0 ? 'Free forever' : `${parseFloat((selectedPlan.priceHypha - (selectedPlan.priceHypha * opts.discountPerc)) * opts.periods).toFixed(2)} HYPHA`}}

  widget(:bar='true' noPadding).q-pa-none.full-width.q-mt-md
    .row.justify-between.items-center
      .col-12.q-px-xl(:class="{ 'q-py-xl': !$q.screen.gt.md}")
        .row.items-center(:class="{ 'full-width': !$q.screen.gt.md}")
          .col-12.col-sm-12.col-md-12.col-lg-3
            .h-h4 Available Balance
          .col-12.col-sm-12.col-md-12.col-lg-3(:class="{ 'q-mt-xl': !$q.screen.gt.md}")
            .col.full-width(v-for="token in balances" :key="token.tokenName")
              treasury-token(v-bind="token")
          .col-12.col-sm-12.col-md-12.col-lg-6.row.justify-end
            nav.col-md-12.col-lg-8.q-my-xl.row.q-col-gutter-sm
              .col-12.col-sm-12.col-md-12.col-lg-6
                a(href="https://tokensale.hypha.earth/" target="_tab").full-width
                  q-btn.q-px-xl.rounded-border.text-bold.q-mr-xs.full-width(
                    color="primary"
                    label="Buy Hypha Token"
                    no-caps
                    rounded
                    unelevated
                  )
              .col-12.col-sm-12.col-md-12.col-lg-6
                q-btn.q-px-xl.rounded-border.text-bold.q-ml-xs.full-width(
                  :disable="!canActivate"
                  @click="activatePlan"
                  color="secondary"
                  label="Activate plan"
                  no-caps
                  rounded
                  unelevated
                )

</template>

<style lang="stylus" scoped>
.duration-button
  font-size: 13px;
  width: 40px
  height: 40px;

.rounded-full
  border-radius 25px
.rounded-border
  :first-child
    border-radius 15px

</style>
