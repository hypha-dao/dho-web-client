<script>
import { mapActions, mapMutations } from 'vuex'
import { format } from '~/mixins/format'

export default {
  name: 'payment-card',
  mixins: [format],
  props: {
    payment: { type: Object, required: true }
  },
  data () {
    return {
      loading: true,
      profile: null,
      details: false
    }
  },
  async mounted () {
    this.profile = await this.getPublicProfile(this.payment.recipient)
    this.loading = false
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'paymentView',
        data: this.payment
      })
    },
    getColor (amount) {
      if (amount.includes('HYPHA')) {
        return '#434343'
      } else if (amount.includes('HVOICE')) {
        return '#e69138'
      } else if (amount.includes('SEEDS')) {
        return '#589A46'
      } else if (amount.includes('HUSD')) {
        return '#3d85c6'
      }
    }
  }
}
</script>

<template lang="pug">
q-card.payment
  q-img.owner-avatar(
    v-if="profile && profile.publicData.avatar"
    :src="profile.publicData.avatar"
    @click="$router.push({ path: `/@${payment.recipient}`})"
  )
    q-tooltip {{ (profile.publicData && profile.publicData.name) || payment.recipient }}
  q-avatar.owner-avatar(
    v-else
    size="40px"
    color="accent"
    text-color="white"
    @click="$router.push({ path: `/@${payment.recipient}`})"
  )
    | {{ payment.recipient.slice(0, 2).toUpperCase() }}
    q-tooltip {{ (profile && profile.publicData && profile.publicData.name) || payment.recipient }}
  q-card-section.text-center.q-pb-sm.cursor-pointer(@click="showCardFullContent")
    img.icon(v-if="payment.amount.includes('HYPHA')" src="~assets/icons/hypha.svg")
    img.icon(v-if="payment.amount.includes('HVOICE')" src="~assets/icons/hvoice.svg")
    img.icon(v-if="payment.amount.includes('HUSD')" src="~assets/icons/husd.svg")
    img.icon(v-if="payment.amount.includes('SEEDS')" src="~assets/icons/seeds.png")
  q-card-section
    .type(@click="showCardFullContent") Payment
    .title(v-if="payment.payment_date" @click="details = !details") {{ new Date(payment.payment_date).toDateString() }}
  q-card-section
    q-chip(
      text-color="white"
      :style="{ background: getColor(payment.amount) }"
    ) {{ new Intl.NumberFormat().format(parseInt(payment.amount), { style: 'currency' }) }} {{ payment.amount.split(' ')[1] }}
</template>

<style lang="stylus" scoped>
.payment
  width 240px
  border-radius 1rem
  margin 10px
.payment:hover
  z-index 100
  box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
  .owner-avatar
    z-index 110
.owner-avatar
  cursor pointer
  position absolute
  border-radius 50% !important
  right 10px
  top 10px
  width 40px
.description
  white-space pre-wrap
  max-height 55px
  overflow auto
.type
  cursor pointer
  text-transform capitalize
  text-align center
  font-weight 800
  font-size 28px
.title
  cursor pointer
  text-align center
  font-size 20px
  color $grey-6
  line-height 22px
.icon
  margin-top 20px
  width auto
  max-width 100px
  max-height 100px
</style>
