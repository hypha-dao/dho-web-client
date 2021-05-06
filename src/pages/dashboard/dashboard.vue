<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'dashboard',

  data () {
    return {
      dayTime: 'evening',
      nickname: null
    }
  },

  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account', 'isMember'])
  },

  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType', 'setBreadcrumbs']),

    displayForm (type) {
      this.setShowRightSidebar(true)
      this.setRightSidebarType(`${type}Form`)
    }
  },

  async created () {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      this.dayTime = 'morning'
    } else if (hour >= 12 && hour < 17) {
      this.dayTime = 'afternoon'
    }
    const profile = await this.getPublicProfile(this.account)
    if (profile && profile.publicData.nickname) {
      this.nickname = `, ${profile.publicData.nickname}`
    }
  },

  async beforeMount () {
    this.setBreadcrumbs([])
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
      .item
        .row.flex.q-col-gutter-xl
          .col-xs-12.col-sm-4.column.flex
            .text-h6.title Create or Endorse Proposals
            p Review current proposals and decide which ones you like to endorse. New proposals are are open for voting for a period of 1 week. To create a proposal click on the “+” button.
          .col-xs-12.col-sm-4
            q-card.item-card
              .item-action
                q-btn.q-mb-sm(
                  v-if="isAuthenticated && isMember"
                  icon="fas fa-plus"
                  color="red"
                  size="10px"
                  rounded
                  @click="displayForm('role')"
                )
                  q-tooltip Add a role
              .ribbon
                span.text-white.bg-proposal CREATING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/roles.svg")
              q-card-section
                .type Roles
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Endorse" color="proposal" rounded dense unelevated @click="$router.push({ path: '/documents-proposal/role' })")
          .col-xs-12.col-sm-4
            q-card.item-card
              .item-action
                q-btn.q-mb-sm(
                  v-if="isAuthenticated && isMember"
                  icon="fas fa-plus"
                  color="red"
                  size="10px"
                  rounded
                  @click="displayForm('payout')"
                )
                  q-tooltip Add a contribution
              .ribbon
                span.text-white.bg-proposal CREATING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/past.svg")
              q-card-section
                .type Contributions
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Endorse" color="proposal" rounded dense unelevated @click="$router.push({ path: '/documents-proposal/payout' })")
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
      .item(@click="$router.push({ path: '/roles' })" style="max-width: 450px;")
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
  margin-left 12px
  @media (max-width: $breakpoint-xs-max)
    font-size: 20px
.item
  cursor pointer
  width 100%
  max-width 800px
  background rgba(255, 255, 255, 1)
  padding 25px
  border-radius 25px
  margin-right 10px
  margin-bottom 10px
  .title
    font-weight 600
    line-height 1.3rem
    margin-bottom 10px
  .q-card
    border-radius 1rem
  .item-card
    max-width 180px
    position relative
    z-index 100
    @media (max-width: $breakpoint-xs-max)
      max-width 100%
    .item-action
      position absolute
      top 20px
      right -14px
      z-index 150
      button
        width 30px
        height 30px
    &:hover
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
