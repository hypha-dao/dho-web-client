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
    }
  }
}
</script>

<template lang="pug">
q-card.payment
  .ribbon
    span.text-white.bg-payment PAYMENT
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
    img.icon(src="~assets/icons/payment.svg")
  q-card-section
    .type(@click="showCardFullContent") Payment Receipt
    .title(@click="details = !details") {{ payment.amount }}
  q-card-section.description(v-show="details")
    p {{ payment.memo }}
</template>

<style lang="stylus" scoped>
.payment
  width 300px
  border-radius 1rem
  margin 10px
.payment:hover
  transition transform 0.3s cubic-bezier(0.005, 1.65, 0.325, 1) !important
  transform scale(1.2) translate(0px, 40px) !important
  -moz-transform scale(1.2) translate(0px, 40px)
  -webkit-transform scale(1.2) translate(0px, 40px)
  z-index 100
  box-shadow 0 4px 8px rgba(0,0,0,0.2), 0 5px 3px rgba(0,0,0,0.14), 0 3px 3px 3px rgba(0,0,0,0.12)
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
  width 100%
  max-width 100px
</style>
