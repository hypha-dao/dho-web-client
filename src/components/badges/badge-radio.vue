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
    },
    icon (badge) {
      let type = null
      let name = null
      if (badge.icon) {
        const split = badge.icon.split(':')
        type = split[0]
        name = split[1]
      }
      return {
        type,
        name
      }
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
    :icon="(icon.type === 'icon') ? icon.name : null"
  )
</template>
