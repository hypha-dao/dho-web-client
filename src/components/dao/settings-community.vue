
<script>

// TODO: Refactor to mixin
const duration = {
  data () {
    return {

      delegatesPassingOptions: [
        { label: '10', value: 10 },
        { label: '8', value: 8 },
        { label: '6', value: 6 },
        { label: '5', value: 5 },
        { label: '4', value: 4 },
        { label: '3', value: 3 }
      ],

      peoplePassingOptions: [
        { label: '100', value: 100 },
        { label: '60', value: 60 },
        { label: '50', value: 50 },
        { label: '40', value: 40 },
        { label: '30', value: 30 },
        { label: '20', value: 20 }
      ],

      roundsDurationOptions: [
        { label: '1h', value: 3600 },
        { label: '2h', value: 7200 },
        { label: '3h', value: 10800 },
        { label: '6h', value: 21600 },
        { label: '12h', value: 43200 },
        { label: '1d', value: 86400 }
      ],

      voteDurationOptions: [
        { label: '12h', value: 43200 },
        { label: '1d', value: 86400 },
        { label: '3d', value: 259200 },
        { label: '1w', value: 604800 },
        { label: '2w', value: 1209600 },
        { label: '1m', value: 2628000 } // TODO: This depeneds on month on selection
      ],

      votingDurationOptions: [
        { label: '1m', value: 2628000 },
        { label: '2m', value: 5260000 },
        { label: '3m', value: 7890000 },
        { label: '6m', value: 15780000 },
        { label: '9m', value: 23670000 },
        { label: '1y', value: 31560000 }
      ]

    }
  },

  methods: {
    isCustomDelegates (duration) { return !this.delegatesPassingOptions.map((_) => _.value).includes(duration) },
    isCustomPeoplePassing (duration) { return !this.peoplePassingOptions.map((_) => _.value).includes(duration) },
    isCustomRoundsDuration (duration) { return !this.roundsDurationOptions.map((_) => _.value).includes(duration) },
    isCustomVoteDuration (duration) { return !this.voteDurationOptions.map((_) => _.value).includes(duration) },
    isCustomVotingDuration (duration) { return !this.votingDurationOptions.map((_) => _.value).includes(duration) }
  }

}

export default {
  name: 'settings-community',
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
  },

  methods: {
    handlePeriodChange (index, name, value) {
      const upvoteRounds = [...this.form.upvoteRounds]
      upvoteRounds[index][name] = value
      this.$emit('on-change', 'upvoteRounds', upvoteRounds)
    }
  }
}
</script>

<template lang="pug">
widget(title='Community' titleImage='/svg/vote.svg' :bar='true').q-pa-none.full-width
  p.text-sm.text-h-gray.leading-loose.q-mt-md Do you want to expand your DAO sense making to your DAO community members (token holders)? You can involve them in your DAO by activating the Community Voting feature. It will allow core members to publish proposals that will be voted by community. We also provide you with different voting system, your classic one based on HVOICE or a Delegate / Upvote system. This last one will allow the creation of an Election process where representative will be etc.. etc..

  .row.justify-end
    .row.items-center
      .h-h4 Activate Community Voting
      q-toggle(:disable="!isAdmin" color="primary" keep-color v-model="form.communityVotingEnabled")
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

  section.full-width.q-mt-xl.q-pt-xl(v-if="form.communityVotingEnabled")
    .row.full-width.justify-between.items-cente
      .h-h4 Community Voting Method

    p.text-sm.text-h-gray.leading-loose.q-mt-md The Classic method allows all DAO community members to vote on community proposals using their HVOICE. The UpVote method allows the election of delegates who will have incremental voting power. This means that HVOICE, only for community layer, will be replaced by a fixed voting power: Click here to discover more about Upvote Method

    .row.q-mt-xl
      .col-6
        label.h-label Community Voting Method
        .row.q-py-sm
          .col-4.q-pr-sm
            q-btn.full-width.q-px-xl.rounded-border.text-bold(
              :disable="!isAdmin"
              :color="form.communityVotingMethod === 'CLASSIC' ? 'primary' : 'internal-bg'  "
              :text-color="form.communityVotingMethod === 'CLASSIC' ? 'white' : 'primary'  "
              @click="form.communityVotingMethod = 'CLASSIC'"
              label="Classic"
              no-caps
              rounded
              unelevated
            )
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings
          .col-4.q-pl-sm
            q-btn.full-width.q-px-xl.rounded-border.text-bold(
              :disable="!isAdmin"
              :color="form.communityVotingMethod === 'UPVOTE' ? 'primary' : 'internal-bg'  "
              :text-color="form.communityVotingMethod === 'UPVOTE' ? 'white' : 'primary'  "
              @click="form.communityVotingMethod = 'UPVOTE'"
              label="Upvote"
              no-caps
              rounded
              unelevated
            )
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings
      //- .col-6.bg-secondary.rounded-full.row.justify-center.items-center(v-if="form.communityVotingMethod === 'UPVOTE'")
      //-   q-btn.q-px-xl.rounded-border.text-bold.q-mr-xs(
      //-     :disable="!isAdmin"
      //-     @click="console.log('IMPORT EOS')"
      //-     color="white"
      //-     label="Import EDEN election from EOS"
      //-     no-caps
      //-     rounded
      //-     text-color="primary"
      //-     unelevated
      //-   )

    section(id="UPVOTE" v-if="form.communityVotingEnabled && form.communityVotingMethod === 'UPVOTE'")
      section.full-width.q-mt-xl.q-pt-xl
        .h-h4
          spain.text-secondary.q-mr-md 1
          span Upvote election Date and Time
        .row.q-mt-xl
          .col-6
            .row
              label.h-label Upvote election starting date
            q-date.q-mt-xs.bg-internal-bg(flat landscape v-model="form.upvoteStartDate")

          .col-6
            .row
              label.h-label Upvote election starting time
            q-time.q-mt-xs.bg-internal-bg(flat landscape v-model="form.upvoteStartTime")

      section.full-width.q-mt-xl.q-pt-xl
        .h-h4
          spain.text-secondary.q-mr-md 2
          span Upvote election Rounds

        .full-width.q-mt-xl
          template(v-for="(round, index) in form.upvoteRounds")
            .row
              .col-6.row.q-pr-xl
                .row.items-end.full-width
                  .row.items-center.q-col-gutter-xs
                    label.h-label Round {{ index + 1 }} - people passing
                    //- q-icon(name="fas fa-info-circle" size="16px" color="body")
                    //-   q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Is the duration period the vote is active and member can cast one or more votes.
                  .q-mt-xs.row.full-width
                    .col-7.row.justify-between.q-mr-sm
                      q-btn.duration-button.text-bold.text-lowercase(
                        :color="form.upvoteRounds[index].peoplePassing === option.value ? 'primary' : 'internal-bg'"
                        :disable="!isAdmin"
                        :key='index'
                        :text-color="form.upvoteRounds[index].peoplePassing === option.value ? 'white' : 'primary'"
                        @click="form.upvoteRounds[index].peoplePassing = option.value"
                        padding="none"
                        rounded
                        unelevated
                        v-for='(option) in peoplePassingOptions'
                      ) {{ option.label }}
                    .col-grow
                      custom-period-input(type="number" :disable="!isAdmin" :isActive="isCustomPeoplePassing(form.upvoteRounds[index].peoplePassing)" @selected="form.upvoteRounds[index].peoplePassing = 0" v-model='form.upvoteRounds[index].peoplePassing')
                  q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

              .col-6.row.q-pr-xl
                .row.items-end.full-width
                  .row.items-center.q-col-gutter-xs
                    label.h-label Round {{ index + 1 }} - duration
                    //- q-icon(name="fas fa-info-circle" size="16px" color="body")
                      //- q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Is the duration period the vote is active and member can cast one or more votes.
                  .q-mt-xs.row.full-width
                    .col-7.row.justify-between.q-mr-sm
                      q-btn.duration-button.text-bold.text-lowercase(
                        :color="form.upvoteRounds[index].duration === option.value ? 'primary' : 'internal-bg'"
                        :disable="!isAdmin"
                        :key='index'
                        :text-color="form.upvoteRounds[index].duration === option.value ? 'white' : 'primary'"
                        @click="form.upvoteRounds[index].duration = option.value"
                        padding="none"
                        rounded
                        unelevated
                        v-for='(option) in roundsDurationOptions'
                      ) {{ option.label }}
                    .col-grow
                      custom-period-input(:disable="!isAdmin" :isActive="isCustomRoundsDuration(form.upvoteRounds[index].duration)" @selected="form.upvoteRounds[index].duration = 0" v-model='form.upvoteRounds[index].duration')
                  q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

            .row.items-center.q-mt-md
              .hr.col
              nav.row.justify-end
                q-btn(:disable="form.upvoteRounds.length === 1 || !isAdmin" flat color="primary" no-caps padding="none" @click="form.upvoteRounds.splice(index, 1)").text-bold.q-pa-none.q-mr-xs Remove Round -
                q-btn(:disable="form.upvoteRounds.length === 10 || !isAdmin" v-show="index === form.upvoteRounds.length - 1" flat color="primary" no-caps padding="none" @click="form.upvoteRounds.push({ peoplePassing: 50, duration: 10800 })").text-bold.q-pa-none.q-ml-lg.q-mr-xs Add Round +

        .row.q-mt-xl
          .col-6.row.q-pr-xl
            .row.items-end.full-width
              .row.items-center.q-col-gutter-xs
                label.h-label Chief Delegate round > How many Chief Delegates ?
                //- q-icon(name="fas fa-info-circle" size="16px" color="body")
                //-   q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Is the duration period the vote is active and member can cast one or more votes.
              .q-mt-xs.row.full-width
                .col-7.row.justify-between.q-mr-sm
                  q-btn.duration-button.text-bold.text-lowercase(
                    :color="form.upvoteCheifDelegateCount === option.value ? 'primary' : 'internal-bg'"
                    :disable="!isAdmin"
                    :key='index'
                    :text-color="form.upvoteCheifDelegateCount === option.value ? 'white' : 'primary'"
                    @click="form.upvoteCheifDelegateCount = option.value"
                    padding="none"
                    rounded
                    unelevated
                    v-for='(option, index) in delegatesPassingOptions'
                  ) {{ option.label }}
                .col-grow
                  custom-period-input(type="number" :disable="!isAdmin" :isActive="isCustomDelegates(form.upvoteCheifDelegateCount)" @selected="form.upvoteCheifDelegateCount = 0" v-model='form.upvoteCheifDelegateCount')
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

          .col-6.row.q-pr-xl
            .row.items-end.full-width
              .row.items-center.q-col-gutter-xs
                label.h-label Chief Delegates round - duration
                //- q-icon(name="fas fa-info-circle" size="16px" color="body")
                  //- q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Is the duration period the vote is active and member can cast one or more votes.
              .q-mt-xs.row.full-width
                .col-7.row.justify-between.q-mr-sm
                  q-btn.duration-button.text-bold.text-lowercase(
                    :color="form.upvoteCheifDelegateDuration === option.value ? 'primary' : 'internal-bg'"
                    :disable="!isAdmin"
                    :key='index'
                    :text-color="form.upvoteCheifDelegateDuration === option.value ? 'white' : 'primary'"
                    @click="form.upvoteCheifDelegateDuration = option.value"
                    padding="none"
                    rounded
                    unelevated
                    v-for='(option, index) in roundsDurationOptions'
                  ) {{ option.label }}
                .col-grow
                  custom-period-input(:disable="!isAdmin" :isActive="isCustomRoundsDuration(form.upvoteCheifDelegateDuration)" @selected="form.upvoteCheifDelegateDuration = 0" v-model='form.upvoteCheifDelegateDuration')
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .hr.q-my-xl

        .row
          .col-6.row.q-pr-xl
            .row.items-end.full-width
              .row.items-center.q-col-gutter-xs
                label.h-label Head Delegate round > Do you want 1 head delegate?
                //- q-icon(name="fas fa-info-circle" size="16px" color="body")
                //-   q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Is the duration period the vote is active and member can cast one or more votes.
              .q-mt-xs.row.full-width
                .col-4.q-pr-sm
                  q-btn.full-width.q-px-xl.rounded-border.text-bold(
                    :color="form.upvoteHeadDelegateRound ? 'primary' : 'internal-bg'  "
                    :text-color="form.upvoteHeadDelegateRound ? 'white' : 'primary'  "
                    @click="form.upvoteHeadDelegateRound = true"
                    label="Yes"
                    no-caps
                    rounded
                    unelevated
                  )
                .col-4.q-pl-sm
                  q-btn.full-width.q-px-xl.rounded-border.text-bold(
                    :color="!form.upvoteHeadDelegateRound  ? 'primary' : 'internal-bg'  "
                    :text-color="!form.upvoteHeadDelegateRound  ? 'white' : 'primary'  "
                    @click="form.upvoteHeadDelegateRound = false"
                    label="No"
                    no-caps
                    rounded
                    unelevated
                  )
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

          .col-6.row.q-pr-xl(v-if="form.upvoteHeadDelegateRound")
            .row.items-end.full-width
              .row.items-center.q-col-gutter-xs
                label.h-label Head Delegates round - duration
                //- q-icon(name="fas fa-info-circle" size="16px" color="body")
                  //- q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Is the duration period the vote is active and member can cast one or more votes.
              .q-mt-xs.row.full-width
                .col-7.row.justify-between.q-mr-sm
                  q-btn.duration-button.text-bold.text-lowercase(
                    :color="form.upvoteHeadDelegateDuration === option.value ? 'primary' : 'internal-bg'"
                    :disable="!isAdmin"
                    :key='index'
                    :text-color="form.upvoteHeadDelegateDuration === option.value ? 'white' : 'primary'"
                    @click="form.upvoteHeadDelegateDuration = option.value"
                    padding="none"
                    rounded
                    unelevated
                    v-for='(option, index) in roundsDurationOptions'
                  ) {{ option.label }}
                .col-grow
                  custom-period-input(:disable="!isAdmin" :isActive="isCustomRoundsDuration(form.upvoteHeadDelegateDuration)" @selected="form.upvoteHeadDelegateDuration = 0" v-model='form.upvoteHeadDelegateDuration')
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

      section.full-width.q-mt-xl.q-pt-xl
        .h-h4
          spain.text-secondary.q-mr-md 3
          span Upvote method expiration time
        p.text-sm.text-h-gray.leading-loose.q-mt-md After the election has been successfully completed, the EDEN voting method will perdure for a specific amount of time. This allows the process of delegation assignment to be renewed. Define here for how long you want your DAO Community Layer voting system to work with an EDEN voting method.
        .row
          .col-6.row.q-pr-xl
            .row.items-end.full-width
              .row.items-center.q-col-gutter-xs
                label.h-label EDEN voting method duration
                //- q-icon(name="fas fa-info-circle" size="16px" color="body")
                  //- q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Is the duration period the vote is active and member can cast one or more votes.
              .q-mt-xs.row.full-width
                .col-7.row.justify-between.q-mr-sm
                  q-btn.duration-button.text-bold.text-lowercase(
                    :color="form.upvoteDuration === option.value ? 'primary' : 'internal-bg'"
                    :disable="!isAdmin"
                    :key='index'
                    :text-color="form.upvoteDuration === option.value ? 'white' : 'primary'"
                    @click="form.upvoteDuration = option.value"
                    padding="none"
                    rounded
                    unelevated
                    v-for='(option, index) in votingDurationOptions'
                  ) {{ option.label }}
                .col-grow
                  custom-period-input(:disable="!isAdmin" :isActive="isCustomVotingDuration(form.upvoteDuration)" @selected="form.upvoteDuration = 0" v-model='form.upvoteDuration')
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

  .hr.q-my-xl.hr

  section.full-width.q-mt-xl.q-pt-xl(v-if="form.communityVotingEnabled")
    .h-h4 Community Proposals Diligence
    p.text-sm.text-h-gray.leading-loose.q-mt-md The following section allows you to set a different Unity, Quorum and Duration ONLY for Community Proposals.
    .row.q-mt-xl
      .col-6.q-pr-sm
        .row.items-center.q-col-gutter-xs
          label.h-label Vote alignment (Unity)
          q-icon(name="fas fa-info-circle" size="16px" color="body")
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Unity is the minimum required percentage of members supporting (voting for, vs voting against) a proposal for it to pass. Make this 100% if you wish to have consensus, or 50% for classical majority-rule democracy, etc
        .row.full-width.items-center
          .col-7.row.q-mr-sm
            q-slider(
              :disable="!isAdmin"
              :max="100"
              :min="0"
              :step="1"
              color="primary"
              v-model="form.communityVotingAlignmentPercent"
            )
          .col-grow
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
      .col-6.q-pl-sm
        .row.items-center.q-col-gutter-xs
          label.h-label Vote quorum
          q-icon(name="fas fa-info-circle" size="16px" color="body")
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Quorum is the minimum required percentage of total members participating in the vote for it to pass.
        .row.full-width.items-center
          .col-7.row.q-mr-sm
            q-slider(
              :disable="!isAdmin"
              :max="100"
              :min="0"
              :step="1"
              color="primary"
              v-model="form.communityVotingQuorumPercent"
            )
          .col-grow
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

    .row.q-mt-xl
      .col-6.row.q-pr-sm
        .row.items-end.full-width
          .row.items-center.q-col-gutter-xs
            label.h-label Vote duration
            q-icon(name="fas fa-info-circle" size="16px" color="body")
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Is the duration period the vote is active and member can cast one or more votes.
          .q-mt-xs.row.full-width
            .col-7.row.justify-between.q-mr-sm
              q-btn.duration-button.text-bold.text-lowercase(
                :color="form.communityVotingDurationSec === option.value ? 'primary' : 'internal-bg'"
                :disable="!isAdmin"
                :key='index'
                :text-color="form.communityVotingDurationSec === option.value ? 'white' : 'primary'"
                @click="form.communityVotingDurationSec = option.value"
                padding="none"
                rounded
                unelevated
                v-for='(option, index) in voteDurationOptions'
              ) {{ option.label }}
            .col-grow
              custom-period-input(:disable="!isAdmin" :isActive="isCustomVoteDuration(form.communityVotingDurationSec)" @selected="form.communityVotingDurationSec = 0" v-model='form.communityVotingDurationSec')
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

</template>

<style lang="stylus" scoped>
.duration-button
  font-size: 13px;
  width: 40px
  height: 40px;

.q-time--landscape
  min-width: 446px !important;
</style>
