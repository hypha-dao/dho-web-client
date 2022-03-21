<script>
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'

/**
 * Widget that allows voting on a contribution.
 */
export default {
  name: 'voting',
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
    docId: String,
    unity: Number,
    quorum: Number,
    expiration: String,
    staging: Boolean,
    submitting: Boolean,
    title: {
      type: String,
      default: 'Vote'
    },
    vote: {
      type: String,
      default: null
    },
    fixed: Boolean,
    active: Boolean,
    status: String,
    type: String
  },

  data () {
    return {
      voting: false,
      suspend: false,
      stagingToSuspend: false,
      bar: true,
      withdraw: false
    }
  },

  computed: {
    ...mapGetters('accounts', ['isMember']),

    accepted () {
      return (this.quorum >= 0.20 && this.unity >= 0.80) || this.status === 'approved'
    },

    background () {
      if (this.suspend || this.stagingToSuspend || this.withdraw) return 'primary'
      if (this.voting || this.staging) return 'primary'
      if ((this.expired && this.accepted) && !this.suspended && !this.withdrawed) return 'positive'
      if (this.expired || this.archived || this.suspended || this.withdrawed) return 'negative'
      return 'white'
    },

    expired () {
      return this.timeLeft < 0
    },

    timeLeft () {
      const end = new Date(`${this.expiration}`).getTime()
      const now = Date.now()
      const t = end - now
      return t
    },

    timeLeftString () {
      const MS_PER_DAY = 1000 * 60 * 60 * 24
      const MS_PER_HOUR = 1000 * 60 * 60
      const MS_PER_MIN = 1000 * 60
      const MS = 1000
      if (this.timeLeft > 0) {
        const days = Math.floor(this.timeLeft / MS_PER_DAY)
        let lesstime = this.timeLeft - (days * MS_PER_DAY)
        const hours = Math.floor(lesstime / MS_PER_HOUR)
        lesstime = lesstime - (hours * MS_PER_HOUR)
        const min = Math.floor(lesstime / MS_PER_MIN)
        lesstime = lesstime - (min * MS_PER_MIN)
        const seg = Math.floor(lesstime / MS)

        let dayStr = ''
        if (days > 0) {
          dayStr = days === 1 ? `${days} day, ` : `${days} days, `
        }
        const hourStr = hours > 9 ? hours : `0${hours}`
        const minStr = min > 9 ? min : `0${min}`
        const segStr = seg > 9 ? seg : `0${seg}`

        return `This vote will close in ${dayStr}${hourStr}:${minStr}:${segStr}`
      }
      const end = new Date(this.expiration)
      const format = date.formatDate(end, 'MMM D,YYYY')

      return `On ${format}`
    },

    voteString () {
      const title = 'You voted '
      if (this.vote === 'pass') return `${title} yes`
      if (this.vote === 'abstain') return `${title} abstain`
      if (this.vote === 'fail') return `${title} no`
      if (this.expired) return 'You did not vote'

      return null
    },
    backgroundButton () {
      if (this.accepted && !this.vote) return { 'bg-transparent': true }
      if (this.expired && !this.vote) return { 'bg-negative': true }
      if (this.vote === 'pass' && !this.expired) return { 'bg-positive': true }
      if (this.vote === 'fail' && !this.expired) return { 'bg-negative': true }
      if (this.vote === 'abstain' && !this.expired) return { 'bg-grey': true }

      return { 'bg-transparent': true }
    },

    widgetTitle () {
      if (this.stagingToSuspend) return 'You\'re about to create a suspension proposal'
      if (this.suspend || this.withdraw) return 'Are you sure?'
      if (this.staging) return null
      if (this.withdrawed) return 'Withdrawn'
      if (this.suspended) return 'Suspended'
      if (this.archived) return 'Archived'
      if (this.expired) {
        if (this.accepted) return 'Accepted'
        return 'Rejected'
      }
      return this.title
    },
    colorConfig () {
      const config = {
        progress: '',
        icons: '',
        text: {}
      }

      if (this.expired) {
        config.progress = config.icons = 'white'
        config.text['text-white'] = true
        return config
      }

      if (this.unity > 0) {
        config.progress = config.icons = 'positive'
        config.text['text-positive'] = true
        return config
      }

      return undefined
    },
    colorConfigQuorum () {
      const config = {
        progress: '',
        icons: '',
        text: {}
      }

      if (this.expired) {
        config.progress = config.icons = 'white'
        config.text['text-white'] = true
        return config
      }

      return undefined
    },
    canBeSuspended () {
      return this.accepted && ['Assignbadge', 'Assignment', 'Role', 'Badge'].includes(this.type)
    },
    canBeApply () {
      return this.status === 'approved' && ['Badge', 'Role'].includes(this.type)
    },
    suspended () {
      return this.status === 'suspended'
    },
    archived () {
      return this.status === 'rejected'
    },
    proposed () {
      return this.status === 'proposed'
    },
    canBeWithdraw () {
      return this.accepted && ['Assignbadge', 'Assignment', 'Role', 'Badge'].includes(this.type) && this.active && this.approved
    },
    approved () {
      return this.status === 'approved'
    },
    withdrawed () {
      return this.status === 'withdrawed'
    }
  },

  methods: {
    ...mapActions('ballots', ['castVote']),

    async onCastVote (vote) {
      await this.castVote({
        docId: this.docId,
        vote
      })
      this.voting = false
      this.$emit('voting')
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
      this.voting = false
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
widget(:title="widgetTitle" noPadding :background="background" :textColor="expired || voting ? 'white' : 'primary'" :flatBottom="fixed").voting-widget.q-pt-xl
  template(v-slot:header v-if="!stagingToSuspend")
    .col.flex.justify-end.q-mx-md(:class="{'col-2': voting || suspend || withdraw}")
      .text-primary.q-my-auto(:class="{ 'text-white': (expired || voting) }" v-if="expired && !suspend && !stagingToSuspend && !withdraw") {{ timeLeftString }}
      q-icon.cursor-pointer.q-mb-xs.q-my-auto(name="fas fa-times" color="white" @click="onClose" size="sm" v-if="voting || suspend || withdraw")
  .q-mx-md.q-px-md.voting-body(:class="{ 'q-mt-xxl': !stagingToSuspend && !suspend && !staging && !voting && !withdraw}")
    proposal-staging(v-if="staging")
    proposal-suspended(v-if="stagingToSuspend" @publish="onSuspend" @changed="onChanged")
    .column.q-py-xl(v-else-if="voting")
      q-btn.q-mb-xxs(unelevated rounded no-caps color="white" text-color="primary" label="Yes" @click="onCastVote('pass')")
      q-btn.q-my-sm(unelevated rounded no-caps color="white" text-color="primary" label="Abstain" @click="onCastVote('abstain')")
      q-btn.q-mt-xxs(unelevated rounded no-caps color="white" text-color="primary" label="No" @click="onCastVote('fail')")
    .column.q-pt-xl(v-else-if="suspend")
      q-btn.q-mb-sm(unelevated rounded no-caps color="white" text-color="primary" label="Yes" @click="onYesSuspend")
      q-btn.q-mt-xxs(unelevated rounded no-caps color="white" text-color="primary" label="No" @click="suspend = false")
    .column.q-pt-xl(v-else-if="withdraw")
      q-btn.q-mb-sm(unelevated rounded no-caps color="white" text-color="primary" label="Yes" @click="onWithDraw")
      q-btn.q-mt-xxs(unelevated rounded no-caps color="white" text-color="primary" label="Yes" @click="withdraw = false")
    .column.justify-between(v-else)
      .row.full-width.q-mb-sm.q-mt-xs
        voting-result(:unity="unity" :quorum="quorum" :expired="expired" :colorConfig="colorConfig" :colorConfigQuorum="colorConfigQuorum")
      .row.justify-center.q-mb-sm.q-mt-sm
        q-btn.q-px-xl(v-if="!vote && proposed && !expired" no-caps rounded color="primary" @click="voting = !voting") Vote now
        q-btn.q-px-xl.full-width(v-if="vote && proposed && !approved" no-caps rounded color="white" outline :class="{ 'no-pointer-events': expired, ...backgroundButton }" :disable="proposed && expired" @click="voting = !voting") {{ voteString }}
         q-tooltip You can change your vote
        q-btn.q-mt-xs.full-width(v-if="proposed && active && accepted && expired" unelevated no-caps rounded color="white" text-color="positive" @click="onActive") Activate
        q-btn.q-mt-xs.full-width(v-if="expired && !accepted && active" unelevated no-caps rounded color="white" text-color="negative" @click="onActive") Archive
        q-btn.q-mt-md.full-width.text-bold(v-if="canBeApply" no-caps rounded unelevated color="white" text-color="positive" @click="onApply") Apply
        q-btn.q-mt-xs.full-width.h-btn2.no-pointer-events(v-if="!vote && expired" no-caps unelevated flat text-color="white") {{ voteString }}
        q-btn.full-width.text-bold.q-mt-xs.h-btn2(v-if="canBeSuspended && !proposed && !suspended" no-caps rounded flat unelevated color="white" text-color="white" @click="suspend = true" padding="5px") Suspend assignment
        q-btn.q-mt-xs.full-width.h-btn2(v-if="canBeWithdraw" no-caps unelevated flat text-color="white" padding="5px" @click="withdraw = true") Withdraw assignment
    .column.q-mb-xxl(v-if="!expired && !voting")
      .row.justify-center
        .text-body2.text-italic.text-body {{ timeLeftString }}
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
