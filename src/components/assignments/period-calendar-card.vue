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
      return 'grey-4'
    },
    textColor () {
      return getPaletteColor(this.backgroundColor === 'grey-4' ? 'primary' : 'white')
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
.period-card
  button-card(
    v-if="mini"
    :color="backgroundColor"
    flat
    :round="moon"
    :icon="icon"
    :icon-only="moon"
    :hide-icon="!moon"
    clickable
    :width="16"
    :height="16"
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
    :style="{ 'border-radius': round ? '24px' : '4px' }"
    :color="backgroundColor"
    :text-color="textColor"
    :outline="end > now"
    :disable="start > now"
    unelevated
    no-caps
    @click="clickable && $emit('click')"
  ).expanded-card
    .column.full-height.flex.justify-between.q-py-md
      q-icon(:name="icon" size="28px" :style="{ 'color': textColor }")
      .text-bold.text-no-wrap.text-ellipsis.q-mt-sm.h5(:style="{ 'color': textColor }") {{ claimedStr }}
      .text-caption.text-no-wrap.b2.q-mt-md(:style="{ 'color': textColor }") {{ dateString }}
</template>

<style lang="stylus" scoped>
.expanded-card
  width: 138px
  height: 138px
  border-radius 22px !important
</style>
