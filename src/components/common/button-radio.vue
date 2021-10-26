<script>
/**
 * A clickable, selectable radio button widget that is used for selecting
 * between multiple options.
 */
export default {
  name: 'button-radio',

  props: {
    /**
     * Whether this radio is selected
     */
    selected: Boolean,
    /**
     * Whether this radio is disabled (and therefore not clickable)
     */
    disable: Boolean,
    /**
     * The title string to display
     */
    title: String,
    /**
     * The subtitle string to display
     * Shown in italics below title
     */
    subtitle: String,
    /**
     * The description text to display below title
     */
    description: String,
    /**
     * The icon to show in a circle above title
     * Optional
     */
    icon: String,
    /**
     * Text shown in the icon circle
     * Should only be used if icon is not provided
     */
    iconText: String,
    /**
     * Whether the description text is markdown
     * Otherwise, it is assumed to be a plain string
     */
    markdown: Boolean,
    /**
     * The height of the radio
     * [TODO] The description is truncated after height limit reached
     */
    height: {
      type: Number,
      default: 240
    }
  }
}
</script>

<template lang="pug">
q-btn.button.full-width(
  :style="{ 'border-radius': '24px' }"
  :color="selected ? 'primary' : 'grey-4'"
  :disable="disable"
  unelevated
  no-caps
  padding="4px"
  :ripple="false"
  @click="$emit('click')"
)
  .q-px-lg.q-py-md(:class="{ 'text-primary': !selected }")
    .row.full-width.justify-between.q-mt-sm
      q-btn(
        round
        unelevated
        :icon="icon"
        :color="selected ? 'white' : 'primary'"
        :text-color="selected ? 'primary' : 'white'"
        size="sm"
        :ripple="false"
      )
        .text-subtitle2 {{ iconText }}
      q-icon(v-if="selected" name="fas fa-check")
    .row.full-width.q-mt-sm.text-left
      .text-h6.text-bold {{ title || subtitle }}
      .text-subtitle1.text-italic(v-if="title && subtitle !== title") {{ subtitle }}
    .row.full-width.q-mt-sm.text-left
      .text-ellipsis(:class="{'text-grey-7': !selected, 'text-grey-5': selected}") {{ description }}
</template>

<style lang="stylus" scoped>
.button
  border-radius 24px

  .text-ellipsis
    overflow hidden
    text-overflow: ellipsis
</style>
