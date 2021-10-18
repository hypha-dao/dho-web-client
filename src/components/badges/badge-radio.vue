<script>
/**
 * A selectable 'radio button' which shows the title, icon and description of a badge.
 */
export default {
  name: 'badge-radio',
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue')
  },

  props: {
    /**
     * Badge object from backend
     */
    badge: Object,
    /**
     * Whether this radio has been selected
     */
    selected: Boolean
  },

  methods: {
    description (badge) {
      return badge.details_description_s
    },

    title (badge) {
      return badge.details_title_s
    }
  }
}
</script>

<template lang="pug">
.badge-radio
  button-radio(
    :title="title(badge)"
    :description="description(badge)"
    :selected="selected"
    @click="$emit('click')"
  )
</template>
