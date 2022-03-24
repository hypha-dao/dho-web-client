<template lang="pug">
widget.bg-internal-bg.full-width(noPadding).q-pa-xl.treasury-item
  .row.items-center
    .col
      .h-b2.text-heading {{ redemption_id }}
    .col
      .h-b2.text-bold.text-heading {{ requestor }}
    .col
      .row
        q-avatar(size="17px").q-mr-xs
          img(:src="logoAmount(amount_requested)")
        .h-b2.text-heading {{ formatToCurrency(amount_requested) }}
    .col
      .h-b3.text-heading {{ date }}
    .col
      .row
        q-avatar(size="17px").q-mr-xs
          img(:src="logoAmount(amountPaidCurrency, amount_requested)")
        .h-b2.text-heading {{ formatToCurrency(amountPaid) }}
    .col
      .row
        q-avatar(size="17px" v-if="!isNaN(endorse)").q-mr-xs
          img(:src="logoAmount(amountPaidCurrency, amount_requested)")
        .h-b2.text-heading {{ endorse }}
    .col
      template(v-for="treasury of treasurersList")
        q-avatar.over(v-if="!treasury" size="20px" color="disabled" icon="far fa-user" text-color="white")
        profile-picture.over.display(v-else :username="treasury.creator" size="20px" ref="profilePic" tooltip)
    .col
      slot(name="actions" :id="redemption_id" v-if="actions")
          q-btn(round unelevated class="round-circle" icon="fas fa-eye" color="primary" text-color="white" size="md" :ripple="false")
</template>

<script>
export default {
  name: 'treasury-items',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue')
  },
  props: {
    amountPaid: {
      type: Number,
      default: 0
    },
    amountPaidCurrency: {
      type: String
    },
    amount_paid: {
      type: String
    },
    amount_requested: {
      type: String
    },
    attestations: {
      type: Array,
      default: () => []
    },
    payments: {
      type: Array
    },
    redemption_id: {
      type: Number
    },
    requested_date: {
      type: String
    },
    requestor: {
      type: String
    },
    updated_date: {
      type: String
    },
    actions: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatToCurrency (amount) {
      return new Intl.NumberFormat().format(parseInt(amount), { style: 'currency' })
    },
    logoAmount (amount, requested = '') {
      if (amount.includes('HYPHA') || requested.includes('HYPHA')) return require('~/assets/icons/hypha.svg')
      if (amount.includes('HVOICE') || requested.includes('HVOICE')) return require('~/assets/icons/hvoice.svg')
      if (amount.includes('USD') || requested.includes('USD')) return require('~/assets/icons/husd.svg')
      if (amount.includes('SEEDS') || requested.includes('SEEDS')) return require('~/assets/icons/seeds.png')
      return ''
    }
  },
  computed: {
    treasurersList () {
      if (this.payments.length === 0) return new Array(5)
      if (this.payments.length === 5) return this.payments
      if (this.payments.length > 5) return this.payments.slice(-5)
      const length = this.payments.length
      const array = new Array(5 - length)

      return [...array, ...this.payments]
    },
    date () {
      return new Date(this.requested_date.slice(0, -4) + 'Z').toLocaleDateString()
    },
    endorse () {
      if (this.amountPaid === 0) return 'open'
      if (this.amountPaid > 0 && (this.amountPaid < parseFloat(this.amount_requested))) return 'pending'
      if (this.amountPaid === parseFloat(this.amount_requested)) return this.formatToCurrency(this.amountPaid)
      return undefined
    }
  }
}
</script>

<style lang="stylus" scope>
.h-b3,
.h-b2
  font-family: Lato, sans-serif !important
.treasury-item
  &:nth-child(n)
    margin-top: 10px
  &:nth-child(1)
    margin-top: 0px
.over
  outline: $internal-bg solid 2px
  &:nth-child(n)
    margin-left: -5px
  &:nth-child(1)
    margin-left: 0px
.display
  display inline-block !important
</style>
