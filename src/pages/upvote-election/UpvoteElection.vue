<script>
import CONFIG from './config.json'
export default {
  name: 'upvote-election',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue'),
    StepSignUp: () => import('./steps/StepSignUp.vue'),
    StepRound1: () => import('./steps/StepRound1.vue')
  },

  data () {
    return {
      config: Object.freeze(CONFIG),
      counterdown: undefined,
      endDate: '2023-03-20',
      currentStepIndex: 1,
      delegates: 50,
      users: [
        {
          name: 'User',
          id: 1
        },
        {
          name: 'User',
          id: 2
        },
        {
          name: 'User',
          id: 3
        },
        {
          name: 'User',
          id: 4
        },
        {
          name: 'User',
          id: 5
        },
        {
          name: 'User',
          id: 6
        },
        {
          name: 'User',
          id: 7
        },
        {
          name: 'User',
          id: 8
        }
      ],
      selectedUsers: [],
      votingState: false
    }
  },
  computed: {
    stepsBasedOnSelection () {
      const steps = {}

      // Merge step settings in from the selected config
      Object.values(this.config.steps).forEach((step) => {
        steps[step.key] = Object.assign({}, step)
      })

      // Return the steps in order
      return Object.values(steps).sort((a, b) => a.index - b.index)
    }
  },
  methods: {
    votingTimeLeft () {
      const end = new Date(this.endDate)
      const now = Date.now()
      const t = end - now
      return t
    },
    formatTimeLeft () {
      const MS_PER_DAY = 1000 * 60 * 60 * 24
      const MS_PER_HOUR = 1000 * 60 * 60
      const MS_PER_MIN = 1000 * 60
      const timeRemaining = this.votingTimeLeft()
      if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / MS_PER_DAY)
        let lesstime = timeRemaining - (days * MS_PER_DAY)
        const hours = Math.floor(lesstime / MS_PER_HOUR)
        lesstime = lesstime - (hours * MS_PER_HOUR)
        const min = Math.floor(lesstime / MS_PER_MIN)
        lesstime = lesstime - (min * MS_PER_MIN)
        return {
          days: days,
          hours: hours,
          mins: min
        }
      }
      return 0
    },
    selectUser (user) {
      if (!this.selectedUsers.find(compItem => compItem.id === user.id) && !this.votingState) {
        this.selectedUsers.push(user)
      }
    },
    vote () {
      if (!this.votingState) {
        this.votingState = true
      } else {
        this.votingState = false
        this.selectedUsers.length = 0
      }
      console.log(this.votingState)
    }
  },
  mounted () {
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
  },
  activated () {
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
  },
  deactivated () {
    clearInterval(this.counterdown)
  }
}
</script>

<template lang="pug">
.upvote-election
  .row.full-width.q-my-md.q-mt-lg
    .col-9
      q-card.widget.full-width.q-pa-xl.relative-position.rounded(flat)
        .row.items-center.q-mb-md
          .row.items-center.q-mr-md
            img(src="/svg/check-to-slot.svg" width="18px" height="14px")
            .h-h4.text-bold.q-ml-sm {{ stepsBasedOnSelection[currentStepIndex].label }}
            .font-lato.text-h-grey.q-ml-sm.text-weight-600(:style="{ 'font-size': '18px' }") {{ `Passing: ${delegates} Delegates` }}
          .counter
            .title Time left:
            .time.row
              .row.items-end
                .days {{ formatTimeLeft().days }}
                .subtext(v-if="formatTimeLeft().days > 1") days
                .subtext(v-else) day
              .row.items-end
                .hours {{ formatTimeLeft().hours }}
                .subtext(v-if="formatTimeLeft().hours > 1") hours
                .subtext(v-else) hour
              .row.items-end
                .mins {{ formatTimeLeft().mins }}
                .subtext(v-if="formatTimeLeft().mins > 1") mins
                .subtext(v-else) min
        template(v-for="step in stepsBasedOnSelection")
          component(
            v-if="(step.index - 1) === currentStepIndex"
            :is="step.component"
            :step="step"
            :users="users"
            :selectedUsers="selectedUsers"
            :votingState="votingState"
            @selectUser="selectUser"
          )
    .col-3.q-pl-md
      widget.q-pa-xxl.bg-secondary.q-mb-md(v-if="selectedUsers.length" rounded)
        .h-h4.text-white Cast your vote
        .text-white.q-my-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
        q-btn.q-px-lg.h-btn1.full-width(
          @click="vote"
          color="white"
          :label="votingState ? 'Revert / Change' : 'Vote!'"
          no-caps
          rounded
          text-color="primary"
          unelevated
        )
      creation-stepper.sticky(
        :steps="stepsBasedOnSelection"
        :activeStepIndex="currentStepIndex"
        title="Election process"
      )
</template>

<style lang="sass" scoped>
.rounded
  border-radius: 26px
.counter
  display: flex
  font-family: 'Lato', sans-serif
  font-weight: 600
  color: #3F64EE
  font-size: 18px
  .title
    margin-right: 25px
  .time
    .subtext
      font-size: 12px
      padding-bottom: 2px
      margin-right: 4px
</style>
