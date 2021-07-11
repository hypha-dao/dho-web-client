<script>
import { mapActions, mapMutations } from 'vuex'

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
    assignment: {
      type: Object,
      default: () => {
        return {
          commit: {
            min: 0,
            value: 0,
            max: 100
          },
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
      committing: false,
      suspending: false,
      withdrawing: false
    }
  },

  computed: {
    claims () {
      if (this.assignment.periods) {
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
      this.$emit('claim-all')
    },

    async onExtend () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentForm',
        data: {
          hash: this.assignment.hash,
          // role: this.role,
          title: this.assignment.title,
          roleTitle: this.assignment.roleTitle,
          description: this.assignment.description,
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
widget(shadow noPadding :class="{ 'cursor-pointer': owner }" @click.native="onClick()").relative-position
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
    :owner="owner"
    :show-buttons="owner"
    @claim-all="onClaimAll"
    @extend="onExtend"
  )
  q-slide-transition
    div(v-show="expanded")
      .col-12.q-my-md.q-px-sm(:class="{'q-px-md': $q.screen.gt.xs }")
        salary(
          :active="assignment.active"
          assignment
          :owner="owner"
          :tokens="assignment.tokens"
          :commit="{ min: assignment.commit.min, value: newCommit, max: assignment.commit.max }"
          :submitting="committing"
          @change-commit="onDynamicCommit"
        )
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
  .row.justify-center(v-if="owner")
    q-icon.expand-icon(:name="'fas fa-chevron-down' + (expanded ? ' fa-rotate-180' : '')" color="grey-7")
</template>

<style lang="stylus" scoped>
.expand-icon
  margin-top 16px
  margin-bottom -12px
  transition transform 0.5s
</style>
