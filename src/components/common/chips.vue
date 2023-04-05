<script lang="ts">
import { defineComponent } from 'vue'
import { PropType } from 'vue/types/v3-component-props'

type Tag = {
  label: string
  color: string,
  text: string,
    icon: {
      name: string,
      color: string,
  },
  outline: boolean,
  dense: boolean,
  tooltip: string
}

/**
 * Shows a set of chips with the provided labels and colors
 */
export default defineComponent({
  name: 'chips',
  props: {
    /**
     * An array of the tags to render.
     * Each tag should have at minimum a label property.
     * Also supports a color string property (Quasar color).
     */
    tags: {
      type: Array as PropType<Tag[]>,
      default: () => []
    },
    /**
     * Whether the tags are clickable.
     * When clicked, a 'click-tag' event is emitted.
     */
    clickable: Boolean,
    /**
     * Whether the tags have a close button.
     * When clicked, a 'clear-tag' event is emitted but the
     * parent must handling removing the tag from the DOM.
     */
    removable: Boolean,

    chipSize: {
      type: String,
      default: '0.9em'
    }
  }
})
</script>

<template lang="pug">
.row
  template(v-for="tag in tags")
    q-chip.q-ml-none(
      :removable="removable",
      :outline="!!tag.outline",
      :color="tag.color",
      :text-color="tag.text ? tag.text : 'white'",
      :size="chipSize",
      :clickable="clickable",
      :ripple="false",
      :dense="tag.dense",
      @click="$emit('click-tag', tag)",
      @remove="$emit('clear-tag', tag)"
    )
      q-avatar(
        v-if="tag.icon",
        :icon="tag.icon.name",
        :text-color="tag.icon.color",
        size="1em"
      )
      div(:class="{ 'q-pr-xs': removable }").h-tag.tag {{ tag.label }}
      q-tooltip(
        v-if="tag.tooltip",
        anchor="top middle",
        self="bottom middle",
        :content-style="{ 'font-size': '1em' }"
      ) {{ tag.tooltip }}
</template>

<style scoped lang="stylus">
.tag
  font-size 9px !important
  padding 0
  margin 0
</style>
