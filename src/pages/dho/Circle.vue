<script>
import { mapActions, mapGetters } from 'vuex'
import ipfsy from '~/utils/ipfsy'

export default {
  name: 'circle-dashboard',
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    CirclesWidget: () => import('~/components/organization/circles-widget.vue'),
    Members: () => import('~/components/organization/members.vue'),
    Tokens: () => import('~/components/organization/tokens.vue')
  },

  apollo: {
    circle: {
      query: require('~/query/circles/dao-circle-details.gql'),
      update: data => {
        const circle = data.queryCircle[0]
        return {
          ...circle
        }
      },
      skip () { return !this.circleId },
      variables () { return { circleId: this.circleId } }
    }
  },

  data () {
    return {
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isApplicant', 'isAuthenticated', 'isMember', 'isAdmin']),
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'selectedDaoPlan']),

    banner () {
      return {
        title: this?.circle?.name,
        description: this?.circle?.purpose,
        background: ipfsy(this.daoSettings?.dashboardBackgroundImage),
        color: this.daoSettings?.primaryColor,
        pattern: this.daoSettings?.pattern,
        patternColor: this.daoSettings?.patternColor,
        patternAlpha: this.daoSettings?.patternOpacity
      }
    },

    budget () {
      return [
        {
          tokenName: 'HYPHA',
          amount: this?.circle?.budget,
          type: 'utility'
        },
        {
          tokenName: 'HUSD',
          amount: this?.circle?.budget,
          type: 'cash'
        }
      ]
    },

    circleId () { return this.$route.params.id }

  },

  methods: {
    ...mapActions('dao', ['applyForCircle', 'enrollInCircle', 'rejectInCircle']),

    async _apply () {
      await this.applyForCircle({ applicant: this.account, circleId: this.circleId })
    },

    async _enrollMember (applicant) {
      await this.enrollInCircle({ applicant, circleId: this.circleId, enroller: this.account })
    },

    async _rejectMember (applicant) {
      await this.rejectInCircle({ applicant, circleId: this.circleId, enroller: this.account })
    },

    ipfsy
  }

}
</script>

<template lang="pug">
q-page
  base-banner(:compact="!$q.screen.gt.sm" :split="$q.screen.gt.md" v-bind="banner")
    template(v-slot:buttons)
      q-btn.q-px-lg.h-btn1(
        @click="_apply"
        color="secondary"
        label="Join Circle"
        no-caps
        rounded
        unelevated
      )

  .row.q-mt-md.q-col-gutter-md.items-start
    .col-8
      tokens(
        v-if="!$q.screen.md"
        :daoLogo="daoSettings.logo"
        :tokens="budget"
        :vertical="!$q.screen.gt.sm"
        title="Budget"
        )
      circles-widget.q-mt-md(:circles="circles ? circles : []" title="Subcircles")
    .col-4
      members(
        v-if="circle.applicants"
        :members="circle ? circle.applicants : []"
        @enroll="_enrollMember"
        @reject="_rejectMember"
        title="Applicants"
      )
      members.q-mt-md(
        :members="circle ? circle.members : []"
        title="Members"
      )
</template>

<style lang="stylus" scoped>

</style>
