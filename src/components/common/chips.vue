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
      /**
       * Tags objects have the following structure
       * {
       *   label: String
       *   color: String
       *   text: String      // Text color
       *   icon: {
       *     name: String
       *     color: String
       *   }
       *   outline: Boolean
       * }
       */
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
      :color="tag.color"
      :text-color="tag.text ? tag.text : 'white'"
      size="0.9em"
      @remove="$emit('clear-tag', tag)"
    )
      q-avatar(v-if="tag.icon" :icon="tag.icon.name" :text-color="tag.icon.color" size="1em")
      div(:class="{ 'q-pr-xs': removable }") {{ tag.label }}
      q-tooltip(v-if="tag.tooltip"
        anchor="top middle"
        self="bottom middle"
        :content-style="{ 'font-size': '1em' }"
      ) {{ tag.tooltip }}
</template>
