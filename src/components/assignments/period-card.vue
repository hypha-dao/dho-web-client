<script>
import { dateToStringShort } from '~/utils/TimeUtils'

export default {
  name: 'period-card',
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
    color () {
      if (this.selected) return 'primary'
      if (this.end < this.now) return 'internal-bg'
      if (this.start > this.now) {
        return this.mini ? 'disabled' : 'grey-8'
      }
      return this.mini ? 'grey-7' : 'primary'
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

    chip () {
      // Future
      if (this.start > this.now) {
        return undefined
      }

      // Past
      if (this.end < this.now) {
        if (this.claimed) {
          return {
            label: 'Claimed',
            color: 'positive',
            text: 'white',
            icon: {
              name: 'fas fa-check'
            }
          }
        } else {
          return {
            label: 'To Claim',
            color: 'primary',
            text: 'white'
          }
        }
      }

      // Current Period
      return {
        label: 'Ongoing',
        color: 'primary',
        // text: 'primary',
        outline: true
      }
    },

    dateString () {
      if (!this.start || !this.end) {
        return ''
      }

      return `${dateToStringShort(this.start, false)} - ${dateToStringShort(this.end, false)}`
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
    :color="end < now ? chip.color : color"
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
  button-card(
    v-else-if="clickable"
    :color="color"
    :text="end < now ? 'grey-7' : undefined"
    round
    :from="start"
    :end="end"
    :outline="!selected || outline"
    :title="title"
    :subtitle="dateString"
    :icon="icon"
    :chip="chip"
    @click="$emit('click')"
    :selected="selected"
  )
  button-card(
    v-else
    :color="color"
    :text="end < now ? 'grey-7' : ''"
    round
    :outline="end > now"
    :disable="start > now"
    :title="title"
    :subtitle="dateString"
    :icon="icon"
    :chip="chip"
    :clickable="false"
  )
</template>
