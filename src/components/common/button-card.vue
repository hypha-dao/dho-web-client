<script>
export default {
  name: 'button-card',
  components: {
    Chips: () => import('./chips.vue')
  },

  props: {
    color: {
      type: String,
      default: 'accent'
    },
    text: {
      type: String
    },
    clickable: {
      type: Boolean,
      default: true
    },
    disable: Boolean,
    round: Boolean,
    outline: Boolean,
    title: String,
    from: Date,
    end: Date,
    subtitle: String,
    icon: String,
    iconOnly: Boolean,
    selected: Boolean,
    hideIcon: Boolean,
    chip: {
      type: Object,
      default: () => {
        return {
          label: null,
          color: 'white',
          text: 'accent'
        }
      }
    },
    height: {
      type: Number,
      default: 170
    },
    width: {
      type: Number,
      default: 130
    }
  },
  methods: {
    formatDate (date) {
      const dateOpts = { year: 'numeric', month: 'short', day: 'numeric' }

      return `${date.toLocaleDateString(undefined, dateOpts)}`
    }
  }
}
</script>

<template lang="pug">
q-btn.button(
  :class="{ 'no-pointer-events': !clickable }"
  :style="{ 'border-radius': round ? '24px' : '4px' }"
  :color="color"
  :text-color="text"
  :outline="outline"
  :disable="disable"
  :flat="iconOnly"
  unelevated
  no-caps
  padding="4px"
  :ripple="false"
  @click="$emit('click')"
)
  .row(:style="{ width: `${width}px`, height: `${height}px` }")
    .row.items-left.justify-between.full-width(:class="{ 'q-mt-xs': !iconOnly }")
      q-avatar.q-ml-xs(:color="outline ? 'primary' : 'white'" size="35px")
        q-icon(v-if="!hideIcon" :name="icon" size="14px" :color="!outline ? 'primary' : 'white'")
    //- .div.q-pa-none.chip-container.q-px-xs
    //-   chips.nudge-right(v-if="chip && chip.label" :tags="[ chip ]")
    .row.q-mx-sm.q-my-xxs.text-left(v-if="from && end")
      .h-h7-regular(:class="outline ? 'text-primary' : 'text-white'" :style="{ width: `${width - 16}px`}") From
      .h-h6.q-mb-xxs(:class="outline ? 'text-primary' : 'text-white'" :style="{ width: `${width - 16}px`}") {{ formatDate(from) }}
      .h-h7-regular(:class="outline ? 'text-primary' : 'text-white'" :style="{ width: `${width - 16}px`}") To
      .h-h6.q-py-xxs(:class="outline ? 'text-primary' : 'text-white'" :style="{ width: `${width - 16}px`}") {{ formatDate(end) }}
    .row.q-mx-sm.q-my-xxs.text-left(v-else-if="title || subtitle")
      .h-h5-regular.q-mb-xxs(:class="outline ? 'text-primary' : 'text-white'" :style="{ width: `${width - 16}px`}") {{ title }}
      .h-h5.q-py-xxs(:class="outline ? 'text-primary' : 'text-white'" :style="{ width: `${width - 16}px`}") {{ subtitle }}
  slot
</template>

<style lang="stylus" scoped>
.chip-container
  min-height: 30px
  height: 30px
  width:100%
.button
  border-radius 24px

  .nudge-right
    margin-right -6px

  .text-ellipsis
    overflow hidden
    text-overflow: ellipsis
</style>
