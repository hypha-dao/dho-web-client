<script>
import { dateToStringShort } from '~/utils/TimeUtils.js'

/**
 * A pair of buttons for claiming and extending an assignment
 * that appears only on a user's own assignments
 */
export default {
  name: 'assignment-claim-extend',

  props: {
    state: String,
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
    },
    notClaim: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    extendable () {
      return this.extend && this.extend.start < this.now && this.extend.end > this.now && this.state !== 'withdrawed' && this.state !== 'suspended'
    },

    extendLabel () {
      if (this.extend.start && this.extend.start > this.now) {
        return `Extend after ${dateToStringShort(this.extend.start, false)}`
      }

      if (this.extend.end && this.extend.end > this.now) {
        return `Extend before ${dateToStringShort(this.extend.end, false)}`
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
        :disable="claims === 0 || claiming || notClaim"
        :loading="claiming"
        rounded
        unelevated
        @click.stop="$emit('claim-all')"
      )
        | Claim All
        q-badge(v-if="claims > 0" rounded color="red" :label="claims" floating)
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
