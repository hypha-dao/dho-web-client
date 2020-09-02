<script>
import removeMd from 'remove-markdown'
import { format } from '~/mixins/format'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import showdown from 'showdown'

export default {
  name: 'role-card',
  mixins: [format],
  props: {
    role: { type: Object, required: true }
  },
  data () {
    return {
      loading: true,
      countdown: '',
      timeout: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    ...mapGetters('periods', ['periods']),
    ...mapGetters('periods', ['periodOptionsStart']),
    title () {
      const data = this.role.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    description () {
      const data = this.role.strings.find(o => o.key === 'description')
      if (data) {
        return removeMd(data.value).replace(/\n/g, ' ')
      }
      return ''
    },
    url () {
      const data = this.role.strings.find(o => o.key === 'url')
      return (data && data.value !== 'null' && data.value) || null
    },
    owner () {
      const data = this.role.names.find(o => o.key === 'owner')
      return (data && data.value !== 'null' && data.value) || null
    },
    minDeferred () {
      const data = this.role.ints.find(o => o.key === 'min_deferred_x100')
      return (data && !isNaN(data.value) && data.value) || ''
    },
    usdEquity () {
      const data = this.role.assets.find(o => o.key === 'annual_usd_salary')
      return (data && data.value && parseFloat(data.value).toFixed(2)) || ''
    },
    ftCapacity () {
      const data = this.role.ints.find(o => o.key === 'fulltime_capacity_x100')
      return (data && data.value && `${(data.value / 100).toFixed(1)}`) || ''
    },
    endPhase () {
      const obj = this.role.ints.find(o => o.key === 'end_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    willExpire () {
      // 12 months extension
      return this.getExpire(-335 * 24 * 60 * 60 * 1000)
    },
    isExpired () {
      // 12 months extension
      return this.getExpire(-365 * 24 * 60 * 60 * 1000)
    }
  },
  async mounted () {
    this.loading = false
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('roles', ['suspendRole']),
    async onSuspendRole () {
      await this.suspendRole(this.role.id)
      await this.$router.push({ path: '/proposals/role' })
    },
    getExpire (offset) {
      const data = this.role.ints.find(o => o.key === 'end_period')
      if (data) {
        const endPeriod = this.periods.find(p => p.period_id === data.value)
        if (endPeriod) {
          if (Date.now() + new Date().getTimezoneOffset() * 60000 + offset > new Date(endPeriod.start_date).getTime()) {
            return true
          }
        }
      }
      return false
    },
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'roleView',
        data: this.role
      })
    },
    openApplicationForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentForm',
        data: {
          type: 'new',
          role: this.role
        }
      })
    },
    editObject () {
      const converter = new showdown.Converter()
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'roleForm',
        data: {
          id: this.role.id,
          title: this.title,
          description: converter.makeHtml(this.role.strings.find(o => o.key === 'description').value),
          url: this.url,
          salaryDeferred: this.minDeferred,
          salaryUsd: this.usdEquity,
          salaryCapacity: this.ftCapacity,
          startPeriod: this.role.ints.find(o => o.key === 'start_period'),
          endPeriod: this.role.ints.find(o => o.key === 'end_period'),
          cycles: null,
          edit: true
        }
      })
    },
    updateCountdown () {
      const end = new Date(this.endPhase.start_date).getTime() + 365 * 24 * 60 * 60 * 1000
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
        this.countdown = 'Role expired'
        clearInterval(this.timeout)
      }
    }
  },
  watch: {
    willExpire: {
      immediate: true,
      handler (val) {
        if (val) {
          this.timeout = setInterval(this.updateCountdown, 1000)
        } else {
          clearTimeout(this.timeout)
        }
      }
    }
  }
}
</script>

<template lang="pug">
q-card.role
  .ribbon(v-if="isExpired")
    span.text-white.bg-red EXPIRED
  .ribbon(v-else)
    span.text-white.bg-hire NOW HIRING
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
              | Are you sure you want to suspend this role?
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
                  @click="onSuspendRole"
                  v-close-popup="-1"
                )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-hand-paper" size="14px")
          q-item-section Suspend
  .column.fit.flex.justify-between
    div
      q-card-section.text-center.q-pb-sm(@click="showCardFullContent")
        img.icon(src="~assets/icons/roles.svg")
      q-card-section
        .type(@click="showCardFullContent") Role
        .title(@click="showCardFullContent") {{ title }}
    div
      q-card-actions.q-pa-lg.role-actions
        .flex.justify-around.full-width
          q-btn(
            v-if="!isExpired"
            :disable="!isAuthenticated"
            label="Apply"
            color="hire"
            @click="openApplicationForm"
            rounded
            dense
            unelevated
          )
        .countdown.q-mt-sm(v-if="countdown !== '' && !isExpired")
          q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
          | The role will expire in {{ countdown }}
</template>

<style lang="stylus" scoped>
.role
  width 300px
  border-radius 1rem
  margin 10px
.role:hover
  z-index 10
  box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
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
.icon
  margin-top 20px
  width 100%
  max-width 100px
.role-actions
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
