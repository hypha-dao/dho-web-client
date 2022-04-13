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
     * Whether the icon and title are in the same row
     */
    horizontal: Boolean,
    dense: Boolean,
    hideIcon: Boolean,
    opacity: Boolean,
    primary: Boolean,
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
q-btn.full-width(
  :style="{ 'border-radius': '24px' }"
  :color="selected ? 'primary' : 'internal-bg'"
  :disable="disable"
  :class="{ 'grey-opacity': opacity }"
  unelevated
  no-caps
  padding="0"
  :ripple="false"
  @click="$emit('click')"
)
    .q-px-lg.q-py-md.full-width.full-height(:class="{ 'text-primary': !selected }")
      .row.full-width.justify-between(v-if="!horizontal && !hideIcon")
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
      .row.q-mt-sm.text-left
        .col-4(:class="{'col-12': !horizontal}")
          .row.items-center.justify-start
            q-btn.on-left(
              v-if="horizontal && !hideIcon"
              round
              unelevated
              :icon="icon"
              :color="selected ? 'white' : 'primary'"
              :text-color="selected ? 'primary' : 'white'"
              size="sm"
              :ripple="false"
            )
              .text-subtitle2 {{ iconText }}
            .h-h5(:class="{ 'text-body2': dense, 'text-primary': primary, 'text-white': selected }") {{ title || subtitle }}
            .h-h5-regular.text-weight-thin.q-ml-xs(v-if="title && subtitle !== title" :class="{ 'text-body2': dense, 'text-primary': primary }") {{ subtitle }}
        .col-4(v-if="horizontal")
          .text-ellipsis.q-ml-md.font-sans.text-weight-500(:class="{'text-grey-7': !selected && !primary, 'text-grey-5': selected, 'text-primary': primary}") {{ description }}
        .col-4(v-if="horizontal")
          slot
      .row.q-mt-md.text-left(v-if="!horizontal")
        .text-ellipsis.text-xs(:class="{'text-grey-7': !selected && !primary, 'text-grey-5': selected, 'text-primary': primary}") {{ description }}
      //- .row.q-mt-sm(v-if="!horizontal")
      //-   slot
</template>

<style lang="stylus" scoped>
.text-ellipsis
  overflow hidden
  text-overflow: ellipsis
  line-height: 26px
  color: #84878e
.grey-opacity
  background-color: rgba(#F1F1F3, .75) !important
</style>
