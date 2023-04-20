<script lang="ts">
import { defineComponent } from 'vue'

/**
 * A clickable, selectable radio button widget that is used for selecting
 * between multiple options.
 */
export default defineComponent({
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
    },
    minHeight: Boolean
  }
})
</script>

<template lang="pug">
q-btn.full-width.relative-position(
  :class="{'grey-opacity': opacity}"
  :color="selected ? 'primary' : 'internal-bg'"
  :disable="disable"
  :ripple="false"
  :style="{'border-radius': '24px'}"
  @click="$emit('click')"
  no-caps
  padding="0"
  unelevated
)
  .q-pa-md.full-width.full-height(:class="{'text-body': !selected}")
    .row.q-mb-md.full-width.justify-between(v-if="!horizontal && icon")
      q-btn(
        :color="selected ? 'white' : 'primary'"
        :icon="icon"
        :ripple="false"
        :text-color="selected ? 'primary' : 'white'"
        round
        size="sm"
        unelevated
      )
        .text-subtitle2 {{iconText}}
      q-icon(
        name="fas fa-check"
        v-if="selected"
      )
    .row.text-left
      .col-4(:class="{'col-12': !horizontal}")
        .row.items-center.justify-start
          q-btn.on-left(
            :color="selected ? 'white' : 'primary'"
            :icon="icon"
            :ripple="false"
            :text-color="selected ? 'primary' : 'white'"
            round
            size="sm"
            unelevated
            v-if="horizontal && icon"
          )
            .text-subtitle2 {{iconText}}
          .row.full-width.justify-between.items-center
            .row.items-center
              q-avatar.q-mr-xs(
                :color="selected ? 'white' : 'none'"
                :style="{border: '1px solid'}"
                size="sm"
                text-color="primary"
                v-if="!icon"
              )
                q-icon(
                  color="primary"
                  name="fas fa-check"
                  size="12px"
                  v-if="selected"
                )
              .col
                .h-h5(
                  :class="{'text-body2': dense, 'text-primary': primary, 'text-white': selected}"
                ) {{title || subtitle}}
            .h-h5-regular.text-weight-thin.q-ml-xs(
              :class="{'text-body2': dense, 'text-primary': primary, 'text-white': selected}"
              v-if="title && subtitle !== title"
            )
              span {{subtitle}}
              slot(name="subtitle")
      .col-4(v-if="horizontal")
        .text-ellipsis.q-ml-md.font-sans.text-weight-500(
          :class="{'text-grey-7': !selected && !primary, 'text-grey-5': selected, 'text-primary': primary}"
        ) {{description}}
        slot(name="description")
    .row.q-mt-md.text-left(v-if="!horizontal")
      .text-ellipsis.text-xs(
        :class="{'text-grey-7': !selected && !primary, 'text-grey-5': selected, 'text-primary': primary}"
        v-if="description"
      ) {{description}}
      slot(name="description")
    slot
</template>

<style lang="stylus" scoped>
.text-ellipsis
  overflow hidden
  text-overflow: ellipsis
  line-height: 26px
  color: #84878e
.grey-opacity
  background-color: rgba(#F1F1F3, .75) !important
.min-height
  min-height: 286px
</style>
