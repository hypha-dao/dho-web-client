<script>
/**
 * A pair of buttons for claiming and extending an assignment
 * that appears only on a user's own assignments
 */
export default {
  name: 'assignment-claim-extend',

  props: {
    /**
     * The number of available periods to claim
     */
    claims: {
      type: Number,
      default: 0
    },
    /**
     * Whether we are processing the claim action
     */
    claiming: Boolean,
    /**
     * An object with a start and end date containing
     * the time period when extending is allowed
     */
    extend: {
      type: Object,
      default: () => {
        return {
          start: null,
          end: null
        }
      }
    },
    /**
     * Whether the buttons are stacked (side-by-side if false)
     */
    stacked: Boolean,
    /**
     * The current date, only needs to provided for testing purposes
     */
    now: {
      type: Date,
      default: () => new Date()
    }
  },

  computed: {
    extendable () {
      return this.extend && this.extend.start < this.now && this.extend.end > this.now
    },

    extendLabel () {
      const options = { month: 'short', day: 'numeric' }
      if (this.extend.start && this.extend.start > this.now) {
        return `Extend after ${this.extend.start.toLocaleDateString('en-US', options)}`

        /*
          // This alternative shows 'Extend in XX days'
          const MS_PER_DAY = 24 * 60 * 60 * 1000
          const days = (this.extend.start.getTime() - this.now.getTime()) / MS_PER_DAY
          if (days > 1) {
            return `Extend after ${Math.floor(days)} day${(days > 2) ? 's' : ''}`
          }
        */
      }

      if (this.extend.end && this.extend.end > this.now) {
        return `Extend before ${this.extend.end.toLocaleDateString('en-US', options)}`
      }

      return 'You must re-apply'
    }
  }
}
</script>

<template lang="pug">
div
  .row
    .q-mr-sm(:class="{ 'col-12': stacked, 'col-6': !stacked }")
      q-btn.full-width(
        :style="{ 'height': '40px' }"
        :color="claims ? 'primary' : 'disabled'"
        :text-color="claims ? 'white' : 'grey-7'"
        :disable="claims === 0 || claiming"
        :loading="claiming"
        rounded
        unelevated
        @click.stop="$emit('claim-all')"
      )
        | Claim All
        q-badge(rounded color="red" :label="claims" floating)
    .q-mr-sm.q-mt-xs(:class="{ 'col-12': stacked, 'col-6': !stacked }")
      q-btn.full-width(v-if="extend"
        :style="{ 'height': '40px' }"
        :color="extendable ? 'secondary' : 'disabled'"
        :text-color="extendable ? 'white' : 'grey-7'"
        :disable="!extendable"
        rounded
        unelevated
        @click.stop="$emit('extend')"
      ) {{ extendLabel }}
</template>
