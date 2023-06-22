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
widget.q-pa-none.full-width(:title="$t('dao.settings-voting.voting')" titleImage="/svg/vote.svg" :bar="true")
  p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('dao.settings-voting.useVotingSettings') }}
  .row.q-mt-xl.q-col-gutter-x-md
    .col-12.col-md-6
      .row.items-center.q-col-gutter-xs
        label.h-label {{ $t('dao.settings-voting.voteAlignmentUnity') }}
        q-icon(name="fas fa-info-circle" size="16px" color="body")
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") {{ $t('dao.settings-voting.unityIsThe') }}
      .row.full-width.items-center
        .col-12.col-md-7.row.q-mr-sm
          q-slider(:disable="!isAdmin" :max="100" :min="0" :step="1" color="primary" v-model="form.votingAlignmentPercent")
        .col-grow
          q-input.rounded-border.q-py-sm(:disable="!isAdmin" :rules="[val => val >= 0 && val <= 100]" dense="dense" outlined="outlined" rounded="rounded" suffix="%" v-model.number="form.votingAlignmentPercent")
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-voting.onlyDaoAdmins') }}
    .col-12.col-md-6(:class="{'q-mt-md': !$q.screen.gt.sm}")
      .row.items-center.q-col-gutter-xs
        label.h-label {{ $t('dao.settings-voting.voteQuorum') }}
        q-icon(name="fas fa-info-circle" size="16px" color="body")
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") {{ $t('dao.settings-voting.quorumIsThe') }}
      .row.full-width.items-center
        .col-12.col-md-7.row.q-mr-sm
          q-slider(:disable="!isAdmin" :max="100" :min="0" :step="1" color="primary" v-model="form.votingQuorumPercent")
        .col-grow
          q-input.rounded-border.q-py-sm(:disable="!isAdmin" :rules="[val => val >= 0 && val <= 100]" dense="dense" outlined="outlined" rounded="rounded" suffix="%" v-model.number="form.votingQuorumPercent")
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-voting.onlyDaoAdmins1') }}
  .row.q-mt-xl.q-col-gutter-x-md
    .col-12.col-md-6.row
      .row.items-end.full-width
        .row.items-center.q-col-gutter-xs
          label.h-label {{ $t('dao.settings-voting.voteDuration') }}
          q-icon(name="fas fa-info-circle" size="16px" color="body")
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") {{ $t('dao.settings-voting.isTheDuration') }}
        .q-mt-xs.row.full-width
          .col-12.col-md-7.row.justify-between.q-mr-sm
            q-btn.duration-button.text-bold.text-lowercase(:color="form.votingDurationSec === option.value ? 'primary' : 'internal-bg'" :disable="!isAdmin" :key="index" :text-color="form.votingDurationSec === option.value ? 'white' : 'primary'" @click="form.votingDurationSec = option.value" padding="none" rounded="rounded" unelevated="unelevated" v-for="(option, index) in durationOptions") {{ option.label }}
          .col-grow(:class="{'q-mt-md': !$q.screen.gt.sm}")
            custom-period-input(:disable="!isAdmin" :isActive="isCustomVotingDuration" @selected="form.votingDurationSec = 0" v-model="form.votingDurationSec")
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-voting.onlyDaoAdmins2') }}

</template>

<style lang="stylus" scoped>
.duration-button
  font-size: 13px;
  width: 40px
  height: 40px;

</style>
