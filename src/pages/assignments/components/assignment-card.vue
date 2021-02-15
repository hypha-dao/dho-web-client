<script>
import { format } from '~/mixins/format'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BadgeAssignmentsStack from '~/components/documents-parts/badge-assignments-stack'
import { documents } from '~/mixins/documents'
import TopRightIcon from '~/components/documents-parts/top-right-icon'

export default {
  name: 'assignment-card',
  mixins: [documents, format],
  components: { TopRightIcon, BadgeAssignmentsStack },
  props: {
    assignment: { type: Object, required: true },
    history: { type: Boolean, required: false }
  },
  data () {
    return {
      profile: null,
      role: null,
      showClaim: false,
      claiming: false,
      currentPeriod: null,
      timeout: null,
      countdown: '',
      withdrawNotes: null
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('assignments', ['getClaimedPeriods', 'claimAssignmentPayment', 'suspendAssignment', 'withdrawFromAssignment']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('roles', ['loadRole']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentView',
        data: this.assignment
      })
    },
    async onSuspendAssignment () {
      await this.suspendAssignment(this.assignment.id)
      if (this.$router.currentRoute.path !== '/documents-proposals/assignment') {
        await this.$router.push({ path: '/documents-proposals/assignment' })
      }
    },
    async onWithdrawFromAssignment () {
      await this.withdrawFromAssignment({ id: this.assignment.id, notes: this.withdrawNotes })
      if (this.$router.currentRoute.path !== '/documents-proposals/assignment') {
        await this.$router.push({ path: '/documents-proposals/assignment' })
      }
    },
    async onClaimAssignmentPayment () {
      this.claiming = true
      await this.claimAssignmentPayment(this.assignment.hash)
      await this.verifyClaim()
      this.claiming = false
    },
    async verifyClaim () {
      const maxIdx = this.getPeriodIndexByDate(new Date())
      const maxCount = this.getMaxCurrentPeriodCount({ value: this.startPhase.value, periodCount: this.periodCount, maxIdx })
      this.showClaim = maxCount > (this.assignment.claimed && this.assignment.claimed.length) || 0

      if (!this.showClaim && !this.isExpired) {
        this.currentPeriod = await this.getPeriodByDate(new Date())
        if (!this.currentPeriod) return
        this.timeout = setInterval(this.updateCountdown, 1000)
      }
    },
    updateCountdown () {
      const end = new Date(this.currentPeriod.endDate + 'Z').getTime()
      const t = end - Date.now()
      if (t >= 0) {
        const days = Math.floor(t / (1000 * 60 * 60 * 24))
        const hours = `0${Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2)
        const mins = `0${Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2)
        const secs = `0${Math.floor((t % (1000 * 60)) / 1000)}`.slice(-2)
        if (days) {
          this.countdown = `${days}d `
        } else {
          this.countdown = ''
        }
        this.countdown += `${hours}:${mins}:${secs}`
      } else {
        this.countdown = ''
        setTimeout(this.verifyClaim, 2000)
        clearInterval(this.timeout)
      }
    },
    editObject () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentView',
        data: this.assignment
      })
    },
    getExpire (offset) {
      const data = this.endPhase
      if (data) {
        const endPeriod = this.periods.find(p => p.value === data.value)
        if (endPeriod) {
          if (Date.now() + new Date().getTimezoneOffset() * 60000 + offset > new Date(endPeriod.startDate.slice(0, -4) + 'Z').getTime()) {
            return true
          }
        }
      }
      return false
    }
  },
  async mounted () {
    this.profile = await this.getPublicProfile(this.assignee)
    // if (this.account === this.assignee) {
    await this.verifyClaim()
    // }
  },
  beforeDestroy () {
    if (this.timeout) {
      clearInterval(this.timeout)
    }
  },
  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated']),
    ...mapGetters('periods', ['periods', 'getEndPeriod', 'getPeriodByDate', 'getPeriodIndexByDate', 'getMaxCurrentPeriodCount']),
    ...mapGetters('search', ['search']),
    isFiltered () {
      if (this.search) {
        if (this.role) {
          if (
            this.getObjValue(this.role, 'names', 'proposer').includes(this.search) ||
            this.getObjValue(this.role, 'strings', 'title').includes(this.search) ||
            this.getObjValue(this.role, 'strings', 'description').includes(this.search)
          ) {
            return true
          }
        }
        return this.getObjValue(this.assignment, 'names', 'assignee').includes(this.search) ||
          this.getObjValue(this.assignment, 'strings', 'description').includes(this.search)
      }
      return true
    },
    title () {
      return this.role && this.getValue(this.role, 'details', 'title')
    },
    url () {
      return this.getValue(this.assignment, 'details', 'url')
    },
    assignee () {
      return this.getValue(this.assignment, 'details', 'assignee')
    },
    roleId () {
      return this.getValue(this.assignment, 'details', 'role')
    },
    startPhase () {
      const period = this.getValue(this.assignment, 'details', 'start_period')
      if (period) {
        return this.periods.find(p => p.value === period)
      }
      return null
    },
    periodCount () {
      return this.getValue(this.assignment, 'details', 'period_count')
    },
    endPhase () {
      return this.getEndPeriod({ value: this.startPhase.value, periodCount: this.periodCount })
    },
    isExpired () {
      return this.endPhase && new Date(this.endPhase.endDate).getTime() < Date.now()
    },
    annualSalary () {
      return this.role && this.getValue(this.role, 'details', 'annual_usd_salary')
    }
  },
  watch: {
    roleId: {
      immediate: true,
      async handler (val) {
        this.role = val && await this.loadRole(val)
      }
    }
  }
}
</script>

<template lang="pug">
q-card.assignment(v-if="isFiltered && ((isExpired && history) || (!isExpired && !history))")
  .ribbon(v-if="isExpired")
    span.text-white.bg-red EXPIRED
  q-btn.card-menu(
    icon="fas fa-ellipsis-v"
    color="grey"
    flat
    dense
    round
    no-caps
    :ripple="false"
    style="width:40px;height:40px;margin: 4px;"
  )
    q-menu
      q-list(dense)
        q-item(
          v-if="account === assignee"
          clickable
          v-close-popup
          @click="editObject"
        )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-pencil-alt" size="14px")
          q-item-section Edit
        q-item(
          v-if="account !== assignee"
          clickable
        )
          q-popup-proxy
            .confirm.column.q-pa-sm
              | Are you sure you want to suspend this assignment?
              .row.flex.justify-between.q-mt-sm
                q-btn(
                  color="primary"
                  label="No"
                  dense
                  flat
                  v-close-popup="-1"
                )
                q-btn(
                  color="primary"
                  label="Yes"
                  dense
                  @click="onSuspendAssignment"
                  v-close-popup="-1"
                )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-hand-paper" size="14px")
          q-item-section Suspend
        q-item(
          v-if="account === assignee"
          clickable
        )
          q-popup-proxy
            .confirm.column.q-pa-sm
              | Are you sure you want to withdraw from this assignment?
              q-input(
                v-model="withdrawNotes"
                label="Notes"
              )
              .row.flex.justify-between.q-mt-sm
                q-btn(
                  color="primary"
                  label="No"
                  dense
                  flat
                  v-close-popup="-1"
                )
                q-btn(
                  color="primary"
                  label="Yes"
                  dense
                  @click="onWithdrawFromAssignment"
                  v-close-popup="-1"
                )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-times" size="14px")
          q-item-section Withdraw
  top-right-icon(type="assignment")
  q-card-section.text-center.q-pb-sm.relative-position
    badge-assignments-stack.badge-stack(v-if="assignee" :username="assignee")
    q-img.avatar(
      v-if="profile && profile.publicData.avatar"
      :src="profile.publicData.avatar"
      @click="$router.push({ path: `/@${assignee}`})"
    )
    q-avatar.avatar(
      v-else
      size="150px"
      color="accent"
      text-color="white"
      @click="$router.push({ path: `/@${assignee}`})"
    )
      | {{ assignee.slice(0, 2).toUpperCase() }}
    .salary-bucket.bg-proposal(v-if="annualSalary") {{ getSalaryBucket(parseInt(annualSalary)) }}
  q-card-section
    .type(@click="showCardFullContent") {{ (profile && profile.publicData && profile.publicData.name) || assignee }}
    .title(@click="showCardFullContent") {{ title }}
    .date Started the {{ new Date (startPhase.startDate).toLocaleDateString() }}
  q-card-actions.q-pa-lg.actions(v-if="account === assignee" align="center")
    .flex.justify-around.full-width
      q-btn(
        v-if="showClaim"
        label="Claim"
        color="assignment"
        :loading="claiming"
        rounded
        dense
        unelevated
        @click="onClaimAssignmentPayment"
      )
    .countdown.q-mt-sm(v-if="countdown !== '' && !isExpired")
      q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
      | Next claim in {{ countdown }}
</template>

<style lang="stylus" scoped>
.assignment
  width 300px
  border-radius 1rem
  margin 10px
.assignment:hover
  z-index 10
  box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
  .avatar, .salary-bucket
    z-index 110
.avatar
  margin-top 20px
  cursor pointer
  border-radius 50% !important
  width 150px
  height 150px
.salary-bucket
  position absolute
  bottom 10px
  right 80px
  color white
  font-size 28px
  font-weight 700
  border-radius 50%
  width 45px
.description
  white-space pre-wrap
  max-height 55px
  overflow auto
.type
  cursor pointer
  text-transform capitalize
  text-align center
  font-weight 800
  font-size 28px
.title
  cursor pointer
  text-align center
  font-size 20px
  color $grey-6
  line-height 22px
.date
  margin-top 5px
  text-align right
  font-size 14px
  color $grey-6
  line-height 22px
.actions
  button
    width 45%
.card-menu
  position absolute
  right 0
  top 7px
  width 20px
  z-index 110
  /deep/.q-focus-helper
    display none !important
.badge-stack
  top 40px
</style>
