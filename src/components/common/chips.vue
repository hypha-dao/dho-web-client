<script>
/**
 * Shows a set of chips with the provided labels and colors
 */
export default {
  name: 'chips',
  props: {
    /**
     * An array of the tags to render.
     * Each tag should have at minimum a label property.
     * Also supports a color string property (Quasar color).
     */
    tags: {
      type: Array,
      default: () => []
    },
    /**
     * Whether the tags have a close button.
     * When clicked, a 'clear-tag' event is emitted but the
     * parent must handling removing the tag from the DOM.
     */
    removable: Boolean
  }
}
</script>

<template lang="pug">
.row
  template(v-for="tag in tags")
    q-chip(
      :removable="removable"
      :outline="!!tag.outline"
      :icon="tag.icon"
      :color="tag.color"
      :text-color="tag.text ? tag.text : 'white'"
      @remove="$emit('clear-tag', tag)"
    )
      q-avatar(v-if="tag.icon" :icon="tag.icon.name" :text-color="tag.icon.color" size="1em")
      div(:class="{ 'q-pr-xs': removable }") {{ tag.label }}
</template>
