<script>
export default {
  name: 'dashboard-anonymous'
}
</script>

<template lang="pug">
.dashboard
  .row.q-col-gutter-xs
    .col-xs-12.col-sm-6.col-md-4
      .item(@click="$router.push({ path: '/applicants' })")
        .row.flex.q-col-gutter-xl
          .col-6.column.flex
            .text-h6.title Enroll Registrants
            p Review current registrants and decide which ones you like to endorse as member. New members will be able to use most features of the DHO.
          .col-6
            q-card
              .ribbon
                span.text-white.bg-hire APPLYING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/membership.svg")
              q-card-section
                .type Members
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Enroll" color="hire" rounded dense unelevated)
    .col-xs-12.col-sm-6.col-md-4
      .item(@click="$router.push({ path: '/proposals/role' })")
        .row.flex.q-col-gutter-xl
          .col-6.column.flex
            .text-h6.title Endorse Proposals
            p Review current proposals and decide which ones you like to endorse. New proposals are are open for voting for a period of 2 weeks.
          .col-6
            q-card
              .ribbon
                span.text-white.bg-proposal PROPOSING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/roles.svg")
              q-card-section
                .type Roles
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Endorse" color="proposal" rounded dense unelevated)
    .col-xs-12.col-sm-6.col-md-4(style="display:none;")
      .item(@click="$router.push({ path: '/roles' })")
        .row.flex.q-col-gutter-xl
          .col-6.column.flex
            .text-h6.title Enroll Applicants
            p Review current applicants and decide which ones you like to endorse. New applications are are open for enrollment for a period of 2 weeks.
          .col-6
            q-card
              .ribbon
                span.text-white.bg-hire APPLYING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/roles.svg")
              q-card-section
                .type Roles
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Enroll" color="hire" rounded dense unelevated)
    .col-xs-12.col-sm-6.col-md-4
      .item(@click="$router.push({ path: '/roles' })")
        .row.flex.q-col-gutter-xl
          .col-6.column.flex
            .text-h6.title Apply for a Role
            p Review open roles and decide if you want to apply (you can always commit to a partial role). Once you are enrolled, claim your salary at the end of a lunar cycle.
          .col-6
            q-card
              .ribbon
                span.text-white.bg-hire NOW  HIRING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/roles.svg")
              q-card-section
                .type Roles
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Apply" color="hire" rounded dense unelevated)
    .col-xs-12.col-sm-6.col-md-4(style="display:none;")
      .item
        .row.flex.q-col-gutter-xl
          .col-6.column.flex
            .text-h6.title Claim your Salary
            p Claim your salary at the end of a lunar cycle and receive payouts in Seeds, HVoice, Hypha and HUSD.
          .col-6
            q-card
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
.dashboard
  margin-left 37px
.item
  cursor pointer
  width 100%
  max-width 450px
  background rgba(255, 255, 255, 0.4)
  padding 25px
  border-radius 25px
  &:hover
    transition transform 0.3s cubic-bezier(0.005, 1.65, 0.325, 1) !important
    transform scale(1.1) translate(0px, 40px) !important
    -moz-transform scale(1.1) translate(0px, 40px)
    -webkit-transform scale(1.1) translate(0px, 40px)
    z-index 10
    box-shadow 0 4px 8px rgba(0,0,0,0.2), 0 5px 3px rgba(0,0,0,0.14), 0 3px 3px 3px rgba(0,0,0,0.12)
  .title
    font-weight 600
  .q-card
    border-radius 1rem
  button
    width 70%
.type
  color $grey-7
  cursor pointer
  text-transform capitalize
  text-align center
  font-weight bolder
  font-size 22px
.icon
  margin-top 20px
  width 100%
  max-width 60px

</style>
