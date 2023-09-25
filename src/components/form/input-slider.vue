<script>
import map from '~/utils/map'

const LOCAL_MIN = 0
const LOCAL_MAX = 100

export default {
  name: 'input-slider',

  data () {
    return {
      LOCAL_MIN,
      LOCAL_MAX,

      bubbleXPos: 0
    }
  },

  props: {
    disable: Boolean,
    max: Number,
    min: Number,
    step: Number,
    value: Number,
    maxLabel: String,
    minLabel: String
  },

  computed: {
    _value () { return map(this.value, this.min, this.max, LOCAL_MIN, LOCAL_MAX) }
  },

  methods: {
    onChange (value) {
      this.bubbleXPos = value
      this.$emit('input', Math.floor(map(value, LOCAL_MIN, LOCAL_MAX, this.min, this.max)))
    },

    map
  },

  created () {
    this.bubbleXPos = this._value
  }

}
</script>

<template lang="pug">
div.relative-position
  div.absolute(:style="{ 'top':'-50%', 'left': `calc(${bubbleXPos}% - 14px)` }")
    svg(width='29' height='34' viewbox='0 0 29 34' fill='none' xmlns='http://www.w3.org/2000/svg')
      path(fill-rule='evenodd' clip-rule='evenodd' d='M14.332 34L4.43254 24.0416C-1.0348 18.5418 -1.0348 9.62475 4.43254 4.12489C9.89988 -1.37496 18.7642 -1.37496 24.2315 4.12489C29.6989 9.62475 29.6989 18.5418 24.2315 24.0416L14.332 34Z' fill='#223269')
      text(fill='white' xml:space='preserve' style='white-space: pre' font-family='Source Sans Pro' font-size='10' font-weight='600' letter-spacing='0px')
        tspan(x="50%" y="50%" dominant-baseline="middle" text-anchor="middle") {{ parseFloat(1).toFixed(value).replace(1,'') }}

  q-slider.q-mt-xxxl(
    :disable="disable"
    :max="LOCAL_MAX"
    :min="LOCAL_MIN"
    :step="step"
    :value="_value"
    @input="onChange"
    color="primary"
    ref="input"
  )
  .row.justify-between(v-if="minLabel && maxLabel")
    label(v-if="minLabel").text-weight-500.text-sm {{ minLabel }}
    label(v-if="maxLabel").text-weight-500.text-sm {{ maxLabel }}

</template>

<style lang="stylus" scoped>
</style>
