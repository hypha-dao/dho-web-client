<script>
/**
 * Editable controls for a widget
 */
export default {
  name: 'edit-controls',
  props: {
    /**
     * If true, the save button will be enabled
     */
    savable: Boolean
  },
  data () {
    return {
      editing: false
    }
  },
  computed: {

  },
  methods: {
    onEdit () {
      this.editing = true
      this.$emit('onEdit')
    },
    onCancel () {
      this.editing = false
      this.$emit('onCancel')
    },
    onSave () {
      this.editing = false
      this.$emit('onSave')
    }
  }
}
</script>

<template lang="pug">
.row
  .col(v-if="!editing")
    q-btn(
      flat round size="sm"
      icon="fas fa-pen"
      color="primary"
      @click="onEdit")
      q-tooltip Edit
  .col(v-if="editing")
    q-btn(
      flat round size="sm"
      icon="fas fa-times"
      color="black"
      @click="onCancel")
      q-tooltip Cancel
  .col(v-if="editing")
    q-btn(
      flat round size="sm"
      icon="fas fa-check"
      color="green",
      :disable= "!savable"
      @click="onSave")
      q-tooltip(v-if="savable") Save
</template>

<style lang="stylus" scoped>

</style>
