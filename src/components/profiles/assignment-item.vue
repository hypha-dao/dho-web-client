<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'assignment-item',
  components: {
    AssignmentClaimExtend: () => import('./assignment-claim-extend.vue'),
    AssignmentHeader: () => import('./assignment-header.vue'),
    PeriodCalendar: () => import('~/components/contributions/period-calendar.vue'),
    SalaryFieldset: () => import('~/components/contributions/salary-fieldset.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    assignment: {
      type: Object,
      default: () => {
        return {
          periods: []
        }
      }
    },
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
      newCommit: this.assignment.commit.value,
      periods: this.assignment.periods,
      claiming: false,
      committing: false
    }
  },

  computed: {
    claims () {
      return this.assignment.periods.reduce((result, p) => {
        if (!p.claimed && p.end < this.now) {
          return result + 1
        }
        return result
      }, 0)
    }
  },

  methods: {
    ...mapActions('assignments', ['claimAssignmentPayment', 'adjustCommitment', 'suspendAssignment', 'withdrawFromAssignment']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),

    onClick () {
      if (this.owner) {
        this.expanded = !this.expanded
      }
    },

    async onClaimAll () {
      this.claiming = true
      let error = false
      let i = 0
      const numClaims = this.claims
      while (!error && i < numClaims) {
        error = !(await this.claimAssignmentPayment(this.assignment.hash))
        if (!error) {
          this.periods.find(p => !p.claimed).claimed = true
          i += 1
          // We need to wait briefly between transactions to avoid 'duplicate' error
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      this.claiming = false
    },

    async onExtend () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentForm',
        data: {
          hash: this.assignment.hash,
          // role: this.role,
          title: this.assignment.title,
          minDeferred: this.assignment.minDeferred,
          usdEquity: this.assignment.usdEquivalent,
          url: this.assignment.url,
          salaryCommitted: this.assignment.commit.value,
          salaryDeferred: this.assignment.deferred,
          startPeriod: this.assignment.startPeriod,
          periodCount: this.periods.length,
          edit: true
        }
      })
    },

    async onDynamicCommit (value) {
      this.committing = true
      if (await this.adjustCommitment({ hash: this.assignment.hash, commitment: value })) {
        this.newCommit = value
      }
      this.committing = false
    },

    async onSuspend () {
      // TODO: Need UI to enable this action
      if (await this.suspendAssignment(this.assignment.hash)) {
        if (this.$router.currentRoute.path !== '/documents-proposal/assignment') {
          await this.$router.push({ path: '/documents-proposal/assignment' })
        }
      }
    },

    async onWithdraw (notes) {
      // TODO: Need UI to enable this action
      if (await this.suspendAssignment({ hash: this.assignment.hash, notes })) {
        // TODO: Update assignment to say 'Withdrawn' ??
      }
    }
  }
}
</script>

<template lang="pug">
widget(shadow noPadding :class="{ 'cursor-pointer': owner }" @click.native="onClick()")
  assignment-header.q-px-sm(
    v-bind="assignment"
    :class="{'q-px-md': $q.screen.gt.xs }"
    calendar
    :claims="claims"
    :claiming="claiming"
    :commit="{ min: assignment.commit.min, value: newCommit, max: assignment.commit.max }"
    :periods="periods"
    :expanded="expanded"
    :moons="moons"
    :show-buttons="owner"
    @claim-all="onClaimAll"
    @extend="onExtend"
  )
  q-slide-transition
    div(v-show="expanded")
      .col-12.q-my-md.q-px-sm(:class="{'q-px-md': $q.screen.gt.xs }")
        salary-fieldset(
          :active="assignment.active"
          :tokens="assignment.tokens"
          :commit="{ min: assignment.commit.min, value: newCommit, max: assignment.commit.max }"
          :submitting="committing"
          @change-commit="onDynamicCommit"
        )
      // .col-12
        assignment-claim-extend(
          :claims="claims"
          :extend="assign.extend"
          :stacked="$q.screen.xs" @claim-all="onClaimAll" @extend="onExtend")
  .row.justify-center(v-if="owner")
    q-icon.expand-icon(:name="'fas fa-chevron-down' + (expanded ? ' fa-rotate-180' : '')" color="grey-7")
</template>

<style lang="stylus" scoped>
.expand-icon
  margin-top 16px
  margin-bottom -12px
  transition transform 0.5s
</style>
