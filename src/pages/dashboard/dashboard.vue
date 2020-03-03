<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  data () {
    return {
      dayTime: 'evening',
      nickname: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account'])
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile'])
  },
  async created () {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      this.dayTime = 'morning'
    } else if (hour >= 12 && hour < 17) {
      this.dayTime = 'afternoon'
    }
    const profile = await this.getPublicProfile(this.account)
    if (profile) {
      this.nickname = `, ${profile.publicData.nickname}`
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .dashboard
    .welcome
      strong Good&nbsp;{{ dayTime }}{{ nickname }}.
      |&nbsp;What would you like to do today?
    .row
      .item(@click="$router.push({ path: '/applicants' })")
        .row.flex.q-col-gutter-xl
          .col-xs-12.col-sm-6.column.flex
            .text-h6.title Enroll Registrants
            p Review current registrants and decide which ones you like to endorse as member. New members will be able to use most features of the DHO.
          .col-xs-12.col-sm-6
            q-card.item-card
              .ribbon
                span.text-white.bg-hire APPLYING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/membership.svg")
              q-card-section
                .type Members
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Enroll" color="hire" rounded dense unelevated)
      .item(@click="$router.push({ path: '/proposals/role' })")
        .row.flex.q-col-gutter-xl
          .col-xs-12.col-sm-6.column.flex
            .text-h6.title Create or Endorse Proposals
            p Review current proposals and decide which ones you like to endorse. New proposals are are open for voting for a period of 2 weeks. To create a proposal click on the “+” button.
          .col-xs-12.col-sm-6
            q-card.item-card
              .ribbon
                span.text-white.bg-proposal PROPOSING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/roles.svg")
              q-card-section
                .type Roles
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Endorse" color="proposal" rounded dense unelevated)
      .item(@click="$router.push({ path: '/roles' })" style="display:none;")
        .row.flex.q-col-gutter-xl
          .col-xs-12.col-sm-6.column.flex
            .text-h6.title Enroll Applicants
            p Review current applicants and decide which ones you like to endorse. New applications are are open for enrollment for a period of 2 weeks.
          .col-xs-12.col-sm-6
            q-card.item-card
              .ribbon
                span.text-white.bg-hire APPLYING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/roles.svg")
              q-card-section
                .type Roles
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Enroll" color="hire" rounded dense unelevated)
      .item(@click="$router.push({ path: '/roles' })")
        .row.flex.q-col-gutter-xl
          .col-xs-12.col-sm-6.column.flex
            .text-h6.title Apply for a Role
            p Review open roles and decide if you want to apply (you can always commit to a partial role). Once you are enrolled, claim your salary at the end of a lunar cycle.
          .col-xs-12.col-sm-6
            q-card.item-card
              .ribbon
                span.text-white.bg-hire NOW  HIRING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/roles.svg")
              q-card-section
                .type Roles
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Apply" color="hire" rounded dense unelevated)
      .item(style="display:none;")
        .row.flex.q-col-gutter-xl
          .col-xs-12.col-sm-6.column.flex
            .text-h6.title Claim your Salary
            p Claim your salary at the end of a lunar cycle and receive payouts in Seeds, HVoice, Hypha and HUSD.
          .col-xs-12.col-sm-6
            q-card.item-card
              .ribbon
                span.text-white.bg-assignment NOW PAYING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/assignments.svg")
              q-card-section
                .type Assignments
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Claim" color="assignment" rounded dense unelevated)
</template>

<style lang="stylus" scoped>
.welcome
  font-size 30px
  margin-bottom 20px
.dashboard
  margin-left 37px
.item
  cursor pointer
  width 100%
  max-width 450px
  background rgba(255, 255, 255, 0.4)
  padding 25px
  border-radius 25px
  margin-right 10px
  margin-bottom 10px
  .title
    font-weight 600
  .q-card
    border-radius 1rem
  .item-card
    &:hover
      transition transform 0.3s cubic-bezier(0.005, 1.65, 0.325, 1) !important
      transform scale(1.1) translate(0px, 4px) !important
      -moz-transform scale(1.1) translate(0px, 4px)
      -webkit-transform scale(1.1) translate(0px, 4px)
      z-index 10
      box-shadow 0 4px 8px rgba(0,0,0,0.2), 0 5px 3px rgba(0,0,0,0.14), 0 3px 3px 3px rgba(0,0,0,0.12)
  button
    width 70%
.type
  color $grey-7
  cursor pointer
  text-transform capitalize
  text-align center
  font-weight 800
  font-size 22px
.icon
  margin-top 20px
  width 100%
  max-width 60px
</style>
