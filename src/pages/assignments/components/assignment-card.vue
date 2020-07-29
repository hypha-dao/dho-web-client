<script>
import { format } from '~/mixins/format'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import showdown from 'showdown'

export default {
  name: 'assignment-card',
  mixins: [format],
  props: {
    assignment: { type: Object, required: true },
    readonly: { type: Boolean, required: false }
  },
  data () {
    return {
      role: null,
      profile: null,
      details: false,
      claiming: false,
      currentPeriod: null,
      countdown: '',
      timeout: null,
      claims: []
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('roles', ['fetchRole']),
    ...mapActions('assignments', ['getClaimedPeriods', 'claimAssignmentPayment', 'suspendAssignment']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('periods', ['getPeriodByDate']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentView',
        data: {
          role: this.role,
          assignment: this.assignment
        }
      })
    },
    async onSuspendAssignment () {
      await this.suspendAssignment(this.assignment.id)
      await this.$router.push({ path: '/proposals/assignment' })
    },
    async onClaimAssignmentPayment () {
      this.claiming = true
      await this.claimAssignmentPayment({
        assignment: this.assignment.id,
        periods: this.claims
      })
      await this.verifyClaim()
      this.claiming = false
    },
    async verifyClaim () {
      this.currentPeriod = await this.getPeriodByDate(new Date())
      this.claims = []
      let tmp = []
      const maxId = this.currentPeriod.period_id
      const minPeriod = await this.getPeriodByDate(new Date(this.assignment.created_date))
      for (let i = Math.max(this.startPeriod, (minPeriod && minPeriod.period_id) || 0); i < Math.min(maxId, this.endPeriod); i += 1) {
        tmp.push(i)
      }
      const claimedPeriods = await this.getClaimedPeriods(this.assignment.id)
      if (claimedPeriods) {
        claimedPeriods.forEach(c => {
          tmp = tmp.filter(id => id !== c.period_id)
        })
      }
      this.claims = tmp
      if (!tmp.length && !this.isExpired) {
        this.timeout = setInterval(this.updateCountdown, 1000)
      }
    },
    updateCountdown () {
      const end = new Date(this.currentPeriod.start_date).getTime()
      const now = Date.now() + new Date().getTimezoneOffset() * 60000
      const t = end - now
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
      const converter = new showdown.Converter()
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentForm',
        data: {
          role: this.role,
          id: this.assignment.id,
          description: converter.makeHtml(this.assignment.strings.find(o => o.key === 'description').value),
          url: this.url,
          salaryCommitted: this.minCommitted,
          salaryDeferred: this.minDeferred,
          salaryInstantHUsd: this.instantHUsd,
          startPeriod: this.assignment.ints.find(o => o.key === 'start_period'),
          endPeriod: this.assignment.ints.find(o => o.key === 'end_period'),
          cycles: null,
          edit: true
        }
      })
    },
    getExpire (offset) {
      const data = this.assignment.ints.find(o => o.key === 'end_period')
      if (data) {
        const endPeriod = this.periods.find(p => p.period_id === data.value)
        if (endPeriod) {
          if (Date.now() + new Date().getTimezoneOffset() * 60000 + offset > new Date(endPeriod.start_date).getTime()) {
            return true
          }
        }
      }
      return false
    }
  },
  async mounted () {
    this.role = await this.fetchRole(this.assignment.ints.find(i => i.key === 'role_id').value)
    this.profile = await this.getPublicProfile(this.owner)
    if (this.account === this.owner) {
      await this.verifyClaim()
    }
  },
  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated']),
    ...mapGetters('periods', ['periods', 'periodOptionsStart']),
    ...mapGetters('search', ['search']),
    isFiltered () {
      if (this.search) {
        if (this.role) {
          if (
            this.getObjValue(this.role, 'names', 'owner').includes(this.search) ||
            this.getObjValue(this.role, 'strings', 'title').includes(this.search) ||
            this.getObjValue(this.role, 'strings', 'description').includes(this.search)
          ) {
            return true
          }
        }
        return this.getObjValue(this.assignment, 'names', 'owner').includes(this.search) ||
          this.getObjValue(this.assignment, 'strings', 'description').includes(this.search)
      }
      return true
    },
    title () {
      if (this.role) {
        return this.role.strings.find(s => s.key === 'title').value
      }
      return ''
    },
    owner () {
      const data = this.assignment.names.find(o => o.key === 'assigned_account')
      return (data && data.value) || ''
    },
    minCommitted () {
      const data = this.assignment.ints.find(o => o.key === 'time_share_x100')
      return (data && data.value && data.value) || 0
    },
    minDeferred () {
      const data = this.assignment.ints.find(o => o.key === 'deferred_perc_x100')
      return (data && data.value && data.value) || 0
    },
    instantHUsd () {
      const data = this.assignment.ints.find(o => o.key === 'instant_husd_perc_x100')
      return (data && data.value && data.value) || 0
    },
    startPeriod () {
      const obj = this.assignment.ints.find(o => o.key === 'start_period')
      return obj && obj.value
    },
    endPeriod () {
      const obj = this.assignment.ints.find(o => o.key === 'end_period')
      return obj && obj.value
    },
    willExpire () {
      return this.getExpire(15 * 24 * 60 * 60 * 1000)
    },
    isExpired () {
      return this.getExpire(0)
    }
  }
}
</script>

<template lang="pug">
q-card.assignment(v-if="isFiltered")
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
          v-if="account === owner"
          clickable
          v-close-popup
          @click="editObject"
        )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-pencil-alt" size="14px")
          q-item-section Edit
        q-item(
          v-if="account !== owner"
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
            q-icon(name="fas fa-stop-circle" size="14px")
          q-item-section Suspend
  q-img.owner-avatar(
    v-if="profile && profile.publicData.avatar"
    :src="profile.publicData.avatar"
    @click="$router.push({ path: `/@${owner}`})"
  )
    q-tooltip {{ (profile.publicData && profile.publicData.name) || owner }}
  q-avatar.owner-avatar(
    v-else
    size="40px"
    color="accent"
    text-color="white"
    @click="$router.push({ path: `/@${owner}`})"
  )
    | {{ owner.slice(0, 2).toUpperCase() }}
    q-tooltip {{ (profile && profile.publicData && profile.publicData.name) || owner }}
  q-card-section.text-center.q-pb-sm
    img.icon(src="~assets/icons/assignments.svg")
  q-card-section
    .type(@click="showCardFullContent") Assignment
    .title(@click="showCardFullContent") {{ title }}
    .date Started the {{ new Date (assignment.created_date).toLocaleDateString() }}
  q-card-actions.q-pa-lg.actions(v-if="account === owner" align="center")
    .flex.justify-around.full-width
      q-btn(
        v-if="claims.length"
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
  transition transform 0.3s cubic-bezier(0.005, 1.65, 0.325, 1) !important
  transform scale(1.2) translate(0px, 40px) !important
  -moz-transform scale(1.2) translate(0px, 40px)
  -webkit-transform scale(1.2) translate(0px, 40px)
  z-index 10
  box-shadow 0 4px 8px rgba(0,0,0,0.2), 0 5px 3px rgba(0,0,0,0.14), 0 3px 3px 3px rgba(0,0,0,0.12)
  .owner-avatar
    z-index 110
.owner-avatar
  cursor pointer
  position absolute
  border-radius 50% !important
  right 40px
  top 10px
  width 40px
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
.icon
  margin-top 20px
  width 100%
  max-width 100px
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
</style>
