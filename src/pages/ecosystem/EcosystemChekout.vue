<script>
import { mapActions, mapGetters } from 'vuex'

const plan = Object.freeze({
  ECOSYSTEM: 'ECOSYSTEM',
  CHILD: 'CHILD'
})

const CHECKOUT_STATE = Object.freeze({
  WAITING: 'WAITING',
  ACTIVATING: 'ACTIVATING',
  ACTIVATED: 'ACTIVATED'
})

export default {
  name: 'page-ecosystem-checkout',
  components: {
    WalletHypha: () => import('~/components/profiles/wallet-hypha.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      CHECKOUT_STATE,
      balances: [],
      plan,
      state: CHECKOUT_STATE.WAITING
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isAdmin']),
    ...mapGetters('dao', ['configs', 'dho', 'selectedDao', 'selectedDaoPlan']),

    loading () { return !this.dho },
    type () { return this.$route.params.type }, // DAO, ECOSYSTEM,
    quantity () { return this.$route.params.quantity || 1 },

    daoId () { return this.$route.params.daoId },
    daoName () { return this.$route.params.daoName },

    selectedPlan () { return this.type ? this.PLANS.find(_ => _.type === this.type) : {} },
    usdPerHypha () { return this.configs && this.configs.usdPerHypha ? this.configs.usdPerHypha : 1 },

    PLANS () {
      if (!this.dho) return []
      return [
        {
          type: plan.ECOSYSTEM,
          name: 'Anchor DAO',
          priceUSD: Number(this.dho.ecosystemPrice.replace(' USD', '')) + Number(this.dho.ecosystemPriceStaked.replace(' USD', '')),
          priceHypha: Math.ceil((Number(this.dho.ecosystemPrice.replace(' USD', '')) + Number(this.dho.ecosystemPriceStaked.replace(' USD', ''))) / this.usdPerHypha),
          stakedUSD: Number(this.dho.ecosystemPriceStaked.replace(' USD', '')),
          stakedHypha: Math.ceil(Number(this.dho.ecosystemPriceStaked.replace(' USD', '')) / this.usdPerHypha)
        },
        {
          type: plan.CHILD,
          name: 'Each Additional DAO',
          priceUSD: Number(this.dho.ecosystemChildPrice.replace(' USD', '')) + Number(this.dho.ecosystemChildPriceStaked.replace(' USD', '')),
          priceHypha: Math.ceil((Number(this.dho.ecosystemChildPrice.replace(' USD', '')) + Number(this.dho.ecosystemChildPriceStaked.replace(' USD', ''))) / this.usdPerHypha),
          stakedUSD: Number(this.dho.ecosystemChildPriceStaked.replace(' USD', '')),
          stakedHypha: Math.ceil(Number(this.dho.ecosystemChildPriceStaked.replace(' USD', '')) / this.usdPerHypha)
        }
      ]
    }

  },

  methods: {
    ...mapActions('dao', ['activateDAOPlan', 'activateEcosystem', 'activateChildDao']),
    ...mapActions('profiles', ['getHyphaBalance']),

    formatMoney (amount) { return amount ? new Intl.NumberFormat().format(parseInt(amount), { style: 'currency' }) : 0 },
    async fetchHyphaBalance (account) {
      if (!account) return
      try {
        const hyphaBalance = await this.getHyphaBalance(account)
        this.balances = [
          { ...hyphaBalance, icon: 'QmQoxvKHRuNknRF4A445vJKAPZvrH5fVTo6N4Zyn1naEKn:png' }
        ]
      } catch (error) {
      }
    },

    async onActivateAnchorDao () {
      try {
        this.state = this.CHECKOUT_STATE.ACTIVATING

        const data = {
          account: this.account,
          daoId: this.selectedDao.docId,
          quantity: `${this.selectedPlan.priceHypha}.00 HYPHA`
        }

        await this.activateEcosystem(data)

        const waitingForActivationInterval = setInterval(() => {
          if (this.selectedDaoPlan.isEcosystemActivated) {
            clearInterval(waitingForActivationInterval)
            this.state = this.CHECKOUT_STATE.ACTIVATED
            this.$router.push({ name: 'ecosystem', params: { refetch: true } })
          }
        }, 300)
      } catch (error) {}
    },

    async onActivateChildDao (account) {
      try {
        this.state = this.CHECKOUT_STATE.ACTIVATING

        const data = {
          account: this.account,
          daoId: this.daoId,
          daoName: this.daoName,
          parentId: this.selectedDao.docId,
          quantity: `${this.selectedPlan.priceHypha}.00 HYPHA`
        }

        await this.activateChildDao(data)

        const waitingForActivationInterval = setInterval(() => {
          if (this.selectedDaoPlan.isEcosystemActivated) {
            clearInterval(waitingForActivationInterval)
            this.state = this.CHECKOUT_STATE.ACTIVATED
            this.$router.push({ name: 'ecosystem', params: { refetch: true } })
          }
        }, 300)
      } catch (error) {}
    }

  },

  created () {
    this.fetchHyphaBalance(this.account)
  },

  watch: {
    account: function (value) { this.fetchHyphaBalance(value) }
  }
}
</script>

<template lang="pug">
.page-ecosystem-checkout(v-if="!loading")
  widget.q-pa-none.full-width(:title="$t('pages.ecosystem.ecosystemchekout.reviewPurchaseDetails')")
    section.row.justify-between.q-mt-xl
      template(v-for="plan in PLANS")
        .col-4.q-pr-xs.relative-position(:style="{ 'opacity': type === plan.type ? '1' : '0.3' }")
          .absolute.z-50(:style="{'top': '-12px', 'right': '30px'}")
            q-chip.q-ma-none.q-pa-none.text-xxs.q-px-sm.q-py-none.text-uppercase.font-lato(color="secondary" size="10px" text-color="white" v-if="type === plan.type") X
              | {{ quantity }}
          .q-pa-md.rounded-border(:style="{'border':'1px solid #25305C'}")
            .row.justify-between
              .text-base.font-lato.text-weight-900 {{ plan.name }}
              .font-lato
                .text-2xl.text-weight-900
                  span.text-xs $
                  span {{ formatMoney(plan.priceUSD) }}
                .text-xs {{ $t('pages.ecosystem.ecosystemchekout.hypha', { '1': formatMoney(plan.priceHypha) }) }}
            .row.q-my-md(:style="{'border':'0.5px solid #84878E', 'opacity': '0.2'}")
            .row.justify-between
              .text-base.text-bold.font-lato {{ $t('pages.ecosystem.ecosystemchekout.tokensStaked') }}
              .font-lato
                .text-lg.text-bold.text-right $
                  | {{ formatMoney(plan.stakedUSD) }}
                .text-xs {{ $t('pages.ecosystem.ecosystemchekout.hypha1', { '1': formatMoney(plan.stakedHypha) }) }}
      .col-4.q-pl-xs
        .q-pa-md.rounded-border.bg-primary.text-white(:style="{'border':'1px solid #25305C'}")
          .row.justify-between
            .text-base.font-lato.text-weight-900 {{ $t('pages.ecosystem.ecosystemchekout.total') }}
            .font-lato
              .text-2xl.text-weight-900
                span.text-xs $
                span {{ formatMoney(selectedPlan.priceUSD) }}
              .text-xs {{ $t('pages.ecosystem.ecosystemchekout.hypha2', { '1': formatMoney(selectedPlan.priceHypha) }) }}
          .row.q-my-md(:style="{'border':'0.5px solid white', 'opacity': '0.3'}")
          .row.justify-between
            .text-base.text-bold {{ $t('pages.ecosystem.ecosystemchekout.tokensStaked1') }}
            div
              .text-lg.text-bold.text-right $
                | {{ formatMoney(selectedPlan.stakedUSD) }}
              .text-xs {{ $t('pages.ecosystem.ecosystemchekout.hypha3', { '1': formatMoney(selectedPlan.stakedHypha) }) }}
  wallet-hypha.q-mt-md(@click="type === plan.ECOSYSTEM ? onActivateAnchorDao() : onActivateChildDao()" v-bind="{ account, balances, isAdmin, quantity: selectedPlan.priceHypha }")
    template(v-slot:cta)
      span {{type === plan.ECOSYSTEM ? 'Activate Anchor DAO' : 'Activate Child DAO'}}

</template>
