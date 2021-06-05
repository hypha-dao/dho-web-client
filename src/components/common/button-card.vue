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
      default: function () {
        return {
          label: null,
          color: 'white',
          text: 'accent'
        }
      }
    },
    height: {
      type: String,
      default: '130px'
    },
    width: {
      type: String,
      default: '130px'
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
  padding="xs"
  @click="$emit('click')"
)
  .column.justify-between(:style="{ width, height }")
    .row.items-center.justify-between(:class="{ 'q-ma-sm': !iconOnly }" :style="{ height: '36px' }")
      q-icon(v-if="!hideIcon" :name="icon" size="xs")
      chips.nudge-right(v-if="chip && chip.label" :tags="[ chip ]")
    .row.q-ma-sm(v-if="title || subtitle")
      .text-bold {{ title }}
      .text-caption {{ subtitle }}
  slot
</template>

<style lang="stylus" scoped>
.button
  border-radius 24px

  .nudge-right
    margin-right -4px
</style>
