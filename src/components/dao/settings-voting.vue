<script>

export default {
  name: 'settings-voting',
  components: {
    CustomPeriodInput: () => import('~/components/form/custom-period-input.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    form: {
      type: Object,
      default: () => {}
    },

    isAdmin: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {

      COMMUNITY_SHOWCASE: [
        { title: '1 member = 1 vote', description: 'Every member can vote using 1 member 1 vote.' },
        { title: 'Delegate voice', description: 'Members can give their voice (or voting power) to elected members in a democratic election' },
        { title: 'Multiple votes', description: 'Members can vote multiple times during the voting period' },
        { title: 'Voting period', description: 'The default voting period is 1 week' },
        { title: 'Requirements', description: 'Proposals need to have the required percentage of supportive votes (unity) and percentage of all votes (quorum)' }
      ]

    }
  }

}
</script>

<template lang="pug">
.tab
  widget(:title="$t('configuration.settings-voting.core.title')" titleImage='/svg/core-voting.svg' bar).q-pa-none.full-width
    template(v-slot:header)
      q-toggle(:disable="!isAdmin" color="secondary" keep-color v-model="form.proposalsCreationEnabled")

    p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('configuration.settings-voting.core.description') }}

    section(v-show="form.proposalsCreationEnabled")
      .hr
      section.row.q-mt-xl.q-col-gutter-x-md
        .col-12.col-md-4
          label.h-label {{ $t('configuration.settings-voting.core.form.unity.label') }}
          .row.full-width.items-center
            .col.row.q-mr-sm
              q-slider(
                :disable="!isAdmin"
                :max="100"
                :min="0"
                :step="1"
                color="primary"
                v-model="form.votingAlignmentPercent"
              )
            .col-3
              q-input.rounded-border.q-py-sm(
                :disable="!isAdmin"
                :rules="[val => val >= 0 && val <= 100]"
                dense
                outlined
                rounded
                suffix="%"
                v-model.number="form.votingAlignmentPercent"
              )
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-12.col-md-4
          label.h-label {{ $t('configuration.settings-voting.core.form.quorum.label') }}
          .row.full-width.items-center
            .col.row.q-mr-sm
              q-slider(
                :disable="!isAdmin"
                :max="100"
                :min="0"
                :step="1"
                color="primary"
                v-model="form.votingQuorumPercent"
              )
            .col-3
              q-input.rounded-border.q-py-sm(
                :disable="!isAdmin"
                :rules="[val => val >= 0 && val <= 100]"
                dense
                outlined
                rounded
                suffix="%"
                v-model.number="form.votingQuorumPercent"
              )
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-12.col-md-4
          label.h-label {{ $t('configuration.settings-voting.core.form.duration.label') }}
          custom-period-input(:disable="!isAdmin" v-model='form.votingDurationSec')
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

      section.row.q-mt-xl.q-col-gutter-x-md.q-mb-xl(v-show="$q.screen.gt.sm")
        template(v-for="item in $t('configuration.settings-voting.core.showcase')")
          .col(:style="{'height': '164px'}")
            .q-pa-md.bg-internal-bg.rounded-border.full-height
              p.q-pa-none.q-ma-none {{ item.title }}
              p.text-sm.text-h-gray.leading-loose.q-mt-sm {{ item.description }}

  widget(:title="$t('configuration.settings-voting.community.title')" titleImage='/svg/community-voting.svg' bar).q-pa-none.full-width.q-mt-sm
    template(v-slot:header)
      q-toggle(:disable="!isAdmin" color="secondary" keep-color v-model="form.communityVotingEnabled")

    p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('configuration.settings-voting.community.description') }}

    section(v-show="form.communityVotingEnabled")
      .hr
      section.row.q-mt-xl.q-col-gutter-x-md
        .col-12.col-md-4
          label.h-label {{ $t('configuration.settings-voting.community.form.unity.label') }}
          .row.full-width.items-center
            .col.row.q-mr-sm
              q-slider(
                :disable="!isAdmin"
                :max="100"
                :min="0"
                :step="1"
                color="primary"
                v-model="form.communityVotingAlignmentPercent"
              )
            .col-3
              q-input.rounded-border.q-py-sm(
                :disable="!isAdmin"
                :rules="[val => val >= 0 && val <= 100]"
                dense
                outlined
                rounded
                suffix="%"
                v-model.number="form.communityVotingAlignmentPercent"
              )
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-12.col-md-4
          label.h-label {{ $t('configuration.settings-voting.community.form.quorum.label') }}
          .row.full-width.items-center
            .col.row.q-mr-sm
              q-slider(
                :disable="!isAdmin"
                :max="100"
                :min="0"
                :step="1"
                color="primary"
                v-model="form.communityVotingQuorumPercent"
              )
            .col-3
              q-input.rounded-border.q-py-sm(
                :disable="!isAdmin"
                :rules="[val => val >= 0 && val <= 100]"
                dense
                outlined
                rounded
                suffix="%"
                v-model.number="form.communityVotingQuorumPercent"
              )
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-12.col-md-4
          label.h-label {{ $t('configuration.settings-voting.community.form.duration.label') }}
          custom-period-input(:disable="!isAdmin" v-model='form.communityVotingDurationSec')
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

      section.row.q-mt-xl.q-col-gutter-x-md.q-mb-xl(v-show="$q.screen.gt.sm")
        template(v-for="item in $t('configuration.settings-voting.community.showcase')")
          .col(:style="{'height': '224px'}")
            .q-pa-md.bg-internal-bg.rounded-border.full-height
              p.q-pa-none.q-ma-none {{ item.title }}
              p.text-sm.text-h-gray.leading-loose.q-mt-sm {{ item.description }}

</template>

<style lang="stylus" scoped>
</style>
