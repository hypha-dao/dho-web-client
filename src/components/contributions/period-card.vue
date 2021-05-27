<script>
export default {
  name: 'period-card',
  components: {
    ButtonCard: () => import('~/components/common/button-card.vue')
  },

  props: {
    title: String,
    start: Date,
    end: Date,
    claimed: Boolean,
    extend: Boolean,
    /**
     * This is generally only needed for testing (allowing the
     * current date to be overridden so the test view is the same)
     */
    now: {
      type: Date,
      default: new Date()
    }
  },

  computed: {
    color () {
      if (this.start > this.now) return 'accent'
      return 'primary'

      /*
      if (this.start > this.now || this.end < this.now) {
        return 'accent'
      }
      return 'primary'
      */
    },

    icon () {
      /* eslint-disable no-multi-spaces */
      switch (this.title) {
        case 'First Quarter': return 'fas fa-adjust'
        case 'Full Moon':     return 'fas fa-circle'
        case 'Last Quarter':  return 'fas fa-adjust fa-rotate-180'
        case 'New Moon':      return 'far fa-circle'
        default:              return 'fas fa-circle'
      }
      /* eslint-enable no-multi-spaces */
    },

    chip () {
      // Future
      if (this.start > this.now) {
        if (this.extend) {
          return {
            label: 'Extend',
            color: 'accent',
            text: 'white'
          }
        }

        return undefined
      }

      // Past
      if (this.end < this.now) {
        if (this.claimed) {
          return {
            label: 'Paid',
            color: 'accent',
            outline: true,
            icon: {
              name: 'fas fa-check',
              color: 'positive'
            }
          }
        } else {
          return {
            label: 'Claim',
            color: 'accent',
            text: 'white'
          }
        }
      }

      // Current Period
      if (this.extend) {
        return {
          label: 'Extend',
          color: 'primary',
          text: 'white'
        }
      }

      return undefined
    },

    dateString () {
      if (!this.start || !this.end) {
        return ''
      }

      const options = { month: 'short', day: 'numeric' }
      return `${this.start.toLocaleDateString(undefined, options)} - ${this.end.toLocaleDateString(undefined, options)}`
    }
  }
}
</script>

<template lang="pug">
button-card(
  :color="color"
  :outline="true"
  :disable="start > now"
  :title="title"
  :subtitle="dateString"
  :icon="icon"
  :chip="chip"
  :clickable="false"
)
</template>
