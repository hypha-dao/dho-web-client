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
    subtitle: String,
    icon: String,
    iconOnly: Boolean,
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
      default: 120
    },
    width: {
      type: Number,
      default: 120
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
  @click="$emit('click')"
)
  .column.justify-between(:style="{ width: `${width}px`, height: `${height}px` }")
    .row.items-center.justify-between(:class="{ 'q-ma-sm': !iconOnly }" :style="{ height: '36px' }")
      q-icon(v-if="!hideIcon" :name="icon" size="xs")
      chips.nudge-right(v-if="chip && chip.label" :tags="[ chip ]")
    .column.q-ma-sm.text-left(v-if="title || subtitle")
      .text-bold.text-no-wrap.text-ellipsis(:style="{ width: `${width - 16}px` }") {{ title }}
      .text-caption.text-no-wrap(:style="{ width: `${width - 16}px` }") {{ subtitle }}
  slot
</template>

<style lang="stylus" scoped>
.button
  border-radius 24px

  .nudge-right
    margin-right -6px

  .text-ellipsis
    overflow hidden
    text-overflow: ellipsis
</style>
