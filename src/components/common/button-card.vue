<script lang="ts">
import { dateToStringShort } from '~/utils/TimeUtils'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'button-card',

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
    formatDate(date) {
      return `${dateToStringShort(date)}`
    }
  }
})
</script>

<template lang="pug">
q-btn.button(
  :class="{'no-pointer-events': !clickable}"
  :color="color"
  :disable="disable"
  :flat="iconOnly"
  :outline="outline"
  :ripple="false"
  :style="{'border-radius': round ? '24px' : '4px'}"
  :text-color="text"
  @click="$emit('click')"
  no-caps
  padding="4px"
  unelevated
)
  .row(:style="{width: `${width}px`, height: `${height}px`}")
    .row.items-left.justify-between.full-width(
      :class="{'q-mt-xs': !iconOnly}"
    )
      q-avatar.q-ml-xs(
        :color="outline ? 'primary' : 'white'"
        size="35px"
      )
        q-icon(
          :color="!outline ? 'primary' : 'white'"
          :name="icon"
          size="14px"
          v-if="!hideIcon"
        )
    //- .div.q-pa-none.chip-container.q-px-xs
    //- chips.nudge-right(v-if="chip && chip.label" :tags="[ chip ]")
    .row.q-mx-sm.q-my-xxs.text-left(v-if="from || end")
      //- .h-h7-regular(:class="outline ? 'text-primary' : 'text-white'" :style="{ width: `${width - 16}px`}") From
      .h-h6.q-mb-xxs(
        :class="outline ? 'text-primary' : 'text-white'"
        :style="{width: `${width - 16}px`}"
        v-if="from"
      ) {{formatDate(from)}}
      .h-h7-regular(
        :class="outline ? 'text-primary' : 'text-white'"
        :style="{width: `${width - 16}px`}"
        v-if="from || end"
      ) Until
      .h-h6.q-py-xxs(
        :class="outline ? 'text-primary' : 'text-white'"
        :style="{width: `${width - 16}px`}"
        v-if="end"
      ) {{formatDate(end)}}
    .row.q-mx-sm.q-my-xxs.text-left(v-else-if="title || subtitle")
      .h-h5-regular.q-mb-xxs(
        :class="outline ? 'text-primary' : 'text-white'"
        :style="{width: `${width - 16}px`}"
      ) {{title}}
      .h-h5.q-py-xxs(
        :class="outline ? 'text-primary' : 'text-white'"
        :style="{width: `${width - 16}px`}"
      ) {{subtitle}}
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
