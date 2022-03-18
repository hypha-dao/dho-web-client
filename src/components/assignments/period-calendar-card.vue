<script>
import { colors } from 'quasar'
const { getPaletteColor } = colors

export default {
  name: 'period-calendar-card',
  components: {
    ButtonCard: () => import('../common/button-card.vue')
  },

  props: {
    title: String,
    start: Date,
    end: Date,
    claimed: Boolean,
    selected: Boolean,
    outline: Boolean,
    clickable: Boolean,
    mini: Boolean,
    moon: Boolean,
    index: Number,
    /**
     * The current date, only needs to provided for testing purposes
     */
    now: {
      type: Date,
      default: () => new Date()
    }
  },

  computed: {
    backgroundColor () {
      if (this.claimed) return 'positive'
      if (this.end < this.now && !this.calimed) return 'primary'
      return 'internal-bg'
    },
    textColor () {
      return getPaletteColor(this.backgroundColor === 'internal-bg' ? 'primary' : 'white')
    },

    icon () {
      /* eslint-disable no-multi-spaces */
      switch (this.title) {
        case 'First Quarter': return 'fas fa-adjust'
        case 'Full Moon':     return 'fas fa-circle'
        case 'Last Quarter':  return 'fas fa-adjust fa-rotate-180'
        case 'New Moon':      return 'far fa-circle'
        default:              return '' + (this.index + 1)
      }
      /* eslint-enable no-multi-spaces */
    },

    claimedStr () {
      if (this.start > this.now) return undefined
      return this.claimed ? 'Claimed' : this.end < this.now ? 'To claim' : 'Ongoing'
    },

    dateString () {
      if (!this.start || !this.end) {
        return ''
      }

      const options = { month: 'short', day: 'numeric' }
      return `${this.start.toLocaleDateString('en-US', options)} - ${this.end.toLocaleDateString('en-US', options)}`
    },

    miniText () {
      return `${this.title}<br />${this.dateString}${this.chip ? '<br />' + this.chip.label : ''}`
    }
  }
}
</script>

<template lang="pug">
.period-card.q-ml-none.q-mr-xxs
  q-btn.q-ma-none(
    v-if="mini"
    :color="backgroundColor"
    flat
    :round="moon"
    :icon="icon"
    :icon-only="moon"
    :hide-icon="!moon"
    clickable
    size="xs"
  )
    q-tooltip(
      anchor="top middle"
      self="bottom middle"
      :content-style="{ 'font-size': '1em', width: '142px' }"
    )
      div(v-html="miniText")
  q-btn(
    v-else
    :class="{ 'no-pointer-events': !clickable }"
    :color="backgroundColor"
    :text-color="textColor"
    :outline="end > now"
    :disable="start > now"
    unelevated
    no-caps
    @click="clickable && $emit('click')"
  ).expanded-card
    .column.full-height.flex.justify-between.q-py-xs
      q-icon(:name="icon" size="28px" :style="{ 'color': textColor }")
      .text-bold.text-no-wrap.text-ellipsis.q-mt-xs.h-h5.q-pa-none.text-left(:style="{ 'color': textColor }") {{ claimedStr }}
      .text-caption.text-no-wrap.h-b2.q-mt-sm(:style="{ 'color': textColor }") {{ dateString }}
</template>

<style lang="stylus" scoped>
.expanded-card
  width: 138px
  height: 138px
  border-radius 22px !important
</style>
