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
    clickable: {
      type: Boolean,
      default: true
    },
    disable: Boolean,
    outline: Boolean,
    title: String,
    subtitle: String,
    icon: String,
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
  :color="color"
  :outline="outline"
  :disable="disable"
  no-caps
  padding="xs"
  @click="$emit('click')"
)
  .column.justify-between(:style="{ width, height }")
    .row.q-ma-sm.items-center.justify-between(:style="{ height: '36px'}")
      q-icon(:name="icon" size="xs")
      chips(v-if="chip && chip.label" :tags="[ chip ]")
    .row.q-ma-sm
      .text-bold {{ title }}
      .text-caption {{ subtitle }}
</template>

<style lang="stylus" scoped>
.button
  border-radius 24px
</style>
