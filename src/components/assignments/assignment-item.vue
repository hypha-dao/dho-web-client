<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'assignment-item',
  components: {
    AssignmentClaimExtend: () => import('./assignment-claim-extend.vue'),
    AssignmentHeader: () => import('./assignment-header.vue'),
    // AssignmentSuspend: () => import('./assignment-suspend.vue'),
    // AssignmentWithdraw: () => import('./assignment-withdraw.vue'),
    PeriodCalendar: () => import('./period-calendar.vue'),
    Salary: () => import('./salary.vue'),
    Widget: () => import('../common/widget.vue')
  },

  props: {
    background: {
      type: String,
      default: 'grey-3'
    },
    proposal: undefined,
    expandable: Boolean,
    owner: Boolean,
    moons: Boolean,
    now: {
      type: Date,
      default: () => new Date()
    }
  },

  data () {
    return {
      expanded: false,
      newCommit: undefined,
      newDeferred: undefined,
      periods: undefined,
      claiming: false,
      committing: false,
      suspending: false,
      withdrawing: false,
      assignment: undefined
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao', 'daoSettings']),
    claims () {
      if (this.assignment?.periods) {
        return this.assignment.periods.reduce((result, p) => {
          if (!p.claimed && p.end < this.now) {
            return result + 1
          }
          return result
        }, 0)
      }

      return 0
    }
  },

  watch: {
    proposal: {
      handler: async function (proposal) {
        if (proposal) {
          this.assignment = await this.parseAssignment(proposal)
          this.newCommit = this.assignment.commit.value
          this.newDeferred = this.assignment.deferred.value
          this.periods = this.assignment.periods
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions('assignments', ['claimAssignmentPayment', 'adjustCommitment', 'adjustDeferred', 'suspendAssignment', 'withdrawFromAssignment']),

    async parseAssignment (data) {
      const periodCount = data.details_periodCount_i
      let periodResponse = await this.$apollo.query({
        query: require('../../query/periods/dao-periods-range.gql'),
        variables: {
          daoId: this.selectedDao.docId,
          min: data.start[0].details_startTime_t,
          max: new Date(new Date(data.start[0].details_startTime_t).getTime() +
            (data.details_periodCount_i * this.daoSettings.periodDurationSec * 1000)).toISOString()
        }
      })
      periodResponse = periodResponse.data.getDao.period.map((value, index) => {
        return {
          docId: value.docId,
          label: value.details_startTime_t,
          phase: value.details_label_s,
          startDate: value.details_startTime_t,
          endDate: periodResponse.data.getDao.period[index + 1]?.details_startTime_t
        }
      })

      // Calculate start and end time for all periods
      const start = new Date(periodResponse[0].startDate)

      // Add the periods
      const periods = []
      for (let i = 0; i < periodCount; i += 1) {
        const claimed = data.claimed
          ? data.claimed.some(c => c.docId === periodResponse[i].docId)
          : false
        periods.push({
          start: new Date(periodResponse[i].startDate),
          end: new Date(periodResponse[i].endDate),
          title: ['First Quarter', 'Full Moon', 'New Moon', 'Last Quarter'].includes(periodResponse[i].phase)
            ? periodResponse[i].phase
            : 'First Quarter',
          claimed: claimed
        })
      }

      // Add the assignment
      const commit = { value: 0, min: 0, max: data.details_timeShareX100_i }
      if (data.lastimeshare) {
        commit.value = data.lastimeshare[0].details_timeShareX100_i
      }
      const deferred = {
        value: data.details_deferredPercX100_i,
        min: data.details_approvedDeferredPercX100_i || data.details_deferredPercX100_i,
        max: 100
      }

      const lastEnd = periods[periods.length - 1].end
      // To ensure no disruption in assignment, an extension must be
      // created more than 1 voting period before it expires
      const VOTE_DURATION = this.daoSettings.votingDurationSeconds * 1000
      return {
        owner: this.username,
        docId: data.docId,
        start,
        end: lastEnd,
        active: start < Date.now() && lastEnd > Date.now(),
        past: lastEnd < Date.now(),
        future: start > Date.now(),
        periods,
        extend: {
          start: new Date(lastEnd - 3 * VOTE_DURATION),
          end: new Date(lastEnd - VOTE_DURATION)
        },
        title: data.details_title_s || data.role[0].details_title_s,
        description: data.details_description_s,
        commit,
        deferred,
        usdEquivalent: Number.parseFloat(data.role[0].details_annualUsdSalary_a),

        // Needed for 'extend' functionality
        minDeferred: data.role[0].details_minDeferredX100_i,
        roleTitle: data.role[0].details_title_s,
        startPeriod: periodResponse[0],
        url: undefined
      }
    },

    onClick () {
      if (this.owner) {
        if (this.expandable) {
          this.expanded = !this.expanded
        }
      }
      this.$emit('onClick')
    },

    async onClaimAll () {
      this.claiming = true
      let error = false
      let i = 0
      const numClaims = this.claims
      while (!error && i < numClaims) {
        error = !(await this.claimAssignmentPayment(this.assignment.docId))
        if (!error) {
          this.periods.find(p => !p.claimed).claimed = true
          i += 1
          // We need to wait briefly between transactions to avoid 'duplicate' error
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      this.claiming = false
      this.$emit('claim-all')
    },

    async onExtend () {
      this.$router.push({
        name: 'proposal-create'
      })
    },

    async onDynamicCommit (value) {
      this.committing = true
      if (await this.adjustCommitment({ hash: this.assignment.hash, commitment: value })) {
        this.newCommit = value
      }
      this.committing = false
    },

    async onDynamicDeferred (value) {
      this.committing = true
      if (await this.adjustDeferred({ hash: this.assignment.hash, deferred: value })) {
        this.newDeferred = value
        this.$emit('change-deferred', value)
      }
      this.committing = false
    },

    async onSuspend (reason) {
      this.suspending = true
      if (await this.suspendAssignment({ hash: this.assignment.hash, reason })) {
        if (this.$router.currentRoute.path !== '/documents-proposal/assignment') {
          await this.$router.push({ path: '/documents-proposal/assignment' })
        }
      }
      this.suspending = false
    },

    async onWithdraw (notes) {
      this.withdrawing = true
      if (await this.withdrawFromAssignment({ hash: this.assignment.hash, notes })) {
        // TODO: Update assignment to say 'Withdrawn' ??
      }
      this.withdrawing = false
    }
  }
}
</script>

<template lang="pug">
widget(noPadding :background="background" :class="{ 'cursor-pointer': owner }" @click.native="owner && onClick()").q-px-sm
  .flex.justify-center(:class="{item: !expandable, 'item-expandable': expandable}")
    // q-btn.absolute-top-right.q-ma-md(v-if="!owner && assignment.active"
      icon="fas fa-ban" color="negative" flat round size="sm" :ripple="false")
      q-popup-proxy(anchor="bottom right" self="top right" :breakpoint="600" content-class="rounded-borders")
        assignment-suspend.bg-white(
          :owner="assignment.owner"
          :title="assignment.title"
          :submitting="suspending"
          :style="{ 'max-width': '400px' }"
          @suspend="onSuspend"
        )
    assignment-header.q-px-lg(
      v-if="assignment"
      v-bind="assignment"
      calendar
      :claims="claims"
      :claiming="claiming"
      :commit="{ min: assignment.commit.min, value: newCommit, max: assignment.commit.max }"
      :deferred="{ min: assignment.deferred.min, value: newDeferred, max: assignment.deferred.max }"
      :periods="periods"
      :expanded="expanded"
      :moons="moons"
      :owner="owner"
      @claim-all="onClaimAll"
      @view-proposal="onClick"
      @extend="onExtend"
    )
    //- q-slide-transition
    //-   div(v-show="expanded")
    //-     .col-12.q-my-md.q-px-sm(:class="{'q-px-md': $q.screen.gt.xs }")
    //-       salary(
    //-         v-if="assignment"
    //-         :active="assignment.active"
    //-         assignment
    //-         :owner="owner"
    //-         :tokens="assignment.tokens"
    //-         :commit="{ min: assignment.commit.min, value: newCommit, max: assignment.commit.max }"
    //-         :deferred="{ min: assignment.deferred.min, value: newDeferred, max: assignment.deferred.max }"
    //-         :submitting="committing"
    //-         @change-commit="onDynamicCommit"
    //-         @change-deferred="onDynamicDeferred"
    //-       )
        // .col-12.q-my-md.q-px-sm(v-if="assignment.active" :class="{'q-px-md': $q.screen.gt.xs }")
          assignment-withdraw(v-if="owner"
            :submitting="withdrawing"
            @withdraw="onWithdraw"
          )
          assignment-suspend(v-else
            :owner="assignment.owner"
            :title="assignment.title"
            :submitting="suspending"
            @suspend="onSuspend"
          )
        // .col-12
          assignment-claim-extend(
            :claims="claims"
            :extend="assign.extend"
            :stacked="$q.screen.xs" @claim-all="onClaimAll" @extend="onExtend")
    .row.justify-center(v-if="owner && expandable")
      q-icon.expand-icon(:name="'fas fa-chevron-down' + (expanded ? ' fa-rotate-180' : '')" color="grey-7")
</template>

<style lang="stylus" scoped>
.expand-icon
  margin-top 16px
  margin-bottom -12px
  transition transform 0.5s
.item
  height: 143px
.item-expandable
  min-height 170px
  height auto
  padding 24px 0
</style>
