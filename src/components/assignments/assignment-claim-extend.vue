<script>
export default {
  name: 'assignment-claim-extend',

  props: {
    claims: {
      type: Number,
      default: 0
    },
    claiming: Boolean,
    extend: {
      type: Object,
      default: () => {
        return {
          start: null,
          end: null
        }
      }
    },
    stacked: Boolean,
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
        return `Extend after ${this.extend.start.toLocaleDateString(undefined, options)}`

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
        return `Extend before ${this.extend.end.toLocaleDateString(undefined, options)}`
      }

      return 'You must re-apply'
    }
  }
}
</script>

<template lang="pug">
div
  .row.q-pb-md
    .q-pa-xs(:class="{ 'col-12': stacked, 'col-6': !stacked }")
      q-btn.full-width(
        :color="claims ? 'primary' : 'grey-4'"
        :text-color="claims ? 'white' : 'grey-7'"
        :disable="claims === 0 || claiming"
        :loading="claiming"
        rounded
        unelevated
        @click.stop="$emit('claim-all')"
      )
        .row.full-width.justify-between.items-center
          .spacer(:style="{ width: '20px' }")
          | Claim All
          q-badge(rounded color="white" text-color="primary" :label="claims")
    .q-pa-xs(:class="{ 'col-12': stacked, 'col-6': !stacked }")
      q-btn.full-width(v-if="extend"
        :color="extendable ? 'secondary' : 'grey-4'"
        :text-color="extendable ? 'white' : 'grey-7'"
        :disable="!extendable"
        rounded
        unelevated
        @click.stop="$emit('extend')"
      ) {{ extendLabel }}
</template>
