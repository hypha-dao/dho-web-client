<script>
import { mapGetters } from 'vuex'
import ipfsy from '~/utils/ipfsy'

export default {
  name: 'circle',
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    CirclesWidget: () => import('~/components/organization/circles-widget.vue'),
    Members: () => import('~/components/organization/members.vue'),
    Tokens: () => import('~/components/organization/tokens.vue')
  },

  data () {
    return {
      circles: [
        {
          title: 'Activation',
          // subCircles: [
          //   {
          //     title: 'Activation',
          //     membersCount: 12
          //   },
          //   {
          //     title: 'Brand, Marketing and Communication',
          //     membersCount: 12
          //   },
          //   {
          //     title: 'Brand, Marketing and Communication',
          //     membersCount: 12
          //   },
          //   {
          //     title: 'Brand, Marketing and Communication',
          //     membersCount: 12
          //   }
          // ],
          members: [
            {
              username: 'User'
            },
            {
              username: 'User'
            }
          ]
        },
        {
          title: 'Brand, Marketing and Communication',
          // subCircles: [
          //   {
          //     title: 'Brand, Marketing and Communication',
          //     membersCount: 12
          //   }
          // ],
          members: [
            {
              username: 'User'
            },
            {
              username: 'User'
            }
          ]
        },
        {
          title: 'Customer Relations',
          // subCircles: [
          //   {
          //     title: 'Brand, Marketing and Communication',
          //     membersCount: 12
          //   },
          //   {
          //     title: 'Activation',
          //     membersCount: 12
          //   }
          // ],
          members: [
            {
              username: 'User'
            },
            {
              username: 'User'
            }
          ]
        }

      ]
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'selectedDaoPlan']),

    banner () {
      return {
        title: 'Go To Market',
        description: 'Purpose',
        background: ipfsy(this.daoSettings?.dashboardBackgroundImage),
        color: this.daoSettings?.primaryColor,
        pattern: this.daoSettings?.pattern,
        patternColor: this.daoSettings?.patternColor,
        patternAlpha: this.daoSettings?.patternOpacity
      }
    },

    isBannerVisible () { return true },

    members () {
      return [
        { account: 'john', name: 'John Doe', joinedDate: new Date().toDateString() },
        { account: 'john', name: 'John Doe', joinedDate: new Date().toDateString() },
        { account: 'john', name: 'John Doe', joinedDate: new Date().toDateString() },
        { account: 'john', name: 'John Doe', joinedDate: new Date().toDateString() }
      ]
    },

    budget () {
      return [
        {
          tokenName: 'HYPHA',
          amount: 1000,
          type: 'utility'
        },
        {
          tokenName: 'HUSD',
          amount: 1000,
          type: 'cash'
        }
      ]
    }
  },

  methods: {
    _apply () {
      console.log('APPLYs')
    },

    _approveMember (account) {
      console.log('APPROVE', account)
    },

    _denyMember (account) {
      console.log('DENY', account)
    },

    ipfsy
  }
}
</script>

<template lang="pug">
q-page
  base-banner(
    :compact="!$q.screen.gt.sm"
    :split="$q.screen.gt.md"
    v-bind="banner"
    v-if="isBannerVisible"
  )
    template(v-slot:buttons)
      q-btn.q-px-lg.h-btn1(
        color="secondary"
        label="Join Circle"
        no-caps
        rounded
        unelevated
        @click="_apply"
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
      circles-widget.q-mt-md(:circles="circles" title="Subcircles")
    .col-4
      members(
      :members="members || '...'"
      title="Applicants"
      @approve="_approveMember"
      @deny="_denyMember"
    )
</template>

<style lang="stylus" scoped>

</style>
