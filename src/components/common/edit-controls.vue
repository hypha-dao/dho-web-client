<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Editable controls for a widget
 */
export default defineComponent({
  name: 'edit-controls',
  props: {
    /**
     * If true, the save button will be enabled
     */
    savable: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      editing: false
    }
  },
  computed: {},
  methods: {
    onEdit() {
      this.editing = true
      this.$emit('onEdit')
    },
    onCancel() {
      this.editing = false
      this.$emit('onCancel')
    },
    onSave() {
      this.editing = false
      this.$emit('onSave')
    }
  }
})
</script>

<template lang="pug">
.row
  .col(v-if="!editing")
    q-btn(
      @click="onEdit"
      color="primary"
      flat
      icon="fas fa-pen"
      round
      size="sm"
    )
      q-tooltip Edit
  .col(v-if="editing")
    q-btn(
      @click="onCancel"
      color="black"
      flat
      icon="fas fa-times"
      round
      size="sm"
    )
      q-tooltip Cancel
  .col(v-if="editing")
    q-btn(
      :disable="!savable"
      @click="onSave"
      color="green"
      flat
      icon="fas fa-check"
      round
      size="sm"
    )
      q-tooltip(v-if="savable") Save
</template>

<style lang="stylus" scoped></style>
