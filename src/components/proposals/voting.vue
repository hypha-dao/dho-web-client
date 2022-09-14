<script>
import { mapActions, mapGetters } from 'vuex'
import { proposals } from '~/mixins/proposals'
/**
 * Widget that allows voting on a contribution.
 */
export default {
  name: 'voting',
  mixins: [proposals],
  components: {
    ProposalStaging: () => import('./proposal-staging.vue'),
    VotingOption5Scale: () => import('./voting-option-5-scale.vue'),
    VotingOptionYesNo: () => import('./voting-option-yes-no.vue'),
    VotingResult: () => import('./voting-result.vue'),
    ProposalSuspended: () => import('./proposal-suspended.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },
  props: {
    /**
     * String that determines the voting option to display.
     * Valid options: `yes-no` | `5-scale`
     */
    method: {
      type: String,
      default: '5-scale',
      validator: (val) => ['yes-no', '5-scale'].includes(val)
    },
    staging: Boolean,
    submitting: Boolean,
    fixed: Boolean,
    activeButtons: Boolean,
    proposal: Object,
    isCreator: Boolean
  },
  beforeMount () {
    this.counterdown = setInterval(() => {
      this.timeLeftString(true)
      this.$forceUpdate()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.counterdown)
  },
  activated () {
    this.onChanged()
    this.isVoting = this.suspend = this.withdraw = false
    this.counterdown = setInterval(() => {
      this.timeLeftString(true)
      this.$forceUpdate()
    }, 1000)
  },
  deactivated () {
    clearInterval(this.counterdown)
  },
  data () {
    return {
      counterdown: undefined,
      isVoting: false,
      suspend: false,
      stagingToSuspend: false,
      bar: true,
      withdraw: false
    }
  },

  computed: {
    ...mapGetters('accounts', ['isMember', 'account']),

    background () {
      if (this.suspend || this.stagingToSuspend || this.withdraw) return 'primary'
      if (this.isVoting || this.staging) return 'primary'
      if (((this.isVotingExpired && this.isAccepted) || this.isApproved) && !this.isSuspended && !this.isWithdrawed && !this.isRejected) return 'positive'
      if (this.isVotingExpired || this.isArchived || this.isSuspended || this.isWithdrawed || this.isRejected) return 'negative'
      return 'white'
    },

    voteString () {
      const title = 'You voted '
      if (this.voteConfig?.vote === 'pass') return `${title} yes`
      if (this.voteConfig?.vote === 'abstain') return `${title} abstain`
      if (this.voteConfig?.vote === 'fail') return `${title} no`
      if (this.isVotingExpired) return 'You did not vote'

      return null
    },
    backgroundButton () {
      if (this.isAccepted && !this.voteConfig?.vote) return { 'bg-transparent': true }
      if (this.isVotingExpired && !this.voteConfig?.vote) return { 'bg-negative': true }
      if (this.voteConfig?.vote === 'pass' && !this.isVotingExpired) return { 'bg-positive': true }
      if (this.voteConfig?.vote === 'fail' && !this.isVotingExpired) return { 'bg-negative': true }
      if (this.voteConfig?.vote === 'abstain' && !this.isVotingExpired) return { 'bg-grey': true }

      return { 'bg-transparent': true }
    },

    widgetTitle () {
      if (this.stagingToSuspend) return 'You\'re about to create a suspension proposal'
      if (this.suspend || this.withdraw) return 'Are you sure?'
      if (this.staging) return null
      if (this.isWithdrawed) return 'Withdrawn'
      if (this.isSuspended) return 'Suspended'
      if (this.isArchived) return 'Archived'
      if (this.isRejected) return 'Rejected'
      if (this.isVotingExpired) {
        if (this.isAccepted) return 'Accepted'
        return 'Rejected'
      }
      if (this.isApproved) return 'Accepted'
      return 'Vote'
    },

    isEditable () {
      return this.isCreator && (
        this.proposal.__typename === 'Assignment' ||
        this.proposal.__typename === 'Badge' ||
        this.proposal.__typename === 'Assignbadge' ||
        this.proposal.__typename === 'Role'
      ) && this.proposal.details_state_s === 'approved'
    }
  },

  methods: {
    ...mapActions('ballots', ['castVote']),
    async onCastVote (vote) {
      await this.castVote({
        docId: this.docId,
        vote
      })
      this.isVoting = false
      this.$emit('voting')
    },
    onEdit () {
      this.$emit('on-edit')
    },
    onActive () {
      this.$emit('on-active')
    },
    onApply () {
      this.$emit('on-apply')
    },
    onSuspend () {
      this.$emit('on-suspend')
    },
    onWithDraw () {
      this.$emit('on-withdraw')
    },
    onClose () {
      this.isVoting = false
      this.suspend = false
      this.withdraw = false
    },
    onYesSuspend () {
      this.$emit('change-prop', true)
      this.suspend = false
      this.stagingToSuspend = true
    },
    onChanged () {
      this.$emit('change-prop', false)
      this.stagingToSuspend = false
    }
  }
}
</script>

<template lang="pug">
widget(:title="widgetTitle" noPadding :background="background" :textColor="isVotingExpired || isVoting || isApproved ? 'white' : 'primary'" :flatBottom="fixed").voting-widget.q-pt-xl
  template(v-slot:header v-if="!stagingToSuspend")
    .col.flex.justify-end.q-mx-md(:class="{'col-2': isVoting || suspend || withdraw}")
      .text-primary.q-my-auto(:class="{ 'text-white': (isVotingExpired || isVoting || isApproved) }" v-if="(isVotingExpired || isApproved) && !suspend && !stagingToSuspend && !withdraw") {{ timeLeftString(true) }}
      q-icon.cursor-pointer.q-mb-xs.q-my-auto(name="fas fa-times" color="white" @click="onClose" size="sm" v-if="isVoting || suspend || withdraw")
  .q-mx-md.q-px-md.voting-body(:class="{ 'q-mt-xxl': !stagingToSuspend && !suspend && !staging && !isVoting && !withdraw}")
    proposal-staging(v-if="staging")
    proposal-suspended(v-if="stagingToSuspend" @publish="onSuspend" @changed="onChanged")
    .column.q-py-xl(v-else-if="isVoting")
      q-btn.q-mb-xxs(unelevated rounded no-caps color="white" text-color="primary" label="Yes" @click="onCastVote('pass')")
      q-btn.q-my-sm(unelevated rounded no-caps color="white" text-color="primary" label="Abstain" @click="onCastVote('abstain')")
      q-btn.q-mt-xxs(unelevated rounded no-caps color="white" text-color="primary" label="No" @click="onCastVote('fail')")
    .column.q-pt-xl(v-else-if="suspend")
      q-btn.q-mb-sm(unelevated rounded no-caps color="white" text-color="primary" label="Yes" @click="onYesSuspend")
      q-btn.q-mt-xxs(unelevated rounded no-caps color="white" text-color="primary" label="No" @click="suspend = false")
    .column.q-pt-xl(v-else-if="withdraw")
      q-btn.q-mb-sm(unelevated rounded no-caps color="white" text-color="primary" label="Yes" @click="onWithDraw")
      q-btn.q-mt-xxs(unelevated rounded no-caps color="white" text-color="primary" label="No" @click="withdraw = false")
    .column.justify-between(v-else)
      .row.full-width.q-mb-sm.q-mt-xs
        voting-result(:unity="unity" :quorum="quorum" :isVotingExpired="isVotingExpired" :colorConfig="colorConfig" :colorConfigQuorum="colorConfigQuorum")
      .row.justify-center.q-mb-sm.q-mt-sm
        q-btn.q-px-xl(v-if="!voteConfig && isProposed && !isVotingExpired && activeButtons" no-caps rounded color="primary" @click="isVoting = !isVoting") Vote now
        q-btn.q-px-xl.full-width(v-if="(isVotingExpired || voteConfig ) && !isApproved" no-caps rounded color="white" outline :class="{ 'no-pointer-events': isVotingExpired, ...backgroundButton }" :disable="isProposed && isVotingExpired" @click="isVoting = !isVoting") {{ voteString }}
         q-tooltip You can change your vote
        q-btn.q-mt-xs.full-width(v-if="isProposed && isOwnProposal && isAccepted && isVotingExpired" unelevated no-caps rounded color="white" text-color="positive" @click="onActive") Activate
        q-btn.q-mt-xs.full-width(v-if="isVotingExpired && !isAccepted && isOwnProposal && !isRejected" unelevated no-caps rounded color="white" text-color="negative" @click="onActive") Archive
        q-btn.q-mt-md.full-width.text-bold(v-if="canBeApply && activeButtons" no-caps rounded unelevated color="white" text-color="positive" @click="onApply") Apply
        q-btn.full-width.text-bold.q-mt-xs.h-btn2(v-if="canBeSuspended && !isProposed && activeButtons && !isOwnProposal" no-caps rounded flat unelevated color="white" text-color="white" @click="suspend = true" padding="5px") Suspend assignment
          q-tooltip Invoke a suspension proposal for this activity
        q-btn.q-mt-xs.full-width.h-btn2(v-if="isEditable" no-caps unelevated flat text-color="white" padding="5px" @click="onEdit" rounded) Edit
        q-btn.q-mt-xs.full-width.h-btn2(v-if="canBeWithdraw" no-caps unelevated flat text-color="white" padding="5px" @click="withdraw = true" rounded) Withdraw assignment
    .column.q-mb-xxl(v-if="!isVotingExpired && !isVoting && !isApproved")
      .row.justify-center
        .text-body2.text-italic.text-body {{ timeLeftString(true) }}
</template>

<style lang="stylus" scoped>
.voting-widget
  min-height: 240px !important
  max-height: 365px !important
.voting-body
  display: flex
  flex-direction: column
  justify-content: flex-end
</style>
