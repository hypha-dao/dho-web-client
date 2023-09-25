<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'
import { ORIGIN, PLAN_TYPE, PAYMENT_INTERVAL } from '~/const'
// import formatPlan from '~/utils/format-plan'

const STATES = Object.freeze({
  WAITING: 'WAITING',
  UPDATING_PLAIN: 'UPDATING_PLAIN',
  CREATING_SESSION: 'CREATING_SESSION'
})

const PLANS_QUERY = `
  getStripePrices {
    id
    type
    productName
    recurringInterval
    planType
    coreMembersCount
    amount
    communityMembersCount    
  }
`

export default {
  name: 'settings-plans-billing',
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    form: {
      type: Object,
      default: () => { }
    },

    isAdmin: {
      type: Boolean,
      default: false
    }
  },

  apollo: {
    _plans: {
      query: gql`query PLANS{ ${PLANS_QUERY} }`,
      update: data => data.getStripePrices,
      fetchPolicy: 'no-cache'
    }

  },

  data() {
    return {
      STATES,
      state: STATES.WAITING,

      PAYMENT_INTERVAL,
      paymentInterval: PAYMENT_INTERVAL.YEAR,

      PLAN_TYPE,
      planType: PLAN_TYPE.SAAS
    }
  },

  methods: {
    async _createCheckoutSession(id) {
      this.state = STATES.CREATING_SESSION

      const res = await this.$apollo.mutate({
        mutation: gql`
          mutation createSession(
            $daoId: String!
            $daoName: String!
            $daoType: String!
            $daoUrl: String!
            $priceId: String!
            $redirectDomain: String!
            $successUrl: String!
          ) {
            createCheckoutSession(
              daoId: $daoId
              daoName: $daoName
              daoType: $daoType
              daoUrl: $daoUrl
              priceId: $priceId
              redirectDomain: $redirectDomain
              successUrl: $successUrl
            ) {
              id
              url
            }
          }
        `,
        variables: {
          daoId: this.selectedDao.docId,
          daoName: this.selectedDao.title,
          daoType: this.planType,
          daoUrl: this.daoSettings.url,
          priceId: id,
          redirectDomain: ORIGIN,
          successUrl: `/${this.daoSettings.url}/configuration?tab=PLANS_AND_BILLING`
        }
      })

      if (res?.data?.createCheckoutSession?.url) {
        window.open(res.data.createCheckoutSession.url, '_self')
      }
    },

    async _updateSubscription(id) {
      this.state = STATES.CREATING_SESSION

      const res = await this.$apollo.mutate({
        mutation: gql`
          mutation updateSubscription(
            $daoType: String!
            $priceId: String!
            $subscriptionId: String!
            $subscriptionItemId: String!
          ) {
            updateSubscription(
              daoType: $daoType
              priceId: $priceId
              subscriptionId: $subscriptionId
              subscriptionItemId: $subscriptionItemId
            ) {
              id: planId
            }
        }
        `,
        variables: {
          daoType: this.planType,
          priceId: id,
          subscriptionId: this.selectedDaoPlan.subscriptionId,
          subscriptionItemId: this.selectedDaoPlan.subscriptionItemId
        }
      })

      if (res) {
        this.state = STATES.WAITING
        this.$apollo.queries.activePlan.refetch()
      }
    },

    onPlanDialogClose() {
      this.state = STATES.WAITING
      this.planType = PLAN_TYPE.SAAS
      this.paymentInterval = PAYMENT_INTERVAL.YEAR
    },

    switchPlanType() {
      if (this.planType === PLAN_TYPE.SAAS) {
        this.planType = PLAN_TYPE.EAAS
        this.paymentInterval = null
      } else {
        this.planType = PLAN_TYPE.SAAS
        this.paymentInterval = PAYMENT_INTERVAL.YEAR
      }
    },

    formatMoney(amount) { return amount ? new Intl.NumberFormat().format(parseInt(amount), { style: 'currency' }) : 0 }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'selectedDaoPlan']),

    isFreePlan() { return !this.selectedDaoPlan?.id },
    isPlanModalOpen() { return [STATES.UPDATING_PLAIN, STATES.CREATING_SESSION].includes(this.state) },

    plans() {
      return this._plans
        .map(_ => ({
          ..._,
          id: _.id,
          name: _.productName.toLowerCase(),
          amountUSD: _.amount / 100 / (_.recurringInterval === PAYMENT_INTERVAL.YEAR ? 12 : 1),
          interval: _.recurringInterval
        }))
        .filter(_ => _.planType === this.planType)
        .filter(_ => _.interval === this.paymentInterval)
        .sort((a, b) => a.amountUSD - b.amountUSD)
    }

  }

}
</script>

<template lang="pug">
.tab
  q-dialog(:value="isPlanModalOpen" @before-hide="onPlanDialogClose" full-width="full-width")
    widget.relative.wrapper(
      v-if="state === STATES.UPDATING_PLAIN"
      :title="$t('configuration.settings-plans-billing.plan.modal.title')"
      titleImage='/svg/paperplane.svg'
      bar
    ).q-pa-none
      template(v-slot:header)
        q-btn.q-px-xl.rounded-border.text-bold(
          :color="planType === PLAN_TYPE.EAAS ? 'primary' : 'secondary'"
          :label="planType === PLAN_TYPE.EAAS ? 'Single' : 'Ecosystem'"
          @click="switchPlanType"
          no-caps
          rounded
          unelevated
        )

      p.q-pa-none.q-ma-none.text-sm.text-h-gray.leading-loose.q-mt-sm {{ $t('configuration.settings-plans-billing.plan.modal.description') }}

      .hr.q-my-md

      section
        nav.full-width.row.justify-center.items-center(v-if="planType === PLAN_TYPE.SAAS")
          q-btn.q-px-xl.rounded-border.text-bold(
            @click="paymentInterval = PAYMENT_INTERVAL.MONTH"
            :color="paymentInterval === PAYMENT_INTERVAL.MONTH ? 'primary' : 'secondary'"
            no-caps
            rounded
            unelevated
            label="Monthly"
          )
          q-btn.q-px-xl.rounded-border.text-bold(
            @click="paymentInterval = PAYMENT_INTERVAL.YEAR"
            :color="paymentInterval === PAYMENT_INTERVAL.YEAR ? 'primary' : 'secondary'"
            no-caps
            rounded
            unelevated
            label="Yearly"
          )

      .row.q-mt-xl
        template(v-for='(plan,index) in plans')
          .col-3(:class="{'q-pr-sm': index !== plans.length - 1}")
            widget(bar shadow)
              header.row.justify-between
                div
                  .text-xl.text-weight-600.text-primary {{  $t(`plans.${plan.name}`) }}
                  p.q-pa-none.q-ma-none.text-3xl.text-primary.text-bold ${{ formatMoney(plan.amountUSD) }}
                div(v-if="selectedDaoPlan?.id === plan.id")
                  q-chip(dense color="positive" text-color="white")
                    span.text-uppercase.text-xxs.text-bold.q-px-xxs {{  $t(`statuses.active`) }}
              .hr.q-mt-md.q-mb-xs

              footer
                div.row.justify-between
                  p.q-pa-none.q-ma-none.text-sm.text-h-gray.leading-loose Core Members
                  p.q-pa-none.q-ma-none.text-sm.text-h-gray.leading-loose {{ plan.coreMembersCount }}
                //- TODO: Return after beta
                //- div.row.justify-between.q-mt-xs
                //-   p.q-pa-none.q-ma-none.text-sm.text-h-gray.leading-loose Community Members
                //-   p.q-pa-none.q-ma-none.text-sm.text-h-gray.leading-loose {{ plan.communityMembersCount }}

              .hr.q-mt-md.q-mb-xs

              nav.q-mt-xl.full-width.row.justify-end
                q-btn.q-px-xl.rounded-border.text-bold.q-ml-xs(
                  :disable="selectedDaoPlan?.id === plan.id"
                  :label="$t('configuration.settings-plans-billing.plan.modal.cta')"
                  @click="isFreePlan ? _createCheckoutSession(plan.id) : _updateSubscription(plan.id)"
                  color="secondary"
                  no-caps
                  rounded
                  unelevated
                )
    loading-spinner(v-else color="primary" size="40px")

  .row
    .col-12.col-md-6(:class="{ 'q-pr-sm': $q.screen.gt.md, 'q-mt-md': $q.screen.lt.md }")
      widget(:title="$t('configuration.settings-plans-billing.plan.title')" titleImage='/svg/paperplane.svg' bar).q-pa-none
        p(v-if="isFreePlan").q-pa-none.q-ma-none.text-sm.text-h-gray.leading-loose.q-mt-sm {{ $t('configuration.settings-plans-billing.plan.description.free') }}

        widget.q-mt-xl(bar shadow)
          header.row.justify-between
            div
              .text-xl.text-weight-600.text-primary {{  $t(`plans.${selectedDaoPlan.name}`) }}
              p.q-pa-none.q-ma-none.text-3xl.text-primary.text-bold ${{ formatMoney(selectedDaoPlan.amountUSD) }}
                //- TODO: Return after beta
                //- span.q-ml-xxs.text-sm.text-weight-500 / {{ $('periods.month') }}
            div
              q-chip(dense color="positive" text-color="white")
                span.text-uppercase.text-xxs.text-bold.q-px-xxs {{  $t(`statuses.${selectedDaoPlan.status}`) }}

          .hr.q-mt-md.q-mb-xs

          footer
            div.row.justify-between
              p.q-pa-none.q-ma-none.text-sm.text-h-gray.leading-loose Core Members
              p.q-pa-none.q-ma-none.text-sm.text-h-gray.leading-loose {{ selectedDaoPlan.currentCoreMembersCount }} / {{ selectedDaoPlan.coreMembersCount }}
            //- TODO: Return after beta
            //- div.row.justify-between.q-mt-xs
            //-   p.q-pa-none.q-ma-none.text-sm.text-h-gray.leading-loose Community Members
            //-   p.q-pa-none.q-ma-none.text-sm.text-h-gray.leading-loose {{ selectedDaoPlan.communityMembersCount }}

        nav.q-mt-xl.full-width.row.justify-end
          q-btn.q-px-xl.rounded-border.text-bold.q-ml-xs(
            :disable="!isAdmin"
            :label="$t('configuration.settings-plans-billing.plan.cta')"
            @click="state = STATES.UPDATING_PLAIN"
            color="secondary"
            no-caps
            rounded
            unelevated
          )

    .col-12.col-md-6(:class="{ 'q-pr-sm': $q.screen.gt.md, 'q-mt-md': $q.screen.lt.md }")
      widget(:title="$t('configuration.settings-plans-billing.history.title')" titleImage='/svg/briefcase.svg' bar).q-pa-none
        p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('configuration.settings-plans-billing.history.description') }}

</template>

<style lang="stylus" scoped>
</style>
