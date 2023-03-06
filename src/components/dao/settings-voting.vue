<script>

// TODO: Refactor to mixin
const duration = {
  data () {
    return {
      durationOptions: [
        { label: '12h', value: 43200 },
        { label: '1d', value: 86400 },
        { label: '3d', value: 259200 },
        { label: '1w', value: 604800 },
        { label: '2w', value: 1209600 },
        { label: '1m', value: 2628000 } // TODO: This depeneds on month on selection
      ]
    }
  },

  methods: {
    isCustomDuration (duration) { return !this.durationOptions.map((_) => _.value).includes(duration) }
  },

  computed: {
    // isCustomPeriodDuration () { return this.isCustomDuration(this.form.periodDurationSec) },
    // isCustomVoiceTokenDecay () { return this.isCustomDuration(this.form.voiceTokenDecayPeriod) },
    isCustomVotingDuration () { return this.isCustomDuration(this.form.votingDurationSec) }
  }
}

export default {
  name: 'settings-voting',
  mixins: [duration],
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
  }
}
</script>

<template lang="pug">
widget(title='Voting' titleImage='/svg/vote.svg' :bar='true').q-pa-none.full-width
    p.text-sm.text-h-gray.leading-loose.q-mt-md Use voting settings to set up your voting parameters including unity (min % of members endorsing it), quorum (min % of total members participating in the vote) and voting duration (how long a vote is open, including updates to your vote).

    .row.q-mt-xl.q-col-gutter-x-md
      .col-12.col-md-6
        .row.items-center.q-col-gutter-xs
          label.h-label Vote alignment (Unity)
          q-icon(name="fas fa-info-circle" size="16px" color="body")
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Unity is the minimum required percentage of members supporting (voting for, vs voting against) a proposal for it to pass. Make this 100% if you wish to have consensus, or 50% for classical majority-rule democracy, etc
        .row.full-width.items-center
          .col-12.col-md-7.row.q-mr-sm
            q-slider(
              :disable="!isAdmin"
              :max="100"
              :min="0"
              :step="1"
              color="primary"
              v-model="form.votingAlignmentPercent"
            )
          .col-grow
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
      .col-12.col-md-6(:class="{'q-mt-md': !$q.screen.gt.sm}")
        .row.items-center.q-col-gutter-xs
          label.h-label Vote quorum
          q-icon(name="fas fa-info-circle" size="16px" color="body")
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Quorum is the minimum required percentage of total members participating in the vote for it to pass.
        .row.full-width.items-center
          .col-12.col-md-7.row.q-mr-sm
            q-slider(
              :disable="!isAdmin"
              :max="100"
              :min="0"
              :step="1"
              color="primary"
              v-model="form.votingQuorumPercent"
            )
          .col-grow
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

    .row.q-mt-xl.q-col-gutter-x-md
      .col-12.col-md-6.row
        .row.items-end.full-width
          .row.items-center.q-col-gutter-xs
            label.h-label Vote duration
            q-icon(name="fas fa-info-circle" size="16px" color="body")
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Is the duration period the vote is active and member can cast one or more votes.
          .q-mt-xs.row.full-width
            .col-12.col-md-7.row.justify-between.q-mr-sm
              q-btn.duration-button.text-bold.text-lowercase(
                :color="form.votingDurationSec === option.value ? 'primary' : 'internal-bg'"
                :disable="!isAdmin"
                :key='index'
                :text-color="form.votingDurationSec === option.value ? 'white' : 'primary'"
                @click="form.votingDurationSec = option.value"
                padding="none"
                rounded
                unelevated
                v-for='(option, index) in durationOptions'
              ) {{ option.label }}
            .col-grow(:class="{'q-mt-md': !$q.screen.gt.sm}")
              custom-period-input(:disable="!isAdmin" :isActive="isCustomVotingDuration" @selected="form.votingDurationSec = 0" v-model='form.votingDurationSec')
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

      //- .col-6.row.q-pl-sm
      //-   .row.items-end.full-width
      //-     label.h-label Period duration
      //-     .q-mt-xs.row.full-width
      //-       .col-7.row.justify-between.q-mr-sm
      //-         q-btn.button.text-bold.text-lowercase(
      //-           :color="form.periodDurationSec === option.value ? 'primary' : 'internal-bg'"
      //-           :disable="!isAdmin"
      //-           :key='index'
      //-           :text-color="form.periodDurationSec === option.value ? 'white' : 'primary'"
      //-           @click="form.periodDurationSec = option.value"
      //-           padding="none"
      //-           rounded
      //-           unelevated
      //-           v-for='(option, index) in durationOptions'
      //-         ) {{ option.label }}
      //-       .col-grow
      //-         custom-period-input(:disable="!isAdmin" :isActive="isCustomPeriodDuration" @selected="form.periodDurationSec = 0" v-model='form.periodDurationSec')
      //-     q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

</template>

<style lang="stylus" scoped>
.duration-button
  font-size: 13px;
  width: 40px
  height: 40px;

</style>
