<script>
import KeyValueDisplay from '../../pages/raw-data/components/key-value-display'

export default {
  name: 'raw-display-icon',
  props: {
    object: { type: Object },
    scope: { type: String },
    id: { type: Number }
  },
  components: { KeyValueDisplay },
  data () {
    return {
      show: false
    }
  }
}
</script>

<template lang="pug">
.raw-display-icon
  q-btn(
    icon="fas fa-cog"
    @click="show = true"
    flat
  )
  q-dialog(
    v-model="show"
    full-height
    full-width
  )
    key-value-display(
      v-if="object"
      :object="object"
      :scope="scope"
      :id="id"
    )
</template>

<style lang="sass" scoped>
.raw-display-icon
  position: absolute
  right: 0
  top: 0
</style>
